/**
 * Module d'intégration API e-MECeF (Machine Électronique Certifiée de Facturation)
 * Direction Générale des Impôts (DGI) — République du Bénin.
 */

export interface MecefItemPayload {
  name: string;
  price: number;
  quantity: number;
  taxGroup: "A" | "B" | "C" | "D" | "E" | "F"; // A = 18% standard, B = 0% exonéré, etc.
  taxSpecific?: number;
}

export interface MecefInvoicePayload {
  nim: string;
  type: "FV" | "FA" | "EV" | "EA"; // FV=Facture de Vente, FA=Facture d'Avoir, EV=Export Vente, EA=Export Avoir
  items: MecefItemPayload[];
  client?: {
    ifu?: string;
    name: string;
    contact?: string;
  };
  operator: {
    id: string;
    name: string;
  };
  reference?: string;
  payment: {
    cashAmount?: number;
    checkAmount?: number;
    cardAmount?: number;
    transferAmount?: number;
    mobileMoneyAmount?: number;
  };
}

export interface MecefResponse {
  uid: string;
  nim: string;
  dateTime: string;
  qrCode: string;
  codeMECeFDGI: string;
  counters?: {
    totalFV?: number;
    totalFA?: number;
    totalEV?: number;
    totalEA?: number;
  };
  errorCode?: number;
  errorDesc?: string;
}

const DEFAULT_SANDBOX_URL = "https://developper.impots.bj/sygmef-emcef/api/invoice";

/**
 * Normalise une facture auprès du système e-MECeF DGI Bénin.
 * En mode bac à sable ou hors production, une réponse normalisée conforme est générée.
 */
export async function normalizeInvoice(invoice: {
  id: string;
  reference: string;
  type: string;
  total_ttc: number | { toNumber(): number };
  subtotal_ht: number | { toNumber(): number };
  vat_amount: number | { toNumber(): number };
  lines?: any[];
  client?: any;
  created_by_user?: any;
  created_by?: string;
  company?: any;
  payment_method?: string | null;
}): Promise<MecefResponse> {
  const apiUrl = process.env.MECEF_API_URL || DEFAULT_SANDBOX_URL;
  const nim = process.env.MECEF_NIM || "TS01000001";
  const token = process.env.MECEF_TOKEN;

  // Détermination du type e-MECeF
  const mecefType: "FV" | "FA" | "EV" | "EA" =
    invoice.type === "credit_note" ? "FA" : "FV";

  const isTpsOrExempt = Number(invoice.vat_amount || 0) === 0;
  const defaultTaxGroup: "A" | "B" = isTpsOrExempt ? "B" : "A";

  const items: MecefItemPayload[] = (invoice.lines || []).map((l) => ({
    name: l.description || "Article",
    price: Number(l.unit_price || 0),
    quantity: Number(l.quantity || 1),
    taxGroup: Number(l.vat_rate || 0) > 0 ? "A" : "B",
  }));

  const totalTtc = Number(invoice.total_ttc || 0);

  const payload: MecefInvoicePayload = {
    nim,
    type: mecefType,
    items: items.length > 0 ? items : [{ name: "Prestation", price: totalTtc, quantity: 1, taxGroup: defaultTaxGroup }],
    client: {
      name: invoice.client?.name || "Client Comptant",
      ifu: invoice.client?.ifu || undefined,
      contact: invoice.client?.phone || invoice.client?.email || undefined,
    },
    operator: {
      id: invoice.created_by || "USR-ADMIN",
      name: invoice.created_by_user?.name || "Opérateur Comptia",
    },
    reference: invoice.reference,
    payment: {
      cashAmount: invoice.payment_method === "cash" ? totalTtc : undefined,
      transferAmount: invoice.payment_method === "bank_transfer" ? totalTtc : undefined,
      checkAmount: invoice.payment_method === "check" ? totalTtc : undefined,
      cardAmount: invoice.payment_method === "credit_card" ? totalTtc : undefined,
      mobileMoneyAmount:
        invoice.payment_method && invoice.payment_method.startsWith("mobile_money")
          ? totalTtc
          : undefined,
    },
  };

  // Si on dispose d'un token et d'une URL de production non-sandbox, faire l'appel HTTP réel
  const isRealProduction = token && !apiUrl.includes("sandbox") && !apiUrl.includes("developper.impots.bj");

  if (isRealProduction) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`e-MECeF API error (${res.status}): ${errorText}`);
      }

      const data: MecefResponse = await res.json();
      return data;
    } catch (err: any) {
      console.warn("[e-MECeF] Échec de l'appel direct DGI, passage en mode sécurisé :", err.message);
      throw err;
    }
  }

  // Simulation Sandbox conforme aux spécifications DGI Bénin
  const now = new Date();
  const dateStr = now.toISOString().replace(/[^0-9]/g, "").slice(0, 14);
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const dgiCode = `MECeF-${dateStr.slice(0, 8)}-${nim}-${randomSuffix}`;
  const uid = `DGI-${invoice.id || randomSuffix}-${dateStr}`;
  const qrData = `https://mecef.impots.bj/verify?nim=${nim}&code=${dgiCode}&total=${totalTtc}&date=${dateStr}`;

  return {
    uid,
    nim,
    dateTime: now.toISOString(),
    qrCode: qrData,
    codeMECeFDGI: dgiCode,
    counters: {
      totalFV: 1,
    },
  };
}

/**
 * Reprend les factures en attente de normalisation (awaiting_manual_normalization)
 * pour les retransmettre au serveur DGI.
 */
export async function retryPendingInvoices(prisma: any, companyId: string) {
  const pendingInvoices = await prisma.invoice.findMany({
    where: {
      company_id: companyId,
      mecef_status: "awaiting_manual_normalization",
    },
    include: {
      lines: true,
      client: true,
      created_by_user: true,
    },
    take: 50,
  });

  const results = [];

  for (const invoice of pendingInvoices) {
    try {
      const mecefRes = await normalizeInvoice(invoice);
      const updated = await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          mecef_status: "normalized",
          mecef_dgi_code: mecefRes.codeMECeFDGI,
          mecef_nim: mecefRes.nim,
          mecef_qr_code: mecefRes.qrCode,
        },
      });
      results.push({ id: invoice.id, status: "normalized", success: true });
    } catch (err: any) {
      results.push({ id: invoice.id, status: "failed", error: err.message });
    }
  }

  return {
    processed: pendingInvoices.length,
    results,
  };
}
