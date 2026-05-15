import LandingView from "@/views/LandingView";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Comptia — La comptabilité intelligente pour les PME",
  description:
    "Facturation, comptabilité, rapprochement bancaire, TVA et reporting. Tout-en-un, cloud, sécurisé et 100% français.",
};

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return <LandingView />;
}
