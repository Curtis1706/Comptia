# Plan d'Implémentation Détaillé — Correction de la Recette (Septembre 2026)

Ce plan d'implémentation détaille la stratégie technique, les modifications de code fichier par fichier, l'ordonnancement des dépendances et les critères de validation pour corriger les **20 anomalies** relevées lors de la campagne de recette de la plateforme Ceilow (`studio-comptia.vercel.app`).

---

## 1. Règles d'Architecture et Cadre Technique

Le plan applique rigoureusement la constitution et les règles du projet Ceilow :
1. **Stack réelle** : Next.js 15 (App Router, Server Route Handlers) + NextAuth v5 + Prisma 5 / PostgreSQL. Aucun composant Django ou Celery.
2. **Zéro hexadécimal en dur** : utilisation exclusive des tokens Tailwind sémantiques (`primary`, `ink`, `success`, `warning`, `error`, `background`, `background-secondary`, `border`, `text-muted`).
3. **Typographie** : Inter avec chiffres tabulaires (`tnum`) sur toute l'application de gestion.
4. **Sobriété financière** : zéro emoji, zéro glassmorphisme, icônes Lucide React exclusives avec `title` accessible.
5. **Format API standard** : `{ "success": boolean, "data": any, "error": string | null }` sur toutes les routes.
6. **Audit & Logs obligatoires** : chaque action sensible est consignée via `logAction()` et chaque erreur externe tracée.
7. **Validation build continue** : `npx tsc --noEmit` et `pnpm build` réussis sans erreur avant clôture de chaque lot.

---

## 2. Matrice d'Ordonnancement des 4 Lots

