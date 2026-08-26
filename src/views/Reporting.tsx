"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, TrendingUp, FileSpreadsheet, ShieldCheck, Scale, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { formatCFA } from "@/lib/format";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "bilan", label: "Bilan" },
  { id: "cr", label: "Compte de résultat" },
  { id: "dsf", label: "DSF / États SYSCOHADA" },
  { id: "tresorerie", label: "Trésorerie" },
  { id: "ratios", label: "Ratios" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export const Reporting = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as Tab) || "bilan";
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());

  const { data: stats, isLoading } = useQuery<any>({
    queryKey: ["reporting-stats"],
    queryFn: () => fetcher("/api/reporting"),
  });

  const { data: dsfRes, isLoading: dsfLoading } = useQuery<any>({
    queryKey: ["dsf-report", fiscalYear],
    queryFn: () => fetcher(`/api/reporting/dsf?fiscal_year=${fiscalYear}`),
  });

  const setTab = (t: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (t === "bilan") params.delete("tab"); else params.set("tab", t);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePrintDsf = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Calcul des états financiers...</p>
        </div>
      </div>
    );
  }

  const dsfData = dsfRes?.data || dsfRes;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reporting & États Financiers"
        subtitle="DSF obligatoire DGI / INSAE et états financiers SYSCOHADA révisé"
        actions={
          <Button variant="outline" size="sm" onClick={handlePrintDsf}>
            <Download className="mr-1 h-4 w-4" /> Exporter en PDF / Imprimer
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-2 pt-2">
          <div className="flex flex-wrap items-center gap-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={cn(
                "relative rounded-t-md px-4 py-2.5 text-sm font-medium transition",
                tab === t.id ? "bg-card text-primary" : "text-muted-foreground hover:text-foreground",
              )}>
                {t.label}
                {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />}
              </button>
            ))}
          </div>

          {tab === "dsf" && (
            <div className="flex items-center gap-2 pr-3 pb-2">
              <span className="text-xs text-muted-foreground">Exercice :</span>
              <select
                className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold focus:outline-none"
                value={fiscalYear}
                onChange={(e) => setFiscalYear(parseInt(e.target.value, 10))}
              >
                {[2026, 2025, 2024, 2023].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="p-6">
          {tab === "bilan" && <Bilan data={stats?.balanceSheet} />}
          {tab === "cr" && <CompteResultat data={stats?.incomeStatement} />}
          {tab === "dsf" && <DsfView data={dsfData} loading={dsfLoading} year={fiscalYear} />}
          {tab === "tresorerie" && <Tresorerie data={stats?.cashflow} />}
          {tab === "ratios" && <Ratios data={stats?.ratios} />}
        </div>
      </div>
    </div>
  );
};

const totalize = (arr: { value: number }[]) => (arr || []).reduce((s, x) => s + x.value, 0);

const Bilan = ({ data }: { data: any }) => {
  const totalActif = totalize(data?.actif);
  const totalPassif = totalize(data?.passif);
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">Bilan au {new Date().toLocaleDateString("fr-FR")}</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border">
          <div className="border-b border-border bg-muted/40 px-4 py-2 font-semibold uppercase text-xs tracking-wide text-muted-foreground">Actif</div>
          <ul className="divide-y divide-border">
            {(data?.actif || []).length > 0 ? (
              data.actif.map((l: any) => (
                <li key={l.label} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>{l.label}</span>
                  <span className="tabular font-medium">{formatCFA(l.value)}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-xs text-muted-foreground">Aucun actif enregistré</li>
            )}
            <li className="flex items-center justify-between bg-primary-soft px-4 py-3 text-sm font-bold">
              <span>Total Actif</span>
              <span className="tabular">{formatCFA(totalActif)}</span>
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-border">
          <div className="border-b border-border bg-muted/40 px-4 py-2 font-semibold uppercase text-xs tracking-wide text-muted-foreground">Passif</div>
          <ul className="divide-y divide-border">
            {(data?.passif || []).length > 0 ? (
              data.passif.map((l: any) => (
                <li key={l.label} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>{l.label}</span>
                  <span className="tabular font-medium">{formatCFA(l.value)}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-xs text-muted-foreground">Aucun passif enregistré</li>
            )}
            <li className="flex items-center justify-between bg-primary-soft px-4 py-3 text-sm font-bold">
              <span>Total Passif</span>
              <span className="tabular">{formatCFA(totalPassif)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const CompteResultat = ({ data }: { data: any }) => {
  const totalProduits = totalize(data?.produits);
  const totalCharges = totalize(data?.charges);
  const resultat = totalProduits - totalCharges;
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">Exercice {new Date().getFullYear()}</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border">
          <div className="border-b border-border bg-muted/40 px-4 py-2 font-semibold uppercase text-xs tracking-wide text-muted-foreground">Charges</div>
          <ul className="divide-y divide-border">
            {(data?.charges || []).length > 0 ? (
              data.charges.map((l: any) => (
                <li key={l.label} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>{l.label}</span>
                  <span className="tabular font-medium">{formatCFA(l.value)}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-xs text-muted-foreground">Aucune charge enregistrée</li>
            )}
            <li className="flex items-center justify-between bg-warning-soft px-4 py-3 text-sm font-bold">
              <span>Total charges</span>
              <span className="tabular">{formatCFA(totalCharges)}</span>
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-border">
          <div className="border-b border-border bg-muted/40 px-4 py-2 font-semibold uppercase text-xs tracking-wide text-muted-foreground">Produits</div>
          <ul className="divide-y divide-border">
            {(data?.produits || []).length > 0 ? (
              data.produits.map((l: any) => (
                <li key={l.label} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>{l.label}</span>
                  <span className="tabular font-medium">{formatCFA(l.value)}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-xs text-muted-foreground">Aucun produit enregistré</li>
            )}
            <li className="flex items-center justify-between bg-info-soft px-4 py-3 text-sm font-bold">
              <span>Total produits</span>
              <span className="tabular">{formatCFA(totalProduits)}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={cn(
        "mt-6 flex items-center justify-between rounded-lg p-5 text-lg font-bold",
        resultat >= 0 ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive",
      )}>
        <span className="flex items-center gap-2 font-display"><TrendingUp className="h-5 w-5" /> Résultat net</span>
        <span className="font-display tabular">{formatCFA(resultat)}</span>
      </div>
    </div>
  );
};

const DsfView = ({ data, loading, year }: { data: any; loading: boolean; year: number }) => {
  const [subTab, setSubTab] = useState<"bilan" | "cr" | "tafire">("bilan");

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const { bilan, compteResultat, tafire } = data;

  return (
    <div className="space-y-6">
      {/* DSF Compliance Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>DSF SYSCOHADA révisé (DGI Bénin) — Exercice clos le 31/12/{year}. Dépôt légal avant le 30 Avril.</span>
        </div>
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-success" />
          <span>Équilibre Bilan : {bilan?.equilibre?.estEquilibre ? "✅ Équilibré (Actif = Passif)" : "⚠️ Écart détecté"}</span>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Button
          variant={subTab === "bilan" ? "default" : "outline"}
          size="sm"
          onClick={() => setSubTab("bilan")}
        >
          <Scale className="mr-1.5 h-3.5 w-3.5" /> Bilan SYSCOHADA
        </Button>
        <Button
          variant={subTab === "cr" ? "default" : "outline"}
          size="sm"
          onClick={() => setSubTab("cr")}
        >
          <BarChart3 className="mr-1.5 h-3.5 w-3.5" /> Compte de Résultat (SIG)
        </Button>
        <Button
          variant={subTab === "tafire" ? "default" : "outline"}
          size="sm"
          onClick={() => setSubTab("tafire")}
        >
          <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> TAFIRE (Flux Financiers)
        </Button>
      </div>

      {/* Bilan Tab */}
      {subTab === "bilan" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ACTIF */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-display font-semibold text-primary">ACTIF (Emplois)</h3>
              <span className="text-xs text-muted-foreground">Exercice {year}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="flex justify-between font-semibold">
                  <span>ACTIF IMMOBILISÉ (Classes 2)</span>
                  <span className="tabular">{formatCFA(bilan?.actif?.actifImmobilise?.net || 0)}</span>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground flex justify-between">
                  <span>Brut : {formatCFA(bilan?.actif?.actifImmobilise?.brut || 0)}</span>
                  <span>Amort. : -{formatCFA(bilan?.actif?.actifImmobilise?.amortissements || 0)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/40 p-3">
                <div className="flex justify-between font-semibold">
                  <span>ACTIF CIRCULANT (Classes 3 & 4)</span>
                  <span className="tabular">{formatCFA(bilan?.actif?.actifCirculant?.net || 0)}</span>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground flex justify-between">
                  <span>Stocks & Créances bruts : {formatCFA(bilan?.actif?.actifCirculant?.brut || 0)}</span>
                  <span>Dépréciations : -{formatCFA(bilan?.actif?.actifCirculant?.depreciations || 0)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/40 p-3">
                <div className="flex justify-between font-semibold">
                  <span>TRÉSORERIE-ACTIF (Classes 5)</span>
                  <span className="tabular">{formatCFA(bilan?.actif?.tresorerieActif?.montant || 0)}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Disponibilités banques, caisses, Mobile Money</p>
              </div>
            </div>

            <div className="flex justify-between rounded-lg bg-primary text-primary-foreground p-3 font-bold text-sm">
              <span>TOTAL ACTIF</span>
              <span className="tabular">{formatCFA(bilan?.actif?.totalActif || 0)}</span>
            </div>
          </div>

          {/* PASSIF */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-display font-semibold text-primary">PASSIF (Ressources)</h3>
              <span className="text-xs text-muted-foreground">Exercice {year}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="flex justify-between font-semibold">
                  <span>CAPITAUX PROPRES & RESSOURCES (Classes 1)</span>
                  <span className="tabular">{formatCFA(bilan?.passif?.capitauxPropres?.montant || 0)}</span>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground flex justify-between">
                  <span>Capital, réserves, report</span>
                  <span className="font-medium text-foreground">
                    Résultat net : {formatCFA(bilan?.equilibre?.resultatNetExercice || 0)}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/40 p-3">
                <div className="flex justify-between font-semibold">
                  <span>DETTES FINANCIÈRES (Comptes 16, 17, 19)</span>
                  <span className="tabular">{formatCFA(bilan?.passif?.dettesFinancieres?.montant || 0)}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Emprunts et provisions financières à long terme</p>
              </div>

              <div className="rounded-lg bg-muted/40 p-3">
                <div className="flex justify-between font-semibold">
                  <span>PASSIF CIRCULANT (Classes 4)</span>
                  <span className="tabular">{formatCFA(bilan?.passif?.passifCirculant?.montant || 0)}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Fournisseurs, dettes fiscales et sociales</p>
              </div>

              <div className="rounded-lg bg-muted/40 p-3">
                <div className="flex justify-between font-semibold">
                  <span>TRÉSORERIE-PASSIF (Compte 56)</span>
                  <span className="tabular">{formatCFA(bilan?.passif?.tresoreriePassif?.montant || 0)}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Crédits de trésorerie et découverts</p>
              </div>
            </div>

            <div className="flex justify-between rounded-lg bg-primary text-primary-foreground p-3 font-bold text-sm">
              <span>TOTAL PASSIF</span>
              <span className="tabular">{formatCFA(bilan?.passif?.totalPassif || 0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Compte de Résultat (SIG) Tab */}
      {subTab === "cr" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display text-base font-semibold">Soldes Intermédiaires de Gestion (SIG SYSCOHADA)</h3>
              <p className="text-xs text-muted-foreground">Cascade officielle de formation du résultat</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Résultat Net</p>
              <p className={cn("font-display text-lg font-bold tabular", compteResultat?.resultatNet >= 0 ? "text-success" : "text-destructive")}>
                {formatCFA(compteResultat?.resultatNet || 0)}
              </p>
            </div>
          </div>

          <div className="divide-y divide-border text-xs">
            {(compteResultat?.sigDetails || []).map((sig: any, index: number) => {
              const isHighlight = sig.isTotal || sig.isSubtotal;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3 transition",
                    isHighlight ? "bg-muted/60 font-semibold text-foreground" : "text-muted-foreground",
                    sig.isTotal && "border-t border-b border-primary/30 text-primary font-bold text-sm bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-70 w-14">{sig.code}</span>
                    <span>{sig.label}</span>
                  </div>
                  <span className={cn("tabular", sig.montant < 0 ? "text-destructive" : "")}>
                    {formatCFA(sig.montant)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAFIRE Tab */}
      {subTab === "tafire" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="font-display text-base font-semibold">TAFIRE (Tableau Financier des Ressources et Emplois)</h3>
            <p className="text-xs text-muted-foreground">Analyse des flux financiers de l'exercice {year}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-muted-foreground">Capacité d'Autofinancement (CAF)</p>
              <p className="mt-1 text-xl font-bold font-display tabular text-primary">{formatCFA(tafire?.caf || 0)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Ressource interne générée par l'activité</p>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-muted-foreground">Variation du BFR</p>
              <p className="mt-1 text-xl font-bold font-display tabular">{formatCFA(tafire?.variationBFR || 0)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Besoin en fonds de roulement d'exploitation</p>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-muted-foreground">Flux de Trésorerie d'Exploitation</p>
              <p className="mt-1 text-xl font-bold font-display tabular text-success">{formatCFA(tafire?.fluxTresorerieExploitation || 0)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">CAF corrigée de la variation du BFR</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Tresorerie = ({ data }: { data: any }) => (
  <div>
    <p className="mb-4 text-sm text-muted-foreground">Évolution de la trésorerie — 30 derniers jours</p>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data || []}>
          <defs>
            <linearGradient id="trGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={3} />
          <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v: number) => formatCFA(v)} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
          <Area type="monotone" dataKey="cash" stroke="hsl(160 84% 39%)" strokeWidth={2.5} fill="url(#trGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const Ratios = ({ data }: { data: any }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(data || []).map((r: any) => (
        <div key={r.label} className="rounded-lg border border-border bg-gradient-subtle p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{r.label}</p>
          <p className="mt-2 font-display text-3xl font-semibold tabular text-primary">{r.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
          <p className={cn(
            "mt-3 text-xs font-semibold",
            r.trend.includes("+") || r.trend.includes("Positif") || r.trend.includes("Stable") ? "text-success" : "text-destructive"
          )}>{r.trend}</p>
        </div>
      ))}
    </div>
  );
};

export default Reporting;