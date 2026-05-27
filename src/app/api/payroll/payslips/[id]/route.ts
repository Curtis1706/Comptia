import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, notFoundResponse, handlePrismaError, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/payroll/payslips/[id]
 * Returns a single payslip with employee, deductions and contributions
 */
export const GET = withAuth(async (req: NextRequest, { user, params }: any) => {
  try {
    const { id } = params;

    const payslip = await prisma.payroll.findFirst({
      where: {
        id,
        company_id: user.company_id,
      },
      include: {
        employee: true,
        lines: true,
      },
    });

    if (!payslip) {
      return notFoundResponse("Bulletin introuvable");
    }

    return NextResponse.json(successResponse(payslip));
  } catch (err) {
    console.error("[GET /api/payroll/payslips/[id]]", err);
    return handlePrismaError(err);
  }
});

import { calculatePayroll } from "@/lib/payroll";

/**
 * PATCH /api/payroll/payslips/[id]
 * Updates a draft payslip's lines and recalculates totals.
 */
export const PATCH = withAuth(async (req: NextRequest, { user, params }: any) => {
  try {
    const { id } = params;
    const body = await req.json();
    const { customLines } = body;

    if (!Array.isArray(customLines)) {
      return errorResponse("Format invalide pour customLines", 400);
    }

    const payroll = await prisma.payroll.findUnique({
      where: { id, company_id: user.company_id },
      include: { lines: true },
    });

    if (!payroll) {
      return notFoundResponse("Bulletin introuvable");
    }

    if (payroll.status !== "draft") {
      return errorResponse("Impossible de modifier un bulletin validé ou traité", 409);
    }

    // 1. Recalculate everything
    const calc = calculatePayroll(Number(payroll.base_salary), customLines);

    // 2. Transaction: Delete old lines, update payroll, create new lines
    const updated = await prisma.$transaction(async (tx) => {
      await tx.payrollLine.deleteMany({
        where: { payroll_id: id }
      });

      return tx.payroll.update({
        where: { id },
        data: {
          gross_salary: calc.gross_salary,
          net_salary: calc.net_salary,
          employer_cost: calc.employer_cost,
          lines: {
            create: calc.lines.map(l => ({
              type: l.type,
              label: l.label,
              amount: l.amount,
              rate: l.rate,
              base: l.base
            }))
          }
        },
        include: { lines: true }
      });
    });

    return NextResponse.json(successResponse(updated, "Bulletin mis à jour avec succès"));
  } catch (err) {
    console.error("[PATCH /api/payroll/payslips/[id]]", err);
    return handlePrismaError(err);
  }
});
