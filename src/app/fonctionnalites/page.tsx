"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Download,
  Receipt,
  Landmark,
  ShieldCheck,
  Headphones,
  Sparkles,
  Clock,
  ArrowRight,
  FileText,
  Wallet,
  Building2,
  PlayCircle,
  TrendingUp,
  Star,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Calendar,
  Zap,
  Award,
  CheckCircle2,
  Layers,
  Search,
  Scan,
  Send,
  CreditCard,
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
        `}</style>

        {/* ── 1. SECTION HERO SPLIT-SCREEN ── */}
        <section className="w-full py-16 lg:py-24 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Colonne gauche : Copie & Proposition de valeur orientée bénéfices */}
              <div className="lg:col-span-7 flex flex-col items-start space-y-6">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-clash text-ink leading-[1.12] tracking-tight">
                  La paie et les factures de votre société,{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">enfin ultra-simples</span>
                    <span className="absolute bottom-1.5 left-0 w-full h-3 bg-primary/40 -z-0 rounded-xs" />
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
                  Éditez vos fiches de paie conformes et vos factures normalisées DGI en deux minutes chrono. Sans tableau Excel compliqué, sans risque d&apos;erreur.
                </p>

                {/* Checklist des bénéfices (sans badges superflus) */}
                <div className="flex flex-col space-y-3.5 pt-1 w-full">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/20 text-success-deep flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Fiches de paie et cotisations CNSS calculées automatiquement
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/20 text-success-deep flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Factures certifiées DGI avec QR code officiel en 3 secondes
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/20 text-success-deep flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Accessible sur smartphone, tablette et ordinateur partout au Bénin
                    </span>
                  </div>
                </div>

                {/* Double CTA d'action directe */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-xs transition-all min-h-[48px]"
                  >
                    <span>Essayer gratuitement</span>
                  </Link>

                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center border border-border bg-background hover:bg-background-secondary text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all min-h-[48px]"
                  >
                    <PlayCircle className="w-4 h-4 mr-2 text-ink" />
                    <span>Voir la démonstration</span>
                  </Link>
                </div>

                <p className="text-xs text-text-muted flex items-center gap-2 pt-1">
                  <ShieldCheck className="w-4 h-4 text-success-deep" />
                  <span>14 jours d&apos;essai sans engagement • Sans carte bancaire requise</span>
                </p>
              </div>

              {/* Colonne droite : Mockup Smartphone & SVG ANIMÉ STRATÉGIQUE N°1 (Générateur e-MECeF QR certifié) */}
              <div className="lg:col-span-5 relative flex justify-center items-center py-4">
                {/* ── SVG ANIMÉ STRATÉGIQUE N°1 : SCANNER VECTORIEL e-MECeF / RADAR DE CERTIFICATION ── */}
                <div className="relative z-10 w-full max-w-[340px]">
                  {/* Smartphone Frame épuré */}
                  <div className="bg-ink p-3 rounded-[2.5rem] shadow-sm border-2 border-border/60 relative">
                    {/* Top Speaker / Camera Notch */}
                    <div className="w-24 h-4 bg-ink mx-auto rounded-full mb-3 flex items-center justify-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-8 h-1.5 rounded-full bg-white/10" />
                    </div>

                    {/* Écran intérieur blanc */}
                    <div className="bg-background rounded-[2rem] p-4 flex flex-col space-y-4 overflow-hidden border border-border">
                      {/* Entête d'écran */}
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center font-bold text-xs text-ink">
                            C
                          </span>
                          <div>
                            <div className="text-[11px] uppercase tracking-wider text-text-muted">
                              Bonjour Alain
                            </div>
                            <div className="text-sm font-bold text-ink leading-none">
                              Ceilow Mobile
                            </div>
                          </div>
                        </div>
                        <Smartphone className="w-4 h-4 text-text-muted" />
                      </div>

                      {/* Sélecteur d'onglets smartphone */}
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

                      {/* CARTE DYNAMIQUE AVEC SVG ANIMÉ DU SCANNER e-MECeF */}
                      <div className="bg-background-secondary border border-border rounded-xl p-4 relative group">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs font-semibold text-success-deep flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success-deep" />
                              <span>Validé CNSS / DGI</span>
                            </div>
                            <div className="text-base font-bold text-ink mt-1">Mars 2026</div>
                            <div className="text-xs text-text-muted">Direction Générale • Alain T.</div>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-ink">
                            <Receipt className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Breakdown salarial clair */}
                        <div className="my-3 py-2 border-y border-border space-y-1.5 text-xs font-mono">
                          <div className="flex justify-between text-text-muted">
                            <span>Rémunération brute :</span>
                            <span className="text-ink font-medium">850 000 FCFA</span>
                          </div>
                          <div className="flex justify-between text-text-muted">
                            <span>Cotisations &amp; IPTS :</span>
                            <span className="text-error font-medium">- 121 500 FCFA</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-ink pt-1 border-t border-border">
                            <span>Net à percevoir :</span>
                            <span className="text-ink font-bold tabular-nums">728 500 FCFA</span>
                          </div>
                        </div>

                        {/* SVG Interactif Cadré : Faisceau Laser & QR Code DGI */}
                        <div className="relative w-full h-16 rounded-lg bg-background border border-border flex items-center justify-between px-3 overflow-hidden">
                          {/* Ligne Laser Animée */}
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary laser-beam pointer-events-none" />

                          <div className="flex items-center gap-2.5 z-10">
                            {/* QR Code vectoriel */}
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
                              <div className="text-[10px] text-text-muted font-mono">DGI-BJ-2026-9812</div>
                            </div>
                          </div>

                          {/* Sceau tournant discret */}
                          <div className="w-8 h-8 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center text-ink flex-shrink-0">
                            <Check className="w-4 h-4 text-ink stroke-[3]" />
                          </div>
                        </div>

                        {/* Bouton d'action intérieur smartphone */}
                        <div className="mt-3 w-full bg-ink text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                          <Download className="w-3.5 h-3.5" />
                          <span>Télécharger le bulletin PDF</span>
                        </div>
                      </div>

                      {/* Indicateur de synchronisation fiscale */}
                      <div className="bg-background-secondary p-2.5 rounded-lg border border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-success-deep" />
                          <span className="text-xs text-ink font-medium">Télédéclaration DGI / CNSS</span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-success-deep">Synchronisé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. SECTION RUBAN DE RÉASSURANCE IMMÉDIATE (4 Colonnes Cadrées) ── */}
        <section className="w-full bg-background-secondary border-b border-border py-8">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {/* Colonne 1 */}
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 border border-border">
                  <Building2 className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">50+ entreprises</div>
                  <p className="text-xs text-text-muted">SARL, SAS, ETS et indépendants actifs au Bénin</p>
                </div>
              </div>

              {/* Colonne 2 */}
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 border border-border">
                  <Scan className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Facturation DGI</div>
                  <p className="text-xs text-text-muted">QR code e-MECeF officiel conforme à 100%</p>
                </div>
              </div>

              {/* Colonne 3 */}
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 border border-border">
                  <Wallet className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Banques &amp; MoMo</div>
                  <p className="text-xs text-text-muted">MTN MoMo, Moov Money et banques connectées</p>
                </div>
              </div>

              {/* Colonne 4 */}
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 border border-border">
                  <Headphones className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Support à Cotonou</div>
                  <p className="text-xs text-text-muted">Accompagnement humain et démarrage en 48h</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. SECTION GRAND SHOWCASE INTERACTIF : FICHES DE PAIE & ÉQUIPE ── */}
        <section className="w-full py-16 lg:py-24 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Titre & Sous-titre de la section */}
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink tracking-tight mb-3">
                Éditez vos fiches de paie en un clin d&apos;œil
              </h2>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                La paie de vos collaborateurs et de vos dirigeants n&apos;a jamais été aussi limpide. Vos cotisations sociales sont exactes au franc CFA près.
              </p>
            </div>

            {/* Grille 2 Colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Colonne gauche : Maquette Cartes Empilées & SVG ANIMÉ STRATÉGIQUE N°2 (Moteur Salarial & Pièces qui tombent) */}
              <div className="lg:col-span-6 flex flex-col items-center relative">
                <div className="w-full max-w-md relative">
                  {/* Carte active au premier plan (Mois : Mars 2026) */}
                  <div className="w-full bg-background rounded-2xl p-6 border-2 border-primary shadow-xs relative z-10">
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-ink">
                          AT
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-ink">Alain T. (Directeur Général)</h4>
                          <span className="text-xs text-text-muted">SARL Innov Bénin • Cotonou</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-success-deep flex items-center gap-1 bg-success/20 px-2.5 py-1 rounded">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> CNSS Prêt
                      </span>
                    </div>

                    {/* Lignes du décompte */}
                    <div className="py-4 space-y-2.5 text-xs font-mono border-b border-border">
                      <div className="flex justify-between text-text-muted">
                        <span>Salaire brut conventionnel</span>
                        <span className="font-medium text-ink">850 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Retenue IPTS (Barème Bénin)</span>
                        <span className="text-error font-medium">- 75 400 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Cotisation CNSS salarié (3,6%)</span>
                        <span className="text-error font-medium">- 30 600 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>VPS patronale (4%) calculée</span>
                        <span className="text-ink font-medium">34 000 FCFA</span>
                      </div>
                    </div>

                    {/* Résultat Net Total */}
                    <div className="pt-4 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-text-muted">Net à virer</div>
                        <div className="text-xl font-bold text-ink font-mono tabular-nums">744 000 FCFA</div>
                      </div>
                      <button
                        type="button"
                        className="bg-primary hover:bg-primary-hover text-ink text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </button>
                    </div>

                    {/* ── SVG ANIMÉ STRATÉGIQUE N°2 : ENGRENAGES SOCIAUX & PIÈCES D'ÉCONOMIE EN MOUVEMENT ── */}
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Roues dentées animées */}
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
                        <span className="text-[11px] text-text-muted font-mono">Barème CNSS &amp; IPTS 2026 à jour</span>
                      </div>

                      {/* Pièces qui tombent dans la réserve */}
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

                  {/* Carte d'autorité équipe réelle à Cotonou */}
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
                      <p className="text-xs sm:text-sm font-bold text-ink">Conçu avec des experts-comptables de l&apos;OECCA-Bénin</p>
                      <p className="text-xs text-text-muted">Paramétré selon le Code du Travail et les barèmes fiscaux béninois</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Accordéon Interactif 3 étapes */}
              <div className="lg:col-span-6 flex flex-col space-y-4">
                {/* Étape 1 */}
                <div
                  onClick={() => setActiveStep(1)}
                  className={`border rounded-2xl p-6 transition-all cursor-pointer ${
                    activeStep === 1
                      ? "border-primary bg-background shadow-xs"
                      : "border-border bg-background-secondary hover:bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full font-bold font-mono text-xs flex items-center justify-center ${
                          activeStep === 1 ? "bg-primary text-ink" : "bg-border text-text-muted"
                        }`}
                      >
                        1
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-ink">
                        Générez votre fiche de paie en 2 minutes
                      </h3>
                    </div>
                    {activeStep === 1 ? (
                      <ChevronUp className="w-5 h-5 text-ink" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                  {activeStep === 1 && (
                    <div className="mt-3 pl-10 text-text-muted text-sm leading-relaxed">
                      Renseignez le salaire brut ou le net souhaité. Ceilow applique automatiquement les barèmes de l&apos;IPTS, de la CNSS et de la VPS en vigueur au Bénin. Vos bulletins sont prêts sans aucun calcul manuel.
                    </div>
                  )}
                </div>

                {/* Étape 2 */}
                <div
                  onClick={() => setActiveStep(2)}
                  className={`border rounded-2xl p-6 transition-all cursor-pointer ${
                    activeStep === 2
                      ? "border-primary bg-background shadow-xs"
                      : "border-border bg-background-secondary hover:bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full font-bold font-mono text-xs flex items-center justify-center ${
                          activeStep === 2 ? "bg-primary text-ink" : "bg-border text-text-muted"
                        }`}
                      >
                        2
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-ink">
                        Déclarez à la CNSS sans ressaisie
                      </h3>
                    </div>
                    {activeStep === 2 ? (
                      <ChevronUp className="w-5 h-5 text-ink" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                  {activeStep === 2 && (
                    <div className="mt-3 pl-10 text-text-muted text-sm leading-relaxed">
                      En fin de mois, téléchargez l&apos;état récapitulatif prêt pour votre télédéclaration trimestrielle CNSS. Fini les tableaux croisés et les risques de redressement pour erreur de formule.
                    </div>
                  )}
                </div>

                {/* Étape 3 */}
                <div
                  onClick={() => setActiveStep(3)}
                  className={`border rounded-2xl p-6 transition-all cursor-pointer ${
                    activeStep === 3
                      ? "border-primary bg-background shadow-xs"
                      : "border-border bg-background-secondary hover:bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full font-bold font-mono text-xs flex items-center justify-center ${
                          activeStep === 3 ? "bg-primary text-ink" : "bg-border text-text-muted"
                        }`}
                      >
                        3
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-ink">
                        Vos bulletins archivés et accessibles partout
                      </h3>
                    </div>
                    {activeStep === 3 ? (
                      <ChevronUp className="w-5 h-5 text-ink" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                  {activeStep === 3 && (
                    <div className="mt-3 pl-10 text-text-muted text-sm leading-relaxed">
                      Chaque collaborateur reçoit son bulletin sécurisé au format PDF. Vos archives restent stockées en toute confidentialité, consultables en un clic lors d&apos;un contrôle ou d&apos;un audit.
                    </div>
                  )}
                </div>

                {/* Bouton d'action de la section */}
                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-xs transition-all min-h-[48px]"
                  >
                    <span>Créer ma première fiche de paie</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. SECTION BANNIÈRE D'AUTORITÉ SOMBRE (Fond Ink) ── */}
        <section className="w-full bg-ink text-white py-20 border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            {/* Titre & Sous-titre */}
            <div className="text-center max-w-2xl mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-white tracking-tight mb-3">
                Avec Ceilow, votre gestion est entre de bonnes mains
              </h2>
              <p className="text-base text-white/70">
                Une technologie moderne pensée pour les réalités juridiques, comptables et fiscales du Bénin.
              </p>
            </div>

            {/* 5 Piliers Vectoriels épurés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 w-full">
              {/* Pilier 1 */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-4 text-primary">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Intuitif</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Prise en main immédiate en moins de 10 minutes, sans formation préalable.
                </p>
              </div>

              {/* Pilier 2 */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-4 text-primary">
                  <Headphones className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Disponible</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Une équipe d&apos;assistance basée à Cotonou joignable directement par appel et WhatsApp.
                </p>
              </div>

              {/* Pilier 3 */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-4 text-primary">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Tout compris</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Factures certifiées, suivi Mobile Money, déclarations d&apos;impôts et paie sur un seul compte.
                </p>
              </div>

              {/* Pilier 4 */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-4 text-primary">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Transparent</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Des tarifs clairs en Francs CFA, sans frais cachés ni engagement de durée.
                </p>
              </div>

              {/* Pilier 5 */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-4 text-success">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">100% Conforme</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Alignement strict avec la Direction Générale des Impôts (DGI) et la CNSS Bénin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. SECTION SPLIT-CALLOUT : TRÉSORERIE & COMPTABILITÉ AU JUSTE PRIX ── */}
        <section className="w-full py-16 lg:py-24 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-background-secondary border border-border rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Colonne gauche : Copie de valeur & CTA */}
              <div className="lg:col-span-6 flex flex-col items-start space-y-4">
                <h2 className="text-2xl sm:text-4xl font-bold font-clash text-ink tracking-tight">
                  Votre trésorerie et vos comptes au juste prix
                </h2>

                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Suivez vos recettes réelles, vos dépenses engagées et votre marge en temps réel. Rapprochez vos comptes MoMo et vos relevés bancaires en quelques secondes sans être comptable.
                </p>

                <div className="space-y-3 pt-2 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-ink font-bold text-xs">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm text-ink font-medium">
                      Solde unifié banques (BOA, Ecobank, BIIC...) + MTN &amp; Moov Money
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-ink font-bold text-xs">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm text-ink font-medium">
                      Alertes intelligentes avant chaque échéance de déclaration fiscale
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/tarifs"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm px-7 py-3.5 rounded-xl transition-all shadow-xs min-h-[48px]"
                  >
                    <span>Découvrir nos tarifs clairs</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>

              {/* Colonne droite : Tableau de bord & SVG ANIMÉ STRATÉGIQUE N°3 (Radar des Flux MoMo & Barres de Trésorerie) */}
              <div className="lg:col-span-6 bg-background p-6 rounded-2xl border border-border shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-text-muted">Évolution des Encaissements</span>
                    <div className="text-2xl font-bold text-ink font-mono tabular-nums">4 850 000 FCFA</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-deep bg-success/20 px-2.5 py-1 rounded">
                    <TrendingUp className="w-3.5 h-3.5" /> +18% ce mois
                  </span>
                </div>

                {/* ── SVG ANIMÉ STRATÉGIQUE N°3 : RADAR DE FLUX ENCAISSEMENTS MOMO / BANQUES ── */}
                <div className="py-4 border-b border-border">
                  <div className="relative w-full h-24 bg-background-secondary rounded-xl border border-border flex items-center justify-between px-4 overflow-hidden">
                    {/* Onde radar pulsante en arrière-plan */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 100">
                      <circle cx="200" cy="50" r="18" fill="none" stroke="#FFD946" strokeWidth="2" className="pulse-wave" />
                      <circle cx="200" cy="50" r="36" fill="none" stroke="#FFD946" strokeWidth="1" opacity="0.25" />
                      {/* Lignes de flux en pointillés animés */}
                      <path d="M 60 50 L 180 50" stroke="#FFD946" strokeWidth="2" className="stream-flow" />
                      <path d="M 340 50 L 220 50" stroke="#332E29" strokeWidth="2" className="stream-flow" />
                    </svg>

                    {/* Source 1 : Mobile Money */}
                    <div className="flex items-center gap-2 z-10">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 text-ink flex items-center justify-center font-bold text-xs border border-primary/40">
                        MoMo
                      </div>
                      <div>
                        <div className="text-xs font-bold text-ink">MTN &amp; Moov</div>
                        <div className="text-[10px] text-text-muted font-mono">72% des flux</div>
                      </div>
                    </div>

                    {/* Hub Central Ceilow */}
                    <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center z-10 shadow-xs border-2 border-primary">
                      <Wallet className="w-4 h-4 text-primary" />
                    </div>

                    {/* Source 2 : Banques */}
                    <div className="flex items-center gap-2 z-10">
                      <div>
                        <div className="text-xs font-bold text-ink text-right">Banques</div>
                        <div className="text-[10px] text-text-muted font-mono text-right">28% virements</div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-ink/10 text-ink flex items-center justify-center font-bold text-xs border border-border">
                        <Landmark className="w-4 h-4 text-ink" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graphique à barres verticales mensuelles */}
                <div className="pt-5 pb-2">
                  <div className="flex items-end justify-between h-36 px-2 gap-3">
                    {/* Oct */}
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-ink rounded-t-sm transition-all" style={{ height: "45%" }} />
                      <span className="text-xs text-text-muted font-mono">Oct</span>
                    </div>
                    {/* Nov */}
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-primary rounded-t-sm transition-all" style={{ height: "60%" }} />
                      <span className="text-xs text-text-muted font-mono">Nov</span>
                    </div>
                    {/* Déc */}
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-ink rounded-t-sm transition-all" style={{ height: "85%" }} />
                      <span className="text-xs text-text-muted font-mono">Déc</span>
                    </div>
                    {/* Jan */}
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-primary rounded-t-sm transition-all" style={{ height: "70%" }} />
                      <span className="text-xs text-text-muted font-mono">Jan</span>
                    </div>
                    {/* Fév */}
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-ink rounded-t-sm transition-all" style={{ height: "78%" }} />
                      <span className="text-xs text-text-muted font-mono">Fév</span>
                    </div>
                    {/* Mar (En cours) */}
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-primary rounded-t-sm shadow-xs" style={{ height: "95%" }} />
                      <span className="text-xs font-bold text-ink font-mono">Mar</span>
                    </div>
                  </div>
                </div>

                {/* Légende du graphique & Statut du rapprochement */}
                <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-ink font-medium">
                      <span className="w-3 h-3 rounded-xs bg-primary" /> 72% MoMo
                    </span>
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <span className="w-3 h-3 rounded-xs bg-ink" /> 28% Virements
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-success-deep font-semibold bg-success/20 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Rapprochement à jour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. SECTION PREUVE SOCIALE & TÉMOIGNAGES DIRIGEANTS (Fond Ink) ── */}
        <section className="w-full bg-ink text-white py-20 border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            {/* Picto calendrier SVG sans badge superflu */}
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

            {/* Titre & Sous-titre */}
            <h2 className="text-3xl sm:text-4xl font-bold font-clash text-white tracking-tight text-center mb-3">
              Plus de 50 entreprises nous font confiance au quotidien
            </h2>
            <p className="text-base text-white/70 text-center max-w-2xl mb-12">
              Des dirigeants de SARL, SAS, agences et commerces racontent leur passage à Ceilow.
            </p>

            {/* 3 Cartes Témoignages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Carte 1 */}
              <div className="bg-background text-ink p-7 rounded-2xl flex flex-col justify-between shadow-xs border border-border">
                <div>
                  <div className="flex items-center gap-1 text-primary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-text-muted italic leading-relaxed mb-6">
                    « La génération des factures DGI était un cauchemar au quotidien avec nos anciens logiciels lents. Avec Ceilow, le QR code sort en 3 secondes. Mes clients reçoivent leurs factures immédiatement sur WhatsApp ou par e-mail. »
                  </p>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-ink">Alain T.</div>
                    <div className="text-xs text-text-muted">Conseil &amp; Services • SASU, Cotonou</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-success-deep" />
                </div>
              </div>

              {/* Carte 2 */}
              <div className="bg-background text-ink p-7 rounded-2xl flex flex-col justify-between shadow-xs border border-border">
                <div>
                  <div className="flex items-center gap-1 text-primary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-text-muted italic leading-relaxed mb-6">
                    « Nous avons connecté nos comptes MTN MoMo pro et notre compte bancaire. Toutes les recettes de nos boutiques sont automatiquement classées. En fin de mois, le point de TVA est prêt sans aucune nuit blanche. »
                  </p>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-ink">Gaspard D.</div>
                    <div className="text-xs text-text-muted">Négoce &amp; Distribution • SARL, Ganhi</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-success-deep" />
                </div>
              </div>

              {/* Carte 3 */}
              <div className="bg-background text-ink p-7 rounded-2xl flex flex-col justify-between shadow-xs border border-border">
                <div>
                  <div className="flex items-center gap-1 text-primary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-text-muted italic leading-relaxed mb-6">
                    « Je n&apos;ai aucune formation comptable. Ceilow m&apos;a permis d&apos;éditer les fiches de paie de mes 4 collaborateurs et d&apos;être parfaitement en règle avec la CNSS sans faire appel à un cabinet externe coûteux. »
                  </p>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-ink">Charles B.</div>
                    <div className="text-xs text-text-muted">Agence Digitale • ETS, Abomey-Calavi</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-success-deep" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. SECTION BANNIÈRE PRÉ-FOOTER LIFESTYLE (Chaleureuse & Sans Badge Flottant) ── */}
        <section className="w-full py-16 lg:py-24 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-background-secondary border border-border rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Colonne gauche : Copie & CTAs (7 colonnes) */}
              <div className="lg:col-span-7 p-8 lg:p-14 flex flex-col items-start space-y-5">
                <h2 className="text-2xl sm:text-4xl font-bold font-clash text-ink tracking-tight">
                  Prêt à reprendre le contrôle de votre gestion ?
                </h2>

                <p className="text-base text-text-muted max-w-lg leading-relaxed">
                  Rejoignez plus de 50 entrepreneurs béninois qui gagnent du temps chaque jour sur leurs factures, leur paie et leurs déclarations.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-xs transition-all min-h-[48px]"
                  >
                    <span>Démarrer gratuitement</span>
                  </Link>

                  <Link
                    href="/accompagnement"
                    className="inline-flex items-center justify-center border border-border bg-background hover:bg-background-secondary text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all min-h-[48px]"
                  >
                    <span>Réserver un échange</span>
                  </Link>
                </div>

                <div className="pt-1 flex items-center gap-2 text-text-muted text-xs">
                  <CheckCircle2 className="w-4 h-4 text-success-deep" />
                  <span>Essai de 14 jours sans engagement — Aucune carte bancaire requise</span>
                </div>
              </div>

              {/* Colonne droite : Photo lifestyle soignée sans badges superflus (5 colonnes) */}
              <div className="lg:col-span-5 h-full relative min-h-[320px] flex items-center justify-center p-6 lg:p-8">
                <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-border">
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

        {/* ── 8. SECTION GRILLE DES 6 PILIERS FONCTIONNELS ── */}
        <section className="w-full py-16 lg:py-24 bg-background-secondary">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête de la grille */}
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink tracking-tight mb-3">
                Tout ce dont vous avez besoin pour piloter votre entreprise
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Chaque module a été forgé pour éliminer les frictions administratives rencontrées par les PME au Bénin.
              </p>
            </div>

            {/* Grille des 6 Cartes Piliers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pilier 1 : Facturation certifiée */}
              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-ink flex items-center justify-center mb-5 border border-primary/30">
                    <Receipt className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Facturation certifiée</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Devis, acomptes, factures d&apos;avoir et factures de vente avec QR code officiel e-MECeF généré instantanément.
                  </p>
                </div>
                <Link
                  href="/facturation"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  <span>Explorer la facturation</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
              </div>

              {/* Pilier 2 : Trésorerie & Mobile Money */}
              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-ink flex items-center justify-center mb-5 border border-primary/30">
                    <Wallet className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Trésorerie &amp; Mobile Money</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Suivi en direct de vos comptes MTN MoMo, Moov Money et comptes bancaires. Rapprochement automatique des encaissements.
                  </p>
                </div>
                <Link
                  href="/comptabilite"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  <span>Explorer la trésorerie</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
              </div>

              {/* Pilier 3 : Paie & Déclarations sociales */}
              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-ink flex items-center justify-center mb-5 border border-primary/30">
                    <UserCheck className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Paie &amp; Déclarations sociales</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Édition des bulletins de paie de l&apos;équipe, décompte IPTS, cotisations CNSS et VPS en stricte conformité avec le code du travail.
                  </p>
                </div>
                <Link
                  href="/paie"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  <span>Explorer la paie</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
              </div>

              {/* Pilier 4 : Dépenses & Reçus scannés */}
              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-ink flex items-center justify-center mb-5 border border-primary/30">
                    <Scan className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Dépenses &amp; Reçus scannés</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Prenez en photo vos factures d&apos;achats depuis votre smartphone. Les montants et taxes sont extraits sans ressaisie manuelle.
                  </p>
                </div>
                <Link
                  href="/documents"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  <span>Explorer les achats</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
              </div>

              {/* Pilier 5 : Déclarations fiscales à l'avance */}
              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-ink flex items-center justify-center mb-5 border border-primary/30">
                    <Calendar className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Déclarations fiscales à l&apos;avance</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Calcul automatisé de votre TVA brute et déductible. Alertes programmées avant le 10 de chaque mois pour éviter les pénalités.
                  </p>
                </div>
                <Link
                  href="/tva"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  <span>Explorer la fiscalité</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
              </div>

              {/* Pilier 6 : Clôture annuelle sans panique */}
              <div className="bg-background p-7 rounded-2xl border border-border hover:border-primary transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-ink flex items-center justify-center mb-5 border border-primary/30">
                    <Layers className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">Clôture annuelle sans panique</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Comptes de résultat, balance générale et états financiers prêts pour votre expert-comptable ou vos partenaires financiers.
                  </p>
                </div>
                <Link
                  href="/comptabilite"
                  className="text-sm text-ink font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  <span>Explorer la comptabilité</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
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
