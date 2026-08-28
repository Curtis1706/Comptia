import {
  DEFAULT_PERMISSIONS,
  meetsLevel,
  canRead,
  canWrite,
  canValidate,
  canDelete,
  hasAccess,
  getAccessibleModules,
  MODULES,
} from "@/lib/permissions";
import {
  checkStructuralInvariants,
  checkInvariants,
} from "@/lib/permission-invariants";

export async function testPermissionsMatrix() {
  console.log("\n🧪 [TEST] Matrice de Permissions & Rôles RBAC (Fiche P1 & P2)");

  const matrix = DEFAULT_PERMISSIONS;

  // 1. owner a "full" sur tout sauf cabinet_management
  for (const mod of MODULES) {
    if (mod === "cabinet_management") {
      console.assert(matrix.owner[mod] === "none", "owner ne doit pas avoir cabinet_management");
    } else {
      console.assert(matrix.owner[mod] === "full", `owner doit avoir full sur ${mod}`);
    }
  }
  console.log("  ✅ Rôle owner : 'full' sur 21 modules et 'none' sur cabinet_management");

  // 2. subscription_billing est "none" pour tous sauf owner
  console.assert(matrix.owner.subscription_billing === "full", "owner doit avoir subscription_billing");
  console.assert(matrix.admin.subscription_billing === "none", "admin ne doit pas avoir subscription_billing");
  console.assert(matrix.accountant.subscription_billing === "none", "accountant ne doit pas avoir subscription_billing");
  console.assert(matrix.cashier.subscription_billing === "none", "cashier ne doit pas avoir subscription_billing");
  console.assert(matrix.hr.subscription_billing === "none", "hr ne doit pas avoir subscription_billing");
  console.assert(matrix.expert.subscription_billing === "none", "expert ne doit pas avoir subscription_billing");
  console.assert(matrix.viewer.subscription_billing === "none", "viewer ne doit pas avoir subscription_billing");
  console.log("  ✅ Invariant subscription_billing : réservé exclusivement à l'owner");

  // 3. user_management est "none" sauf owner et admin
  console.assert(matrix.owner.user_management === "full", "owner a user_management");
  console.assert(matrix.admin.user_management === "full", "admin a user_management");
  console.assert(matrix.accountant.user_management === "none", "accountant n'a pas user_management");
  console.assert(matrix.cashier.user_management === "none", "cashier n'a pas user_management");
  console.assert(matrix.hr.user_management === "none", "hr n'a pas user_management");
  console.assert(matrix.expert.user_management === "none", "expert n'a pas user_management");
  console.assert(matrix.viewer.user_management === "none", "viewer n'a pas user_management");
  console.log("  ✅ Invariant user_management : réservé à owner et admin");

  // 4. cashier n'a aucun accès à accounting_entries, payroll, vat_declarations
  console.assert(!hasAccess(matrix, "cashier", "accounting_entries"), "cashier sans accounting_entries");
  console.assert(!hasAccess(matrix, "cashier", "payroll"), "cashier sans payroll");
  console.assert(!hasAccess(matrix, "cashier", "vat_declarations"), "cashier sans vat_declarations");
  console.assert(canWrite(matrix, "cashier", "invoices"), "cashier peut écrire invoices");
  console.assert(!canDelete(matrix, "cashier", "invoices"), "cashier ne peut pas supprimer invoices");
  console.log("  ✅ Rôle cashier : Facturation en écriture, Comptabilité/Paie/TVA bloqués");

  // 5. hr n'a aucun accès à invoices, accounting_entries, bank_reconciliation
  console.assert(!hasAccess(matrix, "hr", "invoices"), "hr sans invoices");
  console.assert(!hasAccess(matrix, "hr", "accounting_entries"), "hr sans accounting_entries");
  console.assert(!hasAccess(matrix, "hr", "bank_reconciliation"), "hr sans bank_reconciliation");
  console.assert(canDelete(matrix, "hr", "payroll"), "hr a full sur payroll");
  console.assert(canDelete(matrix, "hr", "employees"), "hr a full sur employees");
  console.log("  ✅ Rôle hr : Paie & Employés en total, Facturation/Comptabilité bloqués");

  // 6. expert a "read" sur payroll et "none" sur employees (Arbitrage 1)
  console.assert(matrix.expert.payroll === "read", "expert a read sur payroll");
  console.assert(matrix.expert.employees === "none", "expert a none sur employees");
  console.assert(canValidate(matrix, "expert", "dsf"), "expert valide la DSF");
  console.assert(canValidate(matrix, "expert", "vat_declarations"), "expert valide la TVA");
  console.log("  ✅ Rôle expert : Arbitrage respecté (payroll: read, employees: none, dsf: validate)");

  // 7. viewer n'a jamais mieux que "read" sauf notifications
  for (const mod of MODULES) {
    const perm = matrix.viewer[mod];
    if (mod === "notifications") {
      console.assert(perm === "full", "viewer a full sur notifications");
    } else {
      console.assert(perm === "none" || perm === "read", `viewer ne doit pas dépasser read sur ${mod}`);
    }
  }
  console.log("  ✅ Rôle viewer : Consultation seule stricte (lecture seule ou none, notifications)");

  // 8. meetsLevel hiérarchie
  console.assert(meetsLevel("validate", "write") === true, "validate >= write");
  console.assert(meetsLevel("read", "write") === false, "read < write");
  console.assert(meetsLevel("full", "validate") === true, "full >= validate");
  console.assert(meetsLevel("none", "read") === false, "none < read");
  console.log("  ✅ Hiérarchie de niveaux meetsLevel (none < read < write < validate < full) validée");

  // 9. Séparation des Invariants Structurels (R1-R4) vs R5
  // R1: owner immutability
  const r1Check = checkStructuralInvariants("owner", "invoices", "read");
  console.assert(r1Check?.rule === "R1", "R1 doit bloquer modification owner");

  // R2: subscription_billing owner-only
  const r2Check = checkStructuralInvariants("admin", "subscription_billing", "read");
  console.assert(r2Check?.rule === "R2", "R2 doit bloquer subscription_billing pour admin");

  // R3: user_management owner/admin-only
  const r3Check = checkStructuralInvariants("accountant", "user_management", "read");
  console.assert(r3Check?.rule === "R3", "R3 doit bloquer user_management pour accountant");

  // R4: cabinet_management expert-only
  const r4CheckInvalid = checkStructuralInvariants("admin", "cabinet_management", "write");
  console.assert(r4CheckInvalid?.rule === "R4", "R4 doit bloquer cabinet_management pour admin");
  const r4CheckValid = checkStructuralInvariants("expert", "cabinet_management", "full");
  console.assert(r4CheckValid === null, "R4 doit autoriser cabinet_management pour expert");

  // R5: Actor privilege check
  const r5Violation = checkInvariants("cashier", "invoices", "full", {
    role: "cashier",
    effective: { ...matrix.cashier, invoices: "write" },
  });
  console.assert(r5Violation?.rule === "R5", "R5 doit bloquer attribution d'un droit supérieur au sien");
  console.log("  ✅ Invariants structurels (R1–R4) & Autorisation (R5) validés");

  return true;
}
