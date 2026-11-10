import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, buildBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Mentions Légales et Informations d'Édition",
  description:
    "Informations légales relatives à l'éditeur de la plateforme Ceilow, immatriculation au RCCM, hébergement et coordonnées officielles à Cotonou.",
  alternates: {
    canonical: "/mentions-legales",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Accueil", item: SITE_URL },
  { name: "Mentions Légales", item: `${SITE_URL}/mentions-legales` },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
