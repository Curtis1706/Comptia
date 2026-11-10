import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, buildBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation (CGU)",
  description:
    "Consultez les conditions générales d'utilisation de la plateforme de gestion financière et comptable Ceilow au Bénin.",
  alternates: {
    canonical: "/cgu",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Accueil", item: SITE_URL },
  { name: "Conditions Générales d'Utilisation", item: `${SITE_URL}/cgu` },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
