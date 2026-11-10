import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Sécurité des Données et Conformité APDP au Bénin",
  description:
    "Vos chiffres d'entreprise protégés chaque jour : chiffrement sécurisé, copies automatiques et respect strict de la loi béninoise sur les données (APDP).",
  alternates: {
    canonical: "/securite-et-apdp",
  },
  openGraph: {
    title: "Sécurité des Données et Conformité APDP au Bénin | Ceilow",
    description:
      "Vos factures et comptes restent votre propriété exclusive, chiffrés et sauvegardés automatiquement.",
    url: "https://ceilow.com/securite-et-apdp",
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
      name: "Sécurité et APDP",
      item: "https://ceilow.com/securite-et-apdp",
    },
  ],
};

const faqSchema = buildFaqSchema([
  {
    q: "Mes données comptables appartiennent-elles à Ceilow ou à mon entreprise ?",
    a: "Vos données appartiennent à 100 % à votre entreprise. Vous pouvez exporter à tout moment vos journaux, vos factures DGI en PDF et vos relevés au format Excel sans aucun frais.",
  },
  {
    q: "Que se passe-t-il si je décide d'arrêter mon abonnement ?",
    a: "Vous récupérez librement toutes vos archives (journaux, grand livre, factures DGI, justificatifs) avant votre départ. Vos données sont ensuite supprimées sur demande.",
  },
  {
    q: "L'équipe de Ceilow peut-elle voir mes factures et mes comptes ?",
    a: "Non. Nos équipes n'accèdent pas au contenu de votre comptabilité, sauf si vous autorisez explicitement une intervention d'assistance pour résoudre un problème technique précis.",
  },
  {
    q: "Que devient mon travail en cas de coupure d'électricité ou de réseau à Cotonou ?",
    a: "Vos comptes sont hébergés sur des serveurs sécurisés protégés par des systèmes de secours électriques. Même si votre bureau subit une coupure, vos données sont en sécurité et prêtes dès que vous vous reconnectez.",
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
