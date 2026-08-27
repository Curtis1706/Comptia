import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, handlePrismaError } from "@/lib/api-response";
import { toNumber } from "@/lib/accounting";

/**
 * GET /api/reports/profit-loss
 * Generates the Profit & Loss statement (Compte de Résultat) for a period.
 * Classes 6 (Expenses) and 7 (Revenue).
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get("date_from") ? new Date(searchParams.get("date_from")!) : new Date(new Date().getFullYear(), 0, 1);
    const dateTo = searchParams.get("date_to") ? new Date(searchParams.get("date_to")!) : new Date();

    const companyId = user.company_id;

    // Fetch account totals for classes 6 and 7
    const lines = await prisma.journalLine.groupBy({
      by: ["account_code"],
      where: {
        company_id: companyId,
        entry: { date: { gte: dateFrom, lte: dateTo }, status: { in: ["posted", "validated"] } },
        OR: [
          { account_code: { startsWith: "6" } },
          { account_code: { startsWith: "7" } },
        ],
      },
      _sum: { debit: true, credit: true },
    });

    const accounts = await prisma.account.findMany({
      where: {
        company_id: companyId,
        OR: [{ code: { startsWith: "6" } }, { code: { startsWith: "7" } }],
      },
      select: { code: true, name: true, type: true },
    });

    const accountMap = new Map(accounts.map((a) => [a.code, a]));

    const report = {
      revenue: [] as any[],
      expenses: [] as any[],
      total_revenue: 0,
      total_expenses: 0,
      net_result: 0,
    };

    lines.forEach((l) => {
      const acc = accountMap.get(l.account_code);
      if (!acc) return;

      const debit = toNumber(l._sum.debit);
      const credit = toNumber(l._sum.credit);
      const amount = acc.type === "revenue" ? credit - debit : debit - credit;

      const item = {
        code: l.account_code,
        name: acc.name,
        amount: Math.round(amount * 100) / 100,
      };

      if (acc.type === "revenue") {
        report.revenue.push(item);
        report.total_revenue += amount;
      } else {
        report.expenses.push(item);
        report.total_expenses += amount;
      }
    });

    report.total_revenue = Math.round(report.total_revenue * 100) / 100;
    report.total_expenses = Math.round(report.total_expenses * 100) / 100;
    report.net_result = Math.round((report.total_revenue - report.total_expenses) * 100) / 100;

    return successJson({
      period: { from: dateFrom, to: dateTo },
      ...report,
    });
  } catch (err) {
    return handlePrismaError(err);
  }
});
