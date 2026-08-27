"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { deriveTaxGroup, deriveAibRate, toMecefPrice, TAX_GROUP_LABELS } from "@/lib/mecef-mapping";

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
  aib_rate: z.enum(["none", "rate_1", "rate_5"]).default("none"),
  tourist_tax_amount: z.number().min(0).optional().default(0),
  additional_description: z.string().optional(),
  commercial_message: z.string().optional(),
  mecef_original_ref: z.string().optional(),
  lines: z
    .array(
      z.object({
        description: z.string().min(1, "Description requise"),
        quantity: z.number({ invalid_type_error: "Quantité invalide" }).positive(),
        unit_price: z.number({ invalid_type_error: "Prix invalide" }).min(0),
        vat_rate: z.number().min(0).max(100),
        tax_group: z.enum(["A", "B", "C", "D", "E", "F"]).default("B"),
        tax_specific: z.number().min(0).optional().default(0),
        accounting_account: z.string().optional(),
      })
    )
    .min(1, "Au moins une ligne requise"),
});

type FormValues = z.infer<typeof CreateInvoiceSchema>;

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (invoice: any) => void;
  defaultType?: "invoice" | "quote" | "credit_note";
}

export const InvoiceModal = ({
  isOpen,
  onClose,
  onSuccess,
  defaultType = "invoice",
}: InvoiceModalProps) => {
  const [clients, setClients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [company, setCompany] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues: {
      type: defaultType,
      issue_date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      aib_rate: "none",
      tourist_tax_amount: 0,
      lines: [
        {
          description: "",
          quantity: 1,
          unit_price: 0,
          vat_rate: 18,
          tax_group: "B",
          tax_specific: 0,
          accounting_account: "706",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  useEffect(() => {
    if (isOpen) {
      fetcher<any[]>("/api/third-parties?type=client&limit=200")
        .then((res) => setClients(Array.isArray(res) ? res : []))
        .catch(() => toast.error("Erreur lors du chargement des clients"));

      fetcher<any>("/api/company")
        .then((res) => setCompany(res.data || res))
        .catch(console.error);
    }
  }, [isOpen]);

  const isTps = company?.tax_regime === "tps";
  const watchLines = form.watch("lines");
  const watchAibRate = form.watch("aib_rate");
  const watchTouristTax = Number(form.watch("tourist_tax_amount") || 0);
  const selectedClientId = form.watch("client_id");
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Auto-ajustement AIB en fonction de l'IFU du client
  useEffect(() => {
    if (selectedClient) {
      const derived = deriveAibRate(selectedClient.ifu);
      form.setValue("aib_rate", derived);
    }
  }, [selectedClientId, selectedClient, form]);

  const subtotal_ht = watchLines.reduce(
    (acc, line) => acc + (Number(line.quantity) * Number(line.unit_price) || 0),
    0
  );
  const vat_amount = isTps
    ? 0
    : watchLines.reduce(
        (acc, line) =>
          acc +
          (line.tax_group === "B" || line.tax_group === "D"
            ? (Number(line.quantity) * Number(line.unit_price) * (Number(line.vat_rate || 18) / 100))
            : 0),
        0
      );
  const specific_tax_total = watchLines.reduce(
    (acc, line) => acc + Number(line.tax_specific || 0),
    0
  );
  const total_ttc_before_aib = subtotal_ht + vat_amount + specific_tax_total;

  let aib_amount = 0;
  if (watchAibRate === "rate_1") aib_amount = Math.round(subtotal_ht * 0.01);
  else if (watchAibRate === "rate_5") aib_amount = Math.round(subtotal_ht * 0.05);

  const net_to_pay = total_ttc_before_aib + aib_amount + watchTouristTax;

  const currentType = form.watch("type");
  const typeLabel =
    currentType === "invoice" ? "Facture" : currentType === "quote" ? "Devis" : "Avoir";

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        aib_amount,
        tourist_tax_amount: watchTouristTax,
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Nouvelle {typeLabel.toLowerCase()}</DialogTitle>
          <DialogDescription>
            Remplissez les détails ci-dessous. Le calcul TTC et la normalisation DGI e-MECeF sont automatisés.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de document</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="invoice">Facture de vente (FV)</SelectItem>
                        <SelectItem value="quote">Devis</SelectItem>
                        <SelectItem value="credit_note">Facture d'avoir (FA)</SelectItem>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Client</FormLabel>
                      <button
                        type="button"
                        onClick={async () => {
                          const clientName = window.prompt("Nom du nouveau client (ex: Société Bénin Services SARL) :");
                          if (!clientName || !clientName.trim()) return;
                          const clientIfu = window.prompt("IFU du client (13 chiffres, optionnel) :") || undefined;

                          try {
                            const res = await fetch("/api/third-parties", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                name: clientName.trim(),
                                type: "client",
                                ifu: clientIfu?.trim() || undefined,
                              }),
                            });
                            const result = await res.json();
                            if (result.success) {
                              toast.success(`Client « ${result.data.name} » créé`);
                              setClients((prev) => [result.data, ...prev]);
                              field.onChange(result.data.id);
                            } else {
                              toast.error(result.error || "Erreur lors de la création du client");
                            }
                          } catch (e) {
                            toast.error("Erreur de communication");
                          }
                        }}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        + Nouveau client
                      </button>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={clients.length === 0 ? "Aucun client" : "Sélectionnez un client"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} {c.ifu ? `(IFU: ${c.ifu})` : ""}
                          </SelectItem>
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
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                        <SelectItem value="check">Chèque</SelectItem>
                        <SelectItem value="credit_card">Carte bancaire</SelectItem>
                        <SelectItem value="mobile_money_mtn">MTN Mobile Money</SelectItem>
                        <SelectItem value="mobile_money_moov">Moov Money</SelectItem>
                        <SelectItem value="mobile_money_celtiis">Celtiis Cash</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sélecteur AIB DGI */}
              <FormField
                control={form.control}
                name="aib_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AIB (Acompte sur Impôt Assis sur les Bénéfices)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez l'AIB" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Aucun AIB (0%)</SelectItem>
                        <SelectItem value="rate_1">AIB 1% (Client avec IFU valide)</SelectItem>
                        <SelectItem value="rate_5">AIB 5% (Client sans IFU)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Si Facture d'Avoir : Référence de la facture originale */}
              {currentType === "credit_note" && (
                <FormField
                  control={form.control}
                  name="mecef_original_ref"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Référence Facture d'origine (Code MECeF/DGI) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: TEST-E6SE-HHRM-UZZK-JTLU-RULL (24 caractères)"
                          className="font-mono"
                          required
                        />
                      </FormControl>
                      <p className="text-[11px] text-muted-foreground">
                        Obligatoire pour les factures d'avoir (FA). Saisissez le code MECeF à 24 caractères de la facture originale.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* TABLEAU DES LIGNES D'ARTICLES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Lignes de facturation</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      description: "",
                      quantity: 1,
                      unit_price: 0,
                      vat_rate: 18,
                      tax_group: "B",
                      tax_specific: 0,
                      accounting_account: "706",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Ajouter une ligne
                </Button>
              </div>

              <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border text-left">
                      <th className="p-2.5">Désignation</th>
                      <th className="p-2.5 w-20 text-center">Quantité</th>
                      <th className="p-2.5 w-28 text-right">Prix HT</th>
                      <th className="p-2.5 w-40 text-left">Groupe Taxe DGI</th>
                      <th className="p-2.5 w-24 text-right">Taxe Spéc.</th>
                      <th className="p-2.5 w-28 text-right">Total TTC</th>
                      <th className="p-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => {
                      const qty = Number(watchLines[index]?.quantity || 1);
                      const unitHT = Number(watchLines[index]?.unit_price || 0);
                      const group = watchLines[index]?.tax_group || "B";
                      const vatRate = group === "B" || group === "D" ? 18 : 0;
                      const unitTTC = toMecefPrice(unitHT, vatRate);
                      const spec = Number(watchLines[index]?.tax_specific || 0);
                      const rowTotalTTC = unitTTC * qty + spec;

                      return (
                        <tr key={field.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`lines.${index}.description`}
                              render={({ field }) => (
                                <Input {...field} placeholder="Description article / prestation..." className="h-8 text-xs" />
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
                                  step="0.001"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  className="h-8 text-xs text-center"
                                />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`lines.${index}.unit_price`}
                              render={({ field }) => (
                                <div>
                                  <Input
                                    type="number"
                                    step="1"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    className="h-8 text-xs text-right"
                                  />
                                  <p className="text-[10px] text-muted-foreground text-right mt-0.5">
                                    TTC : {formatCFA(unitTTC)}
                                  </p>
                                </div>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`lines.${index}.tax_group`}
                              render={({ field }) => (
                                <select
                                  value={field.value}
                                  onChange={(e) => {
                                    const val = e.target.value as any;
                                    field.onChange(val);
                                    form.setValue(
                                      `lines.${index}.vat_rate`,
                                      val === "B" || val === "D" ? 18 : 0
                                    );
                                  }}
                                  className="w-full h-8 rounded-md border border-input bg-background px-2 text-[11px]"
                                >
                                  <option value="B">B — Taxable 18%</option>
                                  <option value="A">A — Exonéré (0%)</option>
                                  <option value="C">C — Exportation (0%)</option>
                                  <option value="D">D — Régime exception (18%)</option>
                                  <option value="E">E — Régime TPS (0%)</option>
                                  <option value="F">F — Réservé (0%)</option>
                                </select>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`lines.${index}.tax_specific`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  className="h-8 text-xs text-right"
                                />
                              )}
                            />
                          </td>
                          <td className="p-2 text-right font-bold text-xs tabular">
                            {formatCFA(rowTotalTTC)}
                          </td>
                          <td className="p-2 text-center">
                            {fields.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CHAMPS COMPLÉMENTAIRES DGI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
              <FormField
                control={form.control}
                name="additional_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description supplémentaire (3 lignes max)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Ex: Projet Refactoring SaaS — Période Août 2026..."
                        className="text-xs h-16"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commercial_message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message commercial (pied de facture)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Merci pour votre confiance !"
                        className="text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* RÉCAPITULATIF FINANCIER */}
            <div className="flex flex-col items-end gap-1.5 p-4 rounded-xl bg-muted/40 border border-border">
              <div className="flex justify-between w-72 text-xs">
                <span className="text-muted-foreground">Total HT :</span>
                <span className="font-semibold tabular">{formatCFA(subtotal_ht)}</span>
              </div>
              <div className="flex justify-between w-72 text-xs">
                <span className="text-muted-foreground">TVA (SYSCOHADA 4431) :</span>
                <span className="font-semibold tabular">{formatCFA(vat_amount)}</span>
              </div>
              {specific_tax_total > 0 && (
                <div className="flex justify-between w-72 text-xs">
                  <span className="text-muted-foreground">Taxes spécifiques :</span>
                  <span className="font-semibold tabular">{formatCFA(specific_tax_total)}</span>
                </div>
              )}
              {aib_amount > 0 && (
                <div className="flex justify-between w-72 text-xs text-amber-600">
                  <span>AIB ({watchAibRate === "rate_1" ? "1%" : "5%"}) :</span>
                  <span className="font-semibold tabular">{formatCFA(aib_amount)}</span>
                </div>
              )}
              <div className="flex justify-between w-72 text-sm font-bold border-t border-border pt-2 text-primary">
                <span>NET À PAYER :</span>
                <span className="tabular">{formatCFA(net_to_pay)}</span>
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Créer & Normaliser {typeLabel.toLowerCase()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
