"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { DynamicShowcase } from "@/components/landing/DynamicShowcase";
import { Features } from "@/components/landing/Features";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, Quote } from "lucide-react";

// ── Social Proof / Stats ───────────────────────────────────────────────────────
const StatsSection = () => (
  <section className="py-16 bg-[#020817] border-y border-white/5">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: "500+", label: "Entreprises actives" },
          { value: "98.7%", label: "Satisfaction client" },
          { value: "< 2s", label: "Temps de réponse moyen" },
          { value: "99.9%", label: "Disponibilité SLA" },
        ].map((s, i) => (
          <div key={i}>
            <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.value}</div>
            <div className="text-white/30 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Testimonials ───────────────────────────────────────────────────────────────
const Testimonials = () => {
  const testimonials = [
    {
      quote: "Comptia m'a fait gagner 8h par mois sur ma comptabilité. Le rapprochement bancaire automatique est bluffant.",
      name: "Marie L.",
      role: "Directrice Générale, StartupX",
      stars: 5,
    },
    {
      quote: "Fini les tableurs Excel en fin de mois. Mes factures, ma TVA et mon reporting au même endroit, c'est révolutionnaire.",
      name: "Thomas K.",
      role: "Freelance Consultant",
      stars: 5,
    },
    {
      quote: "Notre cabinet gère 12 entreprises clientes sur Comptia. L'interface multi-entités est exactement ce qu'il nous fallait.",
      name: "Cabinet Finova",
      role: "Expertise Comptable",
      stars: 5,
    },
  ];

  return (
    <section className="py-28 bg-[#020817]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ils ont fait confiance à Comptia
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-dark rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-colors space-y-4">
              <Quote className="w-6 h-6 text-blue-500/50" />
              <p className="text-white/70 text-sm leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/30 text-xs">{t.role}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── CTA Section ────────────────────────────────────────────────────────────────
const CTASection = () => (
  <section id="pricing" className="py-20 px-6">
    <div className="max-w-4xl mx-auto relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-[3rem] blur-3xl" />
      <div className="relative glass-dark rounded-[2.5rem] p-12 md:p-16 text-center space-y-6 border border-white/10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
          Prêt à moderniser votre gestion financière ?
        </h2>
        <p className="text-white/50 max-w-xl mx-auto">
          Rejoignez plus de 500 entreprises qui gèrent leur comptabilité, facturation et TVA depuis Comptia.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white h-13 px-10 rounded-full font-bold shadow-2xl shadow-blue-500/30 group">
              Démarrer gratuitement
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="glass border-white/10 text-white hover:bg-white/5 h-13 px-10 rounded-full font-bold">
              Parler à un expert
            </Button>
          </Link>
        </div>
        <p className="text-white/20 text-xs pt-2">
          Données hébergées en France · Conforme RGPD · Support en français inclus
        </p>
      </div>
    </div>
  </section>
);

// ── Footer ─────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-[#020817] border-t border-white/5 pt-20 pb-10">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Comptia Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-extrabold text-white">Comptia</span>
          </div>
          <p className="text-white/30 text-sm max-w-xs leading-relaxed">
            La plateforme comptable et financière premium pour les entreprises modernes.
          </p>
          <div className="text-xs text-white/20">© 2026 Comptia Inc.</div>
        </div>

        {[
          {
            title: "Produit",
            links: ["Facturation", "Comptabilité", "Rapprochement", "TVA", "Reporting", "Paie"],
          },
          {
            title: "Ressources",
            links: ["Documentation", "API Reference", "Changelog", "Roadmap"],
          },
          {
            title: "Entreprise",
            links: ["À propos", "Blog", "Partenaires", "Contact", "Carrières"],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-white text-sm font-bold mb-5">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-white/30 text-sm hover:text-white/70 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
        <div className="flex gap-6 text-xs text-white/20">
          <a href="#" className="hover:text-white/50 transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-white/50 transition-colors">CGU</a>
          <a href="#" className="hover:text-white/50 transition-colors">Cookies</a>
          <a href="#" className="hover:text-white/50 transition-colors">Mentions légales</a>
        </div>
        <div className="flex items-center gap-1 text-xs text-white/15">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Tous les systèmes opérationnels
        </div>
      </div>
    </div>
  </footer>
);

// ── Main Landing View ──────────────────────────────────────────────────────────
export const LandingView = () => {
  return (
    <div className="min-h-screen bg-[#020817] selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <DynamicShowcase />
        <Features />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingView;
