import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, zodErrorResponse, handlePrismaError } from "@/lib/api-response";
import { UpdateProfileSchema, ChangePasswordSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";
import bcrypt from "bcryptjs";

/**
 * GET /api/auth/me
 * Returns the current authenticated user.
 */
export const GET = withAuth(async (_req, { user }) => {
  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        company_id: true,
        avatar_url: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        company: {
          select: {
            id: true,
            name: true,
            ifu: true,
            type: true,
            tax_regime: true,
            sector: true,
          },
        },
      },
    });

    if (!fullUser) return errorResponse("Utilisateur introuvable", 404);
    return successJson(fullUser);
  } catch (err) {
    return handlePrismaError(err);
  }
});

/**
 * PUT /api/auth/me
 * Updates the current user's profile (name, avatar).
 */
export const PUT = withAuth(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json();
    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: parsed.data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        company_id: true,
        avatar_url: true,
        updated_at: true,
      },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      resource: "User",
      resource_id: user.id,
      new_data: parsed.data,
    });

    return successJson(updated, "Profil mis à jour");
  } catch (err) {
    return handlePrismaError(err);
  }
});
