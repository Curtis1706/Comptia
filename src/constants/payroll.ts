/**
 * Taux de cotisations sociales français (approximations pour 2026)
 */

export const EMPLOYEE_CONTRIBUTION_RATES = [
  { name: "Sécurité sociale maladie", rate: 0.0075, base: "gross" },
  { name: "Sécurité sociale vieillesse", rate: 0.069, base: "gross" },
  { name: "Retraite complémentaire", rate: 0.0315, base: "gross" },
  { name: "Assurance chômage", rate: 0.024, base: "gross" },
  { name: "CSG déductible", rate: 0.068, base: "gross_x_0_9825" },
  { name: "CSG non déductible + CRDS", rate: 0.029, base: "gross_x_0_9825" },
] as const;

export const EMPLOYER_CONTRIBUTION_RATES = [
  { name: "Sécurité sociale maladie", rate: 0.13, base: "gross" },
  { name: "Sécurité sociale vieillesse", rate: 0.0845, base: "gross" },
  { name: "Allocations familiales", rate: 0.0345, base: "gross" },
  { name: "Accidents du travail", rate: 0.02, base: "gross" },
  { name: "Retraite complémentaire", rate: 0.0472, base: "gross" },
  { name: "Assurance chômage patron", rate: 0.04, base: "gross" },
  { name: "Formation professionnelle", rate: 0.01, base: "gross" },
] as const;
