---
trigger: always_on
---

# Règles Design, Frontend — Ceilow

Ce document rassemble les règles obligatoires du projet Ceilow (SaaS comptable, fiscal et social — SYSCOHADA/DGI/CNSS Bénin). Elles sont TOUJOURS actives sur tout écran, composant, page ou endpoint construit pour Ceilow, même si une tâche ne les mentionne pas explicitement. Ceilow est un outil destiné au corps professionnel (comptables, experts-comptables, dirigeants, gestionnaires) : la clarté, la fiabilité et la crédibilité priment toujours sur l'effet visuel.

## 1. Rôle & Principes de Conception

5 rôles combinés : UX Writer, UI Designer, Interaction Designer, Copywriter conversion, Dev Frontend Senior. Priorités dans l'ordre : clarté > ingéniosité, action > décoration, feedback > silence, cohérence > créativité, besoins utilisateur > hypothèses business. Supprimable sans perte de sens → supprimé. Hésitation possible → clarifié avant livraison.

## 2. Couleurs — Tokens Sémantiques Uniquement

Interdiction stricte des couleurs hexadécimales en dur (`bg-[#FFD946]`, `text-[#332E29]`) et de toute couleur hors palette (`text-blue-500`, `bg-purple-100`). Pourquoi : la charte se modifie en un seul endroit (`globals.css`/`tailwind.config.js`), le mode clair/sombre fonctionne automatiquement, et un outil comptable a besoin d'une palette fermée et prévisible. Token manquant → l'ajouter dans `globals.css` d'abord, jamais improviser en attendant.

| Token                  | Hex clair | Hex sombre   | Usage                                                                                                                                         |
| ---------------------- | --------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `primary`              | `#FFD946` | idem         | Accent uniquement (CTA, focus, actif) — jamais de grand aplat de fond, sinon effet "startup grand public" au lieu d'"outil financier sérieux" |
| `ink`                  | `#332E29` | fond dark    | Texte principal en mode clair / fond principal en mode sombre                                                                                 |
| `success`              | `#5FFFC2` | idem         | Signal positif uniquement : écriture validée, rapprochement OK, TVA créditrice, paiement reçu                                                 |
| `warning`              | `#FFA53D` | idem         | Avertissement non bloquant : échéance TVA proche, données incomplètes                                                                         |
| `error`                | `#FF5C5C` | idem         | Erreur/bloquant : facture en retard, échec e-MECeF, écart de lettrage                                                                         |
| `background`           | `#FFFFFF` | `#332E29`    | Fond principal de page                                                                                                                        |
| `background-secondary` | `#F5F4F2` | `#3D3830`    | Cards, sections, sidebar                                                                                                                      |
| `border`               | `#D8D5D0` | blanc 12%    | Séparateurs, contours de champs, lignes de tableau                                                                                            |
| `text-muted`           | `#8A857D` | blanc 60-70% | Texte secondaire, légendes, états désactivés                                                                                                  |

`background-secondary`/`border`/`text-muted` forment l'échelle de gris obligatoire pour un outil dense en tableaux — jamais de `gray-*` Tailwind par défaut. Statuts sémantiques stricts : `success`/`warning`/`error` sont réservés aux signaux financiers réels, jamais en décoration ni en badge cosmétique.

### Récapitulatif Mode Jour / Mode Nuit

|                  | Mode Jour                                                       | Mode Nuit              |
| ---------------- | --------------------------------------------------------------- | ---------------------- |
| Fond             | `#FFFFFF`                                                       | `#332E29`              |
| Fond secondaire  | `#F5F4F2`                                                       | `#3D3830`              |
| Texte principal  | `#332E29`                                                       | `#FFFFFF`              |
| Texte secondaire | `#8A857D`                                                       | blanc 60-70%           |
| Bordures         | `#D8D5D0`                                                       | blanc 12%              |
| CTA/accent       | `#FFD946`                                                       | `#FFD946`              |
| Logo             | `ceilow_web_sombre.svg`                                         | `ceilow_web_jaune.svg` |
| Favicon          | picto seul, jaune par défaut ou variante `prefers-color-scheme` | idem                   |

## 3.Typographie

Vitrine, logo, marketing → Clash Display (police du wordmark), Bold/Semi-Bold pour les titres. Application entière (dashboard, factures, comptabilité, paie, reporting) → une seule police partout, Inter, chiffres tabulaires activés (`font-feature-settings: "tnum"`), indispensable pour aligner les montants. Aucune police display à l'intérieur de l'app : une fois connecté, lisibilité et crédibilité priment sur la personnalité de marque.

