"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface AccountOption {
  code: string;
  name: string;
  type?: string;
  is_postable?: boolean;
}

interface AccountComboboxProps {
  accounts: AccountOption[];
  value?: string;
  onChange: (code: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AccountCombobox({
  accounts = [],
  value = "",
  onChange,
  placeholder = "Sélectionner un compte...",
  className,
  disabled = false,
}: AccountComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selectedAccount = React.useMemo(() => {
    return accounts.find((acc) => acc.code === value);
  }, [accounts, value]);

  // Filtrage intelligent par code ou libellé
  const filteredAccounts = React.useMemo(() => {
    if (!search.trim()) return accounts;
    const query = search.toLowerCase().trim();
    return accounts.filter(
      (acc) =>
        acc.code.toLowerCase().includes(query) ||
        acc.name.toLowerCase().includes(query)
    );
  }, [accounts, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-9 px-3 text-left font-normal border-input hover:bg-muted/50 transition-colors",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            {selectedAccount ? (
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                  {selectedAccount.code}
                </span>
                <span className="truncate text-xs font-medium text-foreground">
                  {selectedAccount.name}
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] sm:w-[420px] p-0 shadow-elevated z-50" align="start">
        <Command shouldFilter={false} className="max-h-[350px]">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Taper un code (ex: 585) ou nom (ex: Mobile)..."
              className="flex h-8 w-full rounded-md bg-transparent text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded bg-muted"
              >
                Effacer
              </button>
            )}
          </div>
          <CommandList className="max-h-[280px] overflow-y-auto p-1">
            {filteredAccounts.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                Aucun compte SYSCOHADA correspondant à « {search} »
              </div>
            ) : (
              <CommandGroup heading={`Comptes disponibles (${filteredAccounts.length})`}>
                {filteredAccounts.map((acc) => {
                  const isSelected = acc.code === value;
                  const isNonPostable = acc.is_postable === false;
                  return (
                    <CommandItem
                      key={acc.code}
                      value={acc.code}
                      disabled={isNonPostable}
                      onSelect={() => {
                        if (isNonPostable) return;
                        onChange(acc.code);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-2 text-xs rounded-md transition",
                        isNonPostable
                          ? "opacity-50 cursor-not-allowed bg-muted/30"
                          : "cursor-pointer hover:bg-accent",
                        isSelected && "bg-primary-soft/50 font-medium"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-foreground shrink-0 text-[11px]">
                          {acc.code}
                        </span>
                        <span className="truncate text-xs text-foreground">
                          {acc.name}
                        </span>
                        {isNonPostable && (
                          <span className="text-[10px] italic text-muted-foreground shrink-0">
                            (compte de regroupement)
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-primary ml-2" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
