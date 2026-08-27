import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/require-permission";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import * as z from "zod";

const UpdateEmployeeSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  position: z.string().min(1).optional(),
  department: z.string().optional(),
  hire_date: z.coerce.date().optional(),
  birth_date: z.coerce.date().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  contract_type: z.enum(["CDI", "CDD", "Stage", "Alternance"]).optional(),
  base_salary: z.number().positive().optional(),
  social_security_number: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

/**
 * GET /api/payroll/employees/[id]
 * Requires 'read' on employees.
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "employees", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: { id, company_id: user.company_id },
      include: {
        payrolls: {
          take: 10,
          orderBy: { year: "desc", month: "desc" },
        },
      },
    });

    if (!employee) return errorResponse("Salarié non trouvé", 404);
    return NextResponse.json(successResponse(employee));
  } catch (err) {
    return handlePrismaError(err);
  }
}

/**
 * PUT /api/payroll/employees/[id]
 * Requires 'write' on employees.
 */
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "employees", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const body = await req.json();
    const data = UpdateEmployeeSchema.parse(body);

    const existing = await prisma.employee.findUnique({
      where: { id, company_id: user.company_id },
    });

    if (!existing) {
      return errorResponse("Salarié non trouvé", 404);
    }

    if (
      existing.social_security_number &&
      data.social_security_number &&
      existing.social_security_number !== data.social_security_number
    ) {
      delete (data as any).social_security_number;
    }

    const updated = await prisma.employee.update({
      where: { id },
      data,
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      entity: "Employee",
      entity_id: id,
      details: {
        old_data: existing,
        new_data: updated,
      },
    });

    return NextResponse.json(successResponse(updated, "Salarié mis à jour"));
  } catch (err) {
    console.error("[PUT /api/payroll/employees/[id]]", err);
    if (err instanceof z.ZodError) return errorResponse(err.errors[0].message, 400);
    return handlePrismaError(err);
  }
}

/**
 * DELETE /api/payroll/employees/[id]
 * Requires 'full' on employees.
 */
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "employees", "full");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const existing = await prisma.employee.findUnique({
      where: { id, company_id: user.company_id },
    });

    if (!existing) return errorResponse("Salarié non trouvé", 404);

    await prisma.employee.update({
      where: { id },
      data: { status: "inactive" },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      entity: "Employee",
      entity_id: id,
    });

    return NextResponse.json(successResponse(null, "Salarié désactivé"));
  } catch (err) {
    return handlePrismaError(err);
  }
}
