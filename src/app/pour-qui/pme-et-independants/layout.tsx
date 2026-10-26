import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Logiciel de Gestion pour PME, Commerçants et Indépendants au Bénin",
  description:
    "Gagnez du temps sur votre gestion quotidienne : factures certifiées e-MECeF en 3 clics, encaissements Mobile Money, suivi des impôts et zéro jargon comptable.",
  alternates: {
    canonical: "/pour-qui/pme-et-independants",
  },
  openGraph: {
    title: "Logiciel de Gestion pour PME, Commerçants et Indépendants au Bénin | Ceilow",
    description:
      "Facturation DGI, encaissements MoMo et gestion financière simplifiée pour dirigeants de PME au Bénin.",
    url: "https://ceilow.com/pour-qui/pme-et-independants",
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
      item: "https://ceilow.com/pour-qui/pme-et-independants",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "PME et Indépendants",
      item: "https://ceilow.com/pour-qui/pme-et-independants",
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
