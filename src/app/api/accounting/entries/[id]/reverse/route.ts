import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

/**
 * POST /api/accounting/entries/[id]/reverse
 * Crée une écriture d'extourne (contre-passation) pour annuler comptablement une écriture.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "accounting_entries", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const entry = await prisma.journalEntry.findUnique({
      where: { id, company_id: user.company_id },
      include: {
        lines: true,
      },
    });

    if (!entry) return errorResponse("Écriture non trouvée", 404);

    // Vérifier si une extourne n'existe pas déjà
    const existingExt = await prisma.journalEntry.findFirst({
      where: {
        company_id: user.company_id,
        reference: `EXT-${entry.reference}`,
      },
    });

    if (existingExt) {
      return errorResponse("Cette écriture a déjà été extournée", 400);
    }

    const extReference = `EXT-${entry.reference}`;

    const reversedEntry = await prisma.journalEntry.create({
      data: {
        company_id: user.company_id,
        created_by: user.id,
        date: new Date(),
        reference: extReference,
        description: `Extourne : ${entry.description}`,
        journal: entry.journal,
        status: "draft",
        lines: {
          create: entry.lines.map((l) => ({
            company_id: user.company_id,
            account_code: l.account_code,
            description: `Extourne ${l.description || entry.description}`,
            debit: l.credit, // Inversion débit / crédit
            credit: l.debit,
            third_party: l.third_party,
          })),
        },
      },
      include: {
        lines: { include: { account: true } },
      },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "REVERSE",
      entity: "JournalEntry",
      entity_id: reversedEntry.id,
      details: {
        original_entry_id: entry.id,
        original_reference: entry.reference,
        reverse_reference: extReference,
      },
    });

    return successJson(reversedEntry, `Écriture extournée avec succès sous la référence ${extReference}`);
  } catch (err) {
    return handlePrismaError(err);
  }
}
