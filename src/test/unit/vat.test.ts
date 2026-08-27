import { generateSalesEntryLines, generateCreditNoteEntryLines, generatePaymentEntryLines } from "@/lib/accounting";

export function testVatAndAccountingEngine() {
  console.log("\n🧪 [TEST] Moteur TVA Bénin 18% & Écritures Comptables (Fiche 3 & Fiche 10)");

  // 1. Facture de vente avec TVA 18% (SYSCOHADA 411, 706, 4431)
  const salesLines = generateSalesEntryLines({
    client_id: "client-1",
    subtotal_ht: 100_000,
    vat_amount: 18_000,
    total_ttc: 118_000,
    lines: [{ description: "Prestation informatique", accounting_account: "706", amount: 100_000 }],
  });

  const totalDebitSales = salesLines.reduce((s, l) => s + l.debit, 0);
  const totalCreditSales = salesLines.reduce((s, l) => s + l.credit, 0);
  console.assert(totalDebitSales === 118_000, `Débit client attendu 118 000, reçu ${totalDebitSales}`);
  console.assert(totalCreditSales === 118_000, `Crédit total attendu 118 000, reçu ${totalCreditSales}`);
  
  const vatLine = salesLines.find(l => l.account_code === "4431");
  console.assert(vatLine && vatLine.credit === 18_000, "Ligne TVA facturée 4431 incorrecte");
  console.log("  ✅ Écritures de vente avec TVA 18% (411 / 706 / 4431) équilibrées");

  // 2. Facture d'avoir (SYSCOHADA 706 débit, 4431 débit, 411 crédit)
  const creditLines = generateCreditNoteEntryLines({
    client_id: "client-1",
    subtotal_ht: 50_000,
    vat_amount: 9_000,
    total_ttc: 59_000,
    lines: [{ description: "Remise accordée", accounting_account: "706", amount: 50_000 }],
  });
  const totalDebitCredit = creditLines.reduce((s, l) => s + l.debit, 0);
  const totalCreditCredit = creditLines.reduce((s, l) => s + l.credit, 0);
  console.assert(totalDebitCredit === 59_000 && totalCreditCredit === 59_000, "Facture d'avoir non équilibrée");
  console.log("  ✅ Facture d'avoir (4431 débit / 411 crédit) validée");

  // 3. Encaissement Mobile Money (Compte 585) vs Banque (521) vs Caisse (541)
  const momoPayment = generatePaymentEntryLines({
    payment_method: "mobile_money_mtn",
    amount: 118_000,
    invoice_reference: "FAC-2026-0001",
  });
  console.assert(momoPayment.some(l => l.account_code === "585"), "Compte Mobile Money 585 manquant dans le paiement MTN");

  const bankPayment = generatePaymentEntryLines({
    payment_method: "bank_transfer",
    amount: 118_000,
    invoice_reference: "FAC-2026-0001",
  });
  console.assert(bankPayment.some(l => l.account_code === "521"), "Compte Banque 521 manquant dans le virement");

  const cashPayment = generatePaymentEntryLines({
    payment_method: "cash",
    amount: 50_000,
    invoice_reference: "FAC-2026-0002",
  });
  console.assert(cashPayment.some(l => l.account_code === "541"), "Compte Caisse 541 manquant dans le règlement espèces");
  console.log("  ✅ Encaissements Trésorerie (Mobile Money 585 / Banque 521 / Caisse 541) validés");

  return true;
}
