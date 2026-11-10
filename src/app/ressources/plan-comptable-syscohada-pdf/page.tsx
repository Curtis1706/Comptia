"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  HelpCircle,
  Printer,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { trackEvent } from "@/lib/analytics";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type ClassId = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

interface SyscohadaAccountRow {
  code: string;
  name: string;
  classe: ClassId;
  roleSimple: string;
}

interface ClassSummary {
  classe: ClassId;
  titre: string;
  typeBilan: string;
  explicationSimple: string;
}

const SYSCOHADA_CLASSES: ClassSummary[] = [
  {
    classe: "1",
    titre: "Ressources durables",
    typeBilan: "Passif du bilan",
    explicationSimple: "L'argent investi au départ par les associés, les bénéfices conservés et les emprunts bancaires à long terme.",
  },
  {
    classe: "2",
    titre: "Biens durables (Actif immobilisé)",
    typeBilan: "Actif du bilan",
    explicationSimple: "Tout ce que l'entreprise garde plus d'un an pour travailler : terrains, locaux, véhicules, ordinateurs, cautions.",
  },
  {
    classe: "3",
    titre: "Stocks",
    typeBilan: "Actif du bilan",
    explicationSimple: "Les marchandises prêtes à être vendues, les matières premières et les fournitures en magasin.",
  },
  {
    classe: "4",
    titre: "Clients, fournisseurs et impôts (Tiers)",
    typeBilan: "Actif ou Passif",
    explicationSimple: "Ce que vos clients doivent vous payer, ce que vous devez aux fournisseurs, aux salariés, à la CNSS et à la DGI.",
  },
  {
    classe: "5",
    titre: "Argent disponible (Trésorerie)",
    typeBilan: "Actif du bilan",
    explicationSimple: "Les soldes en banque (521), en espèces dans votre caisse (571) et sur Mobile Money (585).",
  },
  {
    classe: "6",
    titre: "Dépenses courantes (Charges)",
    typeBilan: "Compte de résultat",
    explicationSimple: "Toutes vos dépenses d'exploitation : achats de stock, loyers, électricité SBEE, téléphone, salaires, impôts courants.",
  },
  {
    classe: "7",
    titre: "Recettes et ventes (Produits)",
    typeBilan: "Compte de résultat",
    explicationSimple: "Votre chiffre d'affaires : ventes de marchandises, prestations de services, travaux facturés.",
  },
  {
    classe: "8",
    titre: "Opérations exceptionnelles et impôt final (HAO)",
    typeBilan: "Compte de résultat",
    explicationSimple: "Ventes de matériel d'occasion, dons exceptionnels et impôt annuel sur les bénéfices (IS ou TPS).",
  },
];

