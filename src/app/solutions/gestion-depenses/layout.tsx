import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Gestion des Dépenses et Reçus Scannés au Bénin",
  description:
    "Prenez vos reçus et factures fournisseurs en photo : Ceilow lit les montants, récupère votre TVA déductible et archive vos preuves d'achat 10 ans.",
  alternates: {
    canonical: "/solutions/gestion-depenses",
  },
  openGraph: {
    title: "Gestion des Dépenses et Reçus Scannés au Bénin | Ceilow",
    description:
      "Fini les tickets perdus : photographiez vos achats pour récupérer 100 % de votre TVA déductible.",
    url: "https://ceilow.com/solutions/gestion-depenses",
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
      item: "https://ceilow.com/solutions/gestion-depenses",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Gestion des Dépenses",
      item: "https://ceilow.com/solutions/gestion-depenses",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Numérisation des Factures d'Achat et Notes de Frais",
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
    "Capture photo de reçus et factures fournisseurs avec lecture automatique des montants en FCFA, extraction de TVA et archivage légal 10 ans.",
};

const faqSchema = buildFaqSchema([
  {
    q: "Une photo de reçu sur téléphone est-elle valable lors d'un contrôle au Bénin ?",
    a: "Oui, si elle reste parfaitement lisible, datée et sans retouche. Ceilow conserve votre photo originale avec sa date d'enregistrement pendant la durée légale de 10 ans.",
  },
  {
    q: "Comment Ceilow retrouve-t-il la TVA déductible et l'AIB ?",
    a: "La lecture automatique repère la TVA (18 %) et les retenues AIB (1 %, 3 % ou 5 %) imprimées sur la facture du fournisseur. Ces montants alimentent aussitôt votre préparation TVA du mois.",
  },
  {
    q: "Mes salariés en déplacement peuvent-ils envoyer leurs reçus ?",
    a: "Oui, vos collaborateurs prennent en photo leurs reçus de carburant, repas ou transport depuis leur téléphone. Vous validez la dépense avant son passage en comptabilité.",
  },
  {
    q: "Que faire si un ticket papier est froissé ou un peu effacé ?",
    a: "Ceilow surligne les informations incertaines pour que vous puissiez vérifier et corriger un chiffre en un clic avant de valider.",
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
