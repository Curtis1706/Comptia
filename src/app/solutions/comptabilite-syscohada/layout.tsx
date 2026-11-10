import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Logiciel Comptable SYSCOHADA Automatisé au Bénin",
  description:
    "Gardez vos comptes à jour selon les normes OHADA sans rien saisir à la main : ventes, achats et relevés préparent automatiquement votre bilan annuel.",
  alternates: {
    canonical: "/solutions/comptabilite-syscohada",
  },
  openGraph: {
    title: "Logiciel Comptable SYSCOHADA Automatisé au Bénin | Ceilow",
    description:
      "Pilotez votre comptabilité d'entreprise au Bénin et préparez votre bilan du 30 avril sans ressaisie.",
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
  name: "Comptabilité Automatisée SYSCOHADA Révisé",
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
    "Tenue comptable automatique conforme au plan SYSCOHADA révisé avec accès gratuit pour votre expert-comptable et préparation de la DSF.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      {children}
    </>
  );
}
