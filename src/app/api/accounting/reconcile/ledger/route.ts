import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, handlePrismaError } from "@/lib/api-response";

export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "bank_reconciliation", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const lines = await prisma.journalLine.findMany({
      where: {
        company_id: user.company_id,
        entry: {
          journal: "bank",
          status: { in: ["posted", "validated"] },
        },
        reconciliation_status: { in: ["UNMATCHED", "PARTIAL"] },
      },
      include: {
        entry: true,
      },
      orderBy: { entry: { date: "desc" } },
    });
    return successJson(lines);
  } catch (err) {
    return handlePrismaError(err);
  }
}
