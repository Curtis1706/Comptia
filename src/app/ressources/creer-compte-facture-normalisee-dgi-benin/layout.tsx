import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Créer son Compte Facture Normalisée DGI au Bénin : Guide 2026",
  description:
    "Comment créer son compte e-MECeF et démarrer la facture normalisée au Bénin : démarches DGI, choix du SFE certifié sans boîtier et émission de votre première facture.",
  alternates: {
    canonical: "/ressources/creer-compte-facture-normalisee-dgi-benin",
  },
  openGraph: {
    title: "Comment Créer son Compte pour Facture Normalisée en Ligne au Bénin | Ceilow",
    description:
      "Nouveau chef d'entreprise ou commerçant au Bénin : suivez le guide officiel pour obtenir vos accès e-MECeF et émettre vos factures avec QR code DGI en quelques minutes.",
    url: "https://ceilow.com/ressources/creer-compte-facture-normalisee-dgi-benin",
    type: "article",
    images: [
      {
        url: "/images/ressources/guide-emecef-benin.jpg",
        width: 1200,
        height: 800,
        alt: "Création de compte de facturation normalisée e-MECeF DGI pour entreprise au Bénin",
      },
    ],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://ceilow.com/ressources/creer-compte-facture-normalisee-dgi-benin#article",
  headline: "Comment créer un compte et démarrer la facture normalisée DGI en ligne au Bénin",
  description:
    "Guide pratique d'onboarding pour obtenir ses identifiants e-MECeF auprès de la DGI, paramétrer son logiciel de caisse et émettre des factures normalisées conformes.",
  image: "https://ceilow.com/images/ressources/guide-emecef-benin.jpg",
  inLanguage: "fr-BJ",
  author: {
    "@type": "Organization",
    name: "Équipe Onboarding et Fiscalité Ceilow",
    url: "https://ceilow.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Ceilow",
    logo: {
      "@type": "ImageObject",
      url: "https://ceilow.com/logo/picto_ceilow_web_jaune.svg",
    },
  },
  datePublished: "2026-11-26T08:00:00+01:00",
  dateModified: "2026-11-26T08:00:00+01:00",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://ceilow.com/ressources/creer-compte-facture-normalisee-dgi-benin",
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
      name: "Ressources",
      item: "https://ceilow.com/ressources",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Créer son Compte Facture Normalisée",
      item: "https://ceilow.com/ressources/creer-compte-facture-normalisee-dgi-benin",
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment créer son compte et démarrer la facture normalisée DGI au Bénin",
  description:
    "Les étapes obligatoires pour s'enrôler sur le dispositif e-MECeF de la DGI Bénin et commencer à facturer légalement.",
  totalTime: "PT15M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Obtenir son numéro IFU actif",
      text: "Vérifiez que votre entreprise dispose d'un Identifiant Fiscal Unique (IFU) à 13 chiffres délivré par l'ANAPI ou la DGI.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choisir une solution SFE en ligne sans machine physique",
      text: "Optez pour un logiciel homologué comme Ceilow pour éviter l'achat d'un boîtier matériel coûteux à rouleaux de papier.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Générer vos jetons d'accès e-MECeF auprès de la DGI",
      text: "Connectez-vous sur votre espace fiscal ou suivez l'assistant Ceilow pour lier votre compte à la machine virtuelle de la DGI.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Configurer vos groupes fiscaux et coordonnées",
      text: "Renseignez vos informations d'entreprise, votre logo, et sélectionnez vos groupes de taxation (Groupe B pour TVA 18 %, Groupe E pour TPS).",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Émettre votre première facture certifiée avec QR code",
      text: "Créez une facture test, validez-la en direct avec la DGI et vérifiez le code QR avec l'application mobile MECeF Bénin.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Faut-il payer la DGI pour créer un compte de facturation normalisée ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. L'accès à la plateforme e-MECeF et l'attribution des jetons de connexion API par la DGI sont entièrement gratuits. Vous n'avez à payer que votre abonnement au logiciel de facturation choisi (comme Ceilow) sans aucun frais de licence d'État.",
      },
    },
    {
      "@type": "Question",
      name: "Une nouvelle entreprise individuelle peut-elle facturer dès le premier jour ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Dès que vous recevez votre numéro IFU (généralement obtenu en 24h à 48h lors de la création d'entreprise à l'APIEx / ANAPI), vous pouvez ouvrir votre compte Ceilow et émettre immédiatement des factures normalisées conformes pour vos clients.",
      },
    },
    {
      "@type": "Question",
      name: "Doit-on obligatoirement acheter une machine physique chez un fournisseur ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non, l'achat d'une machine physique n'est plus du tout obligatoire depuis le lancement de l'e-MECeF. Vous pouvez utiliser votre smartphone, votre tablette ou votre ordinateur avec une application en ligne comme Ceilow, qui génère des factures électroniques en PDF avec le QR code officiel.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles sont les mentions obligatoires sur la première facture normalisée ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La facture doit afficher : votre raison sociale et adresse, votre numéro IFU, le nom et l'IFU du client (si professionnel), le détail des articles avec leur groupe fiscal (A à F), le montant HT, le montant de la TVA/TPS, le montant TTC, le numéro NIM, le code de sécurité MECeF à 24 caractères et le QR code officiel.",
      },
    },
  ],
};

export default function CreerCompteFactureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema, howToSchema, faqSchema]} />
      {children}
    </>
  );
}
