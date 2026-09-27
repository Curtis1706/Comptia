import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";

/**
 * GET /api/third-parties/[id]/ledger
 * Grand Livre Auxiliaire d'un tiers (client ou fournisseur)
 * Retourne les lignes chronologiques avec calcul du solde progressif
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "third_parties", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const tp = await prisma.thirdParty.findFirst({
      where: { id, company_id: user.company_id },
    });

    if (!tp) {
      return errorResponse("Tiers introuvable", 404);
    }

    const accountCode = tp.type === "client" ? "411" : "401";

    // Récupérer toutes les lignes associées au tiers sur le compte auxiliaire
    const lines = await prisma.journalLine.findMany({
      where: {
        company_id: user.company_id,
        account_code: { startsWith: accountCode },
        third_party: { equals: tp.name, mode: "insensitive" },
        entry: {
          status: { in: ["posted", "validated", "draft"] },
        },
      },
      include: {
        entry: {
          select: {
            id: true,
            date: true,
            reference: true,
            description: true,
            journal: true,
            status: true,
          },
        },
      },
      orderBy: [
        { entry: { date: "asc" } },
        { created_at: "asc" },
      ],
    });

    // Calcul du solde progressif chronologique ligne à ligne
    let cumulativeBalance = 0;
    let totalDebit = 0;
    let totalCredit = 0;

    const formattedEntries = lines.map((l) => {
      const debit = Number(l.debit || 0);
      const credit = Number(l.credit || 0);

      totalDebit += debit;
      totalCredit += credit;

      // SYSCOHADA :
      // Client (411) : débit augmente la créance, crédit la diminue
      // Fournisseur (401) : crédit augmente la dette, débit la diminue
      if (tp.type === "client") {
        cumulativeBalance += (debit - credit);
      } else {
        cumulativeBalance += (credit - debit);
      }

      return {
        id: l.id,
        date: l.entry.date,
        reference: l.entry.reference,
        journal: l.entry.journal,
        description: l.description || l.entry.description,
        account_code: l.account_code,
        debit,
        credit,
        running_balance: cumulativeBalance,
        status: l.entry.status,
        lettering_code: l.lettering_code,
      };
    });

    return successJson({
      third_party: {
        id: tp.id,
        name: tp.name,
        type: tp.type,
        ifu: tp.ifu,
        rccm: tp.rccm,
        email: tp.email,
        phone: tp.phone,
        address: tp.address,
        city: tp.city,
        is_active: tp.is_active,
      },
      entries: formattedEntries,
      summary: {
        total_debit: totalDebit,
        total_credit: totalCredit,
        balance: cumulativeBalance,
      },
    });
  } catch (err) {
    return handlePrismaError(err);
  }
}
