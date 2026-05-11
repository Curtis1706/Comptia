import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import { processOCR } from "@/lib/ocr";
import { storage } from "@/lib/storage";

/**
 * POST /api/documents/upload
 * Handles file upload and triggers background OCR.
 */
export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "other";

    if (!file) return errorResponse("Aucun fichier fourni", 400);

    // 1. Validation
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse("Format non supporté. Acceptés : PDF, JPEG, PNG, WEBP", 415);
    }
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      return errorResponse("Fichier trop volumineux (max 10 MB)", 413);
    }

    // 2. Generate unique filename and upload
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const fileUrl = await storage.uploadFile(buffer, filename, user.company_id);

    // 4. Create Document entry
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

    // 5. Trigger OCR (fire and forget)
    const shouldProcess = file.type.startsWith("image/") || file.type === "application/pdf";
    if (shouldProcess) {
       processOCR(doc.id, fileUrl, user.company_id).catch(console.error);
    }

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      resource: "Document",
      resource_id: doc.id,
      new_data: { filename: doc.original_filename, size: doc.file_size },
    });

    return successJson(doc, "Fichier uploadé avec succès", 201);
  } catch (err) {
    console.error("[POST /api/documents/upload]", err);
    return handlePrismaError(err);
  }
});
