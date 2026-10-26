# Strategie de Mots-Cles et Keyword Mapping

Ce document presente la methodologie de recherche, de classification, de cartographie et de priorisation des mots-cles pour maximiser la visibilite qualifiee et le taux de conversion.

---

## 1. Les Quatre Intentions de Recherche

Chaque page d'un site doit repondre a une intention dominante unique. Associer le mauvais type de contenu a une intention entraine un taux de rebond eleve et un mauvais positionnement.

| Type d'intention | Ce que cherche l'internaute | Exemples typiques | Type de page adapte |
|---|---|---|---|
| Informationnelle | Apprendre, comprendre, trouver une explication, un texte de loi ou une date limite. | « calendrier fiscal benin 2026 », « calcul tps micro entreprise », « taux tva uemoa » | Article de blog, guide pratique, fiche pedagogique, simulateur. |
| Navigationnelle | Trouver une marque, une connexion ou un service precis deja connu. | « ceilow connexion », « login dgi benin », « emecef plateforme » | Page d'accueil, page de connexion, page portail. |
| Commerciale (investigation) | Comparer des solutions, evaluer des logiciels, lire des avis avant decision. | « meilleur logiciel comptable benin », « comparatif logiciel syscohada », « avis ceilow » | Page solution, page comparatif (« X vs Y »), etudes de cas clients. |
| Transactionnelle | Acheter, souscrire, demander une demonstration, contacter un commercial. | « logiciel comptabilite prix », « facture normalisee devis », « abonnement ceilow pme » | Page tarif, page demande de demo, formulaire de contact, page produit. |

---

## 2. La Strategie « Volume Zero » pour les Marches de Niche et Emergents

Dans de nombreux pays francophones d'Afrique de l'Ouest (Bénin, Togo, Côte d'Ivoire, Sénégal) ou pour des domaines B2B très spécialisés (SYSCOHADA, fiscalité locale, e-MECeF), les outils traditionnels (Semrush, Ahrefs, Ubersuggest) affichent souvent « Volume de recherche = 0 » ou « Pas de données ».

C'est une opportunite majeure, pas un obstacle :
1. **Les outils manquent de donnees d'echantillonnage locales**, mais les professionnels tapent reellement ces requetes.
2. **Une requete B2B a faible volume a une tres forte valeur economique** : 15 visites mensuelles sur « logiciel facturation normalisee dgi cotonou » peuvent generer 3 souscriptions annuelles de PME.
3. **Sources de decouverte fiables pour les marches emergents** :
   - Rapport Performances dans Google Search Console (donnees reelles du domaine).
   - Suggestions Google (Autocompletion) et « Autres questions posees » (People Also Ask) en navigation privee geolocalisee.
   - Textes officiels et nomenclature reglementaire (Code General des Impots du Bénin, Acte Uniforme OHADA, circulaires DGI, baremes CNSS).
   - Questions posees par les prospects lors des appels commerciaux ou tickets de support.
   - Groupes professionnels specialises (experts-comptables, directeurs financiers, chambres de commerce).

---

## 3. Modificateurs Geographiques et Metier

Pour capter le trafic a haute intention, combiner systematiquement le concept metier avec des modificateurs geographiques et reglementaires :

- **Geographie locale** : Benin, Cotonou, Porto-Novo, Abomey-Calavi, Parakou.
- **Cadre regional** : UEMOA, OHADA, Afrique de l'Ouest.
- **Cadre reglementaire et fiscal** : SYSCOHADA revise, DGI, e-MECeF, facture normalisee, TVA 18%, TPS, VPS, AIB, CNSS.
- **Cible d'entreprise** : PME, TPE, artisan, commercant, cabinet comptable, freelance, consultant.

Exemples de combinaisons a forte conversion :
- « logiciel compta syscohada pme benin »
- « generation dsf automatique uemoa »
- « facturation emecef api dgi cotonou »
- « declaration cnss teledeclaration benin »

---

## 4. Gabarit de Keyword Mapping (Une Page = Une Requete Principale)

Le mot-cle principal est unique a chaque URL. Deux pages ne doivent jamais se disputer le meme mot-cle principal sous peine de cannibalisation.

| URL de la page | Requete principale | Requetes secondaires (semantique) | Intention | Potentiel business (1 a 5) | Page actuelle ou a creer | Action requise |
|---|---|---|---|---|---|---|
| `/` | logiciel comptabilite benin | logiciel comptable pme cotonou, gestion entreprise benin | Commerciale / Nav | 5 | Existante | Optimiser le H1 et la meta description |
| `/solutions/facturation-dgi` | facturation normalisee emecef benin | machine dgi virtuelle, api emecef, facture certifiee dgi | Transactionnelle | 5 | Existante | Enrichir les cas d'usage PME et FAQ |
| `/solutions/comptabilite-syscohada` | logiciel comptable syscohada | plan comptable syscohada revise, balance et grand livre | Commerciale | 5 | Existante | Structurer les sous-titres H2 metier |
| `/solutions/tresorerie-momo` | rapprochement bancaire mtn mowali benin | suivi tresorerie mobile money, paiement momo celtiis | Commerciale | 4 | Existante | Ajouter demonstration video ou capture |
| `/ressources/calendrier-fiscal-benin` | calendrier fiscal benin 2026 | echeances dgi benin, dates tva tps declaration impots | Informationnelle | 4 | Existante | Mettre a jour chaque annee et lier vers les solutions |
| `/ressources/guide-declaration-tva` | declaration tva benin guide pratique | calcul tva collectee deductible dgi cotonou | Informationnelle | 3 | A creer | Rédiger un cluster pilier vers facturation |

---

## 5. Detection et Resolution de la Cannibalisation

La cannibalisation se produit lorsque plusieurs pages d'un meme domaine se positionnent en alternance sur la meme requete, divisant le signal d'autorite.

### Methode de detection dans Google Search Console
1. Ouvrir le rapport Performances (Recherche).
2. Filtrer sur une requete precise dans l'onglet « Requetes ».
3. Cliquer ensuite sur l'onglet « Pages ».
4. Si 2 ou 3 pages se partagent les clics et les impressions avec des positions moyennes mediocres (entre 8 et 25), il y a cannibalisation.

### Regles de resolution
- **Fusion de contenu** : regrouper le contenu sur la page la plus forte, mettre en place une redirection 301 depuis l'ancienne page vers la principale.
- **Differenciation d'intention** : modifier le title, le H1 et le vocabulaire d'une des pages pour viser une intention distincte (ex : l'une reste transactionnelle, l'autre devient un guide informationnel).
- **Canonicalisation** : si deux pages doivent subsister pour des raisons d'ergonomie mais ont un contenu quasi identique, pointer la balise canonical vers la page maitresse.
