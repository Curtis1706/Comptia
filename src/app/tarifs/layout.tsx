import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Tarifs et Abonnements Transparents en Francs CFA (XOF)",
  description:
    "Consultez nos forfaits adaptés aux indépendants, PME et cabinets au Bénin. Facturation e-MECeF illimitée, conformité fiscale et sans frais cachés.",
  alternates: {
    canonical: "/tarifs",
  },
  openGraph: {
    title: "Tarifs et Forfaits Ceilow au Bénin | Sans Frais Cachés",
    description:
      "Abonnements transparents en Francs CFA pour automatiser votre gestion au Bénin.",
    url: "https://ceilow.com/tarifs",
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
      name: "Tarifs",
      item: "https://ceilow.com/tarifs",
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
