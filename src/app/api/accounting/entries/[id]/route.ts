import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { logAction } from "@/lib/audit";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "accounting_entries", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const entry = await prisma.journalEntry.findUnique({
      where: { id, company_id: user.company_id },
      include: {
        lines: { include: { account: true } },
      },
    });

    if (!entry) return errorResponse("Écriture non trouvée", 404);
    return successJson(entry);
  } catch (err: any) {
    return handlePrismaError(err);
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "accounting_entries", "full");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const entry = await prisma.journalEntry.findUnique({
      where: { id, company_id: user.company_id },
    });

    if (!entry) return errorResponse("Écriture non trouvée", 404);
    if (entry.status === "validated" || entry.status === "posted") {
      return errorResponse("Impossible de supprimer une écriture validée", 403);
    }

    await prisma.journalEntry.delete({
      where: { id },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "DELETE",
      entity: "JournalEntry",
      entity_id: id,
      details: { reference: entry.reference, journal: entry.journal },
    });

    return successJson({ deleted: true }, "Écriture supprimée avec succès");
  } catch (err) {
    return handlePrismaError(err);
  }
}
