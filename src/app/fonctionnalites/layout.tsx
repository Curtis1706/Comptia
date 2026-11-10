import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Fonctionnalités Ceilow : Factures DGI, Compta et Paie",
  description:
    "Découvrez tous les outils Ceilow : factures certifiées e-MECeF sans boîtier, comptes à jour, préparation TVA, paie CNSS, reçus scannés et suivi MoMo.",
  alternates: {
    canonical: "/fonctionnalites",
  },
  openGraph: {
    title: "Fonctionnalités Ceilow : Gestion d'Entreprise au Bénin | Ceilow",
    description:
      "Facturation DGI, suivi Mobile Money, fiches de paie et comptabilité sur une seule interface claire.",
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
