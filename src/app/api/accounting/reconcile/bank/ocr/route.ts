import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { parseBankTextToOperations } from "@/lib/bank-ocr-parser";
import Tesseract from "tesseract.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Configure de manière sécurisée pdfjs-dist en environnement Node.js / Serverless.
 */
async function getPdfJs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  return pdfjs;
}

export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "bank_reconciliation", "write");
  if (!permCheck.ok) return permCheck.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string" || !file.name) {
      return errorResponse("Aucun fichier fourni", 400);
    }

    const MAX_SIZE = 15 * 1024 * 1024; // 15 MB
    if (file.size > MAX_SIZE) {
      return errorResponse("Fichier trop volumineux (max 15 Mo)", 413);
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isPdf = ext === "pdf" || file.type === "application/pdf";
    const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext) || file.type.startsWith("image/");

    if (!isPdf && !isImage) {
      return errorResponse("Format non supporté pour l'analyse visuelle. Formats acceptés : PDF, JPG, PNG, WEBP", 415);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    if (isPdf) {
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
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        extractedText = fullText;
      } catch (pdfErr) {
        console.warn("[Bank OCR] Échec extraction texte direct PDF :", pdfErr);
      }
    }

    // Si c'est une image ou si le PDF n'a pas donné de texte (PDF scanné / image)
    if ((!extractedText || extractedText.trim().length === 0) && isImage) {
      try {
        const {
          data: { text: tesseractText },
        } = await Tesseract.recognize(buffer, "fra+eng");
        extractedText = tesseractText;
      } catch (tessErr) {
        console.warn("[Bank OCR] Tesseract échec :", tessErr);
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return errorResponse("Impossible d'extraire du texte lisible depuis cette image ou ce PDF.", 422);
    }

    const operations = parseBankTextToOperations(extractedText);

    return successJson({
      operations,
      count: operations.length,
      raw_text: extractedText.slice(0, 1000),
    });
  } catch (err) {
    return handlePrismaError(err);
  }
}
