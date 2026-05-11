import Reporting from "@/views/Reporting";
import { AppShell } from "@/components/layout/AppShell";
import { Suspense } from "react";

export default function ReportingPage() {
  return (
    <AppShell>
      <Suspense fallback={<div>Loading...</div>}>
        <Reporting />
      </Suspense>
    </AppShell>
  );
}
