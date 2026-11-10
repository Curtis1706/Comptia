# Kit SEO Local Google Business Profile (Cotonou) & Plan de Télémétrie GA4 : Ceilow

Date : 2026-11-10
Auteur : Partenaire SEO & Copywriting
Périmètre : Actions #2 (Map Pack Cotonou / GBP) et #3 (GA4 + Consent Mode v2 APDP + Tracking conversions)

---

## 1. Résumé Décisionnel

Ce livrable verrouille la visibilité locale de Ceilow à Cotonou et le pilotage chiffré des conversions sur le site. Sur le volet local, l'identité NAP (`Ceilow`, éditeur `Digiplex Agency - RCCM RB/PNO/26 B 7147`, téléphone unique `+229 01 97 55 49 53`, e-mail `contact@ceilow.com`, horaires `08h00 - 18h30`) a été unifiée sur `/contact`, les pages légales et le balisage JSON-LD `ProfessionalService`, avec un kit prêt à copier dans Google Business Profile (en attente de votre adresse de rue exacte et du Plus Code devant l'entrée). Sur le volet analytique, l'infrastructure Google Analytics 4 avec Consent Mode v2 conforme APDP (`src/lib/analytics.ts`, `src/components/seo/GoogleAnalytics.tsx`) et le suivi des conversions (`sign_up`, `generate_lead`, `whatsapp_click`, `phone_click`, `file_download`) sont déployés dans le code et s'activeront dès l'ajout de `NEXT_PUBLIC_GA_MEASUREMENT_ID` dans `.env`.

---

## 2. Constats Préalables et Harmonisation NAP Effectuée

Les vérifications dans le dépôt ont permis de corriger trois sources d'incohérence NAP nuisibles au Map Pack :
1. **`src/app/mentions-legales/page.tsx` & `src/app/confidentialite/page.tsx` & `src/app/cgu/page.tsx`** : contenaient l'ancien libellé « Ceilow Technologies SAS », l'adresse e-mail `contact@ceilow.bj` et le numéro placeholder `+229 01 97 00 00 00`. Tous trois ont été alignés sur `Digiplex Agency` (`RCCM : RB/PNO/26 B 7147`), `contact@ceilow.com` et `+229 01 97 55 49 53`.
2. **`src/app/contact/layout.tsx`** : le JSON-LD `ProfessionalService` déclarait `08:30 - 18:00` alors que la page visible `/contact` indique `08h00 - 18h30`. Horaires, nom (`Ceilow`) et e-mail (`contact@ceilow.com`) ont été alignés.
3. **`src/components/layout/PublicFooter.tsx`** : conserve `+229 01 97 55 49 53` comme ligne principale prioritaire.

---

## 3. Kit Prêt à Publier : Fiche Google Business Profile (Cotonou)

### A. Identité & Paramètres de Base (Copier-Coller Exact)

| Champ Google Business Profile | Valeur Exacte à Saisir | Règle à Respecter |
|---|---|---|
| Nom de l'établissement | `Ceilow` | Ne jamais ajouter de mots-clés (« Ceilow Logiciel Comptable Cotonou ») sous peine de suspension GBP. |
| Catégorie principale | `Éditeur de logiciels` | Signal de classement local le plus fort. |
| Catégories secondaires | `Service de comptabilité`, `Service d'assistance informatique`, `Consultant en gestion d'entreprise` | Limiter à 3 catégories complémentaires exactes. |
| Adresse physique | `[À compléter avant publication : Rue / Îlot exact, Quartier Haie Vive ou Ganhi], Cotonou, Bénin` | Doit correspondre exactement à l'entrée accueillant les clients ou servant à la vidéo de validation GBP. |
| Plus Code Google Maps | `[À compléter avant publication : ex. 9C5R+XX Cotonou relevé devant l'entrée]` | Ouvrir Google Maps sur mobile exactement devant la porte d'entrée, toucher le point bleu, copier le Plus Code et placer le repère sur l'entrée. |
| Téléphone principal unique | `+229 01 97 55 49 53` | Identique au format sur `/contact`, `/mentions-legales` et JSON-LD. |
| Site web (avec balisage UTM) | `https://ceilow.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` | Permet d'isoler dans GA4 les visites et conversions issues de Google Maps. |
| Horaires d'ouverture | Lun - Ven : `08:00 - 18:30` / Sam - Dim : `Fermé` | Identiques à `/contact`. |

