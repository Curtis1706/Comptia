import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

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

const faqSchema = buildFaqSchema([
  {
    q: "Que se passe-t-il si le 10 du mois tombe un week-end ou un jour férié au Bénin ?",
    a: "Lorsque la date limite tombe un samedi, un dimanche ou un jour férié officiel au Bénin, elle est reportée automatiquement au premier jour ouvrable suivant.",
  },
  {
    q: "Comment Ceilow m'évite-t-il d'oublier une date limite ?",
    a: "Votre tableau de bord affiche en permanence les prochaines échéances de votre entreprise. Des alertes vous préviennent plusieurs jours à l'avance pour préparer vos chiffres sans stress.",
  },
  {
    q: "Les dates sont-elles identiques si je suis au régime TPS ?",
    a: "Non. Si votre entreprise est au régime de la Taxe Professionnelle Synthétique (TPS), vous réglez un premier acompte le 10 février, déposez votre déclaration annuelle et le solde au plus tard le 30 avril, puis versez un second acompte le 10 juin. Ceilow adapte vos rappels à votre régime.",
  },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema, faqSchema]} />
      {children}
    </>
  );
}
