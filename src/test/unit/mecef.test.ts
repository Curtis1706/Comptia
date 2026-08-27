import { normalizeInvoice } from "@/lib/mecef";

export async function testMecefEngine() {
  console.log("\n🧪 [TEST] Intégration API e-MECeF DGI Bénin (Fiche 4)");

  const mockInvoice = {
    id: "inv-test-123",
    reference: "FAC-2026-0001",
    type: "invoice",
    subtotal_ht: 200_000,
    vat_amount: 36_000,
    total_ttc: 236_000,
    lines: [
      { description: "Prestation de conseil", unit_price: 200_000, quantity: 1, vat_rate: 18 },
    ],
    client: {
      name: "Société Béninoise Client",
      ifu: "1234567890123",
      phone: "+22997000000",
    },
    payment_method: "mobile_money_mtn",
  };

  const res = await normalizeInvoice(mockInvoice);

  console.assert(Boolean(res.codeMECeFDGI), "Code MECeF/DGI manquant");
  console.assert(Boolean(res.nim), "NIM manquant");
  console.assert(Boolean(res.qrCode), "Lien QR code de vérification manquant");
  console.assert(res.codeMECeFDGI.startsWith("MECeF-"), `Format code MECeF invalide : ${res.codeMECeFDGI}`);
  console.assert(res.qrCode.includes("https://mecef.impots.bj/verify"), `URL QR code invalide : ${res.qrCode}`);

  console.log(`  ✅ Certification e-MECeF générée : Code DGI=${res.codeMECeFDGI}, NIM=${res.nim}`);
  return true;
}
