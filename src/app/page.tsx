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

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://ceilow.com/#webapp",
  name: "Ceilow",
  url: "https://ceilow.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All modern web browsers",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  publisher: {
    "@id": "https://ceilow.com/#organization",
  },
  offers: {
    "@type": "Offer",
    price: "15000",
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
      <JsonLd data={webAppSchema} />
      <LandingView />
    </>
  );
}

