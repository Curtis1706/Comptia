import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Déclarations Fiscales DGI et TVA au Bénin Sans Stress",
  description:
    "Préparez votre TVA mensuelle, votre TPS et vos impôts DGI en temps réel pour déclarer avant le 10 du mois sans majoration de retard. Testez Ceilow.",
  alternates: {
    canonical: "/solutions/declarations-fiscales",
  },
  openGraph: {
    title: "Déclarations Fiscales DGI et TVA Sans Stress au Bénin | Ceilow",
    description:
      "Votre déclaration de TVA et vos bordereaux DGI prêts plusieurs jours avant la date limite du 10 du mois.",
    url: "https://ceilow.com/solutions/declarations-fiscales",
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
      name: "Solutions",
      item: "https://ceilow.com/solutions/declarations-fiscales",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Déclarations Fiscales DGI",
      item: "https://ceilow.com/solutions/declarations-fiscales",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Préparation des Déclarations Fiscales DGI",
  provider: {
    "@type": "Organization",
    name: "Ceilow",
    url: "https://ceilow.com",
  },
  areaServed: {
    "@type": "Country",
    name: "Benin",
  },
  description:
    "Calcul en continu de la TVA due, des acomptes AIB, de la TPS et des états annuels DSF avec alertes avant chaque échéance DGI.",
};

const faqSchema = buildFaqSchema([
  {
    q: "À quelle date doit-on déclarer et payer la TVA au Bénin ?",
    a: "La déclaration et le paiement de la TVA se font au plus tard le 10 de chaque mois pour toutes les opérations du mois précédent sur le portail de la DGI.",
  },
  {
    q: "Comment Ceilow gère-t-il l'AIB (retenue à la source) ?",
    a: "Ceilow sépare automatiquement les montants d'AIB retenus par vos clients (que vous déduirez de votre impôt sur les bénéfices) et les retenues AIB prélevées sur vos prestataires (à reverser à la DGI le 10 du mois).",
  },
  {
    q: "Que se passe-t-il si ma TVA sur achats dépasse ma TVA sur ventes ?",
    a: "Ce surplus forme un crédit de TVA. Ceilow le reporte automatiquement sur le mois suivant pour réduire votre prochain paiement sans calcul manuel.",
  },
  {
    q: "Mon comptable peut-il vérifier les montants avant que je paie ?",
    a: "Oui. Donnez-lui accès à votre dossier ou envoyez-lui le tableau récapitulatif en un clic pour qu'il valide vos chiffres avant votre dépôt sur le portail de la DGI.",
  },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema, faqSchema]} />
      {children}
    </>
  );
}
