"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Scan,
  ArrowRight,
  Check,
  Camera,
  Receipt,
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

export default function GestionDepensesPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<boolean>(false);

  const lancerScan = () => {
    setIsScanning(true);
    setScannedResult(false);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(true);
    }, 1200);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Une photo de reçu sur téléphone est-elle valable lors d'un contrôle au Bénin ?",
      a: "Oui, si elle reste parfaitement lisible, datée et sans retouche. Ceilow conserve votre photo originale avec sa date d'enregistrement pendant la durée légale de 10 ans.",
    },
    {
      q: "Comment Ceilow retrouve-t-il la TVA déductible et l'AIB ?",
      a: "La lecture automatique repère la TVA (18 %) et les retenues AIB (1 %, 3 % ou 5 %) imprimées sur la facture du fournisseur. Ces montants alimentent aussitôt votre préparation TVA du mois.",
    },
    {
      q: "Mes salariés en déplacement peuvent-ils envoyer leurs reçus ?",
      a: "Oui, vos collaborateurs prennent en photo leurs reçus de carburant, repas ou transport depuis leur téléphone. Vous validez la dépense avant son passage en comptabilité.",
    },
    {
      q: "Que faire si un ticket papier est froissé ou un peu effacé ?",
      a: "Ceilow surligne les informations incertaines pour que vous puissiez vérifier et corriger un chiffre en un clic avant de valider.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      {/* STYLE DÉDIÉ ANIMATION SCAN DE DÉPENSES */}
      <style jsx global>{`
        @keyframes scanLaser {
          0% { transform: translateY(15px); opacity: 0.3; }
          50% { transform: translateY(85px); opacity: 0.95; }
          100% { transform: translateY(15px); opacity: 0.3; }
        }
        @keyframes receiptFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes sparkleScanPop {
          0%, 45% { transform: scale(0) rotate(0deg); opacity: 0; }
          55% { transform: scale(1.3) rotate(45deg); opacity: 1; }
          70% { transform: scale(1) rotate(90deg); opacity: 1; }
          85%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        .laser-sweep-anim {
          animation: scanLaser 2.4s ease-in-out infinite;
        }
        .receipt-anim {
          animation: receiptFloat 3s ease-in-out infinite;
        }
        .sparkle-scan {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: sparkleScanPop 3s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .laser-sweep-anim,
          .receipt-anim,
          .sparkle-scan {
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
                  <BreadcrumbLink href="/fonctionnalites">Fonctionnalités</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Gestion des dépenses</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Colonne gauche : Copywriting clair et convertisseur */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                  Achats &amp; reçus de dépenses au Bénin
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4 font-display">
                  Gestion des notes de frais et reçus par photo au Bénin
                </h1>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Ne perdez plus vos tickets papier au fond d&apos;un sac. Prenez vos factures fournisseurs en photo : Ceilow lit automatiquement le nom du commerçant, le montant HT et la TVA déductible (18 %) par reconnaissance optique (OCR).
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/register"
                    className="bg-primary text-ink font-bold px-7 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Tester gratuitement</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="bg-background-secondary text-ink font-bold px-7 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Voir la démo
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Photo simple depuis votre mobile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Calcul TVA 18 % &amp; AIB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Archivage conservé 10 ans</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Photo réelle Dirigeante Entreprise Cotonou */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-xs">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/dirigeante-benin.jpg"
                      alt="Dirigeante d'entreprise à Cotonou numérisant ses justificatifs de dépenses"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Reçu enregistré et classé</span>
                      <span className="text-success-deep font-semibold">TVA 18 % lue</span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Photo d&apos;origine conservée pendant la durée légale de 10 ans.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION ANIMATION SVG LOTTIE-LIKE : SMARTPHONE SCANNER DE REÇU ── */}
        <section className="py-14 bg-background border-b border-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-60 h-44 mx-auto mb-3 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 260 170" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Reçu papier qui lévite */}
                <g className="receipt-anim" transform="translate(40, 20)">
                  <rect x="0" y="0" width="80" height="120" rx="4" fill="#FFFFFF" stroke="#332E29" strokeWidth="2" />
                  <rect x="8" y="10" width="64" height="10" rx="2" fill="#FFD946" />
                  <line x1="10" y1="28" x2="70" y2="28" stroke="#332E29" strokeWidth="2" strokeLinecap="round" />
                  <line x1="10" y1="38" x2="60" y2="38" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="10" y1="48" x2="65" y2="48" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="10" y1="58" x2="55" y2="58" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="8" y1="72" x2="72" y2="72" stroke="#8A857D" strokeWidth="1" strokeDasharray="3 2" />
                  <text x="40" y="90" textAnchor="middle" fill="#332E29" fontSize="7" fontWeight="bold" fontFamily="'Inter', sans-serif">
                    TOTAL TTC
                  </text>
                  <text x="40" y="104" textAnchor="middle" fill="#332E29" fontSize="8" fontWeight="900" fontFamily="'Inter', sans-serif">
                    45 000 FCFA
                  </text>
                </g>

                {/* Smartphone scanner en superposition */}
                <g transform="translate(130, 15)">
                  <rect x="0" y="0" width="80" height="135" rx="10" fill="#332E29" stroke="#332E29" strokeWidth="2" />
                  <rect x="5" y="8" width="70" height="112" rx="6" fill="#1C1917" />
                  {/* Viseur caméra */}
                  <rect x="12" y="20" width="56" height="85" rx="4" fill="none" stroke="#FFD946" strokeWidth="1.5" strokeDasharray="6 3" />
                  {/* Faisceau laser animé */}
                  <g className="laser-sweep-anim">
                    <line x1="10" y1="20" x2="70" y2="20" stroke="#5FFFC2" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                  {/* Badge vert montant détecté */}
                  <rect x="16" y="86" width="48" height="14" rx="3" fill="#5FFFC2" />
                  <text x="40" y="96" textAnchor="middle" fill="#332E29" fontSize="7" fontWeight="900" fontFamily="'Inter', sans-serif">
                    ✓ 45 000 F
                  </text>
                  <circle cx="40" cy="126" r="3.5" fill="#8A857D" />
                </g>

                {/* Étoiles scintillantes */}
                <g className="sparkle-scan" transform="translate(30, 25)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-scan" style={{ animationDelay: "1s" }} transform="translate(230, 75)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight">
              Une photo et votre reçu est déjà classé
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto mt-1">
              La lecture automatique relève le fournisseur, la date, le montant hors taxes et la TVA déductible sans rien retaper.
            </p>
          </div>
        </section>

        {/* SECTION INTERACTIVE : DÉMONSTRATION DE SCAN OCR */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Démonstrateur interactif
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight mb-3">
                Voyez comment Ceilow lit un ticket d&apos;achat à Cotonou
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-2xl">
                Cliquez sur &laquo; Scanner ce ticket &raquo; pour tester la lecture automatique des lignes et de la TVA.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* REÇU SIMULÉ (GAUCHE) */}
              <div className="lg:col-span-5 bg-background p-6 sm:p-8 rounded-2xl border border-border relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-ink" />
                    <span className="text-xs font-bold text-ink uppercase">Ticket d&apos;achat fournisseur</span>
                  </div>
                  <span className="text-[11px] font-mono text-text-muted">Édité à Ganhi</span>
                </div>

                <div className="space-y-3 font-mono text-xs text-text-muted pb-4 border-b border-border border-dashed">
                  <div className="text-center font-bold text-ink text-sm">
                    PAPETERIE MODERNE COTONOU
                  </div>
                  <div className="text-center text-[11px]">
                    IFU : 3201849201948 - Cotonou Bénin
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span>3 Rames Papier A4 80g</span>
                    <span className="text-ink font-bold tabular-nums">15 000 F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lot 10 Classeurs Leviers</span>
                    <span className="text-ink font-bold tabular-nums">25 000 F</span>
                  </div>
                  <div className="pt-2 flex justify-between text-ink font-bold border-t border-border">
                    <span>Total Net HT</span>
                    <span className="tabular-nums">40 000 FCFA</span>
                  </div>
                  <div className="flex justify-between text-ink">
                    <span>TVA 18 %</span>
                    <span className="tabular-nums">7 200 FCFA</span>
                  </div>
                  <div className="flex justify-between text-ink font-bold text-sm pt-1">
                    <span>Total TTC Payé</span>
                    <span className="tabular-nums">47 200 FCFA</span>
                  </div>
                </div>

                {/* ANIMATION DU FAISCEAU LASER */}
                {isScanning && (
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-1 bg-primary absolute top-1/2 -translate-y-1/2" />
                    <span className="bg-ink text-background text-xs font-bold px-3 py-1.5 rounded-lg z-10">
                      Lecture du ticket en cours...
                    </span>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={lancerScan}
                    disabled={isScanning}
                    className="w-full bg-primary text-ink font-bold text-xs py-3 px-4 rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{isScanning ? "Lecture en cours..." : "Scanner ce ticket"}</span>
                  </button>
                </div>
              </div>

              {/* RÉSULTAT DE L'EXTRACTION AUTOMATIQUE (DROITE) */}
              <div className="lg:col-span-7 bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-border gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                      Données lues par Ceilow
                    </span>
                    <h3 className="text-base font-bold text-ink">
                      {scannedResult ? "Facture d'achat reconnue" : "En attente du scan"}
                    </h3>
                  </div>
                  {scannedResult && (
                    <span className="text-xs font-bold text-success-deep flex items-center gap-1.5 shrink-0">
                      <Check className="w-4 h-4" />
                      <span>Lecture prête</span>
                    </span>
                  )}
                </div>

                {scannedResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-background-secondary border border-border">
                        <span className="text-[11px] font-bold uppercase text-text-muted block mb-1">
                          Fournisseur détecté
                        </span>
                        <span className="text-sm font-bold text-ink">Papeterie Moderne</span>
                        <span className="text-xs text-text-muted block font-mono mt-0.5">IFU : 3201849201948</span>
                      </div>
                      <div className="p-4 rounded-xl bg-background-secondary border border-border">
                        <span className="text-[11px] font-bold uppercase text-text-muted block mb-1">
                          Catégorie SYSCOHADA
                        </span>
                        <span className="text-sm font-bold text-ink">605100 Fournitures de bureau</span>
                        <span className="text-xs text-text-muted block mt-0.5">Classement automatique</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-background-secondary border border-border space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center text-text-muted">
                        <span className="font-sans">Montant Hors Taxes (HT)</span>
                        <span className="text-ink font-bold tabular-nums">40 000 FCFA</span>
                      </div>
                      <div className="flex justify-between items-center text-text-muted">
                        <span className="font-sans">TVA récupérable (18 %)</span>
                        <span className="text-ink font-bold tabular-nums">7 200 FCFA</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border text-sm font-bold text-ink">
                        <span className="font-sans">Total TTC comptabilisé</span>
                        <span className="tabular-nums">47 200 FCFA</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/20 border border-primary text-xs text-ink flex items-center gap-2">
                      <Check className="w-4 h-4 text-ink shrink-0" />
                      <span>Cette TVA de 7 200 FCFA s&apos;ajoute automatiquement à votre TVA déductible pour le 10 du mois.</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center text-text-muted bg-background-secondary rounded-xl border border-border">
                    <Scan className="w-8 h-8 mx-auto mb-3 text-text-muted" />
                    <p className="text-sm">
                      Cliquez sur &laquo; Scanner ce ticket &raquo; à gauche pour tester la lecture automatique.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3 ÉTAPES CLAIRES */}
        <section className="py-16 md:py-24 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                En 3 étapes simples
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
                Comment vos reçus entrent dans votre comptabilité
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="text-xs font-mono font-bold text-text-muted mb-4">
                  01. PHOTOGRAPHIE
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Prenez le ticket en photo
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Avec votre téléphone au restaurant, à la station-service ou en boutique. Aucune installation lourde, tout passe par votre navigateur.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="text-xs font-mono font-bold text-text-muted mb-4">
                  02. LECTURE
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Ceilow lit et classe la dépense
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  L&apos;outil repère le numéro IFU du vendeur, la date, le total et la TVA à récupérer. Il vous propose l&apos;écriture prête à valider.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="text-xs font-mono font-bold text-text-muted mb-4">
                  03. ARCHIVAGE
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Le justificatif est gardé 10 ans
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  L&apos;image reste attachée à sa ligne comptable pendant la durée légale de 10 ans. Vous la retrouvez en un clic lors d&apos;un contrôle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAILLAGE INTERNE CONTEXTUEL */}
        <section className="py-12 bg-background border-t border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-wider text-text-muted font-bold">
                Suite complète
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-ink mt-1">
                Vos justificatifs reliés à toute votre comptabilité
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/solutions/comptabilite-syscohada"
                className="p-5 rounded-xl bg-background-secondary border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Comptabilité SYSCOHADA</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Chaque dépense validée est rangée dans la bonne catégorie de charges du plan OHADA révisé.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir la comptabilité
                </span>
              </Link>

              <Link
                href="/solutions/tresorerie-momo"
                className="p-5 rounded-xl bg-background-secondary border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Trésorerie &amp; Mobile Money</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Reliez chaque paiement MoMo pour fournitures ou carburant à son ticket photographié.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir la trésorerie
                </span>
              </Link>

              <Link
                href="/solutions/declarations-fiscales"
                className="p-5 rounded-xl bg-background-secondary border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Déclarations fiscales DGI</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Déduisez automatiquement chaque montant de TVA (18 %) présent sur vos factures fournisseurs normalisées.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir les déclarations
                </span>
              </Link>
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
                Tout comprendre sur la gestion des dépenses
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

        {/* BANNIÈRE D'APPEL À L'ACTION */}
        <section className="py-16 bg-ink text-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight mb-4 text-background">
              Fini les factures égarées dès maintenant.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Numérisez vos reçus et récupérez votre TVA déductible avec Ceilow. Essai gratuit de 14 jours, sans engagement.
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
