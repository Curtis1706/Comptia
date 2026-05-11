"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";

export const DownloadPdfButton = ({ invoiceId, variant = "ghost", className }: { invoiceId: string, variant?: any, className?: string }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      // 1. Fetch data
      const [invoiceRes, companyRes] = await Promise.all([
        fetcher(`/api/invoices/${invoiceId}`),
        fetcher(`/api/company`)
      ]);
      
      const invoice = invoiceRes.data || invoiceRes;
      const company = companyRes.data || companyRes;

      if (!invoice || !company) {
        throw new Error("Données incomplètes");
      }

      // 2. Dynamically import React-PDF to avoid SSR issues
      const { pdf } = await import("@react-pdf/renderer");
      const { InvoicePDF } = await import("@/lib/pdf-templates/InvoicePDF");
      
      // 3. Generate PDF Blob
      const doc = <InvoicePDF invoice={invoice} company={company} />;
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      
      // 4. Download
      const link = document.createElement("a");
      link.href = url;
      link.download = `facture-${invoice.reference || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err: any) {
      console.error(err);
      toast.error("Échec de la génération du PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      size="icon" 
      className={className || "h-8 w-8"} 
      onClick={handleDownload}
      disabled={loading}
      title="Télécharger le PDF"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <Download className="h-4 w-4" />}
    </Button>
  );
};
