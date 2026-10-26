import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Déclarations Fiscales DGI : TVA, TPS, AIB et DSF au Bénin",
  description:
    "Préparez et télétransmettez vos déclarations fiscales béninoises sans risque d'erreur : pré-remplissage TVA, calcul TPS, retenues AIB et liasse fiscale DSF.",
  alternates: {
    canonical: "/solutions/declarations-fiscales",
  },
  openGraph: {
    title: "Déclarations Fiscales DGI : TVA, TPS, AIB et DSF au Bénin | Ceilow",
    description:
      "Automatisation des déclarations fiscales et conformité DGI pour entreprises au Bénin.",
    url: "https://ceilow.com/solutions/declarations-fiscales",
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
      item: "https://ceilow.com/solutions/declarations-fiscales",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Déclarations Fiscales DGI",
      item: "https://ceilow.com/solutions/declarations-fiscales",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Déclarations Fiscales et Télétransmissions DGI",
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
    "Préparation automatisée des déclarations périodiques (TVA, TPS, AIB) et de la déclaration statistique et fiscale (DSF) pour la DGI Bénin.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
