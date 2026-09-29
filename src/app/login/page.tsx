"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      toast.error("Veuillez renseigner votre email et mot de passe.");
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
        toast.error("Identifiants incorrects ou compte inactif. Veuillez réessayer.");
      } else {
        toast.success("Connexion réussie ! Redirection...");
        window.location.href = callbackUrl;
      }
    } catch {
      toast.error("Une erreur réseau est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Pour réinitialiser votre mot de passe, veuillez vous rapprocher de l'administrateur de votre entreprise.");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* En-tête mobile avec bouton retour */}
      <div className="lg:hidden mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-ink transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </div>

      {/* Logo Ceilow */}
      <div className="mb-8">
        <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          <Image
            src="/logo/ceilow_web_sombre.svg"
            alt="Ceilow"
            width={130}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Titre et sous-titre */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          Ravi de vous revoir
        </h1>
        <p className="text-sm text-text-muted mt-2">
          Vous n'avez pas de compte ?{" "}
          <Link
            href="/register"
            className="text-ink font-semibold underline decoration-primary underline-offset-4 hover:text-primary transition-colors min-h-[44px] inline-flex items-center"
          >
            Créer un compte
          </Link>
        </p>
      </div>

      {/* Alerte compte suspendu */}
      {errorParam === "account_suspended" && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <div className="space-y-1">
            <p className="font-semibold">Compte suspendu</p>
            <p className="text-xs text-error/90 leading-relaxed">
              Ce compte a été suspendu par un administrateur. Veuillez contacter votre responsable d'entreprise pour réactiver votre accès.
            </p>
          </div>
        </div>
      )}

      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Adresse email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="exemple@entreprise.bj"
            className="w-full px-4 py-3 min-h-[44px] text-sm text-ink bg-background border border-border rounded-xl outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40"
            required
            autoComplete="email"
          />
        </div>

        {/* Mot de passe */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-ink">
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Saisissez votre mot de passe"
              className="w-full px-4 py-3 pr-12 min-h-[44px] text-sm text-ink bg-background border border-border rounded-xl outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-text-muted hover:text-ink rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Options : Se souvenir de moi & Mot de passe oublié */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <label className="flex items-center gap-2.5 text-sm text-text-muted cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-ink border-border rounded accent-ink focus:ring-2 focus:ring-primary/40 cursor-pointer"
            />
            <span>Se souvenir de moi</span>
          </label>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-text-muted hover:text-ink font-medium underline underline-offset-2 transition-colors min-h-[44px] inline-flex items-center"
          >
            Mot de passe oublié ?
          </button>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] bg-ink text-white font-medium text-sm rounded-xl hover:bg-ink/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Connexion en cours...</span>
            </>
          ) : (
            <span>Se connecter</span>
          )}
        </button>
      </form>

      {/* Note de réassurance */}
      <p className="mt-8 text-center text-xs text-text-muted">
        Système sécurisé conforme SYSCOHADA Révisé et DGI Bénin
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Panneau gauche : Section Image (visible sur desktop/tablette large) */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-ink">
        {/* Bouton retour vers l'accueil */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            title="Retour à l'accueil"
            className="w-11 h-11 bg-ink/75 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-ink hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
        </div>

        {/* Image du panneau gauche */}
        <div className="absolute inset-0">
          <Image
            src="/login.jpg"
            alt="Ceilow"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 0vw, 50vw"
          />
        </div>
      </div>

      {/* Panneau droit : Section Formulaire */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 bg-background">
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
  );
}
