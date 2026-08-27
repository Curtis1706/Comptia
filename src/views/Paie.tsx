"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Plus, Send, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, mutate } from "@/lib/fetcher";
import { formatCFA } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { EmployeeModal } from "@/components/payroll/EmployeeModal";
import { DownloadPayslipButton } from "@/components/payroll/DownloadPayslipButton";
import { EditPayslipModal } from "@/components/payroll/EditPayslipModal";
import { PermissionGate } from "@/components/PermissionGate";
import { usePermissions } from "@/hooks/usePermissions";

const allTabs = [
  { id: "bulletins", label: "Bulletins", module: "payroll" },
  { id: "salaries", label: "Salariés", module: "employees" },
] as const;

export const Paie = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { canRead, canWrite } = usePermissions();

  const accessibleTabs = allTabs.filter((t) => canRead(t.module as any));
  const requestedTab = searchParams.get("tab") || "bulletins";
  const tab = accessibleTabs.some((t) => t.id === requestedTab)
    ? requestedTab
    : accessibleTabs[0]?.id || "bulletins";

  const [selectedPeriod, setSelectedPeriod] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editPayslipId, setEditPayslipId] = useState<string | null>(null);

  const setTab = (t: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (t === "bulletins") params.delete("tab");
    else params.set("tab", t);
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data: employeesRes, isLoading: employeesLoading } = useQuery<any>({
    queryKey: ["employees", tab],
    queryFn: () => fetcher("/api/payroll/employees"),
    enabled: tab === "salaries" && canRead("employees"),
  });

  const { data: payslipsRes, isLoading: payslipsLoading } = useQuery<any>({
    queryKey: ["payslips", selectedPeriod],
    queryFn: () => fetcher(`/api/payroll/payslips?month=${selectedPeriod.month}&year=${selectedPeriod.year}`),
    enabled: tab === "bulletins" && canRead("payroll"),
  });

  const employees = Array.isArray(employeesRes) ? employeesRes : [];
  const payslips = Array.isArray(payslipsRes) ? payslipsRes : [];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await mutate("/api/payroll/payslips/generate", {
        method: "POST",
        body: JSON.stringify(selectedPeriod),
      });

      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ["payslips"] });
      } else {
        toast.error(res.error);
      }
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleValidatePayslip = async (id: string) => {
    try {
      const res = await mutate(`/api/payroll/payslips/${id}/validate`, {
        method: "POST",
      });
      if (res.success) {
        toast.success("Bulletin validé");
        queryClient.invalidateQueries({ queryKey: ["payslips"] });
      } else {
        toast.error(res.error);
      }
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la validation");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paie"
        subtitle="Gérez vos salariés et générez vos bulletins en un clic"
        actions={
          tab === "salaries" ? (
            <PermissionGate module="employees" level="write">
              <Button 
                size="sm" 
                className="bg-gradient-primary hover:opacity-90 shadow-glow"
                onClick={() => {
                  setSelectedEmployee(null);
                  setIsEmployeeModalOpen(true);
                }}
              >
                <Plus className="mr-1 h-4 w-4" /> Nouveau salarié
              </Button>
            </PermissionGate>
          ) : (
            <div className="flex gap-2">
               <SelectPeriod 
                 period={selectedPeriod} 
                 onChange={setSelectedPeriod} 
               />
               <PermissionGate module="payroll" level="write">
                 <Button 
                  size="sm" 
                  className="bg-gradient-primary hover:opacity-90 shadow-glow"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                 >
                  {isGenerating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <FileText className="mr-1 h-4 w-4" />}
                  Générer {new Date(selectedPeriod.year, selectedPeriod.month - 1).toLocaleDateString("fr-FR", { month: "long" })}
                 </Button>
               </PermissionGate>
            </div>
          )
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center gap-1 border-b border-border px-2 pt-2">
          {accessibleTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative rounded-t-md px-4 py-2.5 text-sm font-medium transition",
                tab === t.id ? "bg-card text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        {tab === "bulletins" ? (
          <BulletinsTable 
            payslips={payslips} 
            loading={payslipsLoading} 
            onValidate={handleValidatePayslip}
            onEdit={(id) => setEditPayslipId(id)}
          />
        ) : (
          <SalariesGrid 
            employees={employees} 
            loading={employeesLoading} 
            onEdit={(emp) => {
              setSelectedEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
          />
        )}
      </div>

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["employees"] })}
        employee={selectedEmployee}
      />

      <EditPayslipModal
        isOpen={!!editPayslipId}
        onClose={() => setEditPayslipId(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["payslips"] })}
        payslipId={editPayslipId}
      />
    </div>
  );
};

