"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  BookOpen,
  Receipt,
  Users,
  Award,
  Eye,
  Crown,
  KeyRound,
  RefreshCw,
  UserCheck,
  UserX,
  ArrowRightLeft,
  Loader2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/user-avatar";

export const ROLE_DEFINITIONS = [
  {
    role: "admin",
    label: "Administrateur",
    desc: "Gestion complète de l'entreprise, des utilisateurs et de tous les modules.",
    icon: Shield,
    badgeCls: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
  {
    role: "accountant",
    label: "Comptable",
    desc: "Saisie d'écritures, grand livre, déclarations TVA, DSF SYSCOHADA, lettrage.",
    icon: BookOpen,
    badgeCls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    role: "cashier",
    label: "Caissier / Facturation",
    desc: "Création de devis & factures, encaissements, normalisation e-MECeF.",
    icon: Receipt,
    badgeCls: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  },
  {
    role: "hr",
    label: "Ressources Humaines",
    desc: "Gestion des employés, contrats et fiches de paie (CNSS / IPTS / VPS).",
    icon: Users,
    badgeCls: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  },
  {
    role: "expert",
    label: "Expert-comptable / Réviseur",
    desc: "Validation des clôtures, révision des comptes et états financiers DSF.",
    icon: Award,
    badgeCls: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  {
    role: "viewer",
    label: "Lecteur (Observateur)",
    desc: "Consultation en lecture seule des rapports, sans droit de modification.",
    icon: Eye,
    badgeCls: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  },
] as const;

export function UserRoleBadge({ role }: { role: string }) {
  if (role === "owner") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 uppercase tracking-wide">
        <Crown className="h-3 w-3" /> Propriétaire
      </span>
    );
  }

  const def = ROLE_DEFINITIONS.find((r) => r.role === role);
  if (!def) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground uppercase">
        {role}
      </span>
    );
  }

  const Icon = def.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        def.badgeCls
      )}
    >
      <Icon className="h-3 w-3" /> {def.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL : INVITER UN UTILISATEUR
// ─────────────────────────────────────────────────────────────────────────────

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("accountant");
  const [isLoading, setIsLoading] = useState(false);

  const generateSecurePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let pass = "";
    // Ensure at least 1 uppercase and 1 number
    pass += "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(Math.random() * 24)];
    pass += "23456789"[Math.floor(Math.random() * 8)];
    for (let i = 0; i < 8; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Collaborateur ${name} invité avec le rôle ${role}`);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setName("");
        setEmail("");
        setPassword("");
        setRole("accountant");
        onClose();
      } else {
        toast.error(data.error || "Erreur lors de l'invitation");
      }
    } catch (err: any) {
      toast.error("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Users className="h-5 w-5 text-primary" /> Inviter un collaborateur
          </DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau membre à votre entreprise et attribuez-lui un rôle spécifique selon ses responsabilités.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inv-name">Nom complet *</Label>
              <Input
                id="inv-name"
                placeholder="Ex: Amina KOUASSI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-email">Email professionnel *</Label>
              <Input
                id="inv-email"
                type="email"
                placeholder="Ex: amina.k@entreprise.bj"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="inv-password">Mot de passe temporaire *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-primary"
                onClick={generateSecurePassword}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Générer mot de passe
              </Button>
            </div>
            <div className="relative">
              <Input
                id="inv-password"
                type="text"
                placeholder="8 caractères min, 1 majuscule, 1 chiffre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-mono text-sm"
              />
              <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Le collaborateur utilisera cet email et ce mot de passe pour se connecter sur Studio.
            </p>
          </div>

          <div className="space-y-2.5">
            <Label className="text-sm font-semibold">Sélectionnez le type d'accès (Rôle)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLE_DEFINITIONS.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.role;
                return (
                  <div
                    key={r.role}
                    onClick={() => setRole(r.role)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all text-left",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg shrink-0 mt-0.5",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-semibold text-xs text-foreground">{r.label}</p>
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-tight">
                        {r.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90 shadow-glow" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
              Envoyer l'invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL : GÉRER UN COLLABORATEUR EXISTANT
// ─────────────────────────────────────────────────────────────────────────────

interface ManageUserModalProps {
  user: any | null;
  currentUserRole?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ManageUserModal({ user, currentUserRole, isOpen, onClose }: ManageUserModalProps) {
  const queryClient = useQueryClient();
  const [role, setRole] = useState(user?.role || "viewer");
  const [isActive, setIsActive] = useState(user?.is_active ?? true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showTransferConfirm, setShowTransferConfirm] = useState(false);

  React.useEffect(() => {
    if (user) {
      setRole(user.role);
      setIsActive(user.is_active ?? true);
    }
  }, [user]);

  if (!user) return null;

  const isTargetOwner = user.role === "owner";
  const canTransferOwnership = currentUserRole === "owner" && !isTargetOwner;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role, is_active: isActive }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Collaborateur mis à jour");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        onClose();
      } else {
        toast.error(data.error || "Erreur lors de la mise à jour");
      }
    } catch (e) {
      toast.error("Erreur réseau");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      const endpoint = `/api/users/${user.id}`;
      const method = isActive ? "DELETE" : "PUT";
      const body = isActive ? undefined : JSON.stringify({ is_active: true });

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(isActive ? "Compte suspendu" : "Compte réactivé");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        onClose();
      } else {
        toast.error(data.error || "Action impossible");
      }
    } catch (e) {
      toast.error("Erreur réseau");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTransferOwnership = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/company/transfer-ownership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ target_user_id: user.id }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Propriété transférée avec succès à ${user.name}`);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["company"] });
        setShowTransferConfirm(false);
        onClose();
      } else {
        toast.error(data.error || "Échec du transfert");
      }
    } catch (e) {
      toast.error("Erreur réseau");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Gérer le collaborateur</DialogTitle>
          <DialogDescription>
            Modifier les permissions ou l'état du compte de {user.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* User info header */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            <UserAvatar
              name={user.name}
              email={user.email}
              avatarUrl={user.avatar_url}
              size={48}
              variant="beam"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <div className="mt-1">
                <UserRoleBadge role={user.role} />
              </div>
            </div>
          </div>

          {/* Role selector */}
          {!isTargetOwner ? (
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Changer le rôle</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-primary"
              >
                {ROLE_DEFINITIONS.map((r) => (
                  <option key={r.role} value={r.role}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700">
              Ce compte est le <strong>Propriétaire de l'entreprise</strong>. Son rôle est protégé.
            </div>
          )}

          {/* Actions */}
          {!isTargetOwner && (
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">État du compte</p>
                  <p className="text-[11px] text-muted-foreground">
                    {isActive ? "Actif (accès autorisé)" : "Suspendu (accès bloqué)"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant={isActive ? "outline" : "default"}
                  size="sm"
                  className={cn("h-8 text-xs", isActive && "text-destructive hover:bg-destructive/10")}
                  onClick={handleToggleStatus}
                  disabled={isUpdating}
                >
                  {isActive ? (
                    <>
                      <UserX className="h-3.5 w-3.5 mr-1" /> Suspendre
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-3.5 w-3.5 mr-1" /> Réactiver
                    </>
                  )}
                </Button>
              </div>

              {/* Ownership transfer option */}
              {canTransferOwnership && (
                <div className="pt-3 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                    onClick={() => setShowTransferConfirm(true)}
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5 mr-1.5" /> Transférer la propriété de l'entreprise
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Transfer Ownership Confirmation Dialog */}
          {showTransferConfirm && (
            <div className="p-3.5 rounded-xl bg-destructive-soft/40 border border-destructive/30 text-xs space-y-3">
              <p className="font-bold text-destructive">⚠️ Confirmer le transfert de propriété</p>
              <p className="text-muted-foreground text-[11px]">
                Vous allez céder la propriété de l'entreprise à <strong>{user.name}</strong>. Vous deviendrez
                administrateur et ne pourrez plus annuler cette action sans son accord.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => setShowTransferConfirm(false)}
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleTransferOwnership}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirmer le transfert"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border pt-4">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isUpdating}>
            Fermer
          </Button>
          {!isTargetOwner && (
            <Button
              size="sm"
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Enregistrer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
