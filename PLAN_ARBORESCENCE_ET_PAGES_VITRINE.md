# Plan Stratégique d'Arborescence & Décompte des Pages Vitrine — Ceilow

Ce document détaille l'audit complet de l'arborescence publique de Ceilow, le raisonnement stratégique d'expérience utilisateur (UX Writing & Conversion Copywriting), l'inventaire précis des éléments existants à conserver, ainsi que le décompte exhaustif et la spécification des pages à créer.

---

## 1. Raisonnement Stratégique & Diagnostic de l'Existant

### 1.1 Le constat du problème actuel
En inspectant le code source de la barre de navigation ([`PublicHeader.tsx`](file:///e:/Comptia/src/components/layout/PublicHeader.tsx)), du pied de page ([`PublicFooter.tsx`](file:///e:/Comptia/src/components/layout/PublicFooter.tsx)), de la page d'accueil ([`LandingView.tsx`](file:///e:/Comptia/src/views/LandingView.tsx)) et de la page des fonctionnalités ([`fonctionnalites/page.tsx`](file:///e:/Comptia/src/app/fonctionnalites/page.tsx)), une rupture d'expérience critique apparaît :

1. **Rupture entre vitrine publique et application interne** :
   - Dans le footer public, les liens « Facturation DGI » et « Comptabilité & TVA » pointent directement vers `/facturation` et `/comptabilite`.
   - Dans la page `/fonctionnalites`, les 6 modules (Facturation, Trésorerie, Paie, Dépenses, Fiscalité, Clôture) pointent vers `/facturation`, `/comptabilite`, `/paie`, `/documents`, `/tva`.
   - Dans la page d'accueil, le bouton du Bénéfice 3 (« Voir tout ce que Ceilow automatise pour vous ») pointe vers `/comptabilite`.
   - **Conséquence** : Ces routes sont des écrans applicatifs connectés encapsulés dans le composant `AppShell`. Pour un prospect qui découvre le site sans être connecté, ce clic mène à une interface logicielle vide, dénuée d'argumentaire de vente, d'explication des bénéfices et de rassurance sur la conformité béninoise.

2. **Déficit d'évangélisation sur les arguments clés au Bénin** :
   - La facture normalisée e-MECeF de la DGI, la réconciliation automatisée avec MTN Mobile Money et Moov Money, et les bulletins conformes CNSS sont les trois moteurs d'achat principaux au Bénin.
   - Les résumer en simples cartes d'un paragraphe sur une page globale ne suffit pas à lever les objections des directeurs financiers, experts-comptables et chefs d'entreprise.

3. **Absence de pages de rassurance institutionnelle** :
   - Le footer affiche un email et des téléphones, mais il manque une véritable page « Contact » avec formulaire direct, plan d'accès et horaires d'ouverture à Cotonou.
   - La sécurité des données financières et la conformité avec l'APDP (Autorité de Protection des Données Personnelles du Bénin) sont mentionnées en pied de page mais renvoient pour l'heure vers la seule politique de confidentialité générale.

---

## 2. Décompte Global : Ce qui Existe vs Ce qui Est à Créer

### Résumé chiffré :
- **Pages existantes conservées et validées** : 10 pages
- **Nouvelles pages à créer** : **11 pages**
  - Dont **6 pages Solutions Métiers** (Priorité 1 — Remplacement immédiat des liens dashboard internes)
  - Dont **2 pages Segments Clients & Partenaires** (Priorité 2 — Conversion des cibles clés)
  - Dont **3 pages Confiance, Contact & Ressources Fiscales** (Priorité 3 — Rassurance locale et acquisition SEO)

---

## 3. Inventaire des Éléments Existants à Conserver

Les pages et composants suivants sont déjà construits, hautement qualitatifs, conformes aux tokens Ceilow et doivent être rigoureusement préservés :

| Page / Composant | Rôle & Contenu Préservé | Action de Maintenance Requise |
|---|---|---|
| **Page d'Accueil (`/`)** | Hero sombre, bandeau de réassurance clients locaux, les 3 grands bénéfices, démo interactive cockpit tablette, 4 KPI d'impact, 3 témoignages vérifiés, résumé des tarifs, bannière finale. | Conserver l'intégralité du design et des composants. Corriger uniquement le lien du Bénéfice 3 vers la nouvelle page `/solutions/comptabilite-syscohada`. |
| **Page Tarifs (`/tarifs`)** | Hero avec sélecteur FCFA, toggle mensuel/annuel, 3 formules (Gratuit, Pro, Entreprise), bandeau 4 réassurances, simulateur de rentabilité dynamique, tableau comparatif exhaustif, bannière conseillère Cotonou, FAQ accordéon. | Conserver. Ajuster le CTA du Plan Entreprise vers `/pour-qui/cabinets-comptables`. |
| **Page Fonctionnalités (`/fonctionnalites`)** | Hero split-screen, maquette smartphone avec scanner e-MECeF animé, ruban 4 piliers, showcase fiches de paie avec accordéon 3 étapes, bannière sombre 5 piliers, radar des flux MoMo, 3 témoignages dirigeants, grille des 6 piliers fonctionnels. | Conserver. Mettre à jour les 6 liens « Explorer » des piliers vers les 6 nouvelles pages vitrines `/solutions/...`. |
| **Page Accompagnement (`/accompagnement`)** | Hero split-screen, ruban de réassurance Cotonou, 3 cartes bénéfices avec tirelire SVG interactive, bannière 5 piliers sombres, section échéances fiscales, avis réels, formulaire de contact et FAQ. | Conserver intégralement. |
| **Page Démonstration (`/demo`)** | Formulaire complet de demande de démo, listes déroulantes personnalisées animées conformes (Secteur d'activité et Taille d'équipe), validation stricte et état de confirmation. | Conserver intégralement. |
| **Pages Légales (`/cgu`, `/confidentialite`, `/mentions-legales`)** | En-têtes sombres unifiés, système d'onglets de navigation légale, sommaires interactifs avec défilement fluide, conformité RCCM Cotonou et APDP Bénin. | Conserver intégralement. |
| **Pages d'Authentification (`/login`, `/register`)** | Tunnels de connexion et d'inscription sécurisés. | Conserver intégralement. |

---

## 4. Spécification Exhaustive des 11 Nouvelles Pages à Créer

### Groupe 1 : Les 6 Pages Solutions Métiers (Priorité 1)

Ces 6 pages remplacent les liens erronés qui pointent aujourd'hui vers l'application interne. Chaque page adopte le framework conversion adapté (PAS ou AIDA), présente des bénéfices concrets avant la technique, et respecte la règle des boutons 1 à 3 mots action-first.

---

#### Page 1 : `/solutions/facturation-dgi`
- **Titre H1** : La facturation normalisée DGI certifiée en 3 secondes chrono
- **Typologie** : Page de persuasion et de sécurité réglementaire (Framework PAS : Problème $\rightarrow$ Agitation $\rightarrow$ Solution).
- **Objectif** : Éliminer la peur des amendes fiscales et prouver la rapidité de certification e-MECeF.
- **État d'esprit du visiteur** : Anxieux face aux contrôles fiscaux, exaspéré par la lenteur des machines traditionnelles ou des logiciels non conformes.
- **Sections détaillées** :
  1. *Hero Section* : Accroche bénéfice direct, émission instantanée sur mobile ou ordinateur, mention de conformité loi de finances. CTA principal : « Créer une facture » (`/register`) | CTA secondaire : « Voir la démo » (`/demo`).
  2. *Anatomie interactive d'une facture légale* : Schéma d'une facture normalisée décortiquant les mentions obligatoires DGI (IFU client vérifié, taux TVA 18 %, signature électronique cryptographique, QR code officiel lisible par les contrôleurs).
  3. *Cycle de vente complet* : Devis normalisés, bons de commande, factures d'acompte, factures d'avoir pour annulation ou rectification légale.
  4. *Annuaire IFU en temps réel* : Recherche instantanée de la raison sociale dès la saisie du numéro IFU.
  5. *Rassurance Sanctions* : Rappel factuel des pénalités du Code Général des Impôts évitées grâce à Ceilow.
  6. *Bannière de conversion* : « Facturez sans risque d'amende dès aujourd'hui » avec bouton « Démarrer gratuitement ».

---

#### Page 2 : `/solutions/comptabilite-syscohada`
- **Titre H1** : Une comptabilité SYSCOHADA Révisé irréprochable, sans saisie manuelle
- **Typologie** : Page d'autorité et de conformité technique (Framework AIDA).
- **Objectif** : Démontrer que chaque acte de vente et d'achat alimente automatiquement les journaux comptables d'engagement.
- **État d'esprit du visiteur** : En quête de rigueur pour son banquier ou son expert-comptable, sans avoir le temps de saisir des écritures en débit/crédit.
- **Sections détaillées** :
  1. *Hero Section* : Fin de la corvée de saisie comptable en fin d'année, synchronisation continue des opérations. CTA : « Découvrir le module » | « Demander une démo ».
  2. *Les 4 journaux auxiliaires automatisés* :
     - Journal des Ventes (généré à l'émission de la facture normalisée).
     - Journal des Achats (alimenté par la saisie ou le scan des dépenses).
     - Journal de Banque (alimenté par les relevés et le rapprochement).
     - Journal de Caisse & MoMo (traçabilité des espèces et règlements directs).
  3. *États financiers en temps réel* : Balance générale à 6 colonnes, Grand livre général et auxiliaire, Compte de résultat intermédiaire.
  4. *Espace collaboratif pour l'expert-comptable* : Accès invité gratuit dédié, exports standards (Excel, CSV, FEC) compatibles avec les logiciels confrères (Sage, SARI, Cegid).
  5. *Préparation de la liasse DSF* : Faciliter la clôture annuelle au 30 avril sans nuits blanches.

---

#### Page 3 : `/solutions/tresorerie-momo`
- **Titre H1** : Rapprochez vos encaissements Mobile Money et bancaires en un clic
- **Typologie** : Page de bénéfice opérationnel immédiat (Framework PAS).
- **Objectif** : Résoudre le casse-tête du lettrage entre les SMS de paiement MoMo et les factures émises.
- **État d'esprit du visiteur** : Débordé par la dispersion de ses fonds entre MTN MoMo, Moov Money et ses comptes bancaires.
- **Sections détaillées** :
  1. *Hero Section* : Visibilité totale sur le solde disponible en FCFA en consolidant banques et Mobile Money. CTA : « Tester la trésorerie » | « Voir le fonctionnement ».
  2. *Le Matching Magnétique* : Explication pas-à-pas de l'algorithme qui repère la transaction mobile, identifie la facture correspondante et la marque comme payée.
  3. *Banques et opérateurs connectés* : Prise en charge de MTN Mobile Money, Moov Money, Celtiis, BOA Bénin, Ecobank, BIIC, NSIA, UBA.
  4. *Gestion proactive des retards de paiement* : Tableau de bord des créances clients en souffrance avec envoi de relances SMS et email en un clic.
  5. *Prévisionnel de trésorerie à 30 jours* : Anticiper les sorties de fonds pour la TVA du 10 du mois et la paie de fin de mois.

---

#### Page 4 : `/solutions/paie-cnss`
- **Titre H1** : Des bulletins de paie conformes au Code du Travail béninois en 2 minutes
- **Typologie** : Page fonctionnelle et sociale.
- **Objectif** : Permettre à une PME d'éditer ses bulletins sans juriste ni logiciel complexe.
- **État d'esprit du visiteur** : Craintif face aux erreurs de calcul des cotisations sociales et aux litiges prud'homaux.
- **Sections détaillées** :
  1. *Hero Section* : Édition rapide des fiches de paie, calcul exact de l'IPTS, de la CNSS et de la VPS. CTA : « Éditer un bulletin » | « Découvrir les barèmes ».
  2. *Déchiffrage du bulletin béninois* : Rémunération brute, barème progressif de l'IPTS (impôt sur le revenu des salariés), cotisation CNSS part salariale (3,6 %), cotisations patronales et VPS (4 %).
  3. *Télédéclaration CNSS prête au dépôt* : Export de l'état nominatif des salaires pour la déclaration trimestrielle sans ressaisie.
  4. *Transmission et archivage sécurisé* : Téléchargement individuel du bulletin PDF, remise aux salariés et stockage légal garanti.
  5. *Frais professionnels et primes* : Gestion des indemnités de transport et gratifications selon la convention collective applicable.

---

#### Page 5 : `/solutions/gestion-depenses`
- **Titre H1** : Numérisez vos reçus et récupérez toute votre TVA déductible
- **Typologie** : Page de gain financier direct (Framework AIDA).
- **Objectif** : Éviter que les entreprises ne perdent de l'argent en omettant de justifier leurs charges d'exploitation.
- **État d'esprit du visiteur** : Coupable d'entasser des tickets de caisse illisibles dans des tiroirs et de payer trop d'impôts par manque de justificatifs.
- **Sections détaillées** :
  1. *Hero Section* : Capture mobile instantanée de chaque facture fournisseur, extraction des montants et archivage probatoire. CTA : « Numériser un reçu » | « Voir la démo ».
  2. *Technologie de capture assistée* : Lecture automatique des mentions clés (fournisseur, date, montant TTC, montant TVA déductible).
  3. *Rattachement immédiat aux comptes bancaires* : L'achat est immédiatement associé au mouvement bancaire ou Mobile Money correspondant.
  4. *Dossier de justificatifs pour contrôle fiscal* : Retrouver n'importe quelle facture d'achat en 5 secondes grâce à la recherche par mot-clé ou date.
  5. *Suivi budgétaire par catégorie de charges* : Analyse des postes de dépenses (loyers, carburant, télécoms, prestations externes).

---

#### Page 6 : `/solutions/declarations-fiscales`
- **Titre H1** : Anticipez votre déclaration de TVA avant le 10 de chaque mois
- **Typologie** : Page de sérénité et d'organisation fiscale.
- **Objectif** : Éliminer la panique de la date limite fiscale mensuelle en automatisant le calcul de la TVA nette due.
- **État d'esprit du visiteur** : Angoissé à chaque début de mois à l'idée d'être en retard ou de calculer une fausse TVA.
- **Sections détaillées** :
  1. *Hero Section* : Le montant de TVA collectée et déductible calculé au fil de l'eau, tableau de synthèse prêt pour la DGI. CTA : « Sécuriser ma TVA » | « Prendre rendez-vous ».
  2. *Le calcul de TVA sans erreur* : Confrontation automatique entre la TVA facturée sur vos ventes certifiées et la TVA acquittée sur vos achats justifiés.
  3. *Acomptes sur impôt et retenues à la source* : Prise en compte de l'AIB (Acompte sur Impôt Assis sur les Bénéfices) selon les taux légaux (1 %, 3 %, 5 %).
  4. *Alertes programmées de calendrier* : Notifications de rappel avant l'échéance du 10 pour télétransmettre et payer en temps utile.
  5. *Journal d'audit horodaté* : Chaque écriture de déclaration est verrouillée avec sa piste d'audit conforme aux exigences de l'inspection fiscale.

---

### Groupe 2 : Les 2 Pages Cibles & Partenaires (Priorité 2)

Ces pages segmentent l'offre pour adresser deux catégories d'interlocuteurs aux attentes radicalement différentes.

---

#### Page 7 : `/pour-qui/cabinets-comptables`
- **Titre H1** : Le portail collaboratif conçu pour les experts-comptables de l'OECCA Bénin
- **Typologie** : Page de partenariat B2B institutionnel.
- **Objectif** : Démontrer que Ceilow n'est pas un concurrent du cabinet mais son meilleur outil de collecte et de productivité.
- **Sections détaillées** :
  1. *Hero Section* : Libérez vos collaborateurs de la saisie manuelle et des relances de pièces justificatives. CTA : « Créer un compte cabinet » | « Demander une présentation confrère ».
  2. *Portail Multi-Dossiers* : Tableau de bord unique permettant de superviser l'ensemble des clients du cabinet avec indicateurs d'avancement des clôtures.
  3. *Flux de travail collaboratif* : Le client émet ses factures e-MECeF et dépose ses reçus ; le collaborateur du cabinet valide les imputations SYSCOHADA et exporte vers son logiciel de production.
  4. *Conditions préférentielles dégressives* : Tarification groupée par paliers de dossiers pour les membres de l'OECCA.
  5. *Accompagnement et formation du cabinet* : Déploiement personnalisé et formation sur site à Cotonou ou Porto-Novo par nos équipes.

---

#### Page 8 : `/pour-qui/pme-et-independants`
- **Titre H1** : Pilotez toute votre gestion d'entreprise sans être comptable
- **Typologie** : Page de vulgarisation et de conversion dirigeant.
- **Objectif** : Rassurer le créateur d'entreprise ou le commerçant qui craint la complexité administrative.
- **Sections détaillées** :
  1. *Hero Section* : Facturation, trésorerie, TVA et personnel regroupés dans un tableau de bord intuitif, en français clair sans jargon. CTA : « Démarrer gratuitement » | « Réserver un échange ».
  2. *Les 3 étapes du quotidien* : Facturer un client en 10 secondes $\rightarrow$ Voir l'argent arriver $\rightarrow$ Valider ses comptes en fin de mois.
  3. *Une équipe réelle disponible à Cotonou* : Présentation du support local joignable par appel direct ou WhatsApp pour débloquer toute question.
  4. *Comparatif Temps Passé* : Avant Ceilow (15 heures par mois sur des cahiers ou tableurs) vs Avec Ceilow (2 heures par mois en toute sérénité).

---

### Groupe 3 : Les 3 Pages Confiance, Contact & Ressources (Priorité 3)

Ces pages comblent les manques identifiés dans le footer et renforcent l'ancrage local béninois.

---

#### Page 9 : `/contact`
- **Titre H1** : Contactez notre équipe à Cotonou
- **Typologie** : Page d'action directe et de localisation physique.
- **Objectif** : Lever l'objection du service distant en affichant clairement nos coordonnées, nos bureaux et nos canaux de contact directs.
- **Sections détaillées** :
  1. *Hero Section* : Une équipe d'experts en gestion béninoise à votre écoute, en ligne ou dans vos locaux.
  2. *Blocs de contact immédiat* :
     - Téléphone & WhatsApp : `+229 01 97 55 49 53` et `+229 01 62 78 93 05` avec bouton d'appel direct.
     - Email support : `contact@ceilow.com` avec engagement de réponse sous 2 heures ouvrées.
     - Adresse physique : Siège d'opération à Cotonou (Ganhi / Haie Vive), République du Bénin.
  3. *Formulaire de contact simplifié* : Nom, Entreprise, Téléphone, Objet de la demande (Démonstration, Question commerciale, Support technique, Partenariat).
  4. *Horaires d'ouverture* : Du lundi au vendredi de 8h00 à 18h30, permanence samedi matin pour les déclarations fiscales urgentes.

---

#### Page 10 : `/securite-et-apdp`
- **Titre H1** : Sécurité, souveraineté et conformité de vos données financières
- **Typologie** : Page de réassurance institutionnelle et juridique.
- **Objectif** : Rassurer les dirigeants sur la confidentialité absolue de leur chiffre d'affaires et de leurs marges.
- **Sections détaillées** :
  1. *Hero Section* : Vos écritures et factures protégées selon les normes bancaires les plus strictes. CTA : « Créer un compte sécurisé ».
  2. *Conformité stricte APDP Bénin* : Respect de la loi portant Code du Numérique en République du Bénin relative à la protection des données personnelles.
  3. *Infrastructure technique et chiffrement* : Protocole TLS 1.3 pour les transmissions et algorithme AES-256 pour les données au repos, sauvegardes quotidiennes redondantes.
  4. *Propriété inaliénable de vos données* : Export intégral de vos bases (factures PDF, écritures comptables, fichiers FEC) disponible à tout moment sans blocage.

---

#### Page 11 : `/ressources/calendrier-fiscal-benin`
- **Titre H1** : Le calendrier fiscal et social des entreprises au Bénin
- **Typologie** : Page d'information et d'acquisition SEO à forte valeur ajoutée.
- **Objectif** : Attirer les dirigeants et gestionnaires recherchant les dates clés de l'administration béninoise et positionner Ceilow en référence métier.
- **Sections détaillées** :
  1. *Hero Section* : Ne manquez plus aucune date limite de l'administration fiscale et sociale béninoise. CTA : « Synchroniser avec Ceilow ».
  2. *Les échéances mensuelles incontournables* : Le 10 de chaque mois (déclaration et paiement de la TVA, de l'AIB et de l'IPTS).
  3. *Les échéances trimestrielles et semestrielles* : Déclarations de cotisations CNSS, acomptes trimestriels sur impôt sur les sociétés (IS / IBIC / TPS).
  4. *Les échéances annuelles majeures* : Dépôt des états financiers et de la liasse DSF avant le 30 avril de chaque année.
  5. *Téléchargement du calendrier récapitulatif PDF* : Fiche mémo prête à imprimer pour afficher dans les bureaux de l'entreprise.

---

## 5. Matrice des Liens à Mettre à Jour dans le Code

Une fois ces pages créées, voici le plan d'ajustement des liens dans les composants existants :

| Composant | Élément Ciblé | Destination Actuelle | Nouvelle Destination |
|---|---|---|---|
| [`PublicHeader.tsx`](file:///e:/Comptia/src/components/layout/PublicHeader.tsx) | Menu de navigation | `/tarifs`, `/fonctionnalites`, `/accompagnement` | Conserver ces 3 liens principaux (structure claire et épurée). |
| [`LandingView.tsx`](file:///e:/Comptia/src/views/LandingView.tsx) | Bouton Bénéfice 3 | `/comptabilite` | **`/solutions/comptabilite-syscohada`** |
| [`LandingView.tsx`](file:///e:/Comptia/src/views/LandingView.tsx) | CTA Plan Entreprise | `/demo` | **`/pour-qui/cabinets-comptables`** |
| [`fonctionnalites/page.tsx`](file:///e:/Comptia/src/app/fonctionnalites/page.tsx) | Carte 1 : Facturation | `/facturation` | **`/solutions/facturation-dgi`** |
| [`fonctionnalites/page.tsx`](file:///e:/Comptia/src/app/fonctionnalites/page.tsx) | Carte 2 : Trésorerie | `/comptabilite` | **`/solutions/tresorerie-momo`** |
| [`fonctionnalites/page.tsx`](file:///e:/Comptia/src/app/fonctionnalites/page.tsx) | Carte 3 : Paie & Salariés | `/paie` | **`/solutions/paie-cnss`** |
| [`fonctionnalites/page.tsx`](file:///e:/Comptia/src/app/fonctionnalites/page.tsx) | Carte 4 : Dépenses & Reçus | `/documents` | **`/solutions/gestion-depenses`** |
| [`fonctionnalites/page.tsx`](file:///e:/Comptia/src/app/fonctionnalites/page.tsx) | Carte 5 : Fiscalité | `/tva` | **`/solutions/declarations-fiscales`** |
| [`fonctionnalites/page.tsx`](file:///e:/Comptia/src/app/fonctionnalites/page.tsx) | Carte 6 : Clôture | `/comptabilite` | **`/solutions/comptabilite-syscohada`** |
| [`PublicFooter.tsx`](file:///e:/Comptia/src/components/layout/PublicFooter.tsx) | Facturation DGI | `/facturation` | **`/solutions/facturation-dgi`** |
| [`PublicFooter.tsx`](file:///e:/Comptia/src/components/layout/PublicFooter.tsx) | Comptabilité & TVA | `/comptabilite` | **`/solutions/comptabilite-syscohada`** |
| [`PublicFooter.tsx`](file:///e:/Comptia/src/components/layout/PublicFooter.tsx) | Colonne 3 (Conformité) | `/confidentialite` | Ajouter lien vers **`/securite-et-apdp`** |
| [`PublicFooter.tsx`](file:///e:/Comptia/src/components/layout/PublicFooter.tsx) | Colonne 1 & 4 (Support) | `mailto:contact@...` | Ajouter lien vers **`/contact`** |

---

## 6. Ordre d'Exécution Recommandé

Pour un déroulement fluide sans régression :
1. **Étape 1** : Créer en priorité les deux pages phares les plus demandées par les utilisateurs au Bénin :
   - `/solutions/facturation-dgi` (e-MECeF DGI)
   - `/solutions/comptabilite-syscohada` (SYSCOHADA & TVA)
2. **Étape 2** : Créer les trois modules opérationnels complémentaires :
   - `/solutions/tresorerie-momo`
   - `/solutions/paie-cnss`
   - `/solutions/gestion-depenses`
   - `/solutions/declarations-fiscales`
3. **Étape 3** : Créer la page de contact et de sécurité locale :
   - `/contact`
   - `/securite-et-apdp`
4. **Étape 4** : Créer les pages cibles et ressources :
   - `/pour-qui/cabinets-comptables`
   - `/pour-qui/pme-et-independants`
   - `/ressources/calendrier-fiscal-benin`
5. **Étape 5** : Mettre à jour les liens dans `PublicHeader.tsx`, `PublicFooter.tsx`, `LandingView.tsx` et `fonctionnalites/page.tsx`, puis valider l'intégrité avec `npx tsc --noEmit` et `pnpm build`.
