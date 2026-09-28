"use client";

import { useState } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  ScanLine,
  Loader2,
  AlertCircle,
  RotateCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Documents = () => {
  const [drag, setDrag] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [ocrFields, setOcrFields] = useState<any>({
    amount: "",
    date: "",
    vendor_name: "",
    vendor_siret: "",
    invoice_number: "",
    vat_amount: "",
  });

  const queryClient = useQueryClient();

  const { data: docsRes, isLoading } = useQuery<any>({
    queryKey: ["documents"],
    queryFn: () => fetcher("/api/documents/list"),
    refetchInterval: (query: any) => {
      // Auto-refetch while any document is still processing
      const docs = query?.state?.data || [];
      const list = Array.isArray(docs) ? docs : docs?.data || [];
      return list.some((d: any) => d.status === "processing" || d.status === "uploaded") ? 3000 : false;
    },
  });

  const documents: any[] = Array.isArray(docsRes) ? docsRes : docsRes?.data || [];

  const setDocuments = (updater: (prev: any[]) => any[]) => {
    queryClient.setQueryData(["documents"], (old: any) => {
      const prev = Array.isArray(old) ? old : old?.data || [];
      return updater(prev);
    });
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "invoice");

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      let result: any = null;
      try {
        result = await res.json();
      } catch {
        result = { success: false, error: `Erreur serveur (${res.status})` };
      }
      if (result.success && result.data) {
        setDocuments((prev) => [result.data, ...prev]);
        toast.success("Document envoyé vers le stockage Cloudflare, analyse OCR en cours...");
        pollDocumentStatus(result.data.id);
      } else {
        toast.error(result.error || "Erreur lors de l'upload");
      }
    } catch (e: any) {
      toast.error(e?.message || "Erreur réseau lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const pollDocumentStatus = (docId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/documents/${docId}`, { credentials: "include" }).then((r) => r.json());
        if (res.data?.status === "processed" || res.data?.status === "error") {
          clearInterval(interval);
          setDocuments((prev) => prev.map((d) => (d.id === docId ? res.data : d)));
          if (res.data.status === "processed") {
            toast.success("OCR terminé — données comptables extraites");
            if (selectedDoc?.id === docId) handleSelectDoc(res.data);
          } else {
            toast.error("L'analyse OCR a rencontré une difficulté sur ce fichier");
          }
        }
      } catch {}
    }, 2000);
    setTimeout(() => clearInterval(interval), 60000);
  };

  const handleRetryOCR = async (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRetryingId(docId);
    try {
      const res = await fetch(`/api/documents/${docId}/retry`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Traitement OCR relancé");
        setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, status: "processing" } : d)));
        if (selectedDoc?.id === docId) {
          setSelectedDoc((prev: any) => ({ ...prev, status: "processing" }));
        }
        pollDocumentStatus(docId);
      } else {
        toast.error(data.error || "Impossible de relancer l'OCR");
      }
    } catch {
      toast.error("Erreur réseau lors de la relance OCR");
    } finally {
      setRetryingId(null);
    }
  };

  const handleSelectDoc = (doc: any) => {
    setSelectedDoc(doc);
    if (doc.extracted_data) {
      setOcrFields({
        amount: doc.extracted_data.amount !== undefined ? String(doc.extracted_data.amount) : "",
        date: doc.extracted_data.date ? new Date(doc.extracted_data.date).toISOString().split("T")[0] : "",
        vendor_name: doc.extracted_data.vendor_name || "",
        vendor_siret: doc.extracted_data.vendor_siret || "",
        invoice_number: doc.extracted_data.invoice_number || "",
        vat_amount: doc.extracted_data.vat_amount !== undefined ? String(doc.extracted_data.vat_amount) : "",
      });
    } else {
      setOcrFields({
        amount: "",
        date: "",
        vendor_name: "",
        vendor_siret: "",
        invoice_number: "",
        vat_amount: "",
      });
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [accountCode, setAccountCode] = useState("606");

  const { data: accountsRes } = useQuery<any>({
    queryKey: ["accounts"],
    queryFn: () => fetcher("/api/accounts?limit=200"),
  });
  const accounts = Array.isArray(accountsRes) ? accountsRes : [];

  const handleTransform = async () => {
    if (!selectedDoc) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/documents/${selectedDoc.id}/transform`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...ocrFields,
          account_code: accountCode,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Écriture comptable créée avec succès");
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        setSelectedDoc(null);
      } else {
        toast.error(result.error || "Erreur lors de la validation");
      }
    } catch (e) {
      toast.error("Erreur réseau lors de la création de l'opération");
    } finally {
      setIsProcessing(false);
    }
  };

  const previewUrl = selectedDoc
    ? selectedDoc.file_url?.startsWith("http")
      ? selectedDoc.file_url
      : `/api/documents/${selectedDoc.id}/file`
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents & Justificatifs"
        subtitle="Téléversement Cloudflare R2 et extraction OCR automatique conforme SYSCOHADA"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFileUpload(file);
        }}
        className={cn(
          "rounded-xl border-2 border-dashed bg-background-secondary/50 p-8 sm:p-10 text-center transition relative",
          drag ? "border-primary bg-primary/10" : "border-border"
        )}
      >
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-xl z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-medium text-ink">Téléversement vers Cloudflare R2...</p>
            </div>
          </div>
        )}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-ink">
          <UploadCloud className="h-6 w-6 text-ink" />
        </div>
        <p className="mt-3 text-base sm:text-lg font-semibold text-ink">Déposez vos justificatifs ici</p>
        <p className="text-xs sm:text-sm text-muted">PDF, JPG, PNG, WEBP — Taille maximale 10 Mo</p>
        <div className="mt-4">
          <Input
            type="file"
            className="hidden"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <Label
            htmlFor="file-upload"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-primary/90 cursor-pointer min-h-[44px]"
          >
            Parcourir les fichiers
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Colonne 1 : Documents récents */}
        <div className="rounded-xl border border-border bg-background p-4 lg:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Documents récents</h3>
            <span className="text-xs text-muted tabular-nums">{documents.length} document(s)</span>
          </div>

          <ul className="space-y-1.5 max-h-[520px] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-muted text-xs">Chargement des documents...</div>
            ) : documents.length === 0 ? (
              <p className="text-xs text-muted p-6 text-center">Aucun justificatif importé pour le moment</p>
            ) : (
              documents.map((d) => (
                <li key={d.id}>
                  <div
                    onClick={() => handleSelectDoc(d)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-3 text-left transition cursor-pointer border",
                      selectedDoc?.id === d.id
                        ? "border-primary bg-primary/10"
                        : "border-transparent bg-background-secondary/40 hover:bg-background-secondary"
                    )}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background border border-border text-muted">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-ink">{d.original_filename}</p>
                      <p className="text-[11px] text-muted tabular-nums">
                        {formatDate(d.created_at)}
                        {d.status === "processed" && d.extracted_data?.amount !== undefined && (
                          <span className="font-medium text-ink ml-1.5">
                            · {formatCFA(d.extracted_data.amount)}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {d.status === "processed" && (
                        <CheckCircle2 className="h-4 w-4 text-success" title="Traité avec succès" />
                      )}
                      {d.status === "processing" && (
                        <Loader2 className="h-4 w-4 text-primary animate-spin" title="OCR en cours" />
                      )}
                      {d.status === "uploaded" && (
                        <Clock className="h-4 w-4 text-warning" title="En attente" />
                      )}
                      {d.status === "error" && (
                        <button
                          type="button"
                          onClick={(e) => handleRetryOCR(d.id, e)}
                          disabled={retryingId === d.id}
                          className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] text-error hover:bg-error/10 transition"
                          title="Cliquer pour relancer l'OCR"
                        >
                          {retryingId === d.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <RotateCw className="h-3.5 w-3.5" />
                          )}
                          <span>Relancer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Colonnes 2 & 3 : Aperçu du document + Données extraites */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2 lg:grid-cols-2">
          {/* Panneau d'aperçu */}
          <div className="flex flex-col h-[480px] rounded-xl border border-border bg-background p-3 overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
              <span className="font-semibold text-ink truncate max-w-[200px]">
                {selectedDoc ? selectedDoc.original_filename : "Aperçu du document"}
              </span>
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-muted hover:text-ink transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Ouvrir</span>
                </a>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden pt-2 bg-background-secondary/30 rounded-lg mt-2">
              {selectedDoc && previewUrl ? (
                selectedDoc.mime_type === "application/pdf" ? (
                  <iframe
                    src={previewUrl}
                    className="h-full w-full border-0 rounded-lg"
                    title="Aperçu PDF"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Aperçu du justificatif"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                )
              ) : (
                <div className="text-center text-muted p-4">
                  <FileText className="mx-auto h-10 w-10 opacity-30 mb-2" />
                  <p className="text-xs">Sélectionnez un document pour afficher son aperçu</p>
                </div>
              )}
            </div>
          </div>

          {/* Formulaire des données extraites */}
          <div className="rounded-xl border border-border bg-background p-5 flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <ScanLine className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-ink">Données extraites (OCR)</h3>
                </div>
                {selectedDoc && (
                  <span
                    className={cn(
                      "text-[11px] font-medium px-2 py-0.5 rounded-full border",
                      selectedDoc.status === "processed" && "bg-success/15 border-success/30 text-ink",
                      selectedDoc.status === "processing" && "bg-primary/20 border-primary/40 text-ink",
                      selectedDoc.status === "uploaded" && "bg-warning/15 border-warning/30 text-ink",
                      selectedDoc.status === "error" && "bg-error/15 border-error/30 text-error"
                    )}
                  >
                    {selectedDoc.status === "processed" && "Données validées"}
                    {selectedDoc.status === "processing" && "Analyse en cours..."}
                    {selectedDoc.status === "uploaded" && "En attente"}
                    {selectedDoc.status === "error" && "Anomalie OCR"}
                  </span>
                )}
              </div>

              {selectedDoc?.status === "error" && (
                <div className="mb-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-ink flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Extraction automatique incomplète</p>
                    <p className="text-[11px] text-muted mt-0.5">
                      Vérifiez les champs ci-dessous ou relancez l'analyse.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetryOCR(selectedDoc.id)}
                      disabled={retryingId === selectedDoc.id}
                      className="mt-2 h-7 text-xs border-border bg-background hover:bg-background-secondary min-h-[32px]"
                    >
                      {retryingId === selectedDoc.id && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                      Relancer l'OCR
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted">Fournisseur / Bénéficiaire</Label>
                  <Input
                    className="h-9 text-xs mt-1"
                    placeholder="Ex: DIGIPLEX SARL"
                    value={ocrFields.vendor_name}
                    onChange={(e) => setOcrFields({ ...ocrFields, vendor_name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted">Montant TTC (FCFA)</Label>
                    <Input
                      className="h-9 text-xs mt-1 tabular-nums font-medium"
                      placeholder="Ex: 2020000"
                      value={ocrFields.amount}
                      onChange={(e) => setOcrFields({ ...ocrFields, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted">Date facture</Label>
                    <Input
                      type="date"
                      className="h-9 text-xs mt-1 tabular-nums"
                      value={ocrFields.date}
                      onChange={(e) => setOcrFields({ ...ocrFields, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted">TVA déductible</Label>
                    <Input
                      className="h-9 text-xs mt-1 tabular-nums"
                      placeholder="Ex: 0"
                      value={ocrFields.vat_amount}
                      onChange={(e) => setOcrFields({ ...ocrFields, vat_amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted">N° de facture / Réf.</Label>
                    <Input
                      className="h-9 text-xs mt-1"
                      placeholder="Ex: EM018683313"
                      value={ocrFields.invoice_number}
                      onChange={(e) => setOcrFields({ ...ocrFields, invoice_number: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted">Compte de charge (SYSCOHADA)</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-xs text-ink shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary mt-1"
                    value={accountCode}
                    onChange={(e) => setAccountCode(e.target.value)}
                  >
                    <option value="606">606 - Achats non stockés de matières et fournitures</option>
                    <option value="601">601 - Achats de marchandises</option>
                    <option value="622">622 - Rémunérations d'intermédiaires et honoraires</option>
                    <option value="625">625 - Déplacements, missions et réceptions</option>
                    <option value="626">626 - Frais postaux et télécommunications</option>
                    <option value="628">628 - Frais divers de gestion (logiciels & abonnements)</option>
                    {accounts
                      .filter(
                        (a: any) =>
                          a.code.startsWith("6") &&
                          !["606", "601", "622", "625", "626", "628"].includes(a.code)
                      )
                      .map((a: any) => (
                        <option key={a.code} value={a.code}>
                          {a.code} - {a.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-ink font-semibold min-h-[44px]"
                disabled={!selectedDoc || isProcessing || (!ocrFields.amount && selectedDoc.status === "processing")}
                onClick={handleTransform}
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin text-ink" />}
                Valider et créer l'opération
              </Button>
              {selectedDoc && selectedDoc.status === "processing" && (
                <p className="text-[11px] text-center text-muted italic mt-2">
                  Extraction OCR en cours... Vous pouvez également saisir manuellement.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;