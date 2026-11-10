import type { Metadata } from "next";
import NotFound from "@/views/NotFound";

export const metadata: Metadata = {
  title: "Page introuvable (404)",
  description:
    "La page demandée n'existe pas ou a été déplacée. Retrouvez nos guides fiscaux, tarifs et outils Ceilow au Bénin.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundPage() {
  return <NotFound />;
}
