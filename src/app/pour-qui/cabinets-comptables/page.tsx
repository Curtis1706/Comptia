"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  ArrowRight,
  Check,
  CheckCircle2,
  Users,
  ShieldCheck,
  Layers,
  FileSpreadsheet,
  Download,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sparkles,
  Briefcase,
  FileCheck,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function CabinetsComptablesPage() {
  const [nbDossiers, setNbDossiers] = useState<number>(15);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Barème dégressif cabinet
  const getPrixUnitaire = (dossiers: number) => {
    if (dossiers <= 5) return 15000;
    if (dossiers <= 20) return 12000;
    if (dossiers <= 50) return 9500;
    return 7500;
  };

  const prixUnitaire = getPrixUnitaire(nbDossiers);
  const totalMensuel = nbDossiers * prixUnitaire;
  const heuresGagnees = Math.round(nbDossiers * 3.5);

  const formatFcfa = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " FCFA";
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Ceilow remplace-t-il les logiciels de production comptable existants du cabinet ?",
      a: "Non, Ceilow est conçu comme un accélérateur en amont de votre cabinet. Il collecte les pièces justificatives, normalise les factures DGI et pré-génère les écritures SYSCOHADA. Vous pouvez exporter l'intégralité du grand livre et du journal dans votre logiciel de production habituel (Sage, Saari, Perfect, etc.) sans ressaisie manuelle.",
    },
    {
      q: "Comment fonctionne la gestion des accès pour les collaborateurs du cabinet ?",
      a: "Votre espace Cabinet vous permet d'inviter vos chefs de mission et assistants avec des droits granulaires. Vous assignez des portefeuilles de clients spécifiques à chaque collaborateur et supervisez l'avancement des dossiers en temps réel.",
    },
    {
      q: "Le cabinet peut-il refacturer ou inclure l'abonnement dans sa lettre de mission ?",
      a: "Tout à fait. La convention partenaire Ceilow vous permet de centraliser la facturation du cabinet à tarif dégressif préférentiel, ou de faire souscrire directement vos clients tout en conservant votre accès superviseur gratuit.",
    },
    {
      q: "La solution est-elle reconnue par les professionnels de l'OECCA Bénin ?",
      a: "Ceilow respecte scrupuleusement le plan comptable SYSCOHADA Révisé, les normes de dématérialisation de la DGI et les prescriptions légales de l'Ordre des Experts-Comptables et Comptables Agréés du Bénin.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      <style jsx>{`
        /* Animation vectorielle Lottie-like : Cartable & dossiers d'audit */
        .folder-slide {
          animation: slide-folders 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-origin: 120px 100px;
        }
        .stamp-seal {
          animation: seal-pop 3.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
          transform-origin: 170px 70px;
        }
        .sparkle-star {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: pop-sparkle 3.2s ease-in-out infinite;
        }
        @keyframes slide-folders {
          0%, 15% { transform: translateY(12px) scale(0.92); opacity: 0.6; }
          45%, 65% { transform: translateY(0px) scale(1); opacity: 1; }
          85%, 100% { transform: translateY(-8px) scale(0.96); opacity: 0.8; }
        }
        @keyframes seal-pop {
          0%, 35% { transform: scale(0) rotate(-20deg); opacity: 0; }
          48% { transform: scale(1.15) rotate(5deg); opacity: 1; }
          58%, 85% { transform: scale(1) rotate(0deg); opacity: 1; }
          100% { transform: scale(0.9) rotate(0deg); opacity: 0.7; }
        }
        @keyframes pop-sparkle {
          0%, 40% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(45deg); opacity: 1; }
          65% { transform: scale(1) rotate(90deg); opacity: 1; }
          80%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
      `}</style>

      <PublicHeader />

      <main className="flex-1 w-full">
        {/* HERO SECTION EN SPLIT SCREEN AVEC VRAIE PHOTO LOCALE */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 border-b border-border bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* COLONNE GAUCHE : TEXTE & ACTIONS */}
              <div className="lg:col-span-7">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                  Espace Professionnels du Chiffre
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-6">
                  Le portail collaboratif pour experts-comptables au Bénin.
                </h1>
                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Concentrez vos collaborateurs sur le conseil stratégique plutôt que sur la relance de facturettes)
                </p>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8">
                  Centralisez vos entreprises clientes sur un tableau de bord unique. Récupérez les factures normalisées DGI, les relevés bancaires et Mobile Money déjà classés et pré-imputés en SYSCOHADA Révisé.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    href="/register"
                    className="bg-primary text-ink font-bold px-6 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Créer un espace cabinet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-background-secondary text-ink font-bold px-6 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Demander une présentation cabinet
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Portail multi-clients illimité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Conforme SYSCOHADA Révisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Exports Sage, FEC et Excel</span>
                  </div>
                </div>
              </div>

              {/* COLONNE DROITE : VRAIE PHOTO EXPERT-COMPTABLE BENIN */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-md">
                  <Image
                    src="/images/expert-comptable-benin.jpg"
                    alt="Expert-Comptable dans son cabinet à Cotonou au Bénin"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="p-4 bg-background border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-ink block">Samuel Adebayo</span>
                      <span className="text-[11px] text-text-muted">Expert-Comptable Membre OECCA, Cotonou</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-ink bg-background-secondary px-2.5 py-1 rounded-md border border-border">
                      100% SYSCOHADA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION INTERACTIVE AVEC ANIMATION VECTORIELLE SVG (LOTTIE-LIKE) */}
        <section className="py-16 md:py-20 bg-background border-b border-border">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* ILLUSTRATION SVG ANIMÉE SUR MESURE */}
            <div className="w-56 h-44 mx-auto mb-4 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 240 180" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Cartable d'audit / Mallette cabinet */}
                <rect x="40" y="55" width="160" height="105" rx="12" fill="#332E29" stroke="#332E29" strokeWidth="2.5" />
                <rect x="45" y="60" width="150" height="95" rx="8" fill="#F5F4F2" stroke="#D8D5D0" strokeWidth="1.5" />
                {/* Poignée mallette */}
                <path d="M 95 55 C 95 38, 145 38, 145 55" fill="none" stroke="#332E29" strokeWidth="3" strokeLinecap="round" />
                
                {/* Dossiers clients qui défilent */}
                <g className="folder-slide">
                  {/* Dossier 1 */}
                  <rect x="65" y="75" width="110" height="65" rx="6" fill="#FFFFFF" stroke="#332E29" strokeWidth="2" />
                  <line x1="78" y1="90" x2="140" y2="90" stroke="#332E29" strokeWidth="2" strokeLinecap="round" />
                  <line x1="78" y1="102" x2="160" y2="102" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="78" y1="114" x2="125" y2="114" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="78" y="123" width="35" height="10" rx="3" fill="#FFD946" />
                </g>

                {/* Sceau officiel OECCA animé */}
                <g className="stamp-seal">
                  <circle cx="170" cy="70" r="22" fill="#FFD946" stroke="#332E29" strokeWidth="2.5" />
                  <circle cx="170" cy="70" r="17" fill="none" stroke="#332E29" strokeWidth="1" strokeDasharray="3 2" />
                  <text x="170" y="73" fill="#332E29" fontFamily="'Inter', sans-serif" fontSize="7" fontWeight="900" textAnchor="middle">
                    OECCA
                  </text>
                  <text x="170" y="80" fill="#332E29" fontFamily="'Inter', sans-serif" fontSize="5" fontWeight="700" textAnchor="middle">
                    BÉNIN
                  </text>
                </g>

                {/* Étoiles scintillantes */}
                <g className="sparkle-star" transform="translate(45, 42)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-star" style={{ animationDelay: "1.1s" }} transform="translate(205, 125)">
                  <path d="M 0 -5 L 1.2 -1.2 L 5 0 L 1.2 1.2 L 0 5 L -1.2 1.2 L -5 0 L -1.2 -1.2 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
              Fini la chasse aux pièces comptables égarées
            </h2>
            <p className="text-base text-text-muted max-w-xl mx-auto mb-6">
              Vos clients déposent leurs reçus au fur et à mesure depuis leur smartphone. Le portail Ceilow pré-impute les écritures pour que votre cabinet n&apos;ait plus qu&apos;à valider.
            </p>
          </div>
        </section>

        {/* SECTION SIMULATEUR DE TARIFICATION DÉGRESSIVE POUR CABINETS */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Offre partenaire cabinet
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Simulez votre tarification dégressive par dossier
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-2xl">
                Plus vous connectez d&apos;entreprises clientes sur Ceilow, plus votre coût unitaire par dossier diminue. L&apos;accès superviseur pour votre équipe reste 100% gratuit.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* CURSEUR DOSSIERS (GAUCHE) */}
              <div className="lg:col-span-6 bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <h3 className="text-base font-bold text-ink mb-6 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-ink" />
                  <span>Volume de votre portefeuille clients</span>
                </h3>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Nombre d&apos;entreprises clientes actives
                    </label>
                    <span className="text-2xl font-bold font-mono text-ink tabular-nums">
                      {nbDossiers} dossiers
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="80"
                    step="1"
                    value={nbDossiers}
                    onChange={(e) => setNbDossiers(Number(e.target.value))}
                    className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-2">
                    <span>3 dossiers</span>
                    <span>20 dossiers</span>
                    <span>50+ dossiers</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted">Tarif appliqué par dossier client :</span>
                    <span className="font-mono font-bold text-sm text-ink tabular-nums">
                      {formatFcfa(prixUnitaire)} / mois
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted">Comptes collaborateurs cabinet inclus :</span>
                    <span className="font-bold text-xs text-ink">Illimités &amp; Gratuits</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted">Estimation du temps de saisie économisé :</span>
                    <span className="font-bold text-xs text-ink">Environ {heuresGagnees}h / mois</span>
                  </div>
                </div>
              </div>

              {/* CARTE DE SYNTHÈSE TARIFAIRE (DROITE) */}
              <div className="lg:col-span-6 bg-background p-6 sm:p-8 rounded-2xl border-2 border-primary">
                <div className="flex justify-between items-center pb-6 mb-6 border-b border-border">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                      Abonnement Cabinet Partenaire
                    </span>
                    <h4 className="text-xl font-bold text-ink">
                      Portail Multi-Dossiers OECCA
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-ink tabular-nums block">
                      {formatFcfa(totalMensuel)}
                    </span>
                    <span className="text-[11px] text-text-muted">facturation mensuelle HT</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Tableau de bord de supervision de l&apos;ensemble de vos dossiers.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Récupération des pièces d&apos;achats scannées et des écritures de ventes en continu.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Export FEC standardisé et pont vers Sage, Excel ou votre logiciel métier.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Assistance dédiée par un interlocuteur privilégié basé à Cotonou.</span>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="w-full bg-primary text-ink font-bold text-sm py-3.5 px-4 rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Activer la convention cabinet</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TABLEAU DES FONCTIONNALITÉS DU PORTAIL CABINET */}
        <section className="py-16 md:py-24 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Conçu pour la profession
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Les fonctionnalités exclusives du portail cabinet
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Supervision multi-entreprises
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Passez d&apos;un dossier client à un autre en un seul clic sans avoir à vous reconnecter. Suivez l&apos;état d&apos;avancement des déclarations fiscales et de la clôture annuelle de chaque société.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Droits fins par collaborateur
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Attribuez chaque dossier au chef de mission ou au collaborateur comptable responsable. Définissez les droits de validation, de consultation ou d&apos;export selon votre organisation interne.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <FileSpreadsheet className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Export FEC &amp; Liasses DSF
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Exportez l&apos;ensemble des écritures auxiliaires dans le format exigé par l&apos;administration fiscale. Préparez vos balances et vos états financiers SYSCOHADA pour le dépôt du 30 avril.
                </p>
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
                Tout savoir sur l&apos;intégration au sein de votre cabinet
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
              Modernisez la relation avec vos clients PME dès cette semaine.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Échangez avec notre responsable partenariats cabinets ou ouvrez votre premier dossier de test gratuitement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary text-ink font-bold px-8 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>Créer un espace cabinet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="bg-transparent text-background font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:border-white transition-all text-center min-h-[48px] flex items-center justify-center"
              >
                Planifier un échange cabinet
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
