# Audit Technique SEO : Methode, Grille d'Analyse et Livrable

Ce document detaille l'ensemble des points de controle techniques indispensables pour garantir qu'un site est parfaitement explorable, indexable, performant et conforme aux exigences des moteurs de recherche.

---

## 1. Grille d'Analyse Technique Complete

Chaque point est classe par niveau de gravite :
- **Bloquant** : empeche totalement l'exploration ou l'indexation de pages strategiques. A corriger sous 48 a 72 heures.
- **Majeur** : degrade significativement le positionnement ou le crawl budget. A traiter dans les 30 jours.
- **Mineur** : optimisation d'hygiene technique. A planifier dans le backlog courant.

| Categorie | Point de controle | Ce qu'il faut verifier | Ou verifier | Gravite |
|---|---|---|---|---|
| Exploration (Crawl) | robots.txt | Fichier accessible a /robots.txt, code HTTP 200, n'interdit pas par erreur des ressources publiques (CSS, JS, images, pages cles). Contient le lien vers le sitemap. | Inspection URL, testeur robots.txt GSC | Bloquant |
| Exploration (Crawl) | Sitemap XML | Sitemap declare, valide, sans URLs redirigees (3xx) ni erreurs (4xx, 5xx), sans URLs en noindex. Decoupage par paquets de 50 000 URLs / 50 Mo si volumineux. | Rapport Sitemaps GSC | Majeur |
| Exploration (Crawl) | Pages orphelines | Aucune page importante n'est depourvue de lien interne entrant. Chaque URL publique doit etre accessible via la navigation ou un cluster de contenu. | Screaming Frog (croisement sitemap vs crawl) | Majeur |
| Exploration (Crawl) | Codes de statut HTTP | Pages normales en 200. Redirections directes en 301 (pas de chaines de redirections 301 -> 301 ni de boucles). Erreurs 404 propres sans redirection sauvage vers la page d'accueil. | Rapport Pages GSC, Screaming Frog | Majeur |
| Exploration (Crawl) | Budget d'exploration | Temps de reponse serveur stable, pas d'explosion d'URLs inutiles generees par des filtres ou des parametres de tri infinis. | Rapport Statistiques d'exploration GSC | Mineur a Majeur |
| Indexation | Balise meta robots | Aucune balise noindex involontaire sur des pages publiques indexables. Présence stricte de noindex sur pages privees (compte, admin, recherche interne, panier). | Code source, inspection d'URL GSC | Bloquant |
| Indexation | Balise canonique (canonical) | Chaque page declare sa balise canonical auto-referente absolue, ou pointe vers l'URL d'origine en cas de contenu duplique legitime. | Rapport Pages (canonique selectionnee par Google) | Majeur |
| Indexation | Contenu duplique | Pas de duplication interne entre versions HTTP/HTTPS, avec/sans www, avec/sans slash final, ou via des parametres d'URL sans canonical. | Screaming Frog, rapport Pages GSC | Majeur |
| Indexation | Protection des pages privees | Aucune route d'authentification, de back-office ou d'API privee n'est accessible ni indexee. Le middleware ne doit jamais rediriger un robot public vers le login. | Test HTTP curl/fetch sans cookies | Bloquant |
| Rendu JavaScript | Hydratation et contenu visible | Le contenu textuel essentiel, les liens `<a>` avec attribut `href` et les images sont presents dans le code HTML initial (SSR / SSG) et ne dependent pas d'un clic utilisateur. | Outil d'inspection en direct GSC (Afficher le code HTML teste) | Bloquant |
| Performance (CWV) | LCP (Largest Contentful Paint) | Le temps de chargement du plus grand element visible est inferieur ou egal a 2,5 secondes au 75e percentile sur donnees mobiles reelles. | Rapport Core Web Vitals GSC, PageSpeed Insights | Majeur |
| Performance (CWV) | INP (Interaction to Next Paint) | Le delai de reponse de l'interface aux interactions utilisateur est inferieur ou egal a 200 ms au 75e percentile. Eviter les taches longues sur le thread principal. | Rapport Core Web Vitals GSC, Chrome DevTools Performance | Majeur |
| Performance (CWV) | CLS (Cumulative Layout Shift) | Le score de stabilite visuelle est inferieur ou egal a 0,1. Dimensions explicites (`width` et `height`) sur toutes les images, iframes et conteneurs d'encarts. | Rapport Core Web Vitals GSC, PageSpeed Insights | Majeur |
| Mobile | Responsive et viewport | Balise viewport correcte, pas de defilement horizontal, taille des zones tactiles superieure ou egale a 44x44 px, polices lisibles sans zoomer. | Lighthouse, test sur terminaux mobiles reels | Majeur |
| Securite | HTTPS et certificat | Certificat SSL/TLS valide, redirection forcee de HTTP vers HTTPS, protocole HSTS configure, absence de contenu mixte (mixed content HTTP sur page HTTPS). | Rapport HTTPS GSC, navigateur | Bloquant |
| Securite | Actions manuelles et securite | Aucun signalement de piratage, de logiciel malveillant ou de penalite manuelle infligee par l'equipe Webspam de Google. | Rapports Actions manuelles et Problemes de securite GSC | Bloquant |
| Architecture d'URL | Structure et proprete | URLs courtes, en minuscules, mots separes par des tirets, sans caracteres speciaux, sans identifiants de session ni parametres inutiles. | Analyse d'arborescence, Screaming Frog | Mineur |
| Maillage interne | Profondeur et ancres | Toute page strategique accessible en 3 clics ou moins depuis l'accueil. Ancres de liens textuelles, descriptives, sans ancres generiques (cliquez ici). | Screaming Frog (Depth report), GSC Liens | Majeur |
| Internationalisation | hreflang | Si le site cible plusieurs pays ou langues : balises hreflang reciproques et coherentes, URL de repli x-default. | Screaming Frog, inspection d'URL GSC | Majeur |

