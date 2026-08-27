import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import {
  successJson,
  errorResponse,
  zodErrorResponse,
  handlePrismaError,
} from "@/lib/api-response";
import { UpdateUserSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  company_id: true,
  avatar_url: true,
  is_active: true,
  created_at: true,
  updated_at: true,
};

/** GET /api/users/[id] */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "user_management", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const target = await prisma.user.findFirst({
      where: { id, company_id: user.company_id },
      select: USER_SELECT,
    });

    if (!target) return errorResponse("Utilisateur introuvable", 404);
    return successJson(target);
  } catch (err) {
    return handlePrismaError(err);
  }
}

/** PUT /api/users/[id] — Modify role/status */
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "user_management", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  if (id === user.id) {
    return errorResponse("Vous ne pouvez pas modifier votre propre rôle", 400);
  }

  try {
    const body = await req.json();
    const parsed = UpdateUserSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const old = await prisma.user.findFirst({
      where: { id, company_id: user.company_id },
      select: USER_SELECT,
    });

    if (!old) return errorResponse("Utilisateur introuvable", 404);

    if (old.role === "owner") {
      return errorResponse(
        "Le rôle du Propriétaire ne peut pas être modifié. Utilisez le transfert de propriété.",
        403
      );
    }

    if (parsed.data.role === "owner") {
      return errorResponse("Le rôle Propriétaire ne peut pas être attribué directement.", 403);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: USER_SELECT,
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      entity: "User",
      entity_id: updated.id,
      details: {
        old_data: old,
        new_data: parsed.data,
      },
    });

    return successJson(updated, "Utilisateur mis à jour");
  } catch (err) {
    return handlePrismaError(err);
  }
}

/** DELETE /api/users/[id] — Soft delete (suspend) */
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "user_management", "full");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  if (id === user.id) {
    return errorResponse("Vous ne pouvez pas suspendre votre propre compte", 400);
  }

  try {
    const target = await prisma.user.findFirst({
      where: { id, company_id: user.company_id },
    });

    if (!target) return errorResponse("Utilisateur introuvable", 404);

    if (target.role === "owner") {
      return errorResponse("Impossible de suspendre le Propriétaire de l'entreprise", 403);
    }

    await prisma.user.update({
      where: { id },
      data: { is_active: false },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      entity: "User",
      entity_id: id,
    });

    return successJson(null, "Utilisateur suspendu");
  } catch (err) {
    return handlePrismaError(err);
  }
}
