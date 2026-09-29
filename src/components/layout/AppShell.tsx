"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { cn } from "@/lib/utils";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ceilow_sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    } catch {
      // Ignorer si localStorage non disponible
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("ceilow_sidebar_collapsed", String(next));
      } catch {
        // Ignorer
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-surface-container-lowest font-sans text-ink">
      <AppSidebar
        open={open}
        onClose={() => setOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-all duration-300",
          collapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        <AppHeader onOpenSidebar={() => setOpen(true)} />
        <main className="flex-1 w-full bg-surface-container-lowest px-4 lg:px-space-lg py-space-lg animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};