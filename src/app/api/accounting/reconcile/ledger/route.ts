import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, handlePrismaError } from "@/lib/api-response";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const lines = await prisma.journalLine.findMany({
      where: {
        company_id: user.company_id,
        entry: { 
          journal: "bank",
          status: { in: ["posted", "validated"] } 
        },
        reconciliation_status: { in: ["UNMATCHED", "PARTIAL"] }
      },
      include: {
        entry: true
      },
      orderBy: { entry: { date: "desc" } }
    });
    return successJson(lines);
  } catch (err) {
    return handlePrismaError(err);
  }
});
