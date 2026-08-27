/**
 * Moteur de génération des États Financiers et DSF (Déclaration Statistique et Fiscale)
 * Système Comptable OHADA (SYSCOHADA révisé) — République du Bénin.
 */

export interface BilanLineDetail {
  code: string;
  name: string;
  brut?: number;
  amortissement?: number;
  net: number;
}

export interface BilanSYSCOHADA {
  actif: {
    actifImmobilise: { brut: number; amortissements: number; net: number; details: BilanLineDetail[] };
    actifCirculant: { brut: number; depreciations: number; net: number; details: BilanLineDetail[] };
    tresorerieActif: { montant: number; details: BilanLineDetail[] };
    totalActif: number;
  };
  passif: {
    capitauxPropres: { montant: number; details: BilanLineDetail[] };
    dettesFinancieres: { montant: number; details: BilanLineDetail[] };
    passifCirculant: { montant: number; details: BilanLineDetail[] };
    tresoreriePassif: { montant: number; details: BilanLineDetail[] };
    totalPassif: number;
  };
  equilibre: {
    estEquilibre: boolean;
    difference: number;
    resultatNetExercice: number;
  };
}

export interface SigLine {
  code: string;
  label: string;
  montant: number;
  isTotal?: boolean;
  isSubtotal?: boolean;
}

export interface CompteResultatSYSCOHADA {
  chiffreAffaires: number;
  margeBrute: number;
  valeurAjoutee: number;
  ebe: number; // Excédent Brut d'Exploitation
  resultatExploitation: number;
  resultatFinancier: number;
  rao: number; // Résultat des Activités Ordinaires
  resultatHAO: number; // Hors Activités Ordinaires
  impotsEtParticipations: number;
  resultatNet: number;
  sigDetails: SigLine[];
}

export interface TafireSYSCOHADA {
  caf: number; // Capacité d'autofinancement
  variationBFR: number;
  fluxTresorerieExploitation: number;
  investissements: number;
  financements: number;
  variationTresorerieNette: number;
}

export interface DsfReport {
  fiscalYear: number;
  companyId: string;
  periodStart: Date;
  periodEnd: Date;
  bilan: BilanSYSCOHADA;
  compteResultat: CompteResultatSYSCOHADA;
  tafire: TafireSYSCOHADA;
}

/**
 * Calcule les soldes de tous les comptes pour une entreprise sur une période
 */
async function getAccountBalancesMap(
  prisma: any,
  companyId: string,
  endDate: Date,
  startDate?: Date
): Promise<Map<string, { debit: number; credit: number; soldeDebit: number; soldeCredit: number; name: string }>> {
  const whereClause: any = {
    entry: {
      company_id: companyId,
      status: { in: ["posted", "validated"] }, // Les brouillons ne sont pas comptabilisés
      date: { lte: endDate },
    },
  };

  if (startDate) {
    whereClause.entry.date.gte = startDate;
  }

  const lines = await prisma.journalLine.findMany({
    where: whereClause,
    select: {
      account_code: true,
      debit: true,
      credit: true,
    },
  });

  const accounts = await prisma.account.findMany({
    where: { company_id: companyId },
    select: { code: true, name: true, type: true },
  });

  const namesMap = new Map<string, string>(accounts.map((a: any) => [a.code, a.name]));

  const balances = new Map<string, { debit: number; credit: number; soldeDebit: number; soldeCredit: number; name: string }>();

  for (const line of lines) {
    const code = line.account_code;
    const debit = Number(line.debit || 0);
    const credit = Number(line.credit || 0);

    const curr = balances.get(code) || {
      debit: 0,
      credit: 0,
      soldeDebit: 0,
      soldeCredit: 0,
      name: namesMap.get(code) || `Compte ${code}`,
    };

    curr.debit += debit;
    curr.credit += credit;
    curr.soldeDebit = Math.max(0, curr.debit - curr.credit);
    curr.soldeCredit = Math.max(0, curr.credit - curr.debit);

    balances.set(code, curr);
  }

  return balances;
}

/**
 * Génère le Bilan SYSCOHADA révisé (Actif & Passif équilibrés)
 */
