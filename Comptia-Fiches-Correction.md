# 🛠️ Brightbook Studio (Comptia) — Fiches de Correction pour Antigravity

> **Repo :** `https://github.com/Curtis1706/Comptia.git`
> **Stack :** Next.js (App Router) + Prisma/PostgreSQL (Neon) + TanStack Query + Radix UI/Tailwind + NextAuth
> **Objectif :** SaaS de gestion comptable conforme aux normes béninoises (SYSCOHADA, MECeF, DGI)

---

## 📋 Index des Fiches

| # | Fiche | Priorité | Fichiers concernés |
|---|-------|----------|--------------------|
| 1 | Plan comptable SYSCOHADA (seed) | 🔴 Haute | `prisma/seed.ts` (nouveau), `package.json` |
| 2 | Correction de la paie (taux béninois) | 🔴 Haute | `src/lib/accounting.ts`, `src/constants/payroll.ts` |
| 3 | Déclarations TVA format Bénin | 🔴 Haute | `prisma/schema.prisma`, `src/app/api/vat/`, `src/views/TVA.tsx` |
| 4 | Intégration API e-MECeF | 🔴 Haute | `src/lib/mecef.ts` (nouveau), `src/app/api/invoices/` |
| 5 | Génération DSF (états financiers SYSCOHADA) | 🔴 Haute | `src/lib/dsf.ts` (nouveau), `src/app/api/reporting/` |
| 6 | Modules conditionnels par secteur | 🟡 Moyenne | `src/components/layout/AppSidebar.tsx`, `src/views/` |
| 7 | Alertes fiscales automatiques | 🟡 Moyenne | `src/lib/fiscal-alerts.ts` (nouveau), `src/app/api/notifications/` |
| 8 | Barème IPTS progressif Bénin | 🟡 Moyenne | `src/constants/payroll.ts`, `src/lib/accounting.ts` |
| 9 | Types de société béninois | 🟡 Moyenne | `prisma/schema.prisma` (enum CompanyType) |
| 10 | Moyens de paiement béninois | 🟡 Moyenne | `prisma/schema.prisma` (enum PaymentMethod) |

---

---

## FICHE 1 — Plan Comptable SYSCOHADA (Seed Prisma)

### Contexte

Le modèle `Account` existe déjà dans le schema Prisma avec les champs `code`, `name`, `type`, `company_id`, `parent_code`. Mais **aucun plan comptable n'est pré-chargé**. Quand une entreprise se crée, elle a 0 comptes. Il faut un seed Prisma qui charge le plan comptable SYSCOHADA révisé (8 classes) à la création de chaque entreprise.

### Fichiers concernés

- `prisma/seed.ts` → **à créer**
- `package.json` → ajouter `"prisma": { "seed": "ts-node prisma/seed.ts" }`

### Structure du plan comptable SYSCOHADA

