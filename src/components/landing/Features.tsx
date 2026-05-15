"use client";

import React from "react";
import {
  FileText, RefreshCcw, Calculator, Receipt, BarChart3,
  Users, Search, Bell, Shield, Download, Zap, Layers
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Facturation Pro",
    description: "Créez devis, factures et avoirs avec génération PDF automatique, calcul TVA multi-taux et suivi des paiements en temps réel.",
    tag: "Core",
    color: "blue",
  },
  {
    icon: RefreshCcw,
    title: "Rapprochement Bancaire",
    description: "Importez vos relevés OFX/CSV et laissez notre algorithme matcher automatiquement vos transactions à vos justificatifs comptables.",
    tag: "Automatisé",
    color: "purple",
  },
  {
    icon: Calculator,
    title: "Comptabilité Générale",
    description: "Journal en partie double avec validation automatique Débit = Crédit. Plan de comptes PCG 2025. Export FEC conforme DGFiP.",
    tag: "Conforme",
    color: "green",
  },
  {
    icon: Receipt,
    title: "Gestion TVA",
    description: "Calcul automatique TVA collectée et déductible. Génération de la déclaration CA3/CA12 prête à soumettre aux impôts.",
    tag: "Automatique",
    color: "orange",
  },
  {
    icon: BarChart3,
    title: "Reporting & Analyses",
    description: "Tableaux de bord interactifs avec vos KPIs (CA, charges, résultat, trésorerie) comparés au mois précédent, mis à jour en temps réel.",
    tag: "Temps réel",
    color: "pink",
  },
  {
    icon: Users,
    title: "Tiers & Clients",
    description: "Gérez vos clients, fournisseurs et partenaires. Historique complet des transactions, soldes et lettrage par tiers.",
    tag: "CRM lite",
    color: "cyan",
  },
  {
    icon: Search,
    title: "Command Palette (⌘K)",
    description: "Accédez à n'importe quelle action ou page en tapant quelques lettres. Pour les power users qui veulent aller 10× plus vite.",
    tag: "Productivité",
    color: "violet",
  },
  {
    icon: Bell,
    title: "Alertes Intelligentes",
    description: "Notifications proactives : factures en retard, rapprochements manquants, échéances TVA, anomalies de trésorerie.",
    tag: "Proactif",
    color: "amber",
  },
  {
    icon: Shield,
    title: "Sécurité & RGPD",
    description: "Données hébergées en France. Chiffrement AES-256. Authentification sécurisée. Gestion des rôles par utilisateur (Admin, Comptable, Lecture seule).",
    tag: "Sécurisé",
    color: "teal",
  },
  {
    icon: Download,
    title: "Export & Intégrations",
    description: "Exportez vos données en FEC, PDF ou Excel à tout moment. Compatible avec les principaux cabinets comptables.",
    tag: "Interopérable",
    color: "indigo",
  },
  {
    icon: Zap,
    title: "Paie & Charges Sociales",
    description: "Module de paie intégré : bulletins de salaire, calcul des charges patronales et salariales, déclarations DSN.",
    tag: "Bientôt",
    color: "yellow",
    soon: true,
  },
  {
    icon: Layers,
    title: "Multi-Entreprises",
    description: "Gérez plusieurs entités depuis un seul compte. Idéal pour les cabinets comptables et les groupes de sociétés.",
    tag: "Entreprise",
    color: "rose",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  green:  { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/20" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  pink:   { bg: "bg-pink-500/10",   text: "text-pink-400",   border: "border-pink-500/20" },
  cyan:   { bg: "bg-cyan-500/10",   text: "text-cyan-400",   border: "border-cyan-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  amber:  { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/20" },
  teal:   { bg: "bg-teal-500/10",   text: "text-teal-400",   border: "border-teal-500/20" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  rose:   { bg: "bg-rose-500/10",   text: "text-rose-400",   border: "border-rose-500/20" },
};

export const Features = () => {
  return (
    <section id="features" className="py-28 bg-[#020817]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Une plateforme, tout votre business
          </h2>
          <p className="text-white/40 text-lg">
            Remplacez Excel, votre logiciel comptable, votre outil de facturation et votre tableau de bord financier — par une seule solution intégrée.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const c = colorMap[f.color] ?? colorMap["blue"];
            return (
              <div
                key={i}
                className={`relative group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden ${f.soon ? "opacity-60" : ""}`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-5 h-5 ${c.text}`} />
                </div>

                {/* Title + tag */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-bold text-sm leading-snug">{f.title}</h3>
                  <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                    {f.tag}
                  </span>
                </div>

                <p className="text-white/40 text-xs leading-relaxed">{f.description}</p>

                {/* Corner glow */}
                <div className={`absolute -bottom-8 -right-8 w-28 h-28 ${c.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/30 text-sm mb-4">Et bien plus encore — mises à jour régulières, sans frais supplémentaires.</p>
          <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
            Voir la roadmap complète →
          </button>
        </div>
      </div>
    </section>
  );
};
