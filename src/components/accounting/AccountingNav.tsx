"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Wallet, Link2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";

const ACCOUNTING_TABS = [
  {
    label: "Journal des opérations",
    href: "/comptabilite",
    icon: BookOpen,
    module: "accounting_entries" as const,
  },
  {
    label: "Trésorerie & Rapprochement",
    href: "/comptabilite/rapprochement",
    icon: Wallet,
    module: "bank_reconciliation" as const,
  },
  {
    label: "Lettrage des tiers",
    href: "/comptabilite/lettrage",
    icon: Link2,
    module: "accounting_entries" as const,
  },
  {
    label: "Comptes tiers",
    href: "/comptabilite/tiers",
    icon: Users,
    module: "third_parties" as const,
  },
];

export function AccountingNav() {
  const pathname = usePathname();
  const { hasAccess } = usePermissions();

  return (
    <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto scrollbar-none font-sans">
      {ACCOUNTING_TABS.map((tab) => {
        if (!hasAccess(tab.module)) return null;

        const Icon = tab.icon;
        const isActive =
          tab.href === "/comptabilite"
            ? pathname === "/comptabilite"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t border-b-2 whitespace-nowrap transition-colors",
              isActive
                ? "border-primary text-ink bg-background-secondary/60 font-bold"
                : "border-transparent text-text-muted hover:text-ink hover:bg-background-secondary/30"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-text-muted")} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
