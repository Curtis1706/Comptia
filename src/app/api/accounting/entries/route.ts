import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, zodErrorResponse, handlePrismaError, paginatedResponse } from "@/lib/api-response";
import { logAction } from "@/lib/audit";
import * as z from "zod";

const CreateJournalEntrySchema = z.object({
  date: z.string().min(1),
  journal: z.enum(["purchases", "sales", "bank", "cash", "payroll"]),
  description: z.string().min(3),
  lines: z.array(z.object({
    account_code: z.string().min(1),
    description: z.string().optional(),
    debit: z.number().min(0),
    credit: z.number().min(0),
    third_party: z.string().optional(),
  })).min(2),
});

/**
 * GET /api/accounting/entries
 */
export const GET = withAuth(async (req, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const journal = searchParams.get("journal");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {
      company_id: user.company_id,
      ...(journal && { journal }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { reference: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        include: { 
          lines: {
            include: { account: true }
          }
        },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.journalEntry.count({ where }),
    ]);

    return paginatedResponse(entries, total, page, limit);
  } catch (err) {
    return handlePrismaError(err);
  }
});

/**
 * POST /api/accounting/entries
 */
export const POST = withAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const parsed = CreateJournalEntrySchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { lines, journal, date, description } = parsed.data;

    // Balance check
    const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = lines.reduce((s, l) => s + l.credit, 0);
    if (Math.abs(totalDebit - totalCredit) >= 0.01) {
      return errorResponse("L'écriture n'est pas équilibrée", 422);
    }

    // Reference generation: JOURNAL-YYYY-SEQUENCE
    const year = new Date(date).getFullYear();
    const count = await prisma.journalEntry.count({
      where: { company_id: user.company_id, journal, date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      } },
    });
    const reference = `${journal.toUpperCase()}-${year}-${String(count + 1).padStart(5, "0")}`;

    const result = await prisma.$transaction(async (tx) => {
      // Ensure all referenced accounts exist (upsert) to avoid FK violations
      const uniqueCodes = [...new Set(lines.map((l) => l.account_code))];
      await Promise.all(
        uniqueCodes.map((code) =>
          tx.account.upsert({
            where: { code_company_id: { code, company_id: user.company_id } },
            create: { code, name: `Compte ${code}`, type: "asset", company_id: user.company_id },
            update: {},
          })
        )
      );

      const entry = await tx.journalEntry.create({
        data: {
          date: new Date(date),
          reference,
          description,
          journal,
          status: "draft",
          company_id: user.company_id,
          created_by: user.id,
          lines: {
            create: lines.map(line => ({
              account_code: line.account_code,
              company_id: user.company_id,
              debit: line.debit,
              credit: line.credit,
              description: line.description || description,
              third_party: line.third_party,
            })),
          },
        },
        include: { lines: true },
      });

      await logAction({
        company_id: user.company_id,
        user_id: user.id,
        action: "CREATE",
        resource: "JournalEntry",
        resource_id: entry.id,
        new_data: { reference: entry.reference, total: totalDebit },
      });

      return entry;
    });

    return successJson(result, "Écriture enregistrée", 201);
  } catch (err) {
    return handlePrismaError(err);
  }
});
