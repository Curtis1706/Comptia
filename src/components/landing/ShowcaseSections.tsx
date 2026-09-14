"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  CreditCard,
  Zap,
  Mail,
  RefreshCw,
  Plus,
  ChevronUp,
  ChevronDown,
  Edit3,
  Trash2,
  Check,
  Search,
  Building2,
  ShieldCheck,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function ShowcaseSections() {
  // State for Section 1 (Interactive Invoice Form Simulator)
  const [companyName, setCompanyName] = useState("Bénin Agro Solutions SARL");
  const [invoiceItem, setInvoiceItem] = useState("Prestation de conseil financier & audit");
  const [selectedColor, setSelectedColor] = useState("primary");

  // State for Section 2 (Bank Selector Modal Simulator)
  const [bankSearch, setBankSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState("BOA Bénin");
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  // Banks list in Benin
  const banks = [
    { name: "BOA Bénin", code: "BOA", tag: "Banque commerciale" },
    { name: "Ecobank Bénin", code: "ECO", tag: "Banque panafricaine" },
    { name: "BIIC Bénin", code: "BIIC", tag: "Banque d'investissement" },
    { name: "NSIA Banque Bénin", code: "NSIA", tag: "Banque commerciale" },
    { name: "BGFI Bank Bénin", code: "BGFI", tag: "Banque d'affaires" },
    { name: "UBA Bénin", code: "UBA", tag: "Banque commerciale" },
    { name: "MTN Mobile Money", code: "MOMO", tag: "Paiement mobile" },
    { name: "Moov Money Bénin", code: "MOOV", tag: "Paiement mobile" },
    { name: "Celtiis Cash", code: "CELT", tag: "Paiement mobile" },
  ];

  const filteredBanks = banks.filter(
    (b) =>
      b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.code.toLowerCase().includes(bankSearch.toLowerCase())
  );

  // State for Section 3 (Workflow Actions)
  const [workflowActions, setWorkflowActions] = useState([
    {
      id: "1",
      icon: Zap,
      title: "Générer l'écriture comptable SYSCOHADA",
      detail: "Écritures automatiques aux comptes 411, 701 et 443 (TVA).",
      delay: "Immédiat",
      badgeColor: "bg-primary/20 text-ink",
    },
    {
      id: "2",
      icon: Mail,
      title: "Envoyer la facture certifiée au client par e-mail",
      detail: "Envoi immédiat avec PDF officiel, mentions DGI et QR code e-MECeF.",
      delay: "Automatique",
      badgeColor: "bg-background-secondary text-ink border border-border",
    },
    {
      id: "3",
      icon: RefreshCw,
      title: "Rapprocher lors de la réception du virement",
      detail: "Lettrage dès concordance du montant sur le compte bancaire.",
      delay: "Synchro bancaire",
      badgeColor: "bg-success/20 text-success-deep border border-success/40",
    },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveWorkflow = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <section className="w-full py-20 sm:py-28 bg-background border-t border-border" id="produit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* ── Section Master Header (Style Chariow) ───────────────────────── */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold font-display text-ink tracking-tight leading-[1.15]">
            Tout ce qu&apos;il vous faut pour piloter votre entreprise au Bénin
          </h2>
          <p className="mt-5 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Une interface épurée et conforme aux normes locales pour facturer, synchroniser vos comptes et automatiser votre comptabilité.
          </p>
        </div>

        {/* ── SHOWCASE 1 : FACTURATION e-MECeF ────────────────────────────── */}
        <div className="w-full max-w-5xl mb-24 sm:mb-32">
          {/* Header Card */}
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-ink text-white text-xs font-semibold uppercase tracking-wider">
              Facturation certifiée
            </span>
            <h3 className="mt-5 text-2xl sm:text-4xl md:text-5xl font-bold font-display text-ink tracking-tight">
              Lancez votre facturation en 5 minutes.
            </h3>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Créez des factures qui reflètent votre identité. Personnalisez votre logo, votre IFU et vos mentions légales pour offrir à vos clients une expérience fluide, sans aucune compétence technique.
            </p>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex items-center justify-center min-h-[44px] px-7 py-3 rounded-xl bg-primary text-ink font-semibold text-sm hover:brightness-95 transition-all shadow-sm"
              >
                Créer une facture gratuitement
              </Link>
            </div>
          </div>

          {/* Yellow Pastel Outer Box (Inspired by Chariow) */}
          <div className="mt-10 sm:mt-12 w-full rounded-2xl sm:rounded-[32px] bg-primary/15 border border-primary/25 p-4 sm:p-8 md:p-10">
            {/* White Crisp Inner Product Mockup */}
            <div className="w-full max-w-3xl mx-auto bg-background rounded-2xl border border-border p-5 sm:p-8 shadow-sm">
              {/* Progress Steps Header */}
              <div className="flex items-center justify-between pb-6 border-b border-border text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-ink font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm">Créer votre facture</div>
                    <div className="text-[11px] text-muted-foreground">Configurez votre document et commencez à facturer</div>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-success-deep bg-success/20 border border-success/40 px-2.5 py-1 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Norme DGI Bénin
                </span>
              </div>

              {/* Card Form Body */}
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-display text-ink">
                    Parlez-nous de votre entreprise
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Construisons ensemble votre en-tête de facture conforme e-MECeF.
                  </p>
                </div>

                {/* Field: Company Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Nom de l&apos;entreprise
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    placeholder="Ex: Bénin Agro Solutions SARL"
                  />
                </div>

                {/* Field: Brand Accent Colors */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Couleur d&apos;accent sur le document
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedColor("primary")}
                      className={`w-8 h-8 rounded-full bg-primary border-2 transition-all flex items-center justify-center ${
                        selectedColor === "primary" ? "border-ink scale-110" : "border-transparent"
                      }`}
                      aria-label="Jaune Ceilow"
                    >
                      {selectedColor === "primary" && <Check className="w-4 h-4 text-ink" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedColor("ink")}
                      className={`w-8 h-8 rounded-full bg-ink border-2 transition-all flex items-center justify-center ${
                        selectedColor === "ink" ? "border-primary scale-110" : "border-transparent"
                      }`}
                      aria-label="Brun foncé"
                    >
                      {selectedColor === "ink" && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedColor("success")}
                      className={`w-8 h-8 rounded-full bg-success border-2 transition-all flex items-center justify-center ${
                        selectedColor === "success" ? "border-ink scale-110" : "border-transparent"
                      }`}
                      aria-label="Vert menthe"
                    >
                      {selectedColor === "success" && <Check className="w-4 h-4 text-ink" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedColor("warning")}
                      className={`w-8 h-8 rounded-full bg-warning border-2 transition-all flex items-center justify-center ${
                        selectedColor === "warning" ? "border-ink scale-110" : "border-transparent"
                      }`}
                      aria-label="Ambre"
                    >
                      {selectedColor === "warning" && <Check className="w-4 h-4 text-ink" />}
                    </button>
                  </div>
                </div>

                {/* Field: Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                    Prestation ou vente principale
                  </label>
                  <input
                    type="text"
                    value={invoiceItem}
                    onChange={(e) => setInvoiceItem(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    placeholder="Description de la prestation"
                  />
                </div>

                {/* Real-time Invoice Result Banner */}
                <div className="mt-6 p-4 rounded-xl bg-background-secondary border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-ink font-mono">FAC-2025-0142</div>
                      <div className="text-xs text-muted-foreground">{companyName || "Votre entreprise"}</div>
                    </div>
                    <span className="text-[11px] font-semibold text-success-deep bg-success/20 border border-success/40 px-2 py-0.5 rounded">
                      Certifié e-MECeF
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-muted-foreground truncate">{invoiceItem}</span>
                    <div className="text-right font-mono font-bold text-ink tabular-nums sm:whitespace-nowrap">
                      1 770 000 FCFA <span className="text-[10px] text-muted-foreground font-normal">(TVA 18% incluse)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SHOWCASE 2 : BANQUES & PAIEMENTS (Style Chariow) ────────────── */}
        <div className="w-full max-w-5xl mb-24 sm:mb-32">
          {/* Header Card */}
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-ink text-white text-xs font-semibold uppercase tracking-wider">
              Paiements &amp; Banques
            </span>
            <h3 className="mt-5 text-2xl sm:text-4xl md:text-5xl font-bold font-display text-ink tracking-tight">
              Acceptez et suivez des paiements de toutes vos banques.
            </h3>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Recevez des paiements par virement, chèque ou Mobile Money. Ceilow assure la réconciliation automatique de vos relevés et vous permet de piloter vos liquidités en toute simplicité.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center min-h-[44px] px-7 py-3 rounded-xl bg-primary text-ink font-semibold text-sm hover:brightness-95 transition-all shadow-sm"
              >
                Connecter mes banques
              </Link>
              <a
                href="#banques"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-xl bg-background border border-border text-ink font-semibold text-sm hover:bg-background-secondary transition-all"
              >
                Voir les banques couvertes
              </a>
            </div>
          </div>

          {/* Yellow Pastel Outer Box */}
          <div className="mt-10 sm:mt-12 w-full rounded-2xl sm:rounded-[32px] bg-primary/15 border border-primary/25 p-4 sm:p-8 md:p-10 flex justify-center">
            {/* White Modal Mockup (Inspired by Chariow "Où êtes-vous basé ?") */}
            <div className="w-full max-w-md bg-background rounded-2xl border border-border p-6 sm:p-8 shadow-sm text-left relative">
              {/* Top Modal Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-bold font-display text-ink">
                    Où sont domiciliés vos comptes ?
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Configurez votre établissement bancaire et devise par défaut. Vous pouvez connecter plusieurs banques à tout moment.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg hover:bg-background-secondary flex items-center justify-center text-muted-foreground transition-colors"
                  aria-label="Fermer l'aperçu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Selection Field */}
              <div className="mt-6 space-y-2">
                <label className="text-xs font-semibold text-ink uppercase tracking-wider block">
                  Votre banque ou réseau principal
                </label>

                {/* Dropdown Input / Selected State */}
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background flex items-center justify-between cursor-pointer hover:border-ink transition-colors min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center text-ink font-bold text-xs">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-ink">{selectedBank}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </div>

                {/* Dropdown Options List */}
                {isDropdownOpen && (
                  <div className="mt-2 p-2 rounded-xl border border-border bg-background shadow-md space-y-2">
                    {/* Internal Search Bar */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Rechercher une banque..."
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background-secondary text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[36px]"
                      />
                    </div>

                    {/* Bank Items List */}
                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                      {filteredBanks.map((bank) => (
                        <div
                          key={bank.code}
                          onClick={() => {
                            setSelectedBank(bank.name);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            selectedBank === bank.name
                              ? "bg-primary/20 font-semibold text-ink"
                              : "hover:bg-background-secondary text-ink"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <span>{bank.name}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">{bank.code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Confirmation */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-success-deep" />
                  Synchronisation chiffrée
                </span>
                <span className="font-semibold text-ink font-mono">Devise : FCFA (XOF)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SHOWCASE 3 : AUTOMATISATIONS DU BUSINESS (Style Chariow) ───────── */}
        <div className="w-full max-w-5xl">
          {/* Header Card */}
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-ink text-white text-xs font-semibold uppercase tracking-wider">
              Automatisation
            </span>
            <h3 className="mt-5 text-2xl sm:text-4xl md:text-5xl font-bold font-display text-ink tracking-tight">
              Automatisez votre gestion et gagnez du temps.
            </h3>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Créez des workflows personnalisés, synchronisez vos flux bancaires et préparez vos déclarations fiscales en continu. Travaillez moins, développez plus.
            </p>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex items-center justify-center min-h-[44px] px-7 py-3 rounded-xl bg-primary text-ink font-semibold text-sm hover:brightness-95 transition-all shadow-sm"
              >
                Découvrir les automatisations
              </Link>
            </div>
          </div>

          {/* Yellow Pastel Outer Box */}
          <div className="mt-10 sm:mt-12 w-full rounded-2xl sm:rounded-[32px] bg-primary/15 border border-primary/25 p-4 sm:p-8 md:p-10 flex justify-center">
            {/* White Workflow Builder Mockup (Inspired by Chariow "Actions du Workflow") */}
            <div className="w-full max-w-2xl bg-background rounded-2xl border border-border p-5 sm:p-8 shadow-sm text-left">
              {/* Header with Title and Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-display text-ink">
                    Actions du Workflow Comptable
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Que se passe-t-il automatiquement quand une facture est certifiée ?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newAction = {
                      id: String(Date.now()),
                      icon: Sparkles,
                      title: "Notifier le cabinet comptable partenaire",
                      detail: "Export automatique du fichier des écritures en fin de journée.",
                      delay: "Chaque soir",
                      badgeColor: "bg-primary/20 text-ink",
                    };
                    setWorkflowActions([...workflowActions, newAction]);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-ink font-semibold text-xs hover:brightness-95 transition-all shadow-sm min-h-[44px] self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une action</span>
                </button>
              </div>

              {/* Workflow Actions List */}
              <div className="mt-6 space-y-3">
                {workflowActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={action.id}
                      className="p-4 rounded-xl border border-border bg-background-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-ink transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center text-ink flex-shrink-0 mt-0.5 sm:mt-0">
                          <Icon className="w-4 h-4 text-ink" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-ink">
                              {action.title}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${action.badgeColor}`}
                            >
                              {action.delay}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {action.detail}
                          </p>
                        </div>
                      </div>

                      {/* Action Tool Buttons */}
                      <div className="flex items-center gap-1 self-end sm:self-center border-t sm:border-t-0 border-border pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center text-muted-foreground hover:text-ink transition-colors"
                          aria-label="Monter"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center text-muted-foreground hover:text-ink transition-colors"
                          aria-label="Descendre"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center text-muted-foreground hover:text-ink transition-colors"
                          aria-label="Modifier"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setWorkflowActions(
                              workflowActions.filter((item) => item.id !== action.id)
                            )
                          }
                          className="w-8 h-8 rounded-lg hover:bg-error/20 flex items-center justify-center text-error transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Large Save Button */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleSaveWorkflow}
                  className="w-full min-h-[48px] py-3.5 bg-primary hover:brightness-95 text-ink font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Workflow sauvegardé avec succès !</span>
                    </>
                  ) : (
                    <span>Sauvegarder le workflow</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
