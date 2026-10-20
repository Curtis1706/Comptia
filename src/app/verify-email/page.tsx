"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Mail, Loader2, ArrowRight } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  return (
    <div className="min-h-screen w-full bg-background-secondary text-ink flex flex-col items-center">
      {/* ── EN-TÊTE SOMBRE (Hero Header) ── */}
      <header className="w-full bg-ink text-white pb-16 lg:pb-20">
        <PublicHeader />

        {/* Titre & Sous-titre Hero conforme Figma */}
        <div className="max-w-[820px] w-full mx-auto px-6 pt-10 sm:pt-14 text-center flex flex-col items-center gap-4 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-semibold text-white leading-tight tracking-tight">
            Vérifiez votre boîte mail
          </h1>
          <p className="text-base sm:text-lg text-white/85 max-w-[620px] leading-relaxed">
            Nous vous avons envoyé un lien pour activer votre compte.
          </p>
        </div>
      </header>

      {/* ── SECTION CENTRALE CONFORME FIGMA ── */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-20 lg:py-24">
        <div className="w-full max-w-[578px] flex flex-col items-center gap-6">
          {/* Boîte d'alerte verte conforme Figma */}
          <div className="w-full bg-success/20 border border-success/40 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 shadow-sm animate-fade-in">
            {/* Pastille circulaire verte avec check */}
            <div className="w-[22px] h-[22px] rounded-full bg-success-deep flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white stroke-[3]" />
            </div>

            {/* Textes de l'alerte */}
            <div className="flex-1 flex flex-col gap-0.5 text-left">
              <p className="text-sm font-semibold text-ink leading-5">
                E-mail de confirmation envoyé
              </p>
              <p className="text-sm text-text-muted leading-relaxed">
                {emailParam ? (
                  <>
                    Un lien sécurisé a été transmis à <span className="font-semibold text-ink">{emailParam}</span>. Cliquez dessus pour activer votre accès.
                  </>
                ) : (
                  "Cliquez sur le lien reçu dans votre messagerie pour activer et sécuriser votre accès Ceilow."
                )}
              </p>
            </div>
          </div>

          {/* Boutons d'action conforme Figma (Retour à l'accueil & Se connecter) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            {/* Bouton Primaire (160px) : Retour à l'accueil */}
            <Link
              href="/"
              className="w-full sm:w-[160px] h-11 min-h-[44px] bg-primary border-2 border-primary text-ink font-semibold text-[15px] rounded-lg hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <span>Retour à l'accueil</span>
            </Link>

            {/* Bouton Secondaire (133px) : Se connecter */}
            <Link
              href="/login"
              className="w-full sm:w-[133px] h-11 min-h-[44px] border-2 border-ink bg-transparent hover:bg-ink/5 active:scale-[0.99] text-ink font-semibold text-[15px] rounded-lg flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>Se connecter</span>
            </Link>
          </div>

          {/* Note informative de renvoi d'email */}
          <div className="pt-2 text-center">
            <p className="text-xs text-text-muted">
              Vous n'avez pas reçu l'email ? Vérifiez vos courriers indésirables (spams) ou{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-ink font-medium text-ink transition-colors"
              >
                contactez notre support
              </Link>.
            </p>
          </div>
        </div>
      </main>

      {/* ── PIED DE PAGE SOMBRE (Footer unifié conforme Figma) ── */}
      <PublicFooter />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-ink flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
