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

    const where: Prisma.BankTransactionWhereInput = {
      statement: { company_id: user.company_id },
    };

    // Filtre statut
    if (statusParam === "matched" || statusParam === "MATCHED") {
      where.status = "MATCHED";
    } else {
      where.status = { in: ["UNMATCHED", "PARTIAL"] };
    }

    // Filtre source (Banque 521, MoMo 585, Caisse 571)
    if (source === "mobile_money") {
      where.statement = {
        company_id: user.company_id,
        account_iban: { startsWith: "585" },
      };
    } else if (source === "cash") {
      where.statement = {
        company_id: user.company_id,
        account_iban: { startsWith: "571" },
      };
    } else if (source === "bank") {
      where.statement = {
        company_id: user.company_id,
        OR: [
          { account_iban: { startsWith: "521" } },
          { account_iban: null },
          { account_iban: "" },
        ],
      };
    }

    // Filtre recherche textuelle
    if (search && search.trim()) {
      where.OR = [
        { description: { contains: search.trim(), mode: "insensitive" } },
        { reference: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const transactions = await prisma.bankTransaction.findMany({
      where,
      include: {
        statement: {
          select: {
            id: true,
            filename: true,
            upload_date: true,
            account_iban: true,
          },
        },
        journal_lines: {
          select: {
            id: true,
            debit: true,
            credit: true,
            account_code: true,
            description: true,
            entry: {
              select: {
                reference: true,
                date: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return successJson(transactions);
  } catch (err) {
    return handlePrismaError(err);
  }
}
