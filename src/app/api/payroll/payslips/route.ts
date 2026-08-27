import { requirePermission } from "@/lib/require-permission";
import { handlePrismaError, paginatedResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/validators";

/**
 * GET /api/payroll/payslips
 * Requires 'read' on payroll.
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "payroll", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const pag = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const employee_id = searchParams.get("employee_id");
    const status = searchParams.get("status");

    const where: any = { company_id: user.company_id };
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);
    if (employee_id) where.employee_id = employee_id;
    if (status) where.status = status;

    const [payrolls, total] = await Promise.all([
      prisma.payroll.findMany({
        where,
        skip: (pag.page - 1) * pag.limit,
        take: pag.limit,
        orderBy: { created_at: "desc" },
        include: {
          employee: {
            select: {
              first_name: true,
              last_name: true,
              position: true,
            },
          },
        },
      }),
      prisma.payroll.count({ where }),
    ]);

    return paginatedResponse(payrolls, total, pag.page, pag.limit);
  } catch (err) {
    console.error("[GET /api/payroll/payslips]", err);
    return handlePrismaError(err);
  }
}
