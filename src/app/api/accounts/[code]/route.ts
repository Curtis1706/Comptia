import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, zodErrorResponse, handlePrismaError } from "@/lib/api-response";
import { UpdateAccountSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";

/** GET /api/accounts/[code] */
export const GET = withAuth(async (_req, { user, params }) => {
  try {
    const account = await prisma.account.findFirst({
      where: { code: params?.code, company_id: user.company_id },
    });

    if (!account) return errorResponse("Compte introuvable", 404);
    return successJson(account);
  } catch (err) {
    return handlePrismaError(err);
  }
});

/** PUT /api/accounts/[code] */
export const PUT = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const body = await req.json();
    const parsed = UpdateAccountSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const existing = await prisma.account.findFirst({
      where: { code: params?.code, company_id: user.company_id },
    });
    if (!existing) return errorResponse("Compte introuvable", 404);

    const updated = await prisma.account.update({
      where: { code_company_id: { code: params?.code ?? "", company_id: user.company_id } },
      data: parsed.data,
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      resource: "Account",
      resource_id: params?.code ?? "",
      old_data: existing,
      new_data: parsed.data,
    });

    return successJson(updated, "Compte mis à jour");
  } catch (err) {
    return handlePrismaError(err);
  }
});

/** DELETE /api/accounts/[code] — Soft delete (is_active = false) */
export const DELETE = withAuth(async (_req, { user, params }) => {
  try {
    const existing = await prisma.account.findFirst({
      where: { code: params?.code, company_id: user.company_id },
    });
    if (!existing) return errorResponse("Compte introuvable", 404);

    // Check if account has journal lines before deactivating
    const hasLines = await prisma.journalLine.count({
      where: { account_code: params?.code, company_id: user.company_id },
    });

    if (hasLines > 0) {
      return errorResponse(
        "Impossible de désactiver un compte utilisé dans des écritures",
        409
      );
    }

    const updated = await prisma.account.update({
      where: { code_company_id: { code: params?.code ?? "", company_id: user.company_id } },
      data: { is_active: false },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      resource: "Account",
      resource_id: params?.code ?? "",
    });

    return successJson(updated, "Compte désactivé");
  } catch (err) {
    return handlePrismaError(err);
  }
});
