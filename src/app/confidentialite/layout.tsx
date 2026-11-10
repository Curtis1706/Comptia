import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, buildBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Politique de Confidentialité et Protection des Données",
  description:
    "Découvrez comment Ceilow collecte, protège et traite vos données personnelles conformément aux dispositions légales de l'APDP au Bénin.",
  alternates: {
    canonical: "/confidentialite",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Accueil", item: SITE_URL },
  { name: "Politique de Confidentialité", item: `${SITE_URL}/confidentialite` },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
