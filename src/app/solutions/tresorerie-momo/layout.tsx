import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Rapprochement Bancaire et Trésorerie Mobile Money Bénin",
  description:
    "Suivez vos encaissements MTN MoMo, Moov Money et flux bancaires en temps réel. Rapprochement automatique avec vos factures de vente et écritures comptables.",
  alternates: {
    canonical: "/solutions/tresorerie-momo",
  },
  openGraph: {
    title: "Rapprochement Bancaire et Trésorerie Mobile Money Bénin | Ceilow",
    description:
      "Rapprochez vos comptes MTN MoMo, Moov Money et comptes bancaires automatiquement au Bénin.",
    url: "https://ceilow.com/solutions/tresorerie-momo",
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
      item: "https://ceilow.com/solutions/tresorerie-momo",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Trésorerie et Mobile Money",
      item: "https://ceilow.com/solutions/tresorerie-momo",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Rapprochement Bancaire et Mobile Money",
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
    "Intégration directe des relevés MTN MoMo, Moov Money et bancaires pour un lettrage et un suivi de trésorerie en temps réel.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
