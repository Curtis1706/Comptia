import { UserRole, Module, Permission, meetsLevel } from "./permissions";

export interface InvariantViolation {
  rule: string;
  message: string;
}

/**
 * Vérifie les 5 invariants stricts pour empêcher toute élévation de privilèges ou rupture de cohérence.
 */
export function checkInvariants(
  role: UserRole,
  module: Module,
  permission: Permission,
  actor: { role: UserRole; effective: Record<Module, Permission> }
): InvariantViolation | null {
  // R1 — La matrice du propriétaire n'est pas modifiable
  if (role === "owner") {
    return {
      rule: "R1",
      message: "La matrice du propriétaire n'est pas modifiable.",
    };
  }

  // R2 — L'abonnement reste exclusivement réservé à l'owner
  if (module === "subscription_billing" && role !== "owner" && permission !== "none") {
    return {
      rule: "R2",
      message: "L'abonnement reste réservé au propriétaire.",
    };
  }

  // R3 — La gestion des utilisateurs ne peut être accordée qu'au propriétaire ou à un administrateur
  if (
    module === "user_management" &&
    !["owner", "admin"].includes(role) &&
    permission !== "none"
  ) {
    return {
      rule: "R3",
      message:
        "La gestion des utilisateurs ne peut être accordée qu'au propriétaire ou à un administrateur. L'accorder à un autre rôle permettrait à son titulaire de s'attribuer des droits supplémentaires.",
    };
  }

  // R4 — L'espace cabinet est réservé aux experts-comptables externes
  if (module === "cabinet_management" && role !== "expert" && permission !== "none") {
    return {
      rule: "R4",
      message: "L'espace cabinet est réservé aux experts-comptables externes.",
    };
  }

  // R5 — Nul ne peut accorder un niveau supérieur au sien sur un module
  const actorLevel = actor.effective?.[module] || "none";
  if (!meetsLevel(actorLevel, permission)) {
    return {
      rule: "R5",
      message: "Vous ne pouvez pas accorder un niveau supérieur au vôtre sur ce module.",
    };
  }

  return null;
}
