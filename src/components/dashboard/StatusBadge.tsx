import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import type { InvoiceStatus, OperationStatus } from "@/data/mock";

const invoiceMap: Record<InvoiceStatus, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  payee: { label: "Payée", cls: "bg-success-soft text-success", Icon: CheckCircle2 },
  attente: { label: "En attente", cls: "bg-info-soft text-info", Icon: Clock },
  retard: { label: "En retard", cls: "bg-warning-soft text-warning", Icon: AlertTriangle },
  impayee: { label: "Impayée", cls: "bg-destructive-soft text-destructive", Icon: XCircle },
};

const operationMap: Record<OperationStatus, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  validee: { label: "Validée", cls: "bg-success-soft text-success", Icon: CheckCircle2 },
  attente: { label: "En attente", cls: "bg-warning-soft text-warning", Icon: Clock },
  erreur: { label: "Erreur", cls: "bg-destructive-soft text-destructive", Icon: XCircle },
};

export const InvoiceStatusBadge = ({ status }: { status: InvoiceStatus }) => {
  const m = invoiceMap[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", m.cls)}>
      <m.Icon className="h-3 w-3" /> {m.label}
    </span>
  );
};

export const OperationStatusBadge = ({ status }: { status: OperationStatus }) => {
  const m = operationMap[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", m.cls)}>
      <m.Icon className="h-3 w-3" /> {m.label}
    </span>
  );
};