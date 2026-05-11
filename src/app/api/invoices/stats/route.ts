import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, handlePrismaError } from "@/lib/api-response";
import { toNumber } from "@/lib/accounting";

/**
 * GET /api/invoices/stats
 * Returns KPIs for invoices (total revenue, unpaid, overdue, etc.)
 */
export const GET = withAuth(async (_req, { user }) => {
  try {
    const companyId = user.company_id;

    // We use aggregate and count for efficiency
    const [stats, unpaidStats] = await Promise.all([
      // Total revenue (paid and pending invoices)
      prisma.invoice.aggregate({
        where: {
          company_id: companyId,
          type: "invoice",
          status: { not: "cancelled" },
        },
        _sum: { total_ttc: true, subtotal_ht: true, vat_amount: true },
        _count: { id: true },
      }),
      // Unpaid invoices (sent, viewed, overdue)
      prisma.invoice.aggregate({
        where: {
          company_id: companyId,
          type: "invoice",
          status: { in: ["sent", "viewed", "overdue"] },
        },
        _sum: { total_ttc: true },
        _count: { id: true },
      }),
    ]);

    // Count by status
    const countsByStatus = await prisma.invoice.groupBy({
      by: ["status"],
      where: { company_id: companyId, type: "invoice" },
      _count: { id: true },
    });

    const statusCounts: Record<string, number> = {};
    countsByStatus.forEach((s) => {
      statusCounts[s.status] = s._count.id;
    });

    return successJson({
      total_revenue: toNumber(stats._sum.total_ttc),
      total_ht: toNumber(stats._sum.subtotal_ht),
      total_vat: toNumber(stats._sum.vat_amount),
      total_count: stats._count.id,
      unpaid_amount: toNumber(unpaidStats._sum.total_ttc),
      unpaid_count: unpaidStats._count.id,
      status_counts: statusCounts,
    });
  } catch (err) {
    return handlePrismaError(err);
  }
});
