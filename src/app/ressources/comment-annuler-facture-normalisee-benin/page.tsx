"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileCheck,
  FileMinus,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Info,
  QrCode,
  Receipt,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  XCircle,
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

type CancellationMode = "totale" | "partielle";
type TaxRegimeType = "reel_tva" | "tps_forfait";

interface StepCard {
  number: string;
  title: string;
  badge: string;
  description: string;
  actionConseil: string;
  piegeAEviter: string;
}

const STEPS_DATA: StepCard[] = [
  {
    number: "01",
    title: "Ne cherchez pas à supprimer la facture certifiée",
    badge: "Principe fondamental",
    description:
      "Dès qu'une facture normalisée a été validée avec succès par les serveurs de la DGI, elle reçoit un numéro NIM, des compteurs et un code MECeF/DGI à 24 caractères. Ces éléments sont enregistrés dans la base fiscale centrale. La suppression dans une corbeille logicielle est strictement interdite car elle créerait un trou comptable suspect lors d'un contrôle fiscal.",
    actionConseil:
      "Conservez la facture initiale telle quelle dans votre historique. Elle servira de base légale au document rectificatif.",
    piegeAEviter:
      "Ne détruisez jamais le PDF d'origine et ne réutilisez jamais le même numéro interne pour un autre client.",
  },
  {
    number: "02",
    title: "Sélectionnez le type d'opération : Annulation ou Rectification",
    badge: "Règle métier",
    description:
      "La DGI autorise deux types d'avoirs selon votre situation. Si la vente n'a jamais eu lieu (erreur d'acheteur, annulation de commande, doublon), vous réalisez une annulation totale. Si vous appliquez un rabais commercial après coup ou si le client a retourné un produit, vous établissez une rectification partielle portant uniquement sur l'écart financier.",
    actionConseil:
      "Définissez avec précision le montant hors taxes et la TVA ou TPS à réajuster avant d'engager la signature.",
    piegeAEviter:
      "Ne faites pas une annulation complète si le client garde 90 % des articles : préférez un avoir partiel plus simple à tracer.",
  },
  {
    number: "03",
    title: "Émettez une Facture d'Avoir Normalisée via votre SFE",
    badge: "Obligation technique",
    description:
      "Sur votre logiciel de facturation certifié (SFE) ou sur le portail e-MECeF de la DGI, créez un document officiel de type AVOIR. Le document doit obligatoirement mentionner le terme FACTURE D'AVOIR, rappeler le numéro interne de la facture d'origine et son code de sécurité MECeF/DGI à 24 caractères.",
    actionConseil:
      "Dans Ceilow, cliquez simplement sur Créer un avoir depuis la facture concernée : les références d'origine sont recopiées sans erreur de frappe.",
    piegeAEviter:
      "Ne rédigez pas un simple courrier papier ou une note manuscrite : sans code QR officiel, l'avoir n'a aucune valeur fiscale.",
  },
  {
    number: "04",
    title: "Validez la signature électronique et récupérez le QR code",
    badge: "Certification DGI",
    description:
      "Votre système transmet la demande d'avoir aux serveurs de la DGI. L'administration vérifie que la facture de référence existe bien dans sa base, incrémente vos compteurs d'avoirs et renvoie une nouvelle signature numérique accompagnée d'un QR code spécifique certifiant la régularisation.",
    actionConseil:
      "Scannez le QR code de l'avoir obtenu avec l'application officielle MECeF Bénin pour vérifier qu'il affiche bien le type Avoir.",
    piegeAEviter:
      "Ne considérez pas l'avoir comme achevé tant que le code MECeF propre à l'avoir n'a pas été attribué par l'API.",
  },
  {
    number: "05",
    title: "Délivrez l'avoir au client et réajustez votre comptabilité",
    badge: "Clôture du dossier",
    description:
      "Transmettez le document d'avoir en PDF ou imprimé à votre client pour qu'il régularise de son côté sa charge et sa déduction de TVA. En comptabilité SYSCOHADA, cet avoir fait l'objet d'une écriture débitrice sur le compte 70 (ventes) ou 709 (rabais, remises accordés) et 443 (TVA facturée), créditant le compte 411 (clients).",
    actionConseil:
      "Si la vente doit avoir lieu avec de nouvelles conditions, émettez immédiatement la nouvelle facture conforme.",
    piegeAEviter:
      "N'oubliez pas d'imputer cette régularisation sur votre déclaration de TVA mensuelle au 10 ou 15 du mois suivant.",
  },
];

