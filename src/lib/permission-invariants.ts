import { UserRole, Module, Permission, meetsLevel } from "./permissions";

export interface InvariantViolation {
  rule: string;
  message: string;
}

/**
 * Vérifie les invariants structurels (R1 à R4) sur la donnée elle-même.
 * Ces règles sont valables tant à l'écriture qu'à la lecture/reconstitution de la matrice.
 */
export function checkStructuralInvariants(
  role: UserRole,
  module: Module,
  permission: Permission
): InvariantViolation | null {
  // R1 — La matrice du propriétaire n'est pas modifiable
  if (role === "owner") {
    return {
      rule: "R1",
      message: "La matrice du propriétaire n'est pas modifiable.",
    };
  }

  // R2 — L'abonnement reste exclusivement réservé à l'owner
  if (module === "subscription_billing" && permission !== "none") {
    return {
      rule: "R2",
      message: "L'abonnement reste réservé au propriétaire.",
    };
  }

  // R3 — La gestion des utilisateurs ne peut être accordée qu'au propriétaire ou à un administrateur
  if (
    module === "user_management" &&
    role !== "admin" &&
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

  return null;
}

/**
 * Vérifie l'ensemble des 5 invariants stricts (R1 à R5), incluant la règle d'autorisation R5
 * qui valide les droits de l'acteur effectuant la modification.
 */
export function checkInvariants(
  role: UserRole,
  module: Module,
  permission: Permission,
  actor: { role: UserRole; effective: Record<Module, Permission> }
): InvariantViolation | null {
  // 1. Invariants structurels R1 à R4
  const structuralViolation = checkStructuralInvariants(role, module, permission);
  if (structuralViolation) {
    return structuralViolation;
  }

  // 2. R5 — Nul ne peut accorder un niveau supérieur au sien sur un module (règle d'écriture)
  const actorLevel = actor.effective?.[module] || "none";
  if (!meetsLevel(actorLevel, permission)) {
    return {
      rule: "R5",
      message: "Vous ne pouvez pas accorder un niveau supérieur au vôtre sur ce module.",
    };
  }

  return null;
}
