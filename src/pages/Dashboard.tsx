import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Receipt,
  AlertTriangle,
  Download,
  CalendarDays,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { InvoiceStatusBadge } from "@/components/dashboard/StatusBadge";
import { kpis, monthlyRevenue, expenseBreakdown, cashflow, invoices } from "@/data/mock";
import { formatEUR, formatDate } from "@/lib/format";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bonjour Sophie 👋"
        subtitle="Voici un aperçu de votre activité — Avril 2026"
        actions={
          <>
            <Button variant="outline" size="sm">
              <CalendarDays className="mr-1 h-4 w-4" /> Avril 2026
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" /> Exporter PDF
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
              <Plus className="mr-1 h-4 w-4" /> Nouvelle opération
            </Button>
          </>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard title="Chiffre d'affaires" value={formatEUR(kpis.ca)} growth={kpis.caGrowth} icon={TrendingUp} tone="primary" spark sparkBase={120} />
        <KpiCard title="Charges totales" value={formatEUR(kpis.charges)} growth={kpis.chargesGrowth} icon={TrendingDown} tone="warning" spark sparkBase={45} />
        <KpiCard title="Résultat net" value={formatEUR(kpis.netResult)} growth={kpis.netResultGrowth} icon={PiggyBank} tone="success" spark sparkBase={80} />
        <KpiCard title="Trésorerie" value={formatEUR(kpis.tresorerie)} growth={kpis.tresorerieGrowth} icon={Wallet} tone="primary" spark sparkBase={125} />
        <KpiCard title="TVA à payer" value={formatEUR(kpis.tvaAPayer)} icon={Receipt} tone="warning" subtitle="Échéance 19 mai" />
        <KpiCard title="Factures impayées" value={`${kpis.facturesImpayees}`} icon={AlertTriangle} tone="destructive" subtitle={`${formatEUR(kpis.facturesImpayeesMontant)} en attente`} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">CA & Charges</h3>
              <p className="text-xs text-muted-foreground">12 derniers mois</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> CA</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Charges</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", boxShadow: "var(--shadow-elevated)" }}
                  formatter={(value: number) => formatEUR(value)}
                />
                <Line type="monotone" dataKey="ca" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="charges" stroke="hsl(var(--warning))" strokeWidth={2.5} dot={{ r: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold">Répartition des dépenses</h3>
            <p className="text-xs text-muted-foreground">Avril 2026</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {expenseBreakdown.map((e) => (<Cell key={e.name} fill={e.color} />))}
                </Pie>
                <Tooltip formatter={(value: number) => formatEUR(value)} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5 text-xs">
            {expenseBreakdown.map((e) => (
              <li key={e.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                  {e.name}
                </span>
                <span className="font-medium tabular text-foreground">{formatEUR(e.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cashflow + invoices */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Trésorerie projetée</h3>
              <p className="text-xs text-muted-foreground">30 prochains jours</p>
            </div>
            <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">+{kpis.tresorerieGrowth}%</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflow}>
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(221 83% 53%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(221 83% 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => formatEUR(v)} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Area type="monotone" dataKey="cash" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#cashGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Factures récentes</h3>
            <button className="inline-flex items-center text-xs font-medium text-primary hover:underline">
              Voir tout <ArrowUpRight className="ml-0.5 h-3 w-3" />
            </button>
          </div>
          <ul className="divide-y divide-border">
            {invoices.slice(0, 5).map((inv) => (
              <li key={inv.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{inv.client}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{inv.id} · {formatDate(inv.date)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="tabular text-sm font-semibold">{formatEUR(inv.montantTTC)}</span>
                  <InvoiceStatusBadge status={inv.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};