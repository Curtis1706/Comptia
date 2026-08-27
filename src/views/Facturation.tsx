"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { InvoiceStatusBadge } from "@/components/dashboard/StatusBadge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import { DownloadPdfButton } from "@/components/invoices/DownloadPdfButton";
import { toast } from "sonner";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const setTab = (t: Tab) => {
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

  const { data: stats, isLoading: statsLoading } = useQuery<any>({
    queryKey: ["invoice-stats"],
    queryFn: () => fetcher("/api/invoices/stats"),
  });

  const debouncedQuery = useDebounce(query, 500);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facturation & e-MECeF"
        subtitle="Émission de factures, devis, avoirs et normalisation certifiée DGI Bénin"
        actions={
          <Button
            size="sm"
            className="bg-gradient-primary hover:opacity-90 shadow-glow"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="mr-1.5 h-4 w-4" />{" "}
            {tab === "devis"
              ? "Nouveau devis"
              : tab === "avoirs"
              ? "Nouvel avoir"
              : "Nouvelle facture"}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Encaissé total", value: formatCFA(stats?.total_revenue || 0) },
          { label: "Créances clients", value: formatCFA(stats?.unpaid_amount || 0) },
          { label: "Brouillons", value: stats?.status_counts?.draft || 0 },
          { label: "Total émis", value: stats?.total_count || 0 },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            {statsLoading ? (
              <Skeleton className="mt-1 h-7 w-24" />
            ) : (
              <p className="mt-1 font-display text-xl font-semibold tabular">
                {typeof s.value === "string" ? s.value : s.value}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 pt-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative rounded-t-md px-4 py-2.5 text-sm font-medium transition",
                tab === t.id ? "bg-card text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher client, référence, code MECeF…"
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" /> Exporter
          </Button>
        </div>

        {tab === "factures" && <InvoiceTable query={debouncedQuery} />}
        {tab === "devis" && <InvoicesList type="quote" query={debouncedQuery} />}
        {tab === "avoirs" && <InvoicesList type="credit_note" query={debouncedQuery} />}
      </div>

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

export function MecefBadge({ invoice, onRetry }: { invoice: any; onRetry?: () => void }) {
  const [retrying, setRetrying] = useState(false);

  if (invoice.type === "quote") return null;

  if (invoice.mecef_status === "normalized") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase"
        title={`Code MECeF/DGI : ${invoice.mecef_dgi_code || ""}`}
      >
        <ShieldCheck className="h-3 w-3" /> Normalisée
      </span>
    );
  }

  if (invoice.mecef_status === "awaiting_manual_normalization") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 uppercase">
          ⏳ En attente DGI
        </span>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-1.5 text-[10px] text-amber-700"
            disabled={retrying}
            onClick={async () => {
              setRetrying(true);
              try {
                await onRetry();
              } finally {
                setRetrying(false);
              }
            }}
          >
            {retrying ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Réessayer
          </Button>
        )}
      </div>
    );
  }

  if (invoice.mecef_status === "verification_failed") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-destructive-soft border border-destructive/20 px-2 py-0.5 text-[10px] font-bold text-destructive uppercase">
          <AlertTriangle className="h-3 w-3" /> Rejet DGI
        </span>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-1.5 text-[10px] text-destructive"
            disabled={retrying}
            onClick={async () => {
              setRetrying(true);
              try {
                await onRetry();
              } finally {
                setRetrying(false);
              }
            }}
          >
            {retrying ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Réessayer
          </Button>
        )}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-muted border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
      Non traitée
    </span>
  );
}