```
Classe 1 — Comptes de ressources durables (equity/liability)
  10 — Capital
  11 — Réserves
  12 — Report à nouveau
  13 — Résultat net de l'exercice
  14 — Subventions d'investissement
  16 — Emprunts et dettes assimilées
  17 — Dettes de crédit-bail
  19 — Provisions financières pour risques et charges

Classe 2 — Comptes d'actif immobilisé (asset)
  20 — Charges immobilisées
  21 — Immobilisations incorporelles
  22 — Terrains
  23 — Bâtiments
  24 — Matériel
  25 — Avances et acomptes sur immobilisations
  27 — Autres immobilisations financières
  28 — Amortissements
  29 — Provisions pour dépréciation

Classe 3 — Comptes de stocks (asset)
  31 — Marchandises
  32 — Matières premières
  33 — Autres approvisionnements
  34 — Produits en cours
  35 — Services en cours
  36 — Produits finis
  37 — Produits intermédiaires
  38 — Stocks en cours de route
  39 — Dépréciations des stocks

Classe 4 — Comptes de tiers (asset/liability)
  40 — Fournisseurs et comptes rattachés
  401 — Fournisseurs, dettes en compte
  408 — Fournisseurs, factures non parvenues
  41 — Clients et comptes rattachés
  411 — Clients
  416 — Créances clients litigieuses
  42 — Personnel
  421 — Personnel, rémunérations dues
  43 — Organismes sociaux
  431 — Sécurité sociale (CNSS)
  44 — État et collectivités publiques
  441 — État, impôt sur les bénéfices
  443 — État, TVA facturée (anciennement 4431)
  4441 — État, TVA due
  4449 — État, crédit de TVA
  445 — État, TVA récupérable
  4451 — TVA récupérable sur immobilisations
  4452 — TVA récupérable sur achats
  4453 — TVA récupérable sur transports
  4454 — TVA récupérable sur services
  446 — État, autres impôts et taxes
  447 — État, impôts retenus à la source
  4471 — AIR (Acompte sur Impôt assis sur les Revenus)
  4472 — RAS (Retenue À la Source)
  448 — État, charges à payer et produits à recevoir
  47 — Débiteurs et créditeurs divers
  49 — Dépréciations des comptes de tiers

Classe 5 — Comptes de trésorerie (asset)
  51 — Valeurs à encaisser
  52 — Banques
  521 — Banques locales
  53 — Établissements financiers et assimilés
  531 — Chèques postaux
  54 — Caisses — (espèces en caisse)
  541 — Caisse siège
  55 — Régies d'avances et accréditifs
  56 — Banques, crédits de trésorerie
  57 — Caisse — Mobile Money (usage courant au Bénin, sous-compte de 58)
  58 — Virements internes
  59 — Dépréciations des comptes de trésorerie

Classe 6 — Comptes de charges (expense)
  60 — Achats et variations de stocks
  601 — Achats de marchandises
  602 — Achats de matières premières
  604 — Achats stockés de matières et fournitures consommables
  605 — Autres achats
  608 — Achats d'emballages
  61 — Transports
  62 — Services extérieurs A
  621 — Sous-traitance générale
  622 — Locations et charges locatives
  623 — Redevances de crédit-bail
  624 — Entretien, réparations et maintenance
  625 — Primes d'assurance
  626 — Études, recherches et documentation
  63 — Services extérieurs B
  631 — Frais bancaires
  632 — Rémunérations d'intermédiaires et honoraires
  633 — Frais de formation du personnel
  634 — Publicité et relations publiques
  635 — Frais de télécommunications
  636 — Frais de transport du personnel
  637 — Déplacements, missions et réceptions
  638 — Autres charges externes
  64 — Impôts et taxes
  641 — Impôts et taxes directs
  645 — Impôts et taxes indirects
  646 — Droits d'enregistrement
  647 — Pénalités et amendes fiscales
  648 — Autres impôts et taxes
  65 — Autres charges
  66 — Charges de personnel
  661 — Rémunérations directes versées au personnel national
  662 — Rémunérations directes versées au personnel non national
  663 — Indemnités forfaitaires versées au personnel
  664 — Charges sociales (part patronale CNSS, VPS)
  666 — Rémunérations et charges sociales de l'exploitant
  667 — Rémunérations transférées de personnel extérieur
  668 — Autres charges sociales
  67 — Frais financiers et charges assimilées
  671 — Intérêts des emprunts
  672 — Intérêts dans loyers de crédit-bail
  676 — Pertes de change
  68 — Dotations aux amortissements et provisions
  681 — Dotations aux amortissements d'exploitation
  69 — Dotations aux provisions et dépréciations (HAO)

Classe 7 — Comptes de produits (revenue)
  70 — Ventes
  701 — Ventes de marchandises
  702 — Ventes de produits finis
  704 — Travaux facturés
  705 — Études facturées
  706 — Services vendus (prestations de services)
  707 — Produits accessoires
  71 — Subventions d'exploitation
  72 — Production immobilisée
  73 — Variations de stocks de produits et en-cours
  75 — Autres produits
  76 — Produits financiers
  77 — Revenus financiers et produits assimilés
  771 — Intérêts de prêts
  776 — Gains de change
  78 — Reprises d'amortissements et provisions
  79 — Reprises de provisions et dépréciations (HAO)

Classe 8 — Comptes des autres charges et produits (HAO)
  81 — Valeurs comptables des cessions d'immobilisations
  82 — Produits de cessions d'immobilisations
  83 — Charges HAO (Hors Activités Ordinaires)
  84 — Produits HAO
  85 — Dotations HAO
  86 — Reprises HAO
  87 — Participations des travailleurs
  88 — Subventions d'équilibre
  89 — Impôts sur le résultat
```

### Prompt Antigravity

```
Contexte : Projet Brightbook Studio (Comptia), SaaS comptable pour le Bénin.
Stack : Next.js App Router + Prisma + PostgreSQL.

Le modèle Account existe déjà dans prisma/schema.prisma avec les champs :
- code (String @id)
- name (String)
- type (AccountType: asset | liability | equity | revenue | expense)
- company_id (String)
- parent_code (String?)
- is_active (Boolean)

Tâche : Crée un fichier prisma/seed.ts qui :

1. Définit le plan comptable SYSCOHADA révisé complet (classes 1 à 8) avec le mapping suivant :
   - Classe 1 → type "equity" ou "liability" selon le compte
   - Classe 2 → type "asset"
   - Classe 3 → type "asset"
   - Classe 4 → type "asset" pour 41 (clients), "liability" pour 40 (fournisseurs), selon le cas pour les autres
   - Classe 5 → type "asset"
   - Classe 6 → type "expense"
   - Classe 7 → type "revenue"
   - Classe 8 → dépend du sous-compte

2. Exporte une fonction seedAccountsForCompany(prisma, companyId) qui insère tous ces comptes pour une entreprise donnée via prisma.account.createMany()

3. Cette fonction doit être appelable aussi depuis l'API de création d'entreprise (register), pas seulement depuis le seed CLI.

4. Ajoute aussi dans package.json : "prisma": { "seed": "npx tsx prisma/seed.ts" }

Utilise le plan comptable SYSCOHADA suivant :
[COLLER ICI LA STRUCTURE CI-DESSUS]

Important : le code du compte est la clé primaire (@id) mais elle est combinée avec company_id dans un @@unique([code, company_id]). Donc chaque entreprise a sa propre copie du plan comptable. Le parent_code permet de reconstituer la hiérarchie (ex: parent_code de "411" est "41", parent_code de "41" est "4").
```

---

---

## FICHE 2 — Correction de la Paie (Taux Béninois)

### Contexte

Le fichier `src/lib/accounting.ts` contient une fonction `calculatePayroll()` qui utilise les cotisations sociales **françaises** (CSG, CRDS, Sécurité sociale maladie, Chômage). Ces charges n'existent pas au Bénin.

Le fichier `src/constants/payroll.ts` contient déjà les **bons taux béninois** (CNSS 3.6% salariale, 15.4% patronale, VPS 4%) mais ils ne sont **jamais utilisés** par la fonction de calcul.

### Fichiers concernés

- `src/lib/accounting.ts` → **modifier** la fonction `calculatePayroll()`
- `src/constants/payroll.ts` → **enrichir** avec le barème IPTS complet

