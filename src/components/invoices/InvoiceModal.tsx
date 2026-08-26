"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatCFA } from "@/lib/format";
import { fetcher } from "@/lib/fetcher";

const CreateInvoiceSchema = z.object({
  type: z.enum(["invoice", "quote", "credit_note"]),
  client_id: z.string().min(1, "Client obligatoire"),
  issue_date: z.string().min(1, "Date d'émission obligatoire"),
  due_date: z.string().min(1, "Date d'échéance obligatoire"),
  payment_method: z
    .enum([
      "cash",
      "bank_transfer",
      "check",
      "mobile_money_mtn",
      "mobile_money_moov",
      "mobile_money_celtiis",
      "credit_card",
      "western_union",
      "other",
    ])
    .optional(),
  notes: z.string().optional(),
  mecef_dgi_code: z.string().optional(),
  mecef_nim: z.string().optional(),
  mecef_status: z.enum(["draft", "awaiting_manual_normalization", "normalized", "verification_failed"]).optional().default("draft"),
  lines: z.array(z.object({
    description: z.string().min(1, "Description requise"),
    quantity: z.number({ invalid_type_error: "Quantité invalide" }).positive(),
    unit_price: z.number({ invalid_type_error: "Prix invalide" }).min(0),
    vat_rate: z.number().min(0).max(100),
    accounting_account: z.string().optional(),
  })).min(1, "Au moins une ligne requise"),
});

type FormValues = z.infer<typeof CreateInvoiceSchema>;

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (invoice: any) => void;
  defaultType?: "invoice" | "quote" | "credit_note";
}

export const InvoiceModal = ({ isOpen, onClose, onSuccess, defaultType = "invoice" }: InvoiceModalProps) => {
  const [clients, setClients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues: {
      type: defaultType,
      issue_date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      lines: [{ description: "", quantity: 1, unit_price: 0, vat_rate: 18, accounting_account: "706" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetcher<any[]>("/api/third-parties?type=client&limit=200")
        .then((res) => setClients(Array.isArray(res) ? res : []))
        .catch(() => toast.error("Erreur lors du chargement des clients"));
        
      fetcher<any>("/api/company")
        .then((res) => setCompany(res.data))
        .catch(console.error);
    }
  }, [isOpen]);

  const isTps = company?.tax_regime === "tps";

  const watchLines = form.watch("lines");
  const subtotal_ht = watchLines.reduce((acc, line) => acc + (line.quantity * line.unit_price || 0), 0);
  const vat_amount = isTps ? 0 : watchLines.reduce((acc, line) => acc + (line.quantity * line.unit_price * (line.vat_rate / 100) || 0), 0);
  const total_ttc = subtotal_ht + vat_amount;

  const currentType = form.watch("type");
  const typeLabel = currentType === "invoice" ? "Facture" : currentType === "quote" ? "Devis" : "Avoir";
  const linesLabel = currentType === "invoice" ? "Lignes de facture" : currentType === "quote" ? "Lignes du devis" : "Lignes de l'avoir";

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`${typeLabel} créée avec succès`);
        onSuccess(result.data);
        onClose();
        form.reset();
      } else {
        toast.error(result.error || "Erreur lors de la création");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentType === "invoice" ? "Nouvelle Facture" : 
             currentType === "quote" ? "Nouveau Devis" : "Nouvel Avoir"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="invoice">Facture</SelectItem>
                        <SelectItem value="quote">Devis</SelectItem>
                        <SelectItem value="credit_note">Avoir</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issue_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'émission</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'échéance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de paiement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mobile_money_mtn">MTN Mobile Money (MoMo)</SelectItem>
                        <SelectItem value="mobile_money_moov">Moov Money (Moov Africa)</SelectItem>
                        <SelectItem value="mobile_money_celtiis">Celtiis Cash / Money</SelectItem>
                        <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="check">Chèque</SelectItem>
                        <SelectItem value="credit_card">Carte bancaire</SelectItem>
                        <SelectItem value="western_union">Western Union / Transfert</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Notes ou conditions de paiement..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isTps && currentType === "invoice" && (
                <>
                  <div className="md:col-span-2 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Normalisation SyGMEF / e-MECeF</h4>
                    <p className="text-xs text-muted-foreground mb-4">
                      Les références MECeF/DGI et NIM sont renseignées manuellement après normalisation ou vérification via les services officiels de la DGI.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="mecef_dgi_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code MECeF/DGI</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ex: ABCDEF-1234..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mecef_nim"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>NIM de la machine</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ex: BJ12345678" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mecef_status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Statut MECeF</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez un statut" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Brouillon</SelectItem>
                                <SelectItem value="awaiting_manual_normalization">En attente de normalisation manuelle</SelectItem>
                                <SelectItem value="normalized">Normalisée</SelectItem>
                                <SelectItem value="verification_failed">Échec de vérification</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{linesLabel}</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ description: "", quantity: 1, unit_price: 0, vat_rate: 18, accounting_account: "706" })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter une ligne
                </Button>
              </div>

              <div className="border rounded-md">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-right w-20">Qté</th>
                      <th className="p-2 text-right w-32">Prix HT</th>
                      {!isTps && <th className="p-2 text-right w-20">TVA %</th>}
                      <th className="p-2 text-right w-32">Total HT</th>
                      <th className="p-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id} className="border-b last:border-0">
                        <td className="p-2">
                          <FormField
                            control={form.control}
                            name={`lines.${index}.description`}
                            render={({ field }) => (
                              <Input {...field} placeholder="Prestation..." className="h-8" />
                            )}
                          />
                        </td>
                        <td className="p-2">
                          <FormField
                            control={form.control}
                            name={`lines.${index}.quantity`}
                            render={({ field }) => (
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                className="h-8 text-right" 
                              />
                            )}
                          />
                        </td>
                        <td className="p-2">
                          <FormField
                            control={form.control}
                            name={`lines.${index}.unit_price`}
                            render={({ field }) => (
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                className="h-8 text-right" 
                              />
                            )}
                          />
                        </td>
                        {!isTps && (
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`lines.${index}.vat_rate`}
                              render={({ field }) => (
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  className="h-8 text-right" 
                                />
                              )}
                            />
                          </td>
                        )}
                        <td className="p-2 text-right tabular">
                          {formatCFA((watchLines[index]?.quantity || 0) * (watchLines[index]?.unit_price || 0))}
                        </td>
                        <td className="p-2">
                          {fields.length > 1 && (
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

            <div className="flex flex-col items-end gap-2 pr-2">
              <div className="flex justify-between w-64 text-sm">
                <span className="text-muted-foreground">Total HT :</span>
                <span className="font-medium tabular">{formatCFA(subtotal_ht)}</span>
              </div>
              {isTps ? (
                <div className="flex justify-between w-64 text-sm text-muted-foreground italic">
                  <span>TVA :</span>
                  <span>Non applicable (TPS)</span>
                </div>
              ) : (
                <div className="flex justify-between w-64 text-sm">
                  <span className="text-muted-foreground">TVA :</span>
                  <span className="font-medium tabular">{formatCFA(vat_amount)}</span>
                </div>
              )}
              <div className="flex justify-between w-64 text-lg font-bold border-t pt-2">
                <span>Total TTC :</span>
                <span className="tabular text-primary">{formatCFA(total_ttc)}</span>
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting || !form.formState.isValid}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer {typeLabel.toLowerCase()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
