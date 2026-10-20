"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");
  const registered = searchParams.get("registered");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      toast.error("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error || !result?.ok) {
        toast.error("Identifiants incorrects ou compte inactif. Veuillez vérifier vos accès.");
      } else {
        toast.success("Connexion réussie ! Redirection en cours...");
        window.location.href = callbackUrl;
      }
    } catch {
      toast.error("Une erreur réseau est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Pour réinitialiser votre mot de passe, veuillez vous rapprocher de l'administrateur de votre entreprise ou contacter le support Ceilow.");
  };

  return (
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
            priority
          />
          <Image
            src="/logo/ceilow_web_jaune.svg"
            alt="Ceilow"
            width={120}
            height={32}
            className="h-8 w-auto hidden dark:block"
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

      {/* Titre & sous-titre de connexion */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl sm:text-[28px] font-semibold text-ink leading-[34px] tracking-tight">
          Content de vous revoir
        </h1>
        <p className="text-base text-text-muted leading-6">
          Connectez-vous pour accéder à votre espace Ceilow.
        </p>
      </div>

      {/* Alerte compte créé avec succès */}
      {registered && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-ink">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <div className="space-y-1">
            <p className="font-semibold text-ink">Compte configuré avec succès</p>
            <p className="text-xs text-text-muted leading-relaxed">
              Votre espace entreprise et votre plan SYSCOHADA sont prêts. Vous pouvez maintenant vous connecter.
            </p>
          </div>
        </div>
      )}

      {/* Alerte compte suspendu */}
      {errorParam === "account_suspended" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <div className="space-y-1">
            <p className="font-semibold">Accès restreint</p>
            <p className="text-xs text-error/90 leading-relaxed">
              Ce compte a été suspendu par un administrateur. Veuillez contacter le gestionnaire de votre organisation.
            </p>
          </div>
        </div>
      )}

      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Champ Email */}
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
            required
            autoComplete="email"
            className="w-full h-12 px-4 text-base text-ink bg-background border border-border rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Champ Mot de passe */}
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
              required
              autoComplete="current-password"
              className="w-full h-12 px-4 pr-12 text-base text-ink bg-background border border-border rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40"
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
        </div>

        {/* Lien Mot de passe oublié */}
        <div className="flex justify-end pt-0.5">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-semibold text-ink hover:text-primary transition-colors min-h-[44px] inline-flex items-center"
          >
            Mot de passe oublié ?
          </button>
        </div>

        {/* Bouton Primaire : Se connecter */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 min-h-[44px] bg-primary border-2 border-primary text-ink font-semibold text-[15px] rounded-lg hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-ink" />
              <span>Connexion en cours...</span>
            </>
          ) : (
            <span>Se connecter</span>
          )}
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

        {/* Création de compte */}
        <p className="text-center text-sm text-ink pt-2">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold underline underline-offset-4 hover:text-primary transition-colors"
          >
            Créer un compte gratuitement
          </Link>
        </p>
      </form>

      {/* Footer / mentions de réassurance */}
      <div className="mt-12 pt-6 border-t border-border/60 text-center">
        <p className="text-xs font-medium text-text-muted">
          © 2026 Ceilow · Confidentialité et mentions légales · Contact
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-background-secondary">
      {/* ── PANNEAU GAUCHE : MARQUE (Panneau-de-marque.svg) ── */}
      <div className="hidden lg:flex lg:w-[640px] xl:w-[640px] shrink-0 min-h-screen bg-ink relative overflow-hidden items-center justify-center">
        {/* Logo Ceilow cliquable renvoyant vers l'accueil */}
        <Link
          href="/"
          title="Ceilow — Retour à l'accueil"
          aria-label="Ceilow — Retour à l'accueil"
          className="absolute top-6 left-8 sm:top-8 sm:left-12 w-52 h-20 z-30 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="sr-only">Retour à l'accueil Ceilow</span>
        </Link>

        {/* Panneau de marque officiel */}
        <div className="relative w-full h-full min-h-screen flex items-center justify-center">
          <Image
            src="/Panneau-de-marque.svg"
            alt="Ceilow - Votre gestion financière, enfin simple"
            width={640}
            height={960}
            priority
            className="w-full h-full object-cover max-h-screen select-none"
          />
        </div>
      </div>

      {/* ── PANNEAU DROIT : FORMULAIRE ── */}
      <div className="flex-1 min-h-screen flex flex-col justify-between items-center px-6 py-8 sm:px-12 sm:py-12 lg:px-16 lg:py-16">
        {/* Espace supérieur flexible */}
        <div className="w-full flex-1 flex items-center justify-center">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center gap-3 p-8">
                <Loader2 className="w-8 h-8 animate-spin text-ink" />
                <p className="text-sm text-text-muted">Chargement de la page...</p>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