const SelectPeriod = ({ period, onChange }: { period: any; onChange: (p: any) => void }) => {
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  return (
    <select 
      className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      value={period.month}
      onChange={(e) => onChange({ ...period, month: parseInt(e.target.value) })}
    >
      {months.map((m, i) => (
        <option key={m} value={i + 1}>{m}</option>
      ))}
    </select>
  );
};

const SendPayslipButton = ({ payslip }: { payslip: any }) => {
  const handleSend = async () => {
    const emp = payslip.employee;
    const period = new Date(payslip.year, payslip.month - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    const text = [
      `Bulletin de paie – ${period}`,
      `Salarié : ${emp.first_name} ${emp.last_name}`,
      `Poste : ${emp.position}`,
      `Salaire brut : ${formatCFA(payslip.gross_salary)}`,
      `Salaire net : ${formatCFA(payslip.net_salary)}`,
      `Statut : ${payslip.status === "draft" ? "Brouillon" : payslip.status === "validated" ? "Validé" : "Traité"}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Résumé copié dans le presse-papier", {
        description: "Collez-le dans un e-mail ou un message.",
      });
    } catch {
      toast.error("Impossible d'accéder au presse-papier");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleSend}
      title="Copier le résumé"
    >
      <Send className="h-4 w-4" />
    </Button>
  );
};

const BulletinsTable = ({ payslips, loading, onValidate, onEdit }: { payslips: any[]; loading: boolean; onValidate: (id: string) => void; onEdit: (id: string) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <th className="px-4 py-3">Salarié</th>
          <th className="px-4 py-3">Période</th>
          <th className="px-4 py-3 text-right">Salaire brut</th>
          <th className="px-4 py-3 text-right">Salaire net</th>
          <th className="px-4 py-3">Statut</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          [...Array(3)].map((_, i) => (
            <tr key={i} className="border-b border-border animate-pulse">
              <td colSpan={6} className="px-4 py-6 bg-muted/20" />
            </tr>
          ))
        ) : payslips.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
              Aucun bulletin pour cette période.
            </td>
          </tr>
        ) : (
          payslips.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                    {p.employee.first_name[0]}{p.employee.last_name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{p.employee.first_name} {p.employee.last_name}</p>
                    <p className="text-xs text-muted-foreground">{p.employee.position}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(p.year, p.month - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </td>
              <td className="px-4 py-3 text-right tabular">{formatCFA(p.gross_salary)}</td>
              <td className="px-4 py-3 text-right font-semibold tabular">{formatCFA(p.net_salary)}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                    p.status === "validated" || p.status === "processed"
                      ? "bg-success-soft text-success"
                      : "bg-warning-soft text-warning"
                  )}
                >
                  {p.status === "draft" ? "Brouillon" : p.status === "validated" ? "Validé" : "Traité"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  {p.status === "draft" && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(p.id)} title="Éditer le bulletin">
                        Éditer
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-success" onClick={() => onValidate(p.id)} title="Valider le bulletin">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <DownloadPayslipButton
                    payslipId={p.id}
                    employeeName={`${p.employee.first_name} ${p.employee.last_name}`}
                  />
                  <SendPayslipButton payslip={p} />
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const SalariesGrid = ({ employees, loading, onEdit }: { employees: any[]; loading: boolean; onEdit: (emp: any) => void }) => (
  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
    {loading ? (
      [...Array(3)].map((_, i) => (
        <div key={i} className="h-40 rounded-xl border border-border bg-muted animate-pulse" />
      ))
    ) : employees.length === 0 ? (
       <div className="col-span-full py-12 text-center text-muted-foreground">
         Aucun salarié enregistré.
       </div>
    ) : (
      employees.map((e) => (
        <div
          key={e.id}
          className="rounded-xl border border-border bg-gradient-subtle p-5 transition hover:shadow-elevated"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
              {e.first_name[0]}{e.last_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{e.first_name} {e.last_name}</p>
              <p className="text-xs text-muted-foreground truncate">{e.position}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-md bg-card p-2.5">
              <p className="text-muted-foreground">Brut</p>
              <p className="mt-0.5 font-semibold tabular">{formatCFA(e.base_salary)}</p>
            </div>
            <div className="rounded-md bg-card p-2.5">
              <p className="text-muted-foreground">Bulletins</p>
              <p className="mt-0.5 font-semibold tabular text-primary">{e._count?.payrolls || 0}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {e.contract_type}
            </span>
            <Button variant="ghost" size="sm" onClick={() => onEdit(e)}>
              Modifier →
            </Button>
          </div>
        </div>
      ))
    )}
  </div>
);

export default Paie;