export async function generateBilan(
  prisma: any,
  companyId: string,
  fiscalYearEnd: Date
): Promise<BilanSYSCOHADA> {
  const balances = await getAccountBalancesMap(prisma, companyId, fiscalYearEnd);

  // Initial balance treasury report from company
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { initial_treasury_balance: true },
  });
  const initialTreasury = Number(company?.initial_treasury_balance || 0);

  const actifImmoDetails: BilanLineDetail[] = [];
  const actifCircDetails: BilanLineDetail[] = [];
  const tresoActifDetails: BilanLineDetail[] = [];

  const capitauxPropresDetails: BilanLineDetail[] = [];
  const dettesFinancieresDetails: BilanLineDetail[] = [];
  const passifCircDetails: BilanLineDetail[] = [];
  const tresoPassifDetails: BilanLineDetail[] = [];

  let brutImmo = 0;
  let amortImmo = 0;
  let brutCirc = 0;
  let deprCirc = 0;
  let montantTresoActif = initialTreasury;

  let totalCapitaux = 0;
  let totalDettesFin = 0;
  let totalPassifCirc = 0;
  let totalTresoPassif = 0;

  // Calcul du résultat de l'exercice (Comptes 7 et 8 produits vs 6 et 8 charges)
  let totalProduits = 0;
  let totalCharges = 0;

  balances.forEach((bal, code) => {
    // Compte de résultat (Classes 6, 7, 8)
    if (code.startsWith("6")) {
      totalCharges += bal.soldeDebit > 0 ? bal.soldeDebit : (bal.debit - bal.credit);
    } else if (code.startsWith("7")) {
      totalProduits += bal.soldeCredit > 0 ? bal.soldeCredit : (bal.credit - bal.debit);
    } else if (code.startsWith("8")) {
      if (code.startsWith("81") || code.startsWith("83") || code.startsWith("85") || code.startsWith("87") || code.startsWith("89")) {
        totalCharges += bal.soldeDebit > 0 ? bal.soldeDebit : (bal.debit - bal.credit);
      } else {
        totalProduits += bal.soldeCredit > 0 ? bal.soldeCredit : (bal.credit - bal.debit);
      }
    }

    // ACTIF IMMOBILISÉ (Comptes 20 à 29)
    else if (code.startsWith("2")) {
      if (code.startsWith("28") || code.startsWith("29")) {
        const amt = bal.soldeCredit > 0 ? bal.soldeCredit : bal.credit;
        amortImmo += amt;
        actifImmoDetails.push({ code, name: bal.name, net: -amt, amortissement: amt });
      } else {
        const amt = bal.soldeDebit > 0 ? bal.soldeDebit : bal.debit;
        brutImmo += amt;
        actifImmoDetails.push({ code, name: bal.name, brut: amt, net: amt });
      }
    }

    // ACTIF CIRCULANT (Stocks 30-39, Clients 41, Autres créances 42-48 débiteurs)
    else if (code.startsWith("3")) {
      if (code.startsWith("39")) {
        const amt = bal.soldeCredit > 0 ? bal.soldeCredit : bal.credit;
        deprCirc += amt;
        actifCircDetails.push({ code, name: bal.name, net: -amt });
      } else {
        const amt = bal.soldeDebit > 0 ? bal.soldeDebit : bal.debit;
        brutCirc += amt;
        actifCircDetails.push({ code, name: bal.name, brut: amt, net: amt });
      }
    } else if (code.startsWith("41") || (code.startsWith("4") && !code.startsWith("40") && !code.startsWith("43") && !code.startsWith("44") && bal.soldeDebit > 0)) {
      if (code.startsWith("49")) {
        const amt = bal.soldeCredit > 0 ? bal.soldeCredit : bal.credit;
        deprCirc += amt;
        actifCircDetails.push({ code, name: bal.name, net: -amt });
      } else {
        const amt = bal.soldeDebit > 0 ? bal.soldeDebit : bal.debit;
        brutCirc += amt;
        actifCircDetails.push({ code, name: bal.name, brut: amt, net: amt });
      }
    }

    // TRÉSORERIE-ACTIF (51, 52, 53, 54, 55, 57, 58)
    else if (code.startsWith("5") && !code.startsWith("56")) {
      const net = bal.debit - bal.credit;
      if (net >= 0) {
        montantTresoActif += net;
        tresoActifDetails.push({ code, name: bal.name, net });
      } else {
        totalTresoPassif += Math.abs(net);
        tresoPassifDetails.push({ code, name: bal.name, net: Math.abs(net) });
      }
    }

    // CAPITAUX PROPRES (10, 11, 12, 13, 14, 15)
    else if (code.startsWith("10") || code.startsWith("11") || code.startsWith("12") || code.startsWith("13") || code.startsWith("14") || code.startsWith("15")) {
      const net = bal.soldeCredit > 0 ? bal.soldeCredit : (bal.credit - bal.debit);
      totalCapitaux += net;
      capitauxPropresDetails.push({ code, name: bal.name, net });
    }

    // DETTES FINANCIÈRES (16, 17, 18, 19)
    else if (code.startsWith("16") || code.startsWith("17") || code.startsWith("18") || code.startsWith("19")) {
      const net = bal.soldeCredit > 0 ? bal.soldeCredit : (bal.credit - bal.debit);
      totalDettesFin += net;
      dettesFinancieresDetails.push({ code, name: bal.name, net });
    }

    // PASSIF CIRCULANT (Fournisseurs 40, Dettes fiscales et sociales 42, 43, 44, autres dettes 47-48)
    else if (code.startsWith("40") || code.startsWith("42") || code.startsWith("43") || code.startsWith("44") || (code.startsWith("4") && bal.soldeCredit > 0)) {
      const net = bal.soldeCredit > 0 ? bal.soldeCredit : (bal.credit - bal.debit);
      totalPassifCirc += net;
      passifCircDetails.push({ code, name: bal.name, net });
    }

    // TRÉSORERIE-PASSIF (56 Crédits de trésorerie / découverts)
    else if (code.startsWith("56")) {
      const net = bal.soldeCredit > 0 ? bal.soldeCredit : (bal.credit - bal.debit);
      totalTresoPassif += net;
      tresoPassifDetails.push({ code, name: bal.name, net });
    }
  });

  const resultatNetExercice = Math.round((totalProduits - totalCharges) * 100) / 100;

  // Intégration du résultat net de l'exercice dans les capitaux propres
  if (resultatNetExercice !== 0) {
    capitauxPropresDetails.push({
      code: "13",
      name: `Résultat net de l'exercice (${resultatNetExercice >= 0 ? "Bénéfice" : "Perte"})`,
      net: resultatNetExercice,
    });
    totalCapitaux += resultatNetExercice;
  }

  if (initialTreasury !== 0) {
    tresoActifDetails.unshift({
      code: "521/INIT",
      name: "Report de trésorerie initial",
      net: initialTreasury,
    });
  }

  const netActifImmo = Math.max(0, brutImmo - amortImmo);
  const netActifCirc = Math.max(0, brutCirc - deprCirc);
  const totalActif = Math.round((netActifImmo + netActifCirc + montantTresoActif) * 100) / 100;
  const totalPassif = Math.round((totalCapitaux + totalDettesFin + totalPassifCirc + totalTresoPassif) * 100) / 100;

  const diff = Math.round((totalActif - totalPassif) * 100) / 100;

  return {
    actif: {
      actifImmobilise: { brut: brutImmo, amortissements: amortImmo, net: netActifImmo, details: actifImmoDetails },
      actifCirculant: { brut: brutCirc, depreciations: deprCirc, net: netActifCirc, details: actifCircDetails },
      tresorerieActif: { montant: montantTresoActif, details: tresoActifDetails },
      totalActif,
    },
    passif: {
      capitauxPropres: { montant: totalCapitaux, details: capitauxPropresDetails },
      dettesFinancieres: { montant: totalDettesFin, details: dettesFinancieresDetails },
      passifCirculant: { montant: totalPassifCirc, details: passifCircDetails },
      tresoreriePassif: { montant: totalTresoPassif, details: tresoPassifDetails },
      totalPassif,
    },
    equilibre: {
      estEquilibre: Math.abs(diff) < 0.05,
      difference: diff,
      resultatNetExercice,
    },
  };
}

