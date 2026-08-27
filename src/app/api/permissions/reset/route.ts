import { requirePermission } from "@/lib/require-permission";
import { successJson, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/permissions";
import { getEffectiveMatrix, invalidateMatrixCache } from "@/lib/effective-permissions";
import { logAction } from "@/lib/audit";

/**
 * DELETE /api/permissions/reset
 * Réinitialise les surcharges d'un rôle ou de toute l'entreprise aux valeurs par défaut.
 * Exige 'write' sur user_management.
 */
export async function DELETE(req: Request) {
  const permCheck = await requirePermission(req, "user_management", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { role } = body;

    if (role) {
      await prisma.rolePermissionOverride.deleteMany({
        where: {
          company_id: user.company_id,
          role,
        },
      });
    } else {
      await prisma.rolePermissionOverride.deleteMany({
        where: {
          company_id: user.company_id,
        },
      });
    }

    // Invalidation du cache
    invalidateMatrixCache(user.company_id);

    // Journalisation d'audit
    const roleLabel = role ? ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role : "tous les rôles";
    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      entity: "RolePermissionOverride",
      entity_id: role || "ALL",
      details: {
        description: `${user.name} a réinitialisé les permissions pour ${roleLabel}`,
        role: role || "ALL",
      },
    });

    const updatedMatrix = await getEffectiveMatrix(prisma, user.company_id);

    return successJson(
      { matrix: updatedMatrix },
      `Permissions réinitialisées pour ${roleLabel}`
    );
  } catch (err: any) {
    return handlePrismaError(err);
  }
}
