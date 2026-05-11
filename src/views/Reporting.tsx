"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { formatCFA } from "@/lib/format";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "bilan", label: "Bilan" },
  { id: "cr", label: "Compte de résultat" },
  { id: "tresorerie", label: "Trésorerie" },
  { id: "ratios", label: "Ratios" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export const Reporting = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as Tab) || "bilan";

  const { data: stats, isLoading } = useQuery<any>({
    queryKey: ["reporting-stats"],
    queryFn: () => fetcher("/api/reporting"),
  });

  const setTab = (t: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (t === "bilan") params.delete("tab"); else params.set("tab", t);
    router.push(`${pathname}?${params.toString()}`);
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reporting"
        subtitle="Vos états financiers en temps réel"
        actions={<Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" /> Exporter en PDF</Button>}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 pt-2">
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
        <div className="p-6">
          {tab === "bilan" && <Bilan data={stats?.balanceSheet} />}
          {tab === "cr" && <CompteResultat data={stats?.incomeStatement} />}
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
      <p className="mb-4 text-sm text-muted-foreground">Bilan au {new Date().toLocaleDateString()}</p>
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