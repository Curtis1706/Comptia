import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Comment Annuler une Facture Normalisée au Bénin : Guide DGI 2026",
  description:
    "Guide pratique officiel DGI Bénin : comment annuler ou modifier une facture normalisée e-MECeF en ligne, créer une facture d'avoir et régulariser sa déclaration.",
  alternates: {
    canonical: "/ressources/comment-annuler-facture-normalisee-benin",
  },
  openGraph: {
    title: "Comment Annuler une Facture Normalisée en Ligne au Bénin : Procédure DGI et Avoir | Ceilow",
    description:
      "Erreur de montant, de client ou de TVA sur une facture normalisée ? Découvrez la procédure légale DGI pour émettre un avoir certifié e-MECeF sans amende.",
    url: "https://ceilow.com/ressources/comment-annuler-facture-normalisee-benin",
    type: "article",
    images: [
      {
        url: "/images/ressources/guide-emecef-benin.jpg",
        width: 1200,
        height: 800,
        alt: "Gestionnaire comptable à Cotonou régularisant une facture normalisée e-MECeF par un avoir certifié",
      },
    ],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/comment-annuler-facture-normalisee-benin#article",
  headline: "Comment annuler une facture normalisée en ligne au Bénin : procédure officielle DGI",
  description:
    "Explication juridique et pratique pour annuler ou rectifier une facture normalisée e-MECeF au Bénin par l'émission d'une facture d'avoir certifiée.",
  image: "https://ceilow.com/images/ressources/guide-emecef-benin.jpg",
  inLanguage: "fr-BJ",
  author: {
    "@type": "Organization",
    name: "Équipe Fiscale et Comptable Ceilow",
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
  datePublished: "2026-11-25T08:00:00+01:00",
  dateModified: "2026-11-25T08:00:00+01:00",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://ceilow.com/ressources/comment-annuler-facture-normalisee-benin",
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
      name: "Annuler une Facture Normalisée DGI",
      item: "https://ceilow.com/ressources/comment-annuler-facture-normalisee-benin",
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment annuler ou rectifier une facture normalisée en ligne au Bénin",
  description:
    "Étapes officielles pour annuler une facture normalisée e-MECeF erronée par l'émission d'une facture d'avoir conforme aux exigences de la DGI Bénin.",
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Retrouver les identifiants de la facture initiale erronée",
      text: "Récupérez le numéro de facture interne, le code MECeF/DGI à 24 caractères et le NIM de la machine ou du SFE ayant émis la facture d'origine.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Créer un document de type Facture d'avoir",
      text: "Dans votre système de facturation certifié (SFE) ou logiciel connecté comme Ceilow, sélectionnez la fonction Créer un avoir ou Note de crédit.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Renseigner la référence et le motif de régularisation",
      text: "Rattachez l'avoir au code MECeF de la facture d'origine et indiquez le motif légal (annulation de vente, retour de marchandise ou correction de tarif).",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Valider la signature électronique auprès de la DGI",
      text: "Transmettez l'avoir à l'API e-MECeF de la DGI pour obtenir un nouveau QR code de validation certifiant l'annulation.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Délivrer l'avoir au client et ajuster la comptabilité",
      text: "Remettez le PDF de l'avoir au client et enregistrez l'écriture comptable d'annulation de créance et de régularisation de TVA dans votre journal des ventes.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Peut-on supprimer une facture normalisée déjà validée par la DGI ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Une fois qu'une facture a reçu sa signature électronique, son code MECeF/DGI et son QR code, elle est enregistrée de manière irréversible sur les serveurs de la DGI. La suppression technique est formellement interdite par le Code Général des Impôts du Bénin. La seule procédure autorisée pour l'annuler est d'émettre une facture d'avoir normalisée.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence entre une annulation totale et une rectification partielle ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'annulation totale concerne une facture émise à tort (mauvais client, commande annulée) : l'avoir reprend l'intégralité du montant TTC pour remettre le solde à zéro. La rectification partielle intervient en cas de remise commerciale ou de produit manquant : l'avoir ne porte que sur le montant de la différence.",
      },
    },
    {
      "@type": "Question",
      name: "Que devient la TVA sur une facture normalisée annulée par un avoir ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'émission de l'avoir normalisé annule la TVA initialement collectée auprès de la DGI. Lors de votre déclaration mensuelle du 10 ou du 15 du mois, la TVA de l'avoir vient en déduction de la TVA brute collectée de la période, ce qui vous évite de payer un impôt indu.",
      },
    },
    {
      "@type": "Question",
      name: "Comment réémettre une nouvelle facture après avoir annulé la précédente ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Après avoir émis et transmis l'avoir de régularisation à votre client, vous générez simplement une nouvelle facture normale avec les données corrigées (bon client, bon prix unitaire ou bon taux). Le client recevra donc trois pièces justificatives : la facture initiale, l'avoir d'annulation et la nouvelle facture conforme.",
      },
    },
  ],
};

export default function CommentAnnulerFactureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd schema={[articleSchema, breadcrumbSchema, howToSchema, faqSchema]} />
      {children}
    </>
  );
}