### B. Description Officielle (662 caractères sur 750 autorisés)

> Ceilow aide les PME, indépendants et cabinets comptables du Bénin à facturer aux normes DGI e-MECeF, suivre leur trésorerie Mobile Money et tenir leur comptabilité SYSCOHADA sans saisie manuelle. Émettez des factures avec QR code officiel depuis votre téléphone sans acheter de machine physique, préparez votre TVA mensuelle avant le 10, gérez la paie CNSS de vos équipes et collaborez avec votre expert-comptable en un seul outil. Une équipe dédiée basée à Cotonou vous accompagne du lundi au vendredi de 8h00 à 18h30 pour paramétrer votre entreprise. Démarrez gratuitement avec 10 factures par mois ou demandez une démonstration sur WhatsApp au +229 01 97 55 49 53.

### C. Onglet « Services / Produits » à Renseigner sur GBP

| Nom du Service GBP | Tarif Affiché (conforme `/tarifs`) | Description Courte |
|---|---|---|
| Plan Gratuit (Découverte) | `0 FCFA / mois` | Jusqu'à 10 factures normalisées e-MECeF DGI par mois depuis votre téléphone ou ordinateur. |
| Plan Pro PME | `15 000 FCFA / mois` | Facturation e-MECeF illimitée, comptabilité SYSCOHADA, suivi Mobile Money, TVA et dépenses scannées. |
| Portail Cabinet Comptable | `Sur devis (jusqu'à -50 %)` | Espace collaboratif multi-dossiers avec balances SYSCOHADA et exports Sage / FEC. |
| Facturation normalisée e-MECeF DGI | Inclus dès `0 FCFA` | Émission de factures certifiées avec QR code DGI sans acheter de machine physique. |
| Paie et déclarations CNSS Bénin | Inclus dans l'offre Entreprise | Calcul des bulletins de paie, ITS, VPS et préparation des bordereaux e-Cotisations CNSS. |

### D. Checklist Visuels & Validation Vidéo GBP

Pour réussir la vérification Google (souvent demandée par vidéo continue au Bénin) et alimenter « Ask Maps » :
1. Prendre des photos réelles non retouchées et les renommer avant upload :
   - `facade-entree-ceilow-cotonou.webp` (rue + plaque ou enseigne visible pour la validation)
   - `bureaux-equipe-ceilow-cotonou.webp` (espace de travail réel)
   - `accompagnement-client-cotonou.webp` (réunion / démonstration)
   - `interface-facturation-emecef-ceilow.webp` (capture réelle du tableau de bord)
2. Conserver la vidéo de validation continue en un seul plan : extérieur de la rue/plaque visible -> ouverture de la porte d'entrée -> poste de travail avec interface Ceilow ouverte (aucun montage).

### E. Protocole de Collecte & Réponse aux Avis Clients (Zéro Review Gating)

- **Moment d'envoi** : juste après un onboarding réussi, une première facture e-MECeF émise sans blocage ou une formation terminée.
- **Règle stricte** : envoyer le lien d'avis direct Google à tous les clients accompagnés sans filtrer au préalable entre clients satisfaits et mécontents.
- **Message WhatsApp type** :
  > Bonjour [Prénom], merci d'avoir démarré avec Ceilow. Votre avis aide d'autres dirigeants au Bénin à découvrir la facturation sans machine. Pourriez-vous partager en 30 secondes votre expérience sur notre fiche Google ici : [Lien court GBP] ? Merci beaucoup !
- **Réponse sous 48h (100 % des avis)** :
  - *Avis positif* : remercier nommément et rappeler naturellement le besoin traité (« Merci [Prénom] pour votre confiance dans la mise en place de la facturation e-MECeF et du suivi SYSCOHADA pour votre équipe à Cotonou. »).
  - *Avis négatif* : rester factuel, présenter des excuses si un délai a eu lieu, et proposer un rappel immédiat au `+229 01 97 55 49 53` pour résoudre le blocage.

---

## 4. Architecture Implémentée : Télémétrie GA4 & Consent Mode v2 APDP

### A. Fichiers Déployés dans l'Application

