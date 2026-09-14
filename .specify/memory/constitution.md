<!--
Sync Impact Report:
- Version change: template -> 1.0.0
- List of modified principles:
  * [PRINCIPLE_1_NAME] -> I. Clarté Métier & Sobriété Visuelle Absolue (NON NÉGOCIABLE)
  * [PRINCIPLE_2_NAME] -> II. Tokens Sémantiques & Typographie Réglementaire
  * [PRINCIPLE_3_NAME] -> III. Zéro Donnée Mockée & Vérité Données Réelles
  * [PRINCIPLE_4_NAME] -> IV. Feedback Utilisateur Systématique, Logs & Audit Trail Immuable
  * [PRINCIPLE_5_NAME] -> V. Ergonomie Mobile-First & Standards Universels du Marché
- Added sections:
  * Contraintes Techniques, Architecture API & Sécurité
  * Workflow de Développement, Composants & Contrôles Qualité
- Removed sections:
  * None (placeholders replaced)
- Follow-up TODOs:
  * None
-->

# Ceilow Constitution

## Core Principles

### I. Clarté Métier & Sobriété Visuelle Absolue (NON NÉGOCIABLE)
Ceilow est un progiciel de gestion comptable, fiscale et sociale (SYSCOHADA, DGI, CNSS Bénin) destiné aux professionnels. La clarté, la fiabilité et le sérieux prévalent systématiquement sur l'expressivité visuelle et les effets décoratifs.
- Tout élément visuel MUST avoir une fonction précise (guider, informer, confirmer) ; s'il n'apporte aucune valeur fonctionnelle, il MUST être supprimé.
- Interdiction formelle des emojis dans l'intégralité du code, des interfaces, des modales, des KPI et de la documentation. Utiliser exclusivement des icônes vectorielles Lucide React dotées d'un label accessible.
- Interdiction stricte du glassmorphisme (`backdrop-blur`), des dégradés artificiels improvisés et des bordures décoratives asymétriques (`border-l-4`, etc.). L'état actif est exclusivement matérialisé par la couleur de token (`text-primary`) et un fond subtil (`bg-primary/10`).
- Priorités absolues : clarté > ingéniosité, action > décoration, feedback > silence, cohérence > créativité, besoins utilisateur > hypothèses commerciales.

