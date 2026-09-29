import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import { processOCR } from "@/lib/ocr";
import { after } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/documents/[id]/retry
 * Relance le traitement OCR sur un document existant.
 * Nécessite la permission 'write' sur le module 'documents'.
 */
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const permCheck = await requirePermission(req, "documents", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const doc = await prisma.document.findFirst({
      where: { id, company_id: user.company_id },
    });

    if (!doc) {
      return errorResponse("Document introuvable", 404);
    }

    // Mise à jour de l'état en 'processing'
    const updated = await prisma.document.update({
      where: { id },
      data: { status: "processing" },
    });

    // Déclenchement OCR asynchrone
    after(async () => {
      try {
        await processOCR(doc.id, doc.file_url, user.company_id);
      } catch (err) {
        console.error(`[POST /api/documents/${id}/retry] Erreur OCR :`, err);
        try {
          await prisma.document.update({
            where: { id: doc.id },
            data: { status: "error" },
          });
        } catch {}
      }
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      entity: "Document",
      entity_id: id,
      details: { action: "RETRY_OCR", filename: doc.original_filename },
    });

    return successJson(updated, "OCR relancé avec succès");
  } catch (err) {
    return handlePrismaError(err);
  }
}
