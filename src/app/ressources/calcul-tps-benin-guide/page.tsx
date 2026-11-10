"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  Receipt,
  Scale,
  ShieldCheck,
  Store,
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

interface TpsComparisonRow {
  critere: string;
  regimeTps: string;
  regimeReel: string;
}

const TPS_VS_REEL_ROWS: TpsComparisonRow[] = [
  {
    critere: "Qui est concerné ?",
    regimeTps: "Entreprises individuelles jusqu'à 50 M FCFA / an",
    regimeReel: "SARL, SAS, SA (dès le 1er franc) ou entreprise > 50 M FCFA",
  },
  {
    critere: "Impôt sur l'activité",
    regimeTps: "TPS unique : 5 % des ventes (minimum 10 000 FCFA)",
    regimeReel: "Impôt sur les bénéfices (IS / IBA) + patente + VPS",
  },
  {
    critere: "TVA à facturer (18 %)",
    regimeTps: "Non (vous facturez hors TVA)",
    regimeReel: "Oui, 18 % collectés et reversés chaque mois",
  },
  {
    critere: "Groupe sur facture e-MECeF",
    regimeTps: "Groupe E (0 % de TVA) sur toutes vos ventes",
    regimeReel: "Groupe B (18 % TVA) ou A / C selon les produits",
  },
  {
    critere: "Récupération de TVA sur achats",
    regimeTps: "Non déductible",
    regimeReel: "Oui, sur présentation de factures d'achat e-MECeF",
  },
  {
    critere: "Dates limites DGI",
    regimeTps: "Acomptes 10 févr. et 10 juin, solde annuel le 30 avril",
    regimeReel: "TVA le 10 de chaque mois + acomptes IS + bilan au 30 avril",
  },
];

