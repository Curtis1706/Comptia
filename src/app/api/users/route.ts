import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
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
 * Lists all users in the company. Requires 'read' on user_management.
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "user_management", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

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
}

/**
 * POST /api/users
 * Invites a new user to the company. Requires 'write' on user_management.
 */
export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "user_management", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const body = await req.json();
    const parsed = InviteUserSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { email, name, role, password } = parsed.data;

    if (role === "owner") {
      return errorResponse(
        "Le rôle Propriétaire ne peut pas être attribué directement. Utilisez le transfert de propriété.",
        403
      );
    }

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
      entity: "User",
      entity_id: newUser.id,
      details: { email, name, role },
    });

    return successJson(newUser, "Utilisateur créé avec succès", 201);
  } catch (err) {
    return handlePrismaError(err);
  }
}
