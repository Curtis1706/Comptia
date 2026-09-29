import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, zodErrorResponse, handlePrismaError, paginatedResponse } from "@/lib/api-response";
import { logAction } from "@/lib/audit";
import { generateInvoiceReference, generateSalesEntryLines, generateCreditNoteEntryLines } from "@/lib/accounting";
import { normalizeInvoice } from "@/lib/mecef";
import * as z from "zod";

const CreateInvoiceSchema = z.object({
  type: z.enum(["invoice", "quote", "credit_note"]),
  client_id: z.string().min(1),
  issue_date: z.string(),
  due_date: z.string(),
  payment_method: z.enum([
    "cash",
    "bank_transfer",
    "check",
    "mobile_money_mtn",
    "mobile_money_moov",
    "mobile_money_celtiis",
    "credit_card",
    "western_union",
    "other",
  ]).optional(),
  notes: z.string().optional(),
  mecef_dgi_code: z.string().optional(),
  mecef_nim: z.string().optional(),
  mecef_status: z.enum(["draft", "awaiting_manual_normalization", "normalized", "verification_failed"]).optional().default("draft"),
  lines: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().positive(),
    unit_price: z.number().min(0),
    vat_rate: z.number().min(0).max(100),
    accounting_account: z.string().optional(),
  })).min(1),
});

/**
 * GET /api/invoices
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "invoices", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const client_id = searchParams.get("client_id");
    const search = searchParams.get("search");

    const where: any = {
      company_id: user.company_id,
      ...(type && { type }),
      ...(status && { status }),
      ...(client_id && { client_id }),
      ...(search && {
        OR: [
          { reference: { contains: search, mode: "insensitive" } },
          { client: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: { client: true, lines: true },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return paginatedResponse(invoices, total, page, limit);
  } catch (err) {
    return handlePrismaError(err);
  }
}

/**
 * POST /api/invoices
 */
