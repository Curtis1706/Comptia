"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
  Users,
  MapPin,
  Headphones,
  Cpu,
  ChevronDown,
  Sparkles,
  Phone,
  MessageSquare,
  FileCheck,
  Calendar,
  Lock,
  Search,
  Bell,
  Check,
  FileText,
  Building2,
  Landmark,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { trackEvent } from "@/lib/analytics";

export default function AccompagnementPage() {
  const [activeTab, setActiveTab] = useState<"compta" | "facturation" | "compte" | "bilan">("compta");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("gold");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    need: "transition",
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("generate_lead", {
      lead_source: "accompagnement_form",
      subject: formData.need,
    });
    setSubmitted(true);
  };

  const faqList = [
    {
      q: "En quoi consiste concrètement l'accompagnement Ceilow ?",
      a: "C'est l'alliance d'un outil de gestion moderne et d'un conseiller dédié basé à Cotonou. Nous reprenons vos anciens dossiers, configurons votre compte, formons votre équipe et restons joignables par WhatsApp ou appel pour répondre à toutes vos questions fiscales et comptables.",
    },
    {
      q: "Je n'y connais rien en gestion, vais-je m'en sortir ?",
      a: "C'est précisément pour cela que nous sommes là. Vous n'avez aucun calcul à faire : vos encaissements et vos dépenses sont enregistrés simplement, et votre conseiller dédié vérifie régulièrement que tout est en ordre pour que vous n'ayez aucun souci.",
    },
    {
      q: "Combien de temps faut-il pour démarrer ?",
      a: "Moins de 48 heures. Dès votre premier échange, votre conseiller configure vos accès et vos modèles de factures. Si vous avez des fichiers existants, nous les importons pour que vous puissiez facturer et encaisser dès le jour même.",
    },
    {
      q: "Comment se passe la reprise de mes anciennes factures et fichiers ?",
      a: "Vous n'avez rien à recopier à la main. Vous nous envoyez simplement vos tableaux Excel, vos photos de factures ou vos anciens relevés : notre équipe à Cotonou s'occupe d'intégrer l'ensemble de votre historique sans surcoût.",
    },
    {
      q: "J'ai déjà un cabinet ou un comptable, dois-je en changer ?",
      a: "Non, absolument pas. Ceilow lui fait gagner du temps sans changer vos habitudes : nous lui créons un accès gratuit pour qu'il consulte vos chiffres et récupère des exports comptables propres à tout moment, sans vous déranger.",
    },
    {
      q: "Mes factures sont-elles immédiatement en règle avec la DGI ?",
      a: "Oui, à 100 %. Chaque facture générée sur Ceilow reçoit automatiquement son QR code et sa signature officielle certifiée par la Direction Générale des Impôts (e-MECeF). Vous êtes protégé contre tout risque de pénalité.",
    },
    {
      q: "Pouvez-vous venir dans mes bureaux à Cotonou ?",
      a: "Oui, tout à fait. Nos conseillers se déplacent directement dans vos locaux (Cotonou, Calavi, Porto-Novo et environs) pour installer l'application, former votre secrétaire ou faire le point sur votre organisation.",
    },
    {
      q: "Suis-je engagé sur la durée ?",
      a: "Aucun engagement. Vous êtes libre d'interrompre votre abonnement quand vous le souhaitez en un clic. Vos données restent votre entière propriété et vous pouvez les exporter librement à tout moment.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans antialiased selection:bg-primary selection:text-ink">
      {/* ── STYLE DÉDIÉ POUR ANIMATIONS PURES & TIRELIRE ── */}
      <style jsx global>{`
        .font-tabular {
          font-feature-settings: "tnum";
          font-variant-numeric: tabular-nums;
        }
        @keyframes laserBeam {
          0% { top: 15%; opacity: 0.3; }
          50% { top: 80%; opacity: 0.95; }
          100% { top: 15%; opacity: 0.3; }
        }
        .animate-laser {
          animation: laserBeam 2.4s ease-in-out infinite;
        }
        @keyframes growBar {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.08); }
        }
        .animate-bar-1 { animation: growBar 3.2s ease-in-out infinite; transform-origin: bottom; }
        .animate-bar-2 { animation: growBar 2.6s ease-in-out infinite 0.4s; transform-origin: bottom; }
        .animate-bar-3 { animation: growBar 3.6s ease-in-out infinite 0.8s; transform-origin: bottom; }

        @keyframes ringBell {
          0%, 80%, 100% { transform: rotate(0); }
          85% { transform: rotate(12deg); }
          90% { transform: rotate(-12deg); }
          95% { transform: rotate(6deg); }
        }
        .animate-bell {
          animation: ringBell 3.2s infinite;
          transform-origin: top center;
        }

        /* Tirelire SVG keyframes */
        .piggy-body { fill: #FDFBF7; stroke: #332E29; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
        .piggy-snout { fill: #FFD946; stroke: #332E29; stroke-width: 2; stroke-linecap: round; }
        .coin-anim {
          animation: drop-coin 2.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          transform-origin: 120px 40px;
        }
        .coin-trail {
          stroke: #FFD946; stroke-width: 2; stroke-dasharray: 4 4;
          animation: fade-trail 2.8s ease-in-out infinite;
        }
        .piggy-bounce {
          animation: pig-bounce 2.8s ease-in-out infinite;
          transform-origin: 120px 140px;
        }
        .piggy-eye {
          animation: blink-eye 2.8s infinite;
          transform-origin: 148px 98px;
        }
        .sparkle-star {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: pop-sparkle 2.8s ease-in-out infinite;
        }
        @keyframes drop-coin {
          0% { transform: translateY(-35px) scale(0.6) rotate(-15deg); opacity: 0; }
          25% { transform: translateY(-35px) scale(1) rotate(0deg); opacity: 1; }
          45% { transform: translateY(32px) scale(0.9) rotate(20deg); opacity: 1; }
          55% { transform: translateY(48px) scale(0.4); opacity: 0; }
          100% { transform: translateY(48px) scale(0.4); opacity: 0; }
        }
        @keyframes pig-bounce {
          0%, 42% { transform: scale(1, 1); }
          48% { transform: scale(1.05, 0.95) translateY(2px); }
          54% { transform: scale(0.98, 1.02) translateY(-2px); }
          62% { transform: scale(1, 1) translateY(0); }
          100% { transform: scale(1, 1); }
        }
        @keyframes blink-eye {
          0%, 45%, 55%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }
        @keyframes pop-sparkle {
          0%, 45% { transform: scale(0) rotate(0deg); opacity: 0; }
          52% { transform: scale(1.3) rotate(45deg); opacity: 1; }
          65% { transform: scale(1) rotate(90deg); opacity: 1; }
          80%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        @keyframes fade-trail {
          0%, 25% { opacity: 0; stroke-dashoffset: 20; }
          40% { opacity: 0.8; stroke-dashoffset: 0; }
          55%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-laser,
          .animate-bar-1,
          .animate-bar-2,
          .animate-bar-3,
          .animate-bell,
          .coin-anim,
          .coin-trail,
          .piggy-bounce,
          .piggy-eye,
          .sparkle-star {
            animation: none;
          }
        }
      `}</style>

      {/* HEADER PUBLIC UNIFIÉ */}
      <PublicHeader />

      <main className="flex-1 w-full">
        {/* 1. HERO SECTION SPLIT SCREEN */}
        <section className="w-full bg-background pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              {/* Colonne Gauche */}
              <div className="lg:col-span-7 flex flex-col items-start gap-6">
                <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold font-display text-ink tracking-tight leading-[1.15]">
                  Gérez votre société l&apos;esprit tranquille, avec un conseiller dédié
                </h1>

                <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                  Ne passez plus vos soirées dans la paperasse. Nous ouvrons vos accès, reprenons vos anciens dossiers sous 48h et répondons à vos questions pour garder vos comptes en règle.
                </p>

                {/* 4 Checklist Items */}
                <ul className="flex flex-col gap-3 w-full pt-1">
                  <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-ink">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span>Reprise complète de vos anciens fichiers sous 48h ouvrées</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-ink">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span>Factures certifiées DGI avec QR code en un clic</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-ink">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span>Trésorerie et Mobile Money (MTN, Moov, Celtiis) suivis en direct</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-ink">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span>Déclarations de TVA et bilans préparés sans calcul manuel</span>
                  </li>
                </ul>

                {/* Double CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <a
                    href="#rendez-vous"
                    className="px-8 py-3.5 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl text-center transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-xs min-h-[48px]"
                  >
                    <span>Prendre rendez-vous</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href="/tarifs"
                    className="px-7 py-3.5 border border-border bg-background hover:bg-background-secondary font-semibold text-ink rounded-xl text-center transition text-sm sm:text-base min-h-[48px] flex items-center justify-center"
                  >
                    Voir les tarifs
                  </Link>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted pt-1">
                  <ShieldCheck className="w-4 h-4 text-success-deep shrink-0" />
                  <span>Échange gratuit de 15 min sans engagement - Conseils adaptés à votre entreprise</span>
                </div>
              </div>

              {/* Colonne Droite */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-3xl overflow-hidden border border-border bg-background-secondary shadow-sm">
                  <div className="relative aspect-[3/2] sm:aspect-[4/3] w-full">
                    <Image
                      src="/images/dirigeante-benin.jpg"
                      alt="Dirigeante d'entreprise à Cotonou gérant sa société avec Ceilow"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 500px"
                      priority
                    />
                  </div>

                  <div className="p-4 bg-background border-t border-border flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-ink shrink-0" />
                      <span className="text-xs font-bold text-ink">Mise en service clé en main sous 48h</span>
                    </div>
                    <span className="text-[11px] text-text-muted font-medium shrink-0">Conseillers à Cotonou</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. RUBAN DE RÉASSURANCE */}
        <section className="border-b border-border bg-background-secondary py-6">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="font-display font-bold text-sm sm:text-base text-ink flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-ink" />
                  Conseillers à Cotonou
                </span>
                <span className="text-xs text-text-muted">Joignables par appel et WhatsApp</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="font-display font-bold text-sm sm:text-base text-ink flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-success-deep" />
                  Facturation certifiée DGI
                </span>
                <span className="text-xs text-text-muted">QR code officiel en direct</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="font-display font-bold text-sm sm:text-base text-ink flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-ink" />
                  Banques &amp; Mobile Money
                </span>
                <span className="text-xs text-text-muted">Vos encaissements suivis en direct</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="font-display font-bold text-sm sm:text-base text-ink flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-success-deep" />
                  Démarrage sous 48h
                </span>
                <span className="text-xs text-text-muted">Reprise et formation incluses</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SECTION 1 : SECURISER VOS COMPTES */}
        <section className="py-20 bg-background border-b border-border" id="fonctionnalites">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                Vous gérez votre activité, nous sécurisons vos comptes
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Ne restez plus seul face aux règles fiscales. Votre conseiller vous guide sur vos opérations pour garder votre entreprise en règle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Carte 1 */}
              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[260px] flex flex-col justify-between">
                  <div className="bg-background-secondary rounded-xl p-3 border border-border">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-ink">Comptes suivis (exemple)</span>
                      <Check className="w-3.5 h-3.5 text-success-deep shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold text-ink">
                      <span>BOA Bénin</span>
                      <span className="text-text-muted">-</span>
                      <span>MTN MoMo</span>
                      <span className="text-text-muted">-</span>
                      <span>Moov Money</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs text-text-muted font-medium">Solde disponible</span>
                      <span className="text-xs font-bold text-success-deep font-tabular">Suivi en direct</span>
                    </div>
                    <div className="text-2xl font-bold font-display text-ink font-tabular mb-4">14 850 000 FCFA</div>
                    <div className="flex items-end gap-2.5 h-16 pt-2 border-t border-border">
                      <div className="flex-1 bg-border rounded-t h-[40%]" />
                      <div className="flex-1 bg-border rounded-t h-[60%]" />
                      <div className="flex-1 bg-border rounded-t h-[48%]" />
                      <div className="flex-1 bg-primary rounded-t h-[78%] animate-bar-1" />
                      <div className="flex-1 bg-primary rounded-t h-[94%] animate-bar-2" />
                      <div className="flex-1 bg-success rounded-t h-[86%] animate-bar-3" />
                    </div>
                    <div className="flex justify-between text-[10px] text-text-muted mt-1.5 font-medium">
                      <span>Nov</span><span>Déc</span><span>Jan</span><span>Fév</span><span>Mar</span><span className="font-bold text-ink">Avr</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display text-ink mb-2">Vos recettes et dépenses classées sans effort</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Vos paiements bancaires et Mobile Money sont classés au jour le jour. Vous connaissez vos vrais bénéfices à tout moment.
                  </p>
                </div>
              </div>

              {/* Carte 2 */}
              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[260px] flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <span className="text-xs font-bold text-ink">Aperçu de facture</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedColor("gold")}
                        className={`w-4 h-4 rounded-full bg-primary cursor-pointer ${selectedColor === "gold" ? "ring-2 ring-ink ring-offset-1" : ""}`}
                        aria-label="Thème Jaune"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedColor("ink")}
                        className={`w-4 h-4 rounded-full bg-ink cursor-pointer ${selectedColor === "ink" ? "ring-2 ring-ink ring-offset-1" : ""}`}
                        aria-label="Thème Sombre"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedColor("green")}
                        className={`w-4 h-4 rounded-full bg-success-deep cursor-pointer ${selectedColor === "green" ? "ring-2 ring-ink ring-offset-1" : ""}`}
                        aria-label="Thème Vert"
                      />
                    </div>
                  </div>

                  <div className="bg-background-secondary rounded-xl p-3 border border-border space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-ink">
                        <span className="w-2.5 h-2.5 rounded bg-primary inline-block" />
                        <span>Exemple Entreprise SARL</span>
                      </div>
                      <span className="text-[10px] text-text-muted font-mono">FAC-2026-089</span>
                    </div>
                    <div className="text-[11px] py-1 border-y border-dashed border-border flex justify-between">
                      <span>Prestation &amp; conseil</span>
                      <span className="font-tabular font-bold">250 000 FCFA</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[10px] font-bold">
                      <span className="text-success-deep flex items-center gap-1">
                        <Check className="w-3 h-3" /> e-MECeF DGI Signé
                      </span>
                      <span className="text-ink">Émise</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[10px] text-text-muted">
                    <div className="w-6 h-6 bg-ink text-primary font-mono text-[6px] font-bold flex items-center justify-center rounded">DGI</div>
                    <span>QR code officiel généré en direct</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display text-ink mb-2">Facturez en règle dès le premier jour</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Créez des devis et des factures normalisées avec QR code officiel en quelques clics. Vos clients sont en confiance et votre activité est protégée.
                  </p>
                </div>
              </div>

              {/* Carte 3 */}
              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[260px] flex items-center justify-center">
                  <div className="relative w-48 bg-background border-2 border-ink rounded-2xl p-3 shadow-xs overflow-hidden">
                    <div className="w-12 h-2 bg-ink rounded-full mx-auto mb-2" />
                    <div className="relative bg-background-secondary border border-dashed border-border rounded-lg p-2.5 text-center">
                      <div className="absolute left-0 right-0 h-0.5 bg-success shadow-xs animate-laser" />
                      <div className="text-[10px] font-bold text-ink uppercase tracking-wider">Reçu fournisseur</div>
                      <div className="text-[9px] text-text-muted my-0.5">14 Mars 2026 - Exemple</div>
                      <div className="text-sm font-bold font-tabular text-ink my-1">42 000 FCFA</div>
                      <div className="text-[8px] text-text-muted border-t border-dashed border-border pt-1 font-tabular">TVA 18 % incluse (6 406 F)</div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success-deep">
                        <Check className="w-3 h-3" /> Reçu lu par photo
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display text-ink mb-2">Fini les tickets perdus dans les tiroirs</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Prenez vos factures d&apos;achat en photo avec votre téléphone. Elles restent classées avec vos dépenses pour récupérer votre TVA déductible.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a
                href="#rendez-vous"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl transition shadow-xs text-sm sm:text-base min-h-[48px]"
              >
                <span>Prendre rendez-vous</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 4. SECTION 2 : BANNIÈRE SOMBRE 5 PILIERS */}
        <section className="py-14 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-ink text-white rounded-3xl p-8 sm:p-12 border border-ink-border shadow-sm">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                  Un accompagnement humain, simple et transparent
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  La rapidité d&apos;un outil en ligne avec l&apos;écoute d&apos;un conseiller basé à Cotonou.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
                <div className="space-y-3 p-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-ink-surface border border-ink-border flex items-center justify-center text-primary">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Simple</h3>
                  <p className="text-xs text-white/70 leading-normal">Aucun jargon, vous démarrez facilement dès le premier jour.</p>
                </div>

                <div className="space-y-3 p-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-ink-surface border border-ink-border flex items-center justify-center text-primary">
                    <Headphones className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Disponible</h3>
                  <p className="text-xs text-white/70 leading-normal">Un conseiller joignable par appel ou WhatsApp à Cotonou.</p>
                </div>

                <div className="space-y-3 p-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-ink-surface border border-ink-border flex items-center justify-center text-primary">
                    <Award className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Clé en main</h3>
                  <p className="text-xs text-white/70 leading-normal">Reprise de vos données et formation de votre équipe.</p>
                </div>

                <div className="space-y-3 p-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-ink-surface border border-ink-border flex items-center justify-center text-primary">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Transparent</h3>
                  <p className="text-xs text-white/70 leading-normal">Tarifs en FCFA sans engagement ni frais cachés.</p>
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-3 p-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-ink-surface border border-ink-border flex items-center justify-center text-primary">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Sérénité</h3>
                  <p className="text-xs text-white/70 leading-normal">Alertes actives avant chaque date limite DGI et CNSS.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. SECTION 3 : DATES LIMITES FISCALES */}
        <section className="py-20 bg-background border-b border-border" id="conformite-dgi">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                Ne redoutez plus les dates limites fiscales
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Fini le stress du 10 du mois. Vous vérifiez vos chiffres et préparez vos déclarations à l&apos;avance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[250px] flex flex-col justify-between">
                  <div className="bg-background-secondary rounded-xl border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <span className="text-xs font-bold text-ink">Déclaration mensuelle</span>
                      <span className="text-[11px] font-bold text-success-deep">Prête</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-text-muted">
                        <span>TVA à déclarer (18 %)</span>
                        <span className="font-tabular font-bold text-ink">920 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Retenue AIB</span>
                        <span className="font-tabular font-bold text-ink">145 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Bilan annuel</span>
                        <span className="font-bold text-success-deep">Dossier prêt</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink">
                      <Check className="w-4 h-4 text-success-deep shrink-0" />
                      Chiffres préparés sans calcul manuel
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display text-ink mb-2">Vos déclarations préparées à l&apos;avance</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Ceilow calcule votre TVA et vos avances d&apos;impôt à partir de vos ventes et achats. Vous validez vos montants calmement avant le 10.
                  </p>
                </div>
              </div>

              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[250px] flex items-center justify-center">
                  <div className="bg-background-secondary border-2 border-ink rounded-xl p-4 shadow-xs w-56 text-center">
                    <div className="pt-2">
                      <div className="w-8 h-8 mx-auto text-ink animate-bell mb-1">
                        <Bell className="w-7 h-7" />
                      </div>
                      <p className="text-xs font-bold text-ink">Échéance fiscale à venir</p>
                      <p className="text-[10px] text-text-muted mt-1 font-medium">Déclaration DGI du 10 du mois</p>
                      <div className="mt-2.5 text-xs font-bold text-ink">
                        Rappel actif
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display text-ink mb-2">Rappels automatiques pour ne rien oublier</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Recevez un rappel avant chaque date limite DGI ou CNSS afin de tout déposer à temps.
                  </p>
                </div>
              </div>

              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[250px] flex items-center justify-center">
                  <div className="w-52 bg-background-secondary rounded-xl border border-border p-3.5 space-y-2">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-[11px] font-bold text-ink">Fiche de paie (exemple)</span>
                      <span className="text-[10px] font-semibold text-success-deep">Prête</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between text-text-muted">
                        <span>Salaire brut :</span>
                        <span className="font-tabular font-semibold text-ink">350 000 F</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>CNSS salarié (3,6 %) :</span>
                        <span className="font-tabular text-error">- 12 600 F</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Impôt IPTS :</span>
                        <span className="font-tabular text-error">- 32 764 F</span>
                      </div>
                      <div className="flex justify-between font-bold text-ink pt-1 border-t border-dashed border-border">
                        <span>Net à payer :</span>
                        <span className="font-tabular text-success-deep">304 636 FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display text-ink mb-2">Fiches de paie prêtes en 2 minutes</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Indiquez simplement le salaire brut pour obtenir un bulletin clair avec les cotisations CNSS et IPTS exactes.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a
                href="#rendez-vous"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl transition shadow-xs text-sm sm:text-base min-h-[48px]"
              >
                <span>Prendre rendez-vous</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 6. CAS CONCRETS AU BÉNIN */}
        <section className="py-20 bg-ink text-white border-b border-ink-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                Accompagnement terrain au Bénin
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Ce que notre équipe met en place avec vous
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/70">
                Trois exemples concrets d&apos;accompagnement selon votre secteur d&apos;activité.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-ink-surface text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-ink-border">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/70 mb-3">
                    <span className="font-bold text-white text-sm">Prestations &amp; conseil</span>
                    <span className="text-xs text-primary font-medium">Cotonou</span>
                  </div>
                  <h4 className="font-bold text-base text-white mb-2 font-display">
                    Paramétrage complet dès le premier jour
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Nous importons vos clients par IFU, configurons vos modèles de devis et factures DGI et connectons votre équipe en une séance guidée.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-ink-border text-[11px] text-white/60">
                  Objectif : facturer e-MECeF sans boîtier
                </div>
              </div>

              <div className="bg-ink-surface text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-ink-border">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/70 mb-3">
                    <span className="font-bold text-white text-sm">Bureaux d&apos;études &amp; PME</span>
                    <span className="text-xs text-primary font-medium">Bénin / UEMOA</span>
                  </div>
                  <h4 className="font-bold text-base text-white mb-2 font-display">
                    Reprise propre avant vos déclarations
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Votre conseiller vérifie la cohérence de vos ventes, achats avec facture normalisée et retenues AIB pour aborder sereinement le 10 du mois.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-ink-border text-[11px] text-white/60">
                  Objectif : zéro oubli fiscal ou CNSS
                </div>
              </div>

              <div className="bg-ink-surface text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-ink-border">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/70 mb-3">
                    <span className="font-bold text-white text-sm">Commerces &amp; distribution</span>
                    <span className="text-xs text-primary font-medium">Cotonou / Porto-Novo</span>
                  </div>
                  <h4 className="font-bold text-base text-white mb-2 font-display">
                    Prise en main simple pour toute l&apos;équipe
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Nous formons votre assistante ou gérant sur place ou en visio pour enregistrer ventes, reçus par photo et encaissements Mobile Money au quotidien.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-ink-border text-[11px] text-white/60">
                  Objectif : sortir du papier et des cahiers
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. SECTION 5 : VOTRE COMPTABILITÉ AU JUSTE PRIX */}
        <section className="py-20 bg-background border-b border-border" id="tarifs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-48 h-40 mx-auto mb-4 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 240 200" width="100%" xmlns="http://www.w3.org/2000/svg">
                <line className="coin-trail" x1="120" x2="120" y1="20" y2="60" />
                <g className="coin-anim">
                  <ellipse cx="120" cy="40" fill="#FFD946" rx="14" ry="17" stroke="#332E29" strokeWidth="2.5" />
                  <ellipse cx="120" cy="40" fill="none" rx="10" ry="13" stroke="#332E29" strokeDasharray="3 2" strokeWidth="1.5" />
                  <text fill="#332E29" fontFamily="'Inter', sans-serif" fontSize="10" fontWeight="900" textAnchor="middle" x="120" y="44">F</text>
                </g>
                <g className="piggy-bounce">
                  <ellipse cx="120" cy="74" fill="#332E29" rx="15" ry="3.5" />
                  <path d="M 64 116 C 52 114, 46 102, 53 96 C 59 90, 68 96, 61 104" fill="none" stroke="#332E29" strokeLinecap="round" strokeWidth="2.5" />
                  <rect fill="#FDFBF7" height="20" rx="6" stroke="#332E29" strokeWidth="2.5" width="14" x="80" y="142" />
                  <rect fill="#FDFBF7" height="18" rx="6" stroke="#332E29" strokeWidth="2.5" width="14" x="105" y="145" />
                  <rect fill="#FDFBF7" height="18" rx="6" stroke="#332E29" strokeWidth="2.5" width="14" x="142" y="145" />
                  <rect fill="#FDFBF7" height="20" rx="6" stroke="#332E29" strokeWidth="2.5" width="14" x="162" y="142" />
                  <path className="piggy-body" d="M 72 120 C 68 90, 90 74, 120 74 C 158 74, 185 92, 184 122 C 183 148, 155 152, 122 152 C 88 152, 74 142, 72 120 Z" />
                  <path d="M 148 76 C 148 62, 164 60, 168 73 C 170 82, 158 84, 148 76 Z" fill="#FFD946" stroke="#332E29" strokeLinejoin="round" strokeWidth="2.5" />
                  <g className="piggy-eye">
                    <circle cx="152" cy="98" fill="#332E29" r="4" />
                    <circle cx="153.5" cy="96.5" fill="#FFFFFF" r="1.2" />
                  </g>
                  <g transform="translate(176, 102)">
                    <ellipse className="piggy-snout" cx="6" cy="6" rx="14" ry="11" />
                    <circle cx="2" cy="6" fill="#332E29" r="2.2" />
                    <circle cx="9" cy="6" fill="#332E29" r="2.2" />
                  </g>
                  <circle cx="140" cy="112" fill="#FFD946" opacity="0.4" r="7" />
                </g>
                <g className="sparkle-star" transform="translate(196, 60)">
                  <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" />
                </g>
                <g className="sparkle-star" style={{ animationDelay: "0.8s" }} transform="translate(58, 68)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-star" style={{ animationDelay: "1.4s" }} transform="translate(185, 145)">
                  <path d="M 0 -5 L 1.2 -1.2 L 5 0 L 1.2 1.2 L 0 5 L -1.2 1.2 L -5 0 L -1.2 -1.2 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">
              Un accompagnement adapté à votre taille
            </h2>
            <p className="mt-3 text-base text-text-muted max-w-xl mx-auto">
              Des formules claires en FCFA, sans frais cachés ni engagement.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tarifs"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl transition shadow-xs text-sm sm:text-base min-h-[48px]"
              >
                <span>Voir les tarifs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-text-muted mt-3">Tarifs en FCFA - Sans engagement - Annulation en 1 clic</p>
          </div>
        </section>

        {/* 8. SHOWCASE INTERACTIF À ONGLETS */}
        <section className="py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                Une prise en charge complète de vos comptes
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Comptabilité, facturation, trésorerie et déclarations réunis au même endroit avec notre équipe.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
              <button
                type="button"
                onClick={() => setActiveTab("compta")}
                className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition border cursor-pointer ${
                  activeTab === "compta"
                    ? "bg-primary text-ink border-ink shadow-xs"
                    : "bg-background text-ink border-border hover:bg-border/40"
                }`}
              >
                Comptabilité &amp; Suivi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("facturation")}
                className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition border cursor-pointer ${
                  activeTab === "facturation"
                    ? "bg-primary text-ink border-ink shadow-xs"
                    : "bg-background text-ink border-border hover:bg-border/40"
                }`}
              >
                Factures &amp; Devis DGI
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("compte")}
                className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition border cursor-pointer ${
                  activeTab === "compte"
                    ? "bg-primary text-ink border-ink shadow-xs"
                    : "bg-background text-ink border-border hover:bg-border/40"
                }`}
              >
                Banques &amp; Mobile Money
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bilan")}
                className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition border cursor-pointer ${
                  activeTab === "bilan"
                    ? "bg-primary text-ink border-ink shadow-xs"
                    : "bg-background text-ink border-border hover:bg-border/40"
                }`}
              >
                Bilan &amp; Clôture
              </button>
            </div>

            <div className="bg-background rounded-3xl border border-border p-6 sm:p-10 shadow-xs">
              {activeTab === "compta" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-ink">
                      Vos comptes à jour et vérifiés au quotidien
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Vos entrées et sorties d&apos;argent sont classées automatiquement. Vous vérifiez que chaque dépense a son justificatif pour être prêt en cas de contrôle.
                    </p>
                    <div className="pt-2">
                      <a
                        href="#rendez-vous"
                        className="inline-flex items-center gap-2 text-sm font-bold text-ink border border-border px-5 py-2.5 rounded-xl hover:bg-background-secondary transition min-h-[44px]"
                      >
                        <span>Parler à un conseiller</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-background-secondary rounded-2xl border border-border p-5">
                    <div className="bg-background rounded-xl border border-border p-4 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3 gap-2">
                        <span className="text-xs font-bold text-ink">Compte principal BOA Bénin (exemple)</span>
                        <div className="text-sm font-bold font-display text-ink font-tabular">4 116 500 FCFA</div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-background-secondary border border-border/60 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-text-muted font-mono">25 Juin</span>
                            <span className="font-semibold text-ink">Fournisseur Fibre Internet</span>
                          </div>
                          <span className="font-tabular font-bold text-error">- 45 000 FCFA</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-background-secondary border border-border/60 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-text-muted font-mono">24 Juin</span>
                            <span className="font-semibold text-ink">Virement Client Alpha</span>
                          </div>
                          <span className="font-tabular font-bold text-success-deep">+ 1 200 000 FCFA</span>
                        </div>
                      </div>
                      <div className="pt-1 flex items-center justify-between text-[11px] text-text-muted">
                        <span>Opérations rapprochées</span>
                        <span className="text-success-deep font-bold">À jour</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "facturation" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-ink">
                      Factures et devis avec QR code officiel DGI
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Créez et envoyez des factures normalisées en quelques secondes. Partagez-les par WhatsApp ou e-mail à vos clients pour être réglé plus vite.
                    </p>
                    <div className="pt-2">
                      <a
                        href="#rendez-vous"
                        className="inline-flex items-center gap-2 text-sm font-bold text-ink border border-border px-5 py-2.5 rounded-xl hover:bg-background-secondary transition min-h-[44px]"
                      >
                        <span>Parler à un conseiller</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-background-secondary rounded-2xl border border-border p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-3">
                      <FileCheck className="w-6 h-6 text-ink" />
                    </div>
                    <p className="text-sm font-bold text-ink font-display">Facturation officielle certifiée DGI</p>
                    <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                      QR code légal et signature électronique ajoutés automatiquement à chaque facture.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "compte" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-ink">
                      Vos comptes bancaires et Mobile Money réunis
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      MTN MoMo, Moov Money, Celtiis et comptes bancaires au même endroit : vous voyez ce qui est encaissé et ce qu&apos;il reste à régler.
                    </p>
                    <div className="pt-2">
                      <a
                        href="#rendez-vous"
                        className="inline-flex items-center gap-2 text-sm font-bold text-ink border border-border px-5 py-2.5 rounded-xl hover:bg-background-secondary transition min-h-[44px]"
                      >
                        <span>Parler à un conseiller</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-background-secondary rounded-2xl border border-border p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-3">
                      <Landmark className="w-6 h-6 text-ink" />
                    </div>
                    <p className="text-sm font-bold text-ink font-display">Trésorerie suivie au même endroit</p>
                    <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                      Compatible avec les principaux opérateurs Mobile Money et banques du Bénin.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "bilan" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-ink">
                      Votre bilan annuel préparé sans panique
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      En fin d&apos;exercice, vos journaux et balances sont propres pour être transmis directement à votre comptable ou pour votre dépôt annuel.
                    </p>
                    <div className="pt-2">
                      <a
                        href="#rendez-vous"
                        className="inline-flex items-center gap-2 text-sm font-bold text-ink border border-border px-5 py-2.5 rounded-xl hover:bg-background-secondary transition min-h-[44px]"
                      >
                        <span>Parler à un conseiller</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-background-secondary rounded-2xl border border-border p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-6 h-6 text-ink" />
                    </div>
                    <p className="text-sm font-bold text-ink font-display">Clôture annuelle et bilan prêts</p>
                    <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                      Dossier conforme SYSCOHADA révisé prêt pour votre expert-comptable et la DGI.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 9. ASSISTANCE & TRANSITION */}
        <section className="py-20 bg-background border-b border-border" id="accompagnement">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="bg-ink text-white rounded-3xl overflow-hidden border border-ink-border shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary block">
                    Assistance basée à Cotonou
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-bold font-display text-white tracking-tight leading-tight">
                    Une question ? Un conseiller vous répond sous 2 heures ouvrées
                  </h3>
                  <p className="text-sm text-white/75 leading-relaxed max-w-xl">
                    Pas de robot impersonnel : vous échangez directement par WhatsApp ou téléphone avec notre équipe basée à Cotonou.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href="#rendez-vous"
                      className="px-7 py-3.5 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl transition text-sm min-h-[48px] flex items-center justify-center"
                    >
                      Prendre rendez-vous
                    </a>
                    <span className="text-xs text-white/60">Lundi - vendredi, 8h00 à 18h30</span>
                  </div>
                </div>

                <div className="lg:col-span-5 relative aspect-[3/2] lg:aspect-auto lg:h-full lg:min-h-[360px]">
                  <Image
                    src="/images/conseillere-cotonou.jpg"
                    alt="Conseillère clientèle Ceilow à Cotonou avec micro-casque"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                </div>
              </div>
            </div>

            <div className="bg-background-secondary rounded-3xl overflow-hidden border border-border shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                <div className="lg:col-span-5 relative aspect-[3/2] lg:aspect-auto lg:h-full lg:min-h-[360px] order-2 lg:order-1">
                  <Image
                    src="/images/collaboration-comptable.jpg"
                    alt="Collaborateurs béninois travaillant ensemble sur ordinateur"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                </div>

                <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 order-1 lg:order-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted block">
                    Transition accompagnée
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-bold font-display text-ink tracking-tight leading-tight">
                    Vous venez d&apos;Excel ou avez déjà un comptable ? Nous gérons la reprise
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed max-w-xl">
                    Nous ouvrons un accès gratuit à votre comptable et importons vos fichiers clients, articles et soldes sous 48h ouvrées.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 rounded-xl border border-border bg-background">
                      <p className="font-bold text-xs text-ink">Accès gratuit pour votre comptable</p>
                      <p className="text-[11px] text-text-muted mt-0.5">Il consulte vos chiffres et exporte vos pièces sans vous déranger.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background">
                      <p className="font-bold text-xs text-ink">Reprise complète de vos données</p>
                      <p className="text-[11px] text-text-muted mt-0.5">Vos anciens tableaux et listes clients importés sans ressaisie.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FAQ EN 2 COLONNES */}
        <section className="py-20 bg-background border-b border-border" id="faq">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                Questions fréquentes
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Tout ce qu&apos;il faut savoir pour démarrer sereinement au Bénin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-6xl mx-auto">
              <div className="space-y-4">
                {faqList.slice(0, 4).map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-background-secondary rounded-2xl border border-border overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 text-sm font-bold text-ink focus:outline-none cursor-pointer min-h-[48px]"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-ink shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-text-muted leading-relaxed border-t border-border/60 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4">
                {faqList.slice(4, 8).map((faq, idx) => {
                  const actualIdx = idx + 4;
                  const isOpen = openFaqIndex === actualIdx;
                  return (
                    <div
                      key={actualIdx}
                      className="bg-background-secondary rounded-2xl border border-border overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(actualIdx)}
                        aria-expanded={isOpen}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 text-sm font-bold text-ink focus:outline-none cursor-pointer min-h-[48px]"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-ink shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-text-muted leading-relaxed border-t border-border/60 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 11. BANNIÈRE PRÉ-FOOTER */}
        <section className="py-20 bg-background-secondary border-b border-border" id="rendez-vous">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-background rounded-3xl border border-border p-8 sm:p-12 overflow-hidden shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-ink" />
                    <span>Démarrage rapide</span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-bold font-display text-ink tracking-tight leading-tight">
                    Prêt à vous libérer de la paperasse ?
                  </h2>

                  <p className="text-base text-text-muted leading-relaxed max-w-xl">
                    Gagnez du temps chaque semaine et abordez chaque date limite fiscale avec sérénité.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                    <a
                      href="#diagnostic-form"
                      className="px-8 py-3.5 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl text-center transition shadow-xs text-sm sm:text-base min-h-[48px] flex items-center justify-center gap-2"
                    >
                      <span>Prendre rendez-vous</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <Link
                      href="/tarifs"
                      className="px-7 py-3.5 border border-border bg-background hover:bg-background-secondary font-semibold text-ink rounded-xl text-center transition text-sm sm:text-base min-h-[48px] flex items-center justify-center"
                    >
                      Voir les tarifs
                    </Link>
                  </div>

                  <div className="text-xs text-text-muted pt-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success-deep shrink-0" />
                    <span>Sans engagement - Assistance locale à Cotonou</span>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="rounded-2xl overflow-hidden border border-border shadow-xs relative aspect-[3/2] w-full">
                    <Image
                      src="/images/collaboration-comptable.jpg"
                      alt="Entrepreneur béninois souriant consultant sa gestion sur smartphone"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 500px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12. FORMULAIRE DE DIAGNOSTIC */}
        <section id="diagnostic-form" className="w-full py-16 bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-background-secondary border border-border shadow-xs">
              <div className="text-center mb-8">
                <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                  Contact direct
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-ink">
                  Réservez votre échange gratuit de 15 min
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-text-muted">
                  Laissez vos coordonnées. Un conseiller à Cotonou vous rappelle sous 2 heures ouvrées.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-background border border-border text-center flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-success-deep" />
                  <span className="text-base font-bold text-ink">Demande enregistrée</span>
                  <p className="text-xs text-text-muted max-w-md">
                    Merci {formData.name || "cher dirigeant"}. Un conseiller Ceilow basé à Cotonou vous contactera sous 2 heures ouvrées.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-ink underline hover:opacity-80 cursor-pointer min-h-[44px]"
                  >
                    Nouvelle demande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="form-name" className="text-xs font-bold text-ink">
                      Votre nom et prénom
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex. : Marcel Agbossou"
                      className="h-11 min-h-[44px] px-4 rounded-xl border border-border bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="form-company" className="text-xs font-bold text-ink">
                      Nom de votre entreprise &amp; forme juridique
                    </label>
                    <input
                      id="form-company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Ex. : Bénin Distribution SARL"
                      className="h-11 min-h-[44px] px-4 rounded-xl border border-border bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="form-phone" className="text-xs font-bold text-ink">
                      Numéro de téléphone / WhatsApp
                    </label>
                    <input
                      id="form-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex. : +229 01 97 55 49 53"
                      className="h-11 min-h-[44px] px-4 rounded-xl border border-border bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="form-need" className="text-xs font-bold text-ink">
                      Votre priorité immédiate
                    </label>
                    <select
                      id="form-need"
                      value={formData.need}
                      onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                      className="h-11 min-h-[44px] px-4 rounded-xl border border-border bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="transition">Reprendre mes anciens fichiers et démarrer sans stress</option>
                      <option value="mecef">Émettre des factures certifiées DGI sans boîtier physique</option>
                      <option value="compta">Suivre ma trésorerie et mes paiements Mobile Money / banque</option>
                      <option value="expert">Préparer mes déclarations fiscales et de TVA</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="h-12 min-h-[48px] px-8 bg-primary hover:bg-primary-hover text-ink font-bold text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <span>Confirmer le rendez-vous</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <span className="text-[11px] text-text-muted text-center mt-1">
                    Vos données restent confidentielles et traitées selon les règles APDP Bénin.
                  </span>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER PUBLIC UNIFIÉ (PLEINE LARGEUR) ── */}
      <PublicFooter />
    </div>
  );
}
