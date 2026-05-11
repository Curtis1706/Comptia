import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, zodErrorResponse, handlePrismaError, paginatedResponse } from "@/lib/api-response";
import { logAction } from "@/lib/audit";
import { generateInvoiceReference, generateSalesEntryLines, generateCreditNoteEntryLines } from "@/lib/accounting";
import * as z from "zod";

const CreateInvoiceSchema = z.object({
  type: z.enum(["invoice", "quote", "credit_note"]),
  client_id: z.string().min(1),
  issue_date: z.string(),
  due_date: z.string(),
  payment_method: z.enum(["bank_transfer", "check", "cash", "credit_card"]).optional(),
  notes: z.string().optional(),
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
export const GET = withAuth(async (req, { user }) => {
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
});

/**
 * POST /api/invoices
 */
export const POST = withAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const parsed = CreateInvoiceSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { lines, client_id, ...invoiceData } = parsed.data;

    // Verify client
    const client = await prisma.thirdParty.findFirst({
      where: { id: client_id, company_id: user.company_id },
    });
    if (!client) return errorResponse("Client introuvable", 404);

    // Calculations
    const processedLines = lines.map(line => {
      const amount = line.quantity * line.unit_price;
      const vat = amount * (line.vat_rate / 100);
      return { ...line, amount, vat };
    });

    const subtotal_ht = processedLines.reduce((acc, l) => acc + l.amount, 0);
    const vat_amount = processedLines.reduce((acc, l) => acc + l.vat, 0);
    const total_ttc = subtotal_ht + vat_amount;

    // Sequence for reference
    const prefix = invoiceData.type === "invoice" ? "FAC" : invoiceData.type === "quote" ? "DEV" : "AVO";
    const count = await prisma.invoice.count({
      where: { company_id: user.company_id, type: invoiceData.type },
    });
    const reference = generateInvoiceReference(prefix, count + 1);

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
          lines: {
            create: processedLines.map(l => ({
              description: l.description,
              quantity: l.quantity,
              unit_price: l.unit_price,
              vat_rate: l.vat_rate,
              amount: l.amount,
              accounting_account: l.accounting_account,
            })),
          },
        },
        include: { lines: true, client: true },
      }) as any; // Cast as any to avoid complex Prisma include type issues in this transaction block

      // 2. If Invoice or Credit Note, create Ledger Entry
      if (invoice.type === "invoice" || invoice.type === "credit_note") {
        const entryLines = invoice.type === "invoice" 
          ? generateSalesEntryLines({
              client_id: invoice.client_id,
              subtotal_ht: Number(invoice.subtotal_ht),
              vat_amount: Number(invoice.vat_amount),
              total_ttc: Number(invoice.total_ttc),
              lines: invoice.lines,
            })
          : generateCreditNoteEntryLines({
              client_id: invoice.client_id,
              subtotal_ht: Number(invoice.subtotal_ht),
              vat_amount: Number(invoice.vat_amount),
              total_ttc: Number(invoice.total_ttc),
              lines: invoice.lines,
            });

        // Auto-create missing accounts (upsert) to avoid FK constraint violations
        const ACCOUNT_DEFAULTS: Record<string, { name: string; type: "asset" | "liability" | "equity" | "revenue" | "expense" }> = {
          "411": { name: "Clients", type: "asset" },
          "706": { name: "Prestations de services", type: "revenue" },
          "701": { name: "Ventes de marchandises", type: "revenue" },
          "707": { name: "Ventes de produits finis", type: "revenue" },
          "4457": { name: "TVA collectée", type: "liability" },
          "4456": { name: "TVA déductible", type: "asset" },
          "512": { name: "Banque", type: "asset" },
          "530": { name: "Caisse", type: "asset" },
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

        await tx.journalEntry.create({
          data: {
            date: invoice.issue_date,
            reference: `${journalRef}-${invoice.reference}`,
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

    return successJson(result, "Facture créée avec succès", 201);
  } catch (err) {
    return handlePrismaError(err);
  }
});
