"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Database,
  FileText,
  ArrowRight,
  Check,
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

export default function SecuriteEtApdpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"chiffrement" | "sauvegardes" | "audit" | "apdp">("chiffrement");

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const securityDetails = {
    chiffrement: {
      title: "Données protégées de bout en bout",
      description:
        "Toutes les informations qui circulent entre votre navigateur et nos serveurs sont protégées. Une fois enregistrées, vos bases de données comptables et vos factures restent chiffrées avec une sécurité de niveau bancaire.",
      points: [
        "Connexions sécurisées HTTPS / TLS à jour",
        "Données strictement séparées pour chaque entreprise",
        "Mots de passe chiffrés et jamais stockés en clair",
        "Jetons et identifiants protégés côté serveur",
      ],
    },
    sauvegardes: {
      title: "Sauvegardes automatiques chaque jour",
      description:
        "Vos comptes font l'objet de copies automatiques quotidiennes sur plusieurs centres sécurisés. Vous ne perdez jamais vos factures ni vos écritures en cas de vol ou de panne de votre ordinateur.",
      points: [
        "Sauvegardes régulières tout au long de la journée",
        "Copies sécurisées sur plusieurs emplacements",
        "Vérifications régulières des sauvegardes",
        "Protection complète contre la perte d'ordinateur ou la coupure de courant",
      ],
    },
    audit: {
      title: "Historique verrouillé et vérifiable (OHADA)",
      description:
        "Chaque création, modification ou validation d'écriture est enregistrée dans un journal d'audit non modifiable avec l'heure exacte, le nom de l'utilisateur et les détails de l'opération.",
      points: [
        "Impossible de supprimer en silence une facture déjà certifiée",
        "Historique consultable par votre expert-comptable ou commissaire aux comptes",
        "Numérotation chronologique continue conforme à l'OHADA",
        "Justificatifs prêts en cas de contrôle DGI",
      ],
    },
    apdp: {
      title: "Respect du Code du Numérique au Bénin (APDP)",
      description:
        "Ceilow respecte la Loi n° 2017-20 portant Code du numérique en République du Bénin et les principes de protection des données personnelles encadrés par l'APDP.",
      points: [
        "Votre entreprise reste l'unique propriétaire de ses données",
        "Aucune revente ni exploitation publicitaire de vos chiffres",
        "Export libre et gratuit de toutes vos données à tout moment",
        "Suppression définitive de votre dossier si vous fermez votre compte",
      ],
    },
  };

  const faqs = [
    {
      q: "Mes données comptables appartiennent-elles à Ceilow ou à mon entreprise ?",
      a: "Vos données appartiennent à 100 % à votre entreprise. Vous pouvez exporter à tout moment vos journaux, vos factures DGI en PDF et vos relevés au format Excel sans aucun frais.",
    },
    {
      q: "Que se passe-t-il si je décide d'arrêter mon abonnement ?",
      a: "Vous récupérez librement toutes vos archives (journaux, grand livre, factures DGI, justificatifs) avant votre départ. Vos données sont ensuite supprimées sur demande.",
    },
    {
      q: "L'équipe de Ceilow peut-elle voir mes factures et mes comptes ?",
      a: "Non. Nos équipes n'accèdent pas au contenu de votre comptabilité, sauf si vous autorisez explicitement une intervention d'assistance pour résoudre un problème technique précis.",
    },
    {
      q: "Que devient mon travail en cas de coupure d'électricité ou de réseau à Cotonou ?",
      a: "Vos comptes sont hébergés sur des serveurs sécurisés protégés par des systèmes de secours électriques. Même si votre bureau subit une coupure, vos données sont en sécurité et prêtes dès que vous vous reconnectez.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      {/* STYLE DÉDIÉ ANIMATION BOUCLIER SÉCURITÉ */}
      <style jsx global>{`
        @keyframes shieldGlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes lockRotate {
          0%, 70%, 100% { transform: rotate(0deg); }
          75% { transform: rotate(-8deg); }
          85% { transform: rotate(8deg); }
        }
        @keyframes sparkleSecPop {
          0%, 45% { transform: scale(0) rotate(0deg); opacity: 0; }
          55% { transform: scale(1.3) rotate(45deg); opacity: 1; }
          70% { transform: scale(1) rotate(90deg); opacity: 1; }
          85%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        .shield-anim {
          animation: shieldGlow 3.6s ease-in-out infinite;
          transform-origin: center;
        }
        .lock-anim {
          animation: lockRotate 3.6s ease-in-out infinite;
          transform-origin: 130px 65px;
        }
        .sparkle-sec {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: sparkleSecPop 3.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .shield-anim,
          .lock-anim,
          .sparkle-sec {
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
                  <BreadcrumbPage>Sécurité &amp; conformité APDP</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Colonne gauche */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                  Protection des données &amp; confidentialité
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4 font-display">
                  Vos données comptables protégées comme à la banque
                </h1>
                <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                  Vos factures et écritures sont chiffrées, sauvegardées chaque jour sur plusieurs serveurs et protégées selon le Code du numérique du Bénin (APDP). Vous restez seul propriétaire de vos données.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/register"
                    className="bg-primary text-ink font-bold px-7 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Créer un compte</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-background-secondary text-ink font-bold px-7 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center"
                  >
                    Nous contacter
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Conforme APDP Bénin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Chiffrement de niveau bancaire</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-ink" />
                    <span>Sauvegardes quotidiennes</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-xs">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/equipe-support-cotonou.jpg"
                      alt="Équipe technique et de sécurité des données de Ceilow à Cotonou"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                      <span>Systèmes surveillés en continu</span>
                      <span className="text-success-deep font-semibold">Accès sécurisé</span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Équipe technique basée à Cotonou pour accompagner votre activité.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION ANIMATION BOUCLIER APDP */}
        <section className="py-14 bg-background border-b border-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-60 h-44 mx-auto mb-3 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 260 170" width="100%" xmlns="http://www.w3.org/2000/svg">
                <g className="shield-anim" transform="translate(130, 85)">
                  <path d="M 0 -70 C 45 -70, 75 -50, 75 10 C 75 55, 40 85, 0 100 C -40 85, -75 55, -75 10 C -75 -50, -45 -70, 0 -70 Z" fill="#332E29" stroke="#332E29" strokeWidth="2" />
                  <path d="M 0 -62 C 38 -62, 65 -45, 65 8 C 65 48, 35 74, 0 88 C -35 74, -65 48, -65 8 C -65 -45, -38 -62, 0 -62 Z" fill="#3D3830" stroke="#8A857D" strokeWidth="1" />
                  
                  <g className="lock-anim" transform="translate(0, 0)">
                    <path d="M -16 -12 C -16 -28, 16 -28, 16 -12 L 16 2 L -16 2 Z" fill="none" stroke="#FFD946" strokeWidth="4" strokeLinecap="round" />
                    <rect x="-24" y="0" width="48" height="38" rx="6" fill="#FFD946" stroke="#332E29" strokeWidth="2" />
                    <circle cx="0" cy="16" r="4.5" fill="#332E29" />
                    <line x1="0" y1="18" x2="0" y2="28" stroke="#332E29" strokeWidth="3" strokeLinecap="round" />
                  </g>

                  <g transform="translate(0, 56)">
                    <rect x="-38" y="-10" width="76" height="20" rx="4" fill="#5FFFC2" stroke="#332E29" strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fill="#332E29" fontSize="7.5" fontWeight="900" letterSpacing="0.5" fontFamily="'Inter', sans-serif">
                      APDP BÉNIN
                    </text>
                  </g>
                </g>

                <g className="sparkle-sec" transform="translate(35, 30)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-sec" style={{ animationDelay: "1.1s" }} transform="translate(225, 40)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight">
              Maîtrise et confidentialité de vos écritures
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto mt-1">
              Vos chiffres financiers ne sont jamais revendus ni exploités à des fins commerciales. Vous en gardez le contrôle entier.
            </p>
          </div>
        </section>

        {/* SECTION INTERACTIVE : INSPECTEUR DES 4 PILIERS DE SÉCURITÉ */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Protection concrète
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight mb-3">
                Les quatre piliers qui protègent votre entreprise
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-2xl">
                Choisissez un thème pour découvrir comment vos factures et comptes restent en sécurité chaque jour.
              </p>
            </div>

            {/* SÉLECTEUR DE PILIER */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <button
                type="button"
                onClick={() => setActiveTab("chiffrement")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[48px] ${
                  activeTab === "chiffrement"
                    ? "bg-primary text-ink border-primary shadow-xs"
                    : "bg-background text-ink border-border hover:border-ink"
                }`}
              >
                <Lock className="w-5 h-5 mb-2 text-ink" />
                <span className="text-xs font-bold block">Chiffrement bancaire</span>
                <span className={`text-[11px] ${activeTab === "chiffrement" ? "text-ink/80" : "text-text-muted"}`}>
                  Données scellées
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("sauvegardes")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[48px] ${
                  activeTab === "sauvegardes"
                    ? "bg-primary text-ink border-primary shadow-xs"
                    : "bg-background text-ink border-border hover:border-ink"
                }`}
              >
                <Database className="w-5 h-5 mb-2 text-ink" />
                <span className="text-xs font-bold block">Sauvegardes chaque jour</span>
                <span className={`text-[11px] ${activeTab === "sauvegardes" ? "text-ink/80" : "text-text-muted"}`}>
                  Copies multiples
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("audit")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[48px] ${
                  activeTab === "audit"
                    ? "bg-primary text-ink border-primary shadow-xs"
                    : "bg-background text-ink border-border hover:border-ink"
                }`}
              >
                <FileText className="w-5 h-5 mb-2 text-ink" />
                <span className="text-xs font-bold block">Piste d&apos;audit</span>
                <span className={`text-[11px] ${activeTab === "audit" ? "text-ink/80" : "text-text-muted"}`}>
                  Historique vérifiable
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("apdp")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[48px] ${
                  activeTab === "apdp"
                    ? "bg-primary text-ink border-primary shadow-xs"
                    : "bg-background text-ink border-border hover:border-ink"
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-2 text-ink" />
                <span className="text-xs font-bold block">Conformité APDP</span>
                <span className={`text-[11px] ${activeTab === "apdp" ? "text-ink/80" : "text-text-muted"}`}>
                  Loi 2017-20 Bénin
                </span>
              </button>
            </div>

            {/* CONTENU DÉTAILLÉ */}
            <div className="bg-background rounded-2xl border border-border p-6 sm:p-10">
              <div className="max-w-3xl">
                <h3 className="text-xl font-bold text-ink mb-3">
                  {securityDetails[activeTab].title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  {securityDetails[activeTab].description}
                </p>

                <div className="space-y-3 pt-6 border-t border-border">
                  {securityDetails[activeTab].points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-success-deep shrink-0 mt-0.5" />
                      <span className="text-sm text-ink">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARAISON ORDINATEUR LOCAL VS CLOUD SÉCURISÉ */}
        <section className="py-16 md:py-24 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Comparatif
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
                Pourquoi un simple fichier Excel sur votre bureau reste risqué
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                <div className="text-xs uppercase font-bold text-text-muted tracking-wider mb-4 pb-3 border-b border-border">
                  Comptabilité sur un seul ordinateur
                </div>
                <ul className="space-y-4 text-sm text-text-muted">
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Risque de tout perdre en cas de vol ou de panne de disque dur.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Aucun historique vérifiable en cas de contrôle fiscal.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Fichiers fragiles face aux virus et erreurs d&apos;effacement.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-ink font-bold mt-0.5">-</span>
                    <span>Sauvegardes manuelles sur clé USB souvent oubliées.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background-secondary p-8 rounded-2xl border-2 border-primary">
                <div className="text-xs uppercase font-bold text-ink tracking-wider mb-4 pb-3 border-b border-border flex items-center justify-between gap-2">
                  <span>Avec Ceilow en ligne</span>
                  <span className="text-xs text-text-muted">Protection continue</span>
                </div>
                <ul className="space-y-4 text-sm text-ink">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Données accessibles à tout moment depuis téléphone ou ordinateur.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Journal d&apos;audit horodaté et vérifiable conforme aux règles OHADA.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Chiffrement bancaire et sauvegardes automatiques chaque jour.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>Récupération libre : exportez vos écritures et PDF quand vous voulez.</span>
                  </li>
                </ul>
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
                Tout savoir sur la sécurité de vos données
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
              Confiez vos comptes à un environnement protégé.
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto mb-8">
              Essayez Ceilow gratuitement pendant 14 jours sans engagement et gardez la maîtrise complète de vos données.
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
                href="/contact"
                className="bg-transparent text-background font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:border-white transition-all text-center min-h-[48px] flex items-center justify-center"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