/**
 * Génère le Compte de Résultat SYSCOHADA avec les Soldes Intermédiaires de Gestion (SIG)
 */
export async function generateCompteResultat(
  prisma: any,
  companyId: string,
  startDate: Date,
  endDate: Date
): Promise<CompteResultatSYSCOHADA> {
  const balances = await getAccountBalancesMap(prisma, companyId, endDate, startDate);

  const getAmount = (prefix: string, isCredit = true): number => {
    let sum = 0;
    balances.forEach((bal, code) => {
      if (code.startsWith(prefix)) {
        sum += isCredit ? (bal.credit - bal.debit) : (bal.debit - bal.credit);
      }
    });
    return Math.max(0, sum);
  };

  // 1. Chiffre d'Affaires
  const ventesMarchandises = getAmount("701", true);
  const productionVendue = getAmount("702", true) + getAmount("703", true) + getAmount("704", true) + getAmount("705", true) + getAmount("706", true);
  const produitsAccessoires = getAmount("707", true);
  const chiffreAffaires = ventesMarchandises + productionVendue + produitsAccessoires;

  // 2. Marge Brute sur Marchandises
  const achatsMarchandises = getAmount("601", false);
  const varStocksMarchandises = getAmount("6031", false);
  const margeBrute = ventesMarchandises - (achatsMarchandises + varStocksMarchandises);

  // 3. Valeur Ajoutée (VA)
  const matPremieres = getAmount("602", false) + getAmount("604", false) + getAmount("605", false) + getAmount("608", false);
  const varStocksMatPrem = getAmount("6032", false);
  const transports = getAmount("61", false);
  const servicesExterieurs = getAmount("62", false) + getAmount("63", false);
  const consommationsIntermediaires = matPremieres + varStocksMatPrem + transports + servicesExterieurs;
  const valeurAjoutee = margeBrute + productionVendue + produitsAccessoires - consommationsIntermediaires;

  // 4. Excédent Brut d'Exploitation (EBE)
  const subventionsExploit = getAmount("71", true);
  const impotsTaxes = getAmount("64", false);
  const chargesPersonnel = getAmount("66", false);
  const ebe = valeurAjoutee + subventionsExploit - (impotsTaxes + chargesPersonnel);

  // 5. Résultat d'Exploitation
  const autresProduits = getAmount("75", true);
  const reprisesExploitation = getAmount("781", true) + getAmount("78", true);
  const dotationsExploitation = getAmount("681", false) + getAmount("68", false);
  const autresCharges = getAmount("65", false);
  const resultatExploitation = ebe + autresProduits + reprisesExploitation - (dotationsExploitation + autresCharges);

  // 6. Résultat Financier
  const produitsFinanciers = getAmount("76", true) + getAmount("77", true);
  const chargesFinancieres = getAmount("67", false) + getAmount("687", false);
  const resultatFinancier = produitsFinanciers - chargesFinancieres;

  // 7. Résultat des Activités Ordinaires (RAO)
  const rao = resultatExploitation + resultatFinancier;

  // 8. Hors Activités Ordinaires (HAO)
  const produitsHAO = getAmount("82", true) + getAmount("84", true) + getAmount("86", true) + getAmount("88", true);
  const chargesHAO = getAmount("81", false) + getAmount("83", false) + getAmount("85", false);
  const resultatHAO = produitsHAO - chargesHAO;

  // 9. Impôts sur le résultat & Participation
  const participationTravailleurs = getAmount("87", false);
  const impotsSurResultat = getAmount("89", false);
  const impotsEtParticipations = participationTravailleurs + impotsSurResultat;

  // 10. Résultat Net
  const resultatNet = Math.round((rao + resultatHAO - impotsEtParticipations) * 100) / 100;

  const sigDetails: SigLine[] = [
    { code: "701", label: "+ Ventes de marchandises", montant: ventesMarchandises },
    { code: "702-706", label: "+ Production vendue (biens & services)", montant: productionVendue },
    { code: "707", label: "+ Produits accessoires", montant: produitsAccessoires },
    { code: "CA", label: "= CHIFFRE D'AFFAIRES", montant: chiffreAffaires, isTotal: true },

    { code: "601", label: "- Achats de marchandises", montant: -achatsMarchandises },
    { code: "6031", label: "- Variation de stocks de marchandises", montant: -varStocksMarchandises },
    { code: "MB", label: "= MARGE BRUTE SUR MARCHANDISES", montant: margeBrute, isSubtotal: true },

    { code: "602-608", label: "- Matières premières & consommables", montant: -matPremieres },
    { code: "61", label: "- Transports", montant: -transports },
    { code: "62-63", label: "- Services extérieurs (loyers, honoraires, pub)", montant: -servicesExterieurs },
    { code: "VA", label: "= VALEUR AJOUTÉE (VA)", montant: valeurAjoutee, isTotal: true },

    { code: "71", label: "+ Subventions d'exploitation", montant: subventionsExploit },
    { code: "64", label: "- Impôts et taxes (Patente, taxes locales)", montant: -impotsTaxes },
    { code: "66", label: "- Charges de personnel (Salaires, CNSS, VPS)", montant: -chargesPersonnel },
    { code: "EBE", label: "= EXCÉDENT BRUT D'EXPLOITATION (EBE)", montant: ebe, isTotal: true },

    { code: "75+78", label: "+ Autres produits & Reprises d'exploitation", montant: autresProduits + reprisesExploitation },
    { code: "65+68", label: "- Dotations aux amortissements & Autres charges", montant: -(dotationsExploitation + autresCharges) },
    { code: "REX", label: "= RÉSULTAT D'EXPLOITATION", montant: resultatExploitation, isTotal: true },

    { code: "76+77", label: "+ Produits financiers & Gains de change", montant: produitsFinanciers },
    { code: "67", label: "- Frais financiers & Pertes de change", montant: -chargesFinancieres },
    { code: "RFI", label: "= RÉSULTAT FINANCIER", montant: resultatFinancier, isSubtotal: true },

    { code: "RAO", label: "= RÉSULTAT DES ACTIVITÉS ORDINAIRES (RAO)", montant: rao, isTotal: true },

    { code: "82-88", label: "+ Produits Hors Activités Ordinaires (HAO)", montant: produitsHAO },
    { code: "81-85", label: "- Charges Hors Activités Ordinaires (HAO)", montant: -chargesHAO },
    { code: "RHAO", label: "= RÉSULTAT HAO", montant: resultatHAO, isSubtotal: true },

    { code: "87+89", label: "- Impôts sur résultat (IS / TPS) & Participations", montant: -impotsEtParticipations },
    { code: "RNET", label: "= RÉSULTAT NET DE L'EXERCICE", montant: resultatNet, isTotal: true },
  ];

  return {
    chiffreAffaires,
    margeBrute,
    valeurAjoutee,
    ebe,
    resultatExploitation,
    resultatFinancier,
    rao,
    resultatHAO,
    impotsEtParticipations,
    resultatNet,
    sigDetails,
  };
}

