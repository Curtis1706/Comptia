"use client";

import React, { Suspense, useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import {
  GA_MEASUREMENT_ID,
  readStoredConsent,
  saveConsentChoice,
  trackEvent,
  trackPageView,
  updateGtagConsent,
} from "@/lib/analytics";

function AnalyticsRouteListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !pathname) return;
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const stored = readStoredConsent();
    if (stored === "granted") {
      updateGtagConsent(true);
      setShowBanner(false);
    } else if (stored === "denied") {
      updateGtagConsent(false);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "/";

      if (href.includes("wa.me/") || href.includes("whatsapp.com")) {
        trackEvent("whatsapp_click", {
          link_url: href,
          link_text: anchor.textContent?.trim().slice(0, 80) || "WhatsApp",
          page_path: currentPath,
        });
      } else if (href.startsWith("tel:")) {
        trackEvent("phone_click", {
          link_url: href,
          page_path: currentPath,
        });
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  const handleConsent = (granted: boolean) => {
    saveConsentChoice(granted ? "granted" : "denied");
    setShowBanner(false);
  };

  return (
    <>
      <Script id="ceilow-gtag-consent-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)}, { anonymize_ip: true });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />

      <Suspense fallback={null}>
        <AnalyticsRouteListener />
      </Suspense>

      {showBanner && (
        <aside
          aria-label="Gestion du consentement aux cookies"
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-background border border-border rounded-2xl p-5 shadow-md text-ink"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-background-secondary border border-border flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-ink" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-bold text-ink">
                  Mesure d&apos;audience respectueuse (APDP)
                </p>
                <p className="text-xs text-text-muted leading-relaxed mt-1">
                  Ceilow utilise des statistiques anonymisées pour améliorer ses guides et parcours. Aucune donnée n&apos;est revendue.{" "}
                  <Link
                    href="/confidentialite#cookies"
                    className="text-ink font-semibold underline underline-offset-2"
                  >
                    En savoir plus
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleConsent(true)}
                  className="bg-primary hover:bg-primary-hover text-ink text-xs font-bold px-4 py-2.5 rounded-xl transition-colors min-h-[44px] cursor-pointer"
                >
                  Tout accepter
                </button>
                <button
                  type="button"
                  onClick={() => handleConsent(false)}
                  className="bg-background-secondary hover:border-ink text-ink text-xs font-semibold px-4 py-2.5 rounded-xl border border-border transition-colors min-h-[44px] cursor-pointer"
                >
                  Refuser
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
