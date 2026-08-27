import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/require-permission";
import { successResponse, notFoundResponse, handlePrismaError, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { calculatePayroll } from "@/lib/payroll";
import { logAction } from "@/lib/audit";

/**
 * GET /api/payroll/payslips/[id]
 * Returns a single payslip. Requires 'read' on payroll.
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "payroll", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
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
}

/**
 * PATCH /api/payroll/payslips/[id]
 * Updates a draft payslip. Requires 'write' on payroll.
 */
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "payroll", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
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

    const calc = calculatePayroll(Number(payroll.base_salary), customLines);

    const updated = await prisma.$transaction(async (tx) => {
      await tx.payrollLine.deleteMany({
        where: { payroll_id: id },
      });

      return tx.payroll.update({
        where: { id },
        data: {
          gross_salary: calc.gross_salary,
          net_salary: calc.net_salary,
          employer_cost: calc.employer_cost,
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
    });

    return NextResponse.json(successResponse(updated, "Bulletin mis à jour avec succès"));
  } catch (err) {
    console.error("[PATCH /api/payroll/payslips/[id]]", err);
    return handlePrismaError(err);
  }
}

/**
 * DELETE /api/payroll/payslips/[id]
 * Requires 'full' on payroll.
 */
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "payroll", "full");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const existing = await prisma.payroll.findFirst({
      where: { id, company_id: user.company_id },
    });

    if (!existing) return errorResponse("Bulletin introuvable", 404);
    if (existing.status !== "draft") {
      return errorResponse("Impossible de supprimer un bulletin validé", 403);
    }

    await prisma.payroll.delete({ where: { id } });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      entity: "Payroll",
      entity_id: id,
    });

    return NextResponse.json(successResponse({ deleted: true }, "Bulletin supprimé"));
  } catch (err) {
    return handlePrismaError(err);
  }
}
