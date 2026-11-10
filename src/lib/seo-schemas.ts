/**
 * Helpers centralisés Schema.org (JSON-LD) pour l'écosystème SEO / GEO Ceilow.
 * Domaine canonique unique : https://ceilow.com
 */

export const SITE_URL = "https://ceilow.com";

export interface FaqItemSchemaInput {
  q: string;
  a: string;
}

export interface BreadcrumbItemSchemaInput {
  name: string;
  item: string;
}

export const organizationSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Ceilow",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo/picto_ceilow_web_jaune.svg`,
  },
  description:
    "Plateforme SaaS de gestion financière, comptabilité SYSCOHADA, facturation normalisée DGI e-MECeF, paie CNSS et suivi Mobile Money pour entreprises et cabinets au Bénin.",
  email: "contact@ceilow.com",
  telephone: "+2290197554953",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cotonou",
    addressRegion: "Littoral",
    addressCountry: "BJ",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+2290197554953",
      email: "contact@ceilow.com",
      contactType: "customer support",
      areaServed: "BJ",
      availableLanguage: ["French"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+2290162789305",
      contactType: "sales",
      areaServed: "BJ",
      availableLanguage: ["French"],
    },
  ],
};

export const websiteSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Ceilow",
  url: SITE_URL,
  inLanguage: "fr-BJ",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/ressources?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function buildFaqSchema(
  faqs: FaqItemSchemaInput[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  items: BreadcrumbItemSchemaInput[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

