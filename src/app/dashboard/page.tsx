import { Dashboard } from "@/views/Dashboard";
import { AppShell } from "@/components/layout/AppShell";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        </div>
      }>
        <Dashboard />
      </Suspense>
    </AppShell>
  );
}
