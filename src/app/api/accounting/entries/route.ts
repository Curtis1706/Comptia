import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse, zodErrorResponse, handlePrismaError, paginatedResponse } from "@/lib/api-response";
import { logAction } from "@/lib/audit";
import { validateDoubleEntry, nextEntryReference } from "@/lib/accounting";
import * as z from "zod";

const CreateJournalEntrySchema = z.object({
  date: z.string().min(1),
  journal: z.enum(["purchases", "sales", "bank", "cash", "payroll"]),
  description: z.string().min(3),
  lines: z
    .array(
      z.object({
        account_code: z.string().min(1),
        description: z.string().optional(),
        debit: z.number().min(0),
        credit: z.number().min(0),
        third_party: z.string().optional(),
      })
    )
    .min(2),
});

/**
 * GET /api/accounting/entries
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "accounting_entries", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

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
            include: { account: true },
          },
        },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.journalEntry.count({ where }),
    ]);

    return paginatedResponse(entries, total, page, limit);
  } catch (err: any) {
    return handlePrismaError(err);
  }
}

/**
 * POST /api/accounting/entries
 */
export async function POST(req: Request) {
  const permCheck = await requirePermission(req, "accounting_entries", "write");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const body = await req.json();
    const parsed = CreateJournalEntrySchema.safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const data = parsed.data;

    // 1. Validation de l'équilibre comptable
    const validation = validateDoubleEntry(data.lines);
    if (!validation.isValid) {
      return errorResponse(`Écriture comptable invalide : ${validation.error}`, 400);
    }

    // 2. Génération de la référence séquentielle
    const reference = await nextEntryReference(prisma, user.company_id, data.journal);

    // 3. Création transactionnelle
    const entry = await prisma.journalEntry.create({
      data: {
        company_id: user.company_id,
        reference,
        journal: data.journal,
        date: new Date(data.date),
        description: data.description,
        status: "draft",
        created_by: user.id,
        lines: {
          create: data.lines.map((l) => ({
            company_id: user.company_id,
            account_code: l.account_code,
            description: l.description || data.description,
            debit: l.debit,
            credit: l.credit,
            third_party: l.third_party,
          })),
        },
      },
      include: {
        lines: {
          include: { account: true },
        },
      },
    });

    await logAction({
      company_id: user.company_id,
      user_id: user.id,
      action: "CREATE",
      entity: "JournalEntry",
      entity_id: entry.id,
      details: { reference, journal: data.journal, total: validation.totalDebit },
    });

    return successJson(entry, "Écriture comptable enregistrée en brouillon", 201);
  } catch (err: any) {
    return handlePrismaError(err);
  }
}
