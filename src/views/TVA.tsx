"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, Download, Plus, Loader2, Calendar, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PermissionGate } from "@/components/PermissionGate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, mutate } from "@/lib/fetcher";
import { formatCFA, formatDateLong } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const TVA = () => {
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [selectedPeriod, setSelectedPeriod] = useState({
    start: new Date(currentYear, currentMonth, 1).toISOString().split("T")[0],
    end: new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0],
    type: "monthly" as "monthly" | "quarterly",
  });

  const { data: declarationsRes, isLoading: listLoading } = useQuery<any>({
    queryKey: ["vat-declarations", currentYear],
    queryFn: () => fetcher(`/api/vat/declarations?year=${currentYear}`),
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
  const preview = previewRes?.data || previewRes;

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

      toast.success("Déclaration TVA DGI soumise avec succès");
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
    const start = new Date(currentYear, monthIndex, 1).toISOString().split("T")[0];
    const end = new Date(currentYear, monthIndex + 1, 0).toISOString().split("T")[0];
    setSelectedPeriod({ start, end, type: "monthly" });
  };

  const currentMonthIndex = new Date(selectedPeriod.start).getMonth();

  // Échéance légale au Bénin : le 15 du mois suivant
  const periodEndDate = new Date(selectedPeriod.end);
  const legalDeadline = new Date(periodEndDate.getFullYear(), periodEndDate.getMonth() + 1, 15);
  const isPastDeadline = new Date() > legalDeadline;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion TVA (DGI Bénin)"
        subtitle="Déclarations conformes au taux standard de 18% et comptes SYSCOHADA"
        actions={
          <PermissionGate module="vat_declarations" level="validate">
            <Button 
              size="sm" 
              className="bg-primary text-ink hover:opacity-90 font-medium"
              onClick={handleSubmitDeclaration}
              disabled={isSubmitting || previewLoading}
            >
              {isSubmitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
              Soumettre la déclaration DGI
            </Button>
          </PermissionGate>
        }
      />

      {/* Bannière d'information DGI */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
        <div className="flex items-center gap-2 text-ink font-medium">
          <ShieldCheck className="h-4 w-4 text-ink" />
          <span>Norme DGI Bénin : Déclaration mensuelle au plus tard le 15 du mois suivant (Taux standard 18%).</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <Calendar className="h-3.5 w-3.5 text-muted" />
          <span>Échéance période sélectionnée : <strong className="text-ink">{legalDeadline.toLocaleDateString("fr-FR")}</strong></span>
          {isPastDeadline && (
            <span className="rounded-full bg-error/10 text-error px-2 py-0.5 font-semibold text-[10px]">
              Pénalité de retard applicable (10% + 1%/mois)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-muted font-medium">TVA Nette Due (Période)</p>
          <p className="mt-2 text-3xl font-semibold font-mono tabular-nums text-ink">
            {previewLoading ? "..." : formatCFA(preview?.vat_due || 0)}
          </p>
          <div className="mt-4 flex flex-col gap-1.5">
            <label className="text-xs text-muted font-medium">Période fiscale</label>
            <div className="relative">
              <select 
                className="w-full appearance-none rounded-lg border border-border bg-background-secondary px-3 py-2 pr-9 text-sm font-medium text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
                value={currentMonthIndex}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label} {currentYear}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <p className="text-xs text-muted">TVA facturée / collectée (Compte 4431)</p>
          <p className="mt-2 text-2xl font-semibold font-mono tabular-nums text-success">
            {previewLoading ? "..." : formatCFA(preview?.vat_collected || 0)}
          </p>
          <p className="mt-1 text-xs text-muted">Sur ventes & prestations de services</p>
        </div>

        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <p className="text-xs text-muted">TVA déductible / récupérable (Compte 445)</p>
          <p className="mt-2 text-2xl font-semibold font-mono tabular-nums text-ink">
            {previewLoading ? "..." : formatCFA(preview?.vat_deductible || 0)}
          </p>
          <p className="mt-1 text-xs text-muted">Sur achats & frais généraux</p>
        </div>
      </div>

      {preview && (
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h4 className="text-sm font-semibold mb-3">Détails du calcul déclaratif SYSCOHADA</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Chiffre d'affaires HT (Classe 7) : <span className="font-semibold text-foreground">{formatCFA(preview.ca_ht || 0)}</span></p>
              <p className="text-xs text-muted-foreground">Achats & charges HT (Classe 6) : <span className="font-semibold text-foreground">{formatCFA(preview.purchases_ht || 0)}</span></p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Type de déclaration : <span className="font-semibold text-foreground capitalize">{preview.declaration_type === "monthly" ? "Mensuelle" : "Trimestrielle"}</span></p>
              <p className="text-xs text-muted-foreground">Statut calcul : <span className="text-warning font-semibold">Aperçu temps réel</span></p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Crédit de TVA reportable (4449) : <span className="font-semibold text-foreground">{formatCFA(preview.vat_credit || 0)}</span></p>
              <p className="text-xs text-muted-foreground">TVA à payer (4441) : <span className="font-semibold text-foreground">{formatCFA(preview.vat_due || 0)}</span></p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Historique des déclarations DGI</h3>
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
              const penalty = Number(d.penalty_amount || 0);
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
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                          {d.declaration_type === "monthly" ? "Mensuelle" : "Trimestrielle"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>Créée le : {formatDateLong(d.created_at)}</span>
                        {d.deadline_date && (
                          <span>Échéance : {new Date(d.deadline_date).toLocaleDateString("fr-FR")}</span>
                        )}
                        {penalty > 0 && (
                          <span className="text-destructive font-medium">Pénalité retard : {formatCFA(penalty)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tabular text-sm font-semibold">{formatCFA(d.vat_due)}</span>
                      {submitted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                          <CheckCircle2 className="h-3 w-3" /> Soumise
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
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