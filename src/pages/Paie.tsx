import { useSearchParams } from "react-router-dom";
import { Plus, Send, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { employees } from "@/data/mock";
import { formatEUR } from "@/lib/format";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "bulletins", label: "Bulletins" },
  { id: "salaries", label: "Salariés" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export const Paie = () => {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab) || "bulletins";
  const setTab = (t: Tab) => {
    const p = new URLSearchParams(params);
    if (t === "bulletins") p.delete("tab"); else p.set("tab", t);
    setParams(p, { replace: true });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paie"
        subtitle="Gérez vos salariés et générez vos bulletins en un clic"
        actions={
          tab === "salaries" ? (
            <Button size="sm" className="bg-gradient-primary hover:opacity-90"><Plus className="mr-1 h-4 w-4" /> Nouveau salarié</Button>
          ) : (
            <Button size="sm" className="bg-gradient-primary hover:opacity-90"><FileText className="mr-1 h-4 w-4" /> Générer bulletins avril</Button>
          )
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center gap-1 border-b border-border px-2 pt-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "relative rounded-t-md px-4 py-2.5 text-sm font-medium transition",
              tab === t.id ? "bg-card text-primary" : "text-muted-foreground hover:text-foreground",
            )}>
              {t.label}
              {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        {tab === "bulletins" ? <BulletinsTable /> : <SalariesGrid />}
      </div>
    </div>
  );
};

const BulletinsTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <th className="px-4 py-3">Salarié</th>
          <th className="px-4 py-3">Période</th>
          <th className="px-4 py-3 text-right">Salaire brut</th>
          <th className="px-4 py-3 text-right">Salaire net</th>
          <th className="px-4 py-3">Statut</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((e, i) => {
          const status = i % 3 === 0 ? "consulte" : i % 3 === 1 ? "envoye" : "genere";
          return (
            <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                    {e.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.role}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">Avril 2026</td>
              <td className="px-4 py-3 text-right tabular">{formatEUR(e.salaireBrut)}</td>
              <td className="px-4 py-3 text-right font-semibold tabular">{formatEUR(e.salaireNet)}</td>
              <td className="px-4 py-3">
                <span className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                  status === "consulte" && "bg-success-soft text-success",
                  status === "envoye" && "bg-info-soft text-info",
                  status === "genere" && "bg-muted text-muted-foreground",
                )}>
                  {status === "consulte" ? "Consulté" : status === "envoye" ? "Envoyé" : "Généré"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Send className="h-4 w-4" /></Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const SalariesGrid = () => (
  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
    {employees.map((e) => (
      <div key={e.id} className="rounded-xl border border-border bg-gradient-subtle p-5 transition hover:shadow-elevated">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
            {e.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-semibold">{e.name}</p>
            <p className="text-xs text-muted-foreground">{e.role}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-md bg-card p-2.5">
            <p className="text-muted-foreground">Brut</p>
            <p className="mt-0.5 font-semibold tabular">{formatEUR(e.salaireBrut)}</p>
          </div>
          <div className="rounded-md bg-card p-2.5">
            <p className="text-muted-foreground">Net</p>
            <p className="mt-0.5 font-semibold tabular text-success">{formatEUR(e.salaireNet)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">{e.contract}</span>
          <Button variant="ghost" size="sm">Voir fiche →</Button>
        </div>
      </div>
    ))}
  </div>
);

export default Paie;