### Taux de cotisation béninois (2024-2026)

```
RETENUES SALARIALES (déduites du salaire brut) :
- CNSS part ouvrière : 3.6% du salaire brut (plafonné à 600 000 FCFA/mois)
- IPTS (Impôt Progressif sur Traitements et Salaires) : barème progressif

CHARGES PATRONALES (payées en plus du brut par l'employeur) :
- CNSS part patronale : 15.4% du salaire brut (plafonné à 600 000 FCFA/mois)
  - dont Prestations familiales : 9%
  - dont Accidents du travail : 1% à 4% (selon secteur, 1% par défaut)
  - dont Retraite : 5.4%
- VPS (Versement Patronal sur Salaires) : 4% (peut être 2% selon convention)
  - base : totalité du salaire brut (pas de plafond)

BARÈME IPTS BÉNIN (mensuel) :
- 0 à 50 000 FCFA → 0%
- 50 001 à 130 000 FCFA → 10%
- 130 001 à 280 000 FCFA → 15%
- 280 001 à 580 000 FCFA → 20%
- Au-delà de 580 000 FCFA → 25% (taux marginal, PAS taux effectif)
  (NB: Vérifier avec les textes en vigueur, ce barème peut être mis à jour)

Note : Le salaire imposable pour l'IPTS = Brut - CNSS salariale - abattements légaux
Le plafond CNSS est de 600 000 FCFA/mois.
```

### Prompt Antigravity

```
Contexte : Projet Brightbook Studio (Comptia), SaaS comptable pour le Bénin.
Fichier à modifier : src/lib/accounting.ts

Problème : La fonction calculatePayroll() aux lignes 239-280 utilise des cotisations françaises (CSG, CRDS, Sécurité sociale, Chômage). Le Bénin a un système complètement différent.

Tâche :

1. Remplace la fonction calculatePayroll() pour appliquer les cotisations béninoises :

   Retenues salariales :
   - CNSS part ouvrière : 3.6% du brut (plafonné à 600 000 FCFA/mois)
   - IPTS : impôt progressif calculé sur le salaire imposable (brut - CNSS salariale)

   Charges patronales :
   - CNSS part patronale : 15.4% du brut (plafonné à 600 000 FCFA/mois)
   - VPS : 4% du brut (pas de plafond)

2. Ajoute une fonction calculateIPTS(monthlyTaxableIncome: number): number
   qui applique le barème progressif béninois :
   - 0 à 50 000 → 0%
   - 50 001 à 130 000 → 10%
   - 130 001 à 280 000 → 15%
   - 280 001 à 580 000 → 20%
   - Au-delà de 580 000 → 25%
   C'est un barème par TRANCHE (comme l'impôt sur le revenu en France), pas un taux unique.

3. Le plafond CNSS (600 000 FCFA) doit être une constante exportée.

4. La signature de calculatePayroll doit rester compatible :
   calculatePayroll(baseSalary: number): PayrollResult

5. Mets aussi à jour src/constants/payroll.ts pour refléter les mêmes taux avec le barème IPTS.

Code actuel de calculatePayroll() à remplacer :
[COLLER les lignes 239-280 de src/lib/accounting.ts]

L'interface PayrollResult (lignes 228-233) reste la même :
export interface PayrollResult {
  gross_salary: number;
  net_salary: number;
  employer_cost: number;
  deductions: Array<{ label: string; rate: number; base: number; amount: number }>;
  contributions: Array<{ label: string; rate: number; base: number; amount: number }>;
}
```

---

---

## FICHE 3 — Déclarations TVA Format Bénin

### Contexte

Le schema Prisma utilise un enum `VatDeclarationType` avec les valeurs `CA3` et `CA12` qui sont les **formulaires français** (déclaration mensuelle / annuelle simplifiée). Au Bénin, la TVA est à **18%**, déclarée **mensuellement** au plus tard le 15 du mois suivant. Il n'y a pas de CA3/CA12 — c'est un formulaire DGI spécifique.

Les comptes SYSCOHADA pour la TVA sont :
- **4431** (ou 443) — TVA facturée (collectée sur ventes)
- **4441** — TVA due
- **4449** — Crédit de TVA à reporter
- **4451** — TVA récupérable sur immobilisations
- **4452** — TVA récupérable sur achats
- **4453** — TVA récupérable sur transports
- **4454** — TVA récupérable sur services extérieurs

### Fichiers concernés

- `prisma/schema.prisma` → modifier enums `VatDeclarationType`
- `src/app/api/vat/` → adapter les routes API
- `src/views/TVA.tsx` → adapter l'interface

### Prompt Antigravity

