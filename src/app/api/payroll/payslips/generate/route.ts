import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/require-permission";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { calculatePayroll } from "@/lib/payroll";
import { logAction } from "@/lib/audit";

/**
 * POST /api/payroll/payslips/generate
 * Generates draft payslips for active employees. Requires 'write' on payroll.
 */
export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "payroll", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const body = await req.json();
    const { month, year, employee_ids } = body;

    if (!month || !year) {
      return errorResponse("Période (mois/année) manquante", 400);
    }

    // 1. Find employees
    const employees = await prisma.employee.findMany({
      where: {
        company_id: user.company_id,
        status: "active",
        ...(employee_ids?.length ? { id: { in: employee_ids } } : {}),
      },
    });

    if (employees.length === 0) {
      return errorResponse("Aucun salarié actif trouvé pour la génération", 400);
    }

    // 2. Check for existing processed payslips
    const existing = await prisma.payroll.findFirst({
      where: {
        company_id: user.company_id,
        month,
        year,
        status: { not: "draft" },
      },
    });

    if (existing) {
      return errorResponse(`Des bulletins pour ${month}/${year} ont déjà été validés ou traités`, 409);
    }

    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0);

    // 3. Transactional generation
    const payrolls = await prisma.$transaction(
      async (tx) => {
        const results = [];

        for (const employee of employees) {
          await tx.payroll.deleteMany({
            where: {
              employee_id: employee.id,
              month,
              year,
              status: "draft",
            },
          });

          const calc = calculatePayroll(Number(employee.base_salary));

          const payroll = await tx.payroll.create({
            data: {
              company_id: user.company_id,
              employee_id: employee.id,
              month,
              year,
              period_start: periodStart,
              period_end: periodEnd,
              base_salary: employee.base_salary,
              gross_salary: calc.gross_salary,
              net_salary: calc.net_salary,
              employer_cost: calc.employer_cost,
              status: "draft",
              lines: {
                create: calc.lines.map((l) => ({
                  type: l.type,
                  label: l.label,
                  amount: l.amount,
                  rate: l.rate,
                  base: l.base,
                })),
              },
            },
            include: { lines: true },
          });

          results.push(payroll);
        }

        return results;
      },
      { maxWait: 10000, timeout: 60000 }
    );

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "Payroll",
      entity_id: `${month}/${year}`,
      details: { count: payrolls.length, month, year },
    });

    return NextResponse.json(
      successResponse(payrolls, `${payrolls.length} bulletin(s) généré(s) en brouillon avec succès`),
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/payroll/payslips/generate]", err);
    return handlePrismaError(err);
  }
}
