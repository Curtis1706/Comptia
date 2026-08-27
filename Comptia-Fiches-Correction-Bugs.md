# Fiches de Correction — Bugs Comptia

## Contexte

Audit du dépôt `Curtis1706/Comptia` au commit `a5b85e3`, croisé avec les captures d'écran du tableau de bord et du journal des opérations en production (`studio-comptia.vercel.app`).

Huit défauts ont été identifiés. Deux d'entre eux sont bloquants : tant qu'ils subsistent, aucun état financier n'est fiable et les phases 6 et 7 du cahier de recette ne peuvent pas être validées.

---

## Symptômes observés en production

| Symptôme | Bug d'origine |
| :--- | :---: |
| Trésorerie affiche 4 800 000 FCFA alors que les 3 écritures sont en brouillon | B1 |
| Charges totales à 200 000 FCFA issues d'écritures non validées | B1 |
| Carte « TVA à payer » à 0 FCFA malgré 36 000 FCFA au compte `4431` | B2 |
| Deux lignes `VAT-ynso` sans montant, marquées « Validée » | B3 + B6 |
| Numéro de pièce `VAT-ynso` au lieu de `VAT-2026-00001` | B4 |
| Écriture passée sur le compte `52` (compte de regroupement) | B5 |
| Graphique trésorerie plafonné à 200k alors que la carte affiche 4,8 M | B1 |

---

## Table des correctifs

| Réf. | Correctif | Gravité | Fichiers |
| :--- | :--- | :---: | :---: |
| **B1** | Filtre de statut sur toutes les agrégations | Bloquant | 9 |
| **B2** | Codes TVA SYSCOHADA au lieu du plan français | Bloquant | 2 |
| **B3** | Interdire les écritures à montant nul | Majeur | 3 |
| **B4** | Numérotation séquentielle des pièces | Majeur | 2 |
| **B5** | Comptes de regroupement non mouvementables | Majeur | 4 |
| **B6** | Affichage des trois statuts d'écriture | Mineur | 2 |
| **B7** | Suppression du plan comptable français mort | Mineur | 1 |
| **B8** | Rôle `owner` à l'inscription | Mineur | 2 |

**Ordre d'exécution obligatoire :** B5 → B1 → B2 → B3 → B4 → B6 → B7 → B8.

B5 passe en premier car il ajoute un champ au schéma Prisma ; regrouper les migrations évite deux cycles `prisma generate`.

---

---

# B1 — Filtre de statut sur toutes les agrégations

## Diagnostic

L'enum `EntryStatus` définit trois valeurs :

```prisma
enum EntryStatus {
  draft       // brouillon — ne doit JAMAIS entrer dans un état financier
  posted      // comptabilisé
  validated   // validé par l'expert-comptable
}
```

Le code applique aujourd'hui **deux conventions concurrentes**.

Quatre fichiers filtrent correctement :

| Fichier | Ligne |
| :--- | :--- |
| `src/lib/accounting.ts` | 376 |
| `src/app/api/third-parties/route.ts` | 54 |
| `src/app/api/accounting/lettering/list/route.ts` | 16 |
| `src/app/api/accounting/reconcile/ledger/route.ts` | 13 |

Neuf fichiers ne filtrent pas — ou filtrent mal :

| Fichier | Occurrences | Détail |
| :--- | :---: | :--- |
| `src/app/api/dashboard/stats/route.ts` | 12 | lignes 27, 34, 50, 72, 80, 107, 115, 134, 182, 190, 211, 215 |
| `src/app/api/reports/balance-sheet/route.ts` | 3 | lignes 20, 37, 88 |
| `src/app/api/reports/profit-loss/route.ts` | 2 | lignes 21, 35 |
| `src/app/api/reporting/route.ts` | 3 | lignes 12, 90, 106 |
| `src/app/api/accounts/[code]/route.ts` | 1 | ligne 64 |
| `src/app/api/accounts/[code]/balance/route.ts` | 1 | ligne 28 |
| `src/app/api/accounting/lettering/match/route.ts` | — | vérifier |
| `src/app/api/accounting/reconcile/match/route.ts` | — | vérifier |
| `src/lib/dsf.ts` | 1 | ligne 88 — **inclut `draft` explicitement** |

Le cas de `dsf.ts` mérite attention : le filtre existe mais le commentaire contredit le code.

```ts
status: { in: ["posted", "validated", "draft"] }, // Inclut toutes écritures comptabilisées
```

Un brouillon n'est pas une écriture comptabilisée. C'est la cause directe du futur déséquilibre du bilan.

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.
Stack : Next.js App Router + Prisma + PostgreSQL (Neon).

