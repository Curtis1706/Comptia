"use client";

const rawGaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/i.test(rawGaMeasurementId)
  ? rawGaMeasurementId
  : "";

export const CONSENT_STORAGE_KEY = "ceilow_analytics_consent";

export type ConsentChoice = "granted" | "denied";

export type AnalyticsEventMap = {
  generate_lead: {
    lead_source: "demo_form" | "contact_form" | "accompagnement_form";
    company_sector?: string;
    team_size?: string;
    subject?: string;
  };
  sign_up: {
    method: "email";
    company_type: string;
    company_sector: string;
  };
  whatsapp_click: {
    link_url: string;
    link_text?: string;
    page_path: string;
  };
  phone_click: {
    link_url: string;
    page_path: string;
  };
  file_download: {
    file_name: string;
    file_extension: "csv" | "pdf_print";
    page_path: string;
  };
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function saveConsentChoice(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Stockage local indisponible (navigation privée stricte)
  }
  updateGtagConsent(choice === "granted");
}

export function updateGtagConsent(granted: boolean): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function trackPageView(url: string): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function trackEvent<K extends keyof AnalyticsEventMap>(
  eventName: K,
  params: AnalyticsEventMap[K]
): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", eventName, params);
}
