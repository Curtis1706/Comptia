import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, XCircle, Send, Eye, HelpCircle } from "lucide-react";
import type { InvoiceStatus, OperationStatus } from "@/data/mock";

const invoiceMap: Record<string, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  paid: { label: "Payée", cls: "bg-success-soft text-success", Icon: CheckCircle2 },
  draft: { label: "Brouillon", cls: "bg-info-soft text-info", Icon: Clock },
  sent: { label: "Envoyée", cls: "bg-primary/10 text-primary", Icon: Send },
  viewed: { label: "Consultée", cls: "bg-primary/10 text-primary", Icon: Eye },
  overdue: { label: "En retard", cls: "bg-warning-soft text-warning", Icon: AlertTriangle },
  cancelled: { label: "Annulée", cls: "bg-destructive-soft text-destructive", Icon: XCircle },
  // Compatibility with old mock types
  payee: { label: "Payée", cls: "bg-success-soft text-success", Icon: CheckCircle2 },
  attente: { label: "En attente", cls: "bg-info-soft text-info", Icon: Clock },
  retard: { label: "En retard", cls: "bg-warning-soft text-warning", Icon: AlertTriangle },
  impayee: { label: "Impayée", cls: "bg-destructive-soft text-destructive", Icon: XCircle },
};

const operationMap: Record<string, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  validated: { label: "Validée", cls: "bg-success-soft text-success", Icon: CheckCircle2 },
  posted: { label: "Comptabilisée", cls: "bg-primary/10 text-primary", Icon: CheckCircle2 },
  draft: { label: "Brouillon", cls: "bg-warning-soft text-warning", Icon: Clock },
  // Compatibility
  validee: { label: "Validée", cls: "bg-success-soft text-success", Icon: CheckCircle2 },
  attente: { label: "En attente", cls: "bg-warning-soft text-warning", Icon: Clock },
  erreur: { label: "Erreur", cls: "bg-destructive-soft text-destructive", Icon: XCircle },
};

const fallback = { label: "Inconnu", cls: "bg-muted text-muted-foreground", Icon: HelpCircle };

export const InvoiceStatusBadge = ({ status }: { status: any }) => {
  const m = invoiceMap[status] || fallback;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", m.cls)}>
      <m.Icon className="h-3 w-3" /> {m.label}
    </span>
  );
};

export const OperationStatusBadge = ({ status }: { status: any }) => {
  const m = operationMap[status] || fallback;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", m.cls)}>
      <m.Icon className="h-3 w-3" /> {m.label}
    </span>
  );
};