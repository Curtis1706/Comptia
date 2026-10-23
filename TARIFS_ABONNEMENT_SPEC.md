# Spécification Complète & Copywriting : Page Tarifs & Abonnement (Design Indy Adapté Ceilow)

> **Document de Référence Frontend, UX & Copywriting**
> Ce document adapte fidèlement le design haute fidélité fourni pour la page `/tarifs`, en conformité totale avec les **Règles Ceilow** et le skill **`/copywriting`**.
> **Règles fondamentales respectées** : 
> 1. **Intégration du Header et Footer officiels** ([`PublicHeader`](file:///e:/Comptia/src/components/layout/PublicHeader.tsx) et [`PublicFooter`](file:///e:/Comptia/src/components/layout/PublicFooter.tsx) sans glassmorphisme).
> 2. **100 % Tokens Sémantiques Ceilow** : Remplacement de l'ensemble des classes Material-3 arbitraires (`surface-container`, `#715d00`, etc.) par les tokens stricts (`primary`, `ink`, `background`, `background-secondary`, `border`, `text-muted`, `success`).
> 3. **Sobriété Visuelle & Box-Shadows** : Remplacement des dégradés artificiels et des ombres lourdes par des contours nets (`border border-border`) et des ombres légères et professionnelles (`shadow-xs`, `shadow-sm`).
> 4. **Icônes Vectorielles Lucide React** : Éradication des Material Symbols et des emojis au profit d'icônes Lucide accessibles.
> 5. **Copywriting Non Vendeur & Rassurant** : L'utilisateur ne doit pas avoir l'impression qu'on lui « vend un produit » à grand renfort de marketing agressif. Le ton est transparent, pédagogique, empathique, axé sur la sérénité et le respect de son autonomie (zéro engagement, essai sans carte bancaire, tarifs nets au franc près).

---

## 1. Philosophie de Copywriting : Conseiller, pas Vendre

Un chef d'entreprise ou un indépendant au Bénin est naturellement méfiant face aux abonnements en ligne : il craint les prélèvements masqués, les hausses imprévues ou un outil inutile qui va lui compliquer la vie.

### Les 5 Règles du Copywriting sur cette Page :
1. **Zéro Pression** : Aucun compte à rebours, aucun mot anxiogène (« Dépêchez-vous », « Offre limitée »). Le visiteur choisit à son propre rythme.
2. **Transparence Absolue** : Les prix sont affichés en Francs CFA nets. La périodicité est explicitée sans astérisques trompeuses.
3. **Respect de l'Autonomie** : Rappeler systématiquement que l'essai est **100 % gratuit sans carte bancaire**, et que la résiliation se fait en un clic depuis les réglages.
4. **Focalisation sur la Sérénité d'Esprit** : On ne vend pas un « logiciel informatique », on offre la fin des nuits blanches avant le 10 du mois et la garantie d'être en règle avec la DGI.
5. **Proximité & Écoute Locale** : Valoriser la présence d'une équipe bienveillante à Cotonou (Amina, Josué, Marc) prête à écouter et conseiller, jamais à forcer la vente.

---

## 2. Table de Conversion des Styles & Tokens

| Style du Template Fourni | Équivalent Strict Ceilow | Rationale / Règle Ceilow |
|---|---|---|
| `bg-[#332E29]` (en dur) | `bg-ink text-white` | Utilisation exclusive du token sémantique `ink` pour les sections sombres. |
| `primary: #715d00` / `primary-container: #ffd946` | `bg-primary text-ink` | Jaune officiel Ceilow (`#FFD946`) avec texte `ink` lisible. |
| `surface`, `surface-container-lowest` | `bg-background` (#FFFFFF) | Fond principal de page clair et net. |
| `surface-container-high`, `surface-variant` | `bg-background-secondary` (#F5F4F2) | Fond des sections alternées et des cartes d'étapes. |
| `outline`, `outline-variant` | `border-border` (#D8D5D0) | Bordures et séparateurs uniques autorisés. |
| `secondary`, `text-secondary` | `text-text-muted` (#8A857D) | Légendes, périodicités et textes secondaires. |
| `tertiary`, `tertiary-container` | `bg-success/20 text-success-deep` | Vert menthe de validation financière réelle. |
| `bg-gradient-to-b from-... via-... to-...` | `bg-background border-2 border-primary` | Suppression des dégradés artificiels (Règle 5). |
| `shadow-md`, `shadow-xl` | `border border-border shadow-xs` | Règle de sobriété : bordures franches, zéro ombre diffuse criarde. |
| `Material Symbols` | `lucide-react` | Règle 5 : icônes vectorielles standardisées avec accessibilité. |

---

## 3. Architecture Visuelle & Découpage de l'Écran

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. PublicHeader (Logo Ceilow + Navigation + CTA Démo/Connexion)        │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Hero Section & Contrôles Dynamiques                                 │
│    - Badge discret : "Tarification Directe en FCFA"                    │
│    - H1 Pédagogique : "Des tarifs clairs, conçus pour vos réalités"    │
│    - Filtre Statut juridique (Tous, Indépendants, PME, Cabinets)       │
│    - Toggle Fréquence : Mensuel vs Annuel (2 mois offerts)             │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Grille des 3 Formules Tarifaires                                    │
│    - Plan Gratuit (0 FCFA) : Démarrer sans risque                      │
│    - Plan Pro (12 500 ou 15 000 FCFA) : Autonomie & Sérénité           │
│    - Plan Entreprise & Cabinet (Dès 45 000 FCFA) : Sur-mesure          │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Bandeau 4 Colonnes : Moyens de Paiement & Rassurance Locale         │
│    - MTN MoMo/Moov, Liberté totale, Facture DGI, Support Cotonou       │
├────────────────────────────────────────────────────────────────────────┤
│ 5. Simulateur Interactif d'Économies (Sliders & Calculateur)           │
│    - Factures par mois + Heures passées $\rightarrow$ Temps & Risque épargnés│
├────────────────────────────────────────────────────────────────────────┤
│ 6. Tableau Comparatif Exhaustif (6 Catégories Claires)                 │
│    - Facturation, Banque & MoMo, TVA DGI, Comptabilité, Paie, Support │
├────────────────────────────────────────────────────────────────────────┤
│ 7. Bloc Échange Conseiller (Fond Ink Sombre & Équipe à Cotonou)        │
│    - Échange sans engagement avec Amina, Josué ou Marc                 │
├────────────────────────────────────────────────────────────────────────┤
│ 8. Carte de Transition & Reprise d'Historique                          │
│    - Rassurance pour ceux qui ont déjà un comptable ou des fichiers    │
├────────────────────────────────────────────────────────────────────────┤
│ 9. Avis Vérifiés & Retour d'Expérience (Carte Vedette + 3 Avis PME)   │
│    - Cas réel Aurélie Tokpanou (Ganhi) + Dirigeants à Cotonou          │
├────────────────────────────────────────────────────────────────────────┤
│ 10. Carte Pré-Footer Sérénité Fiscale (Lifestyle Dirigeant)           │
├────────────────────────────────────────────────────────────────────────┤
│ 11. FAQ Spécifique en Accordéon (7 Questions Claires & Transparentes)  │
├────────────────────────────────────────────────────────────────────────┤
│ 12. Bannière Finale de Rassurance (Fond Ink Opaque)                    │
├────────────────────────────────────────────────────────────────────────┤
│ 13. PublicFooter Unifié (Sans glassmorphisme)                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Spécification & Copywriting Détaillé Composant par Composant

### 1. Header Public
- Utilise `<PublicHeader className="sticky top-0 z-50" />` (logo Ceilow officiel, liens clairs, fond `bg-ink text-white`).

---

### 2. Section Hero & Contrôles

#### Design & Mise en Page
- `w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 flex flex-col items-center text-center`.
- **Badge supérieur** :
  ```tsx
  <div className="inline-flex items-center gap-2 bg-background-secondary border border-border px-3.5 py-1 rounded-full text-text-muted text-xs font-semibold uppercase tracking-wider mb-4">
    <span className="w-2 h-2 rounded-full bg-primary" />
    <span>Tarification Directe en FCFA</span>
  </div>
  ```
- **Titre H1 (Clash Display)** :
  - **Texte Recommandé** : « Des tarifs clairs et transparents, pensés pour la réalité des entreprises au Bénin. »
  - *Alternative A/B* : « Choisissez votre niveau d'autonomie. Zéro frais caché, zéro engagement. »
  - *Justification* : Supprime tout jargon mercantile, pose une relation de confiance d'égal à égal.
- **Sous-titre** :
  « Démarrez gratuitement ou prenez le temps de tester le Plan Pro pendant 14 jours. Vous ne payez que si Ceilow vous fait réellement gagner du temps. »

#### Les Deux Filtres Interactifs

##### A. Sélecteur de Profil / Statut Juridique
- Permet au visiteur de filtrer selon sa typologie :
  - `Tous les profils` (Actif par défaut)
  - `Indépendants & Consultants`
  - `PME & Commerçants`
  - `Cabinets & Groupes`
- **Style** : Conteneur `p-1 bg-background-secondary border border-border rounded-xl flex items-center gap-1 overflow-x-auto max-w-full`.
- **Bouton actif** : `bg-background text-ink shadow-xs font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-all`.
- **Bouton inactif** : `text-text-muted hover:text-ink px-3.5 py-1.5 rounded-lg text-xs transition-all`.

##### B. Toggle Période (Mensuel vs Annuel)
- **Style** : `p-1 bg-background-secondary border border-border rounded-xl flex items-center gap-1`.
- **Option Mensuel** : `Mensuel` (souplesse maximale, sans engagement).
- **Option Annuel** : `Annuel` + pastille `2 mois offerts` (`bg-success/20 text-success-deep text-[11px] font-bold px-2 py-0.5 rounded-full border border-success/30`).

---

### 3. Grille des 3 Formules Tarifaires

#### A. Plan Gratuit — « Démarrer sans risque »
- **Badge supérieur** : `bg-background-secondary text-text-muted px-2.5 py-0.5 rounded text-xs font-semibold` : `Démarrage`
- **Titre** : `Plan Gratuit`
- **Prix** :
  - `0 FCFA` `/ mois`
  - *Sous-texte* : `Valable sans limite de temps, sans carte bancaire.`
- **Accroche de valeur** :
  « Tout ce qu'il vous faut pour émettre vos premières factures en règle avec la DGI sans débourser un franc. »
- **Puces de fonctionnalités** (Icônes `CheckCircle2` en `text-success-deep`) :
  - `10 factures certifiées e-MECeF avec QR code par mois`
  - `Recherche instantanée de vos clients par numéro IFU officiel`
  - `Édition de devis, proformas et bons de commande PDF`
  - `Export comptable de base (format Excel et CSV)`
  - `1 accès utilisateur administrateur`
  - `Accès libre aux guides et tutoriels d'aide en ligne`
- **Bouton d'Action** :
  - **Texte** : `Créer mon compte gratuit`
  - **Style** : `w-full py-3.5 px-4 rounded-xl text-ink bg-background-secondary hover:bg-border/60 border border-border font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px]`
  - **Microcopy sous bouton** : `Activation immédiate en 2 minutes`

---

#### B. Plan Pro (Formule Conseillée) — « L'Automatisation Totale »
- **Badge Recommandé** :
  ```tsx
  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-ink text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1">
    <Star className="w-3.5 h-3.5 fill-ink" />
    <span>Recommandé</span>
  </div>
  ```
- **Conteneur** : `relative bg-background border-2 border-primary rounded-2xl p-8 flex flex-col justify-between shadow-xs`.
- **Titre & Cible** : `Plan Pro` + pastille `TPE & PME`.
- **Prix dynamique** :
  - En mode annuel : `12 500 FCFA` `/ mois` (`Facturé 150 000 FCFA / an • 30 000 FCFA d'économie`)
  - En mode mensuel : `15 000 FCFA` `/ mois` (`Facturé mensuellement • Liberté d'arrêter quand vous voulez`)
- **Accroche de valeur** :
  « L'automatisation complète de votre gestion quotidienne : facturation illimitée, suivi bancaire MoMo et calcul direct de votre TVA. »
- **Puces de fonctionnalités** (Icônes `CheckCircle2` en `text-success-deep`) :
  - **`Factures certifiées DGI e-MECeF en nombre illimité`**
  - **`Connexion automatique MTN MoMo, Moov Money et banques locales`**
  - **`Rapprochement instantané des encaissements en 1 clic`**
  - **`Calcul en temps réel de votre TVA à payer avant le 10 du mois`**
  - `Dossier comptable propre et structuré pour votre expert-comptable`
  - `Gestion de la paie et fiches de paie conformes (jusqu'à 10 salariés)`
  - `Relances automatiques par SMS & Email en cas de retard client`
  - `Jusqu'à 5 accès collaborateurs avec gestion des droits`
  - **`Assistance prioritaire par WhatsApp et téléphone basée à Cotonou`**
- **Bouton d'Action** :
  - **Texte** : `Démarrer mon essai de 14 jours`
  - **Style** : `w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-ink font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all min-h-[48px]`
  - **Microcopy sous bouton** : `14 jours offerts • Aucun prélèvement immédiat • Annulation en 1 clic`

---

#### C. Plan Entreprise & Cabinet — « Pour les Groupes & Cabinets »
- **Badge supérieur** : `bg-background-secondary text-text-muted px-2.5 py-0.5 rounded text-xs font-semibold` : `Multi-Sociétés`
- **Titre** : `Entreprise & Cabinet`
- **Prix** :
  - `Dès 45 000 FCFA` `/ mois`
  - *Sous-texte* : `Tarif dégressif personnalisé selon le volume de dossiers.`
- **Accroche de valeur** :
  « La puissance Ceilow à l'échelle : multi-sociétés, consolidation de groupe, intégration ERP et chargé de compte dédié. »
- **Puces de fonctionnalités** :
  - **`Toutes les fonctionnalités du Plan Pro en illimité`**
  - **`Gestion multi-sociétés et consolidation financière de groupe`**
  - **`Portail dédié expert-comptable (OECCA) pour piloter tous vos clients`**
  - `Salariés illimités pour le calcul de paie et déclarations CNSS`
  - `Accès API direct pour connecter votre logiciel de caisse ou ERP`
  - `Formation personnalisée sur site dans vos bureaux à Cotonou ou Porto-Novo`
  - `Chargé de compte fiscal dédié avec contrat de service garanti (SLA 99.9%)`
- **Bouton d'Action** :
  - **Texte** : `Échanger avec un conseiller`
  - **Style** : `w-full py-3.5 px-4 rounded-xl text-ink bg-background-secondary hover:bg-border/60 border border-border font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px]`
  - **Microcopy sous bouton** : `Réponse sous 2 heures ouvrées • Étude sans engagement`

---

### 4. Bandeau 4 Colonnes : Moyens de Paiement & Rassurance Locale

#### Design
- `w-full bg-background-secondary border-y border-border py-12 px-4 sm:px-6 lg:px-8`.
- Grille 4 colonnes réactive : `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto`.
- Blocs : `p-5 bg-background border border-border rounded-xl flex items-start gap-4 shadow-xs`.

#### Contenu & Puces
1. **Paiement Mobile Local** (`CreditCard`) :
   - Titre : `Paiement Mobile & Carte`
   - Description : `Réglez votre abonnement en toute simplicité par MTN Mobile Money, Moov Money ou carte bancaire locale.`
2. **Liberté Totale** (`ShieldCheck`) :
   - Titre : `Aucun Engagement`
   - Description : `Changez de formule, suspendez ou résiliez votre abonnement en 1 clic sans avoir à vous justifier.`
3. **Facture DGI Déductible** (`Receipt`) :
   - Titre : `Facture Déductible DGI`
   - Description : `Chaque mensualité donne lieu à une facture normalisée e-MECeF, déductible de vos impôts d'entreprise.`
4. **Assistance à Cotonou** (`Headphones`) :
   - Titre : `Équipe Basée à Cotonou`
   - Description : `Des interlocuteurs qui connaissent la fiscalité béninoise et vous répondent directement sur WhatsApp.`

---

### 5. Simulateur Interactif d'Économies (Calculateur ROI)

#### Objectif Pédagogique
Aider le dirigeant à visualiser de manière dépassionnée le temps et les tracas qu'il économise chaque mois.

#### Mise en Page
- Conteneur : `max-w-4xl mx-auto bg-background border border-border rounded-2xl p-6 sm:p-10 shadow-xs my-16`.
- **En-tête** :
  - Badge : `Simulateur de Sérénité` (`bg-primary/20 text-ink text-xs font-bold px-3 py-1 rounded-full uppercase`)
  - Titre H2 : « Combien de temps Ceilow vous fait-il gagner chaque mois ? »
  - Sous-titre : « Évaluez le temps administratif et les risques de redressement que vous éliminez en automatisant votre gestion. »
- **Zone de Gauche : 2 curseurs de réglage** :
  1. *Factures émises par mois* : Curseur de 10 à 300 factures (valeur par défaut : 45 factures).
  2. *Heures consacrées à la paperasse et aux pointages* : Curseur de 2h à 30h / mois (valeur par défaut : 14 heures).
  - Note de réassurance : « L'estimation prend en compte la normalisation e-MECeF en direct et le pointage automatique MoMo. »
- **Zone de Droite : Carte de résultat direct** (`bg-background-secondary border border-border rounded-xl p-6`) :
  - Temps économisé estimé : `~10.5 heures / mois` (en vert menthe `text-success-deep font-bold font-mono text-2xl`).
  - Risque d'erreur fiscale : `Éliminé à 100 %` (QR code DGI certifié).
  - Constat de rentabilité : `Rentabilisé dès la première semaine`.
  - Bouton inline : `Tester gratuitement pendant 14 jours` (Lien `/register`).

---

### 6. Tableau Comparatif Exhaustif des Fonctionnalités

#### Design & Ergonomie
- **Titre de section** : « Comparez les fonctionnalités dans le détail »
- **Sous-titre** : « Chaque formule répond précisément aux obligations fiscales et comptables en République du Bénin. »
- Tableau sobre, lisible et aéré avec en-têtes fixes et survol discret des lignes (`hover:bg-background-secondary/60`).
- Les 6 catégories métier :
  1. *Facturation & Conformité Fiscale DGI*
  2. *Trésorerie & Synchronisation Bancaire*
  3. *Déclarations Fiscales & TVA Bénin*
  4. *Comptabilité & Organisation SYSCOHADA*
  5. *Paie & Salariés*
  6. *Utilisateurs & Accompagnement*

*(Le contenu exhaustif des 6 catégories est scrupuleusement repris de la matrice de spécification validée).*

---

### 7. Bloc Échange Conseiller (Fond Ink Sombre & Équipe à Cotonou)

#### Objectif
Rassurer le dirigeant qui hésite entre deux formules en lui proposant un échange chaleureux et humain, sans pression d'achat.

#### Design (Conforme Règle 5 : Zéro glassmorphisme)
- Fond `bg-ink text-white rounded-2xl border border-white/10 p-8 sm:p-12 max-w-7xl mx-auto my-16`.
- **Texte de Gauche** :
  - Badge : `Accompagnement Personnalisé` (fond `bg-[#3D3830] text-primary border border-white/10 px-3 py-1 rounded text-xs font-semibold`)
  - Titre H3 : « Vous hésitez ? Échangez simplement avec un conseiller. »
  - Paragraphe : « Notre équipe basée à Cotonou regarde votre activité avec vous et vous oriente vers la formule la plus juste pour vos besoins réels, sans forcer la main. »
  - CTA : `Prendre un rendez-vous téléphonique` (Bouton jaune `bg-primary text-ink font-bold px-6 py-3.5 rounded-xl hover:bg-primary-hover`)
  - Rassurance d'équipe : « Amina, Josué ou Marc vous répondent avec bienveillance. »
- **Visuel de Droite** :
  - Photo d'une conseillère souriante et professionnelle dans un bureau à Cotonou.
  - Badge opaque inférieur (fond `#1E1B16` solide, pas de flou) : « Conseillers disponibles à Cotonou • Réponse en < 5 min ».

---

### 8. Carte de Transition : « Vous avez déjà un comptable ? »

#### Objectif
Lever l'objection majeure : *« J'ai déjà des habitudes, changer d'outil va me faire perdre mes données ou froisser mon comptable. »*

#### Design & Contenu
- Bloc split 2 colonnes avec photo d'équipe locale et contenu textuel clair.
- **Badge** : `Transition Clé en Main`
- **Titre H3** : « Vous avez déjà un comptable ? Ceilow s'adapte sans rien bousculer. »
- **Paragraphe** :
  « Comme plus de 450 dirigeants au Bénin, libérez-vous de la saisie manuelle sans changer vos partenariats. Nous créons un accès gratuit pour votre expert-comptable pour qu'il récupère des balances propres sans vous déranger. »
- **CTA** : `Être accompagné gratuitement pour la transition`
- **Garantie** : « Reprise de vos données et balances 100 % assurée ».

---

### 9. Avis Vérifiés & Preuve Sociale Locale

#### En-tête
- « Approuvé par plus de 450 dirigeants et cabinets au Bénin » — Note moyenne vérifiée : **4.9 / 5**.

#### Carte Vedette (Mise en Avant)
- **Avis d'Aurélie Tokpanou** (Fondatrice & CEO, Tokpanou Consulting Group — Cotonou, Ganhi) :
  « En créant notre cabinet de conseil à Ganhi, nous craignions les sanctions DGI liées aux factures non conformes. Ceilow a tout simplifié : l'émission de la facture normalisée se fait en direct avec le QR code officiel validé en temps réel. Le gain de sérénité est total. »

#### 3 Retours d'Expérience Complémentaires
1. **Koffi Agbossou** (Directeur, Agence Com'Afrik — Haie Vive, Cotonou) :
   « Avant Ceilow, l'édition des factures normalisées e-MECeF prenait des heures. Désormais, tout part en 10 secondes avec QR code certifié. »
2. **Séfako Noukpo** (Gérante, Bénin Agro Distribution — Akpakpa) :
   « La synchronisation MTN MoMo a transformé notre trésorerie. Les pointages qui prenaient des jours entiers se font maintenant tout seuls. »
3. **Me Aristide Mensah** (Expert-Comptable Associé, Cabinet Fiduciaire du Golfe — Cotonou) :
   « Recommander Ceilow à nos clients nous permet de recevoir des dossiers impeccables et des déclarations TVA sans écart. Un vrai soulagement pour notre cabinet. »

---

### 10. Carte Pré-Footer Sérénité Fiscale (Lifestyle Dirigeant)

- **Titre H2** : « Prêt pour une gestion sans stress ? »
- **Sous-titre** : « Rejoignez les entrepreneurs béninois qui ont retrouvé le sommeil avant la date fatidique de la déclaration fiscale. »
- **Double CTA équilibré** :
  1. Bouton primaire : `Démarrer mon essai de 14 jours` (Jaune `bg-primary`)
  2. Bouton secondaire : `Demander un échange téléphonique` (Fond solide `bg-background-secondary border border-border`)
- **Puces de rassurance** : `Sans carte bancaire` • `Annulation en 1 clic` • `Accompagnement local`.

---

### 11. FAQ Accordéon (7 Réponses Transparentes)

1. **Puis-je vraiment tester Ceilow sans payer et sans carte bancaire ?**
   - *Réponse* : Oui. Vous pouvez utiliser le Plan Gratuit (10 factures/mois à vie) ou tester le Plan Pro pendant 14 jours. Aucune information bancaire ni compte MoMo n'est requis à l'inscription.
2. **Quels sont les moyens de paiement acceptés pour régler mon abonnement ?**
   - *Réponse* : Nous acceptons MTN Mobile Money, Moov Money et cartes bancaires (Visa, Mastercard), ainsi que le virement bancaire pour les formules annuelles.
3. **Suis-je engagé sur la durée ?**
   - *Réponse* : Non, aucun engagement. Vous pouvez arrêter votre abonnement en 1 clic depuis vos paramètres à tout moment, sans pénalité.
4. **Que se passe-t-il si je dépasse les 10 factures du Plan Gratuit ?**
   - *Réponse* : Vos factures déjà émises restent valides et accessibles. Une notification vous prévient que le quota est atteint et vous pouvez basculer sur le Plan Pro pour continuer sans interruption.
5. **Les factures de mon abonnement Ceilow sont-elles déductibles de mes impôts au Bénin ?**
   - *Réponse* : Oui. Ceilow SAS émet pour chaque paiement une facture normalisée avec QR code DGI, 100 % déductible de votre résultat fiscal.
6. **Comment fonctionne le tarif dégressif pour les cabinets d'expertise comptable ?**
   - *Réponse* : Nous proposons une tarification dégressive par tranche de dossiers clients pour les membres de l'OECCA et cabinets fiduciaires.
7. **Mes données restent-elles en sécurité si j'arrête mon abonnement ?**
   - *Réponse* : Oui. Vos données vous appartiennent. Vous conservez l'accès en consultation et pouvez exporter vos archives complètes (FEC, Excel, PDF) gratuitement à tout moment.

---

### 12. Bannière Finale de Sortie

- Fond solide `bg-ink text-white` sobre et digne (zéro dégradé, zéro verre dépoli).
- **Titre** : « Prêt à vous libérer de la corvée administrative ? »
- **Sous-titre** : « Activez votre compte en 2 minutes et commencez à facturer sereinement dès aujourd'hui. »
- **CTA** : `Démarrer mon essai gratuit` (Lien `/register`) + `Planifier une démonstration guidée` (Lien `/demo`).

---

### 13. Footer Public Unifié
- Utilise `<PublicFooter />` (composant officiel Ceilow assaini de tout glassmorphisme, liens vérifiés).
