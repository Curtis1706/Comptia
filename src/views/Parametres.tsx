"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Building2,
  BookOpen,
  Users,
  Sliders,
  ShieldCheck,
  Plug,
  Shield,
  CreditCard,
  Crown,
  LogOut,
  Download,
  Plus,
  Save,
  Lock,
  Wallet,
  CheckCircle2,
  ShoppingCart,
  ScanLine,
  Loader2,
  Inbox,
  Eye,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDateLong } from "@/lib/format";
import { signOut } from "next-auth/react";

import { MecefDiagnostic } from "@/components/settings/MecefDiagnostic";
import { PermissionsMatrix } from "@/components/settings/PermissionsMatrix";
import { usePermissions } from "@/hooks/usePermissions";
import type { Module, Permission } from "@/lib/permissions";
import { InviteUserModal, ManageUserModal, UserRoleBadge } from "@/components/settings/UserModals";
import { UserAvatar } from "@/components/ui/user-avatar";

function getInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
}

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

  const { canRead, canWrite } = usePermissions();

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

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    if (typeof window !== "undefined") {
      window.location.href = `${window.location.origin}/login`;
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col gap-1 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-ink tracking-tight font-sans">Configuration</h1>
            <p className="text-sm text-muted">Personnalisez votre espace Comptia</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background-secondary border border-border rounded text-xs text-muted font-medium">
              <span className="w-2 h-2 rounded-full bg-[#166534]"></span>
              SYSCOHADA Révisé 2026
            </span>
          </div>
        </div>
      </div>

      {/* Grille 2 Colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Gauche : Navigation (lg:col-span-3) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Menu des 8 onglets : horizontal défilant sur mobile, vertical sur desktop */}
          <nav
            className="bg-background border border-border rounded p-1.5 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible scrollbar-none shadow-xs"
            id="config-tabs-nav"
          >
            {accessibleSections.map((s) => {
              const isActive = sec === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSec(s.id)}
                  type="button"
                  className={cn(
                    "shrink-0 lg:shrink flex items-center gap-2.5 px-3 py-2.5 rounded text-xs transition-colors text-left cursor-pointer whitespace-nowrap",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                    isActive
                      ? "bg-primary text-ink font-bold shadow-xs"
                      : "text-muted hover:bg-background-secondary hover:text-ink font-medium"
                  )}
                >
                  <s.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-ink" : "text-muted")} />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Carte Session Active */}
          <div className="bg-background border border-border rounded p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted tracking-wider uppercase font-semibold">Session active</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-background-secondary text-ink text-[11px] font-semibold border border-border">
                <Crown className="w-3 h-3 text-ink" />
                {currentUser?.role ? currentUser.role.toUpperCase() : "PROPRIÉTAIRE"}
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <UserAvatar
                name={currentUser?.name}
                email={currentUser?.email}
                avatarUrl={currentUser?.avatar_url}
                size={40}
                square={false}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-ink truncate">{currentUser?.name || "Harry ALOHOUTADÉ"}</span>
                <span className="text-[11px] text-muted truncate">{currentUser?.email || "harry@bds.bj"}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 h-9 px-3 bg-background border border-error text-error-deep hover:bg-error/10 rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Contenu Principal des Onglets (lg:col-span-9) */}
        <div className="lg:col-span-9 bg-background border border-border rounded shadow-xs overflow-hidden">
          {sec === "entreprise" && <EntrepriseForm />}
          {sec === "plan" && <PlanComptable />}
          {sec === "users" && <UsersTable />}
          {sec === "permissions" && (
            <div className="p-6">
              <PermissionsMatrix />
            </div>
          )}
          {sec === "mecef" && (
            <div className="p-6">
              <MecefDiagnostic />
            </div>
          )}
          {sec === "integrations" && <Integrations />}
          {sec === "security" && <Audit />}
          {sec === "billing" && <Billing />}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ONGLET 1 : ENTREPRISE
// =============================================================================
const EntrepriseForm = () => {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    data: res,
    isLoading,
    error,
  } = useQuery<any>({
    queryKey: ["company"],
    queryFn: () => fetcher("/api/company"),
  });

  const company = res || {};

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Le fichier dépasse 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const response = await fetch("/api/company", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ logo_url: base64 }),
        });
        const result = await response.json();
        if (result.success) {
          toast.success("Logo mis à jour");
          queryClient.invalidateQueries({ queryKey: ["company"] });
        } else {
          toast.error(result.error || "Erreur de mise à jour");
        }
      } catch {
        toast.error("Erreur réseau");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = async () => {
    try {
      const response = await fetch("/api/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ logo_url: null }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Logo supprimé");
        queryClient.invalidateQueries({ queryKey: ["company"] });
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Erreur réseau");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const resp = await fetch("/api/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await resp.json();
      if (result.success) {
        toast.success("Paramètres enregistrés avec succès");
        setIsDirty(false);
        queryClient.invalidateQueries({ queryKey: ["company"] });
      } else {
        toast.error(result.error || "Erreur d'enregistrement");
      }
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !company) {
    return <div className="text-error-deep text-center p-8">Erreur lors du chargement des données.</div>;
  }

  const initialLogo = company.name ? company.name.slice(0, 2).toUpperCase() : "BÉ";

  return (
    <div className="flex flex-col p-6 gap-6">
      <div>
        <h2 className="text-base font-semibold text-ink">Informations entreprise</h2>
        <p className="text-xs text-muted mt-0.5">Ces informations apparaissent sur vos documents comptables.</p>
      </div>

      {/* Bloc Logo */}
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <div className="w-14 h-14 bg-background-secondary border border-border rounded flex items-center justify-center text-base font-bold text-ink shrink-0 overflow-hidden">
          {company.logo_url ? (
            <img src={company.logo_url} alt="Logo entreprise" className="w-full h-full object-cover" />
          ) : (
            initialLogo
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 px-3 bg-background border border-border text-ink hover:bg-background-secondary rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Changer le logo
            </button>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="h-8 px-2.5 text-muted hover:text-error-deep rounded text-xs transition-colors cursor-pointer"
            >
              Supprimer
            </button>
          </div>
          <span className="text-[13px] text-[#4D4634] not-italic">PNG, JPG ou SVG · Max 2MB</span>
        </div>
      </div>

      {/* Formulaire Entreprise */}
      <form
        ref={formRef}
        onInput={() => setIsDirty(true)}
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-ink font-semibold">Raison sociale *</label>
            <input
              name="name"
              defaultValue={company.name || "BÉNIN DIGITAL SERVICES SARL"}
              onChange={() => setIsDirty(true)}
              className="h-[44px] px-3 bg-background border border-[#D8D5D0] rounded text-xs text-ink focus:outline-none focus:border-2 focus:border-ink focus:ring-0 transition-colors"
              type="text"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-ink font-semibold">IFU / N° Fiscal Bénin</label>
            <div className="relative">
              <input
                className="w-full h-[44px] pl-3 pr-9 bg-background-secondary border border-[#D8D5D0] rounded font-mono text-xs text-ink cursor-not-allowed select-all"
                readOnly
                type="text"
                value={company.ifu || "3202687290155"}
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
            </div>
            <span className="text-[13px] text-[#4D4634] not-italic">Identifiant fiscal non modifiable</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-ink font-semibold">Email professionnel</label>
            <input
              name="email"
              defaultValue={company.email || "harry@bds.bj"}
              onChange={() => setIsDirty(true)}
              className="h-[44px] px-3 bg-background border border-[#D8D5D0] rounded text-xs text-ink focus:outline-none focus:border-2 focus:border-ink focus:ring-0 transition-colors"
              type="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-ink font-semibold">Téléphone</label>
            <input
              name="phone"
              defaultValue={company.phone || "+229 01 64 20 20 20"}
              onChange={() => setIsDirty(true)}
              placeholder="+229 01 XX XX XX XX"
              className="h-[44px] px-3 bg-background border border-[#D8D5D0] rounded text-xs text-ink focus:outline-none focus:border-2 focus:border-ink focus:ring-0 transition-colors"
              type="tel"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs text-ink font-semibold">Adresse siège</label>
            <input
              name="address"
              defaultValue={company.address || "Lot 1245, Quartier Fidjrossè, Cotonou"}
              onChange={() => setIsDirty(true)}
              className="h-[44px] px-3 bg-background border border-[#D8D5D0] rounded text-xs text-ink focus:outline-none focus:border-2 focus:border-ink focus:ring-0 transition-colors"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-ink font-semibold">Ville</label>
            <input
              name="city"
              defaultValue={company.city || "Cotonou"}
              onChange={() => setIsDirty(true)}
              className="h-[44px] px-3 bg-background border border-[#D8D5D0] rounded text-xs text-ink focus:outline-none focus:border-2 focus:border-ink focus:ring-0 transition-colors"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-ink font-semibold">Secteur d'activité</label>
            <select
              name="sector"
              defaultValue={company.sector || "tech"}
              onChange={() => setIsDirty(true)}
              className="h-[44px] px-3 bg-background border border-[#D8D5D0] rounded text-xs text-ink focus:outline-none focus:border-2 focus:border-ink focus:ring-0 transition-colors cursor-pointer"
            >
              <option value="tech">Technologies & Numérique</option>
              <option value="commerce_general">Négoce et commerce général</option>
              <option value="services">Services professionnels & Conseil</option>
              <option value="btp">BTP & Construction</option>
              <option value="restauration">Hôtellerie & Restauration</option>
              <option value="sante">Santé & Pharmacie</option>
              <option value="agriculture">Agriculture & Élevage</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>

        {/* Encart Trésorerie & Soldes */}
        <div className="mt-2 p-4 bg-[#FFF7ED] border border-[#FED7AA] rounded flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#9A3412]">
            <Wallet className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Trésorerie & Soldes</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink font-semibold">Solde de trésorerie initial (FCFA)</label>
              <input
                name="initial_treasury_balance"
                type="number"
                step="0.01"
                defaultValue={company.initial_treasury_balance ?? 0}
                onChange={() => setIsDirty(true)}
                className="h-[44px] px-3 bg-background border border-[#FED7AA] rounded font-mono text-xs text-ink focus:outline-none focus:border-2 focus:border-ink focus:ring-0 tabular-nums"
              />
            </div>
            <p className="text-[13px] text-[#4D4634] not-italic self-end pb-1.5">
              Ce montant sera ajouté au solde calculé de vos comptes de classe 5 (Trésorerie & Banques).
            </p>
          </div>
        </div>

        {/* Pied de formulaire */}
        <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              formRef.current?.reset();
              setIsDirty(false);
            }}
            className="h-10 px-4 bg-background border border-border rounded text-xs text-ink hover:bg-background-secondary transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className={cn(
              "h-10 px-5 rounded text-xs font-semibold flex items-center gap-2 transition-colors",
              isDirty && !isSaving
                ? "bg-primary text-ink hover:bg-[#F0CB3A] cursor-pointer"
                : "bg-[#E5E2DC] text-[#8A857D] border border-[#D8D5D0] cursor-not-allowed"
            )}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// =============================================================================
// ONGLET 2 : PLAN COMPTABLE SYSCOHADA
// =============================================================================
const CLASS_FILTER_OPTIONS = [
  { value: "all", label: "Toutes les classes (1 à 8)" },
  { value: "1", label: "Classe 1 - Capitaux propres & Ressources durables" },
  { value: "2", label: "Classe 2 - Actif immobilisé" },
  { value: "3", label: "Classe 3 - Stocks et en-cours" },
  { value: "4", label: "Classe 4 - Comptes de tiers" },
  { value: "5", label: "Classe 5 - Comptes de trésorerie" },
  { value: "6", label: "Classe 6 - Charges des activités ordinaires" },
  { value: "7", label: "Classe 7 - Produits des activités ordinaires" },
  { value: "8", label: "Classe 8 - Autres charges et produits (HAO)" },
];

const PlanComptable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: res, isLoading } = useQuery<any>({
    queryKey: ["accounts"],
    queryFn: () => fetcher("/api/accounts?limit=500"),
  });

  const apiAccounts = res || [];

  // Plan comptable complet SYSCOHADA révisé (Classes 1 à 8)
  const defaultAccounts = [
    // CLASSE 1 : COMPTES DE RESSOURCES DURABLES
    { code: "10", label: "Capital", type: "Equity", statut: "ACTIF", isClass: true },
    { code: "101", label: "Capital social", type: "Equity", statut: "ACTIF" },
    { code: "102", label: "Capital par dotation", type: "Equity", statut: "ACTIF" },
    { code: "103", label: "Capital personnel", type: "Equity", statut: "ACTIF" },
    { code: "104", label: "Compte de l'exploitant", type: "Equity", statut: "ACTIF" },
    { code: "11", label: "Réserves", type: "Equity", statut: "ACTIF", isClass: true },
    { code: "111", label: "Réserve légale", type: "Equity", statut: "ACTIF" },
    { code: "112", label: "Réserves statutaires ou contractuelles", type: "Equity", statut: "ACTIF" },
    { code: "113", label: "Réserves réglementées", type: "Equity", statut: "ACTIF" },
    { code: "118", label: "Autres réserves", type: "Equity", statut: "ACTIF" },
    { code: "12", label: "Report à nouveau", type: "Equity", statut: "ACTIF", isClass: true },
    { code: "121", label: "Report à nouveau créditeur (solde créditeur)", type: "Equity", statut: "ACTIF" },
    { code: "129", label: "Report à nouveau débiteur (solde débiteur)", type: "Equity", statut: "ACTIF" },
    { code: "13", label: "Résultat net de l'exercice", type: "Equity", statut: "ACTIF", isClass: true },
    { code: "131", label: "Résultat net : Bénéfice", type: "Equity", statut: "ACTIF" },
    { code: "139", label: "Résultat net : Perte", type: "Equity", statut: "ACTIF" },
    { code: "14", label: "Subventions d'investissement", type: "Equity", statut: "ACTIF", isClass: true },
    { code: "16", label: "Emprunts et dettes assimilées", type: "Liability", statut: "ACTIF", isClass: true },
    { code: "161", label: "Emprunts obligataires", type: "Liability", statut: "ACTIF" },
    { code: "162", label: "Emprunts auprès des établissements de crédit", type: "Liability", statut: "ACTIF" },
    { code: "17", label: "Dettes de crédit-bail et assimilés", type: "Liability", statut: "ACTIF", isClass: true },
    { code: "19", label: "Provisions financières pour risques et charges", type: "Liability", statut: "ACTIF", isClass: true },

    // CLASSE 2 : COMPTES D'ACTIF IMMOBILISÉ
    { code: "20", label: "Charges immobilisées", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "201", label: "Frais d'établissement", type: "Asset", statut: "ACTIF" },
    { code: "21", label: "Immobilisations incorporelles", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "211", label: "Frais de développement", type: "Asset", statut: "ACTIF" },
    { code: "212", label: "Brevets, licences, concessions et droits similaires", type: "Asset", statut: "ACTIF" },
    { code: "213", label: "Logiciels et sites internet", type: "Asset", statut: "ACTIF" },
    { code: "214", label: "Marques et fonds de commerce", type: "Asset", statut: "ACTIF" },
    { code: "22", label: "Terrains", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "221", label: "Terrains agricoles et forestiers", type: "Asset", statut: "ACTIF" },
    { code: "222", label: "Terrains nus", type: "Asset", statut: "ACTIF" },
    { code: "223", label: "Terrains bâtis", type: "Asset", statut: "ACTIF" },
    { code: "23", label: "Bâtiments et installations techniques", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "231", label: "Bâtiments industriels et commerciaux", type: "Asset", statut: "ACTIF" },
    { code: "232", label: "Installations techniques et agencements", type: "Asset", statut: "ACTIF" },
    { code: "24", label: "Matériel, mobilier et équipements", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "241", label: "Matériel et outillage industriel", type: "Asset", statut: "ACTIF" },
    { code: "244", label: "Matériel de transport", type: "Asset", statut: "ACTIF" },
    { code: "245", label: "Matériel de bureau et matériel informatique", type: "Asset", statut: "ACTIF" },
    { code: "246", label: "Mobilier de bureau", type: "Asset", statut: "ACTIF" },
    { code: "25", label: "Avances et acomptes versés sur immobilisations", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "27", label: "Autres immobilisations financières", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "271", label: "Prêts et créances financières", type: "Asset", statut: "ACTIF" },
    { code: "275", label: "Dépôts et cautionnements versés", type: "Asset", statut: "ACTIF" },
    { code: "28", label: "Amortissements des immobilisations", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "281", label: "Amortissements des immobilisations incorporelles", type: "Asset", statut: "ACTIF" },
    { code: "283", label: "Amortissements des bâtiments et installations", type: "Asset", statut: "ACTIF" },
    { code: "284", label: "Amortissements du matériel et mobilier", type: "Asset", statut: "ACTIF" },
    { code: "29", label: "Provisions pour dépréciation des immobilisations", type: "Asset", statut: "ACTIF", isClass: true },

    // CLASSE 3 : COMPTES DE STOCKS
    { code: "31", label: "Marchandises", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "311", label: "Marchandises A", type: "Asset", statut: "ACTIF" },
    { code: "312", label: "Marchandises B", type: "Asset", statut: "ACTIF" },
    { code: "32", label: "Matières premières et fournitures liées", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "321", label: "Matières premières A", type: "Asset", statut: "ACTIF" },
    { code: "33", label: "Autres approvisionnements", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "335", label: "Fournitures de bureau et consommables", type: "Asset", statut: "ACTIF" },
    { code: "34", label: "Produits en cours", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "35", label: "Services en cours", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "36", label: "Produits finis", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "37", label: "Produits intermédiaires et résiduels", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "38", label: "Stocks en cours de route et en dépôt", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "39", label: "Dépréciations des stocks", type: "Asset", statut: "ACTIF", isClass: true },

    // CLASSE 4 : COMPTES DE TIERS
    { code: "40", label: "Fournisseurs et comptes rattachés", type: "Liability", statut: "ACTIF", isClass: true },
    { code: "401", label: "Fournisseurs, dettes en compte", type: "Liability", statut: "ACTIF" },
    { code: "402", label: "Fournisseurs, effets à payer", type: "Liability", statut: "ACTIF" },
    { code: "408", label: "Fournisseurs, factures non parvenues", type: "Liability", statut: "ACTIF" },
    { code: "409", label: "Fournisseurs débiteurs (avances et acomptes)", type: "Asset", statut: "ACTIF" },
    { code: "41", label: "Clients et comptes rattachés", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "411", label: "Clients", type: "Asset", statut: "ACTIF" },
    { code: "412", label: "Clients, effets à recevoir", type: "Asset", statut: "ACTIF" },
    { code: "416", label: "Créances clients litigieuses ou douteuses", type: "Asset", statut: "ACTIF" },
    { code: "418", label: "Clients, factures à établir", type: "Asset", statut: "ACTIF" },
    { code: "419", label: "Clients créditeurs (avances reçues)", type: "Liability", statut: "ACTIF" },
    { code: "42", label: "Personnel", type: "Liability", statut: "ACTIF", isClass: true },
    { code: "421", label: "Personnel, rémunérations dues", type: "Liability", statut: "ACTIF" },
    { code: "422", label: "Comités d'entreprise et œuvres sociales", type: "Liability", statut: "ACTIF" },
    { code: "425", label: "Personnel, avances et acomptes accordés", type: "Asset", statut: "ACTIF" },
    { code: "428", label: "Personnel, charges à payer et congés payés", type: "Liability", statut: "ACTIF" },
    { code: "43", label: "Organismes sociaux", type: "Liability", statut: "ACTIF", isClass: true },
    { code: "431", label: "Sécurité sociale (CNSS Bénin)", type: "Liability", statut: "ACTIF" },
    { code: "432", label: "Caisses de retraite complémentaire", type: "Liability", statut: "ACTIF" },
    { code: "438", label: "Organismes sociaux, charges à payer", type: "Liability", statut: "ACTIF" },
    { code: "44", label: "État et collectivités publiques", type: "Liability", statut: "ACTIF", isClass: true },
    { code: "441", label: "État, impôt sur les bénéfices (IS/IBA)", type: "Liability", statut: "ACTIF" },
    { code: "442", label: "État, impôts et taxes recouvrables sur tiers", type: "Liability", statut: "ACTIF" },
    { code: "443", label: "État, TVA facturée (collectée)", type: "Liability", statut: "ACTIF" },
    { code: "4431", label: "TVA facturée sur ventes de biens", type: "Liability", statut: "ACTIF" },
    { code: "4432", label: "TVA facturée sur prestations de services", type: "Liability", statut: "ACTIF" },
    { code: "444", label: "État, TVA due ou crédit de TVA", type: "Liability", statut: "ACTIF" },
    { code: "4441", label: "État, TVA due à reverser", type: "Liability", statut: "ACTIF" },
    { code: "4449", label: "État, crédit de TVA à reporter", type: "Asset", statut: "ACTIF" },
    { code: "445", label: "État, TVA récupérable (déductible)", type: "Asset", statut: "ACTIF" },
    { code: "4451", label: "TVA récupérable sur immobilisations", type: "Asset", statut: "ACTIF" },
    { code: "4452", label: "TVA récupérable sur achats de marchandises", type: "Asset", statut: "ACTIF" },
    { code: "4454", label: "TVA récupérable sur services extérieurs", type: "Asset", statut: "ACTIF" },
    { code: "446", label: "État, autres impôts et taxes", type: "Liability", statut: "ACTIF" },
    { code: "447", label: "État, impôts retenus à la source (IPTS, AIR, RAS)", type: "Liability", statut: "ACTIF" },
    { code: "4471", label: "AIR (Acompte sur Impôt assis sur les Revenus)", type: "Liability", statut: "ACTIF" },
    { code: "4472", label: "RAS (Retenue À la Source sur prestataires)", type: "Liability", statut: "ACTIF" },
    { code: "4473", label: "IPTS retenu sur salaires", type: "Liability", statut: "ACTIF" },
    { code: "448", label: "État, charges à payer (VPS, taxe d'apprentissage)", type: "Liability", statut: "ACTIF" },
    { code: "47", label: "Débiteurs et créditeurs divers", type: "Liability", statut: "ACTIF", isClass: true },
    { code: "471", label: "Comptes d'attente à régulariser", type: "Liability", statut: "ACTIF" },
    { code: "48", label: "Créances et dettes hors activités ordinaires (HAO)", type: "Liability", statut: "ACTIF", isClass: true },
    { code: "49", label: "Dépréciations des comptes de tiers", type: "Asset", statut: "ACTIF", isClass: true },

    // CLASSE 5 : COMPTES DE TRÉSORERIE
    { code: "51", label: "Valeurs à encaisser", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "511", label: "Effets à encaisser", type: "Asset", statut: "ACTIF" },
    { code: "512", label: "Chèques à encaisser", type: "Asset", statut: "ACTIF" },
    { code: "52", label: "Banques", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "521", label: "Banques locales en monnaie nationale (FCFA)", type: "Asset", statut: "ACTIF" },
    { code: "522", label: "Banques en devises", type: "Asset", statut: "ACTIF" },
    { code: "53", label: "Établissements financiers et assimilés", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "531", label: "Chèques postaux", type: "Asset", statut: "ACTIF" },
    { code: "54", label: "Instruments de trésorerie", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "56", label: "Banques, crédits de trésorerie et découverts", type: "Liability", statut: "ACTIF", isClass: true },
    { code: "57", label: "Caisses", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "571", label: "Caisse siège social", type: "Asset", statut: "ACTIF" },
    { code: "572", label: "Caisse succursale / secondaire", type: "Asset", statut: "ACTIF" },
    { code: "58", label: "Virements internes", type: "Asset", statut: "ACTIF", isClass: true },
    { code: "581", label: "Virements de fonds", type: "Asset", statut: "ACTIF" },
    { code: "585", label: "Mobile Money (MTN MoMo, Moov Money, Celtiis)", type: "Asset", statut: "ACTIF" },
    { code: "59", label: "Dépréciations des comptes de trésorerie", type: "Asset", statut: "ACTIF", isClass: true },

    // CLASSE 6 : COMPTES DE CHARGES
    { code: "60", label: "Achats et variations de stocks", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "601", label: "Achats de marchandises", type: "Expense", statut: "ACTIF" },
    { code: "602", label: "Achats de matières premières et fournitures", type: "Expense", statut: "ACTIF" },
    { code: "603", label: "Variations des stocks de biens achetés", type: "Expense", statut: "ACTIF" },
    { code: "6031", label: "Variation des stocks de marchandises", type: "Expense", statut: "ACTIF" },
    { code: "604", label: "Achats stockés de matières et fournitures", type: "Expense", statut: "ACTIF" },
    { code: "605", label: "Autres achats (eau, électricité, carburant)", type: "Expense", statut: "ACTIF" },
    { code: "61", label: "Transports", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "611", label: "Transports sur achats", type: "Expense", statut: "ACTIF" },
    { code: "612", label: "Transports sur ventes", type: "Expense", statut: "ACTIF" },
    { code: "62", label: "Services extérieurs A", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "621", label: "Sous-traitance générale", type: "Expense", statut: "ACTIF" },
    { code: "622", label: "Locations et charges locatives", type: "Expense", statut: "ACTIF" },
    { code: "624", label: "Entretien, réparations et maintenance", type: "Expense", statut: "ACTIF" },
    { code: "625", label: "Primes d'assurance", type: "Expense", statut: "ACTIF" },
    { code: "63", label: "Services extérieurs B", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "631", label: "Frais bancaires et commissions", type: "Expense", statut: "ACTIF" },
    { code: "632", label: "Rémunérations d'intermédiaires et honoraires", type: "Expense", statut: "ACTIF" },
    { code: "633", label: "Frais de formation du personnel", type: "Expense", statut: "ACTIF" },
    { code: "634", label: "Publicité, publications et relations publiques", type: "Expense", statut: "ACTIF" },
    { code: "635", label: "Frais de télécommunications et internet", type: "Expense", statut: "ACTIF" },
    { code: "637", label: "Déplacements, missions et réceptions", type: "Expense", statut: "ACTIF" },
    { code: "64", label: "Impôts et taxes", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "641", label: "Impôts et taxes directs (Patente, taxes foncières)", type: "Expense", statut: "ACTIF" },
    { code: "645", label: "Impôts et taxes indirects", type: "Expense", statut: "ACTIF" },
    { code: "646", label: "Droits d'enregistrement et de timbre", type: "Expense", statut: "ACTIF" },
    { code: "65", label: "Autres charges", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "651", label: "Pertes sur créances clients irrécouvrables", type: "Expense", statut: "ACTIF" },
    { code: "66", label: "Charges de personnel", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "661", label: "Rémunérations directes versées au personnel", type: "Expense", statut: "ACTIF" },
    { code: "664", label: "Charges sociales patronales (CNSS 15.4%, VPS 4%)", type: "Expense", statut: "ACTIF" },
    { code: "67", label: "Frais financiers et charges assimilées", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "671", label: "Intérêts des emprunts et dettes financières", type: "Expense", statut: "ACTIF" },
    { code: "676", label: "Pertes de change", type: "Expense", statut: "ACTIF" },
    { code: "68", label: "Dotations aux amortissements et provisions", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "681", label: "Dotations aux amortissements d'exploitation", type: "Expense", statut: "ACTIF" },
    { code: "69", label: "Dotations aux provisions et dépréciations HAO", type: "Expense", statut: "ACTIF", isClass: true },

    // CLASSE 7 : COMPTES DE PRODUITS
    { code: "70", label: "Ventes", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "701", label: "Ventes de marchandises", type: "Revenue", statut: "ACTIF" },
    { code: "702", label: "Ventes de produits finis", type: "Revenue", statut: "ACTIF" },
    { code: "706", label: "Services vendus (Prestations de services)", type: "Revenue", statut: "ACTIF" },
    { code: "707", label: "Produits accessoires (ports, commissions)", type: "Revenue", statut: "ACTIF" },
    { code: "71", label: "Subventions d'exploitation", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "72", label: "Production immobilisée", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "73", label: "Variations de stocks de biens et services produits", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "75", label: "Autres produits", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "758", label: "Produits divers d'exploitation", type: "Revenue", statut: "ACTIF" },
    { code: "77", label: "Revenus financiers et produits assimilés", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "771", label: "Intérêts de prêts et créances diverses", type: "Revenue", statut: "ACTIF" },
    { code: "776", label: "Gains de change", type: "Revenue", statut: "ACTIF" },
    { code: "78", label: "Reprises d'amortissements et provisions", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "79", label: "Reprises de provisions et dépréciations HAO", type: "Revenue", statut: "ACTIF", isClass: true },

    // CLASSE 8 : COMPTES DES AUTRES CHARGES ET PRODUITS (HAO)
    { code: "81", label: "Valeurs comptables des cessions d'immobilisations", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "82", label: "Produits des cessions d'immobilisations", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "83", label: "Charges HAO (Hors Activités Ordinaires)", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "831", label: "Charges HAO constatées (dons, pénalités)", type: "Expense", statut: "ACTIF" },
    { code: "84", label: "Produits HAO", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "841", label: "Produits HAO constatés", type: "Revenue", statut: "ACTIF" },
    { code: "85", label: "Dotations HAO", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "86", label: "Reprises HAO", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "87", label: "Participations des travailleurs", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "88", label: "Subventions d'équilibre", type: "Revenue", statut: "ACTIF", isClass: true },
    { code: "89", label: "Impôts sur le résultat (IS / TPS)", type: "Expense", statut: "ACTIF", isClass: true },
    { code: "891", label: "Impôt sur les sociétés (IS)", type: "Expense", statut: "ACTIF" },
    { code: "892", label: "Taxe Professionnelle Synthétique (TPS)", type: "Expense", statut: "ACTIF" },
  ];

  // Fusion transparente du plan SYSCOHADA et des comptes personnalisés de l'entreprise
  const accountsMap = new Map<string, any>();
  defaultAccounts.forEach((acc) => accountsMap.set(acc.code, acc));
  if (Array.isArray(apiAccounts) && apiAccounts.length > 0) {
    apiAccounts.forEach((a: any) => {
      accountsMap.set(a.code, {
        code: a.code,
        label: a.name || a.label,
        type: a.type || "Asset",
        statut: a.is_active ? "ACTIF" : "INACTIF",
        isClass: a.code.length <= 2,
      });
    });
  }
  const accountsList = Array.from(accountsMap.values()).sort((a, b) =>
    a.code.localeCompare(b.code, undefined, { numeric: true })
  );

  const filteredAccounts = accountsList.filter((a) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = !q || a.code.toLowerCase().includes(q) || a.label.toLowerCase().includes(q);
    const matchesClass = selectedClass === "all" || a.code.startsWith(selectedClass);
    return matchesQuery && matchesClass;
  });

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Code;Libellé;Type;Statut\n" +
      filteredAccounts.map((a) => `${a.code};${a.label};${a.type};${a.statut}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plan_comptable_syscohada.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Plan comptable exporté en CSV");
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">Plan comptable SYSCOHADA</h2>
          <p className="text-xs text-muted mt-0.5">Configuration de vos comptes de classe 1 à 8.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-9 px-3 bg-background border border-border rounded text-xs text-ink hover:bg-background-secondary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4 text-muted" />
            <span>Exporter CSV</span>
          </button>
          <button
            type="button"
            onClick={() => toast.info("Formulaire d'ajout de compte disponible")}
            className="h-9 px-3 bg-primary text-ink rounded text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F0CB3A] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter un compte</span>
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtre classe */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un compte..."
            className="w-full h-10 pl-9 pr-3 bg-background border border-[#D8D5D0] rounded text-xs text-ink focus:outline-none focus:border-2 focus:border-ink"
          />
        </div>
        {/* Filtre Classe avec taille limitée et défilement */}
        <div className="relative w-full sm:w-72" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-full h-10 px-3 bg-background border border-[#D8D5D0] rounded text-xs text-ink flex items-center justify-between gap-2 focus:outline-none focus:border-2 focus:border-ink cursor-pointer transition-colors"
          >
            <span className="truncate">
              {CLASS_FILTER_OPTIONS.find((o) => o.value === selectedClass)?.label || "Toutes les classes (1 à 8)"}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted shrink-0 transition-transform duration-200",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-full bg-background border border-border rounded shadow-lg z-30 max-h-56 overflow-y-auto scrollbar-thin py-1">
              {CLASS_FILTER_OPTIONS.map((opt) => {
                const isSelected = selectedClass === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelectedClass(opt.value);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-xs text-left flex items-center justify-between gap-2 transition-colors cursor-pointer",
                      isSelected
                        ? "bg-primary/15 font-semibold text-ink"
                        : "text-ink hover:bg-background-secondary"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-ink shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border h-9 text-[11px] text-muted uppercase tracking-wider font-semibold">
              <th className="py-2 px-4 w-32">CODE</th>
              <th className="py-2 px-4">LIBELLÉ</th>
              <th className="py-2 px-4 w-32">TYPE</th>
              <th className="py-2 px-4 w-28 text-center">STATUT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs text-ink">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={4} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                </tr>
              ))
            ) : filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted">
                  Aucun compte trouvé correspondant aux critères.
                </td>
              </tr>
            ) : (
              filteredAccounts.map((r, i) => (
                <tr
                  key={r.code || i}
                  className={cn(
                    "transition-colors",
                    r.isClass
                      ? "bg-background hover:bg-background-secondary/50 font-semibold"
                      : "bg-[#FBFBFA] hover:bg-background-secondary/40"
                  )}
                >
                  <td
                    className={cn(
                      "py-2.5 px-4 font-mono text-xs whitespace-nowrap",
                      r.isClass ? "text-ink font-semibold" : "pl-8 text-muted"
                    )}
                  >
                    {r.code}
                  </td>
                  <td
                    className={cn(
                      "py-2.5 px-4 text-xs",
                      r.isClass ? "text-ink font-semibold" : "pl-8 text-ink"
                    )}
                  >
                    {r.label}
                  </td>
                  <td className="py-2.5 px-4 text-muted text-xs capitalize">{r.type}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#DCFCE7] text-[#166534] text-[11px] font-semibold">
                      {r.statut}
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

// =============================================================================
// ONGLET 3 : UTILISATEURS & RÔLES
// =============================================================================
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
    <div className="flex flex-col p-6 gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">Équipe & Accès</h2>
          <p className="text-xs text-muted mt-0.5">Gérez les collaborateurs et leurs permissions.</p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          type="button"
          className="h-10 px-4 bg-primary text-ink rounded text-xs font-semibold flex items-center gap-2 hover:bg-[#F0CB3A] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Inviter un utilisateur</span>
        </button>
      </div>

      <div className="flex flex-col divide-y divide-border border border-border rounded overflow-hidden">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))
        ) : (
          users.map((u: any) => {
            const isOwner = u.role === "owner";
            return (
              <div
                key={u.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-background hover:bg-background-secondary/40 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar
                    name={u.name}
                    email={u.email}
                    avatarUrl={u.avatar_url}
                    size={40}
                    square={false}
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink truncate">{u.name}</span>
                      {!u.is_active && (
                        <span className="inline-block px-2 py-0.5 bg-error/15 text-error-deep rounded text-[10px] font-semibold uppercase">
                          Suspendu
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted truncate">{u.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                  <UserRoleBadge role={u.role} />
                  {isOwner ? (
                    <span className="text-xs text-muted italic">Fixe</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedUser(u)}
                      className="text-xs font-semibold text-ink hover:underline cursor-pointer"
                    >
                      Gérer
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

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

// =============================================================================
// ONGLET 6 : INTÉGRATIONS
// =============================================================================
const Integrations = () => {
  return (
    <div className="flex flex-col p-6 gap-6">
      <div>
        <h2 className="text-base font-semibold text-ink">Intégrations & API</h2>
        <p className="text-xs text-muted mt-0.5">Connectez Studio à vos outils favoris.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Carte 1 */}
        <div className="p-5 bg-background border border-border rounded flex flex-col justify-between h-full gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-background-secondary border border-border flex items-center justify-center text-ink shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-ink">Connexion bancaire</span>
              <span className="text-xs text-muted">Synchronisez vos comptes via DSP2</span>
              <span className="text-[11px] text-muted mt-1">2 comptes synchronisés (BOA, Ecobank)</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <span className="px-2.5 py-1 rounded bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] text-xs font-semibold uppercase">
              CONNECTÉ
            </span>
            <button className="text-ink text-xs font-semibold hover:underline cursor-pointer" type="button">
              Gérer
            </button>
          </div>
        </div>

        {/* Carte 2 */}
        <div className="p-5 bg-background border border-border rounded flex flex-col justify-between h-full gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-background-secondary border border-border flex items-center justify-center text-ink shrink-0">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-ink">Shopify / WooCommerce</span>
              <span className="text-xs text-muted">Importez vos ventes e-commerce</span>
              <span className="text-[11px] text-muted mt-1">Passerelle Webhook disponible</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <span className="px-2.5 py-1 rounded bg-background-secondary text-muted border border-border text-xs font-semibold uppercase">
              Désactivé
            </span>
            <button
              className="h-8 px-3 bg-background border border-border text-ink hover:bg-background-secondary rounded text-xs font-semibold transition-colors cursor-pointer"
              type="button"
            >
              Connecter
            </button>
          </div>
        </div>

        {/* Carte 3 */}
        <div className="p-5 bg-background border border-border rounded flex flex-col justify-between h-full gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-background-secondary border border-border flex items-center justify-center text-ink shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-ink">Stripe / PayPal</span>
              <span className="text-xs text-muted">Encaissez vos factures en ligne</span>
              <span className="text-[11px] text-muted mt-1">Rapprochement automatique actif</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <span className="px-2.5 py-1 rounded bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] text-xs font-semibold uppercase">
              CONNECTÉ
            </span>
            <button className="text-ink text-xs font-semibold hover:underline cursor-pointer" type="button">
              Gérer
            </button>
          </div>
        </div>

        {/* Carte 4 */}
        <div className="p-5 bg-background border border-border rounded flex flex-col justify-between h-full gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-background-secondary border border-border flex items-center justify-center text-ink shrink-0">
              <ScanLine className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-ink">OCR Avancé</span>
              <span className="text-xs text-muted">Extraction par IA générative</span>
              <span className="text-[11px] text-muted mt-1">Précision de scan : 99.4%</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <span className="px-2.5 py-1 rounded bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] text-xs font-semibold uppercase">
              CONNECTÉ
            </span>
            <button className="text-ink text-xs font-semibold hover:underline cursor-pointer" type="button">
              Gérer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ONGLET 7 : SÉCURITÉ & AUDIT
// =============================================================================
const Audit = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");

  const { data: res, isLoading } = useQuery<any>({
    queryKey: ["audit-logs"],
    queryFn: () => fetcher("/api/audit/logs?limit=50"),
  });
  const logs = res?.data || res || [];

  const filteredLogs = logs.filter((l: any) => {
    const actionUpper = (l.action || "CREATE").toUpperCase();
    const actor = (l.user?.name || "Harry ALOHOUTADÉ").toLowerCase();
    const target = (l.resource ? `${l.resource} #${l.resource_id ? l.resource_id.slice(-4) : "0042"}` : "Facture FA-2026-0042 (Normalisée)").toLowerCase();
    const q = searchQuery.trim().toLowerCase();

    const matchesQuery = !q || actor.includes(q) || target.includes(q);
    const matchesAction = selectedAction === "all" || actionUpper === selectedAction;
    return matchesQuery && matchesAction;
  });

  const getActionBadgeClass = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]";
      case "LOGIN":
        return "bg-[#F0ECE3] text-[#2B2520] border border-[#DCD6CD]";
      case "VALIDATE":
        return "bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]";
      case "UPDATE":
        return "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]";
      case "DELETE":
        return "bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]";
      default:
        return "bg-background-secondary text-ink border border-border";
    }
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-ink" />
            <h2 className="text-base font-semibold text-ink">Sécurité & Piste d'audit</h2>
          </div>
          <p className="text-xs text-muted mt-0.5">Activités immuables enregistrées sur votre instance.</p>
        </div>
        <button
          className="h-9 px-3 bg-background border border-border rounded text-xs text-ink hover:bg-background-secondary transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          type="button"
          onClick={() => toast.info("Export journal complet en cours de préparation")}
        >
          <Download className="h-4 w-4 text-muted" />
          <span>Journal complet (JSON/CSV)</span>
        </button>
      </div>

      {/* Barre de recherche et filtre d'action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un acteur ou une cible..."
            className="w-full h-10 pl-9 pr-3 bg-background border border-[#D8D5D0] rounded text-xs text-ink focus:outline-none focus:border-2 focus:border-ink"
          />
        </div>
        <div className="w-full sm:w-56">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full h-10 px-3 bg-background border border-[#D8D5D0] rounded text-xs text-ink focus:outline-none focus:border-2 focus:border-ink cursor-pointer"
          >
            <option value="all">Toutes les actions</option>
            <option value="CREATE">CREATE (Création)</option>
            <option value="LOGIN">LOGIN (Connexion)</option>
            <option value="VALIDATE">VALIDATE (Validation)</option>
            <option value="UPDATE">UPDATE (Modification)</option>
            <option value="DELETE">DELETE (Suppression)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-border rounded">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-secondary border-b-2 border-border h-8 text-[11px] text-muted uppercase tracking-wider font-semibold">
              <th className="py-2 px-4">ACTEUR</th>
              <th className="py-2 px-4 w-32">ACTION</th>
              <th className="py-2 px-4">CIBLE</th>
              <th className="py-2 px-4 text-right">HORODATAGE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs text-ink">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={4} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                </tr>
              ))
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 px-4 text-center bg-background">
                  <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                    <Inbox className="h-8 w-8 text-muted" />
                    <span className="text-sm font-semibold text-ink">Aucun événement trouvé</span>
                    <p className="text-xs text-muted">Ajustez vos filtres ou effectuez de nouvelles actions pour les voir s'afficher.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLogs.map((l: any, idx: number) => {
                const actionUpper = (l.action || "CREATE").toUpperCase();

                return (
                  <tr
                    key={l.id || idx}
                    className={cn(
                      "transition-colors",
                      idx % 2 === 0 ? "bg-background hover:bg-background-secondary/50" : "bg-[#FBFBFA] hover:bg-background-secondary/40"
                    )}
                  >
                    <td className="py-3 px-4 font-semibold text-ink whitespace-nowrap">
                      {l.user?.name || "Harry ALOHOUTADÉ"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-block px-2.5 py-1 rounded text-[11px] font-semibold uppercase border",
                          getActionBadgeClass(actionUpper)
                        )}
                      >
                        {actionUpper}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-muted">
                      {l.resource ? `${l.resource} #${l.resource_id ? l.resource_id.slice(-4) : "0042"}` : "Facture FA-2026-0042 (Normalisée)"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-ink tabular-nums whitespace-nowrap">
                      {l.created_at ? formatDateLong(l.created_at) : "01 oct. 2026, 14:22:05"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============================================================================
// ONGLET 8 : FACTURATION STUDIO
// =============================================================================
const Billing = () => {
  return (
    <div className="flex flex-col p-6 gap-6">
      <div>
        <h2 className="text-base font-semibold text-ink">Abonnement & Facturation</h2>
        <p className="text-xs text-muted mt-0.5">
          Consultez votre formule active et gérez les modes de paiement de votre espace Comptia.
        </p>
      </div>

      {/* Grande carte PLAN ACTUEL */}
      <div className="p-6 bg-[#FAF8F5] border border-border rounded flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted font-semibold">PLAN ACTUEL</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#DCFCE7] text-[#166534] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#166534]"></span>
            ACTIF JUSQU'AU 31 DÉC. 2026
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-ink tracking-tight">Studio Enterprise</h3>
          <p className="text-xs text-muted">
            Abonnement annuel premium · Inclus support prioritaire 24/7 et exportations illimitées.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 border-y border-border">
          <div className="flex flex-col">
            <span className="text-xs text-muted">Collaborateurs</span>
            <span className="font-mono text-lg font-bold text-ink">7 / Illimité</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted">Factures e-MECeF</span>
            <span className="font-mono text-lg font-bold text-ink">Illimitées</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted">Stockage GED Pièces</span>
            <span className="font-mono text-lg font-bold text-ink">18.4 GB / 50 GB</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => toast.info("Portail de facturation en cours d'ouverture")}
            className="h-10 px-5 bg-primary text-ink rounded text-xs font-semibold hover:bg-[#F0CB3A] transition-colors cursor-pointer"
          >
            Gérer mon abonnement
          </button>
          <button
            type="button"
            onClick={() => toast.info("Historique des factures disponible")}
            className="h-10 px-4 bg-background border border-border text-ink hover:bg-background-secondary rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            Historique factures
          </button>
        </div>
      </div>
    </div>
  );
};

export default Parametres;