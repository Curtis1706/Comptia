import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { nextEntryReference } from "@/lib/accounting";
import { logAction } from "@/lib/audit";
import { SYSCOHADA_EXPENSE_ACCOUNTS } from "@/lib/syscohada-accounts";

/**
 * POST /api/documents/[id]/transform
 * Creates a journal entry from OCR data respecting the SYSCOHADA chart of accounts.
 * Requires 'write' on documents.
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
    const effectiveAccountCode = account_code || (document.extracted_data as any)?.account_code || "628";
    const totalAmount = Number(amount) || 0;
    const vat = Number(vat_amount) || 0;
    const netChargeAmount = Math.max(0, totalAmount - vat);

    // 1. Assurer l'existence du compte de charge SYSCOHADA dans le plan de l'entreprise
    const chargeAccountExists = await prisma.account.findFirst({
      where: { code: effectiveAccountCode, company_id: user.company_id },
    });

    if (!chargeAccountExists) {
      const syscohadaDef = SYSCOHADA_EXPENSE_ACCOUNTS.find((a) => a.code === effectiveAccountCode);
      await prisma.account
        .create({
          data: {
            company_id: user.company_id,
            code: effectiveAccountCode,
            name: syscohadaDef?.name || `Charge ${effectiveAccountCode}`,
            type: "expense",
            is_active: true,
            is_postable: true,
          },
        })
        .catch(() => {});
    }

    // 2. Assurer l'existence du compte Fournisseur (401)
    const supplierAccountExists = await prisma.account.findFirst({
      where: { code: "401", company_id: user.company_id },
    });
    if (!supplierAccountExists) {
      await prisma.account
        .create({
          data: {
            company_id: user.company_id,
            code: "401",
            name: "Fournisseurs, dettes en compte",
            type: "liability",
            is_active: true,
            is_postable: true,
          },
        })
        .catch(() => {});
    }

    // 3. Assurer l'existence du compte TVA déductible (4452) si TVA > 0
    if (vat > 0) {
      const vatAccountExists = await prisma.account.findFirst({
        where: { code: "4452", company_id: user.company_id },
      });
      if (!vatAccountExists) {
        await prisma.account
          .create({
            data: {
              company_id: user.company_id,
              code: "4452",
              name: "État, TVA déductible sur services et charges",
              type: "asset",
              is_active: true,
              is_postable: true,
            },
          })
          .catch(() => {});
      }
    }

    // 4. Créer l'écriture comptable en partie double (SYSCOHADA)
    const entryDate = date && !isNaN(new Date(date).getTime()) ? new Date(date) : new Date();

    const entry = await prisma.journalEntry.create({
      data: {
        company_id: user.company_id,
        date: entryDate,
        description: `Saisie OCR: ${vendor_name || "Fournisseur"} (Facture ${ref})`,
        journal: "purchases",
        status: "draft",
        reference: ref,
        lines: {
          create: [
            // Débit : Compte de charge SYSCOHADA (Hors Taxes)
            {
              company_id: user.company_id,
              account_code: effectiveAccountCode,
              debit: netChargeAmount,
              credit: 0,
              description: `Achat ${vendor_name || ""}`.trim(),
            },
            // Débit : TVA déductible (si applicable)
            ...(vat > 0
              ? [
                  {
                    company_id: user.company_id,
                    account_code: "4452",
                    debit: vat,
                    credit: 0,
                    description: "TVA déductible sur charge",
                  },
                ]
              : []),
            // Crédit : Dette Fournisseur 401 (TTC)
            {
              company_id: user.company_id,
              account_code: "401",
              debit: 0,
              credit: totalAmount,
              description: `Dette ${vendor_name || ""}`.trim(),
            },
          ],
        },
      },
    });

    // 5. Marquer le document comme traité et lier l'écriture
    await prisma.document.update({
      where: { id },
      data: {
        status: "processed",
        extracted_data: {
          ...((document.extracted_data as any) || {}),
          ...body,
          account_code: effectiveAccountCode,
          journal_entry_id: entry.id,
        },
      },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "JournalEntry",
      entity_id: entry.id,
      details: {
        from_document: id,
        amount: totalAmount,
        account_code: effectiveAccountCode,
      },
    });

    return successJson(entry, "Opération créée avec succès selon le plan SYSCOHADA");
  } catch (err) {
    return handlePrismaError(err);
  }
}
