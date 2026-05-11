import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, handlePrismaError, paginatedResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/validators";

/**
 * GET /api/documents/list
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const pag = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const [docs, total] = await Promise.all([
      prisma.document.findMany({
        where: { company_id: user.company_id },
        skip: (pag.page - 1) * pag.limit,
        take: pag.limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.document.count({ where: { company_id: user.company_id } }),
    ]);

    return paginatedResponse(docs, total, pag.page, pag.limit);
  } catch (err) {
    console.error("[GET /api/documents/list]", err);
    return handlePrismaError(err);
  }
});
