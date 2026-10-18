"use client";

import { useState, useRef } from "react";
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
  FileSpreadsheet,
  Image as ImageIcon,
  Edit2,
  Check,
  X,
  Smartphone,
  Eye,
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSource?: "bank" | "mobile_money" | "cash";
  onSuccess: () => void;
}

type ImportMode = "photo" | "file" | "paste" | "manual";

export function BankStatementImportModal({ open, onOpenChange, defaultSource = "bank", onSuccess }: Props) {
  const [source, setSource] = useState<"bank" | "mobile_money" | "cash">(defaultSource);
  const [importMode, setImportMode] = useState<ImportMode>("photo");
  const [statementName, setStatementName] = useState("");
  const [operations, setOperations] = useState<RawBankOperation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzingOCR, setIsAnalyzingOCR] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSizeStr, setFileSizeStr] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // États drag & drop
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Édition en ligne d'une ligne extraite
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    date: string;
    description: string;
    reference: string;
    amount: string;
    type: "credit" | "debit";
  }>({
    date: "",
    description: "",
    reference: "",
    amount: "",
    type: "credit",
  });

  // Saisie manuelle directe
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [manualDesc, setManualDesc] = useState("");
  const [manualRef, setManualRef] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualType, setManualType] = useState<"credit" | "debit">("credit");

  // Zone copier-coller
  const [pastedText, setPastedText] = useState("");

  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Traitement universel d'un fichier (Image, PDF ou CSV)
  const processUploadedFile = async (file: File) => {
    if (!file) return;

    setFileName(file.name);
    const sizeKb = file.size / 1024;
    setFileSizeStr(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} Mo` : `${sizeKb.toFixed(0)} Ko`);

    if (!statementName) {
      setStatementName(file.name.replace(/\.[^/.]+$/, ""));
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext) || file.type.startsWith("image/");
    const isPdf = ext === "pdf" || file.type === "application/pdf";

    // Si c'est une image, préparer l'aperçu miniature
    if (isImage) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl(null);
    }

    // 1. Image ou PDF -> Traitement par le moteur OCR serveur
    if (isImage || isPdf) {
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
          // Tentative d'analyse de secours avec le parseur textuel
          const fallbackOps = parseBankTextToOperations(json.data.raw_text);
          if (fallbackOps.length > 0) {
            setOperations(fallbackOps);
            toast.warning(`${fallbackOps.length} opération(s) détectée(s). Veuillez vérifier les montants.`);
          } else {
            toast.error("Texte lu mais aucune opération financière clairement structurée. Vous pouvez ajuster ou saisir manuellement.");
          }
        } else {
          toast.error(json.error || "Impossible d'extraire des opérations depuis ce document.");
        }
      } catch {
        toast.error("Erreur réseau lors de l'analyse OCR.");
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

  // Gestionnaires Drag & Drop Photo
  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Gestionnaires Drag & Drop Fichier (CSV/PDF)
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
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

  // Début d'édition en ligne d'une ligne
  const handleStartEdit = (index: number) => {
    const op = operations[index];
    setEditingIndex(index);
    setEditForm({
      date: op.date,
      description: op.description,
      reference: op.reference || "",
      amount: Math.abs(op.amount).toString(),
      type: op.amount >= 0 ? "credit" : "debit",
    });
  };

  // Sauvegarde de l'édition en ligne
  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    const amountNum = parseFloat(editForm.amount.replace(/[^0-9.-]/g, ""));
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Montant invalide.");
      return;
    }

    const finalAmount = editForm.type === "credit" ? amountNum : -amountNum;

    setOperations((prev) =>
      prev.map((op, idx) =>
        idx === editingIndex
          ? {
              date: editForm.date,
              description: editForm.description.trim() || "Opération",
              reference: editForm.reference.trim() || undefined,
              amount: finalAmount,
            }
          : op
      )
    );

    setEditingIndex(null);
    toast.success("Ligne mise à jour.");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleRemoveRow = (index: number) => {
    setOperations((prev) => prev.filter((_, idx) => idx !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
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
    setFileSizeStr("");
    setImagePreviewUrl(null);
    setStatementName("");
    setPastedText("");
    setEditingIndex(null);
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
      <DialogContent className="max-w-3xl bg-background border border-border text-ink rounded p-6 font-sans max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-sans">
            Importer un relevé de trésorerie
          </DialogTitle>
          <DialogDescription className="text-text-muted text-sm font-sans">
            Chargez vos flux par photo ou scan de bordereau/reçu (OCR), fichier (CSV, Excel, PDF), copier-coller de SMS ou saisie manuelle.
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
          <div className="flex items-center gap-1 border-b border-border pb-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setImportMode("photo")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t border-b-2 transition-colors whitespace-nowrap",
                importMode === "photo"
                  ? "border-primary text-ink bg-background-secondary/60 font-bold"
                  : "border-transparent text-text-muted hover:text-ink"
              )}
            >
              <Camera className="h-3.5 w-3.5 text-primary" />
              Photo & Scan OCR
            </button>
            <button
              type="button"
              onClick={() => setImportMode("file")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t border-b-2 transition-colors whitespace-nowrap",
                importMode === "file"
                  ? "border-primary text-ink bg-background-secondary/60 font-bold"
                  : "border-transparent text-text-muted hover:text-ink"
              )}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-text-muted" />
              Fichier CSV / PDF
            </button>
            <button
              type="button"
              onClick={() => setImportMode("paste")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t border-b-2 transition-colors whitespace-nowrap",
                importMode === "paste"
                  ? "border-primary text-ink bg-background-secondary/60 font-bold"
                  : "border-transparent text-text-muted hover:text-ink"
              )}
            >
              <ClipboardPaste className="h-3.5 w-3.5 text-warning" />
              Copier-Coller SMS / Excel
            </button>
            <button
              type="button"
              onClick={() => setImportMode("manual")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t border-b-2 transition-colors whitespace-nowrap",
                importMode === "manual"
                  ? "border-primary text-ink bg-background-secondary/60 font-bold"
                  : "border-transparent text-text-muted hover:text-ink"
              )}
            >
              <Plus className="h-3.5 w-3.5 text-success" />
              Saisie manuelle
            </button>
          </div>

          {/* ONGLET 1 : PHOTO & SCAN OCR D'IMAGE */}
          {importMode === "photo" && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingPhoto(true);
                }}
                onDragLeave={() => setIsDraggingPhoto(false)}
                onDrop={handlePhotoDrop}
                className={cn(
                  "rounded border-2 border-dashed p-5 text-center transition-colors",
                  isDraggingPhoto
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background-secondary/40"
                )}
              >
                {isAnalyzingOCR ? (
                  <div className="py-6 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm font-semibold text-ink">Reconnaissance optique (OCR) en cours...</p>
                    <p className="text-xs text-text-muted">Extraction des opérations bancaires depuis votre image ou photo.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center text-primary">
                        <Camera className="h-5 w-5" />
                      </div>
                      <div className="h-10 w-10 rounded bg-background-secondary flex items-center justify-center text-text-muted">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-ink">
                      Glissez une photo de relevé, bordereau bancaire ou reçu ici
                    </p>
                    <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                      Formats supportés : <strong>JPG, JPEG, PNG, WEBP</strong>. Idéal pour bordereaux de versement espèces, avis d&apos;opéré, chèques et captures d&apos;écran Mobile Money.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                      {/* Bouton Caméra (Mobile / Smartphone) */}
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded bg-background border border-border px-3 py-2 text-xs font-semibold text-ink shadow-sm hover:bg-background-secondary transition"
                      >
                        <Smartphone className="h-4 w-4 text-primary" />
                        Prendre une photo
                        <input
                          ref={cameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) processUploadedFile(f);
                          }}
                          className="hidden"
                        />
                      </button>

                      {/* Bouton Sélecteur d'image standard */}
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-ink shadow-sm hover:bg-primary/90 transition"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Sélectionner une photo / image
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) processUploadedFile(f);
                          }}
                          className="hidden"
                        />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Aperçu miniature de l'image sélectionnée si présente */}
              {imagePreviewUrl && (
                <div className="flex items-center gap-3 p-2.5 rounded border border-border bg-background-secondary/30">
                  <div className="h-14 w-14 rounded overflow-hidden border border-border bg-background flex-shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreviewUrl}
                      alt="Aperçu du relevé"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink truncate">{fileName}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{fileSizeStr} &bull; Image analysée par OCR</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-success font-medium mt-1">
                      <CheckCircle2 className="h-3 w-3" /> Image chargée
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImagePreviewUrl(null);
                      setFileName("");
                    }}
                    className="h-7 w-7 p-0 text-text-muted hover:text-error"
                    title="Retirer cette image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ONGLET 2 : FICHIER CSV / PDF */}
          {importMode === "file" && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleFileDrop}
              className={cn(
                "rounded border-2 border-dashed p-5 text-center transition-colors",
                isDraggingFile
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background-secondary/40"
              )}
            >
              {isAnalyzingOCR ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm font-semibold text-ink">Analyse du fichier PDF en cours...</p>
                  <p className="text-xs text-text-muted">Extraction du texte et des colonnes financières.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <UploadCloud className="h-7 w-7 text-primary" />
                    <FileText className="h-7 w-7 text-text-muted" />
                  </div>
                  <p className="text-sm font-medium text-ink">
                    Glissez votre fichier de relevé CSV ou PDF ici
                  </p>
                  <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                    Formats acceptés : <strong>CSV, TXT, TSV, PDF</strong>. Détection automatique des séparateurs et colonnes débit/crédit.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-ink shadow-sm hover:bg-primary/90 transition"
                    >
                      <FileText className="h-4 w-4" />
                      Choisir un fichier CSV ou PDF
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.txt,.tsv,.pdf"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) processUploadedFile(f);
                        }}
                        className="hidden"
                      />
                    </button>

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

          {/* ONGLET 3 : COPIER-COLLER */}
          {importMode === "paste" && (
            <div className="space-y-3 bg-background-secondary/30 p-4 rounded border border-border">
              <div>
                <Label className="text-xs font-semibold text-text-muted">Collez votre texte ici (lignes Excel ou SMS MoMo)</Label>
                <Textarea
                  rows={4}
                  placeholder={`Exemple Excel :\n18/10/2026\tVirement client SOBEBRA\tVIR-001\t350000\n18/10/2026\tFrais de compte\t-12500\n\nOu SMS MoMo :\nVous avez recu 50000 FCFA de 22997000000. ID: 8847291`}
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

          {/* ONGLET 4 : SAISIE MANUELLE */}
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
                    placeholder="Ex: Virement reçu client SOBEBRA"
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

          {/* TABLEAU DES OPÉRATIONS EXTRAITES / PRÉVISUALISATION ET ÉDITION */}
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

              {/* Table avec édition et suppression de ligne */}
              <div className="border border-border rounded max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background-secondary border-b border-border text-[9px] uppercase font-bold text-text-muted sticky top-0">
                    <tr>
                      <th className="p-2 w-24">Date</th>
                      <th className="p-2">Libellé</th>
                      <th className="p-2 w-28">Réf</th>
                      <th className="p-2 text-right w-28">Montant</th>
                      <th className="p-2 text-center w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {operations.map((op, idx) => {
                      const isEditing = editingIndex === idx;

                      if (isEditing) {
                        return (
                          <tr key={idx} className="bg-primary/5">
                            <td className="p-1">
                              <Input
                                type="date"
                                value={editForm.date}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                                className="h-7 text-xs rounded border-border"
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                value={editForm.description}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                                className="h-7 text-xs rounded border-border"
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                placeholder="Réf"
                                value={editForm.reference}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, reference: e.target.value }))}
                                className="h-7 text-xs rounded border-border"
                              />
                            </td>
                            <td className="p-1">
                              <div className="flex items-center gap-1">
                                <select
                                  value={editForm.type}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value as any }))}
                                  className="h-7 rounded border border-border bg-background text-[10px] text-ink outline-none px-1"
                                >
                                  <option value="credit">+</option>
                                  <option value="debit">−</option>
                                </select>
                                <Input
                                  type="number"
                                  value={editForm.amount}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, amount: e.target.value }))}
                                  className="h-7 text-xs font-mono tabular-nums rounded border-border"
                                />
                              </div>
                            </td>
                            <td className="p-1 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={handleSaveEdit}
                                  className="p-1 text-success hover:bg-success/20 rounded"
                                  title="Enregistrer la modification"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="p-1 text-text-muted hover:bg-background-secondary rounded"
                                  title="Annuler"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={idx} className="hover:bg-background-secondary/60">
                          <td className="p-2 font-mono text-text-muted whitespace-nowrap">{formatDate(op.date)}</td>
                          <td className="p-2 font-medium text-ink truncate max-w-xs">{op.description}</td>
                          <td className="p-2 font-mono text-text-muted truncate max-w-[120px]">{op.reference || "—"}</td>
                          <td className={cn("p-2 text-right font-mono tabular-nums font-semibold whitespace-nowrap", op.amount > 0 ? "text-success" : "text-error")}>
                            {op.amount > 0 ? `+${formatCFA(op.amount)}` : `-${formatCFA(Math.abs(op.amount))}`}
                          </td>
                          <td className="p-2 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(idx)}
                                className="text-text-muted hover:text-primary transition"
                                title="Modifier cette ligne"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(idx)}
                                className="text-text-muted hover:text-error transition"
                                title="Supprimer cette ligne"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs text-text-muted">
                <span>{fileName ? <>Source : <strong className="text-ink">{fileName}</strong></> : "Saisie en cours"}</span>
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
