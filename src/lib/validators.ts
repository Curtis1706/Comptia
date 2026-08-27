import { z } from "zod";

// ─── Shared primitives ────────────────────────────────────────────────────────

const cuid = z.string().cuid();
const optionalString = z.string().optional();
const positiveDecimal = z.number().nonnegative();
const positiveInt = z.number().int().positive();

// IFU validation (Benin - 13 digits)
const ifuSchema = z
  .string()
  .min(1, "IFU obligatoire")
  .regex(/^\d{13}$/, "L'IFU doit contenir exactement 13 chiffres");

// RCCM validation (Benin/OHADA - flexible)
const rccmSchema = z.string().optional();

// ─── Company ──────────────────────────────────────────────────────────────────

export const CreateCompanySchema = z.object({
  name: z.string().min(1, "Nom obligatoire"),
  ifu: ifuSchema,
  rccm: rccmSchema,
  type: z
    .enum(["EI", "SARL", "SA", "SAS", "SNC", "SCS", "GIE", "SUARL", "COOP", "ASSOCIATION"])
    .default("SARL"),
  tax_regime: z
    .enum(["auto_entrepreneur", "micro", "simplifie", "reel", "tps"])
    .default("reel"),
  sector: z
    .enum([
      "commerce_general",
      "services",
      "btp",
      "restauration",
      "transport",
      "sante",
      "education",
      "agriculture",
      "industrie",
      "profession_liberale",
      "tech",
      "autre",
    ])
    .default("services"),
  address: z.string().default(""),
  postal_code: z.string().default(""),
  city: z.string().default(""),
  country: z.string().default("Bénin"),
  phone: optionalString,
  email: z.string().email("Email invalide"),
  website: optionalString,
  accounting_start_date: z.coerce.date().optional(),
  fiscal_year_end: z
    .string()
    .regex(/^\d{2}-\d{2}$/, "Format MM-DD requis")
    .default("12-31"),
});

export const UpdateCompanySchema = CreateCompanySchema.partial();

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Mot de passe : 8 caractères minimum")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
  name: z.string().min(1),
  company: CreateCompanySchema,
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  avatar_url: optionalString,
});

export const ChangePasswordSchema = z
  .object({
    current_password: z.string().min(1),
    new_password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[0-9]/),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm_password"],
  });

// ─── Users ────────────────────────────────────────────────────────────────────

export const UserRoleEnum = z.enum([
  "owner",
  "admin",
  "accountant",
  "cashier",
  "hr",
  "expert",
  "viewer",
]);

export const InviteUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: UserRoleEnum,
  password: z.string().min(8),
});

export const UpdateUserSchema = z.object({
  role: UserRoleEnum.optional(),
  is_active: z.boolean().optional(),
  name: z.string().min(1).optional(),
});

// ─── Accounts ─────────────────────────────────────────────────────────────────

export const CreateAccountSchema = z.object({
  code: z.string().min(3, "Code compte requis (min 3 chiffres)"),
  name: z.string().min(1),
  type: z.enum(["asset", "liability", "equity", "revenue", "expense"]),
  parent_code: optionalString,
});

export const UpdateAccountSchema = z.object({
  name: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
  parent_code: optionalString,
});

// ─── Journal Entry ────────────────────────────────────────────────────────────

const JournalLineSchema = z.object({
  account_code: z.string().min(1, "Compte obligatoire"),
  debit: z.number().nonnegative().default(0),
  credit: z.number().nonnegative().default(0),
  description: optionalString,
  maturity_date: z.coerce.date().optional(),
  third_party: optionalString,
});

export const BaseJournalEntrySchema = z.object({
  date: z.coerce.date(),
  reference: z.string().min(1),
  description: z.string().min(1),
  journal: z.enum(["purchases", "sales", "bank", "cash", "payroll"]),
  lines: z.array(JournalLineSchema).min(2, "Au moins 2 lignes requises"),
  document_id: optionalString,
});

export const CreateJournalEntrySchema = BaseJournalEntrySchema.refine(
  (d) => {
    const totalDebit = Math.round(
      d.lines.reduce((s, l) => s + l.debit * 100, 0)
    );
    const totalCredit = Math.round(
      d.lines.reduce((s, l) => s + l.credit * 100, 0)
    );
    return totalDebit === totalCredit;
  },
  {
    message:
      "Écriture déséquilibrée : le total des débits doit égaler le total des crédits",
    path: ["lines"],
  }
).refine(
  (d) => d.lines.reduce((s, l) => s + l.debit, 0) >= 0.01,
  {
    message: "Le montant total de l'écriture ne peut pas être nul",
    path: ["lines"],
  }
);

