import { PrismaClient } from "@prisma/client";
import {
  UserRole,
  DEFAULT_PERMISSIONS,
  Module,
  Permission,
  PermissionMatrix,
  MODULES,
} from "./permissions";
import { checkStructuralInvariants } from "./permission-invariants";

// ─── Cache en mémoire (TTL 60s) ───────────────────────────────────────────────
const cache = new Map<string, { matrix: PermissionMatrix; expires: number }>();
const TTL_MS = 60_000;
const ERROR_TTL_MS = 5_000; // TTL réduit en cas d'erreur transitoire de la base

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
  let hasDbError = false;

  try {
    // 2. Chargement des surcharges depuis la base
    const overrides = await prisma.rolePermissionOverride.findMany({
      where: { company_id: companyId },
    });

    // 3. Application des surcharges validées par les invariants structurels (R1-R4)
    for (const ov of overrides) {
      const role = ov.role as UserRole;
      const mod = ov.module as Module;
      const perm = ov.permission as Permission;

      if (!matrix[role] || !MODULES.includes(mod)) continue;

      // Seules les règles structurelles sur la donnée sont vérifiées à la lecture
      const violation = checkStructuralInvariants(role, mod, perm);

      if (!violation) {
        matrix[role][mod] = perm;
      }
    }
  } catch (err) {
    hasDbError = true;
    console.error(
      `[RBAC CRITICAL ALERT] Échec de lecture des surcharges RBAC pour company_id=${companyId}. Les surcharges personnalisées n'ont pas pu être appliquées :`,
      err
    );

    // Notification administrative asynchrone non-bloquante
    try {
      await prisma.notification
        .create({
          data: {
            company_id: companyId,
            title: "Alerte de synchronisation RBAC",
            message:
              "Une erreur temporaire est survenue lors de la lecture des surcharges de permissions. La matrice standard sécurisée a été appliquée par précaution.",
            type: "warning",
            is_read: false,
          },
        })
        .catch(() => {});
    } catch {
      // Ignore les erreurs d'écriture de notification si la base est totalement indisponible
    }
  }

  // 4. Mise en cache (TTL réduit en cas d'erreur pour restaurer au plus vite dès récupération)
  cache.set(companyId, {
    matrix,
    expires: now + (hasDbError ? ERROR_TTL_MS : TTL_MS),
  });

  return matrix;
}
