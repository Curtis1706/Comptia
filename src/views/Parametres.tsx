"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Building2,
  BookOpen,
  Users,
  Plug,
  Shield,
  CreditCard,
  Loader2,
  Save,
  Mail,
  Phone,
  MapPin,
  Building,
  ShieldCheck,
  Sliders,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDateLong } from "@/lib/format";

import { MecefDiagnostic } from "@/components/settings/MecefDiagnostic";
import { PermissionsMatrix } from "@/components/settings/PermissionsMatrix";
import { usePermissions } from "@/hooks/usePermissions";
import { Module, Permission } from "@/lib/permissions";
import { InviteUserModal, ManageUserModal, UserRoleBadge } from "@/components/settings/UserModals";
import { signOut } from "next-auth/react";

interface SettingSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  module: Module;
  level: Permission;
}

const allSections: SettingSection[] = [
  { id: "entreprise", label: "Entreprise", icon: Building2, module: "company_settings", level: "read" },
  { id: "plan", label: "Plan comptable", icon: BookOpen, module: "chart_of_accounts", level: "read" },
  { id: "users", label: "Utilisateurs & Rôles", icon: Users, module: "user_management", level: "read" },
  { id: "permissions", label: "Rôles et permissions", icon: Sliders, module: "user_management", level: "write" },
  { id: "mecef", label: "Certification e-MECeF", icon: ShieldCheck, module: "mecef_settings", level: "read" },
  { id: "integrations", label: "Intégrations", icon: Plug, module: "company_settings", level: "read" },
  { id: "security", label: "Sécurité & Audit", icon: Shield, module: "audit_log", level: "read" },
  { id: "billing", label: "Facturation Studio", icon: CreditCard, module: "subscription_billing", level: "read" },
];

