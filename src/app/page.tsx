import LandingView from "@/views/LandingView";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Ceilow : Comptabilité, TVA et Facturation automatisées au Bénin",
  description:
    "Factures certifiées e-MECeF, déclarations TVA, rapprochement bancaire et comptabilité automatisée pour PME et indépendants au Bénin.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://ceilow.com/#organization",
  name: "Ceilow",
  url: "https://ceilow.com",
  logo: "https://ceilow.com/logo/picto_ceilow_web_jaune.svg",
  description:
    "Plateforme SaaS de gestion financière et comptable pour entreprises et professionnels au Bénin : facturation certifiée e-MECeF, comptabilité SYSCOHADA et suivi de trésorerie Mobile Money.",
  email: "contact@ceilow.com",
  telephone: "+2290197554953",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cotonou",
    addressRegion: "Littoral",
    addressCountry: "BJ",
  },
  sameAs: ["https://www.linkedin.com/company/ceilow"],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://ceilow.com/#webapp",
  name: "Ceilow",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All modern web browsers",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    priceCurrency: "XOF",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Facturation normalisée e-MECeF DGI Bénin",
    "Comptabilité automatisée SYSCOHADA révisé",
    "Rapprochement bancaire MTN MoMo et Moov Money",
    "Déclarations fiscales TVA, TPS et DSF",
    "Gestion des bulletins de paie et cotisations CNSS",
  ],
};

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <JsonLd data={[organizationSchema, webAppSchema]} />
      <LandingView />
    </>
  );
}

