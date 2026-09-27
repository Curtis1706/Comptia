"use client";

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
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCFA, formatDate } from "@/lib/format";
import Link from "next/link";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import { JournalEntryModal } from "@/components/accounting/JournalEntryModal";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

export const Dashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isMounted, setIsMounted] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: me } = useQuery<any>({
    queryKey: ["me"],
    queryFn: () => fetcher("/api/auth/me"),
  });
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["dashboard-stats", date?.toISOString()],
    queryFn: () => fetcher(`/api/dashboard/stats${date ? `?date=${date.toISOString()}` : ""}`),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setIsInvoiceModalOpen(true);
      // cleanup param
      const params = new URLSearchParams(searchParams.toString());
      params.delete("action");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Chargement..." subtitle="Récupération de vos données financières" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-destructive">Une erreur est survenue lors du chargement du tableau de bord.</div>;
  }

  const defaultKpis = {
    ca: 0, caGrowth: 0,
    charges: 0, chargesGrowth: 0,
    netResult: 0, netResultGrowth: 0,
    tresorerie: 0, tresorerieGrowth: 0,
    tvaAPayer: 0,
    facturesImpayees: 0, facturesImpayeesMontant: 0,
  };
  const raw = data ?? {};
  const kpis = raw.kpis ?? defaultKpis;
  const monthlyRevenue = raw.monthlyRevenue ?? [];
  const expenseBreakdown = raw.expenseBreakdown ?? [];
  const invoices = raw.invoices ?? [];
  const userName = me?.name?.split(" ")[0] || "utilisateur";

  const currentMonthLong = date ? format(date, "MMMM", { locale: fr }) : "...";
  const currentMonthYear = date ? format(date, "MMMM yyyy", { locale: fr }) : "...";

  const userRole = me?.role || "viewer";
  const isCashier = userRole === "cashier";
  const isHr = userRole === "hr";
  const canCreateInvoice = ["owner", "admin", "accountant", "cashier"].includes(userRole);
  const canCreateEntry = ["owner", "admin", "accountant"].includes(userRole);

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title={`Bonjour ${userName}`}
        subtitle={`Voici un aperçu de votre activité — ${currentMonthYear}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex bg-card">
                  <CalendarDays className="mr-1 h-4 w-4 text-primary" /> {currentMonthLong}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {canCreateInvoice && (
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 sm:flex-none hover:bg-muted/50 bg-card"
                onClick={() => setIsInvoiceModalOpen(true)}
              >
                <Plus className="mr-1 h-4 w-4" /> Facture
              </Button>
            )}

            {canCreateEntry && (
              <Button 
                size="sm" 
                className="flex-1 sm:flex-none bg-primary text-ink font-medium hover:opacity-90 shadow-sm"
                onClick={() => setIsEntryModalOpen(true)}
              >
                <Plus className="mr-1 h-4 w-4" /> Opération
              </Button>
            )}
          </div>
        }
      />

      {/* KPI grid conditioned by role */}
      {isCashier ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-2">
          <KpiCard title="Chiffre d'affaires" value={formatCFA(kpis.ca)} growth={kpis.caGrowth} icon={TrendingUp} tone="primary" spark data={kpis.caSpark} />
          <KpiCard title="Factures impayées" value={`${kpis.facturesImpayees}`} icon={AlertTriangle} tone="destructive" subtitle={`${formatCFA(kpis.facturesImpayeesMontant)} en attente`} />
        </div>
      ) : isHr ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-2">
          <KpiCard title="Masse salariale nette" value={formatCFA(kpis.payrollTotal || 0)} icon={Receipt} tone="primary" subtitle="Salaires nets période" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
          <KpiCard title="Chiffre d'affaires" value={formatCFA(kpis.ca)} growth={kpis.caGrowth} icon={TrendingUp} tone="primary" spark data={kpis.caSpark} />
          <KpiCard title="Charges totales" value={formatCFA(kpis.charges)} growth={kpis.chargesGrowth} icon={TrendingDown} tone="warning" spark data={kpis.chargesSpark} />
          <KpiCard title="Résultat net" value={formatCFA(kpis.netResult)} growth={kpis.netResultGrowth} icon={PiggyBank} tone="success" spark />
          <KpiCard title="Trésorerie" value={formatCFA(kpis.tresorerie)} growth={kpis.tresorerieGrowth} icon={Wallet} tone="primary" spark />
          <KpiCard title="TVA à payer" value={formatCFA(kpis.tvaAPayer)} icon={Receipt} tone="warning" subtitle="Estimation" />
          <KpiCard title="Factures impayées" value={`${kpis.facturesImpayees}`} icon={AlertTriangle} tone="destructive" subtitle={`${formatCFA(kpis.facturesImpayeesMontant)} en attente`} />
        </div>
      )}

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
                  formatter={(value: number) => formatCFA(value)}
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
            <p className="text-xs text-muted-foreground">Analytique par poste</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {expenseBreakdown.map((e: any, index: number) => (<Cell key={`cell-${index}`} fill={e.color} />))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCFA(value)} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5 text-xs">
            {expenseBreakdown.map((e: any, index: number) => (
              <li key={`list-${index}`} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground truncate mr-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: e.color }} />
                  <span className="truncate">{e.name}</span>
                </span>
                <span className="font-medium tabular text-foreground shrink-0">{formatCFA(e.value)}</span>
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
              <h3 className="font-display text-base font-semibold">Historique Trésorerie</h3>
              <p className="text-xs text-muted-foreground">Évolution des comptes de classe 5</p>
            </div>
            {kpis.tresorerieGrowth !== 0 && (
              <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">+{kpis.tresorerieGrowth}%</span>
            )}
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(221 83% 53%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(221 83% 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => formatCFA(v)} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Area type="monotone" dataKey="ca" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#cashGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Factures récentes</h3>
            <Link href="/facturation" className="inline-flex items-center text-xs font-medium text-primary hover:underline">
              Voir tout <ArrowUpRight className="ml-0.5 h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {invoices.length > 0 ? (
              invoices.map((inv: any) => (
                <li key={inv.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{inv.client}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{inv.id} · {formatDate(inv.date)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="tabular text-sm font-semibold">{formatCFA(inv.montantTTC)}</span>
                    <InvoiceStatusBadge status={inv.status} />
                  </div>
                </li>
              ))
            ) : (
              <li className="py-8 text-center text-xs text-muted-foreground italic">Aucune facture enregistrée</li>
            )}
          </ul>
        </div>
      </div>

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        }}
      />

      <JournalEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        }}
      />
    </div>
  );
};