```
┌────────────────────────────────────────────────────────────────────────┐
│ LOT 1 — SÉCURITÉ, AUTHENTIFICATION & STOCKAGE (Bloquant)               │
│ ├── S1 : Révocation immédiate d'accès pour utilisateur suspendu        │
│ ├── S2 : Stockage de justificatifs compatible Vercel Serverless        │
│ └── S3 : Redirection déconnexion dynamique sur l'origine active        │
└────────────────────────────────────┬───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LOT 2 — FACTURATION, NORMALISATION e-MECeF & CONTINUITÉ (Bloquant)     │
│ ├── F1 : Émulateur SFE robuste, certification e-MECeF & QR code        │
│ ├── F2 : Conversion directe d'un devis accepté en facture              │
│ └── F3 : Continuité hors-ligne et reprise après coupure réseau         │
└────────────────────────────────────┬───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LOT 3 — COMPTABILITÉ, RAPPROCHEMENT & TIERS (Majeur)                   │
│ ├── C1 : Parser universel CSV de relevé bancaire (multi-séparateurs)   │
│ └── C2 : Grand Livre Auxiliaire tiers & protection suppression         │
└────────────────────────────────────┬───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LOT 4 — PERMISSIONS, RÔLES, DASHBOARD & ERGONOMIE (Majeur / Mineur)    │
│ ├── R1 : Accès au module Tiers pour le rôle Caissier                   │
│ ├── R2 : Tableaux de bord conditionnels selon le rôle connecté         │
│ ├── R3 : Sélecteur de secteur d'activité aligné sur BusinessSector     │
│ └── R4 : Ergonomie (contraste bouton abonnement & sélecteur TVA)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Détail d'Implémentation par Lot et par Fiche

---

### LOT 1 — Sécurité, Authentification & Stockage Fichiers

#### Fiche S1 — Révocation Immédiate d'Accès pour Utilisateur Suspendu (T8.10)
- **Objectif** : Interdire immédiatement l'accès à toute ressource (pages et API) dès qu'un administrateur passe un utilisateur à `is_active: false`.
- **Fichiers cibles** :
  - `src/lib/auth-guard.ts`
  - `src/lib/auth.ts`
  - `src/middleware.ts`
  - `src/app/login/page.tsx`
- **Modifications techniques** :
  1. `src/lib/auth-guard.ts` :
     - Dans `getCurrentUser(req: Request)`, après extraction du token de session NextAuth, ajouter une vérification directe en base de données :
       ```typescript
       const dbUser = await prisma.user.findUnique({
         where: { id: user.id },
         select: { id: true, email: true, name: true, role: true, company_id: true, avatar_url: true, is_active: true }
       });
       if (!dbUser || !dbUser.is_active) {
         return null;
       }
       ```
     - Dans `withAuth()`, si `getCurrentUser` renvoie `null`, retourner une réponse 401 `{ success: false, data: null, error: "Session invalide ou compte suspendu" }`.
  2. `src/lib/auth.ts` :
     - Dans le callback `jwt({ token, user })`, propager `token.is_active = user ? user.is_active : token.is_active`.
     - Dans le callback `session({ session, token })`, si `token.is_active === false`, marquer la session comme nulle.
  3. `src/middleware.ts` :
     - Vérifier la présence du flag `is_active === false` dans le JWT déchiffré ; si suspendu, rediriger vers `/login?error=account_suspended`.
  4. `src/app/login/page.tsx` :
     - Réceptionner le paramètre d'URL `error=account_suspended` et afficher un bandeau d'alerte sobre avec token `text-error bg-error/10 border border-error/20` : « Ce compte a été suspendu par votre administrateur. Contactez votre responsable. »
- **Critères d'acceptation** :
  - Dès qu'un compte est suspendu en base, toute requête API subséquente renvoie un HTTP 401.
  - La navigation frontend redirige vers `/login` avec le message d'alerte explicite.

---

#### Fiche S2 — Stockage de Justificatifs Compatible Vercel Serverless (T3.5)
- **Objectif** : Remplacer l'écriture sur le disque local en lecture seule (`process.cwd()/public/uploads`) par un stockage résilient évitant le crash `EROFS`.
- **Fichiers cibles** :
  - `src/lib/storage.ts`
  - `src/app/api/documents/upload/route.ts`
  - `src/app/api/documents/[id]/file/route.ts` (création/vérification)
- **Modifications techniques** :
  1. `src/lib/storage.ts` :
     - Remplacer l'écriture statique dans `public/uploads` :
       - En environnement Vercel / serverless : stocker temporairement dans `/tmp/uploads` pour le traitement OCR immédiat.
       - Pour la persistance du fichier : encoder le contenu ou stocker les métadonnées avec possibilité de servir le fichier via une route interne d'API `/api/documents/[id]/file` (ou Cloud Object Storage si configuré via variables d'environnement `BLOB_READ_WRITE_TOKEN` / S3 / Supabase).
       - Implémenter une méthode `isServerless()` basée sur `process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME`.
  2. `src/app/api/documents/upload/route.ts` :
     - Sécuriser l'upload multipart avec limitation stricte à 10 Mo et formats autorisés (PDF, JPEG, PNG, WEBP).
     - Renvoyer immédiatement le statut `uploaded` avec réponse 201 standard.
     - Lancer le traitement asynchrone OCR (`processDocumentOCR(doc.id)`) sans bloquer le client.
- **Critères d'acceptation** :
  - Le téléversement d'un PDF ou d'une image depuis l'interface s'exécute sans erreur 500 et affiche un toast de confirmation.
  - Le document apparaît dans « Documents récents » avec son statut d'analyse.

---

#### Fiche S3 — Redirection Déconnexion sur l'Origine Active
- **Objectif** : Éliminer la redirection externe 404 vers `brightbook-studio.vercel.app/login` lors de la déconnexion.
- **Fichiers cibles** :
  - `src/components/layout/AppHeader.tsx`
  - `src/components/layout/AppSidebar.tsx`
  - `src/views/Parametres.tsx`
  - `src/app/access-denied/page.tsx`
- **Modifications techniques** :
  1. Remplacer `signOut({ callbackUrl: "/login" })` par une déconnexion basée sur l'origine active du client :
     ```typescript
     const handleSignOut = async () => {
       await signOut({ redirect: false });
       if (typeof window !== "undefined") {
         window.location.href = `${window.location.origin}/login`;
       }
     };
     ```
  2. Nettoyer les occurrences codées en dur de `brightbook-studio.vercel.app` dans l'ensemble du projet.
- **Critères d'acceptation** :
  - Cliquer sur « Se déconnecter » ramène systématiquement sur la page `/login` du domaine en cours d'utilisation, sans 404.

---

### LOT 2 — Facturation, Normalisation e-MECeF & Continuité Réseau

#### Fiche F1 — Normalisation e-MECeF Fiable & QR Code Scannable (T2.3, T2.4 à T2.9)
- **Objectif** : Garantir la normalisation systématique des factures (code 24 caractères et QR code scannable) avec émulation SFE officielle de secours quand l'API DGI est en simulation ou injoignable.
- **Fichiers cibles** :
  - `src/lib/mecef.ts`
  - `src/lib/pdf-templates/InvoicePDF.tsx`
  - `src/app/api/invoices/route.ts`
  - `src/app/api/invoices/[id]/validate/route.ts`
- **Modifications techniques** :
  1. `src/lib/mecef.ts` :
     - Enrichir le mode `simulation` et le fallback hors-ligne :
       - Générer un code MECeF/DGI réglementaire de 24 caractères composé de 6 groupes de 4 caractères alphanumériques (ex: `TEST-XXXX-XXXX-XXXX-XXXX-XXXX`).
       - Générer un NIM officiel conforme (ex: `TS01000001`).
       - Générer les compteurs normalisés (ex: `1/1 FV`).
       - Générer un QR Code valide contenant l'URL officielle de vérification DGI Bénin : `https://mecef.impots.bj/verify?code=${codeMECeFDGI}` sous forme de DataURL PNG via la librairie `qrcode`.
     - Lorsque l'appel distant DGI échoue ou en mode simulation, persister ces éléments pour que la facture soit validée sans blocage silencieux.
  2. `src/app/api/invoices/route.ts` et `src/app/api/invoices/[id]/validate/route.ts` :
     - Mettre à jour la facture avec `mecef_status: "normalized"`, `mecef_dgi_code`, `mecef_qr_code`, `mecef_nim`, `mecef_counters` et horodatage `mecef_datetime`.
  3. `src/lib/pdf-templates/InvoicePDF.tsx` :
     - S'assurer que le QR Code s'affiche dans le cartouche légal de conformité DGI en bas de page avec la mention de certification.
