import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import {
  successJson,
  errorResponse,
  zodErrorResponse,
  handlePrismaError,
} from "@/lib/api-response";
import { RecordPaymentSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";
import { toNumber, generatePaymentEntries } from "@/lib/accounting";

/**
 * POST /api/invoices/[id]/pay
 * Records a payment for an invoice and generates automatic accounting entries.
 */
export const POST = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: params?.id, company_id: user.company_id },
      include: { payments: true },
    });

    if (!invoice) return errorResponse("Facture introuvable", 404);
    if (invoice.status === "paid") return errorResponse("Cette facture est déjà payée", 400);
    if (invoice.status === "cancelled") return errorResponse("Impossible de payer une facture annulée", 400);

    const body = await req.json();
    const parsed = RecordPaymentSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { amount, payment_date, payment_method, reference } = parsed.data;

    // Validate that amount <= remaining balance
    const totalPaid = invoice.payments.reduce((sum, p) => sum + toNumber(p.amount), 0);
    const totalTtc = toNumber(invoice.total_ttc);
    const remaining = Math.round((totalTtc - totalPaid) * 100) / 100;

    if (amount > remaining + 0.01) { // 0.01 tolerance for float issues
      return errorResponse(`Le montant dépasse le solde restant (${remaining} €)`, 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create InvoicePayment
      const payment = await tx.invoicePayment.create({
        data: {
          invoice_id: params?.id!,
          company_id: user.company_id,
          amount,
          payment_date,
          payment_method,
          reference,
        },
      });

      // 2. Update Invoice Status
      const isPaid = Math.abs(remaining - amount) < 0.01;
      await tx.invoice.update({
        where: { id: params?.id },
        data: { status: isPaid ? "paid" : "sent" }, // Or viewed
      });

      // 3. Generate automatic JournalEntry
      const entryLines = generatePaymentEntries(amount, payment_method);
      const entryReference = `PAY-${invoice.reference}-${invoice.payments.length + 1}`;

      await tx.journalEntry.create({
        data: {
          date: payment_date,
          reference: entryReference,
          description: `Paiement facture ${invoice.reference}`,
          journal: "bank",
          status: "validated", // Auto-validated for payments
          company_id: user.company_id,
          created_by: user.id,
          lines: {
            create: entryLines.map((l) => ({
              account_code: l.account_code,
              company_id: user.company_id,
              debit: l.debit,
              credit: l.credit,
              description: l.description,
              third_party: invoice.client_id, // Link to client
            })),
          },
        },
      });

      return payment;
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      resource: "InvoicePayment",
      resource_id: result.id,
      new_data: { amount, payment_method, invoice_reference: invoice.reference },
    });

    return successJson(result, "Paiement enregistré et écritures comptables générées", 201);
  } catch (err) {
    console.error("[POST /api/invoices/[id]/pay]", err);
    return handlePrismaError(err);
  }
});
