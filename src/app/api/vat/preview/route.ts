import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/require-permission";
import { successResponse, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { calculateVatForPeriod } from "@/lib/accounting";

/**
 * GET /api/vat/preview
 * Calculates VAT preview for a given period without persisting. Requires 'read' on vat_declarations.
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "vat_declarations", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const startStr = searchParams.get("period_start");
    const endStr = searchParams.get("period_end");
    const type = searchParams.get("type") || "monthly";

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
}
