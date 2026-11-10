"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  ShieldCheck,
  Users,
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

interface CnssBranchRow {
  branche: string;
  partSalarie: string;
  partEmployeur: string;
  totalBranche: string;
  aQuoiCaSert: string;
}

interface ItsBracketRow {
  tranche: string;
  taux: string;
  impotMaxTranche: string;
}

const CNSS_BRANCHES: CnssBranchRow[] = [
  {
    branche: "Prestations familiales (dont 0,2 % maternité)",
    partSalarie: "0 %",
    partEmployeur: "9,0 %",
    totalBranche: "9,0 %",
    aQuoiCaSert: "Allocations familiales et congés de maternité",
  },
  {
    branche: "Assurance vieillesse, invalidité et décès",
    partSalarie: "3,6 %",
    partEmployeur: "6,4 %",
    totalBranche: "10,0 %",
    aQuoiCaSert: "Pension de retraite future du salarié",
  },
  {
    branche: "Risques professionnels (accidents / maladies pro.)",
    partSalarie: "0 %",
    partEmployeur: "1,0 % à 4,0 %",
    totalBranche: "1,0 % à 4,0 %",
    aQuoiCaSert: "Couverture des accidents du travail selon votre secteur",
  },
  {
    branche: "Total Cotisations CNSS (sur 100 % du brut, sans plafond)",
    partSalarie: "3,6 %",
    partEmployeur: "16,4 % à 19,4 %",
    totalBranche: "20,0 % à 23,0 %",
    aQuoiCaSert: "Versé à la CNSS (portail e-Cotisations)",
  },
];

const ITS_BRACKETS: ItsBracketRow[] = [
  { tranche: "De 0 à 60 000 FCFA", taux: "0 %", impotMaxTranche: "0 FCFA" },
  { tranche: "De 60 001 à 150 000 FCFA", taux: "10 %", impotMaxTranche: "9 000 FCFA" },
  { tranche: "De 150 001 à 250 000 FCFA", taux: "15 %", impotMaxTranche: "15 000 FCFA" },
  { tranche: "De 250 001 à 500 000 FCFA", taux: "19 %", impotMaxTranche: "47 500 FCFA" },
  { tranche: "Au-delà de 500 000 FCFA", taux: "30 %", impotMaxTranche: "Selon salaire" },
];

