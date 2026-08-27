import Link from "next/link";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
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
          <p className="text-sm text-muted-foreground">
            Aucun module n'est actuellement accessible avec votre profil utilisateur.
            Veuillez contacter l'administrateur de votre entreprise pour obtenir les droits requis.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild variant="outline">
            <Link href="/login" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à la page de connexion
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
