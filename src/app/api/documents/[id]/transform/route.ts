import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { nextEntryReference } from "@/lib/accounting";
import { logAction } from "@/lib/audit";

/**
 * POST /api/documents/[id]/transform
 * Creates a journal entry from OCR data. Requires 'write' on documents.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "documents", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const body = await req.json();
    const { vendor_name, amount, date, vat_amount, invoice_number, account_code } = body;

    const document = await prisma.document.findUnique({
      where: { id, company_id: user.company_id },
    });

    if (!document) return errorResponse("Document non trouvé", 404);

    const ref = invoice_number || (await nextEntryReference(prisma, user.company_id, "AC"));

    // 1. Create the Journal Entry
    const entry = await prisma.journalEntry.create({
      data: {
        company_id: user.company_id,
        date: new Date(date),
        description: `Saisie OCR: ${vendor_name} (Facture ${ref})`,
        journal: "purchases",
        status: "draft",
        reference: ref,
        lines: {
          create: [
            // Charge line (Debit)
            {
              company_id: user.company_id,
              account_code: account_code || "606",
              debit: Number(amount) - Number(vat_amount || 0),
              credit: 0,
              description: `Achat ${vendor_name}`,
            },
            // VAT line if any (Debit)
            ...(vat_amount
              ? [
                  {
                    company_id: user.company_id,
                    account_code: "4452",
                    debit: Number(vat_amount),
                    credit: 0,
                    description: "TVA sur achat",
                  },
                ]
              : []),
            // Supplier line (Credit)
            {
              company_id: user.company_id,
              account_code: "401",
              debit: 0,
              credit: Number(amount),
              description: `Dette ${vendor_name}`,
            },
          ],
        },
      },
    });

    // 2. Mark document as processed
    await prisma.document.update({
      where: { id },
      data: {
        status: "processed",
        extracted_data: body,
      },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "JournalEntry",
      entity_id: entry.id,
      details: { from_document: id, amount },
    });

    return successJson(entry, "Opération créée avec succès");
  } catch (err) {
    return handlePrismaError(err);
  }
}
