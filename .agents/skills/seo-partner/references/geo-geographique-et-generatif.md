# Ciblage Geographique (GEO) et Optimisation pour les Moteurs Generatifs (AEO / GEO)

Ce document rassemble les principes pour etendre son audience a l'international (ciblage geographique multi-pays) et optimiser la presence de la marque dans les reponses fournies par les intelligences artificielles et moteurs generatifs (AI Overviews, ChatGPT Search, Perplexity).

---

## PARTIE A : CIBLAGE GEOGRAPHIQUE MULTI-PAYS

Pour un SaaS ou une entreprise s'etendant dans la zone UEMOA ou a l'international (ex : Benin, Cote d'Ivoire, Senegal, Togo) :

### 1. Choix de Structure d'URL Internationale

| Option | Exemple | Avantages | Inconvenients | Recommandation |
|---|---|---|---|---|
| Sous-repertoires | `site.com/bj/`, `site.com/ci/` | Consolidation totale de l'autorite du domaine, maintenance technique unique, cout reduit. | Perception parfois moins locale que le domaine national. | **Recommande** pour les PME et SaaS en phase de croissance. |
| Domaines nationaux (ccTLD) | `site.bj`, `site.ci`, `site.sn` | Signal geographique maximal pour les moteurs et confiance utilisateur immediate. | Division de l'autorite netlinking par autant de domaines, cout d'achat et renouvellement eleve. | Recommande uniquement pour les grandes entreprises avec des equipes marketing dediees par pays. |
| Sous-domaines | `bj.site.com`, `ci.site.com` | Separation technique facile si serveurs distincts. | L'autorite est diluee entre sous-domaines, complexite de suivi accrue. | A eviter. |

### 2. Balisage Hreflang
Lorsque plusieurs versions linguistiques ou regionales d'une page existent, la balise hreflang indique aux moteurs quelle version afficher selon la localisation de l'internaute.

Regles strictes :
- Reciprocite obligatoire : si la page A pointe vers la page B en hreflang, la page B doit obligatoirement pointer vers la page A.
- URLs canoniques absolues uniquement.
- Balise `x-default` pour les utilisateurs ne correspondant a aucun pays specifie.

Exemple dans le code `<head>` :
```html
<link rel="alternate" hreflang="fr-BJ" href="https://ceilow.com/bj/solutions/facturation" />
<link rel="alternate" hreflang="fr-CI" href="https://ceilow.com/ci/solutions/facturation" />
<link rel="alternate" hreflang="fr-SN" href="https://ceilow.com/sn/solutions/facturation" />
<link rel="alternate" hreflang="x-default" href="https://ceilow.com/solutions/facturation" />
```

### 3. Localisation Reelle du Contenu
Ne jamais se contenter de dupliquer une page en changeant simplement le nom du pays :
- Adapter les taux de taxes (ex : TVA au Benin a 18%, TPS beninoise vs reglementations ivoiriennes ou senegalaises).
- Adapter les devises et moyens de paiement (MTN MoMo, Moov Money, Orange Money, Wave selon le pays).
- Citer les institutions fiscales et douanieres idoines (DGI Benin, DGI Cote d'Ivoire, DGID Senegal).
- Utiliser un reseau de distribution de contenu (CDN) avec des points de presence proches des utilisateurs ouest-africains.

---

## PARTIE B : OPTIMISATION POUR LES MOTEURS GENERATIFS (GEO / AEO)

Les internautes utilisent de plus en plus les reponses generees par IA (Google AI Overviews, ChatGPT Search, Perplexity) pour trouver des outils, comparer des offres et resoudre des problemes techniques.

### 1. Comment les Modeles IA Selectionnent leurs Sources
Contrairement au SEO traditionnel base uniquement sur les mots-cles et les liens entrants, les modeles generatifs selectionnent leurs citations selon :
- **La clarte des entites semantiques** : la marque est-elle reconnue comme une entite de reference associee au sujet (ex : Ceilow = editeur SaaS comptabilite SYSCOHADA Benin) ?
- **L'extractibilite de l'information** : le texte contient-il une reponse directe, autonome et non ambigue a la question posee ?
- **Le consensus du web** : l'affirmation est-elle corroboree par d'autres sources fiables (articles de presse, registres officiels, avis verifies, comparatifs specialises) ?

### 2. Bonnes Pratiques Editoriales pour l'IA
- **Structure en reponse directe** : formuler les sous-titres H2 sous forme de questions reelles et rediger une synthese factuelle de 40 a 60 mots juste en dessous.
- **Tableaux de synthese** : les modeles de langage indexent et citent tres frequemment les tableaux de prix, de fonctionnalites et de comparaisons normatives.
- **Eviter le jargon publicitaire vague** : preferer des donnees precises et chiffrees (« generation d'une facture normalisee e-MECeF en moins de 3 secondes » plutot que « une solution rapide et intuitive »).
- **Consistance de marque** : veiller a ce que la description de l'entreprise sur LinkedIn, dans les annuaires professionnels, sur les fiches d'etablissement et sur le site officiel utilise les memes termes directeurs.

### 3. Gestion des Robots d'Exploration IA dans `robots.txt`

Pour etre cite dans les moteurs generatifs conversationnels, il faut distinguer les robots qui alimentent les reponses de recherche de ceux qui aspirent le contenu pour le reentrainement brut.

Directives recommandees :
```text
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/
Disallow: /login/
Disallow: /register/

# Autoriser les robots de recherche IA conversationnelle
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-Web
Allow: /

# Directives d'entrainement brut (optionnel selon la strategie de protection des donnees)
# User-agent: GPTBot
# Disallow: /
```

*Note importante : Google-Extended bloque uniquement l'entrainement des modeles d'IA generative Google (Gemini, Vertex AI) mais ne desactive pas l'affichage du site dans les AI Overviews des resultats de recherche Google.*

### 4. Le Role Crucial de Bing Webmaster Tools et IndexNow
- Le moteur de recherche ChatGPT s'appuie massivement sur l'index de Bing pour verifier les faits et citer des liens web en temps reel.
- Valider imperativement son domaine dans **Bing Webmaster Tools**.
- Mettre en place le protocole **IndexNow** pour notifier Bing et ses partenaires des que du nouveau contenu est publie ou mis a jour.

### 5. Mesure et Suivi de la Visibilite IA
- **Dans Google Search Console** : surveiller les requetes conversationnelles longues (longue traine sous forme de questions complexes) et segmenter les impressions liees aux syntheses de recherche.
- **Dans Google Analytics 4 (GA4)** : creer une vue ou un segment de trafic dedie aux referrents IA :
  - `chatgpt.com`
  - `perplexity.ai`
  - `copilot.microsoft.com`
  - `claude.ai`
- **Suivi d'un panel de requetes test** : tester mensuellement 10 questions cles dans ChatGPT, Gemini et Perplexity pour observer si la marque apparait dans les recommandations et quelles URLs sont citees.