### II. Tokens Sémantiques & Typographie Réglementaire
La cohérence visuelle et le basculement clair/sombre reposent sur une palette fermée et des règles typographiques strictes :
- Interdiction absolue d'utiliser des couleurs hexadécimales en dur (`#FFD946`, `#332E29`) ou des classes génériques Tailwind (`text-blue-500`, `gray-*`).
- Utilisation exclusive des tokens sémantiques définis dans `globals.css` : `primary` (#FFD946, accent/CTA uniquement), `ink` (#332E29), `success` (#5FFFC2), `warning` (#FFA53D), `error` (#FF5C5C), `background`, `background-secondary`, `border`, `text-muted`.
- Les statuts `success`, `warning` et `error` sont strictement réservés aux signaux financiers réels (lettrage, TVA, paiement, anomalie e-MECeF).
- Typographie : Clash Display est réservée exclusivement au site vitrine et aux titres marketing. L'intégralité de l'application intérieure MUST utiliser la police Inter avec activation obligatoire des chiffres tabulaires (`font-feature-settings: "tnum"`) pour garantir l'alignement comptable des montants.

### III. Zéro Donnée Mockée & Vérité Données Réelles
Toute interface ou composant MUST être alimenté par des flux et données réels :
- Interdiction totale des mocks, données bouchonnées ou structures statiques factices en frontend comme en backend.
- Les données MUST provenir exclusivement des modèles Prisma réels et des route handlers Next.js authentifiés (NextAuth v5 / PostgreSQL).
- Tout champ affiché à l'écran MUST correspondre à un champ existant du schéma de données et respecter le référentiel métier (SYSCOHADA / DGI).

### IV. Feedback Utilisateur Systématique, Logs & Audit Trail Immuable
Aucune interaction asynchrone ou modification d'état ne doit s'exécuter en silence :
- Toast obligatoire sur chaque action significative (création, modification, validation, suppression, export, erreur réseau).
- Indicateur de chargement contextuel obligatoire : skeleton reproduisant la géométrie exacte du contenu pour les pages/sections, spinner inline avec désactivation sur les boutons déclencheurs, barre de progression réelle pour les téléversements.
- Logging structuré serveur pour toute opération API et intégration externe (e-MECeF DGI, OCR).
- Piste d'audit immuable : chaque action sensible (écriture, validation, export, connexion) MUST enregistrer une trace inaltérable (utilisateur, IP, horodatage, diff avant/après).
- Aucune exception n'est avalée silencieusement : tout bloc `try/catch` MUST logger l'incident et restituer un feedback explicite.

### V. Ergonomie Mobile-First & Standards Universels du Marché
Ceilow MUST offrir une prise en main intuitive sans formation, calquée sur les meilleurs standards du secteur (Pennylane, Indy, Sage) :
- Conception Mobile-First non négociable : chaque composant et écran MUST être validé sur mobile (~375-390px), tablette et desktop, avec des cibles tactiles >= 44px.
- Hiérarchie des conteneurs : modale simple réservée aux actions atomiques (< 3 champs) ; processus guidé séquentiel en modale multi-étapes (wizard) ; flux denses ou d'édition longue (facture, écriture comptable, déclaration TVA, DSF) obligatoirement en page dédiée.
- Tableaux de données volumineuses : interdiction du scroll horizontal forcé ; utilisation de lignes extensibles/repliables (expand/collapse) et transformation en cartes empilées sous le breakpoint `lg`.
- Toute action destructrice MUST requérir une confirmation explicite via modale avec focus trap et gestion de la touche Escape.
- Tous les KPI MUST expliciter leur formule ou méthode de calcul via infobulle ou sous-titre vulgarisé.

## Contraintes Techniques, Architecture API & Sécurité

L'architecture technique garantit la robustesse, la conformité réglementaire et la sécurité des données financières :
- **Stack Technologique** : Next.js (App Router, Server Route Handlers), TypeScript strict, Prisma ORM, PostgreSQL (Neon), Tailwind CSS, NextAuth v5.
- **Typage Strict** : Aucun type `any` toléré. Les types frontend MUST être strictement calqués sur les modèles Prisma et les payloads API.
- **Format Standardisé des Réponses API** : Chaque endpoint JSON MUST respecter le contrat unique :
  ```json
  {
    "success": true,
    "data": {},
    "error": null
  }
  ```
  En cas d'échec, `"success": false`, `"data": null` et `"error"` contient un message clair et exploitable par le client avec code HTTP adéquat (400, 401, 403, 404, 409, 422, 500).
- **Sécurité des Sessions & Requêtes** : Authentification via cookies de session `HttpOnly`. Le client HTTP unifié MUST inclure `credentials: 'include'` systématiquement et rediriger automatiquement vers `/login` sur statut `401` ou `403`.

## Workflow de Développement, Composants & Contrôles Qualité

Le cycle de développement impose une discipline d'ingénierie et de vérification continue :
- **Composants UI & 21st.dev** : Avant tout développement d'un composant d'interface, recherche obligatoire via les serveurs MCP `21st`. Tout composant retenu MUST être adapté aux tokens sémantiques Ceilow et aux types TypeScript stricts.
- **Pipeline Speckit** : Toute évolution fonctionnelle suit le cycle formel `/speckit-specify` -> `/speckit-plan` -> `/speckit-tasks` -> `/speckit-implement` avec vérification par `/speckit-converge`.
- **Validation du Build Obligatoire** : Avant toute livraison de tâche, exécution systématique de `npx tsc --noEmit` (zéro erreur de typage) et `pnpm build` (compilation sans avertissement bloquant). Aucune livraison n'est acceptée en cas d'échec.
- **Mémoire Projet Continue** : Le fichier `PROJECT_MEMORY.md` à la racine du dépôt MUST être mis à jour immédiatement après chaque action pour consigner les décisions prises, le travail réalisé et les étapes restantes.

## Governance

La présente Constitution constitue le document d'autorité suprême pour le projet Ceilow et prévaut sur toute directive informelle ou habitude locale de code.
- **Amendements** : Toute modification des principes fondamentaux ou des contraintes d'architecture requiert une proposition motivée, la révision de ce document, la mise à jour du rapport d'impact (Sync Impact Report) et un incrément de version.
- **Politique de Versioning** :
  - **MAJOR** : Suppression, incompatibilité ou redéfinition fondamentale d'un principe ou d'une règle d'architecture.
  - **MINOR** : Ajout d'une nouvelle section, d'un principe complémentaire ou extension substantielle des exigences.
  - **PATCH** : Précisions sémantiques, corrections rédactionnelles ou ajustements mineurs sans rupture d'intention.
- **Vérification de Conformité** : Chaque Pull Request et tâche de mise en œuvre MUST être confrontée à la checklist de conformité de cette Constitution avant validation finale.

**Version**: 1.0.0 | **Ratified**: 2026-09-14 | **Last Amended**: 2026-09-14
