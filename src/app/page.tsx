import LandingView from "@/views/LandingView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comptia — La comptabilité intelligente pour les PME",
  description:
    "Facturation, comptabilité, rapprochement bancaire, TVA et reporting. Tout-en-un, cloud, sécurisé et 100% français.",
};

export default function HomePage() {
  return <LandingView />;
}
