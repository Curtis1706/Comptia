import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { generateFullDsfReport } from "@/lib/dsf";

/**
 * GET /api/reporting/dsf
 * Returns complete SYSCOHADA DSF (Bilan, Compte de Résultat avec SIG, TAFIRE) for a fiscal year.
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("fiscal_year") || searchParams.get("year");
    const fiscalYear = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    if (isNaN(fiscalYear) || fiscalYear < 2000 || fiscalYear > 2100) {
      return errorResponse("Exercice fiscal invalide", 400);
    }

    const dsfReport = await generateFullDsfReport(prisma, user.company_id, fiscalYear);

    return successJson(dsfReport, `États financiers SYSCOHADA (DSF ${fiscalYear}) générés`);
  } catch (err) {
    console.error("[GET /api/reporting/dsf]", err);
    return handlePrismaError(err);
  }
});
