"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  FileText,
  Receipt,
  Briefcase,
  TrendingUp,
  FolderOpen,
  Settings,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { isModuleEnabledForSector } from "@/constants/sector-modules";
import { usePermissions } from "@/hooks/usePermissions";
import { Module } from "@/lib/permissions";

type Item = {
  key: string;
  module: Module;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; to: string; module?: Module }[];
};

const items: Item[] = [
  { key: "dashboard", module: "dashboard", label: "Tableau de bord", to: "/dashboard", icon: LayoutDashboard },
  {
    key: "comptabilite",
    module: "accounting_entries",
    label: "Comptabilité",
    to: "/comptabilite",
    icon: Wallet,
    children: [
      { label: "Journal des opérations", to: "/comptabilite", module: "accounting_entries" },
      { label: "Comptes de tiers", to: "/comptabilite/tiers", module: "third_parties" },
      { label: "Rapprochement bancaire", to: "/comptabilite/rapprochement", module: "bank_reconciliation" },
      { label: "Lettrage", to: "/comptabilite/lettrage", module: "accounting_entries" },
    ],
  },
  {
    key: "facturation",
    module: "invoices",
    label: "Facturation",
    to: "/facturation",
    icon: FileText,
    children: [
      { label: "Factures", to: "/facturation", module: "invoices" },
      { label: "Devis", to: "/facturation?tab=devis", module: "quotes" },
      { label: "Avoirs", to: "/facturation?tab=avoirs", module: "credit_notes" },
    ],
  },
  {
    key: "tva",
    module: "vat_declarations",
    label: "Gestion TVA",
    to: "/tva",
    icon: Receipt,
    children: [
      { label: "Déclarations", to: "/tva", module: "vat_declarations" },
      { label: "Historique TVA", to: "/tva?tab=historique", module: "vat_declarations" },
    ],
  },
  {
    key: "paie",
    module: "payroll",
    label: "Paie",
    to: "/paie",
    icon: Briefcase,
    children: [
      { label: "Bulletins", to: "/paie", module: "payroll" },
      { label: "Salariés", to: "/paie?tab=salaries", module: "employees" },
    ],
  },
  {
    key: "reporting",
    module: "reporting",
    label: "Reporting",
    to: "/reporting",
    icon: TrendingUp,
    children: [
      { label: "Bilan", to: "/reporting", module: "reporting" },
      { label: "Compte de résultat", to: "/reporting?tab=cr", module: "reporting" },
      { label: "DSF SYSCOHADA", to: "/reporting?tab=dsf", module: "dsf" },
      { label: "Trésorerie", to: "/reporting?tab=tresorerie", module: "reporting" },
    ],
  },
  {
    key: "documents",
    module: "documents",
    label: "Documents",
    to: "/documents",
    icon: FolderOpen,
    children: [
      { label: "Factures reçues", to: "/documents", module: "documents" },
      { label: "Justificatifs", to: "/documents?tab=just", module: "documents" },
    ],
  },
  {
    key: "parametres",
    module: "company_settings",
    label: "Configuration",
    to: "/parametres",
    icon: Settings,
    children: [
      { label: "Plan comptable", to: "/parametres?tab=plan", module: "chart_of_accounts" },
      { label: "Entreprise", to: "/parametres", module: "company_settings" },
      { label: "Certification e-MECeF", to: "/parametres?tab=mecef", module: "mecef_settings" },
      { label: "Utilisateurs & Rôles", to: "/parametres?tab=users", module: "user_management" },
      { label: "Intégrations", to: "/parametres?tab=integrations", module: "company_settings" },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AppSidebar = ({ open, onClose }: Props) => {
  const [expanded, setExpanded] = useState<string | null>("Comptabilité");

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

  const visibleItems = items
    .filter((item) => {
      const sectorOk = isModuleEnabledForSector(sector, item.key);
      if (!sectorOk) return false;

      if (item.key === "parametres") {
        return isSettingsAccessible;
      }

      if (item.key === "paie") {
        return hasAccess("payroll") || hasAccess("employees");
      }

      return hasAccess(item.module);
    })
    .map((item) => {
      if (!item.children) return item;
      const visibleChildren = item.children.filter((c) => !c.module || hasAccess(c.module));
      return { ...item, children: visibleChildren.length > 0 ? visibleChildren : undefined };
    });

  return (
    <>
      {/* mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-primary-deep/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white p-1 overflow-hidden shadow-glow">
            <img src="/logo.png" alt="Comptia Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-none text-white">Comptia</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Comptabilité PME</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {visibleItems.map((item) => {
              const isOpen = expanded === item.label;
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setExpanded(isOpen ? null : item.label)}
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                      </button>
                      {isOpen && (
                        <ul className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                          {item.children.map((c) => (
                            <li key={c.label}>
                              <NavLink
                                to={c.to}
                                end
                                className="block rounded-md px-3 py-1.5 text-sm text-sidebar-foreground/80 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                activeClassName="!bg-sidebar-accent text-white"
                              >
                                {c.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.to}
                      end
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="!bg-gradient-primary !text-white shadow-glow"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
          <p className="text-xs font-semibold text-white">Plan Pro</p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">12 / 50 factures ce mois</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sidebar-border">
            <div className="h-full w-[24%] rounded-full bg-gradient-primary" />
          </div>
        </div>
      </aside>
    </>
  );
};