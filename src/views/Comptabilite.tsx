"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  CheckCircle2,
  Trash2,
  Eye,
  Copy,
  FileText,
  AlertCircle,
} from "lucide-react";
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
import { PermissionGate } from "@/components/PermissionGate";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { detectAndParseCSV } from "@/lib/csv-parser";
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
  DialogFooter,
} from "@/components/ui/dialog";

const JOURNAL_LABELS: Record<string, string> = {
  purchases: "Achats (HA)",
  sales: "Ventes (VT)",
  bank: "Banque (BQ)",
  cash: "Caisse (CA)",
  payroll: "Paie (OD)",
};

export const Comptabilite = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [journalFilter, setJournalFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [selectedEntryDetail, setSelectedEntryDetail] = useState<any | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<any | null>(null);
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
      entry_id: entry.id,
      journal: entry.journal,
      entry: entry,
    }))
  );

  const toggleSelectEntry = (id: string) => {
    setSelectedEntries(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copié dans le presse-papier`);
    }
  };

  const handleValidateSingle = async (id: string) => {
    try {
      const res = await fetch(`/api/accounting/entries/${id}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Écriture validée définitivement");
        queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
        if (selectedEntryDetail?.id === id) {
          setSelectedEntryDetail(null);
        }
      } else {
        toast.error(result.error || "Erreur de validation");
      }
    } catch (e) {
      toast.error("Erreur lors de la validation de l'écriture");
    }
  };

  const handleBulkValidate = async () => {
    if (selectedEntries.length === 0) return;
    try {
      const res = await fetch("/api/accounting/entries/bulk-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
    try {
      const res = await fetch(`/api/accounting/entries/${id}`, { method: "DELETE", credentials: "include" });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Écriture supprimée");
        queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
        if (selectedEntryDetail?.id === id) {
          setSelectedEntryDetail(null);
        }
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
      if (!text || !text.trim()) {
        toast.error("Le fichier CSV est vide");
        return;
      }

      const parseResult = detectAndParseCSV(text);
      if (parseResult.entries.length === 0) {
        toast.error("Aucune écriture valide n'a pu être extraite du fichier CSV");
        return;
      }

      try {
        const res = await fetch("/api/accounting/entries/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ entries: parseResult.entries }),
        });
        const result = await res.json();
        if (result.success) {
          const count = result.data?.count ?? parseResult.entries.length;
          toast.success(`${count} écriture${count > 1 ? "s" : ""} importée${count > 1 ? "s" : ""} avec succès`);
          queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
        } else {
          toast.error(result.error || "Erreur lors de l'importation");
        }
      } catch (err) {
        toast.error("Erreur de connexion lors de l'importation");
      } finally {
        event.target.value = "";
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
            <PermissionGate module="accounting_entries" level="write">
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
            </PermissionGate>
            <Button variant="outline" size="sm" onClick={exportCSV}><Download className="mr-1 h-4 w-4" /> Exporter</Button>
            <PermissionGate module="accounting_entries" level="write">
              <Button 
                size="sm" 
                className="bg-gradient-primary hover:opacity-90 shadow-glow"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-1.5 h-4 w-4" /> Nouvelle opération
              </Button>
            </PermissionGate>
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

          <PermissionGate module="accounting_entries" level="validate">
            <Button 
              variant={selectedEntries.length > 0 ? "default" : "outline"} 
              size="sm" 
              disabled={selectedEntries.length === 0}
              onClick={handleBulkValidate}
              className={selectedEntries.length > 0 ? "bg-success hover:bg-success/90" : ""}
            >
              <CheckCircle2 className="mr-1 h-4 w-4" /> Valider sélection ({selectedEntries.length})
            </Button>
          </PermissionGate>
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
                      op.status === "validated" && "bg-success/5",
                      op.status === "draft" && "opacity-80 italic",
                      selectedEntries.includes(op.entry_id) && "bg-primary/15"
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
                    <td className="px-4 py-3 text-right tabular font-medium text-success-deep dark:text-success">{op.debit > 0 ? formatCFA(op.debit) : ""}</td>
                    <td className="px-4 py-3 text-right tabular font-medium text-destructive-deep dark:text-destructive">{op.credit > 0 ? formatCFA(op.credit) : ""}</td>
                    <td className="px-4 py-3"><OperationStatusBadge status={op.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end items-center gap-1">
                        {op.status === "draft" && (
                          <PermissionGate module="accounting_entries" level="full">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setEntryToDelete(op)}
                              title="Supprimer l'écriture brouillon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </PermissionGate>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-text-muted hover:text-ink hover:bg-background-secondary rounded"
                              title="Plus d'actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-elevated">
                            <DropdownMenuItem
                              onClick={() => setSelectedEntryDetail(op.entry)}
                              className="text-xs cursor-pointer gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-text-muted" />
                              <span>Consulter l'écriture complète</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleCopy(op.piece, "N° de pièce")}
                              className="text-xs cursor-pointer gap-2"
                            >
                              <Copy className="w-3.5 h-3.5 text-text-muted" />
                              <span>Copier la référence ({op.piece})</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleCopy(op.account_code, "Compte")}
                              className="text-xs cursor-pointer gap-2"
                            >
                              <FileText className="w-3.5 h-3.5 text-text-muted" />
                              <span>Copier le compte ({op.account_code})</span>
                            </DropdownMenuItem>

                            {op.status !== "validated" && (
                              <PermissionGate module="accounting_entries" level="validate">
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleValidateSingle(op.entry_id)}
                                  className="text-xs text-success-deep font-semibold cursor-pointer gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-success-deep" />
                                  <span>Valider l'écriture</span>
                                </DropdownMenuItem>
                              </PermissionGate>
                            )}

                            {op.status === "draft" && (
                              <PermissionGate module="accounting_entries" level="full">
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setEntryToDelete(op)}
                                  className="text-xs text-destructive font-semibold cursor-pointer gap-2 focus:bg-destructive/10 focus:text-destructive"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                  <span>Supprimer le brouillon</span>
                                </DropdownMenuItem>
                              </PermissionGate>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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

      {/* Modale de consultation détaillée de l'écriture (Toutes les lignes en partie double) */}
      <Dialog open={!!selectedEntryDetail} onOpenChange={(open) => !open && setSelectedEntryDetail(null)}>
        <DialogContent className="max-w-2xl bg-background border border-border">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3 pr-4">
              <DialogTitle className="text-lg font-bold text-ink">
                Écriture {selectedEntryDetail?.reference}
              </DialogTitle>
              {selectedEntryDetail && (
                <OperationStatusBadge status={selectedEntryDetail.status} />
              )}
            </div>
            <DialogDescription className="text-xs text-text-muted">
              Journal : <span className="font-semibold text-ink">{JOURNAL_LABELS[selectedEntryDetail?.journal] || selectedEntryDetail?.journal}</span> • Date : <span className="font-semibold text-ink">{selectedEntryDetail?.date ? formatDate(selectedEntryDetail.date) : ""}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-background-secondary p-3 border border-border text-xs">
              <span className="font-semibold text-ink">Libellé principal : </span>
              <span className="text-text-muted">{selectedEntryDetail?.description}</span>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-text-muted uppercase text-[11px] font-semibold">
                    <th className="px-3 py-2 text-left">Compte</th>
                    <th className="px-3 py-2 text-left">Libellé de ligne</th>
                    <th className="px-3 py-2 text-right">Débit</th>
                    <th className="px-3 py-2 text-right">Crédit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {selectedEntryDetail?.lines?.map((line: any, i: number) => (
                    <tr key={i} className="hover:bg-muted/20">
                      <td className="px-3 py-2 font-mono font-bold text-ink">
                        {line.account_code}
                        {line.account?.name && (
                          <span className="block text-[10px] font-normal text-text-muted truncate max-w-[140px]">
                            {line.account.name}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-ink font-medium">
                        {line.description || selectedEntryDetail.description}
                        {line.third_party && (
                          <span className="block text-[10px] text-text-muted">
                            Tiers : {line.third_party}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right tabular text-success-deep font-semibold">
                        {line.debit > 0 ? formatCFA(line.debit) : "-"}
                      </td>
                      <td className="px-3 py-2 text-right tabular text-destructive-deep font-semibold">
                        {line.credit > 0 ? formatCFA(line.credit) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border bg-background-secondary font-bold text-ink">
                    <td colSpan={2} className="px-3 py-2.5 text-right">
                      Total écriture :
                    </td>
                    <td className="px-3 py-2.5 text-right tabular text-success-deep">
                      {formatCFA(
                        selectedEntryDetail?.lines?.reduce((s: number, l: any) => s + (Number(l.debit) || 0), 0) || 0
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular text-destructive-deep">
                      {formatCFA(
                        selectedEntryDetail?.lines?.reduce((s: number, l: any) => s + (Number(l.credit) || 0), 0) || 0
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-between items-center sm:justify-between w-full pt-2">
            <div className="text-[11px] text-text-muted">
              Comptabilité conforme SYSCOHADA
            </div>
            <div className="flex items-center gap-2">
              {selectedEntryDetail?.status !== "validated" && (
                <PermissionGate module="accounting_entries" level="validate">
                  <Button
                    size="sm"
                    className="bg-primary text-ink font-bold hover:brightness-95"
                    onClick={() => handleValidateSingle(selectedEntryDetail.id)}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-ink" />
                    Valider l'écriture
                  </Button>
                </PermissionGate>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEntryDetail(null)}
              >
                Fermer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression explicite (Règle 17) */}
      <Dialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <DialogContent className="max-w-md bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-ink flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Supprimer l'écriture brouillon
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted pt-1">
              Êtes-vous sûr de vouloir supprimer l'écriture n° <strong className="text-ink">{entryToDelete?.piece}</strong> ({entryToDelete?.description}) ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-3 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setEntryToDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (entryToDelete) {
                  await handleDeleteEntry(entryToDelete.entry_id);
                  setEntryToDelete(null);
                }
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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