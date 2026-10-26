import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité et Protection des Données",
  description:
    "Découvrez comment Ceilow collecte, protège et traite vos données personnelles conformément aux dispositions légales de l'APDP au Bénin.",
  alternates: {
    canonical: "/confidentialite",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
