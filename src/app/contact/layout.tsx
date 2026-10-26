import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Contactez l'Équipe Ceilow à Cotonou : WhatsApp et Formulaire",
  description:
    "Échangez directement avec nos conseillers basés à Cotonou via WhatsApp (+229 01 97 55 49 53) ou via notre formulaire pour une démonstration personnalisée.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contacter l'Équipe Ceilow à Cotonou | Support et Démonstration",
    description:
      "Conseils personnalisés, démonstration gratuite et assistance technique au Bénin.",
    url: "https://ceilow.com/contact",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://ceilow.com/#localbusiness",
  name: "Ceilow Bénin",
  image: "https://ceilow.com/images/equipe-support-cotonou.jpg",
  telephone: "+2290197554953",
  url: "https://ceilow.com/contact",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cotonou",
    addressRegion: "Littoral",
    addressCountry: "BJ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 6.3572,
    longitude: 2.4183,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "18:00",
    },
  ],
  priceRange: "$$",
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
      name: "Contact",
      item: "https://ceilow.com/contact",
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[localBusinessSchema, breadcrumbSchema]} />
      {children}
    </>
  );
}
