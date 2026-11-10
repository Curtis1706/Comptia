import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Sécurité des Données et Conformité APDP au Bénin",
  description:
    "Vos chiffres d'entreprise protégés chaque jour : chiffrement sécurisé, copies automatiques et respect strict de la loi béninoise sur les données (APDP).",
  alternates: {
    canonical: "/securite-et-apdp",
  },
  openGraph: {
    title: "Sécurité des Données et Conformité APDP au Bénin | Ceilow",
    description:
      "Vos factures et comptes restent votre propriété exclusive, chiffrés et sauvegardés automatiquement.",
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
