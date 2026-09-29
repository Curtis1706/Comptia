"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Trash2,
  Loader2,
  Check,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  HelpCircle,
  FileText,
  Receipt,
  X,
  ShieldCheck,
  Building2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { deriveAibRate, toMecefPrice } from "@/lib/mecef-mapping";
import { enqueueInvoice } from "@/lib/offline-queue";

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
        quantity: z.number({ invalid_type_error: "Quantité invalide" }).positive("Quantité supérieure à 0 requise"),
        unit_price: z.number({ invalid_type_error: "Prix invalide" }).min(0, "Prix positif requis"),
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [clients, setClients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [company, setCompany] = useState<any>(null);

  // Gestion du formulaire de création rapide de client dans la modale
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: "",
    ifu: "",
    email: "",
    phone: "",
    city: "Cotonou",
    address: "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues: {
      type: defaultType,
      client_id: "",
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
      setCurrentStep(1);
      setIsCreatingClient(false);
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

  // Auto-ajustement de l'AIB en fonction de l'IFU du client
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
    currentType === "invoice" ? "Facture de vente" : currentType === "quote" ? "Devis" : "Facture d'avoir";

  // Création du client directement au sein de la modale (sans aucun window.prompt)
  const handleCreateClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientData.name.trim()) {
      toast.error("Veuillez renseigner le nom du client");
      return;
    }

    if (newClientData.ifu.trim() && !/^\d{13}$/.test(newClientData.ifu.trim())) {
      toast.error("L'IFU doit comporter exactement 13 chiffres");
      return;
    }

    setIsSavingClient(true);
    try {
      // Si l'email n'est pas renseigné, générer un email professionnel valide pour satisfaire la contrainte schéma
      const safeEmail =
        newClientData.email.trim() ||
        `contact@${newClientData.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]/g, "") || "client"}.bj`;

      const res = await fetch("/api/third-parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newClientData.name.trim(),
          type: "client",
          ifu: newClientData.ifu.trim() || undefined,
          email: safeEmail,
          phone: newClientData.phone.trim() || undefined,
          city: newClientData.city.trim() || "Cotonou",
          address: newClientData.address.trim() || "",
        }),
      });

      const result = await res.json();
      if (result.success && result.data) {
        toast.success(`Client « ${result.data.name} » enregistré avec succès`);
        setClients((prev) => [result.data, ...prev]);
        form.setValue("client_id", result.data.id, { shouldValidate: true });
        setIsCreatingClient(false);
        setNewClientData({
          name: "",
          ifu: "",
          email: "",
          phone: "",
          city: "Cotonou",
          address: "",
        });
      } else {
        toast.error(result.error || "Erreur lors de la création du client");
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsSavingClient(false);
    }
  };

  // Validation par étape pour progresser dans le stepper
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger([
        "type",
        "client_id",
        "issue_date",
        "due_date",
        ...(currentType === "credit_note" ? (["mecef_original_ref"] as const) : []),
      ]);
      if (!isValid) {
        toast.error("Veuillez renseigner les champs requis de l'étape 1");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await form.trigger(["lines"]);
      if (!isValid) {
        toast.error("Veuillez renseigner au moins une ligne avec description et prix");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        aib_amount,
        tourist_tax_amount: watchTouristTax,
      };

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        enqueueInvoice(payload as Record<string, unknown>);
        toast.info("Facture enregistrée en local. Elle sera transmise dès le retour du réseau.");
        onClose();
        form.reset();
        return;
      }

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`${typeLabel} créée et normalisée e-MECeF`);
        onSuccess(result.data);
        onClose();
        form.reset();
      } else {
        toast.error(result.error || "Erreur lors de la création");
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const payload = {
          ...values,
          aib_amount,
          tourist_tax_amount: watchTouristTax,
        };
        enqueueInvoice(payload as Record<string, unknown>);
        toast.warning(
          "Pas de connexion Internet. La facture a été sauvegardée en local et sera transmise dès le retour du réseau."
        );
        onClose();
        form.reset();
      } else {
        toast.error("Une erreur inattendue est survenue");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-background border border-border p-0 gap-0 shadow-2xl">
        {/* En-tête de la modale */}
        <div className="p-space-lg border-b border-border bg-background-secondary/50">
          <DialogHeader className="text-left">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-ink flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-ink" />
                  <span>Nouvelle facture</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-text-muted mt-1">
                  Processus guidé en 3 étapes. Normalisation DGI e-MECeF Bénin automatisée.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Stepper Multi-Étapes conforme aux règles UX Ceilow & standards 21st.dev */}
          <div className="grid grid-cols-3 gap-2 mt-space-md pt-2 border-t border-border">
            {/* Étape 1 */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 text-left p-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? "bg-primary/20 text-ink font-bold"
                  : currentStep > 1
                  ? "text-ink hover:bg-background-secondary"
                  : "text-text-muted cursor-not-allowed"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  currentStep === 1
                    ? "bg-primary text-ink font-bold"
                    : currentStep > 1
                    ? "bg-success text-ink font-bold"
                    : "bg-border text-text-muted"
                }`}
              >
                {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-tight">Client & Dates</p>
                <p className="text-[10px] text-text-muted">Destinataire et conditions</p>
              </div>
            </button>

            {/* Étape 2 */}
            <button
              type="button"
              onClick={() => {
                if (form.getValues("client_id")) setCurrentStep(2);
              }}
              className={`flex items-center gap-2 text-left p-2 rounded-lg transition-colors ${
                currentStep === 2
                  ? "bg-primary/20 text-ink font-bold"
                  : currentStep > 2
                  ? "text-ink hover:bg-background-secondary"
                  : "text-text-muted cursor-not-allowed"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  currentStep === 2
                    ? "bg-primary text-ink font-bold"
                    : currentStep > 2
                    ? "bg-success text-ink font-bold"
                    : "bg-border text-text-muted"
                }`}
              >
                {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-tight">Prestations</p>
                <p className="text-[10px] text-text-muted">Articles et taxes DGI</p>
              </div>
            </button>

            {/* Étape 3 */}
            <button
              type="button"
              onClick={() => {
                if (form.getValues("client_id") && form.getValues("lines")?.length) setCurrentStep(3);
              }}
              className={`flex items-center gap-2 text-left p-2 rounded-lg transition-colors ${
                currentStep === 3
                  ? "bg-primary/20 text-ink font-bold"
                  : "text-text-muted cursor-not-allowed"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  currentStep === 3
                    ? "bg-primary text-ink font-bold"
                    : "bg-border text-text-muted"
                }`}
              >
                3
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-tight">Récapitulatif</p>
                <p className="text-[10px] text-text-muted">Net à payer et envoi DGI</p>
              </div>
            </button>
          </div>
        </div>

        {/* Corps du formulaire */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-space-lg flex flex-col gap-space-lg">
            {/* ============================================================ */}
            {/* ÉTAPE 1 : CLIENT, TYPE DE DOCUMENT ET CONDITIONS             */}
            {/* ============================================================ */}
            {currentStep === 1 && (
              <div className="space-y-space-md">
                {/* Sous-panneau de création rapide de client (INLINE DANS LA MODALE) */}
                {isCreatingClient ? (
                  <div className="p-space-md rounded-xl bg-background-secondary border border-border flex flex-col gap-space-md animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-ink" />
                        <h4 className="text-sm font-bold text-ink">Nouveau client</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCreatingClient(false)}
                        className="text-text-muted hover:text-ink transition-colors p-1"
                        title="Fermer le formulaire client"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-medium text-ink mb-1">
                          Nom du client ou Raison sociale *
                        </label>
                        <Input
                          placeholder="Ex: Société Bénin Services SARL"
                          value={newClientData.name}
                          onChange={(e) =>
                            setNewClientData((prev) => ({ ...prev, name: e.target.value }))
                          }
                          className="h-8 text-xs bg-background"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-ink mb-1">
                          Numéro IFU (13 chiffres)
                        </label>
                        <Input
                          placeholder="Ex: 3201912345678"
                          maxLength={13}
                          value={newClientData.ifu}
                          onChange={(e) =>
                            setNewClientData((prev) => ({ ...prev, ifu: e.target.value }))
                          }
                          className="h-8 text-xs font-mono bg-background"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-ink mb-1">Email de contact</label>
                        <Input
                          type="email"
                          placeholder="Ex: comptabilite@beninservices.bj"
                          value={newClientData.email}
                          onChange={(e) =>
                            setNewClientData((prev) => ({ ...prev, email: e.target.value }))
                          }
                          className="h-8 text-xs bg-background"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-ink mb-1">Téléphone</label>
                        <Input
                          type="tel"
                          placeholder="Ex: +229 97 00 00 00"
                          value={newClientData.phone}
                          onChange={(e) =>
                            setNewClientData((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCreatingClient(false)}
                        disabled={isSavingClient}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCreateClientSubmit}
                        disabled={isSavingClient}
                        className="bg-primary text-ink font-semibold hover:brightness-95"
                      >
                        {isSavingClient ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        ) : (
                          <Check className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Enregistrer et sélectionner
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Type de document */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-ink">Type de document</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-xs bg-background border-border">
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

                  {/* Sélecteur de Client */}
                  <FormField
                    control={form.control}
                    name="client_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-xs font-semibold text-ink">Client *</FormLabel>
                          {!isCreatingClient && (
                            <button
                              type="button"
                              onClick={() => setIsCreatingClient(true)}
                              className="text-xs text-ink font-bold underline underline-offset-4 hover:opacity-80 transition-opacity flex items-center gap-1"
                            >
                              <UserPlus className="w-3 h-3 text-ink" />
                              <span>Nouveau client</span>
                            </button>
                          )}
                        </div>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-xs bg-background border-border">
                              <SelectValue
                                placeholder={
                                  clients.length === 0 ? "Aucun client enregistré" : "Sélectionnez un client"
                                }
                              />
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

                  {/* Date d'émission */}
                  <FormField
                    control={form.control}
                    name="issue_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-ink">Date d'émission *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-9 text-xs bg-background border-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date d'échéance */}
                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-ink">Date d'échéance *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-9 text-xs bg-background border-border" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mode de règlement */}
                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-ink">Mode de paiement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-xs bg-background border-border">
                              <SelectValue placeholder="Sélectionnez un mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                            <SelectItem value="mobile_money_mtn">MTN Mobile Money</SelectItem>
                            <SelectItem value="mobile_money_moov">Moov Money</SelectItem>
                            <SelectItem value="mobile_money_celtiis">Celtiis Cash</SelectItem>
                            <SelectItem value="cash">Espèces</SelectItem>
                            <SelectItem value="check">Chèque</SelectItem>
                            <SelectItem value="credit_card">Carte bancaire</SelectItem>
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
                        <FormLabel className="text-xs font-semibold text-ink flex items-center justify-between">
                          <span>AIB (Acompte sur Impôt Bénéfices)</span>
                          {selectedClient?.ifu ? (
                            <span className="text-[10px] text-text-muted font-normal">
                              Client avec IFU (taux 1% préconisé)
                            </span>
                          ) : (
                            <span className="text-[10px] text-text-muted font-normal">
                              Client sans IFU (taux 5% légal)
                            </span>
                          )}
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-xs bg-background border-border">
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
                          <FormLabel className="text-xs font-semibold text-ink">
                            Référence Facture d'origine (Code MECeF 24 caractères) *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: TEST-E6SE-HHRM-UZZK-JTLU-RULL"
                              className="h-9 font-mono text-xs bg-background border-border"
                              required
                            />
                          </FormControl>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            Obligatoire pour les factures d'avoir. Reportez le code MECeF présent sur la facture initiale.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* ÉTAPE 2 : ARTICLES ET PRESTATIONS DE SERVICE                 */}
            {/* ============================================================ */}
            {currentStep === 2 && (
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-ink">Lignes de facturation</h3>
                    <p className="text-xs text-text-muted">
                      Renseignez les prestations et appliquez les groupes de taxes normalisés par la DGI.
                    </p>
                  </div>
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
                    className="h-8 text-xs font-semibold border-border hover:bg-background-secondary"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1 text-ink" />
                    <span>Ajouter une ligne</span>
                  </Button>
                </div>

                <div className="border border-border rounded-xl overflow-hidden bg-background shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-background-secondary border-b border-border text-left font-semibold text-ink">
                          <th className="p-2.5 min-w-[200px]">Désignation prestation / article</th>
                          <th className="p-2.5 w-20 text-center">Quantité</th>
                          <th className="p-2.5 w-28 text-right">Prix HT</th>
                          <th className="p-2.5 w-44 text-left">Groupe Taxe DGI</th>
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
                            <tr key={field.id} className="border-b border-border last:border-0 hover:bg-background-secondary/40">
                              <td className="p-2">
                                <FormField
                                  control={form.control}
                                  name={`lines.${index}.description`}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      placeholder="Ex: Prestation de service, vente de matériel..."
                                      className="h-8 text-xs bg-background"
                                    />
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
                                      className="h-8 text-xs text-center tnum bg-background"
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
                                        className="h-8 text-xs text-right tnum bg-background"
                                      />
                                      <p className="text-[10px] text-text-muted text-right mt-0.5 tnum">
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
                                      className="w-full h-8 rounded-md border border-border bg-background px-2 text-[11px] text-ink"
                                    >
                                      <option value="B">B : Taxable 18%</option>
                                      <option value="A">A : Exonéré (0%)</option>
                                      <option value="C">C : Exportation (0%)</option>
                                      <option value="D">D : Régime exception (18%)</option>
                                      <option value="E">E : Régime TPS (0%)</option>
                                      <option value="F">F : Réservé (0%)</option>
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
                                      className="h-8 text-xs text-right tnum bg-background"
                                    />
                                  )}
                                />
                              </td>
                              <td className="p-2 text-right font-bold text-xs tnum text-ink">
                                {formatCFA(rowTotalTTC)}
                              </td>
                              <td className="p-2 text-center">
                                {fields.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-1 rounded text-text-muted hover:text-error transition-colors"
                                    title="Supprimer la ligne"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Synthèse rapide étape 2 */}
                <div className="flex items-center justify-between text-xs p-space-sm rounded-lg bg-background-secondary border border-border">
                  <span className="text-text-muted font-medium">Sous-total partiel :</span>
                  <div className="flex items-center gap-space-md">
                    <span className="text-text-muted">
                      Total HT : <strong className="text-ink tnum">{formatCFA(subtotal_ht)}</strong>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-text-muted">
                      TVA (18%) : <strong className="text-ink tnum">{formatCFA(vat_amount)}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* ÉTAPE 3 : MENTIONS & RÉCAPITULATIF FINANCIER DÉTAILLÉ        */}
            {/* ============================================================ */}
            {currentStep === 3 && (
              <div className="space-y-space-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <FormField
                    control={form.control}
                    name="additional_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-ink">
                          Description complémentaire (3 lignes max)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Ex: Prestations réalisées selon le bon de commande n° 42..."
                            className="text-xs h-20 bg-background border-border"
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
                        <FormLabel className="text-xs font-semibold text-ink">
                          Message commercial (pied de facture)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Ex: Merci pour votre confiance. Règlements par virement sous 30 jours."
                            className="text-xs h-20 bg-background border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Récapitulatif financier certifié Ceilow */}
                <div className="rounded-xl p-space-md bg-background-secondary border border-border space-y-space-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
                    <div>
                      <span className="font-semibold text-ink">Client sélectionné : </span>
                      <span className="font-bold text-ink">{selectedClient?.name || "Client non sélectionné"}</span>
                      {selectedClient?.ifu && (
                        <span className="text-text-muted ml-1">({selectedClient.ifu})</span>
                      )}
                    </div>
                    <span className="text-text-muted font-medium">Échéance : {form.watch("due_date")}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2 text-xs">
                    <div className="space-y-1 text-text-muted">
                      <p>Type : <strong className="text-ink">{typeLabel}</strong></p>
                      <p>Articles : <strong className="text-ink">{watchLines.length} ligne{watchLines.length > 1 ? "s" : ""}</strong></p>
                      <p>Régime fiscal : <strong className="text-ink">{isTps ? "Régime TPS" : "Régime Réel / TVA 18%"}</strong></p>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-xs">
                      <div className="flex justify-between w-64">
                        <span className="text-text-muted">Total HT :</span>
                        <span className="font-semibold text-ink tnum">{formatCFA(subtotal_ht)}</span>
                      </div>
                      <div className="flex justify-between w-64">
                        <span className="text-text-muted">TVA (SYSCOHADA 4431) :</span>
                        <span className="font-semibold text-ink tnum">{formatCFA(vat_amount)}</span>
                      </div>
                      {specific_tax_total > 0 && (
                        <div className="flex justify-between w-64">
                          <span className="text-text-muted">Taxes spécifiques :</span>
                          <span className="font-semibold text-ink tnum">{formatCFA(specific_tax_total)}</span>
                        </div>
                      )}
                      {aib_amount > 0 && (
                        <div className="flex justify-between w-64 text-ink font-semibold">
                          <span>AIB ({watchAibRate === "rate_1" ? "1%" : "5%"}) :</span>
                          <span className="tnum">+{formatCFA(aib_amount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between w-64 text-base font-bold border-t border-border pt-2 text-ink">
                        <span>NET À PAYER :</span>
                        <span className="tnum font-extrabold">{formatCFA(net_to_pay)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border flex items-center gap-2 text-[11px] text-text-muted">
                    <ShieldCheck className="w-4 h-4 text-ink shrink-0" />
                    <span>
                      À la confirmation, la facture sera enregistrée dans le grand livre et transmise aux serveurs DGI pour attribution du code e-MECeF et QR Code sécurisé.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Pied de la modale avec boutons de navigation du wizard */}
            <div className="flex items-center justify-between pt-space-md border-t border-border">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="text-xs font-semibold border-border hover:bg-background-secondary"
                >
                  <ChevronLeft className="w-4 h-4 mr-1 text-ink" />
                  <span>Précédent</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-xs font-semibold border-border hover:bg-background-secondary"
                >
                  Annuler
                </Button>
              )}

              <div className="flex items-center gap-2">
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleNextStep}
                    className="bg-primary text-ink text-xs font-bold hover:brightness-95 active:scale-[0.99] transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Étape suivante</span>
                    <ChevronRight className="w-4 h-4 text-ink" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-ink text-xs font-bold hover:brightness-95 active:scale-[0.99] transition-all shadow-sm flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-ink" />
                    ) : (
                      <Check className="w-4 h-4 text-ink" />
                    )}
                    <span>Créer & Normaliser la facture</span>
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
