"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Plus,
  Send,
  FileText,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Search,
  Download,
  Edit3,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, mutate } from "@/lib/fetcher";
import { formatCFA, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { EmployeeModal } from "@/components/payroll/EmployeeModal";
import { DownloadPayslipButton } from "@/components/payroll/DownloadPayslipButton";
import { EditPayslipModal } from "@/components/payroll/EditPayslipModal";
import { PermissionGate } from "@/components/PermissionGate";
import { usePermissions } from "@/hooks/usePermissions";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { UserAvatar } from "@/components/ui/user-avatar";

const allTabs = [
  { id: "bulletins", label: "Bulletins", module: "payroll" },
  { id: "salaries", label: "Salariés", module: "employees" },
] as const;

export const Paie = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { canRead } = usePermissions();

  const accessibleTabs = allTabs.filter((t) => canRead(t.module as any));
  const requestedTab = searchParams.get("tab") || "bulletins";
  const tab = accessibleTabs.some((t) => t.id === requestedTab)
    ? requestedTab
    : accessibleTabs[0]?.id || "bulletins";

  const currentDate = new Date();
  const [selectedPeriod, setSelectedPeriod] = useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editPayslipId, setEditPayslipId] = useState<string | null>(null);

  // Filtres et pagination pour la Data Table des Salariés
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [contractFilter, setContractFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeePage, setEmployeePage] = useState(1);
  const [employeePageSize, setEmployeePageSize] = useState(10);

  // Pagination pour le tableau des Bulletins
  const [bulletinPage, setBulletinPage] = useState(1);
  const [bulletinPageSize, setBulletinPageSize] = useState(10);

  const setTab = (t: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (t === "bulletins") params.delete("tab");
    else params.set("tab", t);
    router.push(`${pathname}?${params.toString()}`);
  };

  // 1. Récupération réelle des salariés (sans données mock)
  const { data: employeesRes, isLoading: employeesLoading } = useQuery<any>({
    queryKey: ["employees"],
    queryFn: () => fetcher("/api/payroll/employees?limit=100&status=all"),
    enabled: canRead("employees"),
  });

  // 2. Récupération réelle des bulletins de paie de la période
  const { data: payslipsRes, isLoading: payslipsLoading } = useQuery<any>({
    queryKey: ["payslips", selectedPeriod.month, selectedPeriod.year],
    queryFn: () =>
      fetcher(
        `/api/payroll/payslips?month=${selectedPeriod.month}&year=${selectedPeriod.year}&limit=100`
      ),
    enabled: canRead("payroll"),
  });

  const employees: any[] = useMemo(() => {
    if (Array.isArray(employeesRes)) return employeesRes;
    if (employeesRes && Array.isArray(employeesRes.data)) return employeesRes.data;
    return [];
  }, [employeesRes]);

  const payslips: any[] = useMemo(() => {
    if (Array.isArray(payslipsRes)) return payslipsRes;
    if (payslipsRes && Array.isArray(payslipsRes.data)) return payslipsRes.data;
    return [];
  }, [payslipsRes]);

  const totalPayslips = payslips.length;
  const totalPayslipPages = Math.ceil(totalPayslips / bulletinPageSize) || 1;
  const paginatedPayslips = useMemo(() => {
    const start = (bulletinPage - 1) * bulletinPageSize;
    return payslips.slice(start, start + bulletinPageSize);
  }, [payslips, bulletinPage, bulletinPageSize]);

  const activeEmployeesCount = useMemo(() => {
    return employees.filter((e) => e.status === "active").length;
  }, [employees]);

  // Options dynamiques pour la sélection de période (12 derniers mois)
  const periodOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const label = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
      options.push({
        value: `${m}-${y}`,
        month: m,
        year: y,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        monthName: d.toLocaleDateString("fr-FR", { month: "long" }),
      });
    }
    return options;
  }, []);

  const currentSelectedOption =
    periodOptions.find(
      (p) => p.month === selectedPeriod.month && p.year === selectedPeriod.year
    ) || periodOptions[0];

  // Action : Génération automatique des bulletins de la période
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await mutate("/api/payroll/payslips/generate", {
        method: "POST",
        body: JSON.stringify(selectedPeriod),
      });

      if (res.success) {
        toast.success(res.message || "Bulletins de paie générés avec succès");
        queryClient.invalidateQueries({ queryKey: ["payslips"] });
      } else {
        toast.error(res.error || "Erreur lors de la génération des bulletins");
      }
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  // Action : Validation d'un bulletin individuel
  const handleValidatePayslip = async (id: string) => {
    try {
      const res = await mutate(`/api/payroll/payslips/${id}/validate`, {
        method: "POST",
      });
      if (res.success) {
        toast.success("Bulletin de paie validé et écritures générées");
        queryClient.invalidateQueries({ queryKey: ["payslips"] });
      } else {
        toast.error(res.error || "Erreur lors de la validation");
      }
    } catch (e: any) {
      toast.error(e.message || "Erreur réseau lors de la validation");
    }
  };

  // Copie rapide du résumé du bulletin dans le presse-papier
  const handleCopySummary = async (payslip: any) => {
    const emp = payslip.employee;
    const periodLabel = new Date(payslip.year, payslip.month - 1).toLocaleDateString(
      "fr-FR",
      { month: "long", year: "numeric" }
    );
    const summary = [
      `Bulletin de paie — ${periodLabel}`,
      `Salarié : ${emp.first_name} ${emp.last_name}`,
      `Poste : ${emp.position || "Non spécifié"}`,
      `Salaire brut : ${formatCFA(Number(payslip.gross_salary || 0))}`,
      `Salaire net : ${formatCFA(Number(payslip.net_salary || 0))}`,
      `Statut : ${payslip.status === "draft" ? "Brouillon" : "Validé"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Résumé copié dans le presse-papier");
    } catch {
      toast.error("Impossible d'accéder au presse-papier");
    }
  };

  // Filtrage et pagination de la Data Table des Salariés
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const query = employeeSearch.toLowerCase().trim();
      const fullName = `${emp.first_name || ""} ${emp.last_name || ""}`.toLowerCase();
      const pos = (emp.position || "").toLowerCase();
      const email = (emp.email || "").toLowerCase();
      const ssn = (emp.social_security_number || "").toLowerCase();

      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        pos.includes(query) ||
        email.includes(query) ||
        ssn.includes(query);

      const matchesContract =
        contractFilter === "all" || emp.contract_type === contractFilter;

      const matchesStatus =
        statusFilter === "all" || emp.status === statusFilter;

      return matchesSearch && matchesContract && matchesStatus;
    });
  }, [employees, employeeSearch, contractFilter, statusFilter]);

  const totalEmployees = filteredEmployees.length;
  const totalEmployeePages = Math.ceil(totalEmployees / employeePageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (employeePage - 1) * employeePageSize;
    return filteredEmployees.slice(start, start + employeePageSize);
  }, [filteredEmployees, employeePage, employeePageSize]);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE DE PAGE (DESIGN STRICT CONFORME À LA MAQUETTE HTML)            */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink font-sans">
            Paie
          </h1>
          <p className="text-sm text-muted mt-1">
            Gérez vos salariés et générez vos bulletins en un clic
          </p>
        </div>

        <div className="flex items-center gap-3">
          {tab === "bulletins" ? (
            <>
              {/* Sélecteur de période de paie */}
              <div className="relative">
                <select
                  aria-label="Sélectionner la période de paie"
                  value={`${selectedPeriod.month}-${selectedPeriod.year}`}
                  onChange={(e) => {
                    const [m, y] = e.target.value.split("-").map(Number);
                    setSelectedPeriod({ month: m, year: y });
                    setBulletinPage(1);
                  }}
                  className="h-9 pl-3.5 pr-9 bg-background border border-border rounded text-xs font-medium text-ink focus:outline-none focus:border-ink appearance-none cursor-pointer outline-none transition-colors"
                >
                  {periodOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>

              {/* Bouton CTA Principal : Générer les bulletins */}
              <PermissionGate module="payroll" level="write">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || activeEmployeesCount === 0}
                  className="h-9 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-ink font-semibold text-xs rounded border border-ink/20 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-ink" />
                  ) : (
                    <FileText className="w-4 h-4 text-ink" />
                  )}
                  <span>
                    Générer {currentSelectedOption?.monthName || "la période"}
                  </span>
                </button>
              </PermissionGate>
            </>
          ) : (
            /* Action pour l'onglet Salariés */
            <PermissionGate module="employees" level="write">
              <button
                type="button"
                onClick={() => {
                  setSelectedEmployee(null);
                  setIsEmployeeModalOpen(true);
                }}
                className="h-9 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-ink font-semibold text-xs rounded border border-ink/20 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-ink stroke-[2.5]" />
                <span>Nouveau salarié</span>
              </button>
            </PermissionGate>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CONTENEUR PRINCIPAL CARD AVEC ONGLETS (FORMAT CARRÉ ROUNDED DU DESIGN) */}
      {/* ========================================================================= */}
      <div className="w-full bg-background border border-border rounded shadow-sm overflow-hidden">
        {/* Barre des onglets */}
        <div className="flex items-center px-6 border-b border-border bg-background">
          <nav aria-label="Navigation des sections de paie" className="flex items-center gap-8 -mb-[1px]">
            {accessibleTabs.map((t) => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative pb-3 pt-3.5 text-xs font-semibold flex items-center gap-1.5 focus:outline-none transition-colors cursor-pointer",
                    isActive ? "text-ink font-bold" : "text-muted hover:text-ink"
                  )}
                >
                  <span>{t.label}</span>
                  {t.id === "bulletins" && isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  )}
                  {t.id === "salaries" && (
                    <span className="ml-1 text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded bg-background-secondary border border-border text-ink">
                      {employees.length}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ===================================================================== */}
        {/* CONTENU ONGLET 1 : BULLETINS DE PAIE                                 */}
        {/* ===================================================================== */}
        {tab === "bulletins" && (
          <div className="w-full">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background-secondary border-b border-border text-[11px] font-bold tracking-wider text-ink uppercase">
                    <th className="py-3 px-6" scope="col">Salarié</th>
                    <th className="py-3 px-6" scope="col">Période</th>
                    <th className="py-3 px-6 text-right" scope="col">Salaire Brut</th>
                    <th className="py-3 px-6 text-right" scope="col">Salaire Net</th>
                    <th className="py-3 px-6" scope="col">Statut</th>
                    <th className="py-3 px-6 text-right" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payslipsLoading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={6} className="py-4 px-6 bg-background-secondary/40">
                          <div className="h-6 w-full bg-background-secondary rounded" />
                        </td>
                      </tr>
                    ))
                  ) : payslips.length === 0 ? (
                    /* État vide fidèle à la maquette HTML */
                    <tr>
                      <td className="py-20 px-6 text-center" colSpan={6}>
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-11 h-11 rounded border border-border bg-background-secondary flex items-center justify-center text-muted mb-3">
                            <FileText className="w-5 h-5 text-muted" />
                          </div>
                          <p className="text-sm font-semibold text-ink">
                            Aucun bulletin pour cette période.
                          </p>
                          <p className="text-xs text-muted mt-1 mb-5">
                            Les fiches de paie de {currentSelectedOption?.label} n'ont pas encore été calculées pour les{" "}
                            <strong className="font-semibold text-ink font-mono">{activeEmployeesCount}</strong> salariés actifs.
                          </p>
                          <PermissionGate module="payroll" level="write">
                            <button
                              type="button"
                              onClick={handleGenerate}
                              disabled={isGenerating || activeEmployeesCount === 0}
                              className="h-9 px-4 bg-background border border-border hover:bg-background-secondary text-ink font-semibold text-xs rounded flex items-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                            >
                              <FileText className="w-4 h-4 text-ink" />
                              <span>Générer {currentSelectedOption?.monthName || "la période"}</span>
                            </button>
                          </PermissionGate>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedPayslips.map((p) => {
                      const emp = p.employee || {};
                      const isDraft = p.status === "draft";
                      const periodStr = `${String(p.month).padStart(2, "0")}/${p.year}`;

                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-background-secondary/60 transition-colors"
                        >
                          {/* Salarié */}
                          <td className="py-3.5 px-6 text-xs text-ink">
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                name={`${emp.first_name || ""} ${emp.last_name || ""}`}
                                email={emp.email}
                                avatarUrl={emp.avatar_url}
                                size={32}
                                variant="beam"
                                square
                                className="rounded shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-ink truncate">
                                  {emp.first_name} {emp.last_name}
                                </div>
                                <div className="font-mono text-[11px] text-muted truncate">
                                  {emp.position || "Poste non défini"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Période */}
                          <td className="py-3.5 px-6 font-mono text-xs tabular-nums text-ink">
                            {periodStr}
                          </td>

                          {/* Brut */}
                          <td className="py-3.5 px-6 text-right font-mono text-xs tabular-nums text-ink">
                            {formatCFA(Number(p.gross_salary || 0))}
                          </td>

                          {/* Net */}
                          <td className="py-3.5 px-6 text-right font-mono text-xs tabular-nums font-bold text-ink">
                            {formatCFA(Number(p.net_salary || 0))}
                          </td>

                          {/* Statut */}
                          <td className="py-3.5 px-6">
                            {isDraft ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-warning/20 text-warning-deep border border-warning-deep/30">
                                Brouillon
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-success/20 text-success-deep border border-success-deep/30">
                                Validé
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-6 text-right">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              {isDraft && (
                                <PermissionGate module="payroll" level="write">
                                  <button
                                    type="button"
                                    onClick={() => setEditPayslipId(p.id)}
                                    className="text-xs font-semibold text-ink hover:underline px-2 py-1 cursor-pointer"
                                    title="Modifier les primes et retenues"
                                  >
                                    Éditer
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleValidatePayslip(p.id)}
                                    className="text-xs font-semibold text-success-deep hover:underline px-2 py-1 cursor-pointer"
                                    title="Valider définitivement ce bulletin"
                                  >
                                    Valider
                                  </button>
                                </PermissionGate>
                              )}

                              <DownloadPayslipButton
                                payslipId={p.id}
                                employeeName={`${emp.first_name || ""} ${emp.last_name || ""}`}
                                className="h-7 px-2 text-xs font-medium text-ink hover:bg-background-secondary rounded border border-border"
                              />

                              <button
                                type="button"
                                onClick={() => handleCopySummary(p)}
                                className="h-7 w-7 flex items-center justify-center rounded text-muted hover:text-ink hover:bg-background-secondary transition cursor-pointer"
                                title="Copier le résumé"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination du tableau des Bulletins */}
            {totalPayslips > 0 && (
              <DataTablePagination
                currentPage={bulletinPage}
                totalPages={totalPayslipPages}
                totalItems={totalPayslips}
                pageSize={bulletinPageSize}
                onPageChange={(p) => setBulletinPage(p)}
                onPageSizeChange={(sz) => {
                  setBulletinPageSize(sz);
                  setBulletinPage(1);
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                labelSingular="bulletin"
                labelPlural="bulletins"
              />
            )}

            {/* Bandeau inférieur de conformité */}
            <div className="px-6 py-3.5 border-t border-border bg-background-secondary flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-2">
              <div className="flex items-center gap-3">
                <span>
                  Conformité : <strong className="font-semibold text-ink">Code du Travail Béninois</strong>
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>
                  Régime : <strong className="font-semibold text-ink">CNSS &amp; IPTS</strong>
                </span>
              </div>
              <div className="tabular-nums font-mono font-semibold text-ink">
                {payslips.length} bulletin{payslips.length > 1 ? "s" : ""} généré{payslips.length > 1 ? "s" : ""}
                {activeEmployeesCount > 0 && ` sur ${activeEmployeesCount}`}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* CONTENU ONGLET 2 : SALARIÉS — COMPOSANT DATA TABLE (DEMANDE UTILISATEUR) */}
        {/* ===================================================================== */}
        {tab === "salaries" && (
          <div className="w-full">
            {/* Barre de filtres et recherche pour la Data Table des Salariés */}
            <div className="p-4 border-b border-border bg-background flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Recherche */}
                <div className="relative flex-1 max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    value={employeeSearch}
                    onChange={(e) => {
                      setEmployeeSearch(e.target.value);
                      setEmployeePage(1);
                    }}
                    placeholder="Rechercher par nom, matricule, poste, email..."
                    className="pl-9 h-9 text-xs rounded bg-background border-border text-ink placeholder:text-muted focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                {/* Filtre Contrat */}
                <div className="w-full sm:w-44">
                  <select
                    value={contractFilter}
                    onChange={(e) => {
                      setContractFilter(e.target.value);
                      setEmployeePage(1);
                    }}
                    className="w-full h-9 px-3 rounded bg-background border border-border text-xs text-ink focus:outline-none focus:border-ink cursor-pointer"
                  >
                    <option value="all">Tous les contrats</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Alternance">Alternance</option>
                  </select>
                </div>

                {/* Filtre Statut */}
                <div className="w-full sm:w-40">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setEmployeePage(1);
                    }}
                    className="w-full h-9 px-3 rounded bg-background border border-border text-xs text-ink focus:outline-none focus:border-ink cursor-pointer"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>

              <PermissionGate module="employees" level="write">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEmployee(null);
                    setIsEmployeeModalOpen(true);
                  }}
                  className="h-9 px-3.5 bg-primary hover:bg-primary-hover text-ink font-semibold text-xs rounded border border-ink/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm flex-shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Nouveau salarié</span>
                </button>
              </PermissionGate>
            </div>

            {/* Tableau Data Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background-secondary border-b border-border text-[11px] font-bold tracking-wider text-ink uppercase">
                    <th className="py-3 px-6" scope="col">Salarié</th>
                    <th className="py-3 px-6" scope="col">Poste &amp; Département</th>
                    <th className="py-3 px-6" scope="col">Contrat</th>
                    <th className="py-3 px-6 text-right" scope="col">Salaire de Base</th>
                    <th className="py-3 px-6" scope="col">Embauche</th>
                    <th className="py-3 px-6 text-center" scope="col">Bulletins</th>
                    <th className="py-3 px-6" scope="col">Statut</th>
                    <th className="py-3 px-6 text-right" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {employeesLoading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={8} className="py-4 px-6 bg-background-secondary/40">
                          <div className="h-6 w-full bg-background-secondary rounded" />
                        </td>
                      </tr>
                    ))
                  ) : paginatedEmployees.length === 0 ? (
                    <tr>
                      <td className="py-16 px-6 text-center" colSpan={8}>
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-11 h-11 rounded border border-border bg-background-secondary flex items-center justify-center text-muted mb-3">
                            <Users className="w-5 h-5 text-muted" />
                          </div>
                          <p className="text-sm font-semibold text-ink">
                            Aucun salarié trouvé
                          </p>
                          <p className="text-xs text-muted mt-1 mb-4">
                            {employeeSearch || contractFilter !== "all" || statusFilter !== "all"
                              ? "Aucun enregistrement ne correspond aux filtres sélectionnés."
                              : "Vous n'avez pas encore enregistré de salarié pour votre entreprise."}
                          </p>
                          <PermissionGate module="employees" level="write">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedEmployee(null);
                                setIsEmployeeModalOpen(true);
                              }}
                              className="h-8 px-3 rounded bg-primary text-ink border border-ink/20 font-semibold text-xs"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" />
                              Ajouter un salarié
                            </Button>
                          </PermissionGate>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((emp) => {
                      const initials = `${(emp.first_name || "")[0] || ""}${(emp.last_name || "")[0] || ""}`.toUpperCase();
                      const isActive = emp.status === "active";

                      return (
                        <tr
                          key={emp.id}
                          className="hover:bg-background-secondary/60 transition-colors"
                        >
                          {/* Salarié */}
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                name={`${emp.first_name || ""} ${emp.last_name || ""}`}
                                email={emp.email}
                                avatarUrl={emp.avatar_url}
                                size={32}
                                variant="beam"
                                square
                                className="rounded shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-xs text-ink truncate">
                                  {emp.first_name} {emp.last_name}
                                </div>
                                <div className="font-mono text-[11px] text-muted truncate">
                                  {emp.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Poste & Département */}
                          <td className="py-3.5 px-6">
                            <div className="text-xs font-medium text-ink">
                              {emp.position || "Non spécifié"}
                            </div>
                            <div className="text-[11px] text-muted">
                              {emp.department || "Général"}
                            </div>
                          </td>

                          {/* Contrat */}
                          <td className="py-3.5 px-6">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-background-secondary text-ink border border-border">
                              {emp.contract_type}
                            </span>
                          </td>

                          {/* Salaire de Base */}
                          <td className="py-3.5 px-6 text-right font-mono text-xs font-bold tabular-nums text-ink">
                            {formatCFA(Number(emp.base_salary || 0))}
                          </td>

                          {/* Date d'embauche */}
                          <td className="py-3.5 px-6 font-mono text-xs tabular-nums text-muted">
                            {formatDate(emp.hire_date)}
                          </td>

                          {/* Bulletins générés */}
                          <td className="py-3.5 px-6 text-center font-mono text-xs tabular-nums font-semibold text-ink">
                            {emp._count?.payrolls || 0}
                          </td>

                          {/* Statut */}
                          <td className="py-3.5 px-6">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-success/20 text-success-deep border border-success-deep/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-success-deep" />
                                Actif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-background-secondary text-muted border border-border">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                                Inactif
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-6 text-right">
                            <PermissionGate module="employees" level="write">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEmployee(emp);
                                  setIsEmployeeModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-ink hover:underline px-2 py-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-muted" />
                                <span>Modifier</span>
                              </button>
                            </PermissionGate>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination du composant Data Table */}
            {totalEmployees > 0 && (
              <DataTablePagination
                currentPage={employeePage}
                totalPages={totalEmployeePages}
                totalItems={totalEmployees}
                pageSize={employeePageSize}
                onPageChange={(p) => setEmployeePage(p)}
                onPageSizeChange={(sz) => {
                  setEmployeePageSize(sz);
                  setEmployeePage(1);
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                labelSingular="salarié"
                labelPlural="salariés"
              />
            )}
          </div>
        )}
      </div>

      {/* Modal d'ajout / modification de salarié */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["employees"] });
          queryClient.invalidateQueries({ queryKey: ["payslips"] });
        }}
        employee={selectedEmployee}
      />

      {/* Modal d'édition des lignes de bulletin de paie */}
      <EditPayslipModal
        isOpen={!!editPayslipId}
        onClose={() => setEditPayslipId(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["payslips"] })}
        payslipId={editPayslipId}
      />
    </div>
  );
};

export default Paie;