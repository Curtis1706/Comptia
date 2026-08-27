import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/require-permission";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/notifications/[id]/read
 * Requires 'write' on notifications.
 */
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "notifications", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
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
}
