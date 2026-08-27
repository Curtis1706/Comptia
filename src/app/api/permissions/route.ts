import { requirePermission } from "@/lib/require-permission";
import { getCurrentUser } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_PERMISSIONS,
  Module,
  Permission,
  MODULES,
  MODULE_LABELS,
  ROLE_LABELS,
  PERMISSION_LEVEL_LABELS,
} from "@/lib/permissions";
import { checkInvariants } from "@/lib/permission-invariants";
import { getEffectiveMatrix, invalidateMatrixCache } from "@/lib/effective-permissions";
import { logAction } from "@/lib/audit";

/**
 * GET /api/permissions
 * Retourne la matrice effective, les défauts et les surcharges de l'entreprise.
 * Accessible à tout utilisateur authentifié.
 */
export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) {
    return errorResponse("Non authentifié", 401);
  }

  try {
    const matrix = await getEffectiveMatrix(prisma, user.company_id);
    const overrides = await prisma.rolePermissionOverride.findMany({
      where: { company_id: user.company_id },
      orderBy: { updated_at: "desc" },
    });

    return successJson({
      matrix,
      defaults: DEFAULT_PERMISSIONS,
      overrides,
      userRole: user.role,
    });
  } catch (err: any) {
    return handlePrismaError(err);
  }
}

/**
 * PUT /api/permissions
 * Modifie la permission d'un rôle pour un module donné dans l'entreprise.
 * Exige 'write' sur user_management (réservé owner et admin).
 */
export async function PUT(req: Request) {
  const permCheck = await requirePermission(req, "user_management", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const body = await req.json();
    const { role, module: mod, permission: perm } = body;

    if (!role || !mod || !perm) {
      return errorResponse("Champs 'role', 'module' et 'permission' obligatoires.", 400);
    }

    if (!MODULES.includes(mod as Module)) {
      return errorResponse(`Module '${mod}' inconnu.`, 400);
    }

    // 1. Calcul de la matrice effective de l'acteur courant
    const currentMatrix = await getEffectiveMatrix(prisma, user.company_id);

    // 2. Vérification des invariants
    const violation = checkInvariants(role, mod as Module, perm as Permission, {
      role: user.role,
      effective: currentMatrix[user.role],
    });

    if (violation) {
      return errorResponse(violation.message, 422);
    }

    const defaultPerm = DEFAULT_PERMISSIONS[role as keyof typeof DEFAULT_PERMISSIONS]?.[mod as Module];
    const previousPerm = currentMatrix[role as keyof typeof DEFAULT_PERMISSIONS]?.[mod as Module] || defaultPerm;

    // 3. Mise à jour ou suppression si retour au défaut
    if (perm === defaultPerm) {
      await prisma.rolePermissionOverride.deleteMany({
        where: {
          company_id: user.company_id,
          role,
          module: mod,
        },
      });
    } else {
      await prisma.rolePermissionOverride.upsert({
        where: {
          company_id_role_module: {
            company_id: user.company_id,
            role,
            module: mod,
          },
        },
        create: {
          company_id: user.company_id,
          role,
          module: mod,
          permission: perm,
          updated_by: user.id,
        },
        update: {
          permission: perm,
          updated_by: user.id,
        },
      });
    }

    // 4. Invalidation du cache
    invalidateMatrixCache(user.company_id);

    // 5. Journalisation d'audit
    const roleLabel = ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role;
    const modLabel = MODULE_LABELS[mod as Module] || mod;
    const oldLabel = PERMISSION_LEVEL_LABELS[previousPerm as Permission] || previousPerm;
    const newLabel = PERMISSION_LEVEL_LABELS[perm as Permission] || perm;

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      entity: "RolePermissionOverride",
      entity_id: `${role}:${mod}`,
      details: {
        description: `${user.name} a modifié ${roleLabel} → ${modLabel} : ${oldLabel} → ${newLabel}`,
        role,
        module: mod,
        old_permission: previousPerm,
        new_permission: perm,
      },
    });

    const updatedMatrix = await getEffectiveMatrix(prisma, user.company_id);

    return successJson(
      { matrix: updatedMatrix },
      `Permission mise à jour : ${roleLabel} → ${modLabel} (${newLabel})`
    );
  } catch (err: any) {
    return handlePrismaError(err);
  }
}
