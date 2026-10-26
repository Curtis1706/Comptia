import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation (CGU)",
  description:
    "Consultez les conditions générales d'utilisation de la plateforme de gestion financière et comptable Ceilow au Bénin.",
  alternates: {
    canonical: "/cgu",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
