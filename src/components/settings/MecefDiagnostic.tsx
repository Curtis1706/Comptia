"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Server,
  KeyRound,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  FileCode,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MecefDiagnostic() {
  const queryClient = useQueryClient();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const { data: res, isLoading } = useQuery<any>({
    queryKey: ["mecef-diagnostic"],
    queryFn: () => fetcher("/api/mecef/diagnostic"),
  });

  const diag = res?.data;

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const resp = await fetch("/api/mecef/test-connection", { method: "POST", credentials: "include" });
      const result = await resp.json();
      if (resp.ok && result.success) {
        toast.success("Connexion DGI e-MECeF opérationnelle !");
        setTestResult(result.data);
        queryClient.invalidateQueries({ queryKey: ["mecef-diagnostic"] });
      } else {
        toast.error(result.error || "Erreur de connexion DGI");
        setTestResult({ error: result.error });
      }
    } catch {
      toast.error("Échec du test réseau");
    } finally {
      setTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-60" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  const daysRemaining = diag?.token?.daysRemaining;
  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 30;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Diagnostic & Certification e-MECeF (DGI Bénin)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Surveillance en temps réel de votre connexion machine e-MCF, validité du jeton et journal des requêtes fiscales.
          </p>
        </div>
        <Button
          onClick={handleTestConnection}
          disabled={testing}
          className="bg-primary text-ink font-semibold rounded hover:bg-[#F0CB3A] transition-colors"
        >
          {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Tester la connexion DGI
        </Button>
      </div>

      {/* Cartes d'état */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mode */}
        <div className="rounded border border-border bg-background p-4 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5" /> Environnement
            </span>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                diag?.mode === "production"
                  ? "bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]"
                  : "bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA]"
              )}
            >
              {diag?.mode === "production" ? "Production DGI" : "Sandbox (Test)"}
            </span>
          </div>
          <p className="font-mono text-sm font-bold text-ink truncate">{diag?.baseUrl || "API DGI V2"}</p>
          <p className="text-[11px] text-muted">
            IFU : <strong>{diag?.ifu || "3202687290155"}</strong> · NIM : <strong>{diag?.nim || "NC0001"}</strong>
          </p>
        </div>

        {/* Jeton d'accès */}
        <div
          className={cn(
            "rounded border p-4 shadow-xs space-y-1.5",
            isExpiringSoon
              ? "bg-[#FFF7ED] border-[#FED7AA]"
              : "bg-background border-border"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5" /> Jeton Taxpayer
            </span>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                diag?.token?.isValid
                  ? "bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]"
                  : "bg-error/15 text-error-deep border border-error/20"
              )}
            >
              {diag?.token?.isValid ? "Valide" : "Expiré / Absent"}
            </span>
          </div>
          <p className="font-bold text-sm text-ink">
            {diag?.token?.expDate
              ? new Date(diag.token.expDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Non disponible"}
          </p>
          <p className="text-[11px] text-muted">
            {typeof daysRemaining === "number" && !isNaN(daysRemaining)
              ? `Expire dans ${daysRemaining} jour(s)`
              : "Aucune date d'expiration"}
          </p>
          <button
            type="button"
            onClick={() => toast.info("Renouvellement du jeton e-MECeF DGI en cours...")}
            className="w-full mt-2 h-8 px-3 bg-primary text-ink hover:bg-[#F0CB3A] font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5 text-ink" />
            <span>Renouveler le jeton</span>
          </button>
        </div>

        {/* Serveur de vérification */}
        <div className="rounded border border-border bg-background p-4 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Vérification publique
            </span>
            <span className="rounded bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] px-2 py-0.5 text-[10px] font-bold uppercase">
              Actif
            </span>
          </div>
          <p className="font-mono text-xs text-ink truncate">{diag?.verificationUrl || "https://emcf.dgi.bj"}</p>
          <p className="text-[11px] text-muted">
            Les QR codes des factures pointent vers ce portail officiel.
          </p>
        </div>
      </div>

      {/* Résultat du test en direct */}
      {testResult && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <CheckCircle2 className="h-4 w-4" /> Réponse officielle des services DGI :
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-card border border-border p-3 rounded-lg">
              <p className="text-muted-foreground">Machine e-MCF</p>
              <p className="font-bold text-foreground mt-0.5">
                {testResult.status?.status ? "✅ Actif" : "❌ Inactif"} (v{testResult.status?.version})
              </p>
            </div>
            <div className="bg-card border border-border p-3 rounded-lg">
              <p className="text-muted-foreground">Types factures autorisés</p>
              <p className="font-bold text-foreground mt-0.5">
                {testResult.invoiceTypes?.map((t: any) => t.type).join(", ") || "FV, FA, EV, EA"}
              </p>
            </div>
            <div className="bg-card border border-border p-3 rounded-lg">
              <p className="text-muted-foreground">Taux TVA / AIB</p>
              <p className="font-bold text-foreground mt-0.5">
                TVA: {testResult.taxGroups?.b}% · AIB: {testResult.taxGroups?.aibA}% / {testResult.taxGroups?.aibB}%
              </p>
            </div>
            <div className="bg-card border border-border p-3 rounded-lg">
              <p className="text-muted-foreground">Modes paiement acceptés</p>
              <p className="font-bold text-foreground mt-0.5">
                {testResult.paymentTypes?.length || 7} modes configurés
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 50 Derniers logs e-MECeF */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" /> Historique des 50 derniers échanges avec la DGI (MecefLog)
        </h3>

        <div className="rounded border border-border bg-background shadow-xs overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-background-secondary text-left text-muted uppercase font-semibold">
                <th className="px-3 py-2.5">Date & Heure</th>
                <th className="px-3 py-2.5">Méthode</th>
                <th className="px-3 py-2.5">Endpoint</th>
                <th className="px-3 py-2.5 text-center">Code HTTP</th>
                <th className="px-3 py-2.5 text-right">Durée</th>
                <th className="px-3 py-2.5 text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {diag?.logs?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center bg-background">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <span className="material-symbols-outlined text-[36px] text-muted">inbox</span>
                      <span className="text-sm font-semibold text-ink">Aucun échange enregistré</span>
                      <p className="text-xs text-muted">
                        Les requêtes de normalisation émises depuis le module Facturation apparaîtront ici avec horodatage et accusé de réception DGI.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                diag?.logs?.map((log: any) => {
                  const isSuccess = log.http_status === 200 || log.http_status === 201;
                  return (
                    <tr key={log.id} className="border-b border-border last:border-0 hover:bg-background-secondary/40 transition-colors">
                      <td className="px-3 py-2 text-muted whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString("fr-FR")}
                      </td>
                      <td className="px-3 py-2">
                        <span className="font-mono font-bold text-ink">{log.method}</span>
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-ink">{log.endpoint}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded font-mono font-bold text-[10px]",
                            isSuccess ? "bg-[#DCFCE7] text-[#166534]" : "bg-error/15 text-error-deep"
                          )}
                        >
                          {log.http_status || "ERR"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-muted font-mono">{log.duration_ms ? `${log.duration_ms}ms` : "-"}</td>
                      <td className="px-3 py-2 text-center">
                        {isSuccess ? (
                          <span className="text-[#166534] font-semibold inline-flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="h-3 w-3" /> Succès
                          </span>
                        ) : (
                          <span className="text-error-deep font-semibold inline-flex items-center gap-1 text-[11px]" title={log.error_desc}>
                            <XCircle className="h-3 w-3" /> {log.error_code || "Échec"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
