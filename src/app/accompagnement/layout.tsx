import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Accompagnement, Formation et Support Dédié à Cotonou",
  description:
    "Bénéficiez d'une équipe locale basée à Cotonou pour installer votre plateforme, former vos collaborateurs et répondre à toutes vos questions comptables et fiscales.",
  alternates: {
    canonical: "/accompagnement",
  },
  openGraph: {
    title: "Accompagnement et Support Local à Cotonou | Ceilow",
    description:
      "Une équipe d'experts dédiée pour déployer et maîtriser Ceilow au sein de votre entreprise.",
    url: "https://ceilow.com/accompagnement",
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
      name: "Accompagnement",
      item: "https://ceilow.com/accompagnement",
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
