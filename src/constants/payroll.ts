/**
 * Configuration & Taux de Paie Officiels - République du Bénin (SYSCOHADA & CGI Bénin)
 */

/**
 * Plafond mensuel de la base de cotisation CNSS (600 000 FCFA / mois)
 */
export const CNSS_CEILING_MONTHLY = 600_000;

/**
 * Taux de cotisation salariale CNSS (Part ouvrière : 3.6% plafonnée)
 */
export const CNSS_EMPLOYEE_RATE = 0.036;

/**
 * Taux de cotisations patronales CNSS (Part patronale : 15.4% plafonnée)
 * - Prestations familiales : 9.0%
 * - Risques professionnels / Accidents du travail : 1.0% (taux standard)
 * - Assurance vieillesse / Retraite : 5.4%
 */
export const CNSS_EMPLOYER_RATE = 0.154;

/**
 * Versement Patronal sur Salaires (VPS : 4.0% non plafonné)
 */
export const VPS_RATE = 0.04;

/**
 * Abattement forfaitaire pour frais professionnels (20% de la base brute imposable)
 */
export const IPTS_PROFESSIONAL_ALLOWANCE_RATE = 0.20;

/**
 * Barème progressif mensuel de l'IPTS (Impôt Progressif sur Traitements et Salaires - Bénin)
 * Appliqué par tranche sur le salaire net imposable après abattement de 20%
 */
export const IPTS_BRACKETS = [
  { limit: 50_000, rate: 0.00, label: "Tranche 0 à 50 000 FCFA (0%)" },
  { limit: 80_000, rate: 0.10, label: "Tranche 50 001 à 130 000 FCFA (10%)" },
  { limit: 150_000, rate: 0.15, label: "Tranche 130 001 à 280 000 FCFA (15%)" },
  { limit: 300_000, rate: 0.20, label: "Tranche 280 001 à 580 000 FCFA (20%)" },
  { limit: Infinity, rate: 0.25, label: "Tranche au-delà de 580 000 FCFA (25%)" },
] as const;

/**
 * Lignes de paie standard par défaut pour l'interface et la génération
 */
export const DEFAULT_PAYROLL_LINES = [
  // Retenues salariales
  { type: "deduction", label: "Cotisation CNSS (Part ouvrière - 3.6%)", rate: CNSS_EMPLOYEE_RATE },
  { type: "deduction", label: "IPTS (Impôt Progressif sur Traitements et Salaires)", rate: 0 },

  // Charges patronales
  { type: "employer_contribution", label: "Cotisation CNSS (Part patronale - 15.4%)", rate: CNSS_EMPLOYER_RATE },
  { type: "employer_contribution", label: "Versement Patronal sur Salaires (VPS - 4%)", rate: VPS_RATE },
];
