import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Télédéclaration et Paiement des Impôts DGI au Bénin : Guide 2026",
  description:
    "Guide pratique e-Services DGI Bénin : comment télédéclarer et payer la TVA, la TPS et l'AIB en ligne, dates limites et moyens de paiement Mobile Money ou virement.",
  alternates: {
    canonical: "/ressources/teledeclaration-paiement-impots-dgi-benin",
  },
  openGraph: {
    title: "Télédéclaration et Télépaiement des Impôts au Bénin : Guide Complet e-Services DGI | Ceilow",
    description:
      "Évitez les pénalités de retard : apprenez à remplir vos déclarations mensuelles de TVA et acomptes TPS sur le portail e-Services de la DGI et à payer en ligne.",
    url: "https://ceilow.com/ressources/teledeclaration-paiement-impots-dgi-benin",
    type: "article",
    images: [
      {
        url: "/images/ressources/guide-tva-benin.jpg",
        width: 1200,
        height: 800,
        alt: "Comptable à Cotonou effectuant une télédéclaration fiscale sur le portail e-Services DGI Bénin",
      },
    ],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/teledeclaration-paiement-impots-dgi-benin#article",
  headline: "Télédéclaration et télépaiement des impôts en ligne au Bénin : guide officiel e-Services DGI",
  description:
    "Procédure pas-à-pas pour déclarer et payer ses impôts professionnels au Bénin via le portail e-Services de la DGI : TVA, TPS, AIB et retenues à la source.",
  image: "https://ceilow.com/images/ressources/guide-tva-benin.jpg",
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
  datePublished: "2026-11-26T08:00:00+01:00",
  dateModified: "2026-11-26T08:00:00+01:00",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://ceilow.com/ressources/teledeclaration-paiement-impots-dgi-benin",
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
      name: "Télédéclaration et Paiement DGI",
      item: "https://ceilow.com/ressources/teledeclaration-paiement-impots-dgi-benin",
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment télédéclarer et payer ses impôts sur e-Services DGI Bénin",
  description:
    "Étapes pour soumettre sa déclaration fiscale mensuelle ou trimestrielle et effectuer le télépaiement sécurisé auprès de la DGI Bénin.",
  totalTime: "PT10M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Se connecter au portail e-Services DGI",
      text: "Accédez à la plateforme officielle eservices.impots.bj à l'aide de votre identifiant IFU et de votre mot de passe sécurisé.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Sélectionner la période et le formulaire fiscal",
      text: "Choisissez le formulaire correspondant à votre impôt : Déclaration mensuelle de TVA et taxes assimilées, ou Déclaration d'acompte TPS.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Saisir les bases imposables et la taxe nette",
      text: "Reportez les chiffres d'affaires imposables, la TVA collectée, la TVA déductible sur achats normalisés et les retenues AIB de la période.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Valider la déclaration et générer l'avis de versement",
      text: "Vérifiez le calcul automatique de la taxe nette due et confirmez la soumission pour télécharger l'avis d'imposition avec sa référence de paiement unique.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Effectuer le règlement par virement ou Mobile Money",
      text: "Réglez le montant indiqué via MTN Mobile Money, Moov Money, Celtiis Cash ou par virement bancaire sécurisé en rappelant la référence de l'avis.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quelle est la date limite pour télédéclarer et payer la TVA au Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pour les entreprises relevant du régime réel au Bénin, la déclaration et le paiement de la TVA du mois précédent doivent être effectués au plus tard le 10 du mois en cours (pour les moyennes entreprises) ou le 15 du mois (selon la catégorie fiscale de rattachement).",
      },
    },
    {
      "@type": "Question",
      name: "Comment payer son impôt par Mobile Money sur e-Services DGI ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Après avoir validé votre déclaration en ligne, le portail e-Services génère un ordre de paiement. Vous sélectionnez le mode Mobile Money (MTN MoMo, Moov Money ou Celtiis Cash), renseignez votre numéro de téléphone et validez la transaction sur votre mobile avec votre code PIN secret.",
      },
    },
    {
      "@type": "Question",
      name: "Une entreprise sans chiffre d'affaires doit-elle quand même télédéclarer ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Au Bénin, la télédéclaration est obligatoire même en cas d'absence totale d'activité au cours du mois écoulé. Vous devez soumettre une déclaration portant la mention 'Néant' pour éviter les pénalités pour défaut de déclaration.",
      },
    },
    {
      "@type": "Question",
      name: "Comment Ceilow simplifie-t-il la télédéclaration sur e-Services ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ceilow calcule automatiquement vos montants exacts à partir de vos factures de vente normalisées et de vos achats enregistrés : base taxable, TVA collectée, TVA déductible et montant net. Vous n'avez plus qu'à recopier les montants pré-calculés case par case ou exporter la feuille de télédéclaration conforme.",
      },
    },
  ],
};

export default function TeledeclarationImpotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema, howToSchema, faqSchema]} />
      {children}
    </>
  );
}
