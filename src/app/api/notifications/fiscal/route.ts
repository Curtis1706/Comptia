import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, handlePrismaError } from "@/lib/api-response";
import { generateFiscalAlerts, checkOverdueInvoices } from "@/lib/fiscal-alerts";

/**
 * POST /api/notifications/fiscal
 * Triggers fiscal alerts calculation and checks overdue invoices for the tenant.
 */
export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const today = new Date();

    const [fiscalResult, invoicesResult] = await Promise.all([
      generateFiscalAlerts(prisma, user.company_id, today),
      checkOverdueInvoices(prisma, user.company_id, today),
    ]);

    return successJson({
      fiscalAlertsCreated: fiscalResult.count,
      overdueInvoicesUpdated: invoicesResult.updatedCount,
      overdueNotificationsCreated: invoicesResult.notificationsCreated,
    }, "Vérification des échéances fiscales et des retards effectuée avec succès");
  } catch (err) {
    console.error("[POST /api/notifications/fiscal]", err);
    return handlePrismaError(err);
  }
});

/**
 * GET /api/notifications/fiscal
 * Returns status and overview of upcoming fiscal deadlines for the current month/quarter.
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const today = new Date();
    const result = await generateFiscalAlerts(prisma, user.company_id, today);

    return successJson({
      today: today.toISOString(),
      alertsGenerated: result.count,
      alerts: result.alerts,
    });
  } catch (err) {
    console.error("[GET /api/notifications/fiscal]", err);
    return handlePrismaError(err);
  }
});
