import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Logiciel Comptable SYSCOHADA Révisé au Bénin",
  description:
    "Tenez votre comptabilité conforme au plan SYSCOHADA révisé : grand livre, balance, écritures automatisées et génération de la DSF sans ressaisie.",
  alternates: {
    canonical: "/solutions/comptabilite-syscohada",
  },
  openGraph: {
    title: "Logiciel Comptable SYSCOHADA Révisé au Bénin | Ceilow",
    description:
      "Automatisez votre comptabilité d'entreprise selon les normes SYSCOHADA et UEMOA au Bénin.",
    url: "https://ceilow.com/solutions/comptabilite-syscohada",
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
      item: "https://ceilow.com/solutions/comptabilite-syscohada",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Comptabilité SYSCOHADA",
      item: "https://ceilow.com/solutions/comptabilite-syscohada",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Comptabilité SYSCOHADA Révisé",
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
    "Tenue comptable automatisée conforme au plan comptable général OHADA/SYSCOHADA révisé et préparation de la Déclaration Statistique et Fiscale (DSF).",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
