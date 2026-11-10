import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Logiciel Comptable SYSCOHADA Automatisé au Bénin",
  description:
    "Gardez vos comptes à jour selon les normes OHADA sans rien saisir à la main : ventes, achats et relevés préparent automatiquement votre bilan annuel.",
  alternates: {
    canonical: "/solutions/comptabilite-syscohada",
  },
  openGraph: {
    title: "Logiciel Comptable SYSCOHADA Automatisé au Bénin | Ceilow",
    description:
      "Pilotez votre comptabilité d'entreprise au Bénin et préparez votre bilan du 30 avril sans ressaisie.",
    url: "https://ceilow.com/solutions/comptabilite-syscohada",
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
      item: "https://ceilow.com/solutions/comptabilite-syscohada",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Comptabilité SYSCOHADA",
      item: "https://ceilow.com/solutions/comptabilite-syscohada",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Comptabilité Automatisée SYSCOHADA Révisé",
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
    "Tenue comptable automatique conforme au plan SYSCOHADA révisé avec accès gratuit pour votre expert-comptable et préparation de la DSF.",
};

const faqSchema = buildFaqSchema([
  {
    q: "Ceilow respecte-t-il le Plan Comptable Général OHADA Révisé ?",
    a: "Oui, à 100%. L'arborescence des comptes de Ceilow est strictement calquée sur l'Acte uniforme relatif au droit comptable et à l'information financière (AUDCIF / SYSCOHADA Révisé). Les comptes de classe 1 à 8 sont préconfigurés pour le contexte béninois.",
  },
  {
    q: "Mon comptable peut-il continuer à utiliser son logiciel habituel ?",
    a: "Absolument. Ceilow ne remplace pas votre expert-comptable, il lui simplifie la vie. Vous pouvez lui créer un accès gratuit ou lui envoyer un export universel (format Excel, CSV ou FEC) directement importable dans ses logiciels (Sage, SARI, Cegid).",
  },
  {
    q: "Comment est calculée la TVA due en fin de mois ?",
    a: "Ceilow compare en temps réel la TVA collectée sur vos factures de vente (compte 443) et la TVA déductible sur vos achats justifiés (compte 445). Le montant net à payer aux impôts avant le 10 du mois est affiché en direct sur votre tableau de bord.",
  },
  {
    q: "Que contient la liasse DSF générée par Ceilow ?",
    a: "La Déclaration Statistique et Fiscale (DSF) regroupe le bilan (actif et passif), le compte de résultat, le tableau des flux de trésorerie et les notes annexes conformes au système normal ou au système allégé OHADA pour votre dépôt annuel au 30 avril.",
  },
  {
    q: "Puis-je verrouiller les écritures après validation ?",
    a: "Oui. Conformément aux principes de l'audit comptable, dès qu'une période est clôturée ou validée, les écritures sont définitivement figées dans un journal horodaté infalsifiable pour prévenir tout risque de double écriture ou de modification frauduleuse.",
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
