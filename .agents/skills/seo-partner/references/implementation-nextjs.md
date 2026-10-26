# Guide d'Implementation SEO pour Next.js (App Router)

Ce document rassemble les regles techniques et patrons de code pour implementer une architecture SEO irréprochable sur Next.js avec l'App Router.

---

## 1. Gestion des Metadonnees (Metadata API)

Next.js fournit une API native et puissante pour declarer les balises dans le `<head>`.

### A. Configuration Racine (`src/app/layout.tsx`)
Il est indispensable de definir `metadataBase` a la racine pour resoudre automatiquement les URLs canoniques et les images de partage social sans erreurs relatives.

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://ceilow.com'),
  title: {
    default: 'Ceilow : Comptabilite SYSCOHADA et Facturation DGI au Benin',
    template: '%s | Ceilow',
  },
  description:
    'Plateforme SaaS de comptabilite SYSCOHADA, facturation normalisee DGI e-MECeF et gestion de tresorerie Mobile Money pour entreprises et cabinets au Benin.',
  applicationName: 'Ceilow',
  authors: [{ name: 'Ceilow Technologies', url: 'https://ceilow.com' }],
  creator: 'Ceilow',
  publisher: 'Ceilow',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_BJ',
    url: 'https://ceilow.com',
    siteName: 'Ceilow',
    title: 'Ceilow : Comptabilite SYSCOHADA et Facturation DGI au Benin',
    description:
      'Gerez votre comptabilite et vos declarations fiscales en toute conformite avec la DGI du Benin.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ceilow : Plateforme Comptable et Fiscale au Benin',
      },
    ],
  },
};
```

---

### B. Le Cas des Pages avec `"use client"` (Contournement Recommande)
Dans Next.js App Router, un composant client (comportant la directive `"use client"`) **ne peut pas exporter directement un objet `metadata`**.

Dans le projet Ceilow, de nombreuses pages publiques comportent `"use client"` car elles gerent des formulaires ou des animations.

Pour ajouter des metadonnees sur une route cliente sans tout casser, utiliser l'une des deux options suivantes :

#### Option 1 : Creer un fichier `layout.tsx` serveur dans le dossier de la route (Recommande)
Dans le dossier de la page (ex : `src/app/solutions/facturation-dgi/`), creer un fichier `layout.tsx` (serveur par defaut) qui definit les metadonnees specifiques :

```tsx
// src/app/solutions/facturation-dgi/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facturation Normalisee DGI e-MECeF au Benin',
  description:
    'Emettez des factures normalisees conformes DGI avec code QR et signature electronique e-MECeF en quelques clics grace a Ceilow.',
  alternates: {
    canonical: '/solutions/facturation-dgi',
  },
  openGraph: {
    title: 'Facturation Normalisee DGI e-MECeF au Benin | Ceilow',
    description:
      'Solution certifiee pour PME et cabinets au Benin. Conformite fiscale immediate.',
    url: 'https://ceilow.com/solutions/facturation-dgi',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

#### Option 2 : Transformer `page.tsx` en composant serveur et extraire la vue cliente
Laisser `page.tsx` sans `"use client"` pour exporter `metadata`, et importer un composant dedie pour le rendu interactif (ex : `FacturationView.tsx`).

---

## 2. Generation Automatique du Fichier Robots (`src/app/robots.ts`)

Next.js permet de generer le fichier `robots.txt` dynamiquement via TypeScript :

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ceilow.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/login',
          '/register',
          '/reinitialisation-mot-de-passe',
          '/admin/',
          '/_next/',
        ],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## 3. Generation Automatique du Plan de Site (`src/app/sitemap.ts`)

Pour maintenir un plan de site toujours exact et a jour :

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ceilow.com';
  const currentDate = new Date();

  // Liste des routes publiques statiques du site
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/solutions/comptabilite-syscohada`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions/facturation-dgi`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions/tresorerie-momo`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fonctionnalites`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tarifs`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ressources/calendrier-fiscal-benin`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/securite-et-apdp`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  return staticRoutes;
}
```

---

## 4. Integration Securisee de JSON-LD dans les Pages

Pour eviter toute faille de securite XSS lors de l'injection de donnees structurees dans le HTML :

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
```

---

## 5. Middleware et Protection des Chemins Publics

Dans `src/middleware.ts`, il est imperatif de laisser passer sans authentification :
- Les fichiers robots et sitemaps (`/robots.txt`, `/sitemap.xml`).
- Les ressources statiques du dossier `public/` (logos, favicons, images).
- Les pages publiques de presentation (`/solutions/*`, `/pour-qui/*`, `/tarifs`, `/contact`, `/ressources/*`).

Si un robot d'indexation tente d'acceder a `/solutions/facturation-dgi` et recoit une redirection 307 ou 302 vers `/login`, la page sera desindexee par Google sous quelques semaines.

---

## 6. Bonnes Pratiques Composant `next/image` et Polices

1. **Une seule image prioritaire par page** :
   - Ajouter `priority` uniquement sur l'image hero visible immediatement au-dessus de la ligne de flottaison (LCP).
   - Ne jamais mettre `priority` sur les images situees plus bas dans la page, car cela retarde le chargement des ressources critiques.
2. **Dimensions obligatoires** :
   - Toujours specifier `width` et `height` (ou utiliser `fill` avec un conteneur parent en `position: relative`) pour eliminer tout decalage visuel (CLS = 0).
3. **Optimisation des polices avec `next/font`** :
   - Charger les polices via `next/font/google` ou `next/font/local`. Next.js telecharge les fichiers a la compilation et supprime tout appel externe bloquant vers Google Fonts.
