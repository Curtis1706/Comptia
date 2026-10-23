"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  PlayCircle,
  Lock,
  CheckCircle2,
  Calendar,
  CloudUpload,
  RefreshCw,
  QrCode,
  ArrowUpDown,
  PieChart,
  Check,
  Star,
  ArrowDown,
  Building2,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { CockpitTabletDemo } from "@/components/landing/CockpitTabletDemo";

export default function LandingView() {
  // ── 1. GESTION DU WORKFLOW EN ACTION (3 ÉTAPES AVEC AUTOPLAY & BARRE DE PROGRESSION) ──
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    const STEP_DURATION = 4000; // 4 secondes par étape
    const UPDATE_FREQ = 40; // mise à jour toutes les 40ms

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + (UPDATE_FREQ / STEP_DURATION) * 100;
        if (next >= 100) {
          setCurrentStep((current) => (current === 3 ? 1 : ((current + 1) as 1 | 2 | 3)));
          return 0;
        }
        return next;
      });
    }, UPDATE_FREQ);

    return () => clearInterval(interval);
  }, [currentStep]);

  const selectManualTab = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
    setProgressPercent(0);
  };



  return (
    <div className="min-h-screen flex flex-col bg-background text-ink font-sans selection:bg-primary selection:text-ink">
      {/* ── HEADER PUBLIC UNIFIÉ ACTUEL (bg-ink text-white) ────────────────────── */}
      <PublicHeader className="sticky top-0 z-50" />

      <main className="flex-grow">
        <div className="flex flex-col w-full">
          {/* ── SECTION 1 : HERO SOMBRE PLEINE PAGE (min-h-[calc(100vh-5rem)]) ── */}
          <section className="relative w-full bg-ink text-white min-h-[calc(100vh-5rem)] flex flex-col justify-between pt-12 sm:pt-16 pb-6 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center my-auto">

              {/* H1 Mot pour Mot : Strictement 2 lignes sur tablette et desktop, agrandi et aéré */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[60px] font-bold tracking-tight text-white max-w-7xl mx-auto leading-[1.2] text-center">
                <span className="block md:whitespace-nowrap">
                  Votre comptabilité, vos factures et votre TVA,
                </span>
                <span className="block mt-2.5 sm:mt-3.5 md:whitespace-nowrap">
                  <span className="bg-primary text-ink px-4 sm:px-6 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl inline-block shadow-sm">
                    gérées automatiquement au Bénin.
                  </span>
                </span>
              </h1>

              {/* Paragraphe Sous-titre Mot pour Mot */}
              <p className="text-base sm:text-lg text-border max-w-2xl mt-6 sm:mt-8 leading-relaxed">
                Ceilow s&apos;occupe de vos factures, de votre comptabilité et de vos déclarations fiscales et sociales, pour que vous puissiez vous concentrer sur votre entreprise.
              </p>

              {/* CTAs Centrés : BOUTON PRINCIPAL JAUNE + BOUTON SECONDAIRE BLANC SOLIDE */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-10 w-full max-w-md sm:max-w-none">
                {/* CTA 1 : Primaire Jaune Ceilow */}
                <Link
                  href="/register"
                  className="cta-button w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-ink text-base px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all min-h-[48px]"
                >
                  <span>Souscrire</span>
                  <ArrowRight className="w-5 h-5 icon-arrow" />
                </Link>

                {/* CTA 2 : Secondaire Blanc Pur Opaque Solide */}
                <Link
                  href="/demo"
                  className="cta-button w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-background text-ink text-base px-8 py-3.5 rounded-xl font-bold border border-border shadow-md hover:bg-background-secondary active:scale-[0.99] transition-all min-h-[48px]"
                >
                  <PlayCircle className="w-5 h-5 icon-arrow text-ink" />
                  <span>Demander une démo</span>
                </Link>
              </div>
            </div>

            {/* ── ANIMATION DE SCROLL (INDICATEUR ÉLÉGANT BAS DE HERO) ── */}
            <div className="relative z-10 flex flex-col items-center pb-2 select-none">
              <button
                type="button"
                onClick={() => {
                  const nextEl = document.getElementById("reassurance");
                  if (nextEl) {
                    nextEl.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group flex flex-col items-center gap-2 text-text-muted hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-2"
                aria-label="Défiler vers le contenu"
              >
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                  Découvrir
                </span>
                <div className="w-5 h-9 rounded-full border-2 border-border/40 group-hover:border-primary transition-colors flex items-start justify-center p-1">
                  <span className="w-1 h-2 rounded-full bg-primary animate-scroll-wheel" />
                </div>
                <ChevronDown className="w-4 h-4 text-border/60 group-hover:text-primary animate-scroll-bounce transition-colors -mt-1" />
              </button>
            </div>
          </section>

          {/* ── SECTION 2 : BANDEAU DE RÉASSURANCE LOCALE (MARQUEE CONTINU) ────────── */}
          <section id="reassurance" className="w-full bg-background-secondary border-y border-border py-6 overflow-hidden select-none">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-4">
              <p className="text-text-muted font-semibold text-xs tracking-widest uppercase">
                Des entreprises et cabinets d&apos;expertise comptable béninois pilotent leur gestion avec Ceilow
              </p>
            </div>

            {/* Ticker Marquee Infini Continu */}
            <div className="relative w-full flex overflow-hidden">
              <div className="animate-marquee items-center gap-12 whitespace-nowrap">
                {/* Piste 1 */}
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  BÉNIN LOGISTIQUE <span className="text-text-muted font-normal text-xs">(Transport &amp; Transit Cotonou)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  NOVACONSEIL COTONOU <span className="text-text-muted font-normal text-xs">(Conseil en Gestion)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  FIDUCIAIRE DU LITTORAL <span className="text-text-muted font-normal text-xs">(Expertise Comptable OECCA)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  AGRIBÉNIN <span className="text-text-muted font-normal text-xs">(Agro-alimentaire Bohicon)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  ATLANTIQUE SERVICES <span className="text-text-muted font-normal text-xs">(Prestations B2B Ganhi)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  TRANSIT &amp; COMMERCE BÉNIN <span className="text-text-muted font-normal text-xs">(Port Autonome de Cotonou)</span>
                </div>

                {/* Piste 2 (Duplicata seamless) */}
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  BÉNIN LOGISTIQUE <span className="text-text-muted font-normal text-xs">(Transport &amp; Transit Cotonou)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  NOVACONSEIL COTONOU <span className="text-text-muted font-normal text-xs">(Conseil en Gestion)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  FIDUCIAIRE DU LITTORAL <span className="text-text-muted font-normal text-xs">(Expertise Comptable OECCA)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  AGRIBÉNIN <span className="text-text-muted font-normal text-xs">(Agro-alimentaire Bohicon)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  ATLANTIQUE SERVICES <span className="text-text-muted font-normal text-xs">(Prestations B2B Ganhi)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-ink tracking-wider text-sm">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  TRANSIT &amp; COMMERCE BÉNIN <span className="text-text-muted font-normal text-xs">(Port Autonome de Cotonou)</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 3 : LES 3 GRANDS BÉNÉFICES MÉTIERS ───────────────────────── */}
          <section className="w-full py-20 bg-background">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto text-center mb-16">
                <span className="text-xs font-bold text-ink uppercase tracking-widest bg-primary/20 px-3 py-1 rounded-full">
                  Garantie Zéro Erreur
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mt-3 tracking-tight">
                  Gagnez 10 heures par semaine sur votre gestion au Bénin
                </h2>
                <p className="text-text-muted mt-3 text-base leading-relaxed">
                  Fini la paperasse et la panique des contrôles fiscaux. Chaque vente et chaque dépense sont enregistrées et classées sans effort.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* BÉNÉFICE 1 : FACTURES CERTIFIÉES DGI (Micro-animation Tampon e-MECeF) */}
                <div className="p-6 sm:p-8 rounded-2xl bg-background-secondary border border-border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-ink mb-6 group-hover:bg-primary group-hover:text-ink transition-colors">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink mb-3 leading-snug">
                      Facturez aux normes DGI en 10 secondes chrono
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Émettez vos factures normalisées avec QR code en un clic. Vous êtes 100 % conforme à la loi des finances et à l&apos;abri de toute pénalité.
                    </p>
                  </div>

                  {/* Facture interactive avec tampon animé e-MECeF */}
                  <div className="mt-8 p-4 rounded-xl bg-background border border-border shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-ink">FACTURE NORMALISÉE</span>
                        <span className="text-[10px] text-text-muted font-mono">N° 2026-F-00452</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-ink tabular-nums">750 000 FCFA</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 relative">
                      {/* Tampon officiel vert animé */}
                      <div className="px-2.5 py-1 rounded bg-success/20 border-2 border-success-deep text-success-deep text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-stamp select-none shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success-deep" />
                        <span>CERTIFIÉ e-MECeF</span>
                      </div>

                      {/* QR Code Fiscal Virtuel SVG */}
                      <div
                        className="w-10 h-10 p-1 bg-ink text-primary rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                        title="QR Code DGI"
                      >
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                          <path d="M2 2h8v8H2zm2 2v4h4V4zm10-2h8v8h-8zm2 2v4h4V4zM2 14h8v8H2zm2 2v4h4v-4zm10-2h3v3h-3zm5 0h3v3h-3zm-5 5h3v3h-3zm5 0h3v3h-3zm-2-2h2v2h-2zm-6-6h2v2h-2zm10 0h2v2h-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BÉNÉFICE 2 : BANQUES & MOBILE MONEY (Micro-animation Magnetic Match) */}
                <div className="p-6 sm:p-8 rounded-2xl bg-background-secondary border border-border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-ink mb-6 group-hover:bg-primary group-hover:text-ink transition-colors">
                      <ArrowUpDown className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink mb-3 leading-snug">
                      Vos encaissements bancaires et MoMo réconciliés sans calcul
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Connectez vos comptes MTN MoMo, Moov Money et banques locales (BOA, Ecobank, BIIC...). Ceilow repère automatiquement qui vous a payé et pointe la bonne facture.
                    </p>
                  </div>

                  {/* Animation de Matching Magnétique à 2 Cartes */}
                  <div className="mt-8 p-4 rounded-xl bg-background border border-border space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between text-[11px] p-2.5 rounded-lg bg-background-secondary border border-border magnetic-box-down">
                      <span className="font-medium text-ink flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-success-deep" /> Virement BOA Client A
                      </span>
                      <span className="font-mono font-bold tabular-nums text-ink">2 500 000 FCFA</span>
                    </div>

                    {/* Flèche aimantée centrale */}
                    <div className="flex items-center justify-center -my-1 text-ink relative z-10">
                      <span className="w-6 h-6 rounded-full bg-primary text-ink flex items-center justify-center shadow-xs">
                        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] p-2.5 rounded-lg bg-background-secondary border border-border magnetic-box-up">
                      <span className="font-medium text-ink flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary" /> Facture N° 088 (Client A)
                      </span>
                      <span className="font-mono font-bold tabular-nums text-ink">2 500 000 FCFA</span>
                    </div>

                    <div className="mt-2 text-center pt-1">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 border border-success/40 text-success-deep text-[11px] font-bold">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Payé &amp; Classé Automatiquement
                      </span>
                    </div>
                  </div>
                </div>

                {/* BÉNÉFICE 3 : COMPTABILITÉ & TVA OHADA (Jauge Circulaire Animée) */}
                <div className="p-6 sm:p-8 rounded-2xl bg-background-secondary border border-border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-ink mb-6 group-hover:bg-primary group-hover:text-ink transition-colors">
                      <PieChart className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink mb-3 leading-snug">
                      Votre déclaration de TVA prête avant le 10 du mois
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Plus d&apos;angoisse en fin de mois. Vos chiffres se calculent au fil de vos ventes : votre montant exact de TVA est prêt à être déposé aux impôts, sans calculatrice ni stress.
                    </p>
                  </div>

                  {/* Jauge circulaire / Progression TVA SVG */}
                  <div className="mt-8 p-4 rounded-xl bg-background border border-border flex items-center gap-4">
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-border"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.8"
                        />
                        <path
                          className="text-success-deep gauge-circle"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray="100, 100"
                          strokeLinecap="round"
                          strokeWidth="3.8"
                        />
                      </svg>
                      <span className="absolute font-mono font-bold text-xs text-ink">100%</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-ink">TVA &amp; Impôts Prêts</span>
                      <span className="text-[11px] text-text-muted">Prêt pour dépôt DGI</span>
                      <span className="font-mono text-xs font-bold text-success-deep tabular-nums mt-0.5 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-success-deep" /> Calcul Vérifié
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <Link
                      href="/comptabilite"
                      className="cta-button text-xs font-bold text-ink hover:text-primary transition-colors flex items-center gap-1 min-h-[44px]"
                    >
                      <span>Voir tout ce que Ceilow automatise pour vous</span>
                      <ArrowRight className="w-4 h-4 icon-arrow" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 4 : DÉMONSTRATION EN ACTION (WORKFLOW CEILOW INTERACTIF) ── */}
          <section className="w-full py-20 bg-background-secondary border-y border-border">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto text-center mb-10">
                <span className="text-xs font-bold text-ink uppercase tracking-widest bg-primary/20 px-3 py-1 rounded-full">
                  En Pratique
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mt-3">
                  Regardez comment votre journée devient plus simple.
                </h2>
                <p className="text-text-muted mt-3 text-base">
                  De l&apos;envoi de la facture au pointage de l&apos;argent reçu sur votre compte : tout se fait sans aucune ressaisie manuelle.
                </p>
              </div>

              {/* ── COCKPIT TABLETTE RÉALISTE AVEC DÉMO ANIMÉE 20S ── */}
              <div className="w-full max-w-5xl mx-auto mb-14">
                <CockpitTabletDemo />
              </div>

              {/* Onglets de workflow avec barres de progression individuelles */}
              <div className="w-full max-w-4xl mx-auto">
                <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-background mb-8 border border-border">
                  {/* Onglet 1 */}
                  <button
                    type="button"
                    onClick={() => selectManualTab(1)}
                    className={`relative py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex flex-col items-center justify-center overflow-hidden min-h-[44px] cursor-pointer ${
                      currentStep === 1
                        ? "bg-background-secondary text-ink shadow-xs"
                        : "text-text-muted hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep === 1 ? "bg-primary text-ink" : "bg-border text-text-muted"
                        }`}
                      >
                        1
                      </span>
                      <span className="hidden sm:inline">1. Facturation client</span>
                    </div>
                    {/* Progress bar track pour l'autoplay */}
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-100 ease-linear"
                      style={{ width: currentStep === 1 ? `${progressPercent}%` : "0%" }}
                    />
                  </button>

                  {/* Onglet 2 */}
                  <button
                    type="button"
                    onClick={() => selectManualTab(2)}
                    className={`relative py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex flex-col items-center justify-center overflow-hidden min-h-[44px] cursor-pointer ${
                      currentStep === 2
                        ? "bg-background-secondary text-ink shadow-xs"
                        : "text-text-muted hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep === 2 ? "bg-primary text-ink" : "bg-border text-text-muted"
                        }`}
                      >
                        2
                      </span>
                      <span className="hidden sm:inline">2. Réception du paiement</span>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-100 ease-linear"
                      style={{ width: currentStep === 2 ? `${progressPercent}%` : "0%" }}
                    />
                  </button>

                  {/* Onglet 3 */}
                  <button
                    type="button"
                    onClick={() => selectManualTab(3)}
                    className={`relative py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex flex-col items-center justify-center overflow-hidden min-h-[44px] cursor-pointer ${
                      currentStep === 3
                        ? "bg-background-secondary text-ink shadow-xs"
                        : "text-text-muted hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep === 3 ? "bg-primary text-ink" : "bg-border text-text-muted"
                        }`}
                      >
                        3
                      </span>
                      <span className="hidden sm:inline">3. Impôts &amp; Comptabilité</span>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-100 ease-linear"
                      style={{ width: currentStep === 3 ? `${progressPercent}%` : "0%" }}
                    />
                  </button>
                </div>

                {/* Contenu des Onglets */}
                <div className="bg-background rounded-2xl p-6 sm:p-8 shadow-sm border border-border min-h-[320px] flex items-center">
                  {/* Étape 1 : Création Facture */}
                  {currentStep === 1 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                      <div className="space-y-4">
                        <span className="px-2.5 py-1 rounded bg-primary/20 text-ink text-xs font-bold tracking-wide">
                          ÉTAPE 1 / 3
                        </span>
                        <h4 className="font-display text-xl font-bold text-ink">
                          Vous créez la facture, l&apos;État la valide aussitôt
                        </h4>
                        <p className="text-sm text-text-muted leading-relaxed">
                          Entrez le nom ou l&apos;IFU de votre client. Ceilow applique le taux de TVA adéquat et intègre instantanément le visa officiel de la DGI avec son QR code conforme.
                        </p>
                        <ul className="space-y-2 text-xs text-ink font-medium">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success-deep" />
                            <span>Recherche instantanée des clients par numéro IFU</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success-deep" />
                            <span>Certification DGI e-MECeF avec QR code en direct</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-5 rounded-xl bg-background-secondary text-xs space-y-3 border border-border">
                        <div className="flex justify-between font-bold text-ink">
                          <span>Client : SOCOB S.A. (Cotonou)</span>
                          <span className="font-mono">IFU: 320188941092</span>
                        </div>
                        <div className="p-3 bg-background rounded-lg space-y-2 border border-border">
                          <div className="flex justify-between text-text-muted">
                            <span>Prestation de conseil logistique</span>
                            <span className="font-mono tabular-nums text-ink font-semibold">1 000 000 FCFA</span>
                          </div>
                          <div className="flex justify-between text-text-muted">
                            <span>TVA légale (18%)</span>
                            <span className="font-mono tabular-nums text-ink font-semibold">180 000 FCFA</span>
                          </div>
                          <div className="flex justify-between font-bold text-ink pt-2 border-t border-border">
                            <span>Total TTC</span>
                            <span className="font-mono tabular-nums text-ink font-bold">1 180 000 FCFA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Étape 2 : Encaissement & Synchro */}
                  {currentStep === 2 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                      <div className="space-y-4">
                        <span className="px-2.5 py-1 rounded bg-primary/20 text-ink text-xs font-bold tracking-wide">
                          ÉTAPE 2 / 3
                        </span>
                        <h4 className="font-display text-xl font-bold text-ink">
                          Le paiement tombe, la facture est soldée
                        </h4>
                        <p className="text-sm text-text-muted leading-relaxed">
                          Dès que votre client paie via MTN MoMo, Moov Money ou virement bancaire, Ceilow marque la facture comme payée. Vous suivez vos encaissements en temps réel.
                        </p>
                        <ul className="space-y-2 text-xs text-ink font-medium">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success-deep" />
                            <span>Zéro pointage manuel sur papier ou tableur</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success-deep" />
                            <span>Notification immédiate dès réception de l&apos;argent</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-5 rounded-xl bg-background-secondary text-xs space-y-3 border border-border">
                        <div className="p-3 bg-background rounded-lg flex items-center justify-between border border-border">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-xs text-ink">
                              MoMo
                            </span>
                            <div>
                              <div className="font-bold text-ink">Paiement Reçu SOCOB</div>
                              <div className="text-[10px] text-text-muted font-mono">ID: MTN-BJ-904128</div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-success-deep tabular-nums">+1 180 000 FCFA</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-success/20 border border-success/40 text-success-deep font-semibold text-center text-xs">
                          Statut : Facture Soldée &amp; Quittancée
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Étape 3 : Écritures & Déclarations */}
                  {currentStep === 3 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                      <div className="space-y-4">
                        <span className="px-2.5 py-1 rounded bg-primary/20 text-ink text-xs font-bold tracking-wide">
                          ÉTAPE 3 / 3
                        </span>
                        <h4 className="font-display text-xl font-bold text-ink">
                          Votre comptable a tout en main pour boucler
                        </h4>
                        <p className="text-sm text-text-muted leading-relaxed">
                          Chaque vente et chaque dépense alimentent proprement votre dossier comptable. En fin de mois ou lors du bilan annuel, tous vos justificatifs sont ordonnés et conformes sans passer des nuits blanches.
                        </p>
                        <ul className="space-y-2 text-xs text-ink font-medium">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success-deep" />
                            <span>Dossier propre et prêt pour votre expert-comptable</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success-deep" />
                            <span>Calcul exact de la TVA collectée et déductible</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-5 rounded-xl bg-background-secondary font-mono text-xs space-y-2 border border-border">
                        <div className="grid grid-cols-12 text-text-muted font-semibold border-b border-border pb-1">
                          <span className="col-span-3">Compte</span>
                          <span className="col-span-5">Libellé</span>
                          <span className="col-span-2 text-right">Débit</span>
                          <span className="col-span-2 text-right">Crédit</span>
                        </div>
                        <div className="grid grid-cols-12 text-ink">
                          <span className="col-span-3 font-bold">521000</span>
                          <span className="col-span-5 text-text-muted truncate">Banque BOA</span>
                          <span className="col-span-2 text-right font-bold tabular-nums">1 180k</span>
                          <span className="col-span-2 text-right text-text-muted">-</span>
                        </div>
                        <div className="grid grid-cols-12 text-ink">
                          <span className="col-span-3 font-bold">701000</span>
                          <span className="col-span-5 text-text-muted truncate">Prestations B2B</span>
                          <span className="col-span-2 text-right text-text-muted">-</span>
                          <span className="col-span-2 text-right font-bold tabular-nums">1 000k</span>
                        </div>
                        <div className="grid grid-cols-12 text-ink">
                          <span className="col-span-3 font-bold">443100</span>
                          <span className="col-span-5 text-text-muted truncate">TVA Facturée</span>
                          <span className="col-span-2 text-right text-text-muted">-</span>
                          <span className="col-span-2 text-right font-bold tabular-nums">180k</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 5 : CHIFFRES CLÉS & PREUVES SOCIALES ─────────────────────── */}
          <section className="w-full py-20 bg-background">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* 4 KPIs d'impact */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                <div className="p-6 rounded-2xl bg-background-secondary border border-border text-center">
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-ink tabular-nums">50+</div>
                  <p className="text-xs sm:text-sm text-text-muted mt-2 font-medium">
                    Entreprises et indépendants actifs au Bénin
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-background-secondary border border-border text-center">
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-ink tabular-nums">98.7%</div>
                  <p className="text-xs sm:text-sm text-text-muted mt-2 font-medium">
                    Taux de satisfaction client certifié
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-background-secondary border border-border text-center">
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-ink tabular-nums">&lt; 2s</div>
                  <p className="text-xs sm:text-sm text-text-muted mt-2 font-medium">
                    Temps moyen de certification e-MECeF
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-background-secondary border border-border text-center">
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-success-deep tabular-nums">99.9%</div>
                  <p className="text-xs sm:text-sm text-text-muted mt-2 font-medium">
                    Disponibilité garantie de nos serveurs
                  </p>
                </div>
              </div>

              {/* 3 Témoignages Vérifiés */}
              <div className="max-w-2xl mx-auto text-center mb-12">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Ce que disent les praticiens et dirigeants au Bénin
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Témoignage 1 */}
                <div className="p-6 rounded-2xl bg-background-secondary border border-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-ink text-sm leading-relaxed italic">
                      &ldquo;Avant Ceilow, nous passions trois jours complets chaque début de mois à rapprocher les encaissements MoMo et banques pour notre déclaration TVA. Désormais, tout est prêt le 2 du mois, sans aucune erreur.&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-ink">
                      FD
                    </div>
                    <div>
                      <div className="font-bold text-ink text-sm">Fatima Dossou</div>
                      <div className="text-xs text-text-muted">Resp. Financière, Agro-alimentaire Cotonou</div>
                    </div>
                  </div>
                </div>

                {/* Témoignage 2 */}
                <div className="p-6 rounded-2xl bg-background-secondary border border-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-ink text-sm leading-relaxed italic">
                      &ldquo;En tant qu&apos;expert-comptable, Ceilow est une bénédiction. Mes clients PME saisissent leurs factures qui sont validées DGI à la source. Je récupère des balances SYSCOHADA saines pour clôturer sans friction.&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center font-bold">
                      GA
                    </div>
                    <div>
                      <div className="font-bold text-ink text-sm">Gilles Agossou</div>
                      <div className="text-xs text-text-muted">Expert-Comptable, Cabinet Conseil Cotonou</div>
                    </div>
                  </div>
                </div>

                {/* Témoignage 3 */}
                <div className="p-6 rounded-2xl bg-background-secondary border border-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-ink text-sm leading-relaxed italic">
                      &ldquo;La vitesse de certification e-MECeF est remarquable. Moins de 2 secondes au guichet du port pour remettre la facture conforme au chauffeur. Zéro retard, zéro litige avec l&apos;administration fiscale.&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-ink">
                      MK
                    </div>
                    <div>
                      <div className="font-bold text-ink text-sm">Marc Kouton</div>
                      <div className="text-xs text-text-muted">DG, Entreprise Logistique Bénin</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 6 : GRILLE TARIFAIRE RÉSUMÉE (EN FCFA) ───────────────────── */}
          <section className="w-full py-20 bg-background-secondary border-t border-border" id="tarifs">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto text-center mb-16">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
                  Des tarifs clairs et transparents en FCFA
                </h2>
                <p className="text-text-muted mt-3 text-base">
                  Sans frais cachés, sans engagement. Changez de formule ou résiliez à tout moment selon l&apos;évolution de votre volume d&apos;activité.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* PLAN GRATUIT */}
                <div className="p-8 rounded-2xl bg-background border border-border shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">Plan Gratuit</h3>
                    <p className="text-text-muted mt-1 text-xs">Pour les consultants et indépendants qui débutent.</p>
                    <div className="mt-6 flex items-baseline">
                      <span className="font-mono text-3xl font-bold text-ink tabular-nums">0 FCFA</span>
                      <span className="text-text-muted text-xs ml-1">/ mois</span>
                    </div>
                    <ul className="mt-8 space-y-3 text-xs text-ink">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>10 factures certifiées e-MECeF / mois</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Devis &amp; Proforma normalisés PDF</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Export comptable simple (Excel / CSV)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>1 utilisateur administrateur</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/register"
                      className="cta-button w-full text-center py-3 rounded-xl bg-background-secondary hover:bg-border/60 text-ink font-semibold text-xs transition-colors min-h-[44px] flex items-center justify-center border border-border"
                    >
                      Commencer gratuitement
                    </Link>
                  </div>
                </div>

                {/* PLAN PRO (RECOMMANDÉ) */}
                <div className="p-8 rounded-2xl bg-background shadow-md relative flex flex-col justify-between border-2 border-primary">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-primary text-ink text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                    Recommandé
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">Plan Pro</h3>
                    <p className="text-text-muted mt-1 text-xs">Pour les PME, commerçants et prestataires de services.</p>
                    <div className="mt-6 flex items-baseline">
                      <span className="font-mono text-3xl font-bold text-ink tabular-nums">15 000 FCFA</span>
                      <span className="text-text-muted text-xs ml-1">/ mois</span>
                    </div>
                    <ul className="mt-8 space-y-3 text-xs text-ink font-medium">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Factures e-MECeF illimitées</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Rapprochement bancaire &amp; MoMo direct</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Déclaration TVA DGI automatique</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Journaux SYSCOHADA temps réel</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Gestion de paie (jusqu&apos;à 10 salariés)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Support prioritaire basé à Cotonou</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/register"
                      className="cta-button w-full text-center py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-ink font-bold text-sm shadow transition-all min-h-[44px] flex items-center justify-center"
                    >
                      Essai gratuit 14 jours
                    </Link>
                  </div>
                </div>

                {/* PLAN ENTREPRISE & CABINET */}
                <div className="p-8 rounded-2xl bg-background border border-border shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">Plan Entreprise &amp; Cabinet</h3>
                    <p className="text-text-muted mt-1 text-xs">
                      Pour les groupes, holdings et cabinets d&apos;expertise comptable.
                    </p>
                    <div className="mt-6 flex items-baseline">
                      <span className="font-mono text-3xl font-bold text-ink">Sur devis</span>
                    </div>
                    <ul className="mt-8 space-y-3 text-xs text-ink">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Multi-entreprises et consolidation de groupe</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Volume de facturation et écritures illimité</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>API ouverte pour ERP interne</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Formation sur site à Cotonou &amp; Porto-Novo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                        <span>Chargé de compte dédié OECCA</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/demo"
                      className="cta-button w-full text-center py-3 rounded-xl bg-background-secondary hover:bg-border/60 text-ink font-semibold text-xs transition-colors min-h-[44px] flex items-center justify-center border border-border"
                    >
                      Contacter notre équipe
                    </Link>
                  </div>
                </div>
              </div>

              {/* Lien Comparatif */}
              <div className="mt-12 text-center">
                <Link
                  href="/tarifs"
                  className="cta-button inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-primary transition-colors min-h-[44px]"
                >
                  <span>
                    Vous hésitez ? Comparez toutes les fonctionnalités en détail sur notre grille comparative complète des tarifs
                  </span>
                  <ArrowRight className="w-4 h-4 icon-arrow" />
                </Link>
              </div>
            </div>
          </section>

          {/* ── SECTION 7 : BANNIÈRE FINALE DE CONVERSION (CHOCOLAT / INK SANS FLOU) ── */}
          <section className="relative w-full bg-ink text-white py-20 lg:py-24 overflow-hidden border-t border-border">
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                Passez moins de temps sur vos papiers, plus de temps sur vos clients.
              </h2>
              <p className="text-base sm:text-lg text-border max-w-xl mx-auto mb-8 leading-relaxed">
                Rejoignez les dirigeants et entrepreneurs béninois qui ont simplifié leur gestion avec Ceilow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/demo"
                  className="cta-button w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-ink text-base px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all min-h-[48px]"
                >
                  <Calendar className="w-5 h-5 icon-arrow" />
                  <span>Demander une démo</span>
                </Link>
              </div>
              <div className="mt-4">
                <Link
                  href="/register"
                  className="cta-button inline-flex items-center gap-1 text-xs text-border hover:text-primary transition-colors underline underline-offset-4 min-h-[44px]"
                >
                  <span>ou créez votre compte gratuit en 2 minutes</span>
                  <ArrowRight className="w-3.5 h-3.5 icon-arrow" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── FOOTER PUBLIC UNIFIÉ ACTUEL (bg-ink text-white avec logo officiel) ── */}
      <PublicFooter />
    </div>
  );
}
