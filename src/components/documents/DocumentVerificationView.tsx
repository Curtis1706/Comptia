"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  ExternalLink,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SYSCOHADA_EXPENSE_ACCOUNTS,
  inferSyscohadaExpenseAccount,
} from "@/lib/syscohada-accounts";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface DocumentVerificationViewProps {
  documents: any[];
  initialIndex?: number;
  onBackToList: () => void;
  onDocumentValidated?: (docId: string) => void;
  onDocumentDeleted?: (docId: string) => void;
}

const QUICK_ACCOUNT_SUGGESTIONS = [
  { code: "628", name: "Divers services extérieurs" },
  { code: "626", name: "Frais postaux & télécoms" },
  { code: "605", name: "Autres achats de matières" },
];

export function DocumentVerificationView({
  documents,
  initialIndex = 0,
  onBackToList,
  onDocumentValidated,
  onDocumentDeleted,
}: DocumentVerificationViewProps) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(0, documents.length - 1))
  );

  const activeDoc = documents[currentIndex];

  // États du formulaire
  const [formData, setFormData] = useState({
    vendor_name: "",
    amount: "",
    date: "",
    vat_amount: "",
    invoice_number: "",
    account_code: "628",
  });

  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [validatedSuccessEntryId, setValidatedSuccessEntryId] = useState<string | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Synchronisation des données lorsque le document actif change
  useEffect(() => {
    if (!activeDoc) return;
    setValidatedSuccessEntryId(null);

    const ext = activeDoc.extracted_data || {};
    setFormData({
      vendor_name: ext.vendor_name || "",
      amount: ext.amount !== undefined ? String(ext.amount) : "",
      date: ext.date
        ? new Date(ext.date).toISOString().split("T")[0]
        : activeDoc.issue_date
        ? new Date(activeDoc.issue_date).toISOString().split("T")[0]
        : "",
      vat_amount: ext.vat_amount !== undefined ? String(ext.vat_amount) : "",
      invoice_number: ext.invoice_number || "",
      account_code: ext.account_code || "628",
    });

    if (!ext.account_code) {
      const textSample = `${ext.vendor_name || ""} ${ext._raw_text || ""} ${activeDoc.original_filename || ""}`;
      const inferred = inferSyscohadaExpenseAccount(textSample, ext.vendor_name);
      if (inferred?.code) {
        setFormData((prev) => ({ ...prev, account_code: inferred.code }));
      }
    }
  }, [activeDoc]);

  if (!activeDoc) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-muted">Aucun document à vérifier.</p>
        <Button onClick={onBackToList} variant="outline" size="sm">
          Retour à la liste
        </Button>
      </div>
    );
  }

  const isExtractionProcessing =
    activeDoc.status === "processing" || activeDoc.status === "uploaded";
  const isErrorState = activeDoc.status === "error";
  const isValidated = activeDoc.status === "processed";

  // URL du document
  const previewUrl = activeDoc.file_url?.startsWith("http")
    ? activeDoc.file_url
    : `/api/documents/${activeDoc.id}/file`;

  const isPdf =
    activeDoc.mime_type?.includes("pdf") ||
    activeDoc.original_filename?.toLowerCase().endsWith(".pdf");

  // Détection des confiances faibles (champs manquants ou douteux)
  const isVendorLowConfidence = !formData.vendor_name.trim();
  const isAmountLowConfidence = !formData.amount || Number(formData.amount) <= 0;
  const isDateLowConfidence = !formData.date;

  const canValidate =
    formData.vendor_name.trim().length > 0 &&
    Number(formData.amount) > 0 &&
    Boolean(formData.date);

  const selectedAccount = SYSCOHADA_EXPENSE_ACCOUNTS.find(
    (a) => a.code === formData.account_code
  );

  const handleValidateAndNext = async () => {
    if (!canValidate) {
      toast.error("Veuillez renseigner les champs obligatoires (Fournisseur, Montant, Date).");
      return;
    }

    setIsValidating(true);
    try {
      const res = await fetch(`/api/documents/${activeDoc.id}/transform`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          vendor_name: formData.vendor_name,
          amount: Number(formData.amount),
          date: formData.date,
          vat_amount: Number(formData.vat_amount) || 0,
          invoice_number: formData.invoice_number,
          account_code: formData.account_code,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Opération créée avec succès dans le journal des achats");
        setValidatedSuccessEntryId(result.data?.id || "entry");
        if (onDocumentValidated) onDocumentValidated(activeDoc.id);

        // Passer au document suivant si disponible
        if (currentIndex < documents.length - 1) {
          setTimeout(() => {
            setCurrentIndex((i) => i + 1);
          }, 800);
        }
      } else {
        toast.error(result.error || "Erreur lors de la validation comptable");
      }
    } catch {
      toast.error("Erreur réseau lors de la validation");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveDraft = async () => {
    toast.success("Brouillon mis à jour en local");
  };

  const handleDelete = async () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement le document "${activeDoc.original_filename}" ?`)) {
      try {
        const res = await fetch(`/api/documents/${activeDoc.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          toast.success("Document supprimé");
          if (onDocumentDeleted) onDocumentDeleted(activeDoc.id);
          if (documents.length <= 1) {
            onBackToList();
          } else {
            setCurrentIndex((i) => Math.max(0, i - 1));
          }
        }
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleRetryOCR = async () => {
    setIsRetrying(true);
    try {
      const res = await fetch(`/api/documents/${activeDoc.id}/retry`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Extraction OCR relancée");
      } else {
        toast.error(data.error || "Impossible de relancer l'OCR");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* 1. BARRE SUPÉRIEURE FIXE */}
      <header className="h-14 border-b border-border bg-background px-4 sm:px-6 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBackToList}
            className="h-8 px-2.5 text-xs font-semibold text-ink hover:bg-background-secondary gap-1.5"
          >
            <ArrowLeft className="h-4 w-4 text-ink" />
            <span className="hidden sm:inline">Retour à la liste</span>
          </Button>

          <span className="h-4 w-px bg-border hidden sm:block" />

          <h2 className="text-xs sm:text-sm font-bold text-ink truncate max-w-[180px] sm:max-w-xs">
            {activeDoc.original_filename || "Document"}
          </h2>

          {/* Pastille de statut */}
          {isValidated ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink bg-success/20 px-2 py-0.5 rounded border border-success/30">
              <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
              Validé
            </span>
          ) : isErrorState ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-error bg-error/15 px-2 py-0.5 rounded border border-error/25">
              <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
              Erreur
            </span>
          ) : isExtractionProcessing ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted bg-background-secondary px-2 py-0.5 rounded border border-border">
              <Loader2 className="w-3 h-3 animate-spin text-ink shrink-0" />
              En extraction
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink bg-warning/20 px-2 py-0.5 rounded border border-warning/30">
              <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
              À vérifier
            </span>
          )}
        </div>

        {/* Contrôles Précédent / Suivant avec compteur */}
        <div className="flex items-center gap-2">
          {/* Toggle aperçu mobile */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="lg:hidden h-8 px-2 text-xs font-medium border-border"
          >
            {showMobilePreview ? (
              <>
                <EyeOff className="h-3.5 w-3.5 mr-1" />
                <span>Formulaire</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 mr-1" />
                <span>Aperçu</span>
              </>
            )}
          </Button>

          <span className="text-xs text-muted font-mono tabular-nums">
            <strong className="text-ink font-semibold">{currentIndex + 1}</strong> sur{" "}
            <strong className="text-ink font-semibold">{documents.length}</strong>
          </span>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={currentIndex <= 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="h-8 w-8 text-ink border-border hover:bg-background-secondary disabled:opacity-40"
              title="Document précédent"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Document précédent</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={currentIndex >= documents.length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="h-8 w-8 text-ink border-border hover:bg-background-secondary disabled:opacity-40"
              title="Document suivant"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Document suivant</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 2. ZONE PRINCIPALE EN 2 COLONNES (60% Aperçu / 40% Formulaire) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Colonne gauche (60%) : Aperçu du document */}
        <div
          className={cn(
            "flex-col bg-background-secondary/40 border-r border-border overflow-hidden",
            "lg:w-[60%] lg:flex",
            showMobilePreview ? "w-full flex" : "hidden lg:flex"
          )}
        >
          {/* Barre d'outils d'aperçu */}
          <div className="h-10 px-4 border-b border-border bg-background flex items-center justify-between text-xs text-muted select-none">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                className="h-7 w-7 text-muted hover:text-ink"
                title="Zoom arrière"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>

              <span className="text-[11px] font-mono tabular-nums px-1 min-w-[3rem] text-center">
                {zoomLevel}%
              </span>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                className="h-7 w-7 text-muted hover:text-ink"
                title="Zoom avant"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(100)}
                className="h-7 px-2 text-[11px] text-muted hover:text-ink"
                title="Ajuster la taille"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                <span>100%</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink px-2 py-1 rounded hover:bg-background-secondary transition-colors"
                title="Ouvrir dans un nouvel onglet"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Plein écran</span>
              </a>

              <a
                href={previewUrl}
                download={activeDoc.original_filename}
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink px-2 py-1 rounded hover:bg-background-secondary transition-colors"
                title="Télécharger le fichier original"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Télécharger</span>
              </a>
            </div>
          </div>

          {/* Visualiseur de document */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-background-secondary/60">
            {previewUrl ? (
              isPdf ? (
                <iframe
                  src={`${previewUrl}#toolbar=0&navpanes=0`}
                  title={activeDoc.original_filename}
                  className="w-full h-full rounded-lg border border-border shadow-xs bg-white"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                />
              ) : (
                <img
                  src={previewUrl}
                  alt={activeDoc.original_filename}
                  className="max-w-full max-h-full rounded-lg border border-border shadow-xs object-contain transition-transform"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />
              )
            ) : (
              <div className="text-center p-8 text-muted">
                <FileText className="h-12 w-12 mx-auto mb-2 text-muted" />
                <p className="text-xs">Aperçu non disponible pour ce document.</p>
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite (40%) : Formulaire des données extraites OCR */}
        <div
          className={cn(
            "flex-col bg-background overflow-hidden",
            "lg:w-[40%] lg:flex",
            showMobilePreview ? "hidden lg:flex" : "w-full flex"
          )}
        >
          {/* En-tête du formulaire */}
          <div className="p-5 border-b border-border bg-background flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Données extraites (OCR)</span>
              </h3>
              <p className="text-xs text-muted mt-0.5 font-normal">
                Vérifiez et complétez les données pour l'enregistrement comptable.
              </p>
            </div>

            {validatedSuccessEntryId && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink bg-success/20 px-2 py-0.5 rounded border border-success/30">
                <CheckCircle2 className="h-3.5 w-3.5 text-ink" />
                <span>Opération créée</span>
              </span>
            )}
          </div>

          {/* Formulaire défilable */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* État de chargement OCR */}
            {isExtractionProcessing && (
              <div className="p-4 rounded-xl border border-warning/30 bg-warning/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <Loader2 className="h-4 w-4 animate-spin text-warning" />
                  <span>Extraction OCR en cours...</span>
                </div>
                <p className="text-xs text-muted">
                  Les données comptables sont en cours d'analyse automatique. Les champs se rempliront dès complétion.
                </p>
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
              </div>
            )}

            {/* État d'erreur OCR */}
            {isErrorState && (
              <div className="p-4 rounded-xl border border-error/30 bg-error/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-error">
                  <AlertTriangle className="h-4 w-4 text-error" />
                  <span>Nous n'avons pas pu lire ce document automatiquement</span>
                </div>
                <p className="text-xs text-muted">
                  Le document est peut-être flou ou protégé. Vous pouvez relancer l'OCR ou saisir les données manuellement.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetryOCR}
                    disabled={isRetrying}
                    className="h-8 text-xs font-semibold text-ink border-border hover:bg-background-secondary"
                  >
                    {isRetrying ? (
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    <span>Réessayer l'OCR</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Champ 1 : Fournisseur / Bénéficiaire */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="vendor_name" className="text-xs font-semibold text-ink">
                  Fournisseur / Bénéficiaire <span className="text-error">*</span>
                </Label>
                {formData.vendor_name ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ink bg-primary/20 px-1.5 py-0.2 rounded">
                    <Sparkles className="w-2.5 h-2.5" />
                    Auto
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-warning">À vérifier</span>
                )}
              </div>
              <Input
                id="vendor_name"
                value={formData.vendor_name}
                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                placeholder="Ex : MTN Bénin, Bénin Digital SARL..."
                className={cn(
                  "h-9 text-xs bg-background text-ink",
                  isVendorLowConfidence && "border-warning/60 focus:border-warning"
                )}
              />
            </div>

            {/* Champ 2 : Montant TTC & TVA Déductible */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount" className="text-xs font-semibold text-ink">
                    Montant TTC (F CFA) <span className="text-error">*</span>
                  </Label>
                  {formData.amount && Number(formData.amount) > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ink bg-primary/20 px-1.5 py-0.2 rounded">
                      <Sparkles className="w-2.5 h-2.5" />
                      Auto
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-warning">À vérifier</span>
                  )}
                </div>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  className={cn(
                    "h-9 text-xs font-mono tabular-nums text-ink",
                    isAmountLowConfidence && "border-warning/60 focus:border-warning"
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vat_amount" className="text-xs font-semibold text-ink">
                    TVA déductible (F CFA)
                  </Label>
                </div>
                <Input
                  id="vat_amount"
                  type="number"
                  value={formData.vat_amount}
                  onChange={(e) => setFormData({ ...formData, vat_amount: e.target.value })}
                  placeholder="0"
                  className="h-9 text-xs font-mono tabular-nums text-ink"
                />
              </div>
            </div>

            {/* Champ 3 : Date facture & N° facture / Référence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="date" className="text-xs font-semibold text-ink">
                    Date facture <span className="text-error">*</span>
                  </Label>
                  {formData.date ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ink bg-primary/20 px-1.5 py-0.2 rounded">
                      <Sparkles className="w-2.5 h-2.5" />
                      Auto
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-warning">À vérifier</span>
                  )}
                </div>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={cn(
                    "h-9 text-xs font-mono tabular-nums text-ink",
                    isDateLowConfidence && "border-warning/60 focus:border-warning"
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="invoice_number" className="text-xs font-semibold text-ink">
                  N° de facture / Réf.
                </Label>
                <Input
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                  placeholder="Ex : FAC-2026-0042"
                  className="h-9 text-xs font-mono text-ink"
                />
              </div>
            </div>

            {/* Champ 4 : Compte de charge SYSCOHADA */}
            <div className="space-y-2 pt-1 border-t border-border">
              <div className="flex items-center justify-between">
                <Label htmlFor="account_code" className="text-xs font-semibold text-ink">
                  Compte de charge (SYSCOHADA) <span className="text-error">*</span>
                </Label>
                <span className="text-[11px] text-muted font-mono">Classe 6</span>
              </div>

              <select
                id="account_code"
                value={formData.account_code}
                onChange={(e) => setFormData({ ...formData, account_code: e.target.value })}
                className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-ink focus:border-ink focus:ring-0"
              >
                {SYSCOHADA_EXPENSE_ACCOUNTS.map((acc) => (
                  <option key={acc.code} value={acc.code}>
                    {acc.code} - {acc.name}
                  </option>
                ))}
              </select>

              {/* Description explicative sous le compte */}
              {selectedAccount?.description && (
                <p className="text-[11px] text-muted italic">
                  {selectedAccount.description}
                </p>
              )}

              {/* 3 suggestions rapides sous forme de pastilles cliquables */}
              <div className="pt-1.5">
                <p className="text-[11px] font-medium text-muted mb-1.5">Suggestions rapides :</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACCOUNT_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug.code}
                      type="button"
                      onClick={() => setFormData({ ...formData, account_code: sug.code })}
                      className={cn(
                        "px-2 py-1 rounded text-[11px] font-medium transition-colors border text-left",
                        formData.account_code === sug.code
                          ? "bg-primary text-ink border-primary font-bold shadow-2xs"
                          : "bg-background-secondary/60 text-muted border-border hover:text-ink hover:bg-background-secondary"
                      )}
                    >
                      <strong className="font-mono">{sug.code}</strong> {sug.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. PIED DU FORMULAIRE FIXÉ */}
          <div className="p-4 border-t border-border bg-background flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-error hover:underline flex items-center gap-1 order-3 sm:order-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Supprimer</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                className="text-xs font-semibold border-border hover:bg-background-secondary text-ink h-9 px-3.5"
              >
                Enregistrer le brouillon
              </Button>

              <Button
                type="button"
                onClick={handleValidateAndNext}
                disabled={!canValidate || isValidating}
                className={cn(
                  "text-xs font-bold transition-all shadow-xs h-9 px-4",
                  canValidate
                    ? "bg-primary text-ink hover:brightness-95 active:scale-[0.99]"
                    : "bg-background-secondary text-muted border border-border cursor-not-allowed opacity-60"
                )}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    <span>Validation...</span>
                  </>
                ) : (
                  <span>Valider et passer au suivant</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentVerificationView;
