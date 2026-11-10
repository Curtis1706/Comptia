import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Tarifs et Abonnements Transparents en Francs CFA (XOF)",
  description:
    "Consultez nos forfaits adaptés aux indépendants, PME et cabinets au Bénin. Facturation e-MECeF illimitée, conformité fiscale et sans frais cachés.",
  alternates: {
    canonical: "/tarifs",
  },
  openGraph: {
    title: "Tarifs et Forfaits Ceilow au Bénin | Sans Frais Cachés",
    description:
      "Abonnements transparents en Francs CFA pour automatiser votre gestion au Bénin.",
    url: "https://ceilow.com/tarifs",
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
      name: "Tarifs",
      item: "https://ceilow.com/tarifs",
    },
  ],
};

const faqSchema = buildFaqSchema([
  {
    q: "Puis-je vraiment tester Ceilow sans payer et sans carte bancaire ?",
    a: "Absolument. Vous pouvez démarrer soit sur le Plan Gratuit (sans limite de durée, 10 factures e-MECeF par mois), soit activer 14 jours d'essai gratuit sur le Plan Pro. Aucun moyen de paiement ni carte bancaire n'est requis à l'inscription.",
  },
  {
    q: "Quels sont les moyens de paiement acceptés pour régler mon abonnement ?",
    a: "Nous prenons en charge l'ensemble des moyens de paiement usuels en République du Bénin : MTN Mobile Money, Moov Money, ainsi que les cartes bancaires internationales (Visa, Mastercard). Les règlements par virement bancaire local sont acceptés pour les abonnements annuels Entreprise.",
  },
  {
    q: "Suis-je engagé sur la durée ?",
    a: "Non. Nos abonnements mensuels sont sans aucun engagement. Vous pouvez suspendre ou résilier votre compte directement depuis vos paramètres en un clic, à n'importe quel moment, sans pénalité ni justification.",
  },
  {
    q: "Que se passe-t-il si je dépasse les 10 factures du Plan Gratuit ?",
    a: "Dès que vous atteignez le seuil mensuel de 10 factures normalisées, la plateforme vous invite à basculer vers le Plan Pro pour poursuivre votre facturation sans blocage. Vos données et factures antérieures restent quant à elles toujours accessibles.",
  },
  {
    q: "Les factures de mon abonnement Ceilow sont-elles déductibles de mes impôts au Bénin ?",
    a: "Oui, entièrement. Ceilow SAS est une société de droit béninois immatriculée au RCCM de Cotonou avec un IFU valide. Chaque paiement donne lieu à l'émission automatique d'une facture normalisée certifiée DGI e-MECeF, pleinement déductible de votre résultat fiscal.",
  },
  {
    q: "Comment fonctionne le tarif dégressif pour les cabinets comptables ?",
    a: "Nous proposons aux cabinets comptables un portail multi-entreprises avec tarif dégressif par paliers (3 à 5, 20, 50+ dossiers), permettant jusqu'à 50 % de remise sur le tarif unitaire mensuel.",
  },
  {
    q: "Mes données restent-elles accessibles si j'arrête mon abonnement ?",
    a: "Oui. Conformément aux règles APDP au Bénin et aux obligations OHADA, toutes vos données (écritures comptables, factures e-MECeF, reçus) restent exportables au format Excel, PDF ou FEC avant la fermeture de votre dossier.",
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
