import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Facturation Normalisée DGI e-MECeF au Bénin",
  description:
    "Émettez vos factures normalisées avec code QR et signature électronique e-MECeF en temps réel. Solution certifiée conforme aux exigences de la DGI Bénin.",
  alternates: {
    canonical: "/solutions/facturation-dgi",
  },
  openGraph: {
    title: "Facturation Normalisée DGI e-MECeF au Bénin | Ceilow",
    description:
      "Factures certifiées DGI conformes et immédiates pour PME et indépendants au Bénin.",
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
  name: "Facturation Normalisée DGI e-MECeF",
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
    "Module d'émission et de normalisation instantanée des factures d'entreprise avec l'API e-MECeF de la Direction Générale des Impôts du Bénin.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
