import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { logAction } from "@/lib/audit";
import { toNumber } from "@/lib/accounting";

const JOURNAL_LABELS: Record<string, string> = {
  purchases: "Achats",
  sales: "Ventes",
  bank: "Banque",
  cash: "Caisse",
  payroll: "Paie",
};

/**
 * GET /api/accounting/entries/export
 * Exports all validated journal entries in FEC format. Requires 'read' on accounting_entries.
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "accounting_entries", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const date_from = searchParams.get("date_from");
    const date_to = searchParams.get("date_to");

    const entries = await prisma.journalEntry.findMany({
      where: {
        company_id: user.company_id,
        status: "validated",
        ...((date_from || date_to) && {
          date: {
            ...(date_from && { gte: new Date(date_from) }),
            ...(date_to && { lte: new Date(date_to) }),
          },
        }),
      },
      include: {
        lines: {
          include: { account: { select: { name: true } } },
        },
      },
      orderBy: [{ date: "asc" }, { reference: "asc" }],
    });

    const header =
      "JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|Montantdevise|Idevise";

    const rows: string[] = [header];

    for (const entry of entries) {
      const journalCode = entry.journal.toUpperCase().substring(0, 2);
      const journalLib = JOURNAL_LABELS[entry.journal] ?? entry.journal;
      const ecritureDate = formatFecDate(entry.date);
      const validDate = formatFecDate(entry.updated_at);

      for (const line of entry.lines) {
        const debit = toNumber(line.debit);
        const credit = toNumber(line.credit);
        const row = [
          journalCode,
          journalLib,
          entry.reference,
          ecritureDate,
          line.account_code,
          line.account?.name ?? "",
          line.third_party ?? "",
          "",
          entry.reference,
          ecritureDate,
          sanitizeFec(line.description ?? entry.description),
          formatFecAmount(debit),
          formatFecAmount(credit),
          "",
          "",
          validDate,
          "",
          "",
        ].join("|");

        rows.push(row);
      }
    }

    const csv = rows.join("\r\n");

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "EXPORT",
      entity: "JournalEntry",
      entity_id: "FEC",
      details: { entries_count: entries.length },
    });

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="FEC_${new Date().toISOString().split("T")[0]}.txt"`,
      },
    });
  } catch (err) {
    console.error("[GET /api/accounting/entries/export]", err);
    return new Response(
      JSON.stringify({ success: false, error: "Erreur lors de l'export FEC" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function formatFecDate(date: Date): string {
  return date.toISOString().split("T")[0].replace(/-/g, "");
}

function formatFecAmount(amount: number): string {
  return amount.toFixed(2).replace(".", ",");
}

function sanitizeFec(str: string): string {
  return str.replace(/\|/g, " ").replace(/[\r\n]/g, " ").trim();
}
