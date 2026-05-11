import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { bank_ids, ledger_ids } = await req.json();

    if (!bank_ids?.length || !ledger_ids?.length) {
      return errorResponse("Veuillez sélectionner au moins une transaction de chaque côté", 400);
    }

    // 1. Calculate and verify balance
    const [bankSum, ledgerSum] = await Promise.all([
      prisma.bankTransaction.aggregate({
        where: { id: { in: bank_ids } },
        _sum: { amount: true }
      }),
      prisma.journalLine.aggregate({
        where: { id: { in: ledger_ids } },
        _sum: { debit: true, credit: true }
      })
    ]);

    const bankTotal = Number(bankSum._sum.amount || 0);
    const ledgerTotal = Number(ledgerSum._sum.debit || 0) - Number(ledgerSum._sum.credit || 0);

    if (Math.abs(bankTotal - ledgerTotal) > 0.01) {
      return errorResponse(`Équilibre non respecté. Écart: ${bankTotal - ledgerTotal}`, 400);
    }

    // 2. Perform matching in a transaction
    await prisma.$transaction([
      // Mark bank transactions as matched
      prisma.bankTransaction.updateMany({
        where: { id: { in: bank_ids } },
        data: { status: "MATCHED" }
      }),
      // Mark journal lines as matched
      // Note: In a many-to-many match, we link them. 
      // For simplicity, we link all lines to the first bank_id or handle it as a group.
      // Ideally, we'd need a joining table for true N-N reconciliation.
      // For now, let's use the first bank_id as the primary reference.
      prisma.journalLine.updateMany({
        where: { id: { in: ledger_ids } },
        data: { 
          reconciliation_status: "MATCHED",
          bank_transaction_id: bank_ids[0] 
        }
      })
    ]);

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      resource: "Reconciliation",
      resource_id: bank_ids[0],
      new_data: { bank_ids, ledger_ids, amount: bankTotal }
    });

    return successJson({ matched: true }, "Rapprochement validé avec succès");
  } catch (err) {
    return handlePrismaError(err);
  }
});
