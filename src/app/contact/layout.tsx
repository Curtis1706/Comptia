import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Contactez l'Équipe Ceilow à Cotonou : WhatsApp",
  description:
    "Une question sur vos factures DGI ou nos tarifs ? Écrivez directement à notre équipe basée à Cotonou sur WhatsApp (+229 01 97 55 49 53) ou par message.",
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
  name: "Ceilow",
  description:
    "Logiciel de comptabilité SYSCOHADA, facturation normalisée e-MECeF DGI et paie CNSS au Bénin, édité par Digiplex Agency (RCCM RB/PNO/26 B 7147).",
  image: "https://ceilow.com/images/equipe-support-cotonou.jpg",
  telephone: "+2290197554953",
  email: "contact@ceilow.com",
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
      opens: "08:00",
      closes: "18:30",
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

const faqSchema = buildFaqSchema([
  {
    q: "Dans quel délai l'équipe Ceilow répond-elle aux demandes ?",
    a: "Du lundi au vendredi, de 8h00 à 18h30 (heure de Cotonou), notre équipe vous répond par WhatsApp ou e-mail sous 2 heures ouvrables maximum.",
  },
  {
    q: "Proposez-vous des démonstrations dans nos bureaux à Cotonou ?",
    a: "Oui. Pour les entreprises et cabinets situés à Cotonou, Calavi et Porto-Novo, un conseiller peut se déplacer dans vos locaux pour une démonstration sur vos cas réels.",
  },
  {
    q: "Pouvez-vous nous aider à paramétrer notre compte au départ ?",
    a: "Oui. Un conseiller dédié vous aide étape par étape à créer votre dossier, connecter votre entreprise à la DGI et importer vos clients et articles.",
  },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[localBusinessSchema, breadcrumbSchema, faqSchema]} />
      {children}
    </>
  );
}
