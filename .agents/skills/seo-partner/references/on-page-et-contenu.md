# Optimisation On-Page, Structure Editoriale et E-E-A-T

Ce document detaille les regles d'optimisation editoriale, technique et semantique pour chaque page afin de maximiser le taux de clic (CTR), l'engagement des lecteurs, la comprehension par les moteurs de recherche et l'extraction par les IA.

Pour toute redaction de texte destine aux humains (titres accrocheurs, arguments commerciaux, appels a l'action), appliquer conjointement le skill `copywriting`.

---

## 1. Balises Fondamentales : Title et Meta Description

### La balise Title
- **Longueur recommandee** : 50 a 60 caracteres (maximum 580 pixels dans les SERP). Au-dela, Google tronque le texte.
- **Structure type** : `Mot-Cle Principal : Benefice Cle | Nom de Marque`
- **Regles d'or** :
  - Placer le mot-cle principal le plus pres possible du debut.
  - Chaque page du site possede un title strictement unique.
  - Ne jamais accumuler des mots-cles sans phrase logique (eviter « Compta, Facture, Logiciel, Benin »).
  - Inclure un declencheur de clic legitime : annee en cours, cible precise (« pour PME »), conformite legale (« DGI / SYSCOHADA »).

### La balise Meta Description
- **Longueur recommandee** : 150 a 160 caracteres (environ 960 pixels sur ordinateur, 680 sur mobile).
- **Structure type** : `Probleme resolu + benefice concret et chiffre + appel a l'action explicite.`
- **Regles d'or** :
  - La meta description n'est pas un facteur direct de positionnement, mais elle conditionne directement le taux de clic (CTR).
  - Contenir le mot-cle principal et un mot-cle secondaire : Google les met en gras lorsqu'ils correspondent a la requete de l'internaute.
  - Terminer par une invitation a agir (« Decouvrez notre simulateur gratuit », « Demandez votre essai gratuit »).

---

## 2. Hierarchie des Titres (Hn) et Structure de Contenu

1. **Un seul titre H1 par page** :
   - Reflete exactement la promesse de la page et contient le mot-cle principal.
   - Distinct du title pour elargir le champ semantique sans perturber l'affichage SERP.
2. **Titres H2 pour les sections logiques** :
   - Requetes secondaires, etapes d'un processus ou fonctionnalites specifiques.
   - Permet la scannabilite visuelle et aide les moteurs a identifier les passages cles.
3. **Titres H3 pour les sous-points** :
   - Ne jamais sauter de niveau (ne pas passer d'un H2 a un H4).
4. **Introduction et Pyramide Inversee (Extractibilite IA)** :
   - Repondre a la question principale des les 100 premiers mots.
   - Definir clairement les termes metier des l'entete (les modules AI Overviews et LLM recherchent des reponses directes et autonomes).
   - Utiliser des listes a puces (`<ul>`, `<ol>`) et des tableaux (`<table>`) pour les syntheses comparatives ou baremes fiscaux.

---

## 3. Signaux d'Experience, d'Expertise, d'Autorite et de Fiabilite (E-E-A-T)

Dans les secteurs YMYL (Your Money Your Life), incluant la comptabilite, la fiscalite et la gestion juridique, les exigences de qualite de Google sont maximales.

Signaux a integrer sur chaque page a portee financiere ou legale :
- **Identification claire de l'auteur ou de l'entite** : nom de l'expert, diplome ou fonction (ex : « Redige par un juriste fiscaliste agree » ou « Valide par notre equipe d'experts comptables SYSCOHADA »).
- **Date de derniere mise a jour visible** : essentielle pour les echeances fiscales et baremes d'impots qui evoluent chaque annee.
- **Citations de sources officielles** : liens vers les textes de lois, codes generaux des impots, decrets ministeriels ou circulaires DGI.
- **Preuves tangibles d'utilisation** : captures d'ecran reelles de l'application, chiffres concrets, etudes de cas d'entreprises locales.
- **Transparence de l'entreprise** : lien vers les mentions legales, politique de confidentialite (conforme APDP au Benin), adresse physique et coordonnees de contact completes.

---

## 4. Optimisation des Images

- **Nom de fichier parlant** : mots separes par des tirets en minuscules, decrivant le contenu (ex : `facture-normalisee-emecef-dgi-benin.webp` et non `IMG_20261026_0945.png`).
- **Attribut Alt descriptif** : decrit ce que montre l'image pour l'accessibilite et le SEO (ex : `alt="Interface de generation d'une facture normalisee e-MECeF sur Ceilow"`). Ne jamais pratiquer de bourrage de mots-cles dans le alt.
- **Dimensions explicites** : renseigner `width` et `height` pour eviter tout decalage visuel de mise en page (CLS).
- **Formats modernes et compression** : WebP ou AVIF, poids cible inferieur a 150 Ko pour les images de contenu standard.
- **Priorite de chargement** : une seule image prioritaire par page (l'image au-dessus de la ligne de flottaison LCP).

---

## 5. Maillage Interne et Cocon Semantique

- **Densite recommandee** : 2 a 5 liens internes pertinents pour 1 000 mots de contenu.
- **Qualite des ancres** : les ancres de lien doivent etre contextuelles et descriptives. Bannir « cliquez ici », « en savoir plus », « cet article ». Utiliser « decouvrir notre module de declaration TVA » ou « consulter le bareme de l'AIB au Benin ».
- **Sens de circulation de l'autorite** :
  - Les articles de blog d'information lient vers les pages solutions et tarifs (entonnoir vers la conversion).
  - Les pages solutions se lient entre elles selon la complementarite metier (ex : Facturation DGI vers Rapprochement Bancaire Momo).
  - La page d'accueil transmet l'autorite vers les 4 ou 5 pages piliers strategiques.

---

## 6. Gabarit de Brief de Contenu SEO

Tout nouveau contenu commande a un redacteur ou genere pour le site doit suivre ce gabarit :

```markdown
# Brief de Contenu SEO : [Titre du sujet]

## 1. Informations Generales
- URL cible : `/ressources/guide-declaration-tva-benin`
- Mot-cle principal : declaration tva benin
- Mots-cles secondaires : calcul tva dgi, teledeclaration e-services benin, taux tva 18 pourcent
- Intention de recherche : Informationnelle (professionnel cherchant la procedure de declaration)
- Cible : Dirigeant de TPE/PME, comptable d'entreprise
- Longueur cible : 1 200 a 1 800 mots

## 2. Donnees SERP et Metadonnees
- Title propose (<= 60 car.) : Declaration TVA au Benin : Guide et Echeances 2026 | Ceilow
- Meta description proposee (<= 160 car.) : Tout comprendre sur la declaration de TVA a la DGI au Benin : echeances mensuelles, calcul du credit d'impot et teledeclaration simplifiee.
- H1 propose : Comment Declarer et Payer sa TVA au Benin en 2026 : Guide Pratique

## 3. Plan Detaille du Contenu (Hierarchie H2 / H3)
- H2 : Qui est assujetti a la TVA au Benin ?
  - H3 : Le seuil de chiffre d'affaires et le regime reel
  - H3 : Les exonerations legales prevues par le CGI
- H2 : Quel est le calendrier de declaration de la TVA ? (Echeance du 10 de chaque mois)
- H2 : Comment calculer le montant de la TVA due ou du credit de TVA ?
  - Inserer un tableau comparatif TVA collectee vs deductible
- H2 : La procedure de teledeclaration sur le portail e-Services de la DGI
- H2 : Comment eviter les erreurs et penalites grace a un logiciel certifie ?
  - Inserer un appel a l'action vers `/solutions/facturation-dgi`

## 4. Consignes d'Integration et E-E-A-T
- Citer l'article precis du Code General des Impots du Benin.
- Inserer 3 liens internes :
  - Ancre « calendrier fiscal complet » vers `/ressources/calendrier-fiscal-benin`
  - Ancre « emission de factures normalisees » vers `/solutions/facturation-dgi`
  - Ancre « plan comptable SYSCOHADA » vers `/solutions/comptabilite-syscohada`
- Appel a l'action final : tester gratuitement la conformite fiscale Ceilow.
```
