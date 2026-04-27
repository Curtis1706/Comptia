export const company = {
  name: "Entreprise ABC SARL",
  siret: "12345678901234",
  regime: "Réel simplifié",
  sector: "Services informatiques",
  email: "contact@entreprise-abc.fr",
};

export const kpis = {
  ca: 125400,
  caGrowth: 12,
  charges: 45200,
  chargesGrowth: 3,
  netResult: 80200,
  netResultGrowth: 64,
  tresorerie: 125000,
  tresorerieGrowth: 8,
  tvaAPayer: 8500,
  facturesImpayees: 3,
  facturesImpayeesMontant: 12400,
};

export const monthlyRevenue = [
  { month: "Mai", ca: 78000, charges: 32000 },
  { month: "Juin", ca: 82000, charges: 34000 },
  { month: "Juil", ca: 88000, charges: 36000 },
  { month: "Août", ca: 71000, charges: 30000 },
  { month: "Sept", ca: 95000, charges: 38000 },
  { month: "Oct", ca: 102000, charges: 40000 },
  { month: "Nov", ca: 108000, charges: 41000 },
  { month: "Déc", ca: 121000, charges: 44000 },
  { month: "Jan", ca: 96000, charges: 39000 },
  { month: "Fév", ca: 110000, charges: 42000 },
  { month: "Mar", ca: 118000, charges: 43500 },
  { month: "Avr", ca: 125400, charges: 45200 },
];

export const expenseBreakdown = [
  { name: "Salaires", value: 22000, color: "hsl(221 83% 53%)" },
  { name: "Fournitures", value: 6500, color: "hsl(217 91% 60%)" },
  { name: "Loyer", value: 8000, color: "hsl(160 84% 39%)" },
  { name: "Marketing", value: 4200, color: "hsl(24 95% 53%)" },
  { name: "Logiciels", value: 2800, color: "hsl(280 70% 60%)" },
  { name: "Autres", value: 1700, color: "hsl(220 9% 46%)" },
];

export const cashflow = Array.from({ length: 30 }, (_, i) => ({
  day: `J${i + 1}`,
  cash: 100000 + Math.round(Math.sin(i / 3) * 15000 + i * 800 + Math.random() * 4000),
}));

export const sparkline = (base: number) =>
  Array.from({ length: 7 }, (_, i) => ({ i, v: base + Math.round(Math.sin(i) * base * 0.08 + i * base * 0.02) }));

export type InvoiceStatus = "payee" | "attente" | "retard" | "impayee";

export const invoices = [
  { id: "FAC-2026-001", client: "Entreprise XYZ", date: "2026-04-10", dueDate: "2026-05-10", montantTTC: 2500, status: "payee" as InvoiceStatus },
  { id: "FAC-2026-002", client: "Studio Lumen", date: "2026-04-12", dueDate: "2026-05-12", montantTTC: 1800, status: "attente" as InvoiceStatus },
  { id: "FAC-2026-003", client: "Acme Corp", date: "2026-03-22", dueDate: "2026-04-21", montantTTC: 4200, status: "retard" as InvoiceStatus },
  { id: "FAC-2026-004", client: "Boulangerie Léon", date: "2026-04-15", dueDate: "2026-05-15", montantTTC: 950, status: "attente" as InvoiceStatus },
  { id: "FAC-2026-005", client: "Tech Solutions", date: "2026-02-10", dueDate: "2026-03-10", montantTTC: 7800, status: "impayee" as InvoiceStatus },
  { id: "FAC-2026-006", client: "Cabinet Durand", date: "2026-04-18", dueDate: "2026-05-18", montantTTC: 3200, status: "payee" as InvoiceStatus },
  { id: "FAC-2026-007", client: "Verde Bio", date: "2026-04-20", dueDate: "2026-05-20", montantTTC: 1450, status: "attente" as InvoiceStatus },
];

export const quotes = [
  { id: "DEV-2026-014", client: "Studio Lumen", date: "2026-04-22", montantTTC: 5400, status: "envoye" },
  { id: "DEV-2026-015", client: "Acme Corp", date: "2026-04-23", montantTTC: 12000, status: "accepte" },
  { id: "DEV-2026-016", client: "Mode & Co", date: "2026-04-24", montantTTC: 3200, status: "refuse" },
];

export const credits = [
  { id: "AV-2026-002", client: "Tech Solutions", date: "2026-04-05", montantTTC: 450, motif: "Remboursement partiel" },
  { id: "AV-2026-003", client: "Acme Corp", date: "2026-04-19", montantTTC: 800, motif: "Erreur facturation" },
];

export type OperationStatus = "validee" | "attente" | "erreur";

