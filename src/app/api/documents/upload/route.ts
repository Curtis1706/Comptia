import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/documents/upload
 * Handles file upload and triggers background OCR. Requires 'write' on documents.
 */
export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "documents", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "other";

    if (!file || typeof file === "string" || !file.name) {
      return errorResponse("Aucun fichier valide fourni", 400);
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      return errorResponse("Fichier trop volumineux (max 10 MB)", 413);
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowedMimes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    const allowedExts = ["pdf", "jpg", "jpeg", "png", "webp"];
    const isMimeAllowed = allowedMimes.includes(file.type);
    const isExtAllowed = allowedExts.includes(ext);

    if (!isMimeAllowed && !isExtAllowed) {
      return errorResponse("Format non supporté. Acceptés : PDF, JPEG, PNG, WEBP", 415);
    }

    const safeMime = isMimeAllowed
      ? file.type
      : ext === "pdf"
      ? "application/pdf"
      : `image/${ext === "jpg" ? "jpeg" : ext}`;

    const cleanExt = ext || (safeMime === "application/pdf" ? "pdf" : "png");
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${cleanExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Sauvegarde sur le stockage physique résilient (/tmp ou public/uploads)
    const fileUrl = await storage.uploadFile(buffer, filename, user.company_id);
    const base64Data = file.size <= 1.5 * 1024 * 1024 ? buffer.toString("base64") : undefined;

    // 2. Création du document
    const doc = await prisma.document.create({
      data: {
        company_id: user.company_id,
        filename: filename,
        original_filename: file.name,
        type: (["invoice", "receipt", "bank_statement", "other"].includes(type) ? type : "other") as any,
        file_url: fileUrl,
        file_size: file.size,
        mime_type: safeMime,
        status: "uploaded",
        uploaded_by: user.id,
        extracted_data: base64Data ? { _raw_base64: base64Data } : undefined,
      },
    });

    // 3. Déclenchement OCR asynchrone découplé en tâche de fond
    const shouldProcess = safeMime.startsWith("image/") || safeMime === "application/pdf";
    if (shouldProcess) {
      setTimeout(() => {
        import("@/lib/ocr")
          .then(({ processOCR }) => processOCR(doc.id, fileUrl, user.company_id))
          .catch((ocrErr) => {
            console.error("[POST /api/documents/upload] Erreur OCR en tâche de fond :", ocrErr);
          });
      }, 50);
    }

    // 4. Piste d'audit
    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "Document",
      entity_id: doc.id,
      details: { filename: doc.original_filename, size: doc.file_size },
    });

    return successJson(doc, "Fichier uploadé avec succès", 201);
  } catch (err: any) {
    console.error("[POST /api/documents/upload] Erreur:", err);
    return errorResponse(err?.message || "Erreur lors du téléversement du fichier", 500);
  }
}
