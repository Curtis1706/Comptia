import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Facture Normalisée e-MECeF au Bénin : Odoo vs Ceilow et SFE 2026",
  description:
    "Comparatif complet 2026 : connecter Odoo à l'API e-MECeF de la DGI Bénin ou choisir un logiciel certifié comme Ceilow. Coûts, certification SFE, SYSCOHADA et support.",
  alternates: {
    canonical: "/ressources/odoo-emecef-facture-normalisee-benin-comparatif",
  },
  openGraph: {
    title: "Odoo et Facture Normalisée e-MECeF au Bénin : Comparatif Logiciels et SFE | Ceilow",
    description:
      "Directeurs financiers et PME au Bénin : découvrez les coûts réels d'intégration d'Odoo avec l'e-MECeF face aux logiciels conçus nativement pour la fiscalité béninoise.",
    url: "https://ceilow.com/ressources/odoo-emecef-facture-normalisee-benin-comparatif",
    type: "article",
    images: [
      {
        url: "/images/ressources/guide-emecef-benin.jpg",
        width: 1200,
        height: 800,
        alt: "Comparatif des logiciels de facturation normalisée e-MECeF et ERP pour entreprises au Bénin",
      },
    ],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/odoo-emecef-facture-normalisee-benin-comparatif#article",
  headline: "Facture normalisée e-MECeF au Bénin : Odoo vs Ceilow et solutions certifiées SFE",
  description:
    "Analyse comparative des architectures logicielles pour la conformité e-MECeF au Bénin : connecteurs ERP Odoo versus solutions de gestion financière natives SYSCOHADA.",
  image: "https://ceilow.com/images/ressources/guide-emecef-benin.jpg",
  inLanguage: "fr-BJ",
  author: {
    "@type": "Organization",
    name: "Direction Technique et Fiscale Ceilow",
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
    "@id": "https://ceilow.com/ressources/odoo-emecef-facture-normalisee-benin-comparatif",
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
      name: "Odoo vs SFE e-MECeF Bénin",
      item: "https://ceilow.com/ressources/odoo-emecef-facture-normalisee-benin-comparatif",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Odoo est-il certifié par défaut avec l'API e-MECeF de la DGI au Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Odoo est un progiciel international générique. Il ne dispose pas nativement du module de signature cryptographique e-MECeF propre à la République du Bénin. Pour normaliser des factures sur Odoo, une entreprise doit obligatoirement faire développer ou acheter un module connecteur tiers et le faire homologuer par la DGI.",
      },
    },
    {
      "@type": "Question",
      name: "Quel est le coût réel de mise en conformité e-MECeF sur Odoo au Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'adaptation d'Odoo inclut généralement le coût des licences utilisateurs, les honoraires d'un intégrateur informatique pour configurer l'API DGI (souvent entre 500 000 et 2 000 000 FCFA), l'hébergement serveur et les contrats de maintenance à chaque mise à jour de version d'Odoo ou de l'API DGI.",
      },
    },
    {
      "@type": "Question",
      name: "Qu'est-ce qu'un SFE approuvé par la DGI au Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un Système de Facturation Électronique (SFE) approuvé est une plateforme logicielle auditée et reconnue par la Direction Générale des Impôts. Elle intègre directement les protocoles de sécurité de la machine virtuelle DGI, applique les groupes A à F, et transmet les signatures sans boîtier matériel additionnel.",
      },
    },
    {
      "@type": "Question",
      name: "Pourquoi choisir Ceilow plutôt qu'un ERP généraliste comme Odoo ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ceilow est opérationnel en 5 minutes sans frais d'installation. Il intègre nativement l'e-MECeF, la comptabilité SYSCOHADA révisée (balance à 6 colonnes, liasse DSF), le rapprochement Mobile Money et bancaire local, ainsi qu'un accompagnement physique et téléphonique assuré directement à Cotonou.",
      },
    },
  ],
};

export default function OdooEmecefComparatifLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema, faqSchema]} />
      {children}
    </>
  );
}
