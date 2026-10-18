"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseRawBankStatementCSV, RawBankOperation } from "@/lib/csv-parser";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSource?: "bank" | "mobile_money" | "cash";
  onSuccess: () => void;
}

export function BankStatementImportModal({ open, onOpenChange, defaultSource = "bank", onSuccess }: Props) {
  const [source, setSource] = useState<"bank" | "mobile_money" | "cash">(defaultSource);
  const [statementName, setStatementName] = useState("");
  const [operations, setOperations] = useState<RawBankOperation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!statementName) {
      setStatementName(file.name.replace(/\.[^/.]+$/, ""));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        toast.error("Le fichier sélectionné est vide.");
        return;
      }

      const parsed = parseRawBankStatementCSV(text);
      if (parsed.length === 0) {
        toast.error("Impossible de détecter des opérations bancaires valides dans ce fichier.");
        return;
      }

      setOperations(parsed);
      toast.success(`${parsed.length} opérations détectées avec succès.`);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    const today = new Date().toISOString().split("T")[0];
    const sampleOps: RawBankOperation[] = [
      {
        date: today,
        description: "Virement reçu - Client SOBEBRA SARL",
        reference: "VIR-2026-0891",
        amount: 350000,
      },
      {
        date: today,
        description: "Frais de tenue de compte mensuels",
        reference: "AGIO-1026",
        amount: -12500,
      },
      {
        date: today,
        description: "Paiement fournisseur Bénin Télécoms",
        reference: "CHQ-882104",
        amount: -85000,
      },
      {
        date: today,
        description: "Règlement facture prestation comptable",
        reference: "VIR-2026-0902",
        amount: 250000,
      },
      {
        date: today,
        description: "Prélèvement commission bancaire virement",
        reference: "COM-0199",
        amount: -2500,
      },
    ];

    setStatementName(`Relevé modèle - ${source === "bank" ? "Banque BOA (521)" : source === "mobile_money" ? "MoMo MTN (585)" : "Caisse (571)"}`);
    setFileName("exemple_releve_ceilow.csv");
    setOperations(sampleOps);
    toast.info("Exemple de relevé bancaire chargé.");
  };

  const handleReset = () => {
    setOperations([]);
    setFileName("");
    setStatementName("");
  };

  const totalCredit = operations.filter((op) => op.amount > 0).reduce((sum, op) => sum + op.amount, 0);
  const totalDebit = operations.filter((op) => op.amount < 0).reduce((sum, op) => sum + Math.abs(op.amount), 0);
  const netBalance = totalCredit - totalDebit;

  const handleSubmit = async () => {
    if (operations.length === 0) {
      toast.error("Veuillez charger au moins une opération avant de valider.");
      return;
    }

    setIsSubmitting(true);
    try {
      const accountIban = source === "bank" ? "521" : source === "mobile_money" ? "585" : "571";
      const res = await fetch("/api/accounting/reconcile/bank/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          filename: statementName || fileName || "Relevé importé",
          account_iban: accountIban,
          transactions: operations,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(json.message || "Relevé bancaire importé avec succès !");
        handleReset();
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(json.error || "Erreur lors de l'importation");
      }
    } catch {
      toast.error("Erreur réseau lors de l'importation du relevé");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-background border border-border text-ink rounded p-6 font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-sans">
            Importer un relevé d&apos;opérations
          </DialogTitle>
          <DialogDescription className="text-text-muted text-sm font-sans">
            Importez votre fichier de relevé bancaire ou Mobile Money (format CSV / TXT) pour rapprocher vos flux avec les écritures comptables SYSCOHADA.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 my-2">
          {/* Sélection de la source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-text-muted uppercase">Compte de trésorerie cible</Label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="mt-1 w-full rounded border border-border bg-background p-2 text-sm text-ink outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="bank">Compte bancaire (521 - Banque)</option>
                <option value="mobile_money">Mobile Money MTN / Moov / Celtiis (585)</option>
                <option value="cash">Caisse centrale (571 - Caisse siège)</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-text-muted uppercase">Intitulé du relevé</Label>
              <Input
                placeholder="Ex : Relevé BOA Bénin - Octobre 2026"
                value={statementName}
                onChange={(e) => setStatementName(e.target.value)}
                className="mt-1 rounded border-border"
              />
            </div>
          </div>

          {/* Zone d'import / drop */}
          {operations.length === 0 ? (
            <div className="rounded border-2 border-dashed border-border p-6 text-center bg-background-secondary/50">
              <UploadCloud className="mx-auto h-10 w-10 text-text-muted" />
              <p className="mt-2 text-sm font-medium text-ink">
                Déposez votre fichier de relevé CSV ici ou sélectionnez-le
              </p>
              <p className="text-xs text-text-muted mt-1">
                Colonnes reconnues : Date, Libellé, Référence, Débit / Dépense, Crédit / Recette (séparateurs virgule ou point-virgule)
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-primary/90 transition">
                  <FileText className="h-4 w-4" />
                  Choisir un fichier CSV
                  <input
                    type="file"
                    accept=".csv,.txt,.tsv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLoadSample}
                  className="rounded border-border text-ink hover:bg-background-secondary"
                >
                  <Sparkles className="mr-2 h-4 w-4 text-warning" />
                  Charger un exemple de relevé
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Synthèse des données détectées */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-background-secondary p-3 rounded border border-border">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-muted">Opérations</span>
                  <p className="text-lg font-bold font-mono tabular-nums text-ink">{operations.length}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-success flex items-center gap-1">
                    <ArrowDownLeft className="h-3 w-3" /> Recettes (+)
                  </span>
                  <p className="text-sm font-semibold font-mono tabular-nums text-success">{formatCFA(totalCredit)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-error flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> Dépenses (-)
                  </span>
                  <p className="text-sm font-semibold font-mono tabular-nums text-error">{formatCFA(totalDebit)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-muted">Solde net</span>
                  <p className={cn("text-sm font-bold font-mono tabular-nums", netBalance >= 0 ? "text-success" : "text-error")}>
                    {formatCFA(netBalance)}
                  </p>
                </div>
              </div>

              {/* Tableau de prévisualisation */}
              <div className="border border-border rounded max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background-secondary border-b border-border text-[10px] uppercase font-bold text-text-muted sticky top-0">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Libellé</th>
                      <th className="p-2">Réf</th>
                      <th className="p-2 text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {operations.map((op, idx) => (
                      <tr key={idx} className="hover:bg-background-secondary/60">
                        <td className="p-2 font-mono text-text-muted whitespace-nowrap">{formatDate(op.date)}</td>
                        <td className="p-2 font-medium text-ink truncate max-w-xs">{op.description}</td>
                        <td className="p-2 font-mono text-text-muted">{op.reference || "—"}</td>
                        <td className={cn("p-2 text-right font-mono tabular-nums font-semibold whitespace-nowrap", op.amount > 0 ? "text-success" : "text-error")}>
                          {op.amount > 0 ? `+${formatCFA(op.amount)}` : `-${formatCFA(Math.abs(op.amount))}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs text-text-muted">
                <span>Fichier : <strong className="text-ink">{fileName}</strong></span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-error hover:underline"
                >
                  Remplacer le fichier
                </button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded border-border"
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={operations.length === 0 || isSubmitting}
            className="rounded bg-primary text-ink hover:bg-primary/90 font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importation en cours...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Valider et importer ({operations.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
