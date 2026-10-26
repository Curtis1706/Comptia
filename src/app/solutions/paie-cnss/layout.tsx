import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Gestion de Paie et Déclaration CNSS au Bénin",
  description:
    "Générez vos bulletins de paie conformes au Code du Travail béninois, calculez l'IPTS, la VPS et télétransmettez vos bordereaux de cotisations CNSS.",
  alternates: {
    canonical: "/solutions/paie-cnss",
  },
  openGraph: {
    title: "Gestion de Paie et Déclaration CNSS au Bénin | Ceilow",
    description:
      "Fiches de paie, calcul IPTS/VPS et déclarations CNSS automatisées pour entreprises au Bénin.",
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
  name: "Gestion de Paie et Télétransmissions CNSS",
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
    "Édition de fiches de paie conformes à la législation béninoise, calcul automatique des charges sociales et téléprocédure CNSS.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
