"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Check,
  ShieldCheck,
  ArrowRight,
  FileText,
  PieChart,
  Layers,
  ChevronDown,
  ChevronUp,
  Scale,
  Building2,
  Users,
  Calendar,
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

export default function ComptabiliteSyscohadaPage() {
  const [activeJournal, setActiveJournal] = useState<"ventes" | "achats" | "banque" | "caisse">("ventes");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const journalsData = {
    ventes: {
      title: "Journal des Ventes (VE)",
      code: "VE-2026-03",
      entries: [
        { compte: "411100", libelle: "Client SOCOB S.A.", debit: "1 180 000", credit: "0" },
        { compte: "701000", libelle: "Ventes de marchandises", debit: "0", credit: "1 000 000" },
        { compte: "443100", libelle: "TVA facturée (18%)", debit: "0", credit: "180 000" },
      ],
      totalDebit: "1 180 000",
      totalCredit: "1 180 000",
      explication: "Généré automatiquement dès qu'une facture normalisée DGI est émise. Aucune ressaisie requise.",
    },
    achats: {
      title: "Journal des Achats (AC)",
      code: "AC-2026-03",
      entries: [
        { compte: "601100", libelle: "Achats matières premières", debit: "500 000", credit: "0" },
        { compte: "445100", libelle: "TVA déductible sur achats", debit: "90 000", credit: "0" },
        { compte: "401100", libelle: "Fournisseur Bénin Matériaux", debit: "0", credit: "590 000" },
      ],
      totalDebit: "590 000",
      totalCredit: "590 000",
      explication: "Alimenté par la saisie ou la photo de vos factures fournisseurs. La TVA récupérable est immédiatement isolée.",
    },
    banque: {
      title: "Journal de Banque BOA (BQ)",
      code: "BQ-2026-03",
      entries: [
        { compte: "521100", libelle: "Banque BOA Bénin", debit: "1 180 000", credit: "0" },
        { compte: "411100", libelle: "Règlement Client SOCOB", debit: "0", credit: "1 180 000" },
      ],
      totalDebit: "1 180 000",
      totalCredit: "1 180 000",
      explication: "Écritures de règlement générées dès que le rapprochement bancaire ou le virement est validé.",
    },
    caisse: {
      title: "Journal Caisse & Mobile Money (CA)",
      code: "CA-2026-03",
      entries: [
        { compte: "571200", libelle: "Compte Marchand MTN MoMo", debit: "354 000", credit: "0" },
        { compte: "411200", libelle: "Encaissement Client Particulier", debit: "0", credit: "354 000" },
      ],
      totalDebit: "354 000",
      totalCredit: "354 000",
      explication: "Vos encaissements rapides sur points de vente enregistrés au centime près sans écarts de caisse.",
    },
  };

  const faqItems = [
    {
      q: "Ceilow respecte-t-il le Plan Comptable Général OHADA Révisé ?",
      a: "Oui, à 100%. L'arborescence des comptes de Ceilow est strictement calquée sur l'Acte uniforme relatif au droit comptable et à l'information financière (AUDCIF / SYSCOHADA Révisé). Les comptes de classe 1 à 8 sont préconfigurés pour le contexte béninois.",
    },
    {
      q: "Mon comptable peut-il continuer à utiliser son logiciel habituel ?",
      a: "Absolument. Ceilow ne remplace pas votre expert-comptable, il lui simplifie la vie. Vous pouvez lui créer un accès gratuit ou lui envoyer un export universel (format Excel, CSV ou FEC) directement importable dans ses logiciels (Sage, SARI, Cegid).",
    },
    {
      q: "Comment est calculée la TVA due en fin de mois ?",
      a: "Ceilow compare en temps réel la TVA collectée sur vos factures de vente (compte 443) et la TVA déductible sur vos achats justifiés (compte 445). Le montant net à payer aux impôts avant le 10 du mois est affiché en direct sur votre tableau de bord.",
    },
    {
      q: "Que contient la liasse DSF générée par Ceilow ?",
      a: "La Déclaration Statistique et Fiscale (DSF) regroupe le bilan (actif et passif), le compte de résultat, le tableau des flux de trésorerie et les notes annexes conformes au système normal ou au système allégé OHADA pour votre dépôt annuel au 30 avril.",
    },
    {
      q: "Puis-je verrouiller les écritures après validation ?",
      a: "Oui. Conformément aux principes de l'audit comptable, dès qu'une période est clôturée ou validée, les écritures sont définitivement figées dans un journal horodaté infalsifiable pour prévenir tout risque de double écriture ou de modification frauduleuse.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      <PublicHeader className="sticky top-0 z-50 w-full" />

      <main className="flex-1 w-full overflow-hidden">
        {/* Style inline pour animations vectorielles douces sans glassmorphisme */}
        <style jsx global>{`
          @keyframes balanceSway {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(2deg); }
            75% { transform: rotate(-2deg); }
          }
          @keyframes plateLeft {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(4px); }
            75% { transform: translateY(-4px); }
          }
          @keyframes plateRight {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-4px); }
            75% { transform: translateY(4px); }
          }
          @keyframes popScaleSparkle {
            0%, 45% { transform: scale(0) rotate(0deg); opacity: 0; }
            55% { transform: scale(1.3) rotate(45deg); opacity: 1; }
            70% { transform: scale(1) rotate(90deg); opacity: 1; }
            85%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
          }
          .balance-beam {
            animation: balanceSway 4.5s ease-in-out infinite;
            transform-origin: 130px 42px;
          }
          .plate-left-anim {
            animation: plateLeft 4.5s ease-in-out infinite;
            transform-origin: center top;
          }
          .plate-right-anim {
            animation: plateRight 4.5s ease-in-out infinite;
            transform-origin: center top;
          }
          .sparkle-scale {
            fill: #FFD946; stroke: #332E29; stroke-width: 1;
            animation: popScaleSparkle 4.5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .balance-beam,
            .plate-left-anim,
            .plate-right-anim,
            .sparkle-scale {
              animation: none;
            }
          }
        `}</style>

        {/* 1. HERO SECTION SPLIT SCREEN */}
        <section className="w-full py-14 lg:py-20 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/fonctionnalites">Fonctionnalités</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Comptabilité SYSCOHADA</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Colonne gauche : Promesse de valeur & Copywriting */}
              <div className="lg:col-span-7 flex flex-col items-start space-y-6">
                
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted">
                  Plan comptable OHADA révisé (SYSCOHADA)
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-ink leading-[1.12] tracking-tight">
                  Le logiciel comptable SYSCOHADA sans saisie manuelle
                </h1>

                <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
                  Tenez votre comptabilité au Bénin sans tout recopier à la main : grand livre, balance, écritures de ventes et d&apos;achats créés automatiquement pour préparer sereinement votre bilan annuel.
                </p>

                <p className="text-sm text-text-muted">
                  <span className="font-semibold text-ink">Lisible pour tous :</span> vous suivez vos chiffres et vos marges sans avoir besoin d&apos;être comptable.
                </p>

                {/* 3 Garanties directes */}
                <div className="flex flex-col space-y-3 pt-1 w-full">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Journaux des ventes, achats, banque et caisse mis à jour en direct
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Balance générale et résultat net actualisés après chaque opération
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Accès gratuit et exports propres pour votre comptable
                    </span>
                  </div>
                </div>

                {/* Double CTA d'action directe */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl transition-all shadow-xs min-h-[48px]"
                  >
                    <span>Tester gratuitement</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>

                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center border border-border bg-background hover:bg-background-secondary text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all min-h-[48px]"
                  >
                    <span>Voir la démo</span>
                  </Link>
                </div>

                <div className="text-xs text-text-muted flex items-center gap-2 pt-1">
                  <ShieldCheck className="w-4 h-4 text-success-deep shrink-0" />
                  <span>Conforme aux normes SYSCOHADA révisées (zone UEMOA / Bénin)</span>
                </div>
              </div>

              {/* Colonne droite : Démonstrateur interactif des 4 journaux */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="w-full max-w-md bg-background rounded-2xl border-2 border-primary shadow-xs p-6 space-y-4">
                  
                  {/* Sélecteur de journal interactif */}
                  <div>
                    <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                      Sélectionnez un journal comptable
                    </div>
                    <div className="grid grid-cols-4 gap-1 p-1 bg-background-secondary rounded-xl border border-border text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setActiveJournal("ventes")}
                        className={`min-h-[44px] py-2 rounded-lg transition-colors cursor-pointer ${
                          activeJournal === "ventes" ? "bg-background text-ink shadow-xs" : "text-text-muted hover:text-ink"
                        }`}
                      >
                        Ventes
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveJournal("achats")}
                        className={`min-h-[44px] py-2 rounded-lg transition-colors cursor-pointer ${
                          activeJournal === "achats" ? "bg-background text-ink shadow-xs" : "text-text-muted hover:text-ink"
                        }`}
                      >
                        Achats
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveJournal("banque")}
                        className={`min-h-[44px] py-2 rounded-lg transition-colors cursor-pointer ${
                          activeJournal === "banque" ? "bg-background text-ink shadow-xs" : "text-text-muted hover:text-ink"
                        }`}
                      >
                        Banque
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveJournal("caisse")}
                        className={`min-h-[44px] py-2 rounded-lg transition-colors cursor-pointer ${
                          activeJournal === "caisse" ? "bg-background text-ink shadow-xs" : "text-text-muted hover:text-ink"
                        }`}
                      >
                        MoMo
                      </button>
                    </div>
                  </div>

                  {/* Tableau des écritures du journal actif */}
                  <div className="bg-background-secondary p-4 rounded-xl border border-border space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="font-bold text-ink">{journalsData[activeJournal].title}</div>
                      <span className="font-mono text-text-muted">{journalsData[activeJournal].code}</span>
                    </div>

                    <div className="space-y-1.5 font-mono">
                      <div className="grid grid-cols-12 text-text-muted font-bold text-[10px] pb-1 border-b border-border">
                        <span className="col-span-3">Compte</span>
                        <span className="col-span-5">Libellé</span>
                        <span className="col-span-2 text-right">Débit</span>
                        <span className="col-span-2 text-right">Crédit</span>
                      </div>

                      {journalsData[activeJournal].entries.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 text-ink text-[11px] items-center">
                          <span className="col-span-3 font-bold text-ink">{item.compte}</span>
                          <span className="col-span-5 truncate text-text-muted">{item.libelle}</span>
                          <span className="col-span-2 text-right tabular-nums">
                            {item.debit !== "0" ? item.debit : ""}
                          </span>
                          <span className="col-span-2 text-right tabular-nums">
                            {item.credit !== "0" ? item.credit : ""}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Équilibre Débit / Crédit certifié */}
                    <div className="pt-2 border-t border-border flex items-center justify-between font-mono text-xs font-bold text-ink">
                      <span>Totaux équilibrés (FCFA)</span>
                      <div className="flex gap-4">
                        <span className="tabular-nums">{journalsData[activeJournal].totalDebit}</span>
                        <span className="tabular-nums">{journalsData[activeJournal].totalCredit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Explication concrète pour le non-comptable */}
                  <div className="p-3.5 bg-background rounded-xl border border-border text-xs text-text-muted space-y-1">
                    <div className="font-semibold text-ink flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-primary balance-icon" />
                      <span>Équilibre débit et crédit automatique</span>
                    </div>
                    <p className="leading-relaxed">
                      {journalsData[activeJournal].explication}
                    </p>
                  </div>

                  {/* Statut comptable sobre */}
                  <div className="p-2.5 rounded-lg bg-background-secondary border border-border text-ink font-semibold text-xs flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-success-deep stroke-[2.5] shrink-0" />
                    <span>Conformité SYSCOHADA validée sans calcul manuel</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 2. RUBAN DE RÉASSURANCE PROFESSIONNELLE (4 Colonnes) ── */}
        <section className="w-full bg-background-secondary border-b border-border py-8">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border">
              
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-ink">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Classes 1 à 8</div>
                  <p className="text-xs text-text-muted">Plan comptable général SYSCOHADA Révisé intégré</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-ink">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Balance en direct</div>
                  <p className="text-xs text-text-muted">Balance générale à 6 colonnes actualisée en temps réel</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-ink">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Piste d&apos;audit</div>
                  <p className="text-xs text-text-muted">Chaque écriture est horodatée et inaltérable</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-ink">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">DSF au 30 avril</div>
                  <p className="text-xs text-text-muted">Liasse fiscale et états financiers préparés sans retard</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 2B. ANIMATION LOTTIE-LIKE SVG : LA BALANCE COMPTABLE SYSCOHADA ── */}
        <section className="py-14 bg-background border-b border-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-64 h-44 mx-auto mb-3 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 260 170" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Socle et colonne de la balance */}
                <rect x="100" y="142" width="60" height="12" rx="4" fill="#332E29" />
                <rect x="126" y="42" width="8" height="102" fill="#332E29" />
                <circle cx="130" cy="42" r="6" fill="#FFD946" stroke="#332E29" strokeWidth="2" />

                {/* Fléau oscillant de la balance */}
                <g className="balance-beam">
                  <line x1="30" y1="42" x2="230" y2="42" stroke="#332E29" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Câbles et plateau gauche (Débit) */}
                  <g className="plate-left-anim">
                    <line x1="45" y1="42" x2="25" y2="88" stroke="#8A857D" strokeWidth="1.5" />
                    <line x1="45" y1="42" x2="65" y2="88" stroke="#8A857D" strokeWidth="1.5" />
                    <path d="M 15 88 Q 45 106 75 88 Z" fill="#FFD946" stroke="#332E29" strokeWidth="2" />
                    <text x="45" y="82" textAnchor="middle" fill="#332E29" fontSize="8" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      DÉBIT
                    </text>
                  </g>

                  {/* Câbles et plateau droit (Crédit) */}
                  <g className="plate-right-anim">
                    <line x1="215" y1="42" x2="195" y2="88" stroke="#8A857D" strokeWidth="1.5" />
                    <line x1="215" y1="42" x2="235" y2="88" stroke="#8A857D" strokeWidth="1.5" />
                    <path d="M 185 88 Q 215 106 245 88 Z" fill="#5FFFC2" stroke="#332E29" strokeWidth="2" />
                    <text x="215" y="82" textAnchor="middle" fill="#332E29" fontSize="8" fontWeight="bold" fontFamily="'Inter', sans-serif">
                      CRÉDIT
                    </text>
                  </g>
                </g>

                {/* Sceau d'équilibre SYSCOHADA */}
                <g transform="translate(130, 115)">
                  <circle cx="0" cy="0" r="16" fill="#FDFBF7" stroke="#332E29" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#332E29" fontSize="8" fontWeight="900" fontFamily="'Inter', sans-serif">
                    = 0 F
                  </text>
                </g>

                {/* Étoiles scintillantes */}
                <g className="sparkle-scale" transform="translate(30, 25)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-scale" style={{ animationDelay: "1.2s" }} transform="translate(230, 25)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight">
              Des comptes équilibrés, sans calcul manuel
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto mt-1">
              Chaque mouvement équilibre automatiquement les débits et les crédits selon le plan SYSCOHADA. Votre balance reste juste en permanence.
            </p>
          </div>
        </section>

        {/* 3. LES 3 GRANDES SIMPLIFICATIONS COMPTABLES */}
        <section className="w-full py-16 lg:py-20 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted">
                Gestion simplifiée
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-ink tracking-tight mt-3">
                Vous gérez vos ventes, Ceilow tient vos comptes
              </h2>
              <p className="text-sm sm:text-base text-text-muted mt-2 leading-relaxed">
                Découvrez comment Ceilow transforme vos factures et reçus quotidiens en comptabilité propre et prête pour votre comptable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Carte 1 : Les 4 journaux */}
              <div className="bg-background-secondary rounded-2xl border border-border p-6 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-ink mb-5">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-ink mb-2">
                    4 journaux comptables tenus automatiquement
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Chaque facture part au journal des ventes, chaque achat au journal des achats, et chaque mouvement bancaire au journal de trésorerie. Zéro ressaisie en fin de mois.
                  </p>
                </div>
                <div className="p-3 bg-background rounded-xl border border-border text-xs text-ink font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-success-deep shrink-0" />
                  <span>Ventes, achats, banque et caisse reliés</span>
                </div>
              </div>

              {/* Carte 2 : États financiers */}
              <div className="bg-background-secondary rounded-2xl border border-border p-6 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-ink mb-5">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-ink mb-2">
                    Votre résultat net visible en direct
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Ne devinez plus si votre activité dégage du bénéfice. Ceilow suit votre chiffre d&apos;affaires hors taxes, vos dépenses et votre résultat au jour le jour.
                  </p>
                </div>
                <div className="p-3 bg-background rounded-xl border border-border text-xs text-ink font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-success-deep shrink-0" />
                  <span>Compte de résultat et balance en 1 clic</span>
                </div>
              </div>

              {/* Carte 3 : Espace expert-comptable */}
              <div className="bg-background-secondary rounded-2xl border border-border p-6 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-ink mb-5">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-ink mb-2">
                    Un lien direct avec votre comptable
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6">
                    Votre expert-comptable accède gratuitement à votre dossier pour vérifier vos pièces et exporter les données aux formats Excel, CSV ou FEC.
                  </p>
                </div>
                <div className="p-3 bg-background rounded-xl border border-border text-xs text-ink font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-success-deep shrink-0" />
                  <span>Exports compatibles Sage et logiciels de cabinet</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3B. SECTION PHOTO : COLLABORATION COMPTABLE */}
        <section className="w-full py-16 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background shadow-xs">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/collaboration-comptable.jpg"
                      alt="Dirigeant et expert-comptable travaillant sur le grand livre SYSCOHADA à Cotonou"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border">
                    <p className="text-xs font-semibold text-ink">
                      &laquo; Mon comptable se connecte directement à mon dossier. Fini les classeurs à lui déposer en fin de mois. &raquo;
                    </p>
                    <p className="text-[11px] text-text-muted mt-1">
                      Témoignage illustratif - Distribution alimentaire à Ganhi, Cotonou
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col items-start space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted">
                  Accès cabinet inclus gratuitement
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                  Travaillez main dans la main avec votre expert-comptable
                </h2>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Donnez accès à votre cabinet comptable en un clic. Il consulte vos journaux, télécharge vos justificatifs et prépare la révision annuelle sans vous faire perdre de temps.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
                  <div className="p-3.5 rounded-xl bg-background border border-border">
                    <div className="font-bold text-ink text-sm">Exports universels</div>
                    <p className="text-xs text-text-muted mt-1">Formats Sage, Excel et FEC SYSCOHADA compatibles avec tous les outils de cabinet.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background border border-border">
                    <div className="font-bold text-ink text-sm">Historique vérifiable</div>
                    <p className="text-xs text-text-muted mt-1">Chaque saisie ou modification garde sa date, son heure et le nom de l&apos;auteur.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-xs min-h-[44px]"
                  >
                    <span>Créer un compte</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SECTION AUTORITÉ SOMBRE */}
        <section className="w-full bg-ink text-white py-16 lg:py-20 border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Des comptes solides pour convaincre banques et partenaires
              </h2>
              <p className="text-sm sm:text-base text-white/70 mt-2">
                Présentez des états financiers clairs et fiables à tout moment de l&apos;année.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-ink-surface border border-ink-border p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-ink flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Bilan &amp; liasse DSF prêts</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Bilan actif, passif, compte de résultat et annexes générés au format demandé pour votre dépôt annuel du 30 avril.
                </p>
              </div>

              <div className="bg-ink-surface border border-ink-border p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-ink flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Contrôle des justificatifs</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Chaque écriture est reliée à sa facture ou son reçu scanné, avec un journal des modifications verrouillé.
                </p>
              </div>

              <div className="bg-ink-surface border border-ink-border p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-ink flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Dossiers bancaires rapides</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Exportez en quelques secondes votre balance et vos comptes de résultat propres lorsque vous demandez un crédit.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 4 BIS. MAILLAGE INTERNE CONTEXTUEL */}
        <section className="w-full py-12 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-wider text-text-muted font-bold">
                Suite complète
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-ink mt-1">
                La comptabilité reliée à toute votre gestion
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/solutions/facturation-dgi"
                className="p-5 rounded-xl bg-background border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Facturation normalisée DGI</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Créez vos factures e-MECeF avec QR code officiel. Chaque vente s&apos;inscrit aussitôt dans vos comptes.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir la facturation
                </span>
              </Link>

              <Link
                href="/solutions/declarations-fiscales"
                className="p-5 rounded-xl bg-background border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Déclarations fiscales DGI</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Préparez votre TVA mensuelle, vos impôts et votre bilan annuel prêts pour le dépôt à la DGI Bénin.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir les déclarations
                </span>
              </Link>

              <Link
                href="/pour-qui/cabinets-comptables"
                className="p-5 rounded-xl bg-background border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Espace cabinets comptables</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Invitez votre cabinet pour réviser vos écritures, pointer vos règlements et clôturer votre exercice.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir l&apos;espace cabinet
                </span>
              </Link>

              <Link
                href="/ressources/plan-comptable-syscohada-pdf"
                className="p-5 rounded-xl bg-background border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Plan comptable SYSCOHADA</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Consultez, recherchez et imprimez la liste complète des comptes (classes 1 à 8) adaptée au Bénin.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Consulter le plan
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. FAQ SPÉCIALISÉE COMPTABILITÉ & SYSCOHADA */}
        <section className="w-full py-16 lg:py-20 bg-background border-b border-border">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-wider text-text-muted font-bold">
                Réponses claires
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink mt-2">
                Questions fréquentes sur la comptabilité SYSCOHADA
              </h2>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, index) => {
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
          </div>
        </section>

        {/* 6. BANNIÈRE DE CONVERSION FINALE */}
        <section className="w-full bg-ink text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mb-4 font-bold shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mb-3 tracking-tight">
              Prenez le contrôle de vos comptes dès aujourd&apos;hui
            </h2>

            <p className="text-sm sm:text-base text-white/75 max-w-xl mb-8 leading-relaxed">
              Testez Ceilow sans engagement. Vos écritures comptables s&apos;enregistrent dès votre première facture.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-ink text-sm font-bold rounded-xl shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>Créer un compte</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto px-8 py-3.5 bg-ink-surface text-white border border-ink-border text-sm font-bold rounded-xl hover:bg-ink-border transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>Voir la démo</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-xs mt-6 pt-4 border-t border-ink-border">
              <span>14 jours offerts sans carte bancaire</span>
              <span>Sans engagement</span>
              <span>Équipe disponible à Cotonou</span>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