const SYSCOHADA_ACCOUNTS: SyscohadaAccountRow[] = [
  // Classe 1
  { code: "101", name: "Capital social", classe: "1", roleSimple: "Apports des associés à la création (SARL, SAS)" },
  { code: "103", name: "Capital personnel", classe: "1", roleSimple: "Apports du propriétaire en entreprise individuelle" },
  { code: "104", name: "Compte de l'exploitant", classe: "1", roleSimple: "Retraits ou apports personnels de l'entrepreneur" },
  { code: "111", name: "Réserve légale", classe: "1", roleSimple: "Part des bénéfices mise de côté selon la loi OHADA" },
  { code: "121", name: "Report à nouveau créditeur", classe: "1", roleSimple: "Bénéfices des années passées non distribués" },
  { code: "129", name: "Report à nouveau débiteur", classe: "1", roleSimple: "Pertes des exercices précédents à combler" },
  { code: "131", name: "Résultat net : Bénéfice", classe: "1", roleSimple: "Gain final de l'entreprise sur l'année" },
  { code: "139", name: "Résultat net : Perte", classe: "1", roleSimple: "Déficit de l'entreprise sur l'année" },
  { code: "162", name: "Emprunts auprès des établissements de crédit", classe: "1", roleSimple: "Crédits bancaires à rembourser sur plus d'un an" },
  { code: "191", name: "Provisions pour litiges", classe: "1", roleSimple: "Somme réservée face à un risque juridique identifié" },

  // Classe 2
  { code: "212", name: "Brevets, licences, concessions", classe: "2", roleSimple: "Droits d'exploitation acquis durablement" },
  { code: "213", name: "Logiciels et sites internet", classe: "2", roleSimple: "Logiciels achetés pour un usage durable" },
  { code: "223", name: "Terrains bâtis", classe: "2", roleSimple: "Terrains supportant des constructions" },
  { code: "231", name: "Bâtiments industriels et commerciaux", classe: "2", roleSimple: "Bureaux, entrepôts ou boutiques appartenant à l'entreprise" },
  { code: "241", name: "Matériel et outillage industriel", classe: "2", roleSimple: "Machines de production ou d'atelier" },
  { code: "244", name: "Matériel de transport", classe: "2", roleSimple: "Véhicules utilitaires, motos de livraison, camions" },
  { code: "245", name: "Matériel de bureau et informatique", classe: "2", roleSimple: "Ordinateurs, imprimantes, serveurs, climatiseurs" },
  { code: "246", name: "Mobilier de bureau", classe: "2", roleSimple: "Bureaux, chaises, armoires, comptoirs" },
  { code: "275", name: "Dépôts et cautionnements versés", classe: "2", roleSimple: "Caution de loyer commercial ou compteur SBEE/SONEB" },
  { code: "284", name: "Amortissements du matériel et mobilier", classe: "2", roleSimple: "Usure comptable annuelle des équipements" },

  // Classe 3
  { code: "311", name: "Marchandises A", classe: "3", roleSimple: "Produits achetés pour être revendus en boutique" },
  { code: "32", name: "Matières premières et fournitures liées", classe: "3", roleSimple: "Matières transformées en atelier ou chantier" },
  { code: "335", name: "Fournitures de bureau et consommables", classe: "3", roleSimple: "Ramettes, emballages et consommables en réserve" },
  { code: "36", name: "Produits finis", classe: "3", roleSimple: "Articles fabriqués prêts pour la vente" },
  { code: "38", name: "Stocks en cours de route et en dépôt", classe: "3", roleSimple: "Marchandises importées en transit au port" },

  // Classe 4
  { code: "401", name: "Fournisseurs, dettes en compte", classe: "4", roleSimple: "Factures à payer à vos fournisseurs" },
  { code: "408", name: "Fournisseurs, factures non parvenues", classe: "4", roleSimple: "Achats déjà livrés dont la facture n'est pas encore reçue" },
  { code: "409", name: "Fournisseurs débiteurs (avances versées)", classe: "4", roleSimple: "Acomptes payés d'avance à un fournisseur" },
  { code: "411", name: "Clients", classe: "4", roleSimple: "Factures émises que vos clients doivent encore régler" },
  { code: "416", name: "Créances clients litigieuses ou douteuses", classe: "4", roleSimple: "Factures impayées avec retard important" },
  { code: "419", name: "Clients créditeurs (avances reçues)", classe: "4", roleSimple: "Acomptes versés d'avance par un client" },
  { code: "421", name: "Personnel, rémunérations dues", classe: "4", roleSimple: "Salaires nets à payer aux employés en fin de mois" },
  { code: "425", name: "Personnel, avances et acomptes accordés", classe: "4", roleSimple: "Avances de salaire accordées aux collaborateurs" },
  { code: "431", name: "Sécurité sociale (CNSS Bénin)", classe: "4", roleSimple: "Cotisations CNSS (part salarié et part patronale) à payer" },
  { code: "441", name: "État, impôt sur les bénéfices (IS / IBA)", classe: "4", roleSimple: "Acomptes et solde d'impôt sur les sociétés dû à la DGI" },
  { code: "4431", name: "État, TVA facturée sur ventes", classe: "4", roleSimple: "TVA à 18 % encaissée auprès des clients pour la DGI" },
  { code: "4432", name: "État, TVA facturée sur services", classe: "4", roleSimple: "TVA à 18 % facturée sur prestations de services" },
  { code: "4441", name: "État, TVA due à reverser", classe: "4", roleSimple: "Solde net de TVA à payer avant le 10 du mois" },
  { code: "4449", name: "État, crédit de TVA à reporter", classe: "4", roleSimple: "Avance de TVA conservée pour le mois suivant" },
  { code: "4451", name: "État, TVA récupérable sur immobilisations", classe: "4", roleSimple: "TVA déductible sur l'achat de matériel durable" },
  { code: "4452", name: "État, TVA récupérable sur achats", classe: "4", roleSimple: "TVA récupérée sur factures fournisseurs normalisées e-MECeF" },
  { code: "4471", name: "État, acomptes AIB retenus / collectés", classe: "4", roleSimple: "Avance AIB (1 % ou 5 %) à imputer ou reverser à la DGI" },
  { code: "4473", name: "État, ITS retenu sur salaires", classe: "4", roleSimple: "Impôt sur salaire retenu sur bulletin à payer le 10" },
  { code: "448", name: "État, charges à payer (VPS)", classe: "4", roleSimple: "Versement Patronal sur Salaires (4 %) dû à la DGI" },
  { code: "471", name: "Comptes d'attente à régulariser", classe: "4", roleSimple: "Mouvement provisoire en cours d'identification" },

  // Classe 5
  { code: "511", name: "Effets à encaisser", classe: "5", roleSimple: "Effets de commerce remis à l'encaissement" },
  { code: "512", name: "Chèques à encaisser", classe: "5", roleSimple: "Chèques reçus de clients en attente de dépôt en banque" },
  { code: "521", name: "Banques locales en monnaie nationale", classe: "5", roleSimple: "Comptes bancaires en FCFA (BOA, Ecobank, NSIA, Orabank, etc.)" },
  { code: "522", name: "Banques en devises", classe: "5", roleSimple: "Comptes bancaires en euros ou dollars" },
  { code: "571", name: "Caisse siège social", classe: "5", roleSimple: "Argent liquide en espèces disponible en caisse" },
  { code: "581", name: "Virements de fonds internes", classe: "5", roleSimple: "Passage d'argent entre votre caisse et votre banque" },
  { code: "585", name: "Mobile Money / Transferts électroniques", classe: "5", roleSimple: "Portefeuilles marchands MTN MoMo, Moov Money et Celtiis Cash" },

  // Classe 6
  { code: "601", name: "Achats de marchandises", classe: "6", roleSimple: "Produits achetés pour la revente" },
  { code: "602", name: "Achats de matières premières", classe: "6", roleSimple: "Ingrédients et matériaux de production" },
  { code: "604", name: "Achats stockés de fournitures consommables", classe: "6", roleSimple: "Petit matériel consommé au fil des chantiers ou bureau" },
  { code: "605", name: "Autres achats (eau, électricité, carburant)", classe: "6", roleSimple: "Factures SONEB, SBEE et carburant non stocké" },
  { code: "611", name: "Transports sur achats", classe: "6", roleSimple: "Frais de livraison payés pour recevoir vos marchandises" },
  { code: "612", name: "Transports sur ventes", classe: "6", roleSimple: "Livraison expédiée à vos clients" },
  { code: "621", name: "Sous-traitance générale", classe: "6", roleSimple: "Travaux confiés à un prestataire externe" },
  { code: "622", name: "Locations et charges locatives", classe: "6", roleSimple: "Loyer de vos bureaux, magasins ou entrepôts" },
  { code: "624", name: "Entretien, réparations et maintenance", classe: "6", roleSimple: "Réparations de véhicules, locaux ou matériel" },
  { code: "625", name: "Primes d'assurance", classe: "6", roleSimple: "Assurance des locaux, marchandises ou véhicules" },
  { code: "631", name: "Frais bancaires et commissions", classe: "6", roleSimple: "Tenue de compte, virements et commissions de transfert" },
  { code: "632", name: "Honoraires d'intermédiaires (experts, avocats)", classe: "6", roleSimple: "Factures de votre expert-comptable, notaire ou juriste" },
  { code: "634", name: "Publicité et communication", classe: "6", roleSimple: "Campagnes marketing, flyers, panneaux et visibilité web" },
  { code: "635", name: "Télécommunications et internet", classe: "6", roleSimple: "Forfaits téléphone, fibre internet entreprise" },
  { code: "641", name: "Impôts et taxes directs (patente, foncier)", classe: "6", roleSimple: "Taxes locales et impôts non liés aux bénéfices" },
  { code: "647", name: "Pénalités et amendes fiscales", classe: "6", roleSimple: "Majorations de retard (non déductibles du résultat fiscal)" },
  { code: "661", name: "Rémunérations directes du personnel national", classe: "6", roleSimple: "Salaires bruts versés aux employés béninois" },
  { code: "664", name: "Charges sociales patronales (CNSS et VPS)", classe: "6", roleSimple: "Cotisations CNSS employeur (16,4 à 19,4 %) et VPS (4 %)" },
  { code: "671", name: "Intérêts des emprunts et dettes", classe: "6", roleSimple: "Intérêts payés à la banque sur vos crédits" },
  { code: "681", name: "Dotations aux amortissements d'exploitation", classe: "6", roleSimple: "Constatation annuelle de la perte de valeur du matériel" },

  // Classe 7
  { code: "701", name: "Ventes de marchandises", classe: "7", roleSimple: "Ventes réalisées par une activité commerciale / négoce" },
  { code: "702", name: "Ventes de produits finis", classe: "7", roleSimple: "Ventes de produits fabriqués ou transformés sur place" },
  { code: "704", name: "Travaux facturés", classe: "7", roleSimple: "Chantiers BTP, installations ou travaux techniques" },
  { code: "705", name: "Études facturées", classe: "7", roleSimple: "Missions d'ingénierie, audits ou études commandées" },
  { code: "706", name: "Services vendus (Prestations de services)", classe: "7", roleSimple: "Honoraires, conseils, maintenance et abonnements facturés" },
  { code: "707", name: "Produits accessoires (ports facturés, commissions)", classe: "7", roleSimple: "Frais annexes facturés au client en plus du service" },
  { code: "71", name: "Subventions d'exploitation", classe: "7", roleSimple: "Aides financières reçues pour soutenir l'activité" },
  { code: "771", name: "Intérêts de prêts et placements", classe: "7", roleSimple: "Revenus financiers encaissés par l'entreprise" },
  { code: "781", name: "Reprises de provisions d'exploitation", classe: "7", roleSimple: "Annulation d'une provision devenue sans objet" },

  // Classe 8
  { code: "81", name: "Valeurs comptables des cessions d'immobilisations", classe: "8", roleSimple: "Sortie comptable d'un véhicule ou matériel vendu" },
  { code: "82", name: "Produits des cessions d'immobilisations", classe: "8", roleSimple: "Prix de vente obtenu lors de la revente d'un matériel" },
  { code: "831", name: "Charges hors activités ordinaires (HAO)", classe: "8", roleSimple: "Dépenses exceptionnelles non liées à l'activité habituelle" },
  { code: "841", name: "Produits hors activités ordinaires (HAO)", classe: "8", roleSimple: "Recettes exceptionnelles ponctuelles" },
  { code: "891", name: "Impôt sur les sociétés (IS)", classe: "8", roleSimple: "Impôt annuel sur le bénéfice des sociétés commerciales" },
  { code: "892", name: "Taxe Professionnelle Synthétique (TPS)", classe: "8", roleSimple: "Impôt forfaitaire annuel des entreprises individuelles sous 50 M" },
];

