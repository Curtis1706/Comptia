import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Plan Comptable SYSCOHADA Révisé : Classes 1 à 8",
  description:
    "Consultez et imprimez en PDF le plan comptable SYSCOHADA révisé (classes 1 à 8) pour le Bénin : recherche par numéro, comptes TVA, CNSS, MoMo et export CSV.",
  alternates: {
    canonical: "/ressources/plan-comptable-syscohada-pdf",
  },
  openGraph: {
    title: "Plan Comptable SYSCOHADA Révisé : Liste des Comptes (Classes 1 à 8) | Ceilow",
    description:
      "Liste complète du plan comptable OHADA révisé au Bénin avec moteur de recherche, comptes TVA/CNSS/Mobile Money, impression PDF et export CSV.",
    url: "https://ceilow.com/ressources/plan-comptable-syscohada-pdf",
    type: "article",
    images: [
      {
        url: "/images/expert-comptable-benin.jpg",
        width: 1200,
        height: 800,
        alt: "Expert-comptable au Bénin consultant le plan comptable SYSCOHADA révisé",
      },
    ],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/plan-comptable-syscohada-pdf#article",
  headline: "Plan Comptable SYSCOHADA Révisé au Bénin : Liste Complète des Classes 1 à 8",
  description:
    "Nomenclature comptable SYSCOHADA révisée adaptée aux entreprises du Bénin et de l'UEMOA : explication simple des 8 classes, recherche par code ou libellé, export CSV et impression PDF.",
  image: "https://ceilow.com/images/expert-comptable-benin.jpg",
  inLanguage: "fr-BJ",
  author: {
    "@type": "Organization",
    name: "Équipe SYSCOHADA Ceilow",
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
  datePublished: "2026-11-10T10:30:00+01:00",
  dateModified: "2026-11-10T10:30:00+01:00",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://ceilow.com/ressources/plan-comptable-syscohada-pdf",
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
      name: "Plan Comptable SYSCOHADA",
      item: "https://ceilow.com/ressources/plan-comptable-syscohada-pdf",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quelle est la différence entre l'ancien plan OHADA et le SYSCOHADA révisé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entré en vigueur en 2018 dans toute la zone OHADA dont le Bénin, le SYSCOHADA révisé a supprimé les anciens comptes de charges à immobiliser (frais d'établissement en classe 20) et clarifié la présentation du bilan et du tableau des flux de trésorerie pour faciliter le contrôle bancaire et fiscal.",
      },
    },
    {
      "@type": "Question",
      name: "Quels comptes utiliser pour Mobile Money (MTN MoMo, Moov Money, Celtiis) ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dans la pratique comptable au Bénin sur le SYSCOHADA, la banque locale s'enregistre dans le compte 521, les espèces dans le compte 571 (Caisse) et les portefeuilles électroniques Mobile Money dans un sous-compte de trésorerie dédié comme le 585 (Transferts électroniques / Mobile Money).",
      },
    },
    {
      "@type": "Question",
      name: "Comment enregistrer ce document en PDF ou l'ouvrir dans Excel ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cliquez sur le bouton « Imprimer / PDF » en haut de cette page puis choisissez « Enregistrer au format PDF » dans votre navigateur, ou cliquez sur « Exporter en CSV » pour télécharger immédiatement le tableau exploitable dans Excel.",
      },
    },
    {
      "@type": "Question",
      name: "Une petite entreprise au Bénin doit-elle connaître ces numéros par cœur ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Dans un outil automatisé comme Ceilow, le plan comptable SYSCOHADA révisé est déjà installé : lorsque vous faites une facture ou photographiez un reçu d'achat, le logiciel écrit les bons numéros de compte tout seul pour votre comptable.",
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

