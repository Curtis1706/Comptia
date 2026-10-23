"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Star,
  ArrowRight,
  Calendar,
  ShieldCheck,
  CreditCard,
  Headphones,
  Receipt,
  Users,
  ChevronDown,
  Check,
  Building2,
  Lock,
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
      q: "Comment fonctionne le tarif dégressif pour les cabinets d'expertise comptable ?",
      a: "Nous proposons aux membres de l'OECCA et cabinets comptables un portail multi-entreprises avec tarification groupée par paliers (5, 20, 50, 100+ dossiers). Chaque dossier client supplémentaire bénéficie d'une remise substantielle pouvant aller jusqu'à 60 % du tarif unitaire public.",
    },
    {
      q: "Mes données restent-elles en sécurité si je décide d'arrêter mon abonnement ?",
      a: "Oui. Conformément à la réglementation de l'APDP au Bénin et aux normes OHADA, toutes vos données (écritures comptables, factures e-MECeF, pièces jointes) sont conservées de façon sécurisée et restent téléchargeables sous forme d'archives complètes (format Excel, PDF, FEC) à tout moment.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-ink font-sans selection:bg-primary selection:text-ink">
      {/* ── 1. HEADER PUBLIC UNIFIÉ ────────────────────────────────────────── */}
      <PublicHeader className="sticky top-0 z-50" />

      <main className="flex-grow">
        <div className="flex flex-col w-full">
          
          {/* ── 2. HERO SECTION & CONTRÔLES DYNAMIQUES ─────────────────────── */}
          <section className="w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 flex flex-col items-center text-center max-w-5xl mx-auto">
            {/* Badge direct FCFA */}
            <div className="inline-flex items-center gap-2 bg-background-secondary border border-border px-3.5 py-1 rounded-full text-text-muted text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <span>Tarification Directe en FCFA</span>
            </div>

            {/* H1 Headline */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink max-w-4xl tracking-tight leading-tight mb-4">
              Des tarifs clairs, sans surprise, conçus pour les entreprises au Bénin.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-text-muted max-w-2xl mb-8 leading-relaxed">
              Choisissez la formule adaptée à votre activité. Démarrez gratuitement ou profitez de 14 jours d&apos;essai complet sur le Plan Pro, sans carte bancaire requise.
            </p>

            {/* Contrôles de filtrage & Toggle */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8 w-full max-w-3xl justify-center">
              {/* Filtre de profil d'entreprise */}
              <div className="flex items-center p-1 bg-background-secondary border border-border rounded-xl gap-1 overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => setSelectedFilter("all")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === "indep"
                      ? "bg-background text-ink shadow-xs border border-border"
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  Indépendants &amp; Consultants
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("pme")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === "pme"
                      ? "bg-background text-ink shadow-xs border border-border"
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  PME &amp; Commerçants
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("cabinet")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === "cabinet"
                      ? "bg-background text-ink shadow-xs border border-border"
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  Cabinets &amp; Groupes
                </button>
              </div>

              {/* Toggle Fréquence (Mensuel vs Annuel) */}
              <div className="flex items-center gap-1 bg-background-secondary border border-border p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsAnnual(false)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAnnual
                      ? "bg-background text-ink shadow-xs border border-border font-bold"
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  <span>Annuel</span>
                  <span className="bg-success/20 text-success-deep text-[11px] font-bold px-1.5 py-0.5 rounded-full border border-success/30">
                    2 mois offerts
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* ── 3. GRILLE DES 3 PLANS TARIFAIRES ───────────────────────────── */}
          <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              
              {/* PLAN 1 : GRATUIT */}
              <div className="flex flex-col bg-background border border-border rounded-2xl p-6 sm:p-8 justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-xl font-bold text-ink">Plan Gratuit</span>
                    <span className="text-xs text-text-muted bg-background-secondary border border-border px-2.5 py-0.5 rounded-md font-semibold">
                      Démarrage
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-bold tabular-nums text-ink">0 FCFA</span>
                      <span className="text-xs text-text-muted">/ mois</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">Pour toujours, sans carte bancaire.</p>
                  </div>

                  <p className="text-xs text-ink/80 pb-3 mb-6 bg-background-secondary p-3 rounded-xl border border-border leading-relaxed">
                    Tout ce qu&apos;il vous faut pour éditer vos premières factures en règle avec la DGI sans débourser un franc.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span><strong>10 factures</strong> normalisées e-MECeF avec QR code par mois</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Recherche rapide de vos clients par IFU officiel</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Devis et bons de commande au format PDF</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Export comptable de base (format Excel / CSV)</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>1 compte administrateur unique</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Support standard et centre d&apos;aide en ligne</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/register"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-ink bg-background-secondary hover:bg-border/60 border border-border transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>Créer mon compte gratuit</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-text-muted mt-2">Activation immédiate en 2 min</p>
                </div>
              </div>

              {/* PLAN 2 : PLAN PRO (RECOMMANDÉ) */}
              <div className="flex flex-col bg-background border-2 border-primary rounded-2xl p-6 sm:p-8 justify-between shadow-xs relative">
                {/* Badge Recommandé */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-ink text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-ink" />
                  <span>Recommandé</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 pt-1">
                    <span className="font-display text-xl font-bold text-ink">Plan Pro</span>
                    <span className="text-xs text-success-deep bg-success/20 border border-success/30 px-2.5 py-0.5 rounded-md font-semibold">
                      TPE &amp; PME
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
                        ? "Facturé 150 000 FCFA / an • Soit 30 000 FCFA d'économie"
                        : "Facturé mensuellement • Liberté d'arrêter quand vous voulez"}
                    </p>
                  </div>

                  <p className="text-xs text-ink pb-3 mb-6 bg-primary/10 p-3 rounded-xl border border-primary/20 leading-relaxed font-medium">
                    L&apos;automatisation complète de votre gestion quotidienne : facturation illimitée, suivi bancaire MoMo et calcul direct de votre TVA.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Factures certifiées DGI e-MECeF illimitées</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Connexion auto MTN MoMo, Moov Money &amp; banques locales</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Rapprochement bancaire instantané en 1 clic</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Calcul en temps réel de votre TVA avant le 10 du mois</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Dossier comptable propre pour votre expert-comptable</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Gestion de la paie (jusqu&apos;à <strong>10 salariés</strong>)</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Relances automatiques par SMS &amp; Email en cas de retard</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>5 accès collaborateurs paramétrables</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Support prioritaire à Cotonou par WhatsApp &amp; Téléphone</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/register"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-ink bg-primary hover:bg-primary-hover transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <span>Démarrer mon essai de 14 jours</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-text-muted mt-2">
                    14 jours offerts • Aucun prélèvement immédiat • Annulation en 1 clic
                  </p>
                </div>
              </div>

              {/* PLAN 3 : PLAN ENTREPRISE & CABINET */}
              <div className="flex flex-col bg-background border border-border rounded-2xl p-6 sm:p-8 justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-xl font-bold text-ink">Entreprise &amp; Cabinet</span>
                    <span className="text-xs text-text-muted bg-background-secondary border border-border px-2.5 py-0.5 rounded-md font-semibold">
                      Multi-Sociétés
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-bold tabular-nums text-ink">Dès 45 000 FCFA</span>
                      <span className="text-xs text-text-muted">/ mois</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">Tarifs dégressifs selon le volume de dossiers</p>
                  </div>

                  <p className="text-xs text-ink/80 pb-3 mb-6 bg-background-secondary p-3 rounded-xl border border-border leading-relaxed">
                    La puissance Ceilow à l&apos;échelle : multi-sociétés, consolidation de groupe, intégration ERP et chargé de compte dédié.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Tout le Plan Pro en illimité</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Multi-sociétés et consolidation financière de groupe</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Espace dédié expert-comptable OECCA multi-dossiers</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Salariés illimités paie &amp; déclarations CNSS</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Accès direct API REST pour caisse &amp; ERP interne</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Formation sur site à Cotonou ou Porto-Novo</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span>Chargé de compte dédié avec SLA garanti 99.9%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/demo"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-ink bg-background-secondary hover:bg-border/60 border border-border transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>Échanger avec un conseiller</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-text-muted mt-2">
                    Réponse sous 2 heures ouvrées • Étude personnalisée
                  </p>
                </div>
              </div>
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

          {/* ── 5. CALCULATRICE D'ÉCONOMIES INTERACTIVE ───────────────────────── */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 max-w-5xl mx-auto">
            <div className="bg-background border border-border rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold text-ink uppercase tracking-wider bg-primary/20 px-3 py-1 rounded-full">
                  Simulateur de Rentabilité
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-3 mb-2">
                  Combien Ceilow vous fait-il économiser chaque mois ?
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Estimez le temps de travail administratif et les risques fiscaux que vous éliminez immédiatement en automatisant votre gestion.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Sliders de réglage */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-semibold">
                      <span className="text-ink">Factures émises par mois :</span>
                      <span className="font-mono tabular-nums text-ink bg-background-secondary border border-border px-2 py-0.5 rounded font-bold">
                        {invoicesCount} factures
                      </span>
                    </div>
                    <input
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
                      <span className="text-ink">Heures passées sur la gestion / mois :</span>
                      <span className="font-mono tabular-nums text-ink bg-background-secondary border border-border px-2 py-0.5 rounded font-bold">
                        {hoursSpent} heures
                      </span>
                    </div>
                    <input
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
                      Comprend l&apos;automatisation e-MECeF DGI, le rapprochement MTN MoMo automatique et l&apos;édition sans calcul de votre déclaration TVA.
                    </span>
                  </div>
                </div>

                {/* Carte de résultat dynamique */}
                <div className="bg-background-secondary border border-border p-6 rounded-2xl flex flex-col justify-between h-full">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-text-muted font-bold mb-2">
                      Impact Immédiat Constaté
                    </div>
                    <div className="space-y-3 my-4">
                      <div className="flex items-baseline justify-between bg-background p-3.5 rounded-xl border border-border">
                        <span className="text-xs text-text-muted">Temps économisé estimé :</span>
                        <span className="font-mono text-xl font-bold text-success-deep tabular-nums">
                          ~{savedHours} h / mois
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between bg-background p-3.5 rounded-xl border border-border">
                        <span className="text-xs text-text-muted">Risque d&apos;amende DGI :</span>
                        <span className="font-mono text-xl font-bold text-success-deep tabular-nums">
                          Éliminé (100 %)
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between bg-background p-3.5 rounded-xl border border-border">
                        <span className="text-xs text-text-muted">Retour sur investissement :</span>
                        <span className="text-xs font-bold text-ink bg-primary/30 px-2 py-1 rounded-md tabular-nums">
                          {getRoiText()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/register"
                      className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-ink bg-primary hover:bg-primary-hover transition-colors shadow-xs text-center block"
                    >
                      Essayer gratuitement pendant 14 jours
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 6. TABLEAU COMPARATIF EXHAUSTIF DES FONCTIONNALITÉS ──────────── */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
                Comparez les fonctionnalités dans le détail
              </h2>
              <p className="text-xs sm:text-sm text-text-muted">
                Chaque formule a été spécifiquement conçue pour répondre à vos obligations fiscales et comptables en République du Bénin.
              </p>
            </div>

            {/* Responsive Table Wrapper */}
            <div className="w-full overflow-x-auto bg-background border border-border rounded-2xl shadow-xs">
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
                    <td className="py-3 px-4 text-center text-text-muted">—</td>
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
                    <td className="py-3 px-4 text-center text-text-muted">—</td>
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
                    <td className="py-3 px-4 text-center text-text-muted">—</td>
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
                    <td className="py-3 px-4 text-center text-text-muted">—</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Tableau récapitulatif prêt pour la déclaration avant le 10</td>
                    <td className="py-3 px-4 text-center text-text-muted">—</td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Piste d&apos;audit fiable et journal de contrôle horodaté</td>
                    <td className="py-3 px-4 text-center text-text-muted">—</td>
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
                    <td className="py-3 px-6 text-ink">Accès invité gratuit pour votre Expert-Comptable OECCA</td>
                    <td className="py-3 px-4 text-center text-text-muted">—</td>
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
                    <td className="py-3 px-4 text-center text-text-muted">—</td>
                    <td className="py-3 px-4 text-center bg-primary/5 font-mono">Jusqu&apos;à 10</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">Illimités</td>
                  </tr>
                  <tr className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3 px-6 text-ink">Calcul automatisé cotisations CNSS &amp; VPS</td>
                    <td className="py-3 px-4 text-center text-text-muted">—</td>
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
                    <td className="py-3 px-6 text-ink">Support client réactif WhatsApp &amp; Tél Cotonou</td>
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
                    <td className="py-3 px-4 text-center text-text-muted">—</td>
                    <td className="py-3 px-4 text-center bg-primary/5 text-text-muted">—</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-success-deep mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── 7. BANNIÈRE CONSEILLER SOMBRE (FOND INK PUR SANS GLASS) ─────── */}
          <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
            <div className="bg-ink text-white rounded-2xl p-8 sm:p-12 overflow-hidden relative border border-[#474138] shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 flex flex-col items-start justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D3830] text-primary text-xs font-semibold uppercase tracking-wider mb-3 border border-[#474138]">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span>Accompagnement Personnalisé</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                    Besoin d&apos;aide ? Explorez l&apos;offre Ceilow avec un conseiller.
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 mb-6 leading-relaxed max-w-xl">
                    Nos spécialistes basés à Cotonou analysent votre activité en direct et vous recommandent la configuration optimale pour votre déclaration DGI et vos flux bancaires.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                    <Link
                      href="/demo"
                      className="px-6 py-3.5 bg-primary text-ink text-xs font-bold rounded-xl shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Prendre rendez-vous</span>
                      <Calendar className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <div className="flex -space-x-2">
                        <span className="w-7 h-7 rounded-full bg-primary text-ink text-[11px] font-bold flex items-center justify-center border-2 border-ink">
                          A
                        </span>
                        <span className="w-7 h-7 rounded-full bg-success text-ink text-[11px] font-bold flex items-center justify-center border-2 border-ink">
                          J
                        </span>
                        <span className="w-7 h-7 rounded-full bg-background-secondary text-ink text-[11px] font-bold flex items-center justify-center border-2 border-ink">
                          M
                        </span>
                      </div>
                      <span>Amina, Josué ou Marc vous répondent</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-[#474138] shadow-xs bg-[#3D3830]">
                    <div className="w-full h-64 md:h-72 bg-ink relative flex items-center justify-center">
                      <Image
                        src="/images/conseillere-cotonou.jpg"
                        alt="Conseillère clientèle Ceilow à Cotonou"
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 384px"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-ink/95 p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-[11px] text-white font-semibold">Conseillers disponibles à Cotonou</span>
                      </div>
                      <span className="text-[11px] text-primary font-mono font-bold">&lt; 5 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 8. CARTE DE RÉASSURANCE TRANSITION / COMPTABLE ──────────────── */}
          <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
            <div className="bg-background border border-border rounded-2xl shadow-xs overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                <div className="lg:col-span-5 h-full min-h-[260px] relative bg-background-secondary">
                  <Image
                    src="/images/collaboration-comptable.jpg"
                    alt="Équipe Ceilow en collaboration à Cotonou"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                </div>
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background-secondary text-ink text-xs font-semibold uppercase tracking-wider mb-3 self-start border border-border">
                    <span className="w-2 h-2 rounded-full bg-success-deep" />
                    <span>Transition Clé en Main</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-2">
                    Vous avez déjà un comptable ? Ceilow s&apos;adapte sans rien bousculer.
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
                    Comme plus de 50 indépendants et PME au Bénin, gagnez du temps et déléguez la corvée. Notre équipe à Cotonou vous accompagne dans la reprise de vos écritures et la clôture avec votre ancien prestataire.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Link
                      href="/demo"
                      className="px-6 py-3 bg-ink text-white hover:bg-ink/90 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 min-h-[44px]"
                    >
                      <span>Être accompagné gratuitement</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-xs text-text-muted flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-success-deep" />
                      <span>Reprise d&apos;historique 100% assurée</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 9. AVIS & PREUVE SOCIALE COTONOU ────────────────────────────── */}
          <section className="w-full bg-background-secondary border-y border-border py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                <div>
                  <span className="text-xs uppercase tracking-wider text-text-muted font-bold">
                    Confiance &amp; Rigueur
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    Approuvé par plus de 50 dirigeants et cabinets au Bénin
                  </h2>
                </div>
                <div className="flex items-center gap-3 bg-background px-4 py-2 rounded-xl border border-border shadow-xs shrink-0">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-xs text-ink">
                    Note moyenne <strong>4.9 / 5</strong>
                  </span>
                </div>
              </div>

              {/* CARTE VEDETTE AVEC PHOTO */}
              <div className="mb-8 bg-background rounded-2xl shadow-xs border border-border overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                  <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-1 text-primary mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <h3 className="font-display text-xl font-bold text-ink mb-2">
                        &laquo; Qualité, simplicité, efficacité ! &raquo;
                      </h3>
                      <p className="text-xs sm:text-sm text-ink italic leading-relaxed mb-6">
                        &laquo; En lançant notre cabinet de conseil à Cotonou, nous craignions les sanctions DGI liées aux factures non conformes. Ceilow a tout simplifié : l&apos;émission de la facture normalisée se fait en direct devant le client, avec le QR code officiel validé en temps réel. Le gain de temps est colossal. &raquo;
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-ink">Aurélie Tokpanou</h4>
                        <p className="text-[11px] text-text-muted">
                          Fondatrice &amp; CEO, Tokpanou Consulting Group (Cotonou, Ganhi)
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] text-success-deep bg-success/20 px-2 py-0.5 rounded-full font-semibold border border-success/30">
                        <Check className="w-3 h-3" /> Avis vérifié
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 h-72 lg:h-full min-h-[280px] relative bg-background-secondary">
                    <Image
                      src="/images/dirigeante-benin.jpg"
                      alt="Aurélie Tokpanou, utilisatrice Ceilow à Cotonou"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 500px"
                    />
                  </div>
                </div>
              </div>

              {/* 3 AVIS COMPLÉMENTAIRES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-background rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                  <p className="text-xs text-ink italic mb-4 leading-relaxed">
                    &laquo; Avant Ceilow, l&apos;édition des factures normalisées e-MECeF était une source d&apos;angoisse quotidienne. Désormais tout part en 3 secondes depuis notre smartphone avec QR Code certifié. Un gain de sérénité inestimable pour notre agence à Haie Vive. &raquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-ink text-xs">
                      KA
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Koffi Agbossou</h4>
                      <p className="text-[11px] text-text-muted">Directeur, Agence Com&apos;Afrik (Cotonou)</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-background rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                  <p className="text-xs text-ink italic mb-4 leading-relaxed">
                    &laquo; La synchronisation directe avec les comptes MTN Mobile Money a totalement transformé notre suivi de trésorerie. Les rapprochements bancaires que notre comptable mettait 4 jours à boucler sont maintenant faits en temps réel. &raquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-ink text-xs">
                      SN
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Séfako Noukpo</h4>
                      <p className="text-[11px] text-text-muted">Gérante, Bénin Agro Distribution (Akpakpa)</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-background rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                  <p className="text-xs text-ink italic mb-4 leading-relaxed">
                    &laquo; En tant qu&apos;expert-comptable, recommander Ceilow à nos clients nous a permis de récupérer des dossiers sans erreur de TVA et parfaitement classés selon l&apos;acte uniforme OHADA révisé. Un véritable saut technologique au Bénin. &raquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <div className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center font-bold text-xs">
                      MA
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Me Aristide Mensah</h4>
                      <p className="text-[11px] text-text-muted">Expert-Comptable Associé, Cabinet Fiduciaire</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 10. HERO CARD PRÉ-FOOTER (LIFESTYLE SÉRÉNITÉ) ──────────────── */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
            <div className="bg-background border border-border rounded-2xl shadow-xs overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-success-deep bg-success/20 border border-success/30 px-3 py-1 rounded-full self-start mb-3">
                    Sérénité Fiscale
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
                    Prêt pour la vraie indépendance ?
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted mb-6 max-w-xl leading-relaxed">
                    Rejoignez les dirigeants et entrepreneurs qui pilotent leur comptabilité avec sérénité. Fini les nuits blanches avant la déclaration du 10 du mois.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Link
                      href="/register"
                      className="w-full sm:w-auto px-6 py-3.5 bg-primary text-ink text-xs font-bold rounded-xl shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Démarrer l&apos;essai 14 jours</span>
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

                <div className="lg:col-span-5 h-72 lg:h-full min-h-[280px] relative bg-background-secondary">
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

          {/* ── 11. FOIRE AUX QUESTIONS (FAQ EN ACCORDÉON STRICT) ───────────── */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-wider text-text-muted font-bold">
                Réponses Précises
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2">
                Questions fréquentes
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                Toutes les clarifications nécessaires sur les formules d&apos;abonnement et la conformité béninoise.
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
                      className="w-full px-5 py-4 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-ink hover:bg-background-secondary/60 transition-colors cursor-pointer"
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

          {/* ── 12. BANNIÈRE FINALE DE CONVERSION (FOND INK PUR SANS GLASS) ─── */}
          <section className="w-full bg-ink text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mb-4 shadow-xs">
                <Receipt className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                Prêt à vous libérer de la corvée administrative ?
              </h2>
              <p className="text-xs sm:text-sm text-white/75 max-w-2xl mb-8 leading-relaxed">
                Activez votre compte en 2 minutes et commencez à émettre vos factures certifiées e-MECeF dès aujourd&apos;hui. Aucune installation logicielle, 100% dans votre navigateur.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3.5 bg-primary text-ink text-xs font-bold rounded-xl shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Démarrer mon essai gratuit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#3D3830] text-white border border-[#474138] text-xs font-bold rounded-xl hover:bg-[#474138] transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Planifier une démonstration guidée</span>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-white/60 text-xs mt-8 pt-4 border-t border-[#474138]">
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
                  <span>Assistance basée à Cotonou</span>
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
