/**
 * Pure accounting business logic — SYSCOHADA révisé & République du Bénin.
 * All amounts use number (converted from Prisma Decimal before calling).
 */

import type { JournalLine, Invoice, InvoicePayment } from "@prisma/client";
import {
  CNSS_CEILING_MONTHLY,
  CNSS_EMPLOYEE_RATE,
  CNSS_EMPLOYER_RATE,
  VPS_RATE,
  IPTS_PROFESSIONAL_ALLOWANCE_RATE,
  IPTS_BRACKETS,
} from "@/constants/payroll";

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

// ─── Statuts comptabilisés ───────────────────────────────────────────────────

/**
 * Statuts d'écriture pris en compte dans les calculs comptables.
 * Les brouillons (draft) sont exclus : ils ne sont pas comptabilisés.
 */
export const POSTED_STATUSES = ["posted", "validated"] as const;

/**
 * Clause Prisma réutilisable pour filtrer les lignes d'écriture
 * sur les seules écritures comptabilisées d'une entreprise.
 */
export function postedEntryFilter(companyId: string) {
  return {
    company_id: companyId,
    status: { in: [...POSTED_STATUSES] },
  };
}

// ─── Double-entry validation ──────────────────────────────────────────────────

/**
 * Validates that total debits === total credits (balanced journal entry)
 * and that the amount is strictly non-zero.
 */
