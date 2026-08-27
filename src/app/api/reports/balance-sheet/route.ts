import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, handlePrismaError } from "@/lib/api-response";
import { toNumber } from "@/lib/accounting";

/**
 * GET /api/reports/balance-sheet
 * Generates the Balance Sheet (Bilan) at a specific date. Requires 'read' on reporting.
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "reporting", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const dateAt = searchParams.get("date") ? new Date(searchParams.get("date")!) : new Date();

    const companyId = user.company_id;

    const lines = await prisma.journalLine.groupBy({
      by: ["account_code"],
      where: {
        company_id: companyId,
        entry: { date: { lte: dateAt }, status: { in: ["posted", "validated"] } },
        OR: [
          { account_code: { startsWith: "1" } },
          { account_code: { startsWith: "2" } },
          { account_code: { startsWith: "3" } },
          { account_code: { startsWith: "4" } },
          { account_code: { startsWith: "5" } },
        ],
      },
      _sum: { debit: true, credit: true },
    });

    const accounts = await prisma.account.findMany({
      where: {
        company_id: companyId,
        OR: [
          { code: { startsWith: "1" } },
          { code: { startsWith: "2" } },
          { code: { startsWith: "3" } },
          { code: { startsWith: "4" } },
          { code: { startsWith: "5" } },
        ],
      },
      select: { code: true, name: true, type: true },
    });

    const accountMap = new Map(accounts.map((a) => [a.code, a]));

    const report = {
      assets: [] as any[],
      liabilities: [] as any[],
      equity: [] as any[],
      total_assets: 0,
      total_liabilities: 0,
      total_equity: 0,
    };

    lines.forEach((l) => {
      const acc = accountMap.get(l.account_code);
      if (!acc) return;

      const debit = toNumber(l._sum.debit);
      const credit = toNumber(l._sum.credit);

      let amount = 0;
      if (acc.type === "asset") {
        amount = debit - credit;
        report.assets.push({ code: acc.code, name: acc.name, amount: Math.round(amount * 100) / 100 });
        report.total_assets += amount;
      } else if (acc.type === "liability") {
        amount = credit - debit;
        report.liabilities.push({ code: acc.code, name: acc.name, amount: Math.round(amount * 100) / 100 });
        report.total_liabilities += amount;
      } else if (acc.type === "equity") {
        amount = credit - debit;
        report.equity.push({ code: acc.code, name: acc.name, amount: Math.round(amount * 100) / 100 });
        report.total_equity += amount;
      }
    });

    const plLines = await prisma.journalLine.aggregate({
      where: {
        company_id: companyId,
        entry: { date: { lte: dateAt }, status: { in: ["posted", "validated"] } },
        OR: [{ account_code: { startsWith: "6" } }, { account_code: { startsWith: "7" } }],
      },
      _sum: { debit: true, credit: true },
    });

    const netResult = toNumber(plLines._sum.credit) - toNumber(plLines._sum.debit);
    report.equity.push({ code: "120/129", name: "Résultat de l'exercice", amount: Math.round(netResult * 100) / 100 });
    report.total_equity += netResult;

    report.total_assets = Math.round(report.total_assets * 100) / 100;
    report.total_liabilities = Math.round(report.total_liabilities * 100) / 100;
    report.total_equity = Math.round(report.total_equity * 100) / 100;

    return successJson({
      date: dateAt,
      ...report,
    });
  } catch (err) {
    return handlePrismaError(err);
  }
}
