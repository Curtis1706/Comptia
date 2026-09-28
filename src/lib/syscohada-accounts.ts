/**
 * Référentiel des comptes de charges (Classe 6) du Plan Comptable Général SYSCOHADA Révisé.
 * Utilisé pour la conformité comptable au Bénin et dans l'espace OHADA.
 */

export interface SyscohadaExpenseAccount {
  code: string;
  name: string;
  category: string;
  description: string;
}

export const SYSCOHADA_EXPENSE_ACCOUNTS: SyscohadaExpenseAccount[] = [
  // 60 - Achats et variations de stocks
  {
    code: "601",
    name: "Achats de marchandises",
    category: "60 - Achats",
    description: "Biens achetés pour être revendus en l'état sans transformation.",
  },
  {
    code: "602",
    name: "Achats de matières premières et fournitures liées",
    category: "60 - Achats",
    description: "Biens destinés à entrer dans la composition des produits fabriqués.",
  },
  {
    code: "604",
    name: "Achats stockés de matières et fournitures consommables",
    category: "60 - Achats",
    description: "Fournitures et matières consommables faisant l'objet d'un suivi de stock.",
  },
  {
    code: "605",
    name: "Autres achats (énergie, eau, carburant, consommables)",
    category: "60 - Achats",
    description: "Électricité (SBEE), eau (SONEB), carburant, fournitures de bureau non stockées.",
  },
  {
    code: "608",
    name: "Achats d'emballages",
    category: "60 - Achats",
    description: "Emballages commerciaux perdus ou récupérables.",
  },

  // 61 - Transports
  {
    code: "611",
    name: "Transports sur achats",
    category: "61 - Transports",
    description: "Frais de transport, fret et acheminement sur achats de biens.",
  },
  {
    code: "612",
    name: "Transports sur ventes",
    category: "61 - Transports",
    description: "Frais de livraison et expédition aux clients.",
  },
  {
    code: "618",
    name: "Autres frais de transport",
    category: "61 - Transports",
    description: "Transports divers et logistique d'exploitation.",
  },

  // 62 - Services extérieurs A
  {
    code: "621",
    name: "Sous-traitance générale",
    category: "62 - Services extérieurs A",
    description: "Travaux confiés à des tiers faisant partie du cycle d'exploitation.",
  },
  {
    code: "622",
    name: "Locations et charges locatives",
    category: "62 - Services extérieurs A",
    description: "Loyers immobiliers, baux commerciaux, location de matériel et véhicules.",
  },
  {
    code: "623",
    name: "Redevances de crédit-bail et contrats assimilés",
    category: "62 - Services extérieurs A",
    description: "Loyers de leasing et crédit-bail mobilier ou immobilier.",
  },
  {
    code: "624",
    name: "Entretien, réparations et maintenance",
    category: "62 - Services extérieurs A",
    description: "Réparation de véhicules, maintenance de matériel, nettoyage, gardiennage.",
  },
  {
    code: "625",
    name: "Primes d'assurance",
    category: "62 - Services extérieurs A",
    description: "Assurances multirisques, véhicules, responsabilité civile, santé.",
  },
  {
    code: "626",
    name: "Études, recherches et documentation",
    category: "62 - Services extérieurs A",
    description: "Abonnements documentaires, revues techniques, études de marché.",
  },
  {
    code: "628",
    name: "Divers services extérieurs (logiciels, licences, SaaS, redevances)",
    category: "62 - Services extérieurs A",
    description: "Prestations logicielles, hébergement cloud, abonnements SaaS, redevances brevets et licences.",
  },

  // 63 - Services extérieurs B
  {
    code: "631",
    name: "Frais bancaires et commissions",
    category: "63 - Services extérieurs B",
    description: "Frais de tenue de compte, commissions de virement, frais terminaux.",
  },
  {
    code: "632",
    name: "Rémunérations d'intermédiaires et honoraires",
    category: "63 - Services extérieurs B",
    description: "Honoraires d'experts-comptables, avocats, notaires, consultants, commissaires aux comptes.",
  },
  {
    code: "633",
    name: "Frais de formation du personnel",
    category: "63 - Services extérieurs B",
    description: "Séminaires, formations professionnelles, ateliers et cours pour les équipes.",
  },
  {
    code: "634",
    name: "Publicité, publications et relations publiques",
    category: "63 - Services extérieurs B",
    description: "Annonces publicitaires, réseaux sociaux, flyers, sponsoring, cadeaux d'affaires.",
  },
  {
    code: "635",
    name: "Frais de télécommunications et internet",
    category: "63 - Services extérieurs B",
    description: "Abonnements internet (fibre, ADSL), téléphonie mobile (MTN, Moov, Celtiis), frais MoMo.",
  },
  {
    code: "636",
    name: "Frais de transport du personnel",
    category: "63 - Services extérieurs B",
    description: "Indemnités de transport, navettes, cartes d'abonnement déplacement du personnel.",
  },
  {
    code: "637",
    name: "Déplacements, missions et réceptions",
    category: "63 - Services extérieurs B",
    description: "Billets d'avion, nuits d'hôtel, repas de mission, réceptions et invitations professionnelles.",
  },
  {
    code: "638",
    name: "Autres charges externes",
    category: "63 - Services extérieurs B",
    description: "Cotisations professionnelles, frais de recrutement, charges externes diverses.",
  },

  // 64 - Impôts et taxes
  {
    code: "641",
    name: "Impôts et taxes directs",
    category: "64 - Impôts et taxes",
    description: "Patente, taxe foncière, taxe sur les véhicules de société.",
  },
  {
    code: "646",
    name: "Droits d'enregistrement et de timbre",
    category: "64 - Impôts et taxes",
    description: "Timbres fiscaux, droits de mutation et d'enregistrement des actes.",
  },

  // 65 - Autres charges
  {
    code: "658",
    name: "Charges diverses d'exploitation",
    category: "65 - Autres charges",
    description: "Indemnités diverses, pénalités contractuelles et charges d'exploitation résiduelles.",
  },
];

