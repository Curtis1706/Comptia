"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FeaturesEight } from "@/components/landing/FeaturesEight";
import { ShowcaseSections } from "@/components/landing/ShowcaseSections";
import {
  FileText,
  CreditCard,
  BookOpen,
  Receipt,
  Users,
  TrendingUp,
  Building2,
  Command,
  BellRing,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Check,
  TrendingDown,
  DollarSign,
  Headphones,
  FileCheck2,
  Lock,
  Star,
  Menu,
  X,
} from "lucide-react";

export default function LandingView() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-ink selection:bg-primary selection:text-ink font-sans">
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link
              href="/"
              className="flex items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg min-h-[44px]"
              aria-label="Ceilow Accueil"
            >
              <Image
                src="/logo/ceilow_web_sombre.svg"
                alt="Ceilow"
                width={130}
                height={32}
                className="h-7 sm:h-8 w-auto"
                priority
              />
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-muted-foreground">
              <a className="hover:text-ink transition-colors py-1" href="#produit">
                Produit
              </a>
              <a className="hover:text-ink transition-colors py-1" href="#fonctionnalites">
                Fonctionnalités
              </a>
              <a className="hover:text-ink transition-colors py-1" href="#tarifs">
                Tarifs
              </a>
              <a className="hover:text-ink transition-colors py-1" href="#engagements">
                Engagements
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-[14px] font-semibold text-ink hover:text-muted-foreground px-3 py-2 min-h-[44px] items-center transition-colors hidden sm:inline-flex"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center justify-center text-[14px] font-semibold text-ink bg-primary hover:brightness-95 px-5 py-2.5 rounded-xl transition-all shadow-sm min-h-[44px]"
            >
              Démarrer gratuitement
            </Link>
            <Link
              href="/register"
              className="sm:hidden inline-flex items-center justify-center text-xs font-semibold text-ink bg-primary hover:brightness-95 px-3 py-2 rounded-lg transition-all shadow-sm min-h-[44px]"
            >
              Démarrer
            </Link>
            <button
              type="button"
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-ink rounded-lg hover:bg-background-secondary focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 pt-4 pb-6 space-y-4 shadow-lg">
            <nav className="flex flex-col gap-1 text-base font-medium text-ink">
              <a
                className="hover:text-ink hover:bg-background-secondary transition-colors min-h-[44px] flex items-center px-3 rounded-lg"
                href="#produit"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produit
              </a>
              <a
                className="hover:text-ink hover:bg-background-secondary transition-colors min-h-[44px] flex items-center px-3 rounded-lg"
                href="#fonctionnalites"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a
                className="hover:text-ink hover:bg-background-secondary transition-colors min-h-[44px] flex items-center px-3 rounded-lg"
                href="#tarifs"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tarifs
              </a>
              <a
                className="hover:text-ink hover:bg-background-secondary transition-colors min-h-[44px] flex items-center px-3 rounded-lg"
                href="#engagements"
                onClick={() => setMobileMenuOpen(false)}
              >
                Engagements
              </a>
            </nav>
            <div className="pt-3 border-t border-border flex flex-col gap-2.5">
              <Link
                className="min-h-[44px] flex items-center justify-center text-sm font-semibold text-ink bg-primary hover:brightness-95 px-4 py-2.5 rounded-xl transition-all shadow-sm text-center"
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                Démarrer gratuitement
              </Link>
              <Link
                className="min-h-[44px] flex items-center justify-center text-sm font-semibold text-ink border border-border hover:bg-background-secondary px-4 py-2.5 rounded-xl transition-colors text-center"
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Se connecter à mon espace
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* ── 1. HERO SECTION ─────────────────────────────────────────────── */}
        <section className="relative w-full pt-10 sm:pt-14 md:pt-20 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Centered H1 (Strictly 2 lines on desktop/tablet, clean non-broken wrap on mobile) */}
          <h1 className="font-display text-[22px] sm:text-3xl md:text-[38px] lg:text-[46px] xl:text-[50px] font-bold text-ink max-w-6xl mx-auto tracking-tight leading-[1.25] sm:leading-[1.2]">
            <span className="block md:whitespace-nowrap">Votre comptabilité, vos factures et votre TVA,</span>
            <span className="block mt-1 sm:mt-2 md:whitespace-nowrap">
              <span className="bg-primary text-ink px-2.5 sm:px-3 py-0.5 rounded-md sm:rounded-lg inline-block">
                gérées automatiquement au Bénin.
              </span>
            </span>
          </h1>

          {/* Centered Subtitle */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-1 sm:px-0">
            Ceilow automatise vos factures certifiées e-MECeF, vos déclarations fiscales et votre suivi de trésorerie en FCFA. Pensé pour les dirigeants, PME et indépendants au Bénin.
          </p>

          {/* Centered CTAs */}
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-ink font-semibold text-[15px] sm:text-base hover:brightness-95 transition-all shadow-sm active:scale-95"
            >
              <span>Souscrire</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:contact@ceilow.bj?subject=Demande%20de%20d%C3%A9monstration%20Ceilow"
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-background border border-border text-ink font-semibold text-[15px] sm:text-base hover:bg-background-secondary transition-all"
            >
              Demander une démo
            </a>
          </div>

          {/* Browser Mockup (Inspired by SaaS Template, Clean White & Bordered) */}
          <div className="mt-14 w-full max-w-5xl mx-auto rounded-2xl border border-border bg-background shadow-xl shadow-ink/5 overflow-hidden text-left relative">
            {/* Browser Top Bar */}
            <div className="bg-background-secondary border-b border-border px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-error"></span>
                  <span className="w-3 h-3 rounded-full bg-warning"></span>
                  <span className="w-3 h-3 rounded-full bg-success"></span>
                </div>
                <div className="flex items-center gap-2 pl-3 text-xs font-mono text-muted-foreground border-l border-border">
                  <span className="font-semibold text-ink">app.ceilow.bj</span>
                  <span className="text-border">/</span>
                  <span className="bg-background px-2 py-0.5 rounded border border-border text-ink">
                    Bénin Entreprise SARL
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-success/20 border border-success/40 text-success-deep px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-deep"></span>
                  e-MECeF Certifié DGI
                </span>
                <span className="hidden sm:inline text-xs font-medium px-2 py-0.5 bg-background rounded border border-border text-muted-foreground font-mono">
                  Conforme normes béninoises
                </span>
              </div>
            </div>

            {/* Internal Dashboard View */}
            <div className="p-5 sm:p-6 space-y-6 bg-background">
              {/* 3 KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* KPI 1: CA */}
                <div className="bg-background-secondary border border-border rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Chiffre d&apos;Affaires
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-ink">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-xl font-bold font-mono text-ink tabular-nums">28 450 000 FCFA</div>
                      <div className="text-xs font-medium text-success-deep flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+18.4% ce trimestre</span>
                      </div>
                    </div>
                    <svg className="w-20 h-8" viewBox="0 0 80 32" fill="none" aria-hidden="true">
                      <path d="M2 28 C 15 26, 25 18, 40 14 C 55 10, 65 6, 78 2" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* KPI 2: Charges */}
                <div className="bg-background-secondary border border-border rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dépenses d&apos;Exploitation
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-ink">
                      <Receipt className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-xl font-bold font-mono text-ink tabular-nums">14 120 000 FCFA</div>
                      <div className="text-xs font-medium text-success-deep flex items-center gap-1 mt-1">
                        <TrendingDown className="w-3 h-3" />
                        <span>-4.2% ce mois</span>
                      </div>
                    </div>
                    <svg className="w-20 h-8" viewBox="0 0 80 32" fill="none" aria-hidden="true">
                      <path d="M2 6 C 20 8, 35 22, 50 18 C 65 14, 72 26, 78 28" stroke="hsl(var(--ink))" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* KPI 3: Trésorerie */}
                <div className="bg-background-secondary border border-border rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Trésorerie Disponible
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-ink">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-xl font-bold font-mono text-ink tabular-nums">9 800 000 FCFA</div>
                      <div className="text-xs font-medium text-success-deep flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12.5% vs mois précédent</span>
                      </div>
                    </div>
                    <svg className="w-20 h-8" viewBox="0 0 80 32" fill="none" aria-hidden="true">
                      <path d="M2 24 C 20 22, 35 12, 50 14 C 65 16, 70 8, 78 4" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Cashflow Chart + VAT Summary Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 border border-border rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div>
                      <h3 className="text-sm font-semibold text-ink font-display">
                        Flux d&apos;encaissements et dépenses
                      </h3>
                      <p className="text-xs text-muted-foreground">Suivi financier temps réel en FCFA</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5 text-ink font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Entrées
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-full bg-border"></span> Sorties
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-40 pt-4">
                    <svg className="w-full h-full" viewBox="0 0 520 140" preserveAspectRatio="none" aria-hidden="true">
                      <line stroke="hsl(var(--border))" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="520" y1="20" y2="20" />
                      <line stroke="hsl(var(--border))" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="520" y1="70" y2="70" />
                      <line stroke="hsl(var(--border))" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="520" y1="120" y2="120" />
                      <polygon fill="hsl(var(--primary))" fillOpacity="0.2" points="0,110 45,100 90,92 135,85 180,72 225,75 270,55 315,48 360,35 405,30 450,32 520,12 520,135 0,135" />
                      <polyline fill="none" stroke="hsl(var(--muted-foreground))" strokeDasharray="4,3" strokeWidth="1.8" points="0,125 45,115 90,105 135,95 180,90 225,95 270,75 315,70 360,65 405,60 450,55 520,50" />
                      <polyline fill="none" stroke="hsl(var(--ink))" strokeWidth="2.5" strokeLinecap="round" points="0,110 45,100 90,92 135,85 180,72 225,75 270,55 315,48 360,35 405,30 450,32 520,12" />
                      <circle cx="520" cy="12" fill="hsl(var(--primary))" r="4.5" stroke="hsl(var(--ink))" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-muted-foreground pt-2 border-t border-border">
                    <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span><span>Juil</span><span>Août</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
                  </div>
                </div>

                {/* VAT Status Card */}
                <div className="border border-border rounded-xl p-5 flex flex-col justify-between bg-background-secondary">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <span>Déclarations DGI Bénin</span>
                      <span className="w-5 h-5 rounded-full bg-success/30 text-success-deep flex items-center justify-center font-bold text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <h4 className="font-display font-semibold text-base text-ink mt-2">
                      TVA du mois en cours
                    </h4>
                    <p className="text-xs text-muted-foreground">Calculée automatiquement selon le taux légal 18%</p>

                    <div className="mt-4 bg-background p-3.5 rounded-lg border border-border space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">TVA Collectée :</span>
                        <span className="font-mono font-medium text-ink tabular-nums">3 420 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">TVA Déductible :</span>
                        <span className="font-mono font-medium text-ink tabular-nums">1 890 000 FCFA</span>
                      </div>
                      <div className="pt-2 border-t border-border flex justify-between text-xs font-semibold">
                        <span className="text-ink">Net à reverser :</span>
                        <span className="font-mono text-success-deep tabular-nums font-bold">1 530 000 FCFA</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Télédéclaration DGI</span>
                    <span className="font-semibold text-success-deep">Prête • Échéance 15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. LOGOS ENTREPRISES BÉNINOISES ─────────────────────────────── */}
        <section className="w-full py-10 border-y border-border bg-background-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Des entreprises et indépendants béninois simplifient leur gestion avec Ceilow
            </p>
            <div className="mt-6 w-full flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 text-muted-foreground">
              <div className="font-display font-bold tracking-tight text-base text-ink">BÉNIN LOGISTIQUE</div>
              <div className="font-display font-semibold tracking-tight text-base text-ink">NovaConseil Cotonou</div>
              <div className="font-display font-bold tracking-wider text-sm uppercase text-ink">FIDUCIAIRE DU LITTORAL</div>
              <div className="font-display font-bold tracking-tight text-base text-ink">AGRIBÉNIN</div>
              <div className="font-display font-medium tracking-tight text-base text-ink">ATLANTIQUE SERVICES</div>
              <div className="font-display font-semibold tracking-tight text-sm text-ink">TRANSIT &amp; COMMERCE BÉNIN</div>
            </div>
          </div>
        </section>

        {/* ── 3. STATISTIQUES CLÉS ────────────────────────────────────────── */}
        <section className="w-full py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-background-secondary border border-border p-6 sm:p-8 rounded-xl">
              <div className="flex flex-col items-center text-center p-2">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-ink tabular-nums">500+</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">
                  Entreprises actives
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-2 border-l border-border">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-ink tabular-nums">98.7%</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">
                  Satisfaction client
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-2 border-t md:border-t-0 md:border-l border-border">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-ink tabular-nums">&lt; 2s</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">
                  Temps de calcul moyen
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-2 border-t md:border-t-0 border-l border-border">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-ink tabular-nums">99.9%</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">
                  Disponibilité plateforme
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. SECTION AUTOMATISATION & PHOTOS AUTHENTIQUES ─────────────── */}
        <section className="w-full py-20 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-ink max-w-3xl tracking-tight">
              Gagnez des heures chaque mois sur votre gestion
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Une solution tout-en-un pour facturer, synchroniser vos comptes et préparer vos obligations fiscales. Vous éliminez les saisies manuelles et gardez le contrôle total de vos finances.
            </p>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-ink font-semibold text-sm hover:brightness-95 transition-all shadow-sm gap-2"
              >
                <span>Créer un compte gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Authenticity Grid */}
            <div className="mt-14 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
              {/* Left Photo & Real Case */}
              <div className="lg:col-span-6 space-y-4">
                <div className="rounded-xl overflow-hidden border border-border bg-background-secondary">
                  <img
                    className="w-full h-80 object-cover object-center"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkmSMjnCev0X_R2nJOkmaj6knAf6_fOWAa-1YPKJVxzJa3eVhTkmtDtotESf9CbsyvSh9Wz5q7oyZrsieOHct3WEfDyyS_9PQMmXSa41cgdYzTK8ZbVKHhQXS8qT4iDbZO9W8Eq2j8xF-_KxkiW4Y7LcQ--K_8kQLhhsX8ZJOo_uT4gqo9WcfSnaVKP7_HcAZ7dwzhf0XiCURzr19VuzrENWcZKPEvTYRdVQBLL0Vt-eIVBoLhrgZ0"
                    alt="Équipe comptable et financière béninoise à Cotonou"
                  />
                  <div className="p-4 bg-background border-t border-border flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                        Cas d&apos;usage réel • Entreprise béninoise
                      </div>
                      <div className="text-sm font-semibold font-display text-ink">
                        Bilan mensuel et facturation clôturés en 35 minutes
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-success/20 text-success-deep rounded border border-success/40">
                      Conforme e-MECeF
                    </span>
                  </div>
                </div>

                {/* KPI Metric row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-background-secondary border border-border rounded-xl text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Taux Régularité</span>
                    <span className="text-base font-bold font-mono text-ink tabular-nums mt-0.5 block">99.2%</span>
                  </div>
                  <div className="p-3 bg-background-secondary border border-border rounded-xl text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Facturé ce mois</span>
                    <span className="text-base font-bold font-mono text-ink tabular-nums mt-0.5 block">4,85M FCFA</span>
                  </div>
                  <div className="p-3 bg-background-secondary border border-border rounded-xl text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Déclarations DGI</span>
                    <span className="text-base font-bold font-mono text-success-deep tabular-nums mt-0.5 block">100% à jour</span>
                  </div>
                  <div className="p-3 bg-background-secondary border border-border rounded-xl text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Factures e-MECeF</span>
                    <span className="text-base font-bold font-mono text-ink tabular-nums mt-0.5 block">142 émises</span>
                  </div>
                </div>
              </div>

              {/* Right: Activity Chart & Banking direct preview */}
              <div className="lg:col-span-6 bg-background-secondary border border-border p-6 rounded-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Activité Hebdomadaire
                    </span>
                    <div className="text-2xl font-bold font-display text-ink mt-0.5">180 opérations</div>
                    <span className="text-xs font-semibold text-success-deep inline-flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      Rapprochement automatique fluide
                    </span>
                  </div>
                  <div className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-ink">
                    Semaine en cours
                  </div>
                </div>

                {/* CSS Bars Chart */}
                <div className="bg-background border border-border p-4 rounded-xl">
                  <div className="h-36 flex items-end justify-between gap-3 pt-4 px-2">
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-border rounded-t" style={{ height: "45%" }}></div>
                      <span className="text-[11px] font-mono text-muted-foreground">Lun</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-border rounded-t" style={{ height: "60%" }}></div>
                      <span className="text-[11px] font-mono text-muted-foreground">Mar</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-border rounded-t" style={{ height: "52%" }}></div>
                      <span className="text-[11px] font-mono text-muted-foreground">Mer</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-primary rounded-t" style={{ height: "90%" }}></div>
                      <span className="text-[11px] font-mono font-semibold text-ink">Jeu</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-primary rounded-t" style={{ height: "78%" }}></div>
                      <span className="text-[11px] font-mono text-muted-foreground">Ven</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-border rounded-t" style={{ height: "25%" }}></div>
                      <span className="text-[11px] font-mono text-muted-foreground">Sam</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-border/60 rounded-t" style={{ height: "12%" }}></div>
                      <span className="text-[11px] font-mono text-muted-foreground">Dim</span>
                    </div>
                  </div>
                </div>

                {/* Secondary Image preview */}
                <div className="rounded-xl overflow-hidden border border-border bg-background flex items-center gap-4 p-3">
                  <Image
                    src="/images/finance-manager.jpg"
                    alt="Responsable administrative et financière"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-ink">Compatibilité bancaire béninoise</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Intégrez vos relevés BOA Bénin, Ecobank, BIIC, NSIA, BGFI et toutes banques opérant au Bénin.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. VITRINE IMMERSIVE CHOWCASE (STYLE CHARIOW) ────────────── */}
        <ShowcaseSections />

        {/* ── 6. GRILLE DES 12 FONCTIONNALITÉS (21ST.DEV FEATURES 8 BENTO) ── */}
        <FeaturesEight />

        {/* ── 7. ENGAGEMENTS CEILOW ───────────────────────────────────────── */}
        <section className="w-full py-20 bg-background-secondary border-t border-border" id="engagements">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink text-center tracking-tight">
              Plus qu&apos;un logiciel, un vrai partenaire au Bénin
            </h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
              <div className="bg-background border border-border p-8 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-ink">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-ink mt-6">Accompagnement Local</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Support réactif par téléphone et messagerie, guides pratiques et assistance pour configurer vos comptes et vos factures.
                </p>
              </div>

              <div className="bg-background border border-border p-8 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-ink">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-ink mt-6">Conformité DGI Garantie</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Respect scrupuleux des exigences fiscales de la DGI et de la CNSS, avec mises à jour automatiques à chaque évolution légale.
                </p>
              </div>

              <div className="bg-background border border-border p-8 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-ink">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-ink mt-6">Sécurité des Données</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Vos informations financières sont chiffrées de bout en bout, sauvegardées quotidiennement et protégées selon les normes bancaires.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. TÉMOIGNAGES ─────────────────────────────────────────────── */}
        <section className="w-full py-20 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink text-center tracking-tight">
              Ils nous font confiance
            </h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
              {/* Testimonial 1 */}
              <div className="bg-background-secondary border border-border p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm sm:text-base text-ink leading-relaxed">
                    &ldquo;La conformité des factures et le calcul de la TVA nous prenaient des jours entiers chaque fin de mois. Avec Ceilow, nos déclarations sont prêtes à l&apos;avance et nos factures partent directement.&rdquo;
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary font-bold text-ink flex items-center justify-center font-display text-sm">
                    FD
                  </div>
                  <div>
                    <div className="font-bold text-sm text-ink font-display">Fatima Dossou</div>
                    <div className="text-xs text-muted-foreground">Responsable Financière, Agro-alimentaire • Cotonou</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-background-secondary border border-border p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm sm:text-base text-ink leading-relaxed">
                    &ldquo;La clarté des écritures et la rigueur du lettrage nous ont convaincus. Nous recommandons désormais Ceilow à nos clients dirigeants qui veulent une gestion moderne et sans erreur.&rdquo;
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink text-white font-bold flex items-center justify-center font-display text-sm">
                    GA
                  </div>
                  <div>
                    <div className="font-bold text-sm text-ink font-display">Gilles Agossou</div>
                    <div className="text-xs text-muted-foreground">Expert-Comptable, Cabinet Conseil • Cotonou</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-background-secondary border border-border p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm sm:text-base text-ink leading-relaxed">
                    &ldquo;En tant que dirigeant, j&apos;ai enfin une vision nette de ma trésorerie disponible en FCFA. Le rapprochement avec nos banques locales se fait en quelques clics sans prise de tête.&rdquo;
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary font-bold text-ink flex items-center justify-center font-display text-sm">
                    MK
                  </div>
                  <div>
                    <div className="font-bold text-sm text-ink font-display">Marc Kouton</div>
                    <div className="text-xs text-muted-foreground">Directeur Général, Entreprise Logistique • Bénin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. TARIFS EN FCFA ───────────────────────────────────────────── */}
        <section className="w-full py-20 bg-background-secondary border-t border-border" id="tarifs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">
              Des tarifs clairs et transparents en FCFA
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Sans frais cachés, résiliable à tout moment, conçu pour s&apos;adapter à la taille de votre entreprise.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
              {/* Plan 1: Gratuit */}
              <div className="bg-background border border-border p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gratuit</span>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold font-mono text-ink tabular-nums">0</span>
                    <span className="text-sm font-semibold text-muted-foreground ml-2">FCFA / mois</span>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Idéal pour les indépendants qui débutent leur facturation.
                  </p>
                  <ul className="mt-6 space-y-3 text-xs text-ink">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Jusqu&apos;à 10 factures certifiées par mois
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Devis et avoirs en PDF
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Export simple des données
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-4 h-4 text-center">✕</span>
                      Déclarations TVA automatisées
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    href="/register"
                    className="w-full inline-flex items-center justify-center py-2.5 rounded-xl border border-border text-ink font-semibold text-xs hover:bg-background-secondary transition-all"
                  >
                    Commencer gratuitement
                  </Link>
                </div>
              </div>

              {/* Plan 2: Pro (Recommandé) */}
              <div className="bg-background border-2 border-primary p-8 rounded-xl flex flex-col justify-between relative shadow-sm">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-ink text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Recommandé
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink font-bold">Pro</span>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold font-mono text-ink tabular-nums">15 000</span>
                    <span className="text-sm font-semibold text-muted-foreground ml-2">FCFA / mois</span>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Pour les PME actives qui souhaitent automatiser factures, TVA et comptes.
                  </p>
                  <ul className="mt-6 space-y-3 text-xs text-ink">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Factures e-MECeF illimitées
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Rapprochement bancaire assisté
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Calcul automatique de la TVA mensuelle DGI
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Journaux officiels et documents conformes
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Gestion de la paie jusqu&apos;à 10 salariés
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    href="/register"
                    className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-primary text-ink font-semibold text-xs hover:brightness-95 transition-all shadow-sm"
                  >
                    Essai gratuit 14 jours
                  </Link>
                </div>
              </div>

              {/* Plan 3: Entreprise */}
              <div className="bg-background border border-border p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entreprise &amp; Cabinet</span>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold font-display text-ink">Sur devis</span>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Pour les holdings, cabinets d&apos;expertise et grandes structures.
                  </p>
                  <ul className="mt-6 space-y-3 text-xs text-ink">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Gestion multi-entreprises centralisée
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Volume illimité d&apos;écritures et collaborateurs
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Interlocuteur dédié et accompagnement sur site
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success-deep flex-shrink-0" />
                      Intégration sur-mesure de vos outils existants
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <a
                    href="mailto:contact@ceilow.bj"
                    className="w-full inline-flex items-center justify-center py-2.5 rounded-xl border border-border text-ink font-semibold text-xs hover:bg-background-secondary transition-all"
                  >
                    Contacter notre équipe
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10. BANNIÈRE CTA FINALE (LIGNES TOPOGRAPHIQUES DORÉES LUMINEUSES) ── */}
        <section className="w-full py-16 sm:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-ink rounded-2xl sm:rounded-3xl py-14 sm:py-20 px-6 sm:px-12 text-center text-white border border-border/30 overflow-hidden shadow-2xl">
              {/* Lueur et lignes dorées lumineuses en background (subtiles, brillantes, sans encombrer) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                {/* Halo lumineux doré central qui fait briller l'espace */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[280px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1200 480"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      <stop offset="25%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
                      <stop offset="75%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="goldSoft" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      <stop offset="30%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                      <stop offset="55%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                      <stop offset="85%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                    <filter id="goldShineFilter" x="-10%" y="-10%" width="120%" height="120%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Vague supérieure dorée */}
                  <path
                    d="M-50 130 C220 50, 480 180, 750 95 C980 25, 1120 150, 1250 100"
                    stroke="url(#goldGlow)"
                    strokeWidth="1.2"
                    filter="url(#goldShineFilter)"
                  />
                  <path
                    d="M-50 170 C240 90, 500 220, 770 135 C1000 65, 1140 190, 1250 140"
                    stroke="url(#goldSoft)"
                    strokeWidth="0.8"
                  />

                  {/* Vague inférieure dorée */}
                  <path
                    d="M-50 350 C260 420, 540 300, 820 385 C1020 445, 1160 330, 1250 365"
                    stroke="url(#goldGlow)"
                    strokeWidth="1.2"
                    filter="url(#goldShineFilter)"
                  />
                  <path
                    d="M-50 310 C240 380, 520 260, 800 345 C1000 405, 1140 290, 1250 325"
                    stroke="url(#goldSoft)"
                    strokeWidth="0.8"
                  />
                </svg>
              </div>

              {/* Contenu de la bannière */}
              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                {/* Badge e-MECeF */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  <span>Prêt pour votre clôture e-MECeF</span>
                </div>

                {/* Titre */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white leading-tight">
                  Prêt à moderniser votre gestion financière ?
                </h2>

                {/* Sous-titre */}
                <p className="mt-4 text-sm sm:text-base md:text-lg text-border max-w-xl leading-relaxed">
                  Rejoignez les entreprises béninoises qui gèrent leur comptabilité, facturation et TVA depuis Ceilow.
                </p>

                {/* Boutons d'action */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-ink font-semibold text-[15px] hover:brightness-95 transition-all shadow-sm active:scale-95"
                  >
                    <span>Démarrer gratuitement</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="mailto:contact@ceilow.bj"
                    className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-ink border border-border text-white font-semibold text-[15px] hover:border-primary hover:text-primary transition-all shadow-sm"
                  >
                    <Headphones className="w-4 h-4 text-primary" />
                    <span>Parler à un expert</span>
                  </a>
                </div>

                {/* Puces de réassurance */}
                <div className="mt-8 pt-6 border-t border-border/20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-border">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Données sécurisées
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Conforme e-MECeF &amp; DGI
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Support en français inclus
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── 11. FOOTER SOBRE & ÉPURÉ ─────────────────────────────────────── */}
      <footer className="w-full bg-ink text-white border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-border/20">
            {/* Logo officiel sombre / jaune */}
            <div className="col-span-2 flex flex-col justify-start">
              <Link href="/" className="flex items-center focus:outline-none rounded-lg min-h-[44px] w-fit">
                <Image
                  src="/logo/ceilow_web_jaune.svg"
                  alt="Ceilow"
                  width={130}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <p className="mt-3 text-sm text-border max-w-sm leading-relaxed">
                Ceilow — La gestion financière, tout simplement.
              </p>
            </div>

            {/* Colonne 1: Produit */}
            <div className="flex flex-col gap-3 text-sm">
              <span className="font-semibold text-primary uppercase text-xs tracking-widest font-mono">
                Produit
              </span>
              <nav className="flex flex-col gap-2 text-border">
                <a className="hover:text-white transition-colors py-1" href="#produit">
                  Facturation
                </a>
                <a className="hover:text-white transition-colors py-1" href="#produit">
                  Rapprochement bancaire
                </a>
                <a className="hover:text-white transition-colors py-1" href="#produit">
                  Déclarations TVA
                </a>
                <a className="hover:text-white transition-colors py-1" href="#tarifs">
                  Tarifs
                </a>
              </nav>
            </div>

            {/* Colonne 2: Ressources */}
            <div className="flex flex-col gap-3 text-sm">
              <span className="font-semibold text-primary uppercase text-xs tracking-widest font-mono">
                Ressources
              </span>
              <nav className="flex flex-col gap-2 text-border">
                <a className="hover:text-white transition-colors py-1" href="#engagements">
                  Centre d&apos;aide
                </a>
                <a className="hover:text-white transition-colors py-1" href="#engagements">
                  Normes DGI &amp; e-MECeF
                </a>
                <a className="hover:text-white transition-colors py-1" href="#engagements">
                  Guides
                </a>
                <Link className="hover:text-white transition-colors py-1" href="/login">
                  Connexion Client
                </Link>
              </nav>
            </div>

            {/* Colonne 3: Entreprise & Légal */}
            <div className="flex flex-col gap-6 text-sm">
              <div className="flex flex-col gap-2.5">
                <span className="font-semibold text-primary uppercase text-xs tracking-widest font-mono">
                  Entreprise
                </span>
                <nav className="flex flex-col gap-2 text-border">
                  <a className="hover:text-white transition-colors py-1" href="#engagements">
                    À propos
                  </a>
                  <a className="hover:text-white transition-colors py-1" href="mailto:contact@ceilow.bj">
                    Contact
                  </a>
                </nav>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="font-semibold text-primary uppercase text-xs tracking-widest font-mono">
                  Légal
                </span>
                <nav className="flex flex-col gap-1.5 text-border text-xs">
                  <span className="hover:text-white transition-colors cursor-pointer py-0.5">Mentions légales</span>
                  <span className="hover:text-white transition-colors cursor-pointer py-0.5">Politique de confidentialité</span>
                  <span className="hover:text-white transition-colors cursor-pointer py-0.5">Conditions d&apos;utilisation</span>
                </nav>
              </div>
            </div>
          </div>

          {/* Copyright & Liens Réseaux Sociaux */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-border">
            <div>
              © 2025 Ceilow. Tous droits réservés.
            </div>
            {/* Social media links */}
            <div className="flex items-center gap-4 text-border">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