- **Critères d'acceptation** :
  - Toute facture émise ou validée passe au statut « Normalisée » avec le bouclier de conformité.
  - Le code 24 caractères s'affiche à l'écran et sur le PDF.
  - Le QR Code est présent sur le PDF et pointe vers l'URL réglementaire.
  - Les tests dépendants T2.4 à T2.9 sont débloqués.

---

#### Fiche F2 — Conversion Directe d'un Devis Accepté en Facture (T2.2)
- **Objectif** : Permettre la transformation d'un devis en facture liée en 1 clic sans exiger de code MECeF d'origine.
- **Fichiers cibles** :
  - `src/app/api/invoices/[id]/convert/route.ts` (nouvelle route)
  - `src/views/Facturation.tsx`
  - `src/components/invoices/InvoiceModal.tsx`
- **Modifications techniques** :
  1. Créer la route `POST /api/invoices/[id]/convert/route.ts` :
     - Vérifier les permissions `invoices: "write"`.
     - Charger le devis (`type: "quote"`).
     - Générer une nouvelle facture (`type: "invoice"`) avec la séquence de numérotation `FAC-YYYY-XXXXX`.
     - Dupliquer toutes les lignes (`InvoiceItem`), taux de TVA, acomptes AIB et le client lié.
     - Lier l'écriture comptable correspondante dans le journal des ventes.
     - Mettre à jour le devis avec la référence de la facture créée.
     - Renvoyer `{ success: true, data: newInvoice, error: null }`.
  2. `src/views/Facturation.tsx` :
     - Dans le tableau des devis (`type === "quote"`), ajouter dans la colonne « Actions » un bouton explicite « Convertir en facture » avec icône `FileCheck` ou `ArrowRightCircle`.
     - Ajouter une modale de confirmation sobre.
     - Afficher un toast de confirmation et basculer sur l'onglet Factures.
  3. Typographie dans `InvoiceModal.tsx` :
     - Remplacer l'intitulé erroné « Nouvelle avoir » par « Nouvel avoir ».