export default function PlanComptableSyscohadaPdfPage() {
  const [selectedClasse, setSelectedClasse] = useState<"toutes" | ClassId>("toutes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const filteredAccounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SYSCOHADA_ACCOUNTS.filter((acc) => {
      const matchClass = selectedClasse === "toutes" || acc.classe === selectedClasse;
      if (!matchClass) return false;
      if (!q) return true;
      return (
        acc.code.toLowerCase().includes(q) ||
        acc.name.toLowerCase().includes(q) ||
        acc.roleSimple.toLowerCase().includes(q)
      );
    });
  }, [selectedClasse, searchQuery]);

  const handlePrintPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
    trackEvent("file_download", {
      file_name: "plan-comptable-syscohada-benin",
      file_extension: "pdf_print",
      page_path: "/ressources/plan-comptable-syscohada-pdf",
    });
    setExportMessage("Fenêtre d'impression ouverte : choisissez « Enregistrer au format PDF ».");
    setTimeout(() => setExportMessage(null), 4000);
  };

  const handleDownloadCsv = () => {
    const headers = ["Classe", "Numero", "Intitule SYSCOHADA", "Explication simple"];
    const escapeCell = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const rows = filteredAccounts.map((acc) =>
      [acc.classe, acc.code, acc.name, acc.roleSimple].map(escapeCell).join(";")
    );
    const csvContent = "\uFEFF" + [headers.map(escapeCell).join(";"), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "plan-comptable-syscohada-benin-ceilow.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    trackEvent("file_download", {
      file_name: "plan-comptable-syscohada-benin",
      file_extension: "csv",
      page_path: "/ressources/plan-comptable-syscohada-pdf",
    });
    setExportMessage(`Export CSV téléchargé (${filteredAccounts.length} comptes).`);
    setTimeout(() => setExportMessage(null), 4000);
  };

  const faqs = [
    {
      q: "Quelle est la différence entre l'ancien plan OHADA et le SYSCOHADA révisé ?",
      a: "Entré en vigueur en 2018 dans toute la zone OHADA dont le Bénin, le SYSCOHADA révisé a supprimé les anciens comptes de charges à immobiliser (frais d'établissement en classe 20) et clarifié la présentation du bilan et du tableau des flux de trésorerie pour faciliter le contrôle bancaire et fiscal.",
    },
    {
      q: "Quels comptes utiliser pour Mobile Money (MTN MoMo, Moov Money, Celtiis) ?",
      a: "Dans la pratique comptable au Bénin sur le SYSCOHADA, la banque locale s'enregistre dans le compte 521, les espèces dans le compte 571 (Caisse) et les portefeuilles électroniques Mobile Money dans un sous-compte de trésorerie dédié comme le 585 (Transferts électroniques / Mobile Money).",
    },
    {
      q: "Comment enregistrer ce document en PDF ou l'ouvrir dans Excel ?",
      a: "Cliquez sur le bouton « Imprimer / PDF » en haut de cette page puis choisissez « Enregistrer au format PDF » dans votre navigateur, ou cliquez sur « Exporter en CSV » pour télécharger immédiatement le tableau exploitable dans Excel.",
    },
    {
      q: "Une petite entreprise au Bénin doit-elle connaître ces numéros par cœur ?",
      a: "Non. Dans un outil automatisé comme Ceilow, le plan comptable SYSCOHADA révisé est déjà installé : lorsque vous faites une facture ou photographiez un reçu d'achat, le logiciel écrit les bons numéros de compte tout seul pour votre comptable.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans antialiased selection:bg-primary selection:text-ink">
      <style jsx global>{`
        @keyframes nodePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .syscohada-book-anim {
          animation: nodePulse 3.6s ease-in-out infinite;
          transform-origin: center;
        }
        @media (prefers-reduced-motion: reduce) {
          .syscohada-book-anim {
            animation: none !important;
          }
        }
      `}</style>

      <PublicHeader className="sticky top-0 z-50 w-full print:hidden" />

      <main className="flex-1 w-full">
        {/* ── 1. FIL D'ARIANE & HERO ── */}
        <section className="w-full pt-8 pb-14 lg:pt-12 lg:pb-20 bg-background border-b border-border print:py-4">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb className="mb-6 print:hidden">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Accueil</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/ressources/calendrier-fiscal-benin">Ressources Fiscales</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Plan Comptable SYSCOHADA</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3">
                  Référentiel OHADA &amp; Bénin 2026
                </span>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight mb-4">
                  Plan comptable SYSCOHADA révisé : liste des comptes (classes 1 à 8)
                </h1>

                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Trouvez n&apos;importe quel numéro de compte en 3 secondes, traduit en langage clair)
                </p>

                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Le <strong className="text-ink font-semibold">plan comptable SYSCOHADA révisé</strong> classe toutes les opérations d&apos;une entreprise au Bénin et dans l&apos;espace OHADA en 8 grandes catégories. Cherchez un compte ci-dessous (TVA, CNSS, Mobile Money <span className="font-mono text-ink font-semibold">585</span>, banque <span className="font-mono text-ink font-semibold">521</span>), exportez le tableau en Excel ou imprimez la version PDF.
                </p>

                <div className="w-full p-4 rounded-xl bg-background-secondary border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-muted mb-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success-deep shrink-0" />
                    <span>Vérifié : Équipe SYSCOHADA Ceilow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink shrink-0" />
                    <span>Mis à jour : 10 nov. 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-ink shrink-0" />
                    <span>{SYSCOHADA_ACCOUNTS.length} comptes essentiels</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto print:hidden">
                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer / PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    className="bg-background-secondary hover:border-ink text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl border border-border transition-all text-center min-h-[48px] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exporter en CSV</span>
                  </button>
                </div>

                {exportMessage && (
                  <div
                    role="status"
                    className="mt-4 p-3 rounded-xl bg-background-secondary border border-border text-xs text-ink font-medium"
                  >
                    {exportMessage}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 print:hidden">
                <div className="rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-card">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/expert-comptable-benin.jpg"
                      alt="Expert-comptable au Bénin consultant la liste des comptes SYSCOHADA révisés"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Norme OHADA révisée</span>
                      <span className="text-success-deep">Adapté DGI Bénin</span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Inclut les sous-comptes TVA (443/445), AIB (4471), CNSS (431) et Mobile Money (585).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. SOMMAIRE ── */}
        <nav aria-label="Sommaire du plan comptable" className="w-full py-6 bg-background-secondary border-b border-border print:hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted shrink-0">
                Accès rapide :
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="#classes-1-a-8"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  1. Les 8 classes expliquées
                </a>
                <a
                  href="#repertoire-comptes"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  2. Liste interactive des comptes
                </a>
                <a
                  href="#comptes-cles-benin"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  3. Comptes spécifiques Bénin
                </a>
                <a
                  href="#faq"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  4. Questions fréquentes
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* ── 3. LES 8 CLASSES EN LANGAGE CLAIR ── */}
        <section id="classes-1-a-8" className="w-full py-16 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
              <div className="lg:col-span-8">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                  Structure du Plan OHADA
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                  À quoi sert chacune des 8 classes du SYSCOHADA ?
                </h2>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Les classes <strong className="text-ink">1 à 5</strong> décrivent ce que possède et ce que doit votre entreprise (le Bilan). Les classes <strong className="text-ink">6 à 8</strong> mesurent vos dépenses et vos ventes de l&apos;année (le Compte de résultat).
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-center print:hidden">
                <div className="w-52 h-36 bg-background-secondary rounded-2xl border border-border p-4 flex items-center justify-center">
                  <svg viewBox="0 0 220 130" className="w-full h-full syscohada-book-anim" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="20" y="18" width="84" height="94" rx="8" fill="#FFFFFF" stroke="#332E29" strokeWidth="2" />
                    <rect x="116" y="18" width="84" height="94" rx="8" fill="#FFD946" stroke="#332E29" strokeWidth="2" />
                    <text x="62" y="45" textAnchor="middle" fill="#332E29" fontSize="11" fontWeight="900" fontFamily="'Inter', sans-serif">
                      CLASSES 1-5
                    </text>
                    <text x="62" y="65" textAnchor="middle" fill="#8A857D" fontSize="9" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      BILAN
                    </text>
                    <text x="62" y="88" textAnchor="middle" fill="#332E29" fontSize="8" fontFamily="'Inter', sans-serif">
                      Banque, Clients, Stocks
                    </text>
                    <text x="158" y="45" textAnchor="middle" fill="#332E29" fontSize="11" fontWeight="900" fontFamily="'Inter', sans-serif">
                      CLASSES 6-8
                    </text>
                    <text x="158" y="65" textAnchor="middle" fill="#332E29" fontSize="9" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      RÉSULTAT
                    </text>
                    <text x="158" y="88" textAnchor="middle" fill="#332E29" fontSize="8" fontFamily="'Inter', sans-serif">
                      Dépenses &amp; Ventes
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {SYSCOHADA_CLASSES.map((item) => (
                <button
                  key={item.classe}
                  type="button"
                  onClick={() => {
                    setSelectedClasse(item.classe);
                    const el = document.getElementById("repertoire-comptes");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-left p-5 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between space-y-3 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-ink">
                        Classe {item.classe}
                      </span>
                      <span className="text-[11px] font-semibold text-text-muted">
                        {item.typeBilan}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-ink mb-2">
                      {item.titre}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {item.explicationSimple}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-ink underline underline-offset-4 pt-2 border-t border-border">
                    Filtrer la classe {item.classe}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. RÉPERTOIRE INTERACTIF & RECHERCHE ── */}
        <section id="repertoire-comptes" className="w-full py-16 lg:py-20 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                  Nomenclature Interactive
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Recherchez un numéro ou un libellé SYSCOHADA
                </h2>
              </div>

              <div className="flex flex-wrap gap-3 print:hidden">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-ink text-xs font-bold inline-flex items-center gap-2 min-h-[44px] cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="px-4 py-2.5 rounded-xl bg-background border border-border hover:border-ink text-ink text-xs font-bold inline-flex items-center gap-2 min-h-[44px] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter en CSV</span>
                </button>
              </div>
            </div>

            {/* Barre de recherche & Filtre classes */}
            <div className="bg-background p-5 sm:p-6 rounded-2xl border border-border space-y-5 mb-8 print:hidden">
              <div>
                <label
                  htmlFor="search-syscohada"
                  className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2"
                >
                  Rechercher par numéro (ex. 585, 4431, 601) ou mot-clé (ex. Mobile Money, TVA, CNSS, loyer)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="search-syscohada"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tapez un code ou un mot-clé..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-background-secondary border border-border text-sm text-ink placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                  Filtrer par classe
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedClasse("toutes")}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer min-h-[44px] ${
                      selectedClasse === "toutes"
                        ? "bg-ink text-background border-ink"
                        : "bg-background-secondary text-ink border-border hover:border-ink"
                    }`}
                  >
                    Toutes ({SYSCOHADA_ACCOUNTS.length})
                  </button>
                  {SYSCOHADA_CLASSES.map((c) => (
                    <button
                      key={c.classe}
                      type="button"
                      onClick={() => setSelectedClasse(c.classe)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer min-h-[44px] ${
                        selectedClasse === c.classe
                          ? "bg-ink text-background border-ink"
                          : "bg-background-secondary text-ink border-border hover:border-ink"
                      }`}
                    >
                      Classe {c.classe}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* État : aucun résultat vs tableau */}
            {filteredAccounts.length === 0 ? (
              <div className="bg-background p-10 rounded-2xl border border-border text-center space-y-4">
                <p className="text-base font-bold text-ink">
                  Aucun compte ne correspond à « {searchQuery} »
                </p>
                <p className="text-xs text-text-muted max-w-md mx-auto">
                  Essayez un terme plus simple comme « banque », « caisse », « TVA », « loyer » ou réinitialisez les filtres.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedClasse("toutes");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-ink font-bold text-xs min-h-[44px] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tout afficher</span>
                </button>
              </div>
            ) : (
              <>
                <div className="hidden lg:block bg-background rounded-2xl border border-border overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-background-secondary text-xs uppercase tracking-wider text-text-muted font-bold">
                        <th className="py-3.5 px-5 w-24">Classe</th>
                        <th className="py-3.5 px-5 w-28">N° Compte</th>
                        <th className="py-3.5 px-5">Intitulé officiel SYSCOHADA</th>
                        <th className="py-3.5 px-5">Usage concret au quotidien</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {filteredAccounts.map((acc) => (
                        <tr key={acc.code} className="hover:bg-background-secondary/40 transition-colors">
                          <td className="py-3.5 px-5 font-mono text-xs text-text-muted">
                            Classe {acc.classe}
                          </td>
                          <td className="py-3.5 px-5 font-mono font-bold text-ink tabular-nums">
                            {acc.code}
                          </td>
                          <td className="py-3.5 px-5 font-semibold text-ink">{acc.name}</td>
                          <td className="py-3.5 px-5 text-xs text-text-muted">{acc.roleSimple}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="lg:hidden space-y-3">
                  {filteredAccounts.map((acc) => (
                    <div key={acc.code} className="bg-background p-4 rounded-xl border border-border space-y-1.5">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="font-mono font-bold text-sm text-ink tabular-nums">
                          {acc.code} : {acc.name}
                        </span>
                        <span className="font-mono text-[11px] text-text-muted shrink-0">
                          Cl. {acc.classe}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">{acc.roleSimple}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── 5. COMPTES SPÉCIFIQUES AU BÉNIN ── */}
        <section id="comptes-cles-benin" className="w-full py-16 bg-background border-b border-border scroll-mt-24 print:hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Réflexes Bénin / DGI
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Les comptes clés à bien placer sur vos opérations béninoises
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-background-secondary border border-border space-y-2">
                <span className="font-mono text-xs font-bold text-ink">521 vs 585 vs 571</span>
                <h3 className="text-base font-bold text-ink">Banque, Mobile Money et Espèces</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Attention à ne pas utiliser le compte 512 français : en SYSCOHADA, la banque est en <strong className="text-ink">521</strong>, les espèces en <strong className="text-ink">571</strong> et les paiements MTN/Moov en <strong className="text-ink">585</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-background-secondary border border-border space-y-2">
                <span className="font-mono text-xs font-bold text-ink">4431 / 4452 / 4471</span>
                <h3 className="text-base font-bold text-ink">TVA DGI (18 %) et AIB (1 % / 5 %)</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Votre TVA facturée va en <strong className="text-ink">4431</strong>, la TVA récupérable sur vos factures e-MECeF en <strong className="text-ink">4452</strong> et vos retenues d&apos;avance AIB en <strong className="text-ink">4471</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-background-secondary border border-border space-y-2">
                <span className="font-mono text-xs font-bold text-ink">431 / 4473 / 892</span>
                <h3 className="text-base font-bold text-ink">CNSS, Impôt ITS et TPS</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Les cotisations sociales CNSS sont suivies en <strong className="text-ink">431</strong>, l&apos;impôt sur salaire ITS en <strong className="text-ink">4473</strong> et l&apos;impôt forfaitaire TPS en <strong className="text-ink">892</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. FAQ (Alignée sur FAQPage JSON-LD) ── */}
        <section id="faq" className="w-full py-16 bg-background-secondary border-b border-border scroll-mt-24 print:hidden">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Questions Fréquentes
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Vos questions sur le plan comptable SYSCOHADA
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.q}
                    className="border border-border rounded-2xl bg-background overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-ink text-sm sm:text-base hover:bg-background-secondary/60 transition-colors cursor-pointer min-h-[48px]"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-ink shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-text-muted leading-relaxed border-t border-border pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 7. MAILLAGE INTERNE ── */}
        <section className="w-full py-14 bg-background border-b border-border print:hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-1">
                Ressources et Outils Associés
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                Automatisez votre comptabilité SYSCOHADA avec Ceilow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/solutions/comptabilite-syscohada"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Comptabilité Automatisée SYSCOHADA
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Chaque facture et chaque dépense génère ses écritures sans saisir les numéros de compte à la main.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Voir la solution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/solutions/tresorerie-momo"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <Wallet className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Trésorerie Banques (521) &amp; MoMo (585)
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Rapprochez vos encaissements MTN MoMo, Moov Money et comptes bancaires de vos factures clients.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Voir la trésorerie</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/pour-qui/cabinets-comptables"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <Briefcase className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Espace Cabinets Comptables
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Supervisez tous vos dossiers clients avec balances SYSCOHADA et exports FEC / Sage sans ressaisie.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Voir l&apos;espace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-background-secondary border border-border text-xs text-text-muted leading-relaxed flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-ink shrink-0 mt-0.5" />
              <p>
                <strong className="text-ink">Note d&apos;information :</strong> Ce répertoire reprend les comptes principaux du Plan Comptable Général OHADA révisé (SYSCOHADA) utilisés au Bénin. Chaque entreprise peut créer des subdivisions détaillées dans son plan comptable Ceilow.
              </p>
            </div>
          </div>
        </section>

        {/* ── 8. BANNIÈRE CONVERSION ── */}
        <section className="w-full py-16 bg-ink text-background print:hidden">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mb-4">
              <Scale className="w-6 h-6" />
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-background">
              Votre plan SYSCOHADA déjà configuré
            </h2>

            <p className="text-sm sm:text-base text-background/80 max-w-xl mb-8 leading-relaxed">
              Créez votre compte Ceilow en quelques clics : les comptes 1 à 8 prêts à l&apos;emploi et des écritures générées à chaque opération.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-ink font-bold px-8 py-3.5 rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>Créer un compte</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto bg-transparent text-background font-bold px-8 py-3.5 rounded-xl border border-background/25 hover:border-background transition-all text-center min-h-[48px] flex items-center justify-center"
              >
                <span>Voir la démo</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full print:hidden" />
    </div>
  );
}

