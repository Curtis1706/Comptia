"use client";

import React, { useState } from "react";
import {
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  X,
  UploadCloud,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface UploadQueueItem {
  id: string;
  file: File;
  docId?: string;
  progress: number;
  step: "uploading" | "ocr" | "ready" | "error";
  error?: string;
}

export interface DocumentUploadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentReady?: (docId: string) => void;
  onAllCompleted?: (docIds: string[]) => void;
}

export function DocumentUploadDrawer({
  open,
  onOpenChange,
  onDocumentReady,
  onAllCompleted,
}: DocumentUploadDrawerProps) {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} Ko`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
  };

  const uploadAndProcessFile = async (item: UploadQueueItem) => {
    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("type", "invoice");

    try {
      // Étape 1 : Téléversement
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, step: "uploading", progress: 30 } : q
        )
      );

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await res.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || "Échec du téléversement");
      }

      const docId = result.data.id;

      // Étape 2 : Extraction OCR en cours
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? { ...q, docId, step: "ocr", progress: 65 }
            : q
        )
      );

      // Sondage du statut OCR
      pollOcrStatus(item.id, docId);
    } catch (err: any) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? {
                ...q,
                step: "error",
                progress: 100,
                error: err.message || "Échec du téléversement",
              }
            : q
        )
      );
    }
  };

  const pollOcrStatus = (queueId: string, docId: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/documents/${docId}`, {
          credentials: "include",
        });
        const json = await res.json();
        const doc = json.data;

        if (doc && (doc.status === "processed" || doc.extracted_data || doc.status === "error")) {
          clearInterval(interval);

          if (doc.status === "error") {
            setQueue((prev) =>
              prev.map((q) =>
                q.id === queueId
                  ? {
                      ...q,
                      step: "error",
                      progress: 100,
                      error: "Échec de l'analyse OCR",
                    }
                  : q
              )
            );
          } else {
            setQueue((prev) =>
              prev.map((q) =>
                q.id === queueId
                  ? { ...q, step: "ready", progress: 100 }
                  : q
              )
            );
            if (onDocumentReady) onDocumentReady(docId);
          }
        } else if (attempts >= 30) {
          // Timeout après 60s
          clearInterval(interval);
          setQueue((prev) =>
            prev.map((q) =>
              q.id === queueId
                ? {
                    ...q,
                    step: "ready", // On permet quand même la vérification manuelle
                    progress: 100,
                  }
                : q
            )
          );
        }
      } catch {
        if (attempts >= 30) clearInterval(interval);
      }
    }, 2000);
  };

  const handleFilesSelected = (files: File[]) => {
    const newItems: UploadQueueItem[] = files.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      file: f,
      progress: 10,
      step: "uploading",
    }));

    setQueue((prev) => [...prev, ...newItems]);

    // Démarrage des téléversements
    newItems.forEach((item) => {
      uploadAndProcessFile(item);
    });
  };

  const handleRemoveItem = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const handleRetryItem = (item: UploadQueueItem) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.id === item.id
          ? { ...q, step: "uploading", progress: 20, error: undefined }
          : q
      )
    );
    uploadAndProcessFile(item);
  };

  const readyItems = queue.filter((q) => q.step === "ready");
  const readyCount = readyItems.length;

  const handleStartVerification = () => {
    const readyDocIds = readyItems
      .map((q) => q.docId)
      .filter((id): id is string => Boolean(id));

    if (readyDocIds.length > 0) {
      onOpenChange(false);
      if (onAllCompleted) {
        onAllCompleted(readyDocIds);
      } else if (onDocumentReady) {
        onDocumentReady(readyDocIds[0]);
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col justify-between bg-background border-l border-border"
      >
        {/* En-tête */}
        <div className="p-6 border-b border-border">
          <SheetHeader>
            <SheetTitle className="text-lg font-bold text-ink tracking-tight">
              Téléverser des justificatifs
            </SheetTitle>
            <SheetDescription className="text-xs text-muted font-normal mt-1">
              Glissez vos factures fournisseurs ou reçus pour extraction automatique SYSCOHADA.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Corps défilable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Zone de dropzone 21st.dev */}
          <FileDropzone
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            maxSizeMB={10}
            maxFiles={10}
            multiple={true}
            onFilesSelected={handleFilesSelected}
          />

          {/* Liste des fichiers téléversés */}
          {queue.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Fichiers ajoutés ({queue.length})
              </h4>

              <div className="space-y-2">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-border bg-background-secondary/30 flex flex-col gap-2 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-background border border-border text-ink">
                          <FileText className="h-4 w-4 text-ink" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-ink truncate">
                            {item.file.name}
                          </p>
                          <p className="text-[11px] text-muted font-mono tabular-nums">
                            {formatFileSize(item.file.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.step === "uploading" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
                            <Loader2 className="h-3 w-3 animate-spin text-ink" />
                            <span>Téléversement...</span>
                          </span>
                        )}

                        {item.step === "ocr" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-warning">
                            <Loader2 className="h-3 w-3 animate-spin text-warning" />
                            <span>Extraction OCR...</span>
                          </span>
                        )}

                        {item.step === "ready" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink bg-success/20 px-2 py-0.5 rounded border border-success/30">
                            <CheckCircle2 className="h-3 w-3 text-ink" />
                            <span>Prêt</span>
                          </span>
                        )}

                        {item.step === "error" && (
                          <button
                            type="button"
                            onClick={() => handleRetryItem(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-error hover:underline"
                            title="Réessayer le téléversement"
                          >
                            <RotateCw className="h-3 w-3" />
                            <span>Réessayer</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-6 w-6 inline-flex items-center justify-center text-muted hover:text-ink hover:bg-background-secondary rounded transition-colors ml-1"
                          title="Retirer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Barre de progression fine */}
                    {item.step !== "ready" && (
                      <div className="w-full bg-border/40 h-1 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-300",
                            item.step === "error"
                              ? "bg-error"
                              : item.step === "ocr"
                              ? "bg-warning"
                              : "bg-primary"
                          )}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}

                    {item.error && (
                      <p className="text-[11px] text-error font-medium">
                        {item.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pied de panneau fixé */}
        <div className="p-4 border-t border-border bg-background flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs font-medium border-border hover:bg-background-secondary text-ink h-9 px-4"
          >
            Annuler
          </Button>

          <Button
            type="button"
            onClick={handleStartVerification}
            disabled={readyCount === 0}
            className="bg-primary text-ink text-xs font-bold hover:brightness-95 active:scale-[0.99] transition-all shadow-xs h-9 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Vérifier les documents ({readyCount})
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DocumentUploadDrawer;
