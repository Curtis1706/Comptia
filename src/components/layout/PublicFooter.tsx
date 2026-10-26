import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin, Building2, ShieldCheck } from "lucide-react";

interface PublicFooterProps {
  className?: string;
}

export function PublicFooter({ className = "" }: PublicFooterProps) {
  return (
    <footer className={`w-full bg-ink text-white pt-20 pb-14 border-t border-white/10 ${className}`}>
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Grille principale 12 colonnes hautement aérée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 pb-16 border-b border-white/10">
          
          {/* Colonne 1 : Ceilow, Mission & Conformité (3 colonnes) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-5">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              title="Retour à l'accueil Ceilow"
            >
              <Image
                src="/logo/ceilow_web_jaune.svg"
                alt="Ceilow : Facturation et Gestion d'Entreprise au Bénin"
                width={150}
                height={38}
                className="h-9 w-auto"
              />
            </Link>

            <p className="text-sm text-white/75 leading-relaxed max-w-sm font-normal">
              La solution de facturation et de gestion tout-en-un pour les entreprises au Bénin. Facturez aux normes DGI, suivez vos paiements et automatisez votre comptabilité en toute sérénité.
            </p>

            {/* Certification DGI */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#3D3830] border border-white/10 text-xs font-medium text-white/90">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
              <span>Certifié conforme DGI &amp; DGI-Bénin</span>
            </div>

            {/* Support plateforme Ceilow */}
            <div className="pt-2 flex flex-col gap-1.5">
              <span className="text-white/50 text-[11px] uppercase tracking-wider font-semibold">
                Support direct plateforme
              </span>
              <a
                href="mailto:contact@ceilow.com"
                className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-medium text-sm group"
              >
                <Mail className="w-4 h-4 shrink-0 text-primary group-hover:scale-110 transition-transform" />
                <span className="underline underline-offset-4">contact@ceilow.com</span>
              </a>
            </div>
          </div>

          {/* Colonne 2 : Solutions Métier (3 colonnes) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-4">
            <span className="text-xs uppercase tracking-wider font-bold text-white/90 border-b border-white/10 pb-2 w-full">
              Solutions Métier
            </span>
            <ul className="flex flex-col gap-3 text-sm text-white/75">
              <li>
                <Link href="/solutions/facturation-dgi" className="hover:text-primary transition-colors inline-block leading-snug">
                  Facturation DGI &amp; e-MECeF
                </Link>
              </li>
              <li>
                <Link href="/solutions/comptabilite-syscohada" className="hover:text-primary transition-colors inline-block leading-snug">
                  Comptabilité SYSCOHADA
                </Link>
              </li>
              <li>
                <Link href="/solutions/tresorerie-momo" className="hover:text-primary transition-colors inline-block leading-snug">
                  Trésorerie &amp; Mobile Money
                </Link>
              </li>
              <li>
                <Link href="/solutions/paie-cnss" className="hover:text-primary transition-colors inline-block leading-snug">
                  Paie &amp; Cotisations CNSS
                </Link>
              </li>
              <li>
                <Link href="/solutions/gestion-depenses" className="hover:text-primary transition-colors inline-block leading-snug">
                  Dépenses &amp; Reçus Scannés
                </Link>
              </li>
              <li>
                <Link href="/solutions/declarations-fiscales" className="hover:text-primary transition-colors inline-block leading-snug">
                  Déclarations Fiscales &amp; TVA
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Pour qui & Ressources (3 colonnes) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-4">
            <span className="text-xs uppercase tracking-wider font-bold text-white/90 border-b border-white/10 pb-2 w-full">
              Pour qui &amp; Ressources
            </span>
            <ul className="flex flex-col gap-3 text-sm text-white/75">
              <li>
                <Link href="/pour-qui/cabinets-comptables" className="hover:text-primary transition-colors inline-block leading-snug">
                  Cabinets &amp; Experts-comptables
                </Link>
              </li>
              <li>
                <Link href="/pour-qui/pme-et-independants" className="hover:text-primary transition-colors inline-block leading-snug">
                  PME &amp; Indépendants
                </Link>
              </li>
              <li>
                <Link href="/ressources/calendrier-fiscal-benin" className="hover:text-primary transition-colors inline-block leading-snug">
                  Calendrier Fiscal Bénin 2026
                </Link>
              </li>
              <li>
                <Link href="/securite-et-apdp" className="hover:text-primary transition-colors inline-block leading-snug">
                  Sécurité &amp; Conformité APDP
                </Link>
              </li>
              <li>
                <Link href="/accompagnement" className="hover:text-primary transition-colors inline-block leading-snug">
                  Accompagnement à Cotonou
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors inline-block leading-snug">
                  Contact &amp; Assistance directe
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Éditeur & Direction Technique (3 colonnes) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-4">
            <span className="text-xs uppercase tracking-wider font-bold text-white/90 border-b border-white/10 pb-2 w-full">
              Éditeur &amp; Conception
            </span>

            <div className="flex flex-col gap-3 w-full text-xs text-white/80">
              {/* Raison sociale & RCCM (fond opaque solide sombre #3D3830) */}
              <div className="p-3 rounded-lg bg-[#3D3830] border border-white/10 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-bold text-white">Digiplex Agency</span>
                </div>
                <span className="text-white/60 font-mono text-[11px] pl-6">
                  RCCM : RB/PNO/26 B 7147 (Cotonou)
                </span>
              </div>

              {/* Siège social */}
              <div className="flex items-center gap-2.5 text-white/80 pt-0.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Siège social : Cotonou, Bénin</span>
              </div>

              {/* Email Agence */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="mailto:hello@digiplex.site"
                  className="text-white hover:text-primary transition-colors underline underline-offset-2"
                >
                  hello@digiplex.site
                </a>
              </div>

              {/* Téléphones (chaque numéro sur sa propre ligne propre) */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a
                    href="tel:+2290197554953"
                    className="text-white/90 hover:text-primary transition-colors tracking-wide"
                  >
                    +229 01 97 55 49 53
                  </a>
                </div>
                <div className="flex items-center gap-2.5 font-mono text-xs pl-6">
                  <a
                    href="tel:+2290162789305"
                    className="text-white/90 hover:text-primary transition-colors tracking-wide"
                  >
                    +229 01 62 78 93 05
                  </a>
                </div>
              </div>
            </div>

            {/* Bouton CTA Démo (fond opaque sobre solide sans glassmorphisme) */}
            <div className="pt-2 w-full">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-[#3D3830] hover:bg-[#474138] border border-white/15 text-xs font-semibold text-white transition-all hover:border-primary/50"
              >
                <span>Réserver une démonstration</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Barre Inférieure Légale & Copyright (Full Width Propre) */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-5 text-xs text-white/60">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2.5 gap-y-1 text-center lg:text-left">
            <span>© 2026 Ceilow SAS.</span>
            <span className="text-white/30">•</span>
            <span>Développé &amp; opéré par Digiplex Agency.</span>
            <span className="text-white/30">•</span>
            <span>Tous droits réservés.</span>
            <span className="text-white/30">•</span>
            <span>Cotonou, République du Bénin.</span>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 flex-wrap justify-center">
            <Link
              href="/mentions-legales"
              className="hover:text-primary transition-colors whitespace-nowrap"
            >
              Mentions Légales
            </Link>
            <Link
              href="/confidentialite"
              className="hover:text-primary transition-colors whitespace-nowrap"
            >
              Protection des Données (APDP)
            </Link>
            <Link
              href="/cgu"
              className="hover:text-primary transition-colors whitespace-nowrap"
            >
              Conditions Générales de Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


