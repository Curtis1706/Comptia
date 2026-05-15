"use client";

import React, { useState } from "react";
import {
  FileText, RefreshCcw, Receipt, BarChart3, Users, Calculator,
  CheckCircle, Clock, AlertCircle, ArrowRight, ChevronRight
} from "lucide-react";

// ── Module Tab data ────────────────────────────────────────────────────────────
const modules = [
  {
    id: "facturation",
    icon: FileText,
    label: "Facturation",
    color: "blue",
    headline: "De la commande au paiement, sans friction",
    description:
      "Créez devis, factures et avoirs en quelques secondes. Les calculs HT/TVA/TTC sont automatiques. Générez un PDF professionnel avec votre logo et vos mentions légales prêt à envoyer directement à votre client.",
    highlights: [
      "Génération PDF automatique",
      "Suivi des statuts (Brouillon → Payé)",
      "Relances automatiques pour impayés",
      "Calcul TVA multi-taux",
    ],
    preview: <FacturationPreview />,
  },
  {
    id: "rapprochement",
    icon: RefreshCcw,
    label: "Rapprochement",
    color: "purple",
    headline: "Liez vos relevés bancaires à vos justificatifs en 1 clic",
    description:
      "Importez votre relevé bancaire. Notre algorithme de matching identifie automatiquement les transactions correspondantes dans vos écritures comptables. Validez ou ajustez en quelques secondes.",
    highlights: [
      "Import OFX / CSV bancaire",
      "Algorithme de matching intelligent",
      "Détection des doublons",
      "Validation en masse",
    ],
    preview: <RapprochementPreview />,
  },
  {
    id: "comptabilite",
    icon: Calculator,
    label: "Comptabilité",
    color: "green",
    headline: "La rigueur de la partie double, la simplicité du moderne",
    description:
      "Saisissez vos opérations comptables avec le journal en partie double (Débit/Crédit). Le système bloque toute écriture déséquilibrée pour garantir l'intégrité de votre grand livre — aucune erreur possible.",
    highlights: [
      "Journaux multi-types (Achats, Ventes, Banque)",
      "Validation automatique Débit = Crédit",
      "Plan de comptes PCG 2025",
      "Export FEC conforme DGFiP",
    ],
    preview: <ComptabilitePreview />,
  },
  {
    id: "tva",
    icon: Receipt,
    label: "TVA",
    color: "orange",
    headline: "Votre TVA calculée et déclarée sans stress",
    description:
      "Comptia calcule automatiquement votre TVA collectée et déductible à partir de vos écritures. Générez votre CA3/CA12 prêt à déposer sur impots.gouv.fr en quelques clics.",
    highlights: [
      "Calcul automatique TVA collectée / déductible",
      "Support TVA sur débits et encaissements",
      "Génération CA3 / CA12",
      "Historique des déclarations",
    ],
    preview: <TVAPreview />,
  },
  {
    id: "reporting",
    icon: BarChart3,
    label: "Reporting",
    color: "pink",
    headline: "Des tableaux de bord qui racontent votre business",
    description:
      "Visualisez vos performances en temps réel avec des graphiques interactifs. Filtrez par période, par journal ou par tiers. Comparez avec le mois précédent et anticipez vos besoins de trésorerie.",
    highlights: [
      "KPIs en temps réel (CA, charges, résultat)",
      "Graphiques interactifs Recharts",
      "Comparaison M-1 et N-1",
      "Export PDF / Excel",
    ],
    preview: <ReportingPreview />,
  },
];

// ── Sub-Previews ───────────────────────────────────────────────────────────────
function FacturationPreview() {
  const invoices = [
    { id: "INV-2412", client: "Acme Corp.", amount: "12 400 €", status: "Payé", color: "text-green-400" },
    { id: "INV-2411", client: "SynthAI SAS", amount: "8 900 €", status: "En retard", color: "text-red-400" },
    { id: "INV-2410", client: "Nova Studio", amount: "3 200 €", status: "Envoyé", color: "text-blue-400" },
    { id: "INV-2409", client: "LogiPack", amount: "6 750 €", status: "Payé", color: "text-green-400" },
  ];
  return (
    <div className="space-y-2 text-xs">
      <div className="grid grid-cols-4 text-[9px] text-white/20 uppercase tracking-widest px-2 mb-1">
        <span>N°</span><span>Client</span><span className="text-right">Montant</span><span className="text-right">Statut</span>
      </div>
      {invoices.map((inv, i) => (
        <div key={i} className="grid grid-cols-4 items-center bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2.5 transition-colors group cursor-pointer">
          <span className="text-blue-400 font-mono text-[10px]">{inv.id}</span>
          <span className="text-white/60 text-[10px]">{inv.client}</span>
          <span className="text-right text-white font-semibold text-[10px]">{inv.amount}</span>
          <span className={`text-right text-[10px] font-medium ${inv.color}`}>{inv.status}</span>
        </div>
      ))}
      <div className="mt-4 flex gap-2">
        <div className="flex-1 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
          <div className="text-[9px] text-white/30">À encaisser</div>
          <div className="text-blue-400 font-bold text-sm">31 300 €</div>
        </div>
        <div className="flex-1 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
          <div className="text-[9px] text-white/30">En retard</div>
          <div className="text-red-400 font-bold text-sm">8 900 €</div>
        </div>
      </div>
    </div>
  );
}

