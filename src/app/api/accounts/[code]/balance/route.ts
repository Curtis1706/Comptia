import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { toNumber, calculateAccountBalance } from "@/lib/accounting";

/**
 * GET /api/accounts/[code]/balance
 * Returns the balance of an account for a given period. Requires 'read' on chart_of_accounts.
 */
export async function GET(req: Request, context: { params: Promise<{ code: string }> }) {
  const permCheck = await requirePermission(req, "chart_of_accounts", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { code } = await context.params;

  try {
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get("date_from") ? new Date(searchParams.get("date_from")!) : undefined;
    const dateTo = searchParams.get("date_to") ? new Date(searchParams.get("date_to")!) : undefined;

    const account = await prisma.account.findFirst({
      where: { code, company_id: user.company_id },
    });

    if (!account) return errorResponse("Compte introuvable", 404);

    const lines = await prisma.journalLine.findMany({
      where: {
        account_code: code,
        company_id: user.company_id,
        entry: {
          status: { in: ["posted", "validated"] },
          ...(dateFrom || dateTo
            ? {
                date: {
                  ...(dateFrom && { gte: dateFrom }),
                  ...(dateTo && { lte: dateTo }),
                },
              }
            : {}),
        },
      },
      select: { debit: true, credit: true },
    });

    const totalDebit = lines.reduce((s, l) => s + toNumber(l.debit), 0);
    const totalCredit = lines.reduce((s, l) => s + toNumber(l.credit), 0);
    const balance = calculateAccountBalance(
      account.type as "asset" | "liability" | "equity" | "revenue" | "expense",
      totalDebit,
      totalCredit
    );

    return successJson({
      code: account.code,
      name: account.name,
      type: account.type,
      total_debit: totalDebit,
      total_credit: totalCredit,
      balance,
      period: { from: dateFrom ?? null, to: dateTo ?? null },
    });
  } catch (err) {
    return handlePrismaError(err);
  }
}
