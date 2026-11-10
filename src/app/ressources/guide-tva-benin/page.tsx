"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronUp,
  Clock,
  FileCheck,
  HelpCircle,
  Percent,
  Receipt,
  Scale,
  ShieldCheck,
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

interface TvaMechanismRow {
  notion: string;
  compteSyscohada: string;
  calcul: string;
  effetTresorerie: string;
}

const TVA_MECHANISMS: TvaMechanismRow[] = [
  {
    notion: "TVA encaissée sur vos ventes",
    compteSyscohada: "Compte 4431",
    calcul: "Prix HT x 18 % (sur vos ventes imposables Groupe B)",
    effetTresorerie: "Montant facturé à vos clients pour le compte de l'État",
  },
  {
    notion: "TVA payée sur vos achats",
    compteSyscohada: "Compte 4452",
    calcul: "TVA affichée sur vos factures fournisseurs normalisées e-MECeF",
    effetTresorerie: "Somme que vous déduisez directement de la TVA à payer",
  },
  {
    notion: "TVA nette à payer",
    compteSyscohada: "Compte 4441",
    calcul: "TVA sur ventes - TVA sur achats - Crédit précédent (> 0)",
    effetTresorerie: "Montant exact à verser avant le 10 du mois sur e-Services",
  },
  {
    notion: "Crédit de TVA (reporté)",
    compteSyscohada: "Compte 4449",
    calcul: "Quand vos achats dépassent vos ventes sur le mois",
    effetTresorerie: "0 FCFA à payer : les impôts gardent l'avance pour le mois suivant",
  },
];

