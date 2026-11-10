"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  QrCode,
  Check,
  ShieldCheck,
  Search,
  ArrowRight,
  FileText,
  Building2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
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

export default function FacturationDgiPage() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [searchIfu, setSearchIfu] = useState("32018104928174");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleIfuSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 450);
  };

  const faqItems = [
    {
      q: "Qu'est-ce qu'une facture normalisée e-MECeF au Bénin ?",
      a: "C'est une facture officielle contenant les éléments de sécurité délivrés par la Direction Générale des Impôts (DGI) : un QR code vérifiable, un numéro d'identification (NIM), des compteurs fiscaux et une signature électronique. Elle prouve que la vente est bien déclarée.",
    },
    {
      q: "Ai-je besoin d'acheter une machine physique e-MECeF ?",
      a: "Non. Ceilow remplace les boîtiers physiques coûteux. La plateforme est reliée directement aux serveurs e-MECeF de la DGI. Vous créez vos factures depuis votre téléphone ou votre ordinateur, sans aucun matériel à acheter.",
    },
    {
      q: "Que risque mon entreprise si j'émets une facture non normalisée ?",
      a: "Le Code Général des Impôts prévoit de lourdes amendes financières en cas d'infraction, ainsi que le rejet de la TVA déductible pour vos clients lors d'un contrôle. Avec Ceilow, chaque facture est certifiée dès sa création.",
    },
    {
      q: "Combien de temps prend la création du QR code officiel ?",
      a: "Quelques secondes seulement. Dès que vous validez la facture, Ceilow envoie les données à la DGI et ajoute automatiquement le QR code officiel sur votre document.",
    },
    {
      q: "Puis-je annuler ou corriger une facture déjà certifiée ?",
      a: "Oui, simplement. Selon la règle DGI, une facture déjà émise ne s'efface pas : Ceilow crée en un clic une facture d'avoir normalisée qui corrige ou annule la facture d'origine.",
    },
    {
      q: "Comment mes clients reçoivent-ils leurs factures ?",
      a: "Vous téléchargez la facture au format PDF prête à imprimer, ou vous l'envoyez directement par e-mail ou par WhatsApp.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      <PublicHeader className="sticky top-0 z-50 w-full" />

      <main className="flex-1 w-full overflow-hidden">
        {/* Keyframes inline pour animations vectorielles douces sans glassmorphisme */}
        <style jsx global>{`
          @keyframes laserScan {
            0% { transform: translateY(0); opacity: 0.3; }
            50% { transform: translateY(70px); opacity: 0.95; }
            100% { transform: translateY(0); opacity: 0.3; }
          }
          @keyframes ticketSlide {
            0%, 20% { transform: translateY(22px); opacity: 0; }
            40% { transform: translateY(0); opacity: 1; }
            85% { transform: translateY(0); opacity: 1; }
            95%, 100% { transform: translateY(-5px); opacity: 0.8; }
          }
          @keyframes stampDrop {
            0%, 35% { transform: scale(1.6) rotate(-15deg); opacity: 0; }
            45% { transform: scale(0.95) rotate(-5deg); opacity: 1; }
            55% { transform: scale(1) rotate(-6deg); opacity: 1; }
            85% { opacity: 1; }
            95%, 100% { opacity: 0.8; }
          }
          @keyframes popSparkle {
            0%, 45% { transform: scale(0) rotate(0deg); opacity: 0; }
            55% { transform: scale(1.3) rotate(45deg); opacity: 1; }
            70% { transform: scale(1) rotate(90deg); opacity: 1; }
            85%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
          }
          .laser-line {
            animation: laserScan 2.6s ease-in-out infinite;
          }
          .ticket-anim {
            animation: ticketSlide 3.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }
          .stamp-anim {
            animation: stampDrop 3.4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
            transform-origin: center;
          }
          .sparkle-star {
            fill: #FFD946; stroke: #332E29; stroke-width: 1;
            animation: popSparkle 3.4s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .laser-line,
            .ticket-anim,
            .stamp-anim,
            .sparkle-star {
              animation: none;
            }
          }
        `}</style>

        {/* HERO SECTION SPLIT SCREEN */}
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
                  <BreadcrumbPage>Facturation DGI e-MECeF</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Colonne gauche : Promesse de valeur & Conversion */}
              <div className="lg:col-span-7 flex flex-col items-start space-y-6">
                
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted">
                  Facturation officielle DGI Bénin
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-ink leading-[1.12] tracking-tight">
                  Facturation normalisée e-MECeF au Bénin, sans boîtier
                </h1>

                <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
                  Émettez vos factures certifiées DGI avec QR code officiel et signature électronique en quelques secondes. Vous facturez depuis votre ordinateur ou téléphone, sans acheter de machine physique.
                </p>

                <p className="text-sm text-text-muted">
                  <span className="font-semibold text-ink">Aucune installation :</span> tout fonctionne directement dans votre navigateur.
                </p>

                {/* 3 Garanties directes */}
                <div className="flex flex-col space-y-3 pt-1 w-full">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-sm sm:text-base text-ink font-medium">
                      QR code officiel e-MECeF délivré immédiatement par la DGI
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Recherche automatique de vos clients professionnels par numéro IFU
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span className="text-sm sm:text-base text-ink font-medium">
                      Devis, factures d&apos;acompte et factures d&apos;avoir en un clic
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
                  <span>14 jours d&apos;essai gratuit, sans carte bancaire requise</span>
                </div>
              </div>

              {/* Colonne droite : Simulateur de facture normalisée certifiée */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="w-full max-w-md bg-background rounded-2xl border-2 border-primary shadow-xs p-6 space-y-4">
                  
                  {/* Entête de facture */}
                  <div className="flex items-start justify-between border-b border-border pb-4">
                    <div>
                      <div className="text-xs font-bold text-text-muted uppercase tracking-wider">
                        Facture de Vente Normalisée
                      </div>
                      <div className="text-base font-bold text-ink mt-0.5">
                        N° 2026-F-00892
                      </div>
                      <div className="text-xs text-text-muted font-mono">
                        Date : 14 mars 2026
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs font-bold text-ink">CEILOW CLIENT PRO</div>
                      <div className="text-[11px] text-text-muted font-mono">IFU: 02019108374829</div>
                      <div className="text-[11px] text-text-muted">Cotonou, Bénin</div>
                    </div>
                  </div>

                  {/* Lignes de facturation */}
                  <div className="bg-background-secondary p-3.5 rounded-xl border border-border space-y-2 text-xs">
                    <div className="flex justify-between text-text-muted">
                      <span>Conseil en gestion et transport logistique</span>
                      <span className="font-mono font-bold text-ink">1 000 000 FCFA</span>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>TVA légale (18%)</span>
                      <span className="font-mono font-bold text-ink">180 000 FCFA</span>
                    </div>
                    <div className="flex justify-between text-ink font-bold pt-2 border-t border-border text-sm">
                      <span>Total TTC à payer</span>
                      <span className="font-mono font-bold tabular-nums">1 180 000 FCFA</span>
                    </div>
                  </div>

                  {/* Bloc de certification officielle e-MECeF */}
                  <div className="p-4 rounded-xl bg-background border border-border space-y-3 relative overflow-hidden">
                    
                    {/* Faisceau laser animé discret sur la zone de contrôle */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary laser-line pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink">
                        Certification DGI e-MECeF
                      </span>
                      <span className="text-[11px] font-mono text-success-deep font-semibold">
                        Validée
                      </span>
                    </div>

                    {/* Animation vectorielle pure e-MECeF : Ticket sortant & Sceau DGI */}
                    <div className="bg-background-secondary p-3 rounded-xl border border-border flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="w-full max-w-[280px] h-32 flex items-center justify-center">
                        <svg viewBox="0 0 280 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          {/* Boîtier terminal fiscal DGI */}
                          <rect x="50" y="20" width="180" height="36" rx="8" fill="#332E29" stroke="#332E29" strokeWidth="2" />
                          <line x1="80" y1="48" x2="200" y2="48" stroke="#FFD946" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="68" cy="38" r="4" fill="#5FFFC2" />
                          <circle cx="212" cy="38" r="4" fill="#FFD946" />

                          {/* Ticket sortant animé */}
                          <g className="ticket-anim">
                            <rect x="75" y="48" width="130" height="80" rx="4" fill="#FFFFFF" stroke="#332E29" strokeWidth="2" />
                            {/* Lignes du ticket */}
                            <line x1="88" y1="60" x2="150" y2="60" stroke="#332E29" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="88" y1="68" x2="135" y2="68" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="88" y1="75" x2="145" y2="75" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                            {/* QR code miniature */}
                            <rect x="160" y="58" width="32" height="32" rx="2" fill="#332E29" />
                            <rect x="164" y="62" width="8" height="8" fill="#FFFFFF" />
                            <rect x="180" y="62" width="8" height="8" fill="#FFFFFF" />
                            <rect x="164" y="78" width="8" height="8" fill="#FFFFFF" />
                            <rect x="176" y="74" width="6" height="6" fill="#FFFFFF" />
                            {/* Ligne pointillée de découpe */}
                            <line x1="85" y1="98" x2="195" y2="98" stroke="#D8D5D0" strokeWidth="1" strokeDasharray="3 2" />
                            <text x="140" y="114" textAnchor="middle" fill="#332E29" fontSize="8" fontWeight="bold" fontFamily="'Inter', sans-serif">
                              DGI e-MECeF - 1 180 000 F
                            </text>
                          </g>

                          {/* Tampon DGI qui s'abat dessus */}
                          <g className="stamp-anim" transform="translate(135, 88)">
                            <rect x="-42" y="-12" width="84" height="24" rx="4" fill="#5FFFC2" stroke="#332E29" strokeWidth="2" />
                            <text x="0" y="4" textAnchor="middle" fill="#332E29" fontSize="9" fontWeight="900" letterSpacing="0.5" fontFamily="'Inter', sans-serif">
                              CERTIFIÉ DGI
                            </text>
                          </g>

                          {/* Étoiles scintillantes */}
                          <g className="sparkle-star" transform="translate(40, 75)">
                            <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                          </g>
                          <g className="sparkle-star" style={{ animationDelay: "0.9s" }} transform="translate(235, 85)">
                            <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                          </g>
                        </svg>
                      </div>

                      {/* Métadonnées obligatoires DGI */}
                      <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-border font-mono text-[10px] text-text-muted">
                        <div>
                          <span className="text-ink font-semibold">NIM : </span>
                          <span>MCF-01-2026-08194</span>
                        </div>
                        <div className="text-right">
                          <span className="text-ink font-semibold">Statut : </span>
                          <span className="text-success-deep font-bold">En temps réel</span>
                        </div>
                      </div>
                    </div>

                    {/* Statut confirmé sobre */}
                    <div className="mt-2 p-2.5 rounded-lg bg-background-secondary border border-border text-ink font-semibold text-xs flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-success-deep stroke-[2.5] shrink-0" />
                      <span>Signature électronique validée par la DGI</span>
                    </div>
                  </div>

                  {/* Action réelle vers la démo */}
                  <div className="pt-1">
                    <Link
                      href="/demo"
                      className="w-full py-2.5 px-4 rounded-xl bg-background-secondary border border-border text-xs font-bold text-ink hover:border-ink transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Tester l&apos;envoi PDF et WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. RUBAN DE RÉASSURANCE TECHNIQUE */}
        <section className="w-full bg-background-secondary border-b border-border py-8">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border">
              
              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-ink">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Rapide</div>
                  <p className="text-xs text-text-muted">Visa officiel e-MECeF délivré en quelques secondes</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-ink">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Conforme DGI</div>
                  <p className="text-xs text-text-muted">Validé selon les règles du Code Général des Impôts</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-ink">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Archivage 10 ans</div>
                  <p className="text-xs text-text-muted">Conservation sécurisée pour tout contrôle fiscal</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-ink">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink font-mono">Zéro boîtier</div>
                  <p className="text-xs text-text-muted">Facturez sur mobile ou PC sans machine physique</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. DÉMONSTRATEUR INTERACTIF : RECHERCHE IFU */}
        <section className="w-full py-16 lg:py-20 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted">
                Gain de temps au comptoir
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-ink tracking-tight mt-3">
                Retrouvez les coordonnées de vos clients par numéro IFU
              </h2>
              <p className="text-sm sm:text-base text-text-muted mt-2 leading-relaxed">
                Fini les fautes de frappe sur les noms d&apos;entreprises. Saisissez le numéro IFU et Ceilow remplit le nom officiel et le régime fiscal du client.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-background-secondary p-6 sm:p-8 rounded-2xl border border-border shadow-xs">
              <form onSubmit={handleIfuSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchIfu}
                    onChange={(e) => setSearchIfu(e.target.value)}
                    aria-label="Numéro IFU du client"
                    placeholder="Entrez un numéro IFU (ex: 32018104928174)"
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-ink text-sm font-mono outline-none focus:border-ink transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="h-12 px-6 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl text-sm transition-colors flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{isSearching ? "Vérification..." : "Vérifier l'IFU"}</span>
                </button>
              </form>

              {/* Résultat de simulation */}
              {hasSearched && (
                <div className="mt-6 p-5 bg-background rounded-xl border border-border space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border gap-3">
                    <div>
                      <div className="text-[10px] text-text-muted uppercase font-bold">Nom légal identifié</div>
                      <div className="text-base font-bold text-ink mt-0.5">GROUPE ATLANTIQUE LOGISTIQUE SARL</div>
                    </div>
                    <span className="text-xs font-bold text-success-deep flex items-center gap-1 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                      <span>IFU actif</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-text-muted">
                    <div>
                      <span className="font-semibold text-ink">Centre des impôts : </span>
                      <span>CIPE Littoral Cotonou</span>
                    </div>
                    <div>
                      <span className="font-semibold text-ink">Régime fiscal : </span>
                      <span>Réel Normal (RN)</span>
                    </div>
                    <div>
                      <span className="font-semibold text-ink">Soumis à la TVA : </span>
                      <span className="text-ink font-semibold">Oui (Taux 18 %)</span>
                    </div>
                    <div>
                      <span className="font-semibold text-ink">Statut e-MECeF : </span>
                      <span className="text-success-deep font-semibold">Habilité à facturer</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3B. VITRINE TERRAIN : COMMERCE ET PRESTATIONS À COTONOU SANS MACHINE */}
        <section className="w-full py-16 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background shadow-xs">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/commercante-cotonou.jpg"
                      alt="Entrepreneure commerçante à Cotonou émettant une facture e-MECeF sur tablette"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border">
                    <p className="text-xs font-semibold text-ink">
                      &laquo; Plus de rouleaux papier en panne ni de machine bloquée. J&apos;envoie le reçu par WhatsApp ou en direct à chaque vente. &raquo;
                    </p>
                    <p className="text-[11px] text-text-muted mt-1">
                      Témoignage illustratif - Commerce à Akpakpa, Cotonou
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted">
                  Sans matériel à acheter
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                  Adieu la machine physique e-MECeF encombrante
                </h2>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Un boîtier physique coûte entre 250 000 et 350 000 FCFA, sans compter les rouleaux de papier et les réparations. Avec Ceilow, votre smartphone, tablette ou ordinateur suffit pour facturer légalement auprès de la DGI.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
                  <div className="p-3.5 rounded-xl bg-background border border-border">
                    <div className="font-bold text-ink text-sm">Zéro panne matérielle</div>
                    <p className="text-xs text-text-muted mt-1">Accédez à votre espace depuis n&apos;importe quel appareil connecté à Internet.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background border border-border">
                    <div className="font-bold text-ink text-sm">Envoi WhatsApp direct</div>
                    <p className="text-xs text-text-muted mt-1">Votre client reçoit son reçu certifié sur son téléphone en un clic.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-ink font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-xs min-h-[44px]"
                  >
                    <span>Démarrer gratuitement</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. LE PARCOURS EN 3 ÉTAPES */}
        <section className="w-full py-16 lg:py-20 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                Comment se passe la création d&apos;une facture ?
              </h2>
              <p className="text-sm sm:text-base text-text-muted mt-2">
                Un parcours simple en 3 étapes, de la saisie jusqu&apos;à la remise au client.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              
              {/* Étape 1 */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  activeStep === 1
                    ? "border-primary bg-background shadow-xs"
                    : "border-border bg-background-secondary hover:bg-background"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  aria-expanded={activeStep === 1}
                  className="w-full flex items-center justify-between text-left cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                        activeStep === 1 ? "bg-primary text-ink" : "bg-border text-text-muted"
                      }`}
                    >
                      1
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-ink">
                      Vous saisissez la facture en 30 secondes
                    </h3>
                  </div>
                  {activeStep === 1 ? (
                    <ChevronUp className="w-5 h-5 text-ink shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                  )}
                </button>
                {activeStep === 1 && (
                  <p className="mt-3 pl-10 text-sm text-text-muted leading-relaxed">
                    Choisissez votre client ou entrez son numéro IFU. Ajoutez vos produits ou services : Ceilow applique la bonne taxe (18 % ou exonération légale) sans calcul manuel.
                  </p>
                )}
              </div>

              {/* Étape 2 */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  activeStep === 2
                    ? "border-primary bg-background shadow-xs"
                    : "border-border bg-background-secondary hover:bg-background"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  aria-expanded={activeStep === 2}
                  className="w-full flex items-center justify-between text-left cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                        activeStep === 2 ? "bg-primary text-ink" : "bg-border text-text-muted"
                      }`}
                    >
                      2
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-ink">
                      La DGI valide et signe le document en direct
                    </h3>
                  </div>
                  {activeStep === 2 ? (
                    <ChevronUp className="w-5 h-5 text-ink shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                  )}
                </button>
                {activeStep === 2 && (
                  <p className="mt-3 pl-10 text-sm text-text-muted leading-relaxed">
                    Dès que vous confirmez, Ceilow transmet le document à la plateforme officielle de la DGI. Votre facture reçoit immédiatement son numéro, ses compteurs et son QR code certifié.
                  </p>
                )}
              </div>

              {/* Étape 3 */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  activeStep === 3
                    ? "border-primary bg-background shadow-xs"
                    : "border-border bg-background-secondary hover:bg-background"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  aria-expanded={activeStep === 3}
                  className="w-full flex items-center justify-between text-left cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                        activeStep === 3 ? "bg-primary text-ink" : "bg-border text-text-muted"
                      }`}
                    >
                      3
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-ink">
                      Votre client reçoit sa facture officielle
                    </h3>
                  </div>
                  {activeStep === 3 ? (
                    <ChevronUp className="w-5 h-5 text-ink shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                  )}
                </button>
                {activeStep === 3 && (
                  <p className="mt-3 pl-10 text-sm text-text-muted leading-relaxed">
                    Téléchargez le PDF prêt à imprimer ou partagez-le par WhatsApp. Votre client peut scanner le QR code avec son téléphone pour vérifier la validité de la facture sur le portail de la DGI.
                  </p>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* 5. SECTION AUTORITÉ SOMBRE : GARANTIE ZÉRO PÉNALITÉ */}
        <section className="w-full bg-ink text-white py-16 lg:py-20 border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Protégez votre entreprise contre les pénalités fiscales
              </h2>
              <p className="text-sm sm:text-base text-white/70 mt-2">
                Travaillez l&apos;esprit tranquille grâce à des documents toujours conformes aux contrôles DGI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-ink-surface border border-ink-border p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-ink flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Règles toujours à jour</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Dès que la loi de finances ou les règles e-MECeF évoluent au Bénin, Ceilow est mis à jour automatiquement sans aucun frais supplémentaire.
                </p>
              </div>

              <div className="bg-ink-surface border border-ink-border p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-ink flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Archives conservées 10 ans</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Toutes vos factures restent archivées en sécurité pendant la durée légale de 10 ans. En cas de contrôle, vous retrouvez chaque document en un clic.
                </p>
              </div>

              <div className="bg-ink-surface border border-ink-border p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-ink flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Ventes jamais bloquées</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Si les serveurs nationaux ralentissent temporairement, Ceilow met vos factures en attente sécurisée puis récupère le QR code dès le retour de la connexion.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 5 BIS. MAILLAGE INTERNE CONTEXTUEL */}
        <section className="w-full py-12 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-wider text-text-muted font-bold">
                Suite complète
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-ink mt-1">
                Chaque facture met immédiatement vos comptes à jour
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/solutions/comptabilite-syscohada"
                className="p-5 rounded-xl bg-background border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Comptabilité SYSCOHADA</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Vos ventes s&apos;inscrivent automatiquement dans vos livres comptables conformes OHADA, sans rien recopier.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir la comptabilité
                </span>
              </Link>

              <Link
                href="/solutions/tresorerie-momo"
                className="p-5 rounded-xl bg-background border border-border hover:border-ink transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:underline transition-colors flex items-center justify-between">
                    <span>Trésorerie Mobile Money</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    Reliez directement vos paiements MTN MoMo ou Moov Money à vos factures pour savoir qui a payé en un coup d&apos;œil.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir la trésorerie
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
                    Vos montants de TVA et retenues AIB se cumulent automatiquement pour préparer votre déclaration du 10 du mois.
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink mt-4 pt-3 border-t border-border">
                  Voir les déclarations
                </span>
              </Link>
            </div>

            <div className="mt-6 p-5 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                  Ressource pratique gratuite
                </span>
                <p className="text-sm font-semibold text-ink mt-0.5">
                  Comprendre les groupes A à F, l&apos;AIB et les avoirs FA sur le système DGI béninois
                </p>
              </div>
              <Link
                href="/ressources/guide-facturation-emecef-benin"
                className="inline-flex items-center gap-2 text-xs font-bold text-ink bg-background-secondary border border-border hover:border-ink px-4 py-2.5 rounded-lg transition-colors shrink-0 min-h-[44px]"
              >
                <span>Lire le guide e-MECeF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. FOIRE AUX QUESTIONS */}
        <section className="w-full py-16 lg:py-20 bg-background border-b border-border">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-wider text-text-muted font-bold">
                Réponses claires
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink mt-2">
                Questions fréquentes sur la facturation e-MECeF
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

        {/* 7. BANNIÈRE DE CONVERSION FINALE */}
        <section className="w-full bg-ink text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mb-4 font-bold shadow-xs">
              <QrCode className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mb-3 tracking-tight">
              Facturez en toute règle dès aujourd&apos;hui
            </h2>

            <p className="text-sm sm:text-base text-white/75 max-w-xl mb-8 leading-relaxed">
              Créez votre compte en 2 minutes. Notre équipe basée à Cotonou vous accompagne pour démarrer sereinement.
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
              <span>14 jours d&apos;essai gratuit</span>
              <span>Sans engagement</span>
              <span>Support basé à Cotonou</span>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
