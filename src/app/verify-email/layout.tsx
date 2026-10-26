import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vérification de votre Adresse E-mail",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
