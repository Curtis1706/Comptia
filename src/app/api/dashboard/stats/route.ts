import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { canRead } from "@/lib/permissions";
import { successJson, handlePrismaError } from "@/lib/api-response";
import { toNumber, calculateVatForPeriod } from "@/lib/accounting";
import { startOfMonth, endOfMonth, subMonths, format, subDays, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * GET /api/dashboard/stats
 * Aggregates dashboard data based on derived read permissions.
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "dashboard", "read");
  if (!permCheck.ok) return permCheck.response;

  const { user, matrix } = permCheck;
  const companyId = user.company_id;

  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const baseDate = dateParam ? new Date(dateParam) : new Date();

    const currentMonthStart = startOfMonth(baseDate);
    const currentMonthEnd = endOfMonth(baseDate);

    const available: string[] = ["dashboard"];

    const hasInvoices = canRead(matrix, user.role, "invoices");
    const hasAccounting = canRead(matrix, user.role, "accounting_entries");
    const hasBank = canRead(matrix, user.role, "bank_reconciliation");
    const hasVat = canRead(matrix, user.role, "vat_declarations");
    const hasPayroll = canRead(matrix, user.role, "payroll");

    if (hasInvoices) available.push("invoices");
    if (hasAccounting) available.push("accounting_entries");
    if (hasBank) available.push("bank_reconciliation");
    if (hasVat) available.push("vat_declarations");
    if (hasPayroll) available.push("payroll");

    // 1. Accounting KPIs
    let totalCa = 0;
    let totalCharges = 0;
    let prevCa = 0;
    let prevCharges = 0;
    let monthlyHistory: any[] = [];
    let expensesBreakdown: any[] = [];
    let sparks = { ca: [] as any[], charges: [] as any[] };

    if (hasAccounting) {
      const [caStats, chargesStats] = await Promise.all([
        prisma.journalLine.aggregate({
          where: {
            company_id: companyId,
            account_code: { startsWith: "7" },
            entry: { status: { in: ["posted", "validated"] } },
          },
          _sum: { credit: true, debit: true },
        }),
        prisma.journalLine.aggregate({
          where: {
            company_id: companyId,
            account_code: { startsWith: "6" },
            entry: { status: { in: ["posted", "validated"] } },
          },
          _sum: { debit: true, credit: true },
        }),
      ]);

      totalCa = toNumber(caStats._sum.credit) - toNumber(caStats._sum.debit);
      totalCharges = toNumber(chargesStats._sum.debit) - toNumber(chargesStats._sum.credit);

      const prevMonthStart = startOfMonth(subMonths(baseDate, 1));
      const prevMonthEnd = endOfMonth(subMonths(baseDate, 1));
      const [prevCaStats, prevChargesStats] = await Promise.all([
        prisma.journalLine.aggregate({
          where: {
            company_id: companyId,
            account_code: { startsWith: "7" },
            entry: { status: { in: ["posted", "validated"] }, date: { gte: prevMonthStart, lte: prevMonthEnd } },
          },
          _sum: { credit: true, debit: true },
        }),
        prisma.journalLine.aggregate({
          where: {
            company_id: companyId,
            account_code: { startsWith: "6" },
            entry: { status: { in: ["posted", "validated"] }, date: { gte: prevMonthStart, lte: prevMonthEnd } },
          },
          _sum: { debit: true, credit: true },
        }),
      ]);

      prevCa = toNumber(prevCaStats._sum.credit) - toNumber(prevCaStats._sum.debit);
      prevCharges = toNumber(prevChargesStats._sum.debit) - toNumber(prevChargesStats._sum.credit);

      // Monthly History
      for (let i = 11; i >= 0; i--) {
        const monthDate = subMonths(baseDate, i);
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);

        const [mCa, mCharges] = await Promise.all([
          prisma.journalLine.aggregate({
            where: {
              company_id: companyId,
              account_code: { startsWith: "7" },
              entry: { status: { in: ["posted", "validated"] }, date: { gte: start, lte: end } },
            },
            _sum: { credit: true, debit: true },
          }),
          prisma.journalLine.aggregate({
            where: {
              company_id: companyId,
              account_code: { startsWith: "6" },
              entry: { status: { in: ["posted", "validated"] }, date: { gte: start, lte: end } },
            },
            _sum: { debit: true, credit: true },
          }),
        ]);

        monthlyHistory.push({
          month: format(monthDate, "MMM", { locale: fr }),
          ca: toNumber(mCa._sum.credit) - toNumber(mCa._sum.debit),
          charges: toNumber(mCharges._sum.debit) - toNumber(mCharges._sum.credit),
        });
      }

      // Expenses breakdown
      const expenseGroups = await prisma.journalLine.groupBy({
        by: ["account_code"],
        where: {
          company_id: companyId,
          account_code: { startsWith: "6" },
          entry: { status: { in: ["posted", "validated"] }, date: { gte: currentMonthStart, lte: currentMonthEnd } },
        },
        _sum: { debit: true, credit: true },
      });

      const breakdownMap: Record<string, number> = {};
      const COLORS = [
        "hsl(var(--primary))",
        "hsl(var(--warning))",
        "hsl(var(--success))",
        "hsl(var(--destructive))",
        "hsl(var(--info))",
        "hsl(220 9% 46%)",
      ];

      expenseGroups.forEach((g) => {
        const categoryCode = g.account_code.substring(0, 3);
        const amount = toNumber(g._sum.debit) - toNumber(g._sum.credit);
        breakdownMap[categoryCode] = (breakdownMap[categoryCode] || 0) + amount;
      });

      const categoryCodes = Object.keys(breakdownMap);
      const categoryAccounts = await prisma.account.findMany({
        where: { code: { in: categoryCodes }, company_id: companyId },
      });
      const categoryNames = new Map(categoryAccounts.map((a) => [a.code, a.name]));

      expensesBreakdown = categoryCodes
        .map((code, index) => ({
          name: categoryNames.get(code) || `Catégorie ${code}`,
          value: breakdownMap[code],
          color: COLORS[index % COLORS.length],
        }))
        .sort((a, b) => b.value - a.value);

      // Sparks
      for (let i = 9; i >= 0; i--) {
        const d = subDays(baseDate, i);
        const s = startOfDay(d);
        const e = endOfDay(d);

        const [dayCa, dayCharges] = await Promise.all([
          prisma.journalLine.aggregate({
            where: {
              company_id: companyId,
              account_code: { startsWith: "7" },
              entry: { status: { in: ["posted", "validated"] }, date: { gte: s, lte: e } },
            },
            _sum: { credit: true, debit: true },
          }),
          prisma.journalLine.aggregate({
            where: {
              company_id: companyId,
              account_code: { startsWith: "6" },
              entry: { status: { in: ["posted", "validated"] }, date: { gte: s, lte: e } },
            },
            _sum: { debit: true, credit: true },
          }),
        ]);

        sparks.ca.push({ v: toNumber(dayCa._sum.credit) - toNumber(dayCa._sum.debit) });
        sparks.charges.push({ v: toNumber(dayCharges._sum.debit) - toNumber(dayCharges._sum.credit) });
      }
    }

    // 2. Invoices
    let invoiceStats = { _sum: { total_ttc: 0 }, _count: { id: 0 } };
    let recentInvoices: any[] = [];
    if (hasInvoices) {
      const [invAgg, invList] = await Promise.all([
        prisma.invoice.aggregate({
          where: {
            company_id: companyId,
            type: "invoice",
            status: { in: ["draft", "sent", "viewed", "overdue"] },
          },
          _sum: { total_ttc: true },
          _count: { id: true },
        }),
        prisma.invoice.findMany({
          where: { company_id: companyId, type: "invoice" },
          orderBy: { created_at: "desc" },
          take: 5,
          select: {
            id: true,
            reference: true,
            issue_date: true,
            total_ttc: true,
            status: true,
            client: { select: { name: true } },
          },
        }),
      ]);
      invoiceStats = invAgg as any;
      recentInvoices = invList;
    }

    // 3. Treasury (Bank Reconciliation)
    let treasury = 0;
    if (hasBank) {
      const [bankBalance, company] = await Promise.all([
        prisma.journalLine.aggregate({
          where: {
            company_id: companyId,
            account_code: { startsWith: "5" },
            entry: { status: { in: ["posted", "validated"] } },
          },
          _sum: { debit: true, credit: true },
        }),
        prisma.company.findUnique({
          where: { id: companyId },
          select: { initial_treasury_balance: true },
        }),
      ]);
      const calculatedTreasury = toNumber(bankBalance._sum.debit) - toNumber(bankBalance._sum.credit);
      treasury = calculatedTreasury + toNumber(company?.initial_treasury_balance ?? 0);
    }

    // 4. VAT
    let estimatedVat = 0;
    if (hasVat) {
      const vatData = await calculateVatForPeriod(
        prisma,
        companyId,
        currentMonthStart,
        currentMonthEnd
      );
      estimatedVat = vatData.vat_due;
    }

    // 5. Payroll
    let payrollTotal = 0;
    if (hasPayroll) {
      const payrollAgg = await prisma.payroll.aggregate({
        where: {
          company_id: companyId,
          status: { in: ["validated", "processed"] },
        },
        _sum: { net_salary: true },
      });
      payrollTotal = toNumber(payrollAgg._sum.net_salary);
    }

    const calculateGrowth = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - prev) / prev) * 100);
    };

    const result = {
      available,
      kpis: {
        ca: hasAccounting ? totalCa : 0,
        caGrowth: hasAccounting ? calculateGrowth(totalCa, prevCa) : 0,
        caSpark: sparks.ca,
        charges: hasAccounting ? totalCharges : 0,
        chargesGrowth: hasAccounting ? calculateGrowth(totalCharges, prevCharges) : 0,
        chargesSpark: sparks.charges,
        netResult: hasAccounting ? totalCa - totalCharges : 0,
        netResultGrowth: hasAccounting ? calculateGrowth(totalCa - totalCharges, prevCa - prevCharges) : 0,
        tresorerie: hasBank ? treasury : 0,
        tresorerieGrowth: 0,
        tvaAPayer: hasVat ? Math.max(0, estimatedVat) : 0,
        facturesImpayees: hasInvoices ? invoiceStats._count.id : 0,
        facturesImpayeesMontant: hasInvoices ? toNumber(invoiceStats._sum.total_ttc) : 0,
        payrollTotal: hasPayroll ? payrollTotal : 0,
      },
      monthlyRevenue: hasAccounting ? monthlyHistory : [],
      expenseBreakdown:
        expensesBreakdown.length > 0 ? expensesBreakdown : [{ name: "Aucune dépense", value: 0, color: "hsl(var(--muted))" }],
      invoices: hasInvoices
        ? recentInvoices.map((inv) => ({
            id: inv.reference,
            client: inv.client?.name || "Client inconnu",
            date: inv.issue_date,
            montantTTC: toNumber(inv.total_ttc),
            status: inv.status,
          }))
        : [],
    };

    return successJson(result);
  } catch (err) {
    return handlePrismaError(err);
  }
}
