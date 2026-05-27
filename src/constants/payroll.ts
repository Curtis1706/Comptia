/**
 * Taux et rubriques de paie standard (Configuration Bénin - V1)
 * À confirmer et ajuster selon le secteur et le barème en vigueur de l'entreprise.
 */

export const DEFAULT_PAYROLL_LINES = [
  // Retenues salariales (Déduites du brut pour obtenir le net)
  { type: "deduction", label: "Cotisation CNSS (Part ouvrière)", rate: 0.036 },
  { type: "deduction", label: "Impôt sur les Revenus (IRPP/TS)", rate: 0 }, // Calcul manuel ou progressif
  
  // Charges patronales (Payées par l'employeur en plus du brut)
  { type: "employer_contribution", label: "Cotisation CNSS (Part patronale)", rate: 0.154 },
  { type: "employer_contribution", label: "Versement Patronal sur Salaires (VPS)", rate: 0.04 }, // Taux standard (peut être 2% selon secteur)
];
