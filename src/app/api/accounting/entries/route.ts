import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { successJson, errorResponse, zodErrorResponse, handlePrismaError, paginatedResponse } from "@/lib/api-response";
import { logAction } from "@/lib/audit";
import { validateDoubleEntry, nextEntryReference } from "@/lib/accounting";
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

    // 1. Balance and non-zero check (B3)
    const { isBalanced, isNonZero, totalDebit, totalCredit, difference } =
      validateDoubleEntry(lines);

    if (!isBalanced) {
      return errorResponse(
        `L'écriture n'est pas équilibrée : débit ${totalDebit.toLocaleString("fr-FR")} FCFA, ` +
        `crédit ${totalCredit.toLocaleString("fr-FR")} FCFA, écart ${difference.toLocaleString("fr-FR")} FCFA`,
        422
      );
    }
    if (!isNonZero) {
      return errorResponse(
        "L'écriture ne peut pas avoir un montant nul",
        422
      );
    }

    // 2. Validate accounts and block non-postable accounts (B5)
    const codes = [...new Set(lines.map((l) => l.account_code))];
    const accounts = await prisma.account.findMany({
      where: { company_id: user.company_id, code: { in: codes } },
      select: { code: true, name: true, is_postable: true },
    });

    const missing = codes.filter((c) => !accounts.some((a) => a.code === c));
    if (missing.length > 0) {
      return errorResponse(
        `Compte inconnu : ${missing.join(", ")}`,
        422
      );
    }

    const nonPostable = accounts.filter((a) => !a.is_postable);
    if (nonPostable.length > 0) {
      return errorResponse(
        `Écriture impossible sur un compte de regroupement : ` +
        nonPostable.map((a) => `${a.code} — ${a.name}`).join(", ") +
        `. Utilisez un sous-compte.`,
        422
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const reference = await nextEntryReference(tx, user.company_id, journal.toUpperCase(), new Date(date));

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
              description: line.description,
              third_party: line.third_party,
            })),
          },
        },
        include: { lines: true }
      });

      return entry;
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      resource: "JournalEntry",
      resource_id: result.id,
      new_data: { reference: result.reference, description: result.description, linesCount: lines.length },
    });

    return successJson(result, "Écriture créée avec succès", 201);
  } catch (err) {
    return handlePrismaError(err);
  }
});
