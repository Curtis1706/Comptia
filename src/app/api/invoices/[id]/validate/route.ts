import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";
import { normalizeInvoice } from "@/lib/mecef";

/**
 * POST /api/invoices/[id]/validate
 * Finalizes an invoice, its associated journal entry, and triggers e-MECeF normalization. Requires 'validate' on invoices.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "invoices", "validate");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id, company_id: user.company_id },
      include: {
        lines: true,
        client: true,
        company: true,
        created_by_user: true,
      },
    });

    if (!invoice) return errorResponse("Facture introuvable", 404);
    if (invoice.status !== "draft") return errorResponse("Cette facture est déjà validée", 422);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Invoice status
      const updated = await tx.invoice.update({
        where: { id },
        data: { status: "sent" },
      });

      // 2. Find and update associated Journal Entry
      const entryPrefix = invoice.type === "invoice" ? "VTE" : "AVO";
      const entryRef = `${entryPrefix}-${invoice.reference}`;
      const entry = await tx.journalEntry.findFirst({
        where: {
          company_id: user.company_id,
          reference: entryRef,
          status: "draft",
        },
      });

      if (entry) {
        await tx.journalEntry.update({
          where: { id: entry.id },
          data: { status: "validated" },
        });
      }

      await logAction({
        company_id: user.company_id,
        user_id: user.id,
        action: "UPDATE",
        entity: "Invoice",
        entity_id: id,
        details: { status: "sent", entry_validated: !!entry },
      });

      return updated;
    });

    // 3. Normalisation e-MECeF DGI (si devis, la DGI n'est pas appelée)
    if (invoice.type !== "quote") {
      try {
        await normalizeInvoice(invoice);
      } catch (mecefErr: any) {
        console.warn("[e-MECeF] Normalisation différée lors de la validation:", mecefErr.message);
      }
    }

    const finalInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { lines: true, client: true },
    });

    return successJson(finalInvoice, "Facture validée avec succès. L'écriture comptable a été figée.");
  } catch (err) {
    return handlePrismaError(err);
  }
}
