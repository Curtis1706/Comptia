import { useState } from "react";
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { OperationStatusBadge } from "@/components/dashboard/StatusBadge";
import { operations } from "@/data/mock";
import { formatEUR, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Comptabilite = () => {
  const [query, setQuery] = useState("");
  const filtered = operations.filter((o) =>
    [o.libelle, o.compte, o.piece].some((s) => s.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal des opérations"
        subtitle="Toutes vos écritures comptables centralisées"
        actions={
          <>
            <Button variant="outline" size="sm"><Upload className="mr-1 h-4 w-4" /> Importer CSV</Button>
            <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" /> Exporter</Button>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90"><Plus className="mr-1 h-4 w-4" /> Nouvelle opération</Button>
          </>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher par libellé, compte, pièce…" className="pl-9" />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" /> Filtres avancés</Button>
          <Button variant="outline" size="sm"><CheckCircle2 className="mr-1 h-4 w-4" /> Valider sélection</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
              {filtered.map((op) => (
                <tr
                  key={op.id}
                  className={cn(
                    "border-b border-border last:border-0 transition hover:bg-muted/30",
                    op.status === "validee" && "bg-success-soft/20",
                    op.status === "attente" && "bg-warning-soft/20",
                    op.status === "erreur" && "bg-destructive-soft/30",
                  )}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(op.date)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{op.piece}</td>
                  <td className="px-4 py-3 font-mono text-xs">{op.compte}</td>
                  <td className="px-4 py-3 font-medium">{op.libelle}</td>
                  <td className="px-4 py-3 text-right tabular">{op.debit ? formatEUR(op.debit) : "—"}</td>
                  <td className="px-4 py-3 text-right tabular">{op.credit ? formatEUR(op.credit) : "—"}</td>
                  <td className="px-4 py-3"><OperationStatusBadge status={op.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border p-3 text-xs text-muted-foreground">
          <span>{filtered.length} opérations affichées</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>Précédent</Button>
            <Button variant="outline" size="sm">Suivant</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comptabilite;