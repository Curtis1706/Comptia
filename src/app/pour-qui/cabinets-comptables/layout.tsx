import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Plateforme Collaborative pour Cabinets d'Expertise Comptable au Bénin",
  description:
    "Collaborez en temps réel avec vos clients : collecte automatisée des pièces, révision des comptes SYSCOHADA, lettrage rapide et exports conformes DGI.",
  alternates: {
    canonical: "/pour-qui/cabinets-comptables",
  },
  openGraph: {
    title: "Portail Collaboratif pour Cabinets Comptables au Bénin | Ceilow",
    description:
      "Supprimez la ressaisie manuelle sur vos dossiers clients et recevez leurs pièces et factures déjà classées en SYSCOHADA.",
    url: "https://ceilow.com/pour-qui/cabinets-comptables",
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
      item: "https://ceilow.com/pour-qui/cabinets-comptables",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Cabinets Comptables",
      item: "https://ceilow.com/pour-qui/cabinets-comptables",
    },
  ],
};

const faqSchema = buildFaqSchema([
  {
    q: "Ceilow remplace-t-il les logiciels comptables habituels du cabinet ?",
    a: "Non, Ceilow facilite la collecte avant votre travail de révision. Il recueille les pièces justificatives, normalise les factures DGI et prépare les écritures SYSCOHADA. Vous exportez ensuite le grand livre et les journaux dans votre logiciel habituel (Sage, Saari, Excel ou FEC) sans ressaisie.",
  },
  {
    q: "Comment sont gérés les accès pour mes collaborateurs ?",
    a: "Votre espace cabinet permet d'inviter chefs de mission et collaborateurs avec des droits précis. Vous attribuez chaque portefeuille client aux bonnes personnes et suivez l'avancement en direct.",
  },
  {
    q: "Le cabinet peut-il regrouper l'abonnement de ses clients ?",
    a: "Oui. L'offre partenaire cabinet vous permet de gérer plusieurs entreprises à tarif dégressif, ou de laisser vos clients s'abonner directement tout en gardant votre accès superviseur gratuit.",
  },
  {
    q: "L'outil respecte-t-il les règles de la profession comptable au Bénin ?",
    a: "Oui. Ceilow suit le plan comptable SYSCOHADA révisé et les exigences de facturation DGI afin d'aider les professionnels du chiffre au Bénin dans la révision et le dépôt annuel.",
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
