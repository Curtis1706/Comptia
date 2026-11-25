"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  HelpCircle,
  Info,
  Lock,
  Receipt,
  Scale,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Wallet,
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

type TaxPeriodType = "tva_mensuelle" | "tps_acompte" | "aib_retenue";

interface StepItem {
  step: string;
  title: string;
  description: string;
  dgiPortalTab: string;
  recommandation: string;
}

const ESERVICES_STEPS: StepItem[] = [
  {
    step: "Étape 1",
    title: "Connexion sécurisée au portail e-Services",
    description:
      "Rendez-vous sur eservices.impots.bj. Renseignez votre numéro IFU (13 chiffres) et le mot de passe associé à votre compte fiscal professionnel. Si vous gérez plusieurs entités, sélectionnez l'entreprise concernée par la période.",
    dgiPortalTab: "Page d'accueil e-Services > Espace Contribuable",
    recommandation: "Activez la double authentification si votre cabinet compte plusieurs collaborateurs habilités.",
  },
  {
    step: "Étape 2",
    title: "Choix de la déclaration fiscale et du mois d'exigibilité",
    description:
      "Dans le menu latéral Déclarations, choisissez l'impôt à liquider : Déclaration mensuelle de TVA (pour le régime réel) ou Déclaration d'acompte TPS (pour les entreprises au forfait synthétique). Sélectionnez l'année 2026 et le mois d'imposition échu.",
    dgiPortalTab: "Menu > Déclarations périodiques > Nouvel enregistrement",
    recommandation: "Même avec zéro vente, créez la déclaration et cochez la case Néant pour éviter l'amende automatique.",
  },
  {
    step: "Étape 3",
    title: "Report des bases d'imposition et déductions",
    description:
      "Renseignez le chiffre d'affaires hors taxes taxé au taux normal de 18 % (Groupe B), les opérations exonérées (Groupe A), et la TVA payée sur vos achats justifiés par des factures normalisées. Le système calcule la taxe nette à reverser ou le crédit de TVA reportable.",
    dgiPortalTab: "Tableau de calcul TVA > Cadre A (Collectée) & Cadre B (Déductible)",
    recommandation: "Ne déduisez jamais un achat qui ne comporte pas de QR code et de code MECeF/DGI valide.",
  },
  {
    step: "Étape 4",
    title: "Validation et émission de l'Avis de Versement",
    description:
      "Relisez le récapitulatif financier. Cliquez sur Valider et soumettre. La plateforme génère instantanément votre déclaration en PDF horodatée ainsi qu'un Avis de Versement portant un numéro de télépaiement unique.",
    dgiPortalTab: "Documents émis > Télécharger l'Avis de Versement",
    recommandation: "Conservez le PDF de l'avis : il contient la clé numérique nécessaire pour régler par virement ou guichet.",
  },
  {
    step: "Étape 5",
    title: "Télépaiement sécurisé par Mobile Money ou Virement",
    description:
      "Choisissez votre canal de paiement : paiement direct en ligne via MTN Mobile Money, Moov Money, Celtiis Cash, ou par virement bancaire sur le compte du Trésor Public avec la référence unique de votre déclaration. Dès validation, la quittance officielle DGI est émise.",
    dgiPortalTab: "Paiement en ligne > Sélection du moyen de règlement",
    recommandation: "Pour les montants inférieurs à 2 millions FCFA, le paiement Mobile Money délivre la quittance en temps réel.",
  },
];

