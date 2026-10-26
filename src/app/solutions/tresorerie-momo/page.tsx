"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wallet,
  ArrowRight,
  Check,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  Building2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function TresorerieMomoPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // État interactif du rapprochement magnétique
  const [transactions, setTransactions] = useState([
    {
      id: "tx-1",
      source: "MTN Mobile Money",
      type: "momo",
      reference: "MOMO-PAY-882194",
      montant: "+145 000 FCFA",
      factureAssociee: "Facture FAC-2026-0042 (Librairie Notre-Dame)",
      statut: "a_rapprocher",
      score: "99%",
    },
    {
      id: "tx-2",
      source: "Compte BOA Benin",
      type: "banque",
      reference: "VIR-BOA-20260312",
      montant: "+1 250 000 FCFA",
      factureAssociee: "Facture FAC-2026-0038 (BTP Sarl)",
      statut: "a_rapprocher",
      score: "100%",
    },
    {
      id: "tx-3",
      source: "Moov Money",
      type: "moov",
      reference: "MOOV-TRX-55102",
      montant: "+32 500 FCFA",
      factureAssociee: "Facture FAC-2026-0045 (Particulier)",
      statut: "a_rapprocher",
      score: "98%",
    },
  ]);

  const rapprocherTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, statut: "rapproche" } : t))
    );
  };

  const rapprocherTout = () => {
    setTransactions((prev) => prev.map((t) => ({ ...t, statut: "rapproche" })));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Comment Ceilow récupère-t-il les relevés MTN MoMo et Moov Money ?",
      a: "Vous pouvez importer directement vos exports marchands MoMo et Moov en format Excel/CSV ou connecter votre passerelle de paiement en toute sécurité. Ceilow analyse chaque ligne, identifie l'expéditeur et isole le montant net et les frais d'opérateur.",
    },
    {
      q: "Quelles sont les banques compatibles au Bénin ?",
      a: "Ceilow prend en charge les relevés de toutes les banques commerciales exerçant au Bénin (BOA Bénin, Ecobank, Coris Bank, BGFI, Société Générale, NSIA, UBA, etc.) via l'importation sécurisée de vos extraits de compte au format standardisé.",
    },
    {
      q: "Que se passe-t-il en cas de paiement partiel ou avec frais déduits ?",
      a: "Ceilow détecte automatiquement les écarts fréquents liés aux frais d'opérateur Mobile Money (1% à 2%) et vous propose d'imputer immédiatement la différence sur le compte de charges adéquat (compte 631 frais financiers) sans bloquer le lettrage de la facture.",
    },
    {
      q: "Mon expert-comptable peut-il exporter ces rapprochements ?",
      a: "Oui, à tout instant. Les écritures de trésorerie réconciliées sont automatiquement générées dans le journal de banque et de caisse SYSCOHADA, prêtes pour l'export FEC ou l'audit légal.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      {/* ── STYLE DÉDIÉ POUR ANIMATION SVG LOTTIE-LIKE TRÉSORERIE & MOMO ── */}
      <style jsx global>{`
        @keyframes floatCoinMomo {
          0% { transform: translateY(-40px) scale(0.6) rotate(-15deg); opacity: 0; }
          25% { transform: translateY(-40px) scale(1) rotate(0deg); opacity: 1; }
          55% { transform: translateY(35px) scale(0.9) rotate(20deg); opacity: 1; }
          65%, 100% { transform: translateY(52px) scale(0.3); opacity: 0; }
        }
        @keyframes safeBounce {
          0%, 48% { transform: scale(1, 1); }
          55% { transform: scale(1.04, 0.96) translateY(2px); }
          62% { transform: scale(0.98, 1.02) translateY(-2px); }
          70%, 100% { transform: scale(1, 1) translateY(0); }
        }
        @keyframes phonePulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes sparklePop {
          0%, 45% { transform: scale(0) rotate(0deg); opacity: 0; }
          55% { transform: scale(1.3) rotate(45deg); opacity: 1; }
          70% { transform: scale(1) rotate(90deg); opacity: 1; }
          85%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        .coin-momo-anim {
          animation: floatCoinMomo 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          transform-origin: center;
        }
        .safe-anim {
          animation: safeBounce 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .phone-anim {
          animation: phonePulse 3s ease-in-out infinite;
        }
        .sparkle-momo {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: sparklePop 3s ease-in-out infinite;
        }
      `}</style>

      <PublicHeader />

      <main className="flex-1 w-full">
        {/* HERO SECTION SPLIT SCREEN */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 border-b border-border bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Colonne gauche : Copywriting orienté valeur */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                  Gestion de trésorerie &amp; encaissements
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4 font-clash">
                  Votre solde bancaire et vos comptes Mobile Money réunis en un coup d&apos;œil
                </h1>
                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Adieu les vérifications manuelles sur 3 téléphones de caisse différents)
                </p>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Visualisez vos encaissements MTN MoMo, Moov Money et vos comptes bancaires en direct. Rapprochez chaque encaissement avec sa facture sans calculatrice ni risque d&apos;écart de caisse.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/register"
                    className="bg-primary text-ink font-bold px-7 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Démarrer l&apos;essai gratuit</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="bg-background-secondary text-ink font-bold px-7 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Voir la démonstration
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>MTN MoMo &amp; Moov Money</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Toutes banques de l&apos;UEMOA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Rapprochement assisté</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Photo réelle Gestionnaire Financier à Cotonou */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-xs">
                  <Image
                    src="/images/finance-manager.jpg"
                    alt="Directeur administratif et financier analysant la trésorerie d'entreprise à Cotonou"
                    width={600}
                    height={440}
                    className="w-full h-[360px] sm:h-[420px] object-cover"
                    priority
                  />
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Trésorerie consolidée en temps réel</span>
                      <span className="text-success-deep font-mono">10 885 500 FCFA</span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      BOA Bénin, Ecobank, MTN MoMo Marchand et Moov Money synchronisés.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION ANIMATION SVG LOTTIE-LIKE : SMARTPHONE MOMO & COFFRE SÉCURISÉ ── */}
        <section className="py-14 bg-background border-b border-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-56 h-40 mx-auto mb-3 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 260 170" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Ligne de trajectoire des pièces */}
                <line x1="80" y1="50" x2="180" y2="105" stroke="#FFD946" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />

                {/* Smartphone émetteur MoMo */}
                <g className="phone-anim" transform="translate(30, 20)">
                  <rect x="0" y="0" width="60" height="96" rx="8" fill="#332E29" stroke="#332E29" strokeWidth="2" />
                  <rect x="4" y="8" width="52" height="74" rx="4" fill="#F5F4F2" />
                  <rect x="10" y="16" width="40" height="12" rx="3" fill="#FFD946" />
                  <text x="30" y="25" textAnchor="middle" fill="#332E29" fontSize="6" fontWeight="bold" fontFamily="'Inter', sans-serif">
                    MTN MoMo
                  </text>
                  <line x1="12" y1="36" x2="48" y2="36" stroke="#332E29" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="44" x2="40" y2="44" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="12" y1="52" x2="45" y2="52" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="30" cy="88" r="3" fill="#8A857D" />
                </g>

                {/* Pièce dorée qui vole du téléphone vers le coffre */}
                <g className="coin-momo-anim" transform="translate(130, 70)">
                  <ellipse cx="0" cy="0" rx="14" ry="16" fill="#FFD946" stroke="#332E29" strokeWidth="2" />
                  <ellipse cx="0" cy="0" rx="10" ry="12" fill="none" stroke="#332E29" strokeDasharray="3 2" strokeWidth="1" />
                  <text x="0" y="4" textAnchor="middle" fill="#332E29" fontSize="9" fontWeight="900" fontFamily="'Inter', sans-serif">
                    FCFA
                  </text>
                </g>

                {/* Coffre-fort de trésorerie consolidée */}
                <g className="safe-anim" transform="translate(160, 60)">
                  <rect x="0" y="0" width="80" height="75" rx="8" fill="#332E29" stroke="#332E29" strokeWidth="2" />
                  <rect x="6" y="6" width="68" height="63" rx="6" fill="#3D3830" stroke="#8A857D" strokeWidth="1" />
                  {/* Roue de verrouillage */}
                  <circle cx="40" cy="38" r="16" fill="#FFD946" stroke="#332E29" strokeWidth="2" />
                  <circle cx="40" cy="38" r="8" fill="#332E29" />
                  <circle cx="40" cy="38" r="4" fill="#5FFFC2" />
                  {/* Gonds */}
                  <rect x="2" y="14" width="4" height="8" rx="1" fill="#FFD946" />
                  <rect x="2" y="52" width="4" height="8" rx="1" fill="#FFD946" />
                </g>

                {/* Étoiles scintillantes */}
                <g className="sparkle-momo" transform="translate(120, 28)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-momo" style={{ animationDelay: "1s" }} transform="translate(245, 55)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-clash text-ink tracking-tight">
              Chaque franc encaissé est rangé et protégé
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto mt-1">
              Les règlements MoMo, Moov et virements bancaires se réconcilient avec vos factures sans perte d&apos;information ni oubli.
            </p>
          </div>
        </section>

        {/* SECTION INTERACTIVE : RADAR MULTI-COMPTES & RAPPROCHEMENT MAGNÉTIQUE */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Simulateur en direct
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Essayez le rapprochement bancaire et Mobile Money en direct
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-2xl">
                Ceilow compare les références de paiement et les montants reçus avec vos factures impayées. Cliquez sur &quot;Rapprocher&quot; pour constater la réconciliation instantanée.
              </p>
            </div>

            {/* SYNTHÈSE DES COMPTES (SOLDES EN TEMPS RÉEL) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-background p-5 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-text-muted uppercase">Banque Principale (BOA)</span>
                  <Building2 className="w-4 h-4 text-text-muted" />
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-ink mb-1">
                  8 420 000 FCFA
                </div>
                <div className="text-xs text-text-muted flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-ink" />
                  <span>Relevé synchronisé aujourd&apos;hui</span>
                </div>
              </div>

              <div className="bg-background p-5 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-text-muted uppercase">MTN MoMo Marchand</span>
                  <Smartphone className="w-4 h-4 text-text-muted" />
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-ink mb-1">
                  1 845 500 FCFA
                </div>
                <div className="text-xs text-text-muted flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-ink" />
                  <span>14 encaissements du jour</span>
                </div>
              </div>

              <div className="bg-background p-5 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-text-muted uppercase">Moov Money Marchand</span>
                  <Smartphone className="w-4 h-4 text-text-muted" />
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-ink mb-1">
                  620 000 FCFA
                </div>
                <div className="text-xs text-text-muted flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-ink" />
                  <span>5 encaissements du jour</span>
                </div>
              </div>

              <div className="bg-background p-5 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-text-muted uppercase">Trésorerie Consolidée</span>
                  <TrendingUp className="w-4 h-4 text-ink" />
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-ink mb-1">
                  10 885 500 FCFA
                </div>
                <div className="text-xs text-text-muted">
                  Solde disponible total
                </div>
              </div>
            </div>

            {/* TABLEAU INTERACTIF DES TRANSACTIONS EN ATTENTE */}
            <div className="bg-background rounded-2xl border border-border p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <h3 className="text-lg font-bold text-ink">
                    Transactions reçues en attente d&apos;imputation
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    Correspondance calculée à partir des libellés et des montants exacts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={rapprocherTout}
                  className="bg-ink text-background font-bold text-xs px-4 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 min-h-[40px]"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-primary" />
                  <span>Tout rapprocher en 1 clic</span>
                </button>
              </div>

              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-xl border border-border bg-background-secondary flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                        {tx.type === "banque" ? (
                          <Building2 className="w-5 h-5 text-ink" />
                        ) : (
                          <Smartphone className="w-5 h-5 text-ink" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-ink">{tx.source}</span>
                          <span className="text-xs text-text-muted font-mono">{tx.reference}</span>
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">
                          {tx.factureAssociee}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-ink block tabular-nums">
                          {tx.montant}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          Indice confiance : {tx.score}
                        </span>
                      </div>

                      {tx.statut === "rapproche" ? (
                        <div className="px-3 py-2 rounded-lg bg-background border border-border text-xs font-bold text-ink flex items-center gap-1.5 min-h-[36px]">
                          <CheckCircle2 className="w-4 h-4 text-ink" />
                          <span>Réconcilié</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => rapprocherTransaction(tx.id)}
                          className="bg-primary text-ink text-xs font-bold px-3 py-2 rounded-lg hover:opacity-90 transition-all min-h-[36px] flex items-center gap-1"
                        >
                          <span>Rapprocher</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-2">
                <span>Écriture automatique passée au compte 512 (Banque) ou 571 (Caisse MoMo) et lettrage compte 411.</span>
                <span className="font-mono text-ink font-bold">100% conforme SYSCOHADA</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 PILIERS DE BÉNÉFICES */}
        <section className="py-16 md:py-24 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Bénéfices concrets
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Trois raisons de piloter vos flux avec Ceilow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Zéro écart de caisse sur vos téléphones marchands
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Fini les doutes sur l&apos;encaissement effectif des paiements clients. Chaque transaction MoMo ou Moov est enregistrée avec sa référence unique, évitant les fausses captures d&apos;écran et les litiges de paiement.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <RefreshCw className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Rapprochement bancaire sans calculatrice
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Ceilow réconcilie automatiquement les lignes de vos extraits bancaires avec vos factures de ventes et d&apos;achats. Votre relevé de rapprochement bancaire de fin de mois est prêt en quelques minutes au lieu de plusieurs journées.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Anticipation des échéances et des impayés
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Identifiez immédiatement les factures en retard de règlement. Programmez vos relances clients par SMS ou e-mail avant que les retards n&apos;impactent la trésorerie de votre entreprise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARAISON : GESTION MANUELLE VS CEILOW */}
        <section className="py-16 md:py-20 bg-background-secondary border-t border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Comparatif
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                La différence sur vos journées de gestion
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background p-8 rounded-2xl border border-border">
                <div className="text-xs uppercase font-bold text-text-muted tracking-wider mb-4 pb-3 border-b border-border">
                  Gestion manuelle habituelle
                </div>
                <ul className="space-y-4 text-sm text-text-muted">
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Vérification au cas par cas sur le téléphone du gérant ou de la caissière.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Saisie manuelle des relevés de banque sur tableur avec risque récurrent de doublon.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Impossibilité d&apos;isoler rapidement les frais d&apos;opérateur Mobile Money.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Rapprochement bancaire reporté en fin de trimestre dans le stress.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background p-8 rounded-2xl border-2 border-primary">
                <div className="text-xs uppercase font-bold text-ink tracking-wider mb-4 pb-3 border-b border-border flex items-center justify-between">
                  <span>Avec Ceilow Trésorerie</span>
                  <span className="font-mono text-xs text-text-muted">Gain de 6h par semaine</span>
                </div>
                <ul className="space-y-4 text-sm text-ink">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Agrégation claire des soldes banques, MTN MoMo et Moov Money en temps réel.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Rapprochement assisté en un clic reliant transaction et facture client.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Comptabilisation automatique des commissions opérateurs dans les bons comptes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>État de rapprochement et journaux de trésorerie toujours à jour pour le comptable.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDÉON */}
        <section className="py-16 md:py-24 bg-background border-t border-border">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Questions fréquentes
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Tout comprendre sur la trésorerie et le Mobile Money
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
                      className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-ink text-base hover:bg-background-secondary/50 transition-colors"
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

        {/* BANNIÈRE D'APPEL À L'ACTION FINALE */}
        <section className="py-16 bg-ink text-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 text-background">
              Reprenez le contrôle total de vos liquidités dès aujourd&apos;hui.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Activez la réconciliation bancaire et Mobile Money sur Ceilow. Testez gratuitement pendant 14 jours, sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary text-ink font-bold px-8 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>Créer mon compte</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="bg-transparent text-background font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:border-white transition-all text-center min-h-[48px] flex items-center justify-center"
              >
                Tester la démo en ligne
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
