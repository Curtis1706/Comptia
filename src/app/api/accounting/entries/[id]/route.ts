import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

export const DELETE = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = await params;

    const entry = await prisma.journalEntry.findUnique({
      where: { id, company_id: user.company_id }
    });

    if (!entry) return errorResponse("Écriture non trouvée", 404);
    if (entry.status === "validated") return errorResponse("Impossible de supprimer une écriture validée", 403);

    await prisma.journalEntry.delete({
      where: { id }
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      resource: "JournalEntry",
      resource_id: id,
      old_data: entry
    });

    return successJson({ deleted: true }, "Écriture supprimée avec succès");
  } catch (err) {
    return handlePrismaError(err);
  }
});
