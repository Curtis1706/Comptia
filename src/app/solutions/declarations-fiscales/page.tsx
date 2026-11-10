"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  ArrowRight,
  Check,
  Clock,
  FileCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Percent,
  Bell,
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

export default function DeclarationsFiscalesPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [ventesTTC, setVentesTTC] = useState<number>(8500000);
  const [achatsTTC, setAchatsTTC] = useState<number>(4720000);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  // Calcul TVA
  const tvaCollectee = Math.round((ventesTTC / 1.18) * 0.18);
  const tvaDeductible = Math.round((achatsTTC / 1.18) * 0.18);
  const tvaNetteDue = Math.max(0, tvaCollectee - tvaDeductible);
  const creditTva = Math.max(0, tvaDeductible - tvaCollectee);

  const formatFcfa = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " FCFA";
  };

  const handleSimulateDeclaration = () => {
    setIsGenerated(true);
    setTimeout(() => setIsGenerated(false), 3500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "À quelle date doit-on déclarer et payer la TVA au Bénin ?",
      a: "La déclaration et le paiement de la TVA se font au plus tard le 10 de chaque mois pour toutes les opérations du mois précédent sur le portail de la DGI.",
    },
    {
      q: "Comment Ceilow gère-t-il l'AIB (retenue à la source) ?",
      a: "Ceilow sépare automatiquement les montants d'AIB retenus par vos clients (que vous déduirez de votre impôt sur les bénéfices) et les retenues AIB prélevées sur vos prestataires (à reverser à la DGI le 10 du mois).",
    },
    {
      q: "Que se passe-t-il si ma TVA sur achats dépasse ma TVA sur ventes ?",
      a: "Ce surplus forme un crédit de TVA. Ceilow le reporte automatiquement sur le mois suivant pour réduire votre prochain paiement sans calcul manuel.",
    },
    {
      q: "Mon comptable peut-il vérifier les montants avant que je paie ?",
      a: "Oui. Donnez-lui accès à votre dossier ou envoyez-lui le tableau récapitulatif en un clic pour qu'il valide vos chiffres avant votre dépôt sur le portail de la DGI.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      {/* STYLE DÉDIÉ ANIMATION CALENDRIER DGI */}
      <style jsx global>{`
        @keyframes bellTinkle {
          0%, 75%, 100% { transform: rotate(0); }
          80% { transform: rotate(14deg); }
          85% { transform: rotate(-14deg); }
          90% { transform: rotate(8deg); }
          95% { transform: rotate(-4deg); }
        }
        @keyframes calPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes envelopeFly {
          0%, 20% { transform: translate(0, 0) scale(1); opacity: 1; }
          60% { transform: translate(35px, -22px) scale(0.9); opacity: 1; }
          75%, 100% { transform: translate(50px, -35px) scale(0.4); opacity: 0; }
        }
        @keyframes sparkleFiscPop {
          0%, 45% { transform: scale(0) rotate(0deg); opacity: 0; }
          55% { transform: scale(1.3) rotate(45deg); opacity: 1; }
          70% { transform: scale(1) rotate(90deg); opacity: 1; }
          85%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        .bell-anim {
          animation: bellTinkle 3.2s ease-in-out infinite;
          transform-origin: top center;
        }
        .cal-date-anim {
          animation: calPulse 3.2s ease-in-out infinite;
          transform-origin: center;
        }
        .envelope-anim {
          animation: envelopeFly 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .sparkle-fisc {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: sparkleFiscPop 3.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bell-anim,
          .cal-date-anim,
          .envelope-anim,
          .sparkle-fisc {
            animation: none;
          }
        }
      `}</style>

      <PublicHeader />

      <main className="flex-1 w-full">
        {/* HERO SECTION SPLIT SCREEN */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 border-b border-border bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/fonctionnalites">Fonctionnalités</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Déclarations fiscales DGI</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Colonne gauche : Copywriting clair et convertisseur */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                  Fiscalité d&apos;entreprise &amp; conformité DGI Bénin
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4 font-display">
                  Télédéclaration fiscale DGI au Bénin : TVA, TPS, AIB et DSF sans stress
                </h1>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Préparez facilement vos déclarations sur le portail e-Services de la DGI au Bénin. Ceilow calcule au fil du mois votre TVA facturée, votre TVA sur achats, vos retenues AIB et votre TPS pour déclarer à temps sans pénalité.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/register"
                    className="bg-primary text-ink font-bold px-7 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Tester gratuitement</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="bg-background-secondary text-ink font-bold px-7 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Voir la démo
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Échéance DGI le 10 du mois</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Suivi des retenues AIB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Rappels avant chaque échéance</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Photo réelle Fiscaliste à Cotonou */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-xs">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/expert-comptable-benin.jpg"
                      alt="Spécialiste fiscal et expert-comptable vérifiant une déclaration fiscale à Cotonou"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Déclaration TVA du mois prête</span>
                      <span className="text-success-deep font-semibold">À jour DGI</span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Récapitulatif prêt à reporter sur le portail officiel de la DGI.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION ANIMATION SVG LOTTIE-LIKE : CALENDRIER FISCAL DU 10 & ENVELOPPE DGI ── */}
        <section className="py-14 bg-background border-b border-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-60 h-44 mx-auto mb-3 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 260 170" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Calendrier fiscal */}
                <g transform="translate(35, 25)">
                  <rect x="0" y="0" width="95" height="110" rx="8" fill="#332E29" stroke="#332E29" strokeWidth="2" />
                  <rect x="0" y="0" width="95" height="26" rx="8" fill="#FFD946" />
                  <text x="47" y="18" textAnchor="middle" fill="#332E29" fontSize="9" fontWeight="900" fontFamily="'Inter', sans-serif">
                    MARS 2026
                  </text>
                  <rect x="5" y="32" width="85" height="72" rx="4" fill="#FDFBF7" />
                  
                  {/* Case du 10 mise en valeur */}
                  <g className="cal-date-anim" transform="translate(47, 68)">
                    <rect x="-18" y="-18" width="36" height="36" rx="6" fill="#5FFFC2" stroke="#332E29" strokeWidth="1.5" />
                    <text x="0" y="6" textAnchor="middle" fill="#332E29" fontSize="14" fontWeight="900" fontFamily="'Inter', sans-serif">
                      10
                    </text>
                  </g>
                  <text x="47" y="98" textAnchor="middle" fill="#332E29" fontSize="6" fontWeight="bold" fontFamily="'Inter', sans-serif">
                    ÉCHÉANCE DGI
                  </text>
                </g>

                {/* Cloche d'alerte qui tinte */}
                <g className="bell-anim" transform="translate(145, 30)">
                  <path d="M 0 10 C 0 4, 16 4, 16 10 L 18 20 L -2 20 Z" fill="#FFD946" stroke="#332E29" strokeWidth="1.5" />
                  <circle cx="8" cy="22" r="3" fill="#332E29" />
                  <circle cx="8" cy="3" r="2" fill="#332E29" />
                </g>

                {/* Enveloppe DGI qui s'envole */}
                <g className="envelope-anim" transform="translate(145, 65)">
                  <rect x="0" y="0" width="70" height="46" rx="4" fill="#FFFFFF" stroke="#332E29" strokeWidth="2" />
                  <polygon points="0,0 35,26 70,0" fill="#F5F4F2" stroke="#332E29" strokeWidth="1.5" />
                  <rect x="22" y="16" width="26" height="14" rx="2" fill="#FFD946" stroke="#332E29" strokeWidth="1" />
                  <text x="35" y="26" textAnchor="middle" fill="#332E29" fontSize="6" fontWeight="bold" fontFamily="'Inter', sans-serif">
                    TVA DGI
                  </text>
                </g>

                {/* Étoiles scintillantes */}
                <g className="sparkle-fisc" transform="translate(25, 20)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-fisc" style={{ animationDelay: "1s" }} transform="translate(235, 50)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight">
              Vos chiffres prêts avant le 10 du mois
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto mt-1">
              Ceilow prépare votre calcul de TVA dès la fin du mois et vous prévient à l&apos;avance pour éviter toute pénalité de retard.
            </p>
          </div>
        </section>

        {/* SECTION INTERACTIVE : SIMULATEUR DE TVA DGI DU 10 DU MOIS */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Simulateur en direct
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight mb-3">
                Calculez votre TVA nette pour l&apos;échéance du 10
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-2xl">
                Faites varier vos ventes et achats du mois pour voir le montant à reverser à la DGI ou votre crédit de TVA à reporter.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ENTRÉES DU SIMULATEUR (GAUCHE) */}
              <div className="lg:col-span-5 bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-border gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Période : Mars 2026
                  </span>
                  <span className="text-xs font-mono font-bold text-ink flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-ink" />
                    <span>Échéance : 10 avril 2026</span>
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="ventes-ttc-range" className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                      Ventes TTC facturées dans le mois
                    </label>
                    <div className="text-xl font-bold font-mono tabular-nums text-ink mb-2">
                      {formatFcfa(ventesTTC)}
                    </div>
                    <input
                      id="ventes-ttc-range"
                      type="range"
                      min="1000000"
                      max="30000000"
                      step="500000"
                      value={ventesTTC}
                      onChange={(e) => setVentesTTC(Number(e.target.value))}
                      className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                    />
                  </div>

                  <div>
                    <label htmlFor="achats-ttc-range" className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                      Achats &amp; dépenses TTC avec facture e-MECeF
                    </label>
                    <div className="text-xl font-bold font-mono tabular-nums text-ink mb-2">
                      {formatFcfa(achatsTTC)}
                    </div>
                    <input
                      id="achats-ttc-range"
                      type="range"
                      min="500000"
                      max="20000000"
                      step="500000"
                      value={achatsTTC}
                      onChange={(e) => setAchatsTTC(Number(e.target.value))}
                      className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Bell className="w-4 h-4 text-ink shrink-0" />
                    <span>Rappel automatique envoyé avant l&apos;échéance du 10 du mois.</span>
                  </div>
                </div>
              </div>

              {/* DÉCOMPTE FISCAL AUTOMATIQUE (DROITE) */}
              <div className="lg:col-span-7 bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-border gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                      Synthèse TVA DGI
                    </span>
                    <h3 className="text-base font-bold text-ink">
                      Déclaration mensuelle de TVA
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateDeclaration}
                    className="bg-background-secondary text-ink font-bold text-xs px-4 py-2 rounded-xl border border-border hover:border-ink transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-ink" />
                    <span>Voir le bordereau</span>
                  </button>
                </div>

                {isGenerated && (
                  <div className="mb-4 p-3 rounded-xl bg-background-secondary border border-border text-xs text-ink flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink shrink-0" />
                    <span>Récapitulatif prêt à reporter sur le portail de la DGI Bénin.</span>
                  </div>
                )}

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-background-secondary border border-border space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-text-muted">TVA facturée sur vos ventes (18 %)</span>
                      <span className="text-ink font-bold tabular-nums">{formatFcfa(tvaCollectee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-text-muted">TVA récupérable sur vos achats (18 %)</span>
                      <span className="text-ink font-bold tabular-nums">- {formatFcfa(tvaDeductible)}</span>
                    </div>
                  </div>

                  {tvaNetteDue > 0 ? (
                    <div className="p-5 rounded-xl bg-primary/20 border border-primary flex justify-between items-center">
                      <div>
                        <span className="font-sans text-xs uppercase font-bold text-ink block">
                          TVA nette à payer le 10
                        </span>
                        <span className="font-sans text-[11px] text-text-muted">
                          Paiement sur e-Services DGI (virement ou Mobile Money)
                        </span>
                      </div>
                      <span className="text-lg font-bold text-ink tabular-nums">
                        {formatFcfa(tvaNetteDue)}
                      </span>
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl bg-background-secondary border border-border flex justify-between items-center">
                      <div>
                        <span className="font-sans text-xs uppercase font-bold text-ink block">
                          Crédit de TVA reporté
                        </span>
                        <span className="font-sans text-[11px] text-text-muted">
                          Rien à payer ce mois-ci, crédit déduit du mois suivant
                        </span>
                      </div>
                      <span className="text-lg font-bold text-ink tabular-nums">
                        {formatFcfa(creditTva)}
                      </span>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-background-secondary border border-border space-y-2">
                    <div className="font-sans text-[11px] uppercase font-bold text-text-muted pb-1 border-b border-border">
                      Rappels DGI Bénin
                    </div>
                    <div className="flex justify-between items-center text-text-muted">
                      <span className="font-sans">Déclaration sur e-Services DGI</span>
                      <span className="font-bold text-ink">Obligatoire</span>
                    </div>
                    <div className="flex justify-between items-center text-text-muted">
                      <span className="font-sans">Déclaration en retard</span>
                      <span className="font-bold text-ink">Majorations et intérêts légaux</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-muted">
                  <span>Conforme au Code Général des Impôts du Bénin</span>
                  <span className="font-bold text-ink">SYSCOHADA Compte 4441</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 PILIERS DE BÉNÉFICES */}
        <section className="py-16 md:py-24 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Tranquillité d&apos;esprit
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
                Trois garanties pour déclarer sans stress
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Zéro pénalité pour dépôt tardif
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Ceilow prépare votre synthèse dès les premiers jours du mois et vous avertit avant la date limite du 10.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Percent className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Récupération complète de la TVA sur achats
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Chaque facture fournisseur normalisée enregistrée est déduite automatiquement de votre TVA à payer. Vous ne perdez plus d&apos;argent par oubli.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Vérification rapide avec votre comptable
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Votre comptable accède à tous vos justificatifs et vérifie chaque total avec vous avant la validation sur le portail DGI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAILLAGE INTERNE CONTEXTUEL */}
        <section className="py-12 bg-background border-t border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-wider text-text-muted font-bold">
                Suite complète
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-ink mt-1">
                Toutes les pièces de vos déclarations réunies automatiquement
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/solutions/facturation-dgi"
                className="p-5 rounded-xl bg-background-secondary border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Facturation normalisée DGI</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Chaque facture e-MECeF créée met immédiatement à jour votre montant de TVA facturée pour le mois.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir la facturation
                </span>
              </Link>

              <Link
                href="/solutions/gestion-depenses"
                className="p-5 rounded-xl bg-background-secondary border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Gestion des dépenses</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Photographiez vos factures fournisseurs pour isoler et récupérer 100 % de votre TVA déductible sans oubli.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir les dépenses
                </span>
              </Link>

              <Link
                href="/ressources/calendrier-fiscal-benin"
                className="p-5 rounded-xl bg-background-secondary border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Calendrier fiscal Bénin 2026</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Consultez toutes vos dates limites : TVA le 10 du mois, avances IS (juin, sept., déc.) et dépôt du bilan le 30 avril.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir le calendrier
                </span>
              </Link>
            </div>

            <div className="mt-6 p-5 rounded-xl bg-background-secondary border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                  Guide fiscal pas à pas
                </span>
                <p className="text-sm font-semibold text-ink mt-0.5">
                  Vérifier le seuil des 50 millions FCFA, les conditions de TVA déductible et le calcul mensuel
                </p>
              </div>
              <Link
                href="/ressources/guide-tva-benin"
                className="inline-flex items-center gap-2 text-xs font-bold text-ink bg-background border border-border hover:border-ink px-4 py-2.5 rounded-lg transition-colors shrink-0 min-h-[44px]"
              >
                <span>Lire le guide TVA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDÉON */}
        <section className="py-16 md:py-24 bg-background-secondary border-t border-border">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Questions fréquentes
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
                Tout comprendre sur la TVA et la fiscalité DGI
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-2xl bg-background overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-ink text-base hover:bg-background-secondary/50 transition-colors cursor-pointer min-h-[48px]"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-text-muted shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-text-muted leading-relaxed border-t border-border pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BANNIÈRE D'APPEL À L'ACTION */}
        <section className="py-16 bg-ink text-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight mb-4 text-background">
              Préparez votre prochaine déclaration DGI dès aujourd&apos;hui.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Essayez Ceilow gratuitement pendant 14 jours et abordez chaque 10 du mois l&apos;esprit libre.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary text-ink font-bold px-8 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>Créer un compte</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="bg-transparent text-background font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:border-white transition-all text-center min-h-[48px] flex items-center justify-center"
              >
                Voir la démo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
