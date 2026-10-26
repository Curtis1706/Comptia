import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Gestion des Dépenses, Notes de Frais et OCR Factures au Bénin",
  description:
    "Numérisez vos reçus et factures d'achat par OCR. Rapprochement automatique avec vos sorties de caisse et imputation comptable SYSCOHADA immédiate.",
  alternates: {
    canonical: "/solutions/gestion-depenses",
  },
  openGraph: {
    title: "Gestion des Dépenses, Notes de Frais et OCR Factures au Bénin | Ceilow",
    description:
      "Numérisation OCR et contrôle des achats d'entreprise au Bénin avec imputation comptable automatique.",
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
  name: "Gestion des Dépenses et OCR Achats",
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
    "Numérisation intelligente des justificatifs de dépenses, reconnaissance optique de caractères (OCR) et écriture comptable d'achat immédiate.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
