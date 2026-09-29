"use client";

import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Wallet,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Plus,
  PlusCircle,
  Calendar as CalendarIcon,
  ChevronDown,
  HelpCircle,
  AlertCircle,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCFA, formatDate } from "@/lib/format";
import Link from "next/link";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import { JournalEntryModal } from "@/components/accounting/JournalEntryModal";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { format, addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ROLE_LABELS, UserRole } from "@/lib/permissions";

const invoiceStatusMap: Record<string, { label: string; badgeCls: string }> = {
  paid: { label: "Payée", badgeCls: "bg-success/20 text-[#00855A]" },
  payee: { label: "Payée", badgeCls: "bg-success/20 text-[#00855A]" },
  sent: { label: "Envoyée", badgeCls: "bg-primary/30 text-ink" },
  envoyee: { label: "Envoyée", badgeCls: "bg-primary/30 text-ink" },
  overdue: { label: "En retard", badgeCls: "bg-warning/20 text-ink" },
  retard: { label: "En retard", badgeCls: "bg-warning/20 text-ink" },
  draft: { label: "Brouillon", badgeCls: "bg-surface border border-border text-text-muted" },
  brouillon: { label: "Brouillon", badgeCls: "bg-surface border border-border text-text-muted" },
  cancelled: { label: "Annulée", badgeCls: "bg-error/20 text-error" },
};

const EXPENSE_COLORS = [
  "#332E29", // Ink
  "#FFD946", // Primary
  "#FFA53D", // Warning
  "#8A857D", // Muted
  "#00855A", // Tertiary
  "#D8D5D0", // Border
];

