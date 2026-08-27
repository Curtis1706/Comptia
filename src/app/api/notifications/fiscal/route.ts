import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, handlePrismaError } from "@/lib/api-response";
import { generateFiscalAlerts, checkOverdueInvoices } from "@/lib/fiscal-alerts";

/**
 * Vérifie si la requête provient d'un CRON externe avec CRON_SECRET valide.
 */
function isCronAuthorized(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return token === cronSecret;
}

/**
 * POST /api/notifications/fiscal
 * Triggers fiscal alerts calculation and checks overdue invoices.
 */
export async function POST(req: Request) {
  let companyId: string | null = null;

  if (isCronAuthorized(req)) {
    // Si appelé par CRON global, on peut traiter l'entreprise passée en query ou toutes
    const { searchParams } = new URL(req.url);
    companyId = searchParams.get("company_id");
  } else {
    const permCheck = await requirePermission(req, "notifications", "write");
    if (!permCheck.ok) return permCheck.response;
    companyId = permCheck.user.company_id;
  }

  if (!companyId) {
    return errorResponse("company_id manquant pour le cron", 400);
  }

  try {
    const today = new Date();

    const [fiscalResult, invoicesResult] = await Promise.all([
      generateFiscalAlerts(prisma, companyId, today),
      checkOverdueInvoices(prisma, companyId, today),
    ]);

    return successJson(
      {
        fiscalAlertsCreated: fiscalResult.count,
        overdueInvoicesUpdated: invoicesResult.updatedCount,
        overdueNotificationsCreated: invoicesResult.notificationsCreated,
      },
      "Vérification des échéances fiscales et des retards effectuée avec succès"
    );
  } catch (err) {
    console.error("[POST /api/notifications/fiscal]", err);
    return handlePrismaError(err);
  }
}

/**
 * GET /api/notifications/fiscal
 * Returns upcoming fiscal deadlines.
 */
export async function GET(req: Request) {
  let companyId: string | null = null;

  if (isCronAuthorized(req)) {
    const { searchParams } = new URL(req.url);
    companyId = searchParams.get("company_id");
  } else {
    const permCheck = await requirePermission(req, "notifications", "read");
    if (!permCheck.ok) return permCheck.response;
    companyId = permCheck.user.company_id;
  }

  if (!companyId) {
    return errorResponse("company_id manquant", 400);
  }

  try {
    const today = new Date();
    const result = await generateFiscalAlerts(prisma, companyId, today);

    return successJson({
      today: today.toISOString(),
      alertsGenerated: result.count,
      alerts: result.alerts,
    });
  } catch (err) {
    console.error("[GET /api/notifications/fiscal]", err);
    return handlePrismaError(err);
  }
}
