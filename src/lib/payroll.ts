import { DEFAULT_PAYROLL_LINES } from "@/constants/payroll";

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
 * Calcule un bulletin de paie complet à partir du salaire de base et des lignes additionnelles.
 */
export function calculatePayroll(baseSalary: number, customLines: any[] = []): PayrollCalculation {
  // 1. Calcul du brut = base + primes/indemnités (earnings)
  const earnings = customLines.filter(l => l.type === 'earning');
  const totalEarnings = earnings.reduce((sum, l) => sum + Number(l.amount || 0), 0);
  const gross = Number(baseSalary) + totalEarnings;

  // 2. Préparation de toutes les lignes
  const lines: Array<{ type: string; label: string; amount: number; rate: number | null; base: number | null }> = [
    ...earnings,
  ];

  // Si c'est une nouvelle génération sans customLines (sauf earnings éventuellement), on applique les taux par défaut
  const hasDefaultLines = customLines.some(l => l.type === 'deduction' || l.type === 'employer_contribution');
  
  if (!hasDefaultLines) {
    DEFAULT_PAYROLL_LINES.forEach(def => {
      const amount = Math.round(gross * def.rate * 100) / 100;
      lines.push({
        type: def.type,
        label: def.label,
        rate: def.rate,
        base: gross,
        amount
      });
    });
  } else {
    // Si on a déjà des lignes (édition d'un brouillon), on les reprend (recalculées ou non, ici on prend le montant existant ou on recalcule si le rate existe)
    customLines.filter(l => l.type !== 'earning').forEach(l => {
      const amount = l.rate ? Math.round(gross * Number(l.rate) * 100) / 100 : Number(l.amount);
      lines.push({
        type: l.type,
        label: l.label,
        rate: l.rate ? Number(l.rate) : null,
        base: l.rate ? gross : null,
        amount
      });
    });
  }

  // 3. Totaux
  const deductions = lines.filter(l => l.type === 'deduction');
  const totalDeductions = deductions.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const netSalary = Math.round((gross - totalDeductions) * 100) / 100;

  const employerContributions = lines.filter(l => l.type === 'employer_contribution');
  const totalEmployerContribs = employerContributions.reduce((sum, c) => sum + Number(c.amount || 0), 0);

  return {
    base_salary: baseSalary,
    gross_salary: gross,
    lines,
    net_salary: netSalary,
    employer_cost: Math.round((gross + totalEmployerContribs) * 100) / 100,
  };
}

/**
 * Génère les lignes d'écriture comptable de la paie.
 */
export function generatePayrollEntryLines(
  calc: PayrollCalculation,
  employeeId: string
): PayrollEntryLine[] {
  const totalEmployeeContribs = calc.lines.filter(l => l.type === 'deduction').reduce((s, d) => s + d.amount, 0);
  const totalEmployerContribs = calc.lines.filter(l => l.type === 'employer_contribution').reduce((s, c) => s + c.amount, 0);

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
      description: "Cotisations Sécurité Sociale et Impôts",
    },
  ];
}
