"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  ArrowRight,
  Check,
  Users,
  Layers,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Sliders,
  FileCheck,
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
      q: "Ceilow remplace-t-il les logiciels comptables habituels du cabinet ?",
      a: "Non, Ceilow facilite la collecte avant votre travail de révision. Il recueille les pièces justificatives, normalise les factures DGI et prépare les écritures SYSCOHADA. Vous exportez ensuite le grand livre et les journaux dans votre logiciel habituel (Sage, Saari, Excel ou FEC) sans ressaisie.",
    },
    {
      q: "Comment sont gérés les accès pour mes collaborateurs ?",
      a: "Votre espace cabinet permet d'inviter chefs de mission et collaborateurs avec des droits précis. Vous attribuez chaque portefeuille client aux bonnes personnes et suivez l'avancement en direct.",
    },
    {
      q: "Le cabinet peut-il regrouper l'abonnement de ses clients ?",
      a: "Oui. L'offre partenaire cabinet vous permet de gérer plusieurs entreprises à tarif dégressif, ou de laisser vos clients s'abonner directement tout en gardant votre accès superviseur gratuit.",
    },
    {
      q: "L'outil respecte-t-il les règles de la profession comptable au Bénin ?",
      a: "Oui. Ceilow suit le plan comptable SYSCOHADA révisé et les exigences de facturation DGI afin d'aider les professionnels du chiffre au Bénin dans la révision et le dépôt annuel.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      <style jsx>{`
        /* Animation vectorielle : Cartable & dossiers d'audit */
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
        @media (prefers-reduced-motion: reduce) {
          .folder-slide,
          .stamp-seal,
          .sparkle-star {
            animation: none;
          }
        }
      `}</style>

      <PublicHeader />

      <main className="flex-1 w-full">
        {/* HERO SECTION EN SPLIT SCREEN AVEC PHOTO LOCALE */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 border-b border-border bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Cabinets comptables</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* COLONNE GAUCHE : TEXTE & ACTIONS */}
              <div className="lg:col-span-7">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                  Espace professionnels du chiffre
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-ink leading-tight mb-6">
                  Le logiciel pour cabinet comptable au Bénin qui facilite le suivi client
                </h1>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8">
                  Libérez vos équipes de la chasse aux tickets papier. Avec ce <strong>logiciel pour cabinet comptable au Bénin</strong> relié au plan SYSCOHADA révisé et à la DGI, vos clients saisissent leurs opérations e-MECeF au quotidien et vous révisez leurs dossiers sans rien recopier.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    href="/register"
                    className="bg-primary text-ink font-bold px-6 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Ouvrir un espace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-background-secondary text-ink font-bold px-6 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Planifier un échange
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Portail multi-dossiers illimité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Conforme SYSCOHADA révisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Exports Sage, FEC et Excel</span>
                  </div>
                </div>
              </div>

              {/* COLONNE DROITE : PHOTO EXPERT-COMPTABLE BENIN */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-md">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/expert-comptable-benin.jpg"
                      alt="Expert-comptable dans son cabinet à Cotonou au Bénin"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-ink block">Cabinet d&apos;expertise comptable</span>
                      <span className="text-[11px] text-text-muted">Cotonou, Bénin (illustration)</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-ink shrink-0">
                      SYSCOHADA révisé
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION INTERACTIVE AVEC ANIMATION VECTORIELLE SVG */}
        <section className="py-16 md:py-20 bg-background border-b border-border">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* ILLUSTRATION SVG ANIMÉE SUR MESURE */}
            <div className="w-56 h-44 mx-auto mb-4 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 240 180" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Cartable d'audit */}
                <rect x="40" y="55" width="160" height="105" rx="12" fill="#332E29" stroke="#332E29" strokeWidth="2.5" />
                <rect x="45" y="60" width="150" height="95" rx="8" fill="#F5F4F2" stroke="#D8D5D0" strokeWidth="1.5" />
                {/* Poignée mallette */}
                <path d="M 95 55 C 95 38, 145 38, 145 55" fill="none" stroke="#332E29" strokeWidth="3" strokeLinecap="round" />
                
                {/* Dossiers clients qui défilent */}
                <g className="folder-slide">
                  <rect x="65" y="75" width="110" height="65" rx="6" fill="#FFFFFF" stroke="#332E29" strokeWidth="2" />
                  <line x1="78" y1="90" x2="140" y2="90" stroke="#332E29" strokeWidth="2" strokeLinecap="round" />
                  <line x1="78" y1="102" x2="160" y2="102" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="78" y1="114" x2="125" y2="114" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="78" y="123" width="35" height="10" rx="3" fill="#FFD946" />
                </g>

                {/* Sceau OHADA */}
                <g className="stamp-seal">
                  <circle cx="170" cy="70" r="22" fill="#FFD946" stroke="#332E29" strokeWidth="2.5" />
                  <circle cx="170" cy="70" r="17" fill="none" stroke="#332E29" strokeWidth="1" strokeDasharray="3 2" />
                  <text x="170" y="73" fill="#332E29" fontFamily="'Inter', sans-serif" fontSize="7" fontWeight="900" textAnchor="middle">
                    OHADA
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

            <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight mb-3">
              Fini la relance de pièces égarées en fin de mois
            </h2>
            <p className="text-base text-text-muted max-w-xl mx-auto mb-6">
              Vos clients déposent leurs reçus au fur et à mesure depuis leur téléphone. Ceilow prépare les écritures pour que votre cabinet se concentre sur la révision et le conseil.
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
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight mb-3">
                Simulez votre tarif dégressif selon vos dossiers
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-2xl">
                Plus vous regroupez de clients sur Ceilow, plus le coût par dossier diminue. L&apos;accès pour votre équipe reste gratuit.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* CURSEUR DOSSIERS (GAUCHE) */}
              <div className="lg:col-span-6 bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <h3 className="text-base font-bold text-ink mb-6 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-ink" />
                  <span>Taille de votre portefeuille clients</span>
                </h3>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <label htmlFor="nb-dossiers-range" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Entreprises clientes actives
                    </label>
                    <span className="text-2xl font-bold font-mono text-ink tabular-nums">
                      {nbDossiers} dossiers
                    </span>
                  </div>
                  <input
                    id="nb-dossiers-range"
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
                    <span className="text-xs text-text-muted">Tarif indicatif par dossier client :</span>
                    <span className="font-mono font-bold text-sm text-ink tabular-nums">
                      {formatFcfa(prixUnitaire)} / mois
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted">Comptes collaborateurs cabinet :</span>
                    <span className="font-bold text-xs text-ink">Illimités &amp; gratuits</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted">Gain de temps estimé en saisie :</span>
                    <span className="font-bold text-xs text-ink">Environ {heuresGagnees}h / mois</span>
                  </div>
                </div>
              </div>

              {/* CARTE DE SYNTHÈSE TARIFAIRE (DROITE) */}
              <div className="lg:col-span-6 bg-background p-6 sm:p-8 rounded-2xl border-2 border-primary">
                <div className="flex justify-between items-center pb-6 mb-6 border-b border-border gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                      Offre cabinet partenaire
                    </span>
                    <h4 className="text-xl font-bold text-ink">
                      Portail multi-dossiers cabinet
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-bold font-mono text-ink tabular-nums block">
                      {formatFcfa(totalMensuel)}
                    </span>
                    <span className="text-[11px] text-text-muted">estimation mensuelle HT</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Vue d&apos;ensemble sur tous vos dossiers clients.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Récupération continue des factures scannées et écritures de ventes.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Export FEC et fichiers compatibles Sage, Excel ou votre outil interne.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Accompagnement dédié avec un conseiller basé à Cotonou.</span>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="w-full bg-primary text-ink font-bold text-sm py-3.5 px-4 rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Activer mon accès</span>
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
                Conçu pour les cabinets
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
                Les outils dédiés à votre équipe comptable
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Suivi multi-entreprises
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Passez d&apos;un client à un autre en un clic sans vous reconnecter. Voyez où en sont les déclarations et bilans de chaque dossier.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Droits par collaborateur
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Affectez chaque dossier au bon responsable et choisissez qui peut consulter, modifier ou valider les clôtures.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <FileSpreadsheet className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Export FEC &amp; bilan DSF
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Exportez vos journaux et balances au format attendu pour vos dépôts SYSCOHADA avant le 30 avril.
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
                Tout savoir sur l&apos;utilisation au sein de votre cabinet
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

        {/* MAILLAGE INTERNE CONTEXTUEL */}
        <section className="py-16 md:py-20 bg-background border-t border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Outils pour votre cabinet
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
                Les outils Ceilow dédiés à la tenue et à la révision
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/solutions/comptabilite-syscohada"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <FileSpreadsheet className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2 group-hover:underline transition-colors">
                  Comptabilité SYSCOHADA révisée
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Éditez bilans, comptes de résultat et balances à 6 colonnes conformes aux règles UEMOA.
                </p>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Voir la comptabilité <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/solutions/declarations-fiscales"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <FileCheck className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2 group-hover:underline transition-colors">
                  Déclarations DGI &amp; bilan
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Préparez la TVA mensuelle, l&apos;AIB et les liasses DSF annuelles sans erreur de calcul.
                </p>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Voir la fiscalité <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/contact"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Building2 className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2 group-hover:underline transition-colors">
                  Partenariat cabinet dédié
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Bénéficiez d&apos;un accompagnement personnalisé pour accueillir vos dossiers et former vos équipes.
                </p>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Nous contacter <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* BANNIÈRE D'APPEL À L'ACTION */}
        <section className="py-16 bg-ink text-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight mb-4 text-background">
              Modernisez le suivi de vos clients PME dès cette semaine.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Échangez avec notre équipe à Cotonou ou ouvrez votre premier dossier de test gratuitement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary text-ink font-bold px-8 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>Ouvrir un espace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="bg-transparent text-background font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:border-white transition-all text-center min-h-[48px] flex items-center justify-center"
              >
                Planifier un échange
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
