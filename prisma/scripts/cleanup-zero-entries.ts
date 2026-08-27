/**
 * prisma/scripts/cleanup-zero-entries.ts
 *
 * Détecte et supprime les écritures comptables à montant total nul (ex: VAT-ynso).
 *
 * Utilisation :
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/scripts/cleanup-zero-entries.ts (Mode DRY RUN)
 *   CONFIRM_DELETE=true npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/scripts/cleanup-zero-entries.ts (Exécution)
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://neondb_owner:npg_4fun8SPEvsjm@ep-odd-darkness-aq35f4pq.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔍 Recherche des écritures comptables à montant nul...");

  const isConfirmed = process.env.CONFIRM_DELETE === "true";

  // Récupère toutes les écritures avec leurs lignes
  const entries = await prisma.journalEntry.findMany({
    include: {
      lines: true,
      company: { select: { name: true } },
    },
  });

  const zeroEntries = entries.filter((e) => {
    const totalDebit = e.lines.reduce((s, l) => s + Number(l.debit || 0), 0);
    const totalCredit = e.lines.reduce((s, l) => s + Number(l.credit || 0), 0);
    return totalDebit < 0.01 && totalCredit < 0.01;
  });

  console.log(`📊 Écritures analysées : ${entries.length}`);
  console.log(`⚠️ Écritures à montant nul trouvées : ${zeroEntries.length}`);

  if (zeroEntries.length === 0) {
    console.log("✅ Aucune écriture à montant nul trouvée. Base de données saine !");
    return;
  }

  for (const entry of zeroEntries) {
    console.log(
      `  - [ID: ${entry.id}] Ref: ${entry.reference} | Date: ${entry.date.toISOString().slice(0, 10)} | Description: "${entry.description}" | Entreprise: "${entry.company.name}" (${entry.lines.length} lignes)`
    );
  }

  if (!isConfirmed) {
    console.log(
      "\n⚠️ MODE DRY-RUN : Aucune suppression effectuée. Pour supprimer ces écritures, relancez avec CONFIRM_DELETE=true"
    );
    return;
  }

  console.log("\n🗑️ Suppression des écritures à montant nul...");

  const idsToDelete = zeroEntries.map((e) => e.id);

  // Supprime les lignes associées d'abord (ou cascade)
  const deletedLines = await prisma.journalLine.deleteMany({
    where: { entry_id: { in: idsToDelete } },
  });

  const deletedEntries = await prisma.journalEntry.deleteMany({
    where: { id: { in: idsToDelete } },
  });

  console.log(
    `✅ Nettoyage terminé : ${deletedEntries.count} écritures et ${deletedLines.count} lignes supprimées avec succès.`
  );
}

main()
  .catch((err) => {
    console.error("❌ Erreur pendant le nettoyage :", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
