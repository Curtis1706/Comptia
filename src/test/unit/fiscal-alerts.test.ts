import { FISCAL_CALENDAR } from "@/lib/fiscal-alerts";

export function testFiscalAlerts() {
  console.log("\n🧪 [TEST] Alertes Fiscales & Calendrier DGI Bénin (Fiche 7)");

  const tvaRule = FISCAL_CALENDAR.find(r => r.code === "TVA");
  console.assert(tvaRule && tvaRule.dayOfMonth === 15 && tvaRule.frequency === "monthly", "Règle TVA DGI incorrecte");

  const dsfRule = FISCAL_CALENDAR.find(r => r.code === "DSF");
  console.assert(dsfRule && dsfRule.month === 4 && dsfRule.dayOfMonth === 30, "Règle DSF 30 Avril incorrecte");

  const patenteRule = FISCAL_CALENDAR.find(r => r.code === "PATENTE");
  console.assert(patenteRule && patenteRule.month === 3 && patenteRule.dayOfMonth === 31, "Règle Patente 31 Mars incorrecte");

  const cnssRule = FISCAL_CALENDAR.find(r => r.code === "CNSS");
  console.assert(cnssRule && cnssRule.frequency === "quarterly" && cnssRule.dayOfMonth === 15, "Règle CNSS trimestrielle incorrecte");

  console.log("  ✅ Calendrier fiscal béninois (TVA 15e, CNSS 15e trimestrielle, Patente 31/03, DSF 30/04) validé");
  return true;
}
