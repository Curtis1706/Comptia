"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileCheck,
  HelpCircle,
  QrCode,
  Receipt,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type InvoiceZoneId = "emetteur" | "client" | "lignes" | "securite";

interface TaxGroupRow {
  code: string;
  libelle: string;
  taux: string;
  casUsage: string;
  exemple: string;
}

interface InvoiceZoneDetail {
  id: InvoiceZoneId;
  etape: string;
  titre: string;
  obligation: string;
  explication: string;
  automatisationCeilow: string;
}

const TAX_GROUPS: TaxGroupRow[] = [
  {
    code: "Groupe A",
    libelle: "Exonéré",
    taux: "0 %",
    casUsage: "Produits et services que la loi dispense de TVA.",
    exemple: "Produits agricoles bruts, livres scolaires, soins médicaux.",
  },
  {
    code: "Groupe B",
    libelle: "TVA normale",
    taux: "18 %",
    casUsage: "Ventes courantes des entreprises soumises au régime réel.",
    exemple: "Commerce, prestations de services, informatique, BTP.",
  },
  {
    code: "Groupe C",
    libelle: "Exportation",
    taux: "0 %",
    casUsage: "Ventes envoyées hors du Bénin avec preuve douanière.",
    exemple: "Marchandises expédiées vers le Togo, le Niger ou l'étranger.",
  },
  {
    code: "Groupe D",
    libelle: "Régime d'exception",
    taux: "18 % (exonération spéciale)",
    casUsage: "Marchés publics ou projets ayant une attestation officielle DGI.",
    exemple: "Travaux financés avec prise en charge de la TVA par l'État.",
  },
  {
    code: "Groupe E",
    libelle: "Petites entreprises (TPS)",
    taux: "0 %",
    casUsage: "Entreprises individuelles au forfait TPS (sous 50 M FCFA par an).",
    exemple: "Artisans, boutiques de quartier, prestataires non assujettis à la TVA.",
  },
  {
    code: "Groupe F",
    libelle: "Frais avancés (Débours)",
    taux: "0 %",
    casUsage: "Sommes payées exactement au nom du client et refacturées à l'identique.",
    exemple: "Timbres fiscaux ou droits d'enregistrement réglés pour un client.",
  },
];

const INVOICE_ZONES: Record<InvoiceZoneId, InvoiceZoneDetail> = {
  emetteur: {
    id: "emetteur",
    etape: "Zone 1",
    titre: "Vos coordonnées d'entreprise et votre numéro IFU",
    obligation: "Présent sur toutes vos factures",
    explication:
      "Votre nom commercial ou raison sociale, votre numéro IFU (Identifiant Fiscal Unique à 13 chiffres), votre adresse au Bénin et le nom du vendeur qui édite la facture doivent toujours apparaître en haut du document.",
    automatisationCeilow:
      "Ceilow pré-remplit vos informations officielles sur chaque facture dès la création de votre compte, sans rien retaper.",
  },
  client: {
    id: "client",
    etape: "Zone 2",
    titre: "Nom du client, numéro IFU et avance d'impôt (AIB)",
    obligation: "Indispensable pour facturer une société ou l'État",
    explication:
      "Lorsque vous vendez à une entreprise ou à une administration, demandez son numéro IFU. Cela détermine l'AIB (une petite avance sur l'impôt retenue sur la facture) : 1 % si votre client possède un IFU valide, contre 5 % s'il n'en a pas (hors cas exonérés).",
    automatisationCeilow:
      "Entrez le numéro IFU de votre client : Ceilow retrouve sa fiche et applique le bon taux (1 % ou 5 %) sans calcul de tête.",
  },
  lignes: {
    id: "lignes",
    etape: "Zone 3",
    titre: "Produits vendus, prix TTC et groupe fiscal (A à F)",
    obligation: "À préciser sur chaque ligne de la facture",
    explication:
      "Chaque produit ou prestation indique son nom clair, la quantité, le prix unitaire TTC arrondi au franc CFA entier (règle technique de la DGI) et sa catégorie fiscale (Groupe B si vous facturez la TVA à 18 %, Groupe E si vous êtes au forfait TPS).",
    automatisationCeilow:
      "Saisissez vos prix en hors taxes ou toutes taxes comprises selon votre habitude : Ceilow convertit au franc près et sélectionne le bon groupe.",
  },
  securite: {
    id: "securite",
    etape: "Zone 4",
    titre: "Les 4 preuves DGI en bas de page : QR code et numéros officiels",
    obligation: "Obligatoire pour que la facture soit valable",
    explication:
      "Une facture devient officielle quand les serveurs de la DGI y ajoutent quatre garanties : le numéro NIM (qui identifie votre caisse ou logiciel), les compteurs numérotés, le code MECeF/DGI à 24 caractères et le QR code que vos clients peuvent scanner.",
    automatisationCeilow:
      "Dès que vous cliquez pour valider votre facture, Ceilow récupère ces 4 éléments auprès de la DGI en moins de 2 secondes et les imprime sur le PDF.",
  },
};

