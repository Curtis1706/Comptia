"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  FileCheck,
  Layers,
  LifeBuoy,
  RefreshCw,
  Scale,
  Server,
  ShieldCheck,
  Smartphone,
  X,
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

interface ComparisonRow {
  critere: string;
  odooAvecModule: string;
  odooStatus: "warning" | "error" | "neutral";
  ceilowNatif: string;
  ceilowStatus: "success";
  impactEntreprise: string;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    critere: "Conformité e-MECeF DGI Bénin",
    odooAvecModule: "Nécessite l'achat ou le codage d'un module tiers spécifique + homologation DGI au cas par cas.",
    odooStatus: "warning",
    ceilowNatif: "Certifié et connecté en direct à l'API e-MECeF de la DGI sans aucun plugin additionnel.",
    ceilowStatus: "success",
    impactEntreprise: "Zéro risque d'invalidation lors des contrôles fiscaux inopinés.",
  },
  {
    critere: "Délai de mise en route",
    odooAvecModule: "3 à 8 semaines (paramétrage serveur, configuration des API, tests en sandbox DGI).",
    odooStatus: "warning",
    ceilowNatif: "Opérationnel en 5 minutes : vous saisissez votre IFU et émettez votre première facture certifiée.",
    ceilowStatus: "success",
    impactEntreprise: "Facturation immédiate de vos clients dès le premier jour d'activité.",
  },
  {
    critere: "Coût global de possession (TCO)",
    odooAvecModule: "Licences par utilisateur + frais d'intégrateur (500 000 à 2 500 000 FCFA) + hébergement serveur.",
    odooStatus: "error",
    ceilowNatif: "Abonnement mensuel ou annuel transparent en Francs CFA, tout inclus, sans aucun frais de mise en service.",
    ceilowStatus: "success",
    impactEntreprise: "Économie de plusieurs millions de FCFA sur votre budget informatique.",
  },
  {
    critere: "Comptabilité SYSCOHADA révisée",
    odooAvecModule: "Modèle comptable générique international nécessitant une reconfiguration complète des comptes.",
    odooStatus: "warning",
    ceilowNatif: "Plan comptable SYSCOHADA natif (classes 1 à 8), balance à 6 colonnes et génération de la liasse DSF.",
    ceilowStatus: "success",
    impactEntreprise: "Votre expert-comptable travaille directement dans les normes officielles de l'UEMOA.",
  },
  {
    critere: "Encaissements Mobile Money Bénin",
    odooAvecModule: "Non intégré nativement. Nécessite des passerelles de paiement tierces ou un pointage manuel.",
    odooStatus: "neutral",
    ceilowNatif: "Rapprochement bancaire et Mobile Money automatique (MTN MoMo, Celtiis Cash et banques locales).",
    ceilowStatus: "success",
    impactEntreprise: "Lettrage automatique de vos encaissements quotidiens sans double saisie.",
  },
  {
    critere: "Maintenance lors des montées de version",
    odooAvecModule: "Risque de rupture du connecteur e-MECeF à chaque mise à jour majeure d'Odoo ou de l'API DGI.",
    odooStatus: "error",
    ceilowNatif: "Mises à jour réglementaires et techniques automatiques et transparentes dans le cloud.",
    ceilowStatus: "success",
    impactEntreprise: "Continuité de facturation garantie sans facture bloquée ni frais de reprogrammation.",
  },
  {
    critere: "Support technique et proximité",
    odooAvecModule: "Dépend de la disponibilité de votre intégrateur freelance ou de la communauté en ligne.",
    odooStatus: "warning",
    ceilowNatif: "Équipe d'assistance fiscale et comptable dédiée, joignable par téléphone et présente à Cotonou.",
    ceilowStatus: "success",
    impactEntreprise: "Réponse en direct en cas d'urgence sur une déclaration ou un avoir.",
  },
];

