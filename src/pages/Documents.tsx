import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, Clock, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { documents } from "@/data/mock";
import { formatEUR, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Documents = () => {
  const [drag, setDrag] = useState(false);
  const [selected, setSelected] = useState<typeof documents[number] | null>(documents[0]);

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" subtitle="Importez vos justificatifs, l'OCR fait le reste" />

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); }}
        className={cn(
          "rounded-xl border-2 border-dashed bg-gradient-subtle p-10 text-center transition",
          drag ? "border-primary bg-primary-soft" : "border-border",
        )}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
          <UploadCloud className="h-7 w-7" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold">Déposez vos fichiers ici</p>
        <p className="text-sm text-muted-foreground">PDF, JPG, PNG, HEIC · Max 20 MB</p>
        <Button className="mt-4 bg-gradient-primary hover:opacity-90">Parcourir les fichiers</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card lg:col-span-1">
          <h3 className="mb-3 font-display text-sm font-semibold">Documents récents</h3>
          <ul className="space-y-1">
            {documents.map((d) => (
              <li key={d.id}>
                <button
                  onClick={() => setSelected(d)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-muted/50",
                    selected?.id === d.id && "bg-primary-soft",
                  )}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(d.date)} · {formatEUR(d.amount)}</p>
                  </div>
                  {d.status === "ocr_ok" ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:col-span-2 lg:grid-cols-2">
          <div className="flex h-72 items-center justify-center rounded-xl border border-border bg-gradient-subtle p-4 shadow-card">
            <div className="text-center text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 opacity-40" />
              <p className="mt-2 text-sm">Aperçu : {selected?.name}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <ScanLine className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-semibold">Données extraites (OCR)</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Fournisseur</Label>
                <Input defaultValue="EDF Entreprises" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Montant TTC</Label>
                  <Input defaultValue={selected?.amount.toString()} />
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input defaultValue={selected?.date} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">TVA (20%)</Label>
                  <Input defaultValue="40,83" />
                </div>
                <div>
                  <Label className="text-xs">N° facture</Label>
                  <Input defaultValue="2026-04-12-EDF" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Catégorie comptable</Label>
                <Input defaultValue="606100 - Énergie" />
              </div>
              <Button className="w-full bg-gradient-primary hover:opacity-90">Valider et créer l'opération</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;