```
Contexte : Projet Brightbook Studio (Comptia), SaaS comptable pour le Bénin.

Problème : L'enum VatDeclarationType dans prisma/schema.prisma contient "CA3" et "CA12" qui sont les formulaires français. Le Bénin utilise un système différent.

Tâche :

1. Dans prisma/schema.prisma, remplace l'enum VatDeclarationType :
   enum VatDeclarationType {
     monthly       // Déclaration mensuelle (régime réel normal et simplifié)
     quarterly     // Trimestrielle (si applicable selon convention)
   }

2. Ajoute un champ deadline_date (DateTime?) au modèle VatDeclaration pour stocker la date limite de dépôt (le 15 du mois suivant la période).

3. Ajoute un champ penalty_amount (Decimal @db.Decimal(15, 2) @default(0)) pour calculer automatiquement les pénalités de retard si la déclaration est soumise après la deadline :
   - 10% du montant dû dès le 1er jour de retard
   - +1% par mois supplémentaire

4. Dans les routes API (src/app/api/vat/), modifie la logique pour :
   - Calculer automatiquement la deadline_date = 15 du mois suivant period_end
   - Calculer la pénalité si submitted_at > deadline_date
   - Utiliser les comptes SYSCOHADA :
     * TVA collectée : comptes commençant par "4431" ou "443"
     * TVA déductible : comptes commençant par "445" (4451, 4452, 4453, 4454)
     * TVA due = collectée - déductible (si positif)
     * Crédit TVA = déductible - collectée (si positif, reportable)

5. Le taux standard au Bénin est de 18%. Il existe des opérations exonérées (taux 0%) et quelques taux spécifiques.

Code actuel de l'enum à remplacer (ligne 96-99 de prisma/schema.prisma) :
enum VatDeclarationType {
  CA3
  CA12
}

Note : La logique de calcul TVA dans src/lib/accounting.ts (fonction calculateVatForPeriod) utilise déjà les bons préfixes de comptes (4457 pour collectée, 4456 pour déductible). Il faut juste vérifier que ça correspond aux comptes SYSCOHADA (443x pour collectée, 445x pour déductible).
```

---

---

## FICHE 4 — Intégration API e-MECeF

### Contexte

Le schema Prisma a déjà les champs nécessaires sur le modèle `Invoice` :
- `mecef_status` (enum: draft, awaiting_manual_normalization, normalized, verification_failed)
- `mecef_dgi_code` (String?)
- `mecef_nim` (String?)

Mais **aucun appel API** n'est fait vers le serveur de la DGI. Le MECeF (Machine Électronique Certifiée de Facturation) est obligatoire au Bénin. Le e-MECeF est la version logicielle (API REST) qui remplace le boîtier physique.

### Fonctionnement du e-MECeF

```
Flux de normalisation d'une facture :
1. L'entreprise doit être inscrite auprès de la DGI et obtenir :
   - Un NIM (Numéro d'Identification Machine) pour son logiciel
   - Un token d'authentification API
   - L'URL du serveur (sandbox pour test, production pour le réel)

2. Quand une facture est créée :
   POST vers l'API e-MECeF avec les données de la facture
   → La DGI valide et retourne :
     - Un code de validation (mecef_dgi_code)
     - Un QR code (à imprimer sur la facture)
     - Un numéro de séquence

3. La facture ne peut circuler légalement qu'avec cette validation.

4. En cas d'erreur réseau : la facture est stockée localement avec le statut
   "awaiting_manual_normalization" et retransmise dès que la connexion revient.
```

### Fichiers concernés

- `src/lib/mecef.ts` → **à créer** (client API e-MECeF)
- `src/app/api/invoices/` → modifier pour appeler le MECeF après création
- `prisma/schema.prisma` → ajouter `mecef_qr_code String?` au modèle Invoice
- `.env` → ajouter les variables MECeF

### Prompt Antigravity

```
Contexte : Projet Brightbook Studio (Comptia), SaaS comptable pour le Bénin.

Le e-MECeF est le système de facturation normalisée de la DGI du Bénin. Chaque facture doit être transmise au serveur DGI avant d'être remise au client.

Tâche :

1. Crée src/lib/mecef.ts avec :

   - Variables d'environnement nécessaires :
     MECEF_API_URL (sandbox: https://developper.impots.bj/sygmef-emcef/api/invoice)
     MECEF_NIM (Numéro d'Identification Machine attribué par la DGI)
     MECEF_TOKEN (token d'authentification)

   - Une interface MecefInvoicePayload contenant :
     {
       nim: string,
       type: "FV" | "FA" | "EV" | "EA",  // FV=Facture de Vente, FA=Facture d'Avoir, EV=Export Vente, EA=Export Avoir
       items: Array<{
         name: string,
         price: number,
         quantity: number,
         taxGroup: "A" | "B" | "C" | "D" | "E" | "F",  // A=18%, B=0%, etc.
       }>,
       client?: {
         ifu?: string,
         name: string,
         contact?: string,
       },
       operator: {
         id: string,
         name: string,
       },
       reference?: string,
       payment: {
         cashAmount: number,
         checkAmount?: number,
         cardAmount?: number,
         transferAmount?: number,
       },
     }

   - Une interface MecefResponse :
     {
       uid: string,        // identifiant unique DGI
       nim: string,
       dateTime: string,
       qrCode: string,     // URL ou data du QR code
       codeMECeFDGI: string,
       counters: { ... },
       errorCode?: number,
       errorDesc?: string,
     }

   - Une fonction async normalizeInvoice(invoice: Invoice & { lines: InvoiceLine[], client: ThirdParty }): Promise<MecefResponse>
     qui transforme la facture Prisma en MecefInvoicePayload et fait le POST

   - Une fonction async retryPendingInvoices(prisma, companyId) qui reprend les factures en statut "awaiting_manual_normalization"

2. Ajoute un champ mecef_qr_code (String?) au modèle Invoice dans prisma/schema.prisma

3. Dans src/app/api/invoices/ (la route POST de création), après la création de la facture en base :
   - Appeler normalizeInvoice()
   - Si succès : mettre à jour mecef_status = "normalized", mecef_dgi_code, mecef_nim, mecef_qr_code
   - Si échec réseau : mettre mecef_status = "awaiting_manual_normalization"
   - Si erreur DGI : mettre mecef_status = "verification_failed"

4. Le QR code doit apparaître sur le PDF de la facture (src/lib/pdf-templates/InvoicePDF.tsx)

Important :
- L'API e-MECeF officielle peut changer. Utilise une abstraction (interface + implémentation) pour pouvoir adapter facilement.
- En mode développement (MECEF_API_URL contient "sandbox" ou est absent), simule la réponse sans appeler l'API réelle.
- L'enum MecefStatus existe déjà dans le schema : draft | awaiting_manual_normalization | normalized | verification_failed
```

