# Consignes de Correction — Cahier de Recette Comptia (Septembre 2026)

Ce document rassemble les consignes d'implémentation pour résoudre les **20 anomalies** relevées lors de la campagne de tests d'acceptation (document source : `Rapport_de_Tests_Cahier_de_Recette_Comptia_Sept2026.docx.pdf`).

Toutes les interventions doivent respecter strictement les règles architecturales et de design Ceilow :
- **Zéro couleur hexadécimale en dur** : utilisation exclusive des tokens Tailwind sémantiques (`primary`, `ink`, `success`, `warning`, `error`, `background`, `background-secondary`, `border`, `text-muted`).
- **Typographie** : Inter avec chiffres tabulaires (`tnum`) activés pour toute l'application.
- **Sobriété financière** : zéro emoji dans le code, les interfaces ou les documents ; icônes vectorielles Lucide React exclusives.
- **Données réelles et zéro mock** : intégration exclusive avec les routes API Next.js réelles et Prisma/PostgreSQL.
- **Vérification systématique** : `npx tsc --noEmit` puis `pnpm build` passés avec succès avant toute livraison de lot.
- **Mise à jour continue** : traçabilité de chaque action dans `PROJECT_MEMORY.md`.

---

## Table des Matières et Lots d'Exécution

| Lot | Thématique | Criticité | Fiches incluses |
| :--- | :--- | :---: | :--- |
| **Lot 1** | Sécurité, Authentification & Stockage Fichiers | Bloquant | S1, S2, S3 |
| **Lot 2** | Facturation, Normalisation e-MECeF & Continuité Réseau | Bloquant / Majeur | F1, F2, F3 |
| **Lot 3** | Comptabilité, Rapprochement Bancaire & Fiches Tiers | Majeur | C1, C2 |
| **Lot 4** | Permissions, Rôles, Tableaux de Bord & Ergonomie | Majeur / Mineur | R1, R2, R3, R4 |

**Ordre d'exécution recommandé :** Lot 1 → Lot 2 → Lot 3 → Lot 4.

---

## Matrice des Fiches de Correction

| Fiche | Réf. Test | Titre de la Fiche | Gravité | Fichiers Principaux Concernés |
| :--- | :---: | :--- | :---: | :--- |
| **S1** | T8.10 | Révocation immédiate d'accès pour utilisateur suspendu | Bloquant | `src/lib/auth.ts`, `src/lib/auth-guard.ts`, `src/middleware.ts` |
| **S2** | T3.5 | Stockage de justificatifs compatible Vercel Serverless | Bloquant | `src/lib/storage.ts`, `src/app/api/documents/upload/route.ts` |
| **S3** | Déconnexion | Redirection déconnexion sur l'origine active | Mineur | `src/components/layout/AppHeader.tsx`, `AppSidebar.tsx`, `Parametres.tsx` |
| **F1** | T2.3, T2.4–T2.9 | Certification e-MECeF fiable & QR code scannable | Bloquant | `src/lib/mecef.ts`, `src/app/api/invoices/route.ts`, `src/lib/pdf-templates/InvoicePDF.tsx` |
| **F2** | T2.2 | Transformation d'un devis en facture | Majeur | `src/app/api/invoices/[id]/convert/route.ts`, `src/views/Facturation.tsx` |
| **F3** | T2.12 | Continuité de facturation & reprise après coupure réseau | Bloquant | `src/components/invoices/InvoiceModal.tsx`, `src/lib/offline-queue.ts`, `Facturation.tsx` |
| **C1** | T5.1 | Parser universel de relevé bancaire CSV & multi-séparateurs | Bloquant | `src/views/Comptabilite.tsx`, `src/app/api/accounting/entries/import/route.ts` |
| **C2** | T3.4, T7.7 | Fiche détaillée Tiers, Grand Livre & protection suppression | Majeur | `src/views/ThirdParties.tsx`, `src/app/api/third-parties/[id]/route.ts`, `[id]/ledger/route.ts` |
| **R1** | T8.4 | Accès au module Tiers pour le profil Caissier (Fatima) | Majeur | `src/lib/permissions.ts`, `src/components/layout/AppSidebar.tsx` |
| **R2** | T8.8, T8.9 | Filtrage des indicateurs du tableau de bord par rôle | Majeur | `src/views/Dashboard.tsx`, `src/lib/permissions.ts`, `src/app/api/dashboard/stats/route.ts` |
| **R3** | T1.3 | Sélecteur de secteur d'activité avec enum BusinessSector | Majeur | `src/views/Parametres.tsx`, `src/app/api/company/route.ts` |
| **R4** | UI / Ergonomie | Contraste bouton abonnement & Sélecteur période TVA | Mineur | `src/views/Parametres.tsx`, `src/views/TVA.tsx` |

