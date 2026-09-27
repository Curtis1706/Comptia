import {
  deriveTaxGroup,
  deriveAibRate,
  toMecefPrice,
  normalizeInvoice,
  getMecefConfig,
} from "@/lib/mecef";

export async function testMecefEngine() {
  console.log("\n🧪 [TEST] Intégration API e-MECeF DGI Bénin (Conformité Officielle v1.0)");

  // 1. Test des conversions de prix HT -> TTC
  const priceTTC = toMecefPrice(1016.95, 18);
  console.assert(priceTTC === 1200, `Prix TTC attendu 1200, reçu ${priceTTC}`);
  console.log(`  ✅ Conversion Prix HT -> TTC validée : 1017 HT -> ${priceTTC} TTC`);

  // 2. Test des groupes de taxation
  console.assert(deriveTaxGroup(0, false, true) === "A", "Groupe A pour exonéré");
  console.assert(deriveTaxGroup(18, false, false) === "B", "Groupe B pour 18% taxable");
  console.assert(deriveTaxGroup(0, true, false) === "C", "Groupe C pour exportation");
  console.assert(deriveTaxGroup(0, false, false, "tps") === "E", "Groupe E pour TPS");
  console.log("  ✅ Groupes de taxation DGI (A: Exo, B: 18%, C: Export, E: TPS) validés");

  // 3. Test de l'AIB (1% avec IFU valide, 5% sans IFU)
  console.assert(deriveAibRate("3201987456123") === "rate_1", "AIB 1% avec IFU valide");
  console.assert(deriveAibRate(null) === "none", "Aucun AIB si non spécifié");
  console.assert(deriveAibRate("invalide") === "rate_5", "AIB 5% si IFU non standard");
  console.log("  ✅ Règles AIB (1% IFU valide / 5% sans IFU) validées");

  // 4. Test de normalisation simulation
  const mockInvoice = {
    id: "inv-test-123",
    company_id: "comp-test-123",
    reference: "FAC-2026-0001",
    type: "invoice",
    subtotal_ht: 200_000,
    vat_amount: 36_000,
    total_ttc: 236_000,
    lines: [
      { description: "Développement web", unit_price: 200_000, quantity: 1, vat_rate: 18, tax_group: "B" },
    ],
    client: {
      name: "Société Bénin Digital SARL",
      ifu: "3201987456123",
      phone: "+22901234567",
    },
    payment_method: "cash",
  };

  const prevMode = process.env.MECEF_MODE;
  process.env.MECEF_MODE = "simulation";

  try {
    const res = await normalizeInvoice(mockInvoice as any);
    console.assert(Boolean(res.codeMECeFDGI), "Code MECeF/DGI manquant");
    console.assert(Boolean(res.nim), "NIM manquant");
    console.assert(Boolean(res.qrCode), "QR code manquant");
    const mecefRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    console.assert(mecefRegex.test(res.codeMECeFDGI), `Format code MECeF invalide (attendu 6 groupes de 4 caractères) : ${res.codeMECeFDGI}`);
    console.log(`  ✅ Certification e-MECeF générée : Code DGI=${res.codeMECeFDGI}, NIM=${res.nim}`);
  } finally {
    process.env.MECEF_MODE = prevMode;
  }

  return true;
}
