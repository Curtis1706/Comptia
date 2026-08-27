/**
 * Script officiel d'homologation e-MECeF DGI Bénin — Les 20 cas de test SFE.
 *
 * Exécution :
 *   npx tsx scripts/mecef-homologation.ts
 *   npx tsx scripts/mecef-homologation.ts --only 6
 */

import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import React from "react";
import ReactPDF from "@react-pdf/renderer";
import QRCode from "qrcode";
import { InvoicePDF } from "../src/lib/pdf-templates/InvoicePDF";
import {
  postInvoice,
  confirmInvoice,
  getMecefConfig,
  type MecefInvoiceRequest,
  type MecefItem,
} from "../src/lib/mecef";

// ─── Garde de sécurité : Sandbox uniquement ─────────────────────────────────
const config = getMecefConfig();
if (config.mode === "production") {
  console.error("❌ ERREUR CRITIQUE : Ce script d'homologation ne doit JAMAIS être exécuté en production.");
  process.exit(1);
}

if (!config.token) {
  console.error("❌ ERREUR : MECEF_TOKEN est absent des variables d'environnement.");
  process.exit(1);
}

// ─── Articles de référence officiels ────────────────────────────────────────
const ITEMS = {
  EXONERE: { name: "Service de formation exonéré", price: 600, taxGroup: "A" as const },
  TAXABLE: { name: "Développement web", price: 1800, taxGroup: "B" as const },
  EXPORT: { name: "Prestation export logiciel", price: 2500, taxGroup: "C" as const },
  EXCEPTION: { name: "Fourniture régime d'exception", price: 1200, taxGroup: "D" as const },
  TPS: { name: "Service micro-entreprise", price: 900, taxGroup: "E" as const },
};

const CLIENT_TEST = {
  ifu: "3201987456123",
  name: "Société Bénin Digital SARL",
  address: "Cotonou - Akpakpa",
  contact: "+229 01 23 45 67",
};

const COMPANY_INFO = {
  name: "Brightbook Studio / Comptia",
  ifu: config.ifu,
  rccm: "RB/COT/24 B 12345",
  address: "Cotonou-Quartier Agblangandan",
  city: "Cotonou",
  phone: "+229 01 62 78 93 05",
};

interface TestCaseDefinition {
  num: number;
  type: "FV" | "FA" | "EV" | "EA";
  label: string;
  description: string;
  buildPayload: (context: Record<number, string>) => MecefInvoiceRequest;
  touristTax?: number;
}

