"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Phone, Mail, User, Building2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DemoPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    email: "",
    telephone: "",
    entreprise: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.nom.trim()) newErrors.nom = "Votre nom est requis";
    if (!formData.prenoms.trim()) newErrors.prenoms = "Vos prénoms sont requis";
    if (!formData.email.trim()) newErrors.email = "Votre email est requis";
    if (!formData.telephone.trim()) newErrors.telephone = "Votre numéro de téléphone est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Veuillez renseigner tous les champs obligatoires.");
      return;
    }

    setLoading(true);

    // Simulation de traitement et enregistrement
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Demande de démonstration envoyée avec succès !");
    }, 900);
  };

  return (
    <div className="min-h-screen w-full bg-background text-ink flex flex-col lg:flex-row">
      {/* ── PANNEAU GAUCHE : PRÉSENTATION & RÉASSURANCE (Masqué sur mobile, visible dès lg) ──── */}
      <div className="hidden lg:flex lg:w-1/2 bg-background-secondary border-r border-border p-6 sm:p-10 lg:p-14 flex-col justify-between">
        <div>
          {/* Logo Ceilow officiel */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
              aria-label="Retour à l'accueil"
            >
              <Image
                src="/logo/ceilow_web_sombre.svg"
                alt="Ceilow"
                width={130}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <Link
              href="/"
              className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink min-h-[44px] px-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Accueil</span>
            </Link>
          </div>

          {/* Grand titre accrocheur */}
          <div className="mt-10 sm:mt-14 max-w-xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-ink tracking-tight leading-snug">
              Découvrez Ceilow, la solution de Comptabilité, Facturation &amp; Fiscalité qui allie simplicité, performance et conformité légale.
            </h1>

            {/* Chiffres clés / métriques de réassurance (Aérés, sans séparateurs rigides) */}
            <div className="mt-8 sm:mt-10 space-y-6">
              <div>
                <span className="text-3xl sm:text-4xl font-bold font-mono text-ink tabular-nums block">
                  +500
                </span>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  professionnels et dirigeants pilotent leur activité avec Ceilow.
                </p>
              </div>

              <div>
                <span className="text-3xl sm:text-4xl font-bold font-mono text-ink tabular-nums block">
                  +15 000
                </span>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  factures certifiées e-MECeF et écritures générées en toute conformité DGI.
                </p>
              </div>
            </div>

            {/* Logos Entreprises de référence au Bénin (Style épuré sans cadres rectangulaires) */}
            <div className="mt-12 sm:mt-14">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-6">
                Entreprises de référence au Bénin
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 items-center">
                <div className="flex items-center gap-2 text-ink">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span className="font-display font-bold text-xs sm:text-sm tracking-tight text-ink">
                    BÉNIN LOGISTIQUE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <div className="w-2 h-2 rounded-full bg-ink flex-shrink-0"></div>
                  <span className="font-display font-semibold text-xs sm:text-sm text-ink">
                    NovaConseil
                  </span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span className="font-display font-bold text-[11px] sm:text-xs uppercase tracking-wider text-ink">
                    FIDUCIAIRE DU LITTORAL
                  </span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <div className="w-2 h-2 rounded-full bg-ink flex-shrink-0"></div>
                  <span className="font-display font-bold text-xs sm:text-sm tracking-tight text-ink">
                    AGRIBÉNIN
                  </span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span className="font-display font-medium text-xs sm:text-sm text-ink">
                    Atlantique Services
                  </span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <div className="w-2 h-2 rounded-full bg-ink flex-shrink-0"></div>
                  <span className="font-display font-semibold text-xs tracking-tight text-ink">
                    Transit &amp; Commerce
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton retour en bas à gauche */}
        <div className="mt-10 pt-6 border-t border-border hidden lg:block">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-ink transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>
        </div>
      </div>

      {/* ── PANNEAU DROIT : FORMULAIRE DE PLANIFICATION DE DÉMO (Seul visible sur mobile) ──── */}
      <div className="w-full lg:w-1/2 bg-background p-6 sm:p-10 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {/* En-tête mobile exclusif (Logo & Retour) */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-border lg:hidden">
            <Link
              href="/"
              className="flex items-center min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
              aria-label="Retour à l'accueil"
            >
              <Image
                src="/logo/ceilow_web_sombre.svg"
                alt="Ceilow"
                width={120}
                height={30}
                className="h-7 w-auto"
                priority
              />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink min-h-[44px] px-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </Link>
          </div>
          {submitted ? (
            /* État de confirmation après envoi */
            <div className="bg-background-secondary border border-border rounded-2xl p-8 sm:p-10 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-success/20 border border-success/40 text-success-deep flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold font-display text-ink">
                Demande bien reçue !
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Merci <span className="font-semibold text-ink">{formData.prenoms}</span>. Un conseiller Ceilow basé à Cotonou va vous contacter sous 24h ouvrées au <span className="font-mono font-semibold text-ink">{formData.telephone}</span> pour planifier votre session de démonstration personnalisée.
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className="min-h-[48px] inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-ink font-semibold text-sm hover:brightness-95 transition-all shadow-sm"
                >
                  Retourner à l&apos;accueil
                </Link>
              </div>
            </div>
          ) : (
            /* Formulaire standard */
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink">
                  Planifiez une démo
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Planifiez un échange avec notre équipe et découvrez comment Ceilow peut optimiser votre comptabilité, votre facturation certifiée e-MECeF et vos déclarations fiscales.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Téléphone (avec indicatif Bénin) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider block">
                    Téléphone (WhatsApp ou appel direct) <span className="text-error">*</span>
                  </label>
                  <div className="flex rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary overflow-hidden min-h-[44px]">
                    <div className="px-3.5 bg-background-secondary border-r border-border flex items-center gap-1 text-xs font-semibold text-ink flex-shrink-0 font-mono">
                      <span className="text-[10px] px-1 py-0.5 rounded bg-background border border-border font-bold">BJ</span>
                      <span>+229</span>
                    </div>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="97 00 00 00"
                      className="w-full px-4 py-2.5 bg-transparent text-ink text-sm outline-none font-mono"
                      required
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-[11px] text-error font-medium">{errors.telephone}</p>
                  )}
                </div>

                {/* Nom et Prénoms côte à côte */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink uppercase tracking-wider block">
                      Nom <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      className={`w-full px-4 py-2.5 rounded-xl border bg-background text-ink text-sm outline-none focus:ring-2 focus:ring-primary min-h-[44px] ${
                        errors.nom ? "border-error" : "border-border"
                      }`}
                      required
                    />
                    {errors.nom && (
                      <p className="text-[11px] text-error font-medium">{errors.nom}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink uppercase tracking-wider block">
                      Prénoms <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      name="prenoms"
                      value={formData.prenoms}
                      onChange={handleInputChange}
                      placeholder="Vos prénoms"
                      className={`w-full px-4 py-2.5 rounded-xl border bg-background text-ink text-sm outline-none focus:ring-2 focus:ring-primary min-h-[44px] ${
                        errors.prenoms ? "border-error" : "border-border"
                      }`}
                      required
                    />
                    {errors.prenoms && (
                      <p className="text-[11px] text-error font-medium">{errors.prenoms}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider block">
                    Email <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="exemple@gmail.com"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-background text-ink text-sm outline-none focus:ring-2 focus:ring-primary min-h-[44px] ${
                      errors.email ? "border-error" : "border-border"
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-[11px] text-error font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Nom de l'entreprise */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider block">
                    Nom de votre entreprise ou cabinet
                  </label>
                  <input
                    type="text"
                    name="entreprise"
                    value={formData.entreprise}
                    onChange={handleInputChange}
                    placeholder="Ex: Bénin Commerce SARL"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-ink text-sm outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  />
                </div>

                {/* Bouton de soumission */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-primary text-ink font-bold text-sm sm:text-base hover:brightness-95 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmission en cours...</span>
                      </>
                    ) : (
                      <span>Planifier ma démo personnalisée</span>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
