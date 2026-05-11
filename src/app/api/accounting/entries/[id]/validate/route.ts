import { prisma } from "@/lib/prisma";
import { withAuth, requireRole } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

/**
 * POST /api/accounting/entries/[id]/validate
 * Validates a journal entry (irreversible). Requires accountant or admin role.
 */
export const POST = withAuth(async (_req, { user, params }) => {
  const roleError = requireRole(user, ["admin", "accountant"]);
  if (roleError) return roleError;

  try {
    const entry = await prisma.journalEntry.findFirst({
      where: { id: params?.id, company_id: user.company_id },
      include: { lines: true },
    });

    if (!entry) return errorResponse("Écriture introuvable", 404);

    if (entry.status === "validated") {
      return errorResponse("Cette écriture est déjà validée", 400);
    }

    const updated = await prisma.journalEntry.update({
      where: { id: params?.id },
      data: { status: "validated" },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "VALIDATE",
      resource: "JournalEntry",
      resource_id: params?.id ?? "",
      old_data: { status: entry.status },
      new_data: { status: "validated" },
    });

    return successJson(updated, "Écriture validée définitivement");
  } catch (err) {
    return handlePrismaError(err);
  }
});