1. **[`src/lib/analytics.ts`](file:///e:/Comptia/src/lib/analytics.ts)** :
   - Validation stricte de `NEXT_PUBLIC_GA_MEASUREMENT_ID` (format `G-[A-Z0-9]+`) pour empêcher toute injection invalide.
   - Helpers typés `trackEvent`, `trackPageView`, `saveConsentChoice`, `readStoredConsent`, `updateGtagConsent` sans jamais transmettre de données personnelles identifiables (pas de nom, e-mail, téléphone ou IFU dans les paramètres GA4).
2. **[`src/components/seo/GoogleAnalytics.tsx`](file:///e:/Comptia/src/components/seo/GoogleAnalytics.tsx)** (monté dans [`src/app/layout.tsx`](file:///e:/Comptia/src/app/layout.tsx)) :
   - Initialise **Consent Mode v2** par défaut en `denied` avant le chargement de `gtag/js` (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` à `denied`).
   - Affiche un bandeau de consentement sobre conforme APDP et aux règles UI Ceilow (`Tout accepter` / `Refuser`, lien vers `/confidentialite#cookies`, aucun glassmorphisme, aucun pill cosmétique, zone tactile >= 44px) uniquement lorsque `NEXT_PUBLIC_GA_MEASUREMENT_ID` est configuré.
   - Suit les changements de route Next.js App Router (`usePathname` + `useSearchParams` encapsulé dans `<Suspense>` pour préserver le rendu statique de toutes les pages publiques).
   - Écoute par délégation globale tous les clics sur liens `wa.me/` / `whatsapp.com` et `tel:` sur l'ensemble du site.

### B. Événements de Conversion Configurés

| Nom d'Événement GA4 | Déclencheur Réel dans le Code | Paramètres Transmis (Sans PII) | À Marquer « Événement Clé » dans GA4 |
|---|---|---|---|
| `sign_up` | Succès de `POST /api/auth/register` dans [`src/app/register/page.tsx`](file:///e:/Comptia/src/app/register/page.tsx) | `method`, `company_type`, `company_sector` | Oui |
| `generate_lead` | Validation formulaire `/demo` (`demo_form`), `/contact` (`contact_form`) ou `/accompagnement` (`accompagnement_form`) | `lead_source`, `company_sector`, `team_size` ou `subject` | Oui |
| `whatsapp_click` | Clic global sur tout lien `wa.me/` ou `whatsapp.com` (via [`GoogleAnalytics.tsx`](file:///e:/Comptia/src/components/seo/GoogleAnalytics.tsx)) | `link_url`, `link_text`, `page_path` | Oui |
| `phone_click` | Clic global sur tout lien `tel:` (header, footer, contact) | `link_url`, `page_path` | Oui |
| `file_download` | Export CSV ou impression PDF sur `/ressources/plan-comptable-syscohada-pdf` et `/ressources/calendrier-fiscal-benin` | `file_name`, `file_extension`, `page_path` | Optionnel |

---

## 5. Actions Opérationnelles Priorisées (Reste à Exécuter Côté Admin)

| Action | Score ICE | Responsable | Étape Concrète | KPI de Succès |
|---|---|---|---|---|
| 1. Activer GA4 en production | 9.3 | Technique | Créer le flux Web sur analytics.google.com, copier l'ID `G-...` dans `.env` (`NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...`), redémarrer/redéployer et marquer `sign_up`, `generate_lead`, `whatsapp_click`, `phone_click` comme Événements Clés. | Remontée temps réel dans DebugView GA4 |
| 2. Créer et valider la fiche GBP Cotonou | 8.7 | Direction / Marketing | Compléter le Plus Code + rue exacte sur business.google.com, coller les champs de la Section 3, tourner la vidéo de validation devant l'entrée. | Fiche validée et active sur Google Maps |
| 3. Récolter les 10 premiers avis clients | 8.0 | Support | Envoyer le lien court d'avis par WhatsApp aux clients actifs après accompagnement et répondre à 100 % des avis sous 48h. | >= 10 avis authentiques en 30 jours |
| 4. Lier GA4 + Search Console + Looker Studio | 7.7 | Marketing / SEO | Associer la propriété Search Console à GA4 et suivre mensuellement clics hors marque, conversions par page d'atterrissage et clics UTM `campaign=gbp`. | Tableau de bord actif à M+1 |

