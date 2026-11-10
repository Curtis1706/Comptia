import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Facturation Normalisée e-MECeF au Bénin Sans Machine",
  description:
    "Créez vos factures officielles avec QR code DGI en 3 secondes depuis votre téléphone ou ordinateur. Sans machine physique à acheter. Essayez gratuitement Ceilow.",
  alternates: {
    canonical: "/solutions/facturation-dgi",
  },
  openGraph: {
    title: "Facturation Normalisée e-MECeF Sans Machine au Bénin | Ceilow",
    description:
      "Émettez des factures officielles avec QR code DGI depuis votre mobile ou navigateur web en toute conformité.",
    url: "https://ceilow.com/solutions/facturation-dgi",
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
      item: "https://ceilow.com/solutions/facturation-dgi",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Facturation DGI e-MECeF",
      item: "https://ceilow.com/solutions/facturation-dgi",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Facturation Normalisée e-MECeF Sans Machine Physique",
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
    "Émission directe de factures normalisées avec QR code et signature officielle DGI e-MECeF depuis votre navigateur ou téléphone.",
};

const faqSchema = buildFaqSchema([
  {
    q: "Qu'est-ce qu'une facture normalisée e-MECeF au Bénin ?",
    a: "C'est une facture officielle contenant les éléments de sécurité délivrés par la Direction Générale des Impôts (DGI) : un QR code vérifiable, un numéro d'identification (NIM), des compteurs fiscaux et une signature électronique. Elle prouve que la vente est bien déclarée.",
  },
  {
    q: "Ai-je besoin d'acheter une machine physique e-MECeF ?",
    a: "Non. Ceilow remplace les boîtiers physiques coûteux. La plateforme est reliée directement aux serveurs e-MECeF de la DGI. Vous créez vos factures depuis votre téléphone ou votre ordinateur, sans aucun matériel à acheter.",
  },
  {
    q: "Que risque mon entreprise si j'émets une facture non normalisée ?",
    a: "Le Code Général des Impôts prévoit de lourdes amendes financières en cas d'infraction, ainsi que le rejet de la TVA déductible pour vos clients lors d'un contrôle. Avec Ceilow, chaque facture est certifiée dès sa création.",
  },
  {
    q: "Combien de temps prend la création du QR code officiel ?",
    a: "Quelques secondes seulement. Dès que vous validez la facture, Ceilow envoie les données à la DGI et ajoute automatiquement le QR code officiel sur votre document.",
  },
  {
    q: "Puis-je annuler ou corriger une facture déjà certifiée ?",
    a: "Oui, simplement. Selon la règle DGI, une facture déjà émise ne s'efface pas : Ceilow crée en un clic une facture d'avoir normalisée qui corrige ou annule la facture d'origine.",
  },
  {
    q: "Comment mes clients reçoivent-ils leurs factures ?",
    a: "Vous téléchargez la facture au format PDF prête à imprimer, ou vous l'envoyez directement par e-mail ou par WhatsApp.",
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
