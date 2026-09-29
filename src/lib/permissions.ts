export type UserRole = "owner" | "admin" | "accountant" | "cashier" | "hr" | "expert" | "viewer";

export type Permission = "none" | "read" | "write" | "validate" | "full";

export const MODULES = [
  "dashboard",
  "invoices",
  "quotes",
  "credit_notes",
  "accounting_entries",
  "accounting_journals",
  "chart_of_accounts",
  "third_parties",
  "bank_reconciliation",
  "vat_declarations",
  "payroll",
  "employees",
  "documents",
  "reporting",
  "dsf",
  "audit_log",
  "notifications",
  "company_settings",
  "mecef_settings",
  "user_management",
  "subscription_billing",
  "cabinet_management",
] as const;

export type Module = (typeof MODULES)[number];

export const LEVEL_ORDER: Record<Permission, number> = {
  none: 0,
  read: 1,
  write: 2,
  validate: 3,
  full: 4,
};

export type PermissionMatrix = Record<UserRole, Record<Module, Permission>>;

export const DEFAULT_PERMISSIONS: PermissionMatrix = {
  owner: {
    dashboard: "full",
    invoices: "full",
    quotes: "full",
    credit_notes: "full",
    accounting_entries: "full",
    accounting_journals: "full",
    chart_of_accounts: "full",
    third_parties: "full",
    bank_reconciliation: "full",
    vat_declarations: "full",
    payroll: "full",
    employees: "full",
    documents: "full",
    reporting: "full",
    dsf: "full",
    audit_log: "full",
    notifications: "full",
    company_settings: "full",
    mecef_settings: "full",
    user_management: "full",
    subscription_billing: "full",
    cabinet_management: "none",
  },
  admin: {
    dashboard: "full",
    invoices: "full",
    quotes: "full",
    credit_notes: "full",
    accounting_entries: "full",
    accounting_journals: "full",
    chart_of_accounts: "full",
    third_parties: "full",
    bank_reconciliation: "full",
    vat_declarations: "full",
    payroll: "full",
    employees: "full",
    documents: "full",
    reporting: "full",
    dsf: "full",
    audit_log: "full",
    notifications: "full",
    company_settings: "full",
    mecef_settings: "full",
    user_management: "full",
    subscription_billing: "none",
    cabinet_management: "none",
  },
  accountant: {
    dashboard: "read",
    invoices: "full",
    quotes: "full",
    credit_notes: "full",
    accounting_entries: "full",
    accounting_journals: "full",
    chart_of_accounts: "write",
    third_parties: "full",
    bank_reconciliation: "full",
    vat_declarations: "full",
    payroll: "none",
    employees: "none",
    documents: "full",
    reporting: "full",
    dsf: "write",
    audit_log: "none",
    notifications: "full",
    company_settings: "none",
    mecef_settings: "read",
    user_management: "none",
    subscription_billing: "none",
    cabinet_management: "none",
  },
  cashier: {
    dashboard: "read",
    invoices: "write",
    quotes: "write",
    credit_notes: "write",
    accounting_entries: "none",
    accounting_journals: "none",
    chart_of_accounts: "none",
    third_parties: "write",
    bank_reconciliation: "none",
    vat_declarations: "none",
    payroll: "none",
    employees: "none",
    documents: "write",
    reporting: "none",
    dsf: "none",
    audit_log: "none",
    notifications: "full",
    company_settings: "none",
    mecef_settings: "none",
    user_management: "none",
    subscription_billing: "none",
    cabinet_management: "none",
  },
  hr: {
    dashboard: "read",
    invoices: "none",
    quotes: "none",
    credit_notes: "none",
    accounting_entries: "none",
    accounting_journals: "none",
    chart_of_accounts: "none",
    third_parties: "none",
    bank_reconciliation: "none",
    vat_declarations: "none",
    payroll: "full",
    employees: "full",
    documents: "write",
    reporting: "none",
    dsf: "none",
    audit_log: "none",
    notifications: "full",
    company_settings: "none",
    mecef_settings: "none",
    user_management: "none",
    subscription_billing: "none",
    cabinet_management: "none",
  },
  expert: {
    dashboard: "read",
    invoices: "read",
    quotes: "read",
    credit_notes: "read",
    accounting_entries: "validate",
    accounting_journals: "read",
    chart_of_accounts: "read",
    third_parties: "read",
    bank_reconciliation: "read",
    vat_declarations: "validate",
    payroll: "read",
    employees: "none",
    documents: "read",
    reporting: "full",
    dsf: "validate",
    audit_log: "read",
    notifications: "full",
    company_settings: "none",
    mecef_settings: "read",
    user_management: "none",
    subscription_billing: "none",
    cabinet_management: "full",
  },
  viewer: {
    dashboard: "read",
    invoices: "read",
    quotes: "read",
    credit_notes: "read",
    accounting_entries: "read",
    accounting_journals: "read",
    chart_of_accounts: "read",
    third_parties: "read",
    bank_reconciliation: "read",
    vat_declarations: "read",
    payroll: "read",
    employees: "read",
    documents: "read",
    reporting: "read",
    dsf: "read",
    audit_log: "read",
    notifications: "full",
    company_settings: "read",
    mecef_settings: "read",
    user_management: "none",
    subscription_billing: "none",
    cabinet_management: "none",
  },
};

