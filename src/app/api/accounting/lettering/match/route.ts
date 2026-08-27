import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "accounting_entries", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { ids } = await req.json();

    if (!ids?.length || ids.length < 2) {
      return errorResponse("Veuillez sélectionner au moins deux écritures", 400);
    }

    const lines = await prisma.journalLine.findMany({
      where: {
        id: { in: ids },
        company_id: user.company_id,
        entry: { status: { in: ["posted", "validated"] } },
      },
      include: { entry: true },
    });

    const debitTotal = lines.reduce((s, l) => s + Number(l.debit), 0);
    const creditTotal = lines.reduce((s, l) => s + Number(l.credit), 0);

    if (Math.abs(debitTotal - creditTotal) > 0.01) {
      return errorResponse(`Équilibre non respecté. Écart: ${debitTotal - creditTotal}`, 400);
    }

    const accountCode = lines[0].account_code;
    const year = lines[0].entry.date.getFullYear();

    const lastLine = await prisma.journalLine.findFirst({
      where: {
        company_id: user.company_id,
        account_code: accountCode,
        lettering_code: { not: null },
        entry: {
          status: { in: ["posted", "validated"] },
          date: { gte: new Date(`${year}-01-01`), lte: new Date(`${year}-12-31`) },
        },
      },
      orderBy: { lettering_code: "desc" },
      select: { lettering_code: true },
    });

    const nextCode = generateNextCode(lastLine?.lettering_code || null);

    await prisma.journalLine.updateMany({
      where: { id: { in: ids } },
      data: { lettering_code: nextCode },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      entity: "Lettering",
      entity_id: nextCode,
      details: { ids, account: accountCode, year },
    });

    return successJson({ code: nextCode }, "Lettrage effectué avec succès");
  } catch (err) {
    return handlePrismaError(err);
  }
}

function generateNextCode(lastCode: string | null): string {
  if (!lastCode) return "AA";

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let [c1, c2] = lastCode.split("");

  let i2 = alphabet.indexOf(c2);
  let i1 = alphabet.indexOf(c1);

  if (i2 < 25) {
    i2++;
  } else {
    i2 = 0;
    i1++;
  }

  return alphabet[i1 % 26] + alphabet[i2 % 26];
}
