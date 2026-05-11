"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, Download, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, mutate } from "@/lib/fetcher";
import { formatCFA, formatDateLong } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const TVA = () => {
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState({
    start: `${new Date().getFullYear()}-01-01`,
    end: `${new Date().getFullYear()}-03-31`,
    type: "CA3" as const,
  });

  const { data: declarationsRes, isLoading: listLoading } = useQuery<any>({
    queryKey: ["vat-declarations", new Date().getFullYear()],
    queryFn: () => fetcher(`/api/vat/declarations?year=${new Date().getFullYear()}`),
  });

  const { data: previewRes, isLoading: previewLoading } = useQuery<any>({
    queryKey: ["vat-preview", selectedPeriod],
    queryFn: () =>
      fetcher(
        `/api/vat/preview?period_start=${selectedPeriod.start}&period_end=${selectedPeriod.end}&type=${selectedPeriod.type}`
      ),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const declarations = Array.isArray(declarationsRes) ? declarationsRes : [];
  const preview = previewRes;

  const handleSubmitDeclaration = async () => {
    setIsSubmitting(true);
    try {
      const createRes = await mutate("/api/vat/declarations", {
        method: "POST",
        body: JSON.stringify({
          period_start: selectedPeriod.start,
          period_end: selectedPeriod.end,
          declaration_type: selectedPeriod.type,
        }),
      });

      if (!createRes.success) throw new Error(createRes.error);
      const declaration = createRes.data;

      const submitRes = await mutate(`/api/vat/declarations/${declaration.id}/submit`, {
        method: "POST",
      });

      if (!submitRes.success) throw new Error(submitRes.error);

      toast.success("Déclaration TVA soumise avec succès");
      queryClient.invalidateQueries({ queryKey: ["vat-declarations"] });
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const months = [
    { value: 0, label: "Janvier" }, { value: 1, label: "Février" }, { value: 2, label: "Mars" },
    { value: 3, label: "Avril" }, { value: 4, label: "Mai" }, { value: 5, label: "Juin" },
    { value: 6, label: "Juillet" }, { value: 7, label: "Août" }, { value: 8, label: "Septembre" },
    { value: 9, label: "Octobre" }, { value: 10, label: "Novembre" }, { value: 11, label: "Décembre" }
  ];

  const handleMonthChange = (monthIndex: number) => {
    const year = new Date().getFullYear();
    const start = new Date(year, monthIndex, 1).toISOString().split("T")[0];
    const end = new Date(year, monthIndex + 1, 0).toISOString().split("T")[0];
    setSelectedPeriod({ start, end, type: "CA3" });
  };

  const currentMonthIndex = new Date(selectedPeriod.start).getMonth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion TVA"
        subtitle="Préparez et suivez vos déclarations en quelques clics"
        actions={
          <Button 
            size="sm" 
            className="bg-gradient-primary hover:opacity-90"
            onClick={handleSubmitDeclaration}
            disabled={isSubmitting || previewLoading}
          >
            {isSubmitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
            Soumettre la déclaration
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-gradient-primary p-6 text-primary-foreground shadow-card">
          <p className="text-xs uppercase tracking-wider opacity-80">Aperçu période sélectionnée</p>
          <p className="mt-2 font-display text-3xl font-semibold tabular">
            {previewLoading ? "..." : formatCFA(preview?.vat_due || 0)}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <label className="text-[10px] uppercase opacity-70">Période (Mois)</label>
            <select 
              className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-sm text-white focus:outline-none"
              value={currentMonthIndex}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value} className="text-black">{m.label} {new Date().getFullYear()}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <p className="text-xs text-muted-foreground">TVA collectée (période)</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular">
            {previewLoading ? "..." : formatCFA(preview?.vat_collected || 0)}
          </p>
          <p className="mt-1 text-xs text-success">Sur ventes</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <p className="text-xs text-muted-foreground">TVA déductible (période)</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular">
            {previewLoading ? "..." : formatCFA(preview?.vat_deductible || 0)}
          </p>
          <p className="mt-1 text-xs text-info">Sur achats</p>
        </div>
      </div>

      {preview && (
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <h4 className="text-sm font-semibold mb-3">Détails du calcul</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Ventes HT : <span className="font-semibold text-foreground">{formatCFA(preview.ca_ht)}</span></p>
              <p className="text-xs text-muted-foreground">Achats HT : <span className="font-semibold text-foreground">{formatCFA(preview.purchases_ht)}</span></p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Type : <span className="font-semibold text-foreground">{preview.declaration_type}</span></p>
              <p className="text-xs text-muted-foreground">Statut : <span className="text-warning font-semibold">Brouillon (aperçu)</span></p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Historique des déclarations</h3>
          <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" /> Exporter</Button>
        </div>

        {listLoading ? (
          <div className="space-y-4">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="h-20 w-full rounded-lg bg-muted animate-pulse" />
             ))}
          </div>
        ) : (
          <ol className="relative space-y-6 border-l-2 border-border pl-6">
            {declarations.map((d: any) => {
              const submitted = d.status === "submitted" || d.status === "accepted";
              return (
                <li key={d.id} className="relative">
                  <span className={cn(
                    "absolute -left-[33px] flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-card",
                    submitted ? "bg-success" : "bg-warning",
                  )}>
                    {submitted ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Clock className="h-4 w-4 text-white" />}
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 hover:shadow-card transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {new Date(d.period_start).toLocaleDateString("fr-FR", { month: "long" })} - {new Date(d.period_end).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                        </p>
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">{d.declaration_type}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Créée le : {formatDateLong(d.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tabular text-sm font-semibold">{formatCFA(d.vat_due)}</span>
                      {submitted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">
                          <CheckCircle2 className="h-3 w-3" /> Soumise
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning">
                          <AlertTriangle className="h-3 w-3" /> À soumettre
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
};

export default TVA;