export default function CommentAnnulerFacturePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Simulateur d'avoir
  const [cancelMode, setCancelMode] = useState<CancellationMode>("totale");
  const [taxRegime, setTaxRegime] = useState<TaxRegimeType>("reel_tva");
  const [montantInitialInput, setMontantInitialInput] = useState<string>("118000");
  const [montantCorrigeInput, setMontantCorrigeInput] = useState<string>("59000");
  const [referenceFacture, setReferenceFacture] = useState<string>("FAC-2026-0042");
  const [codeMecefOrigine, setCodeMecefOrigine] = useState<string>("AB12-CD34-EF56-GH78-IJ90");

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const simulationResult = useMemo(() => {
    const initialTtc = Math.max(0, parseInt(montantInitialInput.replace(/\D/g, "") || "0", 10));
    const finalTtc =
      cancelMode === "totale"
        ? 0
        : Math.max(0, parseInt(montantCorrigeInput.replace(/\D/g, "") || "0", 10));

    const avoirTtc = Math.max(0, initialTtc - finalTtc);

    let ht = avoirTtc;
    let tva = 0;

    if (taxRegime === "reel_tva") {
      // TVA 18% au Bénin (taux normal Groupe B) : HT = TTC / 1.18
      ht = Math.round(avoirTtc / 1.18);
      tva = avoirTtc - ht;
    }

    return {
      initialTtc,
      finalTtc,
      avoirTtc,
      ht,
      tva,
      isValid: initialTtc > 0 && (cancelMode === "totale" || finalTtc < initialTtc),
    };
  }, [cancelMode, taxRegime, montantInitialInput, montantCorrigeInput]);

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
                  <BreadcrumbPage>Annuler une facture normalisée</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-8 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-secondary border border-border text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-4 h-4 text-ink" />
                  <span>Procédure officielle DGI Bénin 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight mb-4">
                  Comment annuler une facture normalisée en ligne au Bénin
                </h1>

                <p className="text-lg sm:text-xl text-text-muted leading-relaxed mb-6">
                  Une erreur sur le nom du client, le montant ou le taux de TVA d&apos;une facture certifiée e-MECeF ?
                  La loi fiscale béninoise interdit formellement de la supprimer. Découvrez la seule procédure légale
                  reconnue par la DGI : l&apos;émission d&apos;une{" "}
                  <strong className="text-ink font-semibold">facture d&apos;avoir normalisée</strong> pour régulariser
                  vos comptes sans risquer de redressement.
                </p>

                {/* Badge d'autorité éditoriale */}
                <div className="w-full p-4 rounded-xl bg-background-secondary border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ink shrink-0" />
                    <span>Conforme Code Général des Impôts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink shrink-0" />
                    <span>Temps de lecture : 6 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-ink shrink-0" />
                    <span>Simulateur d&apos;avoir inclus</span>
                  </div>
                </div>
              </div>

              {/* Encadré d'urgence visuel */}
              <div className="lg:col-span-4 w-full">
                <div className="p-6 rounded-2xl bg-background-secondary border border-border shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-warning/15 text-ink flex items-center justify-center shrink-0 border border-warning/30">
                      <AlertTriangle className="w-5 h-5 text-ink" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Règle d&apos;or DGI</span>
                      <h2 className="text-sm font-bold text-ink">Suppression impossible</h2>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Une facture normalisée validée porte un code de 24 caractères déjà transmis aux serveurs de l&apos;État.
                    Pour corriger une erreur, la seule solution est de créer une{" "}
                    <strong className="text-ink">facture d&apos;avoir officielle</strong> qui annule la première.
                  </p>
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-text-muted">Solution logicielle :</span>
                    <Link
                      href="/solutions/facturation-dgi"
                      className="font-semibold text-ink underline hover:opacity-80 transition-opacity"
                    >
                      Avoir en 1 clic avec Ceilow
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. LA RÉPONSE DIRECTE (POURQUOI PAS DE SUPPRESSION SIMPLE ?) ── */}
        <section className="w-full py-12 lg:py-16 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Cadre fiscal & légal
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">
                Pourquoi ne peut-on pas supprimer une facture e-MECeF ?
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Le système de facturation électronique de la Direction Générale des Impôts (DGI) du Bénin repose sur
                un principe d&apos;immuabilité. Dès que vous cliquez sur valider dans votre logiciel, quatre éléments
                sont générés de manière définitive :
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="p-5 rounded-xl border border-border bg-background-secondary flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-ink font-bold mb-3 text-sm">
                    1
                  </div>
                  <h3 className="font-bold text-ink text-sm mb-2">Le NIM de votre machine</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Le Numéro d&apos;Identification de la Machine (virtuelle ou physique) qui rattache le document à votre établissement.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-background-secondary flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-ink font-bold mb-3 text-sm">
                    2
                  </div>
                  <h3 className="font-bold text-ink text-sm mb-2">Les compteurs fiscaux</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Une suite ininterrompue de numéros officiels qui interdit tout trou de numérotation dans votre comptabilité.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-background-secondary flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-ink font-bold mb-3 text-sm">
                    3
                  </div>
                  <h3 className="font-bold text-ink text-sm mb-2">Le code MECeF/DGI</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Une empreinte cryptographique unique de 24 caractères alphanumériques stockée sur les serveurs de la DGI.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-background-secondary flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-ink font-bold mb-3 text-sm">
                    4
                  </div>
                  <h3 className="font-bold text-ink text-sm mb-2">Le code QR vérifiable</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Un code scannable par le client et les inspecteurs des impôts attestant de la validité de la transaction.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-background-secondary">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-ink shrink-0 mt-0.5" />
                  <p className="text-sm text-text-muted leading-relaxed">
                    <strong className="text-ink font-semibold">Ce qu&apos;exige le fisc béninois :</strong> Si vous
                    supprimez la facture de votre côté sans émettre d&apos;avoir, la DGI continuera d&apos;exiger le
                    paiement de la TVA et de l&apos;impôt sur cette vente. L&apos;avoir normalisé est la seule preuve
                    officielle permettant de déduire ce chiffre d&apos;affaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. LES 5 ÉTAPES PAS À PAS (HOWTO) ── */}
        <section className="w-full py-12 lg:py-16 bg-background-secondary border-y border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Guide d&apos;exécution
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">
                La procédure en 5 étapes pour annuler ou corriger votre facture
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Suivez ce protocole étape par étape pour régulariser votre facture en toute sécurité, que vous utilisiez
                un SFE en ligne comme Ceilow ou le portail e-MECeF de la DGI.
              </p>
            </div>

            <div className="space-y-6">
              {STEPS_DATA.map((step, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-background border border-border hover:border-ink transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="w-12 h-12 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink font-bold text-lg shrink-0">
                        {step.number}
                      </div>
                      <div>
                        <div className="inline-block px-2.5 py-0.5 rounded-full bg-background-secondary border border-border text-[11px] font-semibold text-text-muted mb-2">
                          {step.badge}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-ink mb-3">{step.title}</h3>
                        <p className="text-sm text-text-muted leading-relaxed mb-4">{step.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border text-xs">
                          <div className="p-3 rounded-lg bg-background-secondary border border-border">
                            <span className="font-semibold text-ink block mb-1">À faire :</span>
                            <span className="text-text-muted">{step.actionConseil}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-background-secondary border border-border">
                            <span className="font-semibold text-ink block mb-1">À éviter absolument :</span>
                            <span className="text-text-muted">{step.piegeAEviter}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. SIMULATEUR ET ASSISTANT D'AVOIR INTERACTIF ── */}
        <section className="w-full py-12 lg:py-16 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Outil d&apos;aide à la décision
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
                Simulateur d&apos;Avoir Normalisé : Calculez vos montants DGI
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Déterminez instantanément les montants Hors Taxes et TVA à inscrire sur votre avoir de régularisation,
                ainsi que la mention légale obligatoire à faire figurer sur le document.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Panneau de saisie */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-background-secondary border border-border flex flex-col gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                    1. Type d&apos;opération
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCancelMode("totale")}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        cancelMode === "totale"
                          ? "bg-primary text-ink border-ink font-bold shadow-sm"
                          : "bg-background text-text-muted border-border hover:border-ink"
                      }`}
                    >
                      Annulation totale (100 %)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelMode("partielle")}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        cancelMode === "partielle"
                          ? "bg-primary text-ink border-ink font-bold shadow-sm"
                          : "bg-background text-text-muted border-border hover:border-ink"
                      }`}
                    >
                      Rectification partielle
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                    2. Régime fiscal de votre entreprise
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTaxRegime("reel_tva")}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        taxRegime === "reel_tva"
                          ? "bg-primary text-ink border-ink font-bold shadow-sm"
                          : "bg-background text-text-muted border-border hover:border-ink"
                      }`}
                    >
                      Régime Réel (TVA 18 %)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaxRegime("tps_forfait")}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        taxRegime === "tps_forfait"
                          ? "bg-primary text-ink border-ink font-bold shadow-sm"
                          : "bg-background text-text-muted border-border hover:border-ink"
                      }`}
                    >
                      Forfait TPS (Groupe E, 0 %)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1">
                      Montant TTC initial (FCFA)
                    </label>
                    <input
                      type="text"
                      value={montantInitialInput}
                      onChange={(e) => setMontantInitialInput(e.target.value)}
                      placeholder="Ex: 118000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {cancelMode === "partielle" && (
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1">
                        Montant TTC corrigé final (FCFA)
                      </label>
                      <input
                        type="text"
                        value={montantCorrigeInput}
                        onChange={(e) => setMontantCorrigeInput(e.target.value)}
                        placeholder="Ex: 59000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border">
                  <div>
                    <label className="text-xs font-medium text-text-muted block mb-1">
                      N° Facture initiale
                    </label>
                    <input
                      type="text"
                      value={referenceFacture}
                      onChange={(e) => setReferenceFacture(e.target.value)}
                      placeholder="Ex: FAC-2026-0042"
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-text-muted block mb-1">
                      Code MECeF initial (24 car.)
                    </label>
                    <input
                      type="text"
                      value={codeMecefOrigine}
                      onChange={(e) => setCodeMecefOrigine(e.target.value)}
                      placeholder="Ex: AB12-CD34-EF56-GH78-IJ90"
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Panneau de résultat */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-background border border-border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Synthèse de votre avoir officiel
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background-secondary border border-border text-[11px] font-semibold text-ink">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Norme DGI</span>
                    </span>
                  </div>

                  {simulationResult.isValid ? (
                    <div className="space-y-4 mb-6">
                      <div className="p-4 rounded-xl bg-background-secondary border border-border flex items-center justify-between">
                        <div>
                          <span className="text-xs text-text-muted block">Montant de l&apos;Avoir TTC</span>
                          <span className="text-2xl font-bold font-mono text-ink">
                            {simulationResult.avoirTtc.toLocaleString("fr-FR")} FCFA
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-text-muted block">Nature</span>
                          <span className="text-xs font-semibold text-ink">
                            {cancelMode === "totale" ? "Annulation intégrale" : "Avoir partiel"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg border border-border bg-background">
                          <span className="text-text-muted block mb-1">Base Hors Taxes (HT)</span>
                          <span className="font-mono font-bold text-ink">
                            {simulationResult.ht.toLocaleString("fr-FR")} FCFA
                          </span>
                        </div>
                        <div className="p-3 rounded-lg border border-border bg-background">
                          <span className="text-text-muted block mb-1">
                            {taxRegime === "reel_tva" ? "TVA à déduire (18 %)" : "Régime TPS (0 %)"}
                          </span>
                          <span className="font-mono font-bold text-ink">
                            {taxRegime === "reel_tva"
                              ? `${simulationResult.tva.toLocaleString("fr-FR")} FCFA`
                              : "0 FCFA (Groupe E)"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-border bg-background-secondary">
                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-2">
                          Mention légale obligatoire à faire figurer sur l&apos;avoir :
                        </span>
                        <p className="text-xs font-mono text-ink bg-background p-3 rounded-lg border border-border leading-relaxed select-all">
                          &quot;FACTURE D&apos;AVOIR régularisant la facture n° {referenceFacture || "FAC-XXXX"} du{" "}
                          {new Date().toLocaleDateString("fr-BJ")} (Réf. MECeF/DGI : {codeMecefOrigine || "CODE-ORIGINE"}) - Motif :{" "}
                          {cancelMode === "totale" ? "Annulation intégrale de commande" : "Avoir pour réajustement commercial"}.&quot;
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-background-secondary border border-border text-center text-xs text-text-muted mb-6">
                      Saisissez un montant valide supérieur à 0 pour calculer votre avoir.
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-text-muted">Besoin d&apos;automatiser sans calcul ?</span>
                  <Link
                    href="/demo"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-ink font-semibold text-xs border border-ink hover:opacity-90 transition-opacity"
                  >
                    <span>Tester la facturation Ceilow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. TABLEAU COMPARATIF : ANNULATION TOTALE VS RECTIFICATION PARTIELLE ── */}
        <section className="w-full py-12 lg:py-16 bg-background-secondary border-t border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Cas pratiques
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
                Quel type d&apos;avoir correspond à votre situation ?
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Voici les règles d&apos;arbitrage pour choisir entre une annulation totale et un avoir partiel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 sm:p-8 rounded-2xl bg-background border border-border flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-secondary border border-border text-xs font-semibold text-ink mb-4">
                    <XCircle className="w-4 h-4 text-ink" />
                    <span>Option 1 : Annulation Totale</span>
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">Quand la vente est intégralement annulée</h3>
                  <ul className="space-y-3 text-xs sm:text-sm text-text-muted mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                      <span>Erreur d&apos;IFU ou de nom de client sur la facture initiale.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                      <span>Facture émise en double par inadvertance.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                      <span>Commande non livrée ou refus total de la marchandise.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                      <span>L&apos;avoir reprend l&apos;exacte totalité des lignes initiales avec montants négatifs.</span>
                    </li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-background-secondary border border-border text-xs text-text-muted">
                  <strong className="text-ink font-semibold">Procédure suivante :</strong> Après l&apos;avoir d&apos;annulation totale,
                  si la vente doit tout de même se faire, créez une toute nouvelle facture avec les informations exactes.
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-background border border-border flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-secondary border border-border text-xs font-semibold text-ink mb-4">
                    <FileMinus className="w-4 h-4 text-ink" />
                    <span>Option 2 : Rectification Partielle</span>
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">Quand la transaction est maintenue avec ajustement</h3>
                  <ul className="space-y-3 text-xs sm:text-sm text-text-muted mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                      <span>Erreur de prix sur une ligne d&apos;article spécifique.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                      <span>Retour partiel d&apos;une partie du stock commandé.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                      <span>Remise, rabais ou ristourne accordé après réception de la marchandise.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                      <span>L&apos;avoir porte uniquement sur la différence financière à rembourser ou déduire.</span>
                    </li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-background-secondary border border-border text-xs text-text-muted">
                  <strong className="text-ink font-semibold">Procédure suivante :</strong> Aucun document supplémentaire requis.
                  Le client règle le solde net (Facture initiale moins Avoir partiel).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. FOIRE AUX QUESTIONS (FAQ ACCORDION) ── */}
        <section className="w-full py-12 lg:py-16 bg-background">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Questions courantes
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink">
                Foire aux questions sur l&apos;annulation de factures au Bénin
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Peut-on supprimer une facture normalisée déjà validée par la DGI ?",
                  a: "Non. Une fois qu'une facture a reçu sa signature électronique, son code MECeF/DGI et son QR code, elle est enregistrée de manière irréversible sur les serveurs de la DGI. La suppression technique est formellement interdite par le Code Général des Impôts du Bénin. La seule procédure autorisée pour l'annuler est d'émettre une facture d'avoir normalisée.",
                },
                {
                  q: "Quelle est la différence entre une annulation totale et une rectification partielle ?",
                  a: "L'annulation totale concerne une facture émise à tort (mauvais client, commande annulée) : l'avoir reprend l'intégralité du montant TTC pour remettre le solde à zéro. La rectification partielle intervient en cas de remise commerciale ou de produit manquant : l'avoir ne porte que sur le montant de la différence.",
                },
                {
                  q: "Que devient la TVA sur une facture normalisée annulée par un avoir ?",
                  a: "L'émission de l'avoir normalisé annule la TVA initialement collectée auprès de la DGI. Lors de votre déclaration mensuelle du 10 ou du 15 du mois, la TVA de l'avoir vient en déduction de la TVA brute collectée de la période, ce qui vous évite de payer un impôt indu.",
                },
                {
                  q: "Comment réémettre une nouvelle facture après avoir annulé la précédente ?",
                  a: "Après avoir émis et transmis l'avoir de régularisation à votre client, vous générez simplement une nouvelle facture normale avec les données corrigées (bon client, bon prix unitaire ou bon taux). Le client recevra donc trois pièces justificatives : la facture initiale, l'avoir d'annulation et la nouvelle facture conforme.",
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

        {/* ── 7. BANNIÈRE DE CONVERSION CEILOW ── */}
        <section className="w-full py-14 lg:py-20 bg-background-secondary border-t border-border">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-xs font-semibold text-text-muted mb-4">
              <ShieldCheck className="w-4 h-4 text-ink" />
              <span>Zéro risque de rejet DGI</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-4">
              Émettez vos factures et vos avoirs normalisés en 1 clic
            </h2>

            <p className="max-w-2xl mx-auto text-base text-text-muted leading-relaxed mb-8">
              Ceilow est certifié pour dialoguer directement avec l&apos;API e-MECeF de la DGI Bénin.
              En cas d&apos;erreur, cliquez sur Créer un avoir : les références obligatoires, le NIM et le code
              de sécurité sont automatiquement rattachés sans calcul manuel.
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
                href="/solutions/facturation-dgi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-background text-ink font-semibold text-sm border border-border hover:border-ink transition-colors"
              >
                <span>Découvrir le module Facturation DGI</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
