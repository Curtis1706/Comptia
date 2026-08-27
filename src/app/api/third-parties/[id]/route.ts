import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import {
  successJson,
  errorResponse,
  zodErrorResponse,
  handlePrismaError,
} from "@/lib/api-response";
import { UpdateThirdPartySchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";
import { calculateThirdPartyBalance } from "@/lib/accounting";

/** GET /api/third-parties/[id] — Detail + computed balance */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "third_parties", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const tp = await prisma.thirdParty.findFirst({
      where: { id, company_id: user.company_id },
    });

    if (!tp) return errorResponse("Tiers introuvable", 404);

    // Compute outstanding balance from journal lines
    const accountCode = tp.type === "client" ? "411" : "401";
    const lines = await prisma.journalLine.findMany({
      where: {
        company_id: user.company_id,
        account_code: { startsWith: accountCode },
        third_party: tp.name,
        entry: { status: "validated" },
      },
      select: { debit: true, credit: true },
    });

    const balance = calculateThirdPartyBalance(lines);

    return successJson({ ...tp, balance });
  } catch (err) {
    return handlePrismaError(err);
  }
}

/** PUT /api/third-parties/[id] */
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "third_parties", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const body = await req.json();
    const parsed = UpdateThirdPartySchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const old = await prisma.thirdParty.findFirst({
      where: { id, company_id: user.company_id },
    });
    if (!old) return errorResponse("Tiers introuvable", 404);

    const updated = await prisma.thirdParty.update({
      where: { id },
      data: parsed.data,
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      entity: "ThirdParty",
      entity_id: id,
      details: {
        old_data: old,
        new_data: parsed.data,
      },
    });

    return successJson(updated, "Tiers mis à jour");
  } catch (err) {
    return handlePrismaError(err);
  }
}

/** DELETE /api/third-parties/[id] — Soft delete */
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "third_parties", "full");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const tp = await prisma.thirdParty.findFirst({
      where: { id, company_id: user.company_id },
    });
    if (!tp) return errorResponse("Tiers introuvable", 404);

    await prisma.thirdParty.update({
      where: { id },
      data: { is_active: false },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      entity: "ThirdParty",
      entity_id: id,
    });

    return successJson(null, "Tiers archivé");
  } catch (err) {
    return handlePrismaError(err);
  }
}
