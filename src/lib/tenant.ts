import { NextResponse } from "next/server";
import { prisma } from "./prisma";
import { errorResponse } from "./api-response";

// ─── Extract company_id from session / headers ────────────────────────────────

export function getCompanyId(
  req: Request
): string | null {
  return (
    req.headers.get("x-company-id") ?? null
  );
}

// ─── Tenant enforcement ────────────────────────────────────────────────────────

/**
 * Verifies that a record's company_id matches the current user's company_id.
 * Returns a 403 response if the tenant doesn't match.
 */
export function enforceTenant(
  record: { company_id: string } | null,
  companyId: string
): NextResponse | null {
  if (!record) return errorResponse("Ressource introuvable", 404);
  if (record.company_id !== companyId) {
    return errorResponse("Accès refusé : ressource appartenant à un autre tenant", 403);
  }
  return null;
}

/**
 * Adds company_id to any Prisma where clause.
 * Use this to ensure every query is scoped to the current tenant.
 */
export function tenantScope(
  companyId: string,
  extraWhere: Record<string, unknown> = {}
): Record<string, unknown> {
  return { company_id: companyId, ...extraWhere };
}

// ─── Resource ownership check ──────────────────────────────────────────────────

/**
 * Fetches a record and checks it belongs to the tenant.
 * Returns [record, null] if OK, or [null, errorResponse] if not.
 */
export async function fetchAndVerifyTenant<T extends { company_id: string }>(
  fetch: () => Promise<T | null>,
  companyId: string
): Promise<[T, null] | [null, NextResponse]> {
  let record: T | null;
  try {
    record = await fetch();
  } catch {
    return [null, errorResponse("Erreur base de données", 500)];
  }

  if (!record) {
    return [null, errorResponse("Ressource introuvable", 404)];
  }

  if (record.company_id !== companyId) {
    return [null, errorResponse("Accès refusé", 403)];
  }

  return [record, null];
}
