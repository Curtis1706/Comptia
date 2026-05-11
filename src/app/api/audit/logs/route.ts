import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, handlePrismaError, paginatedResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/validators";

/**
 * GET /api/audit/logs
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const pag = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const resource = searchParams.get("resource");
    const user_id = searchParams.get("user_id");

    const where: any = { company_id: user.company_id };
    if (resource) where.resource = resource;
    if (user_id) where.user_id = user_id;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: (pag.page - 1) * pag.limit,
        take: pag.limit,
        orderBy: { created_at: "desc" },
        include: {
          user: {
            select: { name: true, email: true, avatar_url: true }
          }
        }
      }),
      prisma.auditLog.count({ where }),
    ]);

    return paginatedResponse(logs, total, pag.page, pag.limit);
  } catch (err) {
    console.error("[GET /api/audit/logs]", err);
    return handlePrismaError(err);
  }
});
