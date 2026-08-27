/**
 * Dérivation des groupes de taxation et taux AIB selon le référentiel officiel DGI e-MECeF Bénin.
 */

export type MecefTaxGroup = "A" | "B" | "C" | "D" | "E" | "F";
export type MecefAibRate = "none" | "rate_1" | "rate_5";

export const TAX_GROUP_LABELS: Record<MecefTaxGroup, string> = {
  A: "A - EXONÉRÉ (0%)",
  B: "B - TAXABLE (18%)",
  C: "C - EXPORTATION (0%)",
  D: "D - RÉGIME D'EXCEPTION (18%)",
  E: "E - RÉGIME FISCAL TPS (0%)",
  F: "F - RÉSERVÉ (0%)",
};

export const AIB_RATE_LABELS: Record<MecefAibRate, string> = {
  none: "Aucun AIB (0%)",
  rate_1: "AIB 1% (Client avec IFU valide)",
  rate_5: "AIB 5% (Client sans IFU)",
};

/**
 * Dérive automatiquement le groupe de taxation par défaut.
 *
 * Règles officielles DGI :
 * - Exportation (EV/EA ou produit export) → Groupe C
 * - Régime fiscal TPS → Groupe E
 * - Exonéré (0%, non export) → Groupe A
 * - Taxable standard 18% → Groupe B
 * - Régime d'exception → Groupe D
 */
export function deriveTaxGroup(
  vatRate: number,
  isExport = false,
  isExempt = false,
  taxRegime?: "reel" | "tps" | "micro" | "auto_entrepreneur" | string
): MecefTaxGroup {
  if (isExport) return "C";
  if (taxRegime === "tps") return "E";
  if (isExempt || vatRate === 0) return "A";
  if (vatRate === 18) return "B";
  return "B";
}

/**
 * Détermine le taux d'AIB selon la présence d'un IFU client valide (13 chiffres).
 */
export function deriveAibRate(clientIfu: string | null | undefined): MecefAibRate {
  if (!clientIfu) return "none";
  const cleaned = clientIfu.trim().replace(/\s+/g, "");
  if (/^\d{13}$/.test(cleaned)) {
    return "rate_1"; // 1% si IFU valide
  }
  return "rate_5"; // 5% si non enregistré ou sans IFU
}

/**
 * Convertit un prix unitaire Hors Taxes (HT) en Prix Unitaire Toutes Taxes Comprises (TTC).
 * Le référentiel officiel DGI e-MECeF exige des prix unitaires TTC au franc CFA entier (XOF).
 */
export function toMecefPrice(unitPriceHT: number, vatRate: number): number {
  return Math.round(unitPriceHT * (1 + (vatRate || 0) / 100));
}
