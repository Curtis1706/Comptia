import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import { processOCR } from "@/lib/ocr";
import { storage } from "@/lib/storage";

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
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "other";

    if (!file) return errorResponse("Aucun fichier fourni", 400);

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse("Format non supporté. Acceptés : PDF, JPEG, PNG, WEBP", 415);
    }
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      return errorResponse("Fichier trop volumineux (max 10 MB)", 413);
    }

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileUrl = await storage.uploadFile(buffer, filename, user.company_id);

    const doc = await prisma.document.create({
      data: {
        company_id: user.company_id,
        filename: filename,
        original_filename: file.name,
        type: type as any,
        file_url: fileUrl,
        file_size: file.size,
        mime_type: file.type,
        status: "uploaded",
        uploaded_by: user.id,
      },
    });

    const shouldProcess = file.type.startsWith("image/") || file.type === "application/pdf";
    if (shouldProcess) {
      processOCR(doc.id, fileUrl, user.company_id).catch(console.error);
    }

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "Document",
      entity_id: doc.id,
      details: { filename: doc.original_filename, size: doc.file_size },
    });

    return successJson(doc, "Fichier uploadé avec succès", 201);
  } catch (err) {
    console.error("[POST /api/documents/upload]", err);
    return handlePrismaError(err);
  }
}