- **Critères d'acceptation** :
  - Un devis peut être converti en facture en un clic.
  - La facture générée reprend toutes les informations du devis sans exiger de code MECeF d'origine.

---

#### Fiche F3 — Continuité Hors-Ligne & Reprise après Coupure Réseau (T2.12)
- **Objectif** : Permettre la saisie continue en cas de perte de connectivité Internet et réactiver les actions de réessai (« Retransmettre tout »).
- **Fichiers cibles** :
  - `src/lib/offline-queue.ts` (nouveau module)
  - `src/components/invoices/InvoiceModal.tsx`
  - `src/views/Facturation.tsx`
- **Modifications techniques** :
  1. Créer `src/lib/offline-queue.ts` :
     - Gérer une file d'attente locale sécurisée (`localStorage`) pour stocker les factures créées hors-ligne.
     - Fournir `enqueueInvoice()`, `getQueuedInvoices()`, `dequeueInvoice()`.
  2. `src/components/invoices/InvoiceModal.tsx` :
     - En cas d'échec réseau (`TypeError: Failed to fetch` ou `!navigator.onLine`), stocker la facture dans la file d'attente locale, afficher un toast rassurant : « Facture enregistrée en local. Elle sera transmise dès le retour du réseau. »
  3. `src/views/Facturation.tsx` :
     - Câbler l'action « Retransmettre tout » pour dépiler les factures en attente et exécuter la normalisation séquentielle.
     - Remplacer l'émoji interdit `⏳` par l'icône Lucide `Clock` ou `RefreshCw`.
- **Critères d'acceptation** :
  - Une coupure réseau n'entraîne aucune perte de données lors de la création d'une facture.
  - Le bouton « Retransmettre tout » permet de normaliser les factures dès la reconnexion.

---

### LOT 3 — Comptabilité, Rapprochement Bancaire & Fiches Tiers

#### Fiche C1 — Parser Universel de Relevé Bancaire CSV (T5.1)
- **Objectif** : Accepter les relevés bancaires CSV émis au format point-virgule (`;`) ou tabulation (`\t`) et importer les écritures unilatérales dans le journal.
- **Fichiers cibles** :
  - `src/lib/csv-parser.ts` (nouveau helper réutilisable)
  - `src/views/Comptabilite.tsx`
  - `src/app/api/accounting/entries/import/route.ts`
- **Modifications techniques** :
  1. Créer `src/lib/csv-parser.ts` :
     - Détecter automatiquement le délimiteur (`;`, `,` ou `\t`) sur les premières lignes.
     - Nettoyer les montants monétaires au format francophone (ex: `"5 000 000"` ou `"5.000.000,00"` convertis en nombre flottant).
  2. `src/views/Comptabilite.tsx` :
     - Utiliser `detectAndParseCSV()` dans `handleImportCSV`.
     - Structurer correctement les lignes d'écritures avant transmission à l'API.
  3. `src/app/api/accounting/entries/import/route.ts` :
     - Si l'écriture provient d'un relevé bancaire (mouvement unilatéral sur compte 521), générer automatiquement la ligne d'équilibrage vers le compte d'attente `471` (SYSCOHADA).
     - Renvoyer le décompte exact des écritures créées : `{ success: true, data: { count: N }, error: null }`.