PROBLÈME
L'enum EntryStatus a trois valeurs : draft, posted, validated.
Les écritures en statut "draft" (brouillon) ne doivent JAMAIS entrer dans le
calcul d'un solde, d'un KPI, d'un état financier ou d'un rapport.

Aujourd'hui, 9 fichiers agrègent des journalLine sans filtrer sur entry.status.
Résultat : le tableau de bord affiche une trésorerie de 4 800 000 FCFA alors
que toutes les écritures concernées sont en brouillon.

RÈGLE À APPLIQUER PARTOUT
Toute requête Prisma qui lit des journalLine pour CALCULER un montant
(aggregate, groupBy, ou findMany suivi d'une somme) doit inclure :

    entry: { status: { in: ["posted", "validated"] } }

Exception : les requêtes qui LISTENT les écritures pour affichage
(src/app/api/accounting/entries/route.ts) ne filtrent pas — l'utilisateur
doit voir ses brouillons dans le journal.

TÂCHE

1. Crée une constante partagée dans src/lib/accounting.ts :

   /**
    * Statuts d'écriture pris en compte dans les calculs comptables.
    * Les brouillons (draft) sont exclus : ils ne sont pas comptabilisés.
    */
   export const POSTED_STATUSES = ["posted", "validated"] as const;

   /**
    * Clause Prisma réutilisable pour filtrer les lignes d'écriture
    * sur les seules écritures comptabilisées d'une entreprise.
    */
   export function postedEntryFilter(companyId: string) {
     return {
       company_id: companyId,
       status: { in: [...POSTED_STATUSES] },
     };
   }

2. src/app/api/dashboard/stats/route.ts
   Les 12 agrégations aux lignes 27, 34, 50, 72, 80, 107, 115, 134, 182, 190,
   211, 215 doivent toutes recevoir le filtre.

   Certaines ont déjà une clause "entry: { date: {...} }" — dans ce cas, AJOUTE
   le status à l'objet entry existant, ne le remplace pas :

       entry: {
         status: { in: ["posted", "validated"] },
         date: { gte: start, lte: end }
       }

   Celles qui n'ont pas de clause entry (lignes 27, 34, 50) doivent en recevoir
   une :

       where: {
         company_id: companyId,
         account_code: { startsWith: "5" },
         entry: { status: { in: ["posted", "validated"] } }
       }

3. Applique la même correction dans :
   - src/app/api/reports/balance-sheet/route.ts (lignes 20, 37, 88)
   - src/app/api/reports/profit-loss/route.ts (lignes 21, 35)
   - src/app/api/reporting/route.ts (lignes 12, 90, 106)
   - src/app/api/accounts/[code]/balance/route.ts (ligne 28)
   - src/app/api/accounting/lettering/match/route.ts
   - src/app/api/accounting/reconcile/match/route.ts

4. src/app/api/accounts/[code]/route.ts ligne 64
   Le count sert à savoir si un compte est utilisé avant suppression.
   Ici il faut compter TOUTES les lignes, brouillons compris — un compte
   référencé par un brouillon ne doit pas être supprimable.
   NE PAS ajouter le filtre ici. Ajoute un commentaire expliquant pourquoi.

5. src/lib/dsf.ts ligne 88
   Remplace :
       status: { in: ["posted", "validated", "draft"] }, // Inclut toutes écritures comptabilisées
   Par :
       status: { in: ["posted", "validated"] }, // Les brouillons ne sont pas comptabilisés

6. Vérification finale : cette commande ne doit renvoyer AUCUN fichier
   (hors entries/route.ts et accounts/[code]/route.ts) :

   for f in $(grep -rl "journalLine" src/app/api src/lib); do
     grep -q "posted" "$f" || echo "MANQUE: $f"
   done

CONTRAINTE
Ne modifie pas la logique de calcul elle-même — uniquement les clauses where.
```

## Vérification

Après correction, avec les données actuelles (3 écritures en brouillon) :

| Carte | Avant | Attendu après |
| :--- | ---: | ---: |
| Chiffre d'affaires | 200 000 | 200 000 |
| Charges totales | 200 000 | **0** |
| Résultat net | 0 | **200 000** |
| Trésorerie | 4 800 000 | **0** |

---

---

# B2 — Codes TVA SYSCOHADA au lieu du plan français

## Diagnostic

`src/app/api/dashboard/stats/route.ts` lignes 185 et 193 :

```ts
account_code: { startsWith: "4457" },   // TVA collectée — plan FRANÇAIS
account_code: { startsWith: "4456" },   // TVA déductible — plan FRANÇAIS
```

Le plan SYSCOHADA utilise `4431` (TVA facturée) et `445x` (TVA récupérable). Aucune ligne ne commence par `4457` → somme nulle → carte à 0 FCFA malgré 36 000 FCFA au compte `4431`.

Le paradoxe : `src/lib/accounting.ts` contient déjà une fonction correcte, `calculateVatForPeriod`, qui gère `443x` et `445x` avec rétrocompatibilité `4457`/`4456`. Le dashboard ne l'utilise pas et refait le calcul à la main avec les mauvais codes.

Second point : `src/app/api/documents/[id]/transform/route.ts` ligne 41 écrit en dur `account_code: "4456"`.

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.

PROBLÈME
Le tableau de bord calcule la TVA sur les comptes 4457 et 4456 (plan comptable
français). Le plan SYSCOHADA utilise 4431 (TVA facturée) et 445x (TVA
récupérable : 4451, 4452, 4453, 4454).

Résultat : la carte "TVA à payer" affiche 0 FCFA alors que le compte 4431 est
crédité de 36 000 FCFA.

Une fonction correcte existe déjà : calculateVatForPeriod() dans
src/lib/accounting.ts. Elle gère 443x et 445x, avec rétrocompatibilité 4457/4456.
Le dashboard ne l'utilise pas.

TÂCHE

1. src/app/api/dashboard/stats/route.ts, section "5. VAT Estimation"
   (lignes 180 à 200 environ).

   Supprime les deux agrégations manuelles sur 4457 et 4456.
   Remplace-les par un appel à la fonction existante :

       import { calculateVatForPeriod } from "@/lib/accounting";

       const vatData = await calculateVatForPeriod(
         prisma,
         companyId,
         currentMonthStart,
         currentMonthEnd
       );
       const estimatedVat = vatData.vat_due;

   Avantages : une seule source de vérité, et le filtre de statut est déjà
   appliqué à l'intérieur de calculateVatForPeriod.

2. src/app/api/documents/[id]/transform/route.ts ligne 41
   Remplace le compte "4456" par "4452" (État, TVA récupérable sur achats),
   conformément au plan SYSCOHADA utilisé par le reste de l'application
   (voir src/app/api/invoices/route.ts ligne 200 et
   src/app/api/vat/declarations/route.ts ligne 143).

3. Vérifie qu'aucun autre fichier de src/app ou src/lib n'utilise 4456 ou 4457
   en dur. Les seules occurrences tolérées sont :
   - src/lib/accounting.ts (rétrocompatibilité explicite, à conserver)
   - src/components/landing/DynamicShowcase.tsx (vitrine marketing, sans impact)
   - src/data/mock.ts (données de démonstration)

CONTRAINTE
Ne modifie pas calculateVatForPeriod : sa logique est correcte.
```

## Vérification

Avec 36 000 FCFA au crédit du `4431` et aucune TVA déductible, une fois l'écriture de vente en statut `posted` ou `validated`, la carte doit afficher **36 000 FCFA**.

---

---

# B3 — Interdire les écritures à montant nul

## Diagnostic

`src/app/api/vat/declarations/route.ts` construit les lignes de régularisation puis teste :

```ts
const { isValid } = validateDoubleEntry(lines);
if (isValid) { /* création de l'écriture */ }
```

Or `validateDoubleEntry` (`src/lib/accounting.ts` lignes 24-31) ne contrôle que l'équilibre :

```ts
const difference = Math.abs(totalDebit - totalCredit);
return { isValid: difference < 0.01, totalDebit, totalCredit, difference };
```

Quand `vat_collected = 0` et `vat_deductible = 0`, on obtient 0 = 0, donc `isValid = true`, et une écriture à montant nul est créée. Ce sont les deux lignes `VAT-ynso` vides visibles dans le journal.

Le même trou existe à la création manuelle d'écriture : `src/app/api/accounting/entries/route.ts` ligne 79 ne teste que l'écart, et le schéma Zod `CreateJournalEntrySchema` (ligne 151) fait de même.

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.

PROBLÈME
Une écriture dont toutes les lignes sont à 0 passe la validation de partie
double : 0 = 0 est "équilibré". Deux écritures de régularisation TVA vides ont
ainsi été créées en production.

TÂCHE

1. src/lib/accounting.ts — fonction validateDoubleEntry (lignes 24-31)

   Ajoute un contrôle de montant non nul. Nouvelle signature :

   export function validateDoubleEntry(
     lines: Array<{ debit: number; credit: number }>
   ): {
     isValid: boolean;
     isBalanced: boolean;
     isNonZero: boolean;
     totalDebit: number;
     totalCredit: number;
     difference: number;
   } {
     const totalDebit = lines.reduce((s, l) => s + (l.debit || 0), 0);
     const totalCredit = lines.reduce((s, l) => s + (l.credit || 0), 0);
     const difference = Math.abs(totalDebit - totalCredit);
     const isBalanced = difference < 0.01;
     const isNonZero = totalDebit >= 0.01;
     return {
       isValid: isBalanced && isNonZero,
       isBalanced,
       isNonZero,
       totalDebit,
       totalCredit,
       difference,
     };
   }

   Les champs isBalanced et isNonZero permettent de produire un message
   d'erreur précis côté appelant.

2. src/app/api/vat/declarations/route.ts

   Le bloc "if (isValid)" ne crée plus d'écriture si les montants sont nuls,
   grâce au point 1. Mais il faut aussi informer l'utilisateur.

   Remplace le silence actuel par :

       const { isValid, isNonZero } = validateDoubleEntry(lines);

       if (!isNonZero) {
         // Période sans opération taxable : la déclaration est créée
         // (obligation de déclarer même à néant), mais sans écriture comptable.
         console.info(
           `[VAT] Déclaration ${decl.id} sans mouvement : aucune écriture générée`
         );
       } else if (isValid) {
         // ... création de l'écriture (code existant inchangé)
       }

   Ajoute aussi un champ dans la réponse pour que le frontend puisse afficher
   un avertissement :

       return NextResponse.json(
         successResponse(
           { ...declaration, has_accounting_entry: isValid && isNonZero },
           isNonZero
             ? "Déclaration créée"
             : "Déclaration créée à néant — aucune opération taxable sur la période"
         ),
         { status: 201 }
       );

3. src/app/api/accounting/entries/route.ts ligne 79

   Remplace :
       const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
       const totalCredit = lines.reduce((s, l) => s + l.credit, 0);
       if (Math.abs(totalDebit - totalCredit) >= 0.01) {
         return errorResponse("L'écriture n'est pas équilibrée", 422);
       }

   Par :
       const { isBalanced, isNonZero, totalDebit, totalCredit, difference } =
         validateDoubleEntry(lines);

       if (!isBalanced) {
         return errorResponse(
           `L'écriture n'est pas équilibrée : débit ${totalDebit.toLocaleString("fr-FR")} FCFA, ` +
           `crédit ${totalCredit.toLocaleString("fr-FR")} FCFA, écart ${difference.toLocaleString("fr-FR")} FCFA`,
           422
         );
       }
       if (!isNonZero) {
         return errorResponse(
           "L'écriture ne peut pas avoir un montant nul",
           422
         );
       }

   N'oublie pas l'import de validateDoubleEntry.

4. src/lib/validators.ts — CreateJournalEntrySchema (ligne 151)

   Ajoute un second refine après celui qui vérifie l'équilibre :

       .refine(
         (d) => d.lines.reduce((s, l) => s + l.debit, 0) >= 0.01,
         {
           message: "Le montant total de l'écriture ne peut pas être nul",
           path: ["lines"],
         }
       )

5. Nettoyage des données existantes

   Crée un script prisma/scripts/cleanup-zero-entries.ts qui :
   - recherche les JournalEntry dont la somme des débits ET des crédits vaut 0
   - affiche la liste (id, reference, description, date) sans rien supprimer
   - ne supprime que si la variable d'environnement CONFIRM_DELETE=true

   Ce script permettra de retirer les écritures VAT-ynso déjà créées.
```

---

---

# B4 — Numérotation séquentielle des pièces

## Diagnostic

`src/app/api/vat/declarations/route.ts` ligne 162 :

```ts
reference: `VAT-${decl.id.slice(-4)}`,
```

`decl.id` étant un cuid, ses quatre derniers caractères produisent `ynso`. D'où le numéro de pièce `VAT-ynso` observé dans le journal.

Les autres modules respectent une numérotation lisible et séquentielle : `VTE-FAC-2026-00001`, `CASH-2026-00001`, `BANK-2026-00003`. Le module TVA fait exception.

Une numérotation aléatoire pose trois problèmes concrets : impossible de trier les pièces chronologiquement, impossible de détecter un trou dans la séquence lors d'un contrôle fiscal, et l'article 17 de l'Acte Uniforme OHADA exige une numérotation chronologique ininterrompue.

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.

PROBLÈME
La référence des écritures de régularisation TVA est générée à partir des 4
derniers caractères d'un cuid : `VAT-${decl.id.slice(-4)}` produit "VAT-ynso".

Les autres modules utilisent une numérotation séquentielle lisible
(VTE-FAC-2026-00001, BANK-2026-00003). Le SYSCOHADA impose une numérotation
chronologique ininterrompue.

TÂCHE

1. Crée un utilitaire partagé dans src/lib/accounting.ts :

   /**
    * Génère la prochaine référence séquentielle pour un journal donné.
    * Format : {PREFIX}-{ANNEE}-{NUMERO sur 5 chiffres}
    * Exemple : VAT-2026-00001
    *
    * À appeler DANS une transaction Prisma pour éviter les collisions.
    */
   export async function nextEntryReference(
     tx: any,
     companyId: string,
     prefix: string,
     date: Date = new Date()
   ): Promise<string> {
     const year = date.getFullYear();
     const pattern = `${prefix}-${year}-`;

     const last = await tx.journalEntry.findFirst({
       where: {
         company_id: companyId,
         reference: { startsWith: pattern },
       },
       orderBy: { reference: "desc" },
       select: { reference: true },
     });

     const lastNumber = last
       ? parseInt(last.reference.slice(pattern.length), 10) || 0
       : 0;

     return `${pattern}${String(lastNumber + 1).padStart(5, "0")}`;
   }

2. src/app/api/vat/declarations/route.ts ligne 162

   Remplace :
       reference: `VAT-${decl.id.slice(-4)}`,

   Par :
       reference: await nextEntryReference(tx, user.company_id, "VAT"),

   L'appel se fait à l'intérieur de la transaction (tx), pas avec le client
   prisma global — c'est ce qui garantit l'absence de doublon en cas de
   création simultanée.

3. Passe en revue les autres générateurs de référence du projet
   (src/app/api/invoices/route.ts, src/app/api/payroll/payslips/,
   src/app/api/documents/[id]/transform/route.ts).

   Pour chacun : s'il utilise déjà une séquence, laisse-le tel quel.
   S'il utilise un slice de cuid, un timestamp ou Math.random(), remplace-le
   par nextEntryReference() avec le préfixe adapté :
   - PAI pour la paie
   - OD pour les opérations diverses
   - AC pour les achats

4. Ajoute une contrainte d'unicité dans prisma/schema.prisma sur le modèle
   JournalEntry, pour que la base refuse tout doublon :

       @@unique([company_id, reference])

   Attention : si des doublons existent déjà en base, la migration échouera.
   Prévois un script de détection préalable qui liste les références
   dupliquées par entreprise.
```

---

---

# B5 — Comptes de regroupement non mouvementables

## Diagnostic

Le modèle `Account` ne distingue pas les comptes de regroupement des comptes mouvementables :

```prisma
model Account {
  code        String
  name        String
  type        AccountType
  parent_code String?
  is_active   Boolean @default(true)
}
```

Le seed SYSCOHADA crée pourtant bien une hiérarchie :

```ts
{ code: "52",  name: "Banques", type: "asset" },
{ code: "521", name: "Banques locales en monnaie nationale", parent_code: "52" },
{ code: "522", name: "Banques en devises", parent_code: "52" },
```

`GET /api/accounts` renvoie l'ensemble sans distinction, et le combobox de saisie propose donc `52` au même titre que `521`. C'est ce qui a permis l'écriture `BANK-2026-00002` sur le compte `52`.

En comptabilité, un compte ayant des sous-comptes ne peut pas recevoir d'écriture : son solde est la somme de ses enfants. Une écriture directe dessus fausse tous les totaux par niveau et rend le grand livre incohérent.

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.
Stack : Next.js App Router + Prisma + PostgreSQL.

PROBLÈME
Le plan comptable SYSCOHADA est hiérarchique : le compte 52 (Banques) a pour
enfants 521 (Banques locales) et 522 (Banques en devises).

Un compte qui possède des sous-comptes est un compte de REGROUPEMENT : son
solde est la somme de ses enfants. Il ne doit jamais recevoir d'écriture
directe.

Aujourd'hui rien ne l'empêche. Une écriture a été passée sur le compte 52 en
production, ce qui fausse les totaux par niveau.

TÂCHE

1. prisma/schema.prisma — modèle Account

   Ajoute le champ :

       is_postable Boolean @default(true)   // false pour les comptes de regroupement

   Ajoute aussi un index, le champ servira à filtrer :

       @@index([company_id, is_postable])

2. prisma/seed.ts

   Après l'insertion des comptes, calcule automatiquement is_postable :
   un compte est NON mouvementable s'il apparaît comme parent_code d'au moins
   un autre compte.

   Ajoute à la fin de seedAccountsForCompany() :

       // Un compte cité comme parent_code par un autre compte est un compte
       // de regroupement : il ne peut pas recevoir d'écriture directe.
       const parentCodes = [
         ...new Set(
           SYSCOHADA_ACCOUNTS
             .map((a) => a.parent_code)
             .filter((c): c is string => Boolean(c))
         ),
       ];

       if (parentCodes.length > 0) {
         await prisma.account.updateMany({
           where: { company_id: companyId, code: { in: parentCodes } },
           data: { is_postable: false },
         });
       }

   Adapte les noms de variables au code existant du fichier.

3. src/app/api/accounts/route.ts — handler GET

   Ajoute le support d'un paramètre de requête "postable_only" :

       const postableOnly = searchParams.get("postable_only") === "true";

   Et dans la clause where :

       ...(postableOnly && { is_postable: true }),

   Le paramètre est optionnel : les écrans de consultation du plan comptable
   continuent d'afficher tous les comptes.

4. Combobox de sélection de compte dans la modale d'écriture

   Trouve le composant qui appelle /api/accounts pour alimenter le sélecteur
   de compte (introduit au commit 87fdaa0, "instant searchable account
   combobox"). Il se trouve dans src/components/ ou src/views/Comptabilite.tsx.

   Ajoute postable_only=true à l'URL d'appel.

   Si un compte non mouvementable apparaît malgré tout dans la liste (données
   anciennes), affiche-le grisé et non sélectionnable, avec le libellé
   "(compte de regroupement)".

5. src/app/api/accounting/entries/route.ts — handler POST

   Le blocage côté serveur est indispensable : masquer dans l'UI ne suffit pas.

   Avant la création de l'écriture, après la validation d'équilibre :

       const codes = [...new Set(lines.map((l) => l.account_code))];
       const accounts = await prisma.account.findMany({
         where: { company_id: user.company_id, code: { in: codes } },
         select: { code: true, name: true, is_postable: true },
       });

       const missing = codes.filter((c) => !accounts.some((a) => a.code === c));
       if (missing.length > 0) {
         return errorResponse(
           `Compte inconnu : ${missing.join(", ")}`,
           422
         );
       }

       const nonPostable = accounts.filter((a) => !a.is_postable);
       if (nonPostable.length > 0) {
         return errorResponse(
           `Écriture impossible sur un compte de regroupement : ` +
           nonPostable.map((a) => `${a.code} — ${a.name}`).join(", ") +
           `. Utilisez un sous-compte.`,
           422
         );
       }

6. Migration des données existantes

   Crée prisma/scripts/fix-nonpostable-entries.ts qui :
   - recalcule is_postable pour toutes les entreprises existantes
   - liste les JournalLine déjà passées sur un compte devenu non mouvementable
   - propose pour chacune le sous-compte le plus probable (premier enfant actif)
   - n'applique la correction que si CONFIRM_MIGRATE=true

   Pour les données actuelles, la ligne du compte 52 doit être réaffectée à 521.
```

## Vérification

Après correction, la saisie d'une écriture sur le compte `52` doit renvoyer une erreur 422 avec un message indiquant d'utiliser `521` ou `522`.

---

---

# B6 — Affichage des trois statuts d'écriture

## Diagnostic

`src/views/Comptabilite.tsx` ligne 285 :

```tsx
<OperationStatusBadge status={op.status === "validated" ? "validee" : "attente"} />
```

L'enum comporte trois valeurs mais l'affichage n'en connaît que deux. Une écriture `posted` — donc comptabilisée et incluse dans les états financiers — s'affiche « En attente ».

L'incohérence est visible dans le même écran : le filtre ligne 216 libelle `draft` comme « En attente (Brouillon) », tandis que le badge applique ce même libellé à `posted`.

Ce défaut est mineur aujourd'hui, mais devient trompeur dès que B1 sera corrigé : `posted` comptera dans les états alors que l'écran affichera le contraire.

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.

PROBLÈME
L'enum EntryStatus a trois valeurs (draft, posted, validated) mais l'interface
n'en affiche que deux. Une écriture "posted" s'affiche "En attente" alors
qu'elle est comptabilisée et incluse dans les états financiers.

TÂCHE

1. Trouve le composant OperationStatusBadge (probablement dans
   src/components/ui/ ou src/components/).

   Étends-le pour gérer trois états :

   - draft     → libellé "Brouillon"    — gris / neutre    — icône horloge
   - posted    → libellé "Comptabilisée" — bleu / info     — icône check simple
   - validated → libellé "Validée"       — vert / success  — icône double check

   Conserve les variantes de couleur du design system existant plutôt que
   d'introduire de nouvelles classes.

2. src/views/Comptabilite.tsx ligne 285

   Remplace :
       <OperationStatusBadge status={op.status === "validated" ? "validee" : "attente"} />
   Par :
       <OperationStatusBadge status={op.status} />

3. Même fichier, filtre ligne 216

   Remplace l'option unique par les trois valeurs :

       <option value="all">Tous les statuts</option>
       <option value="draft">Brouillon</option>
       <option value="posted">Comptabilisée</option>
       <option value="validated">Validée</option>

4. Lignes 240, 243, 274 et 288 : la logique de sélection multiple et le bouton
   de suppression se basent sur status === "draft".

   Règle métier à appliquer :
   - Sélection pour validation groupée : uniquement les "draft"
   - Suppression : uniquement les "draft"
   - Une écriture "posted" ou "validated" ne peut être ni modifiée ni supprimée
     (contrepassation obligatoire)

   Vérifie que ces conditions sont bien exprimées ainsi et corrige si besoin.

5. Ajoute une infobulle sur le badge expliquant en une phrase ce que chaque
   statut implique :
   - Brouillon : non prise en compte dans les états financiers
   - Comptabilisée : incluse dans les états, modifiable par contrepassation
   - Validée : verrouillée par l'expert-comptable
```

---

---

# B7 — Suppression du plan comptable français mort

## Diagnostic

`src/app/api/accounts/seed/route.ts` contient un plan comptable **français** :

```ts
{ code: "4456",  name: "Taxes sur le chiffre d'affaires déductibles" },
{ code: "44571", name: "TVA collectée — taux 20%" },
{ code: "44575", name: "TVA collectée — taux 5.5%" },
```

Les taux de 20% et 5,5% n'existent pas au Bénin, où la TVA est à 18%.

Cette route n'est appelée nulle part dans le code : `src/app/api/auth/register/route.ts` utilise bien `seedAccountsForCompany` importé de `prisma/seed.ts` (SYSCOHADA). Il s'agit donc de code mort — mais d'un code mort exposé : un appel à `POST /api/accounts/seed` injecterait le plan français dans une entreprise béninoise.

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.

PROBLÈME
src/app/api/accounts/seed/route.ts contient un plan comptable FRANÇAIS
(comptes 4456, 4457, 44571 "TVA collectée taux 20%", 44575 "taux 5.5%").
Ces taux n'existent pas au Bénin — la TVA y est à 18%.

Cette route n'est appelée par aucun code : l'inscription utilise
seedAccountsForCompany() depuis prisma/seed.ts (plan SYSCOHADA correct).
C'est du code mort, mais exposé : un appel direct à POST /api/accounts/seed
injecterait le plan français dans une entreprise béninoise.

TÂCHE

Deux options — choisis la première sauf contre-indication.

OPTION A (recommandée) : supprimer la route
1. Supprime le fichier src/app/api/accounts/seed/route.ts
2. Vérifie qu'aucun appel ne subsiste :
   grep -rn "accounts/seed" src/
3. Vérifie que npx tsc --noEmit passe toujours

OPTION B : réécrire la route pour SYSCOHADA
Si tu estimes qu'un endpoint de re-seed reste utile (réinitialisation d'un plan
comptable corrompu, migration d'une entreprise existante) :
1. Supprime le tableau de comptes français du fichier
2. Fais appel à seedAccountsForCompany() depuis prisma/seed.ts
3. Restreins l'accès au rôle admin uniquement (requireAdmin)
4. Ajoute une garde : refuse l'exécution si l'entreprise a déjà des écritures
   comptables, pour éviter d'orpheliner des JournalLine
5. Journalise l'action dans l'audit log

Indique quelle option tu as retenue et pourquoi.
```

---

---

# B8 — Rôle `owner` à l'inscription

## Diagnostic

`src/app/api/auth/register/route.ts` ligne 63 crée l'utilisateur fondateur avec `role: "admin"`.

La fiche 11 prévoit un rôle `owner` distinct : seul le propriétaire accède à la facturation de l'abonnement, ne peut pas être supprimé, et peut transférer la propriété. Sans lui, tout administrateur invité obtient les mêmes droits que le fondateur.

Cette correction dépend de la fiche 11a (refonte de l'enum `UserRole`). Elle est donc à traiter **après** celle-ci, ou conjointement.

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.

PRÉREQUIS
Cette tâche suppose que la fiche 11a est appliquée : l'enum UserRole contient
owner, admin, accountant, cashier, hr, expert, viewer.
Si ce n'est pas le cas, applique d'abord la fiche 11a.

PROBLÈME
src/app/api/auth/register/route.ts ligne 63 crée l'utilisateur fondateur avec
role: "admin". Il devrait recevoir le rôle "owner" : seul le propriétaire
accède à la facturation de l'abonnement, ne peut pas être supprimé, et peut
transférer la propriété de l'entreprise.

TÂCHE

1. src/app/api/auth/register/route.ts ligne 63
   Remplace role: "admin" par role: "owner"

2. src/app/api/users/route.ts — création d'utilisateur
   Ajoute une garde : le rôle "owner" ne peut jamais être attribué via cette
   route. Il n'existe que par la création d'entreprise ou par transfert
   explicite.

       if (parsed.data.role === "owner") {
         return errorResponse(
           "Le rôle propriétaire ne peut pas être attribué directement. " +
           "Utilisez le transfert de propriété.",
           422
         );
       }

3. src/app/api/users/[id]/route.ts — modification et suppression
   Ajoute trois gardes :

   a) Un utilisateur "owner" ne peut pas être supprimé :

       if (target.role === "owner") {
         return errorResponse(
           "Le propriétaire de l'entreprise ne peut pas être supprimé.",
           422
         );
       }

   b) Le rôle d'un "owner" ne peut pas être modifié par un tiers :

       if (target.role === "owner" && target.id !== user.id) {
         return errorResponse(
           "Seul le propriétaire peut transférer sa propriété.",
           403
         );
       }

   c) Personne ne peut se promouvoir "owner" :

       if (parsed.data.role === "owner") {
         return errorResponse(
           "Utilisez le transfert de propriété pour changer de propriétaire.",
           422
         );
       }

4. Crée la route de transfert de propriété :
   src/app/api/company/transfer-ownership/route.ts (POST)

   - Accessible au seul utilisateur ayant role "owner"
   - Paramètre : new_owner_user_id
   - Vérifie que la cible appartient à la même entreprise et est active
   - Dans une transaction : la cible passe à "owner", l'appelant passe à "admin"
   - Journalise l'opération dans l'audit log avec les deux identifiants
   - Retourne les deux utilisateurs mis à jour

5. Migration des données existantes
   Crée prisma/scripts/promote-owners.ts qui, pour chaque entreprise sans
   utilisateur "owner", promeut l'administrateur le plus ancien
   (created_at le plus petit). Affiche le plan avant application, et
   n'exécute que si CONFIRM_MIGRATE=true.
```

---

---

# Plan d'exécution

```
Étape 1 — Schéma (une seule migration)
  B5.1  Ajouter Account.is_postable
  B4.4  Ajouter @@unique([company_id, reference]) sur JournalEntry
  →     npx prisma generate
  →     npx prisma migrate dev --name fix_postable_and_reference

Étape 2 — Calculs comptables (le cœur du problème)
  B1    Filtre de statut sur les 9 fichiers
  B2    Codes TVA SYSCOHADA
  B3    Interdiction des montants nuls

Étape 3 — Intégrité des écritures
  B4    Numérotation séquentielle
  B5    Blocage des comptes de regroupement (API + UI)

Étape 4 — Interface et nettoyage
  B6    Trois statuts affichés
  B7    Suppression du plan français
  B8    Rôle owner (après fiche 11a)

Étape 5 — Scripts de reprise des données
  cleanup-zero-entries.ts        supprime les écritures VAT-ynso
  fix-nonpostable-entries.ts     réaffecte la ligne du compte 52 vers 521
  promote-owners.ts              promeut le fondateur en owner
```

---

# Vérifications

## Automatiques

```bash
npx prisma generate          # types synchronisés
npx tsc --noEmit             # 0 erreur
npm run test:unit            # suite fiscale et comptable

# Aucun fichier ne doit ressortir, hors entries/route.ts et accounts/[code]/route.ts
for f in $(grep -rl "journalLine" src/app/api src/lib); do
  grep -q "posted" "$f" || echo "MANQUE FILTRE: $f"
done

# Aucune occurrence en dur des comptes français
grep -rn "4456\|4457" src/app src/lib | grep -v "accounting.ts"
```

## Manuelles

| # | Test | Attendu |
| :--- | :--- | :--- |
| 1 | Ouvrir le tableau de bord avec les 3 écritures en brouillon | Trésorerie 0, charges 0 |
| 2 | Valider l'écriture du capital, recharger | Trésorerie 5 000 000 |
| 3 | Consulter la carte TVA à payer | 36 000 FCFA |
| 4 | Créer une écriture sur le compte `52` | Erreur 422 avec suggestion `521` |
| 5 | Créer une écriture à montant nul | Erreur 422 |
| 6 | Créer une déclaration TVA sur une période vide | Déclaration à néant, sans écriture |
| 7 | Créer une déclaration TVA avec mouvements | Référence `VAT-2026-00001` |
| 8 | Vérifier les badges du journal | Trois libellés distincts |
| 9 | Comparer carte Trésorerie et graphique Historique | Mêmes valeurs |
| 10 | Tenter de supprimer l'utilisateur `owner` | Erreur 422 |

---

*Brightbook Studio / Comptia — audit du commit a5b85e3*
