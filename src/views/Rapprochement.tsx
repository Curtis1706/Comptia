"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  UploadCloud,
  RotateCcw,
  History,
  Check,
  Building2,
  Smartphone,
  Wallet,
  Info,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { BankStatementImportModal } from "@/components/accounting/BankStatementImportModal";
import { AccountingNav } from "@/components/accounting/AccountingNav";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Rapprochement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [treasurySource, setTreasurySource] = useState<"bank" | "mobile_money" | "cash">("bank");
  const [selectedBank, setSelectedBank] = useState<string[]>([]);
  const [selectedLedger, setSelectedLedger] = useState<string[]>([]);
  const [bankSearch, setBankSearch] = useState("");
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [unmatchingId, setUnmatchingId] = useState<string | null>(null);

  // 1. Transactions bancaires en attente
  const { data: bankRes, isLoading: bankLoading } = useQuery<any>({
    queryKey: ["bank-transactions", treasurySource, "unmatched"],
    queryFn: () => fetcher(`/api/accounting/reconcile/bank?source=${treasurySource}&status=unmatched`),
  });
  const bankTransactions: any[] = bankRes?.data || [];

  // 2. Écritures comptables grand livre en attente
  const { data: ledgerRes, isLoading: ledgerLoading } = useQuery<any>({
    queryKey: ["ledger-entries", treasurySource, "unmatched"],
    queryFn: () => fetcher(`/api/accounting/reconcile/ledger?source=${treasurySource}&status=unmatched`),
  });
  const ledgerEntries: any[] = ledgerRes?.data || [];

  // 3. Historique des rapprochements validés
  const { data: historyRes, isLoading: historyLoading } = useQuery<any>({
    queryKey: ["bank-transactions", treasurySource, "matched"],
    queryFn: () => fetcher(`/api/accounting/reconcile/bank?source=${treasurySource}&status=matched`),
    enabled: activeTab === "history",
  });
  const historyTransactions: any[] = historyRes?.data || [];

  // Filtrage temps réel côté client
  const filteredBankTransactions = useMemo(() => {
    if (!bankSearch.trim()) return bankTransactions;
    const q = bankSearch.toLowerCase().trim();
    return bankTransactions.filter(
      (t: any) =>
        t.description?.toLowerCase().includes(q) ||
        t.reference?.toLowerCase().includes(q) ||
        String(t.amount).includes(q)
    );
  }, [bankTransactions, bankSearch]);

  const filteredLedgerEntries = useMemo(() => {
    if (!ledgerSearch.trim()) return ledgerEntries;
    const q = ledgerSearch.toLowerCase().trim();
    return ledgerEntries.filter(
      (l: any) =>
        l.description?.toLowerCase().includes(q) ||
        l.entry?.description?.toLowerCase().includes(q) ||
        l.entry?.reference?.toLowerCase().includes(q) ||
        l.account_code?.includes(q)
    );
  }, [ledgerEntries, ledgerSearch]);

  // Calculs financiers d'équilibre
  const totalBankSelected = useMemo(() => {
    return bankTransactions
      .filter((t: any) => selectedBank.includes(t.id))
      .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
  }, [bankTransactions, selectedBank]);

  const totalLedgerSelected = useMemo(() => {
    return ledgerEntries
      .filter((l: any) => selectedLedger.includes(l.id))
      .reduce((sum: number, l: any) => sum + Number(l.debit || 0) - Number(l.credit || 0), 0);
  }, [ledgerEntries, selectedLedger]);

  const difference = totalBankSelected - totalLedgerSelected;
  const isBalanced =
    Math.abs(difference) < 0.01 && selectedBank.length > 0 && selectedLedger.length > 0;

  // Validation du rapprochement
  const handleMatch = async () => {
    if (!isBalanced) {
      toast.error("Les montants sélectionnés doivent être parfaitement équilibrés pour valider le rapprochement.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/accounting/reconcile/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bank_ids: selectedBank,
          ledger_ids: selectedLedger,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Rapprochement validé avec succès !");
        setSelectedBank([]);
        setSelectedLedger([]);
        queryClient.invalidateQueries({ queryKey: ["bank-transactions"] });
        queryClient.invalidateQueries({ queryKey: ["ledger-entries"] });
      } else {
        toast.error(result.error || "Erreur lors du rapprochement");
      }
    } catch {
      toast.error("Erreur réseau lors de la validation du rapprochement");
    } finally {
      setIsProcessing(false);
    }
  };

  // Annulation d'un rapprochement (Dé-rapprocher)
  const handleUnmatch = async (bankId: string) => {
    setUnmatchingId(bankId);
    try {
      const res = await fetch("/api/accounting/reconcile/unmatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bank_ids: [bankId],
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Opération dé-rapprochée avec succès. Les écritures sont de nouveau disponibles.");
        queryClient.invalidateQueries({ queryKey: ["bank-transactions"] });
        queryClient.invalidateQueries({ queryKey: ["ledger-entries"] });
      } else {
        toast.error(result.error || "Erreur lors de l'annulation du rapprochement");
      }
    } catch {
      toast.error("Erreur de connexion lors du dé-rapprochement");
    } finally {
      setUnmatchingId(null);
    }
  };

  const handleSourceChange = (source: "bank" | "mobile_money" | "cash") => {
    setTreasurySource(source);
    setSelectedBank([]);
    setSelectedLedger([]);
    setBankSearch("");
    setLedgerSearch("");
  };

  return (
    <div className="space-y-6 font-sans">
      <AccountingNav />
      <PageHeader
        title="Rapprochement Bancaire & Trésorerie"
        subtitle="Rapprochez vos relevés bancaires (521) et Mobile Money (585) avec vos écritures comptables SYSCOHADA"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
              className="rounded border-border text-ink hover:bg-background-secondary"
            >
              <UploadCloud className="mr-2 h-4 w-4 text-primary" />
              Importer un relevé
            </Button>

            {activeTab === "pending" && (selectedBank.length > 0 || selectedLedger.length > 0) && (
              <div className="flex items-center gap-3 rounded border border-border bg-background p-1.5 px-3 shadow-sm">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-text-muted">Écart</p>
                  <p
                    className={cn(
                      "font-mono font-bold text-sm tabular-nums",
                      isBalanced ? "text-success" : "text-error"
                    )}
                  >
                    {formatCFA(difference)}
                  </p>
                </div>
                <Button
                  size="sm"
                  disabled={!isBalanced || isProcessing}
                  onClick={handleMatch}
                  className={cn(
                    "rounded font-semibold shadow-sm transition",
                    isBalanced
                      ? "bg-success text-ink hover:bg-success/90"
                      : "bg-background-secondary text-text-muted border border-border cursor-not-allowed"
                  )}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Valider le rapprochement
                </Button>
              </div>
            )}
          </div>
        }
      />

      {/* Onglets principaux : Opérations à rapprocher / Historique */}
      <div className="flex items-center justify-between border-b border-border pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t border-b-2 transition",
              activeTab === "pending"
                ? "border-primary text-ink bg-background-secondary/40 font-bold"
                : "border-transparent text-text-muted hover:text-ink"
            )}
          >
            <ArrowRightLeft className="h-4 w-4 text-primary" />
            Opérations à rapprocher
            {bankTransactions.length > 0 && (
              <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-ink">
                {bankTransactions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t border-b-2 transition",
              activeTab === "history"
                ? "border-primary text-ink bg-background-secondary/40 font-bold"
                : "border-transparent text-text-muted hover:text-ink"
            )}
          >
            <History className="h-4 w-4 text-text-muted" />
            Historique rapproché
          </button>
        </div>

        {/* Sélecteur de compte de trésorerie (521 / 585 / 571) */}
        <div className="hidden sm:flex items-center gap-1.5 bg-background-secondary p-1 rounded border border-border">
          <button
            type="button"
            onClick={() => handleSourceChange("bank")}
            className={cn(
              "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition",
              treasurySource === "bank"
                ? "bg-background text-ink shadow-sm border border-border"
                : "text-text-muted hover:text-ink"
            )}
          >
            <Building2 className="h-3.5 w-3.5 text-primary" />
            Banque (521)
          </button>
          <button
            type="button"
            onClick={() => handleSourceChange("mobile_money")}
            className={cn(
              "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition",
              treasurySource === "mobile_money"
                ? "bg-background text-ink shadow-sm border border-border"
                : "text-text-muted hover:text-ink"
            )}
          >
            <Smartphone className="h-3.5 w-3.5 text-warning" />
            Mobile Money (585)
          </button>
          <button
            type="button"
            onClick={() => handleSourceChange("cash")}
            className={cn(
              "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition",
              treasurySource === "cash"
                ? "bg-background text-ink shadow-sm border border-border"
                : "text-text-muted hover:text-ink"
            )}
          >
            <Wallet className="h-3.5 w-3.5 text-text-muted" />
            Caisse (571)
          </button>
        </div>
      </div>

      {/* Vue 1 : Table de rapprochement interactif */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* COLONNE GAUCHE : RELEVÉ BANCAIRE */}
            <div className="flex flex-col rounded border border-border bg-background shadow-sm">
              <div className="border-b border-border p-4 bg-background-secondary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-bold text-ink uppercase tracking-wide">
                      Relevé de compte ({treasurySource === "bank" ? "Banque 521" : treasurySource === "mobile_money" ? "MoMo 585" : "Caisse 571"})
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted uppercase font-mono">
                    {filteredBankTransactions.length} opération{filteredBankTransactions.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-3 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                  <Input
                    placeholder="Filtrer les opérations bancaires..."
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    className="pl-9 h-9 rounded border-border bg-background text-xs"
                  />
                </div>
              </div>

              <div className="h-[520px] overflow-y-auto p-2 space-y-1.5">
                {bankLoading ? (
                  <div className="space-y-2 p-2">
                    <Skeleton className="h-14 w-full rounded" />
                    <Skeleton className="h-14 w-full rounded" />
                    <Skeleton className="h-14 w-full rounded" />
                    <Skeleton className="h-14 w-full rounded" />
                  </div>
                ) : filteredBankTransactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <Layers className="mx-auto h-8 w-8 text-text-muted/60 mb-2" />
                    <p className="text-sm font-semibold text-ink">Aucune transaction bancaire en attente</p>
                    <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                      Importez un relevé de compte au format CSV pour afficher les opérations à rapprocher.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsImportModalOpen(true)}
                      className="mt-4 rounded border-border text-xs"
                    >
                      <UploadCloud className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      Importer un relevé maintenant
                    </Button>
                  </div>
                ) : (
                  filteredBankTransactions.map((t: any) => {
                    const isSelected = selectedBank.includes(t.id);
                    const isPositive = Number(t.amount) > 0;
                    return (
                      <div
                        key={t.id}
                        onClick={() =>
                          setSelectedBank((prev) =>
                            prev.includes(t.id) ? prev.filter((id) => id !== t.id) : [...prev, t.id]
                          )
                        }
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-3 rounded border p-3 text-left transition text-xs",
                          isSelected
                            ? "bg-primary/10 border-primary ring-1 ring-primary/40"
                            : "border-border bg-background hover:bg-background-secondary/60"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono font-bold text-xs",
                            isPositive
                              ? "bg-success/20 text-success border border-success/40"
                              : "bg-error/20 text-error border border-error/40"
                          )}
                        >
                          {isPositive ? "+" : "−"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-ink truncate">{t.description}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-text-muted font-mono">
                            <span>{formatDate(t.date)}</span>
                            {t.reference && <span>· Réf : {t.reference}</span>}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p
                            className={cn(
                              "font-mono font-bold text-xs tabular-nums",
                              isPositive ? "text-success" : "text-ink"
                            )}
                          >
                            {isPositive ? `+${formatCFA(t.amount)}` : `-${formatCFA(Math.abs(t.amount))}`}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLONNE DROITE : GRAND LIVRE COMPTABILITÉ */}
            <div className="flex flex-col rounded border border-border bg-background shadow-sm">
              <div className="border-b border-border p-4 bg-background-secondary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-bold text-ink uppercase tracking-wide">
                      Comptabilité ({treasurySource === "bank" ? "Journal Banque" : treasurySource === "mobile_money" ? "Journal MoMo" : "Journal Caisse"})
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted uppercase font-mono">
                    {filteredLedgerEntries.length} écriture{filteredLedgerEntries.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-3 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
                  <Input
                    placeholder="Filtrer les écritures comptables..."
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    className="pl-9 h-9 rounded border-border bg-background text-xs"
                  />
                </div>
              </div>

              <div className="h-[520px] overflow-y-auto p-2 space-y-1.5">
                {ledgerLoading ? (
                  <div className="space-y-2 p-2">
                    <Skeleton className="h-14 w-full rounded" />
                    <Skeleton className="h-14 w-full rounded" />
                    <Skeleton className="h-14 w-full rounded" />
                    <Skeleton className="h-14 w-full rounded" />
                  </div>
                ) : filteredLedgerEntries.length === 0 ? (
                  <div className="p-8 text-center">
                    <Layers className="mx-auto h-8 w-8 text-text-muted/60 mb-2" />
                    <p className="text-sm font-semibold text-ink">Aucune écriture comptable en attente</p>
                    <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                      Toutes vos écritures de trésorerie sont rapprochées ou aucune écriture n&apos;est encore enregistrée sur ce journal.
                    </p>
                  </div>
                ) : (
                  filteredLedgerEntries.map((l: any) => {
                    const isSelected = selectedLedger.includes(l.id);
                    const netAmount = Number(l.debit || 0) - Number(l.credit || 0);
                    const isPositive = netAmount > 0;

                    return (
                      <div
                        key={l.id}
                        onClick={() =>
                          setSelectedLedger((prev) =>
                            prev.includes(l.id) ? prev.filter((id) => id !== l.id) : [...prev, l.id]
                          )
                        }
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-3 rounded border p-3 text-left transition text-xs",
                          isSelected
                            ? "bg-primary/10 border-primary ring-1 ring-primary/40"
                            : "border-border bg-background hover:bg-background-secondary/60"
                        )}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-background-secondary border border-border text-[10px] font-mono font-bold text-text-muted">
                          {l.account_code ? l.account_code.slice(0, 3) : "521"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-ink truncate">
                            {l.description || l.entry?.description || "Écriture de trésorerie"}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-text-muted font-mono">
                            <span>{formatDate(l.entry?.date || l.created_at)}</span>
                            {l.entry?.reference && <span>· Pièce : {l.entry.reference}</span>}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p
                            className={cn(
                              "font-mono font-bold text-xs tabular-nums",
                              isPositive ? "text-success" : "text-ink"
                            )}
                          >
                            {isPositive ? `+${formatCFA(netAmount)}` : `-${formatCFA(Math.abs(netAmount))}`}
                          </p>
                          <span className="text-[9px] uppercase font-bold text-text-muted font-mono">
                            {Number(l.debit) > 0 ? "Débit" : "Crédit"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Bandeau inférieur récapitulatif quand des éléments sont cochés */}
          {(selectedBank.length > 0 || selectedLedger.length > 0) && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded border border-border bg-background-secondary p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-6 text-xs">
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Sélection Relevé ({selectedBank.length})</span>
                  <span className="font-mono font-bold text-sm text-ink tabular-nums">{formatCFA(totalBankSelected)}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Sélection Comptabilité ({selectedLedger.length})</span>
                  <span className="font-mono font-bold text-sm text-ink tabular-nums">{formatCFA(totalLedgerSelected)}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Écart Arithmétique</span>
                  <span className={cn("font-mono font-bold text-sm tabular-nums", isBalanced ? "text-success" : "text-error")}>
                    {formatCFA(difference)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedBank([]);
                    setSelectedLedger([]);
                  }}
                  className="rounded border-border text-xs"
                >
                  Tout désélectionner
                </Button>
                <Button
                  size="sm"
                  disabled={!isBalanced || isProcessing}
                  onClick={handleMatch}
                  className={cn(
                    "rounded font-semibold text-xs",
                    isBalanced ? "bg-primary text-ink hover:bg-primary/90" : "bg-border text-text-muted"
                  )}
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Valider le rapprochement
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vue 2 : Historique des opérations rapprochées */}
      {activeTab === "history" && (
        <div className="rounded border border-border bg-background shadow-sm overflow-hidden">
          <div className="border-b border-border p-4 bg-background-secondary flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wide">
                Historique des opérations rapprochées
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Consultez les écritures comptables associées à vos relevés et annulez un rapprochement si nécessaire.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-text-muted">
              {historyTransactions.length} rapprochée{historyTransactions.length > 1 ? "s" : ""}
            </span>
          </div>

          {historyLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
            </div>
          ) : historyTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <History className="mx-auto h-10 w-10 text-text-muted/50 mb-3" />
              <p className="text-sm font-semibold text-ink">Aucun rapprochement validé pour l&apos;instant</p>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                Dès que vous validez un rapprochement entre vos relevés et vos écritures, il apparaîtra ici avec possibilité de dé-rapprocher.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-background-secondary border-b border-border text-[10px] uppercase font-bold text-text-muted">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Opération Relevé</th>
                    <th className="p-3 text-right">Montant Relevé</th>
                    <th className="p-3">Écritures Comptables Liées</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {historyTransactions.map((tx: any) => {
                    const isPositive = Number(tx.amount) > 0;
                    return (
                      <tr key={tx.id} className="hover:bg-background-secondary/50">
                        <td className="p-3 font-mono text-text-muted whitespace-nowrap">
                          {formatDate(tx.date)}
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-ink">{tx.description}</p>
                          {tx.reference && (
                            <span className="text-[10px] text-text-muted font-mono">
                              Réf : {tx.reference}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                          <span className={isPositive ? "text-success" : "text-ink"}>
                            {formatCFA(tx.amount)}
                          </span>
                        </td>
                        <td className="p-3">
                          {tx.journal_lines && tx.journal_lines.length > 0 ? (
                            <div className="space-y-1">
                              {tx.journal_lines.map((jl: any) => (
                                <div key={jl.id} className="text-[11px] font-mono text-ink flex items-center gap-1.5">
                                  <span className="font-bold text-primary">[{jl.account_code}]</span>
                                  <span className="truncate max-w-xs">{jl.description || "Écriture"}</span>
                                  <span className="text-text-muted">
                                    ({jl.entry?.reference || "Pièce"})
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-text-muted text-[11px]">Rapprochement manuel</span>
                          )}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success border border-success/40">
                            <Check className="h-3 w-3" />
                            Rapproché
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={unmatchingId === tx.id}
                            onClick={() => handleUnmatch(tx.id)}
                            className="rounded border-border text-error hover:bg-error/10 hover:text-error text-xs h-8"
                          >
                            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                            {unmatchingId === tx.id ? "Annulation..." : "Dé-rapprocher"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal d'import de relevé bancaire / Mobile Money */}
      <BankStatementImportModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        defaultSource={treasurySource}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["bank-transactions"] });
        }}
      />
    </div>
  );
};

export default Rapprochement;
