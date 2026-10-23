"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Star,
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
  Users,
  MapPin,
  Headphones,
  Cpu,
  Lock,
  ChevronDown,
  Sparkles,
  Phone,
  MessageSquare,
  FileCheck,
  Calendar,
  PiggyBank,
  Check,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function AccompagnementPage() {
  const [activeTab, setActiveTab] = useState<"sarl" | "ets" | "consultants" | "creation">("sarl");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    need: "mecef",
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const tabsData = {
    sarl: {
      title: "Votre comptabilité en temps réel et votre liasse sans accroc",
      subtitle: "Conçu sur mesure pour répondre aux exigences du SYSCOHADA et de la DGI au Bénin.",
      benefits: [
        "Synchronisation bancaire automatique & rapprochement MoMo sans saisie manuelle",
        "Catégorisation intelligente de vos dépenses d'exploitation",
        "Clôture d'exercice simplifiée avec export des écritures pour votre expert-comptable",
        "Factures d'acompte et situations de travaux adaptées aux marchés publics",
      ],
      metrics: {
        label: "Temps moyen d'émission",
        value: "8 secondes",
        sub: "avec QR code DGI officiel",
      },
    },
    ets: {
      title: "Gestion simplifiée pour les Entreprises Individuelles (ETS)",
      subtitle: "Pilotez vos ventes et vos déclarations sans vous noyer dans la paperasse.",
      benefits: [
        "Facturation certifiée DGI accessible sur smartphone et tablette",
        "Suivi direct de vos encaissements MTN MoMo, Moov Money et Celtiis",
        "Calcul automatique du forfait fiscal ou de la TPS selon votre régime",
        "Régularisation des carnets d'adresses clients et fournisseurs",
      ],
      metrics: {
        label: "Zéro pénalité",
        value: "100 % conforme",
        sub: "déclarations déposées à l'heure",
      },
    },
    consultants: {
      title: "Sérénité administrative pour consultants & professions libérales",
      subtitle: "Facturez vos honoraires proprement et récupérez votre TVA sans calcul.",
      benefits: [
        "Gestion automatique des retenues à la source (AIB 1% ou 5%)",
        "Devis et lettres de mission avec signature électronique",
        "Suivi du temps passé et facturation récurrente d'honoraires",
        "Tableau de bord de rentabilité nette consultable en temps réel",
      ],
      metrics: {
        label: "Suivi de trésorerie",
        value: "Temps réel",
        sub: "marge nette immédiatement visible",
      },
    },
    creation: {
      title: "Mise en route clé en main pour les nouvelles entreprises",
      subtitle: "Démarrez votre activité avec les bons outils et les bons réflexes dès le jour 1.",
      benefits: [
        "Activation officielle de votre passerelle e-MECeF auprès de la DGI",
        "Modèle de facture personnalisé avec logo et mentions légales conformes",
        "Paramétrage initial de votre plan de comptes et de votre carnet clients",
        "Session de formation individuelle de 2h pour vous et votre équipe",
      ],
      metrics: {
        label: "Délai de mise en service",
        value: "48 heures",
        sub: "votre compte prêt à facturer",
      },
    },
  };

  const faqList = [
    {
      q: "Comment se déroule la première prise de contact ?",
      a: "Nous débutons par un échange téléphonique ou visio de 15 minutes sans aucun engagement commercial. Nous faisons le point sur votre volume de factures, vos outils actuels et vos priorités fiscales afin de vous orienter vers la formule d'accompagnement adéquate.",
    },
    {
      q: "Mon entreprise est déjà en activité, pouvez-vous reprendre mes anciennes données ?",
      a: "Oui, absolument. Nos spécialistes se chargent d'importer vos fichiers clients, vos catalogues d'articles et vos balances comptables de l'exercice précédent pour que vous repartiez sur un historique sain et complet sans ressaisie.",
    },
    {
      q: "Dois-je me séparer de mon expert-comptable pour utiliser Ceilow ?",
      a: "Pas du tout. Ceilow n'a pas vocation à remplacer votre expert-comptable, mais à lui faciliter la tâche. Nous lui créons un accès gratuit dédié afin qu'il puisse récupérer directement vos journaux et balances certifiés conformes au SYSCOHADA.",
    },
    {
      q: "Combien de temps faut-il pour que mon équipe soit autonome ?",
      a: "Grâce à notre méthode de formation sur cas réels et à l'ergonomie de la plateforme, vos collaborateurs émettent leurs premières factures en moins d'une heure. Nous assurons un suivi rapproché pendant vos 30 premiers jours.",
    },
    {
      q: "Que faire si la connexion Internet ou les serveurs de la DGI ont un ralentissement ?",
      a: "Ceilow intègre un mode hors-ligne sécurisé : vous continuez à enregistrer vos ventes sans bloquer vos clients en boutique ou au comptoir. Dès que le réseau est rétabli, la normalisation DGI s'exécute automatiquement en arrière-plan.",
    },
    {
      q: "Vos conseillers peuvent-ils se déplacer dans nos bureaux à Cotonou ?",
      a: "Oui. Nous intervenons en présentiel dans le Grand Cotonou (Littoral, Abomey-Calavi, Porto-Novo, Ouidah). Pour les entreprises des autres départements (Bohicon, Parakou...), nous organisons des sessions par visio ou des missions dédiées.",
    },
    {
      q: "Que se passe-t-il après la fin de la période d'accompagnement dédiée ?",
      a: "Vous conservez un accès direct à notre support client local par WhatsApp et téléphone, ainsi qu'à nos guides pratiques et webinaires de perfectionnement. Vous n'êtes jamais livré à vous-même.",
    },
    {
      q: "Proposez-vous un accompagnement pour la clôture annuelle et la DSF ?",
      a: "Oui. En fin d'exercice comptable, nos spécialistes peuvent vous assister pour contrôler la concordance de vos états financiers SYSCOHADA avec votre expert-comptable avant le dépôt officiel de la Déclaration Statistique et Fiscale.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans antialiased selection:bg-primary selection:text-ink">
      {/* ── HEADER PUBLIC UNIFIÉ ── */}
      <PublicHeader />

      <main className="flex-1 w-full">
        {/* ── 1. HERO SECTION SPLIT SCREEN (STYLE INDY) ── */}
        <section className="w-full bg-background pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Colonne Gauche : Copywriting & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-ink text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>Accompagnement &amp; Logiciel Tout-en-un au Bénin</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-clash text-ink tracking-tight leading-[1.15]">
                La solution tout-en-un des SARL, SAS, ETS et Indépendants
              </h1>

              <p className="mt-5 text-base sm:text-lg text-text-muted leading-relaxed">
                Facturation certifiée DGI, suivi de trésorerie en direct et assistance personnalisée par des spécialistes basés à Cotonou : concentrez-vous sur votre activité, nous sécurisons vos comptes.
              </p>

              {/* Checklist des 4 bénéfices concrets */}
              <ul className="flex flex-col gap-3.5 my-8 w-full">
                <li className="flex items-center gap-3 text-sm font-semibold text-ink">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <span>Facturation &amp; Devis 100 % conformes DGI (e-MECeF en 1 clic)</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-ink">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <span>Rapprochement bancaire &amp; Mobile Money automatique (MTN, Moov, Celtiis, Banques)</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-ink">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <span>Calcul automatisé de vos cotisations fiscales et déclarations de TVA</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-ink">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <span>Liasses fiscales &amp; bilans SYSCOHADA édités avec votre expert-comptable</span>
                </li>
              </ul>

              {/* Double CTA ergonomique */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <a
                  href="#diagnostic"
                  className="h-12 min-h-[48px] px-8 bg-primary hover:bg-primary-hover text-ink font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <span>Prendre rendez-vous</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/tarifs"
                  className="h-12 min-h-[48px] px-6 bg-background-secondary hover:bg-border text-ink font-bold text-sm rounded-xl transition-all flex items-center justify-center w-full sm:w-auto"
                >
                  <span>Découvrir les formules</span>
                </Link>
              </div>

              <span className="mt-4 text-xs text-text-muted">
                Échange gratuit de 15 minutes • Sans engagement commercial • Rappel sous 2 heures ouvrées
              </span>
            </div>

            {/* Colonne Droite : Visuel Professionnel Stylisé */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md rounded-3xl bg-background-secondary border border-border p-6 shadow-md flex flex-col gap-6">
                <div className="aspect-[4/3] rounded-2xl bg-ink text-white p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-primary tracking-wider">
                      Conseiller Dédié Cotonou
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                  </div>

                  <div>
                    <span className="text-xl font-bold font-clash block">
                      Marc &amp; l&apos;équipe Ceilow
                    </span>
                    <span className="text-xs text-white/70 block mt-1">
                      Experts comptabilité &amp; fiscalité DGI Bénin
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
                    <span>Intervention Cotonou &amp; Calavi</span>
                    <span className="text-primary font-bold">Réponse &lt; 15 min</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-ink" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-ink block">Mise en service en 48 heures</span>
                    <span className="text-[11px] text-text-muted block">Import complet de vos clients et anciens historiques</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. RUBAN DE RÉASSURANCE IMMÉDIATE (4 PILIERS) ── */}
        <section className="w-full py-6 bg-background-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-primary mb-1">
                <Star className="w-4 h-4 fill-primary" />
                <span className="text-sm font-bold text-ink">4,9 / 5</span>
              </div>
              <span className="text-xs text-text-muted font-medium">Satisfaction clients vérifiée</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-ink mb-1">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-sm font-bold text-ink">Homologué DGI</span>
              </div>
              <span className="text-xs text-text-muted font-medium">Certification e-MECeF Bénin</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-ink mb-1">
                <Lock className="w-4 h-4 text-ink" />
                <span className="text-sm font-bold text-ink">Conforme APDP</span>
              </div>
              <span className="text-xs text-text-muted font-medium">Protection des données</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-ink mb-1">
                <Headphones className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-ink">Support Local</span>
              </div>
              <span className="text-xs text-text-muted font-medium">Équipe basée à Cotonou</span>
            </div>
          </div>
        </section>

        {/* ── 3. SECTION "GÉREZ FACILEMENT VOTRE SOCIÉTÉ" (3 CARTES) ── */}
        <section className="w-full py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink">
                Gérez facilement votre société avec Ceilow
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Pensé pour répondre parfaitement à vos besoins, du démarrage de votre activité jusqu&apos;à son plein développement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Carte 1 */}
              <div className="p-8 rounded-3xl bg-background-secondary border border-border flex flex-col justify-between hover:border-primary transition-all">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-6">
                    <FileCheck className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-xl font-bold font-clash text-ink mb-3">
                    Automatisez votre comptabilité
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Vos encaissements et dépenses se classent automatiquement dans le bon compte SYSCOHADA. Plus aucune facture égarée, plus de double saisie.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-border flex items-center gap-2 text-xs font-semibold text-ink">
                  <Check className="w-4 h-4 text-success" />
                  <span>Journal des écritures à jour en continu</span>
                </div>
              </div>

              {/* Carte 2 */}
              <div className="p-8 rounded-3xl bg-background-secondary border border-border flex flex-col justify-between hover:border-primary transition-all">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-6">
                    <PiggyBank className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-xl font-bold font-clash text-ink mb-3">
                    Découvrez combien vous gagnez
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Visualisez votre marge nette réelle au jour le jour et anticipez vos charges fiscales sans attendre le bilan de fin d&apos;année de votre cabinet.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-border flex items-center gap-2 text-xs font-semibold text-ink">
                  <Check className="w-4 h-4 text-success" />
                  <span>Trésorerie nette prévisionnelle</span>
                </div>
              </div>

              {/* Carte 3 */}
              <div className="p-8 rounded-3xl bg-background-secondary border border-border flex flex-col justify-between hover:border-primary transition-all">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-ink" />
                  </div>
                  <h3 className="text-xl font-bold font-clash text-ink mb-3">
                    Facturez d&apos;où que vous soyez
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Émettez vos factures normalisées depuis votre smartphone en boutique, sur chantier ou au bureau. Vos clients reçoivent leur reçu par WhatsApp en 10 secondes.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-border flex items-center gap-2 text-xs font-semibold text-ink">
                  <Check className="w-4 h-4 text-success" />
                  <span>QR code officiel généré en 1 clic</span>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a
                href="#diagnostic"
                className="h-12 min-h-[48px] px-8 bg-primary hover:bg-primary-hover text-ink font-bold text-sm rounded-xl transition-all shadow-sm inline-flex items-center justify-center gap-2"
              >
                <span>Prendre rendez-vous avec un conseiller</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── 4. BANNIÈRE D'AUTORITÉ SOMBRE INK (5 PILIERS) ── */}
        <section className="w-full py-16 lg:py-20 bg-ink text-white border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold font-clash text-white tracking-tight">
              Avec Ceilow, vous êtes entre de bonnes mains
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
              Une alliance unique entre logiciel automatisé et accompagnement humain par des professionnels à vos côtés.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-14 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#3D3830] border border-white/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Réactivité</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Une réponse garantie en moins de 15 minutes par WhatsApp ou par téléphone.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#3D3830] border border-white/10 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Expertise</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Des conseillers certifiés maîtrisant le droit fiscal et le SYSCOHADA béninois.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#3D3830] border border-white/10 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Technologie</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Synchronisation automatique avec vos banques et comptes Mobile Money.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#3D3830] border border-white/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Sérénité</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Vos déclarations fiscales transmises dans les délais légaux, zéro pénalité.
                </p>
              </div>

              <div className="flex flex-col items-center col-span-2 md:col-span-1">
                <div className="w-12 h-12 rounded-2xl bg-[#3D3830] border border-white/10 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Proximité</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Une équipe basée à Cotonou disponible pour intervenir dans vos locaux.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. SECTION "VOS DÉCLARATIONS EN TOUTE SÉRÉNITÉ" (3 CARTES) ── */}
        <section className="w-full py-20 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink">
                Vos déclarations en toute sérénité
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Ceilow prépare et génère l&apos;ensemble de vos documents fiscaux obligatoires en quelques clics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-background-secondary border border-border flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-primary tracking-wider block mb-2">
                    Fiscalité &amp; TVA
                  </span>
                  <h3 className="text-xl font-bold font-clash text-ink mb-3">
                    Fini les calculs manuels et les sueurs froides
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Vos décomptes fiscaux s&apos;ajustent au fil de l&apos;eau. Vous connaissez votre montant exact de TVA avant le 10 du mois sans calcul interminable.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs font-semibold text-success">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Calcul vérifié et certifié</span>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-background-secondary border border-border flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-primary tracking-wider block mb-2">
                    SYSCOHADA Révisé
                  </span>
                  <h3 className="text-xl font-bold font-clash text-ink mb-3">
                    Génération de l&apos;ensemble de vos liasses
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Exportez vos bilans et comptes de résultat conformes en un clic pour votre expert-comptable ou pour le dépôt officiel.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs font-semibold text-success">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Exports PDF et Excel prêts pour dépôt</span>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-background-secondary border border-border flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-primary tracking-wider block mb-2">
                    Transmission DGI
                  </span>
                  <h3 className="text-xl font-bold font-clash text-ink mb-3">
                    Certification e-MECeF sans blocage
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Chaque opération génère sa preuve d&apos;enregistrement officielle avec jeton de sécurité DGI infalsifiable, sans aucun risque de litige.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs font-semibold text-success">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Sécurisation hors-ligne incluse</span>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/tarifs"
                className="h-12 min-h-[48px] px-8 bg-background-secondary hover:bg-border border border-border text-ink font-bold text-sm rounded-xl transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Découvrir notre accompagnement fiscal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 6. PREUVE SOCIALE & TÉMOIGNAGES (FOND SOMBRE INK) ── */}
        <section className="w-full py-20 bg-ink text-white border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-3 text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D3830] border border-white/10 text-xs font-semibold text-white">
                <div className="flex gap-0.5 text-primary">
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  <Star className="w-3.5 h-3.5 fill-primary" />
                </div>
                <span className="font-bold text-white pl-1">4,9 / 5</span>
                <span className="text-white/60">• Satisfaction vérifiée</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-white tracking-tight">
                Plus de 500 entreprises et indépendants nous font confiance
              </h2>

              <p className="text-white/70 text-base max-w-2xl">
                Découvrez comment des dirigeants béninois ont sécurisé leur conformité et simplifié leur gestion au quotidien.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Avis 1 */}
              <div className="p-8 rounded-3xl bg-[#3D3830] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-primary mb-4">
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    « En deux jours, nous sommes passés du papier au 100 % certifié »
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                    « Nous perdions 3 heures chaque soir à rapprocher les espèces et les paiements MoMo. L&apos;équipe Ceilow est venue installer les postes dans notre magasin de Ganhi et a formé nos vendeuses en une matinée. Le soir, la caisse tombe juste au franc près. »
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <span className="text-xs font-bold text-white block">Arnaud Soglo</span>
                  <span className="text-[11px] text-white/60 block">Directeur Général • Éts Soglo &amp; Fils (Ganhi, Cotonou)</span>
                </div>
              </div>

              {/* Avis 2 */}
              <div className="p-8 rounded-3xl bg-[#3D3830] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-primary mb-4">
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    « La fin de la panique du 15 du mois pour les déclarations TVA »
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                    « Avant Ceilow, rassembler nos factures était une source de stress permanent. Aujourd&apos;hui, mon comptable accède directement à nos journaux, valide les chiffres en un clic et transmet notre déclaration sans aucune pénalité. »
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <span className="text-xs font-bold text-white block">Mariam Bio</span>
                  <span className="text-[11px] text-white/60 block">Fondatrice &amp; Gérante • Agence Stratégie Atlantique (Cadjehoun)</span>
                </div>
              </div>

              {/* Avis 3 */}
              <div className="p-8 rounded-3xl bg-[#3D3830] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-primary mb-4">
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                    <Star className="w-4 h-4 fill-primary" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    « Un conseiller réactif qui répond sur WhatsApp en 5 minutes »
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                    « Au port, une facture bloquée peut retarder une livraison de conteneurs. Quand nous avons eu un doute sur l&apos;exonération d&apos;une facture sous douane, notre conseiller dédié Ceilow nous a assistés immédiatement avec le bon texte légal. »
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <span className="text-xs font-bold text-white block">Christian Dossou</span>
                  <span className="text-[11px] text-white/60 block">Responsable Financier • Transit Bénin Express (Zone Portuaire)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. APPEL AU JUSTE PRIX (CALLOUT TRANSPARENCE) ── */}
        <section className="w-full py-20 bg-background text-center border-b border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-14 h-14 rounded-full bg-background-secondary border border-border flex items-center justify-center mx-auto mb-6">
              <PiggyBank className="w-7 h-7 text-ink" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink">
              Votre gestion et votre accompagnement, au juste prix
            </h2>

            <p className="mt-4 text-base text-text-muted leading-relaxed">
              Des tarifs transparents en FCFA, sans frais cachés ni mauvaise surprise. Choisissez entre l&apos;autonomie avec notre logiciel ou déléguez votre transition à nos spécialistes.
            </p>

            <div className="mt-8">
              <Link
                href="/tarifs"
                className="h-12 min-h-[48px] px-8 bg-primary hover:bg-primary-hover text-ink font-bold text-sm rounded-xl transition-all shadow-sm inline-flex items-center justify-center gap-2"
              >
                <span>Consulter notre grille tarifaire</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 8. SHOWCASE INTERACTIF À ONGLETS (STATUTS JURIDIQUES) ── */}
        <section className="w-full py-20 bg-background-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink">
                L&apos;ensemble de vos besoins en une seule solution
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Que vous créiez votre première structure ou gériez une entreprise en pleine expansion, Ceilow s&apos;adapte à votre statut.
              </p>
            </div>

            {/* Onglets horizontaux */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 justify-start sm:justify-center mb-12">
              <button
                type="button"
                onClick={() => setActiveTab("sarl")}
                className={`min-h-[44px] px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "sarl"
                    ? "bg-ink text-white shadow-sm"
                    : "bg-background text-ink border border-border hover:bg-border"
                }`}
              >
                SARL &amp; SAS
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ets")}
                className={`min-h-[44px] px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "ets"
                    ? "bg-ink text-white shadow-sm"
                    : "bg-background text-ink border border-border hover:bg-border"
                }`}
              >
                Entreprises Individuelles (ETS)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("consultants")}
                className={`min-h-[44px] px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "consultants"
                    ? "bg-ink text-white shadow-sm"
                    : "bg-background text-ink border border-border hover:bg-border"
                }`}
              >
                Professions Libérales &amp; Consultants
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("creation")}
                className={`min-h-[44px] px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "creation"
                    ? "bg-ink text-white shadow-sm"
                    : "bg-background text-ink border border-border hover:bg-border"
                }`}
              >
                Création d&apos;Entreprise
              </button>
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="p-8 sm:p-12 rounded-3xl bg-background border border-border shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <h3 className="text-2xl sm:text-3xl font-bold font-clash text-ink">
                  {tabsData[activeTab].title}
                </h3>
                <p className="text-base text-text-muted leading-relaxed">
                  {tabsData[activeTab].subtitle}
                </p>

                <ul className="flex flex-col gap-3 my-2">
                  {tabsData[activeTab].benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-ink font-medium">
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <a
                    href="#diagnostic"
                    className="inline-flex items-center gap-2 text-ink font-bold text-sm hover:text-primary transition-colors underline underline-offset-4"
                  >
                    <span>Demander un diagnostic personnalisé pour mon profil</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 rounded-2xl bg-background-secondary border border-border flex flex-col gap-4 text-center">
                <span className="text-xs uppercase font-bold text-text-muted tracking-wider">
                  {tabsData[activeTab].metrics.label}
                </span>
                <span className="font-clash text-3xl sm:text-4xl font-bold text-ink">
                  {tabsData[activeTab].metrics.value}
                </span>
                <span className="text-xs text-text-muted">
                  {tabsData[activeTab].metrics.sub}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. QUESTIONS FRÉQUENTES EN 2 COLONNES ── */}
        <section className="w-full py-20 bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold font-clash text-ink">
                Questions fréquentes
              </h2>
              <p className="mt-3 text-base text-text-muted">
                Tout ce que vous devez savoir pour démarrer votre accompagnement en toute clarté.
              </p>
            </div>

            {/* Grille 2 colonnes équilibrées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colonne 1 */}
              <div className="flex flex-col gap-4">
                {faqList.slice(0, 4).map((faq, idx) => {
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

              {/* Colonne 2 */}
              <div className="flex flex-col gap-4">
                {faqList.slice(4, 8).map((faq, idx) => {
                  const actualIdx = idx + 4;
                  const isOpen = openFaqIndex === actualIdx;
                  return (
                    <div
                      key={actualIdx}
                      className="rounded-2xl border border-border bg-background-secondary overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(actualIdx)}
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
          </div>
        </section>

        {/* ── 10. BANNIÈRE PRÉ-FOOTER LIFESTYLE ── */}
        <section className="w-full py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-background-secondary border border-border grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 flex flex-col items-start gap-5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-clash text-ink tracking-tight">
                  Prêt pour la sérénité dans votre gestion ?
                </h2>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-xl">
                  Rejoignez les dirigeants et entrepreneurs béninois qui ont dit adieu au stress des déclarations et aux factures perdues.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#diagnostic"
                    className="h-12 min-h-[48px] px-7 bg-primary hover:bg-primary-hover text-ink font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Prendre rendez-vous gratuitement</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://wa.me/2290197554953"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 min-h-[48px] px-6 bg-background hover:bg-border text-ink font-bold text-sm rounded-xl transition-all border border-border flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-ink" />
                    <span>Conseiller WhatsApp</span>
                  </a>
                </div>
                <span className="text-xs text-text-muted">
                  Échange offert de 15 minutes • Aucun engagement • Réponse rapide
                </span>
              </div>

              <div className="lg:col-span-4 p-6 rounded-2xl bg-ink text-white flex flex-col justify-between min-h-[220px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary uppercase">Cotonou Direct</span>
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-xl font-bold font-clash block">+229 01 97 55 49 53</span>
                  <span className="text-xs text-white/70 block mt-1">Ligne prioritaire dirigeants</span>
                </div>
                <span className="text-[11px] text-white/60">Disponible du lundi au vendredi, 8h - 18h</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 11. MODULE FORMULAIRE DE DIAGNOSTIC ANCRÉ (#diagnostic) ── */}
        <section id="diagnostic" className="w-full py-16 bg-background-secondary border-t border-border">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-background border border-border shadow-sm">
              <div className="text-center mb-8">
                <span className="text-xs uppercase font-bold text-primary tracking-wider block mb-2">
                  Prise de Contact Directe
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-clash text-ink">
                  Réservez votre diagnostic gratuit de 15 min
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-text-muted">
                  Indiquez vos coordonnées. Un spécialiste vous contacte sous 2 heures ouvrées.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-success/15 border border-success/30 text-center flex flex-col items-center gap-3 animate-fade-in">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                  <span className="text-base font-bold text-ink">Votre demande a été bien enregistrée</span>
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
                    <label htmlFor="diag-name" className="text-xs font-bold text-ink">
                      Votre nom et prénom
                    </label>
                    <input
                      id="diag-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex. : Marcel Agbossou"
                      className="h-11 min-h-[44px] px-4 rounded-xl border border-border bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-company" className="text-xs font-bold text-ink">
                      Nom de votre entreprise &amp; Forme juridique
                    </label>
                    <input
                      id="diag-company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Ex. : Bénin Distribution SARL"
                      className="h-11 min-h-[44px] px-4 rounded-xl border border-border bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-phone" className="text-xs font-bold text-ink">
                      Numéro de téléphone / WhatsApp
                    </label>
                    <input
                      id="diag-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex. : +229 01 97 00 00 00"
                      className="h-11 min-h-[44px] px-4 rounded-xl border border-border bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-need" className="text-xs font-bold text-ink">
                      Votre besoin prioritaire
                    </label>
                    <select
                      id="diag-need"
                      value={formData.need}
                      onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                      className="h-11 min-h-[44px] px-4 rounded-xl border border-border bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="mecef">Démarrer avec la facturation certifiée e-MECeF DGI</option>
                      <option value="transition">Quitter Excel / Ancien logiciel sans perte de données</option>
                      <option value="formation">Former mes caissiers et vendeurs sur le terrain</option>
                      <option value="fiscal">Sécuriser mes déclarations de TVA et liasse SYSCOHADA</option>
                      <option value="autre">Autre projet spécifique</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="h-12 min-h-[48px] px-8 bg-primary hover:bg-primary-hover text-ink font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Valider ma demande de diagnostic</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <span className="text-[11px] text-text-muted text-center mt-1">
                    Vos coordonnées restent strictement confidentielles et conformes à l&apos;APDP Bénin.
                  </span>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER PUBLIC UNIFIÉ ── */}
      <PublicFooter />
    </div>
  );
}
