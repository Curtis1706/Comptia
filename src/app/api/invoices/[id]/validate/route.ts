import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

/**
 * POST /api/invoices/[id]/validate
 * Finalizes an invoice and its associated journal entry.
 */
export const POST = withAuth(async (req, { user, params }) => {
  try {
    const { id } = params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, company_id: user.company_id },
      include: { lines: true }
    });

    if (!invoice) return errorResponse("Facture introuvable", 404);
    if (invoice.status !== "draft") return errorResponse("Cette facture est déjà validée", 422);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Invoice status
      const updated = await tx.invoice.update({
        where: { id },
        data: { status: "sent" } // Or "validated" depending on terminology
      });

      // 2. Find and update associated Journal Entry
      const entryPrefix = invoice.type === "invoice" ? "VTE" : "AVO";
      const entryRef = `${entryPrefix}-${invoice.reference}`;
      const entry = await tx.journalEntry.findFirst({
        where: { 
          company_id: user.company_id,
          reference: entryRef,
          status: "draft"
        }
      });

      if (entry) {
        await tx.journalEntry.update({
          where: { id: entry.id },
          data: { status: "validated" }
        });
      }

      await logAction({
        company_id: user.company_id,
        user_id: user.id,
        action: "UPDATE",
        resource: "Invoice",
        resource_id: id,
        new_data: { status: "sent", entry_validated: !!entry }
      });

      return updated;
    });

    return successJson(result, "Facture validée avec succès. L'écriture comptable a été figée.");
  } catch (err) {
    return handlePrismaError(err);
  }
});
