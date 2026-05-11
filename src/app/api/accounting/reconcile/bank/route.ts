import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, handlePrismaError } from "@/lib/api-response";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const transactions = await prisma.bankTransaction.findMany({
      where: {
        statement: { company_id: user.company_id },
        status: { in: ["UNMATCHED", "PARTIAL"] }
      },
      orderBy: { date: "desc" }
    });
    return successJson(transactions);
  } catch (err) {
    return handlePrismaError(err);
  }
});