---

---

## FICHE 5 — Génération DSF (États Financiers SYSCOHADA)

### Contexte

La DSF (Déclaration Statistique et Fiscale) est le document annuel que **toute entreprise béninoise** doit déposer à la DGI et à l'INSAE avant le **30 avril** de chaque année. Elle comprend :

1. **Le Bilan** — ce que l'entreprise possède (actif) vs ce qu'elle doit (passif)
2. **Le Compte de Résultat** — les produits moins les charges = bénéfice ou perte
3. **Le TAFIRE** (Tableau Financier des Ressources et Emplois) — d'où vient l'argent et où il est allé
4. **Les Annexes** — notes explicatives et tableaux complémentaires

Actuellement, le module Reporting existe (`src/views/Reporting.tsx`, `src/app/api/reporting/`) mais il ne génère pas ces documents au format SYSCOHADA.

### Structure des états financiers SYSCOHADA

```
BILAN SYSCOHADA :
═══════════════

ACTIF :
├── ACTIF IMMOBILISÉ
│   ├── Charges immobilisées (comptes 20)
│   ├── Immobilisations incorporelles (comptes 21)
│   ├── Immobilisations corporelles (comptes 22, 23, 24)
│   ├── Avances et acomptes (comptes 25)
│   └── Immobilisations financières (comptes 26, 27)
│   (Montants bruts - Amortissements comptes 28 - Dépréciations comptes 29)
│
├── ACTIF CIRCULANT
│   ├── Stocks (comptes 31 à 38, nets de dépréciation 39)
│   ├── Créances clients (comptes 41, nets de dépréciation 49)
│   └── Autres créances (comptes 42 à 48)
│
└── TRÉSORERIE-ACTIF
    ├── Banques (comptes 52)
    ├── Caisse (comptes 54, 57)
    └── Autres (comptes 51, 53, 55, 58)

PASSIF :
├── CAPITAUX PROPRES
│   ├── Capital (comptes 10)
│   ├── Réserves (comptes 11)
│   ├── Report à nouveau (comptes 12)
│   └── Résultat net (comptes 13)
│
├── DETTES FINANCIÈRES
│   ├── Emprunts (comptes 16)
│   └── Provisions (comptes 19)
│
├── PASSIF CIRCULANT
│   ├── Fournisseurs (comptes 40)
│   ├── Dettes fiscales et sociales (comptes 43, 44)
│   └── Autres dettes (comptes 42, 45 à 48)
│
└── TRÉSORERIE-PASSIF
    └── Crédits de trésorerie (comptes 56)

COMPTE DE RÉSULTAT SYSCOHADA :
══════════════════════════════

ACTIVITÉS ORDINAIRES :
+ Ventes de marchandises (701)
+ Production vendue (702 à 706)
+ Produits accessoires (707)
= CHIFFRE D'AFFAIRES

- Achats de marchandises (601)
- Variation de stocks de marchandises (603)
= MARGE BRUTE SUR MARCHANDISES

- Matières premières et fournitures (602, 604, 605, 608)
- Variation de stocks de matières (603)
- Transports (61)
- Services extérieurs (62, 63)
= VALEUR AJOUTÉE

+ Subventions d'exploitation (71)
- Impôts et taxes (64)
- Charges de personnel (66)
= EXCÉDENT BRUT D'EXPLOITATION (EBE)

+ Reprises de provisions (78)
+ Autres produits (75)
- Dotations aux amortissements et provisions (68)
- Autres charges (65)
= RÉSULTAT D'EXPLOITATION

+ Produits financiers (76, 77)
- Charges financières (67)
= RÉSULTAT FINANCIER

RÉSULTAT DES ACTIVITÉS ORDINAIRES = Résultat d'exploitation + Résultat financier

HORS ACTIVITÉS ORDINAIRES (HAO) :
+ Produits HAO (82, 84, 86, 88)
- Charges HAO (81, 83, 85, 87)
= RÉSULTAT HAO

- Participation des travailleurs (87)
- Impôts sur le résultat (89)
= RÉSULTAT NET
```

### Fichiers concernés

- `src/lib/dsf.ts` → **à créer**
- `src/app/api/reporting/dsf/route.ts` → **à créer**
- `src/views/Reporting.tsx` → ajouter un onglet DSF

### Prompt Antigravity

