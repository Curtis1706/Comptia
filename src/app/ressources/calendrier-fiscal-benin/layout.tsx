import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Calendrier Fiscal Bénin 2026 : Dates DGI et CNSS",
  description:
    "Évitez les pénalités de retard en 2026 : toutes les dates limites officielles DGI et CNSS au Bénin (TVA le 10, salaires, impôts et bilan annuel) en un coup d'œil.",
  alternates: {
    canonical: "/ressources/calendrier-fiscal-benin",
  },
  openGraph: {
    title: "Calendrier Fiscal Bénin 2026 : Dates Limites DGI et CNSS | Ceilow",
    description:
      "Toutes les dates clés pour déclarer et payer vos impôts et cotisations CNSS à temps au Bénin, sans majoration de retard.",
    url: "https://ceilow.com/ressources/calendrier-fiscal-benin",
    type: "article",
    images: [
      {
        url: "/images/expert-comptable-benin.jpg",
        width: 1200,
        height: 800,
        alt: "Expert-comptable béninois vérifiant le calendrier fiscal 2026 à Cotonou",
      },
    ],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/calendrier-fiscal-benin#article",
  headline: "Calendrier Fiscal et Social Bénin 2026 : Dates Limites DGI et CNSS",
  description:
    "Mémo pratique des dates limites pour déclarer votre TVA, payer les cotisations CNSS, régler l'impôt sur les sociétés et déposer vos états financiers au Bénin.",
  image: "https://ceilow.com/images/expert-comptable-benin.jpg",
  inLanguage: "fr-BJ",
  author: {
    "@type": "Organization",
    name: "Équipe Fiscale Ceilow",
    url: "https://ceilow.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Ceilow",
    logo: {
      "@type": "ImageObject",
      url: "https://ceilow.com/logo/picto_ceilow_web_jaune.svg",
    },
  },
  datePublished: "2026-01-05T08:00:00+01:00",
  dateModified: "2026-11-10T10:00:00+01:00",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://ceilow.com/ressources/calendrier-fiscal-benin",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: "https://ceilow.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Ressources",
      item: "https://ceilow.com/ressources",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Calendrier Fiscal 2026",
      item: "https://ceilow.com/ressources/calendrier-fiscal-benin",
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      {children}
    </>
  );
}
