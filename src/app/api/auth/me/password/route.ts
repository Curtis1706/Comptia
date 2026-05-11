import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, zodErrorResponse, handlePrismaError } from "@/lib/api-response";
import { ChangePasswordSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";
import bcrypt from "bcryptjs";

/**
 * PUT /api/auth/me/password
 * Changes the current user's password.
 */
export const PUT = withAuth(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json();
    const parsed = ChangePasswordSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { current_password, new_password } = parsed.data;

    // Fetch the current password hash
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!dbUser) return errorResponse("Utilisateur introuvable", 404);

    const valid = await bcrypt.compare(current_password, dbUser.password);
    if (!valid) {
      return errorResponse("Mot de passe actuel incorrect", 400);
    }

    const newHash = await bcrypt.hash(new_password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      resource: "User",
      resource_id: user.id,
      new_data: { password_changed: true },
    });

    return successJson(null, "Mot de passe modifié avec succès");
  } catch (err) {
    return handlePrismaError(err);
  }
});
