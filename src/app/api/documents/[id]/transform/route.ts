import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

export const POST = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const { vendor_name, amount, date, vat_amount, invoice_number, account_code } = body;

    const document = await prisma.document.findUnique({
      where: { id, company_id: user.company_id }
    });

    if (!document) return errorResponse("Document non trouvé", 404);

    // 1. Create the Journal Entry
    const entry = await prisma.journalEntry.create({
      data: {
        company_id: user.company_id,
        date: new Date(date),
        description: `Saisie OCR: ${vendor_name} (Facture ${invoice_number || 'N/A'})`,
        journal: "purchases",
        status: "draft",
        reference: invoice_number,
        lines: {
          create: [
            // Charge line (Debit)
            {
              company_id: user.company_id,
              account_code: account_code || "606", // Default to General Supplies
              debit: Number(amount) - Number(vat_amount || 0),
              credit: 0,
              description: `Achat ${vendor_name}`,
            },
            // VAT line if any (Debit)
            ...(vat_amount ? [{
              company_id: user.company_id,
              account_code: "4456", // TVA déductible
              debit: Number(vat_amount),
              credit: 0,
              description: "TVA sur achat",
            }] : []),
            // Supplier line (Credit)
            {
              company_id: user.company_id,
              account_code: "401", // Fournisseurs
              debit: 0,
              credit: Number(amount),
              description: `Dette ${vendor_name}`,
            }
          ]
        }
      }
    });

    // 2. Mark document as used
    await prisma.document.update({
      where: { id },
      data: { 
        status: "processed",
        extracted_data: body // Store final corrected data
      }
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      resource: "JournalEntry",
      resource_id: entry.id,
      new_data: { from_document: id, amount }
    });

    return successJson(entry, "Opération créée avec succès");
  } catch (err) {
    return handlePrismaError(err);
  }
});