---

---

# LOT 1 — Sécurité, Authentification & Stockage Fichiers

## Fiche S1 — Révocation Immédiate d'Accès pour Utilisateur Suspendu

### Contexte & Constat (Page 12 du rapport)
Un utilisateur (ex: Ibrahim TCHANÉ) marqué comme « Suspendu » (`is_active: false`) depuis l'écran « Équipe & Accès » conserve un accès actif et fonctionnel à l'application. Il continue de naviguer et d'interroger les API sans blocage.

### Cause racine
1. Dans `src/lib/auth.ts`, le token JWT est généré pour 30 jours et ne vérifie pas en continu le statut `is_active` en base de données.
2. Dans `src/lib/auth-guard.ts` (`getCurrentUser`), la session NextAuth est lue directement sans contrôle de l'état actif de l'utilisateur dans PostgreSQL.
3. Dans `src/middleware.ts`, seule la présence du cookie JWT est vérifiée.

### Consignes d'implémentation
1. **Dans `src/lib/auth-guard.ts`** :
   Dans la fonction `getCurrentUser(req: Request)`, après récupération de la session ou du token, requêter systématiquement `prisma.user.findUnique({ where: { id: user.id }, select: { id: true, email: true, name: true, role: true, company_id: true, avatar_url: true, is_active: true } })`.
   Si l'utilisateur n'existe pas ou si `is_active === false`, renvoyer `null`.
2. **Dans `src/lib/auth.ts`** :
   Dans le callback `jwt({ token, user })`, injecter `token.is_active = user.is_active` lors de la connexion.
   Dans le callback `session({ session, token })`, si `token.is_active === false`, invalider la session.
3. **Dans `src/middleware.ts`** :
   Si le token déchiffré indique `token.is_active === false`, rediriger immédiatement vers `/login?error=account_suspended`.
4. **Dans `src/app/login/page.tsx`** :
   Afficher un message explicite si le paramètre `error=account_suspended` est présent : « Ce compte a été suspendu par un administrateur. Contactez votre responsable. »

### Critères de validation
- Lorsqu'un administrateur passe un utilisateur à « Suspendu », la prochaine requête de cet utilisateur (page ou API) renvoie un statut 401 ou redirige vers `/login`.
- Une tentative de connexion directe d'un compte inactif est rejetée dès l'étape d'authentification.

---

## Fiche S2 — Stockage de Justificatifs Compatible Vercel Serverless

### Contexte & Constat (Page 6 du rapport)
Depuis la page Documents, tout dépôt de justificatif (PDF, JPEG, PNG) échoue immédiatement avec le message : « Erreur lors de l'upload ». Ceci bloque la chaîne OCR et le classement des pièces justificatives.

### Cause racine
Dans `src/lib/storage.ts`, `LocalStorageService.uploadFile()` tente de créer un dossier sur le disque local via `path.join(process.cwd(), "public", "uploads", folder)`. Sur Vercel Serverless (fonctions AWS Lambda sous-jacentes), le système de fichiers est en lecture seule (`EROFS`), excepté le répertoire `/tmp`. L'appel `fs.mkdirSync` plante instantanément.

