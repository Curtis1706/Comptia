"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Loader2, Check, AlertCircle, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { SECTORS_LIST } from "@/constants/sector-modules";

const OHADA_COMPANY_TYPES = [
  { value: "SARL", label: "SARL : Société à Responsabilité Limitée" },
  { value: "SUARL", label: "SUARL : SARL Unipersonnelle" },
  { value: "SAS", label: "SAS : Société par Actions Simplifiée" },
  { value: "SA", label: "SA : Société Anonyme" },
  { value: "EI", label: "EI : Entreprise Individuelle" },
  { value: "SNC", label: "SNC : Société en Nom Collectif" },
  { value: "SCS", label: "SCS : Société en Commandite Simple" },
  { value: "GIE", label: "GIE : Groupement d'Intérêt Économique" },
  { value: "COOP", label: "COOP : Société Coopérative OHADA" },
  { value: "ASSOCIATION", label: "Association / ONG" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    acceptTerms: false,
    companyName: "",
    ifu: "",
    rccm: "",
    companyType: "SARL",
    companySector: "services",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Veuillez renseigner votre prénom.";
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Veuillez renseigner votre nom.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Veuillez renseigner votre adresse email.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Erreur : format d'adresse email invalide.";
    }

    if (!formData.password) {
      newErrors.password = "Veuillez définir un mot de passe.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit comporter au moins 8 caractères.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins une lettre majuscule.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins un chiffre.";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Veuillez accepter les conditions d'utilisation.";
      toast.error("Veuillez accepter les conditions d'utilisation pour continuer.");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Veuillez renseigner la raison sociale de votre entreprise.";
    }

    const ifuTrimmed = formData.ifu.trim();
    if (!ifuTrimmed) {
      newErrors.ifu = "L'Identifiant Fiscal Unique (IFU) est obligatoire.";
    } else if (!/^\d{13}$/.test(ifuTrimmed)) {
      newErrors.ifu = "L'IFU doit comporter exactement 13 chiffres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      toast.error("Veuillez vérifier les informations de votre entreprise.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: `${formData.prenom.trim()} ${formData.nom.trim()}`,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        company: {
          name: formData.companyName.trim(),
          ifu: formData.ifu.trim(),
          rccm: formData.rccm.trim() || undefined,
          type: formData.companyType,
          sector: formData.companySector,
          tax_regime: "reel",
          country: "Bénin",
        },
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((err: { field?: string; message: string }) => {
            toast.error(err.message || "Erreur de validation.");
          });
        } else {
          toast.error(result.error || "Une erreur est survenue lors de la création de votre compte.");
        }
      } else {
        toast.success("Compte créé et plan comptable SYSCOHADA initialisé !");
        router.push("/login?registered=true");
      }
    } catch {
      toast.error("Une erreur réseau est survenue. Veuillez vérifier votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-background-secondary">
      {/* ── PANNEAU GAUCHE : MARQUE (Panneau-de-marque.svg) ── */}
      <div className="hidden lg:flex lg:w-[640px] xl:w-[640px] shrink-0 min-h-screen bg-ink relative overflow-hidden items-center justify-center">
        {/* Logo Ceilow cliquable renvoyant vers l'accueil */}
        <Link
          href="/"
          title="Ceilow : Retour à l'accueil"
          aria-label="Ceilow : Retour à l'accueil"
          className="absolute top-6 left-8 sm:top-8 sm:left-12 w-52 h-20 z-30 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="sr-only">Retour à l'accueil Ceilow</span>
        </Link>

        {/* Panneau de marque officiel */}
        <div className="relative w-full h-full min-h-screen">
          <Image
            src="/Panneau-de-marque.svg"
            alt="Ceilow - Votre gestion financière, enfin simple"
            fill
            sizes="640px"
            priority
            className="object-cover select-none"
          />
        </div>
      </div>

      {/* ── PANNEAU DROIT : FORMULAIRE ── */}
      <div className="flex-1 min-h-screen flex flex-col justify-between items-center px-6 py-8 sm:px-12 sm:py-12 lg:px-16 lg:py-16">
        <div className="w-full flex-1 flex items-center justify-center">
          <div className="w-full max-w-[420px] flex flex-col">
            {/* En-tête mobile (Logo & retour) */}
            <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-border">
              <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                <Image
                  src="/logo/ceilow_web_sombre.svg"
                  alt="Ceilow"
                  width={120}
                  height={32}
                  className="h-8 w-auto dark:hidden"
                  style={{ width: "auto" }}
                  priority
                />
                <Image
                  src="/logo/ceilow_web_jaune.svg"
                  alt="Ceilow"
                  width={120}
                  height={32}
                  className="h-8 w-auto hidden dark:block"
                  style={{ width: "auto" }}
                  priority
                />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-ink transition-colors min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Accueil</span>
              </Link>
            </div>

            {/* Indicateur d'étape */}
            {step === 2 && (
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-text-muted">
                <span className="w-5 h-5 rounded-full bg-primary text-ink flex items-center justify-center text-[11px] font-bold">2</span>
                <span>Étape 2 sur 2 : Configuration Entreprise (Bénin / SYSCOHADA)</span>
              </div>
            )}

            {/* Titre & sous-titre */}
            <div className="flex flex-col gap-2 mb-6">
              <h1 className="text-2xl sm:text-[28px] font-semibold text-ink leading-[34px] tracking-tight">
                {step === 1 ? "Créez votre compte" : "Votre entreprise"}
              </h1>
              <p className="text-base text-text-muted leading-6">
                {step === 1
                  ? "Gratuit pour démarrer. Prêt en quelques minutes."
                  : "Configurez votre entité pour initialiser votre plan comptable SYSCOHADA."}
              </p>
            </div>

            {/* ── ÉTAPE 1 : IDENTIFIANTS (Conforme Maquette Figma) ── */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="flex flex-col gap-4">
                {/* Ligne : Prénom (gauche) & Nom (droite) */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {/* Prénom */}
                  <div className="flex-1 flex flex-col gap-2">
                    <label htmlFor="prenom" className="text-sm font-semibold text-ink">
                      Prénom
                    </label>
                    <input
                      id="prenom"
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      placeholder="Saisir…"
                      autoComplete="given-name"
                      className={`w-full h-12 px-4 text-base text-ink bg-background border ${
                        errors.prenom ? "border-2 border-error" : "border-border"
                      } rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40`}
                    />
                    {errors.prenom && (
                      <p className="text-xs text-error mt-0.5">{errors.prenom}</p>
                    )}
                  </div>

                  {/* Nom */}
                  <div className="flex-1 flex flex-col gap-2">
                    <label htmlFor="nom" className="text-sm font-semibold text-ink">
                      Nom
                    </label>
                    <input
                      id="nom"
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Saisir…"
                      autoComplete="family-name"
                      className={`w-full h-12 px-4 text-base text-ink bg-background border ${
                        errors.nom ? "border-2 border-error" : "border-border"
                      } rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40`}
                    />
                    {errors.nom && (
                      <p className="text-xs text-error mt-0.5">{errors.nom}</p>
                    )}
                  </div>
                </div>

                {/* Adresse email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-ink">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Saisir…"
                    autoComplete="email"
                    className={`w-full h-12 px-4 text-base text-ink bg-background border ${
                      errors.email ? "border-2 border-error" : "border-border"
                    } rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40`}
                  />
                  {errors.email && (
                    <p className="text-xs text-error mt-0.5">{errors.email}</p>
                  )}
                </div>

                {/* Mot de passe */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-semibold text-ink">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Saisir…"
                      autoComplete="new-password"
                      className={`w-full h-12 px-4 pr-12 text-base text-ink bg-background border ${
                        errors.password ? "border-2 border-error" : "border-border"
                      } rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-text-muted hover:text-ink rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="text-xs text-error mt-0.5">{errors.password}</p>
                  ) : (
                    <p className="text-xs text-text-muted">
                      8 caractères minimum, une majuscule et un chiffre.
                    </p>
                  )}
                </div>

                {/* Case à cocher : CGU & Confidentialité */}
                <div className="flex items-start gap-3 pt-1">
                  <label className="relative flex items-center justify-center w-5 h-5 mt-0.5 shrink-0 rounded border-2 border-ink bg-background cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    {formData.acceptTerms && (
                      <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
                    )}
                  </label>
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-ink leading-5 cursor-pointer select-none"
                    onClick={() =>
                      setFormData((p) => ({ ...p, acceptTerms: !p.acceptTerms }))
                    }
                  >
                    J'accepte les conditions d'utilisation et la politique de confidentialité de Ceilow.
                  </label>
                </div>

                {/* Bouton Primaire : Créer mon compte */}
                <button
                  type="submit"
                  className="w-full h-11 min-h-[44px] bg-primary border-2 border-primary text-ink font-semibold text-[15px] rounded-lg hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink cursor-pointer mt-2"
                >
                  <span>Créer mon compte</span>
                </button>

                {/* Séparateur « ou » */}
                <div className="flex items-center gap-3 w-full py-1">
                  <div className="h-[1px] bg-border flex-1" />
                  <span className="text-sm text-text-muted select-none">ou</span>
                  <div className="h-[1px] bg-border flex-1" />
                </div>

                {/* Bouton Secondaire : Demander une démo */}
                <Link
                  href="/demo"
                  className="w-full h-11 min-h-[44px] border-2 border-ink bg-transparent hover:bg-ink/5 active:scale-[0.99] text-ink font-semibold text-[15px] rounded-lg flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span>Demander une démo</span>
                </Link>

                {/* Vous avez déjà un compte ? Se connecter */}
                <p className="text-center text-sm text-ink pt-2">
                  Vous avez déjà un compte ?{" "}
                  <Link
                    href="/login"
                    className="font-semibold underline underline-offset-4 hover:text-primary transition-colors"
                  >
                    Se connecter
                  </Link>
                </p>
              </form>
            )}

            {/* ── ÉTAPE 2 : CONFIGURATION ENTREPRISE (SYSCOHADA & DGI) ── */}
            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4">
                {/* Raison sociale */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="companyName" className="text-sm font-semibold text-ink">
                    Nom ou Raison sociale
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Ex: Bénin Logistique SARL"
                    required
                    className={`w-full h-12 px-4 text-base text-ink bg-background border ${
                      errors.companyName ? "border-2 border-error" : "border-border"
                    } rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40`}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-error mt-0.5">{errors.companyName}</p>
                  )}
                </div>

                {/* Forme juridique OHADA */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="companyType" className="text-sm font-semibold text-ink">
                    Forme juridique (Droit OHADA)
                  </label>
                  <select
                    id="companyType"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 text-sm text-ink bg-background border border-border rounded-lg outline-none transition-all focus:border-ink focus:ring-2 focus:ring-primary/40 cursor-pointer"
                  >
                    {OHADA_COMPANY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Secteur d'activité */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="companySector" className="text-sm font-semibold text-ink">
                    Secteur d'activité principal
                  </label>
                  <select
                    id="companySector"
                    name="companySector"
                    value={formData.companySector}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 text-sm text-ink bg-background border border-border rounded-lg outline-none transition-all focus:border-ink focus:ring-2 focus:ring-primary/40 cursor-pointer"
                  >
                    {SECTORS_LIST.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* IFU Bénin (13 chiffres) */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="ifu" className="text-sm font-semibold text-ink">
                    IFU (Identifiant Fiscal Unique : DGI Bénin)
                  </label>
                  <input
                    id="ifu"
                    type="text"
                    name="ifu"
                    maxLength={13}
                    value={formData.ifu}
                    onChange={handleInputChange}
                    placeholder="13 chiffres (ex: 1234567890123)"
                    required
                    className={`w-full h-12 px-4 text-base text-ink tabular-nums bg-background border ${
                      errors.ifu ? "border-2 border-error" : "border-border"
                    } rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40`}
                  />
                  {errors.ifu ? (
                    <p className="text-xs text-error mt-0.5">{errors.ifu}</p>
                  ) : (
                    <p className="text-xs text-text-muted">
                      Numéro à 13 chiffres requis pour la conformité e-MECeF et la DGI.
                    </p>
                  )}
                </div>

                {/* RCCM (optionnel) */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="rccm" className="text-sm font-semibold text-ink">
                    RCCM (Optionnel)
                  </label>
                  <input
                    id="rccm"
                    type="text"
                    name="rccm"
                    value={formData.rccm}
                    onChange={handleInputChange}
                    placeholder="Ex: RB/COT/20-B-12345"
                    className="w-full h-12 px-4 text-base text-ink bg-background border border-border rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Bouton de validation finale */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 min-h-[44px] bg-primary border-2 border-primary text-ink font-semibold text-[15px] rounded-lg hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-ink" />
                        <span>Création de votre espace en cours...</span>
                      </>
                    ) : (
                      <span>Finaliser mon inscription</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="w-full h-11 min-h-[44px] border-2 border-ink bg-transparent hover:bg-ink/5 active:scale-[0.99] text-ink font-semibold text-[15px] rounded-lg flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour à mes identifiants</span>
                  </button>
                </div>
              </form>
            )}

            {/* Footer / mentions légales */}
            <div className="mt-10 pt-6 border-t border-border/60 text-center">
              <p className="text-xs font-medium text-text-muted">
                © 2026 Ceilow · Confidentialité et mentions légales · Contact
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