export default function CalculTpsBeninGuidePage() {
  const [chiffreAffaires, setChiffreAffaires] = useState<number>(12000000);
  const [aibRetenus, setAibRetenus] = useState<number>(0);
  const [statutTest, setStatutTest] = useState<"ei_sous_50" | "ei_plus_50" | "sarl">("ei_sous_50");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // Calcul exact TPS Bénin : 5 % du CA annuel avec minimum de perception 10 000 FCFA (+ 4 000 F ORTB)
  const tpsBrute = Math.round(chiffreAffaires * 0.05);
  const tpsDeBase = Math.max(10000, tpsBrute);
  const redevanceOrtb = 4000;
  const totalExigible = tpsDeBase + redevanceOrtb;
  const netApresAib = Math.max(0, totalExigible - aibRetenus);
  const acompteIndicatif = Math.round(tpsDeBase * 0.5);

  const formatFcfa = (val: number) =>
    new Intl.NumberFormat("fr-FR").format(val) + " FCFA";

  const faqs = [
    {
      q: "Une société (SARL ou SAS) peut-elle choisir le régime TPS ?",
      a: "Non. Au Bénin, la TPS s'adresse uniquement aux entreprises individuelles (établissements, artisans, prestataires en nom propre) dont le chiffre d'affaires annuel reste égal ou inférieur à 50 millions de FCFA. Une société (SARL, SAS, SA) relève dès sa création de l'Impôt sur les Sociétés (IS) et du régime réel, même avec un petit chiffre d'affaires.",
    },
    {
      q: "Combien paie-t-on si l'activité vient de démarrer ou n'a rien encaissé ?",
      a: "Le Code Général des Impôts prévoit un minimum de perception de base de 10 000 FCFA même lorsque 5 % de vos recettes donnent un montant inférieur, auquel s'ajoute habituellement le prélèvement annuel ORTB de 4 000 FCFA lors de la liquidation.",
    },
    {
      q: "La TPS dispense-t-elle de faire des factures normalisées e-MECeF ?",
      a: "Non. Toutes les entreprises béninoises, y compris au régime TPS, doivent remettre des factures normalisées avec QR code à leurs clients. Vous sélectionnez simplement le Groupe E (0 % de TVA) sur vos factures e-MECeF pour ne pas facturer de TVA.",
    },
    {
      q: "Quelles sont les dates limites pour déclarer et payer la TPS ?",
      a: "La TPS se règle en deux acomptes provisionnels au plus tard le 10 février et le 10 juin, puis le solde éventuel accompagne votre déclaration annuelle au plus tard le 30 avril de l'année suivante sur le portail e-Services de la DGI.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans antialiased selection:bg-primary selection:text-ink">
      <style jsx global>{`
        @keyframes tpsBarFill {
          0%, 100% { width: 28px; opacity: 0.7; }
          50% { width: 64px; opacity: 1; }
        }
        @keyframes tpsCheckFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .tps-bar-anim {
          animation: tpsBarFill 3.2s ease-in-out infinite;
        }
        .tps-card-anim {
          animation: tpsCheckFloat 3.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .tps-bar-anim,
          .tps-card-anim {
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
                    <Link href="/ressources/calendrier-fiscal-benin">Ressources Fiscales</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Guide Calcul TPS Bénin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3">
                  Guide Fiscal PME Bénin 2026
                </span>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight mb-4">
                  Calcul de la TPS au Bénin : taux 5 %, seuil et dates limites 2026
                </h1>

                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Estimez votre impôt unique en quelques secondes, sans surprise au moment de payer)
                </p>

                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Le <strong className="text-ink font-semibold">calcul de la TPS au Bénin</strong> concerne chaque commerçant, artisan et prestataire en entreprise individuelle dont les ventes ne dépassent pas 50 millions de FCFA par an. Découvrez comment calculer cet impôt forfaitaire de 5 %, ce qu&apos;il remplace et quand verser vos acomptes aux impôts.
                </p>

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
                    <span>Lecture : 6 minutes</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <a
                    href="#simulateur-tps"
                    className="bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Calculer ma TPS</span>
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
                      src="/images/commercante-cotonou.jpg"
                      alt="Commerçante béninoise gérant sa boutique au régime TPS à Cotonou"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Régime simplifié DGI</span>
                      <span className="text-success-deep">Taux unique : 5 %</span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Jusqu&apos;à 50 millions FCFA par an : un seul impôt global à la place de quatre taxes séparées.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. SOMMAIRE SCANNABLE ── */}
        <nav aria-label="Sommaire du guide TPS" className="w-full py-6 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted shrink-0">
                Dans ce guide pratique :
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="#definition-tps"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  1. Définition et 4 impôts remplacés
                </a>
                <a
                  href="#qui-releve-tps"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  2. Qui peut payer la TPS ?
                </a>
                <a
                  href="#simulateur-tps"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  3. Simulateur à 5 %
                </a>
                <a
                  href="#echeances-tps"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  4. Dates limites (Févr. / Avr. / Juin)
                </a>
                <a
                  href="#tps-vs-reel"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  5. Comparatif TPS vs Réel
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

        {/* ── 3. DÉFINITION 50 MOTS & LES 4 IMPÔTS REMPLACÉS ── */}
        <section id="definition-tps" className="w-full py-16 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted block">
                  L&apos;essentiel en 50 mots
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Qu&apos;est-ce que la Taxe Professionnelle Synthétique (TPS) ?
                </h2>

                <div className="p-6 rounded-2xl bg-background-secondary border border-border">
                  <p className="text-sm sm:text-base text-ink leading-relaxed font-medium">
                    La Taxe Professionnelle Synthétique (TPS) est un impôt forfaitaire unique destiné aux petites entreprises individuelles au Bénin dont les ventes annuelles restent sous 50 millions de FCFA. Fixée à 5 % du chiffre d&apos;affaires (avec un minimum de 10 000 FCFA), elle regroupe quatre anciens impôts en un seul règlement.
                  </p>
                </div>

                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Au lieu de calculer séparément plusieurs taxes compliquées, la TPS réunit dans un même pourcentage :
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-background-secondary border border-border">
                    <div className="text-sm font-bold text-ink mb-1">1. Impôt sur les Bénéfices d&apos;Affaires (IBA)</div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      L&apos;impôt annuel sur ce que gagne le propriétaire de l&apos;entreprise individuelle.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background-secondary border border-border">
                    <div className="text-sm font-bold text-ink mb-1">2. Contribution des patentes</div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      La taxe locale liée à l&apos;autorisation d&apos;exercer une activité commerciale ou artisanale.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background-secondary border border-border">
                    <div className="text-sm font-bold text-ink mb-1">3. Contribution des licences</div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Le droit annuel demandé à certains commerces (dont la vente de boissons).
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background-secondary border border-border">
                    <div className="text-sm font-bold text-ink mb-1">4. Versement Patronal sur Salaires (VPS)</div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Attention : si vous employez des salariés, vous devez tout de même déclarer la CNSS et l&apos;impôt sur salaire (ITS).
                    </p>
                  </div>
                </div>
              </div>

              {/* SVG animé TPS */}
              <div className="lg:col-span-5 flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-background-secondary border border-border">
                <div className="w-64 h-44 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 260 170" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="25" y="24" width="210" height="122" rx="12" fill="#FFFFFF" stroke="#332E29" strokeWidth="2.5" />
                    <rect x="40" y="38" width="90" height="8" rx="3" fill="#332E29" />
                    <rect x="40" y="54" width="180" height="2" fill="#D8D5D0" />

                    <text x="40" y="76" fill="#8A857D" fontSize="9" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      TAUX TPS UNIQUE
                    </text>
                    <rect x="40" y="84" width="110" height="14" rx="4" fill="#F5F4F2" stroke="#D8D5D0" strokeWidth="1" />
                    <rect x="40" y="84" width="48" height="14" rx="4" fill="#FFD946" stroke="#332E29" strokeWidth="1.5" className="tps-bar-anim" />

                    <g className="tps-card-anim" transform="translate(178, 72)">
                      <rect x="0" y="0" width="44" height="34" rx="6" fill="#5FFFC2" stroke="#332E29" strokeWidth="2" />
                      <text x="22" y="21" textAnchor="middle" fill="#332E29" fontSize="13" fontWeight="900" fontFamily="'Inter', sans-serif">
                        5%
                      </text>
                    </g>

                    <text x="40" y="124" fill="#332E29" fontSize="9" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      MIN. DE BASE : 10 000 FCFA
                    </text>
                    <text x="40" y="137" fill="#8A857D" fontSize="8" fontFamily="'Inter', sans-serif">
                      FACTURE e-MECeF : GROUPE E (0 % TVA)
                    </text>
                  </svg>
                </div>

                <h3 className="text-base font-bold text-ink mb-2">
                  Un calcul clair basé sur vos recettes
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Avec Ceilow, chaque facture Groupe E validée s&apos;additionne au fil de l&apos;année pour estimer votre TPS avant l&apos;échéance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. TESTEUR D'ÉLIGIBILITÉ TPS ── */}
        <section id="qui-releve-tps" className="w-full py-16 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Vérifier votre situation
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Votre entreprise dépend-elle vraiment de la TPS ?
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Deux critères comptent au Bénin : la forme juridique (entreprise individuelle ou société) et le total de vos ventes sur l&apos;année.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setStatutTest("ei_sous_50")}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer min-h-[64px] ${
                    statutTest === "ei_sous_50"
                      ? "bg-background border-primary ring-2 ring-primary/40 shadow-xs"
                      : "bg-background border-border hover:border-ink"
                  }`}
                >
                  <div className="font-bold text-sm text-ink">
                    Établissement / Entreprise individuelle (50 M FCFA ou moins)
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Boutique, artisan, consultant ou commerce en nom propre
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatutTest("ei_plus_50")}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer min-h-[64px] ${
                    statutTest === "ei_plus_50"
                      ? "bg-background border-primary ring-2 ring-primary/40 shadow-xs"
                      : "bg-background border-border hover:border-ink"
                  }`}
                >
                  <div className="font-bold text-sm text-ink">
                    Entreprise individuelle qui dépasse 50 millions FCFA
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Ventes annuelles au-dessus du plafond TPS
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatutTest("sarl")}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer min-h-[64px] ${
                    statutTest === "sarl"
                      ? "bg-background border-primary ring-2 ring-primary/40 shadow-xs"
                      : "bg-background border-border hover:border-ink"
                  }`}
                >
                  <div className="font-bold text-sm text-ink">
                    Société (SARL, SARLU, SAS, SA)
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Quel que soit votre chiffre d&apos;affaires annuel
                  </div>
                </button>
              </div>

              <div className="lg:col-span-7 bg-background p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-5">
                {statutTest === "ei_sous_50" && (
                  <>
                    <div className="border-b border-border pb-4">
                      <div className="text-xs font-bold text-success-deep inline-flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Vous relevez bien de la TPS</span>
                      </div>
                      <h3 className="text-xl font-bold text-ink">
                        Impôt à 5 % de vos ventes, sans facturer la TVA
                      </h3>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Votre entreprise paie la Taxe Professionnelle Synthétique au taux de 5 % sur son chiffre d&apos;affaires (avec un minimum de 10 000 FCFA hors taxe ORTB). Vos factures e-MECeF restent obligatoires mais portent 0 % de TVA (Groupe E).
                    </p>
                  </>
                )}

                {statutTest === "ei_plus_50" && (
                  <>
                    <div className="border-b border-border pb-4">
                      <div className="text-xs font-bold text-warning-deep inline-flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Passage obligatoire au Régime Réel</span>
                      </div>
                      <h3 className="text-xl font-bold text-ink">
                        Vous quittez la TPS pour facturer la TVA à 18 %
                      </h3>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Dès que vos recettes dépassent 50 millions FCFA sur l&apos;année, la DGI vous fait basculer au régime réel : vous facturez la TVA à 18 % (Groupe B), vous déduisez la TVA de vos achats normalisés et vous restez à ce régime pendant au moins 3 ans d&apos;affilée.
                    </p>
                  </>
                )}

                {statutTest === "sarl" && (
                  <>
                    <div className="border-b border-border pb-4">
                      <div className="text-xs font-bold text-ink inline-flex items-center gap-1.5 mb-1">
                        <Store className="w-4 h-4 shrink-0" />
                        <span>Exclue de la TPS par la loi</span>
                      </div>
                      <h3 className="text-xl font-bold text-ink">
                        Régime Réel automatique (IS + TVA 18 %)
                      </h3>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Au Bénin, une société commerciale (SARL, SARLU, SAS) ne peut pas payer la TPS, même la première année ou sous 50 millions FCFA. Vous déclarez la TVA chaque 10 du mois et l&apos;Impôt sur les Sociétés (IS).
                    </p>
                  </>
                )}

                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/pour-qui/pme-et-independants"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-ink underline underline-offset-4 hover:opacity-80 min-h-[44px]"
                  >
                    <span>Voir Ceilow pour PME et indépendants</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/ressources/guide-tva-benin"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-ink underline underline-offset-4 hover:opacity-80 min-h-[44px]"
                  >
                    <span>Comprendre le régime TVA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. SIMULATEUR INTERACTIF TPS À 5 % ── */}
        <section id="simulateur-tps" className="w-full py-16 lg:py-20 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Calculateur en Ligne
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Simulez le montant de votre TPS en Francs CFA
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Indiquez vos ventes annuelles estimées et les éventuelles avances d&apos;impôt AIB déjà retenues par vos clients entreprises sur l&apos;année.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 bg-background-secondary p-6 sm:p-8 rounded-2xl border border-border space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="slider-ca-tps" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Chiffre d&apos;affaires annuel (jusqu&apos;à 50 M FCFA)
                    </label>
                    <span className="text-lg font-bold font-mono text-ink tabular-nums">
                      {formatFcfa(chiffreAffaires)}
                    </span>
                  </div>
                  <input
                    id="slider-ca-tps"
                    type="range"
                    min="0"
                    max="50000000"
                    step="500000"
                    value={chiffreAffaires}
                    onChange={(e) => setChiffreAffaires(Number(e.target.value))}
                    className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                  />
                  <div className="flex justify-between text-[11px] text-text-muted font-mono mt-1.5">
                    <span>0 FCFA</span>
                    <span>25 M FCFA</span>
                    <span>Plafond : 50 M FCFA</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="slider-aib-tps" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Avances d&apos;impôt AIB déjà retenues (1 % / 5 %)
                    </label>
                    <span className="text-lg font-bold font-mono text-ink tabular-nums">
                      {formatFcfa(aibRetenus)}
                    </span>
                  </div>
                  <input
                    id="slider-aib-tps"
                    type="range"
                    min="0"
                    max="1000000"
                    step="25000"
                    value={aibRetenus}
                    onChange={(e) => setAibRetenus(Number(e.target.value))}
                    className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                  />
                </div>

                <div className="p-4 rounded-xl bg-background border border-border text-xs text-text-muted leading-relaxed">
                  <strong className="text-ink">Astuce pratique :</strong> gardez vos attestations et factures où des sociétés clientes vous ont retenu l&apos;AIB : ces avances viennent en déduction de votre impôt annuel.
                </div>
              </div>

              <div className="lg:col-span-6 bg-background-secondary p-6 sm:p-8 rounded-2xl border border-border space-y-5">
                <div className="border-b border-border pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                    Estimation Annuelle Indicative
                  </span>
                  <h3 className="text-xl font-bold text-ink mt-1">
                    Détail de votre TPS
                  </h3>
                </div>

                <div className="space-y-3 text-xs sm:text-sm font-mono">
                  <div className="p-4 rounded-xl bg-background border border-border flex justify-between items-center gap-2">
                    <span className="font-sans text-text-muted">
                      TPS de base (5 %, minimum 10 000 F)
                    </span>
                    <span className="font-bold text-ink tabular-nums">{formatFcfa(tpsDeBase)}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border flex justify-between items-center gap-2">
                    <span className="font-sans text-text-muted">
                      Redevance annuelle ORTB (forfait)
                    </span>
                    <span className="font-bold text-ink tabular-nums">+ {formatFcfa(redevanceOrtb)}</span>
                  </div>
                  {aibRetenus > 0 && (
                    <div className="p-4 rounded-xl bg-background border border-border flex justify-between items-center gap-2">
                      <span className="font-sans text-text-muted">
                        Avances AIB déjà prélevées
                      </span>
                      <span className="font-bold text-ink tabular-nums">- {formatFcfa(aibRetenus)}</span>
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-xl bg-primary/25 border border-primary flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase font-bold text-ink block">
                      Total estimé à payer sur l&apos;année
                    </span>
                    <span className="text-xs text-text-muted">
                      Chaque acompte (févr. / juin) représente env. {formatFcfa(acompteIndicatif)} hors régularisation
                    </span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-ink tabular-nums">
                    {formatFcfa(netApresAib)}
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href="/register"
                    className="bg-primary hover:bg-primary-hover text-ink font-bold text-sm px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2 min-h-[44px]"
                  >
                    <span>Suivre mes ventes</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs text-text-muted">
                    Simulation indicative à confirmer sur e-Services
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. ÉCHÉANCES OFFICIELLES DE PAIEMENT TPS ── */}
        <section id="echeances-tps" className="w-full py-16 lg:py-20 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Calendrier DGI TPS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Quand payer votre TPS et déposer votre déclaration ?
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Le règlement de la Taxe Professionnelle Synthétique suit trois dates précises sur le portail e-Services de la DGI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-7 rounded-2xl border border-border space-y-3">
                <span className="text-xs font-mono font-bold text-ink">10 février au plus tard</span>
                <h3 className="text-lg font-bold text-ink">1er acompte provisionnel</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Vous versez le premier acompte calculé d&apos;après la TPS payée l&apos;année précédente (ou votre estimation si vous débutez votre activité).
                </p>
              </div>

              <div className="bg-background p-7 rounded-2xl border border-border space-y-3">
                <span className="text-xs font-mono font-bold text-ink">30 avril au plus tard</span>
                <h3 className="text-lg font-bold text-ink">Déclaration annuelle et solde</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Vous déclarez le total exact de vos ventes de l&apos;année passée, déduisez vos acomptes et réglez le solde restant sur e-Services.
                </p>
              </div>

              <div className="bg-background p-7 rounded-2xl border border-border space-y-3">
                <span className="text-xs font-mono font-bold text-ink">10 juin au plus tard</span>
                <h3 className="text-lg font-bold text-ink">2e acompte provisionnel</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Vous versez le second acompte pour l&apos;année en cours afin d&apos;étaler la charge fiscale avant la clôture suivante.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. COMPARATIF TPS VS RÉGIME RÉEL ── */}
        <section id="tps-vs-reel" className="w-full py-16 lg:py-20 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Comparatif Direct
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Régime TPS ou Régime Réel (TVA) : quelles différences au quotidien ?
              </h2>
            </div>

            <div className="hidden lg:block bg-background rounded-2xl border border-border overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-xs uppercase tracking-wider text-text-muted font-bold">
                    <th className="py-4 px-5">Point clé</th>
                    <th className="py-4 px-5">Régime TPS (sous 50 M FCFA)</th>
                    <th className="py-4 px-5">Régime Réel (TVA 18 % et IS/IBA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {TPS_VS_REEL_ROWS.map((row) => (
                    <tr key={row.critere} className="hover:bg-background-secondary/40 transition-colors">
                      <td className="py-4 px-5 font-bold text-ink">{row.critere}</td>
                      <td className="py-4 px-5 text-ink">{row.regimeTps}</td>
                      <td className="py-4 px-5 text-text-muted">{row.regimeReel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {TPS_VS_REEL_ROWS.map((row) => (
                <div key={row.critere} className="bg-background-secondary p-5 rounded-xl border border-border space-y-2.5">
                  <div className="font-bold text-sm text-ink border-b border-border pb-2">
                    {row.critere}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-ink block">Régime TPS :</span>
                    <span className="text-text-muted">{row.regimeTps}</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-ink block">Régime Réel :</span>
                    <span className="text-text-muted">{row.regimeReel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. FAQ (Alignée sur FAQPage JSON-LD) ── */}
        <section id="faq" className="w-full py-16 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Questions Fréquentes
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Vos questions sur la TPS au Bénin
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
                Ressources et Solutions Liées
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                Continuez avec les outils adaptés aux petites entreprises
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/pour-qui/pme-et-independants"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <Store className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Ceilow pour PME et Indépendants
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Facturez en Groupe E sans boîtier physique, suivez vos ventes et préparez votre bilan annuel sans jargon.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Voir la solution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/ressources/guide-facturation-emecef-benin"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <Receipt className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Guide Facture Normalisée e-MECeF
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Comment facturer en Groupe E sans TVA, appliquer l&apos;AIB et corriger une erreur via un avoir officiel.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Lire le guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/ressources/calendrier-fiscal-benin"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <Calendar className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Calendrier Fiscal Bénin 2026
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Gardez sous les yeux toutes vos échéances DGI et CNSS (10 février, 30 avril, 10 juin).
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
                <strong className="text-ink">Note d&apos;information :</strong> Ce guide présente les règles générales de la Taxe Professionnelle Synthétique issues du Code Général des Impôts du Bénin (mises à jour au 10 novembre 2026). Vérifiez votre avis d&apos;imposition sur e-Services ou auprès de votre centre des impôts pour toute exonération spécifique.
              </p>
            </div>
          </div>
        </section>

        {/* ── 10. BANNIÈRE DE CONVERSION ── */}
        <section className="w-full py-16 bg-ink text-background">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mb-4">
              <Scale className="w-6 h-6" />
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-background">
              Pilotez votre entreprise en toute sérénité
            </h2>

            <p className="text-sm sm:text-base text-background/80 max-w-xl mb-8 leading-relaxed">
              Émettez vos factures Groupe E sans machine physique et suivez l&apos;évolution de votre chiffre d&apos;affaires vers le seuil des 50 millions FCFA.
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