export const operations = [
  { id: 1, date: "2026-04-15", piece: "ACH-001", compte: "401001", libelle: "Fournisseur ABC - Facture #2391", debit: 1200, credit: 0, status: "validee" as OperationStatus },
  { id: 2, date: "2026-04-15", piece: "VTE-128", compte: "411001", libelle: "Vente prestation - Studio Lumen", debit: 0, credit: 1800, status: "validee" as OperationStatus },
  { id: 3, date: "2026-04-14", piece: "BNQ-045", compte: "512001", libelle: "Virement bancaire - BNP", debit: 0, credit: 5400, status: "validee" as OperationStatus },
  { id: 4, date: "2026-04-13", piece: "ACH-002", compte: "606300", libelle: "Achat fournitures bureau", debit: 320, credit: 0, status: "attente" as OperationStatus },
  { id: 5, date: "2026-04-12", piece: "SAL-04", compte: "641000", libelle: "Salaires avril 2026", debit: 22000, credit: 0, status: "validee" as OperationStatus },
  { id: 6, date: "2026-04-11", piece: "TVA-Q1", compte: "445660", libelle: "TVA déductible Q1", debit: 1860, credit: 0, status: "validee" as OperationStatus },
  { id: 7, date: "2026-04-10", piece: "ACH-003", compte: "613200", libelle: "Loyer bureau avril", debit: 2200, credit: 0, status: "erreur" as OperationStatus },
  { id: 8, date: "2026-04-08", piece: "VTE-127", compte: "411002", libelle: "Vente prestation - Cabinet Durand", debit: 0, credit: 3200, status: "validee" as OperationStatus },
  { id: 9, date: "2026-04-05", piece: "ACH-004", compte: "623400", libelle: "Campagne Google Ads", debit: 1400, credit: 0, status: "validee" as OperationStatus },
  { id: 10, date: "2026-04-03", piece: "BNQ-044", compte: "512001", libelle: "Encaissement chèque #4521", debit: 0, credit: 2500, status: "attente" as OperationStatus },
];

export const tvaDeclarations = [
  { period: "Avril 2026", type: "CA3", deadline: "2026-05-19", status: "todo", tva: 8500 },
  { period: "Mars 2026", type: "CA3", deadline: "2026-04-19", status: "submitted", tva: 7200 },
  { period: "Février 2026", type: "CA3", deadline: "2026-03-19", status: "submitted", tva: 6800 },
  { period: "Janvier 2026", type: "CA3", deadline: "2026-02-19", status: "submitted", tva: 5400 },
  { period: "Décembre 2025", type: "CA3", deadline: "2026-01-19", status: "submitted", tva: 9100 },
];

export const employees = [
  { id: 1, name: "Sophie Martin", role: "Développeuse senior", salaireBrut: 4200, salaireNet: 3280, contract: "CDI" },
  { id: 2, name: "Karim Benali", role: "Designer produit", salaireBrut: 3600, salaireNet: 2810, contract: "CDI" },
  { id: 3, name: "Léa Rousseau", role: "Chef de projet", salaireBrut: 3900, salaireNet: 3045, contract: "CDI" },
  { id: 4, name: "Marc Dubois", role: "Commercial", salaireBrut: 3200, salaireNet: 2495, contract: "CDI" },
  { id: 5, name: "Inès Petit", role: "Assistante administrative", salaireBrut: 2400, salaireNet: 1875, contract: "CDD" },
];

export const balanceSheet = {
  actif: [
    { label: "Immobilisations corporelles", value: 48000 },
    { label: "Immobilisations incorporelles", value: 12000 },
    { label: "Stocks", value: 8500 },
    { label: "Créances clients", value: 32400 },
    { label: "Disponibilités banque", value: 125000 },
  ],
  passif: [
    { label: "Capital social", value: 50000 },
    { label: "Réserves", value: 38000 },
    { label: "Résultat de l'exercice", value: 80200 },
    { label: "Dettes fournisseurs", value: 28700 },
    { label: "Dettes fiscales & sociales", value: 29000 },
  ],
};

export const incomeStatement = {
  produits: [
    { label: "Ventes de marchandises", value: 0 },
    { label: "Prestations de services", value: 1284000 },
    { label: "Autres produits", value: 12500 },
  ],
  charges: [
    { label: "Achats consommés", value: 86000 },
    { label: "Charges externes", value: 142000 },
    { label: "Salaires et traitements", value: 528000 },
    { label: "Charges sociales", value: 198000 },
    { label: "Impôts et taxes", value: 32000 },
    { label: "Dotations amortissements", value: 24000 },
  ],
};

export const documents = [
  { id: 1, name: "Facture EDF Avril 2026.pdf", type: "Facture", date: "2026-04-12", amount: 245, status: "ocr_ok" },
  { id: 2, name: "Note frais resto client.jpg", type: "Justificatif", date: "2026-04-10", amount: 87, status: "ocr_ok" },
  { id: 3, name: "Facture Orange Pro.pdf", type: "Facture", date: "2026-04-08", amount: 89, status: "pending" },
  { id: 4, name: "Achat matériel.pdf", type: "Facture", date: "2026-04-05", amount: 1250, status: "ocr_ok" },
];

export const auditLog = [
  { id: 1, date: "2026-04-22 14:32", user: "Sophie Martin", action: "A validé l'opération ACH-001", type: "validation" },
  { id: 2, date: "2026-04-22 11:18", user: "Marc Dubois", action: "A créé la facture FAC-2026-007", type: "creation" },
  { id: 3, date: "2026-04-21 16:05", user: "Sophie Martin", action: "A modifié les paramètres entreprise", type: "config" },
  { id: 4, date: "2026-04-21 09:42", user: "Léa Rousseau", action: "A relancé Tech Solutions", type: "action" },
];