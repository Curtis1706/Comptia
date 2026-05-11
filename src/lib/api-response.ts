import { NextResponse } from "next/server";

// Standard API response types matching frontend contracts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  message?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ─── Success ─────────────────────────────────────────────────────────────────

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, ...(message && { message }) };
}

export function successJson<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse {
  return NextResponse.json(successResponse(data, message), { status });
}

// ─── Error ───────────────────────────────────────────────────────────────────

export function errorResponse(error: string, status = 500): NextResponse {
  return NextResponse.json({ success: false, error }, { status });
}

export function notFoundResponse(resource = "Ressource"): NextResponse {
  return errorResponse(`${resource} introuvable`, 404);
}

export function forbiddenResponse(
  msg = "Accès refusé"
): NextResponse {
  return errorResponse(msg, 403);
}

export function unauthorizedResponse(): NextResponse {
  return errorResponse("Non authentifié", 401);
}

// ─── Validation ──────────────────────────────────────────────────────────────

export function validationErrorResponse(
  errors: Array<{ field: string; message: string }>
): NextResponse {
  return NextResponse.json(
    { success: false, error: "Données invalides", errors },
    { status: 422 }
  );
}

export function zodErrorResponse(error: {
  issues: Array<{ path: (string | number)[]; message: string }>;
}): NextResponse {
  const errors = error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
  return validationErrorResponse(errors);
}

// ─── Paginated ───────────────────────────────────────────────────────────────

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  });
}

// ─── Prisma error helpers ─────────────────────────────────────────────────────

export function handlePrismaError(error: unknown): NextResponse {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const e = error as { code: string; meta?: { target?: string[] } };

    if (e.code === "P2002") {
      const field = e.meta?.target?.[0] ?? "champ";
      return errorResponse(`Ce ${field} existe déjà`, 409);
    }

    if (e.code === "P2025") {
      return notFoundResponse();
    }

    if (e.code === "P2003") {
      return errorResponse("Référence invalide : entité liée introuvable", 400);
    }
  }

  console.error("[Prisma Error]", error);
  return errorResponse("Erreur interne du serveur", 500);
}
