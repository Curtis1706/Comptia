import { CheckCircle2, Clock, AlertTriangle, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { tvaDeclarations, kpis } from "@/data/mock";
import { formatEUR, formatDateLong } from "@/lib/format";
import { cn } from "@/lib/utils";

export const TVA = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion TVA"
        subtitle="Préparez et suivez vos déclarations en quelques clics"
        actions={<Button size="sm" className="bg-gradient-primary hover:opacity-90"><Plus className="mr-1 h-4 w-4" /> Nouvelle déclaration</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-gradient-primary p-6 text-primary-foreground shadow-card">
          <p className="text-xs uppercase tracking-wider opacity-80">Prochaine échéance</p>
          <p className="mt-2 font-display text-3xl font-semibold tabular">{formatEUR(kpis.tvaAPayer)}</p>
          <p className="mt-1 text-sm opacity-90">CA3 — Avril 2026 · à régler avant le 19 mai</p>
          <Button variant="secondary" size="sm" className="mt-4">Préparer la déclaration</Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <p className="text-xs text-muted-foreground">TVA collectée (mois)</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular">{formatEUR(20880)}</p>
          <p className="mt-1 text-xs text-success">Sur ventes 20%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <p className="text-xs text-muted-foreground">TVA déductible (mois)</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular">{formatEUR(12380)}</p>
          <p className="mt-1 text-xs text-info">Sur achats</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Historique des déclarations</h3>
          <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" /> Exporter</Button>
        </div>

        <ol className="relative space-y-6 border-l-2 border-border pl-6">
          {tvaDeclarations.map((d) => {
            const submitted = d.status === "submitted";
            return (
              <li key={d.period} className="relative">
                <span className={cn(
                  "absolute -left-[33px] flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-card",
                  submitted ? "bg-success" : "bg-warning",
                )}>
                  {submitted ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Clock className="h-4 w-4 text-white" />}
                </span>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 hover:shadow-card transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{d.period}</p>
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">{d.type}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Échéance : {formatDateLong(d.deadline)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tabular text-sm font-semibold">{formatEUR(d.tva)}</span>
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
      </div>
    </div>
  );
};

export default TVA;