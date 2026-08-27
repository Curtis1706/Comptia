import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, handlePrismaError } from "@/lib/api-response";

export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "accounting_entries", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const accountCode = searchParams.get("account") || "411";

    const lines = await prisma.journalLine.findMany({
      where: {
        company_id: user.company_id,
        account_code: { startsWith: accountCode },
        lettering_code: null,
        entry: { status: { in: ["posted", "validated"] } },
      },
      include: {
        entry: true,
      },
      orderBy: { entry: { date: "asc" } },
    });
    return successJson(lines);
  } catch (err) {
    return handlePrismaError(err);
  }
}
