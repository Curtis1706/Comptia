import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, requireOwner } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

/**
 * POST /api/company/transfer-ownership
 * Transfère la propriété de l'entreprise à un autre membre actif.
 * Seul le Propriétaire actuel peut effectuer cette action.
 */
export const POST = withAuth(async (req: NextRequest, { user }) => {
  const ownerError = requireOwner(user);
  if (ownerError) return ownerError;

  try {
    const { target_user_id } = await req.json();

    if (!target_user_id || typeof target_user_id !== "string") {
      return errorResponse("L'identifiant du nouveau propriétaire est requis", 400);
    }

    if (target_user_id === user.id) {
      return errorResponse("Vous êtes déjà le propriétaire de cette entreprise", 400);
    }

    const targetUser = await prisma.user.findFirst({
      where: {
        id: target_user_id,
        company_id: user.company_id,
        is_active: true,
      },
    });

    if (!targetUser) {
      return errorResponse("Utilisateur cible introuvable ou inactif dans cette entreprise", 404);
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { role: "admin" },
      }),
      prisma.user.update({
        where: { id: targetUser.id },
        data: { role: "owner" },
      }),
    ]);

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      resource: "CompanyOwnership",
      resource_id: user.company_id,
      old_data: { owner_id: user.id, owner_email: user.email },
      new_data: { owner_id: targetUser.id, owner_email: targetUser.email },
    });

    return successJson(
      { previous_owner_id: user.id, new_owner_id: targetUser.id },
      `Propriété de l'entreprise transférée avec succès à ${targetUser.name} (${targetUser.email})`
    );
  } catch (err) {
    return handlePrismaError(err);
  }
});
