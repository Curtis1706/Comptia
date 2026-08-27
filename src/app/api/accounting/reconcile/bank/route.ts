import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, handlePrismaError } from "@/lib/api-response";

export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "bank_reconciliation", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const transactions = await prisma.bankTransaction.findMany({
      where: {
        statement: { company_id: user.company_id },
        status: { in: ["UNMATCHED", "PARTIAL"] },
      },
      orderBy: { date: "desc" },
    });
    return successJson(transactions);
  } catch (err) {
    return handlePrismaError(err);
  }
}
