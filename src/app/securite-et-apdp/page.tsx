"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Database,
  FileText,
  ArrowRight,
  Check,
  CheckCircle2,
  Server,
  Key,
  EyeOff,
  Download,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Scale,
  RefreshCw,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function SecuriteEtApdpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"chiffrement" | "sauvegardes" | "audit" | "apdp">("chiffrement");

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const securityDetails = {
    chiffrement: {
      title: "Chiffrement AES-256 & Protocoles TLS 1.3",
      description:
        "Toutes les données en transit entre votre navigateur et nos serveurs sont chiffrées selon la norme TLS 1.3 la plus exigeante. Au repos, vos bases de données financières et vos factures normalisées sont scellées par un chiffrement AES-256 de classe bancaire.",
      points: [
        "Certificats SSL de haute sécurité avec renouvellement automatique",
        "Isolation stricte des bases de données par entreprise abonnée",
        "Mots de passe hachés via algorithme robuste avec sel unique",
        "Mots de passe et jetons d'accès jamais stockés en clair",
      ],
    },
    sauvegardes: {
      title: "Sauvegardes automatisées & Redondance géographique",
      description:
        "Vos données d'entreprise font l'objet de sauvegardes automatiques toutes les 24 heures avec réplication chiffrée sur plusieurs centres de données distincts. En cas d'incident matériel majeur, le plan de reprise d'activité garantit une restauration en moins de 15 minutes.",
      points: [
        "Sauvegardes différentielles en continu tout au long de la journée",
        "Copies chiffrées distantes sur plusieurs zones indépendantes",
        "Tests de restauration de données simulés chaque mois",
        "Protection absolue contre la perte de disque local ou le vol de matériel",
      ],
    },
    audit: {
      title: "Piste d'audit légale immuable (Loi OHADA)",
      description:
        "Chaque opération de création, modification ou validation d'écriture est consignée dans un registre d'audit infalsifiable. Ce journal trace l'utilisateur, l'adresse IP, l'horodatage précis à la milliseconde et le détail des modifications apportées.",
      points: [
        "Impossibilité de suppression silencieuse d'une facture normalisée",
        "Historique complet consultable par votre commissaire aux comptes",
        "Empreinte cryptographique garantissant l'intégrité de la comptabilité",
        "Conforme aux exigences de la DGI pour les contrôles fiscaux",
      ],
    },
    apdp: {
      title: "Conformité Code du Numérique du Bénin (APDP)",
      description:
        "Ceilow est strictement aligné sur les dispositions de la Loi n° 2017-20 portant Code du numérique en République du Bénin et sous l'autorité de l'Autorité de Protection des Données Personnelles (APDP).",
      points: [
        "Propriété intégrale et exclusive de vos données par votre entreprise",
        "Engagement formel de non-revente et non-exploitation commerciale",
        "Droit de rectification et d'exportation totale (réversibilité)",
        "Suppression définitive et irréversible à la clôture de votre compte",
      ],
    },
  };

  const faqs = [
    {
      q: "Mes données financières appartiennent-elles à Ceilow ou à mon entreprise ?",
      a: "Vos données restent la propriété exclusive de votre entreprise. Ceilow n'a aucun droit de propriété intellectuelle sur vos écritures, vos factures ou vos pièces comptables. Vous pouvez exporter l'intégralité de vos bases de données à tout moment sans frais.",
    },
    {
      q: "Que se passe-t-il si je décide d'arrêter mon abonnement Ceilow ?",
      a: "Nous garantissons la réversibilité totale de vos données. Avant toute résiliation, vous pouvez télécharger vos journaux comptables, vos factures DGI en PDF et vos relevés au format Excel ou FEC. Vos données sont ensuite supprimées de manière sécurisée et irréversible.",
    },
    {
      q: "Les salariés de Ceilow ont-ils accès à mes factures et comptes ?",
      a: "Non. Nos équipes techniques n'ont pas accès au contenu de vos pièces comptables sans votre autorisation explicite accordée temporairement lors d'une session de télé-assistance technique pour résoudre un problème identifié.",
    },
    {
      q: "Ceilow est-il protégé contre les pannes d'électricité et coupures Internet à Cotonou ?",
      a: "Nos serveurs de production sont hébergés dans des infrastructures internationales certifiées ISO 27001 et SOC 2 avec redondance électrique absolue et disponibilité de 99,9%. Même si votre bureau subit une coupure d'électricité, vos données sont saines et immédiatement accessibles dès votre retour en ligne.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      {/* ── STYLE DÉDIÉ POUR ANIMATION SVG LOTTIE-LIKE BOUCLIER SÉCURITÉ & APDP ── */}
      <style jsx global>{`
        @keyframes shieldGlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes lockRotate {
          0%, 70%, 100% { transform: rotate(0deg); }
          75% { transform: rotate(-8deg); }
          85% { transform: rotate(8deg); }
        }
        @keyframes sparkleSecPop {
          0%, 45% { transform: scale(0) rotate(0deg); opacity: 0; }
          55% { transform: scale(1.3) rotate(45deg); opacity: 1; }
          70% { transform: scale(1) rotate(90deg); opacity: 1; }
          85%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        .shield-anim {
          animation: shieldGlow 3.6s ease-in-out infinite;
          transform-origin: center;
        }
        .lock-anim {
          animation: lockRotate 3.6s ease-in-out infinite;
          transform-origin: 130px 65px;
        }
        .sparkle-sec {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: sparkleSecPop 3.6s ease-in-out infinite;
        }
      `}</style>

      <PublicHeader />

      <main className="flex-1 w-full">
        {/* HERO SECTION SPLIT SCREEN */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 border-b border-border bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Colonne gauche : Copywriting clair et convertisseur */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                  Souveraineté &amp; Sécurité des Données
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4 font-clash">
                  Vos données comptables protégées selon les normes bancaires
                </h1>
                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Parce que la confidentialité de vos chiffres financiers est le socle de notre engagement)
                </p>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Chiffrement de bout en bout, sauvegardes automatiques quotidiennes et conformité totale avec le Code du Numérique du Bénin et l&apos;APDP. Vous restez le propriétaire exclusif de 100% de vos données.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/register"
                    className="bg-primary text-ink font-bold px-7 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Créer un compte sécurisé</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-background-secondary text-ink font-bold px-7 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Poser une question sécurité
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Conforme APDP Bénin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Chiffrement bancaire AES-256</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Sauvegardes quotidiennes</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Photo réelle Équipe Support Cotonou */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-xs">
                  <Image
                    src="/images/equipe-support-cotonou.jpg"
                    alt="Équipe technique et de sécurité des données de Ceilow à Cotonou"
                    width={600}
                    height={440}
                    className="w-full h-[360px] sm:h-[420px] object-cover"
                    priority
                  />
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Infrastructures surveillées 24h/24</span>
                      <span className="text-success-deep font-semibold">99.9% Disponibilité</span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Support technique réactif basé à Cotonou pour protéger votre activité.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION ANIMATION SVG LOTTIE-LIKE : BOUCLIER APDP & CADENAS SÉCURISÉ ── */}
        <section className="py-14 bg-background border-b border-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-60 h-44 mx-auto mb-3 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 260 170" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Bouclier protecteur */}
                <g className="shield-anim" transform="translate(130, 85)">
                  <path d="M 0 -70 C 45 -70, 75 -50, 75 10 C 75 55, 40 85, 0 100 C -40 85, -75 55, -75 10 C -75 -50, -45 -70, 0 -70 Z" fill="#332E29" stroke="#332E29" strokeWidth="2" />
                  <path d="M 0 -62 C 38 -62, 65 -45, 65 8 C 65 48, 35 74, 0 88 C -35 74, -65 48, -65 8 C -65 -45, -38 -62, 0 -62 Z" fill="#3D3830" stroke="#8A857D" strokeWidth="1" />
                  
                  {/* Cadenas rotatif */}
                  <g className="lock-anim" transform="translate(0, 0)">
                    {/* Anse du cadenas */}
                    <path d="M -16 -12 C -16 -28, 16 -28, 16 -12 L 16 2 L -16 2 Z" fill="none" stroke="#FFD946" strokeWidth="4" strokeLinecap="round" />
                    {/* Corps du cadenas */}
                    <rect x="-24" y="0" width="48" height="38" rx="6" fill="#FFD946" stroke="#332E29" strokeWidth="2" />
                    <circle cx="0" cy="16" r="4.5" fill="#332E29" />
                    <line x1="0" y1="18" x2="0" y2="28" stroke="#332E29" strokeWidth="3" strokeLinecap="round" />
                  </g>

                  {/* Sceau APDP Bénin vert menthe */}
                  <g transform="translate(0, 56)">
                    <rect x="-38" y="-10" width="76" height="20" rx="4" fill="#5FFFC2" stroke="#332E29" strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fill="#332E29" fontSize="7.5" fontWeight="900" letterSpacing="0.5" fontFamily="'Inter', sans-serif">
                      APDP BÉNIN
                    </text>
                  </g>
                </g>

                {/* Étoiles scintillantes */}
                <g className="sparkle-sec" transform="translate(35, 30)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-sec" style={{ animationDelay: "1.1s" }} transform="translate(225, 40)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-clash text-ink tracking-tight">
              Souveraineté et sécurité absolue de vos écritures
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto mt-1">
              Vos informations financières ne sont ni analysées à des fins commerciales, ni revendues. Vous en gardez le contrôle total.
            </p>
          </div>
        </section>

        {/* SECTION INTERACTIVE : INSPECTEUR DES 4 PILIERS DE SÉCURITÉ */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Audit de sécurité
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Les quatre piliers de la forteresse Ceilow
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-2xl">
                Sélectionnez un pilier technique pour consulter en détail notre architecture de protection des données financières d&apos;entreprises.
              </p>
            </div>

            {/* SÉLECTEUR DE PILIER */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <button
                type="button"
                onClick={() => setActiveTab("chiffrement")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeTab === "chiffrement"
                    ? "bg-primary text-ink border-primary shadow-xs"
                    : "bg-background text-ink border-border hover:border-ink"
                }`}
              >
                <Lock className="w-5 h-5 mb-2 text-ink" />
                <span className="text-xs font-bold block">Chiffrement AES-256</span>
                <span className="text-[11px] text-text-muted">Données scellées</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("sauvegardes")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeTab === "sauvegardes"
                    ? "bg-primary text-ink border-primary shadow-xs"
                    : "bg-background text-ink border-border hover:border-ink"
                }`}
              >
                <Database className="w-5 h-5 mb-2 text-ink" />
                <span className="text-xs font-bold block">Sauvegardes 24/7</span>
                <span className="text-[11px] text-text-muted">Redondance triple</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("audit")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeTab === "audit"
                    ? "bg-primary text-ink border-primary shadow-xs"
                    : "bg-background text-ink border-border hover:border-ink"
                }`}
              >
                <FileText className="w-5 h-5 mb-2 text-ink" />
                <span className="text-xs font-bold block">Piste d&apos;audit</span>
                <span className="text-[11px] text-text-muted">Traçabilité légale</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("apdp")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeTab === "apdp"
                    ? "bg-primary text-ink border-primary shadow-xs"
                    : "bg-background text-ink border-border hover:border-ink"
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-2 text-ink" />
                <span className="text-xs font-bold block">Conformité APDP</span>
                <span className="text-[11px] text-text-muted">Loi 2017-20 Bénin</span>
              </button>
            </div>

            {/* CONTENU DÉTAILLÉ DU PILIER SÉLECTIONNÉ */}
            <div className="bg-background rounded-2xl border border-border p-6 sm:p-10">
              <div className="max-w-3xl">
                <h3 className="text-xl font-bold text-ink mb-3">
                  {securityDetails[activeTab].title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  {securityDetails[activeTab].description}
                </p>

                <div className="space-y-3 pt-6 border-t border-border">
                  {securityDetails[activeTab].points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                      <span className="text-sm text-ink">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARAISON ORDINATEUR LOCAL VS CLOUD SÉCURISÉ */}
        <section className="py-16 md:py-24 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Comparatif de risques
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Pourquoi le fichier Excel sur votre bureau est vulnérable
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="text-xs uppercase font-bold text-text-muted tracking-wider mb-4 pb-3 border-b border-border">
                  Comptabilité sur ordinateur local
                </div>
                <ul className="space-y-4 text-sm text-text-muted">
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Risque de perte totale en cas de vol d&apos;ordinateur ou de crash de disque dur.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Aucun historique des modifications ni preuve d&apos;intégrité face au fisc.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Données exposées aux virus, rançongiciels et intrusions locales.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Sauvegardes manuelles sur clé USB irrégulières ou oubliées.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border-2 border-primary">
                <div className="text-xs uppercase font-bold text-ink tracking-wider mb-4 pb-3 border-b border-border flex items-center justify-between">
                  <span>Avec le Cloud Sécurisé Ceilow</span>
                  <span className="text-xs text-text-muted">Zéro perte garantie</span>
                </div>
                <ul className="space-y-4 text-sm text-ink">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Données synchronisées en temps réel et accessibles depuis n&apos;importe quel appareil.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Piste d&apos;audit horodatée opposable à l&apos;administration fiscale du Bénin.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Chiffrement fort AES-256 et sauvegardes redondées automatiques chaque jour.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Réversibilité totale : vous exportez vos données quand vous le désirez.</span>
                  </li>
                </ul>
              </div>
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
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Tout savoir sur la sécurité de vos données
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

        {/* BANNIÈRE D'APPEL À L'ACTION */}
        <section className="py-16 bg-ink text-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 text-background">
              Confiez vos comptes à un environnement souverain et protégé.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Rejoignez les dirigeants et cabinets comptables qui protègent leurs finances avec Ceilow.
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
                href="/contact"
                className="bg-transparent text-background font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:border-white transition-all text-center min-h-[48px] flex items-center justify-center"
              >
                Poser une question technique
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
