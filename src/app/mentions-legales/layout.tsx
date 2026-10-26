import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales et Informations d'Édition",
  description:
    "Informations légales relatives à l'éditeur de la plateforme Ceilow, immatriculation au RCCM, hébergement et coordonnées officielles à Cotonou.",
  alternates: {
    canonical: "/mentions-legales",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
