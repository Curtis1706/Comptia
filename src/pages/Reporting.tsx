import { useSearchParams } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { balanceSheet, incomeStatement, cashflow } from "@/data/mock";
import { formatEUR } from "@/lib/format";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "bilan", label: "Bilan" },
  { id: "cr", label: "Compte de résultat" },
  { id: "tresorerie", label: "Trésorerie" },
  { id: "ratios", label: "Ratios" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export const Reporting = () => {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab) || "bilan";
  const setTab = (t: Tab) => {
    const p = new URLSearchParams(params);
    if (t === "bilan") p.delete("tab"); else p.set("tab", t);
    setParams(p, { replace: true });
  };

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
          {tab === "bilan" && <Bilan />}
          {tab === "cr" && <CompteResultat />}
          {tab === "tresorerie" && <Tresorerie />}
          {tab === "ratios" && <Ratios />}
        </div>
      </div>
    </div>
  );
};

const totalize = (arr: { value: number }[]) => arr.reduce((s, x) => s + x.value, 0);

const Bilan = () => {
  const totalActif = totalize(balanceSheet.actif);
  const totalPassif = totalize(balanceSheet.passif);
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">Bilan au 31/12/2025</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border">
          <div className="border-b border-border bg-muted/40 px-4 py-2 font-semibold uppercase text-xs tracking-wide text-muted-foreground">Actif</div>
          <ul className="divide-y divide-border">
            {balanceSheet.actif.map((l) => (
              <li key={l.label} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{l.label}</span>
                <span className="tabular font-medium">{formatEUR(l.value)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between bg-primary-soft px-4 py-3 text-sm font-bold">
              <span>Total Actif</span>
              <span className="tabular">{formatEUR(totalActif)}</span>
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-border">
          <div className="border-b border-border bg-muted/40 px-4 py-2 font-semibold uppercase text-xs tracking-wide text-muted-foreground">Passif</div>
          <ul className="divide-y divide-border">
            {balanceSheet.passif.map((l) => (
              <li key={l.label} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{l.label}</span>
                <span className="tabular font-medium">{formatEUR(l.value)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between bg-primary-soft px-4 py-3 text-sm font-bold">
              <span>Total Passif</span>
              <span className="tabular">{formatEUR(totalPassif)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const CompteResultat = () => {
  const totalProduits = totalize(incomeStatement.produits);
  const totalCharges = totalize(incomeStatement.charges);
  const resultat = totalProduits - totalCharges;
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">Exercice 2025</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border">
          <div className="border-b border-border bg-muted/40 px-4 py-2 font-semibold uppercase text-xs tracking-wide text-muted-foreground">Charges</div>
          <ul className="divide-y divide-border">
            {incomeStatement.charges.map((l) => (
              <li key={l.label} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{l.label}</span>
                <span className="tabular font-medium">{formatEUR(l.value)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between bg-warning-soft px-4 py-3 text-sm font-bold">
              <span>Total charges</span>
              <span className="tabular">{formatEUR(totalCharges)}</span>
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-border">
          <div className="border-b border-border bg-muted/40 px-4 py-2 font-semibold uppercase text-xs tracking-wide text-muted-foreground">Produits</div>
          <ul className="divide-y divide-border">
            {incomeStatement.produits.map((l) => (
              <li key={l.label} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{l.label}</span>
                <span className="tabular font-medium">{formatEUR(l.value)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between bg-info-soft px-4 py-3 text-sm font-bold">
              <span>Total produits</span>
              <span className="tabular">{formatEUR(totalProduits)}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={cn(
        "mt-6 flex items-center justify-between rounded-lg p-5 text-lg font-bold",
        resultat >= 0 ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive",
      )}>
        <span className="flex items-center gap-2 font-display"><TrendingUp className="h-5 w-5" /> Résultat net</span>
        <span className="font-display tabular">{formatEUR(resultat)}</span>
      </div>
    </div>
  );
};

const Tresorerie = () => (
  <div>
    <p className="mb-4 text-sm text-muted-foreground">Évolution de la trésorerie — 30 derniers jours</p>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={cashflow}>
          <defs>
            <linearGradient id="trGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={3} />
          <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v: number) => formatEUR(v)} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
          <Area type="monotone" dataKey="cash" stroke="hsl(160 84% 39%)" strokeWidth={2.5} fill="url(#trGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const Ratios = () => {
  const ratios = [
    { label: "Solvabilité", value: "1,84", desc: "Actif / Passif", trend: "+0,12 vs 2024" },
    { label: "ROE", value: "62%", desc: "Résultat / Capital", trend: "+18 pts vs 2024" },
    { label: "Marge nette", value: "6,2%", desc: "Résultat / CA", trend: "+1,1 pt vs 2024" },
    { label: "BFR", value: "12 jours", desc: "Besoin en fonds de roulement", trend: "-3j vs 2024" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ratios.map((r) => (
        <div key={r.label} className="rounded-lg border border-border bg-gradient-subtle p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{r.label}</p>
          <p className="mt-2 font-display text-3xl font-semibold tabular text-primary">{r.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
          <p className="mt-3 text-xs font-semibold text-success">{r.trend}</p>
        </div>
      ))}
    </div>
  );
};

export default Reporting;