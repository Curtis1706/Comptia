import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { calculateVatForPeriod } from "@/lib/accounting";

/**
 * GET /api/vat/preview
 * Calculates VAT preview for a given period without persisting.
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const startStr = searchParams.get("period_start");
    const endStr = searchParams.get("period_end");
    const type = searchParams.get("type") || "CA3";

    if (!startStr || !endStr) {
      return errorResponse("Période manquante", 400);
    }

    const start = new Date(startStr);
    const end = new Date(endStr);

    const data = await calculateVatForPeriod(prisma, user.company_id, start, end);

    return NextResponse.json(successResponse({ ...data, declaration_type: type }));
  } catch (err) {
    console.error("[GET /api/vat/preview]", err);
    return errorResponse("Erreur lors du calcul de la TVA");
  }
});
