"use client";

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

type Item = {
  key: string;
  module: Module;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const items: Item[] = [
  { key: "dashboard", module: "dashboard", label: "Tableau de bord", to: "/dashboard", icon: LayoutDashboard },
  { key: "facturation", module: "invoices", label: "Facturation & Clients", to: "/facturation", icon: Receipt },
  { key: "documents", module: "documents", label: "Dépenses & Achats", to: "/documents", icon: ShoppingCart },
  { key: "comptabilite", module: "accounting_entries", label: "Comptabilité SYSCOHADA", to: "/comptabilite", icon: BookOpen },
  { key: "tva", module: "vat_declarations", label: "Déclarations & TVA DGI", to: "/tva", icon: CheckCircle2 },
  { key: "rapprochement", module: "bank_reconciliation", label: "Trésorerie & Banque/MoMo", to: "/comptabilite/rapprochement", icon: Wallet },
  { key: "paie", module: "payroll", label: "Paie & Salariés", to: "/paie", icon: Users },
  { key: "reporting", module: "reporting", label: "Reporting & DSF", to: "/reporting", icon: TrendingUp },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AppSidebar = ({ open, onClose }: Props) => {
  const { data: userRes } = useQuery<any>({
    queryKey: ["me"],
    queryFn: () => fetcher("/api/auth/me"),
  });

  const user = userRes?.data || userRes;
  const sector = user?.company?.sector;

  const { hasAccess } = usePermissions();

  const isSettingsAccessible =
    hasAccess("company_settings") ||
    hasAccess("chart_of_accounts") ||
    hasAccess("user_management") ||
    hasAccess("mecef_settings") ||
    hasAccess("audit_log") ||
    hasAccess("subscription_billing");

  const visibleItems = items.filter((item) => {
    const sectorOk = isModuleEnabledForSector(sector, item.key);
    if (!sectorOk) return false;

    if (item.key === "paie") {
      return hasAccess("payroll") || hasAccess("employees");
    }

    return hasAccess(item.module);
  });

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink/50 backdrop-blur-none transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-background-secondary border-r border-border z-50 flex flex-col justify-between select-none transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* En-tête Sidebar avec Logo officiel Ceilow */}
          <div className="h-16 px-space-lg flex items-center justify-between border-b border-border bg-background-secondary shrink-0">
            <Link href="/dashboard" className="flex items-center" title="Ceilow SYSCOHADA Pro">
              <img src="/logo/ceilow_web_sombre.svg" alt="Ceilow" className="h-7 w-auto" />
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-text-muted hover:text-ink transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-space-md py-space-sm shrink-0">
            <div className="px-space-sm py-space-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Grand Livre & Gestion
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-1 px-space-sm flex-1 overflow-y-auto">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  className="flex items-center gap-space-md px-space-md py-2 rounded text-text-muted hover:bg-surface-container hover:text-ink transition-colors font-medium text-xs"
                  activeClassName="!bg-primary/15 !text-ink font-semibold border-l-2 !border-ink"
                  onClick={onClose}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-space-sm border-t border-border bg-background-secondary shrink-0">
          {isSettingsAccessible && (
            <NavLink
              to="/parametres"
              className="flex items-center gap-space-md px-space-md py-2 rounded text-text-muted hover:bg-surface-container hover:text-ink transition-colors font-medium text-xs"
              activeClassName="!bg-primary/15 !text-ink font-semibold border-l-2 !border-ink"
              onClick={onClose}
            >
              <Settings className="w-5 h-5 shrink-0" />
              <span>Paramètres</span>
            </NavLink>
          )}
          <div className="mt-space-xs px-space-md py-space-xs flex items-center justify-between text-text-muted text-[11px] border-t border-border/50 pt-space-xs">
            <span>Réseau e-MECeF Bénin</span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#00855A]" title="Opérationnel"></span>
          </div>
        </div>
      </aside>
    </>
  );
};