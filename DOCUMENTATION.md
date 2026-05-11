# 📘 Brightbook Studio - Documentation Complète

## 1. Présentation de l'Application et Rôle
**Brightbook Studio** (également appelé *Comptia* en interne) est une plateforme SaaS (Software as a Service) premium dédiée à la gestion financière, comptable et administrative des petites et moyennes entreprises (PME), startups et indépendants.

Son rôle principal est de **centraliser et simplifier la gestion financière** en offrant une interface moderne, ultra-réactive et intuitive. Contrairement aux logiciels comptables traditionnels souvent austères, Brightbook Studio met l'accent sur l'expérience utilisateur (UX) pour transformer des tâches complexes (saisie comptable, facturation, suivi de trésorerie) en processus fluides et visuellement agréables.

## 2. Architecture Technique et Stack
L'application est construite sur une architecture moderne de type "Full-stack Serverless" en utilisant l'écosystème React :

*   **Framework Principal** : [Next.js](https://nextjs.org/) (App Router) - Gère à la fois le frontend (React) et les routes d'API backend.
*   **Styling & UI** : [Tailwind CSS](https://tailwindcss.com/) pour la conception mobile-first et [Radix UI](https://www.radix-ui.com/) pour des composants accessibles de haute qualité (Modales, Popovers, Dropdowns).
*   **Gestion d'État & Requêtes** : [TanStack Query](https://tanstack.com/query) (React Query) pour la gestion du cache et la synchronisation en temps réel des données entre le client et le serveur.
*   **Base de Données & ORM** : [Prisma](https://www.prisma.io/) connecté à une base de données PostgreSQL (hébergée sur [Neon](https://neon.tech/)).
*   **Validation des Données** : [Zod](https://zod.dev/) couplé à [React Hook Form](https://react-hook-form.com/) pour des formulaires robustes et typés (ex: création de factures, saisie d'écritures).
*   **Graphiques** : [Recharts](https://recharts.org/) pour la visualisation dynamique des données financières.

## 3. Fonctionnalités Principales et Utilité

L'application est divisée en plusieurs modules clés. Chaque module a été pensé pour résoudre un problème spécifique de la gestion d'entreprise, en alliant puissance technique et simplicité d'utilisation.

### 📊 A. Le Tableau de Bord (Dashboard) : Le Centre de Pilotage Stratégique
Le tableau de bord est la première interface que l'utilisateur voit. Il agrège les données comptables complexes en indicateurs simples.
*   **Fonctionnalité** : Affichage des Indicateurs Clés de Performance (KPIs) en temps réel (Chiffre d'Affaires, Charges, Résultat Net, Trésorerie, TVA due).
*   **Utilité (Le "Pourquoi")** : Permet au dirigeant d'avoir une vision claire et instantanée de la santé financière de son entreprise sans devoir attendre le bilan de fin d'année.
*   **Fonctionnalité** : Filtre temporel dynamique via un calendrier interactif.
*   **Utilité** : Permet d'analyser les performances sur un mois précis. Le système calcule automatiquement la croissance (+/- %) par rapport au mois précédent, ce qui aide à identifier les tendances (saisonnalité, baisse de régime).
*   **Fonctionnalité** : Graphiques de répartition (ex: analytique des dépenses).
*   **Utilité** : Met en évidence instantanément les plus gros postes de dépenses (ex: sous-traitance, logiciels) pour aider à la réduction des coûts.

### 🧾 B. Facturation (Invoices) : Accélération du Cycle de Vente
Un module dédié à l'émission de documents commerciaux (Devis, Factures, Avoirs).
*   **Fonctionnalité** : Générateur de documents interactif avec calcul automatique (HT, TVA, TTC).
*   **Utilité** : Supprime les erreurs de calcul manuel souvent faites sur Excel. Le vendeur peut créer une facture professionnelle en quelques secondes.
*   **Fonctionnalité** : Génération de documents au format PDF (via React-PDF).
*   **Utilité** : Offre un rendu professionnel et standardisé (contenant l'IFU, le logo, les mentions légales) prêt à être envoyé au client, améliorant l'image de marque de l'entreprise.
*   **Fonctionnalité** : Suivi des statuts (Brouillon, Envoyé, Payé, En retard).
*   **Utilité** : Aide cruciale pour la gestion de trésorerie. L'utilisateur sait exactement qui lui doit de l'argent et quelles factures relancer, réduisant ainsi les impayés.

### 📓 C. Comptabilité : Sécurité et Conformité
Le cœur technique qui enregistre tous les flux financiers.
*   **Fonctionnalité** : Saisie d'opérations (Journal Entries) via une modale avancée en partie double (Débit/Crédit).
*   **Utilité** : C'est le socle de la comptabilité. La modale empêche techniquement l'enregistrement d'une écriture déséquilibrée (où Débit ≠ Crédit). Cela garantit l'intégrité de la base de données et évite des heures de recherche d'erreurs en fin d'année.
*   **Fonctionnalité** : Ventilation par journaux (Achats, Ventes, Banque).
*   **Utilité** : Permet de classer logiquement les flux, facilitant le travail de l'expert-comptable lors de la révision des comptes.

### 🔔 D. Centre de Notifications Intégré : Proactivité
Situé dans l'en-tête (header), ce centre alerte l'utilisateur en temps réel.
*   **Fonctionnalité** : Système d'alertes push (notifications de système ou d'actions).
*   **Utilité** : L'utilisateur n'a pas besoin de chercher l'information, elle vient à lui. Utile pour être alerté d'un paiement reçu, d'une échéance dépassée ou d'une tâche à accomplir.

### 🔍 E. Recherche Globale (Command Palette - `⌘K`) : Productivité Maximale
Inspirée des outils pour développeurs, cette barre de recherche est un véritable "couteau suisse".
*   **Fonctionnalité** : Barre de commande accessible via le raccourci `Ctrl+K` ou `Cmd+K`, permettant la navigation et le déclenchement d'actions (ex: "Nouvelle facture").
*   **Utilité** : Gain de temps drastique pour les "Power Users" (utilisateurs avancés). Au lieu de faire 3 ou 4 clics avec la souris pour trouver un menu ou créer un document, l'utilisateur tape quelques lettres sur son clavier et l'action s'exécute instantanément. C'est l'atout numéro un pour la fluidité d'utilisation.

## 4. Modèle de Données (Base de données)
Le schéma de la base de données est conçu pour supporter le multi-tenant (multi-entreprises), ce qui permet à une agence de gérer plusieurs entreprises sur la même instance.
*   **Company** : L'entité principale (l'entreprise cliente).
*   **User** : Les utilisateurs avec gestion des rôles (Admin, Comptable, etc.).
*   **JournalEntry & JournalLine** : Stocke toutes les opérations comptables (le grand livre).
*   **Invoice** : Stocke les documents commerciaux liés aux clients.
*   **Notification** : Stocke l'historique des alertes pour chaque utilisateur/entreprise.

## 5. Principes de Design et Expérience Utilisateur (UX)
*   **Mobile-First** : L'interface entière (du tableau de bord à la modale de facturation) est conçue pour être utilisable sur smartphone, tablette, et ordinateur de bureau.
*   **Esthétique Premium** : Utilisation de polices lisibles, de dégradés subtils, d'effets de flou (backdrop-blur) et de couleurs sémantiques (Vert pour succès, Rouge pour erreur, Ambre pour avertissement) pour guider l'œil.
*   **Tolérance aux erreurs** : Les formulaires bloquent les soumissions invalides (ex: une écriture déséquilibrée) et fournissent un feedback visuel immédiat (toast de notifications).

---
*Document généré automatiquement pour documenter l'architecture et les capacités fonctionnelles du projet Brightbook Studio.*