export const Parametres = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedSec = searchParams.get("tab") || "entreprise";

  const { canRead, canWrite, isLoading } = usePermissions();

  const { data: currentUser } = useQuery<any>({
    queryKey: ["auth-me"],
    queryFn: () => fetcher("/api/auth/me"),
  });

  const accessibleSections = allSections.filter((s) => {
    return s.level === "write" ? canWrite(s.module) : canRead(s.module);
  });

  const sec = accessibleSections.some((s) => s.id === requestedSec)
    ? requestedSec
    : accessibleSections[0]?.id || "entreprise";

  const setSec = (s: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (s === "entreprise") params.delete("tab");
    else params.set("tab", s);
    router.push(`${pathname}?${params.toString()}`);
  };

  const userInitials =
    currentUser?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";

  return (
    <div className="space-y-6">
      <PageHeader title="Configuration" subtitle="Personnalisez votre espace Comptia" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
        <div className="space-y-4">
          <nav className="space-y-1 rounded-xl border border-border bg-card p-2 shadow-card h-fit">
            {accessibleSections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSec(s.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                  sec === s.id
                    ? "bg-primary text-primary-foreground shadow-glow font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </button>
            ))}
          </nav>

          {/* User session & quick logout card */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-card space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Session active</p>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-xs font-bold text-white shadow-sm overflow-hidden">
                {currentUser?.avatar_url ? (
                  <img src={currentUser.avatar_url} alt={currentUser?.name} className="h-full w-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate leading-tight">{currentUser?.name || "Utilisateur"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{currentUser?.email}</p>
              </div>
            </div>
            <div className="pt-0.5">
              <UserRoleBadge role={currentUser?.role || "viewer"} />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Se déconnecter
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card min-h-[500px]">
          {sec === "entreprise" && <EntrepriseForm />}
          {sec === "plan" && <PlanComptable />}
          {sec === "users" && <UsersTable />}
          {sec === "permissions" && <PermissionsMatrix />}
          {sec === "mecef" && <MecefDiagnostic />}
          {sec === "integrations" && <Integrations />}
          {sec === "security" && <Audit />}
          {sec === "billing" && <Billing />}
        </div>
      </div>
    </div>
  );
};

const EntrepriseForm = () => {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: res,
    isLoading,
    error,
  } = useQuery<any>({
    queryKey: ["company"],
    queryFn: () => fetcher("/api/company"),
  });

  const company = res;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Paramètres enregistrés");
        queryClient.invalidateQueries({ queryKey: ["company"] });
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  if (error || !company) return <div className="text-destructive text-center p-8">Erreur lors du chargement des données.</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="font-display text-lg font-semibold">Informations entreprise</h2>
      <p className="mt-1 text-sm text-muted-foreground">Ces informations apparaissent sur vos documents comptables.</p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-primary font-display text-2xl font-bold text-primary-foreground shadow-card">
            {company.logo_url ? <img src={company.logo_url} alt="Logo" className="rounded-xl" /> : company.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <Button variant="outline" size="sm" type="button">Changer le logo</Button>
            <p className="text-[10px] text-muted-foreground">PNG, JPG ou SVG · Max 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Raison sociale</Label>
            <Input name="name" defaultValue={company.name} />
          </div>
          <div className="space-y-2">
            <Label>IFU / SIRET</Label>
            <Input defaultValue={company.ifu} disabled className="bg-muted font-mono" />
            <p className="text-[10px] text-muted-foreground italic">Identifiant fiscal non modifiable</p>
          </div>
          <div className="space-y-2">
            <Label>Email pro</Label>
            <Input name="email" defaultValue={company.email} type="email" />
          </div>
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input name="phone" defaultValue={company.phone} />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Adresse siège</Label>
            <Input name="address" defaultValue={company.address} />
          </div>
          <div className="space-y-2">
            <Label>Ville</Label>
            <Input name="city" defaultValue={company.city} />
          </div>
          <div className="space-y-2">
            <Label>Secteur d'activité</Label>
            <Input name="sector" defaultValue={company.sector} />
          </div>
        </div>

        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 space-y-4">
          <div className="flex items-center gap-2 text-warning">
            <Building className="h-4 w-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Trésorerie & Soldes</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Solde de trésorerie initial (FCFA)</Label>
              <Input 
                name="initial_treasury_balance" 
                type="number" 
                step="0.01" 
                defaultValue={company.initial_treasury_balance} 
                placeholder="0.00"
              />
              <p className="text-[10px] text-muted-foreground italic">
                Ce montant sera ajouté au solde calculé de vos comptes de classe 5.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-6">
          <Button variant="outline" type="button">Annuler</Button>
          <Button className="bg-gradient-primary hover:opacity-90 shadow-glow" type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
};

const PlanComptable = () => {
  const { data: res, isLoading } = useQuery<any>({
    queryKey: ["accounts"],
    queryFn: () => fetcher("/api/accounts?limit=20"),
  });
  const accounts = res || [];

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="font-display text-lg font-semibold">Plan comptable SYSCOHADA</h2>
      <p className="mt-1 text-sm text-muted-foreground">Configuration de vos comptes de classe 1 à 8.</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Libellé</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={4} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                </tr>
              ))
            ) : (
              accounts.map((r: any) => (
                <tr key={r.code} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{r.code}</td>
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{r.type}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      r.is_active ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"
                    )}>
                      {r.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UsersTable = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const { data: currentUser } = useQuery<any>({
    queryKey: ["auth-me"],
    queryFn: () => fetcher("/api/auth/me"),
  });

  const { data: res, isLoading } = useQuery<any>({
    queryKey: ["users"],
    queryFn: () => fetcher("/api/users"),
  });
  const users = res || [];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Équipe & Accès</h2>
          <p className="mt-1 text-sm text-muted-foreground">Gérez les collaborateurs et leurs permissions.</p>
        </div>
        <Button
          onClick={() => setIsInviteOpen(true)}
          className="bg-gradient-primary hover:opacity-90 shadow-glow"
        >
          <Users className="h-4 w-4 mr-2" /> Inviter un utilisateur
        </Button>
      </div>
      <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card shadow-card overflow-hidden">
        {isLoading ? (
          [...Array(3)].map((_, i) => <li key={i} className="p-4"><Skeleton className="h-10 w-full" /></li>)
        ) : (
          users.map((u: any) => (
            <li key={u.id} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-card">
                {u.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate text-sm">{u.name}</p>
                  {!u.is_active && (
                    <span className="text-[10px] bg-destructive-soft text-destructive px-1.5 py-0.5 rounded font-semibold">
                      Suspendu
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <UserRoleBadge role={u.role} />
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)}>
                  Gérer
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>

      <InviteUserModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      <ManageUserModal
        user={selectedUser}
        currentUserRole={currentUser?.role}
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

const Integrations = () => {
  const items = [
    { name: "Connexion bancaire", desc: "Synchronisez vos comptes via DSP2", connected: true },
    { name: "Shopify / WooCommerce", desc: "Importez vos ventes e-commerce", connected: false },
    { name: "Stripe / PayPal", desc: "Encaissez vos factures en ligne", connected: true },
    { name: "OCR Avancé", desc: "Extraction par IA générative", connected: true },
  ];
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="font-display text-lg font-semibold">Intégrations & API</h2>
      <p className="mt-1 text-sm text-muted-foreground">Connectez Studio à vos outils favoris.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((i) => (
          <div key={i.name} className="flex flex-col justify-between rounded-xl border border-border bg-gradient-subtle p-5 transition hover:shadow-card">
            <div className="mb-4">
              <p className="font-bold text-sm">{i.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{i.desc}</p>
            </div>
            {i.connected ? (
              <span className="inline-flex w-fit rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold text-success uppercase">Connecté</span>
            ) : (
              <Button size="sm" variant="outline" className="w-fit">Connecter</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Audit = () => {
  const { data: res, isLoading } = useQuery<any>({
    queryKey: ["audit-logs"],
    queryFn: () => fetcher("/api/audit/logs?limit=20"),
  });
  const logs = res || [];

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="font-display text-lg font-semibold text-destructive flex items-center gap-2">
        <ShieldCheck className="h-5 w-5" /> Sécurité & Piste d'audit
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Activités immuables enregistrées sur votre instance.</p>
      <div className="mt-6 rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
           <thead className="bg-muted/40 border-b border-border">
              <tr className="text-left text-xs uppercase text-muted-foreground font-semibold">
                <th className="px-4 py-3">Acteur</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Cible</th>
                <th className="px-4 py-3">Horodatage</th>
              </tr>
           </thead>
           <tbody>
             {isLoading ? (
                [...Array(5)].map((_, i) => <tr key={i} className="border-b border-border"><td colSpan={4} className="px-4 py-4"><Skeleton className="h-4 w-full" /></td></tr>)
             ) : logs.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Aucun log disponible</td></tr>
             ) : (
                logs.map((l: any) => (
                  <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition">
                    <td className="px-4 py-3 font-medium text-xs">{l.user.name}</td>
                    <td className="px-4 py-3">
                       <span className={cn(
                         "inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                         l.action === "CREATE" ? "bg-success-soft text-success" :
                         l.action === "DELETE" ? "bg-destructive-soft text-destructive" :
                         "bg-info-soft text-info"
                       )}>
                         {l.action}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {l.resource} #{l.resource_id.slice(-4)}
                    </td>
                    <td className="px-4 py-3 text-[10px] text-muted-foreground">
                      {formatDateLong(l.created_at)}
                    </td>
                  </tr>
                ))
             )}
           </tbody>
        </table>
      </div>
    </div>
  );
};

const Billing = () => (
  <div className="animate-in fade-in duration-500">
    <h2 className="font-display text-lg font-semibold">Abonnement & Facturation</h2>
    <div className="mt-6 rounded-2xl bg-gradient-primary p-8 text-primary-foreground shadow-glow relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-widest opacity-70 font-bold">Plan actuel</p>
        <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">Studio Enterprise</p>
        <p className="mt-4 text-sm font-medium opacity-90 leading-relaxed max-w-sm">
          Abonnement annuel premium · Inclus support prioritaire 24/7 et exportations illimitées.
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="secondary" size="sm" className="font-bold shadow-card">Gérer mon abonnement</Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 font-bold">Historique factures</Button>
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
    </div>
  </div>
);

export default Parametres;