const TEST_CASES: TestCaseDefinition[] = [
  // Cas 1 : FV — Article exonéré ×1
  {
    num: 1,
    type: "FV",
    label: "Cas 1 — FV Exonéré ×1",
    description: "1 article exonéré (Groupe A)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [{ ...ITEMS.EXONERE, quantity: 1 }],
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 600 }],
    }),
  },
  // Cas 2 : FV — Article taxable ×1
  {
    num: 2,
    type: "FV",
    label: "Cas 2 — FV Taxable ×1",
    description: "1 article taxable 18% (Groupe B)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [{ ...ITEMS.TAXABLE, quantity: 1 }],
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 1800 }],
    }),
  },
  // Cas 3 : FV — Exonéré ×2 + taxable ×3
  {
    num: 3,
    type: "FV",
    label: "Cas 3 — FV Mixte (Exonéré + Taxable)",
    description: "2 exonérés (A) + 3 taxables (B)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [
        { ...ITEMS.EXONERE, quantity: 2 },
        { ...ITEMS.TAXABLE, quantity: 3 },
      ],
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 600 * 2 + 1800 * 3 }],
    }),
  },
  // Cas 4 : FV — Quantités décimales (2.5 et 3.250)
  {
    num: 4,
    type: "FV",
    label: "Cas 4 — FV Quantités décimales",
    description: "2,5 exonérés (A) + 3,250 taxables (B)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [
        { ...ITEMS.EXONERE, quantity: 2.5 },
        { ...ITEMS.TAXABLE, quantity: 3.25 },
      ],
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: Math.round(600 * 2.5 + 1800 * 3.25) }],
    }),
  },
  // Cas 5 : FV — Exonéré ×2 + taxable ×3 + IFU et nom client
  {
    num: 5,
    type: "FV",
    label: "Cas 5 — FV Client identifié",
    description: "2 exonérés (A) + 3 taxables (B) + Client avec IFU",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [
        { ...ITEMS.EXONERE, quantity: 2 },
        { ...ITEMS.TAXABLE, quantity: 3 },
      ],
      client: CLIENT_TEST,
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "VIREMENT", amount: 600 * 2 + 1800 * 3 }],
    }),
  },
  // Cas 6 : FA — Avoir sur le cas 5
  {
    num: 6,
    type: "FA",
    label: "Cas 6 — FA Avoir sur Cas 5",
    description: "Facture d'avoir référençant le code MECeF du Cas 5",
    buildPayload: (ctx) => ({
      ifu: config.ifu,
      type: "FA",
      reference: ctx[5] || "TEST-2APU-TGKP-CAGV-PVPU-5X3Q",
      items: [
        { ...ITEMS.EXONERE, quantity: 2 },
        { ...ITEMS.TAXABLE, quantity: 3 },
      ],
      client: CLIENT_TEST,
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "VIREMENT", amount: 600 * 2 + 1800 * 3 }],
    }),
  },
  // Cas 7 : FV — Taxable ×3 avec taxe spécifique + client
  {
    num: 7,
    type: "FV",
    label: "Cas 7 — FV Taxe spécifique",
    description: "3 taxables (B) avec 500 FCFA de taxe spécifique + Client",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [{ ...ITEMS.TAXABLE, quantity: 3, taxSpecific: 500 }],
      client: CLIENT_TEST,
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 1800 * 3 + 500 }],
    }),
  },
  // Cas 8 : FV — Exonéré ×2 + taxable ×3 + AIB 5%
  {
    num: 8,
    type: "FV",
    label: "Cas 8 — FV AIB 5%",
    description: "2 exonérés (A) + 3 taxables (B) + AIB 5% (Groupe B)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [
        { ...ITEMS.EXONERE, quantity: 2 },
        { ...ITEMS.TAXABLE, quantity: 3 },
      ],
      aib: "B",
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 600 * 2 + 1800 * 3 }],
    }),
  },
  // Cas 9 : FV — Exonéré ×2 + taxable ×3 + client + AIB 1%
  {
    num: 9,
    type: "FV",
    label: "Cas 9 — FV Client + AIB 1%",
    description: "2 exonérés (A) + 3 taxables (B) + Client + AIB 1% (Groupe A)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [
        { ...ITEMS.EXONERE, quantity: 2 },
        { ...ITEMS.TAXABLE, quantity: 3 },
      ],
      client: CLIENT_TEST,
      aib: "A",
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "VIREMENT", amount: 600 * 2 + 1800 * 3 }],
    }),
  },
  // Cas 10 : FV — Exonéré ×2 + taxable ×3 avec taxe spécifique + AIB 5%
  {
    num: 10,
    type: "FV",
    label: "Cas 10 — FV Taxe spécifique + AIB 5%",
    description: "2 exonérés + 3 taxables avec 500 FCFA TS + AIB 5%",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [
        { ...ITEMS.EXONERE, quantity: 2 },
        { ...ITEMS.TAXABLE, quantity: 3, taxSpecific: 500 },
      ],
      aib: "B",
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 600 * 2 + 1800 * 3 + 500 }],
    }),
  },
  // Cas 11 : FV — Taxable ×2 + client + taxe de séjour
  {
    num: 11,
    type: "FV",
    label: "Cas 11 — FV Taxe de séjour",
    description: "2 taxables (B) + Client + Taxe de séjour (1 000 FCFA)",
    touristTax: 1000,
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [{ ...ITEMS.TAXABLE, quantity: 2 }],
      client: CLIENT_TEST,
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "CARTEBANCAIRE", amount: 1800 * 2 }],
    }),
  },
  // Cas 12 : FV — Régime d'exception ×2 (Groupe D)
  {
    num: 12,
    type: "FV",
    label: "Cas 12 — FV Régime d'exception",
    description: "2 articles régime d'exception TVA (Groupe D)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [{ ...ITEMS.EXCEPTION, quantity: 2 }],
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 1200 * 2 }],
    }),
  },
  // Cas 13 : FV — Régime d'exception ×2 avec taxe spécifique
  {
    num: 13,
    type: "FV",
    label: "Cas 13 — FV Régime d'exception + TS",
    description: "2 articles régime d'exception (D) avec 500 FCFA TS",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [{ ...ITEMS.EXCEPTION, quantity: 2, taxSpecific: 500 }],
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 1200 * 2 + 500 }],
    }),
  },
  // Cas 14 : FV — Régime TPS ×2 (Groupe E)
  {
    num: 14,
    type: "FV",
    label: "Cas 14 — FV Régime TPS",
    description: "2 articles régime fiscal TPS (Groupe E)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [{ ...ITEMS.TPS, quantity: 2 }],
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 900 * 2 }],
    }),
  },
  // Cas 15 : FV — Régime TPS ×2 avec taxe spécifique
  {
    num: 15,
    type: "FV",
    label: "Cas 15 — FV TPS + TS",
    description: "2 articles régime fiscal TPS (E) avec 300 FCFA TS",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "FV",
      items: [{ ...ITEMS.TPS, quantity: 2, taxSpecific: 300 }],
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 900 * 2 + 300 }],
    }),
  },
  // Cas 16 : EV — Exportation taxable ×2 (Groupe C)
  {
    num: 16,
    type: "EV",
    label: "Cas 16 — EV Exportation",
    description: "2 prestations exportables (Groupe C)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "EV",
      items: [{ ...ITEMS.EXPORT, quantity: 2 }],
      client: { name: "Client International Corp", contact: "contact@intl.com" },
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "VIREMENT", amount: 2500 * 2 }],
    }),
  },
  // Cas 17 : EV — Exonéré ×2 + Exportation taxable ×3
  {
    num: 17,
    type: "EV",
    label: "Cas 17 — EV Mixte Exportation",
    description: "2 exonérés (A) + 3 exportations (C)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "EV",
      items: [
        { ...ITEMS.EXONERE, quantity: 2 },
        { ...ITEMS.EXPORT, quantity: 3 },
      ],
      client: { name: "Global Trading Ltd" },
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "VIREMENT", amount: 600 * 2 + 2500 * 3 }],
    }),
  },
  // Cas 18 : EA — Avoir sur exportation (Cas 16)
  {
    num: 18,
    type: "EA",
    label: "Cas 18 — EA Avoir Exportation",
    description: "Avoir sur l'exportation du Cas 16",
    buildPayload: (ctx) => ({
      ifu: config.ifu,
      type: "EA",
      reference: ctx[16] || "TEST-4N2G-NLQV-IIZC-Y77X-VSRU",
      items: [{ ...ITEMS.EXPORT, quantity: 2 }],
      client: { name: "Client International Corp" },
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "VIREMENT", amount: 2500 * 2 }],
    }),
  },
  // Cas 19 : EV — Régime TPS ×2 (Export)
  {
    num: 19,
    type: "EV",
    label: "Cas 19 — EV Régime TPS",
    description: "Exportation sous régime TPS (Groupe E)",
    buildPayload: () => ({
      ifu: config.ifu,
      type: "EV",
      items: [{ ...ITEMS.TPS, quantity: 2 }],
      client: { name: "Sahel Import-Export" },
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 900 * 2 }],
    }),
  },
  // Cas 20 : EA — Avoir sur Régime TPS (Cas 19)
  {
    num: 20,
    type: "EA",
    label: "Cas 20 — EA Avoir TPS",
    description: "Avoir sur exportation TPS du Cas 19",
    buildPayload: (ctx) => ({
      ifu: config.ifu,
      type: "EA",
      reference: ctx[19] || "TEST-O66A-YGDX-BY4G-M4YV-K6Z4",
      items: [{ ...ITEMS.TPS, quantity: 2 }],
      client: { name: "Sahel Import-Export" },
      operator: { name: "Harry ALOHOUTADE" },
      payment: [{ name: "ESPECES", amount: 900 * 2 }],
    }),
  },
];

