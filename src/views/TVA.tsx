"use client";

import { useState, useMemo } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Plus,
  Loader2,
  Calendar,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";
import { PermissionGate } from "@/components/PermissionGate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, mutate } from "@/lib/fetcher";
import { formatCFA, formatDate, formatDateLong } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VatDeclarationItem {
  id: string;
  company_id: string;
  period_start: string;
  period_end: string;
  declaration_type: "monthly" | "quarterly";
  ca_ht: number | string;
  vat_collected: number | string;
  purchases_ht: number | string;
  vat_deductible: number | string;
  vat_due: number | string;
  penalty_amount: number | string;
  deadline_date: string | null;
  status: "draft" | "submitted" | "accepted" | "rejected";
  submitted_at: string | null;
  created_at: string;
}

export const TVA = () => {
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Liste des mois de l'année pour la sélection de période fiscale
  const months = useMemo(
    () => [
      { value: 0, label: "Janvier" },
      { value: 1, label: "Février" },
      { value: 2, label: "Mars" },
      { value: 3, label: "Avril" },
      { value: 4, label: "Mai" },
      { value: 5, label: "Juin" },
      { value: 6, label: "Juillet" },
      { value: 7, label: "Août" },
      { value: 8, label: "Septembre" },
      { value: 9, label: "Octobre" },
      { value: 10, label: "Novembre" },
      { value: 11, label: "Décembre" },
    ],
    []
  );

  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(currentMonth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState<VatDeclarationItem | null>(null);

  // Calcul des dates de début et fin de la période sélectionnée
  const selectedPeriod = useMemo(() => {
    const start = new Date(currentYear, selectedMonthIndex, 1).toISOString().split("T")[0];
    const end = new Date(currentYear, selectedMonthIndex + 1, 0).toISOString().split("T")[0];
    return { start, end, type: "monthly" as const };
  }, [currentYear, selectedMonthIndex]);

  // Échéance légale au Bénin : le 15 du mois suivant la période
  const legalDeadline = useMemo(() => {
    return new Date(currentYear, selectedMonthIndex + 1, 15);
  }, [currentYear, selectedMonthIndex]);

  const isPastDeadline = useMemo(() => {
    return new Date() > legalDeadline;
  }, [legalDeadline]);

  // Données réelles : Récupération de l'historique des déclarations DGI
  const { data: declarationsRes, isLoading: listLoading } = useQuery<any>({
    queryKey: ["vat-declarations", currentYear],
    queryFn: () => fetcher(`/api/vat/declarations?year=${currentYear}`),
  });

  // Données réelles : Calcul temps réel SYSCOHADA pour la période sélectionnée
  const { data: previewRes, isLoading: previewLoading } = useQuery<any>({
    queryKey: ["vat-preview", selectedPeriod.start, selectedPeriod.end],
    queryFn: () =>
      fetcher(
        `/api/vat/preview?period_start=${selectedPeriod.start}&period_end=${selectedPeriod.end}&type=${selectedPeriod.type}`
      ),
  });

  const declarations: VatDeclarationItem[] = useMemo(() => {
    if (Array.isArray(declarationsRes)) return declarationsRes;
    if (declarationsRes && Array.isArray(declarationsRes.data)) return declarationsRes.data;
    return [];
  }, [declarationsRes]);

  const preview = previewRes?.data || previewRes || {};

  // Vérifier si une déclaration existe déjà pour la période sélectionnée
  const existingDeclaration = useMemo(() => {
    return declarations.find((d) => {
      const dStart = new Date(d.period_start).toISOString().split("T")[0];
      const dEnd = new Date(d.period_end).toISOString().split("T")[0];
      return dStart === selectedPeriod.start && dEnd === selectedPeriod.end;
    });
  }, [declarations, selectedPeriod]);

  const isAlreadySubmitted = existingDeclaration?.status === "submitted" || existingDeclaration?.status === "accepted";

  // Formatage du libellé de période
  const formatPeriodLabel = (start: string | Date, end: string | Date) => {
    const dStart = new Date(start);
    const dEnd = new Date(end);
    const startMonth = dStart.toLocaleDateString("fr-FR", { month: "long" });
    const endMonth = dEnd.toLocaleDateString("fr-FR", { month: "long" });
    const endYear = dEnd.getFullYear();

    if (dStart.getMonth() === dEnd.getMonth() && dStart.getFullYear() === dEnd.getFullYear()) {
      return `${startMonth} ${endYear}`;
    }
    return `${startMonth} - ${endMonth} ${endYear}`;
  };

  // Soumission réelle de la déclaration DGI
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      let targetId = existingDeclaration?.id;

      if (!targetId) {
        // 1. Créer la déclaration en brouillon
        const createRes = await mutate("/api/vat/declarations", {
          method: "POST",
          body: JSON.stringify({
            period_start: selectedPeriod.start,
            period_end: selectedPeriod.end,
            declaration_type: selectedPeriod.type,
          }),
        });

        if (!createRes.success) {
          throw new Error(createRes.error || "Impossible de créer la déclaration");
        }
        targetId = createRes.data?.id;
      }

      if (!targetId) {
        throw new Error("Identifiant de déclaration introuvable");
      }

      // 2. Soumettre et valider l'écriture comptable
      const submitRes = await mutate(`/api/vat/declarations/${targetId}/submit`, {
        method: "POST",
      });

      if (!submitRes.success) {
        throw new Error(submitRes.error || "Échec de la soumission de la déclaration");
      }

      toast.success("Déclaration TVA DGI soumise et validée avec succès");
      setShowSubmitModal(false);
      queryClient.invalidateQueries({ queryKey: ["vat-declarations"] });
      queryClient.invalidateQueries({ queryKey: ["vat-preview"] });
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export CSV de l'historique des déclarations
  const handleExportCSV = () => {
    if (declarations.length === 0) {
      toast.error("Aucune déclaration enregistrée à exporter");
      return;
    }

    const headers = [
      "Identifiant",
      "Période Début",
      "Période Fin",
      "Type Déclaration",
      "Chiffre d'affaires HT",
      "TVA Facturée (4431)",
      "Achats & Charges HT",
      "TVA Déductible (445)",
      "TVA Nette Due (4441)",
      "Pénalités Retard",
      "Statut",
      "Échéance Légale",
      "Date de Soumission",
    ];

    const rows = declarations.map((d) => [
      `"${d.id}"`,
      `"${d.period_start ? new Date(d.period_start).toISOString().split("T")[0] : ""}"`,
      `"${d.period_end ? new Date(d.period_end).toISOString().split("T")[0] : ""}"`,
      `"${d.declaration_type === "monthly" ? "Mensuelle" : "Trimestrielle"}"`,
      Number(d.ca_ht || 0),
      Number(d.vat_collected || 0),
      Number(d.purchases_ht || 0),
      Number(d.vat_deductible || 0),
      Number(d.vat_due || 0),
      Number(d.penalty_amount || 0),
      `"${d.status === "submitted" || d.status === "accepted" ? "Soumise" : "Brouillon"}"`,
      `"${d.deadline_date ? new Date(d.deadline_date).toISOString().split("T")[0] : ""}"`,
      `"${d.submitted_at ? new Date(d.submitted_at).toISOString().split("T")[0] : ""}"`,
    ]);

    const csvContent = [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `declarations_tva_dgi_${currentYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Historique des déclarations exporté en CSV");
  };

  return (
    <div className="space-y-6">
      {/* BEGIN: PageHeader */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-purpose="page-title-bar">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Gestion TVA (DGI Bénin)</h1>
          <p className="text-xs text-muted mt-0.5 font-normal">
            Déclarations conformes au taux standard de 18% et comptes SYSCOHADA
          </p>
        </div>

        <PermissionGate module="vat_declarations" level="validate">
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            disabled={isSubmitting || previewLoading}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm tracking-tight transition shadow-sm cursor-pointer",
              isAlreadySubmitted
                ? "bg-background-secondary text-muted border border-border hover:bg-background-secondary cursor-not-allowed"
                : "bg-primary hover:bg-primary-hover text-ink border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary"
            )}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-ink" />
            ) : isAlreadySubmitted ? (
              <CheckCircle2 className="w-4 h-4 text-muted" />
            ) : (
              <Plus className="w-4 h-4 text-ink stroke-[2.2]" />
            )}
            <span>{isAlreadySubmitted ? "Déclaration déjà soumise" : "Soumettre la déclaration DGI"}</span>
          </button>
        </PermissionGate>
      </section>
      {/* END: PageHeader */}

      {/* BEGIN: LegalBanner (fond plein sans translucidité) */}
      <div
        className="bg-background-secondary border border-border rounded px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-ink"
        data-purpose="legal-notice"
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-muted flex-shrink-0" />
          <span className="font-normal text-ink">
            Norme DGI Bénin : Déclaration mensuelle au plus tard le 15 du mois suivant (Taux standard 18%).
          </span>
        </div>
        <div className="flex items-center gap-2 text-ink">
          <Calendar className="w-4 h-4 text-muted flex-shrink-0" />
          <span className="text-muted">Échéance période sélectionnée :</span>
          <span className="font-bold tabular-nums font-mono text-ink">
            {formatDate(legalDeadline)}
          </span>
          {isPastDeadline && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-error/15 text-error-deep border border-error-deep/30">
              Pénalité de retard applicable (10% + 1%/mois)
            </span>
          )}
        </div>
      </div>
      {/* END: LegalBanner */}

      {/* BEGIN: KpiSummaryCards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5" data-purpose="kpi-cards">
        {/* Carte 1 : TVA Nette Due (Principale avec sélecteur de période) */}
        <article className="bg-background border border-border rounded p-5 flex flex-col justify-between h-44 shadow-sm">
          <div>
            <h2 className="text-[11px] font-semibold tracking-wider uppercase text-muted">
              TVA NETTE DUE (PÉRIODE)
            </h2>
            <div className="mt-2.5">
              <span className="text-4xl font-bold font-mono tabular-nums tracking-tight text-ink">
                {previewLoading ? "..." : formatCFA(preview.vat_due || 0)}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-[11px] font-normal text-muted mb-1" htmlFor="periode-fiscale-select">
              Période fiscale
            </label>
            <div className="relative">
              <select
                id="periode-fiscale-select"
                value={selectedMonthIndex}
                onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
                className="w-full bg-background-secondary border border-border focus:border-ink rounded py-1.5 pl-3 pr-8 text-xs text-ink font-medium appearance-none cursor-pointer outline-none transition-colors"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label} {currentYear}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-muted">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </article>

        {/* Carte 2 : TVA Facturée / Collectée (Compte 4431) */}
        <article className="bg-background border border-border rounded p-5 flex flex-col justify-between h-44 shadow-sm">
          <div>
            <h2 className="text-[11px] font-semibold tracking-normal text-muted">
              TVA facturée / collectée (Compte 4431)
            </h2>
            <div className="mt-2.5">
              <span className="text-2xl font-semibold font-mono tabular-nums tracking-tight text-ink">
                {previewLoading ? "..." : formatCFA(preview.vat_collected || 0)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted">Sur ventes &amp; prestations de services</p>
          </div>
        </article>

        {/* Carte 3 : TVA Déductible / Récupérable (Compte 445) */}
        <article className="bg-background border border-border rounded p-5 flex flex-col justify-between h-44 shadow-sm">
          <div>
            <h2 className="text-[11px] font-semibold tracking-normal text-muted">
              TVA déductible / récupérable (Compte 445)
            </h2>
            <div className="mt-2.5">
              <span className="text-2xl font-semibold font-mono tabular-nums tracking-tight text-ink">
                {previewLoading ? "..." : formatCFA(preview.vat_deductible || 0)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted">Sur achats &amp; frais généraux</p>
          </div>
        </article>
      </section>
      {/* END: KpiSummaryCards */}

      {/* BEGIN: SyscohadaDetailsCard */}
      <section className="bg-background border border-border rounded p-6 shadow-sm" data-purpose="syscohada-breakdown">
        <h2 className="text-sm font-bold text-ink mb-5 tracking-tight">Détails du calcul déclaratif SYSCOHADA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted font-medium">Chiffre d'affaires HT (Classe 7) :</span>
              <span className="font-bold font-mono tabular-nums text-ink">
                {previewLoading ? "..." : formatCFA(preview.ca_ht || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted font-medium">Achats &amp; charges HT (Classe 6) :</span>
              <span className="font-bold font-mono tabular-nums text-ink">
                {previewLoading ? "..." : formatCFA(preview.purchases_ht || 0)}
              </span>
            </div>
          </div>

          <div className="space-y-4 md:border-l md:border-border md:pl-8">
            <div className="flex items-center justify-between">
              <span className="text-muted font-medium">Type de déclaration :</span>
              <span className="font-bold text-ink">Mensuelle</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted font-medium">Statut calcul :</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-background-secondary text-warning-deep border border-warning-deep/30">
                <span className="w-1.5 h-1.5 rounded-full bg-warning-deep"></span>
                <span>Aperçu temps réel</span>
              </span>
            </div>
          </div>

          <div className="space-y-4 md:border-l md:border-border md:pl-8">
            <div className="flex items-center justify-between">
              <span className="text-muted font-medium">Crédit de TVA reportable (4449) :</span>
              <span className="font-bold font-mono tabular-nums text-ink">
                {previewLoading ? "..." : formatCFA(preview.vat_credit || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted font-medium">TVA à payer (4441) :</span>
              <span className="font-bold font-mono tabular-nums text-ink">
                {previewLoading ? "..." : formatCFA(preview.vat_due || 0)}
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* END: SyscohadaDetailsCard */}

      {/* BEGIN: DeclarationsTimeline */}
      <section className="bg-background border border-border rounded p-6 shadow-sm" data-purpose="history-timeline">
        {/* En-tête de section */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <h2 className="text-sm font-bold text-ink tracking-tight">Historique des déclarations DGI</h2>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border hover:bg-background-secondary rounded text-xs font-semibold text-ink transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-muted" />
            <span>Exporter</span>
          </button>
        </div>

        {/* Liste chronologique */}
        <div className="mt-6 flow-root">
          {listLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 w-full rounded bg-background-secondary animate-pulse" />
              ))}
            </div>
          ) : declarations.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <FileText className="w-8 h-8 text-muted/60 mb-2" />
              <p className="text-sm font-semibold text-ink">Aucune déclaration DGI enregistrée pour {currentYear}</p>
              <p className="text-xs text-muted mt-1 max-w-sm">
                Sélectionnez une période ci-dessus puis cliquez sur « Soumettre la déclaration DGI » pour enregistrer et télétransmettre la déclaration officielle.
              </p>
            </div>
          ) : (
            <ul className="relative space-y-6">
              {declarations.map((d, index) => {
                const isSubmitted = d.status === "submitted" || d.status === "accepted";
                const penalty = Number(d.penalty_amount || 0);
                const isLast = index === declarations.length - 1;

                return (
                  <li key={d.id} className="relative flex items-start group">
                    {/* Ligne connectrice verticale */}
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute top-5 left-3 -ml-px h-full w-0.5 bg-border"
                      />
                    )}

                    {/* Pastille / Puce circulaire de la timeline */}
                    <div
                      className={cn(
                        "relative flex items-center justify-center w-6 h-6 rounded-full bg-background border-2 flex-shrink-0 z-10",
                        isSubmitted ? "border-success-deep text-success-deep" : "border-border text-muted"
                      )}
                    >
                      {isSubmitted ? (
                        <Check className="w-3.5 h-3.5 text-success-deep stroke-[3]" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-muted" />
                      )}
                    </div>

                    {/* Carte d'information (fond solide opaque sans translucidité) */}
                    <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between border border-border rounded p-4 bg-background-secondary hover:bg-background transition gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-ink capitalize">
                            {formatPeriodLabel(d.period_start, d.period_end)}
                          </h3>
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold text-muted bg-background border border-border rounded uppercase">
                            {d.declaration_type === "monthly" ? "MENSUELLE" : "TRIMESTRIELLE"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted mt-1 tabular-nums font-mono">
                          <span>Créée le : {formatDateLong(d.created_at)}</span>
                          {d.deadline_date && (
                            <span>Échéance : {formatDate(d.deadline_date)}</span>
                          )}
                          {penalty > 0 && (
                            <span className="text-error-deep font-medium">
                              Pénalité retard : {formatCFA(penalty)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-0 flex flex-wrap items-center gap-4 justify-end">
                        <span className="text-sm font-bold tabular-nums font-mono text-ink text-right">
                          {formatCFA(Number(d.vat_due || 0))}
                        </span>

                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-success/20 text-success-deep border border-success-deep/30">
                            <Check className="w-3 h-3 text-success-deep stroke-[2.5]" />
                            <span>Soumise</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-warning/20 text-warning-deep border border-warning-deep/30">
                            <Clock className="w-3 h-3 text-warning-deep stroke-[2]" />
                            <span>Brouillon</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedDeclaration(d)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-ink hover:underline transition cursor-pointer"
                          title="Voir le détail de la déclaration"
                        >
                          <span>Voir le détail</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
      {/* END: DeclarationsTimeline */}

      {/* BEGIN: Modal Confirmation de Soumission */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="sm:max-w-md rounded border border-border bg-background p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-ink">
              Soumettre la déclaration DGI
            </DialogTitle>
            <DialogDescription className="text-xs text-muted mt-1">
              Télétransmission officielle de la déclaration de TVA pour la période sélectionnée auprès de la DGI Bénin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            {isAlreadySubmitted ? (
              <div className="p-3 bg-warning/15 border border-warning-deep/30 rounded text-ink flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning-deep flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-warning-deep">Déclaration déjà soumise</p>
                  <p className="text-[11px] text-muted mt-0.5">
                    Cette période a déjà fait l'objet d'un dépôt officiel le{" "}
                    {existingDeclaration?.submitted_at
                      ? formatDateLong(existingDeclaration.submitted_at)
                      : "antérieurement"}
                    . Vous ne pouvez pas soumettre deux fois la même période.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-background-secondary border border-border rounded p-3 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted font-sans font-medium">Période concernée :</span>
                    <span className="font-bold text-ink font-sans capitalize">
                      {months[selectedMonthIndex]?.label} {currentYear}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-sans font-medium">CA HT (Classe 7) :</span>
                    <span className="tabular-nums text-ink">{formatCFA(preview.ca_ht || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-sans font-medium">TVA facturée (4431) :</span>
                    <span className="tabular-nums text-ink">{formatCFA(preview.vat_collected || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-sans font-medium">TVA déductible (445) :</span>
                    <span className="tabular-nums text-ink">{formatCFA(preview.vat_deductible || 0)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold">
                    <span className="font-sans">
                      {Number(preview.vat_due || 0) > 0 ? "TVA nette due (4441) :" : "Crédit de TVA (4449) :"}
                    </span>
                    <span className="tabular-nums text-ink">
                      {formatCFA(Number(preview.vat_due || 0) > 0 ? preview.vat_due : preview.vat_credit || 0)}
                    </span>
                  </div>
                </div>

                {isPastDeadline && (
                  <div className="p-3 bg-error/15 border border-error-deep/30 rounded text-ink flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-error-deep flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-error-deep">Date limite dépassée</p>
                      <p className="text-[11px] text-muted mt-0.5">
                        L'échéance légale était fixée au {formatDate(legalDeadline)}. Une pénalité de retard sera appliquée conformément au Code Général des Impôts du Bénin.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="px-4 py-2 border border-border rounded text-xs font-semibold text-ink hover:bg-background-secondary transition cursor-pointer"
            >
              Annuler
            </button>
            {!isAlreadySubmitted && (
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-ink border border-ink/20 rounded text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirmer et télétransmettre</span>
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* END: Modal Confirmation de Soumission */}

      {/* BEGIN: Modal Détail de Déclaration */}
      <Dialog
        open={!!selectedDeclaration}
        onOpenChange={(open) => !open && setSelectedDeclaration(null)}
      >
        <DialogContent className="sm:max-w-lg rounded border border-border bg-background p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-ink">
              Détail de la déclaration DGI
            </DialogTitle>
            <DialogDescription className="text-xs text-muted mt-1">
              Rapprochement fiscal et écritures SYSCOHADA enregistrées.
            </DialogDescription>
          </DialogHeader>

          {selectedDeclaration && (
            <div className="space-y-4 py-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <p className="font-bold text-ink text-sm capitalize">
                    {formatPeriodLabel(selectedDeclaration.period_start, selectedDeclaration.period_end)}
                  </p>
                  <p className="text-[11px] text-muted">
                    Type : {selectedDeclaration.declaration_type === "monthly" ? "Déclaration mensuelle" : "Déclaration trimestrielle"}
                  </p>
                </div>
                {selectedDeclaration.status === "submitted" || selectedDeclaration.status === "accepted" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-success/20 text-success-deep border border-success-deep/30">
                    <Check className="w-3 h-3 text-success-deep stroke-[2.5]" />
                    <span>Soumise</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-warning/20 text-warning-deep border border-warning-deep/30">
                    <Clock className="w-3 h-3 text-warning-deep stroke-[2]" />
                    <span>Brouillon</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 bg-background-secondary border border-border rounded p-3 font-mono">
                <div>
                  <span className="text-[11px] text-muted font-sans block">Chiffre d'affaires HT (Cl. 7)</span>
                  <span className="font-bold tabular-nums text-ink text-sm">
                    {formatCFA(Number(selectedDeclaration.ca_ht || 0))}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted font-sans block">Achats &amp; charges HT (Cl. 6)</span>
                  <span className="font-bold tabular-nums text-ink text-sm">
                    {formatCFA(Number(selectedDeclaration.purchases_ht || 0))}
                  </span>
                </div>
                <div className="border-t border-border pt-2">
                  <span className="text-[11px] text-muted font-sans block">TVA facturée (Cpt 4431)</span>
                  <span className="font-bold tabular-nums text-ink text-sm">
                    {formatCFA(Number(selectedDeclaration.vat_collected || 0))}
                  </span>
                </div>
                <div className="border-t border-border pt-2">
                  <span className="text-[11px] text-muted font-sans block">TVA déductible (Cpt 445)</span>
                  <span className="font-bold tabular-nums text-ink text-sm">
                    {formatCFA(Number(selectedDeclaration.vat_deductible || 0))}
                  </span>
                </div>
                <div className="border-t border-border pt-2 col-span-2 flex items-center justify-between">
                  <span className="font-sans font-bold text-ink">
                    {Number(selectedDeclaration.vat_due || 0) > 0 ? "TVA à payer (Cpt 4441) :" : "Crédit de TVA (Cpt 4449) :"}
                  </span>
                  <span className="font-bold tabular-nums text-ink text-base">
                    {formatCFA(Number(selectedDeclaration.vat_due || 0))}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-muted border-t border-border pt-3">
                <div className="flex justify-between">
                  <span>Date d'enregistrement :</span>
                  <span className="font-medium text-ink font-mono">{formatDateLong(selectedDeclaration.created_at)}</span>
                </div>
                {selectedDeclaration.deadline_date && (
                  <div className="flex justify-between">
                    <span>Date limite légale :</span>
                    <span className="font-medium text-ink font-mono">{formatDate(selectedDeclaration.deadline_date)}</span>
                  </div>
                )}
                {selectedDeclaration.submitted_at && (
                  <div className="flex justify-between">
                    <span>Date de dépôt officiel :</span>
                    <span className="font-medium text-ink font-mono">{formatDateLong(selectedDeclaration.submitted_at)}</span>
                  </div>
                )}
                {Number(selectedDeclaration.penalty_amount || 0) > 0 && (
                  <div className="flex justify-between text-error-deep font-medium">
                    <span>Pénalité de retard calculée :</span>
                    <span className="font-mono">{formatCFA(Number(selectedDeclaration.penalty_amount))}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={() => setSelectedDeclaration(null)}
              className="px-4 py-2 border border-border rounded text-xs font-semibold text-ink hover:bg-background-secondary transition cursor-pointer"
            >
              Fermer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* END: Modal Détail de Déclaration */}
    </div>
  );
};

export default TVA;