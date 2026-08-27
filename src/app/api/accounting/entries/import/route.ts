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
        // Simple balance check
        const totalDebit = data.lines.reduce((s: number, l: any) => s + Number(l.debit || 0), 0);
        const totalCredit = data.lines.reduce((s: number, l: any) => s + Number(l.credit || 0), 0);

        if (Math.abs(totalDebit - totalCredit) >= 0.01) continue; // Skip unbalanced entries

        // Reference generation
        const year = new Date(data.date).getFullYear();
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
                account_code: l.account_code,
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
