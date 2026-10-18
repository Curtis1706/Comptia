import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { parseBankTextToOperations } from "@/lib/bank-ocr-parser";
import Tesseract from "tesseract.js";
import os from "os";

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
  // Permission 'read' sur bank_reconciliation suffit pour analyser un document en aperçu
  const permCheck = await requirePermission(req, "bank_reconciliation", "read");
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

    // 1. Si PDF : extraction du flux textuel direct via pdfjs-dist
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

    // 2. Si image ou PDF sans texte extrait (document scanné) : Tesseract sécurisé
    if ((!extractedText || extractedText.trim().length === 0) && isImage) {
      let worker: any = null;
      try {
        worker = await Tesseract.createWorker("fra", 1, {
          cachePath: os.tmpdir(),
        });
        const result = await worker.recognize(buffer);
        extractedText = result.data.text || "";
      } catch (tessErr) {
        console.warn("[Bank OCR] Tesseract échec worker :", tessErr);
      } finally {
        if (worker) {
          try {
            await worker.terminate();
          } catch {}
        }
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return successJson({
        operations: [],
        count: 0,
        raw_text: "",
        message: "Aucun texte lisible n'a pu être extrait. Vous pouvez utiliser le copier-coller ou la saisie manuelle.",
      });
    }

    const operations = parseBankTextToOperations(extractedText);

    return successJson({
      operations,
      count: operations.length,
      raw_text: extractedText.slice(0, 2000),
    });
  } catch (err: any) {
    console.error("[POST /api/accounting/reconcile/bank/ocr] Erreur :", err);
    return errorResponse(err?.message || "Erreur interne lors de l'analyse OCR", 500);
  }
}
