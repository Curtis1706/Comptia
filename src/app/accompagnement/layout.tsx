import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Accompagnement, Formation et Support Dédié à Cotonou",
  description:
    "Bénéficiez d'une équipe locale basée à Cotonou pour installer votre plateforme, former vos collaborateurs et répondre à toutes vos questions comptables et fiscales.",
  alternates: {
    canonical: "/accompagnement",
  },
  openGraph: {
    title: "Accompagnement et Support Local à Cotonou | Ceilow",
    description:
      "Une équipe d'experts dédiée pour déployer et maîtriser Ceilow au sein de votre entreprise.",
    url: "https://ceilow.com/accompagnement",
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
      name: "Accompagnement",
      item: "https://ceilow.com/accompagnement",
    },
  ],
};

const faqSchema = buildFaqSchema([
  {
    q: "En quoi consiste concrètement l'accompagnement Ceilow ?",
    a: "C'est l'alliance d'un outil de gestion moderne et d'un conseiller dédié basé à Cotonou. Nous reprenons vos anciens dossiers, configurons votre compte, formons votre équipe et restons joignables par WhatsApp ou appel pour répondre à toutes vos questions fiscales et comptables.",
  },
  {
    q: "Je n'y connais rien en gestion, vais-je m'en sortir ?",
    a: "C'est précisément pour cela que nous sommes là. Vous n'avez aucun calcul à faire : vos encaissements et vos dépenses sont enregistrés simplement, et votre conseiller dédié vérifie régulièrement que tout est en ordre pour que vous n'ayez aucun souci.",
  },
  {
    q: "Combien de temps faut-il pour démarrer ?",
    a: "Moins de 48 heures. Dès votre premier échange, votre conseiller configure vos accès et vos modèles de factures. Si vous avez des fichiers existants, nous les importons pour que vous puissiez facturer et encaisser dès le jour même.",
  },
  {
    q: "Comment se passe la reprise de mes anciennes factures et fichiers ?",
    a: "Vous n'avez rien à recopier à la main. Vous nous envoyez simplement vos tableaux Excel, vos photos de factures ou vos anciens relevés : notre équipe à Cotonou s'occupe d'intégrer l'ensemble de votre historique sans surcoût.",
  },
  {
    q: "J'ai déjà un cabinet ou un comptable, dois-je en changer ?",
    a: "Non, absolument pas. Ceilow lui fait gagner du temps sans changer vos habitudes : nous lui créons un accès gratuit pour qu'il consulte vos chiffres et récupère des exports comptables propres à tout moment, sans vous déranger.",
  },
  {
    q: "Mes factures sont-elles immédiatement en règle avec la DGI ?",
    a: "Oui, à 100 %. Chaque facture générée sur Ceilow reçoit automatiquement son QR code et sa signature officielle certifiée par la Direction Générale des Impôts (e-MECeF). Vous êtes protégé contre tout risque de pénalité.",
  },
  {
    q: "Pouvez-vous venir dans mes bureaux à Cotonou ?",
    a: "Oui, tout à fait. Nos conseillers se déplacent directement dans vos locaux (Cotonou, Calavi, Porto-Novo et environs) pour installer l'application, former votre secrétaire ou faire le point sur votre organisation.",
  },
  {
    q: "Suis-je engagé sur la durée ?",
    a: "Aucun engagement. Vous êtes libre d'interrompre votre abonnement quand vous le souhaitez en un clic. Vos données restent votre entière propriété et vous pouvez les exporter librement à tout moment.",
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
