/**
 * prisma/scripts/promote-owners.ts
 *
 * Promeut le plus ancien administrateur de chaque entreprise au rôle `owner` (Propriétaire)
 * si l'entreprise ne possède pas encore de compte `owner`.
 *
 * Utilisation :
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/scripts/promote-owners.ts (Mode DRY RUN)
 *   CONFIRM_MIGRATE=true npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/scripts/promote-owners.ts (Exécution)
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
  console.log("🔍 Vérification des rôles Propriétaire (owner) par entreprise...");

  const isConfirmed = process.env.CONFIRM_MIGRATE === "true";

  const companies = await prisma.company.findMany({
    include: {
      users: {
        orderBy: { created_at: "asc" },
      },
    },
  });

  console.log(`🏢 Entreprises analysées : ${companies.length}`);

  let toPromoteCount = 0;

  for (const company of companies) {
    const existingOwner = company.users.find((u) => u.role === "owner");

    if (existingOwner) {
      console.log(
        `✅ Entreprise "${company.name}" : Propriétaire déjà défini -> ${existingOwner.name} (${existingOwner.email})`
      );
      continue;
    }

    // Cherche le plus ancien admin (ou à défaut le plus ancien utilisateur actif)
    const oldestAdmin =
      company.users.find((u) => u.role === "admin" && u.is_active) ||
      company.users.find((u) => u.is_active) ||
      company.users[0];

    if (!oldestAdmin) {
      console.log(`⚠️ Entreprise "${company.name}" : Aucun utilisateur trouvé.`);
      continue;
    }

    toPromoteCount++;
    console.log(
      `👉 Entreprise "${company.name}" : Promotion requise -> ${oldestAdmin.name} (${oldestAdmin.email}) [Rôle actuel: ${oldestAdmin.role}] -> 'owner'`
    );

    if (isConfirmed) {
      await prisma.user.update({
        where: { id: oldestAdmin.id },
        data: { role: "owner" },
      });
      console.log(`   ✨ ${oldestAdmin.email} promu au rôle 'owner' avec succès.`);
    }
  }

  if (!isConfirmed) {
    console.log(
      `\n⚠️ MODE DRY-RUN : ${toPromoteCount} promotion(s) identifiée(s). Pour appliquer les changements, relancez avec CONFIRM_MIGRATE=true`
    );
  } else {
    console.log(
      `\n✅ Promotions terminées : ${toPromoteCount} utilisateur(s) promu(s) au rôle 'owner'.`
    );
  }
}

main()
  .catch((err) => {
    console.error("❌ Erreur pendant la promotion :", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
