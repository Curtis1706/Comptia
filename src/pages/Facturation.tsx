import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, Download, Mail, Eye, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { InvoiceStatusBadge } from "@/components/dashboard/StatusBadge";
import { invoices, quotes, credits } from "@/data/mock";
import { formatEUR, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "factures", label: "Factures" },
  { id: "devis", label: "Devis" },
  { id: "avoirs", label: "Avoirs" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export const Facturation = () => {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab) || "factures";
  const [query, setQuery] = useState("");

  const setTab = (t: Tab) => {
    const p = new URLSearchParams(params);
    if (t === "factures") p.delete("tab");
    else p.set("tab", t);
    setParams(p, { replace: true });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facturation"
        subtitle="Gérez vos factures, devis et avoirs"
        actions={
          <Button size="sm" className="bg-gradient-primary hover:opacity-90">
            <Plus className="mr-1 h-4 w-4" /> {tab === "devis" ? "Nouveau devis" : tab === "avoirs" ? "Nouvel avoir" : "Nouvelle facture"}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "En attente", value: formatEUR(7400), tone: "info" },
          { label: "En retard", value: formatEUR(4200), tone: "warning" },
          { label: "Encaissé (mois)", value: formatEUR(38600), tone: "success" },
          { label: "Total émis", value: formatEUR(125400), tone: "primary" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-xl font-semibold tabular">{s.value}</p>
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
                tab === t.id ? "bg-card text-primary" : "text-muted-foreground hover:text-foreground",
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
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher client, référence…" className="pl-9" />
          </div>
          <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" /> Exporter</Button>
        </div>

        {tab === "factures" && <InvoiceTable query={query} />}
        {tab === "devis" && <QuotesTable />}
        {tab === "avoirs" && <CreditsTable />}
      </div>
    </div>
  );
};

const InvoiceTable = ({ query }: { query: string }) => {
  const filtered = invoices.filter((i) => [i.id, i.client].some((s) => s.toLowerCase().includes(query.toLowerCase())));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Référence</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Échéance</th>
            <th className="px-4 py-3 text-right">Montant TTC</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((inv) => (
            <tr key={inv.id} className="border-b border-border last:border-0 transition hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs">{inv.id}</td>
              <td className="px-4 py-3 font-medium">{inv.client}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.date)}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.dueDate)}</td>
              <td className="px-4 py-3 text-right font-semibold tabular">{formatEUR(inv.montantTTC)}</td>
              <td className="px-4 py-3"><InvoiceStatusBadge status={inv.status} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Mail className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Send className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const QuotesTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <th className="px-4 py-3">Référence</th>
          <th className="px-4 py-3">Client</th>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3 text-right">Montant TTC</th>
          <th className="px-4 py-3">Statut</th>
        </tr>
      </thead>
      <tbody>
        {quotes.map((q) => (
          <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/30">
            <td className="px-4 py-3 font-mono text-xs">{q.id}</td>
            <td className="px-4 py-3 font-medium">{q.client}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(q.date)}</td>
            <td className="px-4 py-3 text-right font-semibold tabular">{formatEUR(q.montantTTC)}</td>
            <td className="px-4 py-3">
              <span className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                q.status === "accepte" && "bg-success-soft text-success",
                q.status === "envoye" && "bg-info-soft text-info",
                q.status === "refuse" && "bg-destructive-soft text-destructive",
              )}>
                {q.status === "accepte" ? "Accepté" : q.status === "envoye" ? "Envoyé" : "Refusé"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CreditsTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <th className="px-4 py-3">Référence</th>
          <th className="px-4 py-3">Client</th>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Motif</th>
          <th className="px-4 py-3 text-right">Montant</th>
        </tr>
      </thead>
      <tbody>
        {credits.map((c) => (
          <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
            <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
            <td className="px-4 py-3 font-medium">{c.client}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(c.date)}</td>
            <td className="px-4 py-3 text-muted-foreground">{c.motif}</td>
            <td className="px-4 py-3 text-right font-semibold tabular text-destructive">-{formatEUR(c.montantTTC)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Facturation;