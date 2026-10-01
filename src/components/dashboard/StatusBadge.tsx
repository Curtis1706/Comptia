import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, XCircle, Send, Eye, HelpCircle } from "lucide-react";

interface StatusConfig {
  label: string;
  badgeCls: string;
  iconCls: string;
  Icon: typeof CheckCircle2;
}

const invoiceMap: Record<string, StatusConfig> = {
  paid: {
    label: "Payée",
    badgeCls: "bg-success/20 border border-success/40 text-success-deep font-semibold dark:text-success",
    iconCls: "text-success-deep dark:text-success",
    Icon: CheckCircle2,
  },
  payee: {
    label: "Payée",
    badgeCls: "bg-success/20 border border-success/40 text-success-deep font-semibold dark:text-success",
    iconCls: "text-success-deep dark:text-success",
    Icon: CheckCircle2,
  },
  sent: {
    label: "Envoyée",
    badgeCls: "bg-primary/30 border border-primary/60 text-ink font-semibold dark:text-foreground",
    iconCls: "text-ink dark:text-foreground",
    Icon: Send,
  },
  envoyee: {
    label: "Envoyée",
    badgeCls: "bg-primary/30 border border-primary/60 text-ink font-semibold dark:text-foreground",
    iconCls: "text-ink dark:text-foreground",
    Icon: Send,
  },
  viewed: {
    label: "Consultée",
    badgeCls: "bg-primary/20 border border-primary/40 text-ink font-semibold dark:text-foreground",
    iconCls: "text-ink dark:text-foreground",
    Icon: Eye,
  },
  overdue: {
    label: "En retard",
    badgeCls: "bg-destructive/15 border border-destructive/35 text-destructive-deep font-semibold dark:text-destructive",
    iconCls: "text-destructive-deep dark:text-destructive",
    Icon: AlertTriangle,
  },
  retard: {
    label: "En retard",
    badgeCls: "bg-destructive/15 border border-destructive/35 text-destructive-deep font-semibold dark:text-destructive",
    iconCls: "text-destructive-deep dark:text-destructive",
    Icon: AlertTriangle,
  },
  draft: {
    label: "Brouillon",
    badgeCls: "bg-background-secondary border border-border text-text-muted font-medium",
    iconCls: "text-text-muted",
    Icon: Clock,
  },
  brouillon: {
    label: "Brouillon",
    badgeCls: "bg-background-secondary border border-border text-text-muted font-medium",
    iconCls: "text-text-muted",
    Icon: Clock,
  },
  attente: {
    label: "En attente",
    badgeCls: "bg-warning/20 border border-warning/40 text-warning-deep font-semibold dark:text-warning",
    iconCls: "text-warning-deep dark:text-warning",
    Icon: Clock,
  },
  cancelled: {
    label: "Annulée",
    badgeCls: "bg-destructive/15 border border-destructive/35 text-destructive-deep font-semibold dark:text-destructive",
    iconCls: "text-destructive-deep dark:text-destructive",
    Icon: XCircle,
  },
  impayee: {
    label: "Impayée",
    badgeCls: "bg-destructive/15 border border-destructive/35 text-destructive-deep font-semibold dark:text-destructive",
    iconCls: "text-destructive-deep dark:text-destructive",
    Icon: XCircle,
  },
};

const operationMap: Record<string, StatusConfig> = {
  validated: {
    label: "Validée",
    badgeCls: "bg-success/20 border border-success/40 text-success-deep font-semibold dark:text-success",
    iconCls: "text-success-deep dark:text-success",
    Icon: CheckCircle2,
  },
  validee: {
    label: "Validée",
    badgeCls: "bg-success/20 border border-success/40 text-success-deep font-semibold dark:text-success",
    iconCls: "text-success-deep dark:text-success",
    Icon: CheckCircle2,
  },
  posted: {
    label: "Comptabilisée",
    badgeCls: "bg-primary/30 border border-primary/60 text-ink font-semibold dark:text-foreground",
    iconCls: "text-ink dark:text-foreground",
    Icon: CheckCircle2,
  },
  draft: {
    label: "Brouillon",
    badgeCls: "bg-warning/20 border border-warning/40 text-warning-deep font-semibold dark:text-warning",
    iconCls: "text-warning-deep dark:text-warning",
    Icon: Clock,
  },
  brouillon: {
    label: "Brouillon",
    badgeCls: "bg-warning/20 border border-warning/40 text-warning-deep font-semibold dark:text-warning",
    iconCls: "text-warning-deep dark:text-warning",
    Icon: Clock,
  },
  attente: {
    label: "En attente",
    badgeCls: "bg-warning/20 border border-warning/40 text-warning-deep font-semibold dark:text-warning",
    iconCls: "text-warning-deep dark:text-warning",
    Icon: Clock,
  },
  erreur: {
    label: "Erreur",
    badgeCls: "bg-destructive/15 border border-destructive/35 text-destructive-deep font-semibold dark:text-destructive",
    iconCls: "text-destructive-deep dark:text-destructive",
    Icon: XCircle,
  },
};

const fallback: StatusConfig = {
  label: "Inconnu",
  badgeCls: "bg-muted border border-border text-muted-foreground",
  iconCls: "text-muted-foreground",
  Icon: HelpCircle,
};

export const InvoiceStatusBadge = ({ status }: { status: any }) => {
  const m = invoiceMap[status] || fallback;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs shadow-xs", m.badgeCls)}>
      <m.Icon className={cn("h-3.5 w-3.5 shrink-0", m.iconCls)} />
      <span>{m.label}</span>
    </span>
  );
};

export const OperationStatusBadge = ({ status }: { status: any }) => {
  const m = operationMap[status] || fallback;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs shadow-xs", m.badgeCls)}>
      <m.Icon className={cn("h-3.5 w-3.5 shrink-0", m.iconCls)} />
      <span>{m.label}</span>
    </span>
  );
};