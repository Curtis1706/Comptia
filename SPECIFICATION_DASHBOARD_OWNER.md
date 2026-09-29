# 📘 Spécification Complète du Dashboard Frontend (Cockpit Dirigeant / Owner) — Ceilow

> **Document de Référence Frontend — Prêt pour `/speckit-specify`**
> Ce document définit l'intégralité du nouveau frontend du Dashboard Ceilow pour le profil Dirigeant / Propriétaire d'entreprise (`owner`), sans modifier aucune ligne des routes backend existantes (`/api/dashboard/stats`, `/api/auth/me`).
> **Conformité stricte aux Règles Ceilow & Constitution v1.0.0** : 100% tokens sémantiques, zéro hexadécimal en dur, typographie Inter unique avec chiffres tabulaires (`tnum`), zéro emoji, zéro glassmorphisme, zéro mock, mobile-first (< 390px / >= 44px).

---

## 1. Vue d'Ensemble & Objectifs Produit

### 1.1. Profil Cible : Le Dirigeant de PME au Bénin (Owner)

Le dirigeant n'est pas un expert-comptable. Il a besoin en moins de **5 secondes** de réponses nettes à ses 4 questions vitales :

1. **Où en est ma trésorerie ?** (Combien j'ai en banque, en caisse et sur MTN MoMo).
2. **Combien me doivent mes clients ?** (Créances en retard, factures en souffrance).
3. **Quelles sont mes échéances légales immédiates ?** (TVA DGI à payer avant le 15 du mois, masse salariale nette).
4. **Mon activité est-elle rentable ce mois-ci ?** (Chiffre d'affaires vs Charges, Résultat net dégagé).

### 1.2. Contrat d'Intégrité Backend (Zéro modification des routes)

L'interface s'appuie à 100% sur les données déjà calculées et servies par :

- `GET /api/auth/me` : Données de session, prénom/nom, rôle, entreprise.
- `GET /api/dashboard/stats?date=ISO_STRING` : Agrégration financière temps réel (Prisma / PostgreSQL).

---

## 2. Charte Visuelle & Tokens Utilisés Exclusivement

Aucune couleur hexadécimale, aucun `gray-*` Tailwind par défaut, aucun dégradé, aucun flou.


| Token Sémantique      | Classe Tailwind                                | Utilisation sur le Dashboard                                             |
| :----------------------- | :----------------------------------------------- | :------------------------------------------------------------------------- |
| `primary`              | `bg-primary`, `text-primary`, `border-primary` | CTA principal, accent actif, focus ring, pastille CA                     |
| `ink`                  | `bg-ink`, `text-ink`                           | Texte principal en mode clair, fond principal en mode sombre             |
| `success`              | `bg-success`, `text-success`, `border-success` | Résultat net positif, croissance positive, statut "Payée"              |
| `warning`              | `bg-warning`, `text-warning`, `border-warning` | Échéance TVA proche, charges en hausse, statut "En retard"             |
| `error`                | `bg-error`, `text-error`, `border-error`       | Résultat net déficitaire, factures impayées critiques, état d'erreur |
| `background`           | `bg-background`                                | Fond de page (#FFFFFF clair / #332E29 sombre)                            |
| `background-secondary` | `bg-background-secondary`                      | Fond des cartes KPI, des sections graphiques, de la table                |
| `border`               | `border-border`                                | Lignes de séparation, contours de cartes, délimitation des tables      |
| `text-muted`           | `text-muted`                                   | Libellés secondaires, unités, dates, infobulles, tendances             |

### Typographie

- **Police unique** : `Inter` partout.
- **Chiffres tabulaires obligatoires** sur tous les montants et pourcentages : classe `tabular` (`font-feature-settings: "tnum"`).
- **Interdiction formelle de `font-display` / Poppins**.

### Sobriété & Accessibilité

- **Zéro emoji** (remplacés par des icônes vectorielles `lucide-react` avec `aria-label` et `title`).
- **Surfaces pleines et bordures nettes** : pas de `backdrop-blur`, pas de `bg-white/10`, pas d'ombres diffuses colorées.
- **Cibles tactiles** : boutons, filtres et liens $\ge 44\text{px}$ de hauteur sur mobile.

---

## 3. Découpage & Spécification Écran par Écran

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Header : Titre "Bonjour [Prénom]" | Période [Mois] | Actions [+ Facture] [+ Opération] │
├──────────────────────────────────────────────────────────────────────────────┤
│ Bannière d'Alerte Réglementaire DGI (TVA au 15 du mois & Factures impayées)    │
├──────────────────────────────────────────────────────────────────────────────┤
│ Grille des 6 KPIs Financiers Majeurs (avec Infobulles Pédagogiques)           │
│ [Trésorerie] [Créances Clients] [Résultat Net] [CA] [Charges] [TVA Due]       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Graphiques d'Exploitation :                                                  │
│ - Courbe Comparative CA vs Charges (12 mois) [2 cols]                         │
│ - Répartition Analytique des Dépenses SYSCOHADA [1 col]                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Rapprochement & Suivi Opérationnel :                                         │
│ - Masse Salariale & Suivi Trésorerie [1 col]                                 │
│ - Dernières Factures Émises & Statuts [2 cols]                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Textes, Micro-Copy & Éléments d'Interface Détaillés

### 4.1. En-tête de Page (`PageHeader`)

#### Libellés & Textes :

- **Titre H1** : `Tableau de bord` (ou `Bonjour {userName}` sans aucun emoji).
- **Sous-titre** : `Pilotage d'activité — {Mois Année}` (Ex: *Pilotage d'activité — Septembre 2026*).
- **Badge Rôle** : `Direction générale` (fond `bg-primary/10`, texte `text-ink font-medium text-xs px-2.5 py-0.5 rounded-md`).

#### Composant Sélecteur de Période Comptable :

- **Bouton déclencheur** :
  - Icône : `Calendar` (Lucide, 16px).
  - Texte : `{Mois Actuel Long} {Année}` (Ex: *Septembre 2026*).
  - Flèche : `ChevronDown` (Lucide, 14px).
  - Style : `h-10 px-3 border border-border bg-background-secondary text-ink rounded-lg text-sm`.
- **Menu déroulant (Popover)** :
  - Options rapides :
    - *Mois en cours* (défaut)
    - *Mois précédent*
    - *Trimestre en cours*
    - *Année en cours*
  - Sélecteur de date personnalisé (envoi du paramètre `?date=ISO_STRING` à l'API).

#### Boutons d'Action Rapide :

1. **Bouton Créer Facture** :
   - Icône : `FileText` (16px).
   - Libellé : `Nouvelle facture` (2 mots, action-first).
   - Style : `variant="outline"`, bordure `border-border`, fond `bg-background-secondary`, texte `text-ink`, hauteur `h-10`.
   - Action : Ouvre `InvoiceModal`.
2. **Bouton Saisie Opération** :
   - Icône : `Plus` (16px).
   - Libellé : `Saisir opération` (2 mots).
   - Style : Bouton d'accentuation `bg-primary text-ink hover:opacity-95 font-medium rounded-lg h-10 px-4`.
   - Action : Ouvre `JournalEntryModal`.

---

### 4.2. Bannière d'Avertissement Non-Bloquant (Bénin DGI / SYSCOHADA)

Une carte d'information contextuelle s'affiche en haut du dashboard lorsque des échéances critiques approchent :

- **Condition** : Si `kpis.tvaAPayer > 0` ou `kpis.facturesImpayees > 0`.
- **Style** : `rounded-xl border border-border bg-background-secondary p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`.
- **Contenu Gauche** :
  - Icône : `AlertCircle` (Lucide, couleur `text-warning`, taille 20px).
  - Texte principal : `Échéance fiscale DGI au 15 {mois_suivant}` : **{formatCFA(kpis.tvaAPayer)}** de TVA nette due estimée.
  - Sous-texte : `{kpis.facturesImpayees} factures en attente d'encaissement ({formatCFA(kpis.facturesImpayeesMontant)}).`
- **Contenu Droite (Actions)** :
  - Lien 1 : `Déclarer TVA` (Lien vers `/tva`, `text-xs font-semibold text-ink underline`).
  - Lien 2 : `Relancer impayés` (Lien vers `/facturation?tab=impayees`, `text-xs font-semibold text-ink underline`).

---

### 4.3. Grille des 6 KPIs Majeurs (Spécification Exhaustive)

Chaque carte KPI respecte la règle 10 : **aucun chiffre brut sans explication**. Une infobulle (`Tooltip` accessible avec icône `Info` de 14px) explique clairement le mode de calcul et la signification légale.

#### KPI 1 : Trésorerie Nette Disponible

- **Titre** : `Trésorerie disponible`
- **Valeur** : `formatCFA(kpis.tresorerie)` (ex: `14 250 000 FCFA`) — classe `tabular text-xl font-bold text-ink`.
- **Badge d'état** :
  - Si `kpis.tresorerie >= 0` : `Solde positif` (`text-success bg-success/10`).
  - Si `kpis.tresorerie < 0` : `Découvert bancaire` (`text-error bg-error/10`).
- **Infobulle explicative** :
  > *"Total des liquidités immédiatement mobilisables (comptes bancaires BOA, MTN Mobile Money et caisse espèces de classe 5 SYSCOHADA)."*
  >
- **Icône** : `Wallet` (Lucide).
- **Source API** : `kpis.tresorerie`.

#### KPI 2 : Créances Clients (Factures Impayées)

- **Titre** : `Créances clients`
- **Valeur** : `formatCFA(kpis.facturesImpayeesMontant)` (ex: `2 840 000 FCFA`) — classe `tabular text-xl font-bold text-ink`.
- **Sous-titre informatif** : `{kpis.facturesImpayees} factures en attente` (si > 0 : couleur `text-warning`, sinon `text-muted`).
- **Infobulle explicative** :
  > *"Montant total TTC des factures clients émises non soldées (statuts brouillon, envoyée, consultée et en retard). Nécessite une relance de recouvrement."*
  >
- **Icône** : `Clock` ou `Receipt` (Lucide).
- **Source API** : `kpis.facturesImpayeesMontant` & `kpis.facturesImpayees`.

#### KPI 3 : Résultat Net d'Exploitation

- **Titre** : `Résultat net`
- **Valeur** : `formatCFA(kpis.netResult)` (ex: `+3 450 000 FCFA`) — classe `tabular text-xl font-bold`.
- **Couleur de la valeur** :
  - Si $\ge 0$ : `text-success` (+ signe `+`).
  - Si $< 0$ : `text-error`.
- **Taux d'évolution** : `{kpis.netResultGrowth >= 0 ? "+" : ""}{kpis.netResultGrowth}% vs mois précédent`.
- **Infobulle explicative** :
  > *"Bénéfice ou perte comptable de la période calculé selon la formule SYSCOHADA : Total des produits (comptes 7) déduction faite des charges d'exploitation (comptes 6)."*
  >
- **Icône** : `TrendingUp` (si positif) ou `TrendingDown` (si négatif).
- **Source API** : `kpis.netResult` & `kpis.netResultGrowth`.

#### KPI 4 : Chiffre d'Affaires Réalisé

- **Titre** : `Chiffre d'affaires`
- **Valeur** : `formatCFA(kpis.ca)` — classe `tabular text-xl font-bold text-ink`.
- **Taux d'évolution** : `+{kpis.caGrowth}% vs mois précédent` avec icône flèche.
- **Sparkline** : Courbe compacte 10 jours tracée **strictement** sur `kpis.caSpark` (données réelles 100% de l'API, aucun mock).
- **Infobulle explicative** :
  > *"Montant total hors taxes des ventes de biens et prestations de services comptabilisées (comptes de classe 7 SYSCOHADA)."*
  >
- **Icône** : `ArrowUpRight` (Lucide).
- **Source API** : `kpis.ca`, `kpis.caGrowth`, `kpis.caSpark`.

#### KPI 5 : Charges d'Exploitation

- **Titre** : `Charges globales`
- **Valeur** : `formatCFA(kpis.charges)` — classe `tabular text-xl font-bold text-ink`.
- **Taux d'évolution** : `{kpis.chargesGrowth >= 0 ? "+" : ""}{kpis.chargesGrowth}% vs mois précédent`.
- **Sparkline** : Courbe compacte 10 jours tracée **strictement** sur `kpis.chargesSpark` (données réelles de l'API).
- **Infobulle explicative** :
  > *"Total des achats consommés, fournitures, loyers, services extérieurs et charges de personnel enregistrés (comptes de classe 6 SYSCOHADA)."*
  >
- **Icône** : `TrendingDown` (Lucide).
- **Source API** : `kpis.charges`, `kpis.chargesGrowth`, `kpis.chargesSpark`.

#### KPI 6 : Échéance TVA DGI (15 du mois)

- **Titre** : `TVA nette à décaisser`
- **Valeur** : `formatCFA(kpis.tvaAPayer)` — classe `tabular text-xl font-bold text-ink`.
- **Sous-titre** : `Échéance le 15 du mois` (classe `text-xs text-warning font-medium`).
- **Infobulle explicative** :
  > *"Estimation de la TVA à reverser à la Direction Générale des Impôts (DGI Bénin) : TVA facturée sur vos ventes diminuée de la TVA récupérable sur vos achats professionnels."*
  >
- **Icône** : `Building2` ou `Receipt` (Lucide).
- **Source API** : `kpis.tvaAPayer`.

---

### 4.4. Section Analytique & Graphiques (Données Réelles)

#### Graphique 1 : Évolution Comparée CA & Charges (12 Mois)

- **Titre du bloc** : `Activité annuelle : Ventes & Charges`
- **Sous-titre** : `Historique glissant sur 12 mois (SYSCOHADA)`
- **Légende claire** :
  - Pastille jaune Ceilow (`bg-primary`) : `Chiffre d'affaires`
  - Pastille ambre (`bg-warning`) : `Charges d'exploitation`
- **Rendu technique** :
  - `ResponsiveContainer` Recharts avec `BarChart` ou `LineChart` sobre sans dégradé.
  - Axe X : Abréviation des mois en français (`janv.`, `févr.`, `mars`...).
  - Axe Y : Montants formatés en Kilo/Millions (`100k`, `1M`, `5M`).
  - Tooltip personnalisé : Fond `bg-background`, bordure `border-border`, montants complets formatés en FCFA avec `formatCFA`.
- **Source API** : `raw.monthlyRevenue` (`[{ month, ca, charges }]`).

#### Graphique 2 : Répartition Analytique des Dépenses

- **Titre du bloc** : `Structure des coûts`
- **Sous-titre** : `Postes de charges de la période (Classe 6)`
- **Rendu technique** :
  - Donut `PieChart` Recharts (sans aucun dégradé, aplats de tokens autorisés).
  - Liste détaillée sous le graphique : pour chaque catégorie :
    - Puce colorée
    - Libellé du compte SYSCOHADA (ex: *Achats de marchandises*, *Services extérieurs*, *Transports*)
    - Montant exact formaté en FCFA (`tabular font-medium`)
    - Part en pourcentage (`%`)
- **État vide (si 0 dépense)** :
  - *"Aucune dépense comptabilisée sur cette période."*
- **Source API** : `raw.expenseBreakdown` (`[{ name, value, color }]`).

---

### 4.5. Section Rapprochement & Factures Récentes

#### Bloc Gauche : Indicateur Masse Salariale & Synthèse Trésorerie

- **Titre** : `Rémunérations & Charges Sociales`
- **Sous-titre** : `Bulletins validés du mois en cours`
- **Contenu** :
  - Montant principal : `formatCFA(kpis.payrollTotal)` (ex: `1 850 000 FCFA`).
  - Explication : *"Total des salaires nets d'impôts et cotisations CNSS préparés pour virement."*
  - Bouton discret : `Consulter la paie` (Lien vers `/paie`).
- **Source API** : `kpis.payrollTotal` (valeur récupérée de l'API).

#### Bloc Droite : Factures Récentes (Tableau Mobile-First)

- **Titre du bloc** : `Factures récentes`
- **Lien d'action** : `Toutes les factures` avec icône `ArrowUpRight` vers `/facturation`.
- **Affichage Desktop ($\ge 1024\text{px}$)** :
  - Lignes compactes avec :
    - Référence facture (ex: `FAC-2026-00042`) en `font-mono text-xs text-muted`.
    - Nom du client (ex: `Société Bénin Digital SARL`) en `font-medium text-sm text-ink truncate`.
    - Date d'émission formatée `DD/MM/YYYY`.
    - Montant TTC formaté `tabular font-semibold text-sm`.
    - Badge de statut conforme Ceilow.
- **Affichage Mobile ($< 1024\text{px}$)** :
  - Cartes empilées avec toutes les informations visibles sans scroll horizontal forcé (règle 11).
- **Statuts traduits & normalisés (Règle 11)** :
  - `paid` $\rightarrow$ `Payée` (fond `bg-success/10`, texte `text-success`, icône `CheckCircle2`)
  - `sent` $\rightarrow$ `Envoyée` (fond `bg-primary/10`, texte `text-ink`, icône `Send`)
  - `viewed` $\rightarrow$ `Consultée` (fond `bg-primary/10`, texte `text-ink`, icône `Eye`)
  - `overdue` $\rightarrow$ `En retard` (fond `bg-warning/10`, texte `text-warning`, icône `AlertTriangle`)
  - `draft` $\rightarrow$ `Brouillon` (fond `bg-background-secondary`, texte `text-muted`, icône `Clock`)
  - `cancelled` $\rightarrow$ `Annulée` (fond `bg-error/10`, texte `text-error`, icône `XCircle`)
- **État vide** :
  - *"Aucune facture émise sur cette période. Commencez par créer votre premier devis ou facture."*
  - Bouton d'action inline : `+ Créer une facture`.
- **Source API** : `raw.invoices` (`[{ id, client, date, montantTTC, status }]`).

---

## 5. États de Chargement, Erreurs & Feedback (Règles 7 & 8)

### 5.1. État de Chargement Initial (Skeleton Spécifique)

Conformément à la règle 8, **interdiction du spinner unique centré**. Le skeleton reproduit la géométrie exacte de l'écran final pour éviter tout Layout Shift :

- Squelette de l'en-tête (titre + sous-titre + boutons).
- Grille de 6 rectangles skeleton `h-32 rounded-xl` avec pulsation discrète (`animate-pulse`).
- Squelettes des 2 grands blocs graphiques `h-80 rounded-xl`.
- Squelette de la liste des factures `h-64 rounded-xl`.

### 5.2. État d'Erreur Réseau ou Serveur

- Carte d'erreur dédiée dans `bg-background-secondary border border-error/20 rounded-xl p-8 text-center`.
- Icône : `AlertTriangle` (`text-error`, 32px).
- Titre : `Impossible de charger les indicateurs du tableau de bord`.
- Message explicatif : *"Une anomalie est survenue lors de la synchronisation avec les écritures comptables. Vérifiez votre connexion ou réessayez."*
- Bouton d'action direct : `Réessayer` (`onClick={() => refetch()}`, avec spinner inline en cours de rechargement).
- Notification Toast : `toast.error("Échec de synchronisation des données financières")`.

### 5.3. Feedback Utilisateur sur les Actions (Toasts)

- Lors de la création d'une facture via `InvoiceModal` : `toast.success("Facture enregistrée avec succès")`.
- Lors de la saisie d'une écriture via `JournalEntryModal` : `toast.success("Écriture comptable validée")`.
- Rafraîchissement automatique des queries TanStack : `queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })`.

---

## 6. Découpage Modulaire des Composants (Architecture Recommandée)

```
src/
├── app/
│   └── dashboard/
│       └── page.tsx                 # AppShell + Suspense + Skeleton conforme
├── components/
│   └── dashboard/
│       ├── DashboardHeader.tsx      # En-tête, période, boutons d'action
│       ├── UrgentAlertBanner.tsx    # Alerte DGI 15 du mois & factures impayées
│       ├── KpiGrid.tsx              # Grille des 6 KPIs avec Tooltips explicatifs
│       ├── KpiCard.tsx              # Composant KPI unitaire 100% tokens Ceilow
│       ├── ActivityChart.tsx        # CA & Charges 12 mois (Recharts sobre)
│       ├── ExpenseBreakdown.tsx     # Donut analytique SYSCOHADA
│       ├── PayrollSummaryCard.tsx   # Masse salariale nette du mois
│       ├── RecentInvoicesList.tsx   # Table / Cartes empilées mobile-first
│       ├── DashboardSkeleton.tsx    # Skeleton géométrique fidèle
│       └── StatusBadge.tsx          # Badges sans dépendance mock
└── views/
    └── Dashboard.tsx                # Vue assemblée & logique TanStack Query
```

---

## 7. Checklist de Conformité avant Lancement `/speckit-specify`

- [X]  **Zéro modification backend** : Toutes les données proviennent de `/api/dashboard/stats` et `/api/auth/me`.
- [X]  **Zéro couleur hors palette** : 100% variables sémantiques Ceilow (`primary`, `ink`, `border`, `text-muted`, etc.).
- [X]  **Zéro dégradé artificiel** : Suppression de `linearGradient` et `bg-gradient-primary`.
- [X]  **Zéro emoji** : Aucun emoji présent dans le titre, les boutons ou les badges.
- [X]  **Typographie stricte** : 100% Inter avec activation `font-feature-settings: "tnum"`.
- [X]  **Zéro mock** : Suppression de `sparkline` de `@/data/mock` ; utilisation exclusive des sparks réels de l'API.
- [X]  **Règle 10 respectée** : Tous les KPIs disposent d'une infobulle pédagogique sur leur mode de calcul.
- [X]  **Mobile-First garanti** : Cibles $\ge 44\text{px}$, cartes empilées sous `lg`, testé sur 375px.
- [X]  **Feedback & Chargement** : Skeleton géométrique, bouton de réessai, toasts d'action.
