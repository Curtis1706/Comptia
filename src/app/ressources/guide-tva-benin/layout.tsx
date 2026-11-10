import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Déclaration TVA au Bénin : Guide Complet 2026",
  description:
    "Tout comprendre sur la TVA à 18 % au Bénin : qui doit la facturer (seuil de 50 M FCFA), comment déduire vos achats et payer avant le 10 sans erreur.",
  alternates: {
    canonical: "/ressources/guide-tva-benin",
  },
  openGraph: {
    title: "Déclaration de la TVA au Bénin : Seuil, Calcul et Échéance 2026 | Ceilow",
    description:
      "Mode d'emploi simple de la TVA au Bénin : seuil des 50 millions FCFA, calcul entre ventes et achats normalisés, et dépôt du 10 du mois.",
    url: "https://ceilow.com/ressources/guide-tva-benin",
    type: "article",
    images: [
      {
        url: "/images/finance-manager.jpg",
        width: 1200,
        height: 800,
        alt: "Responsable financier béninois préparant sa déclaration mensuelle de TVA à Cotonou",
      },
    ],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/guide-tva-benin#article",
  headline: "Déclaration de la TVA au Bénin : Seuil de 50 M FCFA, Calcul à 18 % et Dépôt du 10",
  description:
    "Guide simple pour savoir si votre entreprise doit facturer la TVA à 18 % au Bénin, récupérer la TVA sur vos factures d'achat et payer avant le 10 sans pénalité.",
  image: "https://ceilow.com/images/finance-manager.jpg",
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
    "@id": "https://ceilow.com/ressources/guide-tva-benin",
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
      name: "Guide TVA Bénin",
      item: "https://ceilow.com/ressources/guide-tva-benin",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quel est le taux de TVA en vigueur au Bénin en 2026 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le taux normal de la TVA au Bénin est de 18 % sur la majorité des ventes et prestations de services. Les exportations et certains produits essentiels listés par la loi restent à 0 %.",
      },
    },
    {
      "@type": "Question",
      name: "À partir de quel chiffre d'affaires doit-on facturer la TVA ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une entreprise individuelle doit facturer la TVA dès que ses ventes annuelles dépassent 50 millions de FCFA. En dessous, elle reste au forfait TPS sans facturer la TVA (sauf choix volontaire). Les sociétés (SARL, SAS) relèvent directement du régime réel.",
      },
    },
    {
      "@type": "Question",
      name: "Quand faut-il déclarer et payer la TVA chaque mois ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La déclaration et le règlement ont lieu au plus tard le 10 de chaque mois sur le portail e-Services de la DGI pour les opérations du mois d'avant. Si le 10 tombe un week-end ou un jour férié, la date limite passe au premier jour ouvrable suivant.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je récupérer la TVA sur une facture fournisseur sans QR code DGI ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Sans facture normalisée portant le numéro IFU et le QR code officiel e-MECeF de votre fournisseur, les impôts refusent de déduire la TVA payée sur cet achat.",
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