/**
 * Génère le Tableau Financier des Ressources et Emplois (TAFIRE)
 */
export function generateTAFIRE(
  bilan: BilanSYSCOHADA,
  compteResultat: CompteResultatSYSCOHADA
): TafireSYSCOHADA {
  // Capacité d'Autofinancement (CAF) = EBE + Produits encaissables - Charges décaissables
  const caf = Math.max(0, compteResultat.resultatNet + bilan.actif.actifImmobilise.amortissements);
  const variationBFR = Math.round(bilan.actif.actifCirculant.net - bilan.passif.passifCirculant.montant);
  const fluxExploitation = caf - variationBFR;
  const investissements = bilan.actif.actifImmobilise.brut;
  const financements = bilan.passif.capitauxPropres.montant + bilan.passif.dettesFinancieres.montant;
  const variationTresorerieNette = bilan.actif.tresorerieActif.montant - bilan.passif.tresoreriePassif.montant;

  return {
    caf,
    variationBFR,
    fluxTresorerieExploitation: fluxExploitation,
    investissements,
    financements,
    variationTresorerieNette,
  };
}

/**
 * Génère le rapport DSF complet pour un exercice donné
 */
export async function generateFullDsfReport(
  prisma: any,
  companyId: string,
  fiscalYear: number
): Promise<DsfReport> {
  const periodStart = new Date(fiscalYear, 0, 1);
  const periodEnd = new Date(fiscalYear, 11, 31, 23, 59, 59);

  const bilan = await generateBilan(prisma, companyId, periodEnd);
  const compteResultat = await generateCompteResultat(prisma, companyId, periodStart, periodEnd);
  const tafire = generateTAFIRE(bilan, compteResultat);

  return {
    fiscalYear,
    companyId,
    periodStart,
    periodEnd,
    bilan,
    compteResultat,
    tafire,
  };
}
