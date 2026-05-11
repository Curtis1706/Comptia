import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successJson, errorResponse, zodErrorResponse, handlePrismaError } from "@/lib/api-response";
import { RegisterSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";
import { rateLimit, RATE_LIMITS, getClientIp } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/register
 * Creates a new Company + Admin user (no auth required).
 */
export async function POST(req: NextRequest) {
  // Rate limit: 5 registrations per IP per 15 minutes
  const ip = getClientIp(req);
  const rl = rateLimit(`register:${ip}`, RATE_LIMITS.auth);
  if (!rl.success) {
    return errorResponse("Trop de tentatives. Réessayez dans 15 minutes.", 429);
  }

  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { email, password, name, company: companyData } = parsed.data;

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse("Cet email est déjà utilisé", 409);
    }

    // Check for duplicate IFU
    const existingCompany = await prisma.company.findUnique({
      where: { ifu: companyData.ifu },
    });
    if (existingCompany) {
      return errorResponse("Cet IFU est déjà enregistré", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create company and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          ...companyData,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "admin",
          company_id: company.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          company_id: true,
          created_at: true,
        },
      });

      return { company, user };
    });

    await logAction({
      company_id: result.company.id,
      user_id: result.user.id,
      action: "CREATE",
      resource: "Company",
      resource_id: result.company.id,
      new_data: { company: result.company },
      ip_address: ip,
    });

    return successJson(
      { user: result.user, company: result.company },
      "Compte créé avec succès",
      201
    );
  } catch (err) {
    return handlePrismaError(err);
  }
}
