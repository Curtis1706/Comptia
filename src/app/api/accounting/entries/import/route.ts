import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

/**
 * POST /api/accounting/entries/import
 * Expects an array of entries with lines. Requires 'write' on accounting_entries.
 */
export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "accounting_entries", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { entries } = await req.json();

    if (!entries || !Array.isArray(entries)) {
      return errorResponse("Format invalide", 400);
    }

    const results = await prisma.$transaction(async (tx) => {
      const createdEntries = [];

      for (const data of entries) {
        if (!data.lines || !Array.isArray(data.lines) || data.lines.length === 0) continue;

        // Balance check and auto-balancing with account 471 (Compte d'attente SYSCOHADA)
        const totalDebit = data.lines.reduce((s: number, l: any) => s + Number(l.debit || 0), 0);
        const totalCredit = data.lines.reduce((s: number, l: any) => s + Number(l.credit || 0), 0);
        const diff = Math.round((totalDebit - totalCredit) * 100) / 100;

        if (Math.abs(diff) >= 0.01) {
          if (diff > 0) {
            // Debit > Credit -> add Credit on 471
            data.lines.push({
              account_code: "471",
              debit: 0,
              credit: diff,
              description: "Équilibrage import - Compte d'attente (471)",
            });
          } else {
            // Credit > Debit -> add Debit on 471
            data.lines.push({
              account_code: "471",
              debit: Math.abs(diff),
              credit: 0,
              description: "Équilibrage import - Compte d'attente (471)",
            });
          }
        }

        // Ensure all target accounts exist in the tenant's chart of accounts
        for (const line of data.lines) {
          const code = String(line.account_code || "471").trim();
          await tx.account.upsert({
            where: {
              code_company_id: {
                code,
                company_id: user.company_id,
              },
            },
            update: {},
            create: {
              code,
              name:
                code === "471"
                  ? "Comptes d'attente à régulariser"
                  : code === "521"
                    ? "Banques locales"
                    : `Compte ${code}`,
              type:
                code.startsWith("4") || code.startsWith("1")
                  ? "liability"
                  : code.startsWith("6")
                    ? "expense"
                    : code.startsWith("7")
                      ? "revenue"
                      : "asset",
              company_id: user.company_id,
              is_postable: true,
            },
          });
        }

        // Reference generation
        const year = new Date(data.date).getFullYear() || new Date().getFullYear();
        const journal = data.journal || "bank";
        const count = await tx.journalEntry.count({
          where: {
            company_id: user.company_id,
            journal,
            date: {
              gte: new Date(`${year}-01-01`),
              lte: new Date(`${year}-12-31`),
            },
          },
        });
        const reference = `${journal.toUpperCase()}-IMP-${year}-${String(count + 1).padStart(5, "0")}`;

        const entry = await tx.journalEntry.create({
          data: {
            date: new Date(data.date),
            reference,
            description: data.description || "Import CSV",
            journal,
            status: "draft",
            company_id: user.company_id,
            created_by: user.id,
            lines: {
              create: data.lines.map((l: any) => ({
                account_code: String(l.account_code || "471").trim(),
                company_id: user.company_id,
                debit: Number(l.debit || 0),
                credit: Number(l.credit || 0),
                description: l.description || data.description,
              })),
            },
          },
        });
        createdEntries.push(entry.id);
      }
      return createdEntries;
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "JournalEntry",
      entity_id: "multiple-import",
      details: { count: results.length },
    });

    return successJson({ count: results.length }, `${results.length} écritures importées avec succès`);
  } catch (err) {
    return handlePrismaError(err);
  }
}
