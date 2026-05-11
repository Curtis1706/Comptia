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

type RegisterFormValues = z.infer<typeof RegisterSchema>;

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
        tax_regime: "reel",
        country: "Bénin",
      },
    },
    mode: "onBlur",
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch } = form;

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
        // If it's a validation error from server, show it
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err: any) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(data.error || "Une erreur est survenue lors de l'inscription.");
        }
      } else {
        toast.success("Compte créé avec succès !");
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

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Rejoignez Comptia</h1>
          <p className="text-muted-foreground mt-2">Créez votre compte administrateur et votre entreprise</p>
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
            <CardTitle>{step === 1 ? "Informations personnelles" : "Informations entreprise"}</CardTitle>
            <CardDescription>
              {step === 1 
                ? "Ces informations serviront à créer votre compte administrateur." 
                : "Parlez-nous de votre structure pour configurer votre espace."}
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
                    <Label htmlFor="email">Email</Label>
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
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="companyName" 
                        placeholder="Ma Super Entreprise" 
                        {...register("company.name")}
                        className={cn("pl-10", errors.company?.name && "border-destructive")} 
                      />
                    </div>
                    {errors.company?.name && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> {errors.company.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifu">IFU (Identifiant Fiscal Unique)</Label>
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
                      <p className="text-[10px] text-muted-foreground italic">Ex: 1234567890123 (13 chiffres au Bénin).</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rccm">RCCM (Optionnel)</Label>
                    <div className="relative">
                      <Input 
                        id="rccm" 
                        placeholder="RB-ABC-2024-B-1234" 
                        {...register("company.rccm")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email entreprise</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="companyEmail" 
                        type="email" 
                        placeholder="contact@entreprise.com" 
                        {...register("company.email")}
                        className={cn("pl-10", errors.company?.email && "border-destructive")} 
                      />
                    </div>
                    {errors.company?.email && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> {errors.company.email.message}</p>}
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
