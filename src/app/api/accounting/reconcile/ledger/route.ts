import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, handlePrismaError } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "bank_reconciliation", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const source = searchParams.get("source");
    const statusParam = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Prisma.JournalLineWhereInput = {
      company_id: user.company_id,
      entry: {
        status: { in: ["posted", "validated"] },
      },
    };

    // Filtre statut
    if (statusParam === "matched" || statusParam === "MATCHED") {
      where.reconciliation_status = "MATCHED";
    } else {
      where.reconciliation_status = { in: ["UNMATCHED", "PARTIAL"] };
    }

    // Filtre source (Banque 521, MoMo 585, Caisse 571)
    if (source === "mobile_money") {
      where.account_code = { startsWith: "585" };
    } else if (source === "cash") {
      where.OR = [
        { account_code: { startsWith: "571" } },
        { entry: { journal: "cash", status: { in: ["posted", "validated"] } } },
      ];
    } else {
      // "bank" par défaut
      where.OR = [
        { account_code: { startsWith: "521" } },
        { entry: { journal: "bank", status: { in: ["posted", "validated"] } } },
      ];
    }

    // Filtre recherche textuelle
    if (search && search.trim()) {
      const q = search.trim();
      const searchCondition = {
        OR: [
          { description: { contains: q, mode: "insensitive" as const } },
          { entry: { description: { contains: q, mode: "insensitive" as const } } },
          { entry: { reference: { contains: q, mode: "insensitive" as const } } },
        ],
      };

      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          searchCondition,
        ];
        delete where.OR;
      } else {
        where.AND = [searchCondition];
      }
    }

    const lines = await prisma.journalLine.findMany({
      where,
      include: {
        entry: true,
        bank_transaction: true,
      },
      orderBy: { entry: { date: "desc" } },
    });

    return successJson(lines);
  } catch (err) {
    return handlePrismaError(err);
  }
}
