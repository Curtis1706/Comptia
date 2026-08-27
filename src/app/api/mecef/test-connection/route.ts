import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse } from "@/lib/api-response";
import { getInfoStatus, getInvoiceTypes, getTaxGroups, getPaymentTypes } from "@/lib/mecef";

/**
 * POST /api/mecef/test-connection
 * Effectue un appel en direct vers les 4 endpoints de contrôle DGI.
 */
export const POST = withAuth(async (req, { user }) => {
  const company_id = user.company_id;

  try {
    const [status, invoiceTypes, taxGroups, paymentTypes] = await Promise.all([
      getInfoStatus(company_id),
      getInvoiceTypes(company_id),
      getTaxGroups(company_id),
      getPaymentTypes(company_id),
    ]);

    return successJson(
      {
        status,
        invoiceTypes,
        taxGroups,
        paymentTypes,
      },
      "Connexion à la DGI e-MECeF établie avec succès"
    );
  } catch (error: any) {
    return errorResponse(
      error.message || "Impossible de joindre le serveur DGI e-MECeF",
      502
    );
  }
});