export const Dashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [periodOpen, setPeriodOpen] = useState(false);

  const { data: me } = useQuery<any>({
    queryKey: ["me"],
    queryFn: () => fetcher("/api/auth/me"),
  });

  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["dashboard-stats", date?.toISOString()],
    queryFn: () => fetcher(`/api/dashboard/stats${date ? `?date=${date.toISOString()}` : ""}`),
  });

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setIsInvoiceModalOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("action");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  if (isLoading) {
    return (
      <div className="space-y-space-lg animate-pulse">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <Skeleton className="h-10 w-64 rounded" />
          <Skeleton className="h-9 w-72 rounded" />
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          <Skeleton className="h-80 lg:col-span-2 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-background-secondary border border-border rounded-lg text-error">
        Une erreur est survenue lors du chargement du tableau de bord.
      </div>
    );
  }

  const raw = data ?? {};
  const defaultKpis = {
    ca: 0,
    caGrowth: 0,
    charges: 0,
    chargesGrowth: 0,
    netResult: 0,
    netResultGrowth: 0,
    tresorerie: 0,
    tresorerieGrowth: 0,
    tvaAPayer: 0,
    facturesImpayees: 0,
    facturesImpayeesMontant: 0,
    payrollTotal: 0,
  };
  const kpis = raw.kpis ?? defaultKpis;
  const monthlyRevenue = raw.monthlyRevenue ?? [];
  const rawExpenseBreakdown = raw.expenseBreakdown ?? [];
  const invoices = raw.invoices ?? [];

  const userRole = (me?.role as UserRole) || "owner";
  const userRoleLabel = ROLE_LABELS[userRole] || "Direction générale";

  const selectedDate = date || new Date();
  const currentMonthYear = format(selectedDate, "MMMM yyyy", { locale: fr });
  const nextMonthYear = format(addMonths(selectedDate, 1), "MMMM yyyy", { locale: fr });

  // Format expense breakdown with percentage
  const totalExpenseVal = rawExpenseBreakdown.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
  const expenseBreakdown = rawExpenseBreakdown.map((item: any, idx: number) => ({
    ...item,
    color: item.color || EXPENSE_COLORS[idx % EXPENSE_COLORS.length],
    percentage: totalExpenseVal > 0 ? Math.round((item.value / totalExpenseVal) * 100) : 0,
  }));

  const caMargin = kpis.ca > 0 ? ((kpis.netResult / kpis.ca) * 100).toFixed(1) : "0.0";
  const chargesRatio = kpis.ca > 0 ? ((kpis.charges / kpis.ca) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* 1. EN-TÊTE DE PAGE */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-bold text-ink tracking-tight">Tableau de bord</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-background-secondary border border-border text-ink text-xs font-semibold">
              {userRoleLabel}
            </span>
          </div>
          <p className="text-sm text-text-muted capitalize">
            Pilotage d'activité - {currentMonthYear}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Sélecteur Période Comptable */}
          <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-expanded={periodOpen}
                aria-haspopup="dialog"
                className="h-9 px-space-md rounded bg-background-secondary border border-border text-ink hover:bg-surface-container text-xs font-medium flex items-center gap-space-xs transition-colors focus:outline-none"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span className="font-semibold text-ink capitalize">{currentMonthYear}</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-text-muted text-[11px] font-medium">
                  Mois sélectionné
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted shrink-0 ml-0.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-border bg-background shadow-elevated" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setPeriodOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Action: Nouvelle facture */}
          <button
            type="button"
            onClick={() => setIsInvoiceModalOpen(true)}
            className="h-9 px-space-md rounded bg-background-secondary border border-border text-ink hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-ink" />
            <span>Nouvelle facture</span>
          </button>

          {/* Action: Saisir opération (CTA Primary officiel #FFD946) */}
          <button
            type="button"
            onClick={() => setIsEntryModalOpen(true)}
            className="h-9 px-space-md rounded bg-primary text-ink text-xs font-bold flex items-center gap-1.5 hover:brightness-95 active:scale-[0.99] transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-ink" />
            <span>Saisir opération</span>
          </button>
        </div>
      </header>

      {/* 2. BANNIÈRE D'ALERTE RÉGLEMENTAIRE DGI BÉNIN / SYSCOHADA (Alerte Warning Ceilow #FFA53D) */}
      <aside
        className="rounded-lg p-space-md bg-background-secondary border-l-4 border-warning border-t border-r border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md"
        role="alert"
      >
        <div className="flex items-start gap-space-md">
          <div className="w-8 h-8 rounded bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-ink" />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="text-sm font-semibold text-ink">
                Échéance fiscale DGI au 15 {nextMonthYear} :
              </span>
              <span className="tnum text-sm font-bold text-ink">{formatCFA(kpis.tvaAPayer)}</span>
              <span className="text-sm text-ink">de TVA nette due estimée.</span>
            </div>
            <p className="text-xs text-text-muted">
              {kpis.facturesImpayees} facture{kpis.facturesImpayees > 1 ? "s" : ""} en attente d'encaissement (
              <span className="tnum font-medium text-ink">{formatCFA(kpis.facturesImpayeesMontant)}</span>) • Règle
              d'exigibilité SYSCOHADA sur les encaissements réels.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-md shrink-0 self-end md:self-auto">
          <Link
            href="/tva"
            className="text-xs font-bold text-ink underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Déclarer TVA
          </Link>
          <span className="w-1 h-1 rounded-full bg-border" />
          <Link
            href="/facturation"
            className="text-xs font-bold text-ink underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Relancer impayés
          </Link>
        </div>
      </aside>

      {/* 3. GRILLE DES 6 KPIS FINANCIERS MAJEURS */}
      <section aria-label="Indicateurs clés de performance" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {/* KPI 1 : Trésorerie disponible */}
        <div className="rounded-lg p-space-md bg-background-secondary border border-border flex flex-col justify-between gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Trésorerie disponible
            </span>
            <div className="flex items-center gap-1.5">
              <div className="relative group/tip text-text-muted hover:text-ink transition-colors p-1 cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="pointer-events-none absolute right-0 top-6 z-50 hidden w-64 p-space-sm bg-ink text-background text-xs rounded shadow-md group-hover/tip:block text-left leading-snug">
                  Total des liquidités immédiatement mobilisables (comptes bancaires BOA, MTN Mobile Money et caisse espèces de classe 5 SYSCOHADA).
                </span>
              </div>
              <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-ink">
                <Wallet className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="tnum text-2xl lg:text-3xl font-bold text-ink tracking-tight">
              {formatCFA(kpis.tresorerie)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-space-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-success/20 text-[#00855A] text-xs font-semibold">
              Solde {kpis.tresorerie >= 0 ? "positif" : "débiteur"} • Classe 5
            </span>
            <span className="text-xs text-text-muted">Banque • MoMo • Caisse</span>
          </div>
        </div>

        {/* KPI 2 : Créances clients */}
        <div className="rounded-lg p-space-md bg-background-secondary border border-border flex flex-col justify-between gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Créances clients
            </span>
            <div className="flex items-center gap-1.5">
              <div className="relative group/tip text-text-muted hover:text-ink transition-colors p-1 cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="pointer-events-none absolute right-0 top-6 z-50 hidden w-64 p-space-sm bg-ink text-background text-xs rounded shadow-md group-hover/tip:block text-left leading-snug">
                  Montant total TTC des factures clients émises non soldées (Comptes 411).
                </span>
              </div>
              <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-ink">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="tnum text-2xl lg:text-3xl font-bold text-ink tracking-tight">
              {formatCFA(kpis.facturesImpayeesMontant)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-space-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-warning/20 text-ink text-xs font-semibold">
              {kpis.facturesImpayees} facture{kpis.facturesImpayees > 1 ? "s" : ""} en attente
            </span>
            <span className="text-xs text-text-muted">Échéance max 15j</span>
          </div>
        </div>

        {/* KPI 3 : Résultat net d'exploitation */}
        <div className="rounded-lg p-space-md bg-background-secondary border border-border flex flex-col justify-between gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Résultat net d'exploitation
            </span>
            <div className="flex items-center gap-1.5">
              <div className="relative group/tip text-text-muted hover:text-ink transition-colors p-1 cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="pointer-events-none absolute right-0 top-6 z-50 hidden w-64 p-space-sm bg-ink text-background text-xs rounded shadow-md group-hover/tip:block text-left leading-snug">
                  Bénéfice comptable : Produits (Cl. 7) moins charges (Cl. 6 SYSCOHADA).
                </span>
              </div>
              <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-[#00855A]">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span
              className={`tnum text-2xl lg:text-3xl font-bold tracking-tight ${
                kpis.netResult >= 0 ? "text-[#00855A]" : "text-error"
              }`}
            >
              {kpis.netResult >= 0 ? "+" : ""}
              {formatCFA(kpis.netResult)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-space-xs">
            <span className="tnum inline-flex items-center gap-1 text-xs text-[#00855A] font-bold">
              {kpis.netResultGrowth >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-error" />
              )}
              {kpis.netResultGrowth >= 0 ? `+${kpis.netResultGrowth}%` : `${kpis.netResultGrowth}%`} vs M-1
            </span>
            <span className="tnum text-xs text-text-muted">Marge nette {caMargin}%</span>
          </div>
        </div>

        {/* KPI 4 : Chiffre d'affaires */}
        <div className="rounded-lg p-space-md bg-background-secondary border border-border flex flex-col justify-between gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Chiffre d'affaires (Classe 7)
            </span>
            <div className="flex items-center gap-1.5">
              <div className="relative group/tip text-text-muted hover:text-ink transition-colors p-1 cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="pointer-events-none absolute right-0 top-6 z-50 hidden w-64 p-space-sm bg-ink text-background text-xs rounded shadow-md group-hover/tip:block text-left leading-snug">
                  Montant total HT des ventes de biens et services.
                </span>
              </div>
              <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-ink">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="tnum text-2xl lg:text-3xl font-bold text-ink tracking-tight">
              {formatCFA(kpis.ca)}
            </span>
            {/* Sparkline sobre token primary #FFD946 */}
            <div className="w-20 h-7 shrink-0">
              <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 100 35">
                <polyline
                  points="0,28 12,25 24,30 36,20 48,22 60,15 72,18 84,10 96,6 100,5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between pt-space-xs">
            <span className="tnum inline-flex items-center gap-1 text-xs text-[#00855A] font-bold">
              {kpis.caGrowth >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-error" />
              )}
              {kpis.caGrowth >= 0 ? `+${kpis.caGrowth}%` : `${kpis.caGrowth}%`} vs M-1
            </span>
            <span className="text-xs text-text-muted">HT facturé</span>
          </div>
        </div>

        {/* KPI 5 : Charges globales */}
        <div className="rounded-lg p-space-md bg-background-secondary border border-border flex flex-col justify-between gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Charges globales (Classe 6)
            </span>
            <div className="flex items-center gap-1.5">
              <div className="relative group/tip text-text-muted hover:text-ink transition-colors p-1 cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="pointer-events-none absolute right-0 top-6 z-50 hidden w-64 p-space-sm bg-ink text-background text-xs rounded shadow-md group-hover/tip:block text-left leading-snug">
                  Total des achats, loyers et charges de personnel.
                </span>
              </div>
              <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-ink">
                <ArrowDownRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="tnum text-2xl lg:text-3xl font-bold text-ink tracking-tight">
              {formatCFA(kpis.charges)}
            </span>
            {/* Sparkline sobre token warning #FFA53D */}
            <div className="w-20 h-7 shrink-0">
              <svg className="w-full h-full text-warning" fill="none" viewBox="0 0 100 35">
                <polyline
                  points="0,10 14,14 28,12 42,22 56,18 70,25 84,20 96,24 100,26"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between pt-space-xs">
            <span className="tnum inline-flex items-center gap-1 text-xs text-[#00855A] font-bold">
              {kpis.chargesGrowth <= 0 ? (
                <ArrowDownRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5 text-warning" />
              )}
              {kpis.chargesGrowth <= 0 ? `${kpis.chargesGrowth}% maîtrisées` : `+${kpis.chargesGrowth}%`}
            </span>
            <span className="tnum text-xs text-text-muted">{chargesRatio}% du CA</span>
          </div>
        </div>

        {/* KPI 6 : TVA nette à décaisser */}
        <div className="rounded-lg p-space-md bg-background-secondary border border-border flex flex-col justify-between gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              TVA nette à décaisser (DGI)
            </span>
            <div className="flex items-center gap-1.5">
              <div className="relative group/tip text-text-muted hover:text-ink transition-colors p-1 cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="pointer-events-none absolute right-0 top-6 z-50 hidden w-64 p-space-sm bg-ink text-background text-xs rounded shadow-md group-hover/tip:block text-left leading-snug">
                  TVA facturée collectée déduction faite de la TVA déductible.
                </span>
              </div>
              <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-ink">
                <Receipt className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="tnum text-2xl lg:text-3xl font-bold text-ink tracking-tight">
              {formatCFA(kpis.tvaAPayer)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-space-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-warning/20 text-ink text-xs font-semibold">
              Échéance le 15 du mois
            </span>
            <span className="text-xs text-text-muted">Bénin e-MECeF</span>
          </div>
        </div>
      </section>

      {/* 4. SECTION ANALYTIQUE & GRAPHIQUES */}
      <section aria-label="Analytique SYSCOHADA" className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Bloc 1 (2 cols) : Activité annuelle Ventes & Charges */}
        <div className="lg:col-span-2 rounded-lg p-space-md bg-background-secondary border border-border flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-space-sm">
            <div>
              <h2 className="text-base font-bold text-ink">Activité annuelle : Ventes & Charges</h2>
              <p className="text-xs text-text-muted">
                Historique glissant sur 12 mois (Comptabilité générale SYSCOHADA)
              </p>
            </div>
            <div className="flex items-center gap-space-md flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
                <span className="text-xs font-medium text-ink">Chiffre d'affaires (Cl. 7)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-warning inline-block" />
                <span className="text-xs font-medium text-ink">Charges d'exploitation (Cl. 6)</span>
              </div>
            </div>
          </div>

          {/* Histogramme Recharts conforme tokens Ceilow */}
          <div className="relative w-full pt-space-sm">
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8D5D0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#8A857D" }}
                    axisLine={{ stroke: "#D8D5D0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : `${(v / 1000).toFixed(0)}k`)}
                    tick={{ fontSize: 11, fill: "#8A857D" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 4,
                      border: "1px solid #D8D5D0",
                      background: "#FFFFFF",
                      color: "#332E29",
                      fontSize: 12,
                    }}
                    formatter={(val: number) => [formatCFA(val), ""]}
                  />
                  <Bar dataKey="ca" name="CA (Cl. 7)" fill="#FFD946" radius={[2, 2, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="charges" name="Charges (Cl. 6)" fill="#FFA53D" radius={[2, 2, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-space-xs flex items-center justify-between text-xs text-text-muted">
              <span>* Données comptables réelles du grand livre</span>
              <span className="tnum">Écritures validées en partie double</span>
            </div>
          </div>
        </div>

        {/* Bloc 2 (1 col) : Structure des coûts (Classe 6) */}
        <div className="rounded-lg p-space-md bg-background-secondary border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between pb-space-sm">
            <div>
              <h2 className="text-base font-bold text-ink">Structure des coûts</h2>
              <p className="text-xs text-text-muted">Postes de charges de la période (Classe 6)</p>
            </div>
            <span className="tnum text-xs px-2 py-0.5 rounded bg-surface border border-border text-ink font-semibold">
              {formatCFA(kpis.charges)}
            </span>
          </div>

          {/* Donut Chart Ceilow */}
          <div className="flex items-center justify-center my-space-sm relative">
            <div className="w-36 h-36 relative flex items-center justify-center">
              {expenseBreakdown.length > 0 && totalExpenseVal > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                    >
                      {expenseBreakdown.map((e: any, index: number) => (
                        <Cell key={`donut-cell-${index}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [formatCFA(val), ""]}
                      contentStyle={{
                        borderRadius: 4,
                        border: "1px solid #D8D5D0",
                        background: "#FFFFFF",
                        fontSize: 11,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-32 h-32 rounded-full border-8 border-border flex items-center justify-center">
                  <span className="text-[11px] text-text-muted">Aucune charge</span>
                </div>
              )}
              {totalExpenseVal > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="tnum text-base font-bold text-ink leading-tight">100%</span>
                  <span className="text-[10px] text-text-muted font-medium">Charges</span>
                </div>
              )}
            </div>
          </div>

          {/* Liste détaillée des postes de charges SYSCOHADA */}
          <div className="flex flex-col gap-space-xs mt-space-xs">
            {expenseBreakdown.length > 0 && totalExpenseVal > 0 ? (
              expenseBreakdown.slice(0, 4).map((item: any, idx: number) => (
                <div
                  key={`exp-item-${idx}`}
                  className="flex items-center justify-between p-2 rounded bg-surface border border-border/70"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 rounded-sm shrink-0 inline-block" style={{ backgroundColor: item.color }} />
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-ink truncate">{item.name}</span>
                      <span className="text-[11px] text-text-muted truncate">Classe 6 SYSCOHADA</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="tnum text-xs font-bold text-ink">{formatCFA(item.value)}</div>
                    <div className="tnum text-[11px] text-text-muted font-medium">{item.percentage}%</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-text-muted bg-surface rounded border border-border">
                Aucune charge d'exploitation enregistrée pour ce mois.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. SECTION RAPPROCHEMENT & FACTURES RÉCENTES */}
      <section aria-label="Gestion opérationnelle et rapprochement" className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Bloc 1 (1 col) : Rémunérations & Salaires */}
        <div className="rounded-lg p-space-md bg-background-secondary border border-border flex flex-col justify-between">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-ink">Rémunérations & Salaires</span>
              <span className="px-2 py-0.5 rounded bg-success/20 text-[#00855A] text-xs font-semibold">
                Validé
              </span>
            </div>
            <p className="text-xs text-text-muted capitalize">
              Bulletins validés du mois en cours ({currentMonthYear})
            </p>
          </div>

          <div className="py-space-md flex flex-col gap-space-sm">
            <div className="tnum text-2xl lg:text-3xl font-bold text-ink tracking-tight">
              {formatCFA(kpis.payrollTotal || 0)}
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Total des salaires nets d'impôts et cotisations CNSS préparés pour virement bancaire et Mobile Money (MTN MoMo Business).
            </p>
            <div className="p-space-sm rounded bg-surface border border-border flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00855A]" />
                <span className="text-xs text-ink font-medium">Trésorerie Classe 5</span>
              </div>
              <span className="tnum text-xs font-bold text-[#00855A]">+4.2%</span>
            </div>
          </div>

          <div className="pt-space-xs flex flex-col gap-2">
            <Link
              href="/paie"
              className="w-full h-9 rounded bg-surface hover:bg-surface-container border border-border text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-colors"
            >
              <span>Consulter le registre de paie</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bloc 2 (2 cols) : Factures récentes */}
        <div className="lg:col-span-2 rounded-lg p-space-md bg-background-secondary border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between pb-space-sm">
            <div>
              <h2 className="text-base font-bold text-ink">Factures récentes</h2>
              <p className="text-xs text-text-muted">Conformité statut e-MECeF DGI Bénin</p>
            </div>
            <Link
              href="/facturation"
              className="text-xs font-bold text-ink underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Toutes les factures
            </Link>
          </div>

          {/* Table des factures récentes */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="h-9 bg-surface border-b border-border">
                  <th className="px-space-sm text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    Réf. • Date
                  </th>
                  <th className="px-space-sm text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    Client (Raison sociale)
                  </th>
                  <th className="px-space-sm text-[11px] font-semibold text-text-muted uppercase tracking-wider text-right">
                    Montant TTC
                  </th>
                  <th className="px-space-sm text-[11px] font-semibold text-text-muted uppercase tracking-wider text-right">
                    Statut e-MECeF
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {invoices.length > 0 ? (
                  invoices.map((inv: any) => {
                    const statusInfo = invoiceStatusMap[inv.status] || {
                      label: inv.status || "Inconnu",
                      badgeCls: "bg-surface border border-border text-text-muted",
                    };
                    return (
                      <tr key={inv.id} className="h-11 border-b border-border/50 hover:bg-surface transition-colors">
                        <td className="px-space-sm whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="tnum font-bold text-ink">{inv.id}</span>
                            <span className="tnum text-[11px] text-text-muted">{formatDate(inv.date)}</span>
                          </div>
                        </td>
                        <td className="px-space-sm font-medium text-ink whitespace-nowrap">
                          {inv.client}
                        </td>
                        <td className="tnum px-space-sm font-bold text-ink text-right whitespace-nowrap">
                          {formatCFA(inv.montantTTC)}
                        </td>
                        <td className="px-space-sm text-right whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${statusInfo.badgeCls}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-text-muted italic">
                      Aucune facture récente enregistrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modales pour les actions */}
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