import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Gestion des Dépenses et Reçus Scannés au Bénin",
  description:
    "Prenez vos reçus et factures fournisseurs en photo : Ceilow lit les montants, récupère votre TVA déductible et archive vos preuves d'achat 10 ans.",
  alternates: {
    canonical: "/solutions/gestion-depenses",
  },
  openGraph: {
    title: "Gestion des Dépenses et Reçus Scannés au Bénin | Ceilow",
    description:
      "Fini les tickets perdus : photographiez vos achats pour récupérer 100 % de votre TVA déductible.",
    url: "https://ceilow.com/solutions/gestion-depenses",
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
      name: "Solutions",
      item: "https://ceilow.com/solutions/gestion-depenses",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Gestion des Dépenses",
      item: "https://ceilow.com/solutions/gestion-depenses",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Numérisation des Factures d'Achat et Notes de Frais",
  provider: {
    "@type": "Organization",
    name: "Ceilow",
    url: "https://ceilow.com",
  },
  areaServed: {
    "@type": "Country",
    name: "Benin",
  },
  description:
    "Capture photo de reçus et factures fournisseurs avec lecture automatique des montants en FCFA, extraction de TVA et archivage légal 10 ans.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