```
Contexte : Projet Brightbook Studio (Comptia), SaaS comptable pour le Bénin.
Stack : Next.js App Router + Prisma + PostgreSQL.

La DSF (Déclaration Statistique et Fiscale) est le document annuel obligatoire au Bénin (dépôt avant le 30 avril). Elle contient le Bilan, le Compte de Résultat et le TAFIRE au format SYSCOHADA.

Tâche :

1. Crée src/lib/dsf.ts avec les fonctions suivantes :

   a) generateBilan(prisma, companyId, fiscalYearEnd: Date)
      - Agrège les soldes de tous les comptes par classe SYSCOHADA
      - Retourne un objet structuré :
        {
          actif: {
            actifImmobilise: { brut, amortissements, net, details: [...] },
            actifCirculant: { brut, depreciations, net, details: [...] },
            tresorerieActif: { montant, details: [...] },
            totalActif: number
          },
          passif: {
            capitauxPropres: { montant, details: [...] },
            dettesFinancieres: { montant, details: [...] },
            passifCirculant: { montant, details: [...] },
            tresoreriePassif: { montant, details: [...] },
            totalPassif: number
          }
        }
      - Le bilan doit être ÉQUILIBRÉ : totalActif === totalPassif

   b) generateCompteResultat(prisma, companyId, startDate, endDate)
      - Agrège les mouvements des comptes de classes 6, 7, 8
      - Calcule les soldes intermédiaires de gestion SYSCOHADA :
        * Marge brute sur marchandises
        * Valeur ajoutée
        * EBE (Excédent Brut d'Exploitation)
        * Résultat d'exploitation
        * Résultat financier
        * Résultat des activités ordinaires
        * Résultat HAO
        * Résultat net
      - Retourne un objet structuré avec chaque ligne et son montant

   c) generateTAFIRE(bilan, compteResultat, bilanPrecedent?)
      - Tableau Financier des Ressources et Emplois
      - Calcule la CAF (Capacité d'Auto-Financement)
      - Compare avec l'exercice précédent pour les variations

2. Crée src/app/api/reporting/dsf/route.ts (GET) :
   - Paramètres : fiscal_year (ex: 2025)
   - Appelle les 3 fonctions ci-dessus
   - Retourne le JSON complet

3. Dans src/views/Reporting.tsx, ajoute un onglet "DSF / États Financiers" qui :
   - Permet de sélectionner l'exercice fiscal
   - Affiche le Bilan en tableau (Actif | Passif côte à côte)
   - Affiche le Compte de Résultat avec les SIG
   - Bouton "Exporter en PDF" pour impression

Le calcul des soldes utilise la logique existante de calculateAccountBalance() dans src/lib/accounting.ts :
- Asset & Expense : solde = débits - crédits
- Liability, Equity & Revenue : solde = crédits - débits

Ne traiter que les écritures en statut "posted" ou "validated" (pas "draft").

[COLLER ICI LA STRUCTURE BILAN + COMPTE DE RÉSULTAT CI-DESSUS]
```

---

---

## FICHE 6 — Modules Conditionnels par Secteur d'Activité

### Contexte

Le modèle `Company` a un champ `sector` (String) mais il n'influence rien dans l'interface. Un cabinet d'avocats n'a pas besoin de stock. Un consultant n'a pas besoin de gestion des achats complexe. L'idée : à la création de l'entreprise, le secteur détermine quels modules sont visibles dans la sidebar.

### Fichiers concernés

- `src/components/layout/AppSidebar.tsx` → conditionner les liens
- `prisma/schema.prisma` → transformer `sector` en enum
- `src/app/register/page.tsx` → proposer le choix du secteur

### Prompt Antigravity

```
Contexte : Projet Brightbook Studio (Comptia), SaaS comptable pour le Bénin.

Le champ "sector" sur le modèle Company est un String vide par défaut. Je veux qu'il devienne un enum qui conditionne les modules visibles dans la sidebar.

Tâche :

1. Dans prisma/schema.prisma, remplace le champ sector par un enum :

   enum BusinessSector {
     commerce_general      // Commerce général / distribution
     services              // Prestations de services / consulting
     btp                   // BTP / Construction
     restauration          // Restauration / Hôtellerie
     transport             // Transport / Logistique
     sante                 // Santé / Pharmacie
     education             // Éducation / Formation
     agriculture           // Agriculture / Agro-industrie
     industrie             // Industrie / Production
     profession_liberale   // Professions libérales (avocats, notaires, architectes)
     tech                  // Technologies / Digital
     autre                 // Autre
   }

2. Crée un fichier src/constants/sector-modules.ts qui mappe chaque secteur aux modules autorisés :

   const SECTOR_MODULES = {
     commerce_general: ["dashboard", "facturation", "comptabilite", "stock", "tiers", "tva", "paie", "documents", "reporting", "parametres"],
     services: ["dashboard", "facturation", "comptabilite", "tiers", "tva", "paie", "documents", "reporting", "parametres"],
     btp: ["dashboard", "facturation", "comptabilite", "stock", "tiers", "tva", "paie", "documents", "reporting", "chantiers", "parametres"],
     restauration: ["dashboard", "facturation", "comptabilite", "stock", "caisse", "tiers", "tva", "paie", "documents", "reporting", "parametres"],
     profession_liberale: ["dashboard", "facturation", "comptabilite", "tiers", "tva", "documents", "reporting", "parametres"],
     // ... etc pour chaque secteur
   }

   Le noyau commun à TOUS les secteurs : dashboard, facturation, comptabilite, tiers, tva, documents, reporting, parametres.
   
   Modules optionnels selon secteur :
   - stock : commerce, restauration, industrie, agriculture
   - paie : tout sauf profession_liberale en solo (optionnel = activable)
   - caisse (POS) : commerce, restauration
   - chantiers : BTP

3. Dans src/components/layout/AppSidebar.tsx, filtre les liens de navigation en fonction du secteur de l'entreprise connectée.

4. Dans src/app/register/page.tsx, ajoute une étape de sélection du secteur avec des icônes et descriptions claires.
```

---

---

## FICHE 7 — Alertes Fiscales Automatiques

### Contexte

Le système de notifications existe déjà (modèle `Notification`, routes API, vue dans le header). Mais il n'y a pas de logique automatique pour alerter sur les échéances fiscales. Au Bénin, les principales échéances récurrentes sont :

- **TVA** : dépôt avant le 15 de chaque mois
- **AIR** (Acompte sur Impôt assis sur les Revenus) : même échéance que TVA
- **RAS** (Retenue À la Source) : même échéance
- **Patente** : annuelle
- **IS** (Impôt sur les Sociétés) : acomptes trimestriels + solde annuel
- **DSF** : dépôt avant le 30 avril
- **CNSS** : déclaration trimestrielle des cotisations

