"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileCheck,
  FileText,
  HelpCircle,
  Laptop,
  PlayCircle,
  QrCode,
  Receipt,
  Scale,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
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

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
}

const ONBOARDING_CHECKLIST: ChecklistItem[] = [
  {
    id: "ifu",
    label: "Numéro IFU à 13 chiffres actif",
    detail: "Délivré par l'ANAPI / APIEx lors de la formalisation de l'entreprise ou en ligne sur le portail de la DGI.",
  },
  {
    id: "regime",
    label: "Régime fiscal identifié (TPS ou Régime Réel)",
    detail: "Forfait TPS (chiffre d'affaires inférieur à 50 millions FCFA) ou Régime Réel (assujetti à la TVA 18 %).",
  },
  {
    id: "coord",
    label: "Coordonnées de l'entreprise et logo",
    detail: "Adresse physique à Cotonou ou dans votre commune, numéro de téléphone professionnel et boîte e-mail.",
  },
  {
    id: "sfe",
    label: "Choix de la solution SFE (sans machine matérielle)",
    detail: "Une plateforme en ligne comme Ceilow évitant d'investir dans un boîtier physique à rouleau thermique.",
  },
  {
    id: "banque_momo",
    label: "Coordonnées de règlement (Compte bancaire ou Mobile Money)",
    detail: "Numéro marchand MTN MoMo, Moov Money, Celtiis Cash ou RIB bancaire pour recevoir vos paiements clients.",
  },
];

