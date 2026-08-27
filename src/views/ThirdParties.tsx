"use client";

import { useState } from "react";
import { Plus, Search, Users, TrendingUp, TrendingDown, MoreHorizontal, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCFA } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type ThirdPartyType = "all" | "client" | "supplier";

export const ThirdParties = () => {
  const [filter, setFilter] = useState<ThirdPartyType>("all");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["third-parties", filter, debouncedQuery],
    queryFn: () =>
      fetcher(
        `/api/third-parties?limit=100${filter !== "all" ? `&type=${filter}` : ""}${debouncedQuery ? `&search=${debouncedQuery}` : ""}`
      ),
  });

  const items: any[] = Array.isArray(data) ? data : [];

  const tabs: { id: ThirdPartyType; label: string }[] = [
    { id: "all", label: "Tous" },
    { id: "client", label: "Clients" },
    { id: "supplier", label: "Fournisseurs/Prestataires" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comptes de tiers"
        subtitle="Clients et Fournisseurs/Prestataires — soldes et coordonnées"
        actions={
          <Button
            size="sm"
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" /> Nouveau tiers
          </Button>
        }
      />

      {/* Filter tabs */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center gap-1 border-b border-border px-2 pt-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={cn(
                "relative rounded-t-md px-4 py-2.5 text-sm font-medium transition",
                filter === t.id
                  ? "bg-card text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              {filter === t.id && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="border-b border-border p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom, email, IFU…"
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Tiers</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">IFU</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3 text-right">Solde</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={6} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Users className="h-10 w-10 opacity-30" />
                      <p className="text-sm">Aucun tiers enregistré</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Plus className="mr-1 h-4 w-4" /> Créer le premier tiers
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((tp: any) => (
                  <tr
                    key={tp.id}
                    className="border-b border-border last:border-0 transition hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground shrink-0">
                          {tp.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{tp.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {tp.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          tp.type === "client"
                            ? "bg-primary/10 text-primary"
                            : "bg-warning-soft text-warning"
                        )}
                      >
                        {tp.type === "client" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {tp.type === "client" ? "Client" : "Fournisseur"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {tp.ifu || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 shrink-0" />
                        {tp.city || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "tabular font-semibold",
                          (tp.balance ?? 0) > 0
                            ? "text-success"
                            : (tp.balance ?? 0) < 0
                              ? "text-destructive"
                              : "text-muted-foreground"
                        )}
                      >
                        {tp.balance !== undefined
                          ? formatCFA(tp.balance)
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border p-3 text-xs text-muted-foreground">
          {items.length} tiers affichés
        </div>
      </div>

      <ThirdPartyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["third-parties"] });
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

// ─── Modal création tiers ──────────────────────────────────────────────────────

const ThirdPartyModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "client" as "client" | "supplier",
    email: "",
    phone: "",
    ifu: "",
    city: "",
    country: "Bénin",
    address: "",
    payment_terms: 30,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/third-parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Tiers créé avec succès");
        onSuccess();
        setForm({
          name: "", type: "client", email: "", phone: "",
          ifu: "", city: "", country: "Bénin", address: "", payment_terms: 30,
        });
      } else {
        toast.error(result.error || "Erreur lors de la création");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (
    label: string,
    key: keyof typeof form,
    props?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <Input
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        {...props}
      />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Nouveau tiers</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Type</label>
            <div className="flex gap-2">
              {(["client", "supplier"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition",
                    form.type === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {t === "client" ? "Client" : "Fournisseur"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {field("Nom / Raison sociale *", "name", { required: true })}
            {field("Email *", "email", { type: "email", required: true })}
            {field("Téléphone", "phone", { type: "tel" })}
            {field("IFU", "ifu", { placeholder: "13 chiffres" })}
            {field("Ville", "city")}
            {field("Pays", "country")}
          </div>

          {field("Adresse", "address")}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting}>
              Créer le tiers
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ThirdParties;