function RapprochementPreview() {
  const transactions = [
    { date: "12/12", libelle: "VIR Acme Corp.", amount: "+12 400 €", matched: true },
    { date: "10/12", libelle: "CB Frais déplacement", amount: "-240 €", matched: true },
    { date: "08/12", libelle: "PRLV SFR Pro", amount: "-89 €", matched: false },
    { date: "05/12", libelle: "VIR Nova Studio", amount: "+3 200 €", matched: true },
  ];
  return (
    <div className="space-y-2 text-xs">
      <div className="text-[9px] text-white/20 uppercase tracking-widest mb-2">Relevé Banque — Décembre 2026</div>
      {transactions.map((t, i) => (
        <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2.5 border transition-colors ${t.matched ? "bg-green-500/5 border-green-500/20" : "bg-amber-500/5 border-amber-500/20 animate-pulse"}`}>
          <div className="flex items-center gap-3">
            {t.matched ? <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            <div>
              <div className="text-white/70 text-[10px]">{t.libelle}</div>
              <div className="text-white/20 text-[9px]">{t.date}/2026</div>
            </div>
          </div>
          <div className={`font-bold text-[10px] ${t.amount.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{t.amount}</div>
        </div>
      ))}
      <div className="mt-3 bg-white/5 rounded-lg p-3 flex justify-between text-[10px]">
        <span className="text-white/30">Taux de rapprochement</span>
        <span className="text-green-400 font-bold">75% — 3/4 transactions</span>
      </div>
    </div>
  );
}

function ComptabilitePreview() {
  const entries = [
    { journal: "VTE", compte: "411 — Client", debit: "12 400 €", credit: "" },
    { journal: "VTE", compte: "706 — Prestations", debit: "", credit: "10 333 €" },
    { journal: "VTE", compte: "4457 — TVA collectée", debit: "", credit: "2 067 €" },
  ];
  return (
    <div className="space-y-2 text-xs">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[9px] text-white/20 uppercase tracking-widest">Écriture #JRN-2412-048</div>
        <div className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[9px] border border-green-500/20">Équilibrée ✓</div>
      </div>
      <div className="grid grid-cols-4 text-[9px] text-white/20 uppercase tracking-widest px-2 mb-1">
        <span>Journal</span><span className="col-span-2">Compte</span><span className="text-right">Débit</span>
      </div>
      {entries.map((e, i) => (
        <div key={i} className="grid grid-cols-4 items-center bg-white/5 rounded-lg px-3 py-2.5">
          <span className="text-purple-400 font-mono text-[10px]">{e.journal}</span>
          <span className="col-span-2 text-white/60 text-[10px]">{e.compte}</span>
          <span className={`text-right font-bold text-[10px] ${e.debit ? "text-blue-400" : "text-green-400"}`}>
            {e.debit || e.credit}
          </span>
        </div>
      ))}
      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
        <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/20 flex justify-between">
          <span className="text-white/30">Total Débit</span>
          <span className="text-blue-400 font-bold">12 400 €</span>
        </div>
        <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/20 flex justify-between">
          <span className="text-white/30">Total Crédit</span>
          <span className="text-green-400 font-bold">12 400 €</span>
        </div>
      </div>
    </div>
  );
}

function TVAPreview() {
  return (
    <div className="space-y-3 text-xs">
      <div className="text-[9px] text-white/20 uppercase tracking-widest">Déclaration CA3 — T4 2026</div>
      {[
        { label: "TVA collectée (20%)", amount: "18 240 €", color: "text-red-400" },
        { label: "TVA déductible achats", amount: "−6 830 €", color: "text-green-400" },
        { label: "TVA déductible immos", amount: "−1 200 €", color: "text-green-400" },
      ].map((item, i) => (
        <div key={i} className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3 border border-white/5">
          <span className="text-white/50">{item.label}</span>
          <span className={`font-bold ${item.color}`}>{item.amount}</span>
        </div>
      ))}
      <div className="flex justify-between items-center bg-orange-500/10 rounded-xl px-4 py-3 border border-orange-500/20">
        <span className="text-white font-semibold">TVA nette à payer</span>
        <span className="font-black text-orange-400 text-sm">10 210 €</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 bg-white/5 rounded-lg p-2 border border-white/5 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <div>
            <div className="text-[9px] text-white/20">Échéance</div>
            <div className="text-[10px] text-amber-400 font-bold">31 Jan 2027</div>
          </div>
        </div>
        <button className="flex-1 bg-orange-500/20 rounded-lg p-2 border border-orange-500/30 text-orange-400 text-[10px] font-semibold hover:bg-orange-500/30 transition-colors">
          Exporter CA3
        </button>
      </div>
    </div>
  );
}

function ReportingPreview() {
  const bars = [45, 60, 52, 78, 65, 82, 70, 90, 75, 88, 80, 95];
  return (
    <div className="space-y-3 text-xs">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "CA Annuel", value: "612 400 €", delta: "+14.2%", up: true },
          { label: "Résultat", value: "218 900 €", delta: "+22.1%", up: true },
          { label: "Marge", value: "35.7%", delta: "+4.2pts", up: true },
        ].map((k, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
            <div className="text-[9px] text-white/20 mb-1">{k.label}</div>
            <div className="text-white font-bold text-xs">{k.value}</div>
            <div className="text-green-400 text-[9px] mt-0.5">{k.delta}</div>
          </div>
        ))}
      </div>
      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
        <div className="text-[9px] text-white/20 mb-2">CA mensuel 2026</div>
        <div className="flex items-end gap-1 h-16">
          {bars.map((h, i) => (
            <div key={i} className={`flex-1 rounded-t-sm transition-all ${i === 11 ? "bg-pink-500" : "bg-white/15"}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export const DynamicShowcase = () => {
  const [activeModule, setActiveModule] = useState(0);
  const active = modules[activeModule];
  const colorMap: Record<string, string> = {
    blue: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    purple: "border-purple-500/40 bg-purple-500/10 text-purple-400",
    green: "border-green-500/40 bg-green-500/10 text-green-400",
    orange: "border-orange-500/40 bg-orange-500/10 text-orange-400",
    pink: "border-pink-500/40 bg-pink-500/10 text-pink-400",
  };
  const activeColorClass = colorMap[active.color] ?? colorMap["blue"];

  return (
    <section id="modules" className="py-28 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020817] via-[#04091a] to-[#020817] -z-10" />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Chaque module, pensé pour vous
          </h2>
          <p className="text-white/40 text-lg">
            Explorez les fonctionnalités clés qui remplacent 5 outils différents par une seule plateforme unifiée.
          </p>
        </div>

        {/* Tab nav */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {modules.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                i === activeModule
                  ? `${colorMap[m.color]} shadow-lg`
                  : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
              }`}
            >
              <m.icon className="w-4 h-4" />
              {m.label}
            </button>
          ))}
        </div>

        {/* Module panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Info */}
          <div className="space-y-6">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium ${activeColorClass}`}>
              <active.icon className="w-3.5 h-3.5" />
              Module — {active.label}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug">{active.headline}</h3>
            <p className="text-white/50 leading-relaxed">{active.description}</p>

            <ul className="space-y-3">
              {active.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${activeColorClass.split(" ").find(c => c.startsWith("text-"))}`} />
                  <span className="text-white/70 text-sm">{h}</span>
                </li>
              ))}
            </ul>

            <button className={`flex items-center gap-2 text-sm font-semibold ${activeColorClass.split(" ").find(c => c.startsWith("text-"))} hover:gap-3 transition-all`}>
              Explorer le module <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Live preview */}
          <div className="group relative">
            <div className={`absolute -inset-1 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-35 transition-opacity`} style={{ background: `var(--tw-gradient-stops)` }} />
            <div className="relative glass-dark rounded-[1.75rem] border border-white/10 overflow-hidden shadow-2xl">
              {/* Window chrome */}
              <div className="h-9 bg-white/[0.03] border-b border-white/5 flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/40" />
                <div className="ml-3 text-[10px] text-white/20">Comptia — {active.label}</div>
              </div>
              <div className="p-5">{active.preview}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
