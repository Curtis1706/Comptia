"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  ShoppingCart,
  BookOpen,
  CheckCircle2,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { isModuleEnabledForSector } from "@/constants/sector-modules";
import { usePermissions } from "@/hooks/usePermissions";
import { Module } from "@/lib/permissions";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

const ROLE_LABELS: Record<string, string> = {
  owner: "Propriétaire",
  admin: "Administrateur",
  accountant: "Comptable",
  cashier: "Caissier",
  hr: "RH",
  viewer: "Observateur",
};

export type NavItemConfig = {
  key: string;
  module: Module;
  label: string;
  to: string;
  icon: React.ElementType;
};

export type NavGroupConfig = {
  heading?: string;
  items: NavItemConfig[];
};

const navGroups: NavGroupConfig[] = [
  {
    heading: "Activité & Ventes",
    items: [
      { key: "dashboard", module: "dashboard", label: "Tableau de bord", to: "/dashboard", icon: LayoutDashboard },
      { key: "facturation", module: "invoices", label: "Facturation & Clients", to: "/facturation", icon: Receipt },
      { key: "documents", module: "documents", label: "Dépenses & Achats", to: "/documents", icon: ShoppingCart },
    ],
  },
  {
    heading: "Comptabilité SYSCOHADA",
    items: [
      { key: "comptabilite", module: "accounting_entries", label: "Comptabilité SYSCOHADA", to: "/comptabilite", icon: BookOpen },
      { key: "tva", module: "vat_declarations", label: "Déclarations & TVA DGI", to: "/tva", icon: CheckCircle2 },
      { key: "rapprochement", module: "bank_reconciliation", label: "Trésorerie & Banque/MoMo", to: "/comptabilite/rapprochement", icon: Wallet },
    ],
  },
  {
    heading: "RH & Clôture",
    items: [
      { key: "paie", module: "payroll", label: "Paie & Salariés", to: "/paie", icon: Users },
      { key: "reporting", module: "reporting", label: "Reporting & DSF", to: "/reporting", icon: TrendingUp },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

function WorkspaceSwitcher({
  companyName,
  role,
  isExpanded,
}: {
  companyName: string;
  role: string;
  isExpanded: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const initial = companyName.charAt(0).toUpperCase() || "C";
  const roleLabel = ROLE_LABELS[role] || "Propriétaire";

  if (!isExpanded) {
    return (
      <div className="flex justify-center mb-3">
        <div
          className="w-9 h-9 rounded-lg bg-primary text-ink flex items-center justify-center font-bold text-xs shadow-sm cursor-default"
          title={`${companyName} (${roleLabel})`}
        >
          {initial}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-2">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors select-none group border border-transparent hover:border-border"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary text-ink flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {initial}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-ink truncate leading-tight">
              {companyName}
            </span>
            <span className="text-[11px] text-text-muted leading-tight mt-0.5">
              {roleLabel}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-muted transition-transform duration-200 shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[52px] left-0 w-full bg-background border border-border rounded-lg shadow-lg z-50 py-1 flex flex-col gap-0.5 animate-in fade-in duration-100">
            <div className="px-3 py-2 text-xs font-semibold text-ink bg-primary/10 rounded mx-1">
              {companyName}
            </div>
            <div className="h-px bg-border my-1 mx-2" />
            <Link
              href="/parametres"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-xs text-text-muted hover:text-ink hover:bg-surface-container rounded mx-1 transition-colors flex items-center gap-2"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Gérer l'entreprise</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export const AppSidebar = ({ open, onClose }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const { data: userRes } = useQuery<any>({
    queryKey: ["me"],
    queryFn: () => fetcher("/api/auth/me"),
  });

  const user = userRes?.data || userRes;
  const companyName = user?.company?.name || "Ceilow Entreprise";
  const userRole = user?.role || "owner";
  const sector = user?.company?.sector;

  const { hasAccess } = usePermissions();

  const isSettingsAccessible =
    hasAccess("company_settings") ||
    hasAccess("chart_of_accounts") ||
    hasAccess("user_management") ||
    hasAccess("mecef_settings") ||
    hasAccess("audit_log") ||
    hasAccess("subscription_billing");

  // Déplié si ouvert sur mobile (open) ou si survolé par la souris sur desktop (isHovered)
  const isExpanded = open || isHovered;

  const filterItem = (item: NavItemConfig): boolean => {
    const sectorOk = isModuleEnabledForSector(sector, item.key);
    if (!sectorOk) return false;

    if (item.key === "paie") {
      return hasAccess("payroll") || hasAccess("employees");
    }

    return hasAccess(item.module);
  };

  const handleOpenSearch = () => {
    const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
    document.dispatchEvent(event);
    onClose();
  };

  const handleSignOut = async () => {
    toast.info("Déconnexion en cours...");
    await signOut({ redirect: false });
    if (typeof window !== "undefined") {
      window.location.href = `${window.location.origin}/login`;
    }
  };

  return (
    <>
      {/* Overlay Mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink/50 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed left-0 top-0 h-full bg-background-secondary border-r border-border z-50 flex flex-col justify-between select-none transition-all duration-200 ease-out font-sans",
          isExpanded ? "w-64 shadow-2xl" : "w-16 shadow-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0 p-3">
          {/* En-tête : Picto quand compact, Logo complet quand survolé */}
          <div
            className={cn(
              "h-12 flex items-center shrink-0 mb-2 transition-all",
              isExpanded ? "justify-between px-2" : "justify-center"
            )}
          >
            <Link
              href="/dashboard"
              className="flex items-center"
              title="Ceilow SYSCOHADA"
            >
              {isExpanded ? (
                <img
                  src="/logo/ceilow_web_sombre.svg"
                  alt="Ceilow"
                  className="h-7 w-auto"
                />
              ) : (
                <img
                  src="/logo/picto_ceilow_web_sombre.svg"
                  alt="Ceilow"
                  className="h-7 w-auto"
                />
              )}
            </Link>

            {isExpanded && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1.5 text-text-muted hover:text-ink transition-colors rounded-md"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Switcher d'entreprise */}
          <WorkspaceSwitcher
            companyName={companyName}
            role={userRole}
            isExpanded={isExpanded}
          />

          {/* Raccourci Recherche ⌘K */}
          {isExpanded ? (
            <button
              type="button"
              onClick={handleOpenSearch}
              className="flex items-center justify-between w-full px-2.5 py-2 mb-3 rounded-lg bg-background border border-border text-text-muted hover:text-ink hover:border-ink transition-colors text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                <span>Recherche rapide</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-background-secondary border border-border rounded">
                ⌘K
              </kbd>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenSearch}
              className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-lg bg-background border border-border text-text-muted hover:text-ink hover:border-ink transition-colors"
              title="Recherche rapide (⌘K)"
              aria-label="Recherche rapide"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Navigation groupée */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2.5">
            {navGroups.map((group, groupIdx) => {
              const visibleGroupItems = group.items.filter(filterItem);
              if (visibleGroupItems.length === 0) return null;

              return (
                <div key={groupIdx} className="flex flex-col gap-0.5">
                  {isExpanded && group.heading && (
                    <span className="px-2.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      {group.heading}
                    </span>
                  )}
                  {!isExpanded && groupIdx > 0 && (
                    <div className="h-px bg-border/40 mx-2 my-1.5" />
                  )}
                  {visibleGroupItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.key}
                        to={item.to}
                        end={item.to === "/dashboard"}
                        className={cn(
                          "flex items-center rounded-lg text-text-muted hover:bg-surface-container hover:text-ink transition-colors font-medium text-xs",
                          isExpanded
                            ? "gap-2.5 px-2.5 py-2"
                            : "justify-center w-10 h-10 mx-auto"
                        )}
                        activeClassName="!bg-primary/15 !text-ink font-semibold"
                        onClick={onClose}
                        title={!isExpanded ? item.label : undefined}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {isExpanded && <span className="truncate">{item.label}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pied de la Sidebar */}
        <div className="p-3 border-t border-border bg-background-secondary shrink-0 flex flex-col gap-1">
          {isSettingsAccessible && (
            <NavLink
              to="/parametres"
              className={cn(
                "flex items-center rounded-lg text-text-muted hover:bg-surface-container hover:text-ink transition-colors font-medium text-xs",
                isExpanded
                  ? "gap-2.5 px-2.5 py-2"
                  : "justify-center w-10 h-10 mx-auto"
              )}
              activeClassName="!bg-primary/15 !text-ink font-semibold"
              onClick={onClose}
              title={!isExpanded ? "Paramètres" : undefined}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {isExpanded && <span>Paramètres</span>}
            </NavLink>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className={cn(
              "flex items-center rounded-lg text-text-muted hover:bg-surface-container hover:text-ink transition-colors font-medium text-xs w-full",
              isExpanded
                ? "gap-2.5 px-2.5 py-2 text-left"
                : "justify-center w-10 h-10 mx-auto"
            )}
            title={!isExpanded ? "Déconnexion" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isExpanded && <span>Déconnexion</span>}
          </button>

          <div
            className={cn(
              "mt-1 pt-2 border-t border-border/50 text-text-muted text-[11px] flex items-center",
              isExpanded ? "justify-between px-2.5" : "justify-center"
            )}
            title={!isExpanded ? "Réseau e-MECeF Bénin : Opérationnel" : undefined}
          >
            {isExpanded && <span>Réseau e-MECeF Bénin</span>}
            <span
              className="inline-block w-2 h-2 rounded-full bg-success"
              title="Opérationnel"
            />
          </div>
        </div>
      </aside>
    </>
  );
};