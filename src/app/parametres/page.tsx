import Parametres from "@/views/Parametres";
import { AppShell } from "@/components/layout/AppShell";
import { Suspense } from "react";

export default function ParametresPage() {
  return (
    <AppShell>
      <Suspense fallback={<div>Loading...</div>}>
        <Parametres />
      </Suspense>
    </AppShell>
  );
}
