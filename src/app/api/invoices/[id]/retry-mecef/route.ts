import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { confirmInvoice, normalizeInvoice, getMecefConfig } from "@/lib/mecef";

/**
 * POST /api/invoices/[id]/retry-mecef
 * Relance la normalisation e-MECeF pour une facture en attente ou rejetée.
 */
export const POST = withAuth(async (req, { user, params }) => {
  try {
    const { id } = params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, company_id: user.company_id },
      include: {
        lines: true,
        client: true,
        company: true,
        created_by_user: true,
      },
    });

    if (!invoice) return errorResponse("Facture introuvable", 404);

    if (invoice.type === "quote") {
      return errorResponse("Un devis ne peut pas être normalisé auprès de la DGI", 400);
    }

    if (invoice.mecef_status === "normalized") {
      return successJson(
        {
          codeMECeFDGI: invoice.mecef_dgi_code,
          qrCode: invoice.mecef_qr_code,
          nim: invoice.mecef_nim,
          counters: invoice.mecef_counters,
          status: "normalized",
        },
        "Cette facture est déjà certifiée par la DGI"
      );
    }

    const config = getMecefConfig();

    // Cas 1 : UID existant -> appel direct de PUT /invoice/{uid}/confirm
    if (invoice.mecef_uid && config.mode !== "simulation") {
      try {
        const confirmRes = await confirmInvoice(invoice.mecef_uid, {
          company_id: user.company_id,
          invoice_id: invoice.id,
        });

        const updated = await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            mecef_status: "normalized",
            mecef_dgi_code: confirmRes.codeMECeFDGI,
            mecef_qr_code: confirmRes.qrCode,
            mecef_nim: confirmRes.nim || config.nim,
            mecef_counters: confirmRes.counters,
            mecef_datetime: new Date(),
          },
        });

        return successJson(
          {
            invoice_id: updated.id,
            codeMECeFDGI: updated.mecef_dgi_code,
            qrCode: updated.mecef_qr_code,
            counters: updated.mecef_counters,
            status: "normalized",
          },
          "Facture normalisée avec succès auprès de la DGI"
        );
      } catch (confirmError: any) {
        console.warn("[e-MECeF Retry] Échec de la confirmation avec l'UID existant, tentative de re-création complète :", confirmError.message);
      }
    }

    // Cas 2 : Re-création complète (POST + PUT)
    const result = await normalizeInvoice(invoice as any, {
      company_id: user.company_id,
      invoice_id: invoice.id,
    });

    return successJson(
      {
        invoice_id: invoice.id,
        codeMECeFDGI: result.codeMECeFDGI,
        qrCode: result.qrCode,
        counters: result.counters,
        status: "normalized",
      },
      "Facture certifiée et normalisée avec succès par la DGI"
    );
  } catch (error: any) {
    console.error("[e-MECeF Retry] Erreur fatale :", error);
    await prisma.invoice.update({
      where: { id: params.id },
      data: { mecef_status: "verification_failed" },
    }).catch(() => {});

    return errorResponse(error.message || "Échec de la relance e-MECeF", 502);
  }
});
