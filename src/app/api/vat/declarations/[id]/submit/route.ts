import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

/**
 * POST /api/vat/declarations/[id]/submit
 * Submits a draft VAT declaration and validates the associated accounting entry.
 */
export const POST = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = params as { id: string };

    const declaration = await prisma.vatDeclaration.findUnique({
      where: { id, company_id: user.company_id },
    });

    if (!declaration) {
      return errorResponse("Déclaration non trouvée", 404);
    }

    if (declaration.status !== "draft") {
      return errorResponse("Seules les déclarations en brouillon peuvent être soumises", 409);
    }

    const now = new Date();
    let penaltyAmount = 0;
    const vatDue = Number(declaration.vat_due || 0);

    if (declaration.deadline_date && now > new Date(declaration.deadline_date) && vatDue > 0) {
      const deadline = new Date(declaration.deadline_date);
      const diffTime = Math.abs(now.getTime() - deadline.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.max(0, Math.floor(diffDays / 30));

      // 10% dès le premier jour de retard + 1% par mois supplémentaire
      const penaltyRate = 0.10 + diffMonths * 0.01;
      penaltyAmount = Math.round(vatDue * penaltyRate);
    }

    // 1. Update declaration and validate associated journal entry
    const updated = await prisma.$transaction(async (tx) => {
      const decl = await tx.vatDeclaration.update({
        where: { id },
        data: {
          status: "submitted",
          submitted_at: now,
          penalty_amount: penaltyAmount,
        },
      });

      // Find and validate the associated journal entry
      // We search by reference pattern used in creation
      const ref = `VAT-${id.slice(-4)}`;
      await tx.journalEntry.updateMany({
        where: {
          company_id: user.company_id,
          reference: ref,
          status: "draft",
        },
        data: { status: "validated" },
      });

      return decl;
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "VALIDATE",
      resource: "VatDeclaration",
      resource_id: id,
    });

    return NextResponse.json(successResponse(updated, "Déclaration soumise avec succès"));
  } catch (err) {
    console.error("[POST /api/vat/declarations/[id]/submit]", err);
    return handlePrismaError(err);
  }
});
