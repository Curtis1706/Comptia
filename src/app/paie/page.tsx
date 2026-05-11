import Paie from "@/views/Paie";
import { AppShell } from "@/components/layout/AppShell";
import { Suspense } from "react";

export default function PaiePage() {
  return (
    <AppShell>
      <Suspense fallback={<div>Loading...</div>}>
        <Paie />
      </Suspense>
    </AppShell>
  );
}
