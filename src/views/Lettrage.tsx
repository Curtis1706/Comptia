"use client";

import { useState } from "react";
import { Search, UserCheck, ShieldCheck, Filter, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Lettrage = () => {
  const queryClient = useQueryClient();
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [accountFilter, setAccountFilter] = useState("411"); // Default: Clients
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: linesRes, isLoading } = useQuery<any>({
    queryKey: ["lettering-lines", accountFilter],
    queryFn: () => fetcher(`/api/accounting/lettering/list?account=${accountFilter}`),
  });
  const lines = linesRes?.data || [];

  const totalDebit = lines
    .filter((l: any) => selectedLines.includes(l.id))
    .reduce((sum: number, l: any) => sum + Number(l.debit), 0);

  const totalCredit = lines
    .filter((l: any) => selectedLines.includes(l.id))
    .reduce((sum: number, l: any) => sum + Number(l.credit), 0);

  const difference = totalDebit - totalCredit;
  const isBalanced = Math.abs(difference) < 0.01 && selectedLines.length >= 2;

  const handleLetter = async () => {
    if (!isBalanced) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/accounting/lettering/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: selectedLines }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`Lettrage effectué avec le code ${result.data.code}`);
        setSelectedLines([]);
        queryClient.invalidateQueries({ queryKey: ["lettering-lines"] });
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error("Erreur lors du lettrage");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lettrage Tiers"
        subtitle="Associez vos factures à leurs règlements pour équilibrer vos comptes de tiers"
        actions={
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-1.5 px-4 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Écart</p>
              <p className={cn("font-display font-bold tabular", isBalanced ? "text-success" : "text-destructive")}>
                {formatCFA(difference)}
              </p>
            </div>
            <Button
              size="sm"
              className={cn("shadow-glow", isBalanced ? "bg-success hover:bg-success/90" : "bg-primary")}
              disabled={!isBalanced || isProcessing}
              onClick={handleLetter}
            >
              {isBalanced ? <ShieldCheck className="mr-2 h-4 w-4" /> : <Link2 className="mr-2 h-4 w-4" />}
              Lettrer la sélection
            </Button>
          </div>
        }
      />

      <div className="flex flex-col rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border p-4 bg-muted/20 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="bg-transparent text-sm font-semibold outline-none focus:ring-0"
            >
              <option value="411">411 - Clients</option>
              <option value="401">401 - Fournisseurs/Prestataires</option>
              <option value="421">421 - Personnel</option>
              <option value="444">444 - État (Impôts)</option>
            </select>
          </div>
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher par libellé ou montant..." className="pl-9 h-9" />
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase ml-auto">{lines.length} lignes non lettrées</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/10 text-xs uppercase text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Journal</th>
                <th className="px-4 py-3">Libellé</th>
                <th className="px-4 py-3">Tiers</th>
                <th className="px-4 py-3 text-right">Débit</th>
                <th className="px-4 py-3 text-right">Crédit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" /></td></tr>
              ) : lines.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Aucune ligne en attente de lettrage pour ce compte</td></tr>
              ) : lines.map((l: any) => (
                <tr
                  key={l.id}
                  className={cn(
                    "hover:bg-muted/20 transition cursor-pointer",
                    selectedLines.includes(l.id) && "bg-primary-soft/50"
                  )}
                  onClick={() => setSelectedLines(prev => prev.includes(l.id) ? prev.filter(id => id !== l.id) : [...prev, l.id])}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      readOnly
                      checked={selectedLines.includes(l.id)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">{formatDate(l.entry.date)}</td>
                  <td className="px-4 py-3 text-xs font-mono uppercase text-muted-foreground">{l.entry.journal}</td>
                  <td className="px-4 py-3 font-medium">{l.description || l.entry.description}</td>
                  <td className="px-4 py-3">{l.third_party || "-"}</td>
                  <td className="px-4 py-3 text-right tabular text-success font-semibold">{Number(l.debit) > 0 ? formatCFA(l.debit) : ""}</td>
                  <td className="px-4 py-3 text-right tabular text-destructive font-semibold">{Number(l.credit) > 0 ? formatCFA(l.credit) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Lettrage;
