"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Building2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function CalendrierFiscalBeninPage() {
  const [filterType, setFilterType] = useState<"tous" | "mensuel" | "trimestriel" | "annuel">("tous");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const echeances = [
    {
      id: "ech-1",
      titre: "Télédéclaration et paiement TVA & AIB",
      organisme: "DGI Bénin",
      frequence: "mensuel",
      dateLimite: "10 de chaque mois",
      description:
        "Déclaration obligatoire du chiffre d'affaires, de la TVA collectée (18%), de la TVA déductible sur achats normalisés et versement des retenues AIB opérées sur tiers.",
      penalite: "Majoration de 10% minimum en cas de retard",
    },
    {
      id: "ech-2",
      titre: "Établissement des bulletins de paie & clôture salaires",
      organisme: "Entreprise / Salariés",
      frequence: "mensuel",
      dateLimite: "Dernier jour ouvré du mois",
      description:
        "Calcul des cotisations ouvrières (3.6%), retenue à la source IPTS barème progressif et émission des fiches de paie conformes au Code du Travail.",
      penalite: "Litiges prud'homaux et indemnités de retard",
    },
    {
      id: "ech-3",
      titre: "Déclaration trimestrielle e-Cotisations CNSS",
      organisme: "CNSS Bénin",
      frequence: "trimestriel",
      dateLimite: "15 Avril, 15 Juillet, 15 Octobre, 15 Janvier",
      description:
        "Dépôt de l'état nominatif des salaires bruts versés au cours du trimestre échu et versement des cotisations patronales (15.4%) et salariales (3.6%).",
      penalite: "Pénalité de retard de 10% puis 1% par mois de retard",
    },
    {
      id: "ech-4",
      titre: "Acomptes provisionnels d'Impôt sur les Sociétés (IS)",
      organisme: "DGI Bénin",
      frequence: "trimestriel",
      dateLimite: "10 Juin, 10 Septembre, 10 Décembre",
      description:
        "Versement des acomptes obligatoires calculés sur le bénéfice de l'exercice précédent pour les personnes morales assujetties au régime réel.",
      penalite: "Intérêts de retard fiscaux légaux",
    },
    {
      id: "ech-5",
      titre: "Déclaration annuelle récapitulative des salaires & honoraires",
      organisme: "DGI Bénin",
      frequence: "annuel",
      dateLimite: "31 Janvier de chaque année",
      description:
        "Transmission du tableau récapitulatif annuel de l'ensemble des rémunérations, commissions et honoraires versés au cours de l'exercice civil écoulé.",
      penalite: "Amende forfaitaire par omission",
    },
    {
      id: "ech-6",
      titre: "Dépôt des états financiers annuels (Liasse DSF)",
      organisme: "DGI & Tribunal de Commerce",
      frequence: "annuel",
      dateLimite: "30 Avril au plus tard",
      description:
        "Dépôt obligatoire de la Déclaration Statistique et Fiscale (DSF), bilan, compte de résultat et notes annexes conformes au Système Comptable OHADA (SYSCOHADA Révisé).",
      penalite: "Sanctions pécuniaires lourdes et taxation d'office",
    },
  ];

  const filteredEcheances =
    filterType === "tous"
      ? echeances
      : echeances.filter((ech) => ech.frequence === filterType);

  const handleSimulateDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Que se passe-t-il si le 10 du mois tombe un samedi, un dimanche ou un jour férié au Bénin ?",
      a: "Conformément aux règles fiscales de procédure, lorsque la date limite de déclaration ou de paiement coïncide avec un jour non ouvrable (week-end ou fête légale au Bénin), l'échéance est automatiquement prorogée jusqu'au premier jour ouvrable qui suit.",
    },
    {
      q: "Comment Ceilow m'aide-t-il à ne manquer aucune de ces échéances ?",
      a: "Ceilow intègre un tableau de bord fiscal avec calendrier dynamique. Dès le début de chaque période, des notifications visuelles et des rappels programmés vous alertent plusieurs jours à l'avance afin de valider vos déclarations en toute sérénité.",
    },
    {
      q: "Le calendrier fiscal est-il identique pour les entreprises au régime du TPS (Taxe Professionnelle Synthétique) ?",
      a: "Pour les très petites entreprises assujetties à la TPS, le calendrier de paiement suit des échéances spécifiques par trimestre (10 mars, 10 juin, 10 septembre, 10 décembre). Ceilow adapte automatiquement les rappels fiscaux selon le régime juridique de votre société.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      {/* ── STYLE DÉDIÉ POUR ANIMATION SVG LOTTIE-LIKE HORLOGE FISCALE & TRIMESTRES ── */}
      <style jsx global>{`
        @keyframes needleSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes clockBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes sparkleCalPop {
          0%, 45% { transform: scale(0) rotate(0deg); opacity: 0; }
          55% { transform: scale(1.3) rotate(45deg); opacity: 1; }
          70% { transform: scale(1) rotate(90deg); opacity: 1; }
          85%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        .clock-needle-anim {
          animation: needleSpin 8s linear infinite;
          transform-origin: 130px 85px;
        }
        .clock-body-anim {
          animation: clockBounce 4s ease-in-out infinite;
          transform-origin: center;
        }
        .sparkle-cal {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: sparkleCalPop 4s ease-in-out infinite;
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
                  Guide Fiscal Pratique 2026
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4 font-clash">
                  Le calendrier fiscal et social des entreprises au Bénin
                </h1>
                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Toutes les dates limites officielles de la DGI et de la CNSS réunies en un seul endroit)
                </p>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Anticipez vos déclarations de TVA du 10 du mois, vos cotisations CNSS trimestrielles et la liasse DSF du 30 avril. Téléchargez le mémo officiel récapitulatif pour votre direction administrative et financière.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSimulateDownload}
                    className="bg-primary text-ink font-bold px-7 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger le mémo fiscal PDF</span>
                  </button>
                  <Link
                    href="/register"
                    className="bg-background-secondary text-ink font-bold px-7 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Automatiser avec Ceilow
                  </Link>
                </div>

                {downloadSuccess && (
                  <div className="mt-4 p-3 rounded-xl bg-background-secondary border border-border text-xs text-ink flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink shrink-0" />
                    <span>Le calendrier officiel Bénin 2026 a été téléchargé avec succès.</span>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>100% conforme DGI Bénin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Échéances CNSS &amp; e-Cotisations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Mise à jour Loi de Finances 2026</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Photo réelle Expert-Comptable planning */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-xs">
                  <Image
                    src="/images/expert-comptable-benin.jpg"
                    alt="Expert-comptable béninois planifiant les clôtures fiscales de l'exercice à Cotonou"
                    width={600}
                    height={440}
                    className="w-full h-[360px] sm:h-[420px] object-cover"
                    priority
                  />
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Planning fiscal et social 2026</span>
                      <span className="text-success-deep font-semibold">À jour DGI</span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Rappels automatiques activables dans votre espace Ceilow.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION ANIMATION SVG LOTTIE-LIKE : HORLOGE FISCALE & 4 TRIMESTRES ── */}
        <section className="py-14 bg-background border-b border-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-60 h-44 mx-auto mb-3 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 260 170" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Cadran horloge fiscale */}
                <g className="clock-body-anim">
                  <circle cx="130" cy="85" r="70" fill="#332E29" stroke="#332E29" strokeWidth="2" />
                  <circle cx="130" cy="85" r="62" fill="#FDFBF7" stroke="#D8D5D0" strokeWidth="1.5" />
                  
                  {/* 4 Pôles Trimestriels */}
                  {/* T1 - Avril */}
                  <g transform="translate(130, 36)">
                    <rect x="-18" y="-8" width="36" height="16" rx="4" fill="#FFD946" stroke="#332E29" strokeWidth="1" />
                    <text x="0" y="3" textAnchor="middle" fill="#332E29" fontSize="6" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      30 AVR
                    </text>
                  </g>
                  {/* T2 - Juillet */}
                  <g transform="translate(178, 85)">
                    <rect x="-18" y="-8" width="36" height="16" rx="4" fill="#5FFFC2" stroke="#332E29" strokeWidth="1" />
                    <text x="0" y="3" textAnchor="middle" fill="#332E29" fontSize="6" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      15 JUIL
                    </text>
                  </g>
                  {/* T3 - Octobre */}
                  <g transform="translate(130, 134)">
                    <rect x="-18" y="-8" width="36" height="16" rx="4" fill="#FFA53D" stroke="#332E29" strokeWidth="1" />
                    <text x="0" y="3" textAnchor="middle" fill="#332E29" fontSize="6" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      15 OCT
                    </text>
                  </g>
                  {/* T4 - Janvier */}
                  <g transform="translate(82, 85)">
                    <rect x="-18" y="-8" width="36" height="16" rx="4" fill="#5FFFC2" stroke="#332E29" strokeWidth="1" />
                    <text x="0" y="3" textAnchor="middle" fill="#332E29" fontSize="6" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      15 JAN
                    </text>
                  </g>

                  {/* Aiguille rotative animée */}
                  <g className="clock-needle-anim">
                    <line x1="130" y1="85" x2="130" y2="48" stroke="#332E29" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="130" cy="48" r="3.5" fill="#FF5C5C" />
                  </g>
                  <circle cx="130" cy="85" r="5" fill="#332E29" />
                </g>

                {/* Étoiles scintillantes */}
                <g className="sparkle-cal" transform="translate(35, 30)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-cal" style={{ animationDelay: "1s" }} transform="translate(225, 45)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-clash text-ink tracking-tight">
              Toutes les échéances de l&apos;année fiscale maîtrisées
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto mt-1">
              Des déclarations mensuelles de TVA aux clôtures annuelles DSF, votre calendrier vous protège des majorations et pénalités.
            </p>
          </div>
        </section>

        {/* SECTION CHRONOLOGIE INTERACTIVE DES ÉCHÉANCES */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                  Agenda officiel
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
                  Chronologie des déclarations légales
                </h2>
                <p className="text-sm text-text-muted max-w-xl">
                  Filtrez les obligations fiscales et sociales selon leur périodicité pour planifier les clôtures de votre entreprise.
                </p>
              </div>

              {/* FILTRES INTERACTIFS */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterType("tous")}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                    filterType === "tous"
                      ? "bg-ink text-background border-ink"
                      : "bg-background text-ink border-border hover:border-ink"
                  }`}
                >
                  Toutes les échéances
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("mensuel")}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                    filterType === "mensuel"
                      ? "bg-ink text-background border-ink"
                      : "bg-background text-ink border-border hover:border-ink"
                  }`}
                >
                  Mensuel (TVA &amp; Salaires)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("trimestriel")}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                    filterType === "trimestriel"
                      ? "bg-ink text-background border-ink"
                      : "bg-background text-ink border-border hover:border-ink"
                  }`}
                >
                  Trimestriel (CNSS &amp; IS)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("annuel")}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                    filterType === "annuel"
                      ? "bg-ink text-background border-ink"
                      : "bg-background text-ink border-border hover:border-ink"
                  }`}
                >
                  Annuel (Liasse DSF 30 Avril)
                </button>
              </div>
            </div>

            {/* LISTE DES ÉCHÉANCES FILTRÉES */}
            <div className="space-y-4">
              {filteredEcheances.map((ech) => (
                <div
                  key={ech.id}
                  className="bg-background rounded-2xl border border-border p-6 sm:p-8 hover:border-ink transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                          {ech.organisme}
                        </span>
                        <span className="text-xs text-text-muted font-mono">
                          - Échéance : {ech.dateLimite}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-ink">
                        {ech.titre}
                      </h3>
                    </div>

                    <div className="bg-background-secondary border border-border px-3 py-1.5 rounded-lg text-xs font-bold text-ink shrink-0 self-start">
                      {ech.frequence.toUpperCase()}
                    </div>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed mb-4">
                    {ech.description}
                  </p>

                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
                    <span className="flex items-center gap-1.5 text-ink font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-ink" />
                      <span>{ech.penalite}</span>
                    </span>
                    <span className="text-text-muted">Géré automatiquement par Ceilow</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 PILIERS DE L'ANTICIPATION FISCALE */}
        <section className="py-16 md:py-24 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Méthode de travail
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Trois règles d&apos;or pour une gestion fiscale sans stress
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Traiter les pièces au fil de l&apos;eau
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Numérisez chaque reçu et émettez chaque facture au moment de l&apos;opération. En évitant l&apos;accumulation en fin de mois, votre déclaration du 10 est prête en 3 minutes au lieu de deux jours entiers.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Exiger des factures d&apos;achat normalisées
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Seules les factures comportant les mentions e-MECeF et l&apos;IFU du commerçant ouvrent droit à la déduction de la TVA au Bénin. Vérifiez systématiquement la présence du QR code de vos fournisseurs.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Partager l&apos;accès avec votre expert-comptable
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Permettez à votre conseil comptable d&apos;auditer les chiffres en continu sur Ceilow. Vous évitez les ajustements de dernière minute la veille du dépôt de la liasse DSF le 30 avril.
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
                Tout comprendre sur le calendrier fiscal béninois
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
              Ne ratez plus jamais une échéance fiscale béninoise.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Activez Ceilow pour votre entreprise et laissez la plateforme calculer vos déclarations en amont.
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
