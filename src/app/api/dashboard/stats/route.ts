import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, handlePrismaError } from "@/lib/api-response";
import { toNumber } from "@/lib/accounting";
import { startOfMonth, endOfMonth, subMonths, format, subDays, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * GET /api/dashboard/stats
 * Aggregates all data needed for the premium dashboard.
 */
export const GET = withAuth(async (req, { user }) => {
  try {
    const companyId = user.company_id;
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const baseDate = dateParam ? new Date(dateParam) : new Date();
    
    console.log(`[DashboardStats] BASE DATE: ${baseDate.toISOString()}, COMPANY: ${companyId}`);
    
    const currentMonthStart = startOfMonth(baseDate);
    const currentMonthEnd = endOfMonth(baseDate);
    
    // 1. Fetch KPIs (Global/Total for testing, or very broad range)
    const [caStats, chargesStats, invoiceStats, bankBalance, company] = await Promise.all([
      prisma.journalLine.aggregate({
        where: {
          company_id: companyId,
          account_code: { startsWith: "7" },
        },
        _sum: { credit: true, debit: true }
      }),
      prisma.journalLine.aggregate({
        where: {
          company_id: companyId,
          account_code: { startsWith: "6" },
        },
        _sum: { debit: true, credit: true }
      }),
      prisma.invoice.aggregate({
        where: {
          company_id: companyId,
          type: "invoice",
          status: { in: ["draft", "sent", "viewed", "overdue"] }
        },
        _sum: { total_ttc: true },
        _count: { id: true }
      }),
      prisma.journalLine.aggregate({
        where: {
          company_id: companyId,
          account_code: { startsWith: "5" },
        },
        _sum: { debit: true, credit: true }
      }),
      prisma.company.findUnique({
        where: { id: companyId },
        select: { initial_treasury_balance: true }
      })
    ]);

    const totalCa = toNumber(caStats._sum.credit) - toNumber(caStats._sum.debit);
    const totalCharges = toNumber(chargesStats._sum.debit) - toNumber(chargesStats._sum.credit);
    const calculatedTreasury = toNumber(bankBalance._sum.debit) - toNumber(bankBalance._sum.credit);
    const treasury = calculatedTreasury + toNumber(company?.initial_treasury_balance ?? 0);

    // 1b. Fetch KPIs for PREVIOUS month for growth calculation
    const prevMonthStart = startOfMonth(subMonths(baseDate, 1));
    const prevMonthEnd = endOfMonth(subMonths(baseDate, 1));
    const [prevCaStats, prevChargesStats] = await Promise.all([
      prisma.journalLine.aggregate({
        where: {
          company_id: companyId,
          account_code: { startsWith: "7" },
          entry: { date: { gte: prevMonthStart, lte: prevMonthEnd } }
        },
        _sum: { credit: true, debit: true }
      }),
      prisma.journalLine.aggregate({
        where: {
          company_id: companyId,
          account_code: { startsWith: "6" },
          entry: { date: { gte: prevMonthStart, lte: prevMonthEnd } }
        },
        _sum: { debit: true, credit: true }
      })
    ]);

    const prevCa = toNumber(prevCaStats._sum.credit) - toNumber(prevCaStats._sum.debit);
    const prevCharges = toNumber(prevChargesStats._sum.debit) - toNumber(prevChargesStats._sum.credit);

    const calculateGrowth = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - prev) / prev) * 100);
    };

    // 2. Monthly History (Last 12 months)
    // ... (rest of the history logic is already real)
    const monthlyHistory = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(baseDate, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);

      const [mCa, mCharges] = await Promise.all([
        prisma.journalLine.aggregate({
          where: {
            company_id: companyId,
            account_code: { startsWith: "7" },
            entry: { date: { gte: start, lte: end } }
          },
          _sum: { credit: true, debit: true }
        }),
        prisma.journalLine.aggregate({
          where: {
            company_id: companyId,
            account_code: { startsWith: "6" },
            entry: { date: { gte: start, lte: end } }
          },
          _sum: { debit: true, credit: true }
        })
      ]);

      monthlyHistory.push({
        month: format(monthDate, "MMM", { locale: fr }),
        ca: toNumber(mCa._sum.credit) - toNumber(mCa._sum.debit),
        charges: toNumber(mCharges._sum.debit) - toNumber(mCharges._sum.credit)
      });
    }

    // 3. Expenses Breakdown
    // ... (already real)
    const expenseGroups = await prisma.journalLine.groupBy({
      by: ["account_code"],
      where: {
        company_id: companyId,
        account_code: { startsWith: "6" },
        entry: { date: { gte: currentMonthStart, lte: currentMonthEnd } }
      },
      _sum: { debit: true, credit: true }
    });

    const breakdownMap: Record<string, number> = {};
    const COLORS = ["hsl(var(--primary))", "hsl(var(--warning))", "hsl(var(--success))", "hsl(var(--destructive))", "hsl(var(--info))", "hsl(220 9% 46%)"];
    
    expenseGroups.forEach(g => {
      const categoryCode = g.account_code.substring(0, 3);
      const amount = toNumber(g._sum.debit) - toNumber(g._sum.credit);
      breakdownMap[categoryCode] = (breakdownMap[categoryCode] || 0) + amount;
    });

    const categoryCodes = Object.keys(breakdownMap);
    const categoryAccounts = await prisma.account.findMany({
      where: { code: { in: categoryCodes }, company_id: companyId }
    });
    const categoryNames = new Map(categoryAccounts.map(a => [a.code, a.name]));

    const expensesBreakdown = categoryCodes.map((code, index) => ({
      name: categoryNames.get(code) || `Catégorie ${code}`,
      value: breakdownMap[code],
      color: COLORS[index % COLORS.length]
    })).sort((a, b) => b.value - a.value);

    // 4. Recent Invoices (strictly invoices, excluding quotes and credit notes)
    const recentInvoices = await prisma.invoice.findMany({
      where: { company_id: companyId, type: "invoice" },
      orderBy: { created_at: "desc" },
      take: 5,
      select: {
        id: true,
        reference: true,
        issue_date: true,
        total_ttc: true,
        status: true,
        client: { select: { name: true } }
      }
    });

    // 5. VAT Estimation
    const [vatCollected, vatDeductible] = await Promise.all([
      prisma.journalLine.aggregate({
        where: {
          company_id: companyId,
          account_code: { startsWith: "4457" },
          entry: { date: { gte: currentMonthStart, lte: currentMonthEnd } }
        },
        _sum: { credit: true, debit: true }
      }),
      prisma.journalLine.aggregate({
        where: {
          company_id: companyId,
          account_code: { startsWith: "4456" },
          entry: { date: { gte: currentMonthStart, lte: currentMonthEnd } }
        },
        _sum: { debit: true, credit: true }
      })
    ]);

    const estimatedVat = (toNumber(vatCollected._sum.credit) - toNumber(vatCollected._sum.debit)) - 
                       (toNumber(vatDeductible._sum.debit) - toNumber(vatDeductible._sum.credit));

    // 6. Sparkline data (Last 10 days)
    const sparks = { ca: [], charges: [] };
    for (let i = 9; i >= 0; i--) {
      const d = subDays(baseDate, i);
      const s = startOfDay(d);
      const e = endOfDay(d);
      
      const [dayCa, dayCharges] = await Promise.all([
        prisma.journalLine.aggregate({
          where: { company_id: companyId, account_code: { startsWith: "7" }, entry: { date: { gte: s, lte: e } } },
          _sum: { credit: true, debit: true }
        }),
        prisma.journalLine.aggregate({
          where: { company_id: companyId, account_code: { startsWith: "6" }, entry: { date: { gte: s, lte: e } } },
          _sum: { debit: true, credit: true }
        })
      ]);

      sparks.ca.push({ v: toNumber(dayCa._sum.credit) - toNumber(dayCa._sum.debit) });
      sparks.charges.push({ v: toNumber(dayCharges._sum.debit) - toNumber(dayCharges._sum.credit) });
    }

    const result = {
      kpis: {
        ca: totalCa,
        caGrowth: calculateGrowth(totalCa, prevCa),
        caSpark: sparks.ca,
        charges: totalCharges,
        chargesGrowth: calculateGrowth(totalCharges, prevCharges),
        chargesSpark: sparks.charges,
        netResult: totalCa - totalCharges,
        netResultGrowth: calculateGrowth(totalCa - totalCharges, prevCa - prevCharges),
        tresorerie: treasury,
        tresorerieGrowth: 0, 
        tvaAPayer: Math.max(0, estimatedVat),
        facturesImpayees: invoiceStats._count.id,
        facturesImpayeesMontant: toNumber(invoiceStats._sum.total_ttc)
      },
      monthlyRevenue: monthlyHistory,
      expenseBreakdown: expensesBreakdown.length > 0 ? expensesBreakdown : [{ name: "Aucune dépense", value: 0, color: COLORS[5] }],
      invoices: recentInvoices.map(inv => ({
        id: inv.reference,
        client: inv.client?.name || "Client inconnu",
        date: inv.issue_date,
        montantTTC: toNumber(inv.total_ttc),
        status: inv.status
      }))
    };

    console.log(`[DashboardStats] Computed CA: ${result.kpis.ca}, Invoices: ${result.kpis.facturesImpayees}`);

    return successJson(result);
  } catch (err) {
    return handlePrismaError(err);
  }
});
