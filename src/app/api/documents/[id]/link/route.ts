import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

/**
 * POST /api/documents/[id]/link
 * Associates a document with a journal entry.
 */
export const POST = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = params as { id: string };
    const { journal_entry_id } = await req.json();

    if (!journal_entry_id) {
      return errorResponse("ID de l'écriture manquante", 400);
    }

    // 1. Verify ownership
    const [doc, entry] = await Promise.all([
      prisma.document.findUnique({ where: { id, company_id: user.company_id } }),
      prisma.journalEntry.findUnique({ where: { id: journal_entry_id, company_id: user.company_id } }),
    ]);

    if (!doc || !entry) {
      return errorResponse("Document ou écriture non trouvée", 404);
    }

    // 2. Link
    await prisma.document.update({
      where: { id },
      data: { journal_entry_id },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      resource: "Document",
      resource_id: id,
      new_data: { journal_entry_id },
    });

    return NextResponse.json(successResponse(null, "Document lié avec succès"));
  } catch (err) {
    console.error("[POST /api/documents/[id]/link]", err);
    return handlePrismaError(err);
  }
});
