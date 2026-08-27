/**
 * prisma/scripts/fix-nonpostable-entries.ts
 *
 * 1. Recalcule le statut `is_postable` pour tous les comptes du plan comptable
 *    (false si le compte est un compte parent / de regroupement).
 * 2. Réaffecte les lignes d'écritures existantes imputées sur un compte de regroupement
 *    (ex: compte "52" -> "521") vers un sous-compte mouvementable.
 *
 * Utilisation :
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/scripts/fix-nonpostable-entries.ts (Mode DRY RUN)
 *   CONFIRM_MIGRATE=true npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/scripts/fix-nonpostable-entries.ts (Exécution)
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

// Mappage de secours par défaut pour les comptes parents courants
const DEFAULT_SUBACCOUNT_MAP: Record<string, { targetCode: string; targetName: string }> = {
  "10": { targetCode: "101", targetName: "Capital social" },
  "11": { targetCode: "111", targetName: "Réserve légale" },
  "12": { targetCode: "121", targetName: "Report à nouveau créditeur" },
  "13": { targetCode: "131", targetName: "Résultat net : Bénéfice" },
  "16": { targetCode: "162", targetName: "Emprunts et dettes auprès des banques" },
  "20": { targetCode: "201", targetName: "Frais d'établissement" },
  "21": { targetCode: "213", targetName: "Logiciels et sites internet" },
  "22": { targetCode: "223", targetName: "Terrains bâtis" },
  "23": { targetCode: "231", targetName: "Bâtiments industriels et commerciaux" },
  "24": { targetCode: "245", targetName: "Matériel de bureau et informatique" },
  "31": { targetCode: "311", targetName: "Marchandises A" },
  "33": { targetCode: "335", targetName: "Fournitures de bureau et consommables" },
  "40": { targetCode: "401", targetName: "Fournisseurs, dettes en compte" },
  "41": { targetCode: "411", targetName: "Clients, créances en compte" },
  "42": { targetCode: "421", targetName: "Personnel, rémunérations dues" },
  "43": { targetCode: "431", targetName: "Sécurité sociale (CNSS)" },
  "44": { targetCode: "4441", targetName: "État, TVA due" },
  "52": { targetCode: "521", targetName: "Banques en monnaie nationale" },
  "53": { targetCode: "531", targetName: "Caisse en monnaie nationale" },
  "58": { targetCode: "585", targetName: "Virements de fonds" },
  "60": { targetCode: "601", targetName: "Achats de marchandises" },
  "61": { targetCode: "613", targetName: "Locations" },
  "62": { targetCode: "624", targetName: "Transports" },
  "63": { targetCode: "632", targetName: "Rémunérations d'intermédiaires et honoraires" },
  "64": { targetCode: "641", targetName: "Impôts et taxes directs" },
  "66": { targetCode: "661", targetName: "Rémunérations directes versées au personnel" },
  "70": { targetCode: "701", targetName: "Ventes de marchandises" },
};

async function main() {
  console.log("🔍 Recalcul des comptes de regroupement et vérification des écritures...");

  const isConfirmed = process.env.CONFIRM_MIGRATE === "true";

  const companies = await prisma.company.findMany({ select: { id: true, name: true } });
  console.log(`🏢 Entreprises trouvées : ${companies.length}`);

  let totalUpdatedAccounts = 0;
  let totalReassignedLines = 0;

  for (const company of companies) {
    console.log(`\n--- Entreprise : "${company.name}" (${company.id}) ---`);

    const accounts = await prisma.account.findMany({
      where: { company_id: company.id },
    });

    if (accounts.length === 0) continue;

    // Détecte les comptes parents (cités en parent_code)
    const parentCodes = new Set(
      accounts.map((a) => a.parent_code).filter((c): c is string => Boolean(c))
    );

    // Identifie les comptes qui doivent être mis à jour
    const toDisable: string[] = [];
    const toEnable: string[] = [];

    for (const acc of accounts) {
      const shouldBePostable = !parentCodes.has(acc.code);
      if (acc.is_postable !== shouldBePostable) {
        if (shouldBePostable) toEnable.push(acc.id);
        else toDisable.push(acc.id);
      }
    }

    console.log(
      `  Comptes à marquer non-mouvementables (regroupement) : ${toDisable.length}`
    );
    console.log(
      `  Comptes à marquer mouvementables : ${toEnable.length}`
    );

    // Recherche des écritures imputées sur des comptes de regroupement
    const nonPostableCodes = accounts
      .filter((a) => parentCodes.has(a.code))
      .map((a) => a.code);

    const illegalLines = await prisma.journalLine.findMany({
      where: {
        company_id: company.id,
        account_code: { in: nonPostableCodes },
      },
      include: {
        entry: { select: { reference: true, date: true } },
      },
    });

    console.log(
      `  ⚠️ Lignes d'écritures sur comptes de regroupement : ${illegalLines.length}`
    );

    for (const line of illegalLines) {
      const mapping = DEFAULT_SUBACCOUNT_MAP[line.account_code];
      const targetCode = mapping ? mapping.targetCode : `${line.account_code}1`;
      console.log(
        `    - Ligne [ID: ${line.id}] Pièce: ${line.entry.reference} | Compte actuel: ${line.account_code} -> Cible suggérée: ${targetCode}`
      );
    }

    if (isConfirmed) {
      if (toDisable.length > 0) {
        await prisma.account.updateMany({
          where: { id: { in: toDisable } },
          data: { is_postable: false },
        });
        totalUpdatedAccounts += toDisable.length;
      }

      if (toEnable.length > 0) {
        await prisma.account.updateMany({
          where: { id: { in: toEnable } },
          data: { is_postable: true },
        });
        totalUpdatedAccounts += toEnable.length;
      }

      // Réaffectation des lignes d'écriture
      for (const line of illegalLines) {
        const mapping = DEFAULT_SUBACCOUNT_MAP[line.account_code];
        const targetCode = mapping ? mapping.targetCode : `${line.account_code}1`;
        const targetName = mapping ? mapping.targetName : `Sous-compte ${targetCode}`;

        // S'assure que le sous-compte existe
        const parentAcc = accounts.find((a) => a.code === line.account_code);
        await prisma.account.upsert({
          where: { code_company_id: { code: targetCode, company_id: company.id } },
          create: {
            code: targetCode,
            name: targetName,
            type: parentAcc?.type || "asset",
            company_id: company.id,
            parent_code: line.account_code,
            is_postable: true,
          },
          update: { is_postable: true },
        });

        await prisma.journalLine.update({
          where: { id: line.id },
          data: { account_code: targetCode },
        });

        totalReassignedLines++;
      }
    }
  }

  if (!isConfirmed) {
    console.log(
      "\n⚠️ MODE DRY-RUN : Aucune modification effectuée. Pour exécuter la migration, relancez avec CONFIRM_MIGRATE=true"
    );
  } else {
    console.log(
      `\n✅ Migration terminée : ${totalUpdatedAccounts} comptes mis à jour, ${totalReassignedLines} lignes réaffectées.`
    );
  }
}

main()
  .catch((err) => {
    console.error("❌ Erreur pendant la reprise :", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
