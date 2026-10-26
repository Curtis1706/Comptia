import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Toutes les Fonctionnalités : Facturation, Compta, Fiscalité et RH",
  description:
    "Découvrez l'ensemble des modules Ceilow : machine e-MECeF virtuelle, tenue SYSCOHADA, télétransmission DGI, paie CNSS, OCR dépenses et trésorerie MoMo.",
  alternates: {
    canonical: "/fonctionnalites",
  },
  openGraph: {
    title: "Toutes les Fonctionnalités de Ceilow | Gestion Financière Bénin",
    description:
      "Tous les outils indispensables pour gérer votre entreprise béninoise au même endroit.",
    url: "https://ceilow.com/fonctionnalites",
    type: "website",
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
      name: "Fonctionnalités",
      item: "https://ceilow.com/fonctionnalites",
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
