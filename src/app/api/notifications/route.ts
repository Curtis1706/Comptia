import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/notifications
 * Get all notifications for the current user and their company.
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        company_id: user.company_id,
        OR: [
          { user_id: user.id },
          { user_id: null },
        ],
      },
      orderBy: { created_at: "desc" },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        company_id: user.company_id,
        is_read: false,
        OR: [
          { user_id: user.id },
          { user_id: null },
        ],
      },
    });

    return NextResponse.json(successResponse({ notifications, unreadCount }));
  } catch (err) {
    return handlePrismaError(err);
  }
});

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read.
 */
export const PATCH = withAuth(async (req: NextRequest, { user }) => {
  try {
    await prisma.notification.updateMany({
      where: {
        company_id: user.company_id,
        is_read: false,
        OR: [
          { user_id: user.id },
          { user_id: null },
        ],
      },
      data: { is_read: true },
    });

    return NextResponse.json(successResponse(null, "Notifications marquées comme lues"));
  } catch (err) {
    return handlePrismaError(err);
  }
});