export const MODULE_LABELS: Record<Module, string> = {
  dashboard: "Tableau de bord",
  invoices: "Factures",
  quotes: "Devis",
  credit_notes: "Avoirs",
  accounting_entries: "Écritures et lettrage",
  accounting_journals: "Journaux",
  chart_of_accounts: "Plan comptable",
  third_parties: "Clients et fournisseurs",
  bank_reconciliation: "Rapprochement bancaire",
  vat_declarations: "Déclarations de TVA",
  payroll: "Bulletins et journal de paie",
  employees: "Dossiers du personnel",
  documents: "Documents et pièces",
  reporting: "États et rapports",
  dsf: "Liasse fiscale DSF",
  audit_log: "Journal d'audit",
  notifications: "Notifications",
  company_settings: "Paramètres de l'entreprise",
  mecef_settings: "Certification e-MECeF",
  user_management: "Utilisateurs et rôles",
  subscription_billing: "Abonnement Comptia",
  cabinet_management: "Espace cabinet",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Propriétaire",
  admin: "Administrateur",
  accountant: "Comptable",
  cashier: "Caissier / Commercial",
  hr: "Ressources humaines",
  expert: "Expert-comptable externe",
  viewer: "Observateur",
};

export const PERMISSION_LEVEL_LABELS: Record<Permission, string> = {
  none: "Aucun",
  read: "Lecture",
  write: "Écriture",
  validate: "Validation",
  full: "Total",
};

/**
 * Récupère le niveau de permission d'un rôle pour un module donné dans une matrice.
 */
export function getPermission(
  matrix: PermissionMatrix,
  role: UserRole,
  module: Module
): Permission {
  return matrix[role]?.[module] || "none";
}

/**
 * Vérifie si le niveau accordé (actual) est supérieur ou égal au niveau requis (required).
 */
export function meetsLevel(actual: Permission, required: Permission): boolean {
  return (LEVEL_ORDER[actual] ?? 0) >= (LEVEL_ORDER[required] ?? 0);
}

/**
 * Indique si l'utilisateur a au moins un accès en lecture sur le module.
 */
export function hasAccess(
  matrix: PermissionMatrix,
  role: UserRole,
  module: Module
): boolean {
  return getPermission(matrix, role, module) !== "none";
}

export function canRead(
  matrix: PermissionMatrix,
  role: UserRole,
  module: Module
): boolean {
  return meetsLevel(getPermission(matrix, role, module), "read");
}

export function canWrite(
  matrix: PermissionMatrix,
  role: UserRole,
  module: Module
): boolean {
  return meetsLevel(getPermission(matrix, role, module), "write");
}

export function canValidate(
  matrix: PermissionMatrix,
  role: UserRole,
  module: Module
): boolean {
  return meetsLevel(getPermission(matrix, role, module), "validate");
}

/**
 * Seul le niveau "full" autorise la suppression définitive.
 */
export function canDelete(
  matrix: PermissionMatrix,
  role: UserRole,
  module: Module
): boolean {
  return meetsLevel(getPermission(matrix, role, module), "full");
}

/**
 * Renvoie la liste des modules accessibles (permission !== "none") pour un rôle.
 */
export function getAccessibleModules(
  matrix: PermissionMatrix,
  role: UserRole
): Module[] {
  return MODULES.filter((mod) => hasAccess(matrix, role, mod));
}