### Fichiers concernés

- `src/lib/fiscal-alerts.ts` → **à créer**
- `src/app/api/notifications/fiscal/route.ts` → **à créer** (cron ou appel régulier)

### Prompt Antigravity

```
Contexte : Projet Brightbook Studio (Comptia), SaaS comptable pour le Bénin.

Le modèle Notification existe déjà avec les champs : id, company_id, user_id, title, message, type (info/success/warning/error), is_read, link, created_at.

Tâche :

1. Crée src/lib/fiscal-alerts.ts avec :

   - Un tableau FISCAL_CALENDAR qui définit les échéances récurrentes au Bénin :
     [
       { code: "TVA", label: "Déclaration de TVA", frequency: "monthly", dayOfMonth: 15, reminderDaysBefore: [7, 3, 1] },
       { code: "AIR", label: "Acompte sur Impôt (AIR)", frequency: "monthly", dayOfMonth: 15, reminderDaysBefore: [7, 3, 1] },
       { code: "RAS", label: "Retenue À la Source (RAS)", frequency: "monthly", dayOfMonth: 15, reminderDaysBefore: [7, 3, 1] },
       { code: "CNSS", label: "Déclaration CNSS", frequency: "quarterly", monthsOfYear: [3, 6, 9, 12], dayOfMonth: 15, reminderDaysBefore: [14, 7, 3] },
       { code: "IS_ACOMPTE", label: "Acompte IS", frequency: "quarterly", monthsOfYear: [3, 6, 9, 12], dayOfMonth: 15, reminderDaysBefore: [14, 7] },
       { code: "DSF", label: "Dépôt DSF (états financiers annuels)", frequency: "annual", month: 4, dayOfMonth: 30, reminderDaysBefore: [30, 14, 7, 3, 1] },
       { code: "PATENTE", label: "Paiement de la patente", frequency: "annual", month: 3, dayOfMonth: 31, reminderDaysBefore: [30, 14, 7] },
     ]

   - Une fonction async generateFiscalAlerts(prisma, companyId, today: Date) qui :
     * Parcourt le FISCAL_CALENDAR
     * Pour chaque échéance, vérifie si un rappel doit être envoyé
     * Crée une Notification avec le bon type (warning si < 3 jours, info sinon)
     * Évite les doublons (ne pas recréer une alerte déjà envoyée pour la même échéance)

   - Une fonction async checkOverdueInvoices(prisma, companyId) qui :
     * Cherche les factures en statut "sent" dont la due_date est dépassée
     * Crée des notifications pour chaque facture en retard
     * Met à jour le statut de la facture à "overdue"

2. Crée src/app/api/notifications/fiscal/route.ts (POST) :
   - Appelle generateFiscalAlerts() et checkOverdueInvoices()
   - Peut être appelé par un cron job (Render cron, Vercel cron, etc.)
   - Retourne le nombre d'alertes créées

3. Les notifications doivent avoir un lien (champ "link") vers la page concernée :
   - TVA → "/tva"
   - Facture en retard → "/facturation"
   - DSF → "/reporting"
   - Paie/CNSS → "/paie"
```

---

---

## FICHE 8 — Barème IPTS Progressif (Détail)

### Contexte

Cette fiche complète la Fiche 2 (Paie) avec le détail du calcul de l'IPTS (Impôt Progressif sur Traitements et Salaires) qui est le principal impôt sur le revenu des salariés au Bénin. C'est un barème par tranche, similaire au principe de l'impôt sur le revenu en France mais avec des tranches et taux différents.

### Prompt Antigravity

```
Contexte : Suite de la correction de la paie béninoise.

Le calcul de l'IPTS (Impôt Progressif sur Traitements et Salaires) au Bénin fonctionne par tranches, comme l'IR français. Voici la logique exacte :

1. Salaire imposable = Salaire brut - Cotisation CNSS salariale (3.6%, plafonné à 600 000 FCFA)

2. On applique un abattement forfaitaire de 20% sur le salaire imposable (pour frais professionnels).
   Base imposable = Salaire imposable × 0.80

3. On applique le barème progressif MENSUEL sur la base imposable :

   function calculateIPTS(monthlyTaxableBase: number): number {
     let tax = 0;
     let remaining = monthlyTaxableBase;

     const brackets = [
       { limit: 50000, rate: 0 },
       { limit: 80000, rate: 0.10 },    // 50 001 à 130 000
       { limit: 150000, rate: 0.15 },   // 130 001 à 280 000
       { limit: 300000, rate: 0.20 },   // 280 001 à 580 000
       { limit: Infinity, rate: 0.25 }, // au-delà de 580 000
     ];

     for (const bracket of brackets) {
       if (remaining <= 0) break;
       const taxable = Math.min(remaining, bracket.limit);
       tax += taxable * bracket.rate;
       remaining -= taxable;
     }

     return Math.round(tax); // arrondi au franc CFA
   }

4. Exemple concret pour un salaire brut de 400 000 FCFA :
   - CNSS salariale : 400 000 × 3.6% = 14 400 FCFA
   - Salaire imposable : 400 000 - 14 400 = 385 600 FCFA
   - Abattement 20% : 385 600 × 0.80 = 308 480 FCFA (base imposable)
   - IPTS :
     * 0 à 50 000 → 0% = 0
     * 50 001 à 130 000 (80 000) → 10% = 8 000
     * 130 001 à 280 000 (150 000) → 15% = 22 500
     * 280 001 à 308 480 (28 480) → 20% = 5 696
     * Total IPTS = 36 196 FCFA
   - Net = 400 000 - 14 400 - 36 196 = 349 404 FCFA

Crée ou mets à jour la fonction dans src/lib/accounting.ts et expose les constantes du barème dans src/constants/payroll.ts pour qu'elles soient modifiables facilement si les taux changent.

Note : Ces taux sont approximatifs et doivent être vérifiés avec le CGI Bénin en vigueur. Le code doit être structuré pour que les taux soient facilement modifiables (constantes, pas de valeurs en dur dans la logique).
```

