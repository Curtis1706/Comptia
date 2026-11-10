"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ArrowRight,
  Calendar,
  ShieldCheck,
  CreditCard,
  Headphones,
  Receipt,
  ChevronDown,
  Check,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function TarifsPage() {
  // ── ÉTATS INTERACTIFS ──────────────────────────────────────────────
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "indep" | "pme" | "cabinet">("all");
  const [invoicesCount, setInvoicesCount] = useState(45);
  const [hoursSpent, setHoursSpent] = useState(14);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Calcul dynamique de rentabilité (Simulateur)
  const savedHours = (hoursSpent * 0.75).toFixed(1);
  const getRoiText = () => {
    if (invoicesCount > 80 || hoursSpent > 15) return "Rentabilisé en moins de 24 heures";
    if (invoicesCount > 30) return "Rentabilisé en moins de 3 jours";
    return "Rentabilisé en moins d'une semaine";
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // ── DONNÉES DE LA FAQ ──────────────────────────────────────────────
  const faqList = [
    {
      q: "Puis-je vraiment tester Ceilow sans payer et sans carte bancaire ?",
      a: "Absolument. Vous pouvez démarrer soit sur le Plan Gratuit (sans limite de durée, 10 factures e-MECeF par mois), soit activer 14 jours d'essai gratuit sur le Plan Pro. Aucun moyen de paiement ni carte bancaire n'est requis à l'inscription.",
    },
    {
      q: "Quels sont les moyens de paiement acceptés pour régler mon abonnement ?",
      a: "Nous prenons en charge l'ensemble des moyens de paiement usuels en République du Bénin : MTN Mobile Money, Moov Money, ainsi que les cartes bancaires internationales (Visa, Mastercard). Les règlements par virement bancaire local sont acceptés pour les abonnements annuels Entreprise.",
    },
    {
      q: "Suis-je engagé sur la durée ?",
      a: "Non. Nos abonnements mensuels sont sans aucun engagement. Vous pouvez suspendre ou résilier votre compte directement depuis vos paramètres en un clic, à n'importe quel moment, sans pénalité ni justification.",
    },
    {
      q: "Que se passe-t-il si je dépasse les 10 factures du Plan Gratuit ?",
      a: "Dès que vous atteignez le seuil mensuel de 10 factures normalisées, la plateforme vous invite à basculer vers le Plan Pro pour poursuivre votre facturation sans blocage. Vos données et factures antérieures restent quant à elles toujours accessibles.",
    },
    {
      q: "Les factures de mon abonnement Ceilow sont-elles déductibles de mes impôts au Bénin ?",
      a: "Oui, entièrement. Ceilow SAS est une société de droit béninois immatriculée au RCCM de Cotonou avec un IFU valide. Chaque paiement donne lieu à l'émission automatique d'une facture normalisée certifiée DGI e-MECeF, pleinement déductible de votre résultat fiscal.",
    },
    {
      q: "Comment fonctionne le tarif dégressif pour les cabinets comptables ?",
      a: "Nous proposons aux cabinets comptables un portail multi-entreprises avec tarif dégressif par paliers (3 à 5, 20, 50+ dossiers), permettant jusqu'à 50 % de remise sur le tarif unitaire mensuel.",
    },
    {
      q: "Mes données restent-elles accessibles si j'arrête mon abonnement ?",
      a: "Oui. Conformément aux règles APDP au Bénin et aux obligations OHADA, toutes vos données (écritures comptables, factures e-MECeF, reçus) restent exportables au format Excel, PDF ou FEC avant la fermeture de votre dossier.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-ink font-sans selection:bg-primary selection:text-ink">
      {/* 1. HEADER PUBLIC UNIFIÉ */}
      <PublicHeader className="sticky top-0 z-50" />

      <main className="flex-grow">
        <div className="flex flex-col w-full">
          
          {/* 2. HERO SECTION & CONTRÔLES DYNAMIQUES */}
          <section className="w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 flex flex-col items-center text-center max-w-5xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-4 block">
              Tarification directe en FCFA
            </span>

            {/* H1 Headline */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink max-w-4xl tracking-tight leading-tight mb-4">
              Des tarifs clairs en FCFA, pensés pour les entreprises au Bénin.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-text-muted max-w-2xl mb-8 leading-relaxed">
              Choisissez la formule adaptée à votre taille. Démarrez gratuitement ou testez le Plan Pro pendant 14 jours sans carte bancaire.
            </p>

            {/* Contrôles de filtrage & Toggle */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8 w-full max-w-3xl justify-center">
              {/* Filtre de profil d'entreprise */}
              <div className="flex flex-wrap items-center justify-center p-1 bg-background-secondary border border-border rounded-xl gap-1 max-w-full">
                <button
                  type="button"
                  onClick={() => setSelectedFilter("all")}
                  className={`px-3.5 min-h-[44px] py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === "all"
                      ? "bg-background text-ink shadow-xs border border-border"
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  Tous les profils
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("indep")}
                  className={`px-3.5 min-h-[44px] py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === "indep"
                      ? "bg-background text-ink shadow-xs border border-border"
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  Indépendants
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("pme")}
                  className={`px-3.5 min-h-[44px] py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === "pme"
                      ? "bg-background text-ink shadow-xs border border-border"
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  PME &amp; Commerces
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("cabinet")}
                  className={`px-3.5 min-h-[44px] py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === "cabinet"
                      ? "bg-background text-ink shadow-xs border border-border"
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  Cabinets
                </button>
              </div>

              {/* Toggle Fréquence (Mensuel vs Annuel) */}
              <div className="flex items-center gap-1 bg-background-secondary border border-border p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAnnual(false)}
                  className={`px-3.5 min-h-[44px] py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    !isAnnual
                      ? "bg-background text-ink shadow-xs border border-border"
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  Mensuel
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnual(true)}
                  className={`px-3.5 min-h-[44px] py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAnnual
                      ? "bg-background text-ink shadow-xs border border-border font-bold"
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  <span>Annuel</span>
                  <span className="text-xs font-bold text-success-deep">
                    (-2 mois)
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. GRILLE DES PLANS TARIFAIRES */}
          <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
            <div className={`grid grid-cols-1 gap-8 items-stretch ${selectedFilter === "all" ? "lg:grid-cols-3" : selectedFilter === "cabinet" ? "max-w-lg mx-auto" : "lg:grid-cols-2 max-w-4xl mx-auto"}`}>
              
              {/* PLAN 1 : GRATUIT */}
              {(selectedFilter === "all" || selectedFilter === "indep") && (
              <div className="flex flex-col bg-background border border-border rounded-2xl p-6 sm:p-8 justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="font-display text-xl font-bold text-ink">Plan Gratuit</span>
                    <span className="text-xs uppercase tracking-wider font-bold text-text-muted">
                      Démarrage
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-bold tabular-nums text-ink">0 FCFA</span>
                      <span className="text-xs text-text-muted">/ mois</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">Gratuit sans carte bancaire.</p>
                  </div>

                  <p className="text-xs text-ink/80 pb-3 mb-6 bg-background-secondary p-3 rounded-xl border border-border leading-relaxed">
                    L&apos;essentiel pour créer vos premières factures certifiées DGI sans frais.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span><strong>10 factures</strong> normalisées e-MECeF avec QR code par mois</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Recherche rapide de vos clients par numéro IFU</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Devis et bons de commande en PDF</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Export comptable de base (Excel / CSV)</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>1 utilisateur administrateur</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Aide en ligne</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/register"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-ink bg-background-secondary hover:bg-border/60 border border-border transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>Créer un compte</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-text-muted mt-2">Ouverture en 2 minutes</p>
                </div>
              </div>
              )}

              {/* PLAN 2 : PLAN PRO */}
              {(selectedFilter === "all" || selectedFilter === "indep" || selectedFilter === "pme") && (
              <div className="flex flex-col bg-background border-2 border-primary rounded-2xl p-6 sm:p-8 justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="font-display text-xl font-bold text-ink">Plan Pro</span>
                    <span className="text-xs uppercase tracking-wider font-bold text-ink">
                      Conseillé - TPE &amp; PME
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-bold tabular-nums text-ink">
                        {isAnnual ? "12 500 FCFA" : "15 000 FCFA"}
                      </span>
                      <span className="text-xs text-text-muted">/ mois</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      {isAnnual
                        ? "Facturé 150 000 FCFA / an (30 000 FCFA économisés)"
                        : "Facturé au mois, arrêt possible à tout moment"}
                    </p>
                  </div>

                  <p className="text-xs text-ink pb-3 mb-6 bg-primary/10 p-3 rounded-xl border border-primary/20 leading-relaxed font-medium">
                    Tout pour gérer votre activité : factures illimitées, suivi Mobile Money / banque et calcul de votre TVA avant le 10.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Factures certifiées DGI e-MECeF illimitées</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Suivi MTN MoMo, Moov Money &amp; banques locales</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Rapprochement bancaire guidé en 1 clic</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Calcul automatique de votre TVA avant le 10 du mois</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Comptabilité SYSCOHADA prête pour votre comptable</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Gestion de la paie (jusqu&apos;à <strong>10 salariés</strong>)</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Relances d&apos;impayés par SMS &amp; e-mail</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>5 accès collaborateurs inclus</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Support à Cotonou par WhatsApp &amp; téléphone</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/register"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-ink bg-primary hover:bg-primary-hover transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <span>Tester 14 jours</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-text-muted mt-2">
                    14 jours offerts - Sans carte bancaire - Sans engagement
                  </p>
                </div>
              </div>
              )}

              {/* PLAN 3 : PLAN ENTREPRISE & CABINET */}
              {(selectedFilter === "all" || selectedFilter === "pme" || selectedFilter === "cabinet") && (
              <div className="flex flex-col bg-background border border-border rounded-2xl p-6 sm:p-8 justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="font-display text-xl font-bold text-ink">Entreprise &amp; Cabinet</span>
                    <span className="text-xs uppercase tracking-wider font-bold text-text-muted">
                      Multi-sociétés
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-bold tabular-nums text-ink">Dès 45 000 FCFA</span>
                      <span className="text-xs text-text-muted">/ mois</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">Tarif dégressif selon le nombre de dossiers</p>
                  </div>

                  <p className="text-xs text-ink/80 pb-3 mb-6 bg-background-secondary p-3 rounded-xl border border-border leading-relaxed">
                    Conçu pour les groupes multi-entités et cabinets comptables : dossiers centralisés et accompagnement sur mesure.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Tout le Plan Pro en illimité</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Gestion multi-sociétés et vue consolidée</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Portail cabinet comptable multi-dossiers</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Salariés illimités pour la paie &amp; la CNSS</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Connexion directe à votre logiciel de caisse ou de gestion</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Formation de votre équipe à Cotonou ou Porto-Novo</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Interlocuteur dédié basé à Cotonou</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/pour-qui/cabinets-comptables"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-ink bg-background-secondary hover:bg-border/60 border border-border transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>Voir l&apos;offre cabinet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-text-muted mt-2">
                    Réponse sous 2 heures ouvrées - Devis adapté
                  </p>
                </div>
              </div>
              )}
            </div>
          </section>

          {/* ── 4. BANDEAU DE RÉASSURANCE & PAIEMENTS AU BÉNIN (4 COLONNES) ─── */}
          <section className="w-full bg-background-secondary border-y border-border py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-4 p-5 bg-background border border-border rounded-xl shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-ink shrink-0">
                  <CreditCard className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink mb-1">Paiement Mobile Local</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Règlement direct par MTN Mobile Money, Moov Money ou Carte bancaire (Visa/Mastercard).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-background border border-border rounded-xl shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-ink shrink-0">
                  <ShieldCheck className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink mb-1">Liberté Totale</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Aucun engagement de durée. Vous pouvez modifier, suspendre ou résilier votre offre en un clic.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-background border border-border rounded-xl shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-ink shrink-0">
                  <Receipt className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink mb-1">Facture DGI Déductible</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Votre abonnement fait l&apos;objet d&apos;une facture normalisée e-MECeF déductible de vos impôts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-background border border-border rounded-xl shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-ink shrink-0">
                  <Headphones className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink mb-1">Support à Cotonou</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Des spécialistes en gestion béninoise joignables immédiatement par WhatsApp et appel local.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. CALCULATRICE D'ÉCONOMIES INTERACTIVE */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 max-w-5xl mx-auto">
            <div className="bg-background border border-border rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted block">
                  Simulateur de rentabilité
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-3 mb-2">
                  Combien de temps Ceilow vous fait-il économiser ?
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Estimez le temps de travail administratif gagné chaque mois en automatisant votre gestion.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Sliders de réglage */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-semibold">
                      <label htmlFor="tarifs-invoices-range" className="text-ink">Factures émises par mois :</label>
                      <span className="font-mono tabular-nums text-ink font-bold">
                        {invoicesCount} factures
                      </span>
                    </div>
                    <input
                      id="tarifs-invoices-range"
                      type="range"
                      min={10}
                      max={300}
                      step={5}
                      value={invoicesCount}
                      onChange={(e) => setInvoicesCount(parseInt(e.target.value, 10))}
                      className="w-full accent-primary h-2 bg-background-secondary rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-text-muted mt-1">
                      <span>10 factures</span>
                      <span>300+ factures</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-semibold">
                      <label htmlFor="tarifs-hours-range" className="text-ink">Heures passées sur la gestion / mois :</label>
                      <span className="font-mono tabular-nums text-ink font-bold">
                        {hoursSpent} heures
                      </span>
                    </div>
                    <input
                      id="tarifs-hours-range"
                      type="range"
                      min={2}
                      max={30}
                      step={1}
                      value={hoursSpent}
                      onChange={(e) => setHoursSpent(parseInt(e.target.value, 10))}
                      className="w-full accent-primary h-2 bg-background-secondary rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-text-muted mt-1">
                      <span>2 heures</span>
                      <span>30 heures</span>
                    </div>
                  </div>

                  <div className="p-3 bg-background-secondary border border-border rounded-xl text-xs text-text-muted flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>
                      Inclut la facturation DGI e-MECeF, le suivi Mobile Money et le calcul automatique de votre TVA.
                    </span>
                  </div>
                </div>

                {/* Carte de résultat dynamique */}
                <div className="bg-background-secondary border border-border p-6 rounded-2xl flex flex-col justify-between h-full">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-text-muted font-bold mb-2">
                      Estimation mensuelle
                    </div>
                    <div className="space-y-3 my-4">
                      <div className="flex items-baseline justify-between bg-background p-3.5 rounded-xl border border-border gap-2">
                        <span className="text-xs text-text-muted">Temps économisé estimé :</span>
                        <span className="font-mono text-xl font-bold text-success-deep tabular-nums shrink-0">
                          ~{savedHours} h / mois
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between bg-background p-3.5 rounded-xl border border-border gap-2">
                        <span className="text-xs text-text-muted">Risque d&apos;oubli fiscal :</span>
                        <span className="font-bold text-xs text-success-deep shrink-0">
                          Alertes et contrôles actifs
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between bg-background p-3.5 rounded-xl border border-border gap-2">
                        <span className="text-xs text-text-muted">Rentabilité estimée :</span>
                        <span className="text-xs font-bold text-ink tabular-nums shrink-0">
                          {getRoiText()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/register"
                      className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-ink bg-primary hover:bg-primary-hover transition-colors shadow-xs text-center flex items-center justify-center min-h-[44px]"
                    >
                      Tester gratuitement
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. TABLEAU COMPARATIF DES FONCTIONNALITÉS */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
                Comparez les formules dans le détail
              </h2>
              <p className="text-xs sm:text-sm text-text-muted">
                Chaque formule répond aux obligations fiscales et comptables en République du Bénin.
              </p>
            </div>

            {/* Vue cartes empilées sous md (Mobile-First sans scroll horizontal) */}
            <div className="space-y-4 md:hidden">
              <div className="p-5 bg-background border border-border rounded-2xl space-y-2 text-xs">
                <div className="font-display font-bold text-base text-ink pb-2 border-b border-border">
                  Plan Gratuit (0 FCFA)
                </div>
                <p className="text-text-muted">10 factures e-MECeF DGI par mois, devis PDF, recherche client IFU, plan comptable SYSCOHADA, 1 utilisateur.</p>
              </div>
              <div className="p-5 bg-background border-2 border-primary rounded-2xl space-y-2 text-xs">
                <div className="font-display font-bold text-base text-ink pb-2 border-b border-border">
                  Plan Pro (12 500 FCFA / mois en annuel)
                </div>
                <p className="text-text-muted">Factures DGI illimitées, MTN MoMo / banques, rapprochement bancaire, calcul TVA du 10, paie jusqu&apos;à 10 salariés, accès comptable gratuit, 5 utilisateurs.</p>
              </div>
              <div className="p-5 bg-background border border-border rounded-2xl space-y-2 text-xs">
                <div className="font-display font-bold text-base text-ink pb-2 border-b border-border">
                  Entreprise &amp; Cabinet (Dès 45 000 FCFA / mois)
                </div>
                <p className="text-text-muted">Multi-sociétés, portail cabinet multi-dossiers, paie illimitée, connexion caisse/logiciel, formation à Cotonou ou Porto-Novo.</p>
              </div>
            </div>

            {/* Tableau complet Desktop/Tablette */}
            <div className="hidden md:block w-full bg-background border border-border rounded-2xl shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background-secondary border-b border-border">
                    <th className="py-4 px-6 text-xs font-bold text-ink uppercase tracking-wider w-2/5">
                      Fonctionnalités &amp; Services
                    </th>
                    <th className="py-4 px-4 text-xs font-bold text-ink text-center w-1/5">
                      <div>Gratuit</div>
                      <div className="font-mono text-[11px] font-normal text-text-muted">0 FCFA</div>
                    </th>
                    <th className="py-4 px-4 text-xs font-bold text-ink text-center w-1/5 bg-primary/10">
                      <div className="font-bold">Pro (Conseillé)</div>
                      <div className="font-mono text-[11px] font-bold text-ink">12 500 FCFA</div>
                    </th>
                    <th className="py-4 px-4 text-xs font-bold text-ink text-center w-1/5">
                      <div>Entreprise</div>
                      <div className="font-mono text-[11px] font-normal text-text-muted">Dès 45 000 FCFA</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  
                  {/* Catégorie 1 : Facturation & DGI */}
                  <tr className="bg-background-secondary">
                    <td colSpan={4} className="py-2.5 px-6 font-bold text-ink uppercase tracking-wider text-[11px]">
                      1. Facturation &amp; Conformité Fiscale DGI
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Factures certifiées e-MECeF avec QR Code DGI</td>
                    <td className="py-3 px-4 text-center font-mono text-text-muted">10 / mois</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Recherche automatisée d&apos;entreprises par IFU officiel</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Édition de devis, proformas et bons de livraison</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Relances automatiques par SMS &amp; Email en cas de retard</td>
                    <td className="py-3 px-4 text-center text-text-muted">-</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>

                  {/* Catégorie 2 : Trésorerie & Banque */}
                  <tr className="bg-background-secondary">
                    <td colSpan={4} className="py-2.5 px-6 font-bold text-ink uppercase tracking-wider text-[11px]">
                      2. Trésorerie &amp; Synchronisation Bancaire
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Synchronisation automatique MTN Mobile Money &amp; Moov</td>
                    <td className="py-3 px-4 text-center text-text-muted">-</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Relevés bancaires BOA, Ecobank, BIIC, NSIA</td>
                    <td className="py-3 px-4 text-center font-mono text-text-muted">Import CSV</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Rapprochement bancaire assisté en 1 clic</td>
                    <td className="py-3 px-4 text-center text-text-muted">-</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>

                  {/* Catégorie 3 : Déclarations Fiscales & TVA */}
                  <tr className="bg-background-secondary">
                    <td colSpan={4} className="py-2.5 px-6 font-bold text-ink uppercase tracking-wider text-[11px]">
                      3. Déclarations Fiscales &amp; TVA Bénin
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Calcul de la TVA collectée et déductible en direct</td>
                    <td className="py-3 px-4 text-center text-text-muted">-</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Tableau récapitulatif prêt pour la déclaration avant le 10</td>
                    <td className="py-3 px-4 text-center text-text-muted">-</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Piste d&apos;audit fiable et journal de contrôle horodaté</td>
                    <td className="py-3 px-4 text-center text-text-muted">-</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>

                  {/* Catégorie 4 : Comptabilité SYSCOHADA */}
                  <tr className="bg-background-secondary">
                    <td colSpan={4} className="py-2.5 px-6 font-bold text-ink uppercase tracking-wider text-[11px]">
                      4. Comptabilité &amp; Organisation SYSCOHADA
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Plan comptable général SYSCOHADA Révisé intégré</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Journaux des ventes, achats, caisse et banques</td>
                    <td className="py-3 px-4 text-center font-mono text-text-muted">Export basique</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Accès invité gratuit pour votre expert-comptable</td>
                    <td className="py-3 px-4 text-center text-text-muted">-</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>

                  {/* Catégorie 5 : Paie & Salariés */}
                  <tr className="bg-background-secondary">
                    <td colSpan={4} className="py-2.5 px-6 font-bold text-ink uppercase tracking-wider text-[11px]">
                      5. Paie &amp; Salariés
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Fiches de paie conformes au Code du Travail béninois</td>
                    <td className="py-3 px-4 text-center text-text-muted">-</td>
                    <td className="py-3 px-4 text-center bg-primary/5 font-mono">Jusqu&apos;à 10</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">Illimités</td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Calcul automatisé cotisations CNSS &amp; VPS</td>
                    <td className="py-3 px-4 text-center text-text-muted">-</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>

                  {/* Catégorie 6 : Utilisateurs & Support */}
                  <tr className="bg-background-secondary">
                    <td colSpan={4} className="py-2.5 px-6 font-bold text-ink uppercase tracking-wider text-[11px]">
                      6. Utilisateurs &amp; Support
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Nombre d&apos;utilisateurs inclus</td>
                    <td className="py-3 px-4 text-center font-mono">1 utilisateur</td>
                    <td className="py-3 px-4 text-center bg-primary/5 font-mono font-bold">5 utilisateurs</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">Illimités</td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Support client WhatsApp &amp; téléphone à Cotonou</td>
                    <td className="py-3 px-4 text-center text-text-muted">Centre d&apos;aide</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Déploiement et formation personnalisée sur site</td>
                    <td className="py-3 px-4 text-center text-text-muted">-</td>
                    <td className="py-3 px-4 text-center bg-primary/5 text-text-muted">-</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 7. BANNIÈRE CONSEILLER SOMBRE */}
          <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
            <div className="bg-ink text-white rounded-2xl p-8 sm:p-12 overflow-hidden relative border border-ink-border shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 flex flex-col items-start justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">
                    Accompagnement personnalisé
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                    Besoin d&apos;aide ? Choisissez votre formule avec un conseiller.
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 mb-6 leading-relaxed max-w-xl">
                    Nos conseillers basés à Cotonou font le point sur votre activité et vous recommandent la formule adaptée à votre déclaration DGI et à votre trésorerie.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                    <Link
                      href="/demo"
                      className="px-6 py-3.5 bg-primary text-ink text-xs font-bold rounded-xl shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Prendre rendez-vous</span>
                      <Calendar className="w-4 h-4" />
                    </Link>
                    <span className="text-white/75 text-xs">
                      Équipe disponible du lundi au vendredi à Cotonou
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="w-full max-w-sm rounded-xl overflow-hidden border border-ink-border shadow-xs bg-ink-surface">
                    <div className="relative aspect-[3/2] w-full bg-ink">
                      <Image
                        src="/images/conseillere-cotonou.jpg"
                        alt="Conseillère clientèle Ceilow à Cotonou"
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 384px"
                      />
                    </div>
                    <div className="p-3.5 bg-ink-surface border-t border-ink-border flex items-center justify-between gap-2 text-xs">
                      <span className="text-white font-semibold">Conseillers basés à Cotonou</span>
                      <span className="text-primary font-mono font-bold">GMT+1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. CARTE DE RÉASSURANCE TRANSITION / COMPTABLE */}
          <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
            <div className="bg-background border border-border rounded-2xl shadow-xs overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                <div className="lg:col-span-5 relative aspect-[3/2] lg:aspect-auto lg:h-full lg:min-h-[260px] bg-background-secondary">
                  <Image
                    src="/images/collaboration-comptable.jpg"
                    alt="Équipe Ceilow en collaboration à Cotonou"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                </div>
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                  <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                    Transition accompagnée
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-2">
                    Vous avez déjà un comptable ? Ceilow s&apos;adapte sans rien bousculer.
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
                    Notre équipe à Cotonou vous accompagne pour reprendre vos soldes de départ, paramétrer vos factures e-MECeF et ouvrir l&apos;accès à votre cabinet comptable.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Link
                      href="/demo"
                      className="px-6 py-3 bg-ink text-white hover:bg-ink/90 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 min-h-[44px]"
                    >
                      <span>Être accompagné</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-xs text-text-muted flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0" />
                      <span>Reprise des soldes de départ incluse</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 9. CAS D'USAGE AU BÉNIN */}
          <section className="w-full bg-background-secondary border-y border-border py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10 max-w-2xl">
                <span className="text-xs uppercase tracking-wider text-text-muted font-bold">
                  Cas d&apos;usage au Bénin
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-1">
                  À chaque activité sa formule adaptée
                </h2>
              </div>

              {/* CARTE VEDETTE AVEC PHOTO */}
              <div className="mb-8 bg-background rounded-2xl shadow-xs border border-border overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                  <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                        Société de services &amp; conseil - Cotonou
                      </span>
                      <h3 className="font-display text-xl font-bold text-ink mb-3">
                        Facturation e-MECeF rapide devant le client, sans boîtier physique
                      </h3>
                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
                        Scénario type : un cabinet de conseil ou prestataire B2B facture ses honoraires sur ordinateur ou smartphone, génère le QR code DGI en direct et envoie immédiatement la facture au format PDF par e-mail ou WhatsApp.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-ink font-semibold">
                      <span>Formule adaptée : Plan Gratuit ou Plan Pro</span>
                      <span className="text-success-deep">Conforme e-MECeF</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 h-72 lg:h-full min-h-[280px] relative bg-background-secondary">
                    <Image
                      src="/images/dirigeante-benin.jpg"
                      alt="Dirigeante d'entreprise utilisatrice de Ceilow à Cotonou"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 500px"
                    />
                  </div>
                </div>
              </div>

              {/* 3 SCÉNARIOS COMPLÉMENTAIRES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-background rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                      Commerce &amp; boutique
                    </span>
                    <p className="text-xs text-ink leading-relaxed mb-4">
                      Ventes au comptoir ou à distance, envoi des reçus normalisés sur WhatsApp et suivi simple des recettes journalières sans machine papier.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border text-xs font-bold text-ink">
                    Recommandé : Plan Pro
                  </div>
                </div>

                <div className="p-6 bg-background rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                      PME &amp; distribution
                    </span>
                    <p className="text-xs text-ink leading-relaxed mb-4">
                      Suivi des paiements MTN MoMo, Moov et banques locales, rapprochement avec les factures clients, paie jusqu&apos;à 10 salariés et préparation de la TVA.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border text-xs font-bold text-ink">
                    Recommandé : Plan Pro
                  </div>
                </div>

                <div className="p-6 bg-background rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                      Cabinet comptable
                    </span>
                    <p className="text-xs text-ink leading-relaxed mb-4">
                      Supervision multi-dossiers, accès collaborateurs par portefeuille et export des écritures conformes SYSCOHADA révisées.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border text-xs font-bold text-ink">
                    Recommandé : Offre Cabinet
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 10. HERO CARD PRÉ-FOOTER */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
            <div className="bg-background border border-border rounded-2xl shadow-xs overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 block">
                    Sérénité fiscale
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
                    Prêt à simplifier votre gestion ?
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted mb-6 max-w-xl leading-relaxed">
                    Pilotez vos factures et votre trésorerie au même endroit, sans veillées tardives avant le 10 du mois.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Link
                      href="/register"
                      className="w-full sm:w-auto px-6 py-3.5 bg-primary text-ink text-xs font-bold rounded-xl shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Tester 14 jours</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/demo"
                      className="w-full sm:w-auto px-6 py-3.5 bg-background-secondary text-ink hover:bg-border/60 border border-border text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Prendre rendez-vous</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted mt-6 pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep" />
                      <span>Sans carte bancaire</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep" />
                      <span>Annulation en 1 clic</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 relative aspect-[3/2] lg:aspect-auto lg:h-full lg:min-h-[280px] bg-background-secondary">
                  <Image
                    src="/images/collaboration-comptable.jpg"
                    alt="Dirigeants béninois collaborant sur leur gestion d'activité avec Ceilow"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 11. FOIRE AUX QUESTIONS */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-wider text-text-muted font-bold">
                Réponses précises
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2">
                Questions fréquentes
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                Tout savoir sur nos abonnements en FCFA et la conformité au Bénin.
              </p>
            </div>

            <div className="space-y-3">
              {faqList.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-background border border-border rounded-xl shadow-xs overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      className="w-full px-5 py-4 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-ink hover:bg-background-secondary/60 transition-colors cursor-pointer min-h-[48px]"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-ink" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs text-text-muted leading-relaxed border-t border-border pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 12. BANNIÈRE FINALE DE CONVERSION */}
          <section className="w-full bg-ink text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mb-4 shadow-xs">
                <Receipt className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                Libérez-vous de la paperasse comptable dès aujourd&apos;hui
              </h2>
              <p className="text-xs sm:text-sm text-white/75 max-w-2xl mb-8 leading-relaxed">
                Ouvrez votre compte en 2 minutes et créez vos premières factures certifiées e-MECeF directement dans votre navigateur.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3.5 bg-primary text-ink text-xs font-bold rounded-xl shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Tester gratuitement</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo"
                  className="w-full sm:w-auto px-8 py-3.5 bg-ink-surface text-white border border-ink-border text-xs font-bold rounded-xl hover:bg-ink-border transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Voir la démo</span>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-white/60 text-xs mt-8 pt-4 border-t border-ink-border">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  <span>Sans carte bancaire requise</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  <span>Prêt pour l&apos;audit DGI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  <span>Support basé à Cotonou</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── 13. FOOTER PUBLIC UNIFIÉ ACTUEL (SANS GLASSMORPHISME) ──────────── */}
      <PublicFooter />
    </div>
  );
}
