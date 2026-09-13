# Règles de Design, Frontend, Backend et Intégration — Ceilow

Ce document rassemble les règles obligatoires pour le projet Ceilow (SaaS comptable, fiscal et social — SYSCOHADA/DGI/CNSS Bénin). Ces règles sont TOUJOURS actives, sur tout écran/composant/page/endpoint construit pour Ceilow, même si une tâche ne les mentionne pas explicitement. Ceilow est un outil destiné au corps professionnel (comptables, experts-comptables, dirigeants, gestionnaires) : le sérieux, la clarté et la fiabilité priment toujours sur l'effet visuel.

---

## 1. Rôle & Principes de Conception

Sur toute tâche produit, tu combines 5 rôles d'expert : UX Writer, UI Designer, Interaction Designer, Copywriter de conversion, Développeur Frontend Senior. L'objectif : des expériences claires, intuitives, visuellement fortes, réactives, qui convertissent.

Priorités absolues, dans cet ordre :

- La clarté plutôt que l'ingéniosité.
- L'action plutôt que la décoration — une interface fonctionne, elle ne se décore pas.
- Le feedback plutôt que le silence.
- La cohérence plutôt que la créativité.
- Les objectifs de l'utilisateur plutôt que les hypothèses commerciales.
- Si un élément peut être supprimé sans perte de sens, il est supprimé.
- Si l'utilisateur peut hésiter à un endroit, cet endroit est clarifié avant livraison.

---

## 2. Interdiction des Couleurs Hexadécimales en Dur

Il est strictement interdit d'utiliser des codes couleur hexadécimaux directement dans les classes CSS ou les composants React/Next.js (ex: `bg-[#FFD946]`, `text-[#332E29]`), et strictement interdit d'utiliser une couleur qui n'appartient pas à la palette définie ci-dessous (pas de `text-blue-500`, pas de `bg-purple-100`, pas de couleur choisie au hasard en cours de route).

Pourquoi : la charte se modifie en un seul endroit (`app/globals.css` / `tailwind.config.js`), le mode clair/sombre fonctionne automatiquement via les tokens sémantiques, et un outil comptable a besoin d'une palette fermée et prévisible.

Ce qu'il faut faire à la place — utiliser exclusivement les classes de variables sémantiques définies dans `globals.css` :

- `bg-primary`, `text-primary`, `border-primary` — jaune Ceilow (`#FFD946`)
- `bg-ink`, `text-ink` — brun foncé (`#332E29`) — texte principal / fond du mode sombre
- `bg-success`, `text-success` — vert menthe (`#5FFFC2`)
- `bg-warning`, `text-warning` — ambre (`#FFA53D`)
- `bg-error`, `text-error` — rouge corail (`#FF5C5C`)
- `bg-background`, `bg-background-secondary` — fond principal / secondaire
- `border-border` — bordures et séparateurs
- `text-muted` — texte secondaire/tertiaire

Si un token manquant est nécessaire, l'ajouter dans `globals.css` d'abord, puis l'utiliser. Ne jamais improviser une couleur en attendant.

---

## 3. Palette Ceilow — Tokens Uniques Autorisés

| Token | Hex | Rôle | Usage |
|---|---|---|---|
| `primary` | `#FFD946` | Jaune | CTA principal, état actif, focus ring — accent uniquement, jamais en grand aplat de fond |
| `ink` | `#332E29` | Brun foncé | Texte principal en mode clair, fond principal en mode sombre |
| `success` | `#5FFFC2` | Vert menthe | Signal positif uniquement : écriture validée, rapprochement OK, TVA créditrice, paiement reçu |
| `warning` | `#FFA53D` | Ambre | Avertissement non bloquant : échéance TVA proche, données incomplètes |
| `error` | `#FF5C5C` | Rouge corail | Erreur/bloquant : facture en retard, échec e-MECeF, écart de lettrage non nul |
| `background` | `#FFFFFF` (clair) / `#332E29` (sombre) | Fond principal | Page |

