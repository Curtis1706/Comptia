import {
  calculatePayroll as calculateStandardPayroll,
  calculateIPTS,
  PayrollResult,
} from "@/lib/accounting";
import {
  CNSS_CEILING_MONTHLY,
  CNSS_EMPLOYEE_RATE,
  CNSS_EMPLOYER_RATE,
  VPS_RATE,
  IPTS_PROFESSIONAL_ALLOWANCE_RATE,
} from "@/constants/payroll";

export interface PayrollCalculation {
  base_salary: number;
  gross_salary: number;
  lines: Array<{ type: string; label: string; amount: number; rate: number | null; base: number | null }>;
  net_salary: number;
  employer_cost: number;
}

export interface PayrollEntryLine {
  account_code: string;
  debit: number;
  credit: number;
  description?: string;
  third_party?: string;
}

/**
 * Calcule un bulletin de paie complet à partir du salaire de base et des lignes additionnelles (primes/indemnités).
 * Conforme à la législation béninoise (CNSS ouvrière/patronale plafonnée à 600k, IPTS progressif, VPS 4%).
 */
export function calculatePayroll(baseSalary: number, customLines: any[] = []): PayrollCalculation {
  const base = Math.max(0, Number(baseSalary) || 0);

  // 1. Calcul du brut = base + primes/indemnités (earnings)
  const earnings = customLines.filter((l) => l.type === "earning");
  const totalEarnings = earnings.reduce((sum, l) => sum + Number(l.amount || 0), 0);
  const gross = base + totalEarnings;

  const lines: Array<{ type: string; label: string; amount: number; rate: number | null; base: number | null }> = [
    ...earnings.map((e) => ({
      type: "earning",
      label: e.label || "Prime",
      amount: Number(e.amount || 0),
      rate: null,
      base: null,
    })),
  ];

  const hasCustomDeductions = customLines.some(
    (l) => l.type === "deduction" || l.type === "employer_contribution"
  );

  if (!hasCustomDeductions) {
    // Calcul standard Bénin via accounting.ts
    const std = calculateStandardPayroll(gross);

    std.deductions.forEach((d) => {
      lines.push({
        type: "deduction",
        label: d.label,
        rate: d.rate ? d.rate / 100 : null,
        base: d.base,
        amount: d.amount,
      });
    });

    std.contributions.forEach((c) => {
      lines.push({
        type: "employer_contribution",
        label: c.label,
        rate: c.rate ? c.rate / 100 : null,
        base: c.base,
        amount: c.amount,
      });
    });

    return {
      base_salary: base,
      gross_salary: gross,
      lines,
      net_salary: std.net_salary,
      employer_cost: std.employer_cost,
    };
  } else {
    // Cas où des lignes personnalisées ont été injectées
    customLines
      .filter((l) => l.type !== "earning")
      .forEach((l) => {
        const amount = l.rate ? Math.round(gross * Number(l.rate) * 100) / 100 : Number(l.amount || 0);
        lines.push({
          type: l.type,
          label: l.label,
          rate: l.rate ? Number(l.rate) : null,
          base: l.rate ? gross : null,
          amount,
        });
      });

    const deductions = lines.filter((l) => l.type === "deduction");
    const totalDeductions = deductions.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const netSalary = Math.round((gross - totalDeductions) * 100) / 100;

    const employerContributions = lines.filter((l) => l.type === "employer_contribution");
    const totalEmployerContribs = employerContributions.reduce((sum, c) => sum + Number(c.amount || 0), 0);

    return {
      base_salary: base,
      gross_salary: gross,
      lines,
      net_salary: netSalary,
      employer_cost: Math.round((gross + totalEmployerContribs) * 100) / 100,
    };
  }
}

/**
 * Génère les lignes d'écriture comptable de la paie selon le SYSCOHADA révisé Bénin :
 * - 661 (Rémunérations directes versées au personnel national) -> Débit Salaire brut
 * - 664 (Charges sociales patronales : CNSS part patronale + VPS) -> Débit Charges patronales
 * - 421 (Personnel, rémunérations dues) -> Crédit Net à payer
 * - 431 (Sécurité sociale - CNSS part ouvrière + part patronale) -> Crédit Total CNSS
 * - 4473 (État, IPTS retenu sur salaires) -> Crédit IPTS
 * - 448 (État, charges à payer - VPS) -> Crédit VPS
 */
export function generatePayrollEntryLines(
  calc: PayrollCalculation,
  employeeId: string
): PayrollEntryLine[] {
  const cnssEmployee = calc.lines.find((l) => l.label?.includes("CNSS") && l.type === "deduction")?.amount || 0;
  const ipts = calc.lines.find((l) => l.label?.includes("IPTS") && l.type === "deduction")?.amount || 0;
  const otherDeductions = calc.lines
    .filter((l) => l.type === "deduction" && !l.label?.includes("CNSS") && !l.label?.includes("IPTS"))
    .reduce((s, d) => s + d.amount, 0);

  const cnssEmployer = calc.lines.find((l) => l.label?.includes("CNSS") && l.type === "employer_contribution")?.amount || 0;
  const vps = calc.lines.find((l) => l.label?.includes("VPS") && l.type === "employer_contribution")?.amount || 0;
  const otherEmployer = calc.lines
    .filter((l) => l.type === "employer_contribution" && !l.label?.includes("CNSS") && !l.label?.includes("VPS"))
    .reduce((s, c) => s + c.amount, 0);

  const totalEmployerContribs = cnssEmployer + vps + otherEmployer;

  const entries: PayrollEntryLine[] = [
    {
      account_code: "661",
      debit: calc.gross_salary,
      credit: 0,
      third_party: employeeId,
      description: "Rémunération du personnel",
    },
    {
      account_code: "664",
      debit: totalEmployerContribs,
      credit: 0,
      description: "Charges sociales patronales (CNSS & VPS)",
    },
    {
      account_code: "421",
      debit: 0,
      credit: calc.net_salary,
      third_party: employeeId,
      description: "Net à payer au salarié",
    },
    {
      account_code: "431",
      debit: 0,
      credit: Math.round(cnssEmployee + cnssEmployer),
      description: "Cotisations CNSS (Part ouvrière + patronale)",
    },
  ];

  if (ipts > 0) {
    entries.push({
      account_code: "4473",
      debit: 0,
      credit: ipts,
      description: "Retenue à la source IPTS",
    });
  }

  if (vps > 0) {
    entries.push({
      account_code: "448",
      debit: 0,
      credit: vps,
      description: "Versement Patronal sur Salaires (VPS)",
    });
  }

  if (otherDeductions > 0 || otherEmployer > 0) {
    entries.push({
      account_code: "438",
      debit: 0,
      credit: otherDeductions + otherEmployer,
      description: "Autres charges sociales à payer",
    });
  }

  return entries;
}