async function runHomologation() {
  const args = process.argv.slice(2);
  const onlyIndex = args.indexOf("--only");
  const onlyNum = onlyIndex !== -1 ? parseInt(args[onlyIndex + 1], 10) : null;

  const outDir = path.resolve(process.cwd(), "homologation");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const contextFile = path.join(outDir, "codes-context.json");
  let codeContext: Record<number, string> = {};
  if (fs.existsSync(contextFile)) {
    try {
      codeContext = JSON.parse(fs.readFileSync(contextFile, "utf-8"));
    } catch {
      codeContext = {};
    }
  }

  console.log("================================================================");
  console.log("🇧🇯 HOMOLOGATION e-MECeF DGI BÉNIN — LES 20 CAS DE TEST");
  console.log("================================================================");
  console.log(`NIM Émetteur : ${config.nim} | IFU : ${config.ifu}`);
  console.log(`Serveur      : ${config.baseUrl}\n`);

  const results: Array<{
    num: number;
    label: string;
    type: string;
    uid: string;
    codeMECeF: string;
    totalDGI: number;
    totalComptia: number;
    counters: string;
    dateTime: string;
    status: "SUCCÈS" | "ÉCHEC";
    error?: string;
    pdfPath?: string;
  }> = [];

  for (const testCase of TEST_CASES) {
    if (onlyNum && testCase.num !== onlyNum) continue;

    console.log(`[TEST ${String(testCase.num).padStart(2, "0")}/20] ${testCase.label}...`);

    // Pause de 1.5s pour garantir l'indexation de la facture précédente côté DGI
    if (testCase.type === "FA" || testCase.type === "EA") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      // 1. Construction du payload
      const payload = testCase.buildPayload(codeContext);
      console.log("Payload:", JSON.stringify(payload));

      // 2. Étape 1 : POST /api/invoice
      const postRes = await postInvoice(payload);
      console.log("PostRes:", JSON.stringify(postRes));
      const uid = postRes.uid;

      // 3. Étape 2 : PUT /api/invoice/{uid}/confirm
      const confirmRes = await confirmInvoice(uid);
      console.log("ConfirmRes:", JSON.stringify(confirmRes));
      const codeMECeF = confirmRes.codeMECeFDGI;
      codeContext[testCase.num] = codeMECeF;
      fs.writeFileSync(contextFile, JSON.stringify(codeContext, null, 2), "utf-8");

      // 4. Génération de l'image QR Code en Data URL pour @react-pdf/renderer
      let qrCodeDataUrl = confirmRes.qrCode;
      if (confirmRes.qrCode) {
        qrCodeDataUrl = await QRCode.toDataURL(confirmRes.qrCode, { margin: 1, width: 220 });
      }

      // 5. Génération de la facture PDF conforme
      const mockInvoice = {
        id: `test-case-${testCase.num}`,
        reference: `TEST-${String(testCase.num).padStart(2, "0")}`,
        type: testCase.type === "FA" || testCase.type === "EA" ? "credit_note" : "invoice",
        issue_date: new Date().toISOString(),
        due_date: new Date().toISOString(),
        total_ttc: postRes.total,
        mecef_status: "normalized",
        mecef_dgi_code: codeMECeF,
        mecef_qr_code: qrCodeDataUrl,
        mecef_nim: confirmRes.nim || config.nim,
        mecef_counters: confirmRes.counters,
        mecef_datetime: new Date(),
        mecef_original_ref: payload.reference,
        tourist_tax_amount: testCase.touristTax || 0,
        aib_rate: payload.aib === "A" ? "rate_1" : payload.aib === "B" ? "rate_5" : "none",
        aib_amount: postRes.aib || 0,
        lines: payload.items.map((it: MecefItem) => ({
          description: it.name,
          quantity: it.quantity,
          unit_price: it.price,
          vat_rate: it.taxGroup === "B" || it.taxGroup === "D" ? 18 : 0,
          tax_group: it.taxGroup,
          tax_specific: it.taxSpecific || 0,
        })),
        client: payload.client,
        created_by_user: { name: payload.operator.name },
      };

      const pdfFileName = `test-${String(testCase.num).padStart(2, "0")}.pdf`;
      const pdfPath = path.join(outDir, pdfFileName);

      const docElement = React.createElement(InvoicePDF, {
        invoice: mockInvoice,
        company: COMPANY_INFO,
      });
      await ReactPDF.render(docElement as any, pdfPath);

      console.log(`  ✅ UID DGI: ${uid}`);
      console.log(`  ✅ Code MECeF: ${codeMECeF} (${confirmRes.counters})`);
      console.log(`  ✅ Total DGI: ${postRes.total} FCFA | PDF: ./homologation/${pdfFileName}\n`);

      results.push({
        num: testCase.num,
        label: testCase.label,
        type: testCase.type,
        uid,
        codeMECeF,
        totalDGI: postRes.total,
        totalComptia: postRes.total,
        counters: confirmRes.counters,
        dateTime: confirmRes.dateTime,
        status: "SUCCÈS",
        pdfPath: `./homologation/${pdfFileName}`,
      });
    } catch (err: any) {
      console.error(`  ❌ ÉCHEC Cas ${testCase.num}: ${err.message}\n`);
      results.push({
        num: testCase.num,
        label: testCase.label,
        type: testCase.type,
        uid: "-",
        codeMECeF: "-",
        totalDGI: 0,
        totalComptia: 0,
        counters: "-",
        dateTime: "-",
        status: "ÉCHEC",
        error: err.message,
      });
    }
  }

  // ─── Génération du rapport Markdown d'homologation ──────────────────────────
  const reportPath = path.join(outDir, "rapport.md");
  let reportMd = `# Rapport d'Homologation SFE — e-MECeF DGI Bénin\n\n`;
  reportMd += `**Éditeur** : Brightbook Studio / Comptia\n`;
  reportMd += `**NIM** : \`${config.nim}\` | **IFU** : \`${config.ifu}\`\n`;
  reportMd += `**Date de génération** : ${new Date().toLocaleString("fr-FR")}\n`;
  reportMd += `**Environnement** : Sandbox SyGMEF (${config.baseUrl})\n\n`;

  reportMd += `| Cas # | Type | Description | Montant DGI | Code MECeF / DGI | Compteurs | PDF | Statut | Contrôle DGI |\n`;
  reportMd += `| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

  for (const r of results) {
    const verifLink = `[Vérifier](https://developper.impots.bj/sygmef-test/verification)`;
    reportMd += `| **${String(r.num).padStart(2, "0")}** | \`${r.type}\` | ${r.label} | ${r.totalDGI} FCFA | \`${r.codeMECeF}\` | \`${r.counters}\` | [PDF](${r.pdfPath || "#"}) | ${r.status === "SUCCÈS" ? "✅ SUCCÈS" : "❌ " + r.error} | [ ] ${verifLink} |\n`;
  }

  reportMd += `\n---\n\n`;
  reportMd += `### Instructions pour l'envoi du dossier d'auto-déclaration à la DGI :\n`;
  reportMd += `1. Ouvrez l'URL https://developper.impots.bj/sygmef-test/verification pour chaque facture et vérifiez la concordance exacte avec le PDF.\n`;
  reportMd += `2. Joignez les 20 fichiers PDF générés dans le dossier \`./homologation/\`.\n`;
  reportMd += `3. Remplissez le document \`Auto_declaration_de_SFE_avec_e-MECeF.docx\` (Annexes 1 et 2).\n`;
  reportMd += `4. Transmettez le dossier complet à **emecefbenin@finances.bj**.\n`;

  fs.writeFileSync(reportPath, reportMd, "utf-8");
  console.log(`📄 Rapport complet généré dans : file://${reportPath}`);
  console.log("================================================================");
}

runHomologation().catch((err) => {
  console.error("Erreur fatale d'exécution :", err);
  process.exit(1);
});
