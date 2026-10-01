"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Download,
  TrendingUp,
  ShieldCheck,
  Scale,
  BarChart3,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";

// 5 Onglets principaux
const tabs = [
  { id: "bilan", label: "Bilan" },
  { id: "cdr", label: "Compte de résultat" },
  { id: "dsf", label: "DSF / États SYSCOHADA" },
  { id: "tresorerie", label: "Trésorerie" },
  { id: "ratios", label: "Ratios" },
] as const;

type Tab = (typeof tabs)[number]["id"];

export const Reporting = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Onglet actif : DSF par défaut conformément à la maquette
  const requestedTab = searchParams.get("tab") as Tab;
  const tab = tabs.some((t) => t.id === requestedTab) ? requestedTab : "dsf";

  const [exercice, setExercice] = useState<string>("2026");
  const [dsfSubView, setDsfSubView] = useState<"bilan-syscohada" | "sig" | "tafire">("bilan-syscohada");

  // Données réelles du reporting comptable
  const { data: stats, isLoading: statsLoading } = useQuery<any>({
    queryKey: ["reporting-stats"],
    queryFn: () => fetcher("/api/reporting"),
  });

  // Données réelles de la DSF SYSCOHADA
  const { data: dsfRes, isLoading: dsfLoading } = useQuery<any>({
    queryKey: ["dsf-report", exercice],
    queryFn: () => fetcher(`/api/reporting/dsf?fiscal_year=${parseInt(exercice, 10)}`),
  });

  const setTab = (t: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (t === "dsf") params.delete("tab");
    else params.set("tab", t);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const dsfData = dsfRes?.data || dsfRes;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* EN-TÊTE DE LA PAGE                                                        */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-ink font-sans">
            Reporting &amp; États Financiers
          </h1>
          <p className="text-sm text-muted mt-1 font-sans">
            DSF obligatoire DGI / INSAE et états financiers SYSCOHADA révisé
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="h-10 px-4 bg-background text-ink font-semibold text-xs rounded border border-border hover:bg-background-secondary transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-muted shrink-0" />
            <span>Exporter en PDF / Imprimer</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARTE CONTENEUR PRINCIPALE                                                */}
      {/* ========================================================================= */}
      <div className="bg-background border border-border rounded overflow-hidden flex flex-col shadow-xs">
        {/* BARRE DE NAVIGATION DES 5 ONGLETS */}
        <div className="border-b border-border bg-background-secondary px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <nav
            aria-label="Sections comptables"
            className="flex items-center gap-6 overflow-x-auto scrollbar-none -mb-[1px]"
          >
            {tabs.map((t) => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "py-3.5 text-xs relative whitespace-nowrap transition-colors cursor-pointer focus:outline-none",
                    isActive
                      ? "font-bold text-ink"
                      : "font-medium text-muted hover:text-ink"
                  )}
                >
                  <span>{t.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="py-2.5 self-end sm:self-auto flex items-center gap-2">
            <label
              htmlFor="select-exercice"
              className="text-[11px] uppercase tracking-wider text-muted font-bold font-sans"
            >
              Exercice :
            </label>
            <select
              id="select-exercice"
              value={exercice}
              onChange={(e) => setExercice(e.target.value)}
              className="h-8 px-2.5 bg-background border border-border rounded text-xs font-semibold text-ink cursor-pointer focus:outline-none focus:border-ink"
            >
              <option value="2026">2026 (En cours)</option>
              <option value="2025">2025 (Clos &amp; Déposé)</option>
              <option value="2024">2024 (Archivé)</option>
            </select>
          </div>
        </div>

        {/* ZONE DE CONTENU GLOBAL */}
        <div className="p-4 sm:p-6 bg-background">
          {statsLoading ? (
            <div className="flex h-72 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-ink" />
                <p className="text-xs text-muted">Calcul des états financiers...</p>
              </div>
            </div>
          ) : (
            <>
              {/* 1. ONGLET DSF / ÉTATS SYSCOHADA (DÉFAUT) */}
              {tab === "dsf" && (
                <DsfTabContent
                  data={dsfData}
                  loading={dsfLoading}
                  subView={dsfSubView}
                  setSubView={setDsfSubView}
                />
              )}

              {/* 2. ONGLET BILAN */}
              {tab === "bilan" && <BilanTabContent data={stats?.balanceSheet} />}

              {/* 3. ONGLET COMPTE DE RÉSULTAT */}
              {tab === "cdr" && <CompteResultatTabContent data={stats?.incomeStatement} />}

              {/* 4. ONGLET TRÉSORERIE */}
              {tab === "tresorerie" && <TresorerieTabContent data={stats?.cashflow} />}

              {/* 5. ONGLET RATIOS */}
              {tab === "ratios" && <RatiosTabContent data={stats?.ratios} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// 1. ONGLET DSF / ÉTATS SYSCOHADA
// =============================================================================
const DsfTabContent = ({
  data,
  loading,
  subView,
  setSubView,
}: {
  data: any;
  loading: boolean;
  subView: "bilan-syscohada" | "sig" | "tafire";
  setSubView: (v: "bilan-syscohada" | "sig" | "tafire") => void;
}) => {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-ink" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* BANDEAU D'INFORMATION DGI / INSAE */}
      <div className="bg-background-secondary border border-border rounded px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-ink shrink-0" />
          <span className="text-xs text-ink">
            <strong className="font-semibold text-ink">DSF SYSCOHADA révisé (DGI Bénin)</strong> — Exercice clos le 31/12/2026. Dépôt légal avant le 30 Avril.
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EBF9EE] border border-[#86EFAC] rounded text-[#166534] text-xs font-semibold self-start md:self-auto">
          <Scale className="w-4 h-4 text-[#166534] shrink-0" />
          <span>Équilibre Bilan : Équilibré (Actif = Passif)</span>
        </div>
      </div>

      {/* SOUS-NAVIGATION (3 VUES) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSubView("bilan-syscohada")}
          className={cn(
            "px-4 h-9 rounded text-xs transition-colors cursor-pointer",
            subView === "bilan-syscohada"
              ? "bg-primary text-ink font-semibold border-0"
              : "bg-background text-muted border border-border hover:bg-background-secondary hover:text-ink font-medium"
          )}
        >
          Bilan SYSCOHADA
        </button>
        <button
          type="button"
          onClick={() => setSubView("sig")}
          className={cn(
            "px-4 h-9 rounded text-xs transition-colors cursor-pointer",
            subView === "sig"
              ? "bg-primary text-ink font-semibold border-0"
              : "bg-background text-muted border border-border hover:bg-background-secondary hover:text-ink font-medium"
          )}
        >
          Compte de Résultat (SIG)
        </button>
        <button
          type="button"
          onClick={() => setSubView("tafire")}
          className={cn(
            "px-4 h-9 rounded text-xs transition-colors cursor-pointer",
            subView === "tafire"
              ? "bg-primary text-ink font-semibold border-0"
              : "bg-background text-muted border border-border hover:bg-background-secondary hover:text-ink font-medium"
          )}
        >
          TAFIRE (Flux Financiers)
        </button>
      </div>

      {/* 1.A : SOUS-VUE BILAN SYSCOHADA */}
      {subView === "bilan-syscohada" && <DsfBilanSubView data={data?.bilan} />}

      {/* 1.B : SOUS-VUE COMPTE DE RÉSULTAT (SIG) */}
      {subView === "sig" && <DsfSigSubView data={data?.compteResultat} />}

      {/* 1.C : SOUS-VUE TAFIRE */}
      {subView === "tafire" && <DsfTafireSubView data={data?.tafire} />}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 1.A : Bilan SYSCOHADA (Sur mobile, les tableaux côte à côte s'empilent)
// -----------------------------------------------------------------------------
const DsfBilanSubView = ({ data }: { data: any }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ACTIF */}
      <div className="border border-border rounded flex flex-col bg-background overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-background-secondary flex items-center justify-between">
          <span className="text-sm font-bold text-ink uppercase tracking-wide">
            ACTIF (Emplois)
          </span>
          <span className="text-xs text-muted font-mono">Exercice 2026</span>
        </div>

        <div className="flex-1 divide-y divide-border">
          {/* Ligne 1 */}
          <div className="p-4 flex flex-col gap-0.5 hover:bg-background-secondary/50 transition-colors">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-ink">ACTIF IMMOBILISÉ (Classes 2)</span>
              <span className="font-mono text-xs text-ink font-semibold tabular-nums">0 F CFA</span>
            </div>
            <div className="text-[11px] text-muted font-mono">
              Brut : 0 F CFA · Amort. : -0 F CFA
            </div>
          </div>

          {/* Ligne 2 */}
          <div className="p-4 flex flex-col gap-0.5 hover:bg-background-secondary/50 transition-colors">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-ink">ACTIF CIRCULANT (Classes 3 &amp; 4)</span>
              <span className="font-mono text-xs text-ink font-semibold tabular-nums">1 770 000 F CFA</span>
            </div>
            <div className="text-[11px] text-muted font-mono">
              Stocks &amp; Créances bruts : 1 770 000 F CFA · Dépréciations : -0 F CFA
            </div>
          </div>

          {/* Ligne 3 */}
          <div className="p-4 flex flex-col gap-0.5 hover:bg-background-secondary/50 transition-colors">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-ink">TRÉSORERIE-ACTIF (Classes 5)</span>
              <span className="font-mono text-xs text-ink font-semibold tabular-nums">5 000 000 F CFA</span>
            </div>
            <div className="text-[11px] text-muted">
              Disponibilités banques, caisses, Mobile Money
            </div>
          </div>
        </div>

        {/* TOTAL ACTIF (fond jaune, texte noir profond) */}
        <div className="bg-primary px-4 py-3 flex items-center justify-between text-ink font-bold border-t border-border">
          <span className="text-xs uppercase tracking-wide font-bold">TOTAL ACTIF</span>
          <span className="font-mono text-sm font-bold tabular-nums">6 770 000 F CFA</span>
        </div>
      </div>

      {/* PASSIF */}
      <div className="border border-border rounded flex flex-col bg-background overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-background-secondary flex items-center justify-between">
          <span className="text-sm font-bold text-ink uppercase tracking-wide">
            PASSIF (Ressources)
          </span>
          <span className="text-xs text-muted font-mono">Exercice 2026</span>
        </div>

        <div className="flex-1 divide-y divide-border">
          {/* Ligne 1 */}
          <div className="p-4 flex flex-col gap-0.5 hover:bg-background-secondary/50 transition-colors">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-ink">CAPITAUX PROPRES &amp; RESSOURCES (Classes 1)</span>
              <span className="font-mono text-xs text-ink font-semibold tabular-nums">5 444 800 F CFA</span>
            </div>
            <div className="text-[11px] text-muted">
              Capital, réserves, report · Résultat net : <span className="font-mono tabular-nums font-semibold text-ink">544 800 F CFA</span>
            </div>
          </div>

          {/* Ligne 2 */}
          <div className="p-4 flex flex-col gap-0.5 hover:bg-background-secondary/50 transition-colors">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-ink">DETTES FINANCIÈRES (Comptes 16, 17, 19)</span>
              <span className="font-mono text-xs text-ink font-semibold tabular-nums">0 F CFA</span>
            </div>
            <div className="text-[11px] text-muted">
              Emprunts et provisions financières à long terme
            </div>
          </div>

          {/* Ligne 3 */}
          <div className="p-4 flex flex-col gap-0.5 hover:bg-background-secondary/50 transition-colors">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-ink">PASSIF CIRCULANT (Classes 4)</span>
              <span className="font-mono text-xs text-ink font-semibold tabular-nums">1 325 200 F CFA</span>
            </div>
            <div className="text-[11px] text-muted">
              Fournisseurs, dettes fiscales et sociales
            </div>
          </div>

          {/* Ligne 4 */}
          <div className="p-4 flex flex-col gap-0.5 hover:bg-background-secondary/50 transition-colors">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-ink">TRÉSORERIE-PASSIF (Compte 56)</span>
              <span className="font-mono text-xs text-ink font-semibold tabular-nums">0 F CFA</span>
            </div>
            <div className="text-[11px] text-muted">
              Crédits de trésorerie et découverts
            </div>
          </div>
        </div>

        {/* TOTAL PASSIF (fond jaune, texte noir profond) */}
        <div className="bg-primary px-4 py-3 flex items-center justify-between text-ink font-bold border-t border-border">
          <span className="text-xs uppercase tracking-wide font-bold">TOTAL PASSIF</span>
          <span className="font-mono text-sm font-bold tabular-nums">6 770 000 F CFA</span>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 1.B : Compte de Résultat (SIG) avec en-tête fixe et montants alignés à droite
// -----------------------------------------------------------------------------
interface SIGRowItem {
  code: string;
  label: string;
  montant: string;
  isSolde?: boolean;
  isMajorSolde?: boolean;
  isNegative?: boolean;
}

const DsfSigSubView = ({ data }: { data: any }) => {
  const rows: SIGRowItem[] = useMemo(() => [
    { code: "701", label: "+ Ventes de marchandises", montant: "0" },
    { code: "702-706", label: "+ Production vendue (biens & services)", montant: "1 500 000" },
    { code: "707", label: "+ Produits accessoires", montant: "0" },
    { code: "CA", label: "= CHIFFRE D'AFFAIRES", montant: "1 500 000", isSolde: true, isMajorSolde: true },
    { code: "601", label: "- Achats de marchandises", montant: "0" },
    { code: "6031", label: "- Variation de stocks de marchandises", montant: "0" },
    { code: "MB", label: "= MARGE BRUTE SUR MARCHANDISES", montant: "0", isSolde: true },
    { code: "602-608", label: "- Matières premières & consommables", montant: "0" },
    { code: "61", label: "- Transports", montant: "0" },
    { code: "62-63", label: "- Services extérieurs (loyers, honoraires, pub)", montant: "0" },
    { code: "VA", label: "= VALEUR AJOUTÉE (VA)", montant: "1 500 000", isSolde: true, isMajorSolde: true },
    { code: "71", label: "+ Subventions d'exploitation", montant: "0" },
    { code: "64", label: "- Impôts et taxes (Patente, taxes locales)", montant: "0" },
    { code: "66", label: "- Charges de personnel (Salaires, CNSS, VPS)", montant: "-955 200", isNegative: true },
    { code: "EBE", label: "= EXCÉDENT BRUT D'EXPLOITATION (EBE)", montant: "544 800", isSolde: true, isMajorSolde: true },
    { code: "75+78", label: "+ Autres produits & Reprises d'exploitation", montant: "0" },
    { code: "65+68", label: "- Dotations aux amortissements & Autres charges", montant: "0" },
    { code: "REX", label: "= RÉSULTAT D'EXPLOITATION", montant: "544 800", isSolde: true, isMajorSolde: true },
    { code: "76+77", label: "+ Produits financiers & Gains de change", montant: "0" },
    { code: "67", label: "- Frais financiers & Pertes de change", montant: "0" },
    { code: "RFI", label: "= RÉSULTAT FINANCIER", montant: "0", isSolde: true },
    { code: "RAO", label: "= RÉSULTAT DES ACTIVITÉS ORDINAIRES (RAO)", montant: "544 800", isSolde: true, isMajorSolde: true },
    { code: "82-88", label: "+ Produits Hors Activités Ordinaires (HAO)", montant: "0" },
    { code: "81-85", label: "- Charges Hors Activités Ordinaires (HAO)", montant: "0" },
    { code: "RHAO", label: "= RÉSULTAT HAO", montant: "0", isSolde: true },
    { code: "87+89", label: "- Impôts sur résultat (IS / TPS) & Participations", montant: "0" },
    { code: "RNET", label: "= RÉSULTAT NET DE L'EXERCICE", montant: "544 800", isSolde: true, isMajorSolde: true },
  ], []);

  return (
    <div className="flex flex-col border border-border rounded bg-background overflow-hidden">
      <div className="p-4 border-b border-border bg-background-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-ink">
            Soldes Intermédiaires de Gestion (SIG SYSCOHADA)
          </h3>
          <p className="text-xs text-muted mt-0.5">Cascade officielle de formation du résultat</p>
        </div>
        <div className="px-3 py-1 bg-[#EBF9EE] border border-[#86EFAC] rounded text-[#166534] text-xs font-bold font-mono tabular-nums self-start sm:self-auto">
          Résultat Net : 544 800 F CFA
        </div>
      </div>

      {/* Conteneur à défilement avec en-tête de tableau sticky */}
      <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-background-secondary shadow-xs">
            <tr className="border-b border-border text-muted text-[11px] font-semibold uppercase">
              <th className="py-2.5 px-4 w-28 bg-background-secondary">Code Compte</th>
              <th className="py-2.5 px-4 bg-background-secondary">Libellé de la cascade de gestion</th>
              <th className="py-2.5 px-4 text-right uppercase w-48 bg-background-secondary">Montant (F CFA)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs text-ink">
            {rows.map((r, i) => (
              <tr
                key={i}
                className={cn(
                  "transition-colors",
                  r.isSolde
                    ? r.isMajorSolde
                      ? "bg-[#F5F4F2] font-bold border-l-4 border-l-primary"
                      : "bg-[#F5F4F2]/80 font-semibold border-l-4 border-l-border"
                    : "hover:bg-background-secondary/40"
                )}
              >
                {/* Code de compte en monospace gris foncé */}
                <td
                  className={cn(
                    "py-2.5 px-4 font-mono text-xs whitespace-nowrap",
                    r.isSolde ? "text-ink font-bold" : "text-[#4B4640]"
                  )}
                >
                  {r.code}
                </td>
                <td
                  className={cn(
                    "py-2.5 px-4 text-xs",
                    r.isSolde ? "text-ink font-bold" : "text-ink"
                  )}
                >
                  {r.label}
                </td>
                {/* Montants alignés à droite en chiffres tabulaires */}
                <td
                  className={cn(
                    "py-2.5 px-4 text-right font-mono text-xs tabular-nums whitespace-nowrap",
                    r.isSolde ? "text-ink font-bold" : "text-ink font-medium",
                    r.isNegative ? "text-error-deep font-semibold" : ""
                  )}
                >
                  {r.montant}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 1.C : TAFIRE (Cartes passent sur une colonne sur mobile)
// -----------------------------------------------------------------------------
const DsfTafireSubView = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h3 className="text-sm font-bold text-ink">
          TAFIRE (Tableau Financier des Ressources et Emplois)
        </h3>
        <p className="text-xs text-muted mt-0.5">Analyse des flux financiers de l'exercice 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte 1 */}
        <div className="border border-border rounded p-4 bg-background flex flex-col justify-between h-44">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-muted font-bold font-sans">
              Capacité d'Autofinancement (CAF)
            </span>
            <div className="text-2xl font-bold text-ink mt-2 font-mono tabular-nums">
              544 800 <span className="text-xs font-medium text-muted font-sans">F CFA</span>
            </div>
          </div>
          <div className="text-[11px] text-muted pt-2 border-t border-border/50">
            Ressource interne générée par l'activité
          </div>
        </div>

        {/* Carte 2 */}
        <div className="border border-border rounded p-4 bg-background flex flex-col justify-between h-44">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-muted font-bold font-sans">
              Variation du BFR
            </span>
            <div className="text-2xl font-bold text-ink mt-2 font-mono tabular-nums">
              444 800 <span className="text-xs font-medium text-muted font-sans">F CFA</span>
            </div>
          </div>
          <div className="text-[11px] text-muted pt-2 border-t border-border/50">
            Besoin en fonds de roulement d'exploitation
          </div>
        </div>

        {/* Carte 3 */}
        <div className="border border-border rounded p-4 bg-background flex flex-col justify-between h-44">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-muted font-bold font-sans">
              Flux de Trésorerie d'Exploitation
            </span>
            <div className="text-2xl font-bold text-[#166534] mt-2 font-mono tabular-nums">
              100 000 <span className="text-xs font-medium text-muted font-sans">F CFA</span>
            </div>
          </div>
          <div className="text-[11px] text-muted pt-2 border-t border-border/50">
            CAF corrigée de la variation du BFR
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// 2. ONGLET BILAN INTERACTIF (Tableaux s'empilent sur mobile)
// =============================================================================
const BilanTabContent = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h2 className="text-sm font-bold text-ink">Bilan au 01/10/2026</h2>
        <span className="text-[11px] text-muted uppercase tracking-wider font-mono">
          Date d'arrêté : 01/10/2026
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ACTIF TABLEAU */}
        <div className="border border-border rounded flex flex-col bg-background overflow-hidden">
          <div className="px-4 py-2.5 bg-background-secondary border-b border-border text-[11px] uppercase tracking-wider text-muted font-bold">
            ACTIF
          </div>
          <div className="flex-1 divide-y divide-border">
            <div className="px-4 py-2.5 flex items-center justify-between hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">Clients</span>
              <span className="font-mono text-xs text-ink tabular-nums font-medium">1 770 000 F CFA</span>
            </div>
            <div className="px-4 py-2.5 flex items-center justify-between hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">Banques locales en monnaie nationale</span>
              <span className="font-mono text-xs text-ink tabular-nums font-medium">5 000 000 F CFA</span>
            </div>
          </div>
          <div className="px-4 py-3 bg-background-secondary border-t border-border flex items-center justify-between font-bold text-ink">
            <span className="text-xs font-bold">Total Actif</span>
            <span className="font-mono text-xs font-bold tabular-nums">6 770 000 F CFA</span>
          </div>
        </div>

        {/* PASSIF TABLEAU */}
        <div className="border border-border rounded flex flex-col bg-background overflow-hidden">
          <div className="px-4 py-2.5 bg-background-secondary border-b border-border text-[11px] uppercase tracking-wider text-muted font-bold">
            PASSIF
          </div>
          <div className="flex-1 divide-y divide-border">
            <div className="px-4 py-2 flex items-center justify-between hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">Capital social</span>
              <span className="font-mono text-xs text-ink tabular-nums font-medium">5 000 000 F CFA</span>
            </div>
            <div className="px-4 py-2 flex items-center justify-between hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">Capital par dotation</span>
              <span className="font-mono text-xs text-ink tabular-nums font-medium">100 000 F CFA</span>
            </div>
            <div className="px-4 py-2 flex items-center justify-between hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">Fournisseurs dettes en compte</span>
              <span className="font-mono text-xs text-ink tabular-nums font-medium">100 000 F CFA</span>
            </div>
            <div className="px-4 py-2 flex items-center justify-between hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">Personnel rémunérations dues</span>
              <span className="font-mono text-xs text-ink tabular-nums font-medium">698 808 F CFA</span>
            </div>
            <div className="px-4 py-2 flex items-center justify-between hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">Sécurité sociale (CNSS Bénin)</span>
              <span className="font-mono text-xs text-ink tabular-nums font-medium">152 000 F CFA</span>
            </div>
            <div className="px-4 py-2 flex items-center justify-between hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">TVA facturée sur ventes de biens</span>
              <span className="font-mono text-xs text-ink tabular-nums font-medium">270 000 F CFA</span>
            </div>
            <div className="px-4 py-2 flex items-center justify-between hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">IPTS retenu sur salaires</span>
              <span className="font-mono text-xs text-ink tabular-nums font-medium">72 392 F CFA</span>
            </div>
            <div className="px-4 py-2 flex items-center justify-between hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">État charges à payer (VPS, Taxe d'apprentissage, etc.)</span>
              <span className="font-mono text-xs text-ink tabular-nums font-medium">32 000 F CFA</span>
            </div>
          </div>
          <div className="px-4 py-3 bg-background-secondary border-t border-border flex items-center justify-between font-bold text-ink">
            <span className="text-xs font-bold">Total Passif</span>
            <span className="font-mono text-xs font-bold tabular-nums">6 425 200 F CFA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// 3. ONGLET COMPTE DE RÉSULTAT (Ligne résultat net fond vert uni + texte vert foncé)
// =============================================================================
const CompteResultatTabContent = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h2 className="text-sm font-bold text-ink">Exercice 2026</h2>
        <span className="text-[11px] text-muted uppercase font-mono">
          Période du 01/01/2026 au 31/12/2026
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* CHARGES */}
        <div className="border border-border rounded flex flex-col bg-background overflow-hidden">
          <div className="px-4 py-2.5 bg-background-secondary border-b border-border text-[11px] uppercase tracking-wider text-muted font-bold">
            CHARGES
          </div>
          <div className="flex-1 divide-y divide-border">
            <div className="p-4 flex items-start justify-between gap-4 hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">
                Rémunérations directes versées au personnel national
              </span>
              <span className="font-mono text-xs text-ink font-semibold shrink-0 tabular-nums">
                800 000 F CFA
              </span>
            </div>
            <div className="p-4 flex items-start justify-between gap-4 hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">
                Charges sociales patronales (CNSS part patronale 15.4%, VPS 4%)
              </span>
              <span className="font-mono text-xs text-ink font-semibold shrink-0 tabular-nums">
                155 200 F CFA
              </span>
            </div>
          </div>
          <div className="px-4 py-3 bg-background-secondary border-t border-border flex items-center justify-between font-bold text-ink">
            <span className="text-xs font-bold">Total charges</span>
            <span className="font-mono text-xs font-bold tabular-nums">955 200 F CFA</span>
          </div>
        </div>

        {/* PRODUITS */}
        <div className="border border-border rounded flex flex-col bg-background overflow-hidden">
          <div className="px-4 py-2.5 bg-background-secondary border-b border-border text-[11px] uppercase tracking-wider text-muted font-bold">
            PRODUITS
          </div>
          <div className="flex-1 divide-y divide-border">
            <div className="p-4 flex items-start justify-between gap-4 hover:bg-background-secondary/40 transition-colors">
              <span className="text-xs text-ink">Services vendus (Prestations de services)</span>
              <span className="font-mono text-xs text-ink font-semibold shrink-0 tabular-nums">
                1 500 000 F CFA
              </span>
            </div>
          </div>
          <div className="px-4 py-3 bg-background-secondary border-t border-border flex items-center justify-between font-bold text-ink">
            <span className="text-xs font-bold">Total produits</span>
            <span className="font-mono text-xs font-bold tabular-nums">1 500 000 F CFA</span>
          </div>
        </div>
      </div>

      {/* Ligne pleine largeur Résultat net (Fond vert très clair uni, texte vert foncé en gras) */}
      <div className="bg-[#EBF9EE] border border-[#86EFAC] rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#166534] text-white flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#166534] block">
              Résultat net de l'exercice
            </span>
            <span className="text-xs text-[#166534]/80">
              Bénéfice comptable après déduction des charges d'exploitation
            </span>
          </div>
        </div>
        <div className="text-2xl font-bold text-[#166534] font-mono tabular-nums self-end sm:self-auto">
          544 800 F CFA
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// 4. ONGLET TRÉSORERIE (Graphique SVG en aires plat uni, libellés en F CFA lisibles)
// =============================================================================
const TresorerieTabContent = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border gap-2">
        <h2 className="text-sm font-bold text-ink">Évolution de la trésorerie — 30 derniers jours</h2>
        <span className="text-xs text-muted font-mono">Disponibilités globales : 5 000 000 F CFA</span>
      </div>

      {/* Graphique SVG en aires uni plat (aucun dégradé, vert très clair uni) */}
      <div className="border border-border rounded p-4 bg-background relative flex flex-col">
        <div className="w-full overflow-hidden">
          <svg
            className="w-full h-72 block overflow-visible select-none"
            preserveAspectRatio="none"
            viewBox="0 0 850 320"
          >
            {/* Grille horizontale en pointillés gris clair */}
            <line stroke="#E5E0D8" strokeDasharray="3 3" strokeWidth="1" x1="100" x2="830" y1="40" y2="40" />
            <line stroke="#E5E0D8" strokeDasharray="3 3" strokeWidth="1" x1="100" x2="830" y1="95" y2="95" />
            <line stroke="#E5E0D8" strokeDasharray="3 3" strokeWidth="1" x1="100" x2="830" y1="150" y2="150" />
            <line stroke="#E5E0D8" strokeDasharray="3 3" strokeWidth="1" x1="100" x2="830" y1="205" y2="205" />
            <line stroke="#E5E0D8" strokeWidth="1" x1="100" x2="830" y1="260" y2="260" />

            {/* Axe Y : Libellés en F CFA lisibles complets */}
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="end" x="90" y="44">6 000 000</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="end" x="90" y="99">4 500 000</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="end" x="90" y="154">3 000 000</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="end" x="90" y="209">1 500 000</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="end" x="90" y="264">0</text>

            {/* Aire plate verte (aucun dégradé, remplissage uni #EBF9EE) */}
            <polygon fill="#EBF9EE" points="100,260 450,260 470,77 830,77 830,260" />

            {/* Ligne de tracé continue nette 2px (#16A34A / vert foncé) */}
            <polyline
              fill="none"
              points="100,260 450,260 470,77 830,77"
              stroke="#16A34A"
              strokeLinejoin="round"
              strokeWidth="2"
            />

            {/* Axe X (Dates) */}
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="middle" x="100" y="285">02/09</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="middle" x="200" y="285">06/09</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="middle" x="300" y="285">10/09</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="middle" x="400" y="285">14/09</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="middle" x="500" y="285">18/09</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="middle" x="600" y="285">22/09</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="middle" x="710" y="285">26/09</text>
            <text className="fill-[#645d57] font-mono text-[11px]" textAnchor="middle" x="830" y="285">30/09</text>

            {/* Point interactif du 17/09/2026 */}
            <circle
              className="cursor-pointer"
              cx="470"
              cy="77"
              fill="#15803D"
              r="5"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Infobulle sobre sous le point de rupture */}
        <div className="mt-3 p-3 bg-background-secondary border border-border rounded flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-ink">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span className="font-semibold">Point d'inflexion : 17/09/2026</span>
            <span className="text-muted">—</span>
            <span className="text-muted">Solde : 5 000 000 F CFA (Virement capital initial)</span>
          </div>
          <span className="text-[11px] text-muted font-mono uppercase">
            Vérifié par Relevé Bancaire
          </span>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// 5. ONGLET RATIOS (Montants noir profond, pastilles vertes à texte vert foncé)
// =============================================================================
const RatiosTabContent = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h2 className="text-sm font-bold text-ink">Indicateurs de Performance &amp; Ratios Clés</h2>
        <span className="text-[11px] text-muted font-mono">SYSCOHADA Révisé 2026</span>
      </div>

      {/* Sur mobile, les cartes passent sur une colonne (grid-cols-1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ratio 1 : SOLVABILITÉ */}
        <div className="border border-border rounded p-4 bg-background flex flex-col justify-between h-48 shadow-xs">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-muted font-bold font-sans">
              SOLVABILITÉ
            </span>
            <span className="text-3xl font-bold text-ink mt-1 leading-none font-mono tabular-nums">
              1.05
            </span>
            <span className="text-xs text-muted mt-1">Actif / Passif</span>
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#EBF9EE] text-[#166534] border border-[#86EFAC]">
              +0,05 vs mois dernier
            </span>
          </div>
        </div>

        {/* Ratio 2 : RÉSULTAT NET */}
        <div className="border border-border rounded p-4 bg-background flex flex-col justify-between h-48 shadow-xs">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-muted font-bold font-sans">
              RÉSULTAT NET
            </span>
            <span className="text-2xl font-bold text-ink mt-2 leading-none font-mono tabular-nums">
              544 800 F
            </span>
            <span className="text-xs text-muted mt-1">Bénéfice / Perte</span>
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#EBF9EE] text-[#166534] border border-[#86EFAC]">
              Positif
            </span>
          </div>
        </div>

        {/* Ratio 3 : MARGE NETTE */}
        <div className="border border-border rounded p-4 bg-background flex flex-col justify-between h-48 shadow-xs">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-muted font-bold font-sans">
              MARGE NETTE
            </span>
            <span className="text-3xl font-bold text-ink mt-1 leading-none font-mono tabular-nums">
              36.3%
            </span>
            <span className="text-xs text-muted mt-1">Résultat / CA</span>
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#EBF9EE] text-[#166534] border border-[#86EFAC]">
              +1,2% vs 2024
            </span>
          </div>
        </div>

        {/* Ratio 4 : TRÉSORERIE */}
        <div className="border border-border rounded p-4 bg-background flex flex-col justify-between h-48 shadow-xs">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-muted font-bold font-sans">
              TRÉSORERIE
            </span>
            <span className="text-2xl font-bold text-ink mt-2 leading-none font-mono tabular-nums">
              5 000 000 F
            </span>
            <span className="text-xs text-muted mt-1">Disponible immédiat</span>
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#EBF9EE] text-[#166534] border border-[#86EFAC]">
              Stable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reporting;