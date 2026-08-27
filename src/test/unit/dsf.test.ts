import { generateTAFIRE } from "@/lib/dsf";

export function testDsfEngine() {
  console.log("\n🧪 [TEST] Moteur DSF SYSCOHADA (Bilan, SIG & TAFIRE)");

  const mockBilan: any = {
    actif: {
      actifImmobilise: { brut: 10_000_000, amortissements: 2_000_000, net: 8_000_000, details: [] },
      actifCirculant: { brut: 5_000_000, depreciations: 500_000, net: 4_500_000, details: [] },
      tresorerieActif: { montant: 3_000_000, details: [] },
      totalActif: 15_500_000,
    },
    passif: {
      capitauxPropres: { montant: 10_000_000, details: [] },
      dettesFinancieres: { montant: 2_000_000, details: [] },
      passifCirculant: { montant: 3_500_000, details: [] },
      tresoreriePassif: { montant: 0, details: [] },
      totalPassif: 15_500_000,
    },
    equilibre: {
      estEquilibre: true,
      difference: 0,
      resultatNetExercice: 1_500_000,
    },
  };

  const mockCompteResultat: any = {
    chiffreAffaires: 20_000_000,
    margeBrute: 8_000_000,
    valeurAjoutee: 5_000_000,
    ebe: 3_000_000,
    resultatExploitation: 2_000_000,
    resultatFinancier: -200_000,
    rao: 1_800_000,
    resultatHAO: 0,
    impotsEtParticipations: 300_000,
    resultatNet: 1_500_000,
    sigDetails: [],
  };

  const tafire = generateTAFIRE(mockBilan, mockCompteResultat);

  // CAF = Résultat Net (1 500 000) + Amortissements (2 000 000) = 3 500 000
  console.assert(tafire.caf === 3_500_000, `CAF attendue 3 500 000, reçue ${tafire.caf}`);

  // Variation BFR = Actif circulant net (4 500 000) - Passif circulant (3 500 000) = 1 000 000
  console.assert(tafire.variationBFR === 1_000_000, `BFR attendu 1 000 000, reçu ${tafire.variationBFR}`);

  // Flux exploitation = CAF - variation BFR = 2 500 000
  console.assert(tafire.fluxTresorerieExploitation === 2_500_000, `Flux exploitation attendu 2 500 000, reçu ${tafire.fluxTresorerieExploitation}`);

  console.log("  ✅ Calculs TAFIRE (Capacité d'Autofinancement, BFR, Flux trésorerie exploitation) validés");
  return true;
}
