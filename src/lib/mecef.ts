/**
 * Module d'intégration API e-MECeF (Machine Électronique Certifiée de Facturation)
 * Direction Générale des Impôts (DGI) — République du Bénin.
 * Conforme au SDK officiel, au Manuel d'utilisation v1.0 et au formulaire d'auto-déclaration SFE.
 */

import { prisma } from "./prisma";
import { toMecefPrice, deriveTaxGroup, deriveAibRate, TAX_GROUP_LABELS } from "./mecef-mapping";
import QRCode from "qrcode";

export type MecefMode = "simulation" | "sandbox" | "production";
export type MecefInvoiceType = "FV" | "FA" | "EV" | "EA";
export type MecefTaxGroup = "A" | "B" | "C" | "D" | "E" | "F";
export type MecefAibRate = "A" | "B"; // A = 1%, B = 5% (nomenclature DGI)

export { toMecefPrice, deriveTaxGroup, deriveAibRate, TAX_GROUP_LABELS };

export interface MecefItem {
  name: string;
  price: number; // Prix unitaire TTC au franc CFA entier
  quantity: number; // Quantité (décimales acceptées ex: 2.5, 3.250)
  taxGroup: MecefTaxGroup;
  taxSpecific?: number; // Montant TOTAL pour la quantité entière
  originalPrice?: number;
  priceModification?: string;
}

export interface MecefClient {
  ifu?: string; // Validé par le serveur DGI
  name?: string;
  address?: string;
  contact?: string;
}

export interface MecefInvoiceRequest {
  ifu: string; // IFU de l'émetteur (le NIM est déduit du jeton)
  type: MecefInvoiceType;
  items: MecefItem[];
  client?: MecefClient;
  operator: { id?: string; name: string };
  reference?: string; // Code MECeF/DGI de la facture d'origine (obligatoire pour FA / EA, 24 car.)
  aib?: "A" | "B"; // A = 1%, B = 5%
  payment?: Array<{ name: string; amount: number }>;
  additionalDescription?: string[]; // 3 lignes maximum
  commercialMessage?: string;
}

export interface MecefPostResponse {
  uid: string;
  ta: number;
  tb: number;
  tc: number;
  td: number;
  taa: number;
  tab: number;
  tac: number;
  tad: number;
  tae: number;
  taf: number;
  hab: number;
  had: number;
  vab: number;
  vad: number;
  aib: number;
  ts: number;
  total: number;
  errorCode?: string;
  errorDesc?: string;
}

export interface MecefSecurityElements {
  codeMECeFDGI: string; // 24 caractères, 6 groupes de 4 (ex: TEST-E64H-2J6I-LT3E-B5TH-DUMA)
  qrCode: string;
  nim: string;
  counters: string; // ex: "1/2 FV"
  dateTime: string;
  uid?: string;
  totalTTC?: number;
  hab?: number;
  vab?: number;
  aib?: number;
  ts?: number;
}

/**
 * Récupère la configuration e-MECeF active.
 */
export function getMecefConfig() {
  const mode = (process.env.MECEF_MODE || "sandbox").toLowerCase() as MecefMode;
  const nim = process.env.MECEF_NIM || "";
  const ifu = process.env.MECEF_IFU || "";
  const token = process.env.MECEF_TOKEN || "";

  const sandboxUrl = process.env.MECEF_SANDBOX_URL || "https://developper.impots.bj/sygmef-emcf/api";
  const productionUrl = process.env.MECEF_PRODUCTION_URL || "https://sygmef.impots.bj/emcf";
  const verificationUrl =
    process.env.MECEF_VERIFICATION_URL ||
    (mode === "production"
      ? "https://mecef.impots.bj/verify"
      : "https://developper.impots.bj/sygmef-test/verification");

  const baseUrl = mode === "production" ? productionUrl : sandboxUrl;

  if (mode !== "simulation" && (!token || !nim || !ifu)) {
    const missing = [!token && "MECEF_TOKEN", !nim && "MECEF_NIM", !ifu && "MECEF_IFU"]
      .filter(Boolean)
      .join(", ");
    throw new Error(`Configuration e-MECeF incomplète : variable(s) [${missing}] manquante(s) dans le fichier .env.`);
  }

  return {
    mode,
    nim,
    ifu,
    token,
    baseUrl,
    verificationUrl,
  };
}

/**
 * Journalise chaque appel e-MECeF dans le modèle MecefLog.
 */
