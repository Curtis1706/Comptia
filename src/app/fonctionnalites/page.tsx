"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Receipt,
  Landmark,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowRight,
  Wallet,
  Building2,
  PlayCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Calendar,
  Zap,
  Layers,
  Search,
  Scan,
  UserCheck,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function FonctionnalitesPage() {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      <PublicHeader className="sticky top-0 z-50 w-full" />

      <main className="flex-1 w-full overflow-hidden">
        {/* ── CSS KEYFRAMES INLINE FOR VECTOR ANIMATIONS (Lottie-like lightweight SVGs) ── */}
        <style jsx global>{`
          @keyframes scanLaserLine {
            0% { transform: translateY(0px); opacity: 0.2; }
            50% { transform: translateY(110px); opacity: 0.9; }
            100% { transform: translateY(0px); opacity: 0.2; }
          }
          @keyframes pulseWaveCircle {
            0% { r: 18; opacity: 0.75; }
            100% { r: 58; opacity: 0; }
          }
          @keyframes floatGentleItem {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-7px); }
          }
          @keyframes spinSlowWheel {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spinReverseWheel {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes dropCoinStack {
            0% { transform: translateY(-26px); opacity: 0; }
            40% { transform: translateY(0); opacity: 1; }
            65% { transform: translateY(-5px); }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes sparkGlow {
            0%, 100% { transform: scale(0.65); opacity: 0.35; }
            50% { transform: scale(1.15); opacity: 1; }
          }
          @keyframes streamDashFlow {
            0% { stroke-dashoffset: 48; }
            100% { stroke-dashoffset: 0; }
          }
          .laser-beam {
            animation: scanLaserLine 2.8s ease-in-out infinite;
          }
          .pulse-wave {
            animation: pulseWaveCircle 2.4s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
          }
          .float-gentle {
            animation: floatGentleItem 4s ease-in-out infinite;
          }
          .spin-slow {
            animation: spinSlowWheel 24s linear infinite;
            transform-origin: center;
          }
          .spin-reverse {
            animation: spinReverseWheel 18s linear infinite;
            transform-origin: center;
          }
          .drop-coin-1 {
            animation: dropCoinStack 2.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          }
          .drop-coin-2 {
            animation: dropCoinStack 2.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite 0.7s;
          }
          .spark-glow {
            animation: sparkGlow 1.8s ease-in-out infinite;
            transform-origin: center;
          }
          .stream-flow {
            stroke-dasharray: 6 6;
            animation: streamDashFlow 1.6s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .laser-beam,
            .pulse-wave,
            .float-gentle,
            .spin-slow,
            .spin-reverse,
            .drop-coin-1,
            .drop-coin-2,
            .spark-glow,
            .stream-flow {
              animation: none;
            }
          }
        `}</style>

        {/* 1. SECTION HERO SPLIT-SCREEN */}
        <section className="w-full py-16 lg:py-24 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Colonne gauche */}
              <div className="lg:col-span-7 flex flex-col items-start space-y-6">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-ink leading-[1.12] tracking-tight">
                  La paie et les factures de votre société, enfin simples
                </h1>

                <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
                  Créez vos fiches de paie conformes et vos factures certifiées DGI en deux minutes. Fini les tableaux Excel compliqués et les erreurs de calcul.
                </p>

                {/* Checklist des bénéfices */}
                <div className="flex flex-col space-y-3.5 pt-1 w-full">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Fiches de paie et cotisations CNSS calculées automatiquement
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Factures officielles e-MECeF avec QR code DGI sans boîtier physique
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Accessible sur téléphone, tablette et ordinateur partout au Bénin
                    </span>
                  </div>
                </div>

                {/* Double CTA */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-xs transition-all min-h-[48px]"
                  >
                    <span>Tester gratuitement</span>
                  </Link>

                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center border border-border bg-background hover:bg-background-secondary text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all min-h-[48px]"
                  >
                    <PlayCircle className="w-4 h-4 mr-2 text-ink" />
                    <span>Voir la démo</span>
                  </Link>
                </div>

                <p className="text-xs text-text-muted flex items-center gap-2 pt-1">
                  <ShieldCheck className="w-4 h-4 text-ink shrink-0" />
                  <span>14 jours d&apos;essai sans engagement - Sans carte bancaire</span>
                </p>
              </div>

              {/* Colonne droite : Aperçu Mobile e-MECeF */}
              <div className="lg:col-span-5 relative flex justify-center items-center py-4">
                <div className="relative z-10 w-full max-w-[340px]">
                  <div className="bg-ink p-3 rounded-[2.5rem] shadow-xs border-2 border-border relative">
                    <div className="w-24 h-4 bg-ink mx-auto rounded-full mb-3 flex items-center justify-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-ink-surface" />
                      <div className="w-8 h-1.5 rounded-full bg-ink-surface" />
                    </div>

                    <div className="bg-background rounded-[2rem] p-4 flex flex-col space-y-4 overflow-hidden border border-border">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center">
                          <Image
                            src="/logo/ceilow_web_sombre.svg"
                            alt="Ceilow"
                            width={90}
                            height={24}
                            style={{ width: "auto" }}
                            className="h-5"
                            priority
                          />
                        </div>
                        <span className="text-[11px] text-text-muted font-medium font-mono">
                          Exemple d&apos;interface
                        </span>
                      </div>

                      <div className="flex items-center bg-background-secondary p-1 rounded-lg text-center text-xs">
                        <div className="flex-1 py-1 bg-background text-ink rounded shadow-xs font-semibold">
                          Fiche de paie
                        </div>
                        <div className="flex-1 py-1 text-text-muted">
                          Facture DGI
                        </div>
                        <div className="flex-1 py-1 text-text-muted">
                          Cotisations
                        </div>
                      </div>

                      <div className="bg-background-secondary border border-border rounded-xl p-4 relative group">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-semibold text-success-deep flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Conforme CNSS / DGI</span>
                            </div>
                            <div className="text-base font-bold text-ink mt-2">Mars 2026</div>
                            <div className="text-xs text-text-muted">Exemple - Direction Générale</div>
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-primary text-ink flex items-center justify-center shadow-xs shrink-0">
                            <Receipt className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="my-3 py-2 border-y border-border space-y-1.5 text-xs font-mono">
                          <div className="flex justify-between text-text-muted">
                            <span>Salaire brut :</span>
                            <span className="text-ink font-medium tabular-nums">850 000 FCFA</span>
                          </div>
                          <div className="flex justify-between text-text-muted">
                            <span>Cotisations &amp; IPTS :</span>
                            <span className="text-error font-medium tabular-nums">- 106 000 FCFA</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-ink pt-1 border-t border-border">
                            <span>Net à payer :</span>
                            <span className="text-ink font-bold tabular-nums">744 000 FCFA</span>
                          </div>
                        </div>

                        <div className="relative w-full h-16 rounded-lg bg-background border border-border flex items-center justify-between px-3 overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary laser-beam pointer-events-none" />

                          <div className="flex items-center gap-2.5 z-10">
                            <svg className="w-10 h-10 text-ink" viewBox="0 0 32 32" fill="none">
                              <rect x="2" y="2" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
                              <rect x="5" y="5" width="4" height="4" fill="currentColor" />
                              <rect x="20" y="2" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
                              <rect x="23" y="5" width="4" height="4" fill="currentColor" />
                              <rect x="2" y="20" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
                              <rect x="5" y="23" width="4" height="4" fill="currentColor" />
                              <rect x="16" y="16" width="3" height="3" fill="currentColor" />
                              <rect x="22" y="16" width="4" height="2" fill="currentColor" />
                              <rect x="16" y="22" width="3" height="4" fill="currentColor" />
                              <rect x="22" y="24" width="4" height="3" fill="currentColor" />
                            </svg>
                            <div>
                              <div className="text-[11px] font-bold text-ink leading-tight">Certifié e-MECeF</div>
                              <div className="text-[10px] text-text-muted font-mono">QR code officiel DGI</div>
                            </div>
                          </div>

                          <div className="w-8 h-8 rounded-lg border border-border bg-primary text-ink flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-ink stroke-[3]" />
                          </div>
                        </div>

                        <div className="mt-3 text-center text-[11px] text-text-muted font-semibold">
                          Bulletin PDF prêt à imprimer ou partager
                        </div>
                      </div>

                      <div className="bg-background-secondary p-2.5 rounded-lg border border-border flex items-center justify-between text-xs">
                        <span className="text-ink font-medium">Suivi DGI / CNSS</span>
                        <span className="font-mono text-[11px] font-bold text-success-deep">Prêt</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. RUBAN DE RÉASSURANCE */}
        <section className="w-full bg-background-secondary border-b border-border py-8">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border">
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 border border-border">
                  <Building2 className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Tout statut</div>
                  <p className="text-xs text-text-muted">SARL, SAS, ETS et indépendants au Bénin</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 border border-border">
                  <Scan className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Facturation DGI</div>
                  <p className="text-xs text-text-muted">QR code e-MECeF officiel sans boîtier</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 border border-border">
                  <Wallet className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Banques &amp; MoMo</div>
                  <p className="text-xs text-text-muted">MTN MoMo, Moov Money et banques locales</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 border border-border">
                  <Headphones className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Support Cotonou</div>
                  <p className="text-xs text-text-muted">Accompagnement humain au démarrage</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SHOWCASE FICHES DE PAIE */}
        <section className="w-full py-16 lg:py-24 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight mb-3">
                Éditez vos fiches de paie en quelques clics
              </h2>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                La paie de votre équipe devient simple et claire. Cotisations CNSS, IPTS et VPS sont calculés au franc CFA près.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 flex flex-col items-center relative">
                <div className="w-full max-w-md relative">
                  <div className="w-full bg-background rounded-2xl p-6 border-2 border-primary shadow-xs relative z-10">
                    <div className="flex items-center justify-between pb-4 border-b border-border gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-ink shrink-0">
                          EX
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-ink">Exemple de bulletin</h4>
                          <span className="text-xs text-text-muted">Barème Bénin • Mars 2026</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-success-deep flex items-center gap-1 shrink-0">
                        <Check className="w-3.5 h-3.5" /> CNSS prête
                      </span>
                    </div>

                    <div className="py-4 space-y-2.5 text-xs font-mono border-b border-border">
                      <div className="flex justify-between text-text-muted">
                        <span>Salaire brut</span>
                        <span className="font-medium text-ink tabular-nums">850 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Retenue IPTS (DGI)</span>
                        <span className="text-error font-medium tabular-nums">- 75 400 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>CNSS salarié (3,6 %)</span>
                        <span className="text-error font-medium tabular-nums">- 30 600 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>VPS employeur (4 %)</span>
                        <span className="text-ink font-medium tabular-nums">34 000 FCFA</span>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-text-muted">Net à payer</div>
                        <div className="text-xl font-bold text-ink font-mono tabular-nums">744 000 FCFA</div>
                      </div>
                      <Link
                        href="/solutions/paie-cnss"
                        className="bg-primary hover:bg-primary-hover text-ink text-xs px-4 py-2.5 rounded-lg font-bold inline-flex items-center gap-1.5 transition-all min-h-[44px]"
                      >
                        <span>Simuler la paie</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-ink" viewBox="0 0 36 36" fill="none">
                          <g className="spin-slow" transform="translate(14, 14)">
                            <circle cx="0" cy="0" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
                            <circle cx="0" cy="0" r="3" fill="#FFD946" />
                          </g>
                          <g className="spin-reverse" transform="translate(24, 22)">
                            <circle cx="0" cy="0" r="6" stroke="#8A857D" strokeWidth="1.5" strokeDasharray="2 2" />
                            <circle cx="0" cy="0" r="2" fill="#332E29" />
                          </g>
                        </svg>
                        <span className="text-[11px] text-text-muted font-mono">Barème CNSS &amp; IPTS à jour</span>
                      </div>

                      <svg className="w-16 h-8" viewBox="0 0 60 30" fill="none">
                        <g className="drop-coin-1">
                          <circle cx="20" cy="18" r="5" fill="#FFD946" stroke="#332E29" strokeWidth="1" />
                        </g>
                        <g className="drop-coin-2">
                          <circle cx="34" cy="18" r="5" fill="#FFD946" stroke="#332E29" strokeWidth="1" />
                        </g>
                        <rect x="10" y="24" width="40" height="3" rx="1.5" fill="#332E29" opacity="0.3" />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-4 p-3.5 bg-background-secondary rounded-xl border border-border">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0">
                      <Image
                        src="/images/conseillere-cotonou.jpg"
                        alt="Conseillère support clientèle Ceilow à Cotonou"
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-ink">Conçu pour la réglementation du Bénin</p>
                      <p className="text-xs text-text-muted">Code du Travail béninois, CNSS et plan SYSCOHADA révisé</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordéon 3 étapes */}
              <div className="lg:col-span-6 flex flex-col space-y-4">
                <div
                  className={`border rounded-2xl p-6 transition-all ${
                    activeStep === 1
                      ? "border-primary bg-background shadow-xs"
                      : "border-border bg-background-secondary hover:bg-background"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    aria-expanded={activeStep === 1}
                    className="w-full flex items-center justify-between text-left cursor-pointer min-h-[44px]"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg font-bold font-mono text-xs flex items-center justify-center shrink-0 ${
                          activeStep === 1 ? "bg-primary text-ink" : "bg-border text-text-muted"
                        }`}
                      >
                        1
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-ink">
                        Créez votre fiche de paie en 2 minutes
                      </h3>
                    </div>
                    {activeStep === 1 ? (
                      <ChevronUp className="w-5 h-5 text-ink shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                    )}
                  </button>
                  {activeStep === 1 && (
                    <div className="mt-3 pl-10 text-text-muted text-sm leading-relaxed">
                      Indiquez le salaire brut. Ceilow applique automatiquement les taux d&apos;IPTS, de CNSS et de VPS en vigueur au Bénin sans calcul manuel.
                    </div>
                  )}
                </div>

                <div
                  className={`border rounded-2xl p-6 transition-all ${
                    activeStep === 2
                      ? "border-primary bg-background shadow-xs"
                      : "border-border bg-background-secondary hover:bg-background"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    aria-expanded={activeStep === 2}
                    className="w-full flex items-center justify-between text-left cursor-pointer min-h-[44px]"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg font-bold font-mono text-xs flex items-center justify-center shrink-0 ${
                          activeStep === 2 ? "bg-primary text-ink" : "bg-border text-text-muted"
                        }`}
                      >
                        2
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-ink">
                        Déclarez à la CNSS sans tout recopier
                      </h3>
                    </div>
                    {activeStep === 2 ? (
                      <ChevronUp className="w-5 h-5 text-ink shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                    )}
                  </button>
                  {activeStep === 2 && (
                    <div className="mt-3 pl-10 text-text-muted text-sm leading-relaxed">
                      Préparez en un clic la liste nominative pour votre déclaration CNSS (trimestrielle sous 20 salariés, mensuelle dès 20 salariés), sans erreur de formule.
                    </div>
                  )}
                </div>

                <div
                  className={`border rounded-2xl p-6 transition-all ${
                    activeStep === 3
                      ? "border-primary bg-background shadow-xs"
                      : "border-border bg-background-secondary hover:bg-background"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    aria-expanded={activeStep === 3}
                    className="w-full flex items-center justify-between text-left cursor-pointer min-h-[44px]"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg font-bold font-mono text-xs flex items-center justify-center shrink-0 ${
                          activeStep === 3 ? "bg-primary text-ink" : "bg-border text-text-muted"
                        }`}
                      >
                        3
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-ink">
                        Bulletins archivés et accessibles partout
                      </h3>
                    </div>
                    {activeStep === 3 ? (
                      <ChevronUp className="w-5 h-5 text-ink shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                    )}
                  </button>
                  {activeStep === 3 && (
                    <div className="mt-3 pl-10 text-text-muted text-sm leading-relaxed">
                      Chaque employé reçoit sa fiche au format PDF. Vos archives restent conservées et prêtes pour tout contrôle.
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-xs transition-all min-h-[48px]"
                  >
                    <span>Tester gratuitement</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BANNIÈRE D'AUTORITÉ SOMBRE */}
        <section className="w-full bg-ink text-white py-20 border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="text-center max-w-2xl mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight mb-3">
                Avec Ceilow, votre gestion est entre de bonnes mains
              </h2>
              <p className="text-base text-white/70">
                Un outil moderne adapté aux règles fiscales, sociales et comptables du Bénin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 w-full">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 rounded-2xl border border-ink-border bg-ink-surface flex items-center justify-center mb-4 text-primary">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Simple</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Prise en main rapide sans avoir besoin d&apos;une formation longue.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 rounded-2xl border border-ink-border bg-ink-surface flex items-center justify-center mb-4 text-primary">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Disponible</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Une équipe à Cotonou joignable par téléphone et WhatsApp.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 rounded-2xl border border-ink-border bg-ink-surface flex items-center justify-center mb-4 text-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Complet</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Factures DGI, trésorerie MoMo, impôts et paie au même endroit.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 rounded-2xl border border-ink-border bg-ink-surface flex items-center justify-center mb-4 text-primary">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Transparent</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Tarifs clairs en Francs CFA, sans frais cachés ni engagement.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 rounded-2xl border border-ink-border bg-ink-surface flex items-center justify-center mb-4 text-success">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Conforme</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Aligné sur les règles de la DGI, de la CNSS Bénin et du SYSCOHADA.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. TRÉSORERIE & COMPTABILITÉ */}
        <section className="w-full py-16 lg:py-24 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-background-secondary border border-border rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 flex flex-col items-start space-y-4">
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                  Votre trésorerie et vos comptes au juste prix
                </h2>

                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Suivez vos entrées d&apos;argent, vos dépenses et votre résultat en direct. Reliez vos comptes MoMo et vos relevés bancaires en quelques secondes sans être comptable.
                </p>

                <div className="space-y-3 pt-2 w-full">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-xs sm:text-sm text-ink font-medium">
                      Solde unifié banques (BOA, Ecobank, BIIC...) + MTN &amp; Moov Money
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-xs sm:text-sm text-ink font-medium">
                      Alertes automatiques avant chaque échéance de déclaration fiscale
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/tarifs"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm px-7 py-3.5 rounded-xl transition-all shadow-xs min-h-[48px]"
                  >
                    <span>Voir les tarifs</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 bg-background p-6 rounded-2xl border border-border shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-border gap-2">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-text-muted">Exemple de suivi mensuel</span>
                    <div className="text-2xl font-bold text-ink font-mono tabular-nums">4 850 000 FCFA</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-deep shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" /> Trésorerie suivie
                  </span>
                </div>

                <div className="py-4 border-b border-border">
                  <div className="relative w-full h-24 bg-background-secondary rounded-xl border border-border flex items-center justify-between px-4 overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 100">
                      <circle cx="200" cy="50" r="18" fill="none" stroke="#FFD946" strokeWidth="2" className="pulse-wave" />
                      <circle cx="200" cy="50" r="36" fill="none" stroke="#FFD946" strokeWidth="1" opacity="0.4" />
                      <path d="M 60 50 L 180 50" stroke="#FFD946" strokeWidth="2" className="stream-flow" />
                      <path d="M 340 50 L 220 50" stroke="#332E29" strokeWidth="2" className="stream-flow" />
                    </svg>

                    <div className="flex items-center gap-2 z-10">
                      <div className="w-8 h-8 rounded-lg bg-primary text-ink flex items-center justify-center font-bold text-xs border border-border shadow-xs">
                        MoMo
                      </div>
                      <div>
                        <div className="text-xs font-bold text-ink">MTN &amp; Moov</div>
                        <div className="text-[10px] text-text-muted font-mono">Encaissements</div>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-ink text-white flex items-center justify-center z-10 shadow-xs border border-primary">
                      <Wallet className="w-4 h-4 text-primary" />
                    </div>

                    <div className="flex items-center gap-2 z-10">
                      <div>
                        <div className="text-xs font-bold text-ink text-right">Banques</div>
                        <div className="text-[10px] text-text-muted font-mono text-right">Virements</div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-background text-ink flex items-center justify-center font-bold text-xs border border-border shadow-xs">
                        <Landmark className="w-4 h-4 text-ink" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 pb-2">
                  <div className="flex items-end justify-between h-36 px-2 gap-3">
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-ink rounded-t-sm transition-all" style={{ height: "45%" }} />
                      <span className="text-xs text-text-muted font-mono">Oct</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-primary rounded-t-sm transition-all" style={{ height: "60%" }} />
                      <span className="text-xs text-text-muted font-mono">Nov</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-ink rounded-t-sm transition-all" style={{ height: "85%" }} />
                      <span className="text-xs text-text-muted font-mono">Déc</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-primary rounded-t-sm transition-all" style={{ height: "70%" }} />
                      <span className="text-xs text-text-muted font-mono">Jan</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-ink rounded-t-sm transition-all" style={{ height: "78%" }} />
                      <span className="text-xs text-text-muted font-mono">Fév</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-primary rounded-t-sm shadow-xs" style={{ height: "95%" }} />
                      <span className="text-xs font-bold text-ink font-mono">Mar</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-ink font-medium">
                      <span className="w-3 h-3 rounded-xs bg-primary" /> Mobile Money
                    </span>
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <span className="w-3 h-3 rounded-xs bg-ink" /> Virements bancaires
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-success-deep font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Rapprochement à jour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CAS D'USAGE AU BÉNIN (Fond Ink) */}
        <section className="w-full bg-ink text-white py-20 border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="mb-4">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 64 64">
                <rect height="42" rx="4" width="48" x="8" y="14" />
                <line x1="8" x2="56" y1="26" y2="26" />
                <line x1="20" x2="20" y1="8" y2="16" />
                <line x1="44" x2="44" y1="8" y2="16" />
                <circle cx="24" cy="38" fill="currentColor" r="2.5" />
                <circle cx="40" cy="38" fill="currentColor" r="2.5" />
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight text-center mb-3">
              Conçu pour le quotidien des entreprises au Bénin
            </h2>
            <p className="text-base text-white/70 text-center max-w-2xl mb-12">
              Trois situations courantes où Ceilow supprime la paperasse et vous fait gagner du temps.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-background text-ink p-7 rounded-2xl flex flex-col justify-between shadow-xs border border-border">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-3">
                    Prestations &amp; conseil B2B
                  </span>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Créez une facture certifiée e-MECeF depuis votre téléphone ou ordinateur, récupérez le QR code DGI et envoyez-la au client par WhatsApp ou e-mail sans boîtier physique.
                  </p>
                </div>
                <div className="pt-4 border-t border-border text-xs font-bold text-ink flex items-center justify-between">
                  <span>Zéro machine à acheter</span>
                  <Check className="w-4 h-4 text-success-deep shrink-0" />
                </div>
              </div>

              <div className="bg-background text-ink p-7 rounded-2xl flex flex-col justify-between shadow-xs border border-border">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-3">
                    Commerce &amp; distribution
                  </span>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Regroupez vos paiements MTN MoMo, Moov Money et comptes bancaires au même endroit. En fin de mois, vos chiffres de TVA sont déjà calculés sans stress.
                  </p>
                </div>
                <div className="pt-4 border-t border-border text-xs font-bold text-ink flex items-center justify-between">
                  <span>Préparation TVA du 10</span>
                  <Check className="w-4 h-4 text-success-deep shrink-0" />
                </div>
              </div>

              <div className="bg-background text-ink p-7 rounded-2xl flex flex-col justify-between shadow-xs border border-border">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-3">
                    Entreprises avec salariés
                  </span>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Calculez les bulletins de paie avec cotisations CNSS, IPTS et VPS en quelques clics et préparez l&apos;export pour le portail e-Cotisations CNSS.
                  </p>
                </div>
                <div className="pt-4 border-t border-border text-xs font-bold text-ink flex items-center justify-between">
                  <span>Paie &amp; CNSS simplifiées</span>
                  <Check className="w-4 h-4 text-success-deep shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. BANNIÈRE PRÉ-FOOTER */}
        <section className="w-full py-16 lg:py-24 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-background-secondary border border-border rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-8 lg:p-14 flex flex-col items-start space-y-5">
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                  Prêt à simplifier votre gestion ?
                </h2>

                <p className="text-base text-text-muted max-w-lg leading-relaxed">
                  Gagnez du temps chaque jour sur vos factures DGI, vos fiches de paie et vos déclarations mensuelles.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-xs transition-all min-h-[48px]"
                  >
                    <span>Tester gratuitement</span>
                  </Link>

                  <Link
                    href="/accompagnement"
                    className="inline-flex items-center justify-center border border-border bg-background hover:bg-background-secondary text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all min-h-[48px]"
                  >
                    <span>Être accompagné</span>
                  </Link>
                </div>

                <div className="pt-1 flex items-center gap-2 text-text-muted text-xs">
                  <Check className="w-4 h-4 text-success-deep shrink-0" />
                  <span>Essai de 14 jours sans engagement - Aucune carte bancaire requise</span>
                </div>
              </div>

              <div className="lg:col-span-5 h-full relative min-h-[320px] flex items-center justify-center p-6 lg:p-8">
                <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden border border-border">
                  <Image
                    src="/images/collaboration-comptable.jpg"
                    alt="Entrepreneur béninois pilotant sa gestion d'entreprise sur Ceilow"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. GRILLE DES 6 OUTILS FONCTIONNELS */}
        <section className="w-full py-16 lg:py-24 bg-background-secondary">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight mb-3">
                Tout ce dont vous avez besoin pour gérer votre entreprise
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Chaque outil supprime les pertes de temps et la double saisie pour les PME au Bénin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background-secondary text-ink flex items-center justify-center mb-5 border border-border">
                    <Receipt className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Facturation certifiée DGI</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Devis, acomptes, avoirs et factures de vente avec QR code officiel e-MECeF créé en direct.
                  </p>
                </div>
                <Link
                  href="/solutions/facturation-dgi"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 group-hover:underline transition-all"
                >
                  <span>Voir la facturation</span>
                  <ArrowRight className="w-4 h-4 text-ink" />
                </Link>
              </div>

              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background-secondary text-ink flex items-center justify-center mb-5 border border-border">
                    <Wallet className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Trésorerie &amp; Mobile Money</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Suivi en direct de vos comptes MTN MoMo, Moov Money et comptes bancaires. Rapprochement guidé des paiements.
                  </p>
                </div>
                <Link
                  href="/solutions/tresorerie-momo"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 group-hover:underline transition-all"
                >
                  <span>Voir la trésorerie</span>
                  <ArrowRight className="w-4 h-4 text-ink" />
                </Link>
              </div>

              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background-secondary text-ink flex items-center justify-center mb-5 border border-border">
                    <UserCheck className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Paie &amp; déclarations CNSS</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Création des bulletins de paie, calcul IPTS, cotisations CNSS et VPS conformes au Code du Travail béninois.
                  </p>
                </div>
                <Link
                  href="/solutions/paie-cnss"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 group-hover:underline transition-all"
                >
                  <span>Voir la paie</span>
                  <ArrowRight className="w-4 h-4 text-ink" />
                </Link>
              </div>

              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background-secondary text-ink flex items-center justify-center mb-5 border border-border">
                    <Scan className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Dépenses &amp; reçus par photo</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Prenez vos factures d&apos;achats en photo depuis votre téléphone : montants et TVA sont lus sans saisie manuelle.
                  </p>
                </div>
                <Link
                  href="/solutions/gestion-depenses"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 group-hover:underline transition-all"
                >
                  <span>Voir les dépenses</span>
                  <ArrowRight className="w-4 h-4 text-ink" />
                </Link>
              </div>

              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background-secondary text-ink flex items-center justify-center mb-5 border border-border">
                    <Calendar className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Déclarations DGI préparées</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Calcul automatique de votre TVA facturée et déductible. Alertes avant le 10 du mois pour éviter les majorations.
                  </p>
                </div>
                <Link
                  href="/solutions/declarations-fiscales"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 group-hover:underline transition-all"
                >
                  <span>Voir la fiscalité</span>
                  <ArrowRight className="w-4 h-4 text-ink" />
                </Link>
              </div>

              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background-secondary text-ink flex items-center justify-center mb-5 border border-border">
                    <Layers className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Comptabilité SYSCOHADA</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Comptes de résultat, balance et écritures prêts pour votre expert-comptable ou vos demandes bancaires.
                  </p>
                </div>
                <Link
                  href="/solutions/comptabilite-syscohada"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 group-hover:underline transition-all"
                >
                  <span>Voir la comptabilité</span>
                  <ArrowRight className="w-4 h-4 text-ink" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