---

## 2. Boite a Outils Recommandee

1. **Google Search Console (GSC)** :
   - Rapport Pages (anciennes couvertures d'indexation : detecte les exclusions, noindex, anomalies de crawl).
   - Rapport Statistiques d'exploration (vitesse de reponse de l'hote, types de fichiers demandes).
   - Outil d'inspection d'URL (test en direct pour voir le DOM rendu par Googlebot smartphone).
   - Rapports Core Web Vitals, HTTPS, Actions manuelles, Problemes de securite.
2. **PageSpeed Insights et Chrome UX Report (CrUX)** : donnees terrain sur 28 jours au 75e percentile pour valider les signaux web essentiels.
3. **Screaming Frog SEO Spider ou Sitebulb** : exploration complete en simulant le robot Googlebot smartphone avec execution du JavaScript.
4. **Validateur de donnees structurees et Test des resultats enrichis** : verification de la syntaxe schema.org.
5. **Bing Webmaster Tools** : detection complementaire de problemes d'indexation et gestion du protocole IndexNow.

---

## 3. Gabarit du Livrable : Recommandations Techniques

Tout rapport d'audit technique suit cette structure :

```markdown
# Recommandations Techniques SEO : [Nom du site]

Date : AAAA-MM-JJ
Auteur : Partenaire SEO
Perimetre audite : [Domaine ou sous-ensemble de routes]

## 1. Resume Decisionnel
- Etat general de la sante technique : [Excellent / Acceptable / Critique]
- Nombre de problemes bloquants : [X]
- Nombre de problemes majeurs : [Y]
- Gain attendu apres correction : [Indexation de X pages cles, gain de Y secondes sur le LCP, etc.]

## 2. Tableau des Anomalies et Plan de Correction

| # | Anomalie constatee | Preuve / URLs affectees | Gravite | Solution technique preconisee | Fichier ou composant a modifier | Score ICE |
|---|---|---|---|---|---|---|
| 1 | Balise noindex sur page publique | `src/app/solutions/...` | Bloquant | Supprimer la directive robots noindex | `src/app/...` | 9.7 |
| 2 | Absence de robots.txt | Erreur 404 sur `/robots.txt` | Bloquant | Creer `app/robots.ts` avec sitemap | `src/app/robots.ts` | 9.3 |

## 3. Detail des Actions Prioritaires

### Action 1 : [Intitule clair de l'action]
- **Constat precis** : decrire ce qui se passe actuellement, capture ou code a l'appui.
- **Raisonnement SEO** : expliquer pourquoi les moteurs reagissent mal.
- **Specification pour les developpeurs** : code exact a mettre en place, sans ambiguite.
- **Test de recette** : comment verifier que le probleme est resolu apres deploiement.

## 4. Calendrier d'Implementation
- Semaine 1 : Resolution des bloquants.
- Semaine 2 a 4 : Traitement des anomalies majeures.
- Mois 2 : Optimisations mineures et Core Web Vitals.
```
