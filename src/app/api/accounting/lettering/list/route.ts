import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, handlePrismaError } from "@/lib/api-response";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const accountCode = searchParams.get("account") || "411";

    const lines = await prisma.journalLine.findMany({
      where: {
        company_id: user.company_id,
        account_code: { startsWith: accountCode },
        lettering_code: null,
        entry: { status: { in: ["posted", "validated"] } }
      },
      include: {
        entry: true
      },
      orderBy: { entry: { date: "asc" } }
    });
    return successJson(lines);
  } catch (err) {
    return handlePrismaError(err);
  }
});
