import React from "react";
import Image from "next/image";
import Link from "next/link";

interface PublicFooterProps {
  className?: string;
}

export function PublicFooter({ className = "" }: PublicFooterProps) {
  return (
    <footer className={`w-full bg-ink text-white py-12 border-t border-white/10 ${className}`}>
      <div className="max-w-[1200px] w-full mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-3">
        {/* Colonne 1 : Brand & Copyright (245px) */}
        <div className="w-full md:w-[245px] flex flex-col items-start gap-3">
          <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <Image
              src="/logo/ceilow_web_jaune.svg"
              alt="Ceilow"
              width={140}
              height={36}
              className="h-9 w-auto"
            />
          </Link>
          <p className="text-sm text-white/70">
            © 2026 Ceilow. Tous droits réservés.
          </p>
        </div>

        {/* Colonne 2 : Produit (130px) */}
        <div className="w-full md:w-[130px] flex flex-col items-start gap-2">
          <span className="text-sm font-semibold text-white leading-5">
            Produit
          </span>
          <Link href="/#modules" className="text-sm text-white/70 hover:text-white transition-colors leading-5">
            Facturation
          </Link>
          <Link href="/#modules" className="text-sm text-white/70 hover:text-white transition-colors leading-5">
            TVA et déclarations
          </Link>
          <Link href="/#tarifs" className="text-sm text-white/70 hover:text-white transition-colors leading-5">
            Tarifs
          </Link>
        </div>

        {/* Colonne 3 : Ressources (163px) */}
        <div className="w-full md:w-[163px] flex flex-col items-start gap-2">
          <span className="text-sm font-semibold text-white leading-5">
            Ressources
          </span>
          <Link href="/#faq" className="text-sm text-white/70 hover:text-white transition-colors leading-5">
            Centre d'aide
          </Link>
          <Link href="/#modules" className="text-sm text-white/70 hover:text-white transition-colors leading-5">
            Guides
          </Link>
          <Link href="/#conformite" className="text-sm text-white/70 hover:text-white transition-colors leading-5">
            Normes DGI et e-MECeF
          </Link>
        </div>

        {/* Colonne 4 : Légal (112px) */}
        <div className="w-full md:w-[112px] flex flex-col items-start gap-2">
          <span className="text-sm font-semibold text-white leading-5">
            Légal
          </span>
          <Link href="/mentions-legales" className="text-sm text-white/70 hover:text-white transition-colors leading-5">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="text-sm text-white/70 hover:text-white transition-colors leading-5">
            Confidentialité
          </Link>
          <Link href="/cgu" className="text-sm text-white/70 hover:text-white transition-colors leading-5">
            CGU
          </Link>
        </div>
      </div>
    </footer>
  );
}
