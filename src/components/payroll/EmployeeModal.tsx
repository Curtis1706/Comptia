"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCFA } from "@/lib/format";
import { calculatePayroll } from "@/lib/payroll";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

const EmployeeSchema = z.object({
  first_name: z.string().min(1, "Prénom requis"),
  last_name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  position: z.string().min(1, "Poste requis"),
  department: z.string().optional(),
  hire_date: z.string().min(1, "Date d'embauche requise"),
  birth_date: z.string().optional(),
  address: z.string().min(1, "Adresse requise"),
  postal_code: z.string().min(2, "Code postal requis"),
  city: z.string().min(1, "Ville requise"),
  country: z.string().default("Bénin"),
  contract_type: z.enum(["CDI", "CDD", "Stage", "Alternance"]),
  base_salary: z.coerce.number().positive("Le salaire doit être positif"),
  social_security_number: z.string().optional(),
  phone: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof EmployeeSchema>;

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: any;
}

export function EmployeeModal({ isOpen, onClose, onSuccess, employee }: EmployeeModalProps) {
  const [showSSN, setShowSSN] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      contract_type: "CDI",
      country: "Bénin",
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        ...employee,
        hire_date: employee.hire_date ? new Date(employee.hire_date).toISOString().split("T")[0] : "",
        birth_date: employee.birth_date ? new Date(employee.birth_date).toISOString().split("T")[0] : "",
        base_salary: Number(employee.base_salary),
      });
    } else {
      reset({
        contract_type: "CDI",
        country: "Bénin",
        base_salary: 0,
      });
    }
  }, [employee, reset, isOpen]);

  const baseSalary = watch("base_salary") || 0;
  const payroll = baseSalary > 0 ? calculatePayroll(baseSalary) : null;

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      const url = employee ? `/api/payroll/employees/${employee.id}` : "/api/payroll/employees";
      const method = employee ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      toast.success(employee ? "Salarié mis à jour" : "Salarié créé avec succès");
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? "Modifier le salarié" : "Ajouter un nouveau salarié"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input {...register("first_name")} placeholder="Jean" />
              {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input {...register("last_name")} placeholder="Dupont" />
              {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...register("email")} type="email" placeholder="jean.dupont@entreprise.com" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input {...register("phone")} placeholder="+229 ..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Intitulé du poste</Label>
              <Input {...register("position")} placeholder="Comptable" />
              {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Département</Label>
              <Input {...register("department")} placeholder="Finance" />
            </div>
            <div className="space-y-2">
              <Label>Type de contrat</Label>
              <Select
                onValueChange={(v) => setValue("contract_type", v as any)}
                defaultValue={employee?.contract_type || "CDI"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                  <SelectItem value="Alternance">Alternance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date d'embauche</Label>
              <Input {...register("hire_date")} type="date" />
              {errors.hire_date && <p className="text-xs text-destructive">{errors.hire_date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <Label>Salaire de base mensuel brut</Label>
              <Input {...register("base_salary")} type="number" placeholder="0" />
              {errors.base_salary && <p className="text-xs text-destructive">{errors.base_salary.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>N° Sécurité Sociale</Label>
              <div className="relative">
                <Input
                  {...register("social_security_number")}
                  type={showSSN ? "text" : "password"}
                  placeholder="1 80 01 75 ..."
                />
                <button
                  type="button"
                  onClick={() => setShowSSN(!showSSN)}
                  className="absolute right-2 top-2 text-muted-foreground"
                >
                  {showSSN ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {payroll && (
            <div className="rounded-lg bg-primary-soft p-4 text-sm animate-in fade-in slide-in-from-top-2">
              <p className="font-semibold text-primary mb-2">Estimation du bulletin mensuel</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Salaire brut</span>
                  <span className="font-mono">{formatCFA(payroll.gross_salary)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Cotisations salariales</span>
                  <span className="font-mono text-destructive">- {formatCFA(payroll.gross_salary - payroll.net_salary)}</span>
                </div>
                <div className="flex justify-between font-bold border-t mt-1 pt-1">
                  <span>Net à payer</span>
                  <span className="font-mono text-success">{formatCFA(payroll.net_salary)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs mt-2 italic">
                  <span>Coût total employeur</span>
                  <span className="font-mono">{formatCFA(payroll.total_employer_cost)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 border-t pt-4">
             <div className="col-span-2 space-y-2">
                <Label>Adresse</Label>
                <Input {...register("address")} placeholder="Rue du commerce" />
             </div>
             <div className="space-y-2">
                <Label>Code Postal</Label>
                <Input {...register("postal_code")} placeholder="22900" />
             </div>
             <div className="space-y-2">
                <Label>Ville</Label>
                <Input {...register("city")} placeholder="Cotonou" />
             </div>
             <div className="space-y-2">
                <Label>Pays</Label>
                <Input {...register("country")} />
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {employee ? "Mettre à jour" : "Créer le salarié"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
