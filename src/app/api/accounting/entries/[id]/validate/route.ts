import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

/**
 * POST /api/accounting/entries/[id]/validate
 * Validates a journal entry (irreversible). Requires 'validate' level on accounting_entries.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "accounting_entries", "validate");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const entry = await prisma.journalEntry.findFirst({
      where: { id, company_id: user.company_id },
      include: { lines: true },
    });

    if (!entry) return errorResponse("Écriture introuvable", 404);

    if (entry.status === "validated") {
      return errorResponse("Cette écriture est déjà validée", 400);
    }

    const updated = await prisma.journalEntry.update({
      where: { id },
      data: { status: "validated" },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "VALIDATE",
      entity: "JournalEntry",
      entity_id: id,
      details: {
        reference: entry.reference,
        status: "validated",
      },
    });

    return successJson(updated, "Écriture validée définitivement");
  } catch (err) {
    return handlePrismaError(err);
  }
}
