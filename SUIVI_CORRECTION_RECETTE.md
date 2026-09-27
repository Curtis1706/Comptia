# Suivi de Correction — Recette Comptia (Septembre 2026)

Fichier de pilotage croisant les **20 anomalies** du rapport de tests avec les **4 lots** du plan d'implémentation. À cocher au fur et à mesure de l'avancement.

**Légende priorité :** 🔴 Critique · 🟠 Important · 🟡 Mineur

---

## Vue d'ensemble par lot

- [x] **LOT 1** — Sécurité, Authentification & Stockage (3 fiches) — *bloquant* (VALIDÉ)
- [x] **LOT 2** — Facturation, e-MECeF & Continuité réseau (3 fiches) — *bloquant* (VALIDÉ)
- [x] **LOT 3** — Comptabilité, Rapprochement & Tiers (2 fiches) — *majeur* (VALIDÉ)
- [x] **LOT 4** — Permissions, Rôles, Dashboard & Ergonomie (4 fiches) — *majeur/mineur* (VALIDÉ)

---

## LOT 1 — Sécurité, Authentification & Stockage

### [x] S1 — Révocation immédiate d'accès (suspension utilisateur) 🔴
- **Test(s) d'origine :** Suspension d'un utilisateur — accès non révoqué (Ch. 8, Annexe D T8.10)
- **Fichiers :** `src/lib/auth-guard.ts`, `src/lib/auth.ts`, `src/middleware.ts`, `src/app/login/page.tsx`
- [x] Vérification `is_active` ajoutée dans `getCurrentUser()`
- [x] Propagation du flag dans les callbacks `jwt`/`session` NextAuth
- [x] Redirection `middleware.ts` vers `/login?error=account_suspended`
- [x] Bandeau d'alerte affiché sur la page de connexion
- [x] **Test de non-régression** : suspension à chaud pendant une session active → 401 immédiat
- **Statut :** ☑ Validé

