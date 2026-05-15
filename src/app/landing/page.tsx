import LandingView from "@/views/LandingView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comptia - L'intelligence artificielle au service de votre comptabilité",
  description: "Automatisez votre comptabilité, gérez vos factures et analysez vos flux financiers en temps réel avec l'IA de Comptia.",
  keywords: ["comptabilité", "IA", "SaaS", "finance", "automatisation", "entreprises"],
  openGraph: {
    title: "Comptia.ai - Comptabilité Intelligente",
    description: "L'IA qui révolutionne la gestion financière des entreprises.",
    type: "website",
  }
};

export default function LandingPage() {
  return <LandingView />;
}