export default function GuideTvaBeninPage() {
  const [formeJuridique, setFormeJuridique] = useState<"ei" | "societe">("ei");
  const [caAnnuelMillions, setCaAnnuelMillions] = useState<number>(42);

  const [ventesHT, setVentesHT] = useState<number>(6000000);
  const [achatsNormalisesHT, setAchatsNormalisesHT] = useState<number>(3500000);
  const [creditAnterieur, setCreditAnterieur] = useState<number>(0);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const estAssujettiTva = formeJuridique === "societe" || caAnnuelMillions > 50;

  const tvaCollectee = Math.round(ventesHT * 0.18);
  const tvaDeductible = Math.round(achatsNormalisesHT * 0.18);
  const soldeTva = tvaCollectee - tvaDeductible - creditAnterieur;
  const tvaNetteAPayer = Math.max(0, soldeTva);
  const nouveauCreditTva = Math.max(0, -soldeTva);

  const formatFcfa = (val: number) =>
    new Intl.NumberFormat("fr-FR").format(val) + " FCFA";

  const faqs = [
    {
      q: "Quel est le taux de TVA en vigueur au Bénin en 2026 ?",
      a: "Le taux normal de la TVA au Bénin est de 18 % sur la majorité des ventes et prestations de services. Les exportations et certains produits essentiels listés par la loi restent à 0 %.",
    },
    {
      q: "À partir de quel chiffre d'affaires doit-on facturer la TVA ?",
      a: "Une entreprise individuelle doit facturer la TVA dès que ses ventes annuelles dépassent 50 millions de FCFA. En dessous, elle reste au forfait TPS sans facturer la TVA (sauf choix volontaire). Les sociétés (SARL, SAS) relèvent directement du régime réel.",
    },
    {
      q: "Que se passe-t-il si mes ventes redescendent sous les 50 millions FCFA ?",
      a: "Selon la règle appliquée par la DGI au Bénin, si votre entreprise était déjà au régime réel TVA et que vos ventes passent sous 50 millions FCFA, vous restez tenu de déclarer la TVA pendant 3 années d'affilée avant de pouvoir changer de régime.",
    },
    {
      q: "Quand faut-il déclarer et payer la TVA chaque mois ?",
      a: "La déclaration et le règlement ont lieu au plus tard le 10 de chaque mois sur le portail e-Services de la DGI pour les opérations du mois d'avant. Si le 10 tombe un week-end ou un jour férié, la date limite passe au premier jour ouvrable suivant.",
    },
    {
      q: "Puis-je récupérer la TVA sur une facture fournisseur sans QR code DGI ?",
      a: "Non. Sans facture normalisée portant le numéro IFU et le QR code officiel e-MECeF de votre fournisseur, les impôts refusent de déduire la TVA payée sur cet achat.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans antialiased selection:bg-primary selection:text-ink">
      <style jsx global>{`
        @keyframes scaleBalance {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes coinRise {
          0% { transform: translateY(10px); opacity: 0; }
          30%, 75% { transform: translateY(0px); opacity: 1; }
          100% { transform: translateY(-6px); opacity: 0; }
        }
        .tva-balance-beam {
          animation: scaleBalance 4s ease-in-out infinite;
          transform-origin: 130px 62px;
        }
        .tva-coin-flow {
          animation: coinRise 3.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .tva-balance-beam,
          .tva-coin-flow {
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
                  <BreadcrumbPage>Guide Déclaration TVA Bénin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3">
                  Guide Fiscal DGI Bénin 2026
                </span>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight mb-4">
                  Déclaration de la TVA au Bénin : seuil, calcul à 18 % et date limite du 10
                </h1>

                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Ne perdez plus la TVA payée sur vos achats et évitez les pénalités de retard)
                </p>

                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Comprendre la <strong className="text-ink font-semibold">déclaration de TVA au Bénin</strong> vous protège de deux erreurs fréquentes : facturer 18 % alors que vous êtes au forfait TPS, ou oublier de déduire la TVA payée à vos fournisseurs. Découvrez simplement le seuil des 50 millions FCFA, le calcul mois par mois et les 4 étapes pour déposer à temps avant le 10.
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
                    <span>Lecture : 8 minutes</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <a
                    href="#simulateur-tva"
                    className="bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Calculer ma TVA</span>
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
                      src="/images/finance-manager.jpg"
                      alt="Responsable financier au Bénin préparant la déclaration mensuelle de TVA sur ordinateur"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Date limite mensuelle DGI</span>
                      <span className="text-success-deep">10 de chaque mois</span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Vos factures normalisées de ventes et d&apos;achats préparent vos montants de TVA au fil de l&apos;eau.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. SOMMAIRE SCANNABLE ── */}
        <nav aria-label="Sommaire du guide TVA Bénin" className="w-full py-6 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted shrink-0">
                Navigation du guide :
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="#seuil-50m"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  1. Seuil 50 M FCFA et TPS
                </a>
                <a
                  href="#calcul-mecanisme"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  2. Formule à 18 %
                </a>
                <a
                  href="#simulateur-tva"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  3. Calculateur en direct
                </a>
                <a
                  href="#deductibilite"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  4. Récupérer sa TVA
                </a>
                <a
                  href="#procedure-dgi"
                  className="px-3.5 py-2 rounded-lg bg-background border border-border hover:border-ink text-xs font-semibold text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  5. Dépôt avant le 10
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

        {/* ── 3. SEUIL DES 50 MILLIONS & TESTEUR DE RÉGIME ── */}
        <section id="seuil-50m" className="w-full py-16 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted block">
                  Qui doit facturer la TVA ?
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Comment savoir si votre activité est soumise à la TVA au Bénin ?
                </h2>

                <div className="p-6 rounded-2xl bg-background-secondary border border-border">
                  <p className="text-sm sm:text-base text-ink leading-relaxed font-medium">
                    Au Bénin, toutes les sociétés commerciales (SARL, SAS, SA) ainsi que les entreprises individuelles dont les ventes annuelles dépassent 50 millions de FCFA doivent facturer et déclarer la TVA à 18 %. Sous ce seuil, l&apos;entreprise individuelle relève du forfait TPS sans facturation de TVA, sauf demande volontaire.
                  </p>
                </div>

                <div className="space-y-3 text-sm text-text-muted leading-relaxed">
                  <p>
                    <strong className="text-ink">Bon à savoir si vos ventes baissent :</strong> dès qu&apos;une entreprise passe au régime réel avec TVA, elle continue à la déclarer pendant 3 années d&apos;affilée même si son chiffre d&apos;affaires repasse ensuite sous 50 millions FCFA.
                  </p>
                  <p>
                    <strong className="text-ink">Choix volontaire possible :</strong> une petite structure sous les 50 millions FCFA peut demander aux impôts à passer volontairement à la TVA si ses principaux clients sont de grandes sociétés ou si elle achète du matériel important avec 18 % de TVA à récupérer.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 bg-background-secondary p-6 sm:p-8 rounded-2xl border border-border space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-text-muted block">
                    Vérification Rapide
                  </span>
                  <h3 className="text-lg font-bold text-ink mt-1">
                    Êtes-vous en TVA (18 %) ou au forfait TPS ?
                  </h3>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                    1. Quel est votre statut ?
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormeJuridique("ei")}
                      className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer min-h-[48px] ${
                        formeJuridique === "ei"
                          ? "bg-background border-primary ring-2 ring-primary/40 text-ink"
                          : "bg-background border-border text-text-muted hover:text-ink"
                      }`}
                    >
                      Entreprise individuelle / Établissement
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormeJuridique("societe")}
                      className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer min-h-[48px] ${
                        formeJuridique === "societe"
                          ? "bg-background border-primary ring-2 ring-primary/40 text-ink"
                          : "bg-background border-border text-text-muted hover:text-ink"
                      }`}
                    >
                      Société (SARL, SAS, SA)
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="ca-annuel-slider"
                      className="text-xs font-bold uppercase tracking-wider text-text-muted"
                    >
                      2. Vos ventes annuelles estimées
                    </label>
                    <span className="text-lg font-bold font-mono text-ink tabular-nums">
                      {caAnnuelMillions} M FCFA
                    </span>
                  </div>
                  <input
                    id="ca-annuel-slider"
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={caAnnuelMillions}
                    onChange={(e) => setCaAnnuelMillions(Number(e.target.value))}
                    className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                  />
                  <div className="flex justify-between text-[11px] text-text-muted font-mono mt-1.5">
                    <span>5 M FCFA</span>
                    <span>Seuil : 50 M FCFA</span>
                    <span>150 M+ FCFA</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-background border border-border space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Votre régime fiscal habituel
                    </span>
                    <span className="text-xs font-bold text-ink">
                      {estAssujettiTva ? "Régime Réel (TVA 18 %)" : "Régime TPS (0 % TVA)"}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {estAssujettiTva
                      ? "Vous facturez la TVA à 18 % (Groupe B e-MECeF), vous déduisez la TVA de vos factures d'achat normalisées et vous déposez votre déclaration avant le 10 de chaque mois."
                      : "Vous relevez de la Taxe Professionnelle Synthétique : vous émettez vos factures e-MECeF sous le Groupe E (0 % de TVA) et vous ne facturez pas la TVA à vos clients."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. FORMULE DE CALCUL & TABLEAU SYSCOHADA ── */}
        <section id="calcul-mecanisme" className="w-full py-16 lg:py-20 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted block">
                  Mécanisme en 1 Phrase
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Comment calculer ce que vous versez aux impôts le 10 du mois ?
                </h2>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Votre entreprise joue simplement le rôle d&apos;intermédiaire : vous reversez aux impôts la TVA facturée à vos clients, après en avoir retiré toute la TVA que vous avez payée sur vos propres factures d&apos;achat normalisées.
                </p>
                <div className="p-5 rounded-xl bg-background border border-border font-mono text-xs sm:text-sm text-ink font-bold">
                  TVA à payer = TVA sur ventes (4431) - TVA sur achats (4452) - Crédit du mois précédent
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border">
                <div className="w-64 h-40 flex items-center justify-center mb-2">
                  <svg viewBox="0 0 260 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="105" y="135" width="50" height="10" rx="4" fill="#332E29" />
                    <line x1="130" y1="62" x2="130" y2="135" stroke="#332E29" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="130" cy="62" r="6" fill="#FFD946" stroke="#332E29" strokeWidth="2" />

                    <g className="tva-balance-beam">
                      <line x1="55" y1="62" x2="205" y2="62" stroke="#332E29" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="65" y1="62" x2="50" y2="100" stroke="#8A857D" strokeWidth="1.5" />
                      <line x1="65" y1="62" x2="80" y2="100" stroke="#8A857D" strokeWidth="1.5" />
                      <rect x="35" y="100" width="60" height="18" rx="5" fill="#FFD946" stroke="#332E29" strokeWidth="2" />
                      <text x="65" y="112" textAnchor="middle" fill="#332E29" fontSize="8" fontWeight="bold" fontFamily="'Inter', sans-serif">
                        4431 VENTES
                      </text>

                      <line x1="195" y1="62" x2="180" y2="100" stroke="#8A857D" strokeWidth="1.5" />
                      <line x1="195" y1="62" x2="210" y2="100" stroke="#8A857D" strokeWidth="1.5" />
                      <rect x="165" y="100" width="60" height="18" rx="5" fill="#5FFFC2" stroke="#332E29" strokeWidth="2" />
                      <text x="195" y="112" textAnchor="middle" fill="#332E29" fontSize="8" fontWeight="bold" fontFamily="'Inter', sans-serif">
                        4452 ACHATS
                      </text>
                    </g>

                    <g className="tva-coin-flow" transform="translate(130, 32)">
                      <circle cx="0" cy="0" r="13" fill="#FFD946" stroke="#332E29" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fill="#332E29" fontSize="9" fontWeight="900" fontFamily="'Inter', sans-serif">
                        18%
                      </text>
                    </g>
                  </svg>
                </div>
                <span className="text-xs font-bold text-ink">
                  L&apos;écart entre ventes taxées et achats justifiés
                </span>
              </div>
            </div>

            <div className="hidden lg:block bg-background rounded-2xl border border-border overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background-secondary text-xs uppercase tracking-wider text-text-muted font-bold">
                    <th className="py-4 px-5">Ce que vous manipulez</th>
                    <th className="py-4 px-5">Compte SYSCOHADA</th>
                    <th className="py-4 px-5">Calcul concret</th>
                    <th className="py-4 px-5">Conséquence sur votre caisse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {TVA_MECHANISMS.map((row) => (
                    <tr key={row.compteSyscohada} className="hover:bg-background-secondary/40 transition-colors">
                      <td className="py-4 px-5 font-bold text-ink">{row.notion}</td>
                      <td className="py-4 px-5 font-mono font-bold text-ink whitespace-nowrap">
                        {row.compteSyscohada}
                      </td>
                      <td className="py-4 px-5 text-text-muted">{row.calcul}</td>
                      <td className="py-4 px-5 text-text-muted">{row.effetTresorerie}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {TVA_MECHANISMS.map((row) => (
                <div key={row.compteSyscohada} className="bg-background p-5 rounded-xl border border-border space-y-2.5">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <span className="font-bold text-sm text-ink">{row.notion}</span>
                    <span className="font-mono font-bold text-xs text-ink">
                      {row.compteSyscohada}
                    </span>
                  </div>
                  <p className="text-xs text-ink font-medium">{row.calcul}</p>
                  <p className="text-xs text-text-muted">{row.effetTresorerie}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. SIMULATEUR PÉDAGOGIQUE EN DIRECT ── */}
        <section id="simulateur-tva" className="w-full py-16 lg:py-20 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Simulateur Pédagogique
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Estimez votre TVA du mois en Francs CFA
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Déplacez les curseurs ci-dessous pour voir instantanément si vous devez verser de la TVA aux impôts le 10 ou si vous bénéficiez d&apos;un crédit reporté sur le mois d&apos;après.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 bg-background-secondary p-6 sm:p-8 rounded-2xl border border-border space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="slider-ventes-ht" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Ventes du mois (Hors Taxes)
                    </label>
                    <span className="text-lg font-bold font-mono text-ink tabular-nums">
                      {formatFcfa(ventesHT)}
                    </span>
                  </div>
                  <input
                    id="slider-ventes-ht"
                    type="range"
                    min="500000"
                    max="30000000"
                    step="500000"
                    value={ventesHT}
                    onChange={(e) => setVentesHT(Number(e.target.value))}
                    className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="slider-achats-ht" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Achats avec facture normalisée DGI (HT)
                    </label>
                    <span className="text-lg font-bold font-mono text-ink tabular-nums">
                      {formatFcfa(achatsNormalisesHT)}
                    </span>
                  </div>
                  <input
                    id="slider-achats-ht"
                    type="range"
                    min="0"
                    max="25000000"
                    step="500000"
                    value={achatsNormalisesHT}
                    onChange={(e) => setAchatsNormalisesHT(Number(e.target.value))}
                    className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="slider-credit-prev" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Avance de TVA restante du mois d&apos;avant
                    </label>
                    <span className="text-lg font-bold font-mono text-ink tabular-nums">
                      {formatFcfa(creditAnterieur)}
                    </span>
                  </div>
                  <input
                    id="slider-credit-prev"
                    type="range"
                    min="0"
                    max="2000000"
                    step="50000"
                    value={creditAnterieur}
                    onChange={(e) => setCreditAnterieur(Number(e.target.value))}
                    className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 bg-background-secondary p-6 sm:p-8 rounded-2xl border border-border space-y-5">
                <div className="border-b border-border pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                    Résultat Estimé
                  </span>
                  <h3 className="text-xl font-bold text-ink mt-1">
                    Votre bilan TVA du mois
                  </h3>
                </div>

                <div className="space-y-3 text-xs sm:text-sm font-mono">
                  <div className="p-4 rounded-xl bg-background border border-border flex justify-between items-center">
                    <span className="font-sans text-text-muted">TVA collectée (18 % des ventes)</span>
                    <span className="font-bold text-ink tabular-nums">+ {formatFcfa(tvaCollectee)}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border flex justify-between items-center">
                    <span className="font-sans text-text-muted">TVA déductible (18 % des achats normalisés)</span>
                    <span className="font-bold text-ink tabular-nums">- {formatFcfa(tvaDeductible)}</span>
                  </div>
                  {creditAnterieur > 0 && (
                    <div className="p-4 rounded-xl bg-background border border-border flex justify-between items-center">
                      <span className="font-sans text-text-muted">Avance du mois précédent déduite</span>
                      <span className="font-bold text-ink tabular-nums">- {formatFcfa(creditAnterieur)}</span>
                    </div>
                  )}
                </div>

                {tvaNetteAPayer > 0 ? (
                  <div className="p-5 rounded-xl bg-primary/25 border border-primary flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs uppercase font-bold text-ink block">
                        TVA à payer aux impôts
                      </span>
                      <span className="text-xs text-text-muted">
                        À régler au plus tard le 10 du mois suivant
                      </span>
                    </div>
                    <span className="text-2xl font-bold font-mono text-ink tabular-nums">
                      {formatFcfa(tvaNetteAPayer)}
                    </span>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-success/30 border border-success flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs uppercase font-bold text-ink block">
                        Crédit de TVA reporté
                      </span>
                      <span className="text-xs text-ink">
                        0 FCFA à verser : cette avance réduira votre TVA du mois suivant
                      </span>
                    </div>
                    <span className="text-2xl font-bold font-mono text-ink tabular-nums">
                      {formatFcfa(nouveauCreditTva)}
                    </span>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href="/register"
                    className="bg-primary hover:bg-primary-hover text-ink font-bold text-sm px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2 min-h-[44px]"
                  >
                    <span>Automatiser ce calcul</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs text-text-muted">
                    Calcul généré en direct dans votre espace Ceilow
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. LES 4 CONDITIONS POUR RÉCUPÉRER VOTRE TVA ── */}
        <section id="deductibilite" className="w-full py-16 lg:py-20 bg-background-secondary border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Zéro Mauvaise Surprise
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                4 conditions obligatoires pour récupérer la TVA sur vos achats
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Un simple reçu papier sans QR code ou une dépense personnelle peut entraîner un refus de déduction par la DGI. Vérifiez ces quatre points avant d&apos;enregistrer un achat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-background p-6 rounded-2xl border border-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center font-mono font-bold text-sm text-ink">
                  01
                </div>
                <h3 className="text-base font-bold text-ink">
                  Facture normalisée avec QR code
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Votre fournisseur doit vous remettre une vraie facture e-MECeF portant son numéro IFU et votre nom d&apos;entreprise. Un simple ticket manuscrit ou fichier Word ne permet pas de déduire la TVA.
                </p>
              </div>

              <div className="bg-background p-6 rounded-2xl border border-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center font-mono font-bold text-sm text-ink">
                  02
                </div>
                <h3 className="text-base font-bold text-ink">
                  Achat utile pour l&apos;entreprise
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  La dépense doit servir directement votre activité professionnelle (stock à revendre, fournitures de bureau, matériel informatique, loyer commercial avec TVA), jamais vos besoins personnels.
                </p>
              </div>

              <div className="bg-background p-6 rounded-2xl border border-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center font-mono font-bold text-sm text-ink">
                  03
                </div>
                <h3 className="text-base font-bold text-ink">
                  Achat autorisé par la loi fiscale
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Certaines dépenses restent exclues par la loi béninoise : par exemple, l&apos;achat d&apos;une voiture de tourisme ou certains frais de réception ne donnent pas droit au remboursement de TVA.
                </p>
              </div>

              <div className="bg-background p-6 rounded-2xl border border-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center font-mono font-bold text-sm text-ink">
                  04
                </div>
                <h3 className="text-base font-bold text-ink">
                  Votre entreprise est au régime réel
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Seules les entreprises qui facturent elles-mêmes la TVA à 18 % peuvent récupérer celle payée à leurs fournisseurs. Une petite entreprise en TPS ne peut pas déduire la TVA.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. ÉCHÉANCE DU 10 EN 4 ÉTAPES ── */}
        <section id="procedure-dgi" className="w-full py-16 lg:py-20 bg-background border-b border-border scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Dépôt Mensuel sur e-Services
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Les 4 étapes pour déclarer votre TVA avant le 10 du mois
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                La déclaration couvre toutes vos factures du mois précédent. Même si vous n&apos;avez réalisé aucune vente sur le mois, vous devez déposer une déclaration « Néant » pour éviter une pénalité.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-background-secondary border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-ink">Étape 1 : Du 1er au 3 du mois</span>
                <h3 className="text-base font-bold text-ink">Prendre vos factures d&apos;achat en photo</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Rassemblez vos reçus et factures fournisseurs normalisées du mois passé. En les prenant simplement en photo sur Ceilow, les montants de TVA déductible sont ajoutés sans recopier à la main.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-background-secondary border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-ink">Étape 2 : Avant le 6 du mois</span>
                <h3 className="text-base font-bold text-ink">Vérifier le total ventes et achats</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Contrôlez que toutes vos ventes e-MECeF et vos avoirs du mois correspondent aux chiffres de votre dossier, puis retirez votre éventuel crédit de TVA du mois précédent.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-background-secondary border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-ink">Étape 3 : Entre le 7 et le 9 du mois</span>
                <h3 className="text-base font-bold text-ink">Saisir sur le site e-Services DGI</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Connectez-vous à votre espace sur eservices.impots.bj avec votre numéro IFU, reportez les montants préparés et validez la déclaration mensuelle en ligne.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-background-secondary border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-ink">Étape 4 : Au plus tard le 10 du mois</span>
                <h3 className="text-base font-bold text-ink">Régler le montant dû et garder le reçu</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Effectuez votre paiement avant le 10 (si le 10 tombe un week-end ou un jour férié, la limite est reportée au premier jour travaillé suivant) et archivez la quittance.
                </p>
              </div>
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
                Vos questions fréquentes sur la TVA au Bénin
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
                Ressources et Outils Associés
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                Continuez avec les modules complémentaires Ceilow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/solutions/declarations-fiscales"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <FileCheck className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Automatiser vos Déclarations DGI
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Retrouvez votre TVA à payer et vos justificatifs prêts plusieurs jours avant le 10 de chaque mois.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Découvrir le module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/solutions/gestion-depenses"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <Receipt className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Reçus d&apos;Achat en Photo
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Photographiez vos factures fournisseurs normalisées pour ne laisser aucun franc de TVA déductible de côté.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Découvrir l&apos;outil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/ressources/guide-facturation-emecef-benin"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
                    <Scale className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:underline">
                    Guide Facture Normalisée e-MECeF
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Apprenez à choisir les groupes fiscaux A à F et vérifier le QR code des factures de vos fournisseurs.
                  </p>
                </div>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Lire le guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-background-secondary border border-border text-xs text-text-muted leading-relaxed flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-ink shrink-0 mt-0.5" />
              <p>
                <strong className="text-ink">Note d&apos;information :</strong> Ce guide explique les règles générales de la TVA applicables en République du Bénin (Code Général des Impôts et plan SYSCOHADA révisé, mis à jour le 10 novembre 2026). Pour les cas particuliers (chantiers exonérés, activités mixtes), demandez confirmation à votre expert-comptable.
              </p>
            </div>
          </div>
        </section>

        {/* ── 10. BANNIÈRE DE CONVERSION ── */}
        <section className="w-full py-16 bg-ink text-background">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mb-4">
              <Percent className="w-6 h-6" />
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-background">
              Préparez votre prochain 10 du mois en 5 minutes
            </h2>

            <p className="text-sm sm:text-base text-background/80 max-w-xl mb-8 leading-relaxed">
              Ceilow réunit vos ventes e-MECeF et vos achats scannés pour calculer automatiquement votre TVA nette avant chaque échéance.
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
