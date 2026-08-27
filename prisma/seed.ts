import { PrismaClient, AccountType } from "@prisma/client";

export interface SyscohadaAccountDefinition {
  code: string;
  name: string;
  type: AccountType;
  parent_code?: string;
}

export const SYSCOHADA_PLAN: SyscohadaAccountDefinition[] = [
  // ==========================================================================
  // CLASSE 1 : COMPTES DE RESSOURCES DURABLES (Capitaux propres et Dettes financières)
  // ==========================================================================
  { code: "10", name: "Capital", type: "equity" },
  { code: "101", name: "Capital social", type: "equity", parent_code: "10" },
  { code: "102", name: "Capital par dotation", type: "equity", parent_code: "10" },
  { code: "103", name: "Capital personnel", type: "equity", parent_code: "10" },
  { code: "104", name: "Compte de l'exploitant", type: "equity", parent_code: "10" },
  { code: "11", name: "Réserves", type: "equity" },
  { code: "111", name: "Réserve légale", type: "equity", parent_code: "11" },
  { code: "112", name: "Réserves statutaires ou contractuelles", type: "equity", parent_code: "11" },
  { code: "113", name: "Réserves réglementées", type: "equity", parent_code: "11" },
  { code: "118", name: "Autres réserves", type: "equity", parent_code: "11" },
  { code: "12", name: "Report à nouveau", type: "equity" },
  { code: "121", name: "Report à nouveau créditeur (solde créditeur)", type: "equity", parent_code: "12" },
  { code: "129", name: "Report à nouveau débiteur (solde débiteur)", type: "equity", parent_code: "12" },
  { code: "13", name: "Résultat net de l'exercice", type: "equity" },
  { code: "131", name: "Résultat net : Bénéfice", type: "equity", parent_code: "13" },
  { code: "139", name: "Résultat net : Perte", type: "equity", parent_code: "13" },
  { code: "14", name: "Subventions d'investissement", type: "equity" },
  { code: "16", name: "Emprunts et dettes assimilées", type: "liability" },
  { code: "161", name: "Emprunts obligataires", type: "liability", parent_code: "16" },
  { code: "162", name: "Emprunts et dettes auprès des établissements de crédit", type: "liability", parent_code: "16" },
  { code: "166", name: "Intérêts courus", type: "liability", parent_code: "16" },
  { code: "17", name: "Dettes de crédit-bail et contrats assimilés", type: "liability" },
  { code: "19", name: "Provisions financières pour risques et charges", type: "liability" },
  { code: "191", name: "Provisions pour litiges", type: "liability", parent_code: "19" },
  { code: "192", name: "Provisions pour garanties données aux clients", type: "liability", parent_code: "19" },

  // ==========================================================================
  // CLASSE 2 : COMPTES D'ACTIF IMMOBILISÉ
  // ==========================================================================
  { code: "20", name: "Charges immobilisées", type: "asset" },
  { code: "201", name: "Frais d'établissement", type: "asset", parent_code: "20" },
  { code: "202", name: "Charges à répartir sur plusieurs exercices", type: "asset", parent_code: "20" },
  { code: "21", name: "Immobilisations incorporelles", type: "asset" },
  { code: "211", name: "Frais de développement", type: "asset", parent_code: "21" },
  { code: "212", name: "Brevets, licences, concessions et droits similaires", type: "asset", parent_code: "21" },
  { code: "213", name: "Logiciels et sites internet", type: "asset", parent_code: "21" },
  { code: "214", name: "Marques", type: "asset", parent_code: "21" },
  { code: "215", name: "Fonds commercial", type: "asset", parent_code: "21" },
  { code: "22", name: "Terrains", type: "asset" },
  { code: "221", name: "Terrains agricoles et forestiers", type: "asset", parent_code: "22" },
  { code: "222", name: "Terrains nus", type: "asset", parent_code: "22" },
  { code: "223", name: "Terrains bâtis", type: "asset", parent_code: "22" },
  { code: "23", name: "Bâtiments, installations techniques et agencements", type: "asset" },
  { code: "231", name: "Bâtiments industriels, commerciaux et administratifs", type: "asset", parent_code: "23" },
  { code: "232", name: "Installations techniques et agencements", type: "asset", parent_code: "23" },
  { code: "24", name: "Matériel, mobilier et actifs biologiques", type: "asset" },
  { code: "241", name: "Matériel et outillage industriel et commercial", type: "asset", parent_code: "24" },
  { code: "242", name: "Matériel et outillage agricole", type: "asset", parent_code: "24" },
  { code: "244", name: "Matériel de transport", type: "asset", parent_code: "24" },
  { code: "245", name: "Matériel de bureau et matériel informatique", type: "asset", parent_code: "24" },
  { code: "246", name: "Mobilier de bureau", type: "asset", parent_code: "24" },
  { code: "25", name: "Avances et acomptes versés sur immobilisations", type: "asset" },
  { code: "27", name: "Autres immobilisations financières", type: "asset" },
  { code: "271", name: "Prêts et créances non commerciales", type: "asset", parent_code: "27" },
  { code: "275", name: "Dépôts et cautionnements versés", type: "asset", parent_code: "27" },
  { code: "28", name: "Amortissements", type: "asset" },
  { code: "281", name: "Amortissements des immobilisations incorporelles", type: "asset", parent_code: "28" },
  { code: "283", name: "Amortissements des bâtiments et installations", type: "asset", parent_code: "28" },
  { code: "284", name: "Amortissements du matériel et mobilier", type: "asset", parent_code: "28" },
  { code: "29", name: "Provisions pour dépréciation des immobilisations", type: "asset" },

  // ==========================================================================
  // CLASSE 3 : COMPTES DE STOCKS
  // ==========================================================================
  { code: "31", name: "Marchandises", type: "asset" },
  { code: "311", name: "Marchandises A", type: "asset", parent_code: "31" },
  { code: "312", name: "Marchandises B", type: "asset", parent_code: "31" },
  { code: "32", name: "Matières premières et fournitures liées", type: "asset" },
  { code: "33", name: "Autres approvisionnements", type: "asset" },
  { code: "335", name: "Fournitures de bureau et consommables", type: "asset", parent_code: "33" },
  { code: "34", name: "Produits en cours", type: "asset" },
  { code: "35", name: "Services en cours", type: "asset" },
  { code: "36", name: "Produits finis", type: "asset" },
  { code: "37", name: "Produits intermédiaires et résiduels", type: "asset" },
  { code: "38", name: "Stocks en cours de route et en dépôt", type: "asset" },
  { code: "39", name: "Dépréciations des stocks", type: "asset" },

  // ==========================================================================
  // CLASSE 4 : COMPTES DE TIERS
  // ==========================================================================
  { code: "40", name: "Fournisseurs et comptes rattachés", type: "liability" },
  { code: "401", name: "Fournisseurs, dettes en compte", type: "liability", parent_code: "40" },
  { code: "402", name: "Fournisseurs, effets à payer", type: "liability", parent_code: "40" },
  { code: "408", name: "Fournisseurs, factures non parvenues", type: "liability", parent_code: "40" },
  { code: "409", name: "Fournisseurs débiteurs (avances et acomptes)", type: "asset", parent_code: "40" },

  { code: "41", name: "Clients et comptes rattachés", type: "asset" },
  { code: "411", name: "Clients", type: "asset", parent_code: "41" },
  { code: "412", name: "Clients, effets à recevoir", type: "asset", parent_code: "41" },
  { code: "416", name: "Créances clients litigieuses ou douteuses", type: "asset", parent_code: "41" },
  { code: "418", name: "Clients, factures à établir", type: "asset", parent_code: "41" },
  { code: "419", name: "Clients créditeurs (avances reçues)", type: "liability", parent_code: "41" },

  { code: "42", name: "Personnel", type: "liability" },
  { code: "421", name: "Personnel, rémunérations dues", type: "liability", parent_code: "42" },
  { code: "422", name: "Comités d'entreprise et œuvres sociales", type: "liability", parent_code: "42" },
  { code: "425", name: "Personnel, avances et acomptes accordés", type: "asset", parent_code: "42" },
  { code: "428", name: "Personnel, charges à payer et congés payés", type: "liability", parent_code: "42" },

  { code: "43", name: "Organismes sociaux", type: "liability" },
  { code: "431", name: "Sécurité sociale (CNSS Bénin)", type: "liability", parent_code: "43" },
  { code: "432", name: "Caisses de retraite complémentaire", type: "liability", parent_code: "43" },
  { code: "438", name: "Organismes sociaux, charges à payer", type: "liability", parent_code: "43" },

  { code: "44", name: "État et collectivités publiques", type: "liability" },
  { code: "441", name: "État, impôt sur les bénéfices (IS/IBA)", type: "liability", parent_code: "44" },
  { code: "442", name: "État, impôts et taxes recouvrables sur des tiers", type: "liability", parent_code: "44" },
  { code: "443", name: "État, TVA facturée (collectée)", type: "liability", parent_code: "44" },
  { code: "4431", name: "TVA facturée sur ventes de biens", type: "liability", parent_code: "443" },
  { code: "4432", name: "TVA facturée sur prestations de services", type: "liability", parent_code: "443" },
  { code: "444", name: "État, TVA due ou crédit de TVA", type: "liability", parent_code: "44" },
  { code: "4441", name: "État, TVA due à reverser", type: "liability", parent_code: "444" },
  { code: "4449", name: "État, crédit de TVA à reporter", type: "asset", parent_code: "444" },
  { code: "445", name: "État, TVA récupérable (déductible)", type: "asset", parent_code: "44" },
  { code: "4451", name: "TVA récupérable sur immobilisations", type: "asset", parent_code: "445" },
  { code: "4452", name: "TVA récupérable sur achats de marchandises", type: "asset", parent_code: "445" },
  { code: "4453", name: "TVA récupérable sur transports", type: "asset", parent_code: "445" },
  { code: "4454", name: "TVA récupérable sur services extérieurs", type: "asset", parent_code: "445" },
  { code: "446", name: "État, autres impôts et taxes", type: "liability", parent_code: "44" },
  { code: "447", name: "État, impôts retenus à la source (IPTS, AIR, RAS)", type: "liability", parent_code: "44" },
  { code: "4471", name: "AIR (Acompte sur Impôt assis sur les Revenus)", type: "liability", parent_code: "447" },
  { code: "4472", name: "RAS (Retenue À la Source sur prestataires)", type: "liability", parent_code: "447" },
  { code: "4473", name: "IPTS retenu sur salaires", type: "liability", parent_code: "447" },
  { code: "448", name: "État, charges à payer (VPS, Taxe d'apprentissage, etc.)", type: "liability", parent_code: "44" },

  { code: "47", name: "Débiteurs et créditeurs divers", type: "liability" },
  { code: "471", name: "Comptes d'attente à régulariser", type: "liability", parent_code: "47" },
  { code: "48", name: "Créances et dettes hors activités ordinaires (HAO)", type: "liability" },
  { code: "49", name: "Dépréciations des comptes de tiers", type: "asset" },
  { code: "491", name: "Dépréciations des comptes clients", type: "asset", parent_code: "49" },

  // ==========================================================================
  // CLASSE 5 : COMPTES DE TRÉSORERIE
  // ==========================================================================
  { code: "51", name: "Valeurs à encaisser", type: "asset" },
  { code: "511", name: "Effets à encaisser", type: "asset", parent_code: "51" },
  { code: "512", name: "Chèques à encaisser", type: "asset", parent_code: "51" },
  { code: "52", name: "Banques", type: "asset" },
  { code: "521", name: "Banques locales en monnaie nationale", type: "asset", parent_code: "52" },
  { code: "522", name: "Banques en devises", type: "asset", parent_code: "52" },
  { code: "53", name: "Établissements financiers et assimilés", type: "asset" },
  { code: "531", name: "Chèques postaux", type: "asset", parent_code: "53" },
  { code: "54", name: "Caisses", type: "asset" },
  { code: "541", name: "Caisse siège / Principale", type: "asset", parent_code: "54" },
  { code: "542", name: "Caisse succursale / secondaire", type: "asset", parent_code: "54" },
  { code: "55", name: "Régies d'avances et accréditifs", type: "asset" },
  { code: "56", name: "Banques, crédits de trésorerie et découverts", type: "liability" },
  { code: "58", name: "Virements internes", type: "asset" },
  { code: "581", name: "Virements de fonds", type: "asset", parent_code: "58" },
  { code: "585", name: "Mobile Money / Transferts électroniques (MTN MoMo, Moov Money, Celtiis)", type: "asset", parent_code: "58" },
  { code: "59", name: "Dépréciations des comptes de trésorerie", type: "asset" },

  // ==========================================================================
  // CLASSE 6 : COMPTES DE CHARGES DES ACTIVITÉS ORDINAIRES
  // ==========================================================================
  { code: "60", name: "Achats et variations de stocks", type: "expense" },
  { code: "601", name: "Achats de marchandises", type: "expense", parent_code: "60" },
  { code: "602", name: "Achats de matières premières et fournitures", type: "expense", parent_code: "60" },
  { code: "603", name: "Variations des stocks de biens achetés", type: "expense", parent_code: "60" },
  { code: "6031", name: "Variation des stocks de marchandises", type: "expense", parent_code: "603" },
  { code: "6032", name: "Variation des stocks de matières premières", type: "expense", parent_code: "603" },
  { code: "604", name: "Achats stockés de matières et fournitures consommables", type: "expense", parent_code: "60" },
  { code: "605", name: "Autres achats (fournitures non stockables, eau, électricité, carburant)", type: "expense", parent_code: "60" },
  { code: "608", name: "Achats d'emballages", type: "expense", parent_code: "60" },

  { code: "61", name: "Transports", type: "expense" },
  { code: "611", name: "Transports sur achats", type: "expense", parent_code: "61" },
  { code: "612", name: "Transports sur ventes", type: "expense", parent_code: "61" },
  { code: "613", name: "Transports pour le compte de tiers", type: "expense", parent_code: "61" },
  { code: "618", name: "Autres frais de transport", type: "expense", parent_code: "61" },

  { code: "62", name: "Services extérieurs A", type: "expense" },
  { code: "621", name: "Sous-traitance générale", type: "expense", parent_code: "62" },
  { code: "622", name: "Locations et charges locatives", type: "expense", parent_code: "62" },
  { code: "623", name: "Redevances de crédit-bail et contrats assimilés", type: "expense", parent_code: "62" },
  { code: "624", name: "Entretien, réparations et maintenance", type: "expense", parent_code: "62" },
  { code: "625", name: "Primes d'assurance", type: "expense", parent_code: "62" },
  { code: "626", name: "Études, recherches et documentation", type: "expense", parent_code: "62" },
  { code: "628", name: "Divers services extérieurs", type: "expense", parent_code: "62" },

  { code: "63", name: "Services extérieurs B", type: "expense" },
  { code: "631", name: "Frais bancaires et commissions", type: "expense", parent_code: "63" },
  { code: "632", name: "Rémunérations d'intermédiaires et honoraires (experts, avocats)", type: "expense", parent_code: "63" },
  { code: "633", name: "Frais de formation du personnel", type: "expense", parent_code: "63" },
  { code: "634", name: "Publicité, publications et relations publiques", type: "expense", parent_code: "63" },
  { code: "635", name: "Frais de télécommunications et internet", type: "expense", parent_code: "63" },
  { code: "636", name: "Frais de transport du personnel", type: "expense", parent_code: "63" },
  { code: "637", name: "Déplacements, missions et réceptions", type: "expense", parent_code: "63" },
  { code: "638", name: "Autres charges externes", type: "expense", parent_code: "63" },

  { code: "64", name: "Impôts et taxes", type: "expense" },
  { code: "641", name: "Impôts et taxes directs (Patente, taxes foncières)", type: "expense", parent_code: "64" },
  { code: "645", name: "Impôts et taxes indirects", type: "expense", parent_code: "64" },
  { code: "646", name: "Droits d'enregistrement et de timbre", type: "expense", parent_code: "64" },
  { code: "647", name: "Pénalités et amendes fiscales", type: "expense", parent_code: "64" },
  { code: "648", name: "Autres impôts et taxes", type: "expense", parent_code: "64" },

  { code: "65", name: "Autres charges", type: "expense" },
  { code: "651", name: "Pertes sur créances clients irrécouvrables", type: "expense", parent_code: "65" },
  { code: "658", name: "Charges diverses d'exploitation", type: "expense", parent_code: "65" },

  { code: "66", name: "Charges de personnel", type: "expense" },
  { code: "661", name: "Rémunérations directes versées au personnel national", type: "expense", parent_code: "66" },
  { code: "662", name: "Rémunérations directes versées au personnel non national", type: "expense", parent_code: "66" },
  { code: "663", name: "Indemnités forfaitaires versées au personnel", type: "expense", parent_code: "66" },
  { code: "664", name: "Charges sociales patronales (CNSS part patronale 15.4%, VPS 4%)", type: "expense", parent_code: "66" },
  { code: "666", name: "Rémunérations et charges sociales de l'exploitant", type: "expense", parent_code: "66" },
  { code: "667", name: "Rémunérations transférées de personnel extérieur", type: "expense", parent_code: "66" },
  { code: "668", name: "Autres charges sociales", type: "expense", parent_code: "66" },

  { code: "67", name: "Frais financiers et charges assimilées", type: "expense" },
  { code: "671", name: "Intérêts des emprunts et dettes financières", type: "expense", parent_code: "67" },
  { code: "672", name: "Intérêts dans loyers de crédit-bail", type: "expense", parent_code: "67" },
  { code: "676", name: "Pertes de change", type: "expense", parent_code: "67" },
  { code: "678", name: "Autres charges financières", type: "expense", parent_code: "67" },

  { code: "68", name: "Dotations aux amortissements et provisions d'exploitation", type: "expense" },
  { code: "681", name: "Dotations aux amortissements d'exploitation", type: "expense", parent_code: "68" },
  { code: "687", name: "Dotations aux provisions financières", type: "expense", parent_code: "68" },
  { code: "69", name: "Dotations aux provisions et dépréciations (HAO)", type: "expense" },

  // ==========================================================================
  // CLASSE 7 : COMPTES DE PRODUITS DES ACTIVITÉS ORDINAIRES
  // ==========================================================================
  { code: "70", name: "Ventes", type: "revenue" },
  { code: "701", name: "Ventes de marchandises", type: "revenue", parent_code: "70" },
  { code: "702", name: "Ventes de produits finis", type: "revenue", parent_code: "70" },
  { code: "704", name: "Travaux facturés", type: "revenue", parent_code: "70" },
  { code: "705", name: "Études facturées", type: "revenue", parent_code: "70" },
  { code: "706", name: "Services vendus (Prestations de services)", type: "revenue", parent_code: "70" },
  { code: "707", name: "Produits accessoires (ports facturés, commissions)", type: "revenue", parent_code: "70" },

  { code: "71", name: "Subventions d'exploitation", type: "revenue" },
  { code: "72", name: "Production immobilisée", type: "revenue" },
  { code: "73", name: "Variations de stocks de biens et services produits", type: "revenue" },
  { code: "75", name: "Autres produits", type: "revenue" },
  { code: "758", name: "Produits divers d'exploitation", type: "revenue", parent_code: "75" },

  { code: "76", name: "Produits financiers", type: "revenue" },
  { code: "77", name: "Revenus financiers et produits assimilés", type: "revenue" },
  { code: "771", name: "Intérêts de prêts et créances diverses", type: "revenue", parent_code: "77" },
  { code: "776", name: "Gains de change", type: "revenue", parent_code: "77" },

  { code: "78", name: "Reprises d'amortissements, provisions et dépréciations", type: "revenue" },
  { code: "781", name: "Reprises d'amortissements et provisions d'exploitation", type: "revenue", parent_code: "78" },
  { code: "79", name: "Reprises de provisions et dépréciations (HAO)", type: "revenue" },

  // ==========================================================================
  // CLASSE 8 : COMPTES DES AUTRES CHARGES ET AUTRES PRODUITS (HAO)
  // ==========================================================================
  { code: "81", name: "Valeurs comptables des cessions d'immobilisations", type: "expense" },
  { code: "82", name: "Produits des cessions d'immobilisations", type: "revenue" },
  { code: "83", name: "Charges HAO (Hors Activités Ordinaires)", type: "expense" },
  { code: "831", name: "Charges HAO constatées (dons, pénalités extraordinaires)", type: "expense", parent_code: "83" },
  { code: "84", name: "Produits HAO", type: "revenue" },
  { code: "841", name: "Produits HAO constatés", type: "revenue", parent_code: "84" },
  { code: "85", name: "Dotations HAO", type: "expense" },
  { code: "86", name: "Reprises HAO", type: "revenue" },
  { code: "87", name: "Participations des travailleurs", type: "expense" },
  { code: "88", name: "Subventions d'équilibre", type: "revenue" },
  { code: "89", name: "Impôts sur le résultat (IS / AIB / TPS)", type: "expense" },
  { code: "891", name: "Impôt sur les sociétés (IS) / Bénéfices industriels et commerciaux", type: "expense", parent_code: "89" },
  { code: "892", name: "Taxe Professionnelle Synthétique (TPS)", type: "expense", parent_code: "89" },
];

