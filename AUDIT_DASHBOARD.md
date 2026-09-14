# 📊 Audit Exhaustif du Dashboard Actuel (Owner / Dirigeant) — Ceilow

> **Document de cadrage et d'analyse technique & UX**  
> Ce document établit un état des lieux exhaustif ligne par ligne de la page `/dashboard`, des composants associés et de la route API sous-jacente (`/api/dashboard/stats`), en regard des règles obligatoires Ceilow et de la Constitution du projet. Il sert de base formelle avant toute spécification (`/speckit-specify`).

---

## 1. Vue d'Ensemble & Périmètre Analysé

| Fichier / Élément | Rôle Actuel | Lignes / Taille |
| :--- | :--- | :--- |
| [`src/app/dashboard/page.tsx`](file:///e:/Comptia/src/app/dashboard/page.tsx) | Page Next.js (App Router), Suspense & AppShell | 22 lignes (662 octets) |
| [`src/views/Dashboard.tsx`](file:///e:/Comptia/src/views/Dashboard.tsx) | Vue principale React (KPIs, Recharts, listes, modales) | 310 lignes (14 471 octets) |
| [`src/components/dashboard/KpiCard.tsx`](file:///e:/Comptia/src/components/dashboard/KpiCard.tsx) | Carte KPI unitaire avec sparkline Recharts | 77 lignes (3 551 octets) |
| [`src/components/dashboard/PageHeader.tsx`](file:///e:/Comptia/src/components/dashboard/PageHeader.tsx) | En-tête de page standard avec titre, sous-titre et actions | 17 lignes (612 octets) |
| [`src/components/dashboard/StatusBadge.tsx`](file:///e:/Comptia/src/components/dashboard/StatusBadge.tsx) | Badges de statuts (factures, opérations) | 47 lignes (2 616 octets) |
| [`src/app/api/dashboard/stats/route.ts`](file:///e:/Comptia/src/app/api/dashboard/stats/route.ts) | Endpoint API agrégeant les statistiques réelles | 322 lignes (11 921 octets) |

---

## 2. Inventaire Détaillé de l'Existant (Ce qui est en place)

### 2.1. Données Fournies par l'API Backend (`/api/dashboard/stats`)
L'API calcule en direct sur Prisma / PostgreSQL les données suivantes :
- **Permissions & Accès (`available`)** : Liste des modules autorisés pour l'utilisateur (`dashboard`, `invoices`, `accounting_entries`, `bank_reconciliation`, `vat_declarations`, `payroll`).
- **KPI Chiffre d'affaires (`kpis.ca`)** : Solde net des comptes de classe 7 (Crédit - Débit des écritures validées/comptabilisées) + taux d'évolution `%` vs mois $M-1$ (`caGrowth`) + historique quotidien sur 10 jours (`caSpark`).
- **KPI Charges totales (`kpis.charges`)** : Solde net des comptes de classe 6 (Débit - Crédit des écritures validées/comptabilisées) + taux d'évolution `%` vs mois $M-1$ (`chargesGrowth`) + historique quotidien sur 10 jours (`chargesSpark`).
- **KPI Résultat net (`kpis.netResult`)** : Différence `CA - Charges` + évolution vs $M-1$ (`netResultGrowth`).
- **KPI Trésorerie (`kpis.tresorerie`)** : Solde des comptes de classe 5 (banque/caisse) + `initial_treasury_balance` de l'entreprise.
- **KPI TVA à payer (`kpis.tvaAPayer`)** : Estimation de TVA nette due calculée via le moteur réglementaire SYSCOHADA Bénin (`calculateVatForPeriod`).
- **KPI Factures impayées (`kpis.facturesImpayees` & `kpis.facturesImpayeesMontant`)** : Nombre et montant total TTC des factures non soldées (`draft`, `sent`, `viewed`, `overdue`).
- **Masse Salariale (`kpis.payrollTotal`)** : Somme des salaires nets validés/traités du mois (`prisma.payroll.aggregate`). **⚠️ Donnée calculée côté serveur mais totalement ignorée et non affichée côté frontend !**
- **Historique 12 mois (`monthlyRevenue`)** : Tableau de 12 objets `{ month, ca, charges }`.
- **Répartition des dépenses (`expenseBreakdown`)** : Regroupement réel par comptes de charges à 3 chiffres (ex: 601, 605) avec libellés réels SYSCOHADA de la table `Account`.
- **Dernières factures (`invoices`)** : Les 5 dernières factures avec référence, client, date d'émission, montant TTC et statut.

### 2.2. Interface Utilisateur & Composants Actuels
- **En-tête (`PageHeader`)** :
  - Titre : `"Bonjour ${userName} 👋"` (avec extraction du prénom depuis `/api/auth/me`).
  - Sous-titre : `"Voici un aperçu de votre activité — ${currentMonthYear}"`.
  - Boutons d'actions :
    - Popover calendrier pour sélectionner une date (`date-fns` en français).
    - Bouton contour `+ Facture` qui ouvre `InvoiceModal`.
    - Bouton `+ Opération` qui ouvre `JournalEntryModal`.
- **Grille de 6 KPI Cards** :
  - 1. Chiffre d'affaires
  - 2. Charges totales
  - 3. Résultat net
  - 4. Trésorerie
  - 5. TVA à payer
  - 6. Factures impayées
- **Section Graphiques & Analytique** :
  - Graphique 1 : `LineChart` (Recharts) comparant CA et Charges sur 12 mois.
  - Graphique 2 : `PieChart` (Donut Recharts) analytique par poste de dépenses SYSCOHADA avec légende détaillée.
  - Graphique 3 : `AreaChart` "Historique Trésorerie".
  - Liste : Les 5 factures récentes avec redirection vers `/facturation`.

---

## 3. Analyse Critique & Violations des Règles Ceilow

### 🔴 A. Violations Critiques de la Charte Graphique & Tokens (Règle 2 & 3)
1. **Couleurs hexadécimales et HSL en dur** :
   - `src/components/dashboard/KpiCard.tsx` définit en dur : `stroke: "hsl(221 83% 53%)"`, `hsl(160 84% 39%)`, `hsl(24 95% 53%)`, `hsl(0 84% 60%)`.
   - `src/views/Dashboard.tsx` définit un dégradé SVG en dur : `stopColor="hsl(221 83% 53%)"`.
   - `globals.css` utilise encore la palette bleue héritée (`--primary: 221 83% 53%`) au lieu du jaune Ceilow (`#FFD946`), du brun foncé `ink` (`#332E29`), du vert menthe `success` (`#5FFFC2`), etc.
2. **Couleurs interdites hors palette** :
   - Classes Tailwind non autorisées : `bg-primary-soft`, `bg-success-soft`, `bg-warning-soft`, `bg-destructive-soft`, `bg-info-soft`, `text-info`.
3. **Dégradés artificiels (Règle 5)** :
   - Présence de la classe `bg-gradient-primary` sur le bouton "+ Opération" (`Dashboard.tsx:156`).
   - Présence de dégradés `linearGradient` sur les zones d'aires (`#cashGrad`, sparklines).

### 🔴 B. Typographie Non Conforme (Règle 4)
- Présence de la classe `font-display` (qui injecte Poppins/Clash) sur :
  - L'en-tête de page (`PageHeader.tsx:12`).
  - Les titres des blocs et graphiques (`Dashboard.tsx:180, 207, 239, 267`).
  - La valeur des KPI (`KpiCard.tsx:36`).
- **Règle absolue violée** : L'intérieur de l'application doit être **100% Inter**, avec activation obligatoire des chiffres tabulaires (`font-feature-settings: "tnum"`) sur tous les montants financiers.

### 🔴 C. Sobriété Visuelle & Respect des Interdictions (Règle 5)
- **Emoji présent** : `👋` dans le titre `"Bonjour ${userName} 👋"` (`Dashboard.tsx:124`). **Interdiction formelle des emojis.**
- **Classes glassmorphism** présentes dans le projet (`globals.css:145 .glass`), à proscrire totalement.

### 🔴 D. Intégrité des Données & Données Mockées (Règle 18 & Constitution Principe III)
- **Importation de mocks** : `KpiCard.tsx` importe `import { sparkline } from "@/data/mock";` (ligne 4) et génère des sparklines aléatoires (`data = customData || sparkline(sparkBase);`) pour le Résultat Net et la Trésorerie.
- **Fausses données sur l'Historique Trésorerie** :
  - Dans `Dashboard.tsx` (lignes 248-260), le composant `AreaChart` censé représenter "Historique Trésorerie (classe 5)" affiche en fait `dataKey="ca"` extrait de `monthlyRevenue` ! Le dirigeant voit donc la courbe du chiffre d'affaires étiquetée "Trésorerie".

### 🔴 E. Manque d'Explications sur les KPIs (Règle 10 & Constitution Principe V)
- Aucun des 6 KPI n'est vulgarisé :
  - **TVA à payer** : Simple mention "Estimation", sans expliquer qu'il s'agit de la TVA nette due calculée au 15 du mois (TVA collectée - TVA déductible).
  - **Trésorerie** : Aucun détail sur la répartition banque vs caisse vs Mobile Money.
  - **Résultat Net** : Pas d'indication de la formule (Produits classe 7 - Charges classe 6).
  - **Charges totales** : Aucune infobulle expliquant les charges d'exploitation vs charges financières.

### 🔴 F. Ergonomie, Mobile-First & Feedback Utilisateur (Règles 7, 8, 12, 17)
- **Feedback & Toasts** : Aucun toast lors des actualisations ou des erreurs.
- **Gestion des erreurs** : Message statique rouge non interactif (`Dashboard.tsx:100`) sans bouton pour réessayer.
- **Sélecteur de période inadapté** : Le composant utilise un `Calendar` de sélection de jour unique alors que la comptabilité et le pilotage d'entreprise se font par **Mois**, **Trimestre** ou **Exercice fiscal**.
- **Actions du dirigeant mal priorisées** : Les boutons actuels permettent d'ouvrir une facture ou une écriture brute, mais n'offrent pas d'actions directes de dirigeant (relance des factures impayées, déclaration TVA du 15, contrôle de la masse salariale).

---

## 4. Tableau Récapitulatif : Ce qu'il faut Enlever vs Ajouter

| Rubrique | Ce qu'il faut ENLEVER ❌ | Ce qu'il faut AJOUTER / REPRENDRE ✅ |
| :--- | :--- | :--- |
| **Identité Visuelle & Tokens** | - Emojis (`👋`)<br>- Dégradés `linearGradient` et `bg-gradient-primary`<br>- Couleurs hors palette (`hsl(221...)`, `info-soft`, etc.)<br>- `font-display` / Poppins dans l'app | - Tokens Ceilow stricts (`primary`, `ink`, `border`, etc.)<br>- Police Inter unique avec `font-feature-settings: "tnum"`<br>- Icônes Lucide pures avec labels accessibles |
| **Données & Mocks** | - `import { sparkline } from "@/data/mock"`<br>- Données de sparkline factices<br>- Fausse courbe de trésorerie basée sur le CA | - Exploitation à 100% des données API réelles (`sparks.ca`, `sparks.charges`)<br>- Affichage de la Masse Salariale (`kpis.payrollTotal` déjà calculé par l'API !)<br>- Données vraies ou état vide clair si pas d'historique |
| **KPIs & Pédagogie** | - Chiffres bruts sans explication | - Infobulles pédagogiques sur chaque KPI (formule, source SYSCOHADA, échéance légale)<br>- Badges de tendance avec micro-libellés explicatifs |
| **Pilotage Dirigeant (Owner)** | - Boutons basiques non hiérarchisés<br>- Sélecteur de date journalière | - Sélecteur de période comptable (Mois M, M-1, Trimestre, Année)<br>- Alertes réglementaires Bénin : échéance TVA DGI au 15 du mois, factures en retard<br>- Rapprochement Trésorerie vs Dettes à court terme |
| **Composants & Layout** | - Skeletons disproportionnés<br>- Message d'erreur statique | - Composants UI conformes 21st.dev / Ceilow<br>- Skeleton épousant la forme réelle<br>- Carte d'erreur avec bouton de rechargement<br>- Vue mobile-first testée sur 375px |

---

## 5. Spécification des KPIs Cibles pour le Dashboard Owner

Pour répondre parfaitement aux besoins d'un **propriétaire / dirigeant d'entreprise (Owner)** sous juridiction béninoise (SYSCOHADA / DGI / CNSS), les indicateurs clés doivent être structurés en 3 blocs logiques :

### Bloc 1 : Santé Financière Immédiate & Trésorerie
1. **Trésorerie Nette Disponible** : Solde réel des comptes 5 (Banque BOA + MTN MoMo + Caisse). Infobulle : *"Liquidités immédiatement disponibles pour l'exploitation"*.
2. **Créances Clients (Factures Impayées)** : Montant TTC restant dû + nombre de factures en retard. Infobulle : *"Montant total en attente d'encaissement. Action recommandée : relance client"*.
3. **Échéance Fiscale DGI (TVA au 15 du mois)** : Montant estimé de TVA nette due. Infobulle : *"TVA collectée - TVA déductible à télédéclarer et payer avant le 15 du mois suivant"*.

### Bloc 2 : Performance Économique & Exploitation
4. **Chiffre d'Affaires Réalisé** : Somme des comptes 7 validés sur la période + % d'évolution vs mois précédent + étincelle d'activité quotidienne réelle (`sparks.ca`).
5. **Charges d'Exploitation** : Somme des comptes 6 validés + % d'évolution + étincelle réelle (`sparks.charges`).
6. **Résultat Net d'Exploitation** : CA - Charges. Signal visuel positif (`success`) si bénéficiaire, neutre ou alerte (`error`) si déficitaire.
7. **Masse Salariale Nette (CNSS/Salariés)** : Tirée de `kpis.payrollTotal` (déjà dans l'API). Infobulle : *"Total des rémunérations nettes validées sur le mois"*.

### Bloc 3 : Visibilité Opérationnelle & Risques
- **Répartition Analytique des Dépenses** (comptes 60x, 61x, 62x, etc.) en anneau sobre sans dégradé avec étiquettes claires.
- **Courbe comparative CA vs Charges (12 mois)** avec chiffres tabulaires et infobulles monétaires précises.
- **Factures Récentes & Statuts e-MECeF** : Affichage des factures avec statut français traduit et lien direct vers le module de facturation.

---

## 6. Prochaines Étapes Recommandées

Ce document constitue la base d'analyse complète requise. Vous pouvez désormais :
1. Valider ces orientations ou ajuster les priorités pour le profil Owner.
2. Lancer la commande `/speckit-specify` pour générer la spécification formelle (`spec.md`) de la refonte du dashboard.
