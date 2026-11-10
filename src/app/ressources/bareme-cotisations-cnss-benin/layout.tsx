import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Barème CNSS Bénin 2026 : Taux Employeur & Salarié",
  description:
    "Barème officiel CNSS au Bénin 2026 : taux employeur (16,4 % à 19,4 %), part salarié (3,6 %), barème ITS, VPS 4 %, dates limites et simulateur salaire net.",
  alternates: {
    canonical: "/ressources/bareme-cotisations-cnss-benin",
  },
  openGraph: {
    title: "Barème Cotisations CNSS Bénin 2026 : Taux Employeur, Salarié et ITS | Ceilow",
    description:
      "Tous les taux de cotisations CNSS au Bénin, l'impôt ITS par tranche, le VPS employeur, les échéances e-Cotisations et le simulateur brut/net en FCFA.",
    url: "https://ceilow.com/ressources/bareme-cotisations-cnss-benin",
    type: "article",
    images: [
      {
        url: "/images/conseillere-cotonou.jpg",
        width: 1200,
        height: 800,
        alt: "Responsable des ressources humaines calculant les cotisations CNSS au Bénin",
      },
    ],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/bareme-cotisations-cnss-benin#article",
  headline: "Barème des Cotisations CNSS au Bénin 2026 : Taux Employeur, Salarié, ITS et VPS",
  description:
    "Tableau complet des charges sociales CNSS (16,4 % à 19,4 % employeur et 3,6 % salarié sans plafond), barème mensuel ITS DGI, VPS 4 % et échéances e-Cotisations au Bénin.",
  image: "https://ceilow.com/images/conseillere-cotonou.jpg",
  inLanguage: "fr-BJ",
  author: {
    "@type": "Organization",
    name: "Équipe Paie & Social Ceilow",
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
    "@id": "https://ceilow.com/ressources/bareme-cotisations-cnss-benin",
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
      name: "Barème Cotisations CNSS Bénin",
      item: "https://ceilow.com/ressources/bareme-cotisations-cnss-benin",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Existe-t-il un plafond de salaire pour les cotisations CNSS au Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Selon l'article 22 du Code de sécurité sociale béninois, les cotisations CNSS (3,6 % salarié et 16,4 % à 19,4 % employeur) se calculent sur la totalité du salaire brut perçu, primes et indemnités imposables comprises, sans aucun plafond mensuel.",
      },
    },
    {
      "@type": "Question",
      name: "Pourquoi la part employeur CNSS varie-t-elle entre 16,4 % et 19,4 % ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les branches prestations familiales (9 %) et vieillesse employeur (6,4 %) représentent déjà 15,4 % pour toutes les entreprises. S'y ajoute le taux des risques professionnels (accidents du travail), qui va de 1 % pour les activités de bureau jusqu'à 4 % pour les métiers plus exposés comme le BTP ou l'industrie.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence entre l'ITS, le VPS et la CNSS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La CNSS finance la protection sociale (retraite, famille, accidents du travail) et se paie sur le portail e-Cotisations CNSS. L'ITS (retenu sur le salaire de l'employé) et le VPS (4 % payés par l'employeur, ou 2 % pour l'enseignement privé) sont des impôts fiscaux versés à la DGI au plus tard le 10 du mois suivant.",
      },
    },
    {
      "@type": "Question",
      name: "À quelle date déclarer et payer la CNSS au Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si votre entreprise emploie moins de 20 salariés, vous déclarez et payez tous les trimestres dans les 15 jours suivant la fin du trimestre (15 avril, 15 juillet, 15 octobre, 15 janvier). Dès 20 salariés, la déclaration et le paiement deviennent mensuels au plus tard le 10 du mois suivant.",
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