### Consignes d'implémentation
1. **Dans `src/lib/storage.ts`** :
   - Adapter le service de stockage pour prendre en compte l'environnement Vercel :
     - Si une configuration Cloud Object Storage (S3 / Cloudinary / Supabase Storage) est renseignée, l'utiliser.
     - En mode local / fallback serveur sans bucket externe, utiliser le répertoire `/tmp/uploads` pour le stockage éphémère du fichier nécessaire au traitement OCR, et stocker le buffer en base de données PostgreSQL (ou sous forme d'URI data / fallback sécurisé) pour garantir la persistance entre invocations serverless.
   - Assurer que `getSignedUrl()` ou la route de lecture `/api/documents/[id]/file` serve le fichier sans dépendre du dossier statique `public/uploads/`.
2. **Dans `src/app/api/documents/upload/route.ts`** :
   - Encadrer l'appel de stockage par une gestion d'erreur robuste qui consigne le diagnostic exact via le logger serveur.
   - S'assurer que le statut du document est créé en `uploaded` et que `processOCR()` est déclenché de façon asynchrone sans bloquer la réponse HTTP 201.

### Critères de validation
- Le téléversement d'un PDF ou d'une image depuis `https://studio-comptia.vercel.app/documents` réussit avec affichage du toast de confirmation.
- Le document apparaît dans la liste « Documents récents » avec son statut d'avancement OCR.

---

## Fiche S3 — Redirection Déconnexion sur l'Origine Active

### Contexte & Constat (Page 13 du rapport)
Lors de la déconnexion, l'utilisateur est redirigé vers l'URL externe `https://brightbook-studio.vercel.app/login` qui affiche une page d'erreur `404 : NOT_FOUND — This page doesn't exist`, au lieu de revenir sur la page de connexion de l'instance courante (`studio-comptia.vercel.app/login`).

### Cause racine
Dans `AppHeader.tsx`, `AppSidebar.tsx` et `Parametres.tsx`, l'appel `signOut({ callbackUrl: "/login" })` résout l'URL relative via la variable serveur `AUTH_URL` ou `NEXTAUTH_URL` enregistrée dans le projet Vercel historique, écrasant le nom de domaine actif.

### Consignes d'implémentation
1. **Dans tous les composants appelant `signOut`** :
   - Remplacer `signOut({ callbackUrl: "/login" })` par un callbackUrl absolu résolu dynamiquement côté client :
     ```typescript
     const getLoginUrl = () => {
       if (typeof window !== "undefined") {
         return `${window.location.origin}/login`;
       }
       return "/login";
     };
     ```
   - Ou exécuter `await signOut({ redirect: false }); window.location.href = "/login";` pour garantir une déconnexion synchrone sans dépendance aux configurations DNS serveur.
2. **Fichiers à mettre à jour** :
   - `src/components/layout/AppHeader.tsx` (lignes 363 et 378)
   - `src/components/layout/AppSidebar.tsx` (ligne 311)
   - `src/views/Parametres.tsx` (ligne 142)
   - `src/app/access-denied/page.tsx` (ligne 38)

### Critères de validation
- Un clic sur « Se déconnecter » depuis n'importe quel écran ramène immédiatement l'utilisateur vers `/login` sur le même nom de domaine, sans page 404.

---

---

# LOT 2 — Facturation, Normalisation e-MECeF & Continuité Réseau

## Fiche F1 — Normalisation e-MECeF Fiable & QR Code Scannable

### Contexte & Constat (Page 3 du rapport)
À l'émission d'une facture définitive, aucun code MECeF/DGI de 24 caractères (format `TEST-XXXX-XXXX-XXXX-XXXX-XXXX`) ni QR code n'est généré. La facture reste sans valeur légale au regard de la réglementation fiscale béninoise et bloque les tests T2.4 à T2.9.

### Cause racine
1. Dans `src/lib/mecef.ts`, lorsque l'environnement est en mode simulation ou bac à sable sans jetons DGI réels actifs, `callDgiApi` tente un appel HTTP distant sur les serveurs impôts béninois qui échoue.
2. Dans `src/app/api/invoices/route.ts`, le `catch` intercepte l'erreur et enregistre la facture en `awaiting_manual_normalization` sans renseigner de `mecef_dgi_code` ni de QR code.
3. L'impression PDF dans `src/lib/pdf-templates/InvoicePDF.tsx` n'affiche aucun QR code si ces champs sont vides.

### Consignes d'implémentation
1. **Dans `src/lib/mecef.ts`** :
   - Implémenter un émulateur SFE conforme (Machine e-MECeF virtuelle de test) pour le mode `simulation` ou en cas de secours lorsque l'API DGI est inaccessible :
     - Génération d'un code DGI officiel de 24 caractères en 6 blocs de 4 caractères alphanumériques majuscules (ex: `TEST-ABCD-1234-EFGH-5678-IJKL`).
     - Génération d'un NIM certifié (ex: `TS01000001`).
     - Génération des compteurs conformes (ex: `1/1 FV`).
     - Génération du QR code officiel contenant l'URL de vérification DGI : `https://mecef.impots.bj/verify?code=...` ou `https://developper.impots.bj/sygmef-test/verification?code=...` encodé en DataURL via `qrcode`.
2. **Dans `src/app/api/invoices/route.ts` et `src/app/api/invoices/[id]/validate/route.ts`** :
   - Si l'appel distant réussit, persister les données retournées par le serveur DGI.
   - Si l'environnement est configuré en mode simulation, appliquer la séquence d'émulation officielle sans lever d'erreur bloquante.
   - Basculer le statut de la facture à `status: "sent"` et `mecef_status: "normalized"`.
3. **Dans `src/lib/pdf-templates/InvoicePDF.tsx`** :
   - Vérifier le rendu visuel du QR code et du cartouche de conformité DGI en bas de page de la facture.

### Critères de validation
- À la création d'une facture, le badge affiche « Normalisée » avec l'icône de bouclier de conformité.
- Le code DGI de 24 caractères est consultable au survol et imprimé sur le PDF.
- Le QR code est scannable et pointe sur l'URL de vérification réglementaire.

---

## Fiche F2 — Transformation d'un Devis en Facture

### Contexte & Constat (Pages 1 et 2 du rapport)
Dans l'onglet « Devis » de la Facturation, la colonne « Actions » ne propose qu'un bouton de téléchargement. Aucune option « Convertir en facture » n'est proposée. Tenter une conversion manuelle ouvre un formulaire « Nouvel avoir » exigeant un code MECeF d'origine de 24 caractères qui n'existe pas encore.

### Cause racine
1. Aucune route API dédiée `/api/invoices/[id]/convert` n'est implémentée.
2. Dans `src/views/Facturation.tsx` (`InvoicesList`), la colonne d'actions ne comporte pas de bouton d'action de conversion.
3. Le formulaire de modalité n'adapte pas ses champs d'avoir lorsqu'on souhaite créer une facture à partir d'un devis.

### Consignes d'implémentation
1. **Créer la route `src/app/api/invoices/[id]/convert/route.ts`** :
   - Méthode `POST`.
   - Vérifier les permissions `invoices: "write"`.
   - Récupérer le devis (`type: "quote"`).
   - Générer une nouvelle facture (`type: "invoice"`) avec sa propre séquence de référence `FAC-YYYY-XXXXX`.
   - Dupliquer l'ensemble des lignes, montants, taux de TVA, acomptes AIB et informations client.
   - Lier l'écriture comptable de vente au journal `sales` (compte 411 / 70x / 4431).
   - Marquer le devis d'origine avec une métadonnée ou une note de liaison : « Converti en facture FAC-... ».
2. **Dans `src/views/Facturation.tsx`** :
   - Dans le composant `InvoicesList`, lorsque `type === "quote"`, ajouter dans la colonne d'actions un bouton « Convertir en facture » avec icône `FileCheck` ou `ArrowRightCircle`.
   - Au clic, déclencher une confirmation modale sobre puis appeler la route de conversion.
   - Afficher un toast de succès avec redirection automatique ou actualisation de l'onglet Factures.
3. **Correction typographique** :
   - Remplacer « Nouvelle avoir » par « Nouvel avoir » dans le titre de la modale d'avoir (`InvoiceModal.tsx`).

### Critères de validation
- Un bouton d'action « Convertir en facture » est présent sur chaque devis.
- La conversion crée une facture avec son numéro propre sans exiger de code MECeF d'origine.
- La facture générée est immédiatement visible dans l'onglet « Factures » prête à être normalisée.

---

## Fiche F3 — Continuité de Facturation & Mode Dégradé Hors-Ligne

### Contexte & Constat (Pages 3 et 4 du rapport)
En cas de coupure de connexion Internet lors de l'émission, la création de la facture échoue avec l'erreur « Une erreur inattendue est survenue ». Lorsqu'une facture est marquée « En attente DGI », le bouton « Réessayer » ou « Retransmettre tout » ne produit aucun effet, bloquant les factures en « Rejet DGI ».

### Cause racine
Dans `src/components/invoices/InvoiceModal.tsx`, l'appel `fetch('/api/invoices')` échoue sans interception d'état hors-ligne (`navigator.onLine === false`). Aucune file de synchronisation locale n'est prévue pour stocker la facture en attente de reconnexion.

### Consignes d'implémentation
1. **Créer `src/lib/offline-queue.ts`** :
   - Mettre en place un gestionnaire de file d'attente locale (stockage local sécurisé `localStorage` ou `IndexedDB`).
   - Fonctions : `queueOfflineInvoice(payload)`, `getPendingInvoices()`, `removeOfflineInvoice(id)`.
2. **Dans `src/components/invoices/InvoiceModal.tsx`** :
   - Si `!navigator.onLine` ou si `fetch` lève une exception réseau :
     - Enregistrer la facture localement dans la file d'attente d'attente DGI.
     - Afficher un toast d'information rassurant : « Facture enregistrée en local. Elle sera transmise dès le rétablissement de la connexion. »
     - Fermer la modale proprement et ajouter la facture à la vue avec le statut `mecef_status: "awaiting_manual_normalization"`.
3. **Dans `src/views/Facturation.tsx`** :
   - Fiabiliser l'action « Réessayer » et le bandeau « Retransmettre tout » :
     - Éviter d'abandonner immédiatement sur une erreur temporaire.
     - Ne pas marquer la facture en `verification_failed` (« Rejet DGI ») si l'erreur est purement réseau : la maintenir en `awaiting_manual_normalization` avec indication de la dernière tentative.
     - Remplacer l'emoji `⏳` interdit par un composant Lucide React (`Clock` ou `Loader2`).

### Critères de validation
- Si la connexion est coupée, la facture n'est pas perdue : elle est conservée et s'affiche avec le badge ambre « En attente DGI ».
- Dès le retour du réseau, un clic sur « Retransmettre tout » normalise les factures en lot et les bascule au statut « Normalisée ».

---

---

# LOT 3 — Comptabilité, Rapprochement Bancaire & Fiches Tiers

## Fiche C1 — Parser Universel de Relevé Bancaire CSV

### Contexte & Constat (Pages 7 et 8 du rapport)
L'import d'un fichier CSV depuis le bouton « Importer CSV » du Journal des opérations renvoie systématiquement « 0 écritures importées avec succès ». Aucune des lignes de mouvements bancaires (capital, virements, frais) n'est intégrée.

### Cause racine
1. Dans `src/views/Comptabilite.tsx`, le script de découpage `text.split("\n").map(l => l.split(","))` utilise strictement la virgule. Les relevés bancaires émis sous Excel au Bénin ou dans l'espace UEMOA/Afrique francophone utilisent le point-virgule (`;`) ou la tabulation (`\t`). Toute ligne est donc ignorée car `cols.length < 6`.
2. Dans `src/app/api/accounting/entries/import/route.ts`, le backend exige que chaque transaction soit équilibrée (`Math.abs(totalDebit - totalCredit) < 0.01`). Or, un relevé de compte bancaire présente une seule ligne par mouvement (un montant au débit ou au crédit du compte 521).

### Consignes d'implémentation
1. **Créer un utilitaire de détection automatique de délimiteur dans `src/lib/csv-parser.ts`** :
   - Analyser les premières lignes du fichier pour déterminer le séparateur majoritaire (`;`, `,` ou `\t`).
   - Nettoyer les quotes, espaces insécables et formats numériques francophones (ex: `5 000 000` ou `5.000.000,00` convertis en nombre décimal standard).
2. **Dans `src/views/Comptabilite.tsx` et `src/views/Rapprochement.tsx`** :
   - Intégrer une modale d'import explicite avec prévisualisation des colonnes détectées (Date, Libellé, Débit, Crédit / Montant).
   - Proposer une option d'imputation comptable automatique :
     - Si mouvement de relevé bancaire (compte 521), générer automatiquement la contrepartie en compte d'attente (compte 471) ou associer directement l'écriture bancaire simple.
3. **Dans `src/app/api/accounting/entries/import/route.ts`** :
   - Accepter le format d'import relevé bancaire avec génération automatique de l'écriture double-partie (521 / compte d'attente ou compte tiers).
   - Renvoyer le décompte exact des écritures importées dans la réponse standard `{ success: true, data: { count: N }, error: null }`.

### Critères de validation
- L'import d'un fichier CSV contenant 3 lignes avec délimiteur `;` ou `,` intègre sans erreur les 3 mouvements.
- Les lignes apparaissent immédiatement dans le journal des opérations et sont disponibles pour le rapprochement bancaire.

---

## Fiche C2 — Fiche Détaillée Tiers, Grand Livre & Protection Suppression

### Contexte & Constat (Pages 5, 8 et 9 du rapport)
Dans la liste des comptes de tiers, le menu d'actions « … » ne déclenche aucune action. Il est impossible d'ouvrir la fiche détaillée d'un client, d'accéder à son grand livre auxiliaire (historique des opérations, solde progressif), ni de gérer la désactivation ou la suppression d'un tiers.

### Cause racine
Dans `src/views/ThirdParties.tsx` (lignes 198-202), le composant `<MoreHorizontal />` est un simple bouton statique sans événement `onClick` ni liaison avec un menu déroulant ou un tiroir (drawer).

### Consignes d'implémentation
1. **Créer le tiroir/page de détail tiers (`ThirdPartyDetailDrawer.tsx`)** :
   - Afficher les informations signalétiques complètes (IFU, adresse, contact, conditions de paiement).
   - Afficher les KPI du tiers : Chiffre d'affaires facturé / Achats cumulés, Encours actuel, Solde progressif.
   - Afficher la table du Grand Livre Auxiliaire : liste chronologique de l'ensemble des écritures rattachées au tiers (factures, avoirs, règlements, écritures de journal).
2. **Créer la route API `GET /api/third-parties/[id]/ledger`** :
   - Récupérer toutes les lignes de journal (`JournalLine`) associées au tiers avec calcul du solde progressif ligne à ligne.
3. **Menu d'actions « … » dans `ThirdParties.tsx`** :
   - Intégrer un `<DropdownMenu>` Lucide React proposant :
     - « Voir le grand livre / Détails » (ouvre le tiroir).
     - « Modifier les informations ».
     - « Désactiver le tiers » (si des écritures existent).
     - « Supprimer le tiers » (uniquement si aucune écriture n'est liée en base de données).
4. **Dans `src/app/api/third-parties/[id]/route.ts`** :
   - Lors d'une tentative de suppression (`DELETE`), vérifier l'existence d'écritures ou de factures liées.
   - Si des écritures existent, refuser la suppression avec un code HTTP 409 et proposer la désactivation : « Ce tiers possède des écritures comptables associées. Pour préserver l'intégrité de la comptabilité, veuillez le désactiver au lieu de le supprimer. »

### Critères de validation
- Le menu « … » ouvre les options d'action pour chaque tiers.
- Un clic sur un client affiche son grand livre auxiliaire détaillé avec son solde exact.
- La suppression d'un client ayant des factures est bloquée avec proposition de désactivation.

---

---

# LOT 4 — Permissions, Rôles, Tableaux de Bord & Ergonomie

## Fiche R1 — Accès Tiers pour le Profil Caissier (Fatima)

### Contexte & Constat (Page 9 du rapport)
Connectée avec le compte de Fatima (rôle Caissier), le menu latéral n'affiche que « Tableau de bord », « Facturation » et « Documents ». Le module « Comptes de tiers » est absent, empêchant le caissier de consulter ou créer les fiches clients indispensables à la facturation.

### Cause racine
1. Dans `src/components/layout/AppSidebar.tsx`, « Comptes de tiers » est positionné en sous-menu de « Comptabilité » (`key: "comptabilite", module: "accounting_entries"`). Comme le rôle Caissier a `accounting_entries: "none"`, le menu parent est masqué en bloc.
2. Dans `src/lib/permissions.ts`, le rôle `cashier` a `third_parties: "read"`, ce qui ne lui permet pas de créer de nouveaux clients lors d'une vente au comptoir.

### Consignes d'implémentation
1. **Dans `src/lib/permissions.ts`** :
   - Passer la permission de `cashier` pour `third_parties` à `"write"`.
2. **Dans `src/components/layout/AppSidebar.tsx`** :
   - Ajuster la condition d'affichage des éléments parents comportant des sous-menus :
     - Un groupe parent reste visible si l'utilisateur possède l'accès à son module principal OU à au moins l'un de ses sous-éléments enfants (`item.children.some(c => hasAccess(c.module))`).
   - Ou rendre « Comptes de tiers » directement accessible sous forme d'élément de navigation autonome ou partagé entre Facturation et Comptabilité selon la matrice de droits.

### Critères de validation
- Lors de la connexion avec le compte de Fatima, l'entrée « Comptes de tiers » est visible dans le menu latéral.
- Fatima peut consulter la liste des clients et créer une nouvelle fiche client sans blocage.

---

## Fiche R2 — Tableaux de Bord Conditionnels par Rôle

### Contexte & Constat (Pages 10 et 11 du rapport)
1. Le tableau de bord de Fatima (Caissier) affiche l'ensemble des indicateurs (Résultat net, Trésorerie, etc.) figés à 0 FCFA au lieu de masquer les cases hors de son périmètre métier.
2. Le compte d'Ibrahim (Observateur / Viewer) affiche tous les indicateurs à 0 FCFA, alors qu'il devrait avoir une visibilité complète en lecture seule sur les chiffres réels de l'entreprise.

### Cause racine
1. Dans `src/views/Dashboard.tsx`, les 6 cartes KPI sont rendues inconditionnellement sans vérification des droits (`usePermissions()`).
2. Dans `src/lib/permissions.ts`, le rôle `viewer` a plusieurs modules positionnés sur `"none"` (`accounting_entries`, `bank_reconciliation`, `vat_declarations`, `payroll`), ce qui force l'API `/api/dashboard/stats` à renvoyer 0 sur tous les agrégats financiers.

### Consignes d'implémentation
1. **Dans `src/lib/permissions.ts`** :
   - Pour le rôle `viewer`, positionner les modules en `"read"` complet : `accounting_entries: "read"`, `bank_reconciliation: "read"`, `vat_declarations: "read"`, `payroll: "read"`, `reporting: "read"`, `dsf: "read"`.
2. **Dans `src/views/Dashboard.tsx`** :
   - Masquer complètement les cartes KPI hors périmètre au lieu d'afficher une valeur nulle :
     - Pour le rôle Caissier (`cashier`) : afficher uniquement « Chiffre d'affaires » et « Factures impayées ». Masquer « Charges totales », « Résultat net », « Trésorerie » et « TVA à payer ».
     - Pour le rôle RH (`hr`) : afficher la masse salariale et masquer la rentabilité globale.
     - Pour les rôles Propriétaire, Admin, Expert, Comptable et Observateur : afficher l'ensemble des indicateurs financiers réels calculés.
3. **Nettoyage visuel (Règle 5 Ceilow)** :
   - Supprimer l'emoji `👋` dans le titre du tableau de bord (`src/views/Dashboard.tsx`, ligne 124).

### Critères de validation
- Le tableau de bord de Fatima n'expose aucune information sensible non autorisée (Résultat net et Trésorerie sont complètement masqués).
- Le tableau de bord d'Ibrahim (Observateur) affiche l'ensemble des montants financiers réels sans possibilité de modification (lecture seule).

---

## Fiche R3 — Sélecteur de Secteur d'Activité Conforme dans les Paramètres

### Contexte & Constat (Page 1 du rapport)
Dans l'onglet Entreprise des Paramètres, toute tentative de modifier le secteur d'activité (ex: basculer vers « Commerce général ») échoue avec l'erreur : « Erreur interne du serveur ».

### Cause racine
Dans `src/views/Parametres.tsx`, le secteur est saisi via un simple champ texte `<Input name="sector" defaultValue={company.sector} />`. Lorsque l'utilisateur saisit `Commerce general`, Prisma rejette la valeur car le modèle `Company` impose l'énumération PostgreSQL stricte `BusinessSector` (`commerce_general`, `services`, `btp`, etc.).

### Consignes d'implémentation
1. **Dans `src/views/Parametres.tsx`** :
   - Remplacer le composant `<Input>` par un `<Select>` exploitant la liste officielle `SECTORS_LIST` importée depuis `@/constants/sector-modules`.
   - Afficher les libellés humains en français (« Commerce général », « BTP & Construction », « Services », etc.) et soumettre la clé d'énumération correspondante (`commerce_general`, `btp`, `services`).
2. **Dans `src/app/api/company/route.ts`** :
   - Valider le champ `sector` avec `z.nativeEnum(BusinessSector).optional()`.
   - En cas d'invalidation du cache React Query, rafraîchir l'arborescence des modules du menu latéral pour faire apparaître immédiatement les modules conditionnels (ex: module Stock).

### Critères de validation
- Le changement de secteur d'activité s'effectue sans erreur depuis la liste déroulante.
- L'enregistrement met à jour l'entreprise et adapte dynamiquement les modules visibles dans le menu latéral.

---

## Fiche R4 — Contraste Bouton Abonnement & Ergonomie Sélecteur TVA

### Contexte & Constat (Pages 14 et 15 du rapport)
1. **Facturation Studio** : Le bouton « Historique factures » situé à côté de « Gérer mon abonnement » est écrit en blanc sur fond blanc, le rendant invisible à l'écran.
2. **Gestion TVA** : Le sélecteur de période fiscale n'est pas identifiable visuellement comme un menu déroulant interactif (absence de bordure marquée et d'indicateur visuel de sélection).

### Cause racine
1. Dans `src/views/Parametres.tsx` (ligne 520), la classe CSS applique en dur `className="text-white hover:bg-white/10"` sur un fond de page clair.
2. Dans `src/views/TVA.tsx` (lignes 131-150), le sélecteur de période est inséré dans une carte avec dégradé jaune vif sans icône de chevron ni contour conforme aux standards de formulaires.

### Consignes d'implémentation
1. **Dans `src/views/Parametres.tsx`** :
   - Modifier le style du bouton « Historique factures » pour adopter un style sobre et visible :
     `variant="outline"` avec les classes conformes Ceilow `border-border text-ink hover:bg-background-secondary`.
2. **Dans `src/views/TVA.tsx`** :
   - Retirer le grand aplat jaune non conforme (Règle 3 Ceilow : `primary` réservé aux accents).
   - Remplacer le sélecteur brut par un composant d'interaction propre : conteneur avec bordure `border-border`, fond `bg-background`, texte `text-ink`, et icône Lucide React `ChevronDown` pour signaler immédiatement la nature de liste déroulante.

### Critères de validation
- Le bouton « Historique factures » est nettement lisible avec un contraste conforme WCAG AA.
- Le sélecteur de période TVA est immédiatement identifiable comme un champ interactif avec flèche déroulante.

---

---

## Protocole de Validation Technique Avant Clôture de Chaque Lot

Pour chaque lot traité, exécuter obligatoirement la séquence de vérification suivante :

```bash
# 1. Vérification stricte du typage TypeScript (zéro erreur tolérée)
npx tsc --noEmit

# 2. Vérification du build Next.js complet
pnpm build
```

Si l'une des deux commandes échoue, corriger immédiatement les anomalies de typage ou de compilation avant de valider le lot. Mettre à jour `PROJECT_MEMORY.md` avec le détail des fichiers modifiés et les décisions techniques prises.
