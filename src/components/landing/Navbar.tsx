"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#modules", label: "Démo" },
  { href: "#modules", label: "Modules" },
  { href: "#pricing", label: "Tarifs" },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-4 mt-4">
        <div className="glass-dark rounded-2xl flex items-center justify-between px-6 py-3 border border-white/10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10 overflow-hidden">
              <img src="/logo.png" alt="Comptia Logo" className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Comptia
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 text-sm h-9">
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white text-sm h-9 px-5 shadow-lg shadow-blue-500/20">
                Essai gratuit
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 glass-dark rounded-2xl border border-white/10 px-6 py-4 space-y-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block text-white/60 hover:text-white text-sm py-2 border-b border-white/5"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="space-y-2 pt-2">
              <Link href="/login" className="block w-full">
                <Button variant="outline" className="w-full glass border-white/10 text-white text-sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/register" className="block w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm">
                  Essai gratuit — 14 jours
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