/**
 * Seeds SYSCOHADA revised chart of accounts for a specific company.
 * Can be called within a Prisma interactive transaction (tx) or with standard prisma client.
 */
export async function seedAccountsForCompany(
  prismaClient: any,
  companyId: string
): Promise<{ count: number }> {
  if (!companyId) {
    throw new Error("Company ID is required to seed SYSCOHADA accounts.");
  }

  // Un compte cité comme parent_code par un autre compte est un compte
  // de regroupement : il ne peut pas recevoir d'écriture directe.
  const parentCodes = new Set(
    SYSCOHADA_PLAN.map((a) => a.parent_code).filter((c): c is string => Boolean(c))
  );

  const accountRows = SYSCOHADA_PLAN.map((acc) => ({
    code: acc.code,
    name: acc.name,
    type: acc.type,
    company_id: companyId,
    parent_code: acc.parent_code ?? null,
    is_active: true,
    is_postable: !parentCodes.has(acc.code),
  }));

  // Batch insert accounts for this tenant
  const result = await prismaClient.account.createMany({
    data: accountRows,
    skipDuplicates: true,
  });

  return result;
}

/**
 * CLI execution entrypoint:
 * Seeds all companies that currently have 0 accounts or runs on sample companies.
 */
async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("🌱 Début du seed du plan comptable SYSCOHADA révisé Bénin...");
    const companies = await prisma.company.findMany({
      select: { id: true, name: true },
    });

    console.log(`Entreprises trouvées : ${companies.length}`);

    for (const company of companies) {
      const existingCount = await prisma.account.count({
        where: { company_id: company.id },
      });

      if (existingCount === 0) {
        const seeded = await seedAccountsForCompany(prisma, company.id);
        console.log(`✅ Plan SYSCOHADA injecté pour "${company.name}" (${seeded.count} comptes).`);
      } else {
        console.log(`ℹ️ "${company.name}" possède déjà ${existingCount} comptes. Seed ignoré.`);
      }
    }

    console.log("✨ Seed SYSCOHADA terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur pendant le seed SYSCOHADA :", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.includes("seed")) {
  main();
}
