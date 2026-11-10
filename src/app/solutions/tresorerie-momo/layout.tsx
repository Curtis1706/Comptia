import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Rapprochement Bancaire et Mobile Money au Bénin",
  description:
    "Suivez vos paiements MTN MoMo, Moov Money et comptes bancaires au même endroit : chaque encaissement est associé à sa facture sans pointage manuel.",
  alternates: {
    canonical: "/solutions/tresorerie-momo",
  },
  openGraph: {
    title: "Rapprochement Bancaire et Trésorerie Mobile Money | Ceilow",
    description:
      "Sachez exactement combien il vous reste sur vos comptes MoMo, Moov et banques sans écart de caisse.",
    url: "https://ceilow.com/solutions/tresorerie-momo",
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
      item: "https://ceilow.com/solutions/tresorerie-momo",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Trésorerie et Mobile Money",
      item: "https://ceilow.com/solutions/tresorerie-momo",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Suivi de Trésorerie Banques et Mobile Money",
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
    "Suivi en temps réel des paiements MTN MoMo, Moov Money et comptes bancaires avec association automatique aux factures clients.",
};

const faqSchema = buildFaqSchema([
  {
    q: "Comment Ceilow récupère-t-il les relevés MTN MoMo et Moov Money ?",
    a: "Vous pouvez importer directement vos exports marchands MoMo et Moov en format Excel/CSV ou connecter votre passerelle de paiement en toute sécurité. Ceilow analyse chaque ligne, identifie l'expéditeur et isole le montant net et les frais d'opérateur.",
  },
  {
    q: "Quelles sont les banques compatibles au Bénin ?",
    a: "Ceilow prend en charge les relevés de toutes les banques commerciales exerçant au Bénin (BOA Bénin, Ecobank, Coris Bank, BGFI, Société Générale, NSIA, UBA, etc.) via l'importation sécurisée de vos extraits de compte au format standardisé.",
  },
  {
    q: "Que se passe-t-il en cas de paiement partiel ou avec frais déduits ?",
    a: "Ceilow repère automatiquement les écarts liés aux frais Mobile Money (1 % à 2 %) et vous propose de les enregistrer directement en frais bancaires (compte 631) sans bloquer le suivi de la facture.",
  },
  {
    q: "Mon comptable peut-il exporter ces rapprochements ?",
    a: "Oui, à tout moment. Vos encaissements validés s'enregistrent automatiquement dans vos journaux de banque et de caisse SYSCOHADA, prêts pour l'export ou le bilan annuel.",
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
