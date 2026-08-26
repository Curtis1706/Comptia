"use client";

import { useState } from "react";
import { Search, ArrowRightLeft, CheckCircle2, AlertCircle, Trash2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Rapprochement = () => {
  const queryClient = useQueryClient();
  const [selectedBank, setSelectedBank] = useState<string[]>([]);
  const [selectedLedger, setSelectedLedger] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [treasurySource, setTreasurySource] = useState<"bank" | "mobile_money" | "cash">("bank");

  // 1. Fetch Bank / Mobile Money Transactions (Unmatched)
  const { data: bankRes, isLoading: bankLoading } = useQuery<any>({
    queryKey: ["bank-transactions", treasurySource],
    queryFn: () => fetcher(`/api/accounting/reconcile/bank?source=${treasurySource}`),
  });
  const bankTransactions = bankRes?.data || [];

  // 2. Fetch Ledger Entries (Unmatched Bank / Mobile Money Journal)
  const { data: ledgerRes, isLoading: ledgerLoading } = useQuery<any>({
    queryKey: ["ledger-entries", treasurySource],
    queryFn: () => fetcher(`/api/accounting/reconcile/ledger?source=${treasurySource}`),
  });
  const ledgerEntries = ledgerRes?.data || [];

  const totalBankSelected = bankTransactions
    .filter((t: any) => selectedBank.includes(t.id))
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  const totalLedgerSelected = ledgerEntries
    .filter((l: any) => selectedLedger.includes(l.id))
    .reduce((sum: number, l: any) => sum + Number(l.debit) - Number(l.credit), 0);

  const difference = totalBankSelected - totalLedgerSelected;
  const isBalanced = Math.abs(difference) < 0.01 && selectedBank.length > 0 && selectedLedger.length > 0;

  const handleMatch = async () => {
    if (!isBalanced) {
      toast.error("Les montants doivent être équilibrés pour le rapprochement.");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("/api/accounting/reconcile/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        toast.error(result.error);
      }
    } catch (e) {
      toast.error("Erreur lors du rapprochement");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Rapprochement Bancaire & Mobile Money" 
        subtitle="Rapprochez vos relevés bancaires (521) et Mobile Money MTN/Moov/Celtiis (585) avec vos écritures"
        actions={
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-1.5 px-4 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Différence</p>
              <p className={cn("font-display font-bold tabular", isBalanced ? "text-success" : "text-destructive")}>
                {formatCFA(difference)}
              </p>
            </div>
            <Button 
              size="sm" 
              className={cn("shadow-glow", isBalanced ? "bg-success hover:bg-success/90" : "bg-primary")}
              disabled={!isBalanced || isProcessing}
              onClick={handleMatch}
            >
              {isBalanced ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
              Valider le rapprochement
            </Button>
          </div>
        }
      />

      {/* Sélecteur de compte de trésorerie */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <span className="text-xs font-semibold text-muted-foreground mr-2">Compte de trésorerie :</span>
        <Button
          variant={treasurySource === "bank" ? "default" : "outline"}
          size="sm"
          onClick={() => { setTreasurySource("bank"); setSelectedBank([]); setSelectedLedger([]); }}
        >
          Banque (521)
        </Button>
        <Button
          variant={treasurySource === "mobile_money" ? "default" : "outline"}
          size="sm"
          onClick={() => { setTreasurySource("mobile_money"); setSelectedBank([]); setSelectedLedger([]); }}
        >
          Mobile Money MTN / Moov / Celtiis (585)
        </Button>
        <Button
          variant={treasurySource === "cash" ? "default" : "outline"}
          size="sm"
          onClick={() => { setTreasurySource("cash"); setSelectedBank([]); setSelectedLedger([]); }}
        >
          Caisse siège (541)
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Bank Side */}
        <div className="flex flex-col rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-primary" /> Relevé Bancaire
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{bankTransactions.length} transactions</span>
            </div>
            <div className="mt-3 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une transaction..." className="pl-9 h-9" />
            </div>
          </div>
          <div className="h-[500px] overflow-y-auto p-2 space-y-1">
            {bankLoading ? (
               <p className="p-8 text-center text-sm text-muted-foreground">Chargement...</p>
            ) : bankTransactions.length === 0 ? (
               <p className="p-8 text-center text-sm text-muted-foreground">Aucune transaction bancaire à rapprocher</p>
            ) : bankTransactions.map((t: any) => (
              <button
                key={t.id}
                onClick={() => setSelectedBank(prev => prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id])}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-3 text-left transition text-sm",
                  selectedBank.includes(t.id) ? "bg-primary-soft ring-1 ring-primary/30" : "hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                  Number(t.amount) > 0 ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive"
                )}>
                  {Number(t.amount) > 0 ? "+" : "-"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{t.description}</p>
                  <p className="text-[10px] text-muted-foreground">{formatDate(t.date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold tabular">{formatCFA(t.amount)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Ledger Side */}
        <div className="flex flex-col rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-info" /> Comptabilité (Banque)
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{ledgerEntries.length} écritures</span>
            </div>
            <div className="mt-3 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une écriture..." className="pl-9 h-9" />
            </div>
          </div>
          <div className="h-[500px] overflow-y-auto p-2 space-y-1">
            {ledgerLoading ? (
               <p className="p-8 text-center text-sm text-muted-foreground">Chargement...</p>
            ) : ledgerEntries.length === 0 ? (
               <p className="p-8 text-center text-sm text-muted-foreground">Aucune écriture comptable en attente</p>
            ) : ledgerEntries.map((l: any) => (
              <button
                key={l.id}
                onClick={() => setSelectedLedger(prev => prev.includes(l.id) ? prev.filter(id => id !== l.id) : [...prev, l.id])}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-3 text-left transition text-sm",
                  selectedLedger.includes(l.id) ? "bg-info-soft ring-1 ring-info/30" : "hover:bg-muted/50"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground text-[10px] font-mono">
                  {l.entry.reference.slice(-3)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{l.description || l.entry.description}</p>
                  <p className="text-[10px] text-muted-foreground">{formatDate(l.entry.date)} · Ref: {l.entry.reference}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold tabular">
                    {formatCFA(Number(l.debit) - Number(l.credit))}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rapprochement;
