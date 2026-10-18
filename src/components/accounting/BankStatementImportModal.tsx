"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseRawBankStatementCSV, RawBankOperation } from "@/lib/csv-parser";
import { parseBankTextToOperations } from "@/lib/bank-ocr-parser";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  Camera,
  ClipboardPaste,
  Plus,
  Trash2,
  FileCheck,
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSource?: "bank" | "mobile_money" | "cash";
  onSuccess: () => void;
}

type ImportMode = "file" | "paste" | "manual";

export function BankStatementImportModal({ open, onOpenChange, defaultSource = "bank", onSuccess }: Props) {
  const [source, setSource] = useState<"bank" | "mobile_money" | "cash">(defaultSource);
  const [importMode, setImportMode] = useState<ImportMode>("file");
  const [statementName, setStatementName] = useState("");
  const [operations, setOperations] = useState<RawBankOperation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzingOCR, setIsAnalyzingOCR] = useState(false);
  const [fileName, setFileName] = useState("");

  // Saisie manuelle directe
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [manualDesc, setManualDesc] = useState("");
  const [manualRef, setManualRef] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualType, setManualType] = useState<"credit" | "debit">("credit");

  // Zone copier-coller
  const [pastedText, setPastedText] = useState("");

  // Gestion du fichier (CSV, Image ou PDF)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!statementName) {
      setStatementName(file.name.replace(/\.[^/.]+$/, ""));
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isImageOrPdf = ["pdf", "jpg", "jpeg", "png", "webp"].includes(ext) || file.type.startsWith("image/");

    // 1. Si c'est une image ou un PDF -> Traitement OCR serveur
    if (isImageOrPdf) {
      setIsAnalyzingOCR(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/accounting/reconcile/bank/ocr", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const json = await res.json();
        if (json.success && json.data?.operations?.length > 0) {
          setOperations(json.data.operations);
          toast.success(`${json.data.operations.length} opération(s) extraite(s) par reconnaissance optique (OCR) !`);
        } else if (json.data?.raw_text) {
          toast.warning("L'image a été lue, mais vérifiez les montants extraits.");
          // Tentative d'analyse de secours
          const fallbackOps = parseBankTextToOperations(json.data.raw_text);
          if (fallbackOps.length > 0) {
            setOperations(fallbackOps);
          } else {
            toast.error("Aucune opération financière clairement détectée. Vous pouvez utiliser la saisie manuelle ou le copier-coller.");
          }
        } else {
          toast.error(json.error || "Impossible d'extraire des opérations depuis ce document.");
        }
      } catch {
        toast.error("Erreur lors de l'analyse OCR de l'image.");
      } finally {
        setIsAnalyzingOCR(false);
      }
      return;
    }

    // 2. Si c'est un fichier texte / CSV
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
      toast.success(`${parsed.length} opération(s) détectée(s) avec succès.`);
    };
    reader.readAsText(file);
  };

  // Traitement du copier-coller
  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      toast.error("Veuillez d'abord coller du texte ou des lignes de tableau.");
      return;
    }

    // 1. Tenter l'analyseur CSV / séparateurs tabulaires
    let parsed = parseRawBankStatementCSV(pastedText);

    // 2. Si pas concluant, tenter l'analyseur textuel intelligent (MoMo SMS, avis d'opéré)
    if (parsed.length === 0) {
      parsed = parseBankTextToOperations(pastedText);
    }

    if (parsed.length === 0) {
      toast.error("Impossible de reconnaître des opérations dans le texte collé. Vérifiez les dates et les montants.");
      return;
    }

    setOperations((prev) => [...prev, ...parsed]);
    setPastedText("");
    toast.success(`${parsed.length} opération(s) ajoutée(s) depuis le presse-papiers !`);
  };

  // Ajout manuel d'une ligne
  const handleAddManualRow = () => {
    const amountNum = parseFloat(manualAmount.replace(/[^0-9.-]/g, ""));
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Veuillez saisir un montant valide (supérieur à 0).");
      return;
    }

    if (!manualDesc.trim()) {
      toast.error("Veuillez renseigner un libellé pour l'opération.");
      return;
    }

    const finalAmount = manualType === "credit" ? amountNum : -amountNum;

    const newOp: RawBankOperation = {
      date: manualDate,
      description: manualDesc.trim(),
      reference: manualRef.trim() || undefined,
      amount: finalAmount,
    };

    setOperations((prev) => [newOp, ...prev]);
    setManualDesc("");
    setManualRef("");
    setManualAmount("");
    toast.success("Ligne ajoutée au relevé.");
  };

  const handleRemoveRow = (index: number) => {
    setOperations((prev) => prev.filter((_, idx) => idx !== index));
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
    setPastedText("");
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
        toast.success(json.message || "Relevé de trésorerie importé avec succès !");
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
            Importer un relevé de trésorerie
          </DialogTitle>
          <DialogDescription className="text-text-muted text-sm font-sans">
            Importez vos flux par fichier (CSV, Excel, PDF), photo/scan de relevé ou bordereau (OCR), copier-coller de tableau ou saisie manuelle.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Sélection du compte et intitulé */}
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

          {/* Onglets de mode d'importation */}
          <div className="flex items-center gap-1 border-b border-border pb-1">
            <button
              type="button"
              onClick={() => setImportMode("file")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t border-b-2 transition-colors",
                importMode === "file"
                  ? "border-primary text-ink bg-background-secondary/50 font-bold"
                  : "border-transparent text-text-muted hover:text-ink"
              )}
            >
              <UploadCloud className="h-3.5 w-3.5 text-primary" />
              Fichier ou Photo (CSV / PDF / Image)
            </button>
            <button
              type="button"
              onClick={() => setImportMode("paste")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t border-b-2 transition-colors",
                importMode === "paste"
                  ? "border-primary text-ink bg-background-secondary/50 font-bold"
                  : "border-transparent text-text-muted hover:text-ink"
              )}
            >
              <ClipboardPaste className="h-3.5 w-3.5 text-warning" />
              Copier-Coller Excel / SMS
            </button>
            <button
              type="button"
              onClick={() => setImportMode("manual")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t border-b-2 transition-colors",
                importMode === "manual"
                  ? "border-primary text-ink bg-background-secondary/50 font-bold"
                  : "border-transparent text-text-muted hover:text-ink"
              )}
            >
              <Plus className="h-3.5 w-3.5 text-success" />
              Saisie manuelle directe
            </button>
          </div>

          {/* CONTENU DU MODE 1 : FICHIER & PHOTO */}
          {importMode === "file" && (
            <div className="rounded border-2 border-dashed border-border p-6 text-center bg-background-secondary/40">
              {isAnalyzingOCR ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm font-semibold text-ink">Analyse optique (OCR) en cours...</p>
                  <p className="text-xs text-text-muted">Extraction des opérations bancaires depuis votre document ou photo.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <UploadCloud className="h-8 w-8 text-primary" />
                    <Camera className="h-7 w-7 text-text-muted" />
                  </div>
                  <p className="text-sm font-medium text-ink">
                    Glissez votre fichier de relevé ou photo ici
                  </p>
                  <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                    Formats acceptés : <strong>CSV, TXT, PDF, JPG, PNG, WEBP</strong> (photo de bordereau bancaire, avis d&apos;opéré, capture MoMo).
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-primary/90 transition">
                      <FileText className="h-4 w-4" />
                      Choisir un fichier ou une photo
                      <input
                        type="file"
                        accept=".csv,.txt,.tsv,.pdf,image/png,image/jpeg,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLoadSample}
                      className="rounded border-border text-ink hover:bg-background-secondary text-xs"
                    >
                      <Sparkles className="mr-1.5 h-3.5 w-3.5 text-warning" />
                      Charger un exemple
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* CONTENU DU MODE 2 : COPIER-COLLER */}
          {importMode === "paste" && (
            <div className="space-y-3 bg-background-secondary/30 p-4 rounded border border-border">
              <div>
                <Label className="text-xs font-semibold text-text-muted">Collez votre texte ici (lignes Excel ou SMS MoMo)</Label>
                <Textarea
                  rows={4}
                  placeholder={`Exemple Excel :\n18/10/2026\tVirement client SOBEBRA\tVIR-001\t350000\n18/10/2026\tFrais de compte\t-12500`}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="mt-1 font-mono text-xs rounded border-border bg-background"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleParsePastedText}
                  className="rounded bg-primary text-ink hover:bg-primary/90 font-semibold text-xs"
                >
                  <ClipboardPaste className="mr-1.5 h-3.5 w-3.5" />
                  Convertir en opérations
                </Button>
              </div>
            </div>
          )}

          {/* CONTENU DU MODE 3 : SAISIE MANUELLE */}
          {importMode === "manual" && (
            <div className="space-y-3 bg-background-secondary/40 p-4 rounded border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div>
                  <Label className="text-[10px] font-bold uppercase text-text-muted">Date</Label>
                  <Input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="mt-1 h-8 text-xs rounded border-border"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-[10px] font-bold uppercase text-text-muted">Libellé de l&apos;opération</Label>
                  <Input
                    placeholder="Ex: Virement reçu client X"
                    value={manualDesc}
                    onChange={(e) => setManualDesc(e.target.value)}
                    className="mt-1 h-8 text-xs rounded border-border"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase text-text-muted">Sens</Label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as any)}
                    className="mt-1 w-full h-8 rounded border border-border bg-background px-2 text-xs text-ink outline-none"
                  >
                    <option value="credit">Recette (+)</option>
                    <option value="debit">Dépense (−)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase text-text-muted">Montant (F CFA)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    className="mt-1 h-8 text-xs font-mono tabular-nums rounded border-border"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="w-48">
                  <Input
                    placeholder="Référence (optionnel)"
                    value={manualRef}
                    onChange={(e) => setManualRef(e.target.value)}
                    className="h-8 text-xs rounded border-border"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddManualRow}
                  className="rounded bg-primary text-ink hover:bg-primary/90 font-semibold text-xs"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Ajouter cette opération
                </Button>
              </div>
            </div>
          )}

          {/* TABLEAU DES OPÉRATIONS EXTRAITES / PRÉVISUALISATION */}
          {operations.length > 0 && (
            <div className="space-y-3 pt-2">
              {/* Synthèse des données */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-background-secondary p-2.5 rounded border border-border">
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Opérations</span>
                  <p className="text-base font-bold font-mono tabular-nums text-ink">{operations.length}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-success flex items-center gap-1">
                    <ArrowDownLeft className="h-3 w-3" /> Recettes (+)
                  </span>
                  <p className="text-xs font-semibold font-mono tabular-nums text-success">{formatCFA(totalCredit)}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-error flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> Dépenses (−)
                  </span>
                  <p className="text-xs font-semibold font-mono tabular-nums text-error">{formatCFA(totalDebit)}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Solde net</span>
                  <p className={cn("text-xs font-bold font-mono tabular-nums", netBalance >= 0 ? "text-success" : "text-error")}>
                    {formatCFA(netBalance)}
                  </p>
                </div>
              </div>

              {/* Table avec suppression de ligne */}
              <div className="border border-border rounded max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background-secondary border-b border-border text-[9px] uppercase font-bold text-text-muted sticky top-0">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Libellé</th>
                      <th className="p-2">Réf</th>
                      <th className="p-2 text-right">Montant</th>
                      <th className="p-2 text-center w-8"></th>
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
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(idx)}
                            className="text-text-muted hover:text-error transition"
                            title="Supprimer cette ligne"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs text-text-muted">
                <span>{fileName ? <>Fichier : <strong className="text-ink">{fileName}</strong></> : "Saisie en cours"}</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-error hover:underline text-xs"
                >
                  Tout effacer
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
            disabled={isSubmitting || isAnalyzingOCR}
            className="rounded border-border text-xs"
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={operations.length === 0 || isSubmitting || isAnalyzingOCR}
            className="rounded bg-primary text-ink hover:bg-primary/90 font-semibold text-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Importation en cours...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Valider et importer ({operations.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
