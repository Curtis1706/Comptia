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
      `}</style>

      {/* ── HEADER PUBLIC UNIFIÉ (PLEINE LARGEUR) ── */}
      <PublicHeader />

      <main className="flex-1 w-full">
        {/* ── 1. HERO SECTION SPLIT SCREEN ── */}
        <section className="w-full bg-background pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              {/* Colonne Gauche : Copywriting & CTAs */}
              <div className="lg:col-span-7 flex flex-col items-start gap-6">


                <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold font-clash text-ink tracking-tight leading-[1.15]">
                  Gérez votre société l&apos;esprit tranquille, avec un <span className="bg-primary/30 px-1.5 py-0.5 rounded">conseiller dédié</span> à vos côtés
                </h1>

                <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                  Ne perdez plus vos soirées dans la paperasse. Nous configurons vos accès, reprenons vos anciens dossiers sous 48h et répondons à toutes vos questions pour sécuriser votre activité.
                </p>

                {/* 4 Checklist Items orientés utilité et sérénité */}
                <ul className="flex flex-col gap-3 w-full pt-1">
                  <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-ink">
                    <span className="w-5 h-5 rounded-full bg-success/20 text-success-deep flex items-center justify-center shrink-0 border border-success/30">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>Reprise complète de vos anciens fichiers sous 48h ouvrées</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-ink">
                    <span className="w-5 h-5 rounded-full bg-success/20 text-success-deep flex items-center justify-center shrink-0 border border-success/30">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>Factures certifiées DGI avec QR code en un clic, zéro pénalité</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-ink">
                    <span className="w-5 h-5 rounded-full bg-success/20 text-success-deep flex items-center justify-center shrink-0 border border-success/30">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>Trésorerie et Mobile Money (MTN, Moov, Celtiis) suivis en direct</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-ink">
                    <span className="w-5 h-5 rounded-full bg-success/20 text-success-deep flex items-center justify-center shrink-0 border border-success/30">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>Déclarations de TVA et bilans préparés sans calcul fastidieux</span>
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
                    Découvrir les formules
                  </Link>
                </div>

                {/* Microcopy de confiance authentique */}
                <div className="flex items-center gap-2 text-xs text-text-muted pt-1">
                  <ShieldCheck className="w-4 h-4 text-success-deep shrink-0" />
                  <span>Échange gratuit de 15 min sans engagement • Conseils concrets pour votre société</span>
                </div>
              </div>

              {/* Colonne Droite : Visuel Professionnel Pur */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-3xl overflow-hidden border border-border bg-background-secondary shadow-sm">
                  <div className="relative w-full h-[460px] sm:h-[500px]">
                    <Image
                      src="/images/dirigeante-benin.jpg"
                      alt="Dirigeante d'entreprise à Cotonou gérant sa société avec Ceilow"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 500px"
                    />
                  </div>

                  {/* Bandeau d'information ancré */}
                  <div className="p-4 bg-background border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs font-bold text-ink">Mise en service clé en main sous 48h</span>
                    </div>
                    <span className="text-[11px] text-text-muted font-medium">Conseillers à Cotonou</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. RUBAN DE RÉASSURANCE PROFESSIONNELLE ── */}
        <section className="border-b border-border bg-background-secondary py-6">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="font-clash font-bold text-sm sm:text-base text-ink flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-ink" />
                  Conseillers à Cotonou
                </span>
                <span className="text-xs text-text-muted">Joignables par appel direct &amp; WhatsApp</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="font-clash font-bold text-sm sm:text-base text-ink flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-success-deep" />
                  Facturation certifiée DGI
                </span>
                <span className="text-xs text-text-muted">QR code officiel légal en 3 secondes</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="font-clash font-bold text-sm sm:text-base text-ink flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-primary" />
                  Banques &amp; Mobile Money
                </span>
                <span className="text-xs text-text-muted">Vos encaissements suivis en direct</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="font-clash font-bold text-sm sm:text-base text-ink flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-success-deep" />
                  Démarrage sous 48h
                </span>
                <span className="text-xs text-text-muted">Reprise de données et formation incluses</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. SECTION 1 : VOUS PILOTEZ VOTRE ACTIVITÉ, NOUS SÉCURISONS VOS COMPTES ── */}
        <section className="py-20 bg-background border-b border-border" id="fonctionnalites">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink tracking-tight">
                Vous pilotez votre activité, nous sécurisons vos comptes
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Ne restez plus jamais seul face aux doutes administratifs. Chaque jour, votre conseiller dédié veille sur vos opérations pour que votre entreprise soit toujours en règle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Carte 1 : Recettes et dépenses classées sans effort */}
              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[260px] flex flex-col justify-between">
                  {/* Synchronisation bancaire */}
                  <div className="bg-background-secondary rounded-xl p-3 border border-border">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-ink">Comptes synchronisés</span>
                      <span className="w-4 h-4 rounded-full bg-success/20 text-success-deep flex items-center justify-center text-[10px] font-bold">✓</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-background text-ink border border-border">BOA Bénin</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-ink">MTN MoMo</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-background text-text-muted border border-border">Moov Money</span>
                    </div>
                  </div>

                  {/* Métrique Trésorerie & Graphique Vectoriel */}
                  <div className="mt-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs text-text-muted font-medium">Solde disponible</span>
                      <span className="text-xs font-bold text-success-deep bg-success/20 px-1.5 py-0.5 rounded font-tabular">+12.4%</span>
                    </div>
                    <div className="text-2xl font-bold font-clash text-ink font-tabular mb-4">14 850 000 FCFA</div>
                    {/* Bâtonnets vectoriels */}
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
                  <h3 className="text-lg font-bold font-clash text-ink mb-2">Vos recettes et dépenses classées sans effort</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Vos encaissements bancaires et Mobile Money s&apos;enregistrent au fil de l&apos;eau. Votre conseiller s&apos;assure que chaque dépense est bien rangée pour connaître vos bénéfices réels.
                  </p>
                </div>
              </div>

              {/* Carte 2 : Facturez en règle dès le premier jour */}
              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[260px] flex flex-col justify-between">
                  {/* Sélecteur de couleur */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <span className="text-xs font-bold text-ink">Couleur de facture</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedColor("gold")}
                        className={`w-4 h-4 rounded-full bg-primary ${selectedColor === "gold" ? "ring-2 ring-ink ring-offset-1" : ""}`}
                        aria-label="Thème Jaune"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedColor("ink")}
                        className={`w-4 h-4 rounded-full bg-ink ${selectedColor === "ink" ? "ring-2 ring-ink ring-offset-1" : ""}`}
                        aria-label="Thème Sombre"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedColor("green")}
                        className={`w-4 h-4 rounded-full bg-success-deep ${selectedColor === "green" ? "ring-2 ring-ink ring-offset-1" : ""}`}
                        aria-label="Thème Vert"
                      />
                    </div>
                  </div>

                  {/* Aperçu Facture Miniature */}
                  <div className="bg-background-secondary rounded-xl p-3 border border-border space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-ink">
                        <span className="w-2.5 h-2.5 rounded bg-primary inline-block" />
                        <span>Cabinet Horizon SARL</span>
                      </div>
                      <span className="text-[10px] text-text-muted font-mono">FAC-2026-089</span>
                    </div>
                    <div className="text-[11px] py-1 border-y border-dashed border-border flex justify-between">
                      <span>Audit &amp; Conseil juridique</span>
                      <span className="font-tabular font-bold">250 000 FCFA</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/20 text-success-deep border border-success/30 rounded text-[9px] font-bold">
                        <span>✓</span> e-MECeF DGI Signé
                      </div>
                      <span className="px-2 py-0.5 bg-primary text-ink font-bold text-[10px] rounded">
                        Émise
                      </span>
                    </div>
                  </div>

                  {/* QR code DGI */}
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-text-muted">
                    <div className="w-6 h-6 bg-ink text-primary font-mono text-[6px] font-bold flex items-center justify-center rounded">DGI</div>
                    <span>QR code légal généré instantanément</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-clash text-ink mb-2">Facturez en règle dès le premier jour</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Créez des devis et des factures normalisées avec QR code officiel en 3 clics. Vos clients sont rassurés et votre entreprise est protégée contre tout risque de pénalité.
                  </p>
                </div>
              </div>

              {/* Carte 3 : Fini les reçus perdus */}
              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[260px] flex items-center justify-center">
                  <div className="relative w-48 bg-background border-2 border-ink rounded-2xl p-3 shadow-xs overflow-hidden">
                    <div className="w-12 h-2 bg-ink rounded-full mx-auto mb-2" />
                    <div className="relative bg-background-secondary border border-dashed border-border rounded-lg p-2.5 text-center">
                      <div className="absolute left-0 right-0 h-0.5 bg-success shadow-xs animate-laser" />
                      <div className="text-[10px] font-bold text-ink uppercase tracking-wider">Hôtel du Lac Cotonou</div>
                      <div className="text-[9px] text-text-muted my-0.5">14 Mars 2026 • 13:42</div>
                      <div className="text-sm font-bold font-tabular text-ink my-1">42 000 FCFA</div>
                      <div className="text-[8px] text-text-muted border-t border-dashed border-border pt-1 font-tabular">TVA 18% incluse (6 406 F)</div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/20 text-success-deep border border-success/30 text-[10px] font-bold">
                        <span>✓</span> Reçu numérisé
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-clash text-ink mb-2">Fini les reçus perdus dans les tiroirs</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Prenez vos factures d&apos;achat et tickets de caisse en photo avec votre téléphone. Nous les rattachons directement à vos opérations pour déduire vos charges en toute légalité.
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton d'action central */}
            <div className="mt-12 text-center">
              <a
                href="#rendez-vous"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl transition shadow-xs text-sm sm:text-base min-h-[48px]"
              >
                <span>Prendre rendez-vous avec un conseiller</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── 4. SECTION 2 : BANNIÈRE SOMBRE 5 PILIERS ── */}
        <section className="py-14 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-ink text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-sm">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold font-clash tracking-tight text-white">
                  Un accompagnement humain, simple et sans mauvaises surprises
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Nous combinons la rapidité d&apos;un outil moderne avec l&apos;écoute d&apos;un conseiller qui connaît votre métier.
                </p>
              </div>

              {/* 5 Piliers illustrés */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
                <div className="space-y-3 p-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Simple</h3>
                  <p className="text-xs text-white/70 leading-normal">Aucun jargon, vous êtes autonome dès le premier jour.</p>
                </div>

                <div className="space-y-3 p-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                    <Headphones className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Dédié</h3>
                  <p className="text-xs text-white/70 leading-normal">Un interlocuteur unique joignable par appel ou WhatsApp.</p>
                </div>

                <div className="space-y-3 p-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                    <Award className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Clé en main</h3>
                  <p className="text-xs text-white/70 leading-normal">Reprise de vos anciens comptes et formation de votre équipe.</p>
                </div>

                <div className="space-y-3 p-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Transparent</h3>
                  <p className="text-xs text-white/70 leading-normal">Tarifs clairs en FCFA, sans engagement ni frais cachés.</p>
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-3 p-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Sérénité totale</h3>
                  <p className="text-xs text-white/70 leading-normal">Zéro retard fiscal, vos échéances sont surveillées pour vous.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. SECTION 3 : NE REDOUTEZ PLUS LES DATES LIMITES FISCALES ── */}
        <section className="py-20 bg-background border-b border-border" id="conformite-dgi">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink tracking-tight">
                Ne redoutez plus les dates limites fiscales
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Fini le stress du 10 du mois. Votre conseiller vérifie vos montants et prépare vos déclarations avant chaque date limite pour éviter toute pénalité.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Carte 1 : Déclarations d'impôts préparées */}
              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[250px] flex flex-col justify-between">
                  <div className="bg-background-secondary rounded-xl border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <span className="text-xs font-bold text-ink">Déclaration mensuelle</span>
                      <span className="text-[10px] font-bold text-success-deep bg-success/20 px-2 py-0.5 rounded-full">Vérifiée</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-text-muted">
                        <span>TVA à déclarer (18%)</span>
                        <span className="font-tabular font-bold text-ink">920 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Acompte d&apos;impôt</span>
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
                      <Check className="w-4 h-4 text-primary" />
                      Validation en 1 clic sans risque d&apos;erreur
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-clash text-ink mb-2">Vos déclarations d&apos;impôts préparées à l&apos;avance</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Pas besoin d&apos;être fiscaliste : nous calculons les montants exacts de votre TVA et de vos acomptes. Vous validez en un clic sans risque de redressement.
                  </p>
                </div>
              </div>

              {/* Carte 2 : Notifications d'échéances */}
              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[250px] flex items-center justify-center">
                  <div className="bg-background-secondary border-2 border-ink rounded-xl p-4 shadow-xs w-56 text-center">
                    <div className="pt-2">
                      <div className="w-8 h-8 mx-auto text-primary animate-bell mb-1">
                        <Bell className="w-7 h-7" />
                      </div>
                      <p className="text-xs font-bold text-ink">Échéance fiscale à venir</p>
                      <p className="text-[10px] text-text-muted mt-1 font-medium">Déclaration DGI du 10 du mois</p>
                      <div className="mt-2.5 inline-block px-3 py-1 bg-primary text-ink font-bold text-[10px] rounded-full">
                        Rappel actif
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-clash text-ink mb-2">Des rappels automatiques pour ne rien oublier</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Vous recevez une alerte bien avant chaque date limite. Votre conseiller veille au calendrier pour que vos dossiers soient déposés à l&apos;heure.
                  </p>
                </div>
              </div>

              {/* Carte 3 : Fiches de paie */}
              <div className="bg-background-secondary rounded-3xl border border-border p-6 sm:p-7 flex flex-col justify-between hover:border-ink transition-all shadow-xs">
                <div className="bg-background rounded-2xl border border-border p-5 mb-6 min-h-[250px] flex items-center justify-center">
                  <div className="w-52 bg-background-secondary rounded-xl border border-border p-3.5 space-y-2">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-[11px] font-bold text-ink">Fiche de paie — Mars</span>
                      <span className="text-[9px] font-semibold text-success-deep bg-success/20 px-1.5 py-0.5 rounded">Éditée</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between text-text-muted">
                        <span>Salaire Brut :</span>
                        <span className="font-tabular font-semibold text-ink">350 000 F</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>Cotisations CNSS (3.6%) :</span>
                        <span className="font-tabular text-[#991b1b]">- 12 600 F</span>
                      </div>
                      <div className="flex justify-between text-text-muted">
                        <span>VPS Patronale :</span>
                        <span className="font-tabular text-[#991b1b]">- 14 000 F</span>
                      </div>
                      <div className="flex justify-between font-bold text-ink pt-1 border-t border-dashed border-border">
                        <span>Net à payer :</span>
                        <span className="font-tabular text-success-deep">302 400 FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-clash text-ink mb-2">Les fiches de paie de votre équipe prêtes en 2 min</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Que vous soyez dirigeant ou employeur d&apos;une petite équipe, renseignez simplement le salaire et obtenez un bulletin clair avec les cotisations sociales exactes.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a
                href="#rendez-vous"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl transition shadow-xs text-sm sm:text-base min-h-[48px]"
              >
                <span>Prendre rendez-vous avec un conseiller</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── 6. SECTION 4 : PREUVE SOCIALE & CAS RÉELS (SANS TRUSTPILOT NI FAUX CHIFFRES) ── */}
        <section className="py-20 bg-ink text-white border-b border-white/10">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                Témoignages de dirigeants au Bénin
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-white tracking-tight">
                Ils gèrent leur société l&apos;esprit tranquille avec Ceilow
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/70">
                Découvrez comment des entrepreneurs et gestionnaires locaux gagnent du temps chaque semaine.
              </p>
            </div>

            {/* 3 Cartes Témoignages sobres & crédibles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#3D3830] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/70 mb-3">
                    <span className="font-bold text-white text-sm">Alain T.</span>
                    <span className="text-xs text-primary font-medium">Gérant de SASU (Ganhi)</span>
                  </div>
                  <h4 className="font-bold text-base text-white mb-2 font-clash">
                    « Un soulagement total sur la paperasse »
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    « J&apos;étais débordé par la gestion. Mon conseiller a configuré mon compte en une matinée et a importé toutes mes anciennes factures. Aujourd&apos;hui, dès que j&apos;ai une question, il me répond directement par WhatsApp. »
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-white/60">
                  Activité : Prestations de services informatiques
                </div>
              </div>

              <div className="bg-[#3D3830] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/70 mb-3">
                    <span className="font-bold text-white text-sm">Gaspard D.</span>
                    <span className="text-xs text-primary font-medium">Directeur de SARL (Cadjehoun)</span>
                  </div>
                  <h4 className="font-bold text-base text-white mb-2 font-clash">
                    « La sécurité de ne jamais être pénalisé »
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    « Le vrai plus pour nous, c&apos;est la vérification de nos chiffres avant chaque date limite. Mon conseiller s&apos;assure que tout est carré. Nous gagnons au moins 2 jours de travail par mois en toute sérénité. »
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-white/60">
                  Activité : Cabinet d&apos;ingénierie et d&apos;études
                </div>
              </div>

              <div className="bg-[#3D3830] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/70 mb-3">
                    <span className="font-bold text-white text-sm">Charles B.</span>
                    <span className="text-xs text-primary font-medium">Gérant d&apos;ETS (Porto-Novo)</span>
                  </div>
                  <h4 className="font-bold text-base text-white mb-2 font-clash">
                    « Une formation directe dans nos locaux »
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    « Nous tenions nos comptes sur des cahiers papier. L&apos;équipe de Ceilow s&apos;est déplacée pour former notre assistante en quelques heures. C&apos;est concret, humain et parfaitement adapté à notre réalité. »
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-white/60">
                  Activité : Commerce de gros et distribution
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. SECTION 5 : VOTRE COMPTABILITÉ AU JUSTE PRIX (TIRELIRE SVG ANIMÉE) ── */}
        <section className="py-20 bg-background border-b border-border" id="tarifs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Animation Tirelire SVG vectorielle pure */}
            <div className="w-48 h-40 mx-auto mb-4 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 240 200" width="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Ligne de chute de la pièce */}
                <line className="coin-trail" x1="120" x2="120" y1="20" y2="60" />
                <g className="coin-anim">
                  <ellipse cx="120" cy="40" fill="#FFD946" rx="14" ry="17" stroke="#332E29" strokeWidth="2.5" />
                  <ellipse cx="120" cy="40" fill="none" rx="10" ry="13" stroke="#332E29" strokeDasharray="3 2" strokeWidth="1.5" />
                  <text fill="#332E29" fontFamily="'Inter', sans-serif" fontSize="10" fontWeight="900" textAnchor="middle" x="120" y="44">F</text>
                </g>
                {/* Corps de la tirelire */}
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

            <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink tracking-tight">
              Un accompagnement accessible, qui s&apos;adapte à votre taille
            </h2>
            <p className="mt-3 text-base text-text-muted max-w-xl mx-auto">
              Ne payez que pour ce dont vous avez réellement besoin. Nos formules claires en FCFA vous déchargent de la gestion administrative sans aucun frais caché.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tarifs"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl transition shadow-xs text-sm sm:text-base min-h-[48px]"
              >
                <span>Découvrir nos formules</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-text-muted mt-3">Tarifs clairs en FCFA • Sans engagement • Résiliation en un clic</p>
          </div>
        </section>

        {/* ── 8. SECTION 6 : SHOWCASE INTERACTIF À ONGLETS ── */}
        <section className="py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink tracking-tight">
                Une prise en charge complète pour votre tranquillité
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Comptabilité, facturation, trésorerie et déclarations : tout est géré proprement au même endroit avec votre conseiller.
              </p>
            </div>

            {/* Onglets interactifs */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
              <button
                type="button"
                onClick={() => setActiveTab("compta")}
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition border ${
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
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition border ${
                  activeTab === "facturation"
                    ? "bg-primary text-ink border-ink shadow-xs"
                    : "bg-background text-ink border-border hover:bg-border/40"
                }`}
              >
                Factures &amp; Devis certifiés
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("compte")}
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition border ${
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
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition border ${
                  activeTab === "bilan"
                    ? "bg-primary text-ink border-ink shadow-xs"
                    : "bg-background text-ink border-border hover:bg-border/40"
                }`}
              >
                Bilan &amp; Clôture sans stress
              </button>
            </div>

            {/* Panneau actif */}
            <div className="bg-background rounded-3xl border border-border p-6 sm:p-10 shadow-xs">
              {activeTab === "compta" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <h3 className="text-2xl sm:text-3xl font-bold font-clash text-ink">
                      Vos comptes à jour et vérifiés au quotidien
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Vos entrées et sorties d&apos;argent sont automatiquement classées. Votre conseiller vérifie que chaque dépense dispose de son justificatif pour que vous soyez serein en cas de contrôle.
                    </p>
                    <div className="pt-2">
                      <a
                        href="#rendez-vous"
                        className="inline-flex items-center gap-2 text-sm font-bold text-ink border border-border px-5 py-2.5 rounded-xl hover:bg-background-secondary transition"
                      >
                        <span>Échanger avec un conseiller</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-background-secondary rounded-2xl border border-border p-5">
                    <div className="bg-background rounded-xl border border-border p-4 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-primary" />
                          <span className="text-xs font-bold text-ink">Compte Principal BOA Bénin</span>
                        </div>
                        <div className="text-sm font-bold font-clash text-ink font-tabular">4 116 500 FCFA</div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-background-secondary border border-border/60 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-text-muted font-mono">25 Juin</span>
                            <span className="font-semibold text-ink">Fournisseur Fibre Internet</span>
                          </div>
                          <span className="font-tabular font-bold text-[#991b1b]">- 45 000 FCFA</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-background-secondary border border-border/60 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-text-muted font-mono">24 Juin</span>
                            <span className="font-semibold text-ink">Virement Client Cabinet Alpha</span>
                          </div>
                          <span className="font-tabular font-bold text-success-deep">+ 1 200 000 FCFA</span>
                        </div>
                      </div>
                      <div className="pt-1 flex items-center justify-between text-[11px] text-text-muted">
                        <span>✓ Opérations rapprochées et classées</span>
                        <span className="text-success-deep font-bold">Comptes à jour et vérifiés</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "facturation" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <h3 className="text-2xl sm:text-3xl font-bold font-clash text-ink">
                      Factures et devis avec QR code officiel DGI
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Créez et envoyez des factures normalisées certifiées en quelques secondes. Partagez-les directement par WhatsApp ou email à vos clients pour un règlement rapide.
                    </p>
                    <div className="pt-2">
                      <a
                        href="#rendez-vous"
                        className="inline-flex items-center gap-2 text-sm font-bold text-ink border border-border px-5 py-2.5 rounded-xl hover:bg-background-secondary transition"
                      >
                        <span>Échanger avec un conseiller</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-background-secondary rounded-2xl border border-border p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-3">
                      <FileCheck className="w-6 h-6 text-ink" />
                    </div>
                    <p className="text-sm font-bold text-ink font-clash">Facturation officielle certifiée DGI</p>
                    <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                      QR code légal et signature électronique générés automatiquement à chaque émission.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "compte" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <h3 className="text-2xl sm:text-3xl font-bold font-clash text-ink">
                      Vos comptes bancaires et Mobile Money réunis
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      MTN MoMo, Moov Money, Celtiis et comptes bancaires : fini les allers-retours entre vos relevés. Vous voyez exactement ce que vous avez encaissé et ce qu&apos;il vous reste.
                    </p>
                    <div className="pt-2">
                      <a
                        href="#rendez-vous"
                        className="inline-flex items-center gap-2 text-sm font-bold text-ink border border-border px-5 py-2.5 rounded-xl hover:bg-background-secondary transition"
                      >
                        <span>Échanger avec un conseiller</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-background-secondary rounded-2xl border border-border p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-3">
                      <Landmark className="w-6 h-6 text-ink" />
                    </div>
                    <p className="text-sm font-bold text-ink font-clash">Trésorerie unifiée en temps réel</p>
                    <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                      Compatible avec tous les opérateurs Mobile Money et les établissements bancaires de la place béninoise.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "bilan" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-5">
                    <h3 className="text-2xl sm:text-3xl font-bold font-clash text-ink">
                      Votre bilan annuel préparé sans panique
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      En fin d&apos;exercice, votre dossier complet est prêt. Vos états financiers sont générés proprement pour être transmis directement à votre comptable ou à l&apos;administration fiscale.
                    </p>
                    <div className="pt-2">
                      <a
                        href="#rendez-vous"
                        className="inline-flex items-center gap-2 text-sm font-bold text-ink border border-border px-5 py-2.5 rounded-xl hover:bg-background-secondary transition"
                      >
                        <span>Échanger avec un conseiller</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-background-secondary rounded-2xl border border-border p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-6 h-6 text-ink" />
                    </div>
                    <p className="text-sm font-bold text-ink font-clash">Clôture annuelle et bilan sécurisés</p>
                    <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                      Dossier complet et certifié prêt pour votre expert-comptable et pour la DGI.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 9. SECTION 7 : MODULES HUMAINS & TRANSITION ── */}
        <section className="py-20 bg-background border-b border-border" id="accompagnement">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Bloc Sombre : Support Client à Cotonou */}
            <div className="bg-ink text-white rounded-3xl overflow-hidden border border-white/10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
                  <span className="inline-block px-3 py-1 bg-white/10 text-primary border border-white/20 rounded-full text-xs font-semibold">
                    Assistance dédiée à Cotonou
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-bold font-clash text-white tracking-tight leading-tight">
                    Une question ou un doute ? Votre conseiller vous répond en 15 minutes
                  </h3>
                  <p className="text-sm text-white/75 leading-relaxed max-w-xl">
                    Pas de ticket sans réponse ni de robot impersonnel. Votre conseiller dédié connaît votre activité et vous guide pas à pas par WhatsApp ou téléphone pour chaque décision.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href="#rendez-vous"
                      className="px-7 py-3.5 bg-primary hover:bg-primary-hover font-bold text-ink rounded-xl transition text-sm min-h-[48px] flex items-center justify-center"
                    >
                      Prendre rendez-vous
                    </a>
                    <span className="text-xs text-white/60">Réponse moyenne en moins de 15 minutes</span>
                  </div>
                </div>

                <div className="lg:col-span-5 h-full relative min-h-[320px] sm:min-h-[380px]">
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

            {/* Bloc Clair : Transition Comptable */}
            <div className="bg-background-secondary rounded-3xl overflow-hidden border border-border shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                <div className="lg:col-span-5 h-full relative min-h-[320px] sm:min-h-[380px] order-2 lg:order-1">
                  <Image
                    src="/images/collaboration-comptable.jpg"
                    alt="Collaborateurs béninois travaillant ensemble sur ordinateur"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                </div>

                <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 order-1 lg:order-2">
                  <span className="inline-block px-3 py-1 bg-background text-ink border border-border rounded-full text-xs font-semibold">
                    Transition zéro effort
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-bold font-clash text-ink tracking-tight leading-tight">
                    Vous venez d&apos;Excel ou avez déjà un comptable ? Nous gérons tout
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed max-w-xl">
                    Ne craignez pas de perdre vos habitudes : nous créons un accès gratuit pour votre comptable afin qu&apos;il récupère des données propres sans vous déranger, et nous reprenons l&apos;ensemble de votre historique sous 48h.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 rounded-xl border border-border bg-background">
                      <p className="font-bold text-xs text-ink">Accès gratuit pour votre comptable</p>
                      <p className="text-[11px] text-text-muted mt-0.5">Il consulte vos chiffres et télécharge vos pièces sans vous solliciter.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background">
                      <p className="font-bold text-xs text-ink">Reprise complète de vos données</p>
                      <p className="text-[11px] text-text-muted mt-0.5">Vos anciens fichiers et factures intégrés sans ressaisie manuelle.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10. SECTION 8 : FAQ EN 2 COLONNES (8 QUESTIONS SANS JARGON) ── */}
        <section className="py-20 bg-background border-b border-border" id="faq">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink tracking-tight">
                Questions fréquentes
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Tout ce que vous devez savoir pour démarrer sereinement au Bénin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-6xl mx-auto">
              {/* Colonne 1 */}
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
                        className="w-full text-left p-5 flex items-center justify-between text-sm font-bold text-ink focus:outline-none"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-ink shrink-0 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
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

              {/* Colonne 2 */}
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
                        className="w-full text-left p-5 flex items-center justify-between text-sm font-bold text-ink focus:outline-none"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-ink shrink-0 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
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

        {/* ── 11. SECTION 9 : BANNIÈRE PRÉ-FOOTER LIFESTYLE ── */}
        <section className="py-20 bg-background-secondary border-b border-border" id="rendez-vous">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-background rounded-3xl border border-border p-8 sm:p-12 overflow-hidden shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Texte Gauche */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Démarrage Immédiat</span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-bold font-clash text-ink tracking-tight leading-tight">
                    Prêt à vous libérer définitivement de la paperasse ?
                  </h2>

                  <p className="text-base text-text-muted leading-relaxed max-w-xl">
                    Rejoignez les dirigeants et entrepreneurs béninois qui gagnent des heures chaque semaine et abordent chaque date limite fiscale avec sérénité.
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
                      Découvrir les formules
                    </Link>
                  </div>

                  <div className="text-xs text-text-muted pt-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success-deep" />
                    <span>Sans engagement de durée • Assistance locale à Cotonou</span>
                  </div>
                </div>

                {/* Photo Droite */}
                <div className="lg:col-span-5 relative">
                  <div className="rounded-2xl overflow-hidden border border-border shadow-xs relative w-full h-[320px] sm:h-[360px]">
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

        {/* ── 12. SECTION FORMULAIRE DE DIAGNOSTIC ANCRÉ (#diagnostic-form) ── */}
        <section id="diagnostic-form" className="w-full py-16 bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-background-secondary border border-border shadow-xs">
              <div className="text-center mb-8">
                <span className="text-xs uppercase font-bold text-primary tracking-wider block mb-2">
                  Prise de Contact Directe
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-clash text-ink">
                  Réservez votre échange gratuit de 15 min
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-text-muted">
                  Indiquez vos coordonnées. Un conseiller spécialisé basé à Cotonou vous contacte sous 2 heures ouvrées pour faire le point sur votre activité.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-success/20 border border-success/30 text-center flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-success-deep" />
                  <span className="text-base font-bold text-ink">Demande enregistrée avec succès</span>
                  <p className="text-xs text-text-muted max-w-md">
                    Merci {formData.name || "cher dirigeant"}. Un conseiller Ceilow basé à Cotonou va vous rappeler au numéro renseigné dans un délai de 2 heures ouvrées.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-ink underline hover:text-primary"
                  >
                    Envoyer une autre demande
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
                      Nom de votre entreprise &amp; Forme juridique
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
                      placeholder="Ex. : +229 01 97 00 00 00"
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
                      <option value="mecef">Émettre des factures certifiées DGI sans me compliquer la vie</option>
                      <option value="compta">Suivre ma trésorerie et mes paiements Mobile Money / banque</option>
                      <option value="expert">Être épaulé pour mes déclarations fiscales et de TVA</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="h-12 min-h-[48px] px-8 bg-primary hover:bg-primary-hover text-ink font-bold text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Confirmer mon rendez-vous gratuit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <span className="text-[11px] text-text-muted text-center mt-1">
                    Vos données restent strictement confidentielles et traitées selon les normes APDP Bénin.
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
