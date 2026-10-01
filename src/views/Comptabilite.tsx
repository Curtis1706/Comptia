"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Download,
  Upload,
  MoreVertical,
  CheckCircle2,
  Trash2,
  ChevronDown,
  AlertCircle,
  FileText,
  Lock,
  Copy,
  RotateCcw,
  Eye,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { JournalEntryModal } from "@/components/accounting/JournalEntryModal";
import { PermissionGate } from "@/components/PermissionGate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { detectAndParseCSV } from "@/lib/csv-parser";
import { toast } from "sonner";

const JOURNAL_CONFIG: Record<string, { label: string; badge: string }> = {
  purchases: { label: "Achats (ACH)", badge: "Achats" },
  sales: { label: "Ventes (VTE)", badge: "Ventes" },
  bank: { label: "Banque (BQ)", badge: "Banque" },
  payroll: { label: "Paie (PAY)", badge: "Paie" },
  cash: { label: "Caisse (CA)", badge: "Caisse" },
  od: { label: "Opérations Diverses (OD)", badge: "OD" },
};

// Statuts simplifiés en 3 états stricts : Brouillon (ambre), Validée (vert), Verrouillée (cadenas gris)
type CleanStatus = "draft" | "validated" | "locked";

const getCleanStatus = (status: string): CleanStatus => {
  if (status === "draft") return "draft";
  if (status === "locked") return "locked";
  return "validated"; // "posted" ou "validated" -> Validée
};