---

---

## FICHE 9 — Types de Société Béninois

### Contexte

L'enum `CompanyType` contient `SARL, EIRL, SAS, MICRO, AUTO`. `EIRL` et `AUTO` (auto-entrepreneur) **n'existent pas en droit OHADA/Bénin**. Les formes juridiques au Bénin sont régies par l'Acte Uniforme OHADA.

### Prompt Antigravity

```
Contexte : Projet Brightbook Studio (Comptia), SaaS comptable pour le Bénin.

L'enum CompanyType dans prisma/schema.prisma contient des formes juridiques françaises. Le Bénin applique le droit OHADA.

Tâche : Remplace l'enum CompanyType par les formes juridiques OHADA applicables au Bénin :

enum CompanyType {
  EI          // Entreprise Individuelle
  SARL        // Société à Responsabilité Limitée (capital min : variable, au moins 1 FCFA)
  SA          // Société Anonyme (capital min : 10 000 000 FCFA)
  SAS         // Société par Actions Simplifiée (capital libre)
  SNC         // Société en Nom Collectif
  SCS         // Société en Commandite Simple
  GIE         // Groupement d'Intérêt Économique
  SUARL       // Société Unipersonnelle à Responsabilité Limitée (SARL à associé unique)
  COOP        // Société coopérative (Acte Uniforme OHADA sur les coopératives)
  ASSOCIATION // Association à but lucratif ou ONG (pas soumise aux mêmes obligations)
}

Mets aussi à jour :
- src/app/register/page.tsx pour afficher les bonnes options avec une description de chaque forme
- Les formulaires qui affichent le type de société

Note : La SUARL est très courante au Bénin pour les entrepreneurs solo. La SAS est privilégiée pour les startups et les co-entreprises.
```

---

---

## FICHE 10 — Moyens de Paiement Béninois

### Contexte

L'enum `PaymentMethod` contient `bank_transfer, check, cash, credit_card`. Il manque les moyens de paiement les plus utilisés au Bénin : **Mobile Money** (MTN MoMo et Moov Money), très répandus y compris pour les paiements professionnels.

### Prompt Antigravity

```
Contexte : Projet Brightbook Studio (Comptia), SaaS comptable pour le Bénin.

L'enum PaymentMethod dans prisma/schema.prisma ne reflète pas les moyens de paiement utilisés au Bénin.

Tâche : Remplace l'enum par :

enum PaymentMethod {
  cash              // Espèces
  bank_transfer     // Virement bancaire
  check             // Chèque
  mobile_money_mtn  // MTN Mobile Money (MoMo)
  mobile_money_moov // Moov Money (Moov Africa)
  mobile_money_celtiis // Celtiis Money (si applicable)
  credit_card       // Carte bancaire (rare mais existe)
  western_union     // Western Union / transfert international
  other             // Autre
}

Mets aussi à jour :

1. src/lib/accounting.ts, fonction generatePaymentEntryLines() :
   Le compte comptable dépend du moyen de paiement :
   - cash → compte 541 (Caisse siège)
   - bank_transfer → compte 521 (Banques locales)
   - check → compte 511 (Valeurs à encaisser) ou 521
   - mobile_money_mtn, mobile_money_moov, mobile_money_celtiis → compte 585 (ou 571, à définir — sous-compte de trésorerie dédié Mobile Money)
   - credit_card → compte 521
   - western_union → compte 521

2. Tous les formulaires/selects qui utilisent PaymentMethod (facturation, paiements, rapprochement bancaire) pour afficher les labels en français.

3. Dans le rapprochement bancaire (src/views/Rapprochement.tsx), prévoir la possibilité d'importer des relevés Mobile Money (format différent des relevés bancaires classiques).

Note : Au Bénin, le Mobile Money représente un volume de transactions très important, surtout pour les PME. Les relevés MoMo/Moov sont disponibles en CSV ou via SMS. L'intégration avec les API MTN MoMo / Moov Money pour le rapprochement automatique serait un avantage concurrentiel majeur (à prévoir en V2).
```

---

---

## 📌 Ordre d'Exécution Recommandé

```
Phase 1 — Fondations (faire en premier, tout le reste en dépend)
  ① Fiche 9  — Types de société béninois (migration schema simple)
  ② Fiche 10 — Moyens de paiement béninois (migration schema simple)
  ③ Fiche 1  — Plan comptable SYSCOHADA (seed) ← CRITIQUE
  ④ Fiche 3  — TVA format Bénin

Phase 2 — Conformité légale
  ⑤ Fiche 2  — Correction paie (taux béninois)
  ⑥ Fiche 8  — Barème IPTS détaillé (complète la fiche 2)
  ⑦ Fiche 4  — Intégration e-MECeF

Phase 3 — Valeur ajoutée
  ⑧ Fiche 5  — Génération DSF
  ⑨ Fiche 7  — Alertes fiscales automatiques
  ⑩ Fiche 6  — Modules conditionnels par secteur
```

---

*Document généré le 26 août 2026 — Brightbook Studio / Comptia*
