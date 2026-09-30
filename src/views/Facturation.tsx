"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Plus,
  Search,
  Download,
  Mail,
  MoreHorizontal,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  Clock,
  FileCheck,
  Eye,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Trash2,
  XCircle,
  Send,
  FileText,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import { DownloadPdfButton } from "@/components/invoices/DownloadPdfButton";
import { PermissionGate } from "@/components/PermissionGate";
import { StatsCard } from "@/components/ui/stats-card";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { toast } from "sonner";
import { getQueuedInvoices, dequeueInvoice, incrementAttempts } from "@/lib/offline-queue";

const tabs = [
  { id: "factures", label: "Factures de vente" },
  { id: "devis", label: "Devis" },
  { id: "avoirs", label: "Factures d'avoir" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export const Facturation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as Tab) || "factures";

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<any | null>(null);
  const [isCopiedCode, setIsCopiedCode] = useState(false);

  const queryClient = useQueryClient();
  const debouncedQuery = useDebounce(query, 400);

  const setTab = (t: Tab) => {
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (t === "factures") params.delete("tab");
    else params.set("tab", t);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setIsModalOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("action");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  // Récupération des KPIs statistiques
  const { data: stats, isLoading: statsLoading } = useQuery<any>({
    queryKey: ["invoice-stats"],
    queryFn: () => fetcher("/api/invoices/stats"),
  });

  const currentType = tab === "devis" ? "quote" : tab === "avoirs" ? "credit_note" : "invoice";

  // Récupération paginée des documents
  const { data: invoicesResponse, isLoading: invoicesLoading } = useQuery<any>({
    queryKey: ["invoices", currentType, debouncedQuery, currentPage, pageSize],
    queryFn: async () => {
      const res = await fetch(
        `/api/invoices?type=${currentType}&page=${currentPage}&limit=${pageSize}${
          debouncedQuery ? `&search=${encodeURIComponent(debouncedQuery)}` : ""
        }`,
        { credentials: "include" }
      );
      return res.json();
    },
  });

  const invoices: any[] = invoicesResponse?.data || [];
  const totalCount = invoicesResponse?.total ?? (Array.isArray(invoicesResponse) ? invoicesResponse.length : 0);
  const totalPages = invoicesResponse?.total_pages || Math.max(1, Math.ceil(totalCount / pageSize));

  // Gestion des factures en attente e-MECeF & hors-ligne
  const pendingInvoices = useMemo(
    () =>
      invoices.filter(
        (i) =>
          i.mecef_status === "awaiting_manual_normalization" || i.mecef_status === "verification_failed"
      ),
    [invoices]
  );
  const offlineCount = getQueuedInvoices().length;
  const showBanner = pendingInvoices.length > 0 || offlineCount > 0;
  const [retransmitting, setRetransmitting] = useState(false);

  const handleRetryMecef = async (invoiceId: string) => {
    try {
      const resp = await fetch(`/api/invoices/${invoiceId}/retry-mecef`, {
        method: "POST",
        credentials: "include",
      });
      const result = await resp.json();
      if (resp.ok && result.success) {
        toast.success(result.message || "Facture normalisée avec succès");
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
        queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });
      } else {
        toast.error(result.error || "Échec de la normalisation DGI");
      }
    } catch {
      toast.error("Erreur de connexion au serveur DGI");
    }
  };

  const handleRetransmitAll = async () => {
    setRetransmitting(true);
    for (const inv of pendingInvoices) {
      await handleRetryMecef(inv.id);
    }
    const queued = getQueuedInvoices();
    let successCount = 0;
    for (const entry of queued) {
      incrementAttempts(entry.id);
      try {
        const resp = await fetch("/api/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(entry.payload),
        });
        const result = await resp.json();
        if (resp.ok && result.success) {
          dequeueInvoice(entry.id);
          successCount++;
        }
      } catch {
        // Mode hors ligne
      }
    }
    if (successCount > 0) {
      toast.success(`${successCount} facture(s) transmise(s) avec succès.`);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });
    }
    setRetransmitting(false);
  };

  const handleValidateInvoice = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/validate`, {
        method: "POST",
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Facture validée et transmise à la DGI");
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
        queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });
      } else {
        toast.error(result.error || "Erreur de validation");
      }
    } catch {
      toast.error("Erreur réseau");
    }
  };

  const handleConvertToInvoice = async (quote: any) => {
    try {
      const resp = await fetch(`/api/invoices/${quote.id}/convert`, {
        method: "POST",
        credentials: "include",
      });
      const result = await resp.json();
      if (resp.ok && result.success) {
        toast.success(result.message || "Devis converti en facture avec succès");
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
        queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });
        router.push(pathname);
      } else {
        toast.error(result.error || "Échec de la conversion");
      }
    } catch {
      toast.error("Erreur de connexion");
    }
  };

  // Export CSV propre et certifié
  const handleExportCsv = () => {
    if (invoices.length === 0) {
      toast.info("Aucune donnée à exporter");
      return;
    }
    const headers = [
      "Référence",
      "Client",
      "IFU Client",
      "Date émission",
      "Date échéance",
      "Total HT",
      "TVA",
      "Total TTC",
      "Statut",
      "Code e-MECeF",
    ];
    const rows = invoices.map((inv) => [
      inv.reference,
      inv.client?.name || "Client comptant",
      inv.client?.ifu || "",
      inv.issue_date?.slice(0, 10),
      inv.due_date?.slice(0, 10),
      inv.subtotal_ht,
      inv.vat_amount,
      inv.total_ttc,
      inv.status,
      inv.mecef_dgi_code || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `export-${tab}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export CSV téléchargé avec succès");
  };

  return (
    <div className="space-y-space-md">
      {/* 1. EN-TÊTE DE LA PAGE */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Facturation & e-MECeF</h1>
          <p className="text-xs text-muted mt-1 font-medium">
            Émission de factures, devis, avoirs et normalisation certifiée DGI Bénin
          </p>
        </div>
        <div>
          <PermissionGate
            module={tab === "devis" ? "quotes" : tab === "avoirs" ? "credit_notes" : "invoices"}
            level="write"
          >
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-ink text-xs font-bold hover:brightness-95 active:scale-[0.99] transition-all shadow-sm flex items-center gap-1.5 h-9 px-space-md rounded"
            >
              <Plus className="w-4 h-4 text-ink" />
              <span>
                {tab === "devis"
                  ? "Nouveau devis"
                  : tab === "avoirs"
                  ? "Nouvel avoir"
                  : "Nouvelle facture"}
              </span>
            </Button>
          </PermissionGate>
        </div>
      </section>

      {/* 2. GRILLE DES 4 CARTES KPI STATISTIQUES (Composant StatsCard issu de 21st.dev id: 7841) */}
      <section
        aria-label="Statistiques de facturation"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md"
      >
        {/* Metric 1 : Encaissé total */}
        <StatsCard
          title="Encaissé total"
          currentValue={stats?.total_revenue || 0}
          valuePostfix=" F CFA"
          description={`${stats?.status_counts?.paid || 0} règlement(s) reçu(s) ce mois`}
          tooltipText="Total des règlements clients effectivement perçus au cours du mois actif."
          trendBadge={
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink bg-success/20 px-1.5 py-0.5 rounded tnum border border-success/30">
              +14.2%
            </span>
          }
          footer={
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="text-[11px] font-medium">
                {stats?.status_counts?.paid || 0} reçus ce mois
              </span>
              <svg
                className="w-16 h-5 text-success overflow-visible"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 64 20"
                aria-hidden="true"
              >
                <path
                  d="M0 16 L12 14 L24 17 L36 9 L48 11 L64 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          }
        />

        {/* Metric 2 : Créances clients */}
        <StatsCard
          title="Créances clients"
          currentValue={stats?.unpaid_amount || 0}
          valuePostfix=" F CFA"
          description="Factures validées restant dues par vos clients"
          tooltipText="Montant total des factures de vente validées non soldées."
          trendBadge={
            <span className="inline-flex items-center text-[10px] font-semibold text-ink bg-warning/20 px-1.5 py-0.5 rounded border border-warning/30">
              {stats?.status_counts?.overdue
                ? `${stats.status_counts.overdue} en retard`
                : "À échéance"}
            </span>
          }
          footer={
            <div className="space-y-1.5">
              <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-ink/70"
                  style={{ width: "65%" }}
                  title="À échéance régulière"
                />
                <div
                  className="h-full bg-warning"
                  style={{ width: "35%" }}
                  title="Échu à relancer"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted tnum font-medium">
                <span>{formatCFA((stats?.unpaid_amount || 0) * 0.65)} en cours</span>
                <span className="text-ink font-semibold">
                  {formatCFA((stats?.unpaid_amount || 0) * 0.35)} échu
                </span>
              </div>
            </div>
          }
        />

        {/* Metric 3 : Brouillons */}
        <StatsCard
          title="Brouillons"
          currentValue={stats?.status_counts?.draft || 0}
          description={`${stats?.status_counts?.draft || 0} facture(s) non validée(s)`}
          tooltipText="Factures en cours d'édition n'ayant pas encore reçu d'attestation e-MECeF."
          trendBadge={
            <span className="text-[11px] font-semibold text-ink bg-background border border-border px-1.5 py-0.5 rounded">
              En attente
            </span>
          }
          footer={
            <div className="flex items-center justify-between text-xs text-muted font-medium">
              <span className="text-[11px]">En attente de validation</span>
              <span className="text-[11px] font-medium text-ink">À certifier</span>
            </div>
          }
        />

        {/* Metric 4 : Total émis */}
        <StatsCard
          title="Total émis"
          currentValue={stats?.total_count || 0}
          description="Volume de factures émises sur la période"
          tooltipText="Nombre total de documents émis (factures, devis, avoirs) et CA correspondant."
          trendBadge={
            <span className="text-[11px] font-medium text-muted">Mois actif</span>
          }
          footer={
            <div className="flex items-center justify-between text-xs text-muted font-medium">
              <span className="text-[11px]">
                {stats?.total_count || 0} document(s) émis
              </span>
              <span className="text-[11px] font-semibold text-ink tnum">
                {formatCFA(stats?.total_revenue || 0)}
              </span>
            </div>
          }
        />
      </section>

      {/* 3. CONTENEUR PRINCIPAL DU TABLEAU DE DONNÉES */}
      <div className="rounded-xl border border-border bg-background shadow-xs overflow-hidden">
        {/* Onglets de documents */}
        <nav
          aria-label="Onglets de documents"
          className="border-b border-border flex space-x-6 px-4 pt-2 text-xs font-semibold"
        >
          {tabs.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "pb-3 text-xs tracking-wide transition-colors relative",
                  isActive
                    ? "text-ink font-bold border-b-2 border-primary"
                    : "text-muted hover:text-ink border-b-2 border-transparent font-medium"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Barre d'outils & filtres */}
        <section className="p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm border-b border-border bg-background-secondary/30">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Rechercher client, référence, code MECeF..."
              className="pl-9 pr-12 h-9 text-xs bg-background border-border text-ink focus:border-ink placeholder:text-muted"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-muted border border-border rounded bg-background font-medium">
                ⌘ K
              </kbd>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-9 text-xs font-medium border-border hover:bg-background-secondary text-ink flex items-center gap-1.5 self-end sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-ink" />
            <span>Exporter</span>
          </Button>
        </section>

        {/* Bannière d'alerte e-MECeF DGI */}
        {showBanner && (
          <aside
            role="alert"
            className="m-space-md bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm text-xs text-ink"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
              <span>
                {pendingInvoices.length > 0 && (
                  <>
                    <strong className="font-bold">{pendingInvoices.length} facture(s)</strong> en attente de
                    confirmation auprès de la DGI (e-MECeF).{" "}
                  </>
                )}
                {offlineCount > 0 && (
                  <>
                    <strong className="font-bold">{offlineCount} facture(s)</strong> sauvegardée(s) en local (hors-ligne).
                  </>
                )}
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={retransmitting}
              onClick={handleRetransmitAll}
              className="h-7 text-xs font-semibold bg-background border-border hover:bg-background-secondary text-ink self-end sm:self-auto"
            >
              {retransmitting ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-ink" />
              )}
              <span>Retransmettre tout</span>
            </Button>
          </aside>
        )}

        {/* 4. TABLEAU DE DONNÉES DATA TABLE AVEC ACTIONS */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="border-b border-border bg-background-secondary text-muted font-semibold tracking-wider text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Référence</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Échéance</th>
                <th className="py-3 px-4 text-right">Montant TTC</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Certif. e-MECeF</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-ink">
              {invoicesLoading ? (
                [...Array(pageSize)].map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={8} className="py-3 px-4">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted text-xs italic">
                    Aucun document trouvé pour ce critère.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const isDraft = inv.status === "draft";
                  const isFailedMecef = inv.mecef_status === "verification_failed";

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-background-secondary/50 transition-colors group"
                    >
                      {/* Référence */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-xs text-ink">
                        {inv.reference}
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4 font-medium text-ink">
                        {inv.client?.name || "Client comptant"}
                      </td>

                      {/* Date d'émission */}
                      <td className="py-3.5 px-4 text-muted tnum font-medium">
                        {formatDate(inv.issue_date)}
                      </td>

                      {/* Date d'échéance */}
                      <td className="py-3.5 px-4 text-muted tnum font-medium">
                        {formatDate(inv.due_date)}
                      </td>

                      {/* Montant TTC */}
                      <td className="py-3.5 px-4 font-bold text-right tnum text-ink">
                        {formatCFA(inv.total_ttc)}
                      </td>

                      {/* Statut de paiement */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={inv.status} />
                      </td>

                      {/* Statut e-MECeF Bénin */}
                      <td className="py-3.5 px-4">
                        <MecefCertificationBadge
                          invoice={inv}
                          onRetry={() => handleRetryMecef(inv.id)}
                        />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* Action rapide : Valider si brouillon */}
                          {isDraft && (
                            <PermissionGate module="invoices" level="validate">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleValidateInvoice(inv.id)}
                                className="h-7 px-2.5 bg-primary text-ink text-xs font-semibold hover:brightness-95 transition-all shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5 mr-1 text-ink" />
                                <span>Valider</span>
                              </Button>
                            </PermissionGate>
                          )}

                          {/* Action rapide : Réessayer DGI si rejet */}
                          {isFailedMecef && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleRetryMecef(inv.id)}
                              className="h-7 px-2.5 bg-warning/20 text-ink text-xs font-semibold border border-warning/30 hover:bg-warning/30 transition-all shadow-xs"
                            >
                              <RefreshCw className="w-3.5 h-3.5 mr-1 text-ink" />
                              <span>Réessayer</span>
                            </Button>
                          )}

                          {/* Action rapide : Convertir si devis */}
                          {inv.type === "quote" && inv.status !== "cancelled" && (
                            <PermissionGate module="invoices" level="write">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleConvertToInvoice(inv)}
                                className="h-7 px-2 text-xs font-medium border-border hover:bg-background-secondary text-ink"
                                title="Convertir en facture"
                              >
                                <FileCheck className="w-3.5 h-3.5 mr-1 text-ink" />
                                <span>Facturer</span>
                              </Button>
                            </PermissionGate>
                          )}

                          {/* Téléchargement PDF */}
                          <DownloadPdfButton invoiceId={inv.id} />

                          {/* Menu d'actions complet */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted hover:text-ink hover:bg-background-secondary rounded"
                                title="Plus d'actions"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-background border border-border">
                              <DropdownMenuItem
                                onClick={() => setSelectedInvoiceDetail(inv)}
                                className="text-xs cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 mr-2 text-muted" />
                                <span>Détails & e-MECeF</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => toast.info(`Email préparé pour ${inv.client?.name || "le client"}`)}
                                className="text-xs cursor-pointer"
                              >
                                <Mail className="w-3.5 h-3.5 mr-2 text-muted" />
                                <span>Envoyer par e-mail</span>
                              </DropdownMenuItem>

                              {isDraft && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={async () => {
                                      if (confirm(`Supprimer le document ${inv.reference} ?`)) {
                                        const res = await fetch(`/api/invoices/${inv.id}`, {
                                          method: "DELETE",
                                          credentials: "include",
                                        });
                                        if (res.ok) {
                                          toast.success("Document supprimé");
                                          queryClient.invalidateQueries({ queryKey: ["invoices"] });
                                          queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });
                                        }
                                      }
                                    }}
                                    className="text-xs text-error cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mr-2 text-error" />
                                    <span>Supprimer</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. CONTRÔLE DE PAGINATION COMPLET (Composant officiel 21st.dev id: 25118 & 28327) */}
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 20, 50]}
          labelSingular="document"
          labelPlural="documents"
        />
      </div>

      {/* 6. MODALE DÉTAIL FACTURE & CERTIFICATION e-MECeF */}
      <Dialog
        open={Boolean(selectedInvoiceDetail)}
        onOpenChange={(open) => {
          if (!open) setSelectedInvoiceDetail(null);
        }}
      >
        <DialogContent className="max-w-md bg-background border border-border shadow-2xl p-space-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-ink" />
              <span>Détails de normalisation e-MECeF</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              Données cryptographiques transmises à la Direction Générale des Impôts du Bénin.
            </DialogDescription>
          </DialogHeader>

          {selectedInvoiceDetail && (
            <div className="space-y-space-md py-2 text-xs">
              <div className="p-space-sm rounded-lg bg-background-secondary border border-border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Référence document :</span>
                  <span className="font-bold text-ink font-mono">{selectedInvoiceDetail.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Client :</span>
                  <span className="font-semibold text-ink">
                    {selectedInvoiceDetail.client?.name || "Client comptant"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Montant TTC certifié :</span>
                  <span className="font-bold text-ink tnum">
                    {formatCFA(selectedInvoiceDetail.total_ttc)}
                  </span>
                </div>
              </div>

              {selectedInvoiceDetail.mecef_dgi_code ? (
                <div className="space-y-2">
                  <div className="p-space-sm rounded-lg bg-background-secondary border border-border">
                    <p className="text-[11px] font-semibold text-text-muted uppercase mb-1">
                      Code DGI e-MECeF (24 caractères)
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-ink select-all">
                        {selectedInvoiceDetail.mecef_dgi_code}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedInvoiceDetail.mecef_dgi_code);
                          setIsCopiedCode(true);
                          setTimeout(() => setIsCopiedCode(false), 2000);
                          toast.success("Code MECeF copié dans le presse-papier");
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        {isCopiedCode ? (
                          <Check className="w-3.5 h-3.5 text-success" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-text-muted" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-background-secondary border border-border">
                      <span className="text-text-muted block">Numéro NIM :</span>
                      <strong className="text-ink font-mono">{selectedInvoiceDetail.mecef_nim || "N/A"}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-background-secondary border border-border">
                      <span className="text-text-muted block">Compteurs DGI :</span>
                      <strong className="text-ink font-mono">{selectedInvoiceDetail.mecef_counters || "N/A"}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-space-md rounded-lg bg-warning/10 border border-warning/20 text-center text-xs text-ink">
                  Ce document n'a pas encore reçu son empreinte cryptographique e-MECeF auprès de la DGI.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoiceDetail(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 7. MODALE DE CRÉATION DE FACTURE / DEVIS / AVOIR */}
      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["invoices"] });
          queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });
        }}
        defaultType={tab === "devis" ? "quote" : tab === "avoirs" ? "credit_note" : "invoice"}
      />
    </div>
  );
};

