import Tesseract from "tesseract.js";
import { prisma } from "./prisma";
import { storage } from "./storage";

/**
 * Configure de manière sécurisée pdfjs-dist en environnement Node.js / Serverless.
 */
async function getPdfJs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  if (typeof window === "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
    try {
      // Résolution ESM moderne évitant les avertissements de module mixte en production
      const workerUrl = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).href;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    } catch {
      // Éviter impérativement de renseigner un workerSrc http(s) en Node.js,
      // ce qui ferait planter l'ESM loader avec "Only URLs with a scheme in: file, data are supported".
    }
  }

  return pdfjs;
}

/**
 * Lance l'OCR sur un document et met à jour extracted_data.
 */
export async function processOCR(
  documentId: string,
  fileUrl: string,
  companyId: string
): Promise<void> {
  await prisma.document.update({
    where: { id: documentId },
    data: { status: "processing" },
  });

  try {
    // 1. Récupération du buffer (R2, local ou sauvegarde base64 en base)
    let buffer = await storage.getFileBuffer(fileUrl);
    if (!buffer) {
      const existingDoc = await prisma.document.findUnique({
        where: { id: documentId },
        select: { extracted_data: true },
      });
      if ((existingDoc?.extracted_data as any)?._raw_base64) {
        buffer = Buffer.from((existingDoc!.extracted_data as any)._raw_base64, "base64");
      }
    }

    if (!buffer) {
      throw new Error(`Fichier introuvable pour le traitement OCR : ${fileUrl}`);
    }

    let text = "";
    const isPdf = fileUrl.toLowerCase().includes(".pdf");

    if (isPdf) {
      // 2. Extraction PDF via pdfjs-dist
      try {
        const pdfjs = await getPdfJs();
        const data = new Uint8Array(buffer);
        const loadingTask = pdfjs.getDocument({
          data,
          useSystemFonts: true,
          disableFontFace: true,
        });
        const pdf = await loadingTask.promise;

        let fullText = "";
        for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        text = fullText;
      } catch (pdfErr) {
        console.warn("[OCR] Échec extraction texte PDF direct, tentative OCR image :", pdfErr);
      }
    }

    // 3. Si aucun texte extrait ou format image, passer par Tesseract OCR
    if (!text || text.trim().length === 0) {
      try {
        const {
          data: { text: tesseractText },
        } = await Tesseract.recognize(buffer, "fra+eng");
        text = tesseractText;
      } catch (tessErr) {
        console.warn("[OCR] Tesseract n'a pas pu traiter l'image :", tessErr);
      }
    }

    // 4. Analyse et extraction sémantique des données
    const extracted = parseOCRText(text);

    const docBeforeUpdate = await prisma.document.findUnique({
      where: { id: documentId },
      select: { extracted_data: true },
    });
    const currentData = (docBeforeUpdate?.extracted_data as Record<string, any>) || {};

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "processed",
        extracted_data: {
          ...currentData,
          ...extracted,
          _raw_text: text ? text.slice(0, 2000) : undefined,
        } as any,
      },
    });
  } catch (error: any) {
    console.error("[OCR] Erreur critique lors de l'OCR du document", documentId, ":", error);
    const existingDoc = await prisma.document.findUnique({
      where: { id: documentId },
      select: { extracted_data: true },
    });
    const currentData = (existingDoc?.extracted_data as Record<string, any>) || {};

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "error",
        extracted_data: {
          ...currentData,
          ocr_error: error?.message || "Échec du traitement OCR",
        } as any,
      },
    });
  }
}

/**
 * Extrait les informations financières et fiscales clés du texte OCR.
 * Optimisé pour les factures Bénin / SYSCOHADA (e-MECeF, FCFA, IFU 13 chiffres)
 * et les formats internationaux (EUR, USD).
 */
