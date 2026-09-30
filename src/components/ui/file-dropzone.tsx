"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UploadFileItem {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  status?: "pending" | "uploading" | "processing" | "ready" | "error";
  error?: string;
}

export interface FileDropzoneProps {
  accept?: string;
  maxSizeMB?: number;
  maxFiles?: number;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

/**
 * Composant FileDropzone issu du catalogue 21st.dev (id: 19201 par joyco)
 * Adapté aux règles Ceilow : tokens sémantiques, zéro couleur hors palette, aucun emoji.
 */
export function FileDropzone({
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  maxSizeMB = 10,
  maxFiles = 10,
  multiple = true,
  onFilesSelected,
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setErrorMsg(null);
      const validFiles: File[] = [];
      const maxSize = maxSizeMB * 1024 * 1024;

      const fileArray = Array.from(newFiles);
      if (fileArray.length > maxFiles) {
        setErrorMsg(`Vous ne pouvez pas ajouter plus de ${maxFiles} fichiers à la fois.`);
        return;
      }

      for (const file of fileArray) {
        if (file.size > maxSize) {
          setErrorMsg(`Le fichier "${file.name}" dépasse la taille maximale autorisée (${maxSizeMB} Mo).`);
          return;
        }

        // Vérification d'extension
        const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
        const acceptedExts = accept.split(",").map((s) => s.trim().toLowerCase());
        const isAccepted =
          acceptedExts.includes(ext) ||
          acceptedExts.some((a) => a.includes("image/*") && file.type.startsWith("image/"));

        if (!isAccepted && accept !== "*") {
          setErrorMsg(`Le type de fichier "${file.name}" n'est pas autorisé. Formats acceptés : ${accept}`);
          return;
        }

        validFiles.push(file);
      }

      if (validFiles.length > 0 && onFilesSelected) {
        onFilesSelected(validFiles);
      }
    },
    [accept, maxSizeMB, maxFiles, onFilesSelected]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      // Réinitialiser la valeur de l'input pour permettre de resélectionner le même fichier si besoin
      e.target.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative flex flex-col items-center justify-center p-6 text-center rounded-xl border-2 border-dashed transition-all cursor-pointer select-none",
          isDragging
            ? "border-primary bg-primary/10 scale-[0.99]"
            : "border-border bg-background-secondary/40 hover:bg-background-secondary/80 hover:border-border"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Sélectionner des justificatifs"
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border text-ink mb-3 shadow-2xs">
          <UploadCloud className="h-6 w-6 text-ink" />
        </div>

        <p className="text-sm font-semibold text-ink">
          Glissez vos fichiers ici, ou{" "}
          <span className="text-ink underline underline-offset-2 font-bold hover:text-ink/80">
            parcourez vos dossiers
          </span>
        </p>

        <p className="text-xs text-muted mt-1.5 font-normal">
          PDF, JPG, PNG, WEBP — 10 Mo maximum par fichier
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-error/10 border border-error/25 text-xs text-error">
          <AlertCircle className="h-4 w-4 shrink-0 text-error" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

export default FileDropzone;
