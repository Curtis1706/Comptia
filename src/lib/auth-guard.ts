import { prisma } from "./prisma";
import { errorResponse } from "./api-response";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = "owner" | "admin" | "accountant" | "cashier" | "hr" | "expert" | "viewer";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_id: string;
  avatar_url?: string | null;
}

export type AuthenticatedHandler = (
  req: Request,
  context: { user: AuthenticatedUser; params?: Record<string, string> }
) => Promise<NextResponse | Response>;

import { auth } from "@/auth";

/**
 * Reads the user from the NextAuth session.
 */
export async function getCurrentUser(
  req: Request
): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth();
    if (!session?.user) return null;

    const user = session.user as any;
    if (!user?.id) return null;

    // Fiche S1 : Contrôle en temps réel du statut actif en base de données
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        company_id: true,
        avatar_url: true,
        is_active: true,
      },
    });

    if (!dbUser || !dbUser.is_active) {
      return null;
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role as UserRole,
      company_id: dbUser.company_id,
      avatar_url: dbUser.avatar_url,
    };
  } catch (err) {
    console.error("[getCurrentUser] Error:", err);
    return null;
  }
}

// ─── withAuth wrapper ─────────────────────────────────────────────────────────

/**
 * Wraps a route handler to inject the authenticated user.
 * Returns 401 if not authenticated or if account is suspended.
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: Request, context?: { params?: Promise<Record<string, string>> }) => {
    const user = await getCurrentUser(req);

    if (!user) {
      return errorResponse("Session invalide ou compte suspendu", 401);
    }

    const params = context?.params ? await context.params : undefined;
    return handler(req, { user, params });
  };
}

// ─── withRole wrapper ─────────────────────────────────────────────────────────

/**
 * Additional role check. Use after withAuth or inside a handler.
 * Returns 403 if role not allowed.
 */
export function checkRole(user: AuthenticatedUser, roles: UserRole[]): boolean {
  return roles.includes(user.role);
}

export function requireRole(
  user: AuthenticatedUser,
  roles: UserRole[]
): NextResponse | null {
  if (!checkRole(user, roles)) {
    return errorResponse(
      `Accès refusé. Rôle requis : ${roles.join(", ")}`,
      403
    );
  }
  return null;
}

// ─── Admin & Owner shorthands ─────────────────────────────────────────────────

export function requireAdmin(
  user: AuthenticatedUser
): NextResponse | null {
  return requireRole(user, ["owner", "admin"]);
}

export function requireOwner(
  user: AuthenticatedUser
): NextResponse | null {
  return requireRole(user, ["owner"]);
}
