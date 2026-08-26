"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, Mail, Lock, Loader2, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RegisterSchema } from "@/lib/validators";
import { z } from "zod";

import { SECTORS_LIST } from "@/constants/sector-modules";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

const OHADA_COMPANY_TYPES = [
  { value: "SARL", label: "SARL — Société à Responsabilité Limitée", desc: "Pluripersonnelle, capital min libre" },
  { value: "SUARL", label: "SUARL — SARL Unipersonnelle", desc: "Associé unique, idéal entrepreneur individuel" },
  { value: "SAS", label: "SAS — Société par Actions Simplifiée", desc: "Grande flexibilité statutaire, startups & PME" },
  { value: "SA", label: "SA — Société Anonyme", desc: "Grandes entreprises (capital min 10 000 000 FCFA)" },
  { value: "EI", label: "EI — Entreprise Individuelle", desc: "Personne physique exerçant en nom propre" },
  { value: "SNC", label: "SNC — Société en Nom Collectif", desc: "Responsabilité solidaire et indéfinie" },
  { value: "SCS", label: "SCS — Société en Commandite Simple", desc: "Commandités et commanditaires" },
  { value: "GIE", label: "GIE — Groupement d'Intérêt Économique", desc: "Mise en commun de moyens" },
  { value: "COOP", label: "COOP — Société Coopérative OHADA", desc: "Coopératives agricoles et d'artisans" },
  { value: "ASSOCIATION", label: "Association / ONG", desc: "Organismes à but non lucratif" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      company: {
        name: "",
        ifu: "",
        rccm: "",
        type: "SARL",
        sector: "services",
        tax_regime: "reel",
        country: "Bénin",
      },
    },
    mode: "onBlur",
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = form;

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = ["name", "email", "password"];
    }
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onActualSubmit = async (values: RegisterFormValues) => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err: any) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(data.error || "Une erreur est survenue lors de l'inscription.");
        }
      } else {
        toast.success("Compte créé et plan comptable SYSCOHADA initialisé !");
        router.push("/login?registered=true");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Rejoignez Comptia</h1>
          <p className="text-muted-foreground mt-2">Créez votre espace comptable conforme aux normes béninoises (SYSCOHADA & DGI)</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8 gap-4">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
            step === 1 ? "border-primary bg-primary text-primary-foreground shadow-glow" : "border-muted text-muted-foreground"
          )}>
            {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
          </div>
          <div className="w-12 h-0.5 bg-muted" />
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
            step === 2 ? "border-primary bg-primary text-primary-foreground shadow-glow" : "border-muted text-muted-foreground"
          )}>
            2
          </div>
        </div>

        <Card className="border-border/50 shadow-elevated bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{step === 1 ? "Informations personnelles" : "Informations entreprise (Bénin & OHADA)"}</CardTitle>
            <CardDescription>
              {step === 1 
                ? "Ces informations serviront à créer votre compte administrateur." 
                : "Configurez votre forme juridique et votre secteur d'activité."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onActualSubmit)} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        placeholder="Jean Dupont" 
                        {...register("name")}
                        className={cn("pl-10", errors.name && "border-destructive")} 
                      />
                    </div>
                    {errors.name && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> {errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email professionnel</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="jean.dupont@exemple.com" 
                        {...register("email")}
                        className={cn("pl-10", errors.email && "border-destructive")} 
                      />
                    </div>
                    {errors.email && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> {errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        {...register("password")}
                        className={cn("pl-10", errors.password && "border-destructive")} 
                      />
                    </div>
                    {errors.password ? (
                      <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> {errors.password.message}</p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground">8 caractères min, une majuscule et un chiffre.</p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom ou Raison sociale</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="companyName" 
                        placeholder="Ma Société Béninoise SARL" 
                        {...register("company.name")}
                        className={cn("pl-10", errors.company?.name && "border-destructive")} 
                      />
                    </div>
                    {errors.company?.name && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> {errors.company.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="companyType">Forme juridique (Droit OHADA)</Label>
                      <select
                        id="companyType"
                        {...register("company.type")}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {OHADA_COMPANY_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companySector">Secteur d'activité</Label>
                      <select
                        id="companySector"
                        {...register("company.sector")}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {SECTORS_LIST.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifu">IFU (Identifiant Fiscal Unique Bénin)</Label>
                    <div className="relative">
                      <Input 
                        id="ifu" 
                        placeholder="1234567890123" 
                        {...register("company.ifu")}
                        className={cn(errors.company?.ifu && "border-destructive")} 
                      />
                    </div>
                    {errors.company?.ifu ? (
                      <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> {errors.company.ifu.message}</p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic">Numéro d'immatriculation fiscale à 13 chiffres délivré par la DGI.</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="rccm">RCCM (Optionnel)</Label>
                      <Input 
                        id="rccm" 
                        placeholder="RB-COT-2024-B-1234" 
                        {...register("company.rccm")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email entreprise</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="companyEmail" 
                          type="email" 
                          placeholder="contact@entreprise.bj" 
                          {...register("company.email")}
                          className={cn("pl-10", errors.company?.email && "border-destructive")} 
                        />
                      </div>
                      {errors.company?.email && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> {errors.company.email.message}</p>}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                {step === 2 && (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                )}
                
                {step === 1 ? (
                  <Button type="button" onClick={nextStep} className="flex-1 shadow-glow group">
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1 shadow-glow" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Créer mon espace"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-border/50 pt-6">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
