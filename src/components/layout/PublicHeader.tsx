"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface PublicHeaderProps {
  className?: string;
}

export function PublicHeader({ className = "" }: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={`w-full bg-ink text-white relative z-40 ${className}`}>
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between relative">
        {/* Logo officiel Ceilow à l'extrême gauche */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-transform hover:scale-[1.02]"
            title="Retour à l'accueil Ceilow"
          >
            <Image
              src="/logo/ceilow_web_jaune.svg"
              alt="Ceilow"
              width={140}
              height={36}
              className="h-9 w-auto"
              style={{ width: "auto" }}
              priority
            />
          </Link>
        </div>

        {/* Liens de navigation exactement au milieu (desktop) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/tarifs"
            className="text-sm font-semibold text-white/90 hover:text-primary transition-colors py-2"
          >
            Tarifs
          </Link>
          <Link
            href="/fonctionnalites"
            className="text-sm font-semibold text-white/90 hover:text-primary transition-colors py-2"
          >
            Fonctionnalités
          </Link>
          <Link
            href="/accompagnement"
            className="text-sm font-semibold text-white/90 hover:text-primary transition-colors py-2"
          >
            Accompagnement
          </Link>
        </div>

        {/* Les deux boutons à l'extrême droite */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          <Link
            href="/login"
            className="text-[15px] font-semibold text-white underline underline-offset-4 hover:text-primary transition-colors min-h-[44px] inline-flex items-center"
          >
            Se connecter
          </Link>

          <Link
            href="/demo"
            className="hidden sm:inline-flex h-11 min-h-[44px] px-5 bg-primary border-2 border-primary text-ink font-semibold text-[15px] rounded-lg hover:bg-primary-hover active:scale-[0.99] transition-all items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Demander une démo
          </Link>

          {/* Bouton menu mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Ouvrir le menu de navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu déroulant responsive mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ink border-t border-white/10 px-6 py-5 flex flex-col gap-4 animate-fade-in">
          <Link
            href="/tarifs"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-white/90 hover:text-primary py-2 border-b border-white/10"
          >
            Tarifs
          </Link>
          <Link
            href="/fonctionnalites"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-white/90 hover:text-primary py-2 border-b border-white/10"
          >
            Fonctionnalités
          </Link>
          <Link
            href="/accompagnement"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-white/90 hover:text-primary py-2 border-b border-white/10"
          >
            Accompagnement
          </Link>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-11 min-h-[44px] bg-primary border-2 border-primary text-ink font-semibold text-sm rounded-lg flex items-center justify-center whitespace-nowrap"
            >
              Demander une démo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
