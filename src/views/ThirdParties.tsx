"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Users,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Building2,
  Eye,
  Edit2,
  UserX,
  UserCheck,
  Trash2,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ThirdPartyDetailDrawer } from "@/components/third-parties/ThirdPartyDetailDrawer";

type ThirdPartyType = "all" | "client" | "supplier";

export const ThirdParties = () => {
  const [filter, setFilter] = useState<ThirdPartyType>("all");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingThirdParty, setEditingThirdParty] = useState<any | null>(null);
  const [selectedDrawerId, setSelectedDrawerId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleOpenDrawer = (id: string) => {
    setSelectedDrawerId(id);
    setIsDrawerOpen(true);
  };

  const handleToggleActive = async (tp: any) => {
    try {
      const res = await fetch(`/api/third-parties/${tp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_active: !tp.is_active }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(
          tp.is_active ? "Tiers désactivé avec succès" : "Tiers réactivé avec succès"
        );
        queryClient.invalidateQueries({ queryKey: ["third-parties"] });
      } else {
        toast.error(result.error || "Erreur lors de la modification");
      }
    } catch {
      toast.error("Erreur réseau");
    }
  };

  const handleDelete = async (tp: any) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer le tiers « ${tp.name} » ?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/third-parties/${tp.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Tiers supprimé avec succès");
        queryClient.invalidateQueries({ queryKey: ["third-parties"] });
      } else {
        toast.error(result.error || "Impossible de supprimer ce tiers");
      }
    } catch {
      toast.error("Erreur réseau lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comptes de tiers"
        subtitle="Clients et Fournisseurs/Prestataires — soldes et coordonnées"
        actions={
          <Button
            size="sm"
            className="bg-primary text-ink hover:opacity-90 font-medium"
            onClick={() => {
              setEditingThirdParty(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Nouveau tiers
          </Button>
        }
      />

      {/* Filter tabs */}
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <div className="flex items-center gap-1 border-b border-border px-2 pt-2 bg-background-secondary/40">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={cn(
                "relative rounded-t-md px-4 py-2.5 text-sm font-medium transition",
                filter === t.id
                  ? "bg-background text-ink font-semibold"
                  : "text-muted hover:text-ink"
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
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom, email, IFU…"
              className="pl-9 bg-background border-border text-ink"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-secondary/60 text-left text-xs font-medium uppercase tracking-wide text-muted">
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
                    <div className="flex flex-col items-center gap-3 text-muted">
                      <Users className="h-10 w-10 opacity-30" />
                      <p className="text-sm">Aucun tiers enregistré</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingThirdParty(null);
                          setIsModalOpen(true);
                        }}
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
                    className="border-b border-border last:border-0 transition hover:bg-background-secondary/40 cursor-pointer"
                    onClick={() => handleOpenDrawer(tp.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-ink shrink-0">
                          {tp.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink flex items-center gap-2">
                            {tp.name}
                            {!tp.is_active && (
                              <span className="text-[10px] rounded px-1.5 py-0.5 bg-background-secondary text-muted">
                                Désactivé
                              </span>
                            )}
                          </p>
                          <p className="truncate text-xs text-muted">
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
                            ? "bg-primary/10 text-ink"
                            : "bg-warning/10 text-warning"
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
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      {tp.ifu || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 shrink-0" />
                        {tp.city || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "tabular-nums font-mono font-semibold",
                          (tp.balance ?? 0) > 0
                            ? "text-ink"
                            : (tp.balance ?? 0) < 0
                              ? "text-error"
                              : "text-muted"
                        )}
                      >
                        {tp.balance !== undefined
                          ? formatCFA(tp.balance)
                          : "—"}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted hover:text-ink"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem
                            onClick={() => handleOpenDrawer(tp.id)}
                            className="cursor-pointer gap-2"
                          >
                            <Eye className="h-4 w-4 text-muted" />
                            <span>Voir le grand livre / Détails</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingThirdParty(tp);
                              setIsModalOpen(true);
                            }}
                            className="cursor-pointer gap-2"
                          >
                            <Edit2 className="h-4 w-4 text-muted" />
                            <span>Modifier</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(tp)}
                            className="cursor-pointer gap-2"
                          >
                            {tp.is_active ? (
                              <>
                                <UserX className="h-4 w-4 text-warning" />
                                <span>Désactiver</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 text-success" />
                                <span>Réactiver</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(tp)}
                            className="cursor-pointer gap-2 text-error focus:text-error"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border p-3 text-xs text-muted">
          {items.length} tiers affiché{items.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Modal Création / Édition Tiers */}
      <ThirdPartyModal
        isOpen={isModalOpen}
        initialData={editingThirdParty}
        onClose={() => {
          setIsModalOpen(false);
          setEditingThirdParty(null);
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["third-parties"] });
          setIsModalOpen(false);
          setEditingThirdParty(null);
        }}
      />

      {/* Tiroir Détails & Grand Livre Auxiliaire */}
      <ThirdPartyDetailDrawer
        thirdPartyId={selectedDrawerId}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDrawerId(null);
        }}
      />
    </div>
  );
};

// ─── Modal création / édition tiers ──────────────────────────────────────────

const ThirdPartyModal = ({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  initialData?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    type: (initialData?.type || "client") as "client" | "supplier",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    ifu: initialData?.ifu || "",
    city: initialData?.city || "",
    country: initialData?.country || "Bénin",
    address: initialData?.address || "",
    payment_terms: initialData?.payment_terms || 30,
  });

  // Re-synchroniser quand initialData change
  useState(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        type: initialData.type || "client",
        email: initialData.email || "",
        phone: initialData.phone || "",
        ifu: initialData.ifu || "",
        city: initialData.city || "",
        country: initialData.country || "Bénin",
        address: initialData.address || "",
        payment_terms: initialData.payment_terms || 30,
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = initialData
        ? `/api/third-parties/${initialData.id}`
        : "/api/third-parties";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(
          initialData ? "Tiers mis à jour avec succès" : "Tiers créé avec succès"
        );
        onSuccess();
      } else {
        toast.error(result.error || "Erreur lors de l'enregistrement");
      }
    } catch {
      toast.error("Une erreur réseau est survenue");
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
      <label className="text-sm font-medium text-ink">{label}</label>
      <Input
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="bg-background border-border text-ink"
        {...props}
      />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-background border-border text-ink" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-ink">
            {initialData ? "Modifier le tiers" : "Nouveau tiers"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-ink">Type</label>
            <div className="flex gap-2">
              {(["client", "supplier"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition",
                    form.type === t
                      ? "border-primary bg-primary/10 text-ink font-semibold"
                      : "border-border text-muted hover:border-primary/50"
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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-primary text-ink hover:opacity-90 font-medium"
              disabled={isSubmitting}
            >
              {initialData ? "Enregistrer" : "Créer le tiers"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ThirdParties;
