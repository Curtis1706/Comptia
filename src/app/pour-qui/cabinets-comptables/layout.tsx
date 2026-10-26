import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Plateforme Collaborative pour Cabinets d'Expertise Comptable au Bénin",
  description:
    "Collaborez en temps réel avec vos clients : collecte automatisée des pièces, révision des comptes SYSCOHADA, lettrage rapide et exports conformes DGI.",
  alternates: {
    canonical: "/pour-qui/cabinets-comptables",
  },
  openGraph: {
    title: "Plateforme Collaborative pour Cabinets d'Expertise Comptable au Bénin | Ceilow",
    description:
      "Gagnez jusqu'à 40% de temps sur la tenue et la révision des dossiers clients au Bénin.",
    url: "https://ceilow.com/pour-qui/cabinets-comptables",
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
      name: "Pour qui",
      item: "https://ceilow.com/pour-qui/cabinets-comptables",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Cabinets Comptables",
      item: "https://ceilow.com/pour-qui/cabinets-comptables",
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
