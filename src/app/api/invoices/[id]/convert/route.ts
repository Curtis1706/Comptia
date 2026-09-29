import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";
import { generateInvoiceReference, generateSalesEntryLines } from "@/lib/accounting";
import { normalizeInvoice } from "@/lib/mecef";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "invoices", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const quote = await prisma.invoice.findFirst({
      where: { id, company_id: user.company_id, type: "quote" },
      include: { lines: true, client: true, company: true },
    });
    if (!quote) return errorResponse("Devis introuvable ou deja converti.", 404);
    if (quote.status === "cancelled") return errorResponse("Ce devis est annule.", 422);
    const company = quote.company;
    if (!company) return errorResponse("Entreprise introuvable", 404);

    const prefix = "FAC";
    const currentYear = new Date().getFullYear();
    const latestInvoice = await prisma.invoice.findFirst({
      where: { company_id: user.company_id, type: "invoice", reference: { startsWith: `${prefix}-${currentYear}-` } },
      orderBy: { reference: "desc" },
    });
    let nextSeq = 1;
    if (latestInvoice) {
      const parts = latestInvoice.reference.split("-");
      const lastSeq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
    }
    const newReference = generateInvoiceReference(prefix, nextSeq, currentYear);

    const isTps = company.tax_regime === "tps";
    const processedLines = quote.lines.map((l) => {
      const unitPrice = Number(l.unit_price);
      const qty = Number(l.quantity);
      const vatRate = isTps ? 0 : Number(l.vat_rate);
      const amount = qty * unitPrice;
      const vat = amount * (vatRate / 100);
      return { description: l.description, quantity: qty, unit_price: unitPrice, vat_rate: vatRate, amount, vat, tax_group: l.tax_group || "B", tax_specific: l.tax_specific ? Number(l.tax_specific) : null, accounting_account: l.accounting_account };
    });

    const subtotal_ht = processedLines.reduce((s, l) => s + l.amount, 0);
    const vat_amount = processedLines.reduce((s, l) => s + l.vat, 0);
    const total_ttc = subtotal_ht + vat_amount;

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          type: "invoice", reference: newReference, client_id: quote.client_id, company_id: user.company_id, created_by: user.id,
          subtotal_ht, vat_amount, total_ttc, issue_date: new Date(), due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          notes: quote.notes, payment_method: quote.payment_method, tax_regime: company.tax_regime, tax_rate: isTps ? 0 : 18,
          vat_exemption_reason: isTps ? "Regime TPS - TVA non applicable" : null, aib_rate: quote.aib_rate || "none",
          aib_amount: Number(quote.aib_amount) || 0, tourist_tax_amount: Number(quote.tourist_tax_amount) || 0,
          additional_description: quote.additional_description, commercial_message: quote.commercial_message,
          lines: { create: processedLines.map((l) => ({ description: l.description, quantity: l.quantity, unit_price: l.unit_price, vat_rate: l.vat_rate, amount: l.amount, tax_group: l.tax_group, tax_specific: l.tax_specific, accounting_account: l.accounting_account })) },
        },
        include: { lines: true, client: true },
      }) as any;

      const entryLines = generateSalesEntryLines({ client_id: invoice.client_id, subtotal_ht: Number(invoice.subtotal_ht), vat_amount: Number(invoice.vat_amount), total_ttc: Number(invoice.total_ttc), lines: invoice.lines });
      const ACCOUNT_DEFAULTS: Record<string, { name: string; type: "asset" | "liability" | "equity" | "revenue" | "expense" }> = {
        "411": { name: "Clients", type: "asset" }, "706": { name: "Prestations de services", type: "revenue" },
        "701": { name: "Ventes de marchandises", type: "revenue" }, "707": { name: "Ventes de produits finis", type: "revenue" },
        "4431": { name: "TVA facturee sur ventes", type: "liability" }, "521": { name: "Banques locales", type: "asset" },
      };
      const uniqueCodes = [...new Set(entryLines.map((l: any) => l.account_code))];
      await Promise.all(uniqueCodes.map((code: any) => { const def = ACCOUNT_DEFAULTS[code] ?? { name: `Compte ${code}`, type: "asset" as const }; return tx.account.upsert({ where: { code_company_id: { code, company_id: user.company_id } }, create: { code, name: def.name, type: def.type, company_id: user.company_id }, update: {} }); }));
      await tx.journalEntry.create({ data: { date: invoice.issue_date, reference: `VTE-${invoice.reference}`, description: `Vente (depuis devis ${quote.reference}) - ${quote.client?.name || "Client"}`, journal: "sales", status: "draft", company_id: user.company_id, created_by: user.id, lines: { create: entryLines.map((l: any) => ({ account_code: l.account_code, debit: l.debit, credit: l.credit, description: l.description, third_party: l.third_party, company_id: user.company_id })) } } });
      await tx.invoice.update({ where: { id }, data: { status: "sent" } });
      await logAction({ company_id: user.company_id, user_id: user.id, action: "CREATE", resource: "Invoice", resource_id: invoice.id, new_data: { reference: invoice.reference, converted_from_quote: quote.reference, total_ttc: Number(invoice.total_ttc) } });
      return invoice;
    });

    try { await normalizeInvoice({ ...result, company, created_by_user: user }); } catch (mecefErr: any) { console.warn("[e-MECeF] Normalisation differee:", mecefErr.message); }

    const finalInvoice = await prisma.invoice.findUnique({ where: { id: result.id }, include: { lines: true, client: true } });
    return successJson(finalInvoice, `Devis ${quote.reference} converti en facture ${result.reference} avec succes.`, 201);
  } catch (err) { return handlePrismaError(err); }
}