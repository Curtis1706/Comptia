"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  FileText,
  LayoutDashboard,
  Plus,
  Receipt,
  Search,
  Settings,
  Smile,
  User,
  Wallet,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

export function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Tapez une commande ou recherchez..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <CommandGroup heading="Actions rapides">
          <CommandItem onSelect={() => runCommand(() => router.push("/facturation?action=new"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nouvelle facture</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/comptabilite"))}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Saisir une opération</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Tableau de bord</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/comptabilite"))}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>Comptabilité</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/facturation"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Facturation</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/tva"))}>
            <Receipt className="mr-2 h-4 w-4" />
            <span>Gestion TVA</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/parametres"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
