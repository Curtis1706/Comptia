"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Calculator,
  ShieldCheck,
  CreditCard,
  Users,
  PieChart,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  Building2,
  Landmark,
  Clock,
  ChevronDown,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function FonctionnalitesPage() {
  const [activeTab, setActiveTab] = useState<"facturation" | "comptabilite" | "tva" | "tresorerie" | "paie" | "liasses">("facturation");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const modules = [
    {
      id: "facturation",
      name: "Facturation DGI",
      icon: FileText,
      badge: "Homologué e-MECeF",
      title: "Factures certifiées aux normes DGI en 1 clic",
      description: "Émettez des devis et des factures normalisées avec le QR code officiel de la Direction Générale des Impôts du Bénin. Encaissez plus vite et éliminez tout risque fiscal.",
      benefits: [
        "Normalisation e-MECeF instantanée via l'API officielle de la DGI",
        "Mode hors-ligne sécurisé : facturez même lors des coupures de connexion",
        "Envoi direct par WhatsApp et email avec lien de paiement MoMo",
        "Gestion des acomptes, remises, retenues à la source (AIB) et situations de travaux",
      ],
      kpi: "Moins de 10 secondes",
      kpiLabel: "pour émettre et normaliser une facture",
    },
    {
      id: "comptabilite",
      name: "Comptabilité SYSCOHADA",
      icon: Calculator,
      badge: "Plan SYSCOHADA Révisé",
      title: "Comptabilité générale automatisée au fil de l'eau",
      description: "Chaque opération commerciale alimente directement vos journaux comptables. Fini les ressaisies manuelles en fin de mois pour votre comptable.",
      benefits: [
        "Plan comptable général SYSCOHADA révisé pré-paramétré pour le Bénin",
        "Génération automatique des écritures d'achats, ventes, caisse et banques",
        "Grand livre, balance générale à 6 colonnes et journaux auxiliaires en temps réel",
        "Accès gratuit dédié pour votre cabinet d'expertise comptable",
      ],
      kpi: "100 % automatisé",
      kpiLabel: "zéro ressaisie manuelle de journaux",
    },
    {
      id: "tva",
      name: "Déclarations Fiscales & TVA",
      icon: ShieldCheck,
      badge: "Zéro Pénalité",
      title: "Calcul automatique de la TVA et des taxes fiscales",
      description: "Sachez exactement ce que vous devez reverser avant le 10 du mois. Préparez vos états déclaratifs sans stress ni calcul fastidieux.",
      benefits: [
        "Décompte instantané de la TVA collectée et de la TVA déductible",
        "Gestion rigoureuse de l'AIB (1 % ou 5 %) selon le profil de vos fournisseurs",
        "Tableau récapitulatif prêt pour la télé-déclaration sur le portail e-Services DGI",
        "Alertes intelligentes sur les échéances fiscales pour éviter toute majoration",
      ],
      kpi: "Prêt avant le 10",
      kpiLabel: "de chaque mois pour votre déclaration",
    },
    {
      id: "tresorerie",
      name: "Trésorerie & MoMo",
      icon: Landmark,
      badge: "Multi-Banques & MoMo",
      title: "Suivi en direct de vos flux bancaires et Mobile Money",
      description: "Visualisez l'ensemble de vos disponibilités sur un tableau de bord unique : MTN MoMo, Moov Money, Celtiis et comptes bancaires.",
      benefits: [
        "Rapprochement bancaire assisté et lettrage automatique des règlements",
        "Gestion de caisse espèces avec contrôle journalier des écarts",
        "Visualisation de votre solde réel disponible après charges fiscales prévues",
        "Relevé unifié de tous vos encaissements et décaissements",
      ],
      kpi: "Vue à 360°",
      kpiLabel: "sur l'ensemble de vos liquidités",
    },
    {
      id: "paie",
      name: "Paie & Cotisations",
      icon: Users,
      badge: "Conforme CNSS Bénin",
      title: "Bulletins de paie et charges sociales en quelques clics",
      description: "Gérez vos fiches de paie et vos déclarations sociales selon le barème officiel du Code du Travail et de la CNSS Bénin.",
      benefits: [
        "Calcul automatique du salaire brut, net, IPTS et cotisations CNSS",
        "Édition des fiches de paie conformes et téléchargeables en PDF",
        "État récapitulatif mensuel pour la déclaration trimestrielle CNSS",
        "Historique salarial complet et registre du personnel sécurisé",
      ],
      kpi: "Conforme CNSS",
      kpiLabel: "barème fiscal béninois à jour",
    },
    {
      id: "liasses",
      name: "Liasses & DSF",
      icon: PieChart,
      badge: "Dépôt Annuel Serein",
      title: "États financiers annuels prêts pour la DGI et l'OECCA",
      description: "Générez vos bilans et comptes de résultat selon le système normal ou allégé SYSCOHADA pour une clôture annuelle fluide.",
      benefits: [
        "Bilan actif, passif et compte de résultat édités au format officiel",
        "Tableau des flux de trésorerie (TAFIRE) et notes annexes",
        "Export direct des états financiers pour la liasse fiscale DSF",
        "Coordination transparente avec votre expert-comptable pour la signature",
      ],
      kpi: "Clôture sereine",
      kpiLabel: "états financiers fiables et cohérents",
    },
  ];

  const currentModule = modules.find((m) => m.id === activeTab) || modules[0];

  const faqList = [
    {
      q: "Comment fonctionne la connexion officielle avec la DGI (e-MECeF) ?",
      a: "Ceilow est connecté via des protocoles sécurisés et homologués aux serveurs de la Direction Générale des Impôts. Chaque facture générée transite par la passerelle de normalisation, reçoit un identifiant unique horodaté et un QR code légal certifiant son authenticité.",
    },
    {
      q: "Puis-je donner un accès direct à mon expert-comptable ?",
      a: "Oui, tout à fait. Vous pouvez inviter votre expert-comptable ou vos collaborateurs avec des rôles et autorisations personnalisés. Votre comptable dispose d'un espace dédié gratuit pour consulter vos journaux et exporter vos balances.",
    },
    {
      q: "Que se passe-t-il en cas de coupure d'Internet lors d'une vente ?",
      a: "Notre système intègre un mode de sécurisation hors-ligne. Vous pouvez continuer à enregistrer vos ventes et délivrer un justificatif à votre client. Dès le rétablissement de la connexion, vos factures sont automatiquement transmises et normalisées auprès de la DGI.",
    },
    {
      q: "Mes données financières sont-elles protégées au Bénin ?",
      a: "Absolument. Nos infrastructures répondent scrupuleusement aux normes de l'Autorité de Protection des Données Personnelles (APDP) du Bénin. Toutes les informations sont chiffrées au repos et en transit avec sauvegardes quotidiennes redondantes.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans antialiased selection:bg-primary selection:text-ink">
      {/* ── HEADER PUBLIC UNIFIÉ ── */}
      <PublicHeader />

      <main className="flex-1 w-full">
        {/* ── HERO SECTION : PRÉSENTATION DES FONCTIONNALITÉS ── */}
        <section className="w-full bg-background pt-14 pb-16 lg:pt-20 lg:pb-24 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-ink text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-ink shrink-0" />
              <span>Plateforme Tout-en-un SYSCOHADA &amp; DGI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-clash text-ink tracking-tight leading-[1.15]">
              Toutes les fonctionnalités de Ceilow pour piloter votre entreprise
            </h1>

            <p className="mt-6 text-base sm:text-lg text-text-muted max-w-3xl mx-auto leading-relaxed">
              De l&apos;émission de votre première facture certifiée DGI jusqu&apos;à la clôture de votre bilan annuel, découvrez comment Ceilow simplifie votre gestion quotidienne au Bénin.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/tarifs"
                className="h-12 min-h-[48px] px-8 bg-primary hover:bg-primary-hover text-ink font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Découvrir nos tarifs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/accompagnement"
                className="h-12 min-h-[48px] px-6 bg-background-secondary hover:bg-border text-ink font-bold text-sm rounded-xl transition-all flex items-center justify-center"
              >
                <span>Être accompagné</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── RUBAN DE PREUVES RAPIDES ── */}
        <section className="w-full py-6 bg-background-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="block font-clash font-bold text-lg text-ink">e-MECeF Certifié</span>
              <span className="text-xs text-text-muted">Conformité DGI Bénin</span>
            </div>
            <div>
              <span className="block font-clash font-bold text-lg text-ink">SYSCOHADA</span>
              <span className="text-xs text-text-muted">Plan comptable révisé</span>
            </div>
            <div>
              <span className="block font-clash font-bold text-lg text-ink">Mobile Money &amp; Banques</span>
              <span className="text-xs text-text-muted">Rapprochement direct</span>
            </div>
            <div>
              <span className="block font-clash font-bold text-lg text-ink">Protection APDP</span>
              <span className="text-xs text-text-muted">Données souveraines chiffrées</span>
            </div>
          </div>
        </section>

        {/* ── SHOWCASE INTERACTIF DES 6 MODULES CLÉS ── */}
        <section className="w-full py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink">
                Un outil modulaire conçu pour vos opérations réelles
              </h2>
              <p className="mt-3 text-text-muted text-base">
                Sélectionnez un module pour explorer en détail ses fonctionnalités et ses bénéfices métiers.
              </p>
            </div>

            {/* Sélecteur d'onglets ergonomique */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 justify-start sm:justify-center mb-12">
              {modules.map((mod) => {
                const Icon = mod.icon;
                const isActive = activeTab === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveTab(mod.id as typeof activeTab)}
                    className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border ${
                      isActive
                        ? "bg-ink text-white border-ink shadow-sm"
                        : "bg-background-secondary text-ink border-border hover:bg-border"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-text-muted"}`} />
                    <span>{mod.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Panneau de détail du module actif */}
            <div className="p-8 sm:p-12 rounded-3xl bg-background-secondary border border-border shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-background border border-border text-xs font-bold text-ink w-fit">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span>{currentModule.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-clash text-ink">
                  {currentModule.title}
                </h3>

                <p className="text-base text-text-muted leading-relaxed">
                  {currentModule.description}
                </p>

                <ul className="flex flex-col gap-3 my-2">
                  {currentModule.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-ink font-medium">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href="/tarifs"
                    className="h-11 min-h-[44px] px-6 bg-primary hover:bg-primary-hover text-ink font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Voir les offres pour ce module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/demo"
                    className="h-11 min-h-[44px] px-5 bg-background hover:bg-background-secondary border border-border text-ink font-semibold text-xs rounded-xl transition-all flex items-center justify-center"
                  >
                    <span>Tester en démo</span>
                  </Link>
                </div>
              </div>

              {/* Carte KPI & Réassurance latérale */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-8 rounded-2xl bg-background border border-border text-center shadow-xs">
                  <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">
                    Impact direct
                  </span>
                  <span className="font-clash text-3xl sm:text-4xl font-bold text-ink block">
                    {currentModule.kpi}
                  </span>
                  <span className="text-xs text-text-muted mt-2 block">
                    {currentModule.kpiLabel}
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-ink text-white flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Déploiement immédiat</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Ce module est activable en quelques minutes sans configuration technique complexe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BANNIÈRE D'AUTORITÉ SOMBRE ── */}
        <section className="w-full py-16 bg-ink text-white border-y border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-clash text-white">
              Une technologie pensée pour les entreprises béninoises
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/75 max-w-2xl mx-auto">
              Ceilow intègre nativement toutes les exigences réglementaires et bancaires du pays pour vous faire gagner un temps précieux chaque semaine.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/tarifs"
                className="h-12 min-h-[48px] px-8 bg-primary hover:bg-primary-hover text-ink font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center"
              >
                <span>Consulter les tarifs</span>
              </Link>
              <Link
                href="/accompagnement"
                className="h-12 min-h-[48px] px-6 bg-[#3D3830] hover:bg-[#474138] border border-white/10 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center"
              >
                <span>Découvrir l&apos;accompagnement</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ SPÉCIFIQUE FONCTIONNALITÉS ── */}
        <section className="w-full py-20 bg-background border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-clash text-ink">
                Questions fréquentes sur les fonctionnalités
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                Les réponses claires aux questions que se posent les dirigeants avant de choisir Ceilow.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqList.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border bg-background-secondary overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full min-h-[48px] px-6 py-4 flex items-center justify-between gap-4 text-left font-bold text-sm text-ink hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-ink shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER PUBLIC UNIFIÉ ── */}
      <PublicFooter />
    </div>
  );
}
