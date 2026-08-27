import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, requireAdmin } from "@/lib/auth-guard";
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
export const GET = withAuth(async (_req, { user, params }) => {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  try {
    const target = await prisma.user.findFirst({
      where: { id: params?.id, company_id: user.company_id },
      select: USER_SELECT,
    });

    if (!target) return errorResponse("Utilisateur introuvable", 404);
    return successJson(target);
  } catch (err) {
    return handlePrismaError(err);
  }
});

/** PUT /api/users/[id] — Modify role/status */
export const PUT = withAuth(async (req: NextRequest, { user, params }) => {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  if (params?.id === user.id) {
    return errorResponse("Vous ne pouvez pas modifier votre propre rôle", 400);
  }

  try {
    const body = await req.json();
    const parsed = UpdateUserSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const old = await prisma.user.findFirst({
      where: { id: params?.id, company_id: user.company_id },
      select: USER_SELECT,
    });

    if (!old) return errorResponse("Utilisateur introuvable", 404);

    if (old.role === "owner") {
      return errorResponse("Le rôle du Propriétaire ne peut pas être modifié. Utilisez le transfert de propriété.", 403);
    }

    if (parsed.data.role === "owner") {
      return errorResponse("Le rôle Propriétaire ne peut pas être attribué directement.", 403);
    }

    const updated = await prisma.user.update({
      where: { id: params?.id },
      data: parsed.data,
      select: USER_SELECT,
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      resource: "User",
      resource_id: updated.id,
      old_data: old,
      new_data: parsed.data,
    });

    return successJson(updated, "Utilisateur mis à jour");
  } catch (err) {
    return handlePrismaError(err);
  }
});

/** DELETE /api/users/[id] — Soft delete (suspend) */
export const DELETE = withAuth(async (_req, { user, params }) => {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  if (params?.id === user.id) {
    return errorResponse("Vous ne pouvez pas suspendre votre propre compte", 400);
  }

  try {
    const target = await prisma.user.findFirst({
      where: { id: params?.id, company_id: user.company_id },
    });

    if (!target) return errorResponse("Utilisateur introuvable", 404);

    if (target.role === "owner") {
      return errorResponse("Impossible de suspendre le Propriétaire de l'entreprise", 403);
    }

    await prisma.user.update({
      where: { id: params?.id },
      data: { is_active: false },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      resource: "User",
      resource_id: params?.id ?? "",
      old_data: { is_active: true },
      new_data: { is_active: false },
    });

    return successJson(null, "Utilisateur suspendu");
  } catch (err) {
    return handlePrismaError(err);
  }
});