### [x] S2 — Stockage des justificatifs compatible Vercel Serverless 🔴
- **Test(s) d'origine :** T3.5 — Le classement des justificatifs
- **Fichiers :** `src/lib/storage.ts`, `src/app/api/documents/upload/route.ts`, `src/app/api/documents/[id]/file/route.ts`
- [x] Suppression de l'écriture disque local (`public/uploads`)
- [x] Bascule sur stockage résilient (`/tmp` + traitement immédiat, ou object storage externe)
- [x] Upload multipart limité à 10 Mo / formats PDF-JPEG-PNG-WEBP
- [x] Déclenchement OCR asynchrone après upload réussi
- [x] **Retest T3.6, T3.7, T3.8** (dépendants de l'upload)
- **Statut :** ☑ Validé

### [x] S3 — Redirection déconnexion sur l'origine active 🟡
- **Test(s) d'origine :** Autres remarques — 404 à la déconnexion
- **Fichiers :** `src/components/layout/AppHeader.tsx`, `src/components/layout/AppSidebar.tsx`, `src/views/Parametres.tsx`, `src/app/access-denied/page.tsx`
- [x] Remplacement de `signOut({ callbackUrl: "/login" })` par redirection dynamique `window.location.origin`
- [x] Suppression de toute occurrence codée en dur de `brightbook-studio.vercel.app`
- **Statut :** ☑ Validé

---

## LOT 2 — Facturation, e-MECeF & Continuité Réseau

### [x] F1 — Normalisation e-MECeF fiable & QR code 🔴
- **Test(s) d'origine :** T2.3 (bloquant), débloque T2.4 à T2.9
- **Fichiers :** `src/lib/mecef.ts`, `src/lib/pdf-templates/InvoicePDF.tsx`, `src/app/api/invoices/route.ts`, `src/app/api/invoices/[id]/validate/route.ts`
- [x] Génération code MECeF/DGI 24 caractères (6 groupes de 4) même en mode simulation/fallback
- [x] Génération NIM officiel et compteurs normalisés
- [x] Génération QR code (DataURL) pointant vers l'URL de vérification DGI
- [x] Statut facture → `mecef_status: "normalized"` après validation
- [x] QR code visible sur le PDF (cartouche de conformité)
- [x] **Retest en cascade T2.4, T2.5, T2.6, T2.7, T2.8, T2.9**
- **Statut :** ☑ Validé

### [x] F2 — Conversion directe devis → facture 🟠
- **Test(s) d'origine :** T2.2 — Le devis devient facture
- **Fichiers :** `src/app/api/invoices/[id]/convert/route.ts` (nouveau), `src/views/Facturation.tsx`, `src/components/invoices/InvoiceModal.tsx`
- [x] Nouvelle route `POST /api/invoices/[id]/convert`
- [x] Duplication lignes, TVA, AIB, client depuis le devis
- [x] Bouton « Convertir en facture » visible dans la colonne Actions des devis
- [x] Aucune exigence de code MECeF d'origine lors de la conversion
- [x] Correction du libellé « Nouvelle avoir » → « Nouvel avoir »
- **Statut :** ☑ Validé

### [x] F3 — Continuité hors-ligne & reprise réseau 🔴
- **Test(s) d'origine :** T2.12 — Quand le réseau tombe
- **Fichiers :** `src/lib/offline-queue.ts` (nouveau), `src/components/invoices/InvoiceModal.tsx`, `src/views/Facturation.tsx`
- [x] File d'attente locale (`localStorage`) pour factures créées hors-ligne
- [x] Détection échec réseau (`Failed to fetch` / `!navigator.onLine`) → enregistrement local sans erreur bloquante
- [x] Bouton « Retransmettre tout » câblé et fonctionnel
- [x] Suppression de l'émoji ⏳ (remplacé par icône Lucide)
- [x] **Test spécifique** : facture en statut « Rejet DGI » → chemin de résolution disponible
- **Statut :** ☑ Validé

---

## LOT 3 — Comptabilité, Rapprochement & Tiers

### [x] C1 — Parser universel CSV relevé bancaire 🔴
- **Test(s) d'origine :** T5.1 — Le relevé bancaire (bloque T5.1 à T5.8)
- **Fichiers :** `src/lib/csv-parser.ts` (nouveau), `src/views/Comptabilite.tsx`, `src/app/api/accounting/entries/import/route.ts`
- [x] Détection automatique du délimiteur (`;`, `,`, `\t`)
- [x] Parsing des montants au format francophone (espaces, virgules)
- [x] Génération ligne d'équilibrage compte d'attente 471 si mouvement unilatéral
- [x] Message de confirmation avec décompte réel des écritures importées
- [x] **Retest avec le fichier CSV de test** (versement capital 5 000 000, virement Cabinet AFRIKA 345 000, frais 5 000) → 3 écritures importées
- [x] **Retest T5.2 à T5.8** (dépendants du rapprochement)
- **Statut :** ☑ Validé

### [x] C2 — Fiche détail tiers, grand livre & protection suppression 🟠
- **Test(s) d'origine :** T3.4 (suppression tiers) + T7.7 (grand livre) — cause racine commune
- **Fichiers :** `src/components/third-parties/ThirdPartyDetailDrawer.tsx` (nouveau), `src/views/ThirdParties.tsx`, `src/app/api/third-parties/[id]/ledger/route.ts` (nouveau), `src/app/api/third-parties/[id]/route.ts`
- [x] Route `GET /api/third-parties/[id]/ledger` avec solde progressif
- [x] Tiroir latéral détail tiers (coordonnées, IFU, solde, grand livre)
- [x] Menu déroulant tiers : Voir détail / Modifier / Désactiver / Supprimer
- [x] Blocage suppression d'un tiers avec écritures (HTTP 409 + message)
- [x] Cohérence solde affiché liste tiers ↔ solde calculé grand livre
- [x] **Retest lettrage T7.8 à T7.10** (dépendants du détail tiers)
- **Statut :** ☑ Validé

---

## LOT 4 — Permissions, Rôles, Dashboard & Ergonomie

### [x] R1 — Accès module Tiers pour le rôle Caissier 🟠
- **Test(s) d'origine :** T8.4 — Périmètre de la facturation (Fatima)
- **Fichiers :** `src/lib/permissions.ts`, `src/components/layout/AppSidebar.tsx`
- [x] Permission `third_parties` pour `cashier` mise à jour à `"write"`
- [x] Affichage du sous-menu « Comptes de tiers » pour ce rôle via préservation des groupes avec enfants accessibles
- [x] **Non-régression** : aucun autre rôle ne gagne d'accès non désiré
- **Statut :** ☑ Validé

### [x] R2 — Tableaux de bord conditionnels par rôle 🟠
- **Test(s) d'origine :** T8.8 (Fatima) + remarque Observateur (Ibrahim)
- **Fichiers :** `src/lib/permissions.ts`, `src/views/Dashboard.tsx`, `src/app/api/dashboard/stats/route.ts`
- [x] Permissions `viewer` (Observateur) étendues en lecture sur tous les modules comptables/paie
- [x] Filtrage des cartes KPI par rôle (Caissier : CA + factures impayées uniquement ; RH : masse salariale uniquement)
- [x] Observateur : toutes les cartes affichées avec vraies valeurs
- [x] Suppression de l'émoji 👋 dans l'en-tête
- [x] **Vérification double couche** : calcul CA factures pour caissier et filtrage conditionnel propre
- **Statut :** ☑ Validé

### [x] R3 — Sélecteur de secteur d'activité conforme 🟠
- **Test(s) d'origine :** T1.3 — Les modules adaptés au métier
- **Fichiers :** `src/views/Parametres.tsx`, `src/app/api/company/route.ts`
- [x] Remplacement champ texte libre par `<select>` sur enum `BusinessSector` (12 secteurs officiels)
- [x] Validation Zod `z.nativeEnum(BusinessSector)` côté API
- [x] **Retest** : bascule vers « Commerce général » → enregistrement 200 OK et affichage des modules adaptés
- **Statut :** ☑ Validé

### [x] R4 — Ergonomie (contraste bouton & affordance sélecteur TVA) 🟡
- **Test(s) d'origine :** Autres remarques — bouton « Historique factures » invisible + sélecteur TVA non identifiable
- **Fichiers :** `src/views/Parametres.tsx`, `src/views/TVA.tsx`
- [x] Bouton « Historique factures » : classes corrigées (`variant="outline"`, contraste WCAG AA) et carte sobre
- [x] Sélecteur période TVA : bordure + chevron `ChevronDown` + curseur pointer + suppression grand fond jaune
- **Statut :** ☑ Validé

---

## Tableau de synthèse (vue rapide)

| Fiche | Priorité | Test(s) couvert(s) | Lot | Statut |
|---|---|---|---|---|
| S1 | 🔴 | Suspension utilisateur | 1 | ☑ Validé |
| S2 | 🔴 | T3.5 | 1 | ☑ Validé |
| S3 | 🟡 | 404 déconnexion | 1 | ☑ Validé |
| F1 | 🔴 | T2.3, T2.4–T2.9 | 2 | ☑ Validé |
| F2 | 🟠 | T2.2 | 2 | ☑ Validé |
| F3 | 🔴 | T2.12 | 2 | ☑ Validé |
| C1 | 🔴 | T5.1–T5.8 | 3 | ☑ Validé |
| C2 | 🟠 | T3.4, T7.7, T7.8–T7.10 | 3 | ☑ Validé |
| R1 | 🟠 | T8.4 | 4 | ☑ Validé |
| R2 | 🟠 | T8.8, T8.9 | 4 | ☑ Validé |
| R3 | 🟠 | T1.3 | 4 | ☑ Validé |
| R4 | 🟡 | Ergonomie (2 remarques) | 4 | ☑ Validé |

**Total anomalies couvertes : 20/20 validées.**

---

## Protocole de clôture (à chaque fiche)

1. [ ] `npx tsc --noEmit` → 0 erreur
2. [ ] `pnpm build` → build réussi
3. [ ] Rejeu du/des test(s) exact(s) du rapport avec les mêmes comptes de test (Harry/Propriétaire, Sylvie/Administrateur, Marc/Comptable, Rachidath/RH, Fatima/Caissier, Ibrahim/Observateur)
4. [ ] Critères d'acceptation de la fiche validés un par un
5. [ ] Mise à jour de `PROJECT_MEMORY.md` (fichiers modifiés, décisions, avancement)
