import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Facturation Normalisée e-MECeF au Bénin Sans Machine",
  description:
    "Créez vos factures officielles avec QR code DGI en 3 secondes depuis votre téléphone ou ordinateur. Sans machine physique à acheter. Essayez gratuitement Ceilow.",
  alternates: {
    canonical: "/solutions/facturation-dgi",
  },
  openGraph: {
    title: "Facturation Normalisée e-MECeF Sans Machine au Bénin | Ceilow",
    description:
      "Émettez des factures officielles avec QR code DGI depuis votre mobile ou navigateur web en toute conformité.",
    url: "https://ceilow.com/solutions/facturation-dgi",
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
      item: "https://ceilow.com/solutions/facturation-dgi",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Facturation DGI e-MECeF",
      item: "https://ceilow.com/solutions/facturation-dgi",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Facturation Normalisée e-MECeF Sans Machine Physique",
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
    "Émission directe de factures normalisées avec QR code et signature officielle DGI e-MECeF depuis votre navigateur ou téléphone.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
