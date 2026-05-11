import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
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
 * PUT /api/payroll/employees/[id]
 */
export const PUT = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = params as { id: string };
    const body = await req.json();
    const data = UpdateEmployeeSchema.parse(body);

    const existing = await prisma.employee.findUnique({
      where: { id, company_id: user.company_id },
    });

    if (!existing) {
      return errorResponse("Salarié non trouvé", 404);
    }

    // Protection for SSN if already set
    if (existing.social_security_number && data.social_security_number && existing.social_security_number !== data.social_security_number) {
       // We allow it for now but user mentioned "Ne pas modifier social_security_number si déjà défini" 
       // Actually, I'll follow the user's specific instruction:
       // "Ne pas modifier social_security_number si déjà défini (données sensibles)"
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
      resource: "Employee",
      resource_id: id,
      old_data: existing,
      new_data: updated,
    });

    return NextResponse.json(successResponse(updated, "Salarié mis à jour"));
  } catch (err) {
    console.error("[PUT /api/payroll/employees/[id]]", err);
    if (err instanceof z.ZodError) return errorResponse(err.errors[0].message, 400);
    return handlePrismaError(err);
  }
});

/**
 * GET /api/payroll/employees/[id]
 */
export const GET = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = params as { id: string };
    const employee = await prisma.employee.findUnique({
      where: { id, company_id: user.company_id },
      include: {
        payrolls: {
          take: 10,
          orderBy: { year: "desc", month: "desc" }
        }
      }
    });

    if (!employee) return errorResponse("Salarié non trouvé", 404);
    return NextResponse.json(successResponse(employee));
  } catch (err) {
    return handlePrismaError(err);
  }
});
