import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Logiciel de Gestion pour PME, Commerçants et Indépendants au Bénin",
  description:
    "Gagnez du temps sur votre gestion quotidienne : factures certifiées e-MECeF en 3 clics, encaissements Mobile Money, suivi des impôts et zéro jargon comptable.",
  alternates: {
    canonical: "/pour-qui/pme-et-independants",
  },
  openGraph: {
    title: "Logiciel de Gestion pour PME, Commerçants et Indépendants au Bénin | Ceilow",
    description:
      "Facturation DGI, encaissements MoMo et gestion financière simplifiée pour dirigeants de PME au Bénin.",
    url: "https://ceilow.com/pour-qui/pme-et-independants",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: "https://ceilow.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pour qui",
      item: "https://ceilow.com/pour-qui/pme-et-independants",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "PME et Indépendants",
      item: "https://ceilow.com/pour-qui/pme-et-independants",
    },
  ],
};

const faqSchema = buildFaqSchema([
  {
    q: "Ai-je besoin de savoir compter ou de connaître la comptabilité pour utiliser Ceilow ?",
    a: "Non, aucune connaissance comptable n'est demandée. Ceilow est pensé pour les commerçants, prestataires et dirigeants de PME : vous faites vos devis et factures en français clair, et la comptabilité se met à jour toute seule.",
  },
  {
    q: "Dois-je acheter une machine physique e-MECeF en plus de Ceilow ?",
    a: "Non. Notre plateforme est reliée directement aux serveurs officiels de la DGI. Vos factures reçoivent leur QR code et leur signature officielle sans acheter de matériel coûteux.",
  },
  {
    q: "Puis-je facturer depuis mon téléphone quand je suis chez un client ?",
    a: "Oui. Ceilow fonctionne sur n'importe quel smartphone connecté à Internet. Vous créez la facture, elle est certifiée par la DGI et vous l'envoyez par WhatsApp ou e-mail en quelques clics.",
  },
  {
    q: "Que se passe-t-il si j'ai une question ou si je suis bloqué ?",
    a: "Notre équipe d'assistance est basée à Cotonou. Vous nous contactez directement par téléphone ou WhatsApp pour obtenir une réponse rapide.",
  },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema]} />
      {children}
    </>
  );
}