export default function TeledeclarationImpotsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TaxPeriodType>("tva_mensuelle");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans antialiased selection:bg-primary selection:text-ink">
      <PublicHeader className="sticky top-0 z-50 w-full" />

      <main className="flex-1 w-full">
        {/* ── 1. FIL D'ARIANE ET HERO ── */}
        <section className="w-full pt-8 pb-12 lg:pt-12 lg:pb-16 bg-background border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Accueil</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/ressources">Ressources Fiscales</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Télédéclaration et Paiement DGI</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-8 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-secondary border border-border text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-4 h-4 text-ink" />
                  <span>Portail e-Services DGI Bénin 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight mb-4">
                  Télédéclaration et paiement des impôts en ligne au Bénin
                </h1>

                <p className="text-lg sm:text-xl text-text-muted leading-relaxed mb-6">
                  Finies les files d&apos;attente aux centres des impôts. Au Bénin, la déclaration et le règlement de la
                  TVA, de la TPS et de l&apos;AIB se font obligatoirement en ligne sur le portail e-Services de la DGI.
                  Découvrez la procédure pas-à-pas pour déclarer dans les délais et payer en toute sécurité par
                  Mobile Money ou virement bancaire.
                </p>

                {/* Repères d'autorité */}
                <div className="w-full p-4 rounded-xl bg-background-secondary border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ink shrink-0" />
                    <span>Conforme DGI & Trésor Public</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink shrink-0" />
                    <span>Échéance TVA : 10 ou 15 du mois</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-ink shrink-0" />
                    <span>Règlement Mobile Money & Banque</span>
                  </div>
                </div>
              </div>

              {/* Encadré mémo échéances */}
              <div className="lg:col-span-4 w-full">
                <div className="p-6 rounded-2xl bg-background-secondary border border-border shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 text-ink flex items-center justify-center shrink-0 border border-primary/30">
                      <Calendar className="w-5 h-5 text-ink" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Rappel Échéances</span>
                      <h2 className="text-sm font-bold text-ink">Calendrier mensuel</h2>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between">
                      <span className="text-text-muted">TVA (Régime Réel) :</span>
                      <strong className="text-ink font-semibold">10 ou 15 du mois</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between">
                      <span className="text-text-muted">Acomptes TPS :</span>
                      <strong className="text-ink font-semibold">10 fév, 30 avr, 10 juin</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between">
                      <span className="text-text-muted">Retenues AIB :</span>
                      <strong className="text-ink font-semibold">10 du mois suivant</strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-text-muted">Gain de temps :</span>
                    <Link
                      href="/solutions/declarations-fiscales"
                      className="font-semibold text-ink underline hover:opacity-80 transition-opacity"
                    >
                      Pré-calcul automatique Ceilow
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. LES 5 ÉTAPES SUR E-SERVICES ── */}
        <section className="w-full py-12 lg:py-16 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Guide d&apos;utilisation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">
                La procédure complète en 5 étapes sur eservices.impots.bj
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Suivez ce parcours pour soumettre votre déclaration sans erreur de saisie et obtenir votre quittance
                officielle libératoire.
              </p>
            </div>

            <div className="space-y-6 mb-12">
              {ESERVICES_STEPS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-background-secondary border border-border hover:border-ink transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-background border border-border text-xs font-bold text-ink">
                        {item.step}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-ink">{item.title}</h3>
                    </div>
                    <span className="text-xs font-mono text-text-muted bg-background px-3 py-1 rounded-full border border-border shrink-0 self-start">
                      {item.dgiPortalTab}
                    </span>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed mb-4">{item.description}</p>

                  <div className="p-3.5 rounded-xl bg-background border border-border flex items-start gap-2.5 text-xs text-text-muted">
                    <Info className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-ink font-semibold">Conseil pratique :</strong> {item.recommandation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. PANORAMA DES MOYENS DE TÉLÉPAIEMENT ── */}
        <section className="w-full py-12 lg:py-16 bg-background-secondary border-y border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Règlement de l&apos;impôt
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
                Comment payer son impôt en ligne au Bénin ?
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                La DGI propose plusieurs canaux officiels interconnectés avec le Trésor Public béninois pour
                acquitter votre bordereau de versement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 rounded-2xl bg-background border border-border flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink mb-4">
                    <Smartphone className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2">MTN Mobile Money, Moov & Celtiis</h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Idéal pour les montants courants (TPE, PME). Vous entrez votre numéro, validez sur votre téléphone
                    avec votre code secret. La quittance est générée instantanément sur votre écran.
                  </p>
                </div>
                <div className="pt-3 border-t border-border text-[11px] text-text-muted">
                  Délai de quittance : <strong className="text-ink font-semibold">Immédiat (2 minutes)</strong>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-background border border-border flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink mb-4">
                    <Wallet className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2">Virement Bancaire (Trésor Public)</h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Recommandé pour les montants importants supérieurs aux plafonds Mobile Money. Vous transmettez l&apos;ordre
                    de virement à votre banque en mentionnant scrupuleusement la référence de l&apos;avis.
                  </p>
                </div>
                <div className="pt-3 border-t border-border text-[11px] text-text-muted">
                  Délai de quittance : <strong className="text-ink font-semibold">24 à 48 heures ouvrées</strong>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-background border border-border flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink mb-4">
                    <CreditCard className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2">Paiement par Carte Bancaire</h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Accessible via les passerelles bancaires sécurisées intégrées au portail national. Convient aux
                    cartes Visa ou Mastercard d&apos;entreprises locales ou internationales.
                  </p>
                </div>
                <div className="pt-3 border-t border-border text-[11px] text-text-muted">
                  Délai de quittance : <strong className="text-ink font-semibold">Immédiat</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. LES SANCTIONS & PÉNALITÉS EN CAS DE RETARD ── */}
        <section className="w-full py-12 lg:py-16 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-background-secondary border border-border">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-ink shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-ink mb-2">
                    Quels sont les risques en cas de retard de déclaration ou de paiement ?
                  </h2>
                  <p className="text-sm text-text-muted leading-relaxed mb-4">
                    Le Code Général des Impôts du Bénin prévoit des sanctions pécuniaires automatiques appliquées par
                    le système dès le lendemain de la date d&apos;exigibilité :
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="font-bold text-ink block mb-1">Défaut de déclaration (même néant)</span>
                  <span className="text-text-muted">
                    Amende forfaitaire automatique pour non-dépôt dans les délais légaux.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="font-bold text-ink block mb-1">Majoration pour paiement tardif</span>
                  <span className="text-text-muted">
                    Majoration de 10 % sur le principal des impôts non réglés à l&apos;échéance.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="font-bold text-ink block mb-1">Intérêts de retard mensuels</span>
                  <span className="text-text-muted">
                    Intérêts moratoires appliqués par mois de retard entamé jusqu&apos;à apurement complet.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. FOIRE AUX QUESTIONS ── */}
        <section className="w-full py-12 lg:py-16 bg-background-secondary border-t border-border">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Foire aux questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink">
                Questions fréquentes sur la télédéclaration au Bénin
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Quelle est la date limite exacte pour télédéclarer et payer la TVA au Bénin ?",
                  a: "Pour les entreprises relevant du régime réel au Bénin, la déclaration et le paiement de la TVA du mois précédent doivent être effectués au plus tard le 10 du mois en cours (pour les moyennes entreprises) ou le 15 du mois (selon la catégorie fiscale de rattachement).",
                },
                {
                  q: "Comment payer son impôt par Mobile Money sur e-Services DGI ?",
                  a: "Après avoir validé votre déclaration en ligne, le portail e-Services génère un ordre de paiement. Vous sélectionnez le mode Mobile Money (MTN MoMo, Moov Money ou Celtiis Cash), renseignez votre numéro de téléphone et validez la transaction sur votre mobile avec votre code PIN secret.",
                },
                {
                  q: "Une entreprise sans chiffre d'affaires doit-elle quand même télédéclarer ?",
                  a: "Oui. Au Bénin, la télédéclaration est obligatoire même en cas d'absence totale d'activité au cours du mois écoulé. Vous devez soumettre une déclaration portant la mention 'Néant' pour éviter les pénalités pour défaut de déclaration.",
                },
                {
                  q: "Comment Ceilow simplifie-t-il la télédéclaration sur e-Services ?",
                  a: "Ceilow calcule automatiquement vos montants exacts à partir de vos factures de vente normalisées et de vos achats enregistrés : base taxable, TVA collectée, TVA déductible et montant net. Vous n'avez plus qu'à recopier les montants pré-calculés case par case ou exporter la feuille de télédéclaration conforme.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-background overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-ink text-sm sm:text-base"
                  >
                    <span>{item.q}</span>
                    {openFaqIndex === idx ? (
                      <ChevronUp className="w-5 h-5 text-ink shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                    )}
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. BANNIÈRE DE CONVERSION CEILOW ── */}
        <section className="w-full py-14 lg:py-20 bg-background border-t border-border">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-secondary border border-border text-xs font-semibold text-text-muted mb-4">
              <ShieldCheck className="w-4 h-4 text-ink" />
              <span>Automatisation fiscale certifiée</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-4">
              Vos montants de télédéclaration prêts en 1 clic chaque mois
            </h2>

            <p className="max-w-2xl mx-auto text-base text-text-muted leading-relaxed mb-8">
              Ne passez plus des heures sur une calculatrice à recalculer votre TVA collectée et déductible.
              Ceilow centralise vos factures de ventes et achats normalisés et vous fournit le relevé exact à reporter
              sur le portail e-Services de la DGI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-ink font-bold text-sm border border-ink hover:opacity-90 transition-opacity"
              >
                <span>Demander une démonstration gratuite</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/solutions/declarations-fiscales"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-background-secondary text-ink font-semibold text-sm border border-border hover:border-ink transition-colors"
              >
                <span>Découvrir le module Déclarations Fiscales</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