export const UpdateJournalEntrySchema = BaseJournalEntrySchema.partial();

// ─── Third Parties ────────────────────────────────────────────────────────────

export const CreateThirdPartySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["client", "supplier"]),
  ifu: z.string().optional(),
  rccm: z.string().optional(),
  address: z.string().default(""),
  postal_code: z.string().default(""),
  city: z.string().default(""),
  country: z.string().default("Bénin"),
  email: z.string().email(),
  phone: optionalString,
  payment_terms: z.number().int().nonnegative().optional(),
});

export const UpdateThirdPartySchema = CreateThirdPartySchema.partial();

// ─── Invoices ─────────────────────────────────────────────────────────────────

const InvoiceLineSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
  vat_rate: z.number().min(0).max(100),
  tax_group: z.enum(["A", "B", "C", "D", "E", "F"]).optional().default("B"),
  tax_specific: z.number().min(0).optional(),
  accounting_account: optionalString,
});

const BaseInvoiceSchema = z.object({
  type: z.enum(["invoice", "quote", "credit_note"]).default("invoice"),
  client_id: cuid,
  issue_date: z.coerce.date(),
  due_date: z.coerce.date(),
  lines: z.array(InvoiceLineSchema).min(1, "Au moins une ligne requise"),
  notes: optionalString,
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
  tax_regime: z.string().default("reel"),
  aib_rate: z.enum(["none", "rate_1", "rate_5"]).optional().default("none"),
  aib_amount: z.number().min(0).optional().default(0),
  tourist_tax_amount: z.number().min(0).optional().default(0),
  additional_description: optionalString,
  commercial_message: optionalString,
  mecef_original_ref: optionalString,
  mecef_uid: optionalString,
  mecef_dgi_code: optionalString,
  mecef_nim: optionalString,
  mecef_status: z.enum(["draft", "awaiting_manual_normalization", "normalized", "verification_failed"]).optional().default("draft"),
  vat_exemption_reason: optionalString,
});

export const CreateInvoiceSchema = BaseInvoiceSchema.superRefine((data, ctx) => {
  if (data.mecef_status === "normalized") {
    if (!data.mecef_dgi_code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le code MECeF/DGI est requis pour une facture normalisée",
        path: ["mecef_dgi_code"],
      });
    }
    if (!data.mecef_nim) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le NIM est requis pour une facture normalisée",
        path: ["mecef_nim"],
      });
    }
  }
});

export const UpdateInvoiceSchema = BaseInvoiceSchema.partial();

export const RecordPaymentSchema = z.object({
  amount: z.number().positive("Montant positif requis"),
  payment_date: z.coerce.date(),
  payment_method: z.enum([
    "cash",
    "bank_transfer",
    "check",
    "mobile_money_mtn",
    "mobile_money_moov",
    "mobile_money_celtiis",
    "credit_card",
    "western_union",
    "other",
  ]),
  reference: optionalString,
});

// ─── VAT Declarations ─────────────────────────────────────────────────────────

export const CreateVatDeclarationSchema = z.object({
  period_start: z.coerce.date(),
  period_end: z.coerce.date(),
  declaration_type: z.enum(["monthly", "quarterly"]).default("monthly"),
});

export const UpdateVatDeclarationSchema = z.object({
  ca_ht: z.number().nonnegative().optional(),
  vat_collected: z.number().nonnegative().optional(),
  purchases_ht: z.number().nonnegative().optional(),
  vat_deductible: z.number().nonnegative().optional(),
});

// ─── Employees ────────────────────────────────────────────────────────────────

export const CreateEmployeeSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: optionalString,
  position: z.string().min(1),
  department: optionalString,
  hire_date: z.coerce.date(),
  birth_date: z.coerce.date().optional(),
  address: z.string().default(""),
  postal_code: z.string().default(""),
  city: z.string().default(""),
  country: z.string().default("Bénin"),
  social_security_number: optionalString,
  contract_type: z.enum(["CDI", "CDD", "Stage", "Alternance"]).default("CDI"),
  base_salary: z.number().positive("Salaire positif requis"),
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

// ─── Payroll ──────────────────────────────────────────────────────────────────

export const GeneratePayrollSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  employee_ids: z.array(cuid).optional(),
});

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(500).default(20),
});

export const DateRangeSchema = z.object({
  date_from: z.coerce.date().optional(),
  date_to: z.coerce.date().optional(),
});
