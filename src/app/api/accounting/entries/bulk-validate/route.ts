import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse("Aucun ID fourni", 400);
    }

    // Update status to 'validated'
    const updated = await prisma.journalEntry.updateMany({
      where: {
        id: { in: ids },
        company_id: user.company_id,
        status: "draft" // Only validate drafts
      },
      data: {
        status: "validated"
      }
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "VALIDATE",
      resource: "JournalEntry",
      resource_id: "multiple",
      new_data: { count: updated.count, ids }
    });

    return successJson({ count: updated.count }, `${updated.count} écritures validées avec succès`);
  } catch (err) {
    return handlePrismaError(err);
  }
});
