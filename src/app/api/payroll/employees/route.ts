import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, errorResponse, handlePrismaError, paginatedResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import { PaginationSchema } from "@/lib/validators";
import * as z from "zod";

const CreateEmployeeSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  position: z.string().min(1),
  department: z.string().optional(),
  hire_date: z.coerce.date(),
  birth_date: z.coerce.date().optional(),
  address: z.string(),
  postal_code: z.string(),
  city: z.string(),
  country: z.string().default("Bénin"),
  contract_type: z.enum(["CDI", "CDD", "Stage", "Alternance"]),
  base_salary: z.number().positive(),
  social_security_number: z.string().optional(),
  phone: z.string().optional(),
});

/**
 * GET /api/payroll/employees
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const pag = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const status = searchParams.get("status") || "active";
    const department = searchParams.get("department");

    const where: any = { company_id: user.company_id };
    if (status) where.status = status;
    if (department) where.department = department;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip: (pag.page - 1) * pag.limit,
        take: pag.limit,
        orderBy: { last_name: "asc" },
        include: {
          _count: {
            select: { payrolls: true },
          },
        },
      }),
      prisma.employee.count({ where }),
    ]);

    return paginatedResponse(employees, total, pag.page, pag.limit);
  } catch (err) {
    console.error("[GET /api/payroll/employees]", err);
    return handlePrismaError(err);
  }
});

/**
 * POST /api/payroll/employees
 */
export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json();
    const data = CreateEmployeeSchema.parse(body);

    const employee = await prisma.employee.create({
      data: {
        ...data,
        company_id: user.company_id,
      },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      resource: "Employee",
      resource_id: employee.id,
      new_data: employee,
    });

    return NextResponse.json(successResponse(employee, "Salarié créé"), { status: 201 });
  } catch (err) {
    console.error("[POST /api/payroll/employees]", err);
    if (err instanceof z.ZodError) return errorResponse(err.errors[0].message, 400);
    return handlePrismaError(err);
  }
});
