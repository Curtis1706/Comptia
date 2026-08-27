import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/require-permission";
import { successResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/notifications
 * Requires 'read' on notifications.
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "notifications", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        company_id: user.company_id,
        OR: [{ user_id: user.id }, { user_id: null }],
      },
      orderBy: { created_at: "desc" },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        company_id: user.company_id,
        is_read: false,
        OR: [{ user_id: user.id }, { user_id: null }],
      },
    });

    return NextResponse.json(successResponse({ notifications, unreadCount }));
  } catch (err) {
    return handlePrismaError(err);
  }
}

/**
 * PATCH /api/notifications
 * Mark all notifications as read. Requires 'write' on notifications.
 */
export async function PATCH(req: Request) {
  const permCheck = await requirePermission(req, "notifications", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    await prisma.notification.updateMany({
      where: {
        company_id: user.company_id,
        is_read: false,
        OR: [{ user_id: user.id }, { user_id: null }],
      },
      data: { is_read: true },
    });

    return NextResponse.json(successResponse(null, "Notifications marquées comme lues"));
  } catch (err) {
    return handlePrismaError(err);
  }
}