/**
 * Détecte et suggère le compte de charge SYSCOHADA le plus pertinent
 * à partir du texte extrait d'un justificatif ou d'une facture.
 */
export function inferSyscohadaExpenseAccount(
  text: string,
  vendorName?: string
): { code: string; name: string } {
  const content = `${vendorName || ""} ${text || ""}`.toLowerCase();

  // 1. Logiciels, Informatique, SaaS, Licences, Redevances -> 628
  if (
    content.includes("logiciel") ||
    content.includes("prestation logicielle") ||
    content.includes("software") ||
    content.includes("informatique") ||
    content.includes("licence") ||
    content.includes("license") ||
    content.includes("saas") ||
    content.includes("cloud") ||
    content.includes("hosting") ||
    content.includes("hébergement") ||
    content.includes("redevance") ||
    content.includes("bouquet") ||
    content.includes("droits d'auteur") ||
    content.includes("api") ||
    content.includes("application web") ||
    content.includes("antivirus") ||
    content.includes("microsoft") ||
    content.includes("google workspace") ||
    content.includes("aws") ||
    content.includes("cloudflare")
  ) {
    return {
      code: "628",
      name: "628 - Divers services extérieurs (logiciels, licences, SaaS, redevances)",
    };
  }

  // 2. Télécommunications & Internet -> 635
  if (
    content.includes("télécom") ||
    content.includes("telecom") ||
    content.includes("internet") ||
    content.includes("fibre") ||
    content.includes("adsl") ||
    content.includes("mtn") ||
    content.includes("moov") ||
    content.includes("celtiis") ||
    content.includes("téléphone") ||
    content.includes("telephone") ||
    content.includes("communication") ||
    content.includes("forfait mobile") ||
    content.includes("recharge téléphonique")
  ) {
    return {
      code: "635",
      name: "635 - Frais de télécommunications et internet",
    };
  }

  // 3. Honoraires, Conseil, Avocats, Consultants, Notaires -> 632
  if (
    content.includes("honoraire") ||
    content.includes("consultant") ||
    content.includes("consulting") ||
    content.includes("expert-comptable") ||
    content.includes("avocat") ||
    content.includes("notaire") ||
    content.includes("conseil juridique") ||
    content.includes("commissaire") ||
    content.includes("prestation intellectuelle") ||
    content.includes("expertise") ||
    content.includes("audit")
  ) {
    return {
      code: "632",
      name: "632 - Rémunérations d'intermédiaires et honoraires",
    };
  }

  // 4. Carburant, Énergie, Eau, Fournitures consommables -> 605
  if (
    content.includes("carburant") ||
    content.includes("essence") ||
    content.includes("gasoil") ||
    content.includes("sbee") ||
    content.includes("soneb") ||
    content.includes("électricité") ||
    content.includes("electricite") ||
    content.includes("eau minérale") ||
    content.includes("fournitures de bureau") ||
    content.includes("papeterie") ||
    content.includes("ramette") ||
    content.includes("cartouche") ||
    content.includes("toner") ||
    content.includes("station service") ||
    content.includes("totalenergies") ||
    content.includes("oryx") ||
    content.includes("benin petro")
  ) {
    return {
      code: "605",
      name: "605 - Autres achats (énergie, eau, carburant, consommables)",
    };
  }

  // 5. Déplacements, Missions, Hôtels, Voyages -> 637
  if (
    content.includes("hôtel") ||
    content.includes("hotel") ||
    content.includes("hébergement") ||
    content.includes("billet d'avion") ||
    content.includes("vol") ||
    content.includes("aeroport") ||
    content.includes("air france") ||
    content.includes("corsair") ||
    content.includes("asky") ||
    content.includes("taxi") ||
    content.includes("voyage") ||
    content.includes("mission") ||
    content.includes("repas d'affaires") ||
    content.includes("restaurant")
  ) {
    return {
      code: "637",
      name: "637 - Déplacements, missions et réceptions",
    };
  }

  // 6. Entretien, Maintenance, Nettoyage, Réparations -> 624
  if (
    content.includes("entretien") ||
    content.includes("réparation") ||
    content.includes("reparation") ||
    content.includes("maintenance") ||
    content.includes("vidange") ||
    content.includes("gardiennage") ||
    content.includes("nettoyage") ||
    content.includes("sécurité") ||
    content.includes("securite") ||
    content.includes("plomberie") ||
    content.includes("climatisation")
  ) {
    return {
      code: "624",
      name: "624 - Entretien, réparations et maintenance",
    };
  }

  // 7. Locations & Baux -> 622
  if (
    content.includes("loyer") ||
    content.includes("bail") ||
    content.includes("location immobilière") ||
    content.includes("location de salle") ||
    content.includes("charges locatives")
  ) {
    return {
      code: "622",
      name: "622 - Locations et charges locatives",
    };
  }

  // 8. Assurances -> 625
  if (
    content.includes("assurance") ||
    content.includes("prime d'assurance") ||
    content.includes("police d'assurance") ||
    content.includes("mutuelle") ||
    content.includes("nsia") ||
    content.includes("sunu") ||
    content.includes("sanlam")
  ) {
    return {
      code: "625",
      name: "625 - Primes d'assurance",
    };
  }

  // 9. Publicité & Marketing -> 634
  if (
    content.includes("publicité") ||
    content.includes("publicite") ||
    content.includes("marketing") ||
    content.includes("flyer") ||
    content.includes("affiche") ||
    content.includes("bannière") ||
    content.includes("sponsoring") ||
    content.includes("relations publiques")
  ) {
    return {
      code: "634",
      name: "634 - Publicité, publications et relations publiques",
    };
  }

  // 10. Frais bancaires -> 631
  if (
    content.includes("frais bancaire") ||
    content.includes("agios") ||
    content.includes("commission bancaire") ||
    content.includes("tenue de compte") ||
    content.includes("ecobank") ||
    content.includes("boa") ||
    content.includes("biic") ||
    content.includes("uba")
  ) {
    return {
      code: "631",
      name: "631 - Frais bancaires et commissions",
    };
  }

  // 11. Marchandises pour revente -> 601
  if (
    content.includes("marchandise") ||
    content.includes("revente") ||
    content.includes("commerce général")
  ) {
    return {
      code: "601",
      name: "601 - Achats de marchandises",
    };
  }

  // Par défaut : 605 (Fournitures et consommables divers)
  return {
    code: "605",
    name: "605 - Autres achats (énergie, eau, carburant, consommables)",
  };
}
