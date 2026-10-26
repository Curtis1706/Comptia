import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion à votre Espace",
  description: "Connectez-vous à votre espace de gestion financière et comptable Ceilow.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
