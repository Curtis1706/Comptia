"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { SECTORS_LIST } from "@/constants/sector-modules";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

const TEAM_SIZES = [
  { value: "1-5", label: "1 à 5 personnes" },
  { value: "6-20", label: "6 à 20 personnes" },
  { value: "21-50", label: "21 à 50 personnes" },
  { value: "50+", label: "Plus de 50 personnes" },
];

function DemoContent() {
  const searchParams = useSearchParams();
  const initialSubmitted = searchParams.get("submitted") === "true";

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    entreprise: "",
    secteur: "services",
    tailleEquipe: "1-5",
    message: "",
    acceptContact: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // États des listes déroulantes personnalisées animées
  const [openSecteur, setOpenSecteur] = useState(false);
  const [openTaille, setOpenTaille] = useState(false);

  const secteurRef = useRef<HTMLDivElement>(null);
  const tailleRef = useRef<HTMLDivElement>(null);

  // Fermeture au clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (secteurRef.current && !secteurRef.current.contains(event.target as Node)) {
        setOpenSecteur(false);
      }
      if (tailleRef.current && !tailleRef.current.contains(event.target as Node)) {
        setOpenTaille(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const selectSecteur = (key: string) => {
    setFormData((prev) => ({ ...prev, secteur: key }));
    setOpenSecteur(false);
  };

  const selectTaille = (val: string) => {
    setFormData((prev) => ({ ...prev, tailleEquipe: val }));
    setOpenTaille(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Erreur : vérifiez cette valeur.";
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Erreur : vérifiez cette valeur.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Erreur : vérifiez cette valeur.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Erreur : format d'adresse email invalide.";
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Erreur : vérifiez cette valeur.";
    }

    if (!formData.entreprise.trim()) {
      newErrors.entreprise = "Erreur : vérifiez cette valeur.";
    }

    if (!formData.acceptContact) {
      newErrors.acceptContact = "Erreur consentement : consentement requis pour organiser la démo.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstFieldId = Object.keys(newErrors)[0];
      const element = document.getElementById(firstFieldId);
      if (element) {
        element.focus();
      }
      toast.error("Veuillez corriger les champs en erreur ci-dessous.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      toast.success("Demande de démonstration envoyée avec succès !");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Une erreur réseau est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const currentSecteurLabel =
    SECTORS_LIST.find((s) => s.key === formData.secteur)?.label || "Choisir…";

  const currentTailleLabel =
    TEAM_SIZES.find((t) => t.value === formData.tailleEquipe)?.label || "Choisir…";

  return (
    <div className="min-h-screen w-full bg-background-secondary text-ink flex flex-col items-center">
      {/* ── EN-TÊTE SOMBRE (Hero Header) ── */}
      <header className="w-full bg-ink text-white pb-16 lg:pb-20">
        <PublicHeader />

        {/* Titre & Sous-titre dynamique */}
        <div className="max-w-[820px] w-full mx-auto px-6 pt-10 sm:pt-14 text-center flex flex-col items-center gap-4">
          <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-semibold text-white leading-tight tracking-tight animate-fade-in">
            {submitted
              ? "Merci, votre demande est envoyée"
              : "Voyez Ceilow en action"}
          </h1>
          <p className="text-base sm:text-lg text-white/85 max-w-[620px] leading-relaxed">
            {submitted
              ? "Notre équipe vous répondra pour convenir d'un créneau."
              : "Échangez avec notre équipe et découvrez comment Ceilow s'adapte à votre activité."}
          </p>
        </div>
      </header>

      {/* ── SECTION CENTRALE : SOUMISE OU FORMULAIRE AVEC LISTE DÉROULANTE ── */}
      {submitted ? (
        /* ÉTAT SOUMIS */
        <section className="w-full flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-20 lg:py-24 animate-fade-in">
          <div className="w-full max-w-[578px] flex flex-col items-center gap-6">
            <div className="w-full bg-success/20 border border-success/40 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 shadow-sm">
              <div className="w-[22px] h-[22px] rounded-full bg-success-deep flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>

              <div className="flex-1 flex flex-col gap-0.5 text-left">
                <p className="text-sm font-semibold text-ink leading-5">
                  Demande confirmée
                </p>
                <p className="text-sm text-text-muted leading-5">
                  Elle a été transmise à notre équipe. Nous vous recontacterons sous 24h ouvrées.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <Link
                href="/"
                className="w-full sm:w-[160px] h-11 min-h-[44px] bg-primary border-2 border-primary text-ink font-semibold text-[15px] rounded-lg hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <span>Retour à l'accueil</span>
              </Link>

              <Link
                href="/register"
                className="w-full sm:w-[192px] h-11 min-h-[44px] border-2 border-ink bg-transparent hover:bg-ink/5 active:scale-[0.99] text-ink font-semibold text-[15px] rounded-lg flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>Créer un compte</span>
              </Link>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-text-muted hover:text-ink underline underline-offset-4 transition-colors min-h-[44px] inline-flex items-center"
              >
                Soumettre une autre demande ou modifier les informations
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* ÉTAT INITIAL OU FORMULAIRE */
        <main className="max-w-[1200px] w-full mx-auto px-6 py-12 lg:py-16 flex flex-col lg:flex-row justify-center items-start gap-12 lg:gap-16">
          {/* Colonne gauche : Ce que vous verrez */}
          <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
            <h2 className="text-2xl sm:text-[28px] font-semibold text-ink leading-[34px] tracking-tight">
              Ce que vous verrez pendant la démo
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3.5 group">
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                  <Check className="w-3 h-3 text-ink stroke-[3]" />
                </div>
                <p className="text-base text-ink leading-6">
                  Le parcours de facturation, de la création à l'envoi
                </p>
              </div>

              <div className="flex items-start gap-3.5 group">
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                  <Check className="w-3 h-3 text-ink stroke-[3]" />
                </div>
                <p className="text-base text-ink leading-6">
                  Le suivi de votre TVA et de votre trésorerie
                </p>
              </div>

              <div className="flex items-start gap-3.5 group">
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                  <Check className="w-3 h-3 text-ink stroke-[3]" />
                </div>
                <p className="text-base text-ink leading-6">
                  Le rapprochement avec vos banques et Mobile Money
                </p>
              </div>

              <div className="flex items-start gap-3.5 group">
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                  <Check className="w-3 h-3 text-ink stroke-[3]" />
                </div>
                <p className="text-base text-ink leading-6">
                  Vos questions, avec des réponses adaptées à votre activité
                </p>
              </div>
            </div>

            <div className="bg-primary/20 border border-primary/40 rounded-2xl p-5 flex flex-col gap-1.5 mt-2 transition-shadow hover:shadow-card">
              <span className="font-semibold text-sm text-ink">
                Durée et format
              </span>
              <p className="text-sm text-text-muted leading-relaxed">
                30 minutes en visio ou par téléphone. Démonstration personnalisée et sans engagement avec un expert Ceilow basé au Bénin.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-text-muted leading-relaxed">
                Conforme aux exigences e-MECeF de la DGI et au Système Comptable OHADA (SYSCOHADA Révisé).
              </p>
            </div>
          </div>

          {/* Colonne droite : Formulaire */}
          <div className="w-full lg:w-[560px] bg-background border border-border rounded-[20px] p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col gap-5 relative">
            <div>
              <h2 className="text-2xl sm:text-[28px] font-semibold text-ink leading-[34px] tracking-tight">
                Demander ma démo
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Remplissez ce formulaire et notre équipe vous recontactera sous 24h ouvrées.
              </p>
            </div>

            {/* Bannière d'erreur */}
            {Object.keys(errors).length > 0 && (
              <div className="w-full bg-error/10 border border-error/30 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 shadow-sm animate-fade-in">
                <div className="w-[22px] h-[22px] rounded-full bg-error flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <div className="flex-1 flex flex-col gap-0.5 text-left">
                  <p className="text-sm font-semibold text-ink leading-5">
                    Envoi impossible
                  </p>
                  <p className="text-sm text-text-muted leading-5">
                    Vérifiez les champs indiqués ci-dessous puis réessayez.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Ligne Prénom & Nom */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
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
                    <p className="text-sm text-error mt-0.5">{errors.prenom}</p>
                  )}
                </div>

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
                    <p className="text-sm text-error mt-0.5">{errors.nom}</p>
                  )}
                </div>
              </div>

              {/* Adresse email professionnelle */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-ink">
                  Adresse email professionnelle
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
                  <p className="text-sm text-error mt-0.5">{errors.email}</p>
                )}
              </div>

              {/* Numéro de téléphone */}
              <div className="flex flex-col gap-2">
                <label htmlFor="telephone" className="text-sm font-semibold text-ink">
                  Numéro de téléphone (WhatsApp)
                </label>
                <input
                  id="telephone"
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="+229 97 00 00 00"
                  autoComplete="tel"
                  className={`w-full h-12 px-4 text-base text-ink tabular-nums bg-background border ${
                    errors.telephone ? "border-2 border-error" : "border-border"
                  } rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40`}
                />
                {errors.telephone && (
                  <p className="text-sm text-error mt-0.5">{errors.telephone}</p>
                )}
              </div>

              {/* Nom de l'entreprise */}
              <div className="flex flex-col gap-2">
                <label htmlFor="entreprise" className="text-sm font-semibold text-ink">
                  Nom de l'entreprise
                </label>
                <input
                  id="entreprise"
                  type="text"
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleInputChange}
                  placeholder="Saisir…"
                  className={`w-full h-12 px-4 text-base text-ink bg-background border ${
                    errors.entreprise ? "border-2 border-error" : "border-border"
                  } rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40`}
                />
                {errors.entreprise && (
                  <p className="text-sm text-error mt-0.5">{errors.entreprise}</p>
                )}
              </div>

              {/* ── LIGNE LISTES DÉROULANTES PERSONNALISÉES ANIMÉES (Conforme Figma « liste ouverte ») ── */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* Liste Déroulante 1 : Secteur d'activité */}
                <div ref={secteurRef} className="flex-1 flex flex-col gap-2 relative">
                  <label id="secteur-label" className="text-sm font-semibold text-ink">
                    Secteur d'activité
                  </label>
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={openSecteur}
                    aria-labelledby="secteur-label"
                    onClick={() => {
                      setOpenSecteur(!openSecteur);
                      setOpenTaille(false);
                    }}
                    className="w-full h-12 px-4 text-sm text-ink bg-background border border-border rounded-lg outline-none transition-all flex items-center justify-between focus:border-ink focus:ring-2 focus:ring-primary/40 cursor-pointer hover:border-ink/50"
                  >
                    <span className="truncate">{currentSecteurLabel}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-ink transition-transform duration-200 shrink-0 ${
                        openSecteur ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {/* Menu déroulant animé conforme Figma */}
                  {openSecteur && (
                    <div
                      role="listbox"
                      className="absolute left-0 top-[78px] w-full sm:w-[260px] bg-background border border-border shadow-elevated rounded-xl p-2 z-50 max-h-[260px] overflow-y-auto animate-scale-in"
                    >
                      {SECTORS_LIST.map((s) => {
                        const isSelected = s.key === formData.secteur;
                        return (
                          <div
                            key={s.key}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => selectSecteur(s.key)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-background-secondary font-semibold text-ink"
                                : "text-ink hover:bg-background-secondary/70"
                            }`}
                          >
                            <span className="truncate">{s.label}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary shrink-0 ml-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Liste Déroulante 2 : Taille d'équipe */}
                <div ref={tailleRef} className="flex-1 flex flex-col gap-2 relative">
                  <label id="taille-label" className="text-sm font-semibold text-ink">
                    Taille d'équipe
                  </label>
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={openTaille}
                    aria-labelledby="taille-label"
                    onClick={() => {
                      setOpenTaille(!openTaille);
                      setOpenSecteur(false);
                    }}
                    className="w-full h-12 px-4 text-sm text-ink bg-background border border-border rounded-lg outline-none transition-all flex items-center justify-between focus:border-ink focus:ring-2 focus:ring-primary/40 cursor-pointer hover:border-ink/50"
                  >
                    <span className="truncate">{currentTailleLabel}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-ink transition-transform duration-200 shrink-0 ${
                        openTaille ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {/* Menu déroulant animé conforme Figma */}
                  {openTaille && (
                    <div
                      role="listbox"
                      className="absolute left-0 top-[78px] w-full sm:w-[244px] bg-background border border-border shadow-elevated rounded-xl p-2 z-50 max-h-[220px] overflow-y-auto animate-scale-in"
                    >
                      {TEAM_SIZES.map((t) => {
                        const isSelected = t.value === formData.tailleEquipe;
                        return (
                          <div
                            key={t.value}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => selectTaille(t.value)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-background-secondary font-semibold text-ink"
                                : "text-ink hover:bg-background-secondary/70"
                            }`}
                          >
                            <span>{t.label}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary shrink-0 ml-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Champ message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-ink">
                  Votre besoin ou message (Optionnel)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Votre message…"
                  className="w-full p-4 text-base text-ink bg-background border border-border rounded-lg outline-none transition-all placeholder:text-text-muted focus:border-ink focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              {/* Checkbox et erreur consentement */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-start gap-3">
                  <label className={`relative flex items-center justify-center w-5 h-5 mt-0.5 shrink-0 rounded border-2 ${
                    errors.acceptContact ? "border-error" : "border-ink"
                  } bg-background cursor-pointer`}>
                    <input
                      id="acceptContact"
                      type="checkbox"
                      name="acceptContact"
                      checked={formData.acceptContact}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    {formData.acceptContact && (
                      <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
                    )}
                  </label>
                  <label
                    htmlFor="acceptContact"
                    className="text-sm text-ink leading-5 cursor-pointer select-none"
                    onClick={() =>
                      setFormData((p) => ({ ...p, acceptContact: !p.acceptContact }))
                    }
                  >
                    J'accepte d'être recontacté(e) par l'équipe Ceilow pour organiser cette démonstration.
                  </label>
                </div>
                {errors.acceptContact && (
                  <p className="text-sm text-error mt-1">
                    {errors.acceptContact}
                  </p>
                )}
              </div>

              {/* Bouton Primaire : Planifier ma démo */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 min-h-[48px] bg-primary border-2 border-primary text-ink font-semibold text-[15px] rounded-lg hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-ink" />
                    <span>Enregistrement en cours...</span>
                  </>
                ) : (
                  <span>Planifier ma démo</span>
                )}
              </button>
            </form>
          </div>
        </main>
      )}

      {/* ── PIED DE PAGE SOMBRE (Footer conforme Figma) ── */}
      <PublicFooter />
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-ink flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
