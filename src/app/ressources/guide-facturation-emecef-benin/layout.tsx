import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Facture Normalisée e-MECeF Bénin : Guide 2026",
  description:
    "Apprenez à créer une facture normalisée e-MECeF au Bénin sans acheter de machine : qui est concerné, mentions obligatoires, QR code DGI et avoirs en ligne.",
  alternates: {
    canonical: "/ressources/guide-facturation-emecef-benin",
  },
  openGraph: {
    title: "Facture Normalisée e-MECeF au Bénin : Guide Pratique 2026 | Ceilow",
    description:
      "Comprendre simplement la facture normalisée au Bénin : entreprises concernées, groupes fiscaux A à F, vérification du QR code et émission depuis un téléphone.",
    url: "https://ceilow.com/ressources/guide-facturation-emecef-benin",
    type: "article",
    images: [
      {
        url: "/images/commercante-cotonou.jpg",
        width: 1200,
        height: 800,
        alt: "Commerçante béninoise émettant une facture normalisée e-MECeF sans boîtier physique",
      },
    ],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/guide-facturation-emecef-benin#article",
  headline: "Facture Normalisée e-MECeF au Bénin : Le Guide Clair pour Facturer Sans Erreur",
  description:
    "Explication claire de la facture normalisée e-MECeF au Bénin : comment la créer sans acheter de machine, quelles mentions afficher et comment corriger une erreur.",
  image: "https://ceilow.com/images/commercante-cotonou.jpg",
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
  datePublished: "2026-11-10T09:00:00+01:00",
  dateModified: "2026-11-10T10:15:00+01:00",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://ceilow.com/ressources/guide-facturation-emecef-benin",
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
      item: "https://ceilow.com/ressources/calendrier-fiscal-benin",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Guide Facturation e-MECeF",
      item: "https://ceilow.com/ressources/guide-facturation-emecef-benin",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quelle est la différence entre une machine physique et l'e-MECeF ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La machine classique est un boîtier matériel coûteux qui demande des rouleaux de papier. L'e-MECeF est le système officiel en ligne de la DGI : il valide vos factures directement via Internet depuis votre téléphone ou ordinateur (avec un logiciel connecté comme Ceilow), sans acheter de boîtier.",
      },
    },
    {
      "@type": "Question",
      name: "Une petite entreprise au régime TPS doit-elle aussi faire des factures normalisées ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Au Bénin, les petites entreprises soumises à la Taxe Professionnelle Synthétique (TPS) doivent aussi délivrer des factures normalisées à leurs clients, en sélectionnant simplement la catégorie sans TVA (Groupe E à 0 %).",
      },
    },
    {
      "@type": "Question",
      name: "Comment annuler une facture normalisée qui contient une erreur ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On ne peut jamais supprimer une facture déjà validée par les impôts. Pour annuler ou corriger un montant, vous devez créer une facture d'avoir (facture négative officielle) en indiquant le code MECeF/DGI de la première facture.",
      },
    },
    {
      "@type": "Question",
      name: "Comment vérifier qu'une facture reçue d'un fournisseur est bien authentique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Scannez le QR code en bas de la facture avec l'application gratuite MECeF BENIN sur votre téléphone, ou entrez les numéros de contrôle sur le site de vérification des impôts.",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema, faqSchema]} />
      {children}
    </>
  );
}
