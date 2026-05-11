"use client";

import { useState, type ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onOpenSidebar={() => setOpen(true)} />
        <main className="flex-1 px-4 py-6 lg:px-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
};