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

    if (!bank_ids?.length || !ledger_ids?.length) {
      return errorResponse("Veuillez sélectionner au moins une transaction de chaque côté", 400);
    }

    const [bankSum, ledgerSum] = await Promise.all([
      prisma.bankTransaction.aggregate({
        where: { id: { in: bank_ids } },
        _sum: { amount: true },
      }),
      prisma.journalLine.aggregate({
        where: {
          id: { in: ledger_ids },
          company_id: user.company_id,
          entry: { status: { in: ["posted", "validated"] } },
        },
        _sum: { debit: true, credit: true },
      }),
    ]);

    const bankTotal = Number(bankSum._sum.amount || 0);
    const ledgerTotal = Number(ledgerSum._sum.debit || 0) - Number(ledgerSum._sum.credit || 0);

    if (Math.abs(bankTotal - ledgerTotal) > 0.01) {
      return errorResponse(`Équilibre non respecté. Écart: ${bankTotal - ledgerTotal}`, 400);
    }

    await prisma.$transaction([
      prisma.bankTransaction.updateMany({
        where: { id: { in: bank_ids } },
        data: { status: "MATCHED" },
      }),
      prisma.journalLine.updateMany({
        where: { id: { in: ledger_ids } },
        data: {
          reconciliation_status: "MATCHED",
          bank_transaction_id: bank_ids[0],
        },
      }),
    ]);

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      entity: "Reconciliation",
      entity_id: bank_ids[0],
      details: { bank_ids, ledger_ids, amount: bankTotal },
    });

    return successJson({ matched: true }, "Rapprochement validé avec succès");
  } catch (err) {
    return handlePrismaError(err);
  }
}
