import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "bank_reconciliation", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const body = await req.json();
    const { filename, account_iban, transactions } = body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return errorResponse("Aucune transaction bancaire valide à importer", 400);
    }

    // Calcul des bornes de dates
    const dates = transactions
      .map((t: any) => new Date(t.date).getTime())
      .filter((t: number) => !isNaN(t));
    const periodStart = dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
    const periodEnd = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();

    const result = await prisma.$transaction(async (tx) => {
      const statement = await tx.bankStatement.create({
        data: {
          company_id: user.company_id,
          filename: filename || "Relevé bancaire importé",
          account_iban: account_iban || "521",
          upload_date: new Date(),
          period_start: periodStart,
          period_end: periodEnd,
        },
      });

      const txData = transactions.map((t: any) => ({
        statement_id: statement.id,
        date: new Date(t.date),
        description: String(t.description || "Opération bancaire"),
        reference: t.reference ? String(t.reference) : null,
        amount: new Prisma.Decimal(t.amount),
        status: "UNMATCHED" as const,
      }));

      await tx.bankTransaction.createMany({
        data: txData,
      });

      return {
        statementId: statement.id,
        count: txData.length,
      };
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "BankStatement",
      entity_id: result.statementId,
      details: {
        filename,
        account_iban: account_iban || "521",
        count: result.count,
      },
    });

    return successJson(
      result,
      `${result.count} transaction${result.count > 1 ? "s" : ""} importée${result.count > 1 ? "s" : ""} avec succès`
    );
  } catch (err) {
    return handlePrismaError(err);
  }
}
