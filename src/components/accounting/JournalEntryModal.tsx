"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formatCFA } from "@/lib/format";
import { fetcher } from "@/lib/fetcher";
import { AccountCombobox } from "./AccountCombobox";

const CreateJournalEntrySchema = z.object({
  date: z.string().min(1, "Date obligatoire"),
  journal: z.enum(["purchases", "sales", "bank", "cash", "payroll"]),
  description: z.string().min(3, "Description minimum 3 caractères"),
  lines: z.array(z.object({
    account_code: z.string().min(1, "Compte obligatoire"),
    description: z.string().optional(),
    debit: z.number().min(0),
    credit: z.number().min(0),
    third_party: z.string().optional(),
  }))
  .min(2, "Minimum 2 lignes")
  .refine(
    (lines) => {
      const totalDebit = lines.reduce((s, l) => s + (l.debit || 0), 0);
      const totalCredit = lines.reduce((s, l) => s + (l.credit || 0), 0);
      return Math.abs(totalDebit - totalCredit) < 0.01;
    },
    { message: "L'écriture n'est pas équilibrée" }
  ),
});

type FormValues = z.infer<typeof CreateJournalEntrySchema>;

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (entry: any) => void;
}

export const JournalEntryModal = ({ isOpen, onClose, onSuccess }: JournalEntryModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateJournalEntrySchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      journal: "bank",
      description: "",
      lines: [
        { account_code: "", debit: 0, credit: 0, description: "" },
        { account_code: "", debit: 0, credit: 0, description: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  useEffect(() => {
    if (isOpen) {
      fetcher<any>("/api/accounts?limit=500")
        .then((res) => {
          const list = Array.isArray(res) ? res : res?.data || [];
          setAccounts(list);
        })
        .catch(() => toast.error("Erreur lors du chargement du plan comptable"));
    }
  }, [isOpen]);

  const watchLines = form.watch("lines");
  const totalDebit = watchLines.reduce((acc, line) => acc + (line.debit || 0), 0);
  const totalCredit = watchLines.reduce((acc, line) => acc + (line.credit || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference < 0.01 && totalDebit > 0;

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/accounting/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Écriture enregistrée");
        onSuccess(result.data);
        onClose();
        form.reset();
      } else {
        toast.error(result.error || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle écriture comptable</DialogTitle>
          <DialogDescription className="sr-only">Création d'une nouvelle écriture comptable</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="journal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Journal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bank">Banque</SelectItem>
                        <SelectItem value="cash">Caisse</SelectItem>
                        <SelectItem value="purchases">Achats</SelectItem>
                        <SelectItem value="sales">Ventes</SelectItem>
                        <SelectItem value="payroll">Paie</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libellé général</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Paiement facture..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Lignes comptables</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ account_code: "", debit: 0, credit: 0, description: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter une ligne
                </Button>
              </div>

              <div className="border rounded-md overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="p-2 text-left w-64 sm:w-72">N° Compte</th>
                      <th className="p-2 text-left">Libellé ligne</th>
                      <th className="p-2 text-right w-32">Débit</th>
                      <th className="p-2 text-right w-32">Crédit</th>
                      <th className="p-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id} className="border-b last:border-0">
                        <td className="p-2">
                          <FormField
                            control={form.control}
                            name={`lines.${index}.account_code`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <AccountCombobox
                                    accounts={accounts}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Rechercher un compte..."
                                    className="h-8"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="p-2">
                          <FormField
                            control={form.control}
                            name={`lines.${index}.description`}
                            render={({ field }) => (
                              <Input {...field} placeholder="Commentaire..." className="h-8" />
                            )}
                          />
                        </td>
                        <td className="p-2">
                          <FormField
                            control={form.control}
                            name={`lines.${index}.debit`}
                            render={({ field }) => (
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                }}
                                className="h-8 text-right" 
                              />
                            )}
                          />
                        </td>
                        <td className="p-2">
                          <FormField
                            control={form.control}
                            name={`lines.${index}.credit`}
                            render={({ field }) => (
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                }}
                                className="h-8 text-right" 
                              />
                            )}
                          />
                        </td>
                        <td className="p-2">
                          {fields.length > 2 && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 pr-2">
              <div className="flex items-center gap-8 text-sm">
                <div className="flex flex-col items-end">
                  <span className="text-muted-foreground">Total Débit</span>
                  <span className="font-bold tabular">{formatCFA(totalDebit)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-muted-foreground">Total Crédit</span>
                  <span className="font-bold tabular">{formatCFA(totalCredit)}</span>
                </div>
              </div>
              
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                isBalanced ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive"
              )}>
                {isBalanced ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Écriture équilibrée
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Écart : {formatCFA(difference)}
                  </>
                )}
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting || !isBalanced}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer l'écriture
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
