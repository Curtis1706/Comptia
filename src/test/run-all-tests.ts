import { testPayrollEngine } from "./unit/payroll.test";
import { testVatAndAccountingEngine } from "./unit/vat.test";
import { testMecefEngine } from "./unit/mecef.test";
import { testSectorModules } from "./unit/sector-modules.test";
import { testFiscalAlerts } from "./unit/fiscal-alerts.test";
import { testAuthConfiguration } from "./unit/auth.test";
import { testDsfEngine } from "./unit/dsf.test";
import { testPermissionsMatrix } from "./unit/permissions.test";

async function runTestSuite() {
  console.log("================================================================");
  console.log("🚀 COMPTIA — SUITE DE TESTS UNITAIRES & CONFORMITÉ BÉNIN / OHADA");
  console.log("================================================================");

  let passed = 0;
  let failed = 0;

  const runTest = async (name: string, fn: () => any) => {
    try {
      await fn();
      passed++;
    } catch (err: any) {
      console.error(`\n❌ ÉCHEC DU TEST : ${name}`);
      console.error(err.message || err);
      failed++;
    }
  };

  await runTest("Authentification NextAuth v5 & Validations", testAuthConfiguration);
  await runTest("Matrice de Permissions & Rôles RBAC", testPermissionsMatrix);
  await runTest("Moteur de Paie & Barème IPTS Bénin", testPayrollEngine);
  await runTest("TVA Bénin 18% & Écritures SYSCOHADA", testVatAndAccountingEngine);
  await runTest("Intégration API e-MECeF DGI Bénin", testMecefEngine);
  await runTest("Modules Conditionnels par Secteur", testSectorModules);
  await runTest("Calendrier & Alertes Fiscales DGI", testFiscalAlerts);
  await runTest("États Financiers DSF SYSCOHADA & TAFIRE", testDsfEngine);
  await runTest("Vérification des 8 Bugs Corrigés (B1-B8)", async () => {
    await import("./test-bug-fixes");
  });

  console.log("\n================================================================");
  if (failed === 0) {
    console.log(`🎉 RÉSULTAT : ${passed}/${passed} MODULES TESTÉS ET VALIDÉS AVEC SUCCÈS ! (100%)`);
    console.log("================================================================\n");
  } else {
    console.error(`💥 RÉSULTAT : ${failed} tests ont échoué sur ${passed + failed}.`);
    console.log("================================================================\n");
    process.exit(1);
  }
}

runTestSuite();
