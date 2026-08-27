import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "accounting_entries", "validate");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse("Aucun ID fourni", 400);
    }

    const updated = await prisma.journalEntry.updateMany({
      where: {
        id: { in: ids },
        company_id: user.company_id,
        status: "draft",
      },
      data: {
        status: "validated",
      },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "VALIDATE",
      entity: "JournalEntry",
      entity_id: "multiple",
      details: { count: updated.count, ids },
    });

    return successJson({ count: updated.count }, `${updated.count} écritures validées avec succès`);
  } catch (err) {
    return handlePrismaError(err);
  }
}