export default function BaremeCotisationsCnssBeninPage() {
  const [salaireBrut, setSalaireBrut] = useState<number>(250000);
  const [risqueProRate, setRisqueProRate] = useState<number>(1);
  const [vpsRate, setVpsRate] = useState<number>(4);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // CNSS Bénin sur brut total sans plafond
  const cnssSalarie = Math.round(salaireBrut * 0.036);
  const cnssEmployeurRate = (9 + 6.4 + risqueProRate) / 100;
  const cnssEmployeur = Math.round(salaireBrut * cnssEmployeurRate);

  // ITS mensuel (CGI Bénin : base = salaire brut arrondi au millier inférieur, tranches 0/10/15/19/30 %)
  const baseIts = Math.floor(salaireBrut / 1000) * 1000;
  let itsCalcule = 0;
  if (baseIts > 60000) {
    itsCalcule += Math.min(baseIts - 60000, 90000) * 0.1;
  }
  if (baseIts > 150000) {
    itsCalcule += Math.min(baseIts - 150000, 100000) * 0.15;
  }
  if (baseIts > 250000) {
    itsCalcule += Math.min(baseIts - 250000, 250000) * 0.19;
  }
  if (baseIts > 500000) {
    itsCalcule += (baseIts - 500000) * 0.3;
  }
  const itsMensuel = Math.round(itsCalcule);

  // VPS (charge employeur DGI)
  const vpsMensuel = Math.round(salaireBrut * (vpsRate / 100));

  const salaireNet = Math.max(0, salaireBrut - cnssSalarie - itsMensuel);
  const coutTotalEmployeur = salaireBrut + cnssEmployeur + vpsMensuel;

  const formatFcfa = (val: number) =>
    new Intl.NumberFormat("fr-FR").format(val) + " FCFA";

  const faqs = [
    {
      q: "Existe-t-il un plafond de salaire pour les cotisations CNSS au Bénin ?",
      a: "Non. Selon l'article 22 du Code de sécurité sociale béninois, les cotisations CNSS (3,6 % salarié et 16,4 % à 19,4 % employeur) se calculent sur la totalité du salaire brut perçu, primes et indemnités imposables comprises, sans aucun plafond mensuel.",
    },
    {
      q: "Pourquoi la part employeur CNSS varie-t-elle entre 16,4 % et 19,4 % ?",
      a: "Les branches prestations familiales (9 %) et vieillesse employeur (6,4 %) représentent déjà 15,4 % pour toutes les entreprises. S'y ajoute le taux des risques professionnels (accidents du travail), qui va de 1 % pour les activités de bureau jusqu'à 4 % pour les métiers plus exposés comme le BTP ou l'industrie.",
    },
    {
      q: "Quelle est la différence entre l'ITS, le VPS et la CNSS ?",
      a: "La CNSS finance la protection sociale (retraite, famille, accidents du travail) et se paie sur le portail e-Cotisations CNSS. L'ITS (retenu sur le salaire de l'employé) et le VPS (4 % payés par l'employeur, ou 2 % pour l'enseignement privé) sont des impôts fiscaux versés à la DGI au plus tard le 10 du mois suivant.",
    },
    {
      q: "À quelle date déclarer et payer la CNSS au Bénin ?",
      a: "Si votre entreprise emploie moins de 20 salariés, vous déclarez et payez tous les trimestres dans les 15 jours suivant la fin du trimestre (15 avril, 15 juillet, 15 octobre, 15 janvier). Dès 20 salariés, la déclaration et le paiement deviennent mensuels au plus tard le 10 du mois suivant.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans antialiased selection:bg-primary selection:text-ink">
      <style jsx global>{`
        @keyframes gaugePulse {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.04); }
        }
        .cnss-bar-pulse {
          animation: gaugePulse 3.4s ease-in-out infinite;
          transform-origin: left center;
        }
        @media (prefers-reduced-motion: reduce) {
          .cnss-bar-pulse {
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
                  <BreadcrumbPage>Barème Cotisations CNSS Bénin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3">
                  Paie &amp; Charges Sociales Bénin 2026
                </span>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight mb-4">
                  Barème des cotisations CNSS au Bénin : taux employeur, salarié et calcul du net
                </h1>

                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Sachez exactement combien verser à votre salarié, à la CNSS et aux impôts avant d&apos;embaucher)
                </p>

                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Comprendre les <strong className="text-ink font-semibold">cotisations CNSS au Bénin</strong> évite les mauvaises surprises sur votre budget salarial. Consultez les taux officiels 2026 (part employeur de <span className="font-mono font-semibold text-ink">16,4 % à 19,4 %</span>, part salarié de <span className="font-mono font-semibold text-ink">3,6 %</span>, sans plafond), le barème de l&apos;impôt ITS, le VPS à 4 % et testez notre calculateur en direct.
                </p>

                <div className="w-full p-4 rounded-xl bg-background-secondary border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-muted mb-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success-deep shrink-0" />
                    <span>Vérifié : Équipe Paie Ceilow</span>
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

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <a
                    href="#simulateur-paie"
                    className="bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Calculer le coût</span>
                  </a>
                  <Link
                    href="/register"
                    className="bg-background-secondary hover:border-ink text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl border border-border transition-all text-center min-h-[48px] flex items-center justify-center gap-2"
                  >
                    <span>Tester gratuitement</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-card">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/conseillere-cotonou.jpg"
                      alt="Responsable RH préparant les bulletins de paie et cotisations CNSS au Bénin"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Code de Sécurité Sociale Bénin</span>
                      <span className="text-success-deep">Sans plafond mensuel</span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Toutes les cotisations CNSS s&apos;appliquent sur l&apos;intégralité du salaire brut imposable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. SOMMAIRE SCANNABLE ── */}
        <nav aria-label="Sommaire du barème CNSS" className="w-full py-6 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted shrink-0">
                Dans ce barème :
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="#taux-cnss"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  1. Taux CNSS (Employeur / Salarié)
                </a>
                <a
                  href="#its-vps"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  2. Impôts ITS et VPS (DGI)
                </a>
                <a
                  href="#simulateur-paie"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  3. Simulateur Salaire &amp; Coût
                </a>
                <a
                  href="#echeances-cnss"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  4. Dates e-Cotisations
                </a>
                <a
                  href="#faq"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  5. Questions fréquentes
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* ── 3. DÉFINITION 50 MOTS & BARÈME OFFICIEL CNSS ── */}
        <section id="taux-cnss" className="w-full py-16 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted block">
                  L&apos;essentiel en 50 mots
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Quels sont les taux officiels des cotisations CNSS au Bénin ?
                </h2>

                <div className="p-6 rounded-2xl bg-background-secondary border border-border">
                  <p className="text-sm sm:text-base text-ink leading-relaxed font-medium">
                    Au Bénin, tout salarié déclaré cotise à la CNSS à hauteur de 3,6 % retenus sur son salaire brut pour sa retraite. De son côté, l&apos;employeur verse entre 16,4 % et 19,4 % selon le secteur d&apos;activité, calculés sur l&apos;ensemble du salaire brut sans aucun plafond.
                  </p>
                </div>

                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Contrairement à d&apos;autres pays d&apos;Afrique de l&apos;Ouest où les cotisations s&apos;arrêtent à un plafond fixe, la loi béninoise (article 22 du Code de sécurité sociale) applique les taux CNSS sur <strong className="text-ink">100 % du salaire brut</strong> (salaire de base, heures supplémentaires, primes imposables et avantages en nature, hors remboursements de frais réels justifiés).
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center p-6 rounded-2xl bg-background-secondary border border-border">
                <div className="w-64 h-40 flex items-center justify-center mb-3">
                  <svg viewBox="0 0 260 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="20" y="18" width="220" height="124" rx="10" fill="#FFFFFF" stroke="#332E29" strokeWidth="2" />
                    <text x="36" y="42" fill="#332E29" fontSize="9" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      PART SALARIÉ : 3,6 % (Retraite)
                    </text>
                    <rect x="36" y="50" width="188" height="14" rx="4" fill="#F5F4F2" stroke="#D8D5D0" strokeWidth="1" />
                    <rect x="36" y="50" width="46" height="14" rx="4" fill="#5FFFC2" stroke="#332E29" strokeWidth="1.5" className="cnss-bar-pulse" />

                    <text x="36" y="90" fill="#332E29" fontSize="9" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      PART EMPLOYEUR : 16,4 % à 19,4 %
                    </text>
                    <rect x="36" y="98" width="188" height="14" rx="4" fill="#F5F4F2" stroke="#D8D5D0" strokeWidth="1" />
                    <rect x="36" y="98" width="136" height="14" rx="4" fill="#FFD946" stroke="#332E29" strokeWidth="1.5" className="cnss-bar-pulse" />

                    <text x="36" y="130" fill="#8A857D" fontSize="8" fontFamily="'Inter', sans-serif">
                      Assiette : 100 % du brut (sans plafond)
                    </text>
                  </svg>
                </div>
                <span className="text-xs font-bold text-ink text-center">
                  Répartition des charges CNSS sur le salaire brut
                </span>
              </div>
            </div>

            <div className="hidden lg:block bg-background rounded-2xl border border-border overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-xs uppercase tracking-wider text-text-muted font-bold">
                    <th className="py-4 px-5">Branche CNSS</th>
                    <th className="py-4 px-5">Part Salarié</th>
                    <th className="py-4 px-5">Part Employeur</th>
                    <th className="py-4 px-5">Total</th>
                    <th className="py-4 px-5">À quoi sert cette cotisation ?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {CNSS_BRANCHES.map((row, idx) => (
                    <tr
                      key={row.branche}
                      className={idx === CNSS_BRANCHES.length - 1 ? "bg-background-secondary font-bold" : "hover:bg-background-secondary/40"}
                    >
                      <td className="py-4 px-5 text-ink font-semibold">{row.branche}</td>
                      <td className="py-4 px-5 font-mono text-ink tabular-nums">{row.partSalarie}</td>
                      <td className="py-4 px-5 font-mono text-ink tabular-nums">{row.partEmployeur}</td>
                      <td className="py-4 px-5 font-mono text-ink tabular-nums">{row.totalBranche}</td>
                      <td className="py-4 px-5 text-xs text-text-muted">{row.aQuoiCaSert}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {CNSS_BRANCHES.map((row) => (
                <div key={row.branche} className="bg-background-secondary p-5 rounded-xl border border-border space-y-2.5">
                  <div className="font-bold text-sm text-ink border-b border-border pb-2">
                    {row.branche}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-text-muted block font-sans">Salarié</span>
                      <span className="font-bold text-ink">{row.partSalarie}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block font-sans">Employeur</span>
                      <span className="font-bold text-ink">{row.partEmployeur}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block font-sans">Total</span>
                      <span className="font-bold text-ink">{row.totalBranche}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted">{row.aQuoiCaSert}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. IMPÔTS SUR SALAIRE DGI : ITS & VPS ── */}
        <section id="its-vps" className="w-full py-16 lg:py-20 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Volet Fiscal DGI (à ne pas confondre avec la CNSS)
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Le barème de l&apos;impôt ITS et du VPS versés aux impôts (le 10 du mois)
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                En plus de la CNSS, chaque fiche de paie béninoise fait apparaître deux prélèvements fiscaux dus à la Direction Générale des Impôts (DGI) au plus tard le <strong className="text-ink">10 du mois suivant</strong> :
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-background rounded-2xl border border-border overflow-hidden shadow-xs">
                <div className="p-5 border-b border-border bg-background">
                  <h3 className="text-base font-bold text-ink">
                    1. Barème mensuel progressif de l&apos;ITS (retenu sur le salarié)
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    Calculé par tranches directement sur le salaire brut mensuel arrondi au millier inférieur (sans déduction pour enfants à charge ni abattement mensuel).
                  </p>
                </div>

                <div className="hidden sm:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-background-secondary text-xs uppercase tracking-wider text-text-muted font-bold">
                        <th className="py-3.5 px-5">Tranche de salaire brut mensuel</th>
                        <th className="py-3.5 px-5">Taux ITS</th>
                        <th className="py-3.5 px-5">Impôt max sur la tranche</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {ITS_BRACKETS.map((b) => (
                        <tr key={b.tranche}>
                          <td className="py-3.5 px-5 font-medium text-ink">{b.tranche}</td>
                          <td className="py-3.5 px-5 font-mono font-bold text-ink">{b.taux}</td>
                          <td className="py-3.5 px-5 font-mono text-text-muted">{b.impotMaxTranche}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden divide-y divide-border">
                  {ITS_BRACKETS.map((b) => (
                    <div key={b.tranche} className="p-4 flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-ink">{b.tranche}</span>
                      <span className="font-mono font-bold text-ink">{b.taux}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="bg-background p-6 rounded-2xl border border-border space-y-3">
                  <h3 className="text-base font-bold text-ink">
                    2. Le Versement Patronal sur Salaires (VPS)
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Le VPS est entièrement payé par l&apos;entreprise (jamais retiré du salaire du travailleur). Il s&apos;ajoute chaque mois sur le bordereau DGI avec l&apos;ITS :
                  </p>
                  <ul className="space-y-2 text-xs text-ink font-medium pt-1">
                    <li className="flex justify-between p-3 rounded-xl bg-background-secondary border border-border">
                      <span>Entreprises du régime général</span>
                      <span className="font-mono font-bold">4 % du brut</span>
                    </li>
                    <li className="flex justify-between p-3 rounded-xl bg-background-secondary border border-border">
                      <span>Établissements d&apos;enseignement privé</span>
                      <span className="font-mono font-bold">2 % du brut</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-background p-6 rounded-2xl border border-border space-y-2">
                  <span className="text-xs font-mono font-bold text-ink">
                    Comptabilisation SYSCOHADA associée
                  </span>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Vos salaires bruts passent en <strong className="text-ink">661</strong>, les charges employeur (CNSS + VPS) en <strong className="text-ink">664</strong>, le net à payer en <strong className="text-ink">421</strong>, la CNSS totale en <strong className="text-ink">431</strong>, l&apos;ITS en <strong className="text-ink">4473</strong> et le VPS en <strong className="text-ink">448</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. SIMULATEUR SALAIRE NET & COÛT TOTAL EMPLOYEUR ── */}
        <section id="simulateur-paie" className="w-full py-16 lg:py-20 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Calculateur Paie Bénin 2026
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Estimez le salaire net du salarié et le coût réel pour l&apos;entreprise
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Ajustez le salaire brut mensuel (à partir du SMIG béninois de 52 000 FCFA) et choisissez le taux de risque professionnel CNSS de votre secteur.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 bg-background-secondary p-6 sm:p-8 rounded-2xl border border-border space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="slider-brut-cnss" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Salaire brut mensuel
                    </label>
                    <span className="text-lg font-bold font-mono text-ink tabular-nums">
                      {formatFcfa(salaireBrut)}
                    </span>
                  </div>
                  <input
                    id="slider-brut-cnss"
                    type="range"
                    min="52000"
                    max="2000000"
                    step="10000"
                    value={salaireBrut}
                    onChange={(e) => setSalaireBrut(Number(e.target.value))}
                    className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                  />
                  <div className="flex justify-between text-[11px] text-text-muted font-mono mt-1.5">
                    <span>SMIG : 52 000 F</span>
                    <span>1 000 000 F</span>
                    <span>2 000 000 F</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                    Taux risques professionnels CNSS (secteur)
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setRisqueProRate(t)}
                        className={`py-2.5 rounded-xl border text-xs font-mono font-bold transition-colors cursor-pointer min-h-[44px] ${
                          risqueProRate === t
                            ? "bg-ink text-background border-ink"
                            : "bg-background text-ink border-border hover:border-ink"
                        }`}
                      >
                        {t} %
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                    Régime VPS employeur (DGI)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setVpsRate(4)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer min-h-[44px] ${
                        vpsRate === 4
                          ? "bg-ink text-background border-ink"
                          : "bg-background text-ink border-border hover:border-ink"
                      }`}
                    >
                      Général (4 %)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVpsRate(2)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer min-h-[44px] ${
                        vpsRate === 2
                          ? "bg-ink text-background border-ink"
                          : "bg-background text-ink border-border hover:border-ink"
                      }`}
                    >
                      École (2 %)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVpsRate(0)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer min-h-[44px] ${
                        vpsRate === 0
                          ? "bg-ink text-background border-ink"
                          : "bg-background text-ink border-border hover:border-ink"
                      }`}
                    >
                      Exonéré (0 %)
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-background-secondary p-6 sm:p-8 rounded-2xl border border-border space-y-5">
                <div className="border-b border-border pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                    Résultat Mensuel Indicatif
                  </span>
                  <h3 className="text-xl font-bold text-ink mt-1">
                    Détail fiche de paie et budget entreprise
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm font-mono">
                  <div className="p-3.5 rounded-xl bg-background border border-border flex justify-between items-center gap-2">
                    <span className="font-sans text-text-muted">CNSS part salarié (3,6 %)</span>
                    <span className="font-bold text-ink tabular-nums">- {formatFcfa(cnssSalarie)}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background border border-border flex justify-between items-center gap-2">
                    <span className="font-sans text-text-muted">Impôt ITS sur salaire</span>
                    <span className="font-bold text-ink tabular-nums">- {formatFcfa(itsMensuel)}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-success/30 border border-success flex justify-between items-center gap-2">
                    <span className="font-sans font-bold text-ink">Salaire net reçu par le salarié</span>
                    <span className="font-bold text-base text-ink tabular-nums">{formatFcfa(salaireNet)}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background border border-border flex justify-between items-center gap-2">
                    <span className="font-sans text-text-muted">
                      CNSS employeur ({(9 + 6.4 + risqueProRate).toFixed(1).replace(".", ",")} %)
                    </span>
                    <span className="font-bold text-ink tabular-nums">+ {formatFcfa(cnssEmployeur)}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background border border-border flex justify-between items-center gap-2">
                    <span className="font-sans text-text-muted">VPS employeur ({vpsRate} %)</span>
                    <span className="font-bold text-ink tabular-nums">+ {formatFcfa(vpsMensuel)}</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-primary/25 border border-primary flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase font-bold text-ink block">
                      Coût total pour l&apos;entreprise
                    </span>
                    <span className="text-xs text-text-muted">
                      Brut + CNSS employeur + VPS
                    </span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-ink tabular-nums">
                    {formatFcfa(coutTotalEmployeur)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. ÉCHÉANCES E-COTISATIONS CNSS ── */}
        <section id="echeances-cnss" className="w-full py-16 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Portail e-Cotisations CNSS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Quand envoyer vos déclarations et payer la CNSS ?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded-2xl border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-ink">Moins de 20 salariés</span>
                <h3 className="text-lg font-bold text-ink">Déclaration trimestrielle</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Déposez votre relevé nominatif dans les 15 jours suivant chaque trimestre : <strong className="text-ink">15 avril, 15 juillet, 15 octobre et 15 janvier</strong>.
                </p>
              </div>

              <div className="bg-background p-6 rounded-2xl border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-ink">20 salariés et plus</span>
                <h3 className="text-lg font-bold text-ink">Déclaration mensuelle</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  La déclaration et le règlement passent à un rythme mensuel, au plus tard <strong className="text-ink">le 10 de chaque mois</strong> pour les salaires du mois passé.
                </p>
              </div>

              <div className="bg-background p-6 rounded-2xl border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-error-deep">Attention aux retards</span>
                <h3 className="text-lg font-bold text-ink">Majoration de 1,50 % par mois</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Tout mois ou fraction de mois de retard déclenche une majoration légale de <strong className="text-ink">1,50 %</strong> sur les cotisations CNSS dues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. FAQ (Alignée sur FAQPage JSON-LD) ── */}
        <section id="faq" className="w-full py-16 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Questions Fréquentes
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Vos questions sur les cotisations CNSS au Bénin
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.q}
                    className="border border-border rounded-2xl bg-background-secondary overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-ink text-sm sm:text-base hover:bg-background transition-colors cursor-pointer min-h-[48px]"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-ink shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-text-muted leading-relaxed border-t border-border pt-4 bg-background">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 8. MAILLAGE INTERNE ── */}
        <section className="w-full py-14 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-1">
                Ressources et Outils Associés
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                Préparez vos fiches de paie et déclarations en un seul outil
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/solutions/paie-cnss"
                className="group p-6 rounded-2xl bg-background border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Module Paie &amp; CNSS Ceilow
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Éditez vos bulletins de salaire, préparez votre déclaration e-Cotisations CNSS et suivez votre ITS/VPS.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Voir la solution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/ressources/calendrier-fiscal-benin"
                className="group p-6 rounded-2xl bg-background border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center mb-4">
                    <Calendar className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Calendrier Fiscal &amp; Social 2026
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Toutes les échéances DGI du 10 du mois et les dates trimestrielles du 15 pour vos versements CNSS.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Voir le calendrier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/ressources/plan-comptable-syscohada-pdf"
                className="group p-6 rounded-2xl bg-background border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Plan Comptable SYSCOHADA (661 / 431)
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Retrouvez les numéros exacts pour enregistrer les salaires bruts, la CNSS et l&apos;impôt ITS.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Consulter le plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-background border border-border text-xs text-text-muted leading-relaxed flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-ink shrink-0 mt-0.5" />
              <p>
                <strong className="text-ink">Note d&apos;information :</strong> Ce guide présente les taux du régime général de sécurité sociale (CNSS Bénin) et du barème mensuel ITS/VPS du Code Général des Impôts en vigueur en novembre 2026. Le taux exact de risque professionnel (1 % à 4 %) figure sur la notification attribuée à votre entreprise par la CNSS.
              </p>
            </div>
          </div>
        </section>

        {/* ── 9. BANNIÈRE CONVERSION ── */}
        <section className="w-full py-16 bg-ink text-background">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-background">
              Préparez vos fiches de paie sans erreur Excel
            </h2>

            <p className="text-sm sm:text-base text-background/80 max-w-xl mb-8 leading-relaxed">
              Testez Ceilow gratuitement pendant 14 jours : bulletins de salaire, retenues CNSS et écritures comptables reliées.
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
