import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Déclarations Fiscales DGI et TVA au Bénin Sans Stress",
  description:
    "Préparez votre TVA mensuelle, votre TPS et vos impôts DGI en temps réel pour déclarer avant le 10 du mois sans majoration de retard. Testez Ceilow.",
  alternates: {
    canonical: "/solutions/declarations-fiscales",
  },
  openGraph: {
    title: "Déclarations Fiscales DGI et TVA Sans Stress au Bénin | Ceilow",
    description:
      "Votre déclaration de TVA et vos bordereaux DGI prêts plusieurs jours avant la date limite du 10 du mois.",
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
  name: "Préparation des Déclarations Fiscales DGI",
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
    "Calcul en continu de la TVA due, des acomptes AIB, de la TPS et des états annuels DSF avec alertes avant chaque échéance DGI.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
