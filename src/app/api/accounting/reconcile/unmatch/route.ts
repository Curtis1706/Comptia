import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "bank_reconciliation", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { bank_ids, ledger_ids } = await req.json();

    if (!bank_ids?.length && !ledger_ids?.length) {
      return errorResponse("Veuillez sélectionner au moins une écriture ou transaction à dé-rapprocher", 400);
    }

    const affectedBankIds = new Set<string>();
    const affectedLedgerIds = new Set<string>();

    await prisma.$transaction(async (tx) => {
      // 1. Si bank_ids est fourni
      if (bank_ids?.length) {
        const bankTxs = await tx.bankTransaction.findMany({
          where: {
            id: { in: bank_ids },
            statement: { company_id: user.company_id },
          },
          select: { id: true },
        });
        const validBankIds = bankTxs.map((b) => b.id);
        validBankIds.forEach((id) => affectedBankIds.add(id));

        // Trouver les lignes comptables associées
        const linkedLines = await tx.journalLine.findMany({
          where: {
            bank_transaction_id: { in: validBankIds },
            company_id: user.company_id,
          },
          select: { id: true },
        });
        linkedLines.forEach((l) => affectedLedgerIds.add(l.id));

        // Réinitialiser les lignes comptables
        if (linkedLines.length > 0) {
          await tx.journalLine.updateMany({
            where: { id: { in: linkedLines.map((l) => l.id) } },
            data: {
              reconciliation_status: "UNMATCHED",
              bank_transaction_id: null,
            },
          });
        }

        // Réinitialiser les transactions bancaires
        await tx.bankTransaction.updateMany({
          where: { id: { in: validBankIds } },
          data: { status: "UNMATCHED" },
        });
      }

      // 2. Si ledger_ids est fourni
      if (ledger_ids?.length) {
        const lines = await tx.journalLine.findMany({
          where: {
            id: { in: ledger_ids },
            company_id: user.company_id,
          },
          select: { id: true, bank_transaction_id: true },
        });

        const validLedgerIds = lines.map((l) => l.id);
        validLedgerIds.forEach((id) => affectedLedgerIds.add(id));

        const bankTxIds = lines.map((l) => l.bank_transaction_id).filter(Boolean) as string[];

        // Réinitialiser les lignes de journal sélectionnées
        await tx.journalLine.updateMany({
          where: { id: { in: validLedgerIds } },
          data: {
            reconciliation_status: "UNMATCHED",
            bank_transaction_id: null,
          },
        });

        // Pour chaque transaction bancaire impactée, vérifier s'il reste d'autres lignes liées
        for (const bId of bankTxIds) {
          affectedBankIds.add(bId);
          const remainingLines = await tx.journalLine.count({
            where: {
              bank_transaction_id: bId,
              company_id: user.company_id,
              reconciliation_status: "MATCHED",
            },
          });

          await tx.bankTransaction.update({
            where: { id: bId },
            data: {
              status: remainingLines > 0 ? "PARTIAL" : "UNMATCHED",
            },
          });
        }
      }
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      entity: "Reconciliation",
      entity_id: Array.from(affectedBankIds)[0] || Array.from(affectedLedgerIds)[0] || "unmatch",
      details: {
        action: "unmatch",
        bank_ids: Array.from(affectedBankIds),
        ledger_ids: Array.from(affectedLedgerIds),
      },
    });

    return successJson(
      {
        unmatched_bank_count: affectedBankIds.size,
        unmatched_ledger_count: affectedLedgerIds.size,
      },
      "Dé-rapprochement effectué avec succès"
    );
  } catch (err) {
    return handlePrismaError(err);
  }
}
