import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import {
  successJson,
  errorResponse,
  zodErrorResponse,
  handlePrismaError,
} from "@/lib/api-response";
import { RecordPaymentSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";
import { toNumber, generatePaymentEntryLines } from "@/lib/accounting";

/**
 * POST /api/invoices/[id]/pay
 * Records a payment for an invoice and generates automatic accounting entries. Requires 'write' on invoices.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "invoices", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id, company_id: user.company_id },
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

    if (amount > remaining + 0.01) {
      return errorResponse(`Le montant dépasse le solde restant (${remaining} €)`, 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create InvoicePayment
      const payment = await tx.invoicePayment.create({
        data: {
          invoice_id: id,
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
        where: { id },
        data: { status: isPaid ? "paid" : "sent" },
      });

      // 3. Generate automatic JournalEntry (SYSCOHADA Révisé)
      const entryLines = generatePaymentEntryLines({
        amount,
        client_id: invoice.client_id,
        payment_method,
      });
      const entryReference = `PAY-${invoice.reference}-${invoice.payments.length + 1}`;
      const journalType = payment_method === "cash" ? "cash" : "bank";

      const treasuryCode = entryLines[0]?.account_code || "521";
      const treasuryName =
        treasuryCode === "571"
          ? "Caisse siège social"
          : treasuryCode === "585"
          ? "Mobile Money"
          : "Banques locales";

      await tx.account.upsert({
        where: { code_company_id: { code: treasuryCode, company_id: user.company_id } },
        create: { code: treasuryCode, name: treasuryName, type: "asset", company_id: user.company_id },
        update: {},
      }).catch(() => {});

      await tx.journalEntry.create({
        data: {
          date: payment_date,
          reference: entryReference,
          description: `Paiement facture ${invoice.reference}`,
          journal: journalType,
          status: "validated",
          company_id: user.company_id,
          created_by: user.id,
          lines: {
            create: entryLines.map((l) => ({
              account_code: l.account_code,
              company_id: user.company_id,
              debit: l.debit,
              credit: l.credit,
              description: l.description,
              third_party: invoice.client_id,
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
      entity: "InvoicePayment",
      entity_id: result.id,
      details: { amount, payment_method, invoice_reference: invoice.reference },
    });

    return successJson(result, "Paiement enregistré et écritures comptables générées", 201);
  } catch (err) {
    console.error("[POST /api/invoices/[id]/pay]", err);
    return handlePrismaError(err);
  }
}