async function logMecefCall(params: {
  company_id?: string;
  invoice_id?: string;
  mode: string;
  method: string;
  endpoint: string;
  request_body?: any;
  response_body?: any;
  http_status?: number;
  error_code?: string;
  error_desc?: string;
  duration_ms?: number;
}) {
  try {
    if (!params.company_id) return;
    await prisma.mecefLog.create({
      data: {
        company_id: params.company_id,
        invoice_id: params.invoice_id || null,
        mode: params.mode,
        method: params.method,
        endpoint: params.endpoint,
        request_body: params.request_body ? JSON.parse(JSON.stringify(params.request_body)) : undefined,
        response_body: params.response_body ? JSON.parse(JSON.stringify(params.response_body)) : undefined,
        http_status: params.http_status,
        error_code: params.error_code,
        error_desc: params.error_desc,
        duration_ms: params.duration_ms,
      },
    });
  } catch (err) {
    console.error("[MecefLog] Erreur enregistrement log :", err);
  }
}

/**
 * Effectue un appel HTTP authentifié vers l'API DGI e-MECeF.
 */
async function callDgiApi<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT",
  body?: any,
  options?: { company_id?: string; invoice_id?: string }
): Promise<{ status: number; data: T }> {
  const config = getMecefConfig();
  const url = `${config.baseUrl}${endpoint}`;
  const startTime = Date.now();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/json",
  };

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const duration = Date.now() - startTime;
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    const hasDgiError = !res.ok || (data && typeof data === "object" && Boolean(data.errorCode));
    const errorCode = hasDgiError ? (data?.errorCode || String(res.status)) : undefined;
    const errorDesc = hasDgiError ? (data?.errorDesc || data?.message || text) : undefined;

    await logMecefCall({
      company_id: options?.company_id,
      invoice_id: options?.invoice_id,
      mode: config.mode,
      method,
      endpoint,
      request_body: body,
      response_body: data,
      http_status: res.status,
      error_code: errorCode,
      error_desc: errorDesc,
      duration_ms: duration,
    });

    if (hasDgiError) {
      const msg = data?.errorDesc || data?.message || `Erreur DGI e-MECeF ${res.status}: ${text}`;
      const err: any = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return { status: res.status, data: data as T };
  } catch (err: any) {
    const duration = Date.now() - startTime;
    await logMecefCall({
      company_id: options?.company_id,
      invoice_id: options?.invoice_id,
      mode: config.mode,
      method,
      endpoint,
      request_body: body,
      response_body: { error: err.message },
      http_status: err.status || 500,
      error_code: "NETWORK_OR_API_ERROR",
      error_desc: err.message,
      duration_ms: duration,
    });
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINTS OFFICIELS DGI e-MECeF
// ─────────────────────────────────────────────────────────────────────────────

/** 1. POST /api/invoice — Enregistre la facture et retourne l'UID */
export async function postInvoice(
  request: MecefInvoiceRequest,
  options?: { company_id?: string; invoice_id?: string }
): Promise<MecefPostResponse> {
  const { data } = await callDgiApi<MecefPostResponse>("/invoice", "POST", request, options);
  return data;
}

/** 2. PUT /api/invoice/{uid}/confirm — Finalise la facture et retourne les éléments de sécurité */
export async function confirmInvoice(
  uid: string,
  options?: { company_id?: string; invoice_id?: string }
): Promise<MecefSecurityElements> {
  const { data } = await callDgiApi<MecefSecurityElements>(`/invoice/${uid}/confirm`, "PUT", null, options);
  return data;
}

/** 3. GET /api/invoice/{uid} — Récupère les détails d'une facture */
export async function getInvoiceDetails(
  uid: string,
  options?: { company_id?: string; invoice_id?: string }
): Promise<unknown> {
  const { data } = await callDgiApi(`/invoice/${uid}`, "GET", null, options);
  return data;
}

/** 4. GET /api/info/status — État de la machine et informations du contribuable */
export async function getInfoStatus(company_id?: string): Promise<any> {
  const { data } = await callDgiApi("/info/status", "GET", null, { company_id });
  return data;
}

/** 5. GET /api/info/invoiceTypes — Types de facture autorisés */
export async function getInvoiceTypes(company_id?: string): Promise<any> {
  const { data } = await callDgiApi("/info/invoiceTypes", "GET", null, { company_id });
  return data;
}

/** 6. GET /api/info/taxGroups — Groupes de taxation et taux en vigueur */
export async function getTaxGroups(company_id?: string): Promise<any> {
  const { data } = await callDgiApi("/info/taxGroups", "GET", null, { company_id });
  return data;
}

/** 7. GET /api/info/paymentTypes — Modes de paiement officiels */
export async function getPaymentTypes(company_id?: string): Promise<any> {
  const { data } = await callDgiApi("/info/paymentTypes", "GET", null, { company_id });
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// SÉQUENCE COMPLÈTE DE NORMALISATION (POST + CONFIRM)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalise une facture auprès de la DGI en respectant la séquence obligatoire en 2 étapes :
 * 1. POST /invoice (obtention de l'UID) — persisté immédiatement en base
 * 2. PUT /invoice/{uid}/confirm (obtention du code MECeF/DGI, QR code, compteurs)
 */
export async function normalizeInvoice(invoice: {
  id: string;
  company_id: string;
  reference: string;
  type: string;
  total_ttc: number | { toNumber(): number };
  subtotal_ht: number | { toNumber(): number };
  vat_amount: number | { toNumber(): number };
  aib_rate?: string | null;
  mecef_original_ref?: string | null;
  mecef_uid?: string | null;
  additional_description?: string | null;
  commercial_message?: string | null;
  lines?: any[];
  client?: any;
  created_by_user?: any;
  company?: any;
  payment_method?: string | null;
}): Promise<MecefSecurityElements> {
  const config = getMecefConfig();

  // Mode Simulation locale (hors réseau)
  if (config.mode === "simulation") {
    const nim = config.nim || "TS01000001";
    const ifu = config.ifu || "3202687290154";

    // Génération d'un code MECeF/DGI conforme : 24 caractères, 6 groupes de 4 alphanum
    const generateGroup = () => Math.random().toString(36).substring(2, 6).toUpperCase().padEnd(4, "0").substring(0, 4);
    const rawCode = `SIM1-${generateGroup()}-${generateGroup()}-${generateGroup()}-${generateGroup()}-${generateGroup()}`;

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    // QR Code pointant vers l'URL réglementaire DGI Bénin (conforme au rapport de recette T2.4–T2.9)
    const verifyBaseUrl = config.verificationUrl || "https://mecef.impots.bj/verify";
    const qrPayload = `${verifyBaseUrl}?code=${encodeURIComponent(rawCode)}&nim=${encodeURIComponent(nim)}&ifu=${encodeURIComponent(ifu)}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 220, errorCorrectionLevel: "M" });

    const simSecurity: MecefSecurityElements = {
      codeMECeFDGI: rawCode,
      qrCode: qrCodeDataUrl,
      nim,
      counters: `1/1 ${invoice.type === "credit_note" ? "FA" : "FV"}`,
      dateTime: formattedDate,
      totalTTC: Number(invoice.total_ttc || 0),
    };

    if (invoice.id && !invoice.id.startsWith("inv-test-")) {
      try {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            mecef_status: "normalized",
            mecef_dgi_code: simSecurity.codeMECeFDGI,
            mecef_qr_code: simSecurity.qrCode,
            mecef_nim: simSecurity.nim,
            mecef_counters: simSecurity.counters,
            mecef_datetime: now,
          },
        });
      } catch {
        // Mock ou test unitaire
      }
    }

    return simSecurity;
  }

  // 1. Détermination du type de facture DGI (FV, FA, EV, EA)
  let mecefType: MecefInvoiceType = "FV";
  const hasExportLine = (invoice.lines || []).some((l: any) => l.tax_group === "C");
  if (invoice.type === "credit_note") {
    mecefType = hasExportLine ? "EA" : "FA";
  } else if (hasExportLine) {
    mecefType = "EV";
  }

  // 2. Construction des articles en prix TTC (Arrondi XOF entier)
  const items: MecefItem[] = (invoice.lines || []).map((l) => {
    const unitPriceHT = Number(l.unit_price || 0);
    const vatRate = Number(l.vat_rate || 0);
    const taxGroup = (l.tax_group || deriveTaxGroup(vatRate)) as MecefTaxGroup;
    const priceTTC = toMecefPrice(unitPriceHT, vatRate);
    const qty = Number(l.quantity || 1);

    const item: MecefItem = {
      name: l.description || "Article",
      price: priceTTC,
      quantity: qty,
      taxGroup,
    };

    if (l.tax_specific && Number(l.tax_specific) > 0) {
      item.taxSpecific = Math.round(Number(l.tax_specific));
    }

    return item;
  });

  if (items.length === 0) {
    items.push({
      name: "Prestation de service",
      price: Math.round(Number(invoice.total_ttc || 0)),
      quantity: 1,
      taxGroup: "B",
    });
  }

  // 3. Client
  let clientPayload: MecefClient | undefined = undefined;
  if (invoice.client?.name && invoice.client?.name !== "Client Comptant") {
    clientPayload = {
      name: invoice.client.name,
      ifu: invoice.client.ifu || undefined,
      address: invoice.client.address || undefined,
      contact: invoice.client.phone || invoice.client.email || undefined,
    };
  }

  // 4. AIB
  let aibVal: "A" | "B" | undefined = undefined;
  if (invoice.aib_rate === "rate_1") aibVal = "A";
  else if (invoice.aib_rate === "rate_5") aibVal = "B";

  // 5. Description et message commercial
  const additionalDescription = invoice.additional_description
    ? invoice.additional_description.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 3)
    : undefined;

  // 6. Mode de paiement
  const paymentMap: Record<string, string> = {
    cash: "ESPECES",
    bank_transfer: "VIREMENT",
    check: "CHEQUES",
    credit_card: "CARTEBANCAIRE",
    mobile_money: "MOBILEMONEY",
  };
  const payType = (invoice.payment_method && paymentMap[invoice.payment_method]) || "ESPECES";

  const totalCalc = items.reduce((s, i) => s + i.price * i.quantity + (i.taxSpecific || 0), 0);

  const payload: MecefInvoiceRequest = {
    ifu: invoice.company?.ifu || config.ifu,
    type: mecefType,
    items,
    client: clientPayload,
    operator: {
      name: invoice.created_by_user?.name || "Opérateur Comptia",
    },
    payment: [
      {
        name: payType,
        amount: totalCalc,
      },
    ],
    additionalDescription,
    commercialMessage: invoice.commercial_message || undefined,
  };

  if ((mecefType === "FA" || mecefType === "EA") && invoice.mecef_original_ref) {
    payload.reference = invoice.mecef_original_ref;
  }
  if (aibVal) {
    payload.aib = aibVal;
  }

  let uid = invoice.mecef_uid;
  let postData: MecefPostResponse | null = null;

  // ÉTAPE 1 : POST /api/invoice (si non déjà effectué)
  if (!uid) {
    postData = await postInvoice(payload, {
      company_id: invoice.company_id,
      invoice_id: invoice.id,
    });
    uid = postData.uid;

    // PERSISTANCE IMMÉDIATE de l'UID en base de données pour éviter tout doublon
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        mecef_uid: uid,
        mecef_total_ttc: postData.total,
        mecef_status: "awaiting_manual_normalization",
      },
    });
  }

  // ÉTAPE 2 : PUT /api/invoice/{uid}/confirm
  const confirmData = await confirmInvoice(uid, {
    company_id: invoice.company_id,
    invoice_id: invoice.id,
  });

  // Génération du QR Code image DataURL pour affichage et impression PDF
  let qrCodeDataUrl = confirmData.qrCode;
  if (confirmData.qrCode && !confirmData.qrCode.startsWith("data:image")) {
    try {
      // Si l'API renvoie un code brut (non-URL), on le transforme en URL DGI réglementaire
      const qrInput = confirmData.qrCode.startsWith("http")
        ? confirmData.qrCode
        : `${config.verificationUrl}?code=${encodeURIComponent(confirmData.qrCode)}`;
      qrCodeDataUrl = await QRCode.toDataURL(qrInput, { margin: 1, width: 220, errorCorrectionLevel: "M" });
    } catch {
      qrCodeDataUrl = confirmData.qrCode;
    }
  }

  const normalizedResult: MecefSecurityElements = {
    codeMECeFDGI: confirmData.codeMECeFDGI,
    qrCode: qrCodeDataUrl,
    nim: confirmData.nim || config.nim,
    counters: confirmData.counters,
    dateTime: confirmData.dateTime,
    uid,
    totalTTC: postData?.total,
    hab: postData?.hab,
    vab: postData?.vab,
    aib: postData?.aib,
    ts: postData?.ts,
  };

  // Mise à jour finale de la facture normalisée
  if (invoice.id && !invoice.id.startsWith("inv-test-")) {
    try {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          mecef_status: "normalized",
          mecef_dgi_code: normalizedResult.codeMECeFDGI,
          mecef_qr_code: normalizedResult.qrCode,
          mecef_nim: normalizedResult.nim,
          mecef_counters: normalizedResult.counters,
          mecef_datetime: new Date(),
        },
      });
    } catch {
      // Mock ou test unitaire
    }
  }

  return normalizedResult;
}
