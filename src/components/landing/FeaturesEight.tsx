"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  FileText,
  CreditCard,
  BookOpen,
  Receipt,
  Users,
  TrendingUp,
  Building2,
  Command,
  BellRing,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  Check,
} from "lucide-react";

export function FeaturesEight() {
  const allFeatures = [
    {
      icon: FileText,
      tag: "Facturation",
      title: "Facturation professionnelle",
      desc: "Devis, factures et avoirs certifiés e-MECeF en 1 clic.",
    },
    {
      icon: CreditCard,
      tag: "Banque",
      title: "Rapprochement bancaire",
      desc: "Synchronisation de vos relevés de banques au Bénin.",
    },
    {
      icon: BookOpen,
      tag: "Comptabilité",
      title: "Comptabilité officielle",
      desc: "Journaux et bilans conformes sans saisie manuelle pénible.",
    },
    {
      icon: Receipt,
      tag: "Fiscalité",
      title: "Déclarations DGI & TVA",
      desc: "Calcul automatique du net à payer et liasses prêtes.",
    },
    {
      icon: Users,
      tag: "Social",
      title: "Paie & Salaires",
      desc: "Bulletins conformes et déclarations CNSS sans calcul manuel.",
    },
    {
      icon: TrendingUp,
      tag: "Finances",
      title: "Suivi de Trésorerie",
      desc: "Vision en direct de vos entrées et sorties en FCFA.",
    },
    {
      icon: Building2,
      tag: "Tiers",
      title: "Gestion Clients & Fournisseurs",
      desc: "Historique, IFU et relances d'impayés.",
    },
    {
      icon: Command,
      tag: "Productivité",
      title: "Recherche rapide (Ctrl+K)",
      desc: "Trouvez n'importe quelle facture ou client en 1 seconde.",
    },
    {
      icon: BellRing,
      tag: "Alertes",
      title: "Rappels automatiques",
      desc: "Alertes avant les échéances d'impôts et retards clients.",
    },
    {
      icon: ShieldCheck,
      tag: "Sécurité",
      title: "Sécurité & Rôles d'accès",
      desc: "Vos données chiffrées, gestion des droits par collaborateur.",
    },
    {
      icon: FileSpreadsheet,
      tag: "Partage",
      title: "Exports comptables",
      desc: "Transmission facile en Excel/PDF à votre expert-comptable.",
    },
    {
      icon: Layers,
      tag: "Multi-sites",
      title: "Multi-entreprises",
      desc: "Pilotez plusieurs sociétés ou filiales avec le même compte.",
    },
  ];

  return (
    <section className="w-full py-20 bg-background border-t border-border" id="fonctionnalites">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Header section */}
        <div className="text-center max-w-3xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-background-secondary border border-border px-3 py-1 rounded-full">
            Écosystème Tout-en-un
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-ink tracking-tight mt-4">
            Une plateforme complète, tout votre business
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Remplacez vos outils dispersés par une suite financière intégrée, conçue pour les normes et les réalités des entreprises au Bénin.
          </p>
        </div>

        {/* ── 21st.dev Features 8 Bento Architecture ──────────────────────── */}
        <div className="w-full mb-16">
          <div className="grid grid-cols-6 gap-4">
            {/* Bento Card 1: 100% Conforme e-MECeF (lg:col-span-2) */}
            <Card className="relative col-span-6 lg:col-span-2 bg-background-secondary border-border rounded-xl overflow-hidden flex flex-col justify-between hover:border-ink transition-all">
              <CardContent className="relative m-auto size-fit pt-8 pb-6 flex flex-col items-center text-center">
                <div className="relative flex h-24 w-56 items-center justify-center">
                  <svg
                    className="text-primary/30 absolute inset-0 size-full"
                    viewBox="0 0 254 104"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="mx-auto block w-fit text-5xl font-bold font-mono text-ink tabular-nums z-10">
                    100%
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold font-display text-ink">
                  Facturation professionnelle
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Devis, factures et avoirs certifiés e-MECeF en 1 clic, prêts pour la DGI.
                </p>
              </CardContent>
            </Card>

            {/* Bento Card 2: Sécurité & Rôles (lg:col-span-2 sm:col-span-3) */}
            <Card className="relative col-span-6 sm:col-span-3 lg:col-span-2 bg-background-secondary border-border rounded-xl overflow-hidden hover:border-ink transition-all">
              <CardContent className="pt-6 flex flex-col justify-between h-full">
                <div className="relative mx-auto flex aspect-square size-28 rounded-full border border-border before:absolute before:-inset-2 before:rounded-full before:border before:border-border/60">
                  <div className="m-auto flex flex-col items-center justify-center text-ink">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                    <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground mt-1">
                      256-bit
                    </span>
                  </div>
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center">
                  <h3 className="text-xl font-bold font-display text-ink">
                    Sécurité &amp; Rôles d&apos;accès
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Vos données chiffrées, gestion fine des droits par collaborateur et audit trail immuable.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 3: Suivi de Trésorerie (lg:col-span-2 sm:col-span-3) */}
            <Card className="relative col-span-6 sm:col-span-3 lg:col-span-2 bg-background-secondary border-border rounded-xl overflow-hidden hover:border-ink transition-all">
              <CardContent className="pt-6 flex flex-col justify-between h-full">
                <div className="pt-2 px-2">
                  <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-mono">
                    <span className="text-muted-foreground">Flux direct FCFA</span>
                    <span className="text-success-deep font-bold">+18.4%</span>
                  </div>
                  <div className="w-full h-20 pt-3">
                    <svg className="w-full h-full" viewBox="0 0 200 60" fill="none" preserveAspectRatio="none">
                      <polygon
                        fill="hsl(var(--primary))"
                        fillOpacity="0.25"
                        points="0,50 30,42 60,45 90,28 120,32 150,18 180,22 200,8 200,60 0,60"
                      />
                      <polyline
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        points="0,50 30,42 60,45 90,28 120,32 150,18 180,22 200,8"
                      />
                    </svg>
                  </div>
                </div>
                <div className="relative z-10 mt-4 space-y-2 text-center">
                  <h3 className="text-xl font-bold font-display text-ink">
                    Suivi de Trésorerie
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Vision en direct de vos entrées et sorties en FCFA pour anticiper vos besoins.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 4: Rapprochement & Comptabilité (lg:col-span-3) */}
            <Card className="relative col-span-6 lg:col-span-3 bg-background-secondary border-border rounded-xl overflow-hidden hover:border-ink transition-all">
              <CardContent className="grid pt-6 sm:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col justify-between space-y-4">
                  <div className="flex aspect-square size-12 rounded-full border border-border bg-background items-center justify-center text-ink">
                    <CreditCard className="size-6 text-ink" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-display text-ink">
                      Rapprochement bancaire &amp; Comptabilité
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Synchronisation de vos relevés de banques au Bénin. Journaux et bilans conformes sans saisie manuelle pénible.
                    </p>
                  </div>
                </div>
                <div className="rounded-tl-xl relative -mb-6 -mr-6 border-l border-t border-border bg-background p-4 sm:ml-4 shadow-sm">
                  <div className="flex items-center gap-1.5 pb-3 mb-2 border-b border-border text-[11px] font-mono text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span className="w-2 h-2 rounded-full bg-warning"></span>
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    <span className="ml-2 font-medium text-ink">Relevés bancaires liés</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded bg-background-secondary border border-border">
                      <span className="font-medium text-ink truncate">Virement BOA Bénin</span>
                      <span className="font-mono text-success-deep font-bold">+2.4M</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-background-secondary border border-border">
                      <span className="font-medium text-ink truncate">Prélèvement Ecobank</span>
                      <span className="font-mono text-ink font-bold">-480k</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-background-secondary border border-border">
                      <span className="font-medium text-ink truncate">Facture Client #089</span>
                      <span className="text-success-deep font-semibold">Pointé</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 5: Multi-entreprises & Équipe (lg:col-span-3) */}
            <Card className="relative col-span-6 lg:col-span-3 bg-background-secondary border-border rounded-xl overflow-hidden hover:border-ink transition-all">
              <CardContent className="grid pt-6 sm:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col justify-between space-y-4">
                  <div className="flex aspect-square size-12 rounded-full border border-border bg-background items-center justify-center text-ink">
                    <Layers className="size-6 text-ink" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-display text-ink">
                      Multi-entreprises &amp; Paie
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Pilotez plusieurs sociétés ou filiales avec le même compte. Bulletins conformes et déclarations CNSS sans calcul manuel.
                    </p>
                  </div>
                </div>
                <div className="relative border border-border bg-background rounded-xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-semibold text-ink">Entités connectées</span>
                    <span className="text-[11px] font-mono text-muted-foreground">3 actives</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-background-secondary border border-border">
                    <div className="w-7 h-7 rounded-full bg-primary font-bold text-ink flex items-center justify-center text-xs">
                      BL
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-xs font-semibold text-ink truncate">Bénin Logistique SARL</div>
                      <div className="text-[10px] text-muted-foreground">Cotonou • 18 salariés</div>
                    </div>
                    <span className="text-[10px] font-semibold text-success-deep bg-success/20 px-2 py-0.5 rounded">
                      À jour
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-background-secondary border border-border">
                    <div className="w-7 h-7 rounded-full bg-ink text-white font-bold flex items-center justify-center text-xs">
                      AB
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-xs font-semibold text-ink truncate">AgriBénin Holding</div>
                      <div className="text-[10px] text-muted-foreground">Porto-Novo • Filiale</div>
                    </div>
                    <span className="text-[10px] font-semibold text-success-deep bg-success/20 px-2 py-0.5 rounded">
                      À jour
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Grille exhaustive des 12 Fonctionnalités ───────────────────── */}
        <div className="w-full pt-8 border-t border-border">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold font-display text-ink">
              L&apos;inventaire complet de vos outils Ceilow
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Tout ce dont votre entreprise a besoin au quotidien, sans mauvaise surprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full text-left">
            {allFeatures.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-background-secondary border border-border p-5 rounded-xl hover:border-ink transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-ink">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">
                        {feat.tag}
                      </span>
                    </div>
                    <h4 className="text-base font-bold font-display text-ink mt-3">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[11px] font-medium text-ink">
                    <Check className="w-3.5 h-3.5 text-success-deep" />
                    <span>Inclus dans votre espace</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
