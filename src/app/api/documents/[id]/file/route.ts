import { requirePermission } from "@/lib/require-permission";
import { errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";

/**
 * GET /api/documents/[id]/file
 * Télécharge ou affiche le fichier d'un document téléversé.
 * Nécessite la permission 'read' sur le module 'documents'.
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const permCheck = await requirePermission(req, "documents", "read");
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

    const buffer = await storage.getFileBuffer(doc.file_url);
    if (!buffer) {
      return errorResponse("Fichier physique introuvable ou expiré", 404);
    }

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": doc.mime_type || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(doc.original_filename)}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err: any) {
    console.error("[GET /api/documents/[id]/file] Erreur:", err);
    return errorResponse("Erreur lors de la lecture du fichier", 500);
  }
}
