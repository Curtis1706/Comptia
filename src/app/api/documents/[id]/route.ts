import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/require-permission";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

/**
 * GET /api/documents/[id]
 * Requires 'read' on documents.
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "documents", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const doc = await prisma.document.findUnique({
      where: { id, company_id: user.company_id },
    });

    if (!doc) {
      return errorResponse("Document non trouvé", 404);
    }

    return NextResponse.json(successResponse(doc));
  } catch (err) {
    console.error("[GET /api/documents/[id]]", err);
    return handlePrismaError(err);
  }
}

/**
 * DELETE /api/documents/[id]
 * Requires 'full' on documents.
 */
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "documents", "full");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const doc = await prisma.document.findUnique({
      where: { id, company_id: user.company_id },
    });

    if (!doc) {
      return errorResponse("Document non trouvé", 404);
    }

    await prisma.document.delete({
      where: { id },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      entity: "Document",
      entity_id: id,
    });

    return NextResponse.json(successResponse(null, "Document supprimé"));
  } catch (err) {
    return handlePrismaError(err);
  }
}