export function validateDoubleEntry(
  lines: Array<{ debit: number; credit: number }>
): {
  isValid: boolean;
  isBalanced: boolean;
  isNonZero: boolean;
  totalDebit: number;
  totalCredit: number;
  difference: number;
} {
  const totalDebit = lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (l.credit || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference < 0.01;
  const isNonZero = totalDebit >= 0.01;
  return {
    isValid: isBalanced && isNonZero,
    isBalanced,
    isNonZero,
    totalDebit,
    totalCredit,
    difference,
  };
}

// ─── Séquence des écritures comptables ────────────────────────────────────────

/**
 * Génère la prochaine référence séquentielle pour un journal donné.
 * Format : {PREFIX}-{ANNEE}-{NUMERO sur 5 chiffres}
 * Exemple : VAT-2026-00001
 *
 * À appeler DANS une transaction Prisma pour éviter les collisions.
 */
export async function nextEntryReference(
  tx: any,
  companyId: string,
  prefix: string,
  date: Date = new Date()
): Promise<string> {
  const year = date.getFullYear();
  const pattern = `${prefix}-${year}-`;

  const last = await tx.journalEntry.findFirst({
    where: {
      company_id: companyId,
      reference: { startsWith: pattern },
    },
    orderBy: { reference: "desc" },
    select: { reference: true },
  });

  const lastNumber = last
    ? parseInt(last.reference.slice(pattern.length), 10) || 0
    : 0;

  return `${pattern}${String(lastNumber + 1).padStart(5, "0")}`;
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

// ─── Payment entries generation (SYSCOHADA Bénin) ─────────────────────────────

export type PaymentEntryLine = {
  account_code: string;
  debit: number;
  credit: number;
  description: string;
  third_party?: string;
};

/**
 * Maps a payment method to its appropriate SYSCOHADA treasury account.
 * - cash -> 571 (Caisse siège social — SYSCOHADA Révisé compte 57)
 * - bank_transfer, credit_card, western_union -> 521 (Banques locales)
 * - check -> 511 (Effets / Valeurs à encaisser)
 * - mobile_money_mtn, mobile_money_moov, mobile_money_celtiis -> 585 (Mobile Money / Transferts électroniques)
 */
export function getTreasuryAccountForPaymentMethod(paymentMethod?: string | null): string {
  switch (paymentMethod) {
    case "cash":
      return "571";
    case "check":
      return "511";
    case "mobile_money_mtn":
    case "mobile_money_moov":
    case "mobile_money_celtiis":
      return "585";
    case "bank_transfer":
    case "credit_card":
    case "western_union":
    default:
      return "521";
  }
}

/**
 * Détermine le journal comptable adéquat pour un mode de règlement :
 * - cash -> "cash" (Journal de Caisse)
 * - autres -> "bank" (Journal de Banque)
 */
export function getJournalForPaymentMethod(paymentMethod?: string | null): "bank" | "cash" {
  return paymentMethod === "cash" ? "cash" : "bank";
}

/**
 * Generates the journal lines for a payment of a client invoice.
 * Debit Treasury (521/571/585/511) / Credit 411 (Clients)
 */
export function generatePaymentEntryLines(params: {
  amount: number;
  client_id: string;
  payment_method?: string | null;
}): PaymentEntryLine[] {
  const treasuryAccount = getTreasuryAccountForPaymentMethod(params.payment_method);

  return [
    {
      account_code: treasuryAccount,
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
 * Generates JournalLines for a sales entry from an invoice (SYSCOHADA).
 * Debit 411 (Clients) / Credit 70x (Ventes), Credit 4431 (TVA facturée) et Credit 4471 (AIB collecté)
 */
export function generateSalesEntryLines(invoice: {
  client_id: string;
  subtotal_ht: number;
  vat_amount: number;
  total_ttc: number;
  aib_amount?: number;
  lines: Array<{ accounting_account?: string }>;
}): any[] {
  const revenueAccount = invoice.lines[0]?.accounting_account ?? "706";
  const aib = Number(invoice.aib_amount || 0);
  const totalDebit = invoice.total_ttc + (aib > 0 && Math.abs(invoice.total_ttc - (invoice.subtotal_ht + invoice.vat_amount)) < 0.01 ? aib : 0);

  return [
    {
      account_code: "411",
      debit: totalDebit,
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
            account_code: "4431",
            debit: 0,
            credit: invoice.vat_amount,
            description: "TVA facturée sur ventes",
          },
        ]
      : []),
    ...(aib > 0
      ? [
          {
            account_code: "4471",
            debit: 0,
            credit: aib,
            description: "AIB collecté à reverser (DGI Bénin)",
          },
        ]
      : []),
  ];
}

/**
 * Generates JournalLines for a credit note (reversal in SYSCOHADA).
 */
export function generateCreditNoteEntryLines(invoice: {
  client_id: string;
  subtotal_ht: number;
  vat_amount: number;
  total_ttc: number;
  aib_amount?: number;
  lines: Array<{ accounting_account?: string }>;
}): any[] {
  const revenueAccount = invoice.lines[0]?.accounting_account ?? "706";
  const aib = Number(invoice.aib_amount || 0);
  const totalCredit = invoice.total_ttc + (aib > 0 && Math.abs(invoice.total_ttc - (invoice.subtotal_ht + invoice.vat_amount)) < 0.01 ? aib : 0);

  return [
    {
      account_code: "411",
      debit: 0,
      credit: totalCredit,
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
            account_code: "4431",
            debit: invoice.vat_amount,
            credit: 0,
            description: "Avoir client - Régularisation TVA",
          },
        ]
      : []),
    ...(aib > 0
      ? [
          {
            account_code: "4471",
            debit: aib,
            credit: 0,
            description: "Avoir client - Régularisation AIB",
          },
        ]
      : []),
  ];
}

// ─── Payroll calculation (Bénin - CNSS, IPTS, VPS) ───────────────────────────

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
 * Calcule l'IPTS (Impôt Progressif sur Traitements et Salaires - Bénin)
 * selon le barème mensuel progressif par tranches sur la base imposable nette d'abattement.
 */
export function calculateIPTS(monthlyTaxableBase: number): number {
  let tax = 0;
  let remaining = Math.max(0, monthlyTaxableBase);

  for (const bracket of IPTS_BRACKETS) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, bracket.limit);
    tax += taxable * bracket.rate;
    remaining -= taxable;
  }

  return Math.round(tax);
}

/**
 * Calcule un bulletin de paie complet selon la législation sociale et fiscale béninoise :
 * - CNSS salariale : 3.6% plafonné à 600 000 FCFA/mois
 * - IPTS : Barème progressif sur base nette après 20% d'abattement pour frais professionnels
 * - CNSS patronale : 15.4% plafonné à 600 000 FCFA/mois
 * - VPS : 4% sur salaire brut total sans plafond
 */
