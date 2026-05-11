import Tesseract from "tesseract.js";
import { prisma } from "./prisma";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

// Fix for pdfjs in Node environment
if (typeof window === "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
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
    where: { id: documentId, company_id: companyId },
    data: { status: "processing" },
  });

  try {
    const filePath = `./public${fileUrl}`;
    let text = "";

    if (fileUrl.toLowerCase().endsWith(".pdf")) {
      // 1. PDF Extraction via pdfjs-dist
      const data = new Uint8Array(require("fs").readFileSync(filePath));
      const loadingTask = pdfjs.getDocument({ data });
      const pdf = await loadingTask.promise;
      
      let fullText = "";
      for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
      }
      text = fullText;
    } else {
      // 2. Image Extraction via Tesseract
      const { data: { text: tesseractText } } = await Tesseract.recognize(filePath, "fra+eng");
      text = tesseractText;
    }

    const extracted = parseOCRText(text);

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "processed",
        extracted_data: extracted as any,
      },
    });
  } catch (error) {
    console.error("[OCR] Erreur", error);
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "error" },
    });
  }
}

/**
 * Extrait les informations clés du texte OCR.
 * Utilise des regex pour les patterns communs des factures françaises.
 */
function parseOCRText(text: string): any {
  // Montant : regex pour captures comme "1 200,00 €" ou "1200.00 EUR"
  const amountMatch = text.match(
    /(?:total\s+(?:ttc|à\s+payer|net)[\s:]*)([\d\s]+[,.][\d]{2})\s*(?:€|EUR)/i
  );
  const amount = amountMatch
    ? parseFloat(amountMatch[1].replace(/\s/g, "").replace(",", "."))
    : undefined;

  // TVA
  const vatMatch = text.match(
    /(?:tva|t\.v\.a)[\s:]*(?:\d{1,2}%)?[\s:]*([\d\s]+[,.][\d]{2})\s*(?:€|EUR)/i
  );
  const vatAmount = vatMatch
    ? parseFloat(vatMatch[1].replace(/\s/g, "").replace(",", "."))
    : undefined;

  // SIRET/IFU : 14 chiffres (FR) or 13 digits (BJ IFU)
  const siretMatch = text.match(/(?:siret|ifu)[\s:#]*(\d[\d\s]{8,15})/i);
  const vendorSiret = siretMatch ? siretMatch[1].replace(/\s/g, "") : undefined;

  // N° de facture
  const invoiceMatch = text.match(
    /(?:facture|devis|ref|référence|n°|numero)[\s:#]*([A-Z0-9-]{4,20})/i
  );
  const invoiceNumber = invoiceMatch?.[1];

  // Date : formats DD/MM/YYYY ou DD-MM-YYYY
  const dateMatch = text.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
  const date = dateMatch
    ? new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`)
    : undefined;

  // Nom fournisseur : heuristique — première ligne en majuscules
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const vendorName = lines.find(
    (l) => l.length > 3 && l === l.toUpperCase() && !/^\d/.test(l)
  );

  return {
    amount,
    vat_amount: vatAmount,
    vendor_siret: vendorSiret,
    invoice_number: invoiceNumber,
    date: date && !isNaN(date.getTime()) ? date : undefined,
    vendor_name: vendorName,
  };
}
