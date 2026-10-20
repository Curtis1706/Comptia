"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

const SUMMARY_ITEMS = [
  { id: "responsable", label: "1. Responsable du traitement" },
  { id: "donnees", label: "2. Données collectées" },
  { id: "finalites", label: "3. Finalités" },
  { id: "conservation", label: "4. Durée de conservation" },
  { id: "destinataires", label: "5. Destinataires et sous-traitants" },
  { id: "securite", label: "6. Sécurité" },
  { id: "droits", label: "7. Vos droits" },
  { id: "cookies", label: "8. Cookies" },
  { id: "cadre-legal", label: "9. Cadre légal et réclamation" },
  { id: "modifications", label: "10. Modifications" },
];

export default function ConfidentialitePage() {
  const [activeSection, setActiveSection] = useState("responsable");

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
            Confidentialité
          </h1>

          {/* Sous-titre Body/Large */}
          <p className="text-base sm:text-lg text-white/85 max-w-[620px] leading-relaxed">
            Comment Ceilow collecte, utilise et protège vos données personnelles.
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

          {/* Onglet Confidentialité (Actif) */}
          <Link
            href="/confidentialite"
            className="px-4 py-2.5 text-sm font-semibold text-ink border-b-[3px] border-primary -mb-px flex items-center justify-center transition-colors min-h-[44px]"
            aria-current="page"
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
                  Protection des données & engagement
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  Ceilow s'engage à garantir la confidentialité, la souveraineté et l'intégrité de l'ensemble des données comptables, bancaires et fiscales confiées par nos utilisateurs au Bénin.
                </p>
              </div>
            </div>

            {/* Section 1 : 1. Responsable du traitement */}
            <section id="responsable" className="flex flex-col gap-3 pt-2 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                1. Responsable du traitement
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Les données personnelles collectées via le site et l'application Ceilow sont traitées par <strong className="text-ink font-semibold">Ceilow Technologies SAS</strong>, Quartier Haie Vive, Cotonou, Bénin. Contact pour toute question : <a href="mailto:dpo@ceilow.bj" className="text-ink underline hover:text-primary transition-colors">dpo@ceilow.bj</a> · <a href="mailto:contact@ceilow.bj" className="text-ink underline hover:text-primary transition-colors">contact@ceilow.bj</a>.
              </p>
            </section>

            {/* Section 2 : 2. Données collectées */}
            <section id="donnees" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                2. Données collectées
              </h3>
              <ul className="flex flex-col gap-2.5 text-base text-text-muted leading-relaxed pl-1">
                <li>
                  <strong className="text-ink font-semibold">Données de compte :</strong> nom, prénom, adresse e-mail, mot de passe (stocké sous forme chiffrée avec hachage robuste).
                </li>
                <li>
                  <strong className="text-ink font-semibold">Données d'entreprise :</strong> nom de l'entreprise, Identifiant Fiscal Unique (IFU à 13 chiffres), RCCM, adresse et coordonnées professionnelles.
                </li>
                <li>
                  <strong className="text-ink font-semibold">Données de facturation et de comptabilité :</strong> factures clients et fournisseurs, clients, relevés bancaires et mouvements Mobile Money que vous saisissez ou importez.
                </li>
                <li>
                  <strong className="text-ink font-semibold">Données de contact :</strong> informations transmises via le formulaire de demande de démo ou nos formulaires d'assistance.
                </li>
                <li>
                  <strong className="text-ink font-semibold">Données techniques :</strong> adresse IP, type d'appareil et de navigateur, journaux de connexion et pistes d'audit immuables.
                </li>
              </ul>
            </section>

            {/* Section 3 : 3. Finalités */}
            <section id="finalites" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                3. Finalités
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Fournir et sécuriser le service ; répondre à vos demandes et assurer le support ; améliorer le produit ; vous informer de nos offres, avec votre consentement lorsqu'il est requis ; respecter nos obligations légales et réglementaires (notamment certification e-MECeF de la DGI et traçabilité SYSCOHADA).
              </p>
            </section>

            {/* Section 4 : 4. Durée de conservation */}
            <section id="conservation" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                4. Durée de conservation
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Vos données sont conservées pendant la durée d'activité de votre compte, puis archivées conformément aux obligations légales de conservation, notamment comptables et fiscales (durée minimale de dix ans conformément aux exigences du Code général des impôts du Bénin et de l'Acte Uniforme OHADA portant organisation des comptabilités).
              </p>
            </section>

            {/* Section 5 : 5. Destinataires et sous-traitants */}
            <section id="destinataires" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                5. Destinataires et sous-traitants
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Vos données ne sont communiquées qu'aux personnes habilitées de nos équipes et aux prestataires strictement nécessaires au service (infrastructures d'hébergement certifiées ISO 27001, service d'envoi d'e-mails transactionnels sécurisés, API e-MECeF de la Direction Générale des Impôts du Bénin, outils de support).
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                Si des données font l'objet d'un hébergement ou d'un transit technique hors du Bénin, Ceilow veille à ce que des garanties contractuelles strictes et reconnues soient appliquées conformément aux prescriptions de l'APDP.
              </p>
            </section>

            {/* Section 6 : 6. Sécurité */}
            <section id="securite" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                6. Sécurité
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Nous mettons en œuvre des mesures techniques et organisationnelles adaptées : chiffrement robuste des mots de passe (bcrypt/argon2), contrôle des accès par rôles (RBAC), isolation multi-tenant stricte, sauvegardes chiffrées quotidiennes, journalisation d'audit immuable et chiffrement de bout en bout via TLS 1.3.
              </p>
            </section>

            {/* Section 7 : 7. Vos droits */}
            <section id="droits" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                7. Vos droits
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Conformément à la réglementation applicable, vous pouvez demander l'accès à vos données, leur rectification, leur effacement, vous opposer à un traitement ou demander la limitation ou la portabilité lorsque la loi le prévoit.
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                Pour exercer vos droits, écrivez à <a href="mailto:dpo@ceilow.bj" className="text-ink underline hover:text-primary transition-colors">dpo@ceilow.bj</a>. Nous pouvons vous demander un justificatif d'identité afin de prévenir toute tentative d'accès non autorisé.
              </p>
            </section>

            {/* Section 8 : 8. Cookies */}
            <section id="cookies" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                8. Cookies
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Le site utilise des cookies strictement nécessaires à son fonctionnement (maintien de la session utilisateur sécurisée via cookies HttpOnly) et, le cas échéant, des cookies de mesure d'audience anonymisés. Vous pouvez les gérer depuis les paramètres de votre navigateur à tout moment.
              </p>
            </section>

            {/* Section 9 : 9. Cadre légal et réclamation */}
            <section id="cadre-legal" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                9. Cadre légal et réclamation
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Les traitements relèvent du Code du numérique du Bénin (loi n° 2017-20 du 20 avril 2018, Livre V relatif à la protection des données à caractère personnel). Vous pouvez saisir l'Autorité de Protection des Données Personnelles (APDP Bénin) en cas de difficulté ou de réclamation non résolue à l'amiable.
              </p>
            </section>

            {/* Section 10 : 10. Modifications */}
            <section id="modifications" className="flex flex-col gap-3 pt-4 border-t border-border/60 scroll-mt-28">
              <h3 className="text-xl font-semibold text-ink leading-tight">
                10. Modifications
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                Cette politique peut évoluer pour refléter nos pratiques ou les évolutions réglementaires. La date de dernière mise à jour figure en haut de la page ; en cas de changement important, nous vous en informerons par communication directe ou notification sur l'application.
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
