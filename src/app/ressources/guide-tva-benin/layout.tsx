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

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Les 4 étapes pour déclarer votre TVA avant le 10 du mois au Bénin",
  description:
    "La déclaration couvre toutes vos factures du mois précédent sur le portail e-Services de la DGI au Bénin.",
  inLanguage: "fr-BJ",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Prendre vos factures d'achat en photo (Du 1er au 3 du mois)",
      text: "Rassemblez vos reçus et factures fournisseurs normalisées du mois passé. En les prenant simplement en photo sur Ceilow, les montants de TVA déductible sont ajoutés sans recopier à la main.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Vérifier le total ventes et achats (Avant le 6 du mois)",
      text: "Contrôlez que toutes vos ventes e-MECeF et vos avoirs du mois correspondent aux chiffres de votre dossier, puis retirez votre éventuel crédit de TVA du mois précédent.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Saisir sur le site e-Services DGI (Entre le 7 et le 9 du mois)",
      text: "Connectez-vous à votre espace sur eservices.impots.bj avec votre numéro IFU, reportez les montants préparés et validez la déclaration mensuelle en ligne.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Régler le montant dû et garder le reçu (Au plus tard le 10 du mois)",
      text: "Effectuez votre paiement avant le 10 (si le 10 tombe un week-end ou un jour férié, la limite est reportée au premier jour travaillé suivant) et archivez la quittance.",
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      {children}
    </>
  );
}
