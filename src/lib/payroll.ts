import { EMPLOYEE_CONTRIBUTION_RATES, EMPLOYER_CONTRIBUTION_RATES } from "@/constants/payroll";

export interface PayrollCalculation {
  base_salary: number;
  gross_salary: number;
  employee_deductions: Array<{ name: string; amount: number; percentage: number }>;
  employer_contributions: Array<{ name: string; amount: number; percentage: number }>;
  net_salary: number;
  total_employer_cost: number;
}

export interface PayrollEntryLine {
  account_code: string;
  debit: number;
  credit: number;
  description?: string;
  third_party?: string;
}

/**
 * Calcule un bulletin de paie complet à partir du salaire de base.
 * Applique les taux de cotisations standard.
 */
export function calculatePayroll(baseSalary: number): PayrollCalculation {
  const gross = baseSalary;

  // Cotisations salariales
  const employeeDeductions = EMPLOYEE_CONTRIBUTION_RATES.map((rate) => {
    const base = rate.base === "gross_x_0_9825" ? gross * 0.9825 : gross;
    const amount = Math.round(base * rate.rate * 100) / 100;
    return {
      name: rate.name,
      amount,
      percentage: rate.rate * 100,
    };
  });

  const totalDeductions = employeeDeductions.reduce((s, d) => s + d.amount, 0);
  const netSalary = Math.round((gross - totalDeductions) * 100) / 100;

  // Cotisations patronales
  const employerContributions = EMPLOYER_CONTRIBUTION_RATES.map((rate) => {
    const amount = Math.round(gross * rate.rate * 100) / 100;
    return {
      name: rate.name,
      amount,
      percentage: rate.rate * 100,
    };
  });
  const totalEmployerContribs = employerContributions.reduce((s, c) => s + c.amount, 0);

  return {
    base_salary: baseSalary,
    gross_salary: gross,
    employee_deductions: employeeDeductions,
    employer_contributions: employerContributions,
    net_salary: netSalary,
    total_employer_cost: Math.round((gross + totalEmployerContribs) * 100) / 100,
  };
}

/**
 * Génère les lignes d'écriture comptable de la paie.
 *
 * Écriture de paie (PCG) :
 *   Débit  641 (Rémunérations du personnel)     = salaire brut
 *   Débit  645 (Charges sociales patronales)     = total cotisations patronales
 *   Crédit 421 (Salaires à payer)                = salaire net
 *   Crédit 431 (URSSAF — sécurité sociale)       = cotisations salariales + patronales
 */
export function generatePayrollEntryLines(
  calc: PayrollCalculation,
  employeeId: string
): PayrollEntryLine[] {
  const totalEmployeeContribs = calc.employee_deductions.reduce((s, d) => s + d.amount, 0);
  const totalEmployerContribs = calc.employer_contributions.reduce((s, c) => s + c.amount, 0);

  return [
    {
      account_code: "641",
      debit: calc.gross_salary,
      credit: 0,
      third_party: employeeId,
      description: "Salaire brut",
    },
    {
      account_code: "645",
      debit: totalEmployerContribs,
      credit: 0,
      description: "Charges patronales",
    },
    {
      account_code: "421",
      debit: 0,
      credit: calc.net_salary,
      third_party: employeeId,
      description: "Net à payer",
    },
    {
      account_code: "431",
      debit: 0,
      credit: totalEmployeeContribs + totalEmployerContribs,
      description: "Cotisations URSSAF",
    },
  ];
}
