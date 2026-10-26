"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  ArrowRight,
  Check,
  Download,
  FileText,
  Calculator,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Building2,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PaieCnssPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [salaireBrut, setSalaireBrut] = useState<number>(350000);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Barème indicatif IPTS Bénin et CNSS
  const cnssSalarie = Math.round(salaireBrut * 0.036); // 3.6%
  const cnssPatronale = Math.round(salaireBrut * 0.154); // 15.4%
  const vpsPatronale = Math.round(salaireBrut * 0.04); // 4% VPS

  // Calcul simplifié indicatif IPTS Bénin
  const baseImposable = Math.max(0, salaireBrut - cnssSalarie);
  let iptsCalcule = 0;
  if (baseImposable > 50000) {
    if (baseImposable <= 130000) {
      iptsCalcule = (baseImposable - 50000) * 0.1;
    } else if (baseImposable <= 280000) {
      iptsCalcule = 80000 * 0.1 + (baseImposable - 130000) * 0.15;
    } else if (baseImposable <= 530000) {
      iptsCalcule = 80000 * 0.1 + 150000 * 0.15 + (baseImposable - 280000) * 0.2;
    } else {
      iptsCalcule = 80000 * 0.1 + 150000 * 0.15 + 250000 * 0.2 + (baseImposable - 530000) * 0.3;
    }
  }
  const ipts = Math.round(iptsCalcule);
  const netAPayer = Math.round(salaireBrut - cnssSalarie - ipts);
  const totalCoutEntreprise = Math.round(salaireBrut + cnssPatronale + vpsPatronale);

  const formatFcfa = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " FCFA";
  };

  const handleSimulateDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Le bulletin de paie généré par Ceilow est-il conforme au Code du Travail béninois ?",
      a: "Oui, il intègre l'ensemble des mentions légales obligatoires au Bénin : identifiant employeur, numéro employeur CNSS, numéro IFU, matricule du salarié, numéro d'affiliation CNSS, ventilation détaillée des cotisations et congés payés.",
    },
    {
      q: "Comment sont gérés les déclarations e-Cotisations CNSS trimestrielles ?",
      a: "Ceilow génère en un clic le récapitulatif nominatif exact au format exigé par le portail officiel e-Cotisations de la CNSS Bénin. Vous n'avez plus qu'à importer le fichier sans ressaisir chaque salarié.",
    },
    {
      q: "Le calcul de l'IPTS prend-il en compte la situation de famille et les déductions ?",
      a: "Tout à fait. Le module de paie Ceilow intègre le barème officiel de la Direction Générale des Impôts du Bénin avec la déduction des charges de famille (enfants à charge) et les exonérations légales prévues au Code Général des Impôts.",
    },
    {
      q: "Puis-je envoyer les fiches de paie directement par e-mail ou WhatsApp aux salariés ?",
      a: "Oui, chaque collaborateur peut recevoir son bulletin de paie au format PDF sécurisé par e-mail ou via un lien individuel confidentiel dès la validation de la période par le gérant ou le responsable RH.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      {/* ── STYLE DÉDIÉ POUR ANIMATION SVG LOTTIE-LIKE BULLETIN DE PAIE & CNSS ── */}
      <style jsx global>{`
        @keyframes payslipSlide {
          0%, 15% { transform: translateY(28px); opacity: 0; }
          35% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(0); opacity: 1; }
          95%, 100% { transform: translateY(-6px); opacity: 0.8; }
        }
        @keyframes calcPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes sparklePayPop {
          0%, 45% { transform: scale(0) rotate(0deg); opacity: 0; }
          55% { transform: scale(1.3) rotate(45deg); opacity: 1; }
          70% { transform: scale(1) rotate(90deg); opacity: 1; }
          85%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        .payslip-anim {
          animation: payslipSlide 3.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .calc-anim {
          animation: calcPulse 3.6s ease-in-out infinite;
          transform-origin: center;
        }
        .sparkle-pay {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: sparklePayPop 3.6s ease-in-out infinite;
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
                  Gestion des salaires &amp; déclarations sociales
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4 font-clash">
                  Éditez vos bulletins de paie et vos déclarations CNSS sans erreur
                </h1>
                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Fini les erreurs de calcul manuel de l&apos;IPTS et les pénalités de retard CNSS)
                </p>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Générez des fiches de paie conformes au Code du Travail du Bénin en quelques secondes. Cotisations CNSS ouvrières (3.6%), patronales (15.4%), IPTS et VPS sont calculés automatiquement à chaque période.
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
                    <span>CNSS Ouvrière 3.6% &amp; Patronale 15.4%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Barème IPTS DGI Bénin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Export e-Cotisations prêt à déposer</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Photo réelle Gestionnaire RH Bénin */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-xs">
                  <Image
                    src="/images/conseillere-cotonou.jpg"
                    alt="Responsable des ressources humaines gérant la paie d'entreprise à Cotonou"
                    width={600}
                    height={440}
                    className="w-full h-[360px] sm:h-[420px] object-cover"
                    priority
                  />
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Bulletins de paie du mois validés</span>
                      <span className="text-success-deep font-semibold">100% Conforme CNSS</span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Déclaration e-Cotisations prête pour télédéclaration sans ressaisie.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION ANIMATION SVG LOTTIE-LIKE : BULLETIN DE PAIE & CALCULATRICE RH ── */}
        <section className="py-14 bg-background border-b border-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-60 h-44 mx-auto mb-3 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 260 170" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Calculatrice RH animée */}
                <g className="calc-anim" transform="translate(35, 30)">
                  <rect x="0" y="0" width="70" height="105" rx="8" fill="#332E29" stroke="#332E29" strokeWidth="2" />
                  <rect x="6" y="8" width="58" height="22" rx="4" fill="#FDFBF7" />
                  <text x="58" y="24" textAnchor="end" fill="#332E29" fontSize="10" fontWeight="bold" fontFamily="'Inter', sans-serif">
                    350 000 F
                  </text>
                  {/* Boutons calculatrice */}
                  <rect x="6" y="38" width="12" height="12" rx="2" fill="#FFD946" />
                  <rect x="22" y="38" width="12" height="12" rx="2" fill="#3D3830" />
                  <rect x="38" y="38" width="12" height="12" rx="2" fill="#3D3830" />
                  <rect x="52" y="38" width="12" height="12" rx="2" fill="#3D3830" />
                  <rect x="6" y="54" width="12" height="12" rx="2" fill="#3D3830" />
                  <rect x="22" y="54" width="12" height="12" rx="2" fill="#3D3830" />
                  <rect x="38" y="54" width="12" height="12" rx="2" fill="#3D3830" />
                  <rect x="52" y="54" width="12" height="12" rx="2" fill="#3D3830" />
                  <rect x="6" y="70" width="12" height="12" rx="2" fill="#3D3830" />
                  <rect x="22" y="70" width="12" height="12" rx="2" fill="#3D3830" />
                  <rect x="38" y="70" width="26" height="26" rx="4" fill="#5FFFC2" />
                  <text x="51" y="86" textAnchor="middle" fill="#332E29" fontSize="11" fontWeight="bold">=</text>
                </g>

                {/* Bulletin de paie animé qui glisse */}
                <g className="payslip-anim" transform="translate(130, 20)">
                  <rect x="0" y="0" width="95" height="125" rx="6" fill="#FFFFFF" stroke="#332E29" strokeWidth="2" />
                  <rect x="8" y="10" width="79" height="12" rx="2" fill="#FFD946" />
                  <text x="47" y="19" textAnchor="middle" fill="#332E29" fontSize="6" fontWeight="bold" fontFamily="'Inter', sans-serif">
                    BULLETIN DE SALAIRE
                  </text>
                  <line x1="8" y1="30" x2="87" y2="30" stroke="#8A857D" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="12" y1="40" x2="50" y2="40" stroke="#332E29" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="50" x2="65" y2="50" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="12" y1="60" x2="58" y2="60" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Ligne CNSS 3.6% */}
                  <rect x="8" y="70" width="79" height="14" rx="2" fill="#F5F4F2" />
                  <text x="12" y="80" fill="#332E29" fontSize="5.5" fontWeight="semibold" fontFamily="'Inter', sans-serif">
                    CNSS 3.6%
                  </text>
                  <text x="83" y="80" textAnchor="end" fill="#FF5C5C" fontSize="5.5" fontWeight="bold" fontFamily="'Inter', sans-serif">
                    - 12 600 F
                  </text>
                  {/* Net à payer */}
                  <rect x="8" y="92" width="79" height="22" rx="4" fill="#5FFFC2" stroke="#332E29" strokeWidth="1.5" />
                  <text x="47" y="102" textAnchor="middle" fill="#332E29" fontSize="6" fontWeight="bold" fontFamily="'Inter', sans-serif">
                    NET À PAYER
                  </text>
                  <text x="47" y="111" textAnchor="middle" fill="#332E29" fontSize="8" fontWeight="900" fontFamily="'Inter', sans-serif">
                    302 400 FCFA
                  </text>
                </g>

                {/* Étoiles scintillantes */}
                <g className="sparkle-pay" transform="translate(120, 20)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-pay" style={{ animationDelay: "1.1s" }} transform="translate(235, 120)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-clash text-ink tracking-tight">
              Chaque bulletin calculé au centime près
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto mt-1">
              Renseignez simplement le salaire brut et laissez Ceilow calculer les retenues CNSS et IPTS selon le barème officiel béninois.
            </p>
          </div>
        </section>

        {/* SECTION INTERACTIVE : SIMULATEUR DE BULLETIN DE PAIE BÉNINOIS */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Simulateur dynamique
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Simulez un bulletin de salaire selon le barème officiel du Bénin
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-2xl">
                Ajustez le salaire brut mensuel pour observer la décomposition automatique des cotisations salariales, fiscales et patronales.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* CONTROLES DU SIMULATEUR (GAUCHE) */}
              <div className="lg:col-span-5 bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <h3 className="text-base font-bold text-ink mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-ink" />
                  <span>Paramètres du salarié</span>
                </h3>

                <div className="mb-6">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                    Salaire Brut Mensuel
                  </label>
                  <div className="text-2xl font-bold font-mono tabular-nums text-ink mb-3">
                    {formatFcfa(salaireBrut)}
                  </div>
                  <input
                    type="range"
                    min="60000"
                    max="1500000"
                    step="10000"
                    value={salaireBrut}
                    onChange={(e) => setSalaireBrut(Number(e.target.value))}
                    className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-2">
                    <span>SMIG : 52 000 F</span>
                    <span>Cadre : 1 500 000 F</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="text-xs font-bold text-text-muted uppercase mb-2">
                    Paliers fréquents
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSalaireBrut(150000)}
                      className={`text-xs font-bold py-2 px-3 rounded-lg border transition-all ${
                        salaireBrut === 150000
                          ? "bg-primary text-ink border-primary"
                          : "bg-background-secondary text-ink border-border hover:border-ink"
                      }`}
                    >
                      150 000 F
                    </button>
                    <button
                      type="button"
                      onClick={() => setSalaireBrut(350000)}
                      className={`text-xs font-bold py-2 px-3 rounded-lg border transition-all ${
                        salaireBrut === 350000
                          ? "bg-primary text-ink border-primary"
                          : "bg-background-secondary text-ink border-border hover:border-ink"
                      }`}
                    >
                      350 000 F
                    </button>
                    <button
                      type="button"
                      onClick={() => setSalaireBrut(750000)}
                      className={`text-xs font-bold py-2 px-3 rounded-lg border transition-all ${
                        salaireBrut === 750000
                          ? "bg-primary text-ink border-primary"
                          : "bg-background-secondary text-ink border-border hover:border-ink"
                      }`}
                    >
                      750 000 F
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="text-xs uppercase font-bold text-text-muted mb-2">
                    Coût global employeur
                  </div>
                  <div className="text-xl font-bold font-mono tabular-nums text-ink mb-1">
                    {formatFcfa(totalCoutEntreprise)}
                  </div>
                  <p className="text-xs text-text-muted">
                    Inclut CNSS patronale (15.4%) et VPS (4%).
                  </p>
                </div>
              </div>

              {/* APERÇU DU BULLETIN DE PAIE OFFICIEL (DROITE) */}
              <div className="lg:col-span-7 bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-border gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                      Aperçu bulletin de salaire certifié
                    </span>
                    <h4 className="text-base font-bold text-ink">
                      Période : Mars 2026
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateDownload}
                    className="bg-background-secondary text-ink font-bold text-xs px-4 py-2 rounded-xl border border-border hover:border-ink transition-all flex items-center justify-center gap-2 min-h-[40px]"
                  >
                    <Download className="w-3.5 h-3.5 text-ink" />
                    <span>Télécharger l&apos;exemple PDF</span>
                  </button>
                </div>

                {downloadSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-background-secondary border border-border text-xs text-ink flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink shrink-0" />
                    <span>Spécimen de bulletin généré avec succès avec mentions légales Bénin.</span>
                  </div>
                )}

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-background-secondary border border-border flex justify-between items-center">
                    <span className="font-sans font-bold text-ink">Salaire de Base Brut</span>
                    <span className="font-bold text-ink tabular-nums">{formatFcfa(salaireBrut)}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-background-secondary border border-border space-y-3">
                    <div className="font-sans text-[11px] uppercase font-bold text-text-muted pb-2 border-b border-border">
                      Retenues sur salaire (part salariale)
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-text-muted">Cotisation CNSS Ouvrière (3.6%)</span>
                      <span className="text-ink font-bold tabular-nums">- {formatFcfa(cnssSalarie)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-text-muted">Retenue à la source IPTS (DGI)</span>
                      <span className="text-ink font-bold tabular-nums">- {formatFcfa(ipts)}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-primary/20 border border-primary flex justify-between items-center">
                    <div>
                      <span className="font-sans text-xs uppercase font-bold text-ink block">
                        Net à payer au salarié
                      </span>
                      <span className="font-sans text-[11px] text-text-muted">
                        Virement bancaire ou Mobile Money
                      </span>
                    </div>
                    <span className="text-lg font-bold text-ink tabular-nums">
                      {formatFcfa(netAPayer)}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-background-secondary border border-border space-y-2">
                    <div className="font-sans text-[11px] uppercase font-bold text-text-muted pb-2 border-b border-border">
                      Charges patronales de l&apos;entreprise
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-text-muted">CNSS Patronale (15.4% prestations familiales &amp; retraite)</span>
                      <span className="text-ink tabular-nums">{formatFcfa(cnssPatronale)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-text-muted">Versement Patronal sur Salaires VPS (4%)</span>
                      <span className="text-ink tabular-nums">{formatFcfa(vpsPatronale)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
                  <span>Conforme Loi 98-004 portant Code du travail en République du Bénin</span>
                  <span className="font-bold text-ink">SYSCOHADA Compte 661</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 PILIERS MAJEURS */}
        <section className="py-16 md:py-24 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Simplicité &amp; Sérénité
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Une paie conforme sans casse-tête juridique
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Bulletins de paie prêts en quelques minutes
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Renseignez les éventuelles primes, avances ou heures supplémentaires de la période. Tous les bulletins de votre équipe sont mis à jour et prêts à être distribués sans recalcul manuel.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Déclaration e-Cotisations CNSS sans ressaisie
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Exportez directement l&apos;état nominatif des salaires au format requis par le télé-service de la Caisse Nationale de Sécurité Sociale du Bénin. Évitez toute majoration pour déclaration tardive.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Écritures comptables de paie automatiques
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Chaque clôture de paie génère automatiquement les écritures aux comptes 661 (Rémunérations), 421 (Personnel), 431 (CNSS) et 447 (État IPTS). Votre comptable n&apos;a plus besoin de ressaisir chaque ligne.
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
                Tout savoir sur la paie et la CNSS avec Ceilow
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

        {/* BANNIÈRE D'ACTION */}
        <section className="py-16 bg-ink text-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 text-background">
              Éditez vos premiers bulletins de paie béninois en 5 minutes.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Configurez votre entreprise et vos salariés en quelques clics. Testez gratuitement pendant 14 jours.
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