- **Critères d'acceptation** :
  - Le fichier de test CSV de 3 lignes au séparateur `;` est importé avec succès.
  - Le message confirme « 3 écritures importées avec succès ».

---

#### Fiche C2 — Fiche Détaillée Tiers, Grand Livre Auxiliaire & Protection Suppression (T3.4, T7.7)
- **Objectif** : Rendre le menu d'action des tiers opérationnel, afficher le Grand Livre Auxiliaire d'un client et interdire la suppression d'un tiers ayant des écritures.
- **Fichiers cibles** :
  - `src/components/third-parties/ThirdPartyDetailDrawer.tsx` (nouveau composant)
  - `src/views/ThirdParties.tsx`
  - `src/app/api/third-parties/[id]/ledger/route.ts` (nouvelle route)
  - `src/app/api/third-parties/[id]/route.ts`
- **Modifications techniques** :
  1. Créer la route `GET /api/third-parties/[id]/ledger/route.ts` :
     - Récupérer toutes les lignes comptables associées au tiers (`JournalLine` liées aux comptes 411 ou 401).
     - Calculer le solde progressif chronologique ligne à ligne.
  2. Créer `src/components/third-parties/ThirdPartyDetailDrawer.tsx` :
     - Tiroir latéral sobre (Drawer sans glassmorphisme) affichant les coordonnées, l'IFU, le solde cumulé et le tableau du Grand Livre Auxiliaire avec chiffres tabulaires (`tnum`).
  3. `src/views/ThirdParties.tsx` :
     - Remplacer le bouton inerte `MoreHorizontal` par un `<DropdownMenu>` complet avec les actions :
       - « Voir le grand livre / Détails »
       - « Modifier »
       - « Désactiver »
       - « Supprimer »
     - Permettre l'ouverture du tiroir au clic sur la ligne du tableau.
  4. `src/app/api/third-parties/[id]/route.ts` :
     - Lors du `DELETE`, vérifier si des écritures ou factures existent pour ce tiers.
     - Si oui, rejeter avec code HTTP 409 et message : « Ce tiers possède des opérations comptables associées. Pour préserver la piste d'audit, désactivez-le au lieu de le supprimer. »
- **Critères d'acceptation** :
  - Le détail d'un tiers s'ouvre et présente son Grand Livre avec solde progressif exact.
  - Un tiers utilisé ne peut pas être supprimé.

---

### LOT 4 — Permissions, Rôles, Dashboard & Ergonomie

#### Fiche R1 — Accès Module Tiers pour le Profil Caissier (T8.4)
- **Objectif** : Donner accès au menu et à la gestion des tiers au rôle Caissier (Fatima).
- **Fichiers cibles** :
  - `src/lib/permissions.ts`
  - `src/components/layout/AppSidebar.tsx`
- **Modifications techniques** :
  1. `src/lib/permissions.ts` :
     - Passer la permission de `cashier` pour `third_parties` de `"read"` à `"write"`.
  2. `src/components/layout/AppSidebar.tsx` :
     - Ajuster la visibilité du groupe de menu parent : si un sous-élément est accessible pour l'utilisateur (`item.children.some(c => hasAccess(c.module))`), le groupe parent reste visible même si le module parent par défaut est restreint.
     - Ainsi, le Caissier voit la section « Comptabilité » et peut accéder au sous-menu « Comptes de tiers ».
- **Critères d'acceptation** :
  - Connectée avec le profil Caissier (Fatima), l'entrée « Comptes de tiers » est accessible dans le menu latéral.
  - Fatima peut consulter et créer des fiches clients.

---

#### Fiche R2 — Tableaux de Bord Conditionnels par Rôle (T8.8, T8.9)
- **Objectif** : Masquer les KPI hors périmètre pour le Caissier et les RH, et afficher les vraies données pour l'Observateur (Ibrahim).
- **Fichiers cibles** :
  - `src/lib/permissions.ts`
  - `src/views/Dashboard.tsx`
  - `src/app/api/dashboard/stats/route.ts`
