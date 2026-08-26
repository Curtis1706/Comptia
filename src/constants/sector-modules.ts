/**
 * Configuration des modules conditionnels par secteur d'activité — République du Bénin.
 */

export type SectorKey =
  | "commerce_general"
  | "services"
  | "btp"
  | "restauration"
  | "transport"
  | "sante"
  | "education"
  | "agriculture"
  | "industrie"
  | "profession_liberale"
  | "tech"
  | "autre";

export interface SectorDefinition {
  key: SectorKey;
  label: string;
  description: string;
  iconName: string;
  allowedModules: string[];
}

export const SECTOR_MODULES: Record<SectorKey, string[]> = {
  commerce_general: [
    "dashboard",
    "facturation",
    "comptabilite",
    "stock",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "parametres",
  ],
  services: [
    "dashboard",
    "facturation",
    "comptabilite",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "parametres",
  ],
  btp: [
    "dashboard",
    "facturation",
    "comptabilite",
    "stock",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "chantiers",
    "parametres",
  ],
  restauration: [
    "dashboard",
    "facturation",
    "comptabilite",
    "stock",
    "caisse",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "parametres",
  ],
  transport: [
    "dashboard",
    "facturation",
    "comptabilite",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "parametres",
  ],
  sante: [
    "dashboard",
    "facturation",
    "comptabilite",
    "stock",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "parametres",
  ],
  education: [
    "dashboard",
    "facturation",
    "comptabilite",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "parametres",
  ],
  agriculture: [
    "dashboard",
    "facturation",
    "comptabilite",
    "stock",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "parametres",
  ],
  industrie: [
    "dashboard",
    "facturation",
    "comptabilite",
    "stock",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "parametres",
  ],
  profession_liberale: [
    "dashboard",
    "facturation",
    "comptabilite",
    "tiers",
    "tva",
    "documents",
    "reporting",
    "parametres",
  ],
  tech: [
    "dashboard",
    "facturation",
    "comptabilite",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "parametres",
  ],
  autre: [
    "dashboard",
    "facturation",
    "comptabilite",
    "stock",
    "tiers",
    "tva",
    "paie",
    "documents",
    "reporting",
    "parametres",
  ],
};

export const SECTORS_LIST: SectorDefinition[] = [
  {
    key: "commerce_general",
    label: "Commerce Général & Distribution",
    description: "Négoce, grossistes, boutiques, import/export avec gestion de stocks.",
    iconName: "Store",
    allowedModules: SECTOR_MODULES.commerce_general,
  },
  {
    key: "services",
    label: "Prestations de Services & Consulting",
    description: "Agences, consultants, prestataires intellectuels, SSII.",
    iconName: "Briefcase",
    allowedModules: SECTOR_MODULES.services,
  },
  {
    key: "btp",
    label: "BTP & Construction",
    description: "Bâtiment, travaux publics, chantiers, génie civil.",
    iconName: "HardHat",
    allowedModules: SECTOR_MODULES.btp,
  },
  {
    key: "restauration",
    label: "Restauration & Hôtellerie",
    description: "Restaurants, maquis, bars, hôtels, traiteurs.",
    iconName: "Utensils",
    allowedModules: SECTOR_MODULES.restauration,
  },
  {
    key: "transport",
    label: "Transport & Logistique",
    description: "Flottes de camions, transporteurs, fret, livraison.",
    iconName: "Truck",
    allowedModules: SECTOR_MODULES.transport,
  },
  {
    key: "sante",
    label: "Santé & Pharmacie",
    description: "Cliniques, cabinets médicaux, officines de pharmacie.",
    iconName: "HeartPulse",
    allowedModules: SECTOR_MODULES.sante,
  },
  {
    key: "education",
    label: "Éducation & Formation",
    description: "Écoles privées, universités, centres de formation professionnelle.",
    iconName: "GraduationCap",
    allowedModules: SECTOR_MODULES.education,
  },
  {
    key: "agriculture",
    label: "Agriculture & Agro-industrie",
    description: "Exploitations agricoles, transformation vivrière, élevage.",
    iconName: "Tractor",
    allowedModules: SECTOR_MODULES.agriculture,
  },
  {
    key: "industrie",
    label: "Industrie & Production",
    description: "Usines de fabrication, ateliers de confection, transformation.",
    iconName: "Factory",
    allowedModules: SECTOR_MODULES.industrie,
  },
  {
    key: "profession_liberale",
    label: "Professions Libérales",
    description: "Avocats, notaires, huissiers, architectes, experts-comptables.",
    iconName: "Scale",
    allowedModules: SECTOR_MODULES.profession_liberale,
  },
  {
    key: "tech",
    label: "Technologies & Digital",
    description: "Startups, développement web/mobile, fintech, télécoms.",
    iconName: "Laptop",
    allowedModules: SECTOR_MODULES.tech,
  },
  {
    key: "autre",
    label: "Autre Secteur",
    description: "Autres activités économiques et associations.",
    iconName: "Building2",
    allowedModules: SECTOR_MODULES.autre,
  },
];

/**
 * Vérifie si un module doit être affiché pour le secteur d'activité donné
 */
export function isModuleEnabledForSector(
  sector: SectorKey | string | null | undefined,
  moduleKey: string
): boolean {
  if (!sector) return true; // Si non défini, on affiche par défaut
  const key = sector as SectorKey;
  const allowed = SECTOR_MODULES[key];
  if (!allowed) return true;
  return allowed.includes(moduleKey);
}
