"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";

export const DownloadPayslipButton = ({
  payslipId,
  employeeName,
  period,
  variant = "ghost",
  className,
}: {
  payslipId: string;
  employeeName?: string;
  period?: string;
  variant?: any;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1. Fetch payslip data + company in parallel
      // Note: fetcher() already unwraps json.data from ApiResponse envelope
      const [payslip, company] = await Promise.all([
        fetcher(`/api/payroll/payslips/${payslipId}`),
        fetcher(`/api/company`),
      ]);

      if (!payslip || !company) {
        throw new Error("Données incomplètes");
      }

      // 2. Dynamically import React-PDF to avoid SSR issues
      const { pdf } = await import("@react-pdf/renderer");
      const { PayslipPDF } = await import("@/lib/pdf-templates/PayslipPDF");

      // 3. Generate PDF Blob
      const doc = <PayslipPDF payslip={payslip} company={company} />;
      const asPdf = pdf();
      asPdf.updateContainer(doc);

      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);

      // 4. Trigger download
      const monthLabel = new Date(payslip.year, payslip.month - 1)
        .toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
        .replace(" ", "-");

      const fileName = employeeName
        ? `bulletin-${employeeName.replace(/\s+/g, "-")}-${monthLabel}.pdf`
        : `bulletin-paie-${monthLabel}.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 100);

      toast.success("Bulletin téléchargé");
    } catch (err: any) {
      console.error(err);
      toast.error("Échec de la génération du bulletin PDF");
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
      title="Télécharger le bulletin"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
};
