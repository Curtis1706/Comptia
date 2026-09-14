# Feature Specification: Refonte du Dashboard Dirigeant (Cockpit Owner)

**Feature Branch**: `001-dashboard-page`

**Created**: 2026-09-14

**Status**: Draft

**Input**: User description: "Refonte du frontend complet du dashboard pour le profil Owner/Dirigeant selon SPECIFICATION_DASHBOARD_OWNER.md sans modifier les routes backend existantes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultation de la Trésorerie et des Liquidités Immédiates (Priority: P1)

En tant que dirigeant d'entreprise (Owner), je souhaite visualiser instantanément mes liquidités totales disponibles (banque, caisse, Mobile Money) ainsi que mes créances en souffrance dès mon arrivée sur l'application, afin de savoir si je peux honorer mes engagements financiers immédiats sans devoir ouvrir un logiciel comptable complexe.

**Why this priority**: La trésorerie est le nerf de la guerre d'une PME. Savoir exactement combien l'entreprise possède en banque et combien les clients lui doivent est l'information la plus critique et la plus consultée au quotidien.

**Independent Test**: Peut être testé isolément en vérifiant qu'un dirigeant connecté voit immédiatement le montant de trésorerie nette et le montant total des factures impayées avec leurs libellés et infobulles explicatives.

**Acceptance Scenarios**:

1. **Given** un dirigeant authentifié sur son espace, **When** il accède à la page d'accueil du tableau de bord, **Then** il visualise le solde de sa trésorerie nette disponible formaté en monnaie locale avec une indication claire de solde positif ou négatif.
2. **Given** des factures émises non réglées par des clients, **When** le dirigeant consulte le tableau de bord, **Then** le montant total TTC restant dû et le nombre de factures en souffrance s'affichent avec un lien direct vers le suivi des impayés.
3. **Given** un indicateur financier non trivial (Trésorerie classe 5, Créances), **When** le dirigeant survole ou clique sur l'infobulle d'aide, **Then** une explication claire et vulgarisée de la formule de calcul s'affiche sans jargon opaque.

---

### User Story 2 - Alertes Réglementaires et Échéance Fiscale DGI Bénin (Priority: P2)

En tant que dirigeant d'une entreprise assujettie au régime fiscal béninois, je souhaite être averti de manière proactive du montant de TVA nette à décaisser avant l'échéance légale du 15 du mois, afin d'anticiper mes sorties de fonds et d'éviter les pénalités de retard de la Direction Générale des Impôts (DGI).

**Why this priority**: Les pénalités fiscales et le non-respect de l'échéance mensuelle du 15 représentent un risque financier direct pour les entreprises au Bénin.

**Independent Test**: Peut être testé en simulant une période avec de la TVA nette due et en vérifiant la présence de la bannière d'alerte contextuelle et du KPI dédié.

**Acceptance Scenarios**:

1. **Given** un montant estimé de TVA nette due calculé pour la période en cours, **When** le dirigeant consulte son tableau de bord, **Then** une bannière d'alerte visible indique l'échéance du 15 avec le montant estimé et un raccourci direct vers la déclaration de TVA.
2. **Given** un mois sans TVA nette due (crédit de TVA), **When** le dirigeant consulte son tableau de bord, **Then** le montant s'affiche à zéro sans générer d'alerte anxiogène superflue.

---

### User Story 3 - Suivi de Rentabilité Économique et Structure des Coûts (Priority: P3)

En tant que dirigeant, je souhaite comparer mon chiffre d'affaires et mes charges sur les 12 derniers mois et visualiser la répartition de mes dépenses d'exploitation selon la nomenclature SYSCOHADA, afin de savoir si mon activité est structurellement rentable et d'identifier les postes de dépenses les plus lourds.

**Why this priority**: Permet au dirigeant d'ajuster sa stratégie commerciale, de maîtriser ses coûts et de préparer ses arbitrages budgétaires.

**Independent Test**: Peut être testé en consultant les sections analytiques et en vérifiant que le chiffre d'affaires, les charges et le résultat net concordent avec la répartition par poste de dépense.

**Acceptance Scenarios**:

1. **Given** des opérations de ventes et d'achats comptabilisées, **When** le dirigeant consulte la zone analytique, **Then** il observe la comparaison graphique mensuelle des produits et charges sur les 12 derniers mois sans distorsion d'échelle.
2. **Given** des écritures de charges enregistrées sur la période, **When** le dirigeant examine la structure des coûts, **Then** chaque catégorie de dépense affiche son libellé en français clair, son montant en FCFA et sa proportion en pourcentage.
3. **Given** la validation des bulletins de paie du mois, **When** le dirigeant consulte le volet des engagements sociaux, **Then** le montant total de la masse salariale nette s'affiche distinctement avec un accès rapide au module de paie.

---

### User Story 4 - Actions Rapides et Rapprochement Opérationnel (Priority: P4)

En tant que dirigeant, je souhaite accéder en un clic à l'émission d'une nouvelle facture ou à la saisie d'une écriture comptable, et filtrer les données par période comptable (mois, trimestre, année).

**Why this priority**: Réduit le temps passé dans les menus de navigation et fluidifie la gestion administrative quotidienne.

**Independent Test**: Peut être testé en actionnant les boutons d'action rapide et en changeant la période de consultation.

**Acceptance Scenarios**:

1. **Given** le tableau de bord affiché, **When** le dirigeant clique sur « Nouvelle facture », **Then** le formulaire de facturation s'ouvre sans quitter le contexte de navigation.
2. **Given** le sélecteur de période, **When** le dirigeant sélectionne un mois antérieur, **Then** l'ensemble des indicateurs se met à jour pour refléter fidèlement la situation financière de la période choisie.

---

### Edge Cases

- **Entreprise en démarrage (aucune donnée enregistrée)** : Lorsque la base ne contient aucune facture ni écriture, l'interface affiche des états vides élégants et motivants invitant à créer la première facture, sans afficher d'erreurs ou de graphiques brisés.
- **Résultat net négatif (déficit d'exploitation)** : Lorsque les charges dépassent les produits, le montant s'affiche en signalétique d'alerte nette (`error`), avec explication sans masquer la réalité comptable.
- **Pertes de connexion réseau ou indisponibilité serveur** : Un écran de repli explicite avec message d'explication et bouton de réessai permet de relancer l'interrogation sans bloquer toute la navigation.
- **Affichage sur petit écran mobile (375px)** : Tous les tableaux et blocs graphiques se réorganisent verticalement sous forme de cartes empilées ; les zones de clic mesurent au minimum 44 pixels.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système MUST présenter un indicateur de Trésorerie disponible consolidant l'ensemble des comptes de liquidités (banque, caisse, mobile money) avec mention de solde positif ou négatif.
- **FR-002**: Le système MUST afficher le volume et le montant total des factures clients impayées avec distinction visuelle si des échéances sont dépassées.
- **FR-003**: Le système MUST afficher une alerte réglementaire dédiée à la TVA béninoise lorsque de la TVA nette est due avant l'échéance du 15 du mois.
- **FR-004**: Le système MUST calculer et afficher le Résultat net de la période (Chiffre d'affaires hors taxes - Charges d'exploitation) avec indicateur de tendance par rapport au mois précédent.
- **FR-005**: Le système MUST fournir une infobulle explicative accessible sur chaque indicateur financier clarifiant sa formule de calcul et sa source réglementaire SYSCOHADA.
- **FR-006**: Le système MUST afficher la masse salariale nette du mois issue des bulletins de paie validés.
- **FR-007**: Le système MUST présenter un comparatif mensuel Chiffre d'affaires vs Charges sur un historique glissant de 12 mois.
- **FR-008**: Le système MUST décomposer la structure des dépenses d'exploitation par catégorie SYSCOHADA avec libellé en français, montant et part en pourcentage.
- **FR-009**: Le système MUST lister les 5 factures les plus récentes avec leur client, référence, montant TTC et statut traduit en français.
- **FR-010**: Le système MUST permettre le filtrage temporel de l'activité financière par période (mois en cours, mois précédent, trimestre, sélection personnalisée).
- **FR-011**: Le système MUST offrir des raccourcis d'action directe pour créer une facture et saisir une opération sans quitter la page.
- **FR-012**: Le système MUST afficher un squelette de chargement reproduisant fidèlement la disposition réelle des blocs pendant la récupération des données.
- **FR-013**: Le système MUST respecter l'interdiction stricte des données fictives ou aléatoires : toutes les courbes et indicateurs reflètent les données réelles de l'organisation.
- **FR-014**: Le système MUST n'utiliser aucun emoji dans l'interface et afficher tous les montants monétaires en chiffres tabulaires alignés.

### Key Entities *(include if feature involves data)*

- **Synthèse Financière Périodique** : Représente la photographie financière de l'entreprise sur une période donnée (Chiffre d'affaires, Charges, Résultat net, Trésorerie, TVA due, Créances clients, Masse salariale).
- **Point d'Historique Mensuel** : Objet temporel associant un mois civil aux totaux cumulés des ventes et des charges enregistrées.
- **Poste Analytique de Charge** : Regroupement de dépenses selon le plan comptable SYSCOHADA (code à 3 chiffres, intitulé métier, montant cumulé, quote-part).
- **Facture Synthétique** : Document commercial récent avec sa référence, son client destinataire, sa date d'émission, son total TTC et son état d'encaissement.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Le dirigeant accède à la vision complète de sa trésorerie et de ses créances en moins de 3 secondes après affichage de la page.
- **SC-002**: 100% des indicateurs financiers affichés disposent d'une infobulle explicative permettant à un utilisateur non-comptable de comprendre le calcul en moins de 10 secondes.
- **SC-003**: Le dirigeant peut déclencher la création d'une facture ou la saisie d'une opération en 1 clic direct depuis le tableau de bord.
- **SC-004**: 0% de données factices ou de courbes générées aléatoirement : l'intégralité des représentations visuelles provient des écritures réelles.
- **SC-005**: L'interface est 100% utilisable sur appareil mobile (largeur 375px) avec un taux de complétion des actions primaires équivalent au desktop.

---

## Assumptions

- Les utilisateurs disposent d'un compte avec le rôle Dirigeant (`owner`) ou des permissions associées permettant la lecture des modules de facturation, trésorerie et comptabilité.
- La monnaie principale d'affichage est le Franc CFA (XOF / FCFA).
- Le régime fiscal et social de référence est celui de la République du Bénin (TVA normale à 18% au 15 du mois, SYSCOHADA révisé).
- Les services d'authentification et les routes d'agrégation de données existantes fournissent les structures de données attendues sans modification d'API.
