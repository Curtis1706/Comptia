import { NextResponse } from "next/server";
import { getCurrentUser, AuthenticatedUser } from "./auth-guard";
import { prisma } from "./prisma";
import {
  Module,
  Permission,
  PermissionMatrix,
  meetsLevel,
  MODULE_LABELS,
  ROLE_LABELS,
  PERMISSION_LEVEL_LABELS,
} from "./permissions";
import { getEffectiveMatrix } from "./effective-permissions";
import { errorResponse } from "./api-response";

export type PermissionCheckResult =
  | { ok: true; user: AuthenticatedUser; matrix: PermissionMatrix; response?: undefined }
  | { ok: false; response: NextResponse; user?: undefined; matrix?: undefined };

/**
 * Middleware d'autorisation vérifiant que l'utilisateur possède le niveau de permission
 * requis sur le module spécifié selon la matrice effective de son entreprise.
 */
export async function requirePermission(
  req: Request,
  module: Module,
  level: Permission
): Promise<PermissionCheckResult> {
  // 1. Authentification
  const user = await getCurrentUser(req);
  if (!user) {
    return {
      ok: false,
      response: errorResponse("Non authentifié", 401),
    };
  }

  // 2. Matrice effective
  const matrix = await getEffectiveMatrix(prisma, user.company_id);
  const userPerm = matrix[user.role]?.[module] || "none";

  // 3. Contrôle du niveau
  if (!meetsLevel(userPerm, level)) {
    const roleLabel = ROLE_LABELS[user.role] || user.role;
    const moduleLabel = MODULE_LABELS[module] || module;
    const requiredLevelLabel = PERMISSION_LEVEL_LABELS[level] || level;

    return {
      ok: false,
      response: errorResponse(
        `Accès refusé : le rôle ${roleLabel} n'a pas le niveau requis (${requiredLevelLabel}) sur le module ${moduleLabel}.`,
        403
      ),
    };
  }

  return {
    ok: true,
    user,
    matrix,
  };
}