### Échelle de gris (obligatoire pour un outil dense en tableaux)

Un outil comptable affiche énormément de tableaux, bordures, états désactivés et texte secondaire — le jaune/brun/blanc seuls ne suffisent pas. Cette échelle est la seule source de gris autorisée, jamais un `gray-*` Tailwind par défaut :

| Token | Hex (clair) | Hex (sombre) | Usage |
|---|---|---|---|
| `background-secondary` | `#F5F4F2` | `#3D3830` | Cards, sections, sidebar |
| `border` | `#D8D5D0` | blanc 12% | Séparateurs, contours de champs, lignes de tableau |
| `text-muted` | `#8A857D` | blanc 60-70% | Texte secondaire, légendes, états désactivés |

Statuts sémantiques stricts : `success` / `warning` / `error` sont réservés aux signaux financiers réels — jamais en décoration, jamais en badge "cosmétique", jamais mélangés à un autre usage.

---

## 4. Typographie — Règle Absolue

- Site vitrine, logo, marketing : Clash Display (police du wordmark Ceilow), Bold/Semi-Bold pour les titres.
- Application (dashboard, factures, comptabilité, paie, reporting) : une seule police partout, Inter, chiffres tabulaires activés (`font-feature-settings: "tnum"`).
- Aucune police display à l'intérieur de l'app. Une fois connecté, lisibilité et crédibilité priment sur l'expressivité de marque.

---

## 5. Sobriété Visuelle Absolue

- Interdiction totale des emojis : dans le code, les dashboards, les modales, les libellés, les KPI, et dans tout document de règles ou de documentation produit — y compris ce fichier. Utiliser exclusivement des icônes vectorielles Lucide React ou de la typographie soignée.
- Interdiction du glassmorphisme : pas de `backdrop-blur`, pas de transparence "verre dépoli", pas d'effet de flou décoratif.
- Interdiction des bordures d'accent improvisées : pas de bordure de couleur en haut, en bas, à gauche ou à droite d'une carte/section/sidebar (`border-t-4`, `border-l-4`, `border-b border-primary`...). Un élément actif se distingue uniquement par la couleur du texte/icône (`text-primary font-medium`) et un fond subtil (`bg-primary/10`).
- Interdiction des dégradés artificiels improvisés sur cartes et bannières.
- Fonds sémantiques purs, bordures subtiles uniques, touches de `primary` réservées aux accents d'emphase.
- Rien d'inutile côté design : chaque élément visuel a une fonction (guider, informer, confirmer) ou il est supprimé.

---

## 6. Logos & Favicon

- Mode clair : `ceilow_web_sombre.svg` (header/nav sur fond clair)
- Mode sombre : `ceilow_web_jaune.svg` (header/nav sur fond sombre)
- Sidebar dépliée : logo complet — sidebar réduite / mobile compact : picto seul
- Favicon : picto seul exclusivement, `picto_ceilow_web_jaune.svg` par défaut ou déclinaison `prefers-color-scheme`
- Loader/splash screen : picto seul, animation discrète, jamais de rebond ludique
- Avatar entreprise par défaut : picto sombre sur fond clair / picto blanc sur fond brun

---

## 7. Feedback Utilisateur & Logs — Obligatoires sur Toute Action

- Toast obligatoire sur chaque action significative (création, modification, suppression, validation, export, envoi, erreur réseau). Jamais de clic silencieux. Un seul système de toast, réutilisé partout.
- Log obligatoire sur chaque action significative, à deux niveaux :
  - Technique : logging structuré côté serveur pour toute opération API, erreur, appel externe (DGI e-MECeF, OCR) — jamais de `console.log` isolé oublié en production, un logger dédié est utilisé partout.
  - Métier / audit : chaque action sensible (création, modification, validation, suppression, export, connexion/déconnexion) écrit une ligne dans la piste d'audit immuable (utilisateur, IP, user-agent, horodatage, diff avant/après), conformément au module Contrôle d'Accès & Audit Trail.
