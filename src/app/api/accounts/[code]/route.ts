import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, zodErrorResponse, handlePrismaError } from "@/lib/api-response";
import { UpdateAccountSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";

/** GET /api/accounts/[code] */
export async function GET(req: Request, context: { params: Promise<{ code: string }> }) {
  const permCheck = await requirePermission(req, "chart_of_accounts", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { code } = await context.params;

  try {
    const account = await prisma.account.findFirst({
      where: { code, company_id: user.company_id },
    });

    if (!account) return errorResponse("Compte introuvable", 404);
    return successJson(account);
  } catch (err) {
    return handlePrismaError(err);
  }
}

/** PUT /api/accounts/[code] */
export async function PUT(req: Request, context: { params: Promise<{ code: string }> }) {
  const permCheck = await requirePermission(req, "chart_of_accounts", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { code } = await context.params;

  try {
    const body = await req.json();
    const parsed = UpdateAccountSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const existing = await prisma.account.findFirst({
      where: { code, company_id: user.company_id },
    });
    if (!existing) return errorResponse("Compte introuvable", 404);

    const updated = await prisma.account.update({
      where: { code_company_id: { code, company_id: user.company_id } },
      data: parsed.data,
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      entity: "Account",
      entity_id: code,
      details: {
        old_data: existing,
        new_data: parsed.data,
      },
    });

    return successJson(updated, "Compte mis à jour");
  } catch (err) {
    return handlePrismaError(err);
  }
}

/** DELETE /api/accounts/[code] — Soft delete (is_active = false) */
export async function DELETE(req: Request, context: { params: Promise<{ code: string }> }) {
  const permCheck = await requirePermission(req, "chart_of_accounts", "full");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { code } = await context.params;

  try {
    const existing = await prisma.account.findFirst({
      where: { code, company_id: user.company_id },
    });
    if (!existing) return errorResponse("Compte introuvable", 404);

    const hasLines = await prisma.journalLine.count({
      where: { account_code: code, company_id: user.company_id },
    });

    if (hasLines > 0) {
      return errorResponse("Impossible de désactiver un compte utilisé dans des écritures", 409);
    }

    const updated = await prisma.account.update({
      where: { code_company_id: { code, company_id: user.company_id } },
      data: { is_active: false },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      entity: "Account",
      entity_id: code,
    });

    return successJson(updated, "Compte désactivé");
  } catch (err) {
    return handlePrismaError(err);
  }
}
