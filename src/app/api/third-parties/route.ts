import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import {
  successJson,
  paginatedResponse,
  zodErrorResponse,
  handlePrismaError,
} from "@/lib/api-response";
import { CreateThirdPartySchema, PaginationSchema } from "@/lib/validators";
import { logAction } from "@/lib/audit";

/** GET /api/third-parties */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "third_parties", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const pag = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const where = {
      company_id: user.company_id,
      is_active: true,
      ...(type && { type: type as "client" | "supplier" }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { ifu: { contains: search } },
        ],
      }),
    };

    const [thirdParties, total] = await Promise.all([
      prisma.thirdParty.findMany({
        where,
        skip: (pag.page - 1) * pag.limit,
        take: pag.limit,
        orderBy: { name: "asc" },
      }),
      prisma.thirdParty.count({ where }),
    ]);

    // Calculate balances
    const tpWithBalances = await Promise.all(
      thirdParties.map(async (tp) => {
        const summary = await prisma.journalLine.aggregate({
          where: {
            company_id: user.company_id,
            third_party: tp.id,
            entry: { status: { in: ["posted", "validated"] } },
          },
          _sum: {
            debit: true,
            credit: true,
          },
        });

        const debit = Number(summary._sum.debit || 0);
        const credit = Number(summary._sum.credit || 0);
        const balance = tp.type === "client" ? debit - credit : credit - debit;

        return {
          ...tp,
          balance,
        };
      })
    );

    return paginatedResponse(tpWithBalances, total, pag.page, pag.limit);
  } catch (err) {
    return handlePrismaError(err);
  }
}

/** POST /api/third-parties */
export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "third_parties", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const body = await req.json();
    const parsed = CreateThirdPartySchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const tp = await prisma.thirdParty.create({
      data: { ...parsed.data, company_id: user.company_id } as any,
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "ThirdParty",
      entity_id: tp.id,
      details: parsed.data,
    });

    return successJson(tp, "Tiers créé", 201);
  } catch (err) {
    return handlePrismaError(err);
  }
}
