import Index from "@/views/Index";
import { AppShell } from "@/components/layout/AppShell";
import { Suspense } from "react";

export default function Home() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Chargement du tableau de bord...</div>}>
        <Index />
      </Suspense>
    </AppShell>
  );
}