export default function OdooEmecefComparatifPage() {
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
                  <BreadcrumbPage>Odoo vs SFE e-MECeF Bénin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-8 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-secondary border border-border text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                  <Scale className="w-4 h-4 text-ink" />
                  <span>Étude Comparative Logiciels & ERP 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight mb-4">
                  Facture normalisée e-MECeF au Bénin : Odoo vs Ceilow et solutions dédiées
                </h1>

                <p className="text-lg sm:text-xl text-text-muted leading-relaxed mb-6">
                  De nombreuses PME et directeurs financiers au Bénin s&apos;interrogent : vaut-il mieux connecter Odoo
                  à l&apos;API de la DGI ou choisir une plateforme de gestion nativement certifiée SFE ? Découvrez une
                  analyse objective des coûts réels, de la complexité technique et des contraintes comptables SYSCOHADA.
                </p>

                {/* Badges d'objectivité */}
                <div className="w-full p-4 rounded-xl bg-background-secondary border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ink shrink-0" />
                    <span>Analyse technique indépendante</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-ink shrink-0" />
                    <span>Comparatif de coûts réels (TCO)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-ink shrink-0" />
                    <span>Normes SYSCOHADA & UEMOA</span>
                  </div>
                </div>
              </div>

              {/* Encadré de synthèse */}
              <div className="lg:col-span-4 w-full">
                <div className="p-6 rounded-2xl bg-background-secondary border border-border shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-ink flex items-center justify-center shrink-0 border border-primary/40 font-bold text-sm">
                      VS
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Le constat terrain</span>
                      <h2 className="text-sm font-bold text-ink">ERP généraliste vs SFE natif</h2>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Odoo est un outil puissant pour les processus industriels complexes. Cependant, pour la facturation
                    normalisée, la gestion de la TVA et la comptabilité béninoise, un SFE spécialisé comme Ceilow évite
                    les coûts de développement lourd et les pannes lors des mises à jour DGI.
                  </p>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-text-muted">Alternative prête à l&apos;emploi :</span>
                    <Link
                      href="/solutions/facturation-dgi"
                      className="font-semibold text-ink underline hover:opacity-80 transition-opacity"
                    >
                      Découvrir Ceilow
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. TABLEAU COMPARATIF COMPLET (7 CRITÈRES) ── */}
        <section className="w-full py-12 lg:py-16 bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Face à face détaillé
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
                Tableau comparatif : Odoo avec connecteur tiers vs Ceilow
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Ce tableau compare les exigences opérationnelles réelles pour une entreprise immatriculée au Bénin.
              </p>
            </div>

            <div className="border border-border rounded-2xl overflow-hidden bg-background-secondary shadow-xs mb-12">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border bg-background text-xs uppercase tracking-wider text-text-muted font-bold">
                      <th className="py-4 px-6 w-1/4">Critère d&apos;évaluation</th>
                      <th className="py-4 px-6 w-1/3">Odoo (avec connecteur tiers)</th>
                      <th className="py-4 px-6 w-1/3 bg-primary/10 text-ink">Ceilow (SFE natif DGI)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs sm:text-sm">
                    {COMPARISON_DATA.map((row, idx) => (
                      <tr key={idx} className="hover:bg-background/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-ink align-top">
                          <div>{row.critere}</div>
                          <span className="text-[11px] text-text-muted font-normal block mt-1">
                            {row.impactEntreprise}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-text-muted align-top leading-relaxed">
                          <div className="flex items-start gap-2">
                            {row.odooStatus === "error" ? (
                              <XCircle className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                            )}
                            <span>{row.odooAvecModule}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-ink bg-primary/5 align-top font-medium leading-relaxed">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                            <span>{row.ceilowNatif}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. LES 3 GRANDS DÉFIS D'ODOO AVEC L'E-MECEF ── */}
        <section className="w-full py-12 lg:py-16 bg-background-secondary border-t border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2 block">
                Analyse technique
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">
                Les 3 pièges techniques fréquents sur les projets Odoo au Bénin
              </h2>
              <p className="text-base text-text-muted leading-relaxed">
                Si vous envisagez d&apos;intégrer Odoo pour votre société béninoise, voici les retours d&apos;expérience
                à anticiper avec votre équipe informatique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-background border border-border flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink mb-4">
                    <Server className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2">1. La gestion des jetons et de l&apos;API DGI</h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    L&apos;API e-MECeF utilise des protocoles de signature spécifiques (JWT, compteurs de sécurité,
                    formatage JSON strict des groupes fiscaux). Lorsqu&apos;un connecteur non officiel présente une micro-anomalie,
                    la DGI rejette la facture, bloquant les livraisons aux clients.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background-secondary text-xs text-text-muted">
                  Sur Ceilow : communication directe certifiée sans dépendance à un plugin tiers.
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-background border border-border flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink mb-4">
                    <RefreshCw className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2">2. L&apos;obsolescence lors des mises à jour</h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Odoo sort une nouvelle version majeure chaque année. Le module e-MECeF développé sur-mesure pour votre
                    société devient souvent incompatible avec la nouvelle version, obligeant à payer de nouvelles journées
                    de prestation à un développeur pour le réadapter.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background-secondary text-xs text-text-muted">
                  Sur Ceilow : toutes les évolutions de la DGI sont déployées automatiquement dans le cloud.
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-background border border-border flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-ink mb-4">
                    <BarChart3 className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2">3. La divergence avec le SYSCOHADA révisé</h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Odoo est structuré sur des modèles comptables anglo-saxons ou européens. L&apos;adapter pour sortir
                    la balance à 6 colonnes, les comptes spécifiques (ex: 585 Mobile Money, 443 TVA facturée) et la
                    liasse DSF de l&apos;OHADA requiert des semaines de configuration fastidieuse.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background-secondary text-xs text-text-muted">
                  Sur Ceilow : la comptabilité SYSCOHADA est au cœur de l&apos;application dès la première seconde.
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
                Questions fréquentes : Odoo et la facture normalisée au Bénin
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Odoo est-il certifié par défaut avec l'API e-MECeF de la DGI au Bénin ?",
                  a: "Non. Odoo est un progiciel international générique. Il ne dispose pas nativement du module de signature cryptographique e-MECeF propre à la République du Bénin. Pour normaliser des factures sur Odoo, une entreprise doit obligatoirement faire développer ou acheter un module connecteur tiers et le faire homologuer par la DGI.",
                },
                {
                  q: "Quel est le coût réel de mise en conformité e-MECeF sur Odoo au Bénin ?",
                  a: "L'adaptation d'Odoo inclut généralement le coût des licences utilisateurs, les honoraires d'un intégrateur informatique pour configurer l'API DGI (souvent entre 500 000 et 2 000 000 FCFA), l'hébergement serveur et les contrats de maintenance à chaque mise à jour de version d'Odoo ou de l'API DGI.",
                },
                {
                  q: "Qu'est-ce qu'un SFE approuvé par la DGI au Bénin ?",
                  a: "Un Système de Facturation Électronique (SFE) approuvé est une plateforme logicielle auditée et reconnue par la Direction Générale des Impôts. Elle intègre directement les protocoles de sécurité de la machine virtuelle DGI, applique les groupes A à F, et transmet les signatures sans boîtier matériel additionnel.",
                },
                {
                  q: "Pourquoi choisir Ceilow plutôt qu'un ERP généraliste comme Odoo ?",
                  a: "Ceilow est opérationnel en 5 minutes sans frais d'installation. Il intègre nativement l'e-MECeF, la comptabilité SYSCOHADA révisée (balance à 6 colonnes, liasse DSF), le rapprochement Mobile Money et bancaire local, ainsi qu'un accompagnement physique et téléphonique assuré directement à Cotonou.",
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
              <ShieldCheck className="w-4 h-4 text-ink" />
              <span>Conformité fiscale clé en main</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-4">
              Passez à la facture normalisée sans frais d&apos;intégrateur
            </h2>

            <p className="max-w-2xl mx-auto text-base text-text-muted leading-relaxed mb-8">
              Évitez les semaines de développement sur mesure et les pannes d&apos;API. Avec Ceilow, votre facturation
              e-MECeF et votre comptabilité SYSCOHADA sont immédiatement prêtes à l&apos;emploi avec un support local basé à Cotonou.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-ink font-bold text-sm border border-ink hover:opacity-90 transition-opacity"
              >
                <span>Demander une démo comparative</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tarifs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-background text-ink font-semibold text-sm border border-border hover:border-ink transition-colors"
              >
                <span>Consulter les tarifs sans surprise</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
