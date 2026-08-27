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
      const resp = await fetch("/api/mecef/test-connection", { method: "POST" });
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
          className="bg-gradient-primary hover:opacity-90 shadow-glow"
        >
          {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Tester la connexion DGI
        </Button>
      </div>

      {/* Cartes d'état */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mode */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5" /> Environnement
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                diag?.mode === "production"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              )}
            >
              {diag?.mode === "production" ? "Production DGI" : "Sandbox (Test)"}
            </span>
          </div>
          <p className="font-mono text-sm font-bold text-foreground truncate">{diag?.baseUrl}</p>
          <p className="text-[11px] text-muted-foreground">
            IFU : <strong>{diag?.ifu}</strong> · NIM : <strong>{diag?.nim}</strong>
          </p>
        </div>

        {/* Jeton d'accès */}
        <div
          className={cn(
            "rounded-xl border p-4 shadow-sm space-y-1.5",
            isExpiringSoon
              ? "bg-amber-500/5 border-amber-500/30"
              : "bg-card border-border"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5" /> Jeton Taxpayer
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                diag?.token?.isValid
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-destructive-soft text-destructive"
              )}
            >
              {diag?.token?.isValid ? "Valide" : "Expiré / Absent"}
            </span>
          </div>
          <p className="font-bold text-sm text-foreground">
            {diag?.token?.expDate
              ? new Date(diag.token.expDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Non disponible"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {daysRemaining !== null
              ? `Expire dans ${daysRemaining} jour(s)`
              : "Aucune date d'expiration"}
          </p>
        </div>

        {/* Serveur de vérification */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Vérification publique
            </span>
            <span className="rounded-full bg-primary-soft text-primary px-2 py-0.5 text-[10px] font-bold uppercase">
              Actif
            </span>
          </div>
          <p className="font-mono text-xs text-foreground truncate">{diag?.verificationUrl}</p>
          <p className="text-[11px] text-muted-foreground">
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

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground uppercase font-medium">
                <th className="px-3 py-2.5">Date & Heure</th>
                <th className="px-3 py-2.5">Méthode</th>
                <th className="px-3 py-2.5">Endpoint</th>
                <th className="px-3 py-2.5">Code HTTP</th>
                <th className="px-3 py-2.5">Durée</th>
                <th className="px-3 py-2.5">Statut</th>
              </tr>
            </thead>
            <tbody>
              {diag?.logs?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    Aucun échange enregistré pour le moment.
                  </td>
                </tr>
              ) : (
                diag?.logs?.map((log: any) => {
                  const isSuccess = log.http_status === 200 || log.http_status === 201;
                  return (
                    <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString("fr-FR")}
                      </td>
                      <td className="px-3 py-2">
                        <span className="font-mono font-bold">{log.method}</span>
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-foreground">{log.endpoint}</td>
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded font-mono font-bold text-[10px]",
                            isSuccess ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive-soft text-destructive"
                          )}
                        >
                          {log.http_status || "ERR"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{log.duration_ms ? `${log.duration_ms}ms` : "-"}</td>
                      <td className="px-3 py-2">
                        {isSuccess ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Succès
                          </span>
                        ) : (
                          <span className="text-destructive font-semibold flex items-center gap-1" title={log.error_desc}>
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
