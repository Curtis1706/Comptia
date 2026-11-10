import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Rapprochement Bancaire et Mobile Money au Bénin",
  description:
    "Suivez vos paiements MTN MoMo, Moov Money et comptes bancaires au même endroit : chaque encaissement est associé à sa facture sans pointage manuel.",
  alternates: {
    canonical: "/solutions/tresorerie-momo",
  },
  openGraph: {
    title: "Rapprochement Bancaire et Trésorerie Mobile Money | Ceilow",
    description:
      "Sachez exactement combien il vous reste sur vos comptes MoMo, Moov et banques sans écart de caisse.",
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
  name: "Suivi de Trésorerie Banques et Mobile Money",
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
    "Suivi en temps réel des paiements MTN MoMo, Moov Money et comptes bancaires avec association automatique aux factures clients.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
