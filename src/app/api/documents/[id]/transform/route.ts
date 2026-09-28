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

    const effectiveAccountCode = account_code || (document.extracted_data as any)?.account_code || "628";
    const totalAmount = Number(amount) || 0;

    // Détermination de la typologie comptable selon la classe SYSCOHADA
    const isSalariesAccount = ["661", "662", "663"].includes(effectiveAccountCode);
    const isCnssAccount = effectiveAccountCode === "664";
    const isPayrollAccount = isSalariesAccount || isCnssAccount;

    // TVA : les salaires et cotisations sociales sont hors champ TVA (0 TVA)
    const vat = isPayrollAccount ? 0 : Number(vat_amount) || 0;
    const netChargeAmount = Math.max(0, totalAmount - vat);

    // Définition de la contrepartie au passif (401 Fournisseurs, 421 Personnel, ou 431 Sécurité Sociale)
    let counterpartCode = "401";
    let counterpartName = "Fournisseurs, dettes en compte";
    let counterpartDesc = `Dette ${vendor_name || ""}`.trim();
    let journalType: "purchases" | "payroll" = "purchases";
    let journalPrefix = "AC";

    if (isSalariesAccount) {
      counterpartCode = "421";
      counterpartName = "Personnel, rémunérations dues";
      counterpartDesc = `Rémunérations dues ${vendor_name || "au personnel"}`.trim();
      journalType = "payroll";
      journalPrefix = "PAIE";
    } else if (isCnssAccount) {
      counterpartCode = "431";
      counterpartName = "Sécurité sociale (CNSS)";
      counterpartDesc = `Cotisations sociales dues CNSS / VPS`.trim();
      journalType = "payroll";
      journalPrefix = "PAIE";
    }

    const ref = invoice_number || (await nextEntryReference(prisma, user.company_id, journalPrefix));

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

    // 2. Assurer l'existence du compte de contrepartie (401, 421 ou 431)
    const counterpartAccountExists = await prisma.account.findFirst({
      where: { code: counterpartCode, company_id: user.company_id },
    });
    if (!counterpartAccountExists) {
      await prisma.account
        .create({
          data: {
            company_id: user.company_id,
            code: counterpartCode,
            name: counterpartName,
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
        created_by: user.id,
        date: entryDate,
        description: isPayrollAccount
          ? `Pièce RH / Paie: ${vendor_name || "Personnel"} (${ref})`
          : `Saisie OCR: ${vendor_name || "Fournisseur"} (Facture ${ref})`,
        journal: journalType,
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
              description: (isPayrollAccount
                ? `Charge personnel ${vendor_name || ""}`
                : `Achat ${vendor_name || ""}`
              ).trim(),
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
            // Crédit : Contrepartie (401 Fournisseurs, 421 Salariés, 431 Sécurité Sociale)
            {
              company_id: user.company_id,
              account_code: counterpartCode,
              debit: 0,
              credit: totalAmount,
              description: counterpartDesc,
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
