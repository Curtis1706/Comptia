import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/notifications/[id]/read
 */
export const PATCH = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const id = params?.id;
    if (!id) return errorResponse("ID manquant", 400);

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.company_id !== user.company_id) {
      return errorResponse("Notification introuvable", 404);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });

    return NextResponse.json(successResponse(updated));
  } catch (err) {
    return handlePrismaError(err);
  }
});
