import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import {
  successJson,
  paginatedResponse,
  errorResponse,
  zodErrorResponse,
  handlePrismaError,
} from "@/lib/api-response";
import { CreateAccountSchema, PaginationSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";

/** GET /api/accounts */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "chart_of_accounts", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const pag = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });
    const type = searchParams.get("type");
    const is_active = searchParams.get("is_active");
    const postableOnly = searchParams.get("postable_only") === "true";
    const search = searchParams.get("search");

    const where = {
      company_id: user.company_id,
      ...(type && { type: type as "asset" | "liability" | "equity" | "revenue" | "expense" }),
      ...(is_active !== null && { is_active: is_active === "true" }),
      ...(postableOnly && { is_postable: true }),
      ...(search && {
        OR: [
          { code: { contains: search } },
          { name: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        skip: (pag.page - 1) * pag.limit,
        take: pag.limit,
        orderBy: { code: "asc" },
      }),
      prisma.account.count({ where }),
    ]);

    return paginatedResponse(accounts, total, pag.page, pag.limit);
  } catch (err) {
    return handlePrismaError(err);
  }
}

/** POST /api/accounts */
export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "chart_of_accounts", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const body = await req.json();
    const parsed = CreateAccountSchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { code, name, type, parent_code } = parsed.data;

    // Check uniqueness per company
    const existing = await prisma.account.findFirst({
      where: { code, company_id: user.company_id },
    });
    if (existing) return errorResponse(`Le compte ${code} existe déjà`, 409);

    const account = await prisma.account.create({
      data: { code, name, type, parent_code, company_id: user.company_id },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "Account",
      entity_id: code,
      details: account,
    });

    return successJson(account, "Compte créé", 201);
  } catch (err) {
    return handlePrismaError(err);
  }
}
