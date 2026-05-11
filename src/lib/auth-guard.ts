import { prisma } from "./prisma";
import { errorResponse } from "./api-response";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "accountant" | "expert" | "rh" | "viewer";

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
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      company_id: user.company_id,
      avatar_url: user.avatar_url,
    };
  } catch (err) {
    console.error("[getCurrentUser] Error:", err);
    return null;
  }
}

// ─── withAuth wrapper ─────────────────────────────────────────────────────────

/**
 * Wraps a route handler to inject the authenticated user.
 * Returns 401 if not authenticated.
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: Request, context?: { params?: Promise<Record<string, string>> }) => {
    const user = await getCurrentUser(req);

    if (!user) {
      return errorResponse("Non authentifié", 401);
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

// ─── Admin-only shorthand ─────────────────────────────────────────────────────

export function requireAdmin(
  user: AuthenticatedUser
): NextResponse | null {
  return requireRole(user, ["admin"]);
}
