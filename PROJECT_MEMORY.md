# Mémoire Projet — Ceilow

Ce document trace l'historique continu des actions, décisions techniques et orientations du projet Ceilow (SaaS comptable, fiscal et social Bénin / SYSCOHADA).

---

## Entrées du Journal

### 2026-09-14 — Ratification de la Constitution Ceilow v1.0.0 & Initialisation des Règles

- **Actions effectuées** :
  - Création du fichier de règles globales [AGENTS.md](file:///e:/Comptia/AGENTS.md) et [.agents/rules/ceilow.md](file:///e:/Comptia/.agents/rules/ceilow.md).
  - Ratification et écriture de la Constitution officielle dans [.specify/memory/constitution.md](file:///e:/Comptia/.specify/memory/constitution.md) en version `1.0.0`.
  - Initialisation de [PROJECT_MEMORY.md](file:///e:/Comptia/PROJECT_MEMORY.md).
- **Décisions clés** :
  - Palette stricte fermée avec interdiction formelle des hexadécimaux en dur et respect des tokens Tailwind (`primary`, `ink`, `success`, `warning`, `error`, `background`, `background-secondary`, `border`, `text-muted`).
  - Typographie réglementaire : Clash Display uniquement pour la vitrine marketing, Inter avec chiffres tabulaires (`tnum`) partout dans l'application.
  - Zéro mock : toutes les interfaces doivent être branchées aux vraies API et modèles Prisma réels.
  - Sobriété financière : zéro emoji, zéro glassmorphisme, icônes Lucide avec labels accessibles.
  - Workflow Speckit obligatoire pour toute nouvelle spécification et implémentation.
- **Prochaines étapes** :
  - Audit complet du dashboard existant et préparation du cahier de spécification.

### 2026-09-14 — Audit Exhaustif du Dashboard (Owner / Dirigeant)

- **Actions effectuées** :
  - Lecture intégrale à 100% de `src/app/dashboard/page.tsx`, `src/views/Dashboard.tsx`, `src/components/dashboard/KpiCard.tsx`, `PageHeader.tsx`, `StatusBadge.tsx`, et de la route backend `src/app/api/dashboard/stats/route.ts`.
  - Rédaction du rapport d'audit exhaustif dans [AUDIT_DASHBOARD.md](file:///e:/Comptia/AUDIT_DASHBOARD.md).
- **Constats & Anomalies relevées** :
  - Présence de mocks (`sparkline` importé de `@/data/mock`) et fausse courbe de trésorerie (affichant en réalité le CA).
  - Couleurs hors charte (`hsl(221...)`, `info-soft`, `bg-gradient-primary`, etc.) et police non conforme (`font-display` / Poppins).
  - Présence d'un emoji `👋` et absence d'infobulles explicatives sur les KPI (règle 10).
  - Donnée backend `payrollTotal` (masse salariale) non exploitée dans le frontend.
- **Prochaines étapes** :
  - Spécification détaillée rédigée dans [SPECIFICATION_DASHBOARD_OWNER.md](file:///e:/Comptia/SPECIFICATION_DASHBOARD_OWNER.md).
  - Lancement officiel de `/speckit-specify` pour initialiser le dossier de feature Speckit.

### 2026-09-14 — Spécification Complète Frontend : Cockpit Dirigeant (Owner)

- **Actions effectuées** :
  - Rédaction intégrale du document de spécification [SPECIFICATION_DASHBOARD_OWNER.md](file:///e:/Comptia/SPECIFICATION_DASHBOARD_OWNER.md).
  - Cadrage strict : zéro modification backend (exploitation intégrale de `/api/dashboard/stats` et `/api/auth/me`).
  - Définition exhaustive des textes, micro-copies, calculs, infobulles, tokens de couleurs, et composants.
- **Décisions clés** :
  - Intégration de la masse salariale nette (`payrollTotal`) déjà présente dans l'API.
  - Remplacement de l'import mock `sparkline` par les vrais tableaux `caSpark` et `chargesSpark` de l'API.
  - Infobulles pédagogiques sur les 6 KPIs avec explication des règles SYSCOHADA et DGI Bénin.
  - Bannière d'alerte réglementaire (échéance TVA du 15 du mois).
- **Prochaines étapes** :
  - Spécification formelle générée dans [specs/001-dashboard-page/spec.md](file:///e:/Comptia/specs/001-dashboard-page/spec.md).
  - Validation qualité complète dans [specs/001-dashboard-page/checklists/requirements.md](file:///e:/Comptia/specs/001-dashboard-page/checklists/requirements.md).
  - Étape suivante : exécution de `/speckit-plan` pour produire le plan technique d'implémentation.

### 2026-09-14 — Refonte Intégrale de la Landing Page & Alignement des Tokens Sémantiques

- **Actions effectuées** :
  - Mise à niveau complète de [tailwind.config.ts](file:///e:/Comptia/tailwind.config.ts) et [src/app/globals.css](file:///e:/Comptia/src/app/globals.css) selon les tokens stricts Ceilow (`primary`, `ink`, `background`, `background-secondary`, `border`, `text-muted`, `success`, `warning`, `error`).
  - Suppression définitive du glassmorphisme (`.glass`, `.glass-dark`) et de l'ancienne teinte bleue.
  - Intégration de la typographie réglementaire : **Clash Display** (Fontshare) pour les titres vitrine et **Inter** avec chiffres tabulaires (`tnum`) pour le corps.
  - Remplacement de l'écriture en texte "ceilow" par les logos vectoriels SVG officiels : `/logo/ceilow_web_sombre.svg` dans la barre de navigation et `/logo/ceilow_web_jaune.svg` dans le footer.
  - Refonte intégrale de [src/views/LandingView.tsx](file:///e:/Comptia/src/views/LandingView.tsx) basée sur la maquette cible avec :
    - Titre Hero strictement calibré sur 2 lignes maximum.
    - Copywriting vulgarisé sans jargon obscur (SYSCOHADA, double-partie, lettrage transformés en bénéfices tangibles pour les PME et indépendants au Bénin).
    - Onglets interactifs par module (Facturation, Rapprochement, Comptabilité, TVA, Reporting).
    - Cockpit virtuel avec indicateurs en FCFA, badge e-MECeF et conformité DGI.
    - Zéro emoji, icônes Lucide React exclusives, responsive mobile-first.
  - Validation technique : `npx tsc --noEmit` passé sans erreur, `pnpm build` passé avec succès (54 routes générées).
- **Décisions clés** :
  - Respect scrupuleux de la Règle 2 (zéro hexadécimal en dur dans les classes JSX).
  - Copywriting axé sur le dirigeant d'entreprise et l'indépendant béninois (focus gain de temps et zéro pénalité fiscale).

### 2026-09-14 — Intégration du Composant 21st.dev « Features 8 » (Bento Architecture & Grille des 12 Fonctionnalités)

- **Actions effectuées** :
  - Consultation des quotas 21st.dev via le MCP `21st` (`get_usage` : 2/2 restants).
  - Recherche et extraction exacte du composant `Features 8` de Méschac Irung (`id: 1906`, `@meschacirung/features-8`) via `get_component`.
  - Création du composant dédié adapté [src/components/landing/FeaturesEight.tsx](file:///e:/Comptia/src/components/landing/FeaturesEight.tsx) :
    - Remplacement de tous les styles génériques par les tokens stricts Ceilow (`bg-background`, `bg-background-secondary`, `text-ink`, `border-border`, `text-primary`, `text-success-deep`).
    - Architecture Bento 5 cartes : Card 1 (100% Conforme e-MECeF & Facturation), Card 2 (Sécurité 256-bit & Rôles), Card 3 (Trésorerie & Flux direct FCFA), Card 4 (Rapprochement bancaire & banques béninoises), Card 5 (Multi-entreprises & Équipes).
    - Grille complète des 12 fonctionnalités réécrites sans jargon avec badges de catégorie et icônes Lucide React.
  - Intégration dans [src/views/LandingView.tsx](file:///e:/Comptia/src/views/LandingView.tsx) en remplacement de l'ancienne section 6.
  - Validation technique : `npx tsc --noEmit` passé sans erreur (**0 erreur**), `pnpm build` passé avec succès (**14.5s**, 54 routes compilées).
- **Décisions clés** :
  - Respect scrupuleux de la Règle 16 (recherche et récupération MCP 21st.dev, adaptation intégrale aux tokens Ceilow).
### 2026-09-14 — Ajustement de la Section Hero (Inspiration SaaS Template 21st.dev, Fond Blanc & Titre en 2 Lignes)

- **Actions effectuées** :
  - Extraction et analyse du composant `SaaS Template` de waleedkibhen (`id: 8948`, `@waleedkibhen/saa-s-template`) via MCP `21st-2` après vérification du quota.
  - Ajustement strict de la Hero section dans [src/views/LandingView.tsx](file:///e:/Comptia/src/views/LandingView.tsx) :
    - Préservation intégrale du fond blanc Ceilow (`bg-background`).
    - Suppression absolue de tout label/badge avant le titre H1.
    - Calibrage rigoureux du titre H1 sur **strictement 2 lignes** sur desktop et tablette via `max-w-6xl`, `md:whitespace-nowrap` sur la ligne 1 ("Votre comptabilité, vos factures et votre TVA,") et la ligne 2 ("gérées automatiquement au Bénin."), empêchant tout retour intempestif du mot "TVA,".
    - Bouton CTA principal interactif avec flèche Lucide React, retour tactile et ombre portée douce.
    - Conteneur de preview mockup optimisé avec relief propre (`shadow-xl shadow-ink/5`, bordures fines `border-border`, pas de glassmorphisme).
  - Validation technique : `npx tsc --noEmit` passé avec succès (**0 erreur**), `pnpm build` passé avec succès (**0 erreur**, 54 pages statiques/dynamiques générées en 13.7s).
### 2026-09-14 — Optimisations Mobile/Tablette (Règles 10 & 11) & Lignes de Vagues en Background (Bannière CTA & Footer)

- **Actions effectuées** :
  - **Optimisations Mobile & Tablette (Mobile-First)** :
    - Header : Logo adapté (`h-7 sm:h-8`), CTA compact « Démarrer » sur mobile pour aérer le header, cibles tactiles rigoureusement `>= 44px` (`min-h-[44px]` sur tous les boutons et liens de menu).
    - Hero : Calibrage de la taille de texte responsive (`text-[22px] sm:text-3xl md:text-[38px] lg:text-[46px] xl:text-[50px]`) évitant le fractionnement inesthétique du bloc d'accent jaune sur mobile (375px), tout en maintenant strictement 2 lignes sur desktop et tablette.
    - **Règle 10 Ceilow** : Transformation du tableau des factures du module facturation en **cartes empilées** sur mobile et tablette (`lg:hidden`), avec affichage sous forme de table uniquement sur grands écrans (`lg:block`).
### 2026-09-14 — Ajustement des Lignes de Vagues (Lueur Dorée Opaque et Lumineuse, Footer Épuré)

- **Actions effectuées** :
  - **Bannière CTA** :
    - Remplacement des multiples lignes blanches rigides par des courbes topographiques dorées fines (`0.8px` à `1.2px`), douces et aérées qui contournent élégamment le contenu central.
    - Ajout d'un halo lumineux central doré diffus (`bg-primary/10 blur-[100px]`) apportant brillance et profondeur sans encombrer.
    - Application de dégradés linéaires dorés (`linearGradient`) avec point de brillance à 50% (`stopColor="hsl(var(--primary))" stopOpacity="0.9"`) et fondu vers les extrémités, rehaussés par un filtre de brillance subtil.
  - **Footer** :
    - Nettoyage complet : suppression totale des rayures parasites pour retrouver un footer d'une lisibilité et d'une sobriété exemplaires, fidèle à la maquette de référence (fond profond `bg-ink`, logo `ceilow_web_jaune.svg`, 4 colonnes claires et icônes sociales).
  - Validation technique : `npx tsc --noEmit` passé avec succès (**0 erreur**), `pnpm build` passé avec succès (**0 erreur**, 54 pages compilées en 18.2s).
### 2026-09-14 — Mise à Jour des CTA Hero (« Souscrire » / « Demander une démo ») & Élimination du Glassmorphisme

- **Actions effectuées** :
  - **Section Hero** :
    - Bouton principal mis à jour en **« Souscrire »** (`bg-primary text-ink`, avec icône `ArrowRight`).
    - Bouton secondaire mis à jour en **« Demander une démo »** (`bg-background border border-border text-ink`, lien vers demande de démo).
  - **Bannière CTA** :
    - Suppression complète de toute translucidité/glassmorphisme sur le bouton « Parler à un expert » (`bg-white/5` remplacé par un style 100% opaque solide `bg-ink border border-border text-white hover:border-primary hover:text-primary`).
  - Validation technique : `npx tsc --noEmit` passé avec succès (**0 erreur**), `pnpm build` passé avec succès (**0 erreur**, 54 pages compilées en 20.1s).
### 2026-09-14 — Remplacement de l'Image Externe Expirée par un Asset Permanent Local

- **Actions effectuées** :
  - **Section Activité / Compatibilité Bancaire** :
    - Remplacement de l'URL Google Aida temporaire expirée (qui renvoyait une erreur 403 et affichait une icône d'image brisée) par l'asset permanent local `/images/finance-manager.jpg` via le composant optimisé `next/image` (`width={64}`, `height={64}`).
    - Affichage désormais garanti à 100% de la photo de la responsable financière sans dépendance externe volatile.
  - Validation technique : `npx tsc --noEmit` passé avec succès (**0 erreur**), `pnpm build` passé avec succès (**0 erreur**, 54 pages compilées en 29.5s).
- **Prochaines étapes** :
  - Validation visuelle par l'utilisateur.

### 2026-09-14 — Intégration des Sections Showcase Immersives (Référence Chariow.com/fr)

- **Actions effectuées** :
  - Analyse des captures d'écran de référence de `chariow.com/fr` fournies par l'utilisateur.
  - Création du composant dédié [src/components/landing/ShowcaseSections.tsx](file:///e:/Comptia/src/components/landing/ShowcaseSections.tsx) :
    - Titre global au sommet : *« Tout ce qu'il vous faut pour piloter votre entreprise au Bénin »*.
    - **Showcase 1 (Facturation e-MECeF)** :
      - Badge pilule sombre `Facturation certifiée` + H3 `Lancez votre facturation en 5 minutes.` + description fluide sans jargon + CTA jaune `Créer une facture gratuitement`.
      - Grand conteneur pastel jaune doux `bg-primary/15 border border-primary/25 rounded-2xl sm:rounded-[32px]`.
      - Mockup interactif blanc intérieur fidèle à la capture : configuration de l'entreprise (`Bénin Agro Solutions SARL`), palette de 4 pastilles de couleurs, objet de la prestation, et aperçu de facture dynamique avec totaux HT / TVA 18% / TTC en FCFA et certification e-MECeF DGI Bénin.
    - **Showcase 2 (Paiements & Rapprochement Bancaire)** :
      - Badge pilule sombre `Paiements & Banques` + H3 `Acceptez et suivez des paiements de toutes vos banques.` + double CTA (`Connecter mes banques` en jaune + `Voir les banques couvertes` en contour).
      - Grand conteneur pastel jaune doux.
      - Mockup interactif de modalité de sélection bancaire fidèle à la capture : *« Où sont domiciliés vos comptes ? »*, sélecteur déroulant interactif avec barre de recherche, liste des banques au Bénin (BOA Bénin, Ecobank, BIIC, NSIA, BGFI, UBA, MTN MoMo, Moov Money, Celtiis Cash), mention de chiffrement bancaire et devise FCFA (XOF).
    - **Showcase 3 (Automatisations du Business)** :
      - Badge pilule sombre `Automatisation` + H3 `Automatisez votre gestion et gagnez du temps.` + CTA `Découvrir les automatisations`.
      - Grand conteneur pastel jaune doux.
      - Mockup interactif de constructeur de workflows fidèle à la capture : *« Actions du Workflow Comptable »*, bouton interactif `+ Ajouter une action`, liste des actions ordonnées avec icônes Lucide, badges de délai, boutons de réorganisation (`ChevronUp`, `ChevronDown`, `Edit3`, `Trash2`), et grand bouton d'enregistrement `Sauvegarder le workflow` avec feedback visuel de succès.
  - Intégration dans [src/views/LandingView.tsx](file:///e:/Comptia/src/views/LandingView.tsx) en remplacement des anciens onglets statiques de la section 5.
  - Nettoyage des états obsolètes (`activeTab` retiré).
  - Validation des règles Ceilow :
    - Zéro hexadécimal en dur dans les classes JSX (exclusivement des tokens `bg-primary`, `bg-ink`, `border-border`, etc.).
    - Zéro emoji (100% icônes Lucide React).
    - Zéro glassmorphisme (fonds solides et nets).
    - Mobile-first avec zones tactiles `>= 44px`.
  - Validation technique stricte :
    - `npx tsc --noEmit` : **0 erreur**.
    - `pnpm build` : **0 erreur** (54 pages compilées avec succès).
- **Prochaines étapes** :
  - Validation finale par l'utilisateur.

