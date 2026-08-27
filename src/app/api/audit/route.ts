import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { paginatedResponse, handlePrismaError } from "@/lib/api-response";
import { PaginationSchema } from "@/lib/validators";

/**
 * GET /api/audit
 * Lists audit logs for the company. Requires 'read' on audit_log.
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "audit_log", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const pag = PaginationSchema.parse({
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 20,
    });

    const where = { company_id: user.company_id };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true, avatar_url: true },
          },
        },
        skip: (pag.page - 1) * pag.limit,
        take: pag.limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return paginatedResponse(logs, total, pag.page, pag.limit);
  } catch (err) {
    console.error("[GET /api/audit]", err);
    return handlePrismaError(err);
  }
}