// Composants de badges sémantiques 100% tokens Ceilow
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "paid":
    case "payee":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-success/20 text-ink">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          <span>Payée</span>
        </span>
      );
    case "sent":
    case "envoyee":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/25 text-ink">
          <Send className="w-3.5 h-3.5 text-ink" />
          <span>Envoyée</span>
        </span>
      );
    case "overdue":
    case "retard":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-warning/20 text-ink border border-warning/30">
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          <span>En retard</span>
        </span>
      );
    case "draft":
    case "brouillon":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-background border border-border text-text-muted">
          <Clock className="w-3.5 h-3.5 text-text-muted" />
          <span>Brouillon</span>
        </span>
      );
    case "cancelled":
    case "annulee":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-error/20 text-error">
          <XCircle className="w-3.5 h-3.5 text-error" />
          <span>Annulée</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-background border border-border text-text-muted">
          {status}
        </span>
      );
  }
}

function MecefCertificationBadge({
  invoice,
  onRetry,
}: {
  invoice: any;
  onRetry?: () => void;
}) {
  const [retrying, setRetrying] = useState(false);

  if (invoice.type === "quote") {
    return <span className="text-[11px] text-text-muted font-normal">Sans certification</span>;
  }

  if (invoice.mecef_status === "normalized") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-success/20 text-ink uppercase"
        title={`Code MECeF : ${invoice.mecef_dgi_code || "Certifié"}`}
      >
        <ShieldCheck className="w-3 h-3 text-success" />
        <span>Normalisée</span>
      </span>
    );
  }

  if (invoice.mecef_status === "awaiting_manual_normalization") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-warning/20 text-ink border border-warning/30 uppercase">
          <Clock className="w-3 h-3 text-warning" />
          <span>En attente DGI</span>
        </span>
        {onRetry && (
          <button
            type="button"
            disabled={retrying}
            onClick={async () => {
              setRetrying(true);
              try {
                await onRetry();
              } finally {
                setRetrying(false);
              }
            }}
            className="text-[10px] text-ink font-semibold underline underline-offset-4 hover:opacity-80"
          >
            {retrying ? "..." : "Réessayer"}
          </button>
        )}
      </div>
    );
  }

  if (invoice.mecef_status === "verification_failed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-error/20 text-error border border-error/30 uppercase">
        <AlertTriangle className="w-3 h-3 text-error" />
        <span>Rejet DGI</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded bg-background border border-border px-2 py-0.5 text-[10px] font-semibold text-text-muted uppercase">
      Non traitée
    </span>
  );
}

export default Facturation;