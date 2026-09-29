"use client";

import { useState, type ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-surface-container-lowest font-sans text-ink">
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <AppHeader onOpenSidebar={() => setOpen(true)} />
        <main className="flex-1 w-full bg-surface-container-lowest px-4 lg:px-space-lg py-space-lg animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};