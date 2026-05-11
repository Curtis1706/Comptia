import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, requireAdmin } from "@/lib/auth-guard";
import {
  successJson,
  paginatedResponse,
  errorResponse,
  zodErrorResponse,
  handlePrismaError,
} from "@/lib/api-response";
import { InviteUserSchema, PaginationSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";
import bcrypt from "bcryptjs";

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  company_id: true,
  avatar_url: true,
  is_active: true,
  created_at: true,
  updated_at: true,
};

/**
 * GET /api/users
 * Lists all users in the company (admin only).
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  try {
    const { searchParams } = new URL(req.url);
    const pag = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const where = { company_id: user.company_id };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: USER_SELECT,
        skip: (pag.page - 1) * pag.limit,
        take: pag.limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return paginatedResponse(users, total, pag.page, pag.limit);
  } catch (err) {
    return handlePrismaError(err);
  }
});

/**
 * POST /api/users
 * Invites a new user to the company (admin only).
 */
export const POST = withAuth(async (req: NextRequest, { user }) => {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  try {
    const body = await req.json();
    const parsed = InviteUserSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { email, name, role, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return errorResponse("Cet email est déjà utilisé", 409);

    const hashed = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role,
        password: hashed,
        company_id: user.company_id,
      },
      select: USER_SELECT,
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      resource: "User",
      resource_id: newUser.id,
      new_data: { email, name, role },
    });

    return successJson(newUser, "Utilisateur créé avec succès", 201);
  } catch (err) {
    return handlePrismaError(err);
  }
});
