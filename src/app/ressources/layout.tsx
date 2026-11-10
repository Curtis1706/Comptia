import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Ressources Comptables et Fiscales Bénin 2026",
  description:
    "Guides pratiques et simulateurs gratuits au Bénin : facture e-MECeF, TVA 18 %, calcul TPS 5 %, plan SYSCOHADA, barème CNSS et calendrier fiscal 2026.",
  alternates: {
    canonical: "/ressources",
  },
  openGraph: {
    title: "Ressources Comptables et Fiscales au Bénin | Ceilow",
    description:
      "Tous nos guides pratiques, barèmes officiels et simulateurs gratuits pour gérer votre entreprise au Bénin : e-MECeF, TVA, TPS, CNSS et SYSCOHADA.",
    url: "https://ceilow.com/ressources",
    type: "website",
    images: [
      {
        url: "/images/ressources/guide-emecef-benin.jpg",
        width: 1200,
        height: 800,
        alt: "Centre de ressources comptables et fiscales Ceilow au Bénin",
      },
    ],
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
  ],
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://ceilow.com/ressources#collection",
  name: "Ressources Comptables, Fiscales et Sociales au Bénin",
  description:
    "Guides pratiques, barèmes 2026 et simulateurs en Francs CFA pour les dirigeants, indépendants et cabinets comptables au Bénin.",
  url: "https://ceilow.com/ressources",
  inLanguage: "fr-BJ",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Facture normalisée e-MECeF au Bénin : guide pratique 2026",
        url: "https://ceilow.com/ressources/guide-facturation-emecef-benin",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Déclaration de la TVA au Bénin : seuil 50 M FCFA, calcul 18 % et date du 10",
        url: "https://ceilow.com/ressources/guide-tva-benin",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Calendrier fiscal Bénin 2026 : toutes les échéances DGI et CNSS",
        url: "https://ceilow.com/ressources/calendrier-fiscal-benin",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Calcul de la TPS au Bénin : taux 5 %, seuil et dates limites 2026",
        url: "https://ceilow.com/ressources/calcul-tps-benin-guide",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Plan comptable SYSCOHADA révisé : liste des comptes (classes 1 à 8)",
        url: "https://ceilow.com/ressources/plan-comptable-syscohada-pdf",
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "Barème des cotisations CNSS au Bénin 2026 : taux employeur, salarié et ITS",
        url: "https://ceilow.com/ressources/bareme-cotisations-cnss-benin",
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, collectionSchema]} />
      {children}
    </>
  );
}

