"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, Clock, ScanLine, Loader2, AlertCircle } from "lucide-react";
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
      const docs = query?.state?.data?.data || [];
      return docs.some((d: any) => d.status === "processing" || d.status === "uploaded") ? 3000 : false;
    },
  });

  const documents: any[] = docsRes?.data || [];

  const setDocuments = (updater: (prev: any[]) => any[]) => {
    queryClient.setQueryData(["documents"], (old: any) => ({
      ...old,
      data: updater(old?.data || []),
    }));
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
        toast.success("Fichier uploadé, OCR en cours...");
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
      const res = await fetch(`/api/documents/${docId}`).then((r) => r.json());
      if (res.data?.status === "processed" || res.data?.status === "error") {
        clearInterval(interval);
        setDocuments((prev) => prev.map((d) => (d.id === docId ? res.data : d)));
        if (res.data.status === "processed") {
          toast.success("OCR terminé — données extraites");
          if (selectedDoc?.id === docId) handleSelectDoc(res.data);
        } else {
          toast.error("L'OCR a échoué pour ce document");
        }
      }
    }, 2000);
    setTimeout(() => clearInterval(interval), 60000);
  };

  const handleSelectDoc = (doc: any) => {
    setSelectedDoc(doc);
    if (doc.extracted_data) {
      setOcrFields({
        amount: doc.extracted_data.amount || "",
        date: doc.extracted_data.date ? new Date(doc.extracted_data.date).toISOString().split("T")[0] : "",
        vendor_name: doc.extracted_data.vendor_name || "",
        vendor_siret: doc.extracted_data.vendor_siret || "",
        invoice_number: doc.extracted_data.invoice_number || "",
        vat_amount: doc.extracted_data.vat_amount || "",
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
        body: JSON.stringify({
          ...ocrFields,
          account_code: accountCode,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Écriture comptable créée !");
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        setSelectedDoc(null);
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error("Erreur lors de la création de l'opération");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" subtitle="Importez vos justificatifs, l'OCR fait le reste" />

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
          "rounded-xl border-2 border-dashed bg-gradient-subtle p-10 text-center transition relative",
          drag ? "border-primary bg-primary-soft" : "border-border"
        )}
      >
        {isUploading && (
          <div className="absolute inset-0 bg-card/50 flex items-center justify-center rounded-xl z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
          <UploadCloud className="h-7 w-7" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold">Déposez vos fichiers ici</p>
        <p className="text-sm text-muted-foreground">PDF, JPG, PNG, WEBP · Max 10 MB</p>
        <div className="mt-4">
          <Input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <Label
            htmlFor="file-upload"
            className="inline-flex h-9 items-center justify-center rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition hover:opacity-90 cursor-pointer"
          >
            Parcourir les fichiers
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card lg:col-span-1">
          <h3 className="mb-3 font-display text-sm font-semibold">Documents récents</h3>
          <ul className="space-y-1">
            {documents.length === 0 ? (
              <p className="text-xs text-muted-foreground p-4 text-center">Aucun document importé</p>
            ) : (
              documents.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => handleSelectDoc(d)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-muted/50",
                      selectedDoc?.id === d.id && "bg-primary-soft"
                    )}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{d.original_filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(d.created_at)} · {d.status === "processed" ? formatCFA(d.extracted_data?.amount || 0) : "..."}
                      </p>
                    </div>
                    {d.status === "processed" && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {d.status === "processing" && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                    {d.status === "uploaded" && <Clock className="h-4 w-4 text-warning" />}
                    {d.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:col-span-2 lg:grid-cols-2">
          <div className="flex h-[450px] items-center justify-center rounded-xl border border-border bg-gradient-subtle p-4 shadow-card overflow-hidden">
            {selectedDoc ? (
              selectedDoc.mime_type === "application/pdf" ? (
                <iframe src={selectedDoc.file_url} className="h-full w-full border-0" title="PDF Viewer" />
              ) : (
                <img src={selectedDoc.file_url} alt="Aperçu" className="max-h-full max-w-full object-contain" />
              )
            ) : (
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 opacity-40" />
                <p className="mt-2 text-sm">Sélectionnez un document pour l'aperçu</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <ScanLine className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-semibold">Données extraites (OCR)</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Fournisseur</Label>
                <Input
                  value={ocrFields.vendor_name}
                  onChange={(e) => setOcrFields({ ...ocrFields, vendor_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Montant TTC</Label>
                  <Input
                    value={ocrFields.amount}
                    onChange={(e) => setOcrFields({ ...ocrFields, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={ocrFields.date}
                    onChange={(e) => setOcrFields({ ...ocrFields, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">TVA</Label>
                  <Input
                    value={ocrFields.vat_amount}
                    onChange={(e) => setOcrFields({ ...ocrFields, vat_amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">N° facture</Label>
                  <Input
                    value={ocrFields.invoice_number}
                    onChange={(e) => setOcrFields({ ...ocrFields, invoice_number: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Compte de charge</Label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={accountCode}
                  onChange={(e) => setAccountCode(e.target.value)}
                >
                  <option value="606">606 - Achats non stockés</option>
                  <option value="601">601 - Achats de matières</option>
                  <option value="622">622 - Rémunérations intermédiaires</option>
                  <option value="625">625 - Déplacements et missions</option>
                  <option value="626">626 - Frais postaux et télécoms</option>
                  {accounts.filter((a: any) => a.code.startsWith("6") && a.code !== "606" && a.code !== "601" && a.code !== "622" && a.code !== "625" && a.code !== "626").map((a: any) => (
                    <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                  ))}
                </select>
              </div>
              <Button 
                className="w-full bg-gradient-primary hover:opacity-90" 
                disabled={!selectedDoc || isProcessing || selectedDoc.status !== "processed"}
                onClick={handleTransform}
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Valider et créer l'opération
              </Button>
              {selectedDoc && selectedDoc.status !== "processed" && (
                <p className="text-[10px] text-center text-muted-foreground italic">
                  Attendez la fin de l'OCR pour valider
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