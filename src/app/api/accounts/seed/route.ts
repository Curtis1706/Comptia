import { prisma } from "@/lib/prisma";
import { withAuth, requireAdmin } from "@/lib/auth-guard";
import { successJson, handlePrismaError } from "@/lib/api-response";

// French Plan Comptable Général — Classes 1 to 7
const PCG_ACCOUNTS: Array<{
  code: string;
  name: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  parent_code?: string;
}> = [
  // Classe 1 — Comptes de capitaux
  { code: "101", name: "Capital", type: "equity" },
  { code: "106", name: "Réserves", type: "equity" },
  { code: "110", name: "Report à nouveau", type: "equity" },
  { code: "120", name: "Résultat de l'exercice (bénéfice)", type: "equity" },
  { code: "129", name: "Résultat de l'exercice (perte)", type: "equity" },
  { code: "164", name: "Emprunts auprès des établissements de crédit", type: "liability" },
  { code: "165", name: "Dépôts et cautionnements reçus", type: "liability" },

  // Classe 2 — Comptes d'immobilisations
  { code: "205", name: "Concessions, brevets et droits similaires", type: "asset" },
  { code: "211", name: "Terrains", type: "asset" },
  { code: "213", name: "Constructions", type: "asset" },
  { code: "215", name: "Installations techniques, matériels et outillages", type: "asset" },
  { code: "218", name: "Autres immobilisations corporelles", type: "asset" },
  { code: "280", name: "Amortissements des immobilisations incorporelles", type: "asset" },
  { code: "281", name: "Amortissements des immobilisations corporelles", type: "asset" },

  // Classe 3 — Comptes de stocks
  { code: "310", name: "Matières premières", type: "asset" },
  { code: "355", name: "Produits finis", type: "asset" },
  { code: "370", name: "Stocks de marchandises", type: "asset" },

  // Classe 4 — Comptes de tiers
  { code: "401", name: "Fournisseurs", type: "liability" },
  { code: "4011", name: "Fournisseurs — achats de biens et prestations de services", type: "liability", parent_code: "401" },
  { code: "403", name: "Fournisseurs — effets à payer", type: "liability" },
  { code: "408", name: "Fournisseurs — factures non parvenues", type: "liability" },
  { code: "411", name: "Clients", type: "asset" },
  { code: "4111", name: "Clients — ventes de biens et prestations de services", type: "asset", parent_code: "411" },
  { code: "413", name: "Clients — effets à recevoir", type: "asset" },
  { code: "418", name: "Clients — produits non encore facturés", type: "asset" },
  { code: "421", name: "Personnel — rémunérations dues", type: "liability" },
  { code: "422", name: "Comités d'entreprise", type: "liability" },
  { code: "425", name: "Personnel — avances et acomptes", type: "asset" },
  { code: "431", name: "Sécurité sociale", type: "liability" },
  { code: "437", name: "Autres organismes sociaux", type: "liability" },
  { code: "4424", name: "État — crédit de TVA", type: "asset" },
  { code: "4455", name: "Taxes sur le chiffre d'affaires à décaisser", type: "liability" },
  { code: "4456", name: "Taxes sur le chiffre d'affaires déductibles", type: "asset" },
  { code: "44566", name: "TVA déductible sur autres biens et services", type: "asset", parent_code: "4456" },
  { code: "4457", name: "Taxes sur le chiffre d'affaires collectées", type: "liability" },
  { code: "44571", name: "TVA collectée — taux 20%", type: "liability", parent_code: "4457" },
  { code: "44575", name: "TVA collectée — taux 5.5%", type: "liability", parent_code: "4457" },
  { code: "44580", name: "Acomptes — régime simplifié", type: "liability" },
  { code: "447", name: "Autres impôts, taxes et versements assimilés", type: "liability" },
  { code: "455", name: "Associés — comptes courants", type: "liability" },
  { code: "467", name: "Autres comptes débiteurs ou créditeurs", type: "liability" },

  // Classe 5 — Comptes financiers
  { code: "512", name: "Banque", type: "asset" },
  { code: "530", name: "Caisse", type: "asset" },
  { code: "580", name: "Virements internes", type: "asset" },

  // Classe 6 — Comptes de charges
  { code: "601", name: "Achats de matières premières", type: "expense" },
  { code: "602", name: "Achats d'autres approvisionnements", type: "expense" },
  { code: "607", name: "Achats de marchandises", type: "expense" },
  { code: "613", name: "Locations", type: "expense" },
  { code: "6132", name: "Locations immobilières", type: "expense", parent_code: "613" },
  { code: "616", name: "Primes d'assurances", type: "expense" },
  { code: "622", name: "Rémunérations d'intermédiaires et honoraires", type: "expense" },
  { code: "623", name: "Publicité, publications, relations publiques", type: "expense" },
  { code: "625", name: "Déplacements, missions et réceptions", type: "expense" },
  { code: "626", name: "Frais postaux et de télécommunications", type: "expense" },
  { code: "627", name: "Services bancaires et assimilés", type: "expense" },
  { code: "628", name: "Divers", type: "expense" },
  { code: "631", name: "Impôts, taxes et versements assimilés — sur rémunérations", type: "expense" },
  { code: "635", name: "Autres impôts, taxes et versements assimilés", type: "expense" },
  { code: "640", name: "Charges de personnel", type: "expense" },
  { code: "641", name: "Rémunérations du personnel", type: "expense", parent_code: "640" },
  { code: "645", name: "Charges de sécurité sociale et de prévoyance", type: "expense", parent_code: "640" },
  { code: "648", name: "Autres charges de personnel", type: "expense", parent_code: "640" },
  { code: "661", name: "Charges d'intérêts", type: "expense" },
  { code: "671", name: "Charges exceptionnelles sur opérations de gestion", type: "expense" },
  { code: "681", name: "Dotations aux amortissements", type: "expense" },
  { code: "687", name: "Dotations aux amortissements — charges exceptionnelles", type: "expense" },

  // Classe 7 — Comptes de produits
  { code: "701", name: "Ventes de produits finis", type: "revenue" },
  { code: "706", name: "Prestations de services", type: "revenue" },
  { code: "707", name: "Ventes de marchandises", type: "revenue" },
  { code: "708", name: "Produits des activités annexes", type: "revenue" },
  { code: "740", name: "Subventions d'exploitation", type: "revenue" },
  { code: "756", name: "Cotisations", type: "revenue" },
  { code: "758", name: "Produits divers de gestion courante", type: "revenue" },
  { code: "761", name: "Produits de participations", type: "revenue" },
  { code: "771", name: "Produits exceptionnels sur opérations de gestion", type: "revenue" },
  { code: "781", name: "Reprises sur amortissements", type: "revenue" },
];

export async function seedFrenchPCG(company_id: string): Promise<number> {
  let inserted = 0;

  for (const account of PCG_ACCOUNTS) {
    await prisma.account.upsert({
      where: { code_company_id: { code: account.code, company_id } },
      create: {
        code: account.code,
        name: account.name,
        type: account.type,
        company_id,
        parent_code: account.parent_code,
        is_active: true,
      },
      update: {
        name: account.name,
        type: account.type,
        parent_code: account.parent_code,
      },
    });
    inserted++;
  }

  return inserted;
}

/**
 * POST /api/accounts/seed
 * Seeds the French Plan Comptable Général for the current company.
 * Idempotent — safe to run multiple times.
 */
export const POST = withAuth(async (_req, { user }) => {
  try {
    const count = await seedFrenchPCG(user.company_id);
    return successJson({ inserted: count }, `${count} comptes PCG initialisés`);
  } catch (err) {
    return handlePrismaError(err);
  }
});
