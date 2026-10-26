import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Sécurité des Données et Conformité APDP au Bénin",
  description:
    "Découvrez notre architecture de sécurité : chiffrement bancaire TLS/AES-256, sauvegardes quotidiennes redondantes et stricte conformité avec l'APDP Bénin.",
  alternates: {
    canonical: "/securite-et-apdp",
  },
  openGraph: {
    title: "Sécurité des Données et Conformité APDP au Bénin | Ceilow",
    description:
      "Vos données comptables et financières protégées selon les plus hauts standards de sécurité.",
    url: "https://ceilow.com/securite-et-apdp",
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
      name: "Sécurité et APDP",
      item: "https://ceilow.com/securite-et-apdp",
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
