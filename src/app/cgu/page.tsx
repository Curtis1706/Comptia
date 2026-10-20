"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

const SUMMARY_ITEMS = [
  { id: "objet", label: "1. Objet" },
  { id: "service", label: "2. Le service" },
  { id: "compte", label: "3. Création de compte" },
  { id: "plans", label: "4. Plans et tarifs" },
  { id: "obligations", label: "5. Obligations de l'utilisateur" },
  { id: "responsabilite", label: "6. Responsabilité de Ceilow" },
  { id: "donnees", label: "7. Données et propriété intellectuelle" },
  { id: "resiliation", label: "8. Suspension et résiliation" },
  { id: "modifications", label: "9. Modification des CGU" },
  { id: "droit-applicable", label: "10. Droit applicable et litiges" },
];

export default function CGUPage() {
  const [activeSection, setActiveSection] = useState("objet");

  // Détection dynamique de la section active lors du défilement
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
      {/* ── EN-TÊTE SOMBRE (Hero Header 396px conforme Figma) ── */}
      <header className="w-full bg-ink text-white pb-16">
        <PublicHeader />

        {/* Cadre Titre & Métadonnées (820px x 228px) */}
        <div className="max-w-[820px] w-full mx-auto px-6 pt-10 sm:pt-12 text-center flex flex-col items-center gap-4 animate-fade-in">
          {/* Badge Légal conforme Figma */}
          <div className="inline-flex items-center px-3 py-1 bg-primary text-ink text-xs font-semibold rounded-full tracking-wide">
            Légal
          </div>

          {/* Titre Display 56px */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-semibold text-white leading-tight tracking-tight">
            CGU
          </h1>

          {/* Sous-titre Body/Large */}
          <p className="text-base sm:text-lg text-white/85 max-w-[620px] leading-relaxed">
            Conditions générales d'utilisation du service Ceilow.
          </p>

          {/* Dernière mise à jour */}
          <p className="text-sm text-white/65">
            Dernière mise à jour : 1er janvier 2026
          </p>
        </div>
      </header>

      {/* ── CONTENU PRINCIPAL CONFORME FIGMA ── */}
      <main className="w-full max-w-[1200px] mx-auto px-6 py-12 lg:py-16 flex flex-col items-center gap-8 sm:gap-10">
        {/* Onglets de navigation légale (360px x 43px) */}
        <nav
          className="flex items-center justify-center gap-2 border-b border-border w-full max-w-[420px] pb-px"
          aria-label="Navigation légale"
        >
          {/* Onglet Mentions légales */}
          <Link
            href="/mentions-legales"
            className="px-4 py-2.5 text-sm font-medium text-text-muted hover:text-ink flex items-center justify-center transition-colors min-h-[44px]"
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

          {/* Onglet CGU (Actif) */}
          <Link
            href="/cgu"
            className="px-4 py-2.5 text-sm font-semibold text-ink border-b-[3px] border-primary -mb-px flex items-center justify-center transition-colors min-h-[44px]"
            aria-current="page"
          >
            CGU
          </Link>
        </nav>

        {/* Corps de la page (Sommaire 264px + Article 696px = 1008px) */}
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
                  Cadre contractuel
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  L'inscription et l'utilisation de Ceilow impliquent l'adhésion sans réserve aux présentes conditions générales d'utilisation pour toute organisation professionnelle au Bénin.
                </p>
              </div>
            </div>

            {/* Section 1 : 1. Objet */}
            <section id="objet" className="flex flex-col gap-3 pt-2 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                1. Objet
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Les présentes conditions générales d'utilisation (CGU) encadrent l'accès et l'utilisation du service Ceilow, édité par <strong className="text-ink font-semibold">Ceilow Technologies SAS</strong>. En créant un compte, vous les acceptez.
              </p>
            </section>

            {/* Section 2 : 2. Le service */}
            <section id="service" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                2. Le service
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Ceilow est une plateforme de gestion financière pour les PME et indépendants : facturation, suivi de la TVA, rapprochement bancaire et outils de pilotage.
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                La certification e-MECeF des factures s'effectue dans le strict respect des spécifications techniques et d'homologation de la Direction Générale des Impôts (DGI) du Bénin.
              </p>
            </section>

            {/* Section 3 : 3. Création de compte */}
            <section id="compte" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                3. Création de compte
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                L'inscription est réservée aux personnes majeures agissant dans le cadre de leur activité professionnelle. Vous vous engagez à fournir des informations exactes et à garder vos identifiants confidentiels. Toute activité réalisée depuis votre compte est réputée effectuée par vous.
              </p>
            </section>

            {/* Section 4 : 4. Plans et tarifs */}
            <section id="plans" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                4. Plans et tarifs
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Ceilow propose un plan Gratuit (jusqu'à <span className="tabular-nums font-medium text-ink">10</span> factures certifiées par mois), un plan Pro à <span className="tabular-nums font-medium text-ink">15 000 FCFA</span> par mois avec essai gratuit de <span className="tabular-nums font-medium text-ink">14</span> jours, et une offre Entreprise et cabinet sur devis. Les règlements s'effectuent par Mobile Money (MTN MoMo, Moov Money) ou carte bancaire avec factures acquittées émises automatiquement.
              </p>
            </section>

            {/* Section 5 : 5. Obligations de l'utilisateur */}
            <section id="obligations" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                5. Obligations de l'utilisateur
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Vous utilisez le service de façon licite et vous êtes seul responsable de l'exactitude des données saisies, de vos déclarations fiscales et du respect de vos obligations comptables.
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                Il est interdit de perturber le service, d'en contourner la sécurité ou de l'utiliser à des fins frauduleuses.
              </p>
            </section>

            {/* Section 6 : 6. Responsabilité de Ceilow */}
            <section id="responsabilite" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                6. Responsabilité de Ceilow
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Ceilow met en œuvre les moyens raisonnables pour assurer la disponibilité et la sécurité du service. Ceilow ne fournit pas de conseil comptable, fiscal ou juridique personnalisé.
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                Dans les limites permises par la loi, la responsabilité de Ceilow est limitée aux dommages directs avérés résultant d'une faute prouvée de notre part.
              </p>
            </section>

            {/* Section 7 : 7. Données et propriété intellectuelle */}
            <section id="donnees" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                7. Données et propriété intellectuelle
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Vous restez propriétaire des données que vous saisissez. Vous autorisez Ceilow à les traiter pour fournir le service, conformément à la politique de confidentialité.
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                Ceilow conserve tous les droits sur le logiciel, les marques et les contenus du service.
              </p>
            </section>

            {/* Section 8 : 8. Suspension et résiliation */}
            <section id="resiliation" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                8. Suspension et résiliation
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Vous pouvez fermer votre compte à tout moment depuis votre espace paramètres. Ceilow peut suspendre ou résilier un compte en cas de manquement aux CGU, après information préalable lorsque c'est possible. Un délai de 30 jours vous est accordé pour exporter l'ensemble de vos pièces et écritures comptables.
              </p>
            </section>

            {/* Section 9 : 9. Modification des CGU */}
            <section id="modifications" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                9. Modification des CGU
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Ceilow peut modifier les CGU. La version en vigueur est celle publiée sur le site ; en cas de changement important, les utilisateurs en seront informés.
              </p>
            </section>

            {/* Section 10 : 10. Droit applicable et litiges */}
            <section id="droit-applicable" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                10. Droit applicable et litiges
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Les CGU sont régies par le droit béninois. Les parties chercheront une solution amiable ; à défaut, les tribunaux compétents de Cotonou seront saisis.
              </p>
            </section>
          </article>
        </div>
      </main>

      {/* ── PIED DE PAGE SOMBRE (Footer unifié conforme Figma) ── */}
      <PublicFooter />
    </div>
  );
}
