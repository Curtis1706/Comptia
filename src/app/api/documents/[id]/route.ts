import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/documents/[id]
 */
export const GET = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = params as { id: string };

    const doc = await prisma.document.findUnique({
      where: { id, company_id: user.company_id },
    });

    if (!doc) {
      return errorResponse("Document non trouvé", 404);
    }

    return NextResponse.json(successResponse(doc));
  } catch (err) {
    console.error("[GET /api/documents/[id]]", err);
    return handlePrismaError(err);
  }
});