## 4.Sobriété Visuelle Absolue

Interdits : emojis (partout, y compris docs de règles), glassmorphisme (`backdrop-blur`), bordures d'accent improvisées (`border-t-4`, `border-l-4`, `border-b border-primary`) — élément actif = couleur texte/icône (`text-primary font-medium`) + fond subtil (`bg-primary/10`), jamais une bordure de côté. Dégradés artificiels interdits. Icônes exclusivement Lucide React avec `title`/tooltip. Rien d'inutile côté design.

## 5.Logos & Favicon

Mode clair → `ceilow_web_sombre.svg`. Mode sombre → `ceilow_web_jaune.svg`. Sidebar dépliée → logo complet ; réduite/mobile compact → picto seul. Favicon → picto seul exclusivement (`picto_ceilow_web_jaune.svg` par défaut, ou variante `prefers-color-scheme`). Loader/splash screen → picto seul, animation discrète, jamais de rebond ludique. Avatar entreprise par défaut → picto sombre sur fond clair / picto blanc sur fond brun.

## 6.Feedback Utilisateur & Logs — Obligatoires

Toast obligatoire sur chaque action significative (créer, modifier, supprimer, valider, exporter, envoyer, erreur réseau) : jamais de clic silencieux, un seul système réutilisé partout. Log obligatoire à deux niveaux : technique (logging structuré serveur pour toute opération API/erreur/appel externe DGI e-MECeF/OCR, jamais de `console.log` isolé en production) et métier/audit (chaque action sensible écrit dans la piste d'audit immuable : utilisateur, IP, user-agent, horodatage, diff avant/après). Aucune erreur avalée dans un `try/catch` vide : toujours loguée et remontée à l'utilisateur.

## 7.Chargement — Toujours un Indicateur Visuel

Aucune action asynchrone silencieuse. Skeleton épousant la forme réelle du contenu final (proportions carte/table/liste), jamais de spinner générique centré seul. Navigation entre pages → barre de progression globale automatique. Bouton d'action (valider, envoyer, exporter) → spinner inline + désactivation, sans bloquer toute la page. Upload → barre de progression réelle. Traitement long (DSF, paie en lot, normalisation e-MECeF) → état "en cours" explicite (étapes/pourcentage si possible) et message de fin clair. Respect systématique de `prefers-reduced-motion`.

## 8.Modale Multi-Étapes ou Page Dédiée

Interdiction de la grande modale simple entassant beaucoup de champs (facture complète, fiche salarié, configuration d'entreprise). Règle de décision : peu de contenu/action ponctuelle (confirmer suppression, éditer 1-3 champs) → modale simple acceptée. Contenu conséquent mais séquentiel (onboarding, création salarié, paramétrage e-MECeF) → modale multi-étapes (wizard). Contenu conséquent et non strictement séquentiel, ou à consulter/modifier dans la durée (facture, écriture comptable, déclaration TVA, DSF) → page dédiée. Choix selon le contexte, jamais par défaut vers la solution la plus rapide à coder.

## 9.KPI Toujours Explicatifs

Aucun chiffre brut sans contexte : libellé clair, valeur, tendance/variation si pertinente, explication accessible (info-bulle ou sous-titre) du calcul. Priorité pour les notions non évidentes : TVA nette due, EBE, CAF, RAO/RHAO, créances clients — toujours vulgarisées en une phrase simple. Un KPI ne doit jamais nécessiter que l'utilisateur devine ce qu'il représente.

## 10.Tableaux de Données Volumineuses

Trop d'informations par ligne → ligne pliable/dépliable (expand/collapse), jamais de scroll horizontal forcé ni de troncature silencieuse. Sous `lg`, les tableaux se transforment en cartes empilées. Statuts de workflow toujours traduits en français humain, jamais en snake_case brut.

## 11.Mobile-First — Non Négociable

Chaque écran, composant, fonctionnalité pensé mobile (~375-390px) → tablette → desktop, jamais l'inverse. Breakpoints Tailwind `sm:640 md:768 lg:1024 xl:1280`. Zones tactiles ≥ 44px. Aucune tâche frontend terminée sans vérification des trois formats.

## 12.Backend & API (Next.js/TypeScript — pas de Django dans la stack)

TypeScript strict, types calqués sur les modèles Prisma réels, pas de `any` injustifié. Gestion d'erreurs : `try/catch` précis, erreur loguée, code HTTP adéquat renvoyé (400/401/403/404/409/422/500). Réponses API strictement au format :

```json
{ "success": true, "data": {}, "error": null }
```

Échec → `success:false`, `data:null`, `error` explicite et exploitable côté frontend, jamais de stack trace exposée. CORS restreint au domaine frontend, authentification via cookie `HttpOnly` (session NextAuth), jamais de token sensible en `localStorage`.

## 13.Frontend (React, Next.js & TypeScript)

Typage strict pour props, states, réponses API. Structure : composants UI réutilisables dans `components/ui/`, composants Features connectés à l'API dans `components/features/`. Principe DRY, code complet livré sans TODO ni placeholder. Tailwind mobile-first, HTML5 sémantique, rôles ARIA corrects.

## 14.Intégration & Connectivité

Client HTTP unifié avec `credentials: 'include'` systématique. Intercepteur global sur `401`/`403` → redirection automatique vers la page de login, jamais de page bloquée silencieusement.

## 15.Composants — 21st.dev Avant Tout

Chercher via MCP `21st` avant tout composant UI custom (carte, table, stepper, drawer, dropzone, badge, form). `search`/`get_inspiration` gratuits et illimités. `get_component`/`generate` limités par quota → réservés aux candidats présélectionnés via métadonnées. Éviter le payant/Premium. `locked=true` → `get_usage` avant de retenter. Notifier l'utilisateur si quota épuisé. Composant importé → adapté (tokens Ceilow, mobile-first, types TS).

8 instances MCP (`21st` à `21st-8`) : basculer sur la suivante dès `locked=true`/`0 remaining`. Protocole copier-coller uniquement si les 8 sont épuisées : annoncer, lister les composants nécessaires, demander URL+code un par un, intégrer, répéter sans jamais faire deux composants à la fois. Jamais de composant générique codé en silence sans avoir épuisé les 8 serveurs.

## 16.Intuitivité & Standards Universels du Marché

Utilisable sans formation (référence Pennylane, Axonaut, Sage, Indy). Action destructrice → confirmation explicite. Actions visibles à l'écran, jamais à deviner. Même action = même libellé/icône/emplacement partout. Formulaires : validation inline, erreur au plus près du champ, focus auto sur le champ en erreur. Modales : focus trap, `Escape`, focus rendu au déclencheur. Breadcrumb dès un niveau de profondeur. "Aucun résultat"/"chargement"/"vide par défaut" = trois états distincts. UX writing français, direct, sans jargon ; boutons 1-3 mots action-first ; erreurs = quoi/pourquoi/comment corriger ; états vides actionnables.

## 17.Données Réelles & Lecture Intégrale

Zéro donnée mockée, zéro bouchon statique : tout vient des vraies routes API (Next.js Route Handlers + Prisma/PostgreSQL), typage strict calqué sur les modèles réels. Lecture intégrale de 100% des fichiers concernés avant modification, zéro omission. Réutiliser l'existant (`useAuth`, `useCompany`, `usePermissions`, `useInvoiceForm`, `useReconciliation`, `useAuditLog`) plutôt que réécrire. Chaque champ affiché correspond à un champ réel des modèles, jamais inventé.

## 18.Vérification Build —Obligatoire Avant Toute Livraison

Après chaque modification de code, exécuter dans l'ordre : `npx tsc --noEmit` (zéro erreur de typage), puis `pnpm build` (build sans erreur ni warning bloquant). Tâche jamais close si l'une échoue. Corriger avant de livrer, jamais ignorer une erreur pour "faire passer" la commande.

## 19.Speckit — Workflow Obligatoire & Checklist de Conformité

Pipeline `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`, avec `/speckit-clarify`/`/speckit-checklist` si ambigu. Checklist avant de clore toute tâche : tokens uniquement, typographie conforme, zéro emoji/glassmorphisme/bordure improvisée, toast+log présents, chargement visible, wizard/page dédiée si complexe, KPI expliqués, tableau pliable si volumineux, vérifié mobile/tablette/desktop, format API standard, zéro mock, `tsc --noEmit` + `pnpm build` passés, mémoire projet à jour. `/speckit-converge` régulièrement pour détecter les écarts entre livré et constitution.

## 20.Mémoire Projet

`PROJECT_MEMORY.md, mis à jour après chaque action (jamais différé en fin de session) :ce qui a été fait,pourquoi,décisions prises,reste à faire.Référence pour reprendre le travail sans perdre le contexte, notamment lors de /spec converge