export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "invoices", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const body = await req.json();
    const parsed = CreateInvoiceSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { lines, client_id, ...invoiceData } = parsed.data;

    // Verify client and company for tax regime
    const [client, company] = await Promise.all([
      prisma.thirdParty.findFirst({ where: { id: client_id, company_id: user.company_id } }),
      prisma.company.findUnique({ where: { id: user.company_id } })
    ]);
    
    if (!client) return errorResponse("Client introuvable", 404);
    if (!company) return errorResponse("Entreprise introuvable", 404);

    const isTps = company.tax_regime === "tps";
    const invoiceTaxRate = isTps ? 0 : 18;
    const vatExemptionReason = isTps ? "Entreprise au régime TPS — TVA non applicable" : null;

    // Calculations
    const processedLines = lines.map(line => {
      const amount = line.quantity * line.unit_price;
      const finalVatRate = isTps ? 0 : line.vat_rate;
      const vat = amount * (finalVatRate / 100);
      return { ...line, vat_rate: finalVatRate, amount, vat };
    });

    const subtotal_ht = processedLines.reduce((acc, l) => acc + l.amount, 0);
    const vat_amount = processedLines.reduce((acc, l) => acc + l.vat, 0);
    const total_ttc = subtotal_ht + vat_amount;

    // Sequence for reference (robust sequence based on maximum existing sequence)
    const prefix = invoiceData.type === "invoice" ? "FAC" : invoiceData.type === "quote" ? "DEV" : "AVO";
    const currentYear = new Date().getFullYear();
    const latestInvoice = await prisma.invoice.findFirst({
      where: {
        company_id: user.company_id,
        type: invoiceData.type,
        reference: { startsWith: `${prefix}-${currentYear}-` },
      },
      orderBy: { reference: "desc" },
    });

    let nextSeq = 1;
    if (latestInvoice) {
      const parts = latestInvoice.reference.split("-");
      const lastSeq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastSeq)) {
        nextSeq = lastSeq + 1;
      }
    }
    const reference = generateInvoiceReference(prefix, nextSeq, currentYear);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Invoice
      const invoice = await tx.invoice.create({
        data: {
          type: invoiceData.type,
          reference,
          client_id,
          company_id: user.company_id,
          created_by: user.id,
          subtotal_ht,
          vat_amount,
          total_ttc,
          issue_date: new Date(invoiceData.issue_date),
          due_date: new Date(invoiceData.due_date),
          notes: invoiceData.notes,
          payment_method: invoiceData.payment_method,
          tax_regime: company.tax_regime,
          tax_rate: invoiceTaxRate,
          vat_exemption_reason: vatExemptionReason,
          mecef_dgi_code: invoiceData.mecef_dgi_code,
          mecef_nim: invoiceData.mecef_nim,
          mecef_status: invoiceData.mecef_status,
          mecef_uid: invoiceData.mecef_uid,
          mecef_original_ref: invoiceData.mecef_original_ref,
          aib_rate: invoiceData.aib_rate || "none",
          aib_amount: invoiceData.aib_amount || 0,
          tourist_tax_amount: invoiceData.tourist_tax_amount || 0,
          additional_description: invoiceData.additional_description,
          commercial_message: invoiceData.commercial_message,
          lines: {
            create: processedLines.map(l => ({
              description: l.description,
              quantity: l.quantity,
              unit_price: l.unit_price,
              vat_rate: l.vat_rate,
              amount: l.amount,
              tax_group: l.tax_group || "B",
              tax_specific: l.tax_specific || null,
              accounting_account: l.accounting_account,
            })),
          },
        },
        include: { lines: true, client: true },
      }) as any;

      // 2. If Invoice or Credit Note, create Ledger Entry
      if (invoice.type === "invoice" || invoice.type === "credit_note") {
        const entryLines = invoice.type === "invoice" 
          ? generateSalesEntryLines({
              client_id: invoice.client_id,
              subtotal_ht: Number(invoice.subtotal_ht),
              vat_amount: Number(invoice.vat_amount),
              total_ttc: Number(invoice.total_ttc),
              aib_amount: Number(invoice.aib_amount || 0),
              lines: invoice.lines,
            })
          : generateCreditNoteEntryLines({
              client_id: invoice.client_id,
              subtotal_ht: Number(invoice.subtotal_ht),
              vat_amount: Number(invoice.vat_amount),
              total_ttc: Number(invoice.total_ttc),
              aib_amount: Number(invoice.aib_amount || 0),
              lines: invoice.lines,
            });

        // Auto-create missing accounts (upsert) to avoid FK constraint violations (SYSCOHADA Révisé)
        const ACCOUNT_DEFAULTS: Record<string, { name: string; type: "asset" | "liability" | "equity" | "revenue" | "expense" }> = {
          "411": { name: "Clients", type: "asset" },
          "701": { name: "Ventes de marchandises", type: "revenue" },
          "702": { name: "Ventes de produits finis", type: "revenue" },
          "706": { name: "Prestations de services", type: "revenue" },
          "707": { name: "Produits accessoires", type: "revenue" },
          "4431": { name: "TVA facturée sur ventes", type: "liability" },
          "4452": { name: "TVA récupérable sur achats", type: "asset" },
          "4471": { name: "État, AIB retenu à reverser", type: "liability" },
          "521": { name: "Banques locales", type: "asset" },
          "571": { name: "Caisse siège social", type: "asset" },
          "585": { name: "Mobile Money", type: "asset" },
        };

        const uniqueCodes = [...new Set(entryLines.map((l: any) => l.account_code))];
        await Promise.all(
          uniqueCodes.map((code: any) => {
            const def = ACCOUNT_DEFAULTS[code] ?? { name: `Compte ${code}`, type: "asset" as const };
            return tx.account.upsert({
              where: { code_company_id: { code, company_id: user.company_id } },
              create: { code, name: def.name, type: def.type, company_id: user.company_id },
              update: {},
            });
          })
        );

        const journalRef = invoice.type === "invoice" ? "VTE" : "AVO";
        const entryRef = `${journalRef}-${invoice.reference}`;
        const existingEntry = await tx.journalEntry.findFirst({
          where: { company_id: user.company_id, reference: entryRef },
        });
        const finalEntryRef = existingEntry ? `${entryRef}-${Date.now().toString().slice(-4)}` : entryRef;

        await tx.journalEntry.create({
          data: {
            date: invoice.issue_date,
            reference: finalEntryRef,
            description: `${invoice.type === "invoice" ? "Vente" : "Avoir"} - ${invoice.reference} - ${client.name}`,
            journal: "sales",
            status: "draft",
            company_id: user.company_id,
            created_by: user.id,
            lines: {
              create: entryLines.map((l: any) => ({
                account_code: l.account_code,
                debit: l.debit,
                credit: l.credit,
                description: l.description,
                third_party: l.third_party,
                company_id: user.company_id,
              })),
            },
          },
        });
      }

      // 3. Audit Log
      await logAction({
        company_id: user.company_id,
        user_id: user.id,
        action: "CREATE",
        resource: "Invoice",
        resource_id: invoice.id,
        new_data: { reference: invoice.reference, total_ttc: Number(invoice.total_ttc) },
      });

      return invoice;
    });

    // 4. Normalisation e-MECeF automatique pour les factures et avoirs
    if (result.type === "invoice" || result.type === "credit_note") {
      try {
        const mecefRes = await normalizeInvoice({
          ...result,
          company,
          created_by_user: user,
        });

        const normalizedInvoice = await prisma.invoice.update({
          where: { id: result.id },
          data: {
            mecef_status: "normalized",
            mecef_dgi_code: mecefRes.codeMECeFDGI,
            mecef_nim: mecefRes.nim,
            mecef_qr_code: mecefRes.qrCode,
          },
          include: { lines: true, client: true },
        });

        return successJson(normalizedInvoice, "Facture créée et normalisée e-MECeF avec succès", 201);
      } catch (mecefErr: any) {
        console.error("[POST /api/invoices] e-MECeF normalization error:", mecefErr);
        // En cas d'erreur de connexion, marquer en attente de normalisation
        const pendingInvoice = await prisma.invoice.update({
          where: { id: result.id },
          data: { mecef_status: "awaiting_manual_normalization" },
          include: { lines: true, client: true },
        });

        return successJson(pendingInvoice, "Facture créée (en attente de normalisation e-MECeF)", 201);
      }
    }

    return successJson(result, "Facture créée avec succès", 201);
  } catch (err) {
    return handlePrismaError(err);
  }
}
