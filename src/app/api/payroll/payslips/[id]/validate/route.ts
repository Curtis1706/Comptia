import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

/**
 * POST /api/payroll/payslips/[id]/validate
 */
export const POST = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = params as { id: string };

    const payroll = await prisma.payroll.findUnique({
      where: { id, company_id: user.company_id },
      include: { employee: true },
    });

    if (!payroll) {
      return errorResponse("Bulletin non trouvé", 404);
    }

    if (payroll.status !== "draft") {
      return errorResponse("Ce bulletin a déjà été validé ou traité", 409);
    }

    // 1. Transaction: Validate payroll and validate associated entry
    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.payroll.update({
        where: { id },
        data: { status: "validated" },
      });

      // Find associated journal entry by reference pattern
      const ref = `PAY-${payroll.year}-${String(payroll.month).padStart(2, "0")}-${payroll.employee_id.slice(-4)}`;
      await tx.journalEntry.updateMany({
        where: {
          company_id: user.company_id,
          reference: ref,
          status: "posted", // Assuming it was posted as draft/posted
        },
        data: { status: "validated" },
      });

      return p;
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "VALIDATE",
      resource: "Payroll",
      resource_id: id,
    });

    return NextResponse.json(successResponse(updated, "Bulletin validé avec succès"));
  } catch (err) {
    console.error("[POST /api/payroll/payslips/[id]/validate]", err);
    return handlePrismaError(err);
  }
});
