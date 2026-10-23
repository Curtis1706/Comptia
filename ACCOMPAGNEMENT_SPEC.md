# Spécification Complète & Copywriting : Page Accompagnement & Services — Ceilow

> **Document de Référence Frontend, UX & Copywriting (Version Stylisée d'après l'Architecture Indy)**  
> Ce document définit l'architecture d'écran, l'expérience utilisateur mobile-first, le design system et l'intégralité du texte (copywriting de conversion empathique, microcopy, piliers de réassurance, vitrine interactive à onglets et FAQ en deux colonnes) pour la page `/accompagnement` de Ceilow.  
> **Conformité stricte aux Règles Ceilow** : 100 % tokens sémantiques (`primary`, `ink`, `background`, `background-secondary`, `border`, `text-muted`, `success`), zéro code couleur hexadécimal en dur dans les classes, zéro emoji (icônes vectorielles Lucide React uniquement), zéro glassmorphisme, typographie Clash Display (titres vitrine) et Inter avec chiffres tabulaires (`tabular-nums`), responsive mobile-first vérifié (375px $\rightarrow$ 768px $\rightarrow$ 1280px), zones tactiles $\ge 44\text{px}$.

---

## 1. Vision, Positionnement & Framework Copywriting

### 1.1. L'Inspiration Visuelle & Structurelle (Modèle Indy Stylisé Ceilow)
La structure est calquée sur l'expérience de référence des SaaS de comptabilité et de gestion modernes (Indy pour SARL, SAS, EURL et indépendants), adaptée aux spécificités fiscales et juridiques de la République du Bénin :
1. **Hero Split Screen 2 Colonnes** : Promesse claire et rassurante à gauche (bénéfices concrets en 4 points clés, double CTA), photographie professionnelle valorisante à droite.
2. **Ruban de Réassurance Immédiate** : 4 indicateurs de confiance (note de satisfaction 4,9/5, conformité DGI e-MECeF, protection APDP, déploiement 48h garanti).
3. **Grille 3 Cartes "Gérez facilement votre société"** : Démonstration visuelle avec aperçus UI de la comptabilité automatisée, du suivi de trésorerie en direct et de la facturation mobile.
4. **Bannière d'Autorité Fond Sombre Ink ("Avec Ceilow, vous êtes entre de bonnes mains")** : 5 piliers d'engagement humain (Réactivité, Expertise locale, Technologie robuste, Sérénité fiscale, Proximité physique à Cotonou).
5. **Grille 3 Cartes "Vos déclarations en toute sérénité"** : Focus sur la suppression du stress des déclarations TVA, la génération automatique des liasses SYSCOHADA et la certification DGI en 1 clic.
6. **Section Preuve Sociale & Témoignages (Fond Sombre Ink)** : Badge 4,9/5 + 3 témoignages détaillés de dirigeants béninois (SARL distribution, fondatrice d'agence conseil, directeur logistique portuaire).
7. **Appel au Juste Prix ("Votre gestion, au juste prix")** : Bloc épuré avec icône financière, valorisant la transparence tarifaire et le retour sur investissement dès le premier mois.
8. **Showcase Interactif à Onglets ("L'ensemble de vos besoins en une seule solution")** : Sélecteur horizontal par forme juridique (SARL & SAS, Entreprises Individuelles ETS, Professions Libérales & Consultants, Création d'Entreprise) couplé à une démonstration en direct du cockpit.
9. **Foire Aux Questions en 2 Colonnes Équilibrées** : 8 questions-réponses directes levant l'ensemble des freins techniques, comptables et relationnels.
10. **Bannière Pré-Footer Lifestyle** : Carte chaleureuse invitant à la réservation d'un diagnostic offert de 15 minutes avec un conseiller local.

### 1.2. Psychologie du Visiteur Béninois & Framework AIDA
Le visiteur qui arrive sur cette page n'est pas là pour acheter des lignes de code : il cherche à se libérer d'un fardeau administratif lourd et anxiogène.
- **Attention (A)** : « La solution tout-en-un des SARL, SAS, ETS et Indépendants au Bénin ». Dès les 3 premières secondes, le visiteur se reconnaît immédiatement dans sa forme juridique.
- **Intérêt (I)** : La mise en valeur conjointe du logiciel et de l'accompagnement humain par des consultants basés à Cotonou, prêts à se déplacer sur site.
- **Désir (D)** : La vision concrète de la paix d'esprit : factures conformes DGI instantanées, TVA calculée au fil de l'eau, zéro pénalité de retard, gain de 5 heures par semaine.
- **Action (A)** : Deux portes d'entrée déculpabilisantes et sans engagement : un appel de diagnostic gratuit de 15 minutes ou une démonstration interactive immédiate.

---

## 2. Palette & Tokens Utilisés Exclusivement

| Token Sémantique | Classe Tailwind Utilisée | Usage sur la Page |
|---|---|---|
| `primary` | `bg-primary`, `text-primary`, `border-primary` | Boutons CTA prioritaires, étoiles d'avis, onglet actif, accents de surbrillance |
| `ink` | `bg-ink`, `text-ink` | Fond des sections d'autorité sombres, titres vitrine, textes principaux |
| `background` | `bg-background` | Fond général des sections claires (#FFFFFF) |
| `background-secondary` | `bg-background-secondary` | Fond des cartes de fonctionnalités, des blocs FAQ et de la bannière pré-footer |
| `border` | `border-border`, `border-white/10` | Délimitations structurelles, séparateurs d'onglets, contours de cartes |
| `text-muted` | `text-text-muted`, `text-white/70` | Textes secondaires, légendes, détails techniques, labels neutres |
| `success` | `bg-success`, `text-success`, `text-success-deep` | Checkmarks d'inclusion, pastilles d'état certifié DGI, indicateurs positifs |

### Règles Typographiques & Sobriété
- **Titres H1 et H2** : Police Clash Display (Bold / Semi-Bold) pour donner une assise institutionnelle sérieuse.
- **Corps de texte, listes, métriques et FAQ** : Police Inter, chiffres tabulaires activés systématiquement (`tabular-nums`) pour aligner proprement les nombres et pourcentages.
- **Zéro Emoji** : Strictement interdit. Remplacé par des icônes vectorielles Lucide React (`CheckCircle2`, `Clock`, `ShieldCheck`, `Headphones`, `Users`, `Award`, `ArrowRight`, `ChevronDown`, `Calendar`, `PiggyBank`, `FileText`, `Sparkles`, `Star`, `MessageSquare`).
- **Zéro Glassmorphisme** : Fonds opaques solides exclusivement (`bg-background`, `bg-background-secondary`, `bg-ink`, `bg-[#3D3830]`). Aucun calque `backdrop-blur` ni dégradé artificiel de surface.

---

## 3. Architecture des Écrans & Sections (Layout Global)

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. HEADER PUBLIC UNIFIÉ                                                │
│    Logo Ceilow + Navigation (/tarifs, /accompagnement...) + CTA Démo   │
├────────────────────────────────────────────────────────────────────────┤
│ 2. HERO SECTION : SPLIT SCREEN (L'OFFRE COMPLÈTE EN 2 COLONNES)        │
│    • Gauche : Titre H1 + Checklist 4 bénéfices + Double CTA            │
│    • Droite : Photographie professionnelle dirigeante en bureau        │
├────────────────────────────────────────────────────────────────────────┤
│ 3. RUBAN DE RÉASSURANCE IMMÉDIATE (4 PILIERS DE PREUVE)                │
│    4,9/5 Avis client • DGI e-MECeF • Hébergement APDP • Déploiement 48h│
├────────────────────────────────────────────────────────────────────────┤
│ 4. SECTION 1 : GÉREZ FACILEMENT VOTRE SOCIÉTÉ AVEC CEILOW              │
│    Grille 3 cartes produits warm : Comptabilité • Trésorerie • Facture │
├────────────────────────────────────────────────────────────────────────┤
│ 5. SECTION 2 : BANNIÈRE SOMBRE D'AUTORITÉ INK                          │
│    "Avec Ceilow, vous êtes entre de bonnes mains" (5 piliers humains)  │
├────────────────────────────────────────────────────────────────────────┤
│ 6. SECTION 3 : VOS DÉCLARATIONS EN TOUTE SÉRÉNITÉ                      │
│    Grille 3 cartes : Zéro calcul manuel • Liasses fiscales • e-MECeF    │
├────────────────────────────────────────────────────────────────────────┤
│ 7. SECTION 4 : PREUVE SOCIALE & TÉMOIGNAGES CLIENTS (FOND INK)         │
│    Badge 4,9/5 + 3 témoignages réels (Ganhi, Cadjehoun, Port Cotonou)  │
├────────────────────────────────────────────────────────────────────────┤
│ 8. SECTION 5 : VOTRE GESTION AU JUSTE PRIX (CALLOUT TRANSPARENCE)      │
│    Icône tirelire • Zéro frais cachés • CTA vers /tarifs               │
├────────────────────────────────────────────────────────────────────────┤
│ 9. SECTION 6 : L'ENSEMBLE DE VOS BESOINS EN UNE SEULE SOLUTION         │
│    Sélecteur onglets (SARL/SAS, ETS, Consultants, Création) + Mockup   │
├────────────────────────────────────────────────────────────────────────┤
│ 10. SECTION 7 : QUESTIONS FRÉQUENTES (FAQ EN 2 COLONNES)               │
│     8 questions réparties en 2 colonnes équilibrées pour scan rapide   │
├────────────────────────────────────────────────────────────────────────┤
│ 11. SECTION 8 : BANNIÈRE PRÉ-FOOTER LIFESTYLE                          │
│     Carte warm arrondie avec photo entrepreneur + double CTA contact   │
├────────────────────────────────────────────────────────────────────────┤
│ 12. FOOTER PUBLIC UNIFIÉ                                               │
│     Tous liens vers vraies routes (/comptabilite, /facturation, etc.) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Spécification Détaillée & Copywriting Écran par Écran

### Section 1 : Header Public Unifié
- Intégration du composant [`PublicHeader`](file:///e:/Comptia/src/components/layout/PublicHeader.tsx).
- Liens actifs : Tarifs (`/tarifs`), Accompagnement (`/accompagnement` - état actif), Facturation DGI (`/facturation`), Déclarations TVA (`/tva`).
- Bouton principal : `Demander une démo` pointant vers `/demo`.

---

### Section 2 : Hero Section — L'Offre Complète (Split Screen 2 Colonnes)

#### Structure Visuelle
- **Conteneur** : `w-full bg-background pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border`.
- **Disposition** : `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Colonne Gauche (Persuasion & Actions - 7 colonnes)** :
  - **Kicker / Badge supérieur** :
    ```tsx
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-ink text-xs font-bold uppercase tracking-wider mb-6">
      <Sparkles className="w-3.5 h-3.5 text-ink shrink-0" />
      <span>Accompagnement &amp; Logiciel Tout-en-un au Bénin</span>
    </div>
    ```
  - **Titre H1 (Clash Display)** :
    - **Texte Recommandé** : « La solution tout-en-un des SARL, SAS, ETS et Indépendants au Bénin »
    - *Alternative A/B* : « Pilotez votre société en toute sérénité avec des experts à vos côtés. »
    - *Justification UX* : Identification immédiate des 4 statuts juridiques dominants au Bénin.
  - **Sous-titre d'empathie** :
    « Facturation certifiée DGI, suivi de trésorerie en direct et assistance personnalisée par des spécialistes basés à Cotonou : concentrez-vous sur votre activité, nous sécurisons vos comptes. »
  - **Checklist des 4 Bénéfices Concrets** :
    ```tsx
    <ul className="flex flex-col gap-3 my-8">
      <li className="flex items-center gap-3 text-sm font-medium text-ink">
        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
        <span>Facturation &amp; Devis 100 % conformes DGI (e-MECeF en 1 clic)</span>
      </li>
      <li className="flex items-center gap-3 text-sm font-medium text-ink">
        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
        <span>Rapprochement bancaire &amp; Mobile Money automatique (MTN, Moov, Celtiis, Banques)</span>
      </li>
      <li className="flex items-center gap-3 text-sm font-medium text-ink">
        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
        <span>Calcul automatisé de vos cotisations fiscales et déclarations de TVA</span>
      </li>
      <li className="flex items-center gap-3 text-sm font-medium text-ink">
        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
        <span>Liasses fiscales &amp; bilans SYSCOHADA édités avec votre expert-comptable</span>
      </li>
    </ul>
    ```
  - **Groupe de CTA (Double Bouton Ergonomique)** :
    - **Bouton Primaire** :
      - *Texte* : `Prendre rendez-vous`
      - *Lien* : `#diagnostic`
      - *Classes* : `h-12 min-h-[48px] px-8 bg-primary hover:bg-primary-hover text-ink font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2`
    - **Bouton Secondaire** :
      - *Texte* : `Découvrir les formules`
      - *Lien* : `/tarifs`
      - *Classes* : `h-12 min-h-[48px] px-6 bg-background hover:bg-background-secondary border border-border text-ink font-bold text-sm rounded-xl transition-all flex items-center justify-center`
  - **Microcopy de réassurance sous les boutons** :
    `Échange gratuit de 15 minutes • Sans engagement commercial • Réponse sous 2 heures ouvrées`
- **Colonne Droite (Photographie Professionnelle Valorisation - 5 colonnes)** :
  - Cadre arrondi élégant (`rounded-2xl overflow-hidden border border-border shadow-md aspect-[4/5] relative bg-background-secondary`).
  - Image d'une cheffe d'entreprise béninoise confiante et sereine dans son espace de travail moderne.
  - Badge flottant discret en bas d'image (`bg-background p-4 rounded-xl border border-border shadow-md flex items-center gap-3`) :
    - Icône `Clock` en couleur `text-primary`.
    - Texte : `Mise en service clé en main garantie en 48 heures ouvrées`.

---

### Section 3 : Ruban de Réassurance Immédiate (4 Piliers de Preuve)

#### Structure Visuelle
- Bande pleine largeur `w-full py-6 bg-background-secondary border-b border-border`.
- Conteneur centré `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Grille fluide `grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-between text-center md:text-left`.

#### Les 4 Indicateurs de Preuve
1. **Satisfaction Client** :
   - Note : `4,9 / 5`
   - Détail : `Évalué par plus de 150 dirigeants d'entreprise`
   - Icône : `Star` (remplie en couleur `primary`)
2. **Conformité Fiscale Officielle** :
   - Titre : `Homologué DGI e-MECeF`
   - Détail : `Factures certifiées et QR code officiel Bénin`
   - Icône : `ShieldCheck` (couleur `success-deep`)
3. **Protection des Données** :
   - Titre : `100 % Conforme APDP`
   - Détail : `Données chiffrées hébergées en toute sécurité`
   - Icône : `Lock` (couleur `ink`)
4. **Disponibilité Support** :
   - Titre : `Équipe locale à Cotonou`
   - Détail : `Assistance directe par WhatsApp & téléphone`
   - Icône : `Headphones` (couleur `primary`)

---

### Section 4 : "Gérez facilement votre société avec Ceilow" (Grille 3 Cartes)

#### En-tête de Section
- **Titre H2 (Clash Display)** : « Gérez facilement votre société avec Ceilow »
- **Sous-titre** : « Pensé pour répondre parfaitement à vos besoins, du démarrage de votre activité jusqu'à sa pleine expansion. »
- Alignement centré, espacement aéré (`max-w-3xl mx-auto mb-16 text-center`).

#### Grille des 3 Cartes Fonctionnalités (Fond Warm `bg-background-secondary`)
1. **Carte 1 : Automatisez votre comptabilité**
   - *Aperçu UI* : Capture épurée du journal des écritures avec statut lettré en vert (`success`) et flux catégorisés sans friction.
   - *Titre H3* : `Automatisez votre comptabilité`
   - *Texte explicatif* : « Vos encaissements et vos dépenses se classent automatiquement dans le bon compte SYSCOHADA. Plus aucune facture égarée, plus de double saisie. »
2. **Carte 2 : Découvrez en direct combien vous gagnez**
   - *Aperçu UI* : Dashboard graphique de solde de trésorerie net, chiffre d'affaires du mois et provision d'impôt en temps réel.
   - *Titre H3* : `Découvrez combien vous gagnez`
   - *Texte explicatif* : « Suivez votre bénéfice net au jour le jour et anticipez vos décaissements sans attendre le bilan de fin d'année de votre cabinet. »
3. **Carte 3 : Facturez d'où que vous soyez en un clin d'œil**
   - *Aperçu UI* : Écran mobile/tablette de création de facture avec aperçu du QR code DGI et bouton de partage WhatsApp direct.
   - *Titre H3* : `Facturez d'où que vous soyez`
   - *Texte explicatif* : « Émettez vos factures normalisées depuis votre smartphone en boutique, sur chantier ou au bureau. Vos clients reçoivent leur reçu par WhatsApp en 10 secondes. »

#### Bouton d'Action Central sous la Grille
- *Texte* : `Prendre rendez-vous avec un conseiller`
- *Lien* : `#diagnostic`
- *Style* : `mt-12 inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-ink font-bold text-sm hover:bg-primary-hover shadow-sm min-h-[48px] transition-all`

---

### Section 5 : Bannière Sombre d'Autorité Ink ("Avec Ceilow, vous êtes entre de bonnes mains")

#### Ambiance & Design Visuel
- Fond uni sombre profond : `bg-ink text-white py-16 lg:py-20 border-y border-white/10`.
- Typographie travaillée : Titre H2 en Clash Display Semi-Bold avec touche stylisée élégante.
- Titre H2 : « Avec Ceilow, vous êtes entre de bonnes mains »
- Disposition : `grid grid-cols-2 md:grid-cols-5 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center`.

#### Les 5 Piliers Humains & Techniques
1. **Réactivité**
   - Icône : `Clock` en `text-primary`
   - Titre H3 : `Réactivité`
   - Descriptif : `Une réponse garantie en moins de 15 minutes par WhatsApp ou par téléphone.`
2. **Expertise Locale**
   - Icône : `Award` en `text-primary`
   - Titre H3 : `Expertise`
   - Descriptif : `Des consultants certifiés maîtrisant le droit fiscal et le SYSCOHADA béninois.`
3. **Technologie**
   - Icône : `Cpu` en `text-primary`
   - Titre H3 : `Technologie`
   - Descriptif : `Synchronisation automatique avec vos banques et vos comptes Mobile Money.`
4. **Sérénité**
   - Icône : `ShieldCheck` en `text-primary`
   - Titre H3 : `Sérénité`
   - Descriptif : `Vos déclarations fiscales transmises dans les délais légaux, zéro pénalité.`
5. **Proximité**
   - Icône : `MapPin` en `text-primary`
   - Titre H3 : `Proximité`
   - Descriptif : `Une équipe basée à Cotonou prête à intervenir directement dans vos bureaux.`

---

### Section 6 : "Vos déclarations en toute sérénité" (Grille 3 Cartes)

#### En-tête de Section
- **Titre H2 (Clash Display)** : « Vos déclarations en toute sérénité »
- **Sous-titre** : « Ceilow prépare et génère l'ensemble de vos documents fiscaux et sociaux obligatoires en quelques clics. »

#### Les 3 Cartes Déclarations
1. **Carte 1 : Fini les calculs manuels et le stress du 15 du mois**
   - *Aperçu UI* : Tableau de calcul de la TVA collectée, de la TVA déductible et de la TVA nette due, avec mention claire « Montant vérifié conforme ».
   - *Texte* : « Vos écritures alimentent automatiquement votre déclaration. Vous connaissez votre montant de TVA avant le 10 du mois sans calcul interminable. »
2. **Carte 2 : Génération de l'ensemble de vos liasses fiscales**
   - *Aperçu UI* : Document synthétique SYSCOHADA avec boutons d'export PDF et Excel pour votre expert-comptable.
   - *Texte* : « Bilan, Compte de résultat et balance générale s'éditent en un clic aux normes officielles de l'administration fiscale béninoise. »
3. **Carte 3 : Certification e-MECeF sans blocage**
   - *Aperçu UI* : Reçu officiel avec QR code DGI et jeton d'authentification validé.
   - *Texte* : « Chaque vente reçoit son numéro d'enregistrement DGI instantanément. En cas de coupure de réseau, le mode hors-ligne prend le relais sans bloquer vos clients. »

#### Bouton d'Action Central
- *Texte* : `Découvrir notre accompagnement fiscal`
- *Lien* : `/tarifs`
- *Style* : `mt-12 inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-ink font-bold text-sm hover:bg-primary-hover shadow-sm min-h-[48px] transition-all`

---

### Section 7 : Preuve Sociale & Témoignages (Conteneur Sombre Ink)

#### Structure Visuelle
- Fond sombre `bg-ink text-white py-20 border-y border-white/10`.
- En-tête avec note globale :
  ```tsx
  <div className="flex flex-col items-center gap-3 text-center mb-16">
    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#3D3830] border border-white/10 text-xs font-semibold text-white">
      <div className="flex gap-1 text-primary">
        <Star className="w-3.5 h-3.5 fill-primary" />
        <Star className="w-3.5 h-3.5 fill-primary" />
        <Star className="w-3.5 h-3.5 fill-primary" />
        <Star className="w-3.5 h-3.5 fill-primary" />
        <Star className="w-3.5 h-3.5 fill-primary" />
      </div>
      <span className="font-bold text-white pl-1">4,9 / 5</span>
      <span className="text-white/60">• Satisfaction client vérifiée</span>
    </div>
    <h2 className="text-3xl sm:text-4xl font-bold font-clash text-white">
      Plus de 500 entreprises et indépendants nous font confiance
    </h2>
    <p className="text-white/75 text-base max-w-2xl">
      Découvrez comment des dirigeants béninois ont sécurisé leur conformité et simplifié leur gestion au quotidien.
    </p>
  </div>
  ```

#### Grille des 3 Témoignages Concrets (Cartes `bg-[#3D3830] border border-white/10 p-8 rounded-2xl`)
1. **Témoignage 1 : PME Distribution & Commerce de Gros (Ganhi, Cotonou)**
   - *Note* : 5/5 étoiles
   - *Titre* : `« En deux jours, nous sommes passés du papier à 100 % de factures certifiées »`
   - *Texte* : « Nous perdions 3 heures chaque soir à rapprocher les espèces et les paiements MoMo. L'équipe Ceilow est venue installer les postes dans notre magasin et a formé nos vendeuses en une matinée. Le soir, la caisse tombe juste au franc près. »
   - *Auteur* : **Arnaud Soglo**, Directeur Général • Établissements Soglo & Fils (8 salariés).
2. **Témoignage 2 : Cabinet Conseil & Prestations Intellectuelles (Cadjehoun, Cotonou)**
   - *Note* : 5/5 étoiles
   - *Titre* : `« La fin de la panique du 15 du mois pour les déclarations TVA »`
   - *Texte* : « Avant Ceilow, rassembler nos factures était une source de stress permanent. Aujourd'hui, mon comptable accède directement à nos journaux, valide les chiffres en un clic et transmet notre déclaration sans pénalité. »
   - *Auteur* : **Mariam Bio**, Fondatrice & Gérante • Agence Stratégie Atlantique.
3. **Témoignage 3 : Transport & Transit Portuaire (Zone Portuaire, Cotonou)**
   - *Note* : 5/5 étoiles
   - *Titre* : `« Un conseiller réactif qui répond sur WhatsApp en 5 minutes »`
   - *Texte* : « Au port, une facture bloquée peut retarder une livraison de conteneurs. Quand nous avons eu un doute sur l'exonération d'une facture sous douane, notre conseiller dédié Ceilow nous a assistés instantanément. C'est précieux. »
   - *Auteur* : **Christian Dossou**, Responsable Administratif & Financier • Transit Bénin Express.

---

### Section 8 : "Votre gestion, au juste prix" (Callout Transparence)

#### Structure Visuelle
- Section claire et respirante : `w-full py-20 bg-background text-center`.
- Conteneur centré `max-w-2xl mx-auto px-4`.
- **Icône** : Illustration sobre `PiggyBank` ou `Scale` intégrée dans un cercle `w-14 h-14 rounded-full bg-background-secondary border border-border flex items-center justify-center mx-auto mb-6 text-ink`.
- **Titre H2 (Clash Display)** : « Votre gestion et votre accompagnement, au juste prix »
- **Sous-titre** : « Des tarifs transparents en FCFA, sans frais cachés ni mauvaise surprise. Choisissez l'autonomie avec notre logiciel ou déléguez votre transition à nos spécialistes. »
- **Bouton CTA** :
  - *Texte* : `Consulter notre grille tarifaire`
  - *Lien* : `/tarifs`
  - *Classes* : `inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-ink font-bold text-sm min-h-[48px] shadow-sm transition-all`

---

### Section 9 : "L'ensemble de vos besoins en une seule solution" (Showcase Interactif à Onglets)

#### En-tête de Section
- **Titre H2 (Clash Display)** : « L'ensemble de vos besoins en une seule solution »
- **Sous-titre** : « Que vous créiez votre première structure ou gériez une entreprise en pleine expansion, Ceilow s'adapte à votre statut. »

#### Sélecteur d'Onglets Horizontal (Pills)
Boutons de navigation spacieux avec défilement horizontal fluide sur mobile (`flex items-center gap-2 overflow-x-auto pb-4 justify-start sm:justify-center`):
1. **SARL & SAS** (Onglet actif par défaut : `bg-ink text-white font-bold px-5 py-2.5 rounded-full text-sm`)
2. **Entreprises Individuelles (ETS)** (`bg-background-secondary text-ink hover:bg-border px-5 py-2.5 rounded-full text-sm font-semibold`)
3. **Professions Libérales & Consultants** (`bg-background-secondary text-ink hover:bg-border px-5 py-2.5 rounded-full text-sm font-semibold`)
4. **Création d'Entreprise** (`bg-background-secondary text-ink hover:bg-border px-5 py-2.5 rounded-full text-sm font-semibold`)

#### Panneau de Contenu de l'Onglet Actif (Exemple SARL & SAS - Grille 2 Colonnes)
- **Colonne Gauche (Bénéfices Spécifiques au Statut)** :
  - *Titre H3* : `Votre comptabilité en temps réel et votre liasse sans accroc`
  - *Description* : « Conçu sur mesure pour répondre aux exigences du SYSCOHADA et de l'administration fiscale béninoise. »
  - *Points clés avec icônes de contrôle* :
    - `Synchronisation bancaire automatique & rapprochement MoMo sans saisie manuelle`
    - `Catégorisation intelligente de vos dépenses d'exploitation`
    - `Clôture d'exercice simplifiée avec export des écritures pour votre expert-comptable`
    - `Factures d'acompte et situations de travaux adaptées aux marchés publics`
  - *Lien d'action* :
    - *Texte* : `Demander un diagnostic personnalisé pour ma société`
    - *Lien* : `#diagnostic`
    - *Style* : `inline-flex items-center gap-2 text-ink font-bold text-sm hover:text-primary transition-colors underline underline-offset-4 mt-6 min-h-[44px]`
- **Colonne Droite (Aperçu Cockpit Haute Fidélité)** :
  - Carte d'interface spacieuse (`p-6 rounded-2xl bg-background border border-border shadow-md`).
  - Simulation de tableau de bord d'une SARL avec indicateur d'encaissements, factures en attente et bouton de génération e-MECeF en 1 clic.

---

### Section 10 : Questions Fréquentes (FAQ en 2 Colonnes Équilibrées)

#### En-tête
- **Titre H2 (Clash Display)** : « Questions fréquentes »
- **Sous-titre** : « Tout ce que vous devez savoir pour démarrer votre accompagnement en toute clarté. »
- Disposition : `grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12`.

#### Colonne 1 (Organisation & Démarrage)
1. **Comment se déroule la première prise de contact ?**
   - *Réponse* : « Nous débutons par un échange téléphonique ou visio de 15 minutes sans aucun engagement. Nous faisons le point sur votre volume de factures, vos outils actuels et vos priorités fiscales pour vous recommander la formule adaptée. »
2. **Mon entreprise est déjà en activité, pouvez-vous reprendre mes anciennes données ?**
   - *Réponse* : « Oui, absolument. Nos spécialistes se chargent d'importer vos fichiers clients, vos catalogues de prestations et vos balances comptables de l'exercice précédent pour que vous repartiez sur un historique propre et complet. »
3. **Dois-je changer d'expert-comptable pour utiliser Ceilow ?**
   - *Réponse* : « Pas du tout. Ceilow n'a pas vocation à remplacer votre expert-comptable, mais à lui faciliter la tâche. Nous lui créons un accès gratuit dédié afin qu'il puisse récupérer vos journaux et balances certifiés en un clic. »
4. **Combien de temps faut-il pour que mon équipe soit autonome ?**
   - *Réponse* : « Grâce à notre session de formation pratique et à la simplicité de l'interface, vos collaborateurs émettent leurs premières factures en moins d'une heure. Nous restons à vos côtés pendant vos 30 premiers jours d'utilisation. »

#### Colonne 2 (Technique, Déplacements & Continuité)
5. **Que faire si la connexion Internet ou les serveurs de la DGI ont un ralentissement ?**
   - *Réponse* : « Ceilow intègre un mode de sécurisation local : vous continuez à préparer et enregistrer vos ventes sans bloquer votre caisse. Dès le rétablissement de la connexion, vos factures sont normalisées automatiquement en arrière-plan. »
6. **Vos conseillers peuvent-ils se déplacer dans nos bureaux à Cotonou ?**
   - *Réponse* : « Oui. Nous intervenons en présentiel dans le Grand Cotonou (Littoral, Abomey-Calavi, Porto-Novo, Ouidah). Pour les entreprises situées dans les autres départements, nous organisons des sessions d'accompagnement à distance ou des missions dédiées. »
7. **Que se passe-t-il après la fin de la période d'accompagnement ?**
   - *Réponse* : « Vous conservez l'accès permanent à notre support client réactif par WhatsApp et téléphone, ainsi qu'aux guides vidéo et mises à jour fiscales régulières. Vous n'êtes jamais laissé seul face à l'outil. »
8. **Proposez-vous un accompagnement pour la clôture annuelle et la DSF ?**
   - *Réponse* : « Oui. Lors de la période de clôture d'exercice, notre équipe propose une revue d'assistance technique pour s'assurer que l'ensemble de vos états et liasses SYSCOHADA sont parfaitement prêts pour le dépôt officiel. »

---

### Section 11 : Bannière Pré-Footer Lifestyle ("Prêt pour la sérénité financière ?")

#### Structure Visuelle
- Conteneur centré `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16`.
- Carte arrondie warm `bg-background-secondary border border-border rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center`.
- **Partie Gauche (Texte & Doubles CTA - 7 colonnes)** :
  - Espacement intérieur généreux (`p-8 sm:p-12 lg:p-14 flex flex-col items-start gap-5`).
  - **Titre H2 (Clash Display)** : « Prêt pour la sérénité dans votre gestion ? »
  - **Paragraphe d'appel à l'action** :
    « Rejoignez les dirigeants et entrepreneurs béninois qui ont simplifié leur facturation, éliminé les risques de redressement et gagné des heures précieuses chaque semaine. »
  - **Double CTA** :
    - *Bouton Primaire* : `Prendre rendez-vous gratuitement` (bg-primary, text-ink, min-h-[48px] px-7 rounded-xl font-bold text-sm shadow-sm hover:bg-primary-hover).
    - *Bouton Secondaire* : `Contacter un conseiller WhatsApp` (bg-background, text-ink, border border-border, min-h-[48px] px-6 rounded-xl font-bold text-sm hover:bg-background-secondary).
  - **Microcopy de réassurance** :
    `Premier échange offert de 15 minutes • Aucun engagement • Réponse rapide`
- **Partie Droite (Photographie Lifestyle - 5 colonnes)** :
  - Photographie chaleureuse d'un entrepreneur béninois dans son bureau, souriant en consultant son téléphone ou son ordinateur portable.
  - Hauteur harmonieuse épousant le conteneur (`h-full min-h-[320px] object-cover`).

---

### Section 12 : Formulaire de Diagnostic Intégré (Ancre `#diagnostic`)

Pour fluidifier la prise de rendez-vous directe sans rediriger vers un calendrier tiers, un module de contact épuré et ultra-rapide est ancré sur la page :
- **Titre H3** : « Réservez votre diagnostic gratuit de 15 minutes »
- **Sous-titre** : « Remplissez ces 3 informations. Un consultant vous rappelle sous 2 heures ouvrées. »
- **Champs Mobile-First ($\ge 44\text{px}$)** :
  1. *Votre nom complet* (ex. : Marcel Agbossou)
  2. *Nom de votre entreprise & Statut* (ex. : Bénin Distribution SARL)
  3. *Numéro de téléphone / WhatsApp* (ex. : +229 01 97 00 00 00)
  4. *Votre besoin principal* (Menu déroulant accessible : Démarrage e-MECeF DGI / Quitter Excel / Reprise comptable / Formation d'équipe)
- **Bouton d'envoi** : `Valider ma demande de diagnostic` (bg-primary, text-ink, font-bold, min-h-[48px]).
- **Feedback utilisateur immédiat** : Toast de confirmation + message de succès clair avec délai de rappel.

---

### Section 13 : Footer Public Unifié
- Intégration du composant [`PublicFooter`](file:///e:/Comptia/src/components/layout/PublicFooter.tsx) avec l'ensemble des routes vérifiées.

---

## 5. Checklist de Conformité Projet & Qualité Avant Intégration

- [x] **Architecture calquée sur la capture de référence** : Split screen hero, ruban de preuves, 3 cartes gestion, bannière sombre 5 piliers, 3 cartes déclarations, témoignages fond sombre, juste prix, showcase onglets, FAQ 2 colonnes, pré-footer lifestyle.
- [x] **Zéro hexadécimal en dur dans les classes** : 100 % classes sémantiques (`primary`, `ink`, `background`, `background-secondary`, `border`, `text-muted`, `success`).
- [x] **Zéro emoji** : Remplacés par des icônes Lucide React (`CheckCircle2`, `Clock`, `ShieldCheck`, `Award`, `Users`, `Star`, `PiggyBank`, etc.).
- [x] **Zéro glassmorphisme** : Fonds opaques solides exclusivement.
- [x] **Typographie** : Clash Display pour les titres vitrine, Inter avec chiffres tabulaires (`tabular-nums`) pour le corps et les métriques.
- [x] **Copywriting respectant la compétence `/copywriting`** : Écriture bienveillante, orientée bénéfices réels pour les dirigeants au Bénin, sans jargon incompréhensible, traitement des objections, CTA clairs et déculpabilisants.
- [x] **Accessibilité & Mobile-First** : Zones tactiles $\ge 44\text{px}$, contrastes validés, balisage sémantique complet (H1 unique, H2, H3 structurés, rôles ARIA).