export function calculatePayroll(baseSalary: number): PayrollResult {
  const gross = Math.max(0, Number(baseSalary) || 0);

  // 1. Cotisation CNSS salariale (3.6% plafonnée)
  const cnssBase = Math.min(gross, CNSS_CEILING_MONTHLY);
  const cnssEmployeeAmount = Math.round(cnssBase * CNSS_EMPLOYEE_RATE);

  // 2. Salaire imposable & Base IPTS (abattement forfaitaire de 20%)
  const taxableSalary = Math.max(0, gross - cnssEmployeeAmount);
  const taxableBaseIPTS = Math.round(taxableSalary * (1 - IPTS_PROFESSIONAL_ALLOWANCE_RATE));
  const iptsAmount = calculateIPTS(taxableBaseIPTS);

  const deductions = [
    {
      label: "Cotisation CNSS (Part ouvrière 3.6%)",
      rate: round2(CNSS_EMPLOYEE_RATE * 100),
      base: cnssBase,
      amount: cnssEmployeeAmount,
    },
    {
      label: "IPTS (Impôt progressif sur salaires)",
      rate: taxableBaseIPTS > 0 ? round2((iptsAmount / taxableBaseIPTS) * 100) : 0,
      base: taxableBaseIPTS,
      amount: iptsAmount,
    },
  ];

  const totalDeductions = cnssEmployeeAmount + iptsAmount;
  const netSalary = Math.round(gross - totalDeductions);

  // 3. Cotisations patronales
  // CNSS Patronale (15.4% plafonnée)
  const cnssEmployerAmount = Math.round(cnssBase * CNSS_EMPLOYER_RATE);
  // VPS (4% non plafonné)
  const vpsAmount = Math.round(gross * VPS_RATE);

  const contributions = [
    {
      label: "Cotisation CNSS (Part patronale 15.4%)",
      rate: round2(CNSS_EMPLOYER_RATE * 100),
      base: cnssBase,
      amount: cnssEmployerAmount,
    },
    {
      label: "Versement Patronal sur Salaires (VPS 4%)",
      rate: round2(VPS_RATE * 100),
      base: gross,
      amount: vpsAmount,
    },
  ];

  const totalEmployerContributions = cnssEmployerAmount + vpsAmount;
  const employerCost = Math.round(gross + totalEmployerContributions);

  return {
    gross_salary: round2(gross),
    net_salary: netSalary,
    employer_cost: employerCost,
    deductions,
    contributions,
  };
}

// ─── VAT Aggregation (SYSCOHADA Bénin) ────────────────────────────────────────

/**
 * Agrège les écritures du grand livre pour une période donnée afin de calculer la TVA SYSCOHADA :
 * - TVA collectée : comptes 443x (ou 4457 pour rétrocompatibilité)
 * - TVA déductible : comptes 445x (4451, 4452, 4453, 4454)
 * - TVA due = max(0, collectée - déductible)
 * - Crédit TVA = max(0, déductible - collectée)
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

    // TVA collectée / facturée : classe 443x ou 4457
    if (line.account_code.startsWith("443") || line.account_code.startsWith("4457")) {
      vatCollected += credit;
      details.push({ account_code: line.account_code, amount: credit, type: "collected" });
    }
    // TVA déductible / récupérable : classe 445x (sauf 4457) ou 4456
    else if (
      (line.account_code.startsWith("445") && !line.account_code.startsWith("4457")) ||
      line.account_code.startsWith("4456")
    ) {
      vatDeductible += debit;
      details.push({ account_code: line.account_code, amount: debit, type: "deductible" });
    }
    // Chiffre d'affaires HT : classe 7
    else if (line.account_code.startsWith("7")) {
      caHt += credit;
    }
    // Achats HT : classe 6
    else if (line.account_code.startsWith("6")) {
      purchasesHt += debit;
    }
  }

  const vatDue = Math.max(0, vatCollected - vatDeductible);
  const vatCredit = Math.max(0, vatDeductible - vatCollected);

  return {
    period_start: start,
    period_end: end,
    ca_ht: caHt,
    vat_collected: vatCollected,
    purchases_ht: purchasesHt,
    vat_deductible: vatDeductible,
    vat_due: vatDue,
    vat_credit: vatCredit,
    line_details: details,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