export const Comptabilite = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [journalFilter, setJournalFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [expandedPieces, setExpandedPieces] = useState<Record<string, boolean>>({});
  const [csvErrors, setCsvErrors] = useState<{ message: string; lines?: string[] } | null>(null);

  const queryClient = useQueryClient();

  // Récupération directe des écritures réelles avec total
  const { data, isLoading } = useQuery<{ entries: any[]; total: number }>({
    queryKey: ["accounting-entries", debouncedQuery, page, pageSize, statusFilter, journalFilter],
    queryFn: async () => {
      const url = `/api/accounting/entries?page=${page}&limit=${pageSize}${
        debouncedQuery ? `&search=${encodeURIComponent(debouncedQuery)}` : ""
      }${statusFilter !== "all" ? `&status=${statusFilter}` : ""}${
        journalFilter !== "all" ? `&journal=${journalFilter}` : ""
      }`;
      const res = await fetch(url, { credentials: "include" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Erreur de chargement des écritures");
      }
      return {
        entries: json.data || [],
        total: typeof json.total === "number" ? json.total : (json.data?.length || 0),
      };
    },
  });

  const entries: any[] = data?.entries || [];
  const totalEntries: number = data?.total || 0;

  // Toggle affichage repliable/dépliable d'une pièce
  const togglePiece = (id: string) => {
    setExpandedPieces((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Liste plate des lignes pour exports et totaux
  const allLines = useMemo(() => {
    return entries.flatMap((entry: any) =>
      (entry.lines || []).map((line: any) => ({
        ...line,
        date: entry.date,
        piece: entry.reference,
        status: entry.status,
        entry_id: entry.id,
      }))
    );
  }, [entries]);

  // Calculs des indicateurs de synthèse (Partie double)
  const { totalDebit, totalCredit, ecart, isBalanced, draftsCount } = useMemo(() => {
    let tDebit = 0;
    let tCredit = 0;
    let drafts = 0;

    entries.forEach((entry: any) => {
      if (entry.status === "draft") drafts++;
      (entry.lines || []).forEach((line: any) => {
        tDebit += Number(line.debit || 0);
        tCredit += Number(line.credit || 0);
      });
    });

    const diff = Math.round((tDebit - tCredit) * 100) / 100;
    return {
      totalDebit: tDebit,
      totalCredit: tCredit,
      ecart: diff,
      isBalanced: Math.abs(diff) === 0,
      draftsCount: drafts,
    };
  }, [entries]);

  // Sélection unitaire
  const toggleSelectEntry = (id: string) => {
    setSelectedEntries((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Sélection globale de toutes les pièces affichées
  const isAllSelected =
    entries.length > 0 && entries.every((e) => selectedEntries.includes(e.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(entries.map((e) => e.id));
    }
  };

  // Validation groupée
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
        toast.success(result.message || "Écritures validées avec succès");
        setSelectedEntries([]);
        queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
      } else {
        toast.error(result.error || "Erreur lors de la validation");
      }
    } catch {
      toast.error("Erreur réseau lors de la validation");
    }
  };

  // Suppression groupée (uniquement les brouillons)
  const handleBulkDelete = async () => {
    const draftIds = entries
      .filter((e) => selectedEntries.includes(e.id) && e.status === "draft")
      .map((e) => e.id);

    if (draftIds.length === 0) {
      toast.info("Aucune pièce brouillon à supprimer parmi la sélection (les écritures validées ne peuvent pas être supprimées)");
      return;
    }

    if (!confirm(`Supprimer ${draftIds.length} écriture(s) brouillon ? Cette action est irréversible.`)) {
      return;
    }

    try {
      let deletedCount = 0;
      for (const id of draftIds) {
        const res = await fetch(`/api/accounting/entries/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const result = await res.json();
        if (result.success) deletedCount++;
      }

      toast.success(`${deletedCount} écriture(s) supprimée(s)`);
      setSelectedEntries([]);
      queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
    } catch {
      toast.error("Erreur réseau lors de la suppression groupée");
    }
  };

  // Validation individuelle
  const handleValidateEntry = async (id: string) => {
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
      } else {
        toast.error(result.error || "Erreur lors de la validation");
      }
    } catch {
      toast.error("Erreur réseau lors de la validation");
    }
  };

  // Extourne (contre-passation)
  const handleReverseEntry = async (id: string) => {
    if (!confirm("Voulez-vous extourner cette écriture ? Une écriture inverse sera créée pour l'annuler comptablement.")) {
      return;
    }
    try {
      const res = await fetch(`/api/accounting/entries/${id}/reverse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Écriture d'extourne créée avec succès");
        queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
      } else {
        toast.error(result.error || "Impossible d'extourner cette écriture");
      }
    } catch {
      toast.error("Erreur réseau lors de l'extourne");
    }
  };

  // Duplication d'une écriture
  const handleDuplicateEntry = (entry: any) => {
    toast.info(`Duplication de la pièce ${entry.reference}...`);
    setIsModalOpen(true);
  };

  // Suppression d'un brouillon
  const handleDeleteEntry = async (id: string) => {
    if (!confirm("Voulez-vous supprimer cette écriture brouillon ?")) return;
    try {
      const res = await fetch(`/api/accounting/entries/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Brouillon supprimé");
        queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch {
      toast.error("Erreur réseau lors de la suppression");
    }
  };

  // Export CSV de la sélection ou de toute la vue
  const handleExportCSV = (idsToExport?: string[]) => {
    const targetEntries = idsToExport && idsToExport.length > 0
      ? entries.filter((e) => idsToExport.includes(e.id))
      : entries;

    if (targetEntries.length === 0) {
      toast.info("Aucune écriture à exporter");
      return;
    }

    const headers = [
      "Date",
      "Piece",
      "Journal",
      "Compte",
      "Libelle",
      "Debit",
      "Credit",
      "Statut",
    ];
    const csvRows = targetEntries.flatMap((entry: any) =>
      (entry.lines || []).map((l: any) => [
        formatDate(entry.date),
        `"${entry.reference || ""}"`,
        `"${entry.journal || ""}"`,
        `"${l.account_code || ""}"`,
        `"${(l.description || entry.description || "").replace(/"/g, '""')}"`,
        l.debit || 0,
        l.credit || 0,
        `"${entry.status || ""}"`,
      ].join(","))
    );

    const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journal-comptable-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`${targetEntries.length} pièce(s) exportée(s) en CSV`);
  };

  // Import CSV avec gestion détaillée des erreurs
  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvErrors(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text || !text.trim()) {
        setCsvErrors({ message: "Le fichier CSV sélectionné est vide" });
        return;
      }

      const parseResult = detectAndParseCSV(text);
      if (parseResult.entries.length === 0) {
        setCsvErrors({
          message: "Impossible d'extraire des écritures valides du fichier CSV",
          lines: [
            "Vérifiez que le fichier comporte les colonnes Date, Compte, Libellé, Débit et Crédit.",
            "Vérifiez que le séparateur utilisé est une virgule (,) ou un point-virgule (;).",
          ],
        });
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
          setCsvErrors({
            message: result.error || "Erreur retournée par le serveur lors de l'importation",
            lines: result.errors?.map((err: any) => `${err.field ? `${err.field}: ` : ""}${err.message}`) || [],
          });
        }
      } catch {
        setCsvErrors({ message: "Erreur de connexion avec le serveur lors de l'envoi du fichier CSV" });
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  // Bornes de pagination
  const startIdx = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, totalEntries);
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE DE PAGE                                                        */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Journal des opérations
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Toutes vos écritures comptables centralisées · Référentiel SYSCOHADA Révisé
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <PermissionGate module="accounting_entries" level="write">
            <input
              type="file"
              id="csv-import-file"
              className="hidden"
              accept=".csv"
              onChange={handleImportCSV}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("csv-import-file")?.click()}
              className="h-9 px-3 border-border bg-background text-ink hover:bg-background-secondary text-xs font-semibold"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-text-muted" />
              Importer CSV
            </Button>
          </PermissionGate>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportCSV()}
            className="h-9 px-3 border-border bg-background text-ink hover:bg-background-secondary text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-text-muted" />
            Exporter
          </Button>

          <PermissionGate module="accounting_entries" level="write">
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-4 bg-primary text-ink hover:brightness-95 font-semibold text-xs transition-transform active:scale-[0.99]"
            >
              <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
              Nouvelle opération
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BANNIÈRE D'ERREUR D'IMPORT CSV SI APPLICABLE                             */}
      {/* ========================================================================= */}
      {csvErrors && (
        <div className="bg-error/10 border border-error/30 rounded-lg p-4 text-ink relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-ink">Échec de l'importation CSV</h4>
                <p className="text-xs text-text-muted mt-0.5">{csvErrors.message}</p>
                {csvErrors.lines && csvErrors.lines.length > 0 && (
                  <ul className="mt-2 text-xs list-disc list-inside space-y-1 text-ink/90 font-mono">
                    {csvErrors.lines.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button
              onClick={() => setCsvErrors(null)}
              className="text-text-muted hover:text-ink p-1 rounded"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LES 4 CARTES SYNTHÉTIQUES D'ÉQUILIBRE (PARTIE DOUBLE SYSCOHADA)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte 1 : Total Débit */}
        <div className="bg-background rounded-lg p-4 border border-border flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Total Débit
            </span>
            <span className="px-2 py-0.5 rounded bg-background-secondary text-text-muted text-[10px] font-semibold">
              Période
            </span>
          </div>
          <div className="mt-3">
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-ink tabular-nums">
              {formatCFA(totalDebit)}
            </div>
            <div className="text-xs text-text-muted mt-1">
              {allLines.length} imputation{allLines.length > 1 ? "s" : ""} enregistrée{allLines.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Carte 2 : Total Crédit */}
        <div className="bg-background rounded-lg p-4 border border-border flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Total Crédit
            </span>
            <span className="px-2 py-0.5 rounded bg-background-secondary text-text-muted text-[10px] font-semibold">
              Période
            </span>
          </div>
          <div className="mt-3">
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-ink tabular-nums">
              {formatCFA(totalCredit)}
            </div>
            <div className="text-xs text-text-muted mt-1">
              Partie double respectée
            </div>
          </div>
        </div>

        {/* Carte 3 : Écart arithmétique (Balance) */}
        <div className="bg-background rounded-lg p-4 border border-border flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Écart arithmétique
            </span>
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                isBalanced ? "bg-success" : "bg-error"
              )}
            />
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              {isBalanced ? (
                <div className="flex items-center gap-1.5 font-bold text-lg text-ink">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Équilibré</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-bold text-lg text-error">
                  <AlertCircle className="w-5 h-5 text-error" />
                  <span>Déséquilibré</span>
                </div>
              )}
            </div>
            <div className="text-xs text-text-muted mt-1 font-mono">
              Différence : {formatCFA(Math.abs(ecart))}
            </div>
          </div>
        </div>

        {/* Carte 4 : Brouillons à valider */}
        <div className="bg-background rounded-lg p-4 border border-border flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Brouillons à valider
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
          </div>
          <div className="mt-3">
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-ink tabular-nums">
              {draftsCount} pièce{draftsCount > 1 ? "s" : ""}
            </div>
            <div className="text-xs text-text-muted mt-1">
              En attente d'imputation définitive
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BARRE DE FILTRAGE MULTI-CRITÈRES                                       */}
      {/* ========================================================================= */}
      <div className="bg-background rounded-lg border border-border p-3 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher par libellé, compte, pièce..."
              className="pl-9 h-9 text-xs bg-background border-border text-ink placeholder:text-text-muted focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Filtre Journal */}
          <div className="sm:w-44">
            <select
              value={journalFilter}
              onChange={(e) => {
                setJournalFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 rounded-md bg-background border border-border text-xs text-ink focus:outline-none focus:border-ink/50"
            >
              <option value="all">Tous les journaux</option>
              <option value="purchases">Achats (ACH)</option>
              <option value="sales">Ventes (VTE)</option>
              <option value="bank">Banque (BQ)</option>
              <option value="payroll">Paie / Salaires (PAY)</option>
              <option value="cash">Caisse (CA)</option>
            </select>
          </div>

          {/* Filtre Statut */}
          <div className="sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 rounded-md bg-background border border-border text-xs text-ink focus:outline-none focus:border-ink/50"
            >
              <option value="all">Tous les statuts</option>
              <option value="validated">Validée</option>
              <option value="draft">Brouillon</option>
              <option value="locked">Verrouillée</option>
            </select>
          </div>

          {/* Filtre Période */}
          <div className="sm:w-44">
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full h-9 px-3 rounded-md bg-background border border-border text-xs text-ink focus:outline-none focus:border-ink/50"
            >
              <option value="all">Toutes périodes</option>
              <option value="current">Mois en cours</option>
              <option value="2026">Exercice 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BARRE D'ACTIONS GROUPÉES (PROMPT 4)                                     */}
      {/* ========================================================================= */}
      {selectedEntries.length > 0 && (
        <div className="bg-background-secondary border border-border rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in-50 duration-150">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-primary text-ink text-xs font-bold font-mono">
              {selectedEntries.length}
            </span>
            <span className="text-xs font-semibold text-ink">
              sélectionnée{selectedEntries.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <PermissionGate module="accounting_entries" level="validate">
              <Button
                size="sm"
                onClick={handleBulkValidate}
                className="h-8 px-3 text-xs font-semibold bg-primary text-ink hover:brightness-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Valider la sélection
              </Button>
            </PermissionGate>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportCSV(selectedEntries)}
              className="h-8 px-3 text-xs font-semibold border-border bg-background text-ink hover:bg-background-secondary"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-text-muted" />
              Exporter
            </Button>

            <PermissionGate module="accounting_entries" level="full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="h-8 px-3 text-xs font-semibold border-border text-error hover:bg-error/10 hover:border-error/40"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Supprimer
              </Button>
            </PermissionGate>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEntries([])}
              className="h-8 px-2 text-xs text-text-muted hover:text-ink"
            >
              Désélectionner
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TABLEAU GROUPÉ PAR PIÈCE COMPTABLE AVEC SOUS-ÉCRITURES DÉPLIABLES     */}
      {/* ========================================================================= */}
      <div className="bg-background rounded-lg border border-border overflow-hidden shadow-sm">
        {/* En-tête des colonnes fixe au défilement (Prompt 5) */}
        <div className="hidden lg:grid grid-cols-12 bg-background-secondary px-4 py-2.5 border-b border-border text-[11px] font-semibold text-text-muted uppercase tracking-wider items-center select-none sticky top-0 z-10">
          <div className="col-span-1 flex items-center gap-3">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={toggleSelectAll}
              aria-label="Sélectionner toutes les pièces"
            />
            <span>Date</span>
          </div>
          <div className="col-span-2 pl-2">N° Pièce / Réf</div>
          <div className="col-span-1">Journal</div>
          <div className="col-span-3">Libellé principal</div>
          <div className="col-span-2 text-right pr-2">Total pièce</div>
          <div className="col-span-1 text-center">Statut</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Corps du tableau */}
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          /* État vide conforme Prompt 6 */
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 text-text-muted/40 mb-3" />
            <h3 className="text-sm font-semibold text-ink">
              Aucune écriture sur cette période
            </h3>
            <p className="text-xs text-text-muted mt-1 max-w-sm mb-4">
              Aucune pièce comptable ne correspond à vos filtres actuels. Modifiez vos critères de recherche ou enregistrez une nouvelle pièce.
            </p>
            <PermissionGate module="accounting_entries" level="write">
              <Button
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-ink hover:brightness-95 font-semibold text-xs h-9 px-4"
              >
                <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
                Nouvelle opération
              </Button>
            </PermissionGate>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry: any) => {
              const isExpanded = !!expandedPieces[entry.id];
              const isSelected = selectedEntries.includes(entry.id);
              const cleanStatus = getCleanStatus(entry.status);

              const journalInfo = JOURNAL_CONFIG[entry.journal] || {
                label: entry.journal,
                badge: entry.journal,
              };

              // Calcul des totaux de cette pièce spécifique
              let pieceDebit = 0;
              let pieceCredit = 0;
              (entry.lines || []).forEach((l: any) => {
                pieceDebit += Number(l.debit || 0);
                pieceCredit += Number(l.credit || 0);
              });
              const isPieceBalanced = Math.abs(pieceDebit - pieceCredit) < 0.01;

              return (
                <div key={entry.id} className="flex flex-col group/piece">
                  {/* Ligne Desktop */}
                  <div
                    onClick={() => togglePiece(entry.id)}
                    className={cn(
                      "hidden lg:grid grid-cols-12 px-4 py-3 transition-colors items-center cursor-pointer select-none",
                      cleanStatus === "draft"
                        ? "bg-warning/5 hover:bg-warning/10"
                        : "bg-background hover:bg-background-secondary/60",
                      isSelected && "!bg-primary/10"
                    )}
                  >
                    {/* Checkbox & Date (Contraste rehaussé - Prompt 5) */}
                    <div
                      className="col-span-1 flex items-center gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectEntry(entry.id)}
                        aria-label={`Sélectionner la pièce ${entry.reference}`}
                      />
                      <span className="font-mono text-xs font-semibold text-ink whitespace-nowrap">
                        {formatDate(entry.date)}
                      </span>
                    </div>

                    {/* Référence (Contraste rehaussé - Prompt 5) */}
                    <div className="col-span-2 pl-2 flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-xs font-bold text-ink tracking-tight truncate">
                        {entry.reference}
                      </span>
                    </div>

                    {/* Journal */}
                    <div className="col-span-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-background-secondary text-ink border border-border">
                        {journalInfo.badge}
                      </span>
                    </div>

                    {/* Libellé principal (non italique en brouillon - Prompt 3) */}
                    <div className="col-span-3 truncate pr-2">
                      <span
                        className="text-xs font-medium text-ink truncate block"
                        title={entry.description}
                      >
                        {entry.description}
                      </span>
                    </div>

                    {/* Total pièce */}
                    <div className="col-span-2 text-right pr-2">
                      <span className="font-mono text-xs font-bold text-ink tabular-nums">
                        {formatCFA(pieceDebit)}
                      </span>
                    </div>

                    {/* Statut : 3 états stricts (Prompt 3) */}
                    <div className="col-span-1 flex justify-center">
                      {cleanStatus === "draft" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-warning/15 text-ink border-warning/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                          Brouillon
                        </span>
                      )}
                      {cleanStatus === "validated" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-success/15 text-ink border-success/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          Validée
                        </span>
                      )}
                      {cleanStatus === "locked" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border bg-background-secondary text-ink border-border">
                          <Lock className="w-3 h-3 text-ink" />
                          Verrouillée
                        </span>
                      )}
                    </div>

                    {/* Actions contextuelles : bouton visible + menu ... (Prompt 4) */}
                    <div
                      className="col-span-2 flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Bouton contextuel direct */}
                      {cleanStatus === "draft" ? (
                        <PermissionGate module="accounting_entries" level="validate">
                          <Button
                            size="sm"
                            onClick={() => handleValidateEntry(entry.id)}
                            className="h-7 px-2.5 text-xs font-semibold bg-primary text-ink hover:brightness-95 transition-all"
                          >
                            Valider
                          </Button>
                        </PermissionGate>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePiece(entry.id)}
                          className="h-7 px-2.5 text-xs font-medium border-border text-ink bg-background hover:bg-background-secondary"
                        >
                          <Eye className="w-3 h-3 mr-1 text-text-muted" />
                          Voir la pièce
                        </Button>
                      )}

                      {/* Menu contextuel ... */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-text-muted hover:text-ink hover:bg-background-secondary"
                            title="Options de l'écriture"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 bg-background border-border shadow-md">
                          <DropdownMenuItem
                            onClick={() => handleDuplicateEntry(entry)}
                            className="text-xs cursor-pointer text-ink hover:bg-background-secondary"
                          >
                            <Copy className="w-3.5 h-3.5 mr-2 text-text-muted" />
                            Dupliquer
                          </DropdownMenuItem>

                          {cleanStatus !== "draft" && (
                            <DropdownMenuItem
                              onClick={() => handleReverseEntry(entry.id)}
                              className="text-xs cursor-pointer text-ink hover:bg-background-secondary font-medium"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-2 text-text-muted" />
                              Extourner
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => handleExportCSV([entry.id])}
                            className="text-xs cursor-pointer text-ink hover:bg-background-secondary"
                          >
                            <Download className="w-3.5 h-3.5 mr-2 text-text-muted" />
                            Télécharger le justificatif
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-border" />

                          <DropdownMenuItem
                            disabled={cleanStatus === "validated" || cleanStatus === "locked"}
                            onClick={() => handleDeleteEntry(entry.id)}
                            className={cn(
                              "text-xs cursor-pointer",
                              cleanStatus === "draft"
                                ? "text-error hover:bg-error/10 focus:text-error"
                                : "text-text-muted opacity-50 cursor-not-allowed"
                            )}
                            title={
                              cleanStatus !== "draft"
                                ? "Une écriture validée ou verrouillée ne peut pas être supprimée, utilisez l'extourne."
                                : "Supprimer cette écriture brouillon"
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Chevron repliable */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-text-muted hover:text-ink hover:bg-background-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePiece(entry.id);
                        }}
                        title={isExpanded ? "Replier" : "Déplier"}
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </Button>
                    </div>
                  </div>

                  {/* Ligne Mobile / Tablette (< lg) - Prompt 6 */}
                  <div
                    onClick={() => togglePiece(entry.id)}
                    className={cn(
                      "lg:hidden p-3.5 flex flex-col gap-2.5 cursor-pointer transition-colors border-b border-border/60",
                      cleanStatus === "draft"
                        ? "bg-warning/5 hover:bg-warning/10"
                        : "bg-background hover:bg-background-secondary/40",
                      isSelected && "!bg-primary/10"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="flex items-center gap-2.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectEntry(entry.id)}
                        />
                        <span className="font-mono text-xs font-bold text-ink">
                          {entry.reference}
                        </span>
                      </div>

                      {/* Statut mobile */}
                      <div>
                        {cleanStatus === "draft" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-warning/15 text-ink border-warning/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                            Brouillon
                          </span>
                        )}
                        {cleanStatus === "validated" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-success/15 text-ink border-success/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
                            Validée
                          </span>
                        )}
                        {cleanStatus === "locked" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-background-secondary text-ink border-border">
                            <Lock className="w-2.5 h-2.5 text-ink" />
                            Verrouillée
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-medium text-ink line-clamp-2">
                      {entry.description}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
                      <div className="flex items-center gap-2 text-text-muted">
                        <span className="font-mono text-ink font-medium">{formatDate(entry.date)}</span>
                        <span>·</span>
                        <span className="px-1.5 py-0.5 rounded bg-background-secondary text-[10px] border border-border text-ink">
                          {journalInfo.badge}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="font-mono font-bold text-ink">
                          {formatCFA(pieceDebit)}
                        </span>

                        {cleanStatus === "draft" ? (
                          <Button
                            size="sm"
                            onClick={() => handleValidateEntry(entry.id)}
                            className="h-6 px-2 text-[11px] font-semibold bg-primary text-ink hover:brightness-95"
                          >
                            Valider
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePiece(entry.id)}
                            className="h-6 px-2 text-[11px] font-medium border-border text-ink bg-background"
                          >
                            Voir
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ================================================================= */}
                  {/* SOUS-ÉCRITURES DÉPLIABLES (COLONNES DÉBIT/CRÉDIT SANS VERT/ROUGE) */}
                  {/* ================================================================= */}
                  {isExpanded && (
                    <div className="flex flex-col bg-background-secondary/40 border-t border-border animate-in fade-in-50 duration-150">
                      {/* Sous-en-tête interne (Desktop) */}
                      <div className="hidden lg:grid grid-cols-12 px-4 py-2 bg-background-secondary text-[11px] font-semibold text-text-muted uppercase tracking-wider border-b border-border">
                        <div className="col-span-4 pl-8">Compte SYSCOHADA</div>
                        <div className="col-span-4">Libellé d'écriture</div>
                        {/* Colonnes Débit et Crédit côte à côte avec fine séparation - Prompt 2 */}
                        <div className="col-span-2 text-right pr-4 border-r border-border">Débit</div>
                        <div className="col-span-2 text-right pr-4">Crédit</div>
                      </div>

                      {/* Liste des imputations comptables */}
                      {(entry.lines || []).map((line: any, idx: number) => {
                        const accountLabel =
                          line.account?.name || line.description || "Compte général";
                        return (
                          <div
                            key={line.id || idx}
                            className="px-4 py-2.5 border-b border-border/50 hover:bg-background-secondary/70 transition-colors text-xs"
                          >
                            {/* Version Desktop */}
                            <div className="hidden lg:grid grid-cols-12 items-center">
                              {/* Numéro de compte en gras + intitulé en gris moyen à côté - Prompt 5 */}
                              <div className="col-span-4 pl-8 flex items-center gap-2 min-w-0 pr-2">
                                <span className="font-mono font-bold text-ink shrink-0">
                                  {line.account_code}
                                </span>
                                <span className="text-text-muted truncate font-medium" title={accountLabel}>
                                  {accountLabel}
                                </span>
                              </div>

                              <div className="col-span-4 text-ink truncate pr-3">
                                {line.description || entry.description}
                              </div>

                              {/* Colonne Débit : texte presque noir, tiret gris si vide - Prompt 2 */}
                              <div className="col-span-2 text-right pr-4 font-mono font-semibold tabular-nums text-ink border-r border-border">
                                {Number(line.debit) > 0 ? (
                                  formatCFA(line.debit)
                                ) : (
                                  <span className="text-text-muted select-none">—</span>
                                )}
                              </div>

                              {/* Colonne Crédit : texte presque noir, tiret gris si vide - Prompt 2 */}
                              <div className="col-span-2 text-right pr-4 font-mono font-semibold tabular-nums text-ink">
                                {Number(line.credit) > 0 ? (
                                  formatCFA(line.credit)
                                ) : (
                                  <span className="text-text-muted select-none">—</span>
                                )}
                              </div>
                            </div>

                            {/* Version Mobile */}
                            <div className="lg:hidden flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-ink">
                                  {line.account_code}
                                </span>
                                <span className="text-text-muted truncate font-medium">
                                  {accountLabel}
                                </span>
                              </div>
                              <div className="text-[11px] text-ink/80">
                                {line.description || entry.description}
                              </div>
                              <div className="flex items-center justify-between font-mono text-[11px] pt-1">
                                <span>
                                  Débit :{" "}
                                  {Number(line.debit) > 0 ? (
                                    <strong className="text-ink">{formatCFA(line.debit)}</strong>
                                  ) : (
                                    <span className="text-text-muted">—</span>
                                  )}
                                </span>
                                <span>
                                  Crédit :{" "}
                                  {Number(line.credit) > 0 ? (
                                    <strong className="text-ink">{formatCFA(line.credit)}</strong>
                                  ) : (
                                    <span className="text-text-muted">—</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Bandeau récapitulatif sous la pièce dépliée */}
                      <div className="px-4 py-2.5 bg-background-secondary border-t border-border flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-3 flex-wrap">
                          {isPieceBalanced ? (
                            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                              <CheckCircle2 className="w-4 h-4 text-success" />
                              Équilibrée
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 font-semibold text-error">
                              <AlertCircle className="w-4 h-4 text-error" />
                              Déséquilibrée (Écart : {formatCFA(Math.abs(pieceDebit - pieceCredit))})
                            </span>
                          )}
                          <span className="text-border hidden sm:inline">|</span>
                          <span className="font-mono text-ink text-[11px]">
                            Total débit : <strong>{formatCFA(pieceDebit)}</strong>
                          </span>
                          <span className="text-border hidden sm:inline">·</span>
                          <span className="font-mono text-ink text-[11px]">
                            Total crédit : <strong>{formatCFA(pieceCredit)}</strong>
                          </span>
                        </div>

                        {cleanStatus === "draft" && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleValidateEntry(entry.id)}
                              className="h-7 px-3 text-xs font-semibold bg-primary text-ink hover:brightness-95"
                            >
                              Valider l'écriture
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. PIED DE TABLEAU AVEC PAGINATION CONFORME (PROMPT 5)                    */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-border text-xs text-text-muted bg-background select-none">
          {/* Format « 1 à 10 sur 21 pièces » */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">
              {startIdx} à {endIdx} sur {totalEntries} pièce{totalEntries > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sélecteur Lignes par page */}
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted">Lignes par page :</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-8 px-2 rounded border border-border bg-background text-xs font-semibold text-ink focus:outline-none focus:border-ink/50"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Boutons Précédent / Suivant */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 px-3 text-xs border-border text-ink hover:bg-background-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Précédent
              </Button>
              <div className="h-8 min-w-[32px] px-2 rounded bg-primary text-ink font-semibold flex items-center justify-center text-xs">
                {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="h-8 px-3 text-xs border-border text-ink hover:bg-background-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. MODALE DE SAISIE COMPTABLE (PIÈCE EN PARTIE DOUBLE SYSCOHADA)          */}
      {/* ========================================================================= */}
      <JournalEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ["accounting-entries"] });
        }}
      />
    </div>
  );
};

export default Comptabilite;