import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un Compte",
  description: "Créez votre compte d'entreprise sur la plateforme Ceilow.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
