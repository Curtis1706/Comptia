import { PrismaClient } from "@prisma/client";
import { UserRole } from "./auth-guard";
import {
  DEFAULT_PERMISSIONS,
  Module,
  Permission,
  PermissionMatrix,
  MODULES,
} from "./permissions";
import { checkInvariants } from "./permission-invariants";

// ─── Cache en mémoire (TTL 60s) ───────────────────────────────────────────────
const cache = new Map<string, { matrix: PermissionMatrix; expires: number }>();
const TTL_MS = 60_000;

export function invalidateMatrixCache(companyId: string): void {
  cache.delete(companyId);
}

/**
 * Calcule la matrice de permissions effective pour une entreprise en fusionnant
 * les valeurs par défaut et les surcharges stockées en base de données.
 */
export async function getEffectiveMatrix(
  prisma: PrismaClient,
  companyId: string
): Promise<PermissionMatrix> {
  const now = Date.now();
  const cached = cache.get(companyId);
  if (cached && cached.expires > now) {
    return cached.matrix;
  }

  // 1. Copie profonde de DEFAULT_PERMISSIONS
  const matrix: PermissionMatrix = JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS));

  try {
    // 2. Chargement des surcharges depuis la base
    const overrides = await prisma.rolePermissionOverride.findMany({
      where: { company_id: companyId },
    });

    // 3. Application des surcharges validées par les invariants
    for (const ov of overrides) {
      const role = ov.role as UserRole;
      const mod = ov.module as Module;
      const perm = ov.permission as Permission;

      if (!matrix[role] || !MODULES.includes(mod)) continue;

      // Validation par les invariants (considéré sous autorité owner par défaut pour la lecture)
      const violation = checkInvariants(role, mod, perm, {
        role: "owner",
        effective: matrix.owner,
      });

      if (!violation) {
        matrix[role][mod] = perm;
      }
    }
  } catch (err) {
    console.error("[getEffectiveMatrix] Erreur lors de la récupération des surcharges :", err);
    // En cas d'erreur DB, retourner la matrice par défaut de repli
  }

  // 4. Mise en cache
  cache.set(companyId, { matrix, expires: now + TTL_MS });

  return matrix;
}
