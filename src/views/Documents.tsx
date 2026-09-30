"use client";

import React, { useState, useMemo } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Search,
  Download,
  Trash2,
  Eye,
  RotateCw,
  MoreHorizontal,
  Plus,
  Check,
  Filter,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DocumentUploadDrawer } from "@/components/documents/DocumentUploadDrawer";
import { DocumentVerificationView } from "@/components/documents/DocumentVerificationView";

type FilterStatus = "all" | "to_verify" | "extracted" | "processed" | "error";

export function Documents() {
  const queryClient = useQueryClient();

  // Navigation entre la vue liste et la vue vérification
  const [currentView, setCurrentView] = useState<"list" | "verify">("list");
  const [activeVerificationIndex, setActiveVerificationIndex] = useState(0);

  // État du panneau latéral de téléversement (Écran 2)
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);

  // Filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");

  // Sélection multiple
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Chargement des documents
  const { data: docsRes, isLoading } = useQuery<any>({
    queryKey: ["documents"],
    queryFn: () => fetcher("/api/documents/list"),
    refetchInterval: (query: any) => {
      const docs = query?.state?.data || [];
      const list = Array.isArray(docs) ? docs : docs?.data || [];
      return list.some(
        (d: any) => d.status === "processing" || d.status === "uploaded"
      )
        ? 3000
        : false;
    },
  });

  const documents: any[] = useMemo(() => {
    return Array.isArray(docsRes) ? docsRes : docsRes?.data || [];
  }, [docsRes]);

  // Calcul des métriques pour les 4 cartes de synthèse
  const metrics = useMemo(() => {
    let toVerify = 0;
    let extracted = 0;
    let processed = 0;
    let error = 0;

    for (const doc of documents) {
      if (doc.status === "processed") {
        processed++;
      } else if (doc.status === "error") {
        error++;
      } else if (doc.status === "processing" || doc.status === "uploaded") {
        extracted++;
      } else {
        toVerify++;
      }
    }

    return { toVerify, extracted, processed, error };
  }, [documents]);

  // Filtrage des documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // 1. Filtre par recherche texte
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const filename = (doc.original_filename || "").toLowerCase();
        const vendor = (doc.extracted_data?.vendor_name || "").toLowerCase();
        const invNumber = (doc.extracted_data?.invoice_number || "").toLowerCase();
        const account = (doc.extracted_data?.account_code || "").toLowerCase();
        if (
          !filename.includes(q) &&
          !vendor.includes(q) &&
          !invNumber.includes(q) &&
          !account.includes(q)
        ) {
          return false;
        }
      }

      // 2. Filtre par statut
      if (statusFilter === "processed" && doc.status !== "processed") return false;
      if (statusFilter === "error" && doc.status !== "error") return false;
      if (
        statusFilter === "extracted" &&
        doc.status !== "processing" &&
        doc.status !== "uploaded"
      )
        return false;
      if (
        statusFilter === "to_verify" &&
        (doc.status === "processed" || doc.status === "error")
      )
        return false;

      // 3. Filtre par compte
      if (accountFilter !== "all") {
        const acc = doc.extracted_data?.account_code;
        if (acc !== accountFilter) return false;
      }

      // 4. Filtre par période
      if (periodFilter !== "all" && doc.created_at) {
        const docDate = new Date(doc.created_at);
        const now = new Date();
        if (periodFilter === "month") {
          if (
            docDate.getMonth() !== now.getMonth() ||
            docDate.getFullYear() !== now.getFullYear()
          )
            return false;
        } else if (periodFilter === "year") {
          if (docDate.getFullYear() !== now.getFullYear()) return false;
        }
      }

      return true;
    });
  }, [documents, searchQuery, statusFilter, accountFilter, periodFilter]);

  // Pagination sur la liste filtrée
  const totalCount = filteredDocuments.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocuments.slice(start, start + pageSize);
  }, [filteredDocuments, currentPage, pageSize]);

  // Gestion de la sélection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedDocuments.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Actions individuelles
  const handleOpenVerification = (doc: any) => {
    const index = documents.findIndex((d) => d.id === doc.id);
    setActiveVerificationIndex(index >= 0 ? index : 0);
    setCurrentView("verify");
  };

  const handleRetryOCR = async (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/documents/${docId}/retry`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Traitement OCR relancé");
        queryClient.invalidateQueries({ queryKey: ["documents"] });
      } else {
        toast.error(data.error || "Impossible de relancer l'OCR");
      }
    } catch {
      toast.error("Erreur réseau");
    }
  };

  const handleDeleteOne = async (doc: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Supprimer le document "${doc.original_filename}" ?`)) {
      try {
        const res = await fetch(`/api/documents/${doc.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          toast.success("Document supprimé");
          setSelectedIds((prev) => prev.filter((id) => id !== doc.id));
          queryClient.invalidateQueries({ queryKey: ["documents"] });
        }
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  // Actions groupées
  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} justificatifs sélectionnés ?`
      )
    )
      return;

    setIsBulkProcessing(true);
    let successCount = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/documents/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) successCount++;
      } catch {}
    }
    toast.success(`${successCount} document(s) supprimé(s)`);
    setSelectedIds([]);
    setIsBulkProcessing(false);
    queryClient.invalidateQueries({ queryKey: ["documents"] });
  };

  const handleBulkValidate = async () => {
    setIsBulkProcessing(true);
    let successCount = 0;
    for (const id of selectedIds) {
      const doc = documents.find((d) => d.id === id);
      if (!doc || doc.status === "processed") continue;

      const ext = doc.extracted_data || {};
      const amount = Number(ext.amount) || 0;
      if (amount <= 0 || !ext.vendor_name) continue;

      try {
        const res = await fetch(`/api/documents/${id}/transform`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            vendor_name: ext.vendor_name,
            amount: amount,
            date: ext.date || new Date().toISOString().split("T")[0],
            vat_amount: Number(ext.vat_amount) || 0,
            invoice_number: ext.invoice_number || "",
            account_code: ext.account_code || "628",
          }),
        });
        if (res.ok) successCount++;
      } catch {}
    }
    toast.success(`${successCount} document(s) validé(s) et comptabilisé(s)`);
    setSelectedIds([]);
    setIsBulkProcessing(false);
    queryClient.invalidateQueries({ queryKey: ["documents"] });
  };

  // Export CSV
  const handleExportCsv = () => {
    if (filteredDocuments.length === 0) {
      toast.info("Aucun document à exporter.");
      return;
    }

    const headers = [
      "Fichier",
      "Fournisseur",
      "Date_Facture",
      "Montant_TTC",
      "TVA_Deductible",
      "Compte_SYSCOHADA",
      "Statut",
      "Date_Ajout",
    ];

    const rows = filteredDocuments.map((doc) => {
      const ext = doc.extracted_data || {};
      return [
        `"${doc.original_filename || ""}"`,
        `"${ext.vendor_name || ""}"`,
        `"${ext.date ? formatDate(ext.date) : ""}"`,
        ext.amount || 0,
        ext.vat_amount || 0,
        `"${ext.account_code || "628"}"`,
        `"${doc.status}"`,
        `"${doc.created_at ? formatDate(doc.created_at) : ""}"`,
      ].join(",");
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `justificatifs_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exportation CSV terminée");
  };

  // BASCULE VERS LA VUE DE VÉRIFICATION PLEINE PAGE (ÉCRAN 3)
  if (currentView === "verify") {
    return (
      <DocumentVerificationView
        documents={documents}
        initialIndex={activeVerificationIndex}
        onBackToList={() => {
          setCurrentView("list");
          queryClient.invalidateQueries({ queryKey: ["documents"] });
        }}
        onDocumentValidated={() => {
          queryClient.invalidateQueries({ queryKey: ["documents"] });
        }}
        onDocumentDeleted={() => {
          queryClient.invalidateQueries({ queryKey: ["documents"] });
        }}
      />
    );
  }

  // ÉCRAN 1 : PAGE LISTE « DOCUMENTS & JUSTIFICATIFS »
  return (
    <div className="space-y-space-md">
      {/* 1. EN-TÊTE DE LA PAGE */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Documents & Justificatifs
          </h1>
          <p className="text-xs text-muted mt-1 font-medium">
            Centralisez vos justificatifs et validez les données extraites automatiquement (OCR).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-9 px-3.5 text-xs font-semibold border-border hover:bg-background-secondary text-ink flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-ink" />
            <span>Exporter</span>
          </Button>

          <Button
            type="button"
            onClick={() => setIsUploadDrawerOpen(true)}
            className="bg-primary text-ink text-xs font-bold hover:brightness-95 active:scale-[0.99] transition-all shadow-xs flex items-center gap-1.5 h-9 px-4 rounded"
          >
            <Plus className="w-4 h-4 text-ink" />
            <span>Téléverser un justificatif</span>
          </Button>
        </div>
      </section>

      {/* 2. RANGÉE DE 4 CARTES DE SYNTHÈSE COMPACTES ET CLIQUABLES */}
      <section
        aria-label="Synthèse des justificatifs"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-1"
      >
        {/* Carte 1 : À vérifier */}
        <button
          type="button"
          onClick={() =>
            setStatusFilter(statusFilter === "to_verify" ? "all" : "to_verify")
          }
          className={cn(
            "p-4 rounded-xl border text-left transition-all bg-background select-none flex flex-col justify-between",
            statusFilter === "to_verify"
              ? "border-warning ring-2 ring-warning/30 bg-warning/5"
              : "border-border hover:border-border/80 hover:shadow-2xs"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-muted uppercase">
              À VÉRIFIER
            </span>
            <span className="w-2 h-2 rounded-full bg-warning" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-ink font-mono tabular-nums">
            {metrics.toVerify}
          </div>
          <p className="mt-1 text-[11px] text-muted">Données à valider</p>
        </button>

        {/* Carte 2 : Extraits */}
        <button
          type="button"
          onClick={() =>
            setStatusFilter(statusFilter === "extracted" ? "all" : "extracted")
          }
          className={cn(
            "p-4 rounded-xl border text-left transition-all bg-background select-none flex flex-col justify-between",
            statusFilter === "extracted"
              ? "border-primary ring-2 ring-primary/30 bg-primary/5"
              : "border-border hover:border-border/80 hover:shadow-2xs"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-muted uppercase">
              EXTRAITS
            </span>
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-ink font-mono tabular-nums">
            {metrics.extracted}
          </div>
          <p className="mt-1 text-[11px] text-muted">Analyse en cours</p>
        </button>

        {/* Carte 3 : Validés */}
        <button
          type="button"
          onClick={() =>
            setStatusFilter(statusFilter === "processed" ? "all" : "processed")
          }
          className={cn(
            "p-4 rounded-xl border text-left transition-all bg-background select-none flex flex-col justify-between",
            statusFilter === "processed"
              ? "border-success ring-2 ring-success/30 bg-success/5"
              : "border-border hover:border-border/80 hover:shadow-2xs"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-muted uppercase">
              VALIDÉS
            </span>
            <span className="w-2 h-2 rounded-full bg-success" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-ink font-mono tabular-nums">
            {metrics.processed}
          </div>
          <p className="mt-1 text-[11px] text-muted">Écritures comptabilisées</p>
        </button>

        {/* Carte 4 : En erreur */}
        <button
          type="button"
          onClick={() =>
            setStatusFilter(statusFilter === "error" ? "all" : "error")
          }
          className={cn(
            "p-4 rounded-xl border text-left transition-all bg-background select-none flex flex-col justify-between",
            statusFilter === "error"
              ? "border-error ring-2 ring-error/30 bg-error/5"
              : "border-border hover:border-border/80 hover:shadow-2xs"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-muted uppercase">
              EN ERREUR
            </span>
            <span className="w-2 h-2 rounded-full bg-error" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-ink font-mono tabular-nums">
            {metrics.error}
          </div>
          <p className="mt-1 text-[11px] text-muted">À relancer</p>
        </button>
      </section>

      {/* 3. BARRE DE FILTRES MULTI-CRITÈRES */}
      <section className="p-3 sm:p-4 rounded-xl border border-border bg-background flex flex-col lg:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Rechercher fournisseur, fichier, référence..."
            className="pl-9 pr-3 h-9 text-xs bg-background border-border text-ink focus:border-ink placeholder:text-muted"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Filtre Statut */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as FilterStatus);
              setCurrentPage(1);
            }}
            aria-label="Filtrer par statut"
            className="h-9 rounded-md border border-border bg-background px-3 text-xs text-ink focus:border-ink focus:ring-0"
          >
            <option value="all">Tous les statuts</option>
            <option value="to_verify">À vérifier</option>
            <option value="extracted">En extraction</option>
            <option value="processed">Validé</option>
            <option value="error">Erreur</option>
          </select>

          {/* Filtre Période */}
          <select
            value={periodFilter}
            onChange={(e) => {
              setPeriodFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filtrer par période"
            className="h-9 rounded-md border border-border bg-background px-3 text-xs text-ink focus:border-ink focus:ring-0"
          >
            <option value="all">Toutes périodes</option>
            <option value="month">Ce mois-ci</option>
            <option value="year">Cette année</option>
          </select>

          {/* Filtre Compte de charge */}
          <select
            value={accountFilter}
            onChange={(e) => {
              setAccountFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filtrer par compte de charge"
            className="h-9 rounded-md border border-border bg-background px-3 text-xs text-ink focus:border-ink focus:ring-0 max-w-[160px]"
          >
            <option value="all">Tous les comptes</option>
            <option value="605">605 - Achats</option>
            <option value="626">626 - Frais télécoms</option>
            <option value="628">628 - Services ext.</option>
            <option value="661">661 - Salaires</option>
          </select>
        </div>
      </section>

      {/* BARRE D'ACTIONS GROUPÉES AU COCHAGE DE LIGNES */}
      {selectedIds.length > 0 && (
        <aside
          role="region"
          aria-label="Actions groupées"
          className="p-3 rounded-lg border border-primary/40 bg-primary/10 flex items-center justify-between text-xs text-ink select-none animate-in fade-in-50"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold font-mono tabular-nums">
              {selectedIds.length} sélectionné(s)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleBulkValidate}
              disabled={isBulkProcessing}
              className="h-7 px-3 text-xs font-bold bg-primary text-ink hover:brightness-95"
            >
              {isBulkProcessing ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Check className="w-3 h-3 mr-1" />
              )}
              <span>Valider la sélection</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isBulkProcessing}
              className="h-7 px-3 text-xs font-medium text-error border-error/30 hover:bg-error/10"
            >
              <Trash2 className="w-3 h-3 mr-1 text-error" />
              <span>Supprimer</span>
            </Button>
          </div>
        </aside>
      )}

      {/* 4. TABLEAU DE DONNÉES AVEC CASES À COCHER & PAGINATION */}
      <div className="rounded-xl border border-border bg-background shadow-xs overflow-hidden">
        {/* Vue Desktop / Tablette */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="border-b border-border bg-background-secondary text-muted font-semibold tracking-wider text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4 w-10">
                  <Checkbox
                    checked={
                      paginatedDocuments.length > 0 &&
                      selectedIds.length === paginatedDocuments.length
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Tout sélectionner"
                  />
                </th>
                <th className="py-3 px-4">Fichier</th>
                <th className="py-3 px-4">Fournisseur</th>
                <th className="py-3 px-4">Date facture</th>
                <th className="py-3 px-4 text-right">Montant TTC</th>
                <th className="py-3 px-4 text-right">TVA déductible</th>
                <th className="py-3 px-4">Compte</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Ajouté le</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border text-ink">
              {isLoading ? (
                [...Array(pageSize)].map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={10} className="py-3 px-4">
                      <div className="h-5 w-full bg-background-secondary/60 animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : filteredDocuments.length === 0 ? (
                /* ÉCRAN 1 BIS : ÉTAT VIDE */
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-background-secondary border border-border flex items-center justify-center text-muted mb-3">
                        <FileText className="w-6 h-6 text-muted" />
                      </div>
                      <h3 className="text-sm font-bold text-ink">
                        Aucun justificatif pour le moment
                      </h3>
                      <p className="text-xs text-muted mt-1 font-normal">
                        Déposez une facture ou un reçu, nous extrayons les données pour vous.
                      </p>
                      <Button
                        type="button"
                        onClick={() => setIsUploadDrawerOpen(true)}
                        className="mt-4 bg-primary text-ink text-xs font-bold hover:brightness-95 h-9 px-4 rounded shadow-xs"
                      >
                        <Plus className="w-4 h-4 mr-1 text-ink" />
                        <span>Téléverser un justificatif</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedDocuments.map((doc) => {
                  const isChecked = selectedIds.includes(doc.id);
                  const ext = doc.extracted_data || {};
                  const isProcessed = doc.status === "processed";
                  const isError = doc.status === "error";
                  const isProcessing =
                    doc.status === "processing" || doc.status === "uploaded";
                  const isToVerify = !isProcessed && !isError && !isProcessing;

                  const fileUrl = doc.file_url?.startsWith("http")
                    ? doc.file_url
                    : `/api/documents/${doc.id}/file`;

                  return (
                    <tr
                      key={doc.id}
                      className={cn(
                        "hover:bg-background-secondary/40 transition-colors group cursor-pointer",
                        isChecked && "bg-primary/5"
                      )}
                      onClick={() => handleOpenVerification(doc)}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleSelectOne(doc.id, Boolean(checked))
                          }
                          aria-label={`Sélectionner ${doc.original_filename}`}
                        />
                      </td>

                      {/* Fichier (icône + nom tronqué) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <FileText className="w-4 h-4 text-muted shrink-0" />
                          <span
                            className="font-medium text-ink truncate"
                            title={doc.original_filename}
                          >
                            {doc.original_filename || "Document"}
                          </span>
                        </div>
                      </td>

                      {/* Fournisseur */}
                      <td className="py-3 px-4 font-medium text-ink">
                        {ext.vendor_name || (
                          <span className="text-muted italic">Non identifié</span>
                        )}
                      </td>

                      {/* Date facture */}
                      <td className="py-3 px-4 text-muted tnum font-medium">
                        {ext.date
                          ? formatDate(ext.date)
                          : doc.issue_date
                          ? formatDate(doc.issue_date)
                          : "—"}
                      </td>

                      {/* Montant TTC */}
                      <td className="py-3 px-4 font-bold text-right tnum text-ink">
                        {ext.amount ? formatCFA(Number(ext.amount)) : "0 F CFA"}
                      </td>

                      {/* TVA déductible */}
                      <td className="py-3 px-4 font-medium text-right tnum text-muted">
                        {ext.vat_amount ? formatCFA(Number(ext.vat_amount)) : "0 F CFA"}
                      </td>

                      {/* Compte (ex. 628) */}
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-ink">
                        <span className="px-1.5 py-0.5 rounded bg-background-secondary border border-border">
                          {ext.account_code || "628"}
                        </span>
                      </td>

                      {/* Statut avec pastille point + texte */}
                      <td className="py-3 px-4">
                        {isProcessed ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink bg-success/20 px-2 py-0.5 rounded border border-success/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                            <span>Validé</span>
                          </span>
                        ) : isError ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-error bg-error/15 px-2 py-0.5 rounded border border-error/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
                            <span>Erreur</span>
                          </span>
                        ) : isProcessing ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted bg-background-secondary px-2 py-0.5 rounded border border-border">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted shrink-0" />
                            <span>En extraction</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink bg-warning/20 px-2 py-0.5 rounded border border-warning/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                            <span>À vérifier</span>
                          </span>
                        )}
                      </td>

                      {/* Ajouté le */}
                      <td className="py-3 px-4 text-muted tnum font-medium">
                        {doc.created_at ? formatDate(doc.created_at) : "—"}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Bouton contextuel selon statut */}
                          {isError ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={(e) => handleRetryOCR(doc.id, e)}
                              className="h-7 px-2 text-xs font-semibold text-error border-error/30 hover:bg-error/10"
                            >
                              <RotateCw className="w-3 h-3 mr-1" />
                              <span>Réessayer</span>
                            </Button>
                          ) : isProcessed ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenVerification(doc)}
                              className="h-7 px-2 text-xs font-semibold text-ink border-border hover:bg-background-secondary"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              <span>Voir</span>
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleOpenVerification(doc)}
                              className="h-7 px-2.5 text-xs font-bold bg-primary text-ink hover:brightness-95 shadow-2xs"
                            >
                              <span>Vérifier</span>
                            </Button>
                          )}

                          {/* Menu contextuel "..." */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted hover:text-ink hover:bg-background-secondary rounded"
                                title="Actions complémentaires"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-44 bg-background border border-border"
                            >
                              <DropdownMenuItem asChild className="text-xs cursor-pointer">
                                <a
                                  href={fileUrl}
                                  download={doc.original_filename}
                                  className="flex items-center w-full"
                                >
                                  <Download className="w-3.5 h-3.5 mr-2 text-muted" />
                                  <span>Télécharger</span>
                                </a>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={(e) => handleDeleteOne(doc, e as any)}
                                className="text-xs text-error cursor-pointer flex items-center"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2 text-error" />
                                <span>Supprimer</span>
                              </DropdownMenuItem>
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

        {/* 5. CONTRÔLE DE PAGINATION issu de 21st.dev */}
        {filteredDocuments.length > 0 && (
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
            labelSingular="justificatif"
            labelPlural="justificatifs"
          />
        )}
      </div>

      {/* ÉCRAN 2 : PANNEAU LATÉRAL DE TÉLÉVERSEMENT MULTI-FICHIERS */}
      <DocumentUploadDrawer
        open={isUploadDrawerOpen}
        onOpenChange={setIsUploadDrawerOpen}
        onDocumentReady={(docId) => {
          queryClient.invalidateQueries({ queryKey: ["documents"] });
        }}
        onAllCompleted={(docIds) => {
          queryClient.invalidateQueries({ queryKey: ["documents"] });
          if (docIds.length > 0) {
            const index = documents.findIndex((d) => d.id === docIds[0]);
            setActiveVerificationIndex(index >= 0 ? index : 0);
            setCurrentView("verify");
          }
        }}
      />
    </div>
  );
}

export default Documents;