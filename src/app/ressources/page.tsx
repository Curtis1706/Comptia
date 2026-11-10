"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Clock,
  MoveRight,
  RotateCcw,
  Search,
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

type ResourceTheme = "tous" | "facturation" | "fiscalite" | "comptabilite" | "paie";

interface ResourceArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  theme: Exclude<ResourceTheme, "tous">;
  imageUrl: string;
  imageAlt: string;
  href: string;
  readTimeMinutes: number;
  toolIncluded: string;
  featured?: boolean;
}

const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    id: "guide-emecef",
    title: "Facture normalisée e-MECeF au Bénin : comment facturer aux normes sans erreur",
    excerpt:
      "Comprenez qui est concerné, comment choisir entre les groupes fiscaux A à F, appliquer l'AIB (1 % ou 5 %) et corriger une facture par avoir, sans acheter de machine physique.",
    category: "Facturation DGI",
    theme: "facturation",
    imageUrl: "/images/ressources/guide-emecef-benin.jpg",
    imageAlt:
      "Commerçante béninoise à Cotonou vérifiant une facture normalisée e-MECeF avec QR code sur smartphone",
    href: "/ressources/guide-facturation-emecef-benin",
    readTimeMinutes: 7,
    toolIncluded: "Modèle cliquable DGI",
    featured: true,
  },
  {
    id: "guide-tva",
    title: "Déclaration de la TVA au Bénin : seuil 50 M FCFA, calcul à 18 % et date du 10",
    excerpt:
      "Vérifiez si votre activité facture la TVA, récupérez celle de vos achats normalisés et simulez en Francs CFA votre montant à payer avant le 10 du mois.",
    category: "TVA & Impôts DGI",
    theme: "fiscalite",
    imageUrl: "/images/ressources/guide-tva-benin.jpg",
    imageAlt:
      "Bureau comptable organisé avec calculatrice et dossiers pour la déclaration mensuelle de TVA à Cotonou",
    href: "/ressources/guide-tva-benin",
    readTimeMinutes: 8,
    toolIncluded: "Simulateur TVA 18 %",
    featured: true,
  },
  {
    id: "calendrier-fiscal",
    title: "Calendrier fiscal Bénin 2026 : toutes vos échéances DGI et CNSS",
    excerpt:
      "Filtrez vos dates limites mois par mois, trimestre par trimestre et avant le 30 avril pour déclarer à temps et éviter toute majoration de retard.",
    category: "Échéances 2026",
    theme: "fiscalite",
    imageUrl: "/images/ressources/calendrier-fiscal-benin.jpg",
    imageAlt:
      "Espace de travail lumineux à Cotonou avec calendrier de bureau et ordinateur pour suivre les échéances fiscales",
    href: "/ressources/calendrier-fiscal-benin",
    readTimeMinutes: 5,
    toolIncluded: "Mémo imprimable",
    featured: true,
  },
  {
    id: "calcul-tps",
    title: "Calcul de la TPS au Bénin : taux 5 %, minimum 10 000 FCFA et acomptes",
    excerpt:
      "Découvrez si votre entreprise individuelle relève de la Taxe Professionnelle Synthétique, simulez vos acomptes du 10 février, 30 avril et 10 juin et facturez en Groupe E.",
    category: "PME & Indépendants",
    theme: "fiscalite",
    imageUrl: "/images/ressources/calcul-tps-benin.jpg",
    imageAlt:
      "Commerçante dans sa boutique à Cotonou consultant le calcul de sa Taxe Professionnelle Synthétique sur tablette",
    href: "/ressources/calcul-tps-benin-guide",
    readTimeMinutes: 6,
    toolIncluded: "Simulateur TPS 5 %",
  },
  {
    id: "plan-syscohada",
    title: "Plan comptable SYSCOHADA révisé : liste des comptes (classes 1 à 8)",
    excerpt:
      "Recherchez en quelques secondes les numéros officiels (banque 521, Mobile Money 585, TVA 443/445, CNSS 431), exportez en CSV pour Excel ou imprimez en PDF.",
    category: "Comptabilité OHADA",
    theme: "comptabilite",
    imageUrl: "/images/ressources/plan-syscohada-benin.jpg",
    imageAlt:
      "Registres et classeurs du plan comptable SYSCOHADA révisé disposés sur un bureau en pierre claire",
    href: "/ressources/plan-comptable-syscohada-pdf",
    readTimeMinutes: 6,
    toolIncluded: "Recherche + Export CSV",
  },
  {
    id: "bareme-cnss",
    title: "Barème des cotisations CNSS au Bénin 2026 : taux employeur, salarié et ITS",
    excerpt:
      "Consultez les taux officiels (16,4 % à 19,4 % employeur et 3,6 % salarié sans plafond), le barème ITS par tranche, le VPS à 4 % et calculez le coût d'une embauche.",
    category: "Paie & Social CNSS",
    theme: "paie",
    imageUrl: "/images/ressources/bareme-cnss-benin.jpg",
    imageAlt:
      "Responsable des ressources humaines et collaborateur préparant les bulletins de paie CNSS à Cotonou",
    href: "/ressources/bareme-cotisations-cnss-benin",
    readTimeMinutes: 7,
    toolIncluded: "Calculateur Brut / Net",
  },
];

