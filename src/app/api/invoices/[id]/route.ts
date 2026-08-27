import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import {
  successJson,
  errorResponse,
  zodErrorResponse,
  handlePrismaError,
} from "@/lib/api-response";
import { UpdateInvoiceSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";
import { toNumber } from "@/lib/accounting";

const INVOICE_INCLUDE = {
  lines: true,
  client: true,
  payments: true,
};

/** GET /api/invoices/[id] */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "invoices", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id, company_id: user.company_id },
      include: INVOICE_INCLUDE,
    });

    if (!invoice) return errorResponse("Facture introuvable", 404);

    return successJson(serializeInvoice(invoice));
  } catch (err) {
    return handlePrismaError(err);
  }
}

/** PUT /api/invoices/[id] */
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "invoices", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const existing = await prisma.invoice.findFirst({
      where: { id, company_id: user.company_id },
    });

    if (!existing) return errorResponse("Facture introuvable", 404);
    if (existing.status === "paid") {
      return errorResponse("Impossible de modifier une facture déjà payée", 403);
    }
    if (existing.status === "cancelled") {
      return errorResponse("Impossible de modifier une facture annulée", 403);
    }

    const body = await req.json();
    const parsed = UpdateInvoiceSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const data = parsed.data;

    const updated = await prisma.$transaction(async (tx) => {
      // If lines are updated, recalculate totals
      let subtotal_ht = toNumber(existing.subtotal_ht);
      let vat_amount = toNumber(existing.vat_amount);
      let total_ttc = toNumber(existing.total_ttc);

      if (data.lines) {
        subtotal_ht = 0;
        vat_amount = 0;
        const linesData = data.lines.map((l) => {
          const amount = Math.round(l.quantity * l.unit_price * 100) / 100;
          const vat = Math.round(amount * (l.vat_rate / 100) * 100) / 100;
          subtotal_ht += amount;
          vat_amount += vat;
          return { ...l, amount };
        });
        total_ttc = subtotal_ht + vat_amount;

        // Delete old lines and create new ones
        await tx.invoiceLine.deleteMany({ where: { invoice_id: id } });
        await tx.invoiceLine.createMany({
          data: linesData.map((l) => ({
            invoice_id: id,
            description: l.description,
            quantity: l.quantity,
            unit_price: l.unit_price,
            vat_rate: l.vat_rate,
            amount: l.amount,
            accounting_account: l.accounting_account,
          })),
        });
      }

      return tx.invoice.update({
        where: { id },
        data: {
          ...(data.client_id && { client_id: data.client_id }),
          ...(data.issue_date && { issue_date: data.issue_date }),
          ...(data.due_date && { due_date: data.due_date }),
          ...(data.notes && { notes: data.notes }),
          ...(data.payment_method && { payment_method: data.payment_method }),
          ...(data.tax_regime && { tax_regime: data.tax_regime }),
          subtotal_ht: Math.round(subtotal_ht * 100) / 100,
          vat_amount: Math.round(vat_amount * 100) / 100,
          total_ttc: Math.round(total_ttc * 100) / 100,
        },
        include: INVOICE_INCLUDE,
      });
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      entity: "Invoice",
      entity_id: id,
      details: {
        old_data: existing,
        new_data: data,
      },
    });

    return successJson(serializeInvoice(updated), "Facture mise à jour");
  } catch (err) {
    return handlePrismaError(err);
  }
}

/** DELETE /api/invoices/[id] — Mark as cancelled */
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "invoices", "full");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const existing = await prisma.invoice.findFirst({
      where: { id, company_id: user.company_id },
    });

    if (!existing) return errorResponse("Facture introuvable", 404);
    if (existing.status === "paid") {
      return errorResponse("Impossible d'annuler une facture déjà payée", 403);
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: { status: "cancelled" },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      entity: "Invoice",
      entity_id: id,
      details: {
        status: "cancelled",
        reference: existing.reference,
      },
    });

    return successJson(serializeInvoice(updated), "Facture annulée");
  } catch (err) {
    return handlePrismaError(err);
  }
}

function serializeInvoice(invoice: any) {
  return {
    ...invoice,
    subtotal_ht: toNumber(invoice.subtotal_ht),
    vat_amount: toNumber(invoice.vat_amount),
    total_ttc: toNumber(invoice.total_ttc),
    lines: invoice.lines?.map((l: any) => ({
      ...l,
      quantity: toNumber(l.quantity),
      unit_price: toNumber(l.unit_price),
      vat_rate: toNumber(l.vat_rate),
      amount: toNumber(l.amount),
    })),
    payments: invoice.payments?.map((p: any) => ({
      ...p,
      amount: toNumber(p.amount),
    })),
  };
}