const InvoiceTable = ({ query }: { query: string }) => {
  const queryClient = useQueryClient();
  const { data: res, isLoading } = useQuery<any>({
    queryKey: ["invoices", query],
    queryFn: () => fetcher(`/api/invoices?type=invoice${query ? `&search=${query}` : ""}`),
  });

  const invoices: any[] = Array.isArray(res) ? res : res?.data || [];

  const handleRetryMecef = async (invoiceId: string) => {
    try {
      const resp = await fetch(`/api/invoices/${invoiceId}/retry-mecef`, { method: "POST" });
      const result = await resp.json();
      if (resp.ok && result.success) {
        toast.success(result.message || "Facture normalisée avec succès");
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
      } else {
        toast.error(result.error || "Échec de la normalisation DGI");
      }
    } catch {
      toast.error("Erreur de connexion au serveur DGI");
    }
  };

  const pendingInvoices = invoices.filter(
    (i) => i.mecef_status === "awaiting_manual_normalization" || i.mecef_status === "verification_failed"
  );

  return (
    <div className="overflow-x-auto space-y-3">
      {pendingInvoices.length > 0 && (
        <div className="m-4 flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>{pendingInvoices.length} facture(s)</strong> en attente de confirmation auprès de la DGI (e-MECeF).
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs bg-white text-amber-800 border-amber-400 hover:bg-amber-50"
            onClick={async () => {
              for (const inv of pendingInvoices) {
                await handleRetryMecef(inv.id);
              }
            }}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retransmettre tout
          </Button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Référence</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Échéance</th>
            <th className="px-4 py-3 text-right">Montant TTC</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Certif. e-MECeF</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border">
                <td colSpan={8} className="px-4 py-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              </tr>
            ))
          ) : invoices.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-8 text-center text-muted-foreground text-xs">
                Aucune facture trouvée.
              </td>
            </tr>
          ) : (
            invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-border last:border-0 transition hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs font-semibold">{inv.reference}</td>
                <td className="px-4 py-3 font-medium">{inv.client?.name || "Client Comptant"}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.issue_date)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.due_date)}</td>
                <td className="px-4 py-3 text-right font-semibold tabular">{formatCFA(inv.total_ttc)}</td>
                <td className="px-4 py-3">
                  <InvoiceStatusBadge status={inv.status} />
                </td>
                <td className="px-4 py-3">
                  <MecefBadge invoice={inv} onRetry={() => handleRetryMecef(inv.id)} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {inv.status === "draft" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-success hover:bg-success/10"
                        title="Valider et normaliser"
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/invoices/${inv.id}/validate`, { method: "POST" });
                            const result = await res.json();
                            if (result.success) {
                              toast.success(result.message);
                              queryClient.invalidateQueries({ queryKey: ["invoices"] });
                            } else {
                              toast.error(result.error);
                            }
                          } catch {
                            toast.error("Erreur lors de la validation");
                          }
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <DownloadPdfButton invoiceId={inv.id} />
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const InvoicesList = ({ type, query }: { type: string; query: string }) => {
  const queryClient = useQueryClient();
  const { data: res, isLoading } = useQuery<any>({
    queryKey: ["invoices", type, query],
    queryFn: () => fetcher(`/api/invoices?type=${type}${query ? `&search=${query}` : ""}`),
  });

  const items: any[] = Array.isArray(res) ? res : res?.data || [];

  const handleRetryMecef = async (invoiceId: string) => {
    try {
      const resp = await fetch(`/api/invoices/${invoiceId}/retry-mecef`, { method: "POST" });
      const result = await resp.json();
      if (resp.ok && result.success) {
        toast.success(result.message || "Avoir normalisé avec succès");
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
      } else {
        toast.error(result.error || "Échec normalisation");
      }
    } catch {
      toast.error("Erreur de connexion");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Référence</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-right">Montant TTC</th>
            <th className="px-4 py-3">Statut</th>
            {type === "credit_note" && <th className="px-4 py-3">Certif. e-MECeF</th>}
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border">
                <td colSpan={type === "credit_note" ? 7 : 6} className="px-4 py-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              </tr>
            ))
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={type === "credit_note" ? 7 : 6} className="p-8 text-center text-muted-foreground text-xs">
                Aucun document trouvé.
              </td>
            </tr>
          ) : (
            items.map((q) => (
              <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs font-semibold">{q.reference}</td>
                <td className="px-4 py-3 font-medium">{q.client?.name || "Client Comptant"}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(q.issue_date)}</td>
                <td className="px-4 py-3 font-semibold tabular text-right">{formatCFA(q.total_ttc)}</td>
                <td className="px-4 py-3">
                  <InvoiceStatusBadge status={q.status} />
                </td>
                {type === "credit_note" && (
                  <td className="px-4 py-3">
                    <MecefBadge invoice={q} onRetry={() => handleRetryMecef(q.id)} />
                  </td>
                )}
                <td className="px-4 py-3 text-right flex justify-end gap-1">
                  <DownloadPdfButton invoiceId={q.id} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Facturation;