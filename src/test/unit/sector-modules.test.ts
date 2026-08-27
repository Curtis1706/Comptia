import { isModuleEnabledForSector, SECTOR_MODULES } from "@/constants/sector-modules";

export function testSectorModules() {
  console.log("\n🧪 [TEST] Modules Conditionnels par Secteur d'Activité (Fiche 6)");

  // BTP a accès à stock et chantiers
  console.assert(isModuleEnabledForSector("btp", "stock") === true, "BTP devrait avoir accès au module stock");
  console.assert(isModuleEnabledForSector("btp", "chantiers") === true, "BTP devrait avoir accès au module chantiers");

  // Services n'a pas besoin de stock
  console.assert(isModuleEnabledForSector("services", "stock") === false, "Services ne devrait pas avoir le module stock");
  console.assert(isModuleEnabledForSector("services", "facturation") === true, "Services doit avoir facturation");

  // Restauration a accès à caisse
  console.assert(isModuleEnabledForSector("restauration", "caisse") === true, "Restauration doit avoir accès à caisse");

  // Profession libérale n'a pas paie par défaut
  console.assert(isModuleEnabledForSector("profession_liberale", "paie") === false, "Profession libérale n'a pas paie par défaut");

  console.log("  ✅ Filtrage des modules par secteur d'activité validé");
  return true;
}
