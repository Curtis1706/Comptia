import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/require-permission";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import { generatePayrollEntryLines } from "@/lib/payroll";
import { validateDoubleEntry } from "@/lib/accounting";

/**
 * POST /api/payroll/payslips/[id]/validate
 * Requires 'validate' on payroll.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const permCheck = await requirePermission(req, "payroll", "validate");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;
  const { id } = await context.params;

  try {
    const payroll = await prisma.payroll.findUnique({
      where: { id, company_id: user.company_id },
      include: { employee: true, lines: true },
    });

    if (!payroll) {
      return errorResponse("Bulletin non trouvé", 404);
    }

    if (payroll.status !== "draft") {
      return errorResponse("Ce bulletin a déjà été validé ou traité", 409);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const calcParams = {
        base_salary: Number(payroll.base_salary),
        gross_salary: Number(payroll.gross_salary),
        net_salary: Number(payroll.net_salary),
        employer_cost: Number(payroll.employer_cost),
        lines: payroll.lines.map((l) => ({
          type: l.type,
          label: l.label,
          amount: Number(l.amount),
          rate: l.rate ? Number(l.rate) : null,
          base: l.base ? Number(l.base) : null,
        })),
      };

      const entryLines = generatePayrollEntryLines(calcParams, payroll.employee_id);
      const { isValid } = validateDoubleEntry(entryLines);

      if (isValid) {
        const ACCOUNT_DEFAULTS: Record<
          string,
          { name: string; type: "asset" | "liability" | "equity" | "revenue" | "expense" }
        > = {
          "641": { name: "Rémunérations du personnel", type: "expense" },
          "645": { name: "Charges sociales patronales", type: "expense" },
          "421": { name: "Personnel - Salaires à payer", type: "liability" },
          "431": { name: "Sécurité Sociale", type: "liability" },
        };

        const uniqueCodes = [...new Set(entryLines.map((l) => l.account_code))];
        await Promise.all(
          uniqueCodes.map((code) => {
            const def = ACCOUNT_DEFAULTS[code] || { name: `Compte ${code}`, type: "expense" as const };
            return tx.account.upsert({
              where: { code_company_id: { code, company_id: user.company_id } },
              create: { code, name: def.name, type: def.type, company_id: user.company_id },
              update: {},
            });
          })
        );

        await tx.journalEntry.create({
          data: {
            date: payroll.period_end,
            reference: `PAY-${payroll.year}-${String(payroll.month).padStart(2, "0")}-${payroll.employee_id.slice(-4)}`,
            description: `Paie ${payroll.employee.first_name} ${payroll.employee.last_name} ${payroll.month}/${payroll.year}`,
            journal: "payroll",
            status: "posted",
            company_id: user.company_id,
            created_by: user.id,
            lines: {
              create: entryLines.map((l) => ({
                account_code: l.account_code,
                debit: l.debit,
                credit: l.credit,
                description: l.description,
                company_id: user.company_id,
                third_party: (l as any).third_party,
              })),
            },
          },
        });
      }

      const p = await tx.payroll.update({
        where: { id },
        data: { status: "validated" },
      });

      return p;
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "VALIDATE",
      entity: "Payroll",
      entity_id: id,
    });

    return NextResponse.json(successResponse(updated, "Bulletin validé avec succès"));
  } catch (err) {
    console.error("[POST /api/payroll/payslips/[id]/validate]", err);
    return handlePrismaError(err);
  }
}