const THEME_FILTERS: Array<{ id: ResourceTheme; label: string }> = [
  { id: "tous", label: "Tous les guides (6)" },
  { id: "facturation", label: "Facturation DGI" },
  { id: "fiscalite", label: "TVA, TPS & Échéances" },
  { id: "comptabilite", label: "Comptabilité SYSCOHADA" },
  { id: "paie", label: "Paie & CNSS" },
];

function ResourceGridCard({ post }: { post: ResourceArticle }) {
  return (
    <Link
      href={post.href}
      className="group rounded-2xl overflow-hidden border border-border hover:border-ink bg-background flex flex-col justify-between transition-colors"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-background-secondary">
        <Image
          src={post.imageUrl}
          alt={post.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <article className="p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-ink">
              {post.category}
            </span>
            <span className="text-text-muted font-mono inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTimeMinutes} min</span>
            </span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-ink leading-snug group-hover:underline">
            {post.title}
          </h3>

          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-text-muted">
            {post.toolIncluded}
          </span>
          <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform motion-reduce:transform-none motion-reduce:transition-none">
            <span>Lire le guide</span>
            <MoveRight className="w-4 h-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function RessourcesHubPage() {
  const [activeTheme, setActiveTheme] = useState<ResourceTheme>("tous");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isDefaultView = activeTheme === "tous" && searchQuery.trim() === "";

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return RESOURCE_ARTICLES.filter((article) => {
      const matchTheme = activeTheme === "tous" || article.theme === activeTheme;
      if (!matchTheme) return false;
      if (!q) return true;
      return (
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        article.toolIncluded.toLowerCase().includes(q)
      );
    });
  }, [activeTheme, searchQuery]);

  const featuredLead = RESOURCE_ARTICLES[0];
  const featuredSide = RESOURCE_ARTICLES.slice(1, 3);
  const secondaryArticles = RESOURCE_ARTICLES.slice(3);

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans antialiased selection:bg-primary selection:text-ink">
      <PublicHeader className="sticky top-0 z-50 w-full" />

      <main className="flex-1 w-full">
        {/* ── 1. EN-TÊTE ÉDITORIAL SOBRE AVEC TYPOGRAPHIE DE FOND ── */}
        <section className="relative w-full pt-10 pb-12 lg:pt-14 lg:pb-16 bg-background border-b border-border overflow-hidden">
          <span
            aria-hidden="true"
            className="pointer-events-none select-none hidden lg:block absolute -top-6 right-0 font-display text-[170px] font-extrabold leading-none tracking-tight text-ink/[0.03]"
          >
            RESSOURCES
          </span>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Accueil</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Ressources</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-3">
                Guides Pratiques &amp; Simulateurs Bénin 2026
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight mb-4">
                Ressources comptables et fiscales au Bénin : guides clairs et simulateurs gratuits
              </h1>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8">
                Retrouvez tous nos modes d&apos;emploi vérifiés pour gérer votre entreprise sans jargon ni erreur : facturation normalisée e-MECeF, TVA à 18 %, calcul de la TPS, plan SYSCOHADA, barème CNSS et calendrier fiscal 2026.
              </p>

              {/* Recherche + Filtres */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="search-ressources"
                    className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2"
                  >
                    Trouver un guide ou un simulateur (ex. TVA, e-MECeF, TPS, CNSS, 585)
                  </label>
                  <div className="relative max-w-xl">
                    <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="search-ressources"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher un sujet fiscal ou comptable..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-background-secondary border border-border text-sm text-ink placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {THEME_FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveTheme(filter.id)}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer min-h-[44px] ${
                        activeTheme === filter.id
                          ? "bg-ink text-background border-ink"
                          : "bg-background-secondary text-ink border-border hover:border-ink"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. CONTENU : BENTO FEATURED (VUE PAR DÉFAUT) OU RÉSULTATS FILTRÉS ── */}
        <section className="w-full py-14 lg:py-20 bg-background-secondary border-b border-border">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredArticles.length === 0 ? (
              <div className="bg-background p-10 rounded-2xl border border-border text-center space-y-4">
                <p className="text-base font-bold text-ink">
                  Aucun guide ne correspond à « {searchQuery} »
                </p>
                <p className="text-xs text-text-muted max-w-md mx-auto">
                  Essayez un mot-clé courant comme « facture », « TVA », « TPS », « CNSS » ou affichez l&apos;ensemble des guides.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTheme("tous");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-ink font-bold text-xs min-h-[44px] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tout afficher</span>
                </button>
              </div>
            ) : isDefaultView ? (
              <div className="space-y-12">
                {/* Grille asymétrique inspirée du modèle 21st.dev (1 grand guide à gauche + 2 guides empilés à droite) */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                      Guides essentiels à lire en priorité
                    </h2>
                    <span className="text-xs font-mono font-bold text-text-muted hidden sm:inline">
                      À jour novembre 2026
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Grande carte vedette (Colonne gauche 7/12) */}
                    <Link
                      href={featuredLead.href}
                      className="group lg:col-span-7 rounded-2xl overflow-hidden border border-border hover:border-ink bg-ink text-background flex flex-col justify-between transition-colors"
                    >
                      <div className="relative aspect-[3/2] w-full overflow-hidden bg-background">
                        <Image
                          src={featuredLead.imageUrl}
                          alt={featuredLead.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="object-cover"
                          priority
                        />
                      </div>

                      <article className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-bold uppercase tracking-wider text-primary">
                              {featuredLead.category}
                            </span>
                            <span className="text-background/75 font-mono inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Lecture : {featuredLead.readTimeMinutes} min</span>
                            </span>
                          </div>

                          <h3 className="font-display text-2xl sm:text-3xl font-bold text-background leading-snug group-hover:underline">
                            {featuredLead.title}
                          </h3>

                          <p className="text-sm sm:text-base text-background/80 leading-relaxed">
                            {featuredLead.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-ink-border flex items-center justify-between gap-4">
                          <span className="text-xs font-semibold text-background/80">
                            Inclus : {featuredLead.toolIncluded}
                          </span>
                          <span className="text-sm font-bold text-primary inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform motion-reduce:transform-none motion-reduce:transition-none">
                            <span>Lire le guide</span>
                            <MoveRight className="w-5 h-5" />
                          </span>
                        </div>
                      </article>
                    </Link>

                    {/* Deux cartes empilées (Colonne droite 5/12) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                      {featuredSide.map((post) => (
                        <Link
                          key={post.id}
                          href={post.href}
                          className="group flex-1 rounded-2xl overflow-hidden border border-border hover:border-ink bg-background flex flex-col justify-between transition-colors"
                        >
                          <div className="relative aspect-[3/2] w-full overflow-hidden bg-background-secondary">
                            <Image
                              src={post.imageUrl}
                              alt={post.imageAlt}
                              fill
                              sizes="(max-width: 1024px) 100vw, 40vw"
                              className="object-cover"
                            />
                          </div>

                          <article className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                <span className="font-bold uppercase tracking-wider text-ink">
                                  {post.category}
                                </span>
                                <span className="text-text-muted font-mono inline-flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{post.readTimeMinutes} min</span>
                                </span>
                              </div>

                              <h3 className="font-display text-lg sm:text-xl font-bold text-ink leading-snug group-hover:underline">
                                {post.title}
                              </h3>

                              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                                {post.excerpt}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                              <span className="text-xs font-medium text-text-muted">
                                {post.toolIncluded}
                              </span>
                              <span className="text-xs font-bold text-ink inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform motion-reduce:transform-none motion-reduce:transition-none">
                                <span>Lire le guide</span>
                                <MoveRight className="w-4 h-4" />
                              </span>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tous les autres guides spécialisés (TPS, SYSCOHADA, CNSS) */}
                <div>
                  <div className="mb-6">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                      Barèmes, nomenclatures et régimes détaillés
                    </h2>
                    <p className="text-sm text-text-muted mt-1">
                      Calculateurs dédiés en Francs CFA, export Excel et barèmes sociaux à jour pour votre équipe.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {secondaryArticles.map((post) => (
                      <ResourceGridCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-ink">
                    {filteredArticles.length} guide{filteredArticles.length > 1 ? "s" : ""} correspondant{filteredArticles.length > 1 ? "s" : ""} à votre recherche
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTheme("tous");
                    }}
                    className="text-xs font-bold text-ink underline underline-offset-4 cursor-pointer min-h-[44px]"
                  >
                    Réinitialiser
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((post) => (
                    <ResourceGridCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── 3. BANNIÈRE CONVERSION VERS CEILOW ── */}
        <section className="w-full py-16 bg-ink text-background">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-background">
              Passez de la théorie à la pratique sur Ceilow
            </h2>

            <p className="text-sm sm:text-base text-background/80 max-w-xl mb-8 leading-relaxed">
              Testez Ceilow gratuitement sur 10 factures normalisées e-MECeF par mois. Comptabilité SYSCOHADA et suivi TVA prêts dès l&apos;inscription.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-ink font-bold px-8 py-3.5 rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>Créer un compte</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto bg-transparent text-background font-bold px-8 py-3.5 rounded-xl border border-background/25 hover:border-background transition-all text-center min-h-[48px] flex items-center justify-center"
              >
                <span>Voir la démo</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
