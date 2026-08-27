import { requirePermission } from "@/lib/require-permission";
import { successResponse, errorResponse, handlePrismaError, paginatedResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { calculateVatForPeriod, validateDoubleEntry, nextEntryReference } from "@/lib/accounting";
import { logAction } from "@/lib/audit";
import { PaginationSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

/**
 * GET /api/vat/declarations
 * Lists VAT declarations. Requires 'read' on vat_declarations.
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "vat_declarations", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const { searchParams } = new URL(req.url);
    const pag = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const status = searchParams.get("status");
    const year = searchParams.get("year");

    const where: any = { company_id: user.company_id };
    if (status) where.status = status;
    if (year) {
      const y = parseInt(year);
      where.period_start = {
        gte: new Date(y, 0, 1),
        lte: new Date(y, 11, 31),
      };
    }

    const [declarations, total] = await Promise.all([
      prisma.vatDeclaration.findMany({
        where,
        skip: (pag.page - 1) * pag.limit,
        take: pag.limit,
        orderBy: { period_start: "desc" },
      }),
      prisma.vatDeclaration.count({ where }),
    ]);

    return paginatedResponse(declarations, total, pag.page, pag.limit);
  } catch (err) {
    console.error("[GET /api/vat/declarations]", err);
    return handlePrismaError(err);
  }
}

/**
 * POST /api/vat/declarations
 * Creates a new VAT declaration (draft) and its associated accounting entry. Requires 'write' on vat_declarations.
 */
export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "vat_declarations", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const body = await req.json();
    const { period_start, period_end, declaration_type } = body;

    if (!period_start || !period_end) {
      return errorResponse("Dates de période manquantes", 400);
    }

    const start = new Date(period_start);
    const end = new Date(period_end);

    // 1. Check for duplicates
    const existing = await prisma.vatDeclaration.findFirst({
      where: {
        company_id: user.company_id,
        period_start: start,
        period_end: end,
      },
    });

    if (existing) {
      return errorResponse("Une déclaration existe déjà pour cette période", 409);
    }

    // 2. Calculate VAT
    const vatData = await calculateVatForPeriod(prisma, user.company_id, start, end);

    // Calculate deadline: 15th of the month following period_end (DGI Bénin standard)
    const deadlineDate = new Date(end.getFullYear(), end.getMonth() + 1, 15, 23, 59, 59);

    // 3. Transaction: Create declaration + draft accounting entry
    const declaration = await prisma.$transaction(async (tx) => {
      const decl = await tx.vatDeclaration.create({
        data: {
          company_id: user.company_id,
          period_start: start,
          period_end: end,
          deadline_date: deadlineDate,
          declaration_type: declaration_type || "monthly",
          ca_ht: vatData.ca_ht,
          vat_collected: vatData.vat_collected,
          purchases_ht: vatData.purchases_ht,
          vat_deductible: vatData.vat_deductible,
          vat_due: vatData.vat_due,
          penalty_amount: 0,
          status: "draft",
        },
      });

      // 4. Generate SYSCOHADA accounting entry lines
      const lines = [
        {
          account_code: "4431",
          debit: vatData.vat_collected,
          credit: 0,
          description: `Régularisation TVA facturée ${period_start} - ${period_end}`,
        },
        {
          account_code: "4452",
          debit: 0,
          credit: vatData.vat_deductible,
          description: `Régularisation TVA déductible ${period_start} - ${period_end}`,
        },
      ];

      if (vatData.vat_due > 0) {
        lines.push({
          account_code: "4441",
          debit: 0,
          credit: vatData.vat_due,
          description: "État, TVA due à reverser",
        });
      } else if (vatData.vat_credit > 0) {
        lines.push({
          account_code: "4449",
          debit: vatData.vat_credit,
          credit: 0,
          description: "État, crédit de TVA à reporter",
        });
      }

      const { isValid, isNonZero } = validateDoubleEntry(lines);
      if (!isNonZero) {
        console.info(`[VAT] Déclaration ${decl.id} sans mouvement : aucune écriture générée`);
      } else if (isValid) {
        const ACCOUNT_DEFAULTS: Record<
          string,
          { name: string; type: "asset" | "liability" | "equity" | "revenue" | "expense" }
        > = {
          "4431": { name: "TVA facturée sur ventes", type: "liability" },
          "4452": { name: "TVA récupérable sur achats", type: "asset" },
          "4441": { name: "État, TVA due", type: "liability" },
          "4449": { name: "État, crédit de TVA à reporter", type: "asset" },
        };

        const uniqueCodes = [...new Set(lines.map((l) => l.account_code))];
        await Promise.all(
          uniqueCodes.map((code) => {
            const def = ACCOUNT_DEFAULTS[code] || { name: `Compte ${code}`, type: "asset" as const };
            return tx.account.upsert({
              where: { code_company_id: { code, company_id: user.company_id } },
              create: { code, name: def.name, type: def.type, company_id: user.company_id },
              update: {},
            });
          })
        );

        const vatRef = await nextEntryReference(tx, user.company_id, "VAT");

        await tx.journalEntry.create({
          data: {
            date: new Date(),
            reference: vatRef,
            description: `Déclaration TVA DGI ${period_start} - ${period_end}`,
            journal: "bank",
            status: "draft",
            company_id: user.company_id,
            created_by: user.id,
            lines: {
              create: lines.map((l) => ({
                account_code: l.account_code,
                debit: l.debit,
                credit: l.credit,
                description: l.description,
                company_id: user.company_id,
              })),
            },
          },
        });
      }

      return { ...decl, has_accounting_entry: isValid && isNonZero };
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "VatDeclaration",
      entity_id: declaration.id,
      details: declaration,
    });

    return NextResponse.json(
      successResponse(
        declaration,
        declaration.has_accounting_entry
          ? "Déclaration créée"
          : "Déclaration créée à néant — aucune opération taxable sur la période"
      ),
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/vat/declarations]", err);
    return handlePrismaError(err);
  }
}
