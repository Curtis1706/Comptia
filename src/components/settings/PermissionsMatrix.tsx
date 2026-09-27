"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Shield,
  ShieldAlert,
  RotateCcw,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  History,
  Sliders,
} from "lucide-react";
import {
  Module,
  Permission,
  UserRole,
  MODULES,
  MODULE_LABELS,
  ROLE_LABELS,
  PERMISSION_LEVEL_LABELS,
  DEFAULT_PERMISSIONS,
  meetsLevel,
} from "@/lib/permissions";
import { checkInvariants } from "@/lib/permission-invariants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const MODULE_FAMILIES = [
  {
    name: "Comptabilité SYSCOHADA",
    modules: [
      "accounting_entries",
      "accounting_journals",
      "chart_of_accounts",
      "third_parties",
      "bank_reconciliation",
    ] as Module[],
  },
  {
    name: "Facturation & Ventes",
    modules: ["invoices", "quotes", "credit_notes"] as Module[],
  },
  {
    name: "Fiscalité & Déclarations",
    modules: ["vat_declarations"] as Module[],
  },
  {
    name: "Ressources Humaines & Paie",
    modules: ["payroll", "employees"] as Module[],
  },
  {
    name: "Pilotage, États & Documents",
    modules: ["dashboard", "reporting", "dsf", "documents", "notifications"] as Module[],
  },
  {
    name: "Administration & Paramètres",
    modules: [
      "company_settings",
      "mecef_settings",
      "user_management",
      "subscription_billing",
      "cabinet_management",
      "audit_log",
    ] as Module[],
  },
];

const ALL_ROLES: UserRole[] = [
  "owner",
  "admin",
  "accountant",
  "cashier",
  "hr",
  "expert",
  "viewer",
];

const PERMISSION_OPTIONS: Permission[] = [
  "none",
  "read",
  "write",
  "validate",
  "full",
];

