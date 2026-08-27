import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import {
  successJson,
  errorResponse,
  handlePrismaError,
} from "@/lib/api-response";
import { generateInvoiceReference } from "@/lib/accounting";
import { logAction } from "@/lib/audit";

/**
 * POST /api/invoices/[id]/duplicate
 * Creates a new draft invoice based on an existing one. Requires 'write' on invoices.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "invoices", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const existing = await prisma.invoice.findFirst({
      where: { id, company_id: user.company_id },
      include: { lines: true },
    });

    if (!existing) return errorResponse("Facture introuvable", 404);

    // Generate new reference
    const count = await prisma.invoice.count({
      where: { company_id: user.company_id, type: existing.type },
    });
    const prefix = existing.type === "invoice" ? "FAC" : existing.type === "quote" ? "DEV" : "AV";
    const reference = generateInvoiceReference(prefix, count + 1);

    const duplicated = await prisma.invoice.create({
      data: {
        reference,
        type: existing.type,
        client_id: existing.client_id,
        company_id: user.company_id,
        issue_date: new Date(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        subtotal_ht: existing.subtotal_ht,
        vat_amount: existing.vat_amount,
        total_ttc: existing.total_ttc,
        tax_regime: existing.tax_regime,
        status: "draft",
        notes: existing.notes,
        payment_method: existing.payment_method,
        created_by: user.id,
        lines: {
          create: existing.lines.map((l) => ({
            description: l.description,
            quantity: l.quantity,
            unit_price: l.unit_price,
            vat_rate: l.vat_rate,
            amount: l.amount,
            accounting_account: l.accounting_account,
          })),
        },
      },
      include: { lines: true },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "Invoice",
      entity_id: duplicated.id,
      details: { duplicated_from: existing.id, reference },
    });

    return successJson(duplicated, "Facture dupliquée en brouillon", 201);
  } catch (err) {
    return handlePrismaError(err);
  }
}
