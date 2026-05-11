/**
 * Pure accounting business logic — no Prisma, no side effects.
 * All amounts use number (converted from Prisma Decimal before calling).
 */

import type { JournalLine, Invoice, InvoicePayment } from "@prisma/client";

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

// ─── Double-entry validation ──────────────────────────────────────────────────

/**
 * Validates that total debits === total credits (balanced journal entry).
 * Uses tolerance of 0.01 for rounding.
 */
export function validateDoubleEntry(
  lines: Array<{ debit: number; credit: number }>
): { isValid: boolean; totalDebit: number; totalCredit: number; difference: number } {
  const totalDebit = lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (l.credit || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  return { isValid: difference < 0.01, totalDebit, totalCredit, difference };
}

// ─── Balance calculation ──────────────────────────────────────────────────────

/**
 * Calculates the final balance of an account.
 * Assets & Expenses: normal debit balance (debit - credit)
 * Liabilities, Equity & Revenue: normal credit balance (credit - debit)
 */
export function calculateAccountBalance(
  accountType: AccountType,
  debits: number,
  credits: number
): number {
  switch (accountType) {
    case "asset":
    case "expense":
      return debits - credits;
    case "liability":
    case "equity":
    case "revenue":
      return credits - debits;
    default:
      return debits - credits;
  }
}

// ─── Invoice reference generation ─────────────────────────────────────────────

/**
 * Generates a legal invoice reference with an uninterrupted sequence.
 * e.g. FAC-2026-00042
 */
export function generateInvoiceReference(
  prefix: string,
  sequence: number,
  year: number = new Date().getFullYear()
): string {
  const seq = String(sequence).padStart(5, "0");
  return `${prefix}-${year}-${seq}`;
}

// ─── TVA calculation ──────────────────────────────────────────────────────────

export function calculateVatDue(
  vatCollected: number,
  vatDeductible: number
): number {
  return Math.max(0, vatCollected - vatDeductible);
}

export function calculateVatCredit(
  vatCollected: number,
  vatDeductible: number
): number {
  return Math.max(0, vatDeductible - vatCollected);
}

// ─── Third-party balance ──────────────────────────────────────────────────────

/**
 * Calculates the outstanding balance of a third party (client or supplier)
 * from their journal lines. For clients (account 411): debit - credit.
 */
export function calculateThirdPartyBalance(
  lines: Array<{ debit: number | { toNumber(): number }; credit: number | { toNumber(): number } }>
): number {
  return lines.reduce((sum, l) => {
    const debit = typeof l.debit === "object" ? l.debit.toNumber() : l.debit;
    const credit = typeof l.credit === "object" ? l.credit.toNumber() : l.credit;
    return sum + debit - credit;
  }, 0);
}

// ─── Invoice overdue check ────────────────────────────────────────────────────

export function isInvoiceOverdue(dueDate: Date): boolean {
  return new Date() > new Date(dueDate);
}

// ─── Payment entries generation ───────────────────────────────────────────────

export type PaymentEntryLine = {
  account_code: string;
  debit: number;
  credit: number;
  description: string;
};

/**
 * Generates the journal lines for a payment of a client invoice.
 * Debit 512 (bank) / Credit 411 (client receivable)
 */
export function generatePaymentEntryLines(params: {
  amount: number;
  client_id: string;
  payment_method: string;
}): any[] {
  // Determine debit account based on payment method
  const bankAccount = params.payment_method === "cash" ? "530" : "512";

  return [
    {
      account_code: bankAccount,
      debit: params.amount,
      credit: 0,
      description: "Encaissement client",
    },
    {
      account_code: "411",
      debit: 0,
      credit: params.amount,
      third_party: params.client_id,
      description: "Règlement facture",
    },
  ];
}

/**
 * Generates JournalLines for a sales entry from an invoice.
 */
export function generateSalesEntryLines(invoice: {
  client_id: string;
  subtotal_ht: number;
  vat_amount: number;
  total_ttc: number;
  lines: Array<{ accounting_account?: string }>;
}): any[] {
  const revenueAccount = invoice.lines[0]?.accounting_account ?? "706";

  return [
    {
      account_code: "411",
      debit: invoice.total_ttc,
      credit: 0,
      third_party: invoice.client_id,
      description: "Créance client",
    },
    {
      account_code: revenueAccount,
      debit: 0,
      credit: invoice.subtotal_ht,
      description: "Chiffre d'affaires",
    },
    ...(invoice.vat_amount > 0
      ? [
          {
            account_code: "4457",
            debit: 0,
            credit: invoice.vat_amount,
            description: "TVA sur ventes",
          },
        ]
      : []),
  ];
}

/**
 * Generates JournalLines for a credit note (reversal).
 */
export function generateCreditNoteEntryLines(invoice: {
  client_id: string;
  subtotal_ht: number;
  vat_amount: number;
  total_ttc: number;
  lines: Array<{ accounting_account?: string }>;
}): any[] {
  const revenueAccount = invoice.lines[0]?.accounting_account ?? "706";

  return [
    {
      account_code: "411",
      debit: 0,
      credit: invoice.total_ttc,
      third_party: invoice.client_id,
      description: "Avoir client - Diminution créance",
    },
    {
      account_code: revenueAccount,
      debit: invoice.subtotal_ht,
      credit: 0,
      description: "Avoir client - Réduction CA",
    },
    ...(invoice.vat_amount > 0
      ? [
          {
            account_code: "4457",
            debit: invoice.vat_amount,
            credit: 0,
            description: "Avoir client - Régularisation TVA",
          },
        ]
      : []),
  ];
}

// ─── Payroll calculation ──────────────────────────────────────────────────────

export interface PayrollDeductionInput {
  label: string;
  rate: number; // percentage
  base: number;
}

export interface PayrollResult {
  gross_salary: number;
  net_salary: number;
  employer_cost: number;
  deductions: Array<{ label: string; rate: number; base: number; amount: number }>;
  contributions: Array<{ label: string; rate: number; base: number; amount: number }>;
}

/**
 * Applies standard French payroll deductions and employer contributions.
 * Rates as of 2024 (approximative — should be configurable in production).
 */
export function calculatePayroll(baseSalary: number): PayrollResult {
  const gross = baseSalary; // simplified: no overtime

  const deductionRates: PayrollDeductionInput[] = [
    { label: "Sécurité sociale maladie", rate: 0.75, base: gross },
    { label: "Sécurité sociale vieillesse", rate: 6.9, base: gross },
    { label: "Retraite complémentaire", rate: 3.15, base: gross },
    { label: "Chômage", rate: 2.4, base: gross },
    { label: "CSG déductible", rate: 6.8, base: gross * 0.9825 },
    { label: "CSG/CRDS non déductible", rate: 2.9, base: gross * 0.9825 },
  ];

  const deductions = deductionRates.map((d) => ({
    label: d.label,
    rate: d.rate,
    base: d.base,
    amount: round2(d.base * (d.rate / 100)),
  }));

  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const netSalary = round2(gross - totalDeductions);

  // Employer contributions ~45% of gross (simplified)
  const employerRate = 45;
  const employerContribAmount = round2(gross * (employerRate / 100));
  const contributions = [
    {
      label: "Cotisations patronales (global)",
      rate: employerRate,
      base: gross,
      amount: employerContribAmount,
    },
  ];

  return {
    gross_salary: round2(gross),
    net_salary: netSalary,
    employer_cost: round2(gross + employerContribAmount),
    deductions,
    contributions,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────


// ─── VAT Aggregation ──────────────────────────────────────────────────────────

/**
 * Aggregates ledger data for a specific period to calculate VAT.
 */
export async function calculateVatForPeriod(
  prisma: any,
  companyId: string,
  start: Date,
  end: Date
) {
  const lines = await prisma.journalLine.findMany({
    where: {
      entry: {
        company_id: companyId,
        status: { in: ["posted", "validated"] },
        date: { gte: start, lte: end },
      },
    },
    select: {
      account_code: true,
      debit: true,
      credit: true,
    },
  });

  let vatCollected = 0;
  let vatDeductible = 0;
  let caHt = 0;
  let purchasesHt = 0;

  const details: any[] = [];

  for (const line of lines) {
    const debit = typeof line.debit === "object" ? (line.debit as any).toNumber() : Number(line.debit);
    const credit = typeof line.credit === "object" ? (line.credit as any).toNumber() : Number(line.credit);

    if (line.account_code.startsWith("4457")) {
      vatCollected += credit;
      details.push({ account_code: line.account_code, amount: credit, type: "collected" });
    } else if (line.account_code.startsWith("4456")) {
      vatDeductible += debit;
      details.push({ account_code: line.account_code, amount: debit, type: "deductible" });
    } else if (line.account_code.startsWith("7")) {
      caHt += credit;
    } else if (line.account_code.startsWith("6")) {
      purchasesHt += debit;
    }
  }

  return {
    period_start: start,
    period_end: end,
    ca_ht: caHt,
    vat_collected: vatCollected,
    purchases_ht: purchasesHt,
    vat_deductible: vatDeductible,
    vat_due: Math.max(0, vatCollected - vatDeductible),
    vat_credit: Math.max(0, vatDeductible - vatCollected),
    line_details: details,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Safely converts a Prisma Decimal or number to a JS number.
 */
export function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "object" && "toNumber" in (value as object)) {
    return (value as { toNumber(): number }).toNumber();
  }
  return parseFloat(String(value)) || 0;
}
