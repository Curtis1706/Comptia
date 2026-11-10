import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Gestion de Paie et Déclarations CNSS au Bénin",
  description:
    "Préparez vos fiches de paie conformes au Bénin en quelques minutes : salaires nets, retenues fiscales et cotisations CNSS calculés sans erreur Excel.",
  alternates: {
    canonical: "/solutions/paie-cnss",
  },
  openGraph: {
    title: "Gestion de Paie et Déclarations CNSS au Bénin | Ceilow",
    description:
      "Fiches de paie conformes, calcul des charges sociales et préparation CNSS en quelques clics pour vos salariés.",
    url: "https://ceilow.com/solutions/paie-cnss",
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
      item: "https://ceilow.com/solutions/paie-cnss",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Paie et Déclaration CNSS",
      item: "https://ceilow.com/solutions/paie-cnss",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Gestion de Paie et Déclarations CNSS Bénin",
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
    "Édition de fiches de paie conformes à la loi béninoise, calcul automatique des retenues fiscales IPTS/VPS et exports prêts pour la CNSS.",
};

const faqSchema = buildFaqSchema([
  {
    q: "Le bulletin de paie créé par Ceilow est-il conforme au Code du Travail béninois ?",
    a: "Oui, il contient toutes les mentions obligatoires au Bénin : nom et numéro employeur CNSS, numéro IFU, matricule du salarié, numéro CNSS du salarié, détail des cotisations et solde de congés.",
  },
  {
    q: "Comment se préparent les déclarations e-Cotisations CNSS ?",
    a: "Ceilow prépare en un clic la liste nominative exacte demandée par le portail e-Cotisations de la CNSS Bénin (déclaration trimestrielle avant le 15 sous 20 salariés, ou mensuelle avant le 10 dès 20 salariés), sans tout retaper salarié par salarié.",
  },
  {
    q: "Le calcul de l'IPTS tient-il compte des enfants à charge ?",
    a: "Oui. Ceilow applique le barème officiel de la DGI du Bénin avec les réductions prévues selon les charges de famille déclarées par chaque salarié.",
  },
  {
    q: "Puis-je envoyer les fiches de paie par e-mail ou WhatsApp aux salariés ?",
    a: "Oui, dès que vous validez la paie du mois, chaque employé peut recevoir son bulletin au format PDF par e-mail ou via un lien sécurisé.",
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
