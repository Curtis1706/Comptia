import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { ids } = await req.json();

    if (!ids?.length || ids.length < 2) {
      return errorResponse("Veuillez sélectionner au moins deux écritures", 400);
    }

    // 1. Get lines and check balance
    const lines = await prisma.journalLine.findMany({
      where: { id: { in: ids }, company_id: user.company_id },
      include: { entry: true }
    });

    const debitTotal = lines.reduce((s, l) => s + Number(l.debit), 0);
    const creditTotal = lines.reduce((s, l) => s + Number(l.credit), 0);

    if (Math.abs(debitTotal - creditTotal) > 0.01) {
      return errorResponse(`Équilibre non respecté. Écart: ${debitTotal - creditTotal}`, 400);
    }

    const accountCode = lines[0].account_code;
    const year = lines[0].entry.date.getFullYear();

    // 2. Generate Next Lettering Code
    // Fetch last used code for this account and year
    const lastLine = await prisma.journalLine.findFirst({
      where: {
        company_id: user.company_id,
        account_code: accountCode,
        lettering_code: { not: null },
        entry: { date: { gte: new Date(`${year}-01-01`), lte: new Date(`${year}-12-31`) } }
      },
      orderBy: { lettering_code: "desc" },
      select: { lettering_code: true }
    });

    const nextCode = generateNextCode(lastLine?.lettering_code || null);

    // 3. Update lines
    await prisma.journalLine.updateMany({
      where: { id: { in: ids } },
      data: { lettering_code: nextCode }
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "UPDATE",
      resource: "Lettering",
      resource_id: nextCode,
      new_data: { ids, account: accountCode, year }
    });

    return successJson({ code: nextCode }, "Lettrage effectué avec succès");
  } catch (err) {
    return handlePrismaError(err);
  }
});

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
  
  // If we overflow ZZ, we should probably add a 3rd char, but AA-ZZ is 676 combinations per account/year.
  // Sufficient for most SMEs.
  return alphabet[i1 % 26] + alphabet[i2 % 26];
}