export default function CreerCompteFacturePage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    ifu: true,
    regime: true,
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const isReady = completedCount === ONBOARDING_CHECKLIST.length;

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
                  <BreadcrumbPage>Créer son compte facture normalisée</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-8 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-secondary border border-border text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                  <UserCheck className="w-4 h-4 text-ink" />
                  <span>Guide Démarrage PME & Indépendants 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight mb-4">
                  Comment créer son compte et démarrer la facture normalisée au Bénin
                </h1>

                <p className="text-lg sm:text-xl text-text-muted leading-relaxed mb-6">
                  Vous venez de créer votre entreprise ou souhaitez vous mettre en conformité avec la DGI ?
                  Il n&apos;est plus nécessaire d&apos;acheter une machine physique encombrante. Grâce au système en ligne
                  e-MECeF, vous pouvez créer votre compte, configurer vos tarifs et émettre votre première facture
                  avec QR code officiel en moins de 15 minutes.
                </p>

                {/* Repères rassurants */}
                <div className="w-full p-4 rounded-xl bg-background-secondary border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ink shrink-0" />
                    <span>0 FCFA de frais d&apos;inscription DGI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-ink shrink-0" />
                    <span>Utilisable sur mobile et PC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink shrink-0" />
                    <span>Mise en route en 15 minutes</span>
                  </div>
                </div>
              </div>

              {/* Encadré d'action immédiate */}
              <div className="lg:col-span-4 w-full">
                <div className="p-6 rounded-2xl bg-background-secondary border border-border shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-ink flex items-center justify-center shrink-0 border border-primary/40">
                      <QrCode className="w-5 h-5 text-ink" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Démarrage rapide</span>
                      <h2 className="text-sm font-bold text-ink">Pas de boîtier à acheter</h2>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    L&apos;e-MECeF remplace définitivement les anciennes caisses enregistreuses physiques. Vos factures
                    sont signées électroniquement via Internet et remises à vos clients par WhatsApp, e-mail ou impression PDF.
                  </p>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-text-muted">Solution tout-en-un :</span>
                    <Link
                      href="/register"
                      className="font-semibold text-ink underline hover:opacity-80 transition-opacity"
                    >
                      Ouvrir un compte Ceilow
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. LA CHECKLIST DE PRÉPARATION (INTERACTIVE) ── */}
        <section className="w-full py-12 lg:py-16 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Étape préalable
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
                Êtes-vous prêt à émettre vos factures normalisées ?
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Cochez les éléments dont vous disposez déjà pour vérifier que votre dossier est complet avant de lancer
                l&apos;activation.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-background-secondary border border-border mb-12">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <div>
                  <h3 className="text-base font-bold text-ink">Liste des prérequis administratifs</h3>
                  <p className="text-xs text-text-muted">Validez chaque étape pour débloquer votre statut prêt à facturer.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-muted block">Progression</span>
                  <span className="text-sm font-bold font-mono text-ink">
                    {completedCount} / {ONBOARDING_CHECKLIST.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {ONBOARDING_CHECKLIST.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleCheck(item.id)}
                      className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all ${
                        isChecked
                          ? "bg-background border-ink shadow-xs"
                          : "bg-background/60 border-border hover:border-ink/50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked ? "bg-primary border-ink text-ink font-bold" : "border-border bg-background"
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div>
                        <span className={`text-sm font-bold block ${isChecked ? "text-ink" : "text-text-muted"}`}>
                          {item.label}
                        </span>
                        <span className="text-xs text-text-muted leading-relaxed mt-0.5 block">{item.detail}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isReady ? (
                    <CheckCircle2 className="w-5 h-5 text-ink shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-text-muted shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-ink">
                    {isReady
                      ? "Votre dossier est complet ! Vous pouvez créer votre compte immédiatement."
                      : "Complétez les éléments restants pour démarrer sereinement."}
                  </span>
                </div>

                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-ink font-bold text-xs border border-ink hover:opacity-90 transition-opacity"
                >
                  <span>Créer mon compte Ceilow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. LES 5 ÉTAPES POUR CRÉER SON COMPTE ET DÉMARRER ── */}
        <section className="w-full py-12 lg:py-16 bg-background-secondary border-t border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Guide pas-à-pas
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">
                Les 5 étapes pour obtenir votre QR code DGI et émettre votre 1ère facture
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Voici le parcours complet pour passer de l&apos;immatriculation à votre première facture normalisée certifiée.
              </p>
            </div>

            <div className="space-y-6 mb-12">
              <div className="p-6 sm:p-8 rounded-2xl bg-background border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink mb-2">Vérifier l&apos;activation de son IFU à la DGI</h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-3">
                      Votre Identifiant Fiscal Unique (IFU) est le numéro d&apos;identité fiscale de votre entreprise.
                      Assurez-vous qu&apos;il est bien actif dans le fichier national des contribuables. Si vous venez
                      d&apos;immatriculer votre société au Guichet Unique de l&apos;ANAPI, l&apos;activation est automatique sous 24h.
                    </p>
                    <span className="text-xs text-text-muted font-mono bg-background-secondary px-2.5 py-1 rounded-md">
                      Format officiel : 13 chiffres (Ex: 0202112345678)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-background border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink mb-2">Choisir son Système de Facturation Électronique (SFE)</h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-3">
                      Pour générer des factures aux normes sans boîtier physique, vous devez utiliser un SFE homologué
                      par l&apos;administration fiscale. En choisissant Ceilow, vous bénéficiez d&apos;une connexion
                      directe avec les serveurs de la DGI, sans paramétrage technique complexe.
                    </p>
                    <span className="text-xs text-text-muted font-mono bg-background-secondary px-2.5 py-1 rounded-md">
                      Avantage Ceilow : Aucun matériel ni serveur à acheter
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-background border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink mb-2">Obtenir ses jetons d&apos;API auprès de la DGI</h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-3">
                      Pour que votre logiciel de caisse puisse dialoguer avec la machine virtuelle de la DGI, vous devez
                      renseigner votre clé de sécurité. Ceilow vous guide à travers un assistant simplifié en 3 clics
                      pour synchroniser votre espace avec l&apos;administration fiscale.
                    </p>
                    <span className="text-xs text-text-muted font-mono bg-background-secondary px-2.5 py-1 rounded-md">
                      Délai : Immédiat via l&apos;assistant Ceilow
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-background border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink mb-2">Paramétrer vos articles et groupes de taxation</h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-3">
                      Enregistrez vos produits ou prestations courantes avec leur tarif TTC en Francs CFA entiers.
                      Sélectionnez la catégorie fiscale appropriée : Groupe B (TVA 18 %) si vous êtes au régime réel,
                      ou Groupe E (0 %) si vous êtes une petite entreprise soumise au régime de la TPS.
                    </p>
                    <span className="text-xs text-text-muted font-mono bg-background-secondary px-2.5 py-1 rounded-md">
                      Conforme article 239 du Code Général des Impôts
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-background border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink font-bold shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink mb-2">Émettre et tester sa première facture certifiée</h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-3">
                      Créez votre première facture, entrez le nom de votre client et cliquez sur Valider. En moins de
                      2 secondes, l&apos;API DGI appose le QR code officiel et les 4 codes de sécurité. Scannez le code
                      avec l&apos;application mobile MECeF Bénin pour constater la mention Authentique.
                    </p>
                    <span className="text-xs text-text-muted font-mono bg-background-secondary px-2.5 py-1 rounded-md">
                      Téléchargement immédiat du PDF avec QR code
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. FOIRE AUX QUESTIONS ── */}
        <section className="w-full py-12 lg:py-16 bg-background">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Foire aux questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink">
                Questions fréquentes : Créer son compte et facturer au Bénin
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Faut-il payer la DGI pour créer un compte de facturation normalisée ?",
                  a: "Non. L'accès à la plateforme e-MECeF et l'attribution des jetons de connexion API par la DGI sont entièrement gratuits. Vous n'avez à payer que votre abonnement au logiciel de facturation choisi (comme Ceilow) sans aucun frais de licence d'État.",
                },
                {
                  q: "Une nouvelle entreprise individuelle peut-elle facturer dès le premier jour ?",
                  a: "Oui. Dès que vous recevez votre numéro IFU (généralement obtenu en 24h à 48h lors de la création d'entreprise à l'APIEx / ANAPI), vous pouvez ouvrir votre compte Ceilow et émettre immédiatement des factures normalisées conformes pour vos clients.",
                },
                {
                  q: "Doit-on obligatoirement acheter une machine physique chez un fournisseur ?",
                  a: "Non, l'achat d'une machine physique n'est plus du tout obligatoire depuis le lancement de l'e-MECeF. Vous pouvez utiliser votre smartphone, votre tablette ou votre ordinateur avec une application en ligne comme Ceilow, qui génère des factures électroniques en PDF avec le QR code officiel.",
                },
                {
                  q: "Quelles sont les mentions obligatoires sur la première facture normalisée ?",
                  a: "La facture doit afficher : votre raison sociale et adresse, votre numéro IFU, le nom et l'IFU du client (si professionnel), le détail des articles avec leur groupe fiscal (A à F), le montant HT, le montant de la TVA/TPS, le montant TTC, le numéro NIM, le code de sécurité MECeF à 24 caractères et le QR code officiel.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-background-secondary overflow-hidden transition-colors"
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

        {/* ── 5. BANNIÈRE DE CONVERSION CEILOW ── */}
        <section className="w-full py-14 lg:py-20 bg-background-secondary border-t border-border">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-xs font-semibold text-text-muted mb-4">
              <Sparkles className="w-4 h-4 text-ink" />
              <span>Démarrage immédiat</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-4">
              Créez votre première facture normalisée dès aujourd&apos;hui
            </h2>

            <p className="max-w-2xl mx-auto text-base text-text-muted leading-relaxed mb-8">
              Pas besoin de formation comptable compliquée. Avec Ceilow, renseignez vos informations d&apos;entreprise
              et éditez vos factures certifiées DGI avec QR code directement depuis votre téléphone ou ordinateur.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-ink font-bold text-sm border border-ink hover:opacity-90 transition-opacity"
              >
                <span>Créer mon compte gratuitement</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-background text-ink font-semibold text-sm border border-border hover:border-ink transition-colors"
              >
                <span>Voir la démonstration vidéo</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