export function parseOCRText(text: string): {
  amount?: number;
  vat_amount?: number;
  vendor_siret?: string;
  invoice_number?: string;
  date?: Date;
  vendor_name?: string;
} {
  if (!text || typeof text !== "string") return {};

  // 1. Détection de l'IFU (Bénin : 13 chiffres)
  // Gère aussi les cas où le texte PDF a des espaces entre chaque lettre ("I F U : 3 2 0 2 6 8 7 2 9 0 1 5 4")
  let vendorSiret: string | undefined;
  const ifuSpacedMatch = text.match(/I\s*F\s*U\s*[:\s]*((?:[0-9]\s*){13,15})/i);
  if (ifuSpacedMatch) {
    vendorSiret = ifuSpacedMatch[1].replace(/\s/g, "");
  } else {
    const siretMatch = text.match(/(?:ifu|siret)[\s:#]*(\d[\d\s]{8,15})/i);
    if (siretMatch) {
      vendorSiret = siretMatch[1].replace(/\s/g, "");
    }
  }

  // 2. Détection du N° de facture ou Référence
  // Ex: "Facture # EM018683313", "Réf : REL-BOUQUET-425613", "Code MECeF/DGI IUWIYCCODI47LM5E7MF6VXPM"
  let invoiceNumber: string | undefined;
  const invoiceMatch = text.match(
    /(?:facture\s*#?|réf(?:érence)?\s*[:#]|ref\s*[:#]|n°\s*facture|numero\s*facture)[\s:#]*([A-Z0-9\-_/]{4,30})/i
  );
  if (invoiceMatch) {
    invoiceNumber = invoiceMatch[1].trim();
  } else {
    const mecefMatch = text.match(/Code\s*MECeF\/DGI[\s:]*([A-Z0-9]{15,30})/i);
    if (mecefMatch) {
      invoiceNumber = mecefMatch[1].trim();
    }
  }

  // 3. Détection de la Date
  // Formats: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
  let date: Date | undefined;
  const dateMatch =
    text.match(/(?:date(?:\s*d'émission)?[\s:]*)?(\d{2})[\/\-](\d{2})[\/\-](\d{4})/i) ||
    text.match(/(\d{4})[\/\-](\d{2})[\/\-](\d{2})/);
  if (dateMatch) {
    if (dateMatch[3] && dateMatch[3].length === 4) {
      const d = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`);
      if (!isNaN(d.getTime())) date = d;
    } else if (dateMatch[1] && dateMatch[1].length === 4) {
      const d = new Date(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`);
      if (!isNaN(d.getTime())) date = d;
    }
  }

  // 4. Détection du Montant Total TTC
  let amount: number | undefined;

  // Pattern A: "T o t a l : 2 . 0 2 0 . 0 0 0" (lettres et chiffres espacés)
  const spacedTotalMatch = text.match(/T\s*o\s*t\s*a\s*l\s*[:\s]*((?:[0-9]\s*[\.,]?\s*)+)/i);
  if (spacedTotalMatch) {
    const rawDigits = spacedTotalMatch[1].replace(/\s/g, "");
    amount = parseFormattedAmount(rawDigits);
  }

  // Pattern B: Total TTC / Net à payer / Montant TTC standard
  if (!amount) {
    const totalMatch = text.match(
      /(?:total\s+(?:ttc|à\s+payer|net)|montant\s+t\.?t\.?c\.?|redevances(?:\s+bouquets)?\s+nettes|total[\s:]*)[\s:]*([\d\s\.,]+?)(?:\s*(?:FCFA|F\s*CFA|CFA|XOF|€|EUR|\n|$))/i
    );
    if (totalMatch) {
      amount = parseFormattedAmount(totalMatch[1]);
    }
  }

  // Pattern C: "Arrêté ... à la somme de ... CFA TTC" ou "Payé ... 2.020.000"
  if (!amount) {
    const payeMatch = text.match(/(?:payé|réglé)[\s\w]*?([\d\s\.,]{3,20})(?:\s*(?:FCFA|CFA|XOF|\n|$))/i);
    if (payeMatch) {
      amount = parseFormattedAmount(payeMatch[1]);
    }
  }

  // 5. Détection de la TVA
  let vatAmount: number | undefined;
  const vatMatch = text.match(
    /(?:tva|t\.v\.a)(?:\s*(?:18%|normale))?[\s:]*([\d\s\.,]+?)(?:\s*(?:FCFA|F\s*CFA|CFA|XOF|€|EUR|\n|$))/i
  );
  if (vatMatch) {
    vatAmount = parseFormattedAmount(vatMatch[1]);
  } else {
    const aibMatch = text.match(/(?:aib|tps)[\s\d%:]*?([\d\s\.,]+?)(?:\s*(?:FCFA|XOF|\n|$))/i);
    if (aibMatch) {
      vatAmount = parseFormattedAmount(aibMatch[1]);
    }
  }

  // 6. Nom du fournisseur / Émetteur
  let vendorName: string | undefined;

  // Pattern A: "FACTURE DE VENTE <NOM>" (jusqu'à IFU, RCCM, date, ou fin de ligne)
  const factureVenteMatch = text.match(
    /FACTURE\s+DE\s+VENTE\s+([A-Z0-9\s\-]+?)(?=\s*(?:I\s*F\s*U|RCCM|R\s*C\s*C\s*M|N°|Date|Contact|$))/i
  );
  if (factureVenteMatch) {
    vendorName = factureVenteMatch[1].trim();
  }

  // Pattern B: Entreprise spécifique mentionnée avec S.A., SARL, SAS, etc.
  if (!vendorName) {
    const legalEntityMatch = text.match(
      /([A-ZÀ-Ÿ0-9\s\-]{3,35}\s+(?:S\.?A\.?R\.?L\.?|S\.?A\.?|S\.?A\.?S\.?|ETS|ÉDITIONS|SOLUTIONS))/i
    );
    if (legalEntityMatch) {
      vendorName = legalEntityMatch[1].trim();
    }
  }

  // Pattern C: Mots-clés "Vendeur : ...", "Émetteur : ..."
  if (!vendorName) {
    const vendorKeywordMatch = text.match(
      /(?:vendeur\s*[:#]|émetteur\s*[:#]|fournisseur\s*[:#]|société\s*[:#])\s*([^\n\r]{3,35})/i
    );
    if (vendorKeywordMatch) {
      let v = vendorKeywordMatch[1].trim();
      v = v.replace(/^(?:sfe en ligne\s*)/i, "").trim();
      if (v) vendorName = v;
    }
  }

  // Pattern D: Première ligne non vide et courte (< 50 chars)
  if (!vendorName) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 2 && l.length < 50 && !/^\d/.test(l) && !/^facture/i.test(l) && !/^page/i.test(l));
    if (lines.length > 0) {
      vendorName = lines[0];
    }
  }

  return {
    amount,
    vat_amount: vatAmount,
    vendor_siret: vendorSiret,
    invoice_number: invoiceNumber,
    date,
    vendor_name: vendorName,
  };
}

function parseFormattedAmount(str: string): number | undefined {
  if (!str) return undefined;
  const clean = str.trim().replace(/\s+/g, "");

  // Si forme "2.020.000" (points séparateurs de milliers)
  if (/^\d{1,3}(\.\d{3})+$/.test(clean)) {
    return parseFloat(clean.replace(/\./g, ""));
  }
  // Si forme "2.020.000,00"
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})$/.test(clean)) {
    return parseFloat(clean.replace(/\./g, "").replace(",", "."));
  }
  // Si forme "5,1" ou "1200,50"
  if (/^\d+,\d+$/.test(clean)) {
    return parseFloat(clean.replace(",", "."));
  }
  // Si forme "2020000"
  if (/^\d+$/.test(clean)) {
    return parseFloat(clean);
  }
  // Si forme "1200.50"
  if (/^\d+\.\d{1,2}$/.test(clean)) {
    return parseFloat(clean);
  }
  const fallback = parseFloat(clean.replace(/,/g, "."));
  return isNaN(fallback) ? undefined : fallback;
}
