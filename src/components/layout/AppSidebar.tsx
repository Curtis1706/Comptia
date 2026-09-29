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
  PanelLeftClose,
  PanelLeftOpen,
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
      { key: "comptabilite", module: "accounting_entries", label: "Grand Livre & Écritures", to: "/comptabilite", icon: BookOpen },
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function WorkspaceSwitcher({
  companyName,
  role,
  collapsed,
}: {
  companyName: string;
  role: string;
  collapsed?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const initial = companyName.charAt(0).toUpperCase() || "C";
  const roleLabel = ROLE_LABELS[role] || "Propriétaire";

  if (collapsed) {
    return (
      <div className="flex justify-center mb-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 rounded-lg bg-primary text-ink flex items-center justify-center font-bold text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title={`${companyName} (${roleLabel})`}
          aria-label={companyName}
        >
          {initial}
        </button>
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
          <div className="absolute top-[52px] left-0 w-full bg-background border border-border rounded-lg shadow-lg z-50 py-1 flex flex-col gap-0.5">
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

export const AppSidebar = ({
  open,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: Props) => {
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
    await signOut({ callbackUrl: "/login" });
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
        className={cn(
          "fixed left-0 top-0 h-full bg-background-secondary border-r border-border z-50 flex flex-col justify-between select-none transition-all duration-300 lg:translate-x-0 font-sans",
          collapsed ? "w-16" : "w-64",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0 p-3">
          {/* En-tête avec Logo / Picto Ceilow et bouton plier/déplier */}
          <div
            className={cn(
              "h-12 flex items-center shrink-0 mb-2",
              collapsed ? "justify-center" : "justify-between px-2"
            )}
          >
            <Link
              href="/dashboard"
              className="flex items-center"
              title="Ceilow SYSCOHADA"
            >
              {collapsed ? (
                <img
                  src="/logo/picto_ceilow_web_sombre.svg"
                  alt="Ceilow"
                  className="h-7 w-auto"
                />
              ) : (
                <img
                  src="/logo/ceilow_web_sombre.svg"
                  alt="Ceilow"
                  className="h-7 w-auto"
                />
              )}
            </Link>

            <div className="flex items-center gap-1">
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className={cn(
                    "hidden lg:flex items-center justify-center p-1.5 rounded-md text-text-muted hover:text-ink hover:bg-surface-container transition-colors",
                    collapsed && "mt-1"
                  )}
                  title={collapsed ? "Déplier la barre latérale" : "Plier la barre latérale"}
                  aria-label={collapsed ? "Déplier la barre latérale" : "Plier la barre latérale"}
                >
                  {collapsed ? (
                    <PanelLeftOpen className="w-4 h-4" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1.5 text-text-muted hover:text-ink transition-colors rounded-md"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Switcher d'entreprise */}
          <WorkspaceSwitcher
            companyName={companyName}
            role={userRole}
            collapsed={collapsed}
          />

          {/* Raccourci Recherche ⌘K */}
          {collapsed ? (
            <button
              type="button"
              onClick={handleOpenSearch}
              className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-lg bg-background border border-border text-text-muted hover:text-ink hover:border-ink transition-colors"
              title="Recherche rapide (⌘K)"
              aria-label="Recherche rapide"
            >
              <Search className="w-4 h-4" />
            </button>
          ) : (
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
          )}

          {/* Navigation groupée */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2.5">
            {navGroups.map((group, groupIdx) => {
              const visibleGroupItems = group.items.filter(filterItem);
              if (visibleGroupItems.length === 0) return null;

              return (
                <div key={groupIdx} className="flex flex-col gap-0.5">
                  {!collapsed && group.heading && (
                    <span className="px-2.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      {group.heading}
                    </span>
                  )}
                  {collapsed && groupIdx > 0 && (
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
                          collapsed
                            ? "justify-center w-10 h-10 mx-auto"
                            : "gap-2.5 px-2.5 py-2"
                        )}
                        activeClassName="!bg-primary/15 !text-ink font-semibold"
                        onClick={onClose}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
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
                collapsed
                  ? "justify-center w-10 h-10 mx-auto"
                  : "gap-2.5 px-2.5 py-2"
              )}
              activeClassName="!bg-primary/15 !text-ink font-semibold"
              onClick={onClose}
              title={collapsed ? "Paramètres" : undefined}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Paramètres</span>}
            </NavLink>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className={cn(
              "flex items-center rounded-lg text-text-muted hover:bg-surface-container hover:text-ink transition-colors font-medium text-xs w-full",
              collapsed
                ? "justify-center w-10 h-10 mx-auto"
                : "gap-2.5 px-2.5 py-2 text-left"
            )}
            title={collapsed ? "Déconnexion" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Déconnexion</span>}
          </button>

          <div
            className={cn(
              "mt-1 pt-2 border-t border-border/50 text-text-muted text-[11px] flex items-center",
              collapsed ? "justify-center" : "justify-between px-2.5"
            )}
            title={collapsed ? "Réseau e-MECeF Bénin : Opérationnel" : undefined}
          >
            {!collapsed && <span>Réseau e-MECeF Bénin</span>}
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