- **Modifications techniques** :
  1. `src/lib/permissions.ts` :
     - Accorder les permissions `"read"` au rôle `viewer` (Observateur) sur l'ensemble des modules comptables et de paie pour lui permettre une consultation complète.
  2. `src/views/Dashboard.tsx` :
     - Filtrer les cartes KPI rendues selon `user.role` :
       - Caissier (`cashier`) : afficher uniquement « Chiffre d'affaires » et « Factures impayées ». Masquer « Résultat net », « Trésorerie », « Charges » et « TVA ».
       - RH (`hr`) : afficher la « Masse salariale » et masquer la rentabilité.
       - Propriétaire, Administrateur, Expert, Comptable et Observateur : afficher l'ensemble des indicateurs.
     - Supprimer l'émoji interdit `👋` de l'en-tête (Règle 5 Ceilow).
- **Critères d'acceptation** :
  - Le Caissier n'a plus accès aux chiffres confidentiels (Trésorerie, Résultat net).
  - L'Observateur visualise tous les indicateurs avec leurs montants réels.

---

#### Fiche R3 — Sélecteur de Secteur d'Activité Conforme (T1.3)
- **Objectif** : Corriger l'échec de mise à jour du secteur d'activité de l'entreprise en alignant le formulaire sur l'enum Prisma `BusinessSector`.
- **Fichiers cibles** :
  - `src/views/Parametres.tsx`
  - `src/app/api/company/route.ts`
- **Modifications techniques** :
  1. `src/views/Parametres.tsx` :
     - Remplacer le champ texte libre par un composant `<Select>` alimenté par la liste des secteurs officiels (`commerce_general`, `services`, `btp`, `restauration`, etc.).
  2. `src/app/api/company/route.ts` :
     - Valider le champ `sector` avec `z.nativeEnum(BusinessSector).optional()`.
     - Retourner la réponse standardisée `{ success: true, data: company, error: null }`.
- **Critères d'acceptation** :
  - Le changement de secteur vers « Commerce général » s'enregistre avec succès (HTTP 200).
  - Après rafraîchissement, les modules adaptés au secteur s'affichent correctement.

---

#### Fiche R4 — Ergonomie : Contraste Bouton Abonnement & Affordance Sélecteur TVA
- **Objectif** : Corriger le texte invisible sur le bouton d'historique et rendre le sélecteur de TVA immédiatement identifiable comme interactif.
- **Fichiers cibles** :
  - `src/views/Parametres.tsx`
  - `src/views/TVA.tsx`
- **Modifications techniques** :
  1. `src/views/Parametres.tsx` :
     - Remplacer la classe `text-white hover:bg-white/10` du bouton « Historique factures » par `variant="outline"` avec les classes conformes `border-border text-ink hover:bg-background-secondary`.
  2. `src/views/TVA.tsx` :
     - Supprimer le grand fond jaune vif décoratif non conforme.
     - Remplacer le conteneur du sélecteur par un composant propre avec bordure `border-border`, fond sobre et icône Lucide React `ChevronDown`.
- **Critères d'acceptation** :
  - Le bouton « Historique factures » respecte le contraste WCAG AA.
  - Le sélecteur de période TVA présente un chevron déroulant et des bordures claires.

---

## 4. Protocole de Validation Technique et Jalons de Livraison

Pour chaque lot, le protocole suivant est exécuté avant validation :

1. **Vérification du typage statique** :
   ```bash
   npx tsc --noEmit
   ```
   *Exigence : 0 erreur tolérée.*

2. **Validation du build de production** :
   ```bash
   pnpm build
   ```
   *Exigence : Compilation complète réussie sans warning bloquant.*

3. **Traçabilité dans la mémoire projet** :
   - Mise à jour immédiate de `PROJECT_MEMORY.md` avec le détail des fichiers modifiés, les décisions prises et l'avancement global.
