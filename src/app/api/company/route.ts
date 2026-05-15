import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import * as z from "zod";

const UpdateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(["SARL", "EIRL", "SAS", "MICRO", "AUTO"]).optional(),
  tax_regime: z.enum(["auto_entrepreneur", "micro", "simplifie", "reel"]).optional(),
  sector: z.string().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().optional(),
  logo_url: z.string().optional(),
  fiscal_year_end: z.string().optional(),
  initial_treasury_balance: z.preprocess((val) => val === "" ? 0 : Number(val), z.number()).optional(),
});

/**
 * GET /api/company
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: user.company_id },
    });
    return NextResponse.json(successResponse(company));
  } catch (err) {
    return handlePrismaError(err);
  }
});

/**
 * PATCH /api/company
 */
export const PATCH = withAuth(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json();
    const data = UpdateCompanySchema.parse(body);

    const existing = await prisma.company.findUnique({
      where: { id: user.company_id },
    });

    if (!existing) return errorResponse("Entreprise non trouvée", 404);

    const updated = await prisma.company.update({
      where: { id: user.company_id },
      data,
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      resource: "Company",
      resource_id: user.company_id,
      old_data: existing,
      new_data: updated,
    });

    return NextResponse.json(successResponse(updated, "Configuration mise à jour"));
  } catch (err) {
    console.error("[PATCH /api/company]", err);
    if (err instanceof z.ZodError) return errorResponse(err.errors[0].message, 400);
    return handlePrismaError(err);
  }
});