- Aucune erreur n'est avalée silencieusement dans un `try/catch` vide : chaque erreur est loguée ET remontée à l'utilisateur via toast/état d'erreur clair.

---

## 8. Chargement — Toujours un Indicateur Visuel d'Action en Cours

Aucune action asynchrone ne reste silencieuse à l'écran, jamais. Concrètement :

- Chargement de page/section : skeleton qui épouse la forme réelle du contenu final (mêmes proportions carte/table/liste), jamais un spinner générique centré seul, pour éviter le layout shift.
- Navigation entre pages : indicateur de progression global cohérent (barre en haut ou overlay léger), déclenché automatiquement, jamais géré à la main écran par écran.
- Bouton déclenchant une action (valider, envoyer, exporter) : état de chargement inline sur le bouton lui-même (spinner + désactivation), sans bloquer toute la page pour une action locale.
- Upload de fichier : barre de progression réelle, jamais un simple spinner sans indication d'avancement.
- Traitement long (génération DSF, calcul de paie en lot, normalisation e-MECeF) : indicateur d'avancement explicite si possible (étapes, pourcentage), sinon a minima un état "en cours" clairement visible et un message de fin explicite (succès ou échec).
- Respect systématique de `prefers-reduced-motion`.

---

## 9. Complexité de Contenu : Modale Multi-Étapes ou Page Dédiée

