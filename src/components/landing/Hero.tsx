"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Sparkles } from "lucide-react";

const TypewriterText = ({ texts }: { texts: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const currentText = texts[currentIndex];
    const speed = isDeleting ? 40 : 80;

    timeoutRef.current = setTimeout(() => {
      if (!isDeleting && displayed.length < currentText.length) {
        setDisplayed(currentText.slice(0, displayed.length + 1));
      } else if (isDeleting && displayed.length > 0) {
        setDisplayed(displayed.slice(0, -1));
      } else if (!isDeleting && displayed.length === currentText.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayed.length === 0) {
        setIsDeleting(false);
        setCurrentIndex((i) => (i + 1) % texts.length);
      }
    }, speed);

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, isDeleting, currentIndex, texts]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
      {displayed}
      <span className="animate-pulse text-blue-400">|</span>
    </span>
  );
};

// ── Mini Dashboard Preview ──────────────────────────────────────────────
const DashboardPreview = () => {
  const kpis = [
    { label: "Chiffre d'Affaires", value: "48 320 €", delta: "+8.2%", up: true },
    { label: "Charges", value: "21 780 €", delta: "-3.1%", up: false },
    { label: "Résultat Net", value: "26 540 €", delta: "+14.4%", up: true },
    { label: "Trésorerie", value: "83 210 €", delta: "+5.7%", up: true },
  ];

  const bars = [35, 55, 42, 68, 52, 74, 60, 85, 70, 90, 78, 95];
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

  return (
    <div className="w-full space-y-4 text-xs">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-blue-500/30 transition-colors">
            <div className="text-white/40 mb-1 text-[10px]">{k.label}</div>
            <div className="text-white font-bold text-sm">{k.value}</div>
            <div className={`flex items-center gap-1 mt-1 ${k.up ? "text-green-400" : "text-red-400"}`}>
              {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-[10px]">{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
        <div className="text-white/40 text-[10px] mb-3">Évolution du CA mensuel — 2026</div>
        <div className="flex items-end gap-1 h-20">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-sm transition-all duration-500 ${i === 11 ? "bg-blue-500" : "bg-white/15"}`}
                style={{ height: `${h}%` }}
              />
              <span className="text-[8px] text-white/20">{months[i].slice(0, 1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
        <div className="text-white/40 text-[10px] mb-2">Dernières écritures</div>
        <div className="space-y-2">
          {[
            { lib: "Facture #INV-2024", amt: "+12 400 €", status: "Payé", ok: true },
            { lib: "Loyer Mai 2026", amt: "-2 800 €", status: "En cours", ok: false },
            { lib: "Remb. TVA Q1", amt: "+4 200 €", status: "Validé", ok: true },
          ].map((t, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {t.ok ? <CheckCircle className="w-3 h-3 text-green-400" /> : <AlertTriangle className="w-3 h-3 text-amber-400" />}
                <span className="text-white/60 text-[10px]">{t.lib}</span>
              </div>
              <div className="text-right">
                <div className={`text-[10px] font-bold ${t.ok && t.amt.startsWith("+") ? "text-green-400" : t.amt.startsWith("-") ? "text-red-400" : "text-white"}`}>{t.amt}</div>
                <div className="text-[9px] text-white/20">{t.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Hero ─────────────────────────────────────────────────────────────────
export const Hero = () => {
  const typewriterTexts = [
    "vos factures en secondes.",
    "votre TVA automatiquement.",
    "vos rapprochements bancaires.",
    "votre comptabilité en partie double.",
  ];

  return (
    <section className="relative pt-32 pb-24 overflow-hidden min-h-screen flex flex-col items-center justify-center px-4">
      {/* Ambient blobs */}
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] -z-10" />

      {/* Headline */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white text-center leading-tight max-w-5xl mb-6">
        Gérez{" "}
        <TypewriterText texts={typewriterTexts} />
      </h1>

      <p className="text-lg text-white/50 text-center max-w-2xl leading-relaxed mb-10">
        Comptia est le logiciel de gestion financière tout-en-un conçu pour les PME, startups et indépendants. Facturation, comptabilité, rapprochement, paie, TVA — tout en un seul endroit.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
        <Link href="/register">
          <Button size="lg" className="h-13 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-500/30 group">
            Démarrer gratuitement — 14 jours
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Button size="lg" variant="outline" className="h-13 px-8 text-base font-semibold glass border-white/10 text-white hover:bg-white/5 gap-2">
          <PlayCircle className="w-5 h-5 text-blue-400" />
          Voir la démo interactive
        </Button>
      </div>

      {/* Dashboard Mockup */}
      <div className="w-full max-w-5xl mx-auto">
        <div className="group relative">
          {/* Glow ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 via-purple-600/30 to-blue-600/50 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

          <div className="relative glass-dark rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
            {/* Window chrome */}
            <div className="h-10 bg-white/[0.03] border-b border-white/5 flex items-center px-5 gap-2 flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
              <div className="w-3 h-3 rounded-full bg-green-400/50" />
              <div className="ml-4 flex items-center gap-1 bg-white/5 px-4 py-1 rounded-md text-[10px] text-white/20 flex-1 max-w-xs">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                app.comptia.ai — Tableau de bord
              </div>
            </div>

            {/* Sidebar + main content layout */}
            <div className="flex min-h-[420px]">
              {/* Sidebar */}
              <div className="hidden sm:flex flex-col w-48 border-r border-white/5 bg-white/[0.015] p-4 gap-1 flex-shrink-0">
                <div className="text-[9px] text-white/20 uppercase tracking-widest mb-2 px-2">Navigation</div>
                {["Tableau de bord", "Facturation", "Comptabilité", "Rapprochement", "TVA", "Paie", "Reporting", "Paramètres"].map((item, i) => (
                  <div
                    key={i}
                    className={`text-[10px] px-3 py-2 rounded-lg cursor-pointer transition-colors ${i === 0 ? "bg-blue-600/20 text-blue-300 font-medium" : "text-white/30 hover:text-white/50"}`}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-5 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-white text-sm font-semibold">Tableau de bord</div>
                    <div className="text-white/30 text-[10px]">Période : Décembre 2026</div>
                  </div>
                  <div className="text-[10px] bg-white/5 border border-white/5 px-3 py-1 rounded-lg text-white/30 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                    Synchronisé en temps réel
                  </div>
                </div>
                <DashboardPreview />
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-[11px] text-white/30">
          <span>✓ Aucune carte bancaire requise</span>
          <span>✓ Données hébergées en France (RGPD)</span>
          <span>✓ Support en français inclus</span>
          <span>✓ Import comptable (FEC) inclus</span>
        </div>
      </div>
    </section>
  );
};
