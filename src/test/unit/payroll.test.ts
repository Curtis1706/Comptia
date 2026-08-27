import { calculatePayroll as calculateStandardPayroll, calculateIPTS } from "@/lib/accounting";
import { calculatePayroll as calculateDetailedPayroll, generatePayrollEntryLines } from "@/lib/payroll";

export function testPayrollEngine() {
  console.log("\n🧪 [TEST] Moteur de Paie & Fiscalité Salariale Bénin (Fiches 2 & 8)");

  // Cas 1 : Salaire standard 400 000 FCFA
  const p1 = calculateStandardPayroll(400_000);
  console.assert(p1.gross_salary === 400_000, "Gross salary mismatch");
  
  const cnssEmp1 = p1.deductions.find(d => d.label.includes("CNSS"))?.amount;
  console.assert(cnssEmp1 === 14_400, `CNSS Salariale attendue 14 400, reçue ${cnssEmp1}`);

  const ipts1 = p1.deductions.find(d => d.label.includes("IPTS"))?.amount;
  console.assert(ipts1 === 36_196, `IPTS attendu 36 196, reçu ${ipts1}`);

  console.assert(p1.net_salary === 349_404, `Net attendu 349 404, reçu ${p1.net_salary}`);

  const cnssPat1 = p1.contributions.find(c => c.label.includes("CNSS"))?.amount;
  console.assert(cnssPat1 === 61_600, `CNSS Patronale attendue 61 600, reçue ${cnssPat1}`);

  const vps1 = p1.contributions.find(c => c.label.includes("VPS"))?.amount;
  console.assert(vps1 === 16_000, `VPS attendu 16 000, reçu ${vps1}`);

  console.assert(p1.employer_cost === 477_600, `Coût total employeur attendu 477 600, reçu ${p1.employer_cost}`);
  console.log("  ✅ Cas 1 (400 000 FCFA -> Net 349 404 FCFA) validé");

  // Cas 2 : Salaire avec dépassement du plafond CNSS (800 000 FCFA)
  const p2 = calculateStandardPayroll(800_000);
  const cnssEmp2 = p2.deductions.find(d => d.label.includes("CNSS"))?.amount;
  // Plafonné à 600 000 * 3.6% = 21 600
  console.assert(cnssEmp2 === 21_600, `Plafond CNSS Salariale attendu 21 600, reçu ${cnssEmp2}`);

  const cnssPat2 = p2.contributions.find(c => c.label.includes("CNSS"))?.amount;
  // Plafonné à 600 000 * 15.4% = 92 400
  console.assert(cnssPat2 === 92_400, `Plafond CNSS Patronale attendu 92 400, reçu ${cnssPat2}`);

  const vps2 = p2.contributions.find(c => c.label.includes("VPS"))?.amount;
  // VPS sur le brut complet sans plafond : 800 000 * 4% = 32 000
  console.assert(vps2 === 32_000, `VPS sans plafond attendu 32 000, reçu ${vps2}`);
  console.log("  ✅ Cas 2 (Plafonnement CNSS 600 000 FCFA & VPS sans plafond) validé");

  // Cas 3 : Tranche exonérée d'IPTS (50 000 FCFA)
  const iptsZero = calculateIPTS(50_000);
  console.assert(iptsZero === 0, `IPTS pour base 50k attendu 0, reçu ${iptsZero}`);
  console.log("  ✅ Cas 3 (Tranche 0% IPTS <= 50 000 FCFA) validé");

  // Cas 4 : Écritures comptables de paie SYSCOHADA (661, 664, 421, 431, 4473, 448)
  const detailedCalc = calculateDetailedPayroll(400_000);
  const entryLines = generatePayrollEntryLines(detailedCalc, "emp-001");

  const totalDebit = entryLines.reduce((s, l) => s + l.debit, 0);
  const totalCredit = entryLines.reduce((s, l) => s + l.credit, 0);
  console.assert(Math.abs(totalDebit - totalCredit) < 0.01, `Écriture de paie non équilibrée : Débit=${totalDebit}, Crédit=${totalCredit}`);
  console.assert(entryLines.some(l => l.account_code === "661"), "Compte 661 manquant");
  console.assert(entryLines.some(l => l.account_code === "664"), "Compte 664 manquant");
  console.assert(entryLines.some(l => l.account_code === "421"), "Compte 421 manquant");
  console.assert(entryLines.some(l => l.account_code === "431"), "Compte 431 manquant");
  console.assert(entryLines.some(l => l.account_code === "4473"), "Compte 4473 manquant");
  console.assert(entryLines.some(l => l.account_code === "448"), "Compte 448 manquant");
  console.log("  ✅ Cas 4 (Équilibre des écritures comptables SYSCOHADA 661/664/421/431/4473/448) validé");

  return true;
}
