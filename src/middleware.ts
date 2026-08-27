import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  DEFAULT_PERMISSIONS,
  Module,
  UserRole,
  hasAccess,
} from "@/lib/permissions";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/landing",
  "/access-denied",
  "/api/auth",
  "/_next",
  "/favicon.ico",
];

const PAGE_ROUTE_MODULES: { prefix: string; module: Module }[] = [
  { prefix: "/dashboard", module: "dashboard" },
  { prefix: "/facturation", module: "invoices" },
  { prefix: "/comptabilite", module: "accounting_entries" },
  { prefix: "/tiers", module: "third_parties" },
  { prefix: "/tva", module: "vat_declarations" },
  { prefix: "/rapprochement", module: "bank_reconciliation" },
  { prefix: "/paie", module: "payroll" },
  { prefix: "/documents", module: "documents" },
  { prefix: "/reporting", module: "reporting" },
  { prefix: "/cabinet", module: "cabinet_management" },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public paths
  const isPublic = PUBLIC_PATHS.some((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p)
  );

  // 2. Validate JWT token
  let token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    token = await getToken({
      req,
      secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
      cookieName:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
    });
  }

  // Redirect authenticated users away from auth pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isPublic) return NextResponse.next();

  // Unauthenticated API requests → 401
  if (!token && pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, error: "Non authentifié" },
      { status: 401 }
    );
  }

  // Unauthenticated page requests → redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = ((token.role as string) || "viewer") as UserRole;
  const matrix = DEFAULT_PERMISSIONS;

  // 3. Protection des routes de pages (P4)
  if (!pathname.startsWith("/api/")) {
    // Cas spécial /parametres : accessible si AU MOINS UNE section l'est
    if (pathname.startsWith("/parametres")) {
      const isSettingsAccessible =
        hasAccess(matrix, userRole, "company_settings") ||
        hasAccess(matrix, userRole, "chart_of_accounts") ||
        hasAccess(matrix, userRole, "user_management") ||
        hasAccess(matrix, userRole, "mecef_settings") ||
        hasAccess(matrix, userRole, "audit_log") ||
        hasAccess(matrix, userRole, "subscription_billing");

      if (!isSettingsAccessible) {
        return redirectToFirstAccessibleRoute(req, userRole);
      }
    } else {
      // Cas général des routes de pages
      const matchedRoute = PAGE_ROUTE_MODULES.find((r) =>
        pathname.startsWith(r.prefix)
      );

      if (matchedRoute) {
        const canAccessModule =
          matchedRoute.module === "payroll"
            ? hasAccess(matrix, userRole, "payroll") || hasAccess(matrix, userRole, "employees")
            : hasAccess(matrix, userRole, matchedRoute.module);

        if (!canAccessModule) {
          return redirectToFirstAccessibleRoute(req, userRole);
        }
      }
    }
  }

  // Inject user data as request headers for downstream handlers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", (token.id as string) ?? "");
  requestHeaders.set("x-company-id", (token.company_id as string) ?? "");
  requestHeaders.set("x-user-role", userRole);
  requestHeaders.set("x-user-email", (token.email as string) ?? "");

  return NextResponse.next({ request: { headers: requestHeaders } });
}

function redirectToFirstAccessibleRoute(req: NextRequest, role: UserRole) {
  const matrix = DEFAULT_PERMISSIONS;

  for (const r of PAGE_ROUTE_MODULES) {
    if (hasAccess(matrix, role, r.module)) {
      return NextResponse.redirect(new URL(r.prefix, req.url));
    }
  }

  // Fallback si paramètres accessible
  if (
    hasAccess(matrix, role, "company_settings") ||
    hasAccess(matrix, role, "chart_of_accounts") ||
    hasAccess(matrix, role, "user_management") ||
    hasAccess(matrix, role, "mecef_settings")
  ) {
    return NextResponse.redirect(new URL("/parametres", req.url));
  }

  return NextResponse.redirect(new URL("/access-denied", req.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
