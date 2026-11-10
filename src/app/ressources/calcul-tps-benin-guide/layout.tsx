import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Calcul TPS au Bénin 2026 : Taux 5% et Échéances",
  description:
    "Calculez votre TPS au Bénin : seuil de 50 M FCFA, taux à 5 %, minimum 10 000 FCFA, échéances (10 février, 30 avril, 10 juin) et simulateur gratuit en FCFA.",
  alternates: {
    canonical: "/ressources/calcul-tps-benin-guide",
  },
  openGraph: {
    title: "Calcul TPS au Bénin 2026 : Taux 5 %, Acomptes et Seuil | Ceilow",
    description:
      "Guide clair de la Taxe Professionnelle Synthétique au Bénin : entreprises concernées, calcul à 5 %, minimum forfaitaire et dates de paiement DGI.",
    url: "https://ceilow.com/ressources/calcul-tps-benin-guide",
    type: "article",
    images: [
      {
        url: "/images/commercante-cotonou.jpg",
        width: 1200,
        height: 800,
        alt: "Commerçante béninoise gérant sa petite entreprise au régime TPS à Cotonou",
      },
    ],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/calcul-tps-benin-guide#article",
  headline: "Calcul de la TPS au Bénin : Seuil de 50 M FCFA, Taux à 5 % et Dates Limites 2026",
  description:
    "Mode d'emploi complet de la Taxe Professionnelle Synthétique (TPS) au Bénin : calcul en Francs CFA, minimum de perception, acomptes du 10 février et 10 juin, solde du 30 avril et facturation Groupe E.",
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
  datePublished: "2026-11-10T10:30:00+01:00",
  dateModified: "2026-11-10T10:30:00+01:00",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://ceilow.com/ressources/calcul-tps-benin-guide",
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
      name: "Guide Calcul TPS Bénin",
      item: "https://ceilow.com/ressources/calcul-tps-benin-guide",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Une société (SARL ou SAS) peut-elle choisir le régime TPS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Au Bénin, la TPS s'adresse uniquement aux entreprises individuelles (établissements, artisans, prestataires en nom propre) dont le chiffre d'affaires annuel reste égal ou inférieur à 50 millions de FCFA. Une société (SARL, SAS, SA) relève dès sa création de l'Impôt sur les Sociétés (IS) et du régime réel, même avec un petit chiffre d'affaires.",
      },
    },
    {
      "@type": "Question",
      name: "Combien paie-t-on si l'activité vient de démarrer ou n'a rien encaissé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le Code Général des Impôts prévoit un minimum de perception de base de 10 000 FCFA même lorsque 5 % de vos recettes donnent un montant inférieur, auquel s'ajoute habituellement le prélèvement annuel ORTB de 4 000 FCFA lors de la liquidation.",
      },
    },
    {
      "@type": "Question",
      name: "La TPS dispense-t-elle de faire des factures normalisées e-MECeF ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Toutes les entreprises béninoises, y compris au régime TPS, doivent remettre des factures normalisées avec QR code à leurs clients. Vous sélectionnez simplement le Groupe E (0 % de TVA) sur vos factures e-MECeF pour ne pas facturer de TVA.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles sont les dates limites pour déclarer et payer la TPS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La TPS se règle en deux acomptes provisionnels au plus tard le 10 février et le 10 juin, puis le solde éventuel accompagne votre déclaration annuelle au plus tard le 30 avril de l'année suivante sur le portail e-Services de la DGI.",
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

