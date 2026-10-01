"use client";

import Link from "next/link";
import { ShieldX, LogOut, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { ROLE_LABELS, UserRole } from "@/lib/permissions";

export default function AccessDeniedPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as UserRole | undefined;
  const roleLabel = userRole ? ROLE_LABELS[userRole] || userRole : null;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    if (typeof window !== "undefined") {
      window.location.href = `${window.location.origin}/login`;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-glow">
          <ShieldX className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Accès non autorisé
          </h1>
          {roleLabel && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive">
              Rôle actuel : {roleLabel}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Aucun module n'est actuellement accessible avec votre profil utilisateur.
            Veuillez contacter l'administrateur de votre entreprise pour obtenir les droits requis ou vous reconnecter avec un autre compte.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="destructive"
            className="w-full sm:w-auto inline-flex items-center gap-2 shadow-sm"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" />
              Accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
