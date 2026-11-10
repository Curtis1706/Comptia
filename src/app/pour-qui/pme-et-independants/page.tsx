"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  PiggyBank,
  PhoneCall,
  Smartphone,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Receipt,
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
      q: "Ai-je besoin de savoir compter ou de connaître la comptabilité pour utiliser Ceilow ?",
      a: "Non, aucune connaissance comptable n'est demandée. Ceilow est pensé pour les commerçants, prestataires et dirigeants de PME : vous faites vos devis et factures en français clair, et la comptabilité se met à jour toute seule.",
    },
    {
      q: "Dois-je acheter une machine physique e-MECeF en plus de Ceilow ?",
      a: "Non. Notre plateforme est reliée directement aux serveurs officiels de la DGI. Vos factures reçoivent leur QR code et leur signature officielle sans acheter de matériel coûteux.",
    },
    {
      q: "Puis-je facturer depuis mon téléphone quand je suis chez un client ?",
      a: "Oui. Ceilow fonctionne sur n'importe quel smartphone connecté à Internet. Vous créez la facture, elle est certifiée par la DGI et vous l'envoyez par WhatsApp ou e-mail en quelques clics.",
    },
    {
      q: "Que se passe-t-il si j'ai une question ou si je suis bloqué ?",
      a: "Notre équipe d'assistance est basée à Cotonou. Vous nous contactez directement par téléphone ou WhatsApp pour obtenir une réponse rapide.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      <style jsx>{`
        /* Animation vectorielle : Caisse & reçu certifié DGI */
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
        @media (prefers-reduced-motion: reduce) {
          .receipt-bounce,
          .stamp-check,
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
                  <BreadcrumbPage>PME &amp; indépendants</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* COLONNE GAUCHE : TEXTE & VALEUR DIRECTE */}
              <div className="lg:col-span-7">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                  Commerçants, artisans &amp; PME du Bénin
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-ink leading-tight mb-6">
                  Le logiciel de gestion pour PME et indépendants au Bénin
                </h1>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8">
                  Passez moins de temps sur la paperasse et plus de temps avec vos clients. Avec Ceilow, vous facturez en direct avec QR code e-MECeF sans acheter de machine, vous suivez vos paiements MTN et Moov Money et vous préparez des comptes clairs pour votre comptable.
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
                    Voir la démo
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Prise en main rapide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Sans boîtier à acheter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Support basé à Cotonou</span>
                  </div>
                </div>
              </div>

              {/* COLONNE DROITE : PHOTO LOCALE */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-md">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/commercante-cotonou.jpg"
                      alt="Entrepreneure souriante dans sa boutique à Cotonou au Bénin"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-ink block">Boutique &amp; commerce</span>
                      <span className="text-[11px] text-text-muted">Haie Vive, Cotonou (illustration)</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-ink shrink-0">
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

            <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight mb-3">
              Une facture certifiée DGI en quelques clics
            </h2>
            <p className="text-base text-text-muted max-w-xl mx-auto mb-6">
              Ouvrez Ceilow sur votre téléphone, choisissez le client et le montant, validez : le QR code officiel de la DGI s&apos;ajoute aussitôt sans aucun boîtier coûteux.
            </p>
          </div>
        </section>

        {/* SECTION ESTIMATION DU TEMPS ET DES ÉCONOMIES */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Simulateur de gain
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight mb-3">
                Estimez le temps et l&apos;argent économisés chaque mois
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-2xl">
                Indiquez votre nombre moyen de factures mensuelles pour voir ce que Ceilow vous fait gagner.
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
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <label htmlFor="nb-factures-range" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Factures clients par mois
                    </label>
                    <span className="text-2xl font-bold font-mono text-ink tabular-nums">
                      {nbFactures} factures
                    </span>
                  </div>
                  <input
                    id="nb-factures-range"
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
                    <Check className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                    <span className="text-xs text-text-muted">
                      Certification immédiate sans attente ni panne de papier thermique.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                    <span className="text-xs text-text-muted">
                      Envoi direct du PDF avec QR code DGI au client par WhatsApp.
                    </span>
                  </div>
                </div>
              </div>

              {/* RÉSULTAT DU GAIN (DROITE) */}
              <div className="lg:col-span-6 bg-background p-6 sm:p-8 rounded-2xl border border-border">
                <div className="pb-6 mb-6 border-b border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                    Estimation sur votre activité
                  </span>
                  <h4 className="text-xl font-bold text-ink">
                    Ce que vous évitez avec Ceilow
                  </h4>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-xl bg-background-secondary border border-border flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase text-text-muted block">
                        Temps estimé récupéré
                      </span>
                      <span className="text-xs text-text-muted">Moins de saisies le soir et le week-end</span>
                    </div>
                    <span className="text-2xl font-bold font-mono text-ink tabular-nums shrink-0">
                      ~{heuresEconomisees}h / mois
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-background-secondary border border-border flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase text-text-muted block">
                        Économie sur l&apos;achat du boîtier
                      </span>
                      <span className="text-xs text-text-muted">Coût moyen d&apos;une machine e-MECeF</span>
                    </div>
                    <span className="text-xl font-bold font-mono text-ink tabular-nums shrink-0">
                      {new Intl.NumberFormat("fr-FR").format(coutMachinePhysique)} FCFA
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/20 border border-primary text-xs text-ink flex items-center gap-2">
                  <Check className="w-4 h-4 text-ink shrink-0" />
                  <span>Votre téléphone suffit : aucun matériel spécial ni technicien à payer.</span>
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
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
                Trois avantages pensés pour votre quotidien
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Facturation rapide sur mobile
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Créez un devis ou une facture DGI en moins de deux minutes. Envoyez le document par WhatsApp ou e-mail avant même de quitter votre client.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Protection contre les amendes DGI
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Chaque vente est certifiée sur le moment avec son QR code DGI. Vous travaillez sereinement lors des contrôles fiscaux.
                </p>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6">
                  <PhoneCall className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">
                  Équipe d&apos;aide basée à Cotonou
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Pas de robot automatique : vous appelez ou écrivez sur WhatsApp à une vraie équipe au Bénin pour vous guider rapidement.
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
                Outils complémentaires
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
                Tout ce dont votre entreprise a besoin au même endroit
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/solutions/facturation-dgi"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Receipt className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2 group-hover:underline transition-colors">
                  Facturation normalisée e-MECeF
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Émettez des factures DGI avec QR code officiel directement depuis votre téléphone ou ordinateur.
                </p>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Voir la facturation <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/solutions/tresorerie-momo"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Smartphone className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2 group-hover:underline transition-colors">
                  Suivi Mobile Money &amp; Banques
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Reliez vos paiements MTN, Moov et virements bancaires à vos factures sans calcul à la main.
                </p>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Voir la trésorerie <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/ressources/calcul-tps-benin-guide"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <ShieldCheck className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2 group-hover:underline transition-colors">
                  Guide Calcul TPS (5 %)
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Estimez votre Taxe Professionnelle Synthétique, vérifiez le seuil 50 M FCFA et vos acomptes.
                </p>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Lire le guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/tarifs"
                className="group p-6 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <PiggyBank className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2 group-hover:underline transition-colors">
                  Tarifs transparents
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Des formules claires et accessibles en FCFA pour indépendants et PME, sans engagement.
                </p>
                <span className="text-xs font-bold text-ink inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Voir les tarifs <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* BANNIÈRE D'APPEL À L'ACTION */}
        <section className="py-16 bg-ink text-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight mb-4 text-background">
              Simplifiez la gestion de votre entreprise dès aujourd&apos;hui.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Essayez Ceilow gratuitement pendant 14 jours sans carte bancaire ni engagement.
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
