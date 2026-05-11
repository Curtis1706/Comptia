import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { errorResponse, handlePrismaError } from "@/lib/api-response";
import { InvoicePDF } from "@/lib/pdf-templates/InvoicePDF";

const React = require("react");
const { renderToStream } = require("@react-pdf/renderer");

export const GET = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = await params;

    const [invoice, company] = await Promise.all([
      prisma.invoice.findUnique({
        where: { id, company_id: user.company_id },
        include: { client: true, lines: true }
      }),
      prisma.company.findUnique({
        where: { id: user.company_id }
      })
    ]);

    if (!invoice || !company) return errorResponse("Facture non trouvée", 404);

    const stream = await renderToStream(
      InvoicePDF({ invoice, company }) as any
    );

    // Convert stream to Buffer to return in NextResponse
    const chunks: any[] = [];
    for await (const chunk of stream as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${invoice.reference}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("[PDF Error]", err);
    return NextResponse.json({ success: false, error: err.message || "Erreur interne du serveur", stack: err.stack }, { status: 500 });
  }
});
