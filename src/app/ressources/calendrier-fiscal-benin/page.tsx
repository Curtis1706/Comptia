"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  ArrowRight,
  Check,
  Printer,
  AlertTriangle,
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CalendrierFiscalBeninPage() {
  const [filterType, setFilterType] = useState<"tous" | "mensuel" | "trimestriel" | "annuel">("tous");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const echeances = [
    {
      id: "ech-1",
      titre: "Déclaration et paiement TVA & AIB",
      organisme: "DGI Bénin",
      frequence: "mensuel",
      dateLimite: "Le 10 de chaque mois",
      description:
        "Déclaration de votre chiffre d'affaires du mois, de la TVA encaissée (18 %), de la TVA récupérable sur vos achats avec facture e-MECeF et des retenues AIB.",
      penalite: "Majoration de retard appliquée dès le lendemain de l'échéance",
    },
    {
      id: "ech-2",
      titre: "Calcul de la paie et retenue IPTS",
      organisme: "Entreprise / DGI",
      frequence: "mensuel",
      dateLimite: "Fin de mois (paiement IPTS le 10)",
      description:
        "Calcul des cotisations CNSS salarié (3,6 %) et de l'impôt IPTS sur salaire, édition des fiches de paie et versement de l'IPTS le 10 du mois suivant.",
      penalite: "Majorations de retard sur l'impôt et litiges salariés",
    },
    {
      id: "ech-3",
      titre: "Déclaration e-Cotisations CNSS",
      organisme: "CNSS Bénin",
      frequence: "trimestriel",
      dateLimite: "15 janv., 15 avr., 15 juil., 15 oct. (< 20 salariés) | le 10 (20+)",
      description:
        "Envoi de la liste des salaires versés et paiement des cotisations (15,4 % employeur et 3,6 % salarié) : par trimestre sous 20 salariés, ou chaque mois dès 20 salariés.",
      penalite: "Majoration de retard de 1,50 % par mois ou fraction de mois",
    },
    {
      id: "ech-4",
      titre: "Avances d'impôt sur les sociétés (IS)",
      organisme: "DGI Bénin",
      frequence: "trimestriel",
      dateLimite: "10 juin, 10 septembre, 10 décembre",
      description:
        "Versement des avances trimestrielles calculées sur le bénéfice de l'année précédente pour les entreprises imposées au régime réel.",
      penalite: "Intérêts de retard appliqués par la DGI",
    },
    {
      id: "ech-5",
      titre: "Récapitulatif annuel des salaires et honoraires",
      organisme: "DGI Bénin",
      frequence: "annuel",
      dateLimite: "31 janvier de chaque année",
      description:
        "Envoi à la DGI du tableau annuel regroupant tous les salaires, commissions et honoraires versés durant l'année civile précédente.",
      penalite: "Amende en cas d'oubli ou de dépôt tardif",
    },
    {
      id: "ech-6",
      titre: "Dépôt des comptes annuels (Bilan & DSF)",
      organisme: "DGI & Tribunal de Commerce",
      frequence: "annuel",
      dateLimite: "30 avril au plus tard",
      description:
        "Remise officielle de votre bilan comptable, compte de résultat et annexes conformes au plan comptable OHADA (SYSCOHADA révisé).",
      penalite: "Amendes lourdes et évaluation d'office par l'administration",
    },
  ];

  const filteredEcheances =
    filterType === "tous"
      ? echeances
      : echeances.filter((ech) => ech.frequence === filterType);

  const handlePrintMemo = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Que se passe-t-il si le 10 du mois tombe un week-end ou un jour férié au Bénin ?",
      a: "Lorsque la date limite tombe un samedi, un dimanche ou un jour férié officiel au Bénin, elle est reportée automatiquement au premier jour ouvrable suivant.",
    },
    {
      q: "Comment Ceilow m'évite-t-il d'oublier une date limite ?",
      a: "Votre tableau de bord affiche en permanence les prochaines échéances de votre entreprise. Des alertes vous préviennent plusieurs jours à l'avance pour préparer vos chiffres sans stress.",
    },
    {
      q: "Les dates sont-elles identiques si je suis au régime TPS ?",
      a: "Non. Si votre entreprise est au régime de la Taxe Professionnelle Synthétique (TPS), vous réglez un premier acompte le 10 février, déposez votre déclaration annuelle et le solde au plus tard le 30 avril, puis versez un second acompte le 10 juin. Ceilow adapte vos rappels à votre régime.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      {/* STYLE DÉDIÉ ANIMATION HORLOGE FISCALE */}
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
        @media (prefers-reduced-motion: reduce) {
          .clock-needle-anim,
          .clock-body-anim,
          .sparkle-cal {
            animation: none;
          }
        }
      `}</style>

      <PublicHeader />

      <main className="flex-1 w-full">
        {/* HERO SECTION SPLIT SCREEN */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 border-b border-border bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/ressources/guide-facturation-emecef-benin">
                    Ressources
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Calendrier fiscal 2026</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Colonne gauche : Copywriting clair et convertisseur */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                  Guide fiscal pratique 2026
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4 font-display">
                  Calendrier fiscal Bénin 2026 : toutes vos échéances DGI et CNSS
                </h1>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Anticipez chaque échéance importante : TVA du 10 du mois, cotisations CNSS et dépôt des comptes annuels au 30 avril. Consultez les dates officielles ou imprimez ce mémo pour votre équipe.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePrintMemo}
                    className="bg-primary text-ink font-bold px-7 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer le mémo</span>
                  </button>
                  <Link
                    href="/register"
                    className="bg-background-secondary text-ink font-bold px-7 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Tester gratuitement
                  </Link>
                </div>

                {downloadSuccess && (
                  <div className="mt-4 p-3 rounded-xl bg-background-secondary border border-border text-xs text-ink flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink shrink-0" />
                    <span>Fenêtre d&apos;impression ouverte pour enregistrer ou imprimer ce mémo.</span>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Conforme DGI Bénin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Échéances CNSS &amp; IPTS incluses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>À jour Loi de Finances 2026</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Photo réelle Expert-Comptable planning */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-xs">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/expert-comptable-benin.jpg"
                      alt="Expert-comptable béninois planifiant les clôtures fiscales de l'exercice à Cotonou"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
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

            <h2 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight">
              Toutes les échéances de l&apos;année fiscale maîtrisées
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto mt-1">
              Des déclarations mensuelles de TVA aux comptes annuels du 30 avril, votre calendrier vous protège des majorations et pénalités.
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
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight mb-2">
                  Chronologie des déclarations légales
                </h2>
                <p className="text-sm text-text-muted max-w-xl">
                  Filtrez les échéances par rythme pour organiser vos déclarations à l&apos;avance.
                </p>
              </div>

              {/* FILTRES INTERACTIFS */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterType("tous")}
                  className={`text-xs font-bold min-h-[44px] px-4 py-2 rounded-xl border transition-all cursor-pointer ${
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
                  className={`text-xs font-bold min-h-[44px] px-4 py-2 rounded-xl border transition-all cursor-pointer ${
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
                  className={`text-xs font-bold min-h-[44px] px-4 py-2 rounded-xl border transition-all cursor-pointer ${
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
                  className={`text-xs font-bold min-h-[44px] px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    filterType === "annuel"
                      ? "bg-ink text-background border-ink"
                      : "bg-background text-ink border-border hover:border-ink"
                  }`}
                >
                  Annuel (Bilan 30 Avril)
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
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                          {ech.organisme}
                        </span>
                        <span className="text-xs text-text-muted font-mono tabular-nums">
                          - Échéance : {ech.dateLimite}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-ink">
                        {ech.titre}
                      </h3>
                    </div>

                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted shrink-0 self-start">
                      {ech.frequence}
                    </span>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed mb-4">
                    {ech.description}
                  </p>

                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5 text-ink font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-ink shrink-0" />
                      <span>{ech.penalite}</span>
                    </span>
                    <span className="text-text-muted">Rappel automatique dans Ceilow</span>
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
                Méthode simple
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
                Trois habitudes pour aborder chaque mois sans stress
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Enregistrer vos reçus dès l&apos;achat
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Photographiez chaque ticket et créez vos factures au moment de la vente. Vous évitez de tout chercher en fin de mois et préparez le 10 du mois en quelques minutes.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Demander des factures officielles à vos fournisseurs
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Seules les factures d&apos;achat avec code QR e-MECeF et numéro IFU permettent de récupérer votre TVA. Pensez à vérifier ce code à chaque règlement.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Donner un accès à votre comptable
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Votre comptable suit vos chiffres directement sur Ceilow tout au long de l&apos;année. Le bilan du 30 avril se boucle sans mauvaise surprise de dernière minute.
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
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
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
                      aria-expanded={isOpen}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-ink text-base hover:bg-background-secondary/50 transition-colors cursor-pointer min-h-[48px]"
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

        {/* GUIDES PRATIQUES RESSOURCES */}
        <section className="py-14 bg-background border-t border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-1">
                Ressources complémentaires
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight">
                Approfondissez chaque règle DGI étape par étape
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/ressources/guide-facturation-emecef-benin"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-base font-bold text-ink group-hover:underline mb-1">
                    Guide de la facture normalisée e-MECeF au Bénin
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Groupes A à F, taux AIB (1 % / 5 %), avoirs FA et facturation sans boîtier physique.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-ink shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/ressources/guide-tva-benin"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-base font-bold text-ink group-hover:underline mb-1">
                    Guide de la déclaration TVA au Bénin (18 %)
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Seuil des 50 millions FCFA, TVA facturée vs récupérable, crédit reportable et dépôt du 10.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-ink shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/ressources/calcul-tps-benin-guide"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-base font-bold text-ink group-hover:underline mb-1">
                    Guide de calcul de la TPS au Bénin (5 %)
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Seuil 50 M FCFA, minimum 10 000 FCFA, acomptes du 10 février / 10 juin et solde du 30 avril.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-ink shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/ressources/plan-comptable-syscohada-pdf"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-base font-bold text-ink group-hover:underline mb-1">
                    Plan comptable SYSCOHADA révisé (PDF / CSV)
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Liste des classes 1 à 8, recherche par numéro, comptes TVA, CNSS et Mobile Money 585.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-ink shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/ressources/bareme-cotisations-cnss-benin"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-base font-bold text-ink group-hover:underline mb-1">
                    Barème des cotisations CNSS Bénin 2026
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Taux employeur (16,4 % à 19,4 %), part salarié (3,6 %), barème ITS, VPS 4 % et simulateur.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-ink shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* BANNIÈRE D'APPEL À L'ACTION */}
        <section className="py-16 bg-ink text-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight mb-4 text-background">
              Ne ratez plus jamais une date limite DGI ou CNSS.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Activez Ceilow pour votre entreprise et préparez vos déclarations à l&apos;avance en toute tranquillité.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary text-ink font-bold px-8 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>Créer un compte</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="bg-transparent text-background font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:border-white transition-all text-center min-h-[48px] flex items-center justify-center"
              >
                Voir la démo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