- Interdiction de la grande modale simple qui entasse beaucoup de champs/sections (facture complète, fiche salarié complète, configuration d'entreprise).
- Règle de décision :
  - Peu de contenu (quelques champs, action ponctuelle : confirmer une suppression, éditer 1-3 champs) → modale simple, acceptée.
  - Contenu conséquent mais séquentiel (processus guidé en étapes logiques : onboarding, création d'un salarié, paramétrage e-MECeF) → modale multi-étapes (wizard).
  - Contenu conséquent et non strictement séquentiel, ou à consulter/modifier dans la durée (facture, écriture comptable, déclaration TVA, DSF) → page dédiée.
- Le choix se fait selon ce qui est le plus approprié au contexte, jamais par défaut vers la solution la plus rapide à coder.

---

## 10. KPI Toujours Explicatifs

- Aucun chiffre brut sans contexte. Chaque KPI affiche : son libellé clair, sa valeur, sa tendance/variation si pertinente, et une explication accessible (info-bulle ou sous-titre) de ce qu'il mesure et comment il est calculé.
- Priorité pour les notions non évidentes pour un utilisateur non-comptable : TVA nette due, EBE, CAF, RAO/RHAO, créances clients, etc. — toujours vulgarisées en une phrase simple.
- Un KPI ne doit jamais nécessiter que l'utilisateur devine ce qu'il représente.

---

## 11. Tableaux de Données Volumineuses

- Si une ligne de tableau contient trop d'informations pour tenir proprement, ligne pliable/dépliable (expand/collapse), jamais de scroll horizontal forcé ni de troncature silencieuse de données.
- Sous `lg`, les tableaux se transforment en cartes empilées.
- Les statuts de workflow (`pending`, `posted`, `validated`, `matched`...) sont toujours traduits en français humain, jamais affichés en snake_case brut.

---

## 12. Mobile-First — Non Négociable

- Chaque écran, chaque composant, chaque fonctionnalité est pensé mobile (~375-390px) → tablette → desktop, jamais l'inverse. Aucune tâche frontend n'est terminée si les trois formats n'ont pas été vérifiés.
- Breakpoints Tailwind : `sm:640 md:768 lg:1024 xl:1280`.
- Zones tactiles ≥ 44px.

---

## 13. Règles Backend & API (Next.js / TypeScript)

Note : la stack Ceilow définie au cahier des charges est Next.js Server Route Handlers + NextAuth v5 + Prisma/PostgreSQL — pas de service Django. Les règles ci-dessous adaptent l'esprit des règles backend (rigueur de typage, gestion d'erreurs, format de réponse standard) à cette stack réelle.

- Typage strict : TypeScript partout, aucun `any` non justifié, types calqués sur les modèles Prisma réels.
- Gestion des erreurs : blocs `try/catch` précis, chaque erreur loguée (voir §7) avec le code HTTP adéquat renvoyé (400, 401, 403, 404, 409, 422, 500 selon le cas — jamais un 200 avec une erreur cachée dans le corps).
- Format des réponses API — toutes les routes suivent strictement cette structure :

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

En cas d'échec : `"success": false`, `"data": null`, `"error"` contient un message clair et exploitable côté frontend (jamais une stack trace brute exposée au client).

- Sécurité & CORS : restreindre l'origine au domaine du frontend, authentification via cookies `HttpOnly` (session NextAuth), jamais de token sensible exposé en `localStorage`.

---

## 14. Règles Frontend (React, Next.js & TypeScript)

- Typage strict pour toutes les props, states et structures de réponses d'API.
- Structure et modularité : composants UI réutilisables dans `components/ui/`, composants Features connectés à la logique d'API dans `components/features/`.
- Principe DRY (Don't Repeat Yourself). Code complet livré, sans TODO ni placeholder.
- Responsive et accessibilité : Tailwind en approche mobile-first, HTML5 sémantique, rôles ARIA corrects, icônes toujours accompagnées d'un `title`/tooltip accessible.

---

## 15. Intégration & Connectivité

- Le client HTTP unifié (fetch/Axios) inclut systématiquement les cookies sécurisés dans les requêtes (`credentials: 'include'`).
- Un intercepteur sur le client HTTP redirige automatiquement l'utilisateur vers la page de login lors d'une erreur `401` ou `403`, sans page blanche ni état bloqué silencieux.

---

## 16. Composants — 21st.dev avant tout

- Avant de coder un composant UI (carte, table, stepper, drawer, dropzone, badge, form...), le chercher via les tools MCP `21st`. Jamais de composant générique from scratch sans être passé par cette recherche.
- `search` et `get_inspiration` sont gratuits et illimités, à utiliser librement. `get_component` et `generate` sont limités par un quota quotidien, réservés aux candidats déjà présélectionnés via les métadonnées (nom, description, preview).
- Éviter les composants payants/Premium : privilégier les alternatives gratuites.
- Si un appel `get_component`/`generate` échoue ou renvoie `locked=true`, appeler `get_usage` avant de retenter.
- Notification immédiate à l'utilisateur dès que le quota de téléchargement de code source de `21st.dev` est épuisé.
- Tout composant importé est adapté avant intégration : couleurs remplacées par les tokens Ceilow, comportement rendu mobile-first, props renommées pour matcher les types TS du projet.
- Si rien de pertinent n'est trouvé ou si le quota est épuisé, coder à la main en s'inspirant des métadonnées et le mentionner explicitement.

Basculement multi-clés (21st, 21st-2...21st-8) :

- 8 instances de serveurs MCP 21st.dev sont enregistrées dans le projet.
- Appeler `get_usage` avant toute session intensive de recherche.
- Si `21st` retourne `locked=true` ou `0 remaining`, basculer immédiatement sur le serveur suivant.
- Déclencher le protocole copier-coller uniquement si les 8 instances sont épuisées :
  1. Annoncer clairement l'épuisement des quotas.
  2. Identifier la liste complète des composants à récupérer avant de commencer.
  3. Demander le premier composant (URL exacte, code source depuis l'onglet "Code").
  4. Attendre que l'utilisateur colle le code.
  5. Intégrer (tokens, mobile-first, TypeScript) avant de demander le suivant.
  6. Répéter un par un, jamais deux à la fois.
- Ne jamais coder un composant générique en silence comme alternative aux quotas épuisés sans avoir essayé les 8 serveurs et déclenché ce protocole en dernier recours.

---

## 17. Intuitivité & Standards Universels du Marché

Ceilow doit pouvoir être utilisé sans formation par quelqu'un qui n'a jamais utilisé de logiciel comptable. Respecter les conventions déjà connues (Pennylane, Axonaut, Sage, Indy) plutôt que réinventer des patterns :

- Toute action destructrice (supprimer, rejeter, révoquer) passe par une modale de confirmation explicite, jamais d'exécution directe au premier clic.
- Reconnaissance plutôt que rappel : les actions possibles sont visibles à l'écran, jamais à deviner.
- Cohérence stricte entre rôles proches : un même type d'action (valider, rejeter, exporter) garde toujours le même libellé, la même icône, le même emplacement d'un dashboard à l'autre.
- Formulaires : validation inline au fur et à mesure, messages d'erreur au plus près du champ concerné, focus automatique sur le premier champ en erreur.
- Modales : focus trap, fermeture au `Escape`, focus rendu à l'élément déclencheur à la fermeture.
- Breadcrumb visible sur toute sous-page à plus d'un niveau de profondeur.
- Recherche/filtres : "aucun résultat", "chargement" et "vide par défaut" sont trois états visuellement distincts, jamais confondus.
- UX writing : français, ton direct et fonctionnel, jamais de jargon marketing dans un dashboard. Boutons 1-3 mots, action-first. Erreurs = quoi/pourquoi/comment corriger. États vides toujours actionnables.

---

## 18. Périmètre, Données Réelles & Lecture Intégrale

- Interdiction formelle des données mockées : zéro mock, zéro bouchon statique. Toutes les données proviennent des vraies routes API (Next.js Route Handlers + Prisma/PostgreSQL), avec authentification NextAuth v5, typage TypeScript strict calqué sur les modèles réels.
- Lecture intégrale exhaustive : pour tout audit, refactoring ou implémentation, lire 100% des lignes de chaque fichier concerné — zéro omission, zéro supposition de contenu.
- Réutilisation : avant de réécrire un hook/composant, vérifier l'inventaire existant (`useAuth`, `useCompany`, `usePermissions`, `useInvoiceForm`, `useReconciliation`, `useAuditLog`...). Adapter plutôt que réécrire.
- Chaque champ affiché correspond à un champ réel des modèles Prisma/API, jamais un champ inventé. Croiser systématiquement le cahier des charges métier et le plan technique.

---

## 19. Speckit — Workflow Obligatoire & Checklist de Conformité

- Toute nouvelle fonctionnalité passe par le pipeline Speckit (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`), avec `/speckit-clarify` et `/speckit-checklist` en renfort si la fonctionnalité est ambiguë ou sensible.
- Avant de considérer une tâche terminée, repasser systématiquement cette checklist de conformité :
  - Aucune couleur hors palette / hors tokens
  - Typographie conforme (Clash Display vitrine uniquement / Inter dans l'app)
  - Aucun emoji, aucun glassmorphisme, aucune bordure d'accent improvisée
  - Toast + log présents sur chaque action significative
  - Indicateur de chargement visible sur toute action asynchrone
  - Contenu complexe traité en wizard ou page dédiée, jamais en grande modale simple
  - KPI accompagnés d'une explication claire
  - Tableau volumineux → lignes pliables/dépliables
  - Vérifié en mobile, tablette et desktop
  - Réponses API au format standard `{success, data, error}`
  - Aucune donnée mockée, tout vient de l'API réelle
  - Fichier mémoire projet mis à jour (voir §20)
- `/speckit-converge` est utilisé régulièrement pour comparer le code livré à la constitution du projet et remonter les écarts en tâches concrètes.

---

## 20. Mémoire Projet — Fichier de Suivi Continu

- Un fichier mémoire de suivi (`PROJECT_MEMORY.md` à la racine du repo) est mis à jour après chaque action effectuée sur le projet, jamais différé en fin de session.
- Chaque entrée trace : ce qui a été fait, pourquoi, les décisions techniques prises, ce qu'il reste à faire.
- Ce fichier sert de référence pour reprendre le travail à tout moment sans perdre le contexte, notamment lors des passages `/speckit-converge`.
