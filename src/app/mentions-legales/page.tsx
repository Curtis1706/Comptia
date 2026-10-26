"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

const SUMMARY_ITEMS = [
  { id: "editeur", label: "1. Éditeur du site" },
  { id: "directeur", label: "2. Directeur de la publication" },
  { id: "hebergement", label: "3. Hébergement" },
  { id: "propriete-intellectuelle", label: "4. Propriété intellectuelle" },
  { id: "responsabilite", label: "5. Responsabilité" },
  { id: "liens", label: "6. Liens hypertextes" },
  { id: "donnees-personnelles", label: "7. Données personnelles" },
  { id: "droit-applicable", label: "8. Droit applicable et juridiction" },
];

export default function MentionsLegalesPage() {
  const [activeSection, setActiveSection] = useState("editeur");

  // Détection de la section active au défilement
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const item of SUMMARY_ITEMS) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background-secondary text-ink flex flex-col items-center">
      {/* ── EN-TÊTE SOMBRE (Hero Header 396px) ── */}
      <header className="w-full bg-ink text-white pb-16">
        <PublicHeader />

        {/* Cadre Titre & Métadonnées conforme Figma */}
        <div className="max-w-[820px] w-full mx-auto px-6 pt-10 sm:pt-12 text-center flex flex-col items-center gap-4 animate-fade-in">
          {/* Badge Légal conforme Figma */}
          <div className="inline-flex items-center px-3 py-1 bg-primary text-ink text-xs font-semibold rounded-full tracking-wide">
            Légal
          </div>

          {/* Titre Display */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-semibold text-white leading-tight tracking-tight">
            Mentions légales
          </h1>

          {/* Sous-titre Body/Large */}
          <p className="text-base sm:text-lg text-white/85 max-w-[620px] leading-relaxed">
            Informations sur l'éditeur et l'hébergement du site Ceilow.
          </p>

          {/* Date de mise à jour */}
          <p className="text-sm text-white/65">
            Dernière mise à jour : 1er janvier 2026
          </p>
        </div>
      </header>

      {/* ── CONTENU PRINCIPAL CONFORME FIGMA ── */}
      <main className="w-full max-w-[1200px] mx-auto px-6 py-12 lg:py-16 flex flex-col items-center gap-8 sm:gap-10">
        {/* Onglets de navigation légale conforme Figma */}
        <nav
          className="flex items-center justify-center gap-2 border-b border-border w-full max-w-[420px] pb-px"
          aria-label="Navigation légale"
        >
          {/* Onglet Mentions légales (Actif) */}
          <Link
            href="/mentions-legales"
            className="px-4 py-2.5 text-sm font-semibold text-ink border-b-[3px] border-primary -mb-px flex items-center justify-center transition-colors min-h-[44px]"
            aria-current="page"
          >
            Mentions légales
          </Link>

          {/* Onglet Confidentialité */}
          <Link
            href="/confidentialite"
            className="px-4 py-2.5 text-sm font-medium text-text-muted hover:text-ink flex items-center justify-center transition-colors min-h-[44px]"
          >
            Confidentialité
          </Link>

          {/* Onglet CGU */}
          <Link
            href="/cgu"
            className="px-4 py-2.5 text-sm font-medium text-text-muted hover:text-ink flex items-center justify-center transition-colors min-h-[44px]"
          >
            CGU
          </Link>
        </nav>

        {/* Corps de la page (Sommaire + Article) */}
        <div className="w-full max-w-[1008px] flex flex-col lg:flex-row items-start gap-8 lg:gap-12 pt-4">
          {/* ── Sommaire (Sidebar 264px fixe/sticky) ── */}
          <aside className="w-full lg:w-[264px] bg-background border border-border rounded-2xl p-6 shadow-sm shrink-0 lg:sticky lg:top-28">
            <h2 className="text-sm font-semibold text-ink mb-4 pb-2 border-b border-border">
              Sommaire
            </h2>
            <nav className="flex flex-col gap-2.5 text-sm">
              {SUMMARY_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className={`flex items-center py-1 text-sm transition-colors min-h-[32px] ${
                      isActive
                        ? "text-ink font-semibold"
                        : "text-text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* ── Article (Contenu 696px) ── */}
          <article className="w-full lg:w-[696px] flex flex-col gap-8 text-ink">
            {/* Note de rédaction conforme Figma */}
            <div className="w-full bg-background border border-border rounded-xl p-4 flex items-start gap-3.5 shadow-sm">
              <div className="w-[22px] h-[22px] rounded-full bg-ink text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="flex-1 flex flex-col gap-1 text-left">
                <p className="text-sm font-semibold text-ink leading-tight">
                  Cadre réglementaire & conformité
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  Ceilow est une plateforme SaaS de comptabilité et de conformité fiscale éditée dans le strict respect des dispositions du Code général des impôts (CGI) du Bénin, du SYSCOHADA révisé et des exigences de certification e-MECeF de la Direction Générale des Impôts (DGI).
                </p>
              </div>
            </div>

            {/* Section 1 : Éditeur du site */}
            <section id="editeur" className="flex flex-col gap-3 pt-2 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                1. Éditeur du site
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Le site Ceilow est édité par <strong className="text-ink font-semibold">Ceilow Technologies SAS</strong>, société par actions simplifiée au capital de 10 000 000 FCFA, immatriculée au Registre du commerce et du crédit mobilier (RCCM) de Cotonou sous le numéro <span className="tabular-nums font-mono text-ink">RB/COT/24 B 38920</span>, Identifiant Fiscal Unique (IFU) n° <span className="tabular-nums font-mono text-ink">0202415896321</span>.
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                Siège social : Quartier Haie Vive, Cotonou, République du Bénin. Contact : <a href="mailto:contact@ceilow.bj" className="text-ink underline hover:text-primary transition-colors">contact@ceilow.bj</a> · <span className="tabular-nums">+229 01 97 00 00 00</span>.
              </p>
            </section>

            {/* Section 2 : Directeur de la publication */}
            <section id="directeur" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                2. Directeur de la publication
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Le directeur de la publication est le représentant légal de Ceilow Technologies SAS.
              </p>
            </section>

            {/* Section 3 : Hébergement */}
            <section id="hebergement" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                3. Hébergement
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Le site et les données applicatives de Ceilow sont hébergés sur des infrastructures serveurs haute sécurité certifiées ISO/IEC 27001 et SOC 2. Les sauvegardes quotidiennes et les flux financiers sont systématiquement chiffrés conformément aux exigences bancaires et de souveraineté des données.
              </p>
            </section>

            {/* Section 4 : Propriété intellectuelle */}
            <section id="propriete-intellectuelle" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                4. Propriété intellectuelle
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Les marques, logos, textes, images, éléments graphiques, chartes ergonomiques et logiciels présents sur le site sont la propriété exclusive de Ceilow Technologies SAS ou de ses partenaires et sont protégés par les législations nationales et internationales relatives à la propriété intellectuelle.
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                Toute reproduction, représentation, modification ou utilisation totale ou partielle sans autorisation écrite préalable est strictement interdite.
              </p>
            </section>

            {/* Section 5 : Responsabilité */}
            <section id="responsabilite" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                5. Responsabilité
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                L'éditeur s'efforce de fournir des informations exactes et à jour, sans garantir l'absence totale d'erreurs ou d'omissions techniques ou réglementaires.
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                Les informations publiées sur le site sont données à titre indicatif et ne constituent pas en elles-mêmes un conseil comptable, fiscal ou juridique personnalisé. Pour tout arbitrage comptable ou fiscal engageant, l'assistance d'un professionnel agréé (inscrit à l'Ordre des Experts-Comptables et Comptables Agréés du Bénin, OECCA-Bénin) est recommandée.
              </p>
            </section>

            {/* Section 6 : Liens hypertextes */}
            <section id="liens" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                6. Liens hypertextes
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Le site peut contenir des liens vers des sites tiers (notamment les portails officiels de la DGI ou de la CNSS). L'éditeur n'exerce aucun contrôle sur le contenu externe de ces plateformes et décline toute responsabilité quant à leur disponibilité ou leurs contenus.
              </p>
            </section>

            {/* Section 7 : Données personnelles */}
            <section id="donnees-personnelles" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                7. Données personnelles
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Le traitement des données personnelles est décrit dans notre{" "}
                <Link
                  href="/confidentialite"
                  className="text-ink font-semibold underline underline-offset-4 hover:text-primary transition-colors"
                >
                  politique de confidentialité
                </Link>
                , accessible depuis les onglets ci-dessus et depuis le pied de page du site. Conformément aux dispositions du Livre V du Code du numérique en République du Bénin relatif à la protection des données à caractère personnel, vous disposez d'un droit permanent d'accès, de rectification et de suppression de vos données.
              </p>
            </section>

            {/* Section 8 : Droit applicable et juridiction */}
            <section id="droit-applicable" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                8. Droit applicable et juridiction
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Les présentes mentions légales sont régies par le droit en vigueur en République du Bénin. En cas de litige relatif à la validité, à l'interprétation ou à l'exécution des présentes, et à défaut de résolution amiable, les tribunaux compétents de Cotonou seront seuls saisis, sous réserve des règles impératives applicables.
              </p>
            </section>
          </article>
        </div>
      </main>

      {/* ── PIED DE PAGE SOMBRE (Footer unifié) ── */}
      <PublicFooter />
    </div>
  );
}
