"use client";

import { useState } from "react";
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { OperationStatusBadge } from "@/components/dashboard/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { JournalEntryModal } from "@/components/accounting/JournalEntryModal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Comptabilite = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [journalFilter, setJournalFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["accounting-entries", debouncedQuery, page, statusFilter, journalFilter],
    queryFn: () => fetcher(`/api/accounting/entries?page=${page}&limit=20${debouncedQuery ? `&search=${debouncedQuery}` : ""}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}${journalFilter !== "all" ? `&journal=${journalFilter}` : ""}`),
  });

  const entries = data || [];

  const lines = entries.flatMap((entry: any) => 
    entry.lines.map((line: any) => ({
      ...line,
      date: entry.date,
      piece: entry.reference,
      status: entry.status,
      entry_id: entry.id
    }))
  );

  const toggleSelectEntry = (id: string) => {
    setSelectedEntries(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkValidate = async () => {
    if (selectedEntries.length === 0) return;
    try {
      const res = await fetch("/api/accounting/entries/bulk-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedEntries }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setSelectedEntries([]);
        queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error("Erreur lors de la validation");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm("Supprimer cette écriture ?")) return;
    try {
      const res = await fetch(`/api/accounting/entries/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const exportCSV = () => {
    const headers = ["Date", "Pièce", "Compte", "Libellé", "Débit", "Crédit", "Statut"];
    const csvLines = lines.map(l => [
      formatDate(l.date),
      l.piece,
      l.account_code,
      l.description,
      l.debit || 0,
      l.credit || 0,
      l.status
    ].join(","));
    
    const blob = new Blob([[headers.join(","), ...csvLines].join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journal-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").map(l => l.split(",").map(c => c.trim()));
      
      // Header check: date,journal,description,account,debit,credit
      // Assuming simple format: Date, Journal, Description, Account, Debit, Credit
      const entriesMap: Record<string, any> = {};

      lines.slice(1).forEach((cols, idx) => {
        if (cols.length < 6) return;
        const [date, journal, desc, account, debit, credit] = cols;
        const key = `${date}-${desc}`;
        if (!entriesMap[key]) {
          entriesMap[key] = { date, journal: journal.toLowerCase(), description: desc, lines: [] };
        }
        entriesMap[key].lines.push({
          account_code: account,
          debit: parseFloat(debit) || 0,
          credit: parseFloat(credit) || 0,
          description: desc
        });
      });

      const entriesToImport = Object.values(entriesMap);
      
      try {
        const res = await fetch("/api/accounting/entries/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entries: entriesToImport }),
        });
        const result = await res.json();
        if (result.success) {
          toast.success(result.message);
          queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        toast.error("Erreur lors de l'importation");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal des opérations"
        subtitle="Toutes vos écritures comptables centralisées"
        actions={
          <>
            <input 
              type="file" 
              id="csv-import" 
              className="hidden" 
              accept=".csv" 
              onChange={handleImportCSV}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById("csv-import")?.click()}
            >
              <Upload className="mr-1 h-4 w-4" /> Importer CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV}><Download className="mr-1 h-4 w-4" /> Exporter</Button>
            <Button 
              size="sm" 
              className="bg-gradient-primary hover:opacity-90"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" /> Nouvelle opération
            </Button>
          </>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap gap-3 border-b border-border p-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher par libellé, compte, pièce…" className="pl-9" />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={journalFilter} 
              onChange={(e) => setJournalFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">Tous les journaux</option>
              <option value="bank">Banque</option>
              <option value="purchases">Achats</option>
              <option value="sales">Ventes</option>
              <option value="payroll">Paie</option>
            </select>

            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon (non comptabilisé)</option>
              <option value="posted">Comptabilisée</option>
              <option value="validated">Validée</option>
            </select>
          </div>

          <Button 
            variant={selectedEntries.length > 0 ? "default" : "outline"} 
            size="sm" 
            disabled={selectedEntries.length === 0}
            onClick={handleBulkValidate}
            className={selectedEntries.length > 0 ? "bg-success hover:bg-success/90" : ""}
          >
            <CheckCircle2 className="mr-1 h-4 w-4" /> Valider sélection ({selectedEntries.length})
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 w-10">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedEntries(entries.filter((e: any) => e.status !== "validated").map((e: any) => e.id));
                      else setSelectedEntries([]);
                    }}
                    checked={selectedEntries.length > 0 && selectedEntries.length === entries.filter((e: any) => e.status !== "validated").length}
                  />
                </th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">N° Pièce</th>
                <th className="px-4 py-3">Compte</th>
                <th className="px-4 py-3">Libellé</th>
                <th className="px-4 py-3 text-right">Débit</th>
                <th className="px-4 py-3 text-right">Crédit</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="border-b border-border"><td colSpan={9} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td></tr>
                ))
              ) : (
                lines.map((op: any, idx: number) => (
                  <tr
                    key={`${op.entry_id}-${op.account_code}-${idx}`}
                    className={cn(
                      "border-b border-border last:border-0 transition hover:bg-muted/30",
                      op.status === "validated" && "bg-success-soft/5",
                      op.status === "draft" && "opacity-80 italic",
                      selectedEntries.includes(op.entry_id) && "bg-primary-soft/50"
                    )}
                  >
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        disabled={op.status === "validated"}
                        checked={selectedEntries.includes(op.entry_id)}
                        onChange={() => toggleSelectEntry(op.entry_id)}
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(op.date)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{op.piece}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{op.account_code}</td>
                    <td className="px-4 py-3 font-medium">{op.description}</td>
                    <td className="px-4 py-3 text-right tabular text-success">{op.debit > 0 ? formatCFA(op.debit) : ""}</td>
                    <td className="px-4 py-3 text-right tabular text-destructive">{op.credit > 0 ? formatCFA(op.credit) : ""}</td>
                    <td className="px-4 py-3"><OperationStatusBadge status={op.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end items-center gap-1">
                        {op.status === "draft" && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteEntry(op.entry_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border p-3 text-xs text-muted-foreground">
          <span>{lines.length} lignes affichées</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Précédent</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={entries.length < 20}>Suivant</Button>
          </div>
        </div>
      </div>

      <JournalEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
        }}
      />
    </div>
  );
};

export default Comptabilite;