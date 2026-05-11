import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import { successResponse, errorResponse, handlePrismaError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { calculatePayroll, generatePayrollEntryLines } from "@/lib/payroll";
import { validateDoubleEntry } from "@/lib/accounting";
import { logAction } from "@/lib/audit";

/**
 * POST /api/payroll/payslips/generate
 * Generates payslips and accounting entries for active employees.
 */
export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json();
    const { month, year, employee_ids } = body;

    if (!month || !year) {
      return errorResponse("Période (mois/année) manquante", 400);
    }

    // 1. Find employees
    const employees = await prisma.employee.findMany({
      where: {
        company_id: user.company_id,
        status: "active",
        ...(employee_ids?.length ? { id: { in: employee_ids } } : {}),
      },
    });

    if (employees.length === 0) {
      return errorResponse("Aucun salarié actif trouvé pour la génération", 400);
    }

    // 2. Check for existing processed payslips
    const existing = await prisma.payroll.findFirst({
      where: {
        company_id: user.company_id,
        month,
        year,
        status: { not: "draft" },
      },
    });

    if (existing) {
      return errorResponse(`Des bulletins pour ${month}/${year} ont déjà été validés ou traités`, 409);
    }

    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0);

    // 3. Transactional generation
    const payrolls = await prisma.$transaction(async (tx) => {
      const results = [];

      for (const employee of employees) {
        // 3a. Calculate
        const calc = calculatePayroll(Number(employee.base_salary));

        // 3b. Create Payroll record
        const payroll = await tx.payroll.create({
          data: {
            company_id: user.company_id,
            employee_id: employee.id,
            month,
            year,
            period_start: periodStart,
            period_end: periodEnd,
            base_salary: employee.base_salary,
            gross_salary: calc.gross_salary,
            net_salary: calc.net_salary,
            employer_cost: calc.total_employer_cost,
            status: "draft",
            deductions: {
              create: calc.employee_deductions.map((d) => ({
                label: d.name,
                amount: d.amount,
                rate: d.percentage / 100,
                base: calc.gross_salary,
              })),
            },
            contributions: {
              create: calc.employer_contributions.map((c) => ({
                label: c.name,
                amount: c.amount,
                rate: c.percentage / 100,
                base: calc.gross_salary,
              })),
            },
          },
          include: { deductions: true, contributions: true },
        });

        // 3c. Generate Accounting Entry
        const entryLines = generatePayrollEntryLines(calc, employee.id);
        const { isValid } = validateDoubleEntry(entryLines);

        if (isValid) {
          // Auto-create missing accounts to avoid FK violations
          const ACCOUNT_DEFAULTS: Record<string, { name: string; type: "asset" | "liability" | "equity" | "revenue" | "expense" }> = {
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
              date: periodEnd,
              reference: `PAY-${year}-${String(month).padStart(2, "0")}-${employee.id.slice(-4)}`,
              description: `Paie ${employee.first_name} ${employee.last_name} ${month}/${year}`,
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

        results.push(payroll);
      }

      return results;
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      resource: "Payroll",
      resource_id: `${month}/${year}`,
      new_data: { count: payrolls.length, month, year },
    });

    return NextResponse.json(
      successResponse(payrolls, `${payrolls.length} bulletin(s) généré(s) avec succès`),
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/payroll/payslips/generate]", err);
    return handlePrismaError(err);
  }
});