export function PermissionsMatrix() {
  const queryClient = useQueryClient();
  const [previewRole, setPreviewRole] = useState<UserRole>("accountant");

  // 1. Fetch permissions matrix
  const { data, isLoading, isError } = useQuery({
    queryKey: ["permissions-admin"],
    queryFn: async () => {
      const res = await fetch("/api/permissions", { credentials: "include" });
      if (!res.ok) throw new Error("Erreur de chargement des permissions");
      const json = await res.json();
      return json.data || json;
    },
  });

  // 2. Fetch audit history for permission changes
  const { data: auditData } = useQuery({
    queryKey: ["audit-permission-changes"],
    queryFn: async () => {
      const res = await fetch("/api/audit?limit=20", { credentials: "include" });
      if (!res.ok) return [];
      const json = await res.json();
      const items = json.data?.items || json.data || [];
      return items.filter(
        (i: any) =>
          i.entity === "RolePermissionOverride" ||
          i.resource === "RolePermissionOverride" ||
          i.details?.description?.includes("modifié") ||
          i.details?.description?.includes("réinitialisé")
      );
    },
  });

  // 3. Mutation to update a permission
  const updateMutation = useMutation({
    mutationFn: async (payload: {
      role: UserRole;
      module: Module;
      permission: Permission;
    }) => {
      const res = await fetch("/api/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Erreur de mise à jour");
      }
      return json;
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Permission mise à jour : ${ROLE_LABELS[variables.role]} → ${
          MODULE_LABELS[variables.module]
        } (${PERMISSION_LEVEL_LABELS[variables.permission]})`
      );
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permissions-admin"] });
      queryClient.invalidateQueries({ queryKey: ["audit-permission-changes"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Impossible de modifier la permission");
    },
  });

  // 4. Mutation to reset permissions
  const resetMutation = useMutation({
    mutationFn: async (role?: UserRole) => {
      const res = await fetch("/api/permissions/reset", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Erreur de réinitialisation");
      }
      return json;
    },
    onSuccess: (_, role) => {
      toast.success(
        role
          ? `Permissions réinitialisées pour ${ROLE_LABELS[role]}`
          : "Toutes les permissions ont été réinitialisées aux valeurs par défaut"
      );
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permissions-admin"] });
      queryClient.invalidateQueries({ queryKey: ["audit-permission-changes"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Échec de la réinitialisation");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">
          Chargement de la matrice de permissions...
        </span>
      </div>
    );
  }

  if (isError || !data?.matrix) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
        <p className="mt-2 font-medium text-destructive">
          Impossible de charger la matrice de permissions.
        </p>
      </div>
    );
  }

  const matrix = data.matrix;
  const defaults = data.defaults || DEFAULT_PERMISSIONS;
  const userRole: UserRole = data.userRole || "owner";

  const handleCellChange = (
    role: UserRole,
    mod: Module,
    newPerm: Permission
  ) => {
    // Check invariants locally first to give instant feedback
    const violation = checkInvariants(role, mod, newPerm, {
      role: userRole,
      effective: matrix[userRole] || defaults[userRole],
    });

    if (violation) {
      toast.error(violation.message);
      return;
    }

    updateMutation.mutate({ role, module: mod, permission: newPerm });
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-600">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Matrice de Contrôle d'Accès par Rôle (RBAC)
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ces réglages s'appliquent immédiatement à tous les utilisateurs de
              votre entreprise. Certaines combinaisons sont verrouillées par des
              invariants stricts pour empêcher toute élévation de privilèges.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Permissions Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              Matrice Effective des Rôles & Modules
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              22 modules métier × 7 profils utilisateurs
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                disabled={resetMutation.isPending}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Tout réinitialiser par défaut
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Réinitialiser toutes les permissions ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera toutes les personnalisations de rôles
                  et restaurera la matrice standard de référence de Comptia.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => resetMutation.mutate(undefined)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirmer la réinitialisation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4 min-w-[220px]">Module / Fonctionnalité</th>
                {ALL_ROLES.map((role) => (
                  <th key={role} className="py-3.5 px-3 min-w-[150px] text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-foreground">
                        {ROLE_LABELS[role]}
                      </span>
                      {role === "owner" ? (
                        <span className="text-[10px] lowercase text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          Non modifiable
                        </span>
                      ) : (
                        <button
                          onClick={() => resetMutation.mutate(role)}
                          className="text-[10px] text-primary hover:underline inline-flex items-center gap-0.5"
                          title="Restaurer les défauts pour ce rôle"
                        >
                          <RotateCcw className="h-2.5 w-2.5" />
                          RàZ
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {MODULE_FAMILIES.map((family) => (
                <React.Fragment key={family.name}>
                  {/* Family Header */}
                  <tr className="bg-muted/40 font-semibold text-xs text-foreground/80">
                    <td colSpan={ALL_ROLES.length + 1} className="py-2.5 px-4 bg-muted/60">
                      {family.name}
                    </td>
                  </tr>

                  {/* Modules Rows */}
                  {family.modules.map((mod) => (
                    <tr
                      key={mod}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <span>{MODULE_LABELS[mod]}</span>
                        </div>
                      </td>

                      {ALL_ROLES.map((role) => {
                        const currentPerm = matrix[role]?.[mod] || "none";
                        const defaultPerm = defaults[role]?.[mod] || "none";
                        const isModified = currentPerm !== defaultPerm;

                        // Check if locked by invariant for current user
                        const isOwnerCol = role === "owner";
                        const isLockedByInvariant =
                          isOwnerCol ||
                          (mod === "subscription_billing" && role !== "owner") ||
                          (mod === "user_management" && !["owner", "admin"].includes(role)) ||
                          (mod === "cabinet_management" && role !== "expert");

                        let lockReason = "";
                        if (isOwnerCol) {
                          lockReason = "La matrice du propriétaire n'est pas modifiable.";
                        } else if (mod === "subscription_billing") {
                          lockReason = "L'abonnement reste réservé exclusivement au propriétaire.";
                        } else if (mod === "user_management") {
                          lockReason = "La gestion des utilisateurs est réservée à owner et admin.";
                        } else if (mod === "cabinet_management") {
                          lockReason = "L'espace cabinet est réservé aux experts-comptables.";
                        }

                        return (
                          <td
                            key={role}
                            className={cn(
                              "py-2.5 px-2 text-center transition-colors",
                              isModified && "bg-amber-500/10"
                            )}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              {isLockedByInvariant ? (
                                <div
                                  className="flex items-center gap-1 text-xs text-muted-foreground/80 bg-muted/50 px-2.5 py-1 rounded border border-border cursor-not-allowed"
                                  title={lockReason}
                                >
                                  <Lock className="h-3 w-3 text-muted-foreground" />
                                  <span>{PERMISSION_LEVEL_LABELS[currentPerm]}</span>
                                </div>
                              ) : (
                                <Select
                                  value={currentPerm}
                                  onValueChange={(val) =>
                                    handleCellChange(role, mod, val as Permission)
                                  }
                                  disabled={updateMutation.isPending}
                                >
                                  <SelectTrigger
                                    className={cn(
                                      "h-8 text-xs font-medium w-[120px]",
                                      isModified
                                        ? "border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-semibold"
                                        : currentPerm === "none"
                                        ? "text-muted-foreground opacity-60"
                                        : "text-foreground"
                                    )}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PERMISSION_OPTIONS.map((opt) => (
                                      <SelectItem
                                        key={opt}
                                        value={opt}
                                        className="text-xs"
                                      >
                                        {PERMISSION_LEVEL_LABELS[opt]}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}

                              {isModified && !isLockedByInvariant && (
                                <span
                                  className="h-2 w-2 rounded-full bg-amber-500"
                                  title="Modifié par rapport à la valeur par défaut"
                                />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Role Preview Simulator */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                Simulateur de Visibilité par Rôle
              </h4>
              <p className="text-xs text-muted-foreground">
                Visualisez exactement ce qu'un utilisateur avec ce rôle peut voir et exécuter.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              Prévisualiser en tant que :
            </span>
            <Select
              value={previewRole}
              onValueChange={(val) => setPreviewRole(val as UserRole)}
            >
              <SelectTrigger className="w-[180px] h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs">
                    {ROLE_LABELS[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {MODULES.map((mod) => {
            const level = matrix[previewRole]?.[mod] || "none";
            const hasAcc = level !== "none";

            return (
              <div
                key={mod}
                className={cn(
                  "rounded-lg border p-3 flex flex-col justify-between transition",
                  hasAcc
                    ? "border-border bg-background shadow-sm"
                    : "border-border/40 bg-muted/20 opacity-40"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-foreground truncate">
                    {MODULE_LABELS[mod]}
                  </span>
                  <Badge
                    variant={
                      level === "full"
                        ? "default"
                        : level === "none"
                        ? "outline"
                        : "secondary"
                    }
                    className="text-[10px] px-1.5 py-0"
                  >
                    {PERMISSION_LEVEL_LABELS[level]}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Audit Trail for Permissions */}
      {auditData && auditData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <History className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-semibold text-foreground">
              Historique des Modifications de Permissions
            </h4>
          </div>

          <div className="divide-y divide-border">
            {auditData.slice(0, 15).map((log: any) => (
              <div
                key={log.id}
                className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {log.details?.description ||
                      `${log.user?.name || "Un utilisateur"} a modifié ${log.entity_id}`}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {new Date(log.created_at).toLocaleString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
