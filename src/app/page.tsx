import LandingView from "@/views/LandingView";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ceilow — Comptabilité, TVA et Facturation automatisées au Bénin",
  description:
    "Factures certifiées e-MECeF, déclarations TVA, rapprochement bancaire et comptabilité automatisée pour PME et indépendants au Bénin.",
};

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return <LandingView />;
}
