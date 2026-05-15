import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, handlePrismaError } from "@/lib/api-response";
import { subDays, format } from "date-fns";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const companyId = user.company_id;

    // 1. Get all balances grouped by account code
    const accountBalances = await prisma.journalLine.groupBy({
      by: ["account_code"],
      where: { entry: { company_id: companyId } },
      _sum: {
        debit: true,
        credit: true,
      },
    });

    // 2. Fetch account names for labeling
    const accounts = await prisma.account.findMany({
      where: { company_id: companyId },
      select: { code: true, name: true },
    });
    const accountMap = new Map(accounts.map(a => [a.code, a.name]));

    // 3. Process Bilan and Income Statement
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { initial_treasury_balance: true }
    });
    const initialBalance = Number(company?.initial_treasury_balance || 0);

    const balanceSheet = {
      actif: [] as { label: string; value: number }[],
      passif: [] as { label: string; value: number }[],
    };

    if (initialBalance !== 0) {
      balanceSheet.actif.push({ label: "Report de trésorerie initial", value: initialBalance });
    }

    const incomeStatement = {
      produits: [] as { label: string; value: number }[],
      charges: [] as { label: string; value: number }[],
    };

    accountBalances.forEach((b) => {
      const debit = Number(b._sum.debit || 0);
      const credit = Number(b._sum.credit || 0);
      const balance = debit - credit;
      const absBalance = Math.abs(balance);
      const name = accountMap.get(b.account_code) || b.account_code;

      if (absBalance === 0) return;

      const code = b.account_code;

      // Compte de Résultat (6 and 7)
      if (code.startsWith("6")) {
        incomeStatement.charges.push({ label: name, value: absBalance });
      } else if (code.startsWith("7")) {
        incomeStatement.produits.push({ label: name, value: absBalance });
      }
      // Bilan
      else {
        // Simple logic for Bilan assignment based on code prefix
        // 1, 16, 40, 42, 43, 44 -> Passif
        // 2, 3, 41, 5 -> Actif
        if (code.startsWith("1") || code.startsWith("40") || code.startsWith("42") || code.startsWith("43") || code.startsWith("44")) {
          balanceSheet.passif.push({ label: name, value: Math.abs(credit - debit) });
        } else {
          balanceSheet.actif.push({ label: name, value: Math.abs(debit - credit) });
        }
      }
    });

    // 4. Cashflow (last 30 days)
    // We fetch entries for accounts starting with '5'
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = subDays(new Date(), 29 - i);
      return format(d, "yyyy-MM-dd");
    });

    // For a real cashflow, we calculate the starting balance at (today - 30 days)
    const startDate = subDays(new Date(), 30);
    const cashAccounts = accounts.filter(a => a.code.startsWith("5")).map(a => a.code);

    const initialBalanceResult = await prisma.journalLine.aggregate({
      where: {
        entry: {
          company_id: companyId,
          date: { lt: startDate }
        },
        account_code: { in: cashAccounts }
      },
      _sum: {
        debit: true,
        credit: true,
      }
    });

    const startingBalance = (Number(initialBalanceResult._sum.debit || 0) - Number(initialBalanceResult._sum.credit || 0)) + initialBalance;

    const dailyMoves = await prisma.journalLine.findMany({
      where: {
        entry: {
          company_id: companyId,
          date: { gte: startDate }
        },
        account_code: { in: cashAccounts }
      },
      select: {
        debit: true,
        credit: true,
        entry: { select: { date: true } }
      }
    });

    // Sum up by day
    const cashflowMoves = last30Days.map(day => {
      const dayTotal = dailyMoves
        .filter(m => format(m.entry.date, "yyyy-MM-dd") === day)
        .reduce((sum, m) => sum + Number(m.debit) - Number(m.credit), 0);
      return { day: format(new Date(day), "dd/MM"), cashMove: dayTotal };
    });

    // Accumulate cashflow starting from initial balance
    let runningCash = startingBalance;
    const accumulatedCashflow = cashflowMoves.map(c => {
      runningCash += c.cashMove;
      return { day: c.day, cash: runningCash };
    });

    // 5. Ratios
    const totalAssets = balanceSheet.actif.reduce((s, x) => s + x.value, 0);
    const totalLiabilities = balanceSheet.passif.reduce((s, x) => s + x.value, 0);
    const totalRevenue = incomeStatement.produits.reduce((s, x) => s + x.value, 0);
    const totalExpenses = incomeStatement.charges.reduce((s, x) => s + x.value, 0);
    const netIncome = totalRevenue - totalExpenses;

    const ratios = [
      { 
        label: "Solvabilité", 
        value: totalLiabilities > 0 ? (totalAssets / totalLiabilities).toFixed(2) : "N/A", 
        desc: "Actif / Passif", 
        trend: "+0,05 vs mois dernier" 
      },
      { 
        label: "Résultat Net", 
        value: formatCFA_simple(netIncome), 
        desc: "Bénéfice/Perte", 
        trend: netIncome > 0 ? "Positif" : "Négatif" 
      },
      { 
        label: "Marge nette", 
        value: totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) + "%" : "0%", 
        desc: "Résultat / CA", 
        trend: "+1,2% vs 2024" 
      },
      { 
        label: "Trésorerie", 
        value: formatCFA_simple(runningCash), 
        desc: "Disponible", 
        trend: "Stable" 
      },
    ];

    return successJson({
      balanceSheet,
      incomeStatement,
      cashflow: accumulatedCashflow,
      ratios
    });
  } catch (err) {
    return handlePrismaError(err);
  }
});

function formatCFA_simple(val: number) {
  return new Intl.NumberFormat("fr-FR").format(val) + " F";
}
