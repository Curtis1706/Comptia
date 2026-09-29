"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCFA, formatDate } from "@/lib/format";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  TrendingUp,
  TrendingDown,
  Scale,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface ThirdPartyDetailDrawerProps {
  thirdPartyId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ThirdPartyDetailDrawer({
  thirdPartyId,
  isOpen,
  onClose,
}: ThirdPartyDetailDrawerProps) {
  const { data, isLoading, error } = useQuery<{
    success: boolean;
    data: {
      third_party: {
        id: string;
        name: string;
        type: "client" | "supplier";
        ifu?: string;
        rccm?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        is_active: boolean;
      };
      entries: Array<{
        id: string;
        date: string;
        reference: string;
        journal: string;
        description: string;
        account_code: string;
        debit: number;
        credit: number;
        running_balance: number;
        status: string;
      }>;
      summary: {
        total_debit: number;
        total_credit: number;
        balance: number;
      };
    };
  }>({
    queryKey: ["third-party-ledger", thirdPartyId],
    queryFn: () => fetcher(`/api/third-parties/${thirdPartyId}/ledger`),
    enabled: Boolean(thirdPartyId && isOpen),
  });

  const tp = data?.data?.third_party;
  const entries = data?.data?.entries || [];
  const summary = data?.data?.summary;

  const isClient = tp?.type === "client";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto p-0 flex flex-col bg-background border-l border-border"
      >
        <SheetHeader className="p-6 border-b border-border bg-background-secondary/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-ink font-bold text-base shrink-0">
                {tp?.name?.[0]?.toUpperCase() ?? "T"}
              </div>
              <div>
                <SheetTitle className="text-xl font-semibold text-ink">
                  {isLoading ? <Skeleton className="h-6 w-48" /> : tp?.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted flex items-center gap-2 mt-0.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      isClient
                        ? "bg-primary/10 text-ink"
                        : "bg-warning/10 text-warning"
                    )}
                  >
                    {isClient ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {isClient ? "Compte 411 — Client" : "Compte 401 — Fournisseur"}
                  </span>
                  {tp?.ifu && (
                    <span className="font-mono text-muted">
                      IFU: {tp.ifu}
                    </span>
                  )}
                </SheetDescription>
              </div>
            </div>
          </div>

          {/* Coordonnées & infos tiers */}
          {tp && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border/60 text-xs">
              <div>
                <span className="text-muted block">Email</span>
                <span className="text-ink font-medium truncate flex items-center gap-1 mt-0.5">
                  <Mail className="h-3 w-3 text-muted shrink-0" />
                  {tp.email || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted block">Téléphone</span>
                <span className="text-ink font-medium truncate flex items-center gap-1 mt-0.5">
                  <Phone className="h-3 w-3 text-muted shrink-0" />
                  {tp.phone || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted block">Localisation</span>
                <span className="text-ink font-medium truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-muted shrink-0" />
                  {tp.city || tp.address || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted block">Statut compte</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 mt-0.5 font-medium",
                    tp.is_active ? "text-success" : "text-muted"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      tp.is_active ? "bg-success" : "bg-muted"
                    )}
                  />
                  {tp.is_active ? "Actif" : "Désactivé"}
                </span>
              </div>
            </div>
          )}
        </SheetHeader>

        {/* Synthèse des soldes */}
        <div className="p-6 border-b border-border bg-background grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border p-3 bg-background-secondary/30">
            <span className="text-xs text-muted block">Total Débits</span>
            <span className="text-sm sm:text-base font-semibold font-mono tabular-nums text-ink mt-0.5 block">
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                formatCFA(summary?.total_debit || 0)
              )}
            </span>
          </div>
          <div className="rounded-lg border border-border p-3 bg-background-secondary/30">
            <span className="text-xs text-muted block">Total Crédits</span>
            <span className="text-sm sm:text-base font-semibold font-mono tabular-nums text-ink mt-0.5 block">
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                formatCFA(summary?.total_credit || 0)
              )}
            </span>
          </div>
          <div
            className={cn(
              "rounded-lg border p-3",
              (summary?.balance || 0) > 0
                ? "border-warning/30 bg-warning/5"
                : (summary?.balance || 0) < 0
                  ? "border-error/30 bg-error/5"
                  : "border-border bg-background-secondary/30"
            )}
          >
            <span className="text-xs text-muted block flex items-center gap-1">
              <Scale className="h-3 w-3" />
              {isClient ? "Solde dû (Créance)" : "Solde dû (Dette)"}
            </span>
            <span
              className={cn(
                "text-sm sm:text-base font-bold font-mono tabular-nums mt-0.5 block",
                (summary?.balance || 0) > 0
                  ? "text-ink"
                  : (summary?.balance || 0) < 0
                    ? "text-error"
                    : "text-muted"
              )}
            >
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                formatCFA(summary?.balance || 0)
              )}
            </span>
          </div>
        </div>

        {/* Tableau du Grand Livre Auxiliaire */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-muted" />
              Grand Livre Auxiliaire Chronologique
            </h3>
            <span className="text-xs text-muted font-mono">
              {entries.length} écriture{entries.length > 1 ? "s" : ""}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center border border-dashed border-border rounded-lg">
              <AlertCircle className="h-8 w-8 text-error mx-auto mb-2 opacity-80" />
              <p className="text-sm text-ink font-medium">
                Impossible de charger le grand livre auxiliaire
              </p>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-lg bg-background-secondary/20">
              <FileText className="h-8 w-8 text-muted mx-auto mb-2 opacity-40" />
              <p className="text-sm text-ink font-medium">
                Aucune écriture comptable enregistrée
              </p>
              <p className="text-xs text-muted mt-1">
                Les opérations validées et comptabilisées avec ce tiers
                apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-background-secondary text-left font-medium text-muted">
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Réf. Pièce</th>
                      <th className="px-3 py-2">Libellé</th>
                      <th className="px-3 py-2 text-right">Débit</th>
                      <th className="px-3 py-2 text-right">Crédit</th>
                      <th className="px-3 py-2 text-right font-semibold">
                        Solde progressif
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {entries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-background-secondary/40 transition-colors"
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-muted">
                          {formatDate(entry.date)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap font-mono font-medium text-ink">
                          {entry.reference}
                        </td>
                        <td className="px-3 py-2 max-w-[200px] truncate text-ink">
                          {entry.description}
                        </td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums text-ink">
                          {entry.debit > 0 ? formatCFA(entry.debit) : "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums text-ink">
                          {entry.credit > 0 ? formatCFA(entry.credit) : "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums font-semibold text-ink">
                          {formatCFA(entry.running_balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-background flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
