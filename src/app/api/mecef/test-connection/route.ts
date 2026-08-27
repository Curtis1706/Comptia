import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse } from "@/lib/api-response";
import { getInfoStatus, getInvoiceTypes, getTaxGroups, getPaymentTypes } from "@/lib/mecef";

/**
 * POST /api/mecef/test-connection
 * Requires 'read' on mecef_settings.
 */
export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "mecef_settings", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
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
}
