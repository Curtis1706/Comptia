import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Gestion de Paie et Déclarations CNSS au Bénin",
  description:
    "Préparez vos fiches de paie conformes au Bénin en quelques minutes : salaires nets, retenues fiscales et cotisations CNSS calculés sans erreur Excel.",
  alternates: {
    canonical: "/solutions/paie-cnss",
  },
  openGraph: {
    title: "Gestion de Paie et Déclarations CNSS au Bénin | Ceilow",
    description:
      "Fiches de paie conformes, calcul des charges sociales et préparation CNSS en quelques clics pour vos salariés.",
    url: "https://ceilow.com/solutions/paie-cnss",
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
      item: "https://ceilow.com/solutions/paie-cnss",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Paie et Déclaration CNSS",
      item: "https://ceilow.com/solutions/paie-cnss",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Gestion de Paie et Déclarations CNSS Bénin",
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
    "Édition de fiches de paie conformes à la loi béninoise, calcul automatique des retenues fiscales IPTS/VPS et exports prêts pour la CNSS.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
