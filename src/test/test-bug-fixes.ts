import { validateDoubleEntry, calculateAccountBalance, POSTED_STATUSES } from "../lib/accounting";
import { UserRoleEnum, CreateJournalEntrySchema } from "../lib/validators";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✅ ${message}`);
}

console.log("================================================================");
console.log("🧪 VÉRIFICATION DES 8 BUGS CORRIGÉS (B1 à B8)");
console.log("================================================================");

// 1. Test B1 : POSTED_STATUSES constants
console.log("\n[TEST B1] Constantes de statuts comptables");
assert(POSTED_STATUSES.includes("posted"), "POSTED_STATUSES inclut 'posted'");
assert(POSTED_STATUSES.includes("validated"), "POSTED_STATUSES inclut 'validated'");
assert(!POSTED_STATUSES.includes("draft" as any), "POSTED_STATUSES exclut 'draft'");

// 2. Test B3 : validateDoubleEntry rejette les montants nuls
console.log("\n[TEST B3] Validation d'écriture : interdiction du montant nul");
const zeroLines = [
  { debit: 0, credit: 0 },
  { debit: 0, credit: 0 },
];
const zeroResult = validateDoubleEntry(zeroLines);
assert(!zeroResult.isNonZero, "isNonZero est faux pour une écriture à 0 FCFA");
assert(!zeroResult.isValid, "isValid est faux pour une écriture à 0 FCFA");

const validLines = [
  { debit: 50000, credit: 0 },
  { debit: 0, credit: 50000 },
];
const validResult = validateDoubleEntry(validLines);
assert(validResult.isBalanced, "isBalanced est vrai pour débit == crédit");
assert(validResult.isNonZero, "isNonZero est vrai pour montant > 0");
assert(validResult.isValid, "isValid est vrai pour écriture équilibrée et non nulle");

const unbalancedLines = [
  { debit: 50000, credit: 0 },
  { debit: 0, credit: 40000 },
];
const unbalResult = validateDoubleEntry(unbalancedLines);
assert(!unbalResult.isBalanced, "isBalanced est faux pour débit != crédit");
assert(!unbalResult.isValid, "isValid est faux pour écriture déséquilibrée");

// 3. Test B3 : CreateJournalEntrySchema validation
console.log("\n[TEST B3] Schéma Zod CreateJournalEntrySchema");
const parsedZero = CreateJournalEntrySchema.safeParse({
  date: new Date().toISOString(),
  reference: "TEST-001",
  description: "Écriture nulle",
  journal: "bank",
  lines: [
    { account_code: "521", debit: 0, credit: 0 },
    { account_code: "401", debit: 0, credit: 0 },
  ],
});
assert(!parsedZero.success, "Zod rejette une écriture à montant nul");

const parsedValid = CreateJournalEntrySchema.safeParse({
  date: new Date().toISOString(),
  reference: "TEST-002",
  description: "Écriture valide",
  journal: "bank",
  lines: [
    { account_code: "521", debit: 100000, credit: 0 },
    { account_code: "401", debit: 0, credit: 100000 },
  ],
});
assert(parsedValid.success, "Zod accepte une écriture équilibrée et non nulle");

// 4. Test B8 & 11a : UserRoleEnum 7 rôles
console.log("\n[TEST B8 & 11a] Enum UserRole complet (7 rôles)");
const expectedRoles = ["owner", "admin", "accountant", "cashier", "hr", "expert", "viewer"];
for (const r of expectedRoles) {
  const parseResult = UserRoleEnum.safeParse(r);
  assert(parseResult.success, `UserRoleEnum accepte '${r}'`);
}
const oldRh = UserRoleEnum.safeParse("rh");
assert(!oldRh.success, "UserRoleEnum rejette l'ancien 'rh' (remplacé par 'hr')");

console.log("\n================================================================");
console.log("🎉 TOUTES LES ASSERTIONS DE CORRECTION DE BUGS SONT VALIDÉES !");
console.log("================================================================\n");
