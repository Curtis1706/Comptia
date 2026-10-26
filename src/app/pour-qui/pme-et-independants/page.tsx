"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  PiggyBank,
  PhoneCall,
  Smartphone,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Receipt,
  Store,
  Layers,
  Sparkles,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PmeEtIndependantsPage() {
  const [nbFactures, setNbFactures] = useState<number>(35);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Calcul du gain de temps et d'argent
  const heuresEconomisees = Math.round(nbFactures * 0.35 + 4);
  const coutMachinePhysique = 280000; // Coût moyen machine e-MECeF avec rouleaux

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Ai-je besoin de connaissances en comptabilité pour utiliser Ceilow ?",
      a: "Non, aucune. Ceilow a été spécialement pensé pour les entrepreneurs, commerçants et consultants qui ne maîtrisent pas le jargon comptable. Vous créez vos devis et factures en français simple, et l'outil traduit automatiquement chaque action en écritures conformes pour votre bilan.",
    },
    {
      q: "Dois-je acheter une machine physique e-MECeF en plus de Ceilow ?",
      a: "Non, c'est l'un des grands avantages de Ceilow. Notre plateforme est directement connectée à l'API de la Direction Générale des Impôts (DGI). Toutes vos factures reçoivent leur QR code et signature officielle sans investissement dans du matériel encombrant.",
    },
    {
      q: "Puis-je facturer depuis mon smartphone lorsque je suis en clientèle ou sur un chantier ?",
      a: "Oui, Ceilow est 100% accessible depuis n'importe quel smartphone. Vous éditez votre facture, la normalisez auprès de la DGI et l'envoyez au client par WhatsApp ou e-mail en moins de deux minutes chrono.",
    },
    {
      q: "Que se passe-t-il si j'ai une question ou si je suis bloqué ?",
      a: "Notre équipe de support client est basée physiquement à Cotonou. Vous pouvez nous joindre directement par téléphone ou via WhatsApp pendant les heures ouvrables pour une réponse rapide et humaine.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      <style jsx>{`
        /* Animation vectorielle Lottie-like : Caisse & reçu certifié DGI */
        .receipt-bounce {
          animation: print-receipt 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          transform-origin: 120px 80px;
        }
        .stamp-check {
          animation: stamp-pop 3s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
          transform-origin: 160px 105px;
        }
        .sparkle-star {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: pop-sparkle 3s ease-in-out infinite;
        }
        @keyframes print-receipt {
          0% { transform: translateY(-20px) scale(0.85); opacity: 0; }
          25% { transform: translateY(0px) scale(1); opacity: 1; }
          75% { transform: translateY(0px) scale(1); opacity: 1; }
          100% { transform: translateY(12px) scale(0.95); opacity: 0; }
        }
        @keyframes stamp-pop {
          0%, 30% { transform: scale(0) rotate(-15deg); opacity: 0; }
          45% { transform: scale(1.15) rotate(5deg); opacity: 1; }
          55%, 80% { transform: scale(1) rotate(0deg); opacity: 1; }
          100% { transform: scale(0.8) rotate(0deg); opacity: 0; }
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
        {/* HERO SECTION EN SPLIT SCREEN AVEC VRAIE PHOTO ENTREPRENEURE BÉNINOISE */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 border-b border-border bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* COLONNE GAUCHE : TEXTE & VALEUR DIRECTE */}
              <div className="lg:col-span-7">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                  Commerçants, Artisans &amp; PME du Bénin
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-6">
                  Le logiciel de gestion pour PME et indépendants au Bénin qui simplifie votre quotidien
                </h1>
                <p className="font-serif italic text-base md:text-lg text-text-muted mb-4">
                  (Vous avez créé votre activité pour servir vos clients, pas pour vous battre avec des déclarations d&apos;impôts)
                </p>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8">
                  Adoptez un <strong>logiciel de gestion PME au Bénin</strong> pensé pour votre réalité de terrain : facturez en direct avec QR code e-MECeF sans acheter de machine physique, suivez vos encaissements MTN et Moov Money en temps réel, et transmettez des comptes impeccables à votre comptable sans aucun jargon.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    href="/register"
                    className="bg-primary text-ink font-bold px-6 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Tester gratuitement</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="bg-background-secondary text-ink font-bold px-6 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Voir la démonstration
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Démarrage en 10 minutes chrono</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Zéro machine physique à acheter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Support direct basé à Cotonou</span>
                  </div>
                </div>
              </div>

              {/* COLONNE DROITE : VRAIE PHOTO ENTREPRENEURE COMMERCE COTONOU */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-md">
                  <Image
                    src="/images/commercante-cotonou.jpg"
                    alt="Entrepreneure souriante dans sa boutique à Cotonou au Bénin"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="p-4 bg-background border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-ink block">Clarisse Houngbo</span>
                      <span className="text-[11px] text-text-muted">Boutique &amp; Décoration, Haie Vive</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-ink bg-background-secondary px-2.5 py-1 rounded-md border border-border">
                      Facturation mobile
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION ANIMATION VECTORIELLE SVG (LOTTIE-LIKE) : CAISSE MOBILE & TICKET DGI */}
        <section className="py-16 md:py-20 bg-background border-b border-border">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* ILLUSTRATION SVG ANIMÉE SUR MESURE */}
            <div className="w-56 h-44 mx-auto mb-4 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 240 180" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Socle caisse enregistreuse / terminal */}
                <rect x="50" y="85" width="140" height="75" rx="14" fill="#332E29" stroke="#332E29" strokeWidth="2.5" />
                <rect x="55" y="90" width="130" height="65" rx="10" fill="#F5F4F2" stroke="#D8D5D0" strokeWidth="1.5" />
                {/* Fente d'impression */}
                <rect x="75" y="80" width="90" height="8" rx="4" fill="#332E29" />

                {/* Ticket de caisse animé qui sort */}
                <g className="receipt-bounce">
                  <path d="M 85 25 L 155 25 L 155 85 L 150 82 L 145 85 L 140 82 L 135 85 L 130 82 L 125 85 L 120 82 L 115 85 L 110 82 L 105 85 L 100 82 L 95 85 L 90 82 L 85 85 Z" fill="#FFFFFF" stroke="#332E29" strokeWidth="2" />
                  {/* Lignes du ticket */}
                  <line x1="95" y1="38" x2="145" y2="38" stroke="#332E29" strokeWidth="2" strokeLinecap="round" />
                  <line x1="95" y1="48" x2="135" y2="48" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="95" y1="58" x2="140" y2="58" stroke="#8A857D" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Petit QR code simulé */}
                  <rect x="125" y="62" width="16" height="16" rx="2" fill="#332E29" />
                </g>

                {/* Tampon certifié DGI */}
                <g className="stamp-check">
                  <circle cx="160" cy="105" r="22" fill="#FFD946" stroke="#332E29" strokeWidth="2.5" />
                  <path d="M 152 105 L 158 111 L 169 99" fill="none" stroke="#332E29" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                {/* Étoiles scintillantes */}
                <g className="sparkle-star" transform="translate(60, 40)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-star" style={{ animationDelay: "1s" }} transform="translate(195, 75)">
                  <path d="M 0 -5 L 1.2 -1.2 L 5 0 L 1.2 1.2 L 0 5 L -1.2 1.2 L -5 0 L -1.2 -1.2 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
              Une facture certifiée DGI en 3 clics chrono
            </h2>
            <p className="text-base text-text-muted max-w-xl mx-auto mb-6">
              Ouvrez Ceilow sur votre smartphone, renseignez le client et le montant, validez : le QR code fiscal officiel de la DGI s&apos;appose instantanément sans matériel coûteux.
            </p>
          </div>
        </section>

        {/* SECTION ESTIMATION DU TEMPS ET DES ÉCONOMIES */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Bénéfices réels
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                Mesurez le temps et l&apos;argent que vous récupérez chaque mois
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-2xl">
                Ajustez votre volume moyen de factures clients pour constater l&apos;impact direct sur votre quotidien d&apos;entrepreneur.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* CURSEUR VOLUME (GAUCHE) */}
              <div className="lg:col-span-6 bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <h3 className="text-base font-bold text-ink mb-6 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-ink" />
                  <span>Votre volume mensuel de factures</span>
                </h3>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Factures clients émanant de votre activité
                    </label>
                    <span className="text-2xl font-bold font-mono text-ink tabular-nums">
                      {nbFactures} factures
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={nbFactures}
                    onChange={(e) => setNbFactures(Number(e.target.value))}
                    className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-2">
                    <span>5 factures (indépendant)</span>
                    <span>50 factures (commerce)</span>
                    <span>150+ (PME)</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span className="text-xs text-text-muted">
                      Normalisation instantanée sans attendre les recharges de rouleaux thermiques.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span className="text-xs text-text-muted">
                      Envoi direct en PDF avec QR code DGI par WhatsApp au client.
                    </span>
                  </div>
                </div>
              </div>

              {/* RÉSULTAT DU GAIN (DROITE) */}
              <div className="lg:col-span-6 bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <div className="pb-6 mb-6 border-b border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                    Économies constatées
                  </span>
                  <h4 className="text-xl font-bold text-ink">
                    Ce que vous évitez en passant à Ceilow
                  </h4>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-xl bg-background-secondary border border-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase text-text-muted block">
                        Temps administratif épargné
                      </span>
                      <span className="text-xs text-text-muted">Fini les saisies du soir et week-end</span>
                    </div>
                    <span className="text-2xl font-bold font-mono text-ink tabular-nums">
                      +{heuresEconomisees}h / mois
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-background-secondary border border-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase text-text-muted block">
                        Économie matérielle immédiate
                      </span>
                      <span className="text-xs text-text-muted">Prix d&apos;une machine physique e-MECeF</span>
                    </div>
                    <span className="text-xl font-bold font-mono text-ink tabular-nums">
                      {new Intl.NumberFormat("fr-FR").format(coutMachinePhysique)} FCFA
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/20 border border-primary text-xs text-ink flex items-center gap-2">
                  <Check className="w-4 h-4 text-ink shrink-0" />
                  <span>Votre téléphone portable suffit : aucun frais de maintenance ni de technicien sur place.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 PILIERS CONÇUS POUR LE QUOTIDIEN DU CHEF D'ENTREPRISE */}
        <section className="py-16 md:py-24 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Confort de gestion
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Trois piliers pour gérer votre PME en toute quiétude
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Facturation mobile en direct
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Générez un devis ou une facture normalisée en moins de deux minutes chrono. Transmettez le justificatif par WhatsApp ou e-mail à votre client avant même de quitter son bureau.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Protection contre les pénalités DGI
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Chaque facture est certifiée en temps réel avec son QR code officiel. Vous n&apos;avez plus peur des contrôles inopinés ni des amendes pour défaut de normalisation des recettes.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <PhoneCall className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Support direct à Cotonou
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Pas de chatbot impersonnel ni de plateforme téléphonique à l&apos;autre bout du monde. Notre équipe est joignable par téléphone et WhatsApp pour vous débloquer rapidement.
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
                Tout savoir pour les PME et indépendants
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

        {/* MAILLAGE INTERNE CONTEXTUEL */}
        <section className="py-16 md:py-20 bg-background border-t border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Outils complémentaires
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Tout ce dont votre entreprise a besoin au même endroit
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/solutions/facturation-dgi"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Receipt className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2 group-hover:text-primary transition-colors">
                  Facturation normalisée e-MECeF
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Émettez des factures conformes DGI avec QR code officiel directement depuis votre téléphone ou PC.
                </p>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Découvrir la facturation <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/solutions/tresorerie-momo"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Smartphone className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2 group-hover:text-primary transition-colors">
                  Suivi Mobile Money &amp; Banques
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Rapprochez automatiquement vos encaissements MTN, Moov et comptes bancaires sans pointage manuel.
                </p>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Découvrir le rapprochement <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/tarifs"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <PiggyBank className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2 group-hover:text-primary transition-colors">
                  Tarifs transparents
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Des forfaits clairs et accessibles pour indépendants et PME, sans frais cachés ni engagement.
                </p>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Consulter les tarifs <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* BANNIÈRE D'APPEL À L'ACTION */}
        <section className="py-16 bg-ink text-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 text-background">
              Simplifiez la vie de votre entreprise dès aujourd&apos;hui.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Démarrez gratuitement en 3 minutes sans carte bancaire ni engagement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary text-ink font-bold px-8 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>Commencer gratuitement</span>
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