export default function GuideFacturationEmecefBeninPage() {
  const [selectedZone, setSelectedZone] = useState<InvoiceZoneId>("securite");
  const [regimeTest, setRegimeTest] = useState<"tps" | "reel" | "association">("reel");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const activeZoneDetail = INVOICE_ZONES[selectedZone];

  const faqs = [
    {
      q: "Quelle est la différence entre une machine physique et l'e-MECeF ?",
      a: "La machine classique est un boîtier matériel coûteux qui demande des rouleaux de papier. L'e-MECeF est le système officiel en ligne de la DGI : il valide vos factures directement via Internet depuis votre téléphone ou ordinateur (avec un logiciel connecté comme Ceilow), sans acheter de boîtier.",
    },
    {
      q: "Une petite entreprise au régime TPS doit-elle aussi faire des factures normalisées ?",
      a: "Oui. Au Bénin, les petites entreprises soumises à la Taxe Professionnelle Synthétique (TPS) doivent aussi délivrer des factures normalisées à leurs clients, en sélectionnant simplement la catégorie sans TVA (Groupe E à 0 %).",
    },
    {
      q: "Comment annuler une facture normalisée qui contient une erreur ?",
      a: "On ne peut jamais supprimer une facture déjà validée par les impôts. Pour annuler ou corriger un montant, vous devez créer une facture d'avoir (facture négative officielle) en indiquant le code MECeF/DGI de la première facture.",
    },
    {
      q: "Comment vérifier qu'une facture reçue d'un fournisseur est bien authentique ?",
      a: "Scannez le QR code en bas de la facture avec l'application gratuite MECeF BENIN sur votre téléphone, ou entrez les numéros de contrôle sur le site de vérification des impôts.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans antialiased selection:bg-primary selection:text-ink">
      <style jsx global>{`
        @keyframes scanBeam {
          0%, 100% { transform: translateY(0px); opacity: 0.35; }
          50% { transform: translateY(64px); opacity: 0.95; }
        }
        @keyframes stampAppear {
          0%, 25% { transform: scale(1.25) rotate(-10deg); opacity: 0; }
          40%, 85% { transform: scale(1) rotate(-4deg); opacity: 1; }
          100% { transform: scale(0.95) rotate(-4deg); opacity: 0.7; }
        }
        .guide-scan-beam {
          animation: scanBeam 2.8s ease-in-out infinite;
        }
        .guide-stamp-seal {
          animation: stampAppear 3.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          transform-origin: center;
        }
        @media (prefers-reduced-motion: reduce) {
          .guide-scan-beam,
          .guide-stamp-seal {
            animation: none !important;
          }
        }
      `}</style>

      <PublicHeader className="sticky top-0 z-50 w-full" />

      <main className="flex-1 w-full">
        {/* ── 1. FIL D'ARIANE & HERO PÉDAGOGIQUE ── */}
        <section className="w-full pt-8 pb-14 lg:pt-12 lg:pb-20 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Accueil</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/ressources">Ressources Fiscales</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Guide Facturation e-MECeF Bénin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3">
                  Guide Pratique DGI Bénin 2026
                </span>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight mb-4">
                  Facture normalisée e-MECeF au Bénin : comment facturer aux normes sans erreur
                </h1>

                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Comprenez les règles en 7 minutes, sans vocabulaire compliqué ni peur d&apos;un contrôle des impôts)
                </p>

                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Au Bénin, la Direction Générale des Impôts (DGI) demande aux entreprises de remettre à chaque client une{" "}
                  <strong className="text-ink font-semibold">facture normalisée avec un QR code officiel</strong>. Pas besoin d&apos;acheter une machine coûteuse en boutique : grâce au système en ligne e-MECeF, vous créez vos factures officielles directement depuis votre téléphone ou ordinateur. Voici qui est concerné, quelles informations afficher et comment éviter les amendes.
                </p>

                {/* Repères de fiabilité éditoriale */}
                <div className="w-full p-4 rounded-xl bg-background-secondary border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-muted mb-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success-deep shrink-0" />
                    <span>Vérifié : Équipe Fiscale Ceilow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink shrink-0" />
                    <span>Mis à jour : 10 nov. 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-ink shrink-0" />
                    <span>Lecture : 7 minutes</span>
                  </div>
                </div>

                {/* CTAs courts (1 à 3 mots) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/register"
                    className="bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Tester gratuitement</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#anatomie"
                    className="bg-background-secondary hover:border-ink text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl border border-border transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Voir une facture
                  </Link>
                </div>
              </div>

              {/* Photo réelle locale */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-card">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/commercante-cotonou.jpg"
                      alt="Commerçante béninoise à Cotonou vérifiant une facture normalisée e-MECeF depuis son téléphone"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>e-MECeF 100 % en ligne</span>
                      <span className="text-success-deep">Sans boîtier matériel</span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Remplace les anciennes machines physiques par une validation directe auprès de la DGI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. SOMMAIRE SCANNABLE ── */}
        <nav aria-label="Sommaire du guide e-MECeF" className="w-full py-6 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted shrink-0">
                Dans ce guide pratique :
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="#definition"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  1. Définition simple
                </a>
                <a
                  href="#obliges"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  2. Qui est obligé ?
                </a>
                <a
                  href="#anatomie"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  3. Modèle de facture
                </a>
                <a
                  href="#groupes-taxation"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  4. Groupes A à F et AIB
                </a>
                <a
                  href="#erreurs-avoirs"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  5. Annuler et vérifier
                </a>
                <a
                  href="#faq"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  6. Questions fréquentes
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* ── 3. DÉFINITION EN LANGAGE CLAIR + SVG ANIMÉ ── */}
        <section id="definition" className="w-full py-16 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted block">
                  L&apos;essentiel en 50 mots
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Qu&apos;est-ce que la facture normalisée e-MECeF au Bénin ?
                </h2>

                <div className="p-6 rounded-2xl bg-background-secondary border border-border">
                  <p className="text-sm sm:text-base text-ink leading-relaxed font-medium">
                    Une facture normalisée e-MECeF est une facture officielle validée en direct par la Direction Générale des Impôts (DGI) du Bénin. Elle comporte en bas de page un QR code vérifiable, un numéro d&apos;identification de caisse ou logiciel (NIM), des compteurs numérotés et un code de sécurité à 24 caractères.
                  </p>
                </div>

                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Contrairement aux factures faites sur Word, Excel ou un carnet papier, la facture e-MECeF enregistre automatiquement votre vente auprès des impôts dès que vous la validez. Pour vos clients professionnels, ce QR code est indispensable : sans lui, ils ne peuvent pas déduire leur dépense ni récupérer la TVA sur leurs propres impôts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                    <div className="text-sm font-bold text-ink">Ancienne machine physique (MCF)</div>
                    <ul className="space-y-1.5 text-xs text-text-muted">
                      <li>Achat du boîtier entre 250 000 et 350 000 FCFA</li>
                      <li>Achat fréquent de rouleaux de papier thermique</li>
                      <li>Activité bloquée si la machine tombe en panne</li>
                      <li>Difficile à transporter chez vos clients</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-background-secondary border border-border space-y-2">
                    <div className="text-sm font-bold text-ink">Système en ligne e-MECeF</div>
                    <ul className="space-y-1.5 text-xs text-ink">
                      <li>Aucun boîtier physique à acheter ni réparer</li>
                      <li>Facturation possible depuis téléphone ou ordinateur</li>
                      <li>Envoi direct du PDF par WhatsApp ou e-mail</li>
                      <li>Toutes vos factures archivées en sécurité pendant 10 ans</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SVG animé vérification QR */}
              <div className="lg:col-span-5 flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-background-secondary border border-border">
                <div className="w-64 h-44 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 260 170" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="62" y="16" width="136" height="138" rx="10" fill="#FFFFFF" stroke="#332E29" strokeWidth="2.5" />
                    <rect x="76" y="28" width="68" height="8" rx="3" fill="#332E29" />
                    <rect x="76" y="42" width="108" height="5" rx="2" fill="#D8D5D0" />
                    <rect x="76" y="52" width="90" height="5" rx="2" fill="#D8D5D0" />

                    <rect x="76" y="70" width="52" height="52" rx="4" fill="#F5F4F2" stroke="#332E29" strokeWidth="1.5" />
                    <rect x="83" y="77" width="14" height="14" rx="2" fill="#332E29" />
                    <rect x="86" y="80" width="8" height="8" fill="#FFFFFF" />
                    <rect x="107" y="77" width="14" height="14" rx="2" fill="#332E29" />
                    <rect x="110" y="80" width="8" height="8" fill="#FFFFFF" />
                    <rect x="83" y="101" width="14" height="14" rx="2" fill="#332E29" />
                    <rect x="86" y="104" width="8" height="8" fill="#FFFFFF" />
                    <rect x="103" y="97" width="18" height="18" rx="2" fill="#332E29" />

                    <line
                      x1="72"
                      y1="66"
                      x2="132"
                      y2="66"
                      stroke="#FFA53D"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="guide-scan-beam"
                    />

                    <g className="guide-stamp-seal" transform="translate(168, 102)">
                      <circle cx="0" cy="0" r="28" fill="#5FFFC2" stroke="#332E29" strokeWidth="2.5" />
                      <path
                        d="M -11 0 L -3 8 L 12 -8"
                        fill="none"
                        stroke="#332E29"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </div>

                <h3 className="text-base font-bold text-ink mb-2">
                  QR code officiel généré en moins de 2 secondes
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Un logiciel connecté comme Ceilow envoie votre facture aux impôts et place automatiquement le QR code officiel sur votre document.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. QUI EST OBLIGÉ ? SÉLECTEUR RAPIDE PAR STATUT ── */}
        <section id="obliges" className="w-full py-16 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Qui est concerné au Bénin ?
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Votre entreprise doit-elle remettre des factures normalisées ?
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Cliquez sur votre situation ci-dessous pour connaître vos obligations exactes vis-à-vis de la DGI.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setRegimeTest("reel")}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer min-h-[64px] ${
                    regimeTest === "reel"
                      ? "bg-background border-primary ring-2 ring-primary/40 shadow-xs"
                      : "bg-background border-border hover:border-ink"
                  }`}
                >
                  <div className="font-bold text-sm text-ink">
                    Société (SARL, SAS, SA) ou plus de 50 M FCFA par an
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Régime du Réel : vous facturez la TVA à 18 %
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegimeTest("tps")}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer min-h-[64px] ${
                    regimeTest === "tps"
                      ? "bg-background border-primary ring-2 ring-primary/40 shadow-xs"
                      : "bg-background border-border hover:border-ink"
                  }`}
                >
                  <div className="font-bold text-sm text-ink">
                    Petite entreprise individuelle / Établissement (TPS)
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Ventes annuelles jusqu&apos;à 50 millions FCFA
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegimeTest("association")}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer min-h-[64px] ${
                    regimeTest === "association"
                      ? "bg-background border-primary ring-2 ring-primary/40 shadow-xs"
                      : "bg-background border-border hover:border-ink"
                  }`}
                >
                  <div className="font-bold text-sm text-ink">
                    Consultant, artisan ou prestataire de services
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Vous travaillez avec d&apos;autres entreprises ou l&apos;État
                  </div>
                </button>
              </div>

              <div className="lg:col-span-7 bg-background p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-5">
                {regimeTest === "reel" && (
                  <>
                    <div className="border-b border-border pb-4">
                      <div className="text-xs font-bold text-success-deep inline-flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Facturation normalisée obligatoire (avec TVA 18 %)</span>
                      </div>
                      <h3 className="text-xl font-bold text-ink">
                        Obligatoire avec collecte de TVA (Groupe B)
                      </h3>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Toutes les sociétés (SARL, SAS) et les entreprises qui dépassent 50 millions FCFA de ventes par an doivent certifier 100 % de leurs factures via e-MECeF. Vos ventes courantes utilisent le Groupe B (18 % de TVA), sauf produits exonérés (Groupe A) ou ventes à l&apos;exportation (Groupe C).
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm text-ink">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                        <span>Activez d&apos;abord votre profil sur le site des impôts avec votre numéro IFU.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                        <span>Chaque facture validée prépare automatiquement votre déclaration de TVA du 10 du mois.</span>
                      </li>
                    </ul>
                  </>
                )}

                {regimeTest === "tps" && (
                  <>
                    <div className="border-b border-border pb-4">
                      <div className="text-xs font-bold text-success-deep inline-flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Facturation normalisée obligatoire (sans TVA)</span>
                      </div>
                      <h3 className="text-xl font-bold text-ink">
                        Obligatoire aussi en TPS, mais sans TVA (Groupe E)
                      </h3>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Même sous le forfait de la Taxe Professionnelle Synthétique (TPS), vous devez remettre une facture normalisée à vos clients. La différence : vous ne facturez pas de TVA (vous utilisez simplement la catégorie Groupe E à 0 %).
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm text-ink">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                        <span>Les grandes sociétés acceptent vos devis bien plus facilement si vos factures portent le QR code DGI.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                        <span>Avec Ceilow, votre téléphone suffit : vous économisez l&apos;achat d&apos;une machine à 280 000 FCFA.</span>
                      </li>
                    </ul>
                  </>
                )}

                {regimeTest === "association" && (
                  <>
                    <div className="border-b border-border pb-4">
                      <div className="text-xs font-bold text-success-deep inline-flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Facturation normalisée obligatoire en B2B et État</span>
                      </div>
                      <h3 className="text-xl font-bold text-ink">
                        Indispensable pour vous faire payer par les sociétés
                      </h3>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Consultants, agences, artisans ou formateurs : si vous facturez une entreprise ou un service public au Bénin, votre client a besoin de votre facture normalisée avec QR code pour pouvoir compter votre paiement dans ses dépenses officielles.
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm text-ink">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                        <span>Vérifiez l&apos;avance d&apos;impôt AIB applicable sur vos prestations (1 % ou 5 %).</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                        <span>Transformez n&apos;importe quel devis accepté en facture normalisée en 1 clic sur Ceilow.</span>
                      </li>
                    </ul>
                  </>
                )}

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs text-text-muted">
                    Prêt à émettre vos premières factures depuis votre navigateur ?
                  </span>
                  <Link
                    href="/solutions/facturation-dgi"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-ink underline underline-offset-4 hover:opacity-80 transition-opacity min-h-[44px]"
                  >
                    <span>Voir la solution</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. ANATOMIE INTERACTIVE D'UNE FACTURE NORMALISÉE BÉNIN ── */}
        <section id="anatomie" className="w-full py-16 lg:py-20 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Modèle Interactif DGI
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Que doit contenir votre facture ? Cliquez chaque bloc pour voir
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Touchez n&apos;importe quelle zone de cet exemple de facture béninoise pour comprendre ce que vérifient les contrôleurs des impôts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 bg-background-secondary p-4 sm:p-6 rounded-2xl border border-border">
                <div className="bg-background rounded-xl border border-border p-5 space-y-4 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedZone("emetteur")}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedZone === "emetteur"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-ink"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase text-text-muted block">
                          Zone 1 : Votre entreprise
                        </span>
                        <div className="font-bold text-sm text-ink mt-0.5">
                          ATLANTIQUE SERVICES SARL
                        </div>
                        <div className="text-xs text-text-muted font-mono">
                          IFU : 3202011489201 | Haie Vive, Cotonou
                        </div>
                        <div className="text-xs text-text-muted">
                          Vendeur : Nadia Mensah | Facture de Vente (FV)
                        </div>
                      </div>
                      <span className="text-xs font-bold text-ink underline shrink-0">Voir</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedZone("client")}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedZone === "client"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-ink"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase text-text-muted block">
                          Zone 2 : Votre client et son IFU
                        </span>
                        <div className="font-bold text-sm text-ink mt-0.5">
                          SOCIÉTÉ GÉNÉRALE DU GOLFE SA
                        </div>
                        <div className="text-xs text-text-muted font-mono">
                          IFU Client : 3201809451102 | Tél : +229 01 62 78 93 05
                        </div>
                      </div>
                      <span className="text-xs font-bold text-ink underline shrink-0">Voir</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedZone("lignes")}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedZone === "lignes"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-ink"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold uppercase text-text-muted">
                        Zone 3 : Produits et taxes
                      </span>
                      <span className="text-xs font-bold text-ink underline">Voir</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between text-ink">
                        <span>Prestation informatique [B 18%]</span>
                        <span className="font-bold tabular-nums">590 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Dont TVA (Groupe B à 18 %)</span>
                        <span className="tabular-nums">90 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Avance impôt AIB (1 % sur HT)</span>
                        <span className="tabular-nums">5 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-ink font-bold pt-2 border-t border-border text-sm">
                        <span>TOTAL À PAYER</span>
                        <span className="tabular-nums">595 000 FCFA</span>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedZone("securite")}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedZone === "securite"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-ink"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono font-bold uppercase text-text-muted block">
                          Zone 4 : Preuves officielles DGI e-MECeF
                        </span>
                        <div className="text-xs font-mono text-ink font-bold">
                          Code MECeF : 7X9P-2K8M-Q4L1-V6N3-R5T8-B9C2
                        </div>
                        <div className="text-[11px] font-mono text-text-muted">
                          NIM : TS01019550 | Compteurs : 128/128 FV
                        </div>
                        <div className="text-[11px] font-mono text-text-muted">
                          Horodatage DGI : 10/11/2026 09:42:18
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-lg bg-background-secondary border border-border flex items-center justify-center shrink-0">
                        <QrCode className="w-9 h-9 text-ink" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 bg-background-secondary p-6 sm:p-8 rounded-2xl border border-border space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                    {activeZoneDetail.etape} sur 4
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mt-1">
                    {activeZoneDetail.titre}
                  </h3>
                  <p className="text-xs font-semibold text-success-deep mt-1">
                    {activeZoneDetail.obligation}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-background border border-border">
                  <div className="text-xs uppercase font-bold tracking-wider text-text-muted mb-2">
                    En termes simples
                  </div>
                  <p className="text-sm text-ink leading-relaxed">
                    {activeZoneDetail.explication}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-background border border-border">
                  <div className="text-xs uppercase font-bold tracking-wider text-text-muted mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-success-deep" />
                    <span>Ce que Ceilow fait à votre place</span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {activeZoneDetail.automatisationCeilow}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/register"
                    className="bg-primary hover:bg-primary-hover text-ink font-bold text-sm px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2 min-h-[44px]"
                  >
                    <span>Essayer gratuitement</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="bg-background text-ink font-bold text-sm px-6 py-3 rounded-xl border border-border hover:border-ink transition-all inline-flex items-center min-h-[44px]"
                  >
                    Voir la démo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. TABLEAU DES GROUPES A à F & AIB ── */}
        <section id="groupes-taxation" className="w-full py-16 lg:py-20 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Les 6 Catégories de Taxes DGI
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Quel groupe de taxe (A à F) choisir sur vos lignes de facture ?
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Chaque produit ou service facturé sur e-MECeF appartient à l&apos;un de ces 6 groupes. Choisir le bon groupe évite toute erreur lors de votre déclaration de TVA.
              </p>
            </div>

            <div className="hidden lg:block bg-background rounded-2xl border border-border overflow-hidden shadow-xs mb-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-xs uppercase tracking-wider text-text-muted font-bold">
                    <th className="py-4 px-5">Groupe</th>
                    <th className="py-4 px-5">Catégorie</th>
                    <th className="py-4 px-5">TVA appliquée</th>
                    <th className="py-4 px-5">Quand le choisir ?</th>
                    <th className="py-4 px-5">Exemples courants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {TAX_GROUPS.map((row) => (
                    <tr key={row.code} className="hover:bg-background-secondary/50 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-ink whitespace-nowrap">
                        {row.code}
                      </td>
                      <td className="py-4 px-5 font-semibold text-ink">{row.libelle}</td>
                      <td className="py-4 px-5 font-mono font-bold text-ink tabular-nums">
                        {row.taux}
                      </td>
                      <td className="py-4 px-5 text-text-muted">{row.casUsage}</td>
                      <td className="py-4 px-5 text-text-muted">{row.exemple}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4 mb-10">
              {TAX_GROUPS.map((row) => (
                <div key={row.code} className="bg-background p-5 rounded-xl border border-border space-y-2.5">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <span className="font-mono font-bold text-sm text-ink">
                      {row.code} : {row.libelle}
                    </span>
                    <span className="font-mono font-bold text-xs text-ink tabular-nums">
                      TVA {row.taux}
                    </span>
                  </div>
                  <p className="text-xs text-ink leading-relaxed">{row.casUsage}</p>
                  <p className="text-xs text-text-muted">
                    <span className="font-semibold text-ink">Exemple : </span>
                    {row.exemple}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-background p-6 sm:p-8 rounded-2xl border border-border grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-text-muted">
                  Comprendre l&apos;avance d&apos;impôt AIB
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-ink">
                  Quand compter l&apos;AIB à 1 % ou à 5 % sur une facture ?
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  L&apos;AIB (Acompte sur Impôt assis sur les Bénéfices) est une avance sur l&apos;impôt calculée sur le montant hors taxes lorsqu&apos;elle s&apos;applique : <strong className="text-ink">1 %</strong> quand votre partenaire possède un numéro IFU valide, et <strong className="text-ink">5 %</strong> s&apos;il n&apos;a pas d&apos;IFU enregistré. Cette somme est ensuite déduite de l&apos;impôt sur les bénéfices de l&apos;entreprise.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3">
                <div className="p-3.5 rounded-xl bg-background-secondary border border-border flex items-center justify-between text-xs font-mono">
                  <span className="text-ink font-semibold">Client avec IFU valide</span>
                  <span className="font-bold text-ink tabular-nums">AIB 1 %</span>
                </div>
                <div className="p-3.5 rounded-xl bg-background-secondary border border-border flex items-center justify-between text-xs font-mono">
                  <span className="text-ink font-semibold">Client sans numéro IFU</span>
                  <span className="font-bold text-ink tabular-nums">AIB 5 %</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. CORRIGER, VÉRIFIER & ÉVITER LES AMENDES ── */}
        <section id="erreurs-avoirs" className="w-full py-16 lg:py-20 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Bons Réflexes au Quotidien
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Comment corriger une erreur, vérifier une facture et éviter les amendes ?
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Trois habitudes simples pour rester irréprochable en cas de contrôle fiscal au Bénin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-7 rounded-2xl border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink">
                    1. Corriger via une facture d&apos;avoir
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Vous avez fait une faute sur un prix ou un client annule sa commande ? Ne supprimez jamais la facture d&apos;origine. Créez une facture d&apos;avoir (facture négative officielle de type FA) en recopiant le code à 24 caractères de la facture erronée.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-ink pt-3 border-t border-border">
                  Type officiel : FA / EA
                </span>
              </div>

              <div className="bg-background-secondary p-7 rounded-2xl border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center">
                    <Search className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink">
                    2. Scanner les factures d&apos;achat reçues
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Avant de compter un achat ou de récupérer sa TVA, scannez le QR code avec l&apos;application gratuite MECeF BENIN sur votre téléphone. Une facture sans QR code authentique ne vous permet pas de récupérer la TVA payée.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-ink pt-3 border-t border-border">
                  Appli gratuite : MECeF BENIN
                </span>
              </div>

              <div className="bg-background-secondary p-7 rounded-2xl border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink">
                    3. Bannir les factures Word et Excel
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Remettre un simple PDF sans code e-MECeF expose le vendeur à de fortes amendes prévues par la loi fiscale béninoise, et bloque la déduction des frais chez votre client. Conservez chaque facture validée pendant 10 ans.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-ink pt-3 border-t border-border">
                  Conservation légale : 10 ans
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. FAQ PEDAGOGIQUE (Alignée strictement sur le JSON-LD FAQPage) ── */}
        <section id="faq" className="w-full py-16 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Questions Fréquentes
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Vos questions sur la facture normalisée au Bénin
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

        {/* ── 9. MAILLAGE INTERNE DU COCON SÉMANTIQUE ── */}
        <section className="w-full py-14 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-1">
                Pour aller plus loin
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                Ressources et outils liés à la facturation DGI
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/solutions/facturation-dgi"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <Receipt className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Facturation e-MECeF avec Ceilow
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Créez vos factures officielles avec QR code en 3 secondes depuis votre téléphone, sans acheter de machine.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Découvrir le module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/ressources/guide-tva-benin"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <Scale className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Guide Pratique de la TVA au Bénin (18 %)
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Comprenez comment vos factures influencent la TVA à payer chaque 10 du mois et le seuil des 50 millions FCFA.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Lire le guide TVA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/ressources/calendrier-fiscal-benin"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Calendrier Fiscal Bénin 2026
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Toutes les dates limites DGI et CNSS (TVA le 10, salaires, cotisations sociales et bilan du 30 avril).
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Voir le calendrier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-background-secondary border border-border text-xs text-text-muted leading-relaxed flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-ink shrink-0 mt-0.5" />
              <p>
                <strong className="text-ink">Note d&apos;information :</strong> Ce guide résume les règles courantes du Code Général des Impôts du Bénin et du dispositif e-MECeF à jour en novembre 2026. Pour une opération particulière (marché exonéré, exportation spécifique), faites confirmer votre paramétrage par votre expert-comptable.
              </p>
            </div>
          </div>
        </section>

        {/* ── 10. BANNIÈRE DE CONVERSION ── */}
        <section className="w-full py-16 bg-ink text-background">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-background">
              Créez votre première facture DGI en 3 minutes
            </h2>

            <p className="text-sm sm:text-base text-background/80 max-w-xl mb-8 leading-relaxed">
              Testez Ceilow gratuitement sur 10 factures normalisées par mois. Zéro machine à acheter, aucune carte bancaire demandée.
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

      <PublicFooter className="w-full" />
    </div>
  );
}
