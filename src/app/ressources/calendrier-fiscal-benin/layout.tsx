import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Calendrier Fiscal Bénin 2026 : Échéances DGI, TVA, TPS et CNSS",
  description:
    "Consultez les dates limites officielles de déclaration et paiement pour les entreprises au Bénin : TVA, TPS, AIB, acomptes IS/IBA, bordereaux CNSS et dépôt de la DSF.",
  alternates: {
    canonical: "/ressources/calendrier-fiscal-benin",
  },
  openGraph: {
    title: "Calendrier Fiscal Bénin 2026 : Toutes les Échéances DGI et CNSS | Ceilow",
    description:
      "Toutes les dates clés pour déclarer et payer vos impôts et cotisations au Bénin sans pénalité.",
    url: "https://ceilow.com/ressources/calendrier-fiscal-benin",
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/calendrier-fiscal-benin#article",
  headline: "Calendrier Fiscal Bénin 2026 : Toutes les Échéances DGI, TVA, TPS et CNSS",
  description:
    "Guide pratique et mémento complet des échéances fiscales et sociales au Bénin pour l'exercice 2026.",
  image: "https://ceilow.com/images/expert-comptable-benin.jpg",
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
  dateModified: "2026-10-26T18:00:00+01:00",
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
      item: "https://ceilow.com/ressources/calendrier-fiscal-benin",
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
