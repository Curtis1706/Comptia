import Facturation from "@/views/Facturation";
import { AppShell } from "@/components/layout/AppShell";
import { Suspense } from "react";

export default function FacturationPage() {
  return (
    <AppShell>
      <Suspense fallback={<div>Loading...</div>}>
        <Facturation />
      </Suspense>
    </AppShell>
  );
}
