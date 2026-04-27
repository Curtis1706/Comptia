import { Bell, Menu, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Tableau de bord",
  "/comptabilite": "Comptabilité",
  "/facturation": "Facturation",
  "/tva": "Gestion TVA",
  "/paie": "Paie",
  "/reporting": "Reporting",
  "/documents": "Documents",
  "/parametres": "Configuration",
};

interface Props {
  onOpenSidebar: () => void;
}

export const AppHeader = ({ onOpenSidebar }: Props) => {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? "Comptia";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar} aria-label="Ouvrir la navigation">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden flex-col md:flex">
        <p className="text-xs text-muted-foreground">Comptia / Espace ABC</p>
        <h1 className="font-display text-lg font-semibold leading-tight text-foreground">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher facture, client, opération…"
            className="w-72 border-border bg-secondary pl-9"
            aria-label="Recherche globale"
          />
        </div>

        <Button size="sm" className="hidden bg-gradient-primary shadow-sm hover:opacity-90 sm:inline-flex">
          <Plus className="mr-1 h-4 w-4" />
          Nouvelle facture
        </Button>

        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </Button>

        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary py-1 pl-1 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
            SM
          </div>
          <div className="hidden text-left lg:block">
            <p className="text-xs font-semibold leading-tight">Sophie Martin</p>
            <p className="text-[10px] text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};