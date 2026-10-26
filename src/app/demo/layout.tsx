import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Démonstration Gratuite et Visite Guidée de la Plateforme",
  description:
    "Découvrez Ceilow en direct : émission d'une facture certifiée e-MECeF, import de relevé Mobile Money et génération automatique des écritures SYSCOHADA.",
  alternates: {
    canonical: "/demo",
  },
  openGraph: {
    title: "Démonstration Gratuite de Ceilow | Gestion Financière Bénin",
    description:
      "Testez les fonctionnalités de Ceilow en direct et posez toutes vos questions à nos experts.",
    url: "https://ceilow.com/demo",
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
      name: "Démonstration",
      item: "https://ceilow.com/demo",
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
