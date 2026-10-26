# Donnees Structurees Schema.org (JSON-LD)

Ce document fournit les modeles JSON-LD valides, modernes et conformes aux consignes techniques de Google et du consortium Schema.org.

---

## 1. Principes Fondamentaux et Regles de Securite

1. **Fidelite absolue au contenu visible** :
   - Le JSON-LD ne doit decrire que des informations reellement affichees a l'internaute sur la page.
   - Ne jamais inventer de faux avis clients, de fausses notes ou de faux tarifs dans `aggregateRating` ou `offers`. Google applique des penalites manuelles strictes en cas de manipulation de donnees structurees.
2. **Format unique : JSON-LD** :
   - Inserer le code dans une balise `<script type="application/ld+json">`.
   - Echapper les caracteres speciaux (notamment le caractere `<` transforme en `\u003c`) pour eviter toute injection XSS.
3. **Outils de validation indispensables** :
   - Test des resultats enrichis de Google (search.google.com/test/rich-results)
   - Validateur de balisage Schema.org (validator.schema.org)

---

## 2. Modeles Types Recommandes

### A. Organisation Globale (`Organization`)
A placer sur la page d'accueil ou dans le layout principal du site.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://ceilow.com/#organization",
  "name": "Ceilow",
  "url": "https://ceilow.com",
  "logo": "https://ceilow.com/logo.png",
  "description": "Plateforme SaaS de comptabilite SYSCOHADA, facturation normalisee DGI e-MECeF et gestion de tresorerie Mobile Money au Benin.",
  "email": "contact@ceilow.com",
  "telephone": "+2290197554953",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Avenue Jean-Paul II",
    "addressLocality": "Cotonou",
    "addressCountry": "BJ"
  },
  "sameAs": [
    "https://www.linkedin.com/company/ceilow"
  ]
}
```

---

### B. Logiciel en Ligne (`SoftwareApplication` / `WebApplication`)
A placer sur la page d'accueil et sur les pages de solutions SaaS.

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://ceilow.com/#application",
  "name": "Ceilow",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All modern web browsers",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "15000",
    "priceCurrency": "XOF",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock"
  },
  "featureList": [
    "Facturation normalisee e-MECeF DGI Benin",
    "Comptabilite automatisee SYSCOHADA revise",
    "Rapprochement bancaire MTN MoMo et Moov Money",
    "Generation du bilan et compte de resultat DSF"
  ]
}
```

*Note sur `aggregateRating` : ne l'ajouter que si le site collecte des avis authentiques via une plateforme d'avis verifiee et affiche publiquement la note moyenne et le nombre total d'avis sur la page.*

---

### C. Etablissement Local / Service Professionnel (`LocalBusiness` / `ProfessionalService`)
A placer sur la page de contact ou sur les pages destinees a la visibilite locale au Benin.

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://ceilow.com/#localbusiness",
  "name": "Ceilow Benin",
  "image": "https://ceilow.com/images/bureau-cotonou.webp",
  "telephone": "+2290197554953",
  "url": "https://ceilow.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Haie Vive, Ilot 450",
    "addressLocality": "Cotonou",
    "addressRegion": "Littoral",
    "addressCountry": "BJ"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 6.3572,
    "longitude": 2.4183
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:30",
      "closes": "18:00"
    }
  ],
  "priceRange": "$$"
}
```

---

### D. Fil d'Ariane (`BreadcrumbList`)
A placer sur toutes les sous-pages pour clarifier la hierarchie aux moteurs et afficher le fil d'Ariane dans les SERP.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://ceilow.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Solutions",
      "item": "https://ceilow.com/solutions"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Facturation DGI",
      "item": "https://ceilow.com/solutions/facturation-dgi"
    }
  ]
}
```

---

### E. Article de Blog ou Fiche Conseil (`Article` / `BlogPosting`)
A placer sur tous les articles de ressources, guides pratiques et actualites fiscales.

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://ceilow.com/ressources/calendrier-fiscal-benin"
  },
  "headline": "Calendrier Fiscal Benin 2026 : Toutes les Echeances DGI et CNSS",
  "description": "Retrouvez les dates cles pour declarer et payer la TVA, la TPS, l'AIB et les cotisations CNSS au Benin en toute serenite.",
  "image": "https://ceilow.com/images/calendrier-fiscal-2026.webp",
  "author": {
    "@type": "Organization",
    "name": "Equipe Fiscale Ceilow"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Ceilow",
    "logo": {
      "@type": "ImageObject",
      "url": "https://ceilow.com/logo.png"
    }
  },
  "datePublished": "2026-01-10T08:00:00+01:00",
  "dateModified": "2026-10-26T14:30:00+01:00"
}
```

---

### F. Foire aux Questions (`FAQPage`)
*Rappel de veille : Google ne montre plus les accordeons FAQ dans les resultats de recherche pour les sites prives classiques (reserve aux sites officiels et medicaux). Toutefois, baliser les questions-reponses conserve une utilite pour l'indexation semantique et la comprehension par les moteurs generatifs (LLM).*

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Ceilow est-il certifie conforme a la machine e-MECeF de la DGI au Benin ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, Ceilow integre directement l'API normalisee de la Direction Generale des Impots du Benin permettant l'emission de factures pourvues du code QR officiel et de la signature electronique obligatoire."
      }
    },
    {
      "@type": "Question",
      "name": "Comment fonctionne le rapprochement avec MTN Mobile Money et Moov Money ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ceilow synchronise les releves de transactions marchandes et les associe automatiquement aux factures emises dans le grand livre comptable SYSCOHADA."
      }
    }
  ]
}
```
