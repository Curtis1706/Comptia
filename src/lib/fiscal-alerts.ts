/**
 * Moteur d'alertes fiscales et d'échéances légales automatiques — République du Bénin.
 */

export interface FiscalDeadline {
  code: string;
  label: string;
  frequency: "monthly" | "quarterly" | "annual";
  dayOfMonth: number;
  monthsOfYear?: number[]; // 1 to 12
  month?: number; // 1 to 12 for annual
  reminderDaysBefore: number[];
  link: string;
  description: string;
}

export const FISCAL_CALENDAR: FiscalDeadline[] = [
  {
    code: "TVA",
    label: "Déclaration et paiement de la TVA",
    frequency: "monthly",
    dayOfMonth: 15,
    reminderDaysBefore: [7, 3, 1],
    link: "/tva",
    description: "Dépôt obligatoire de la déclaration de TVA du mois précédent avant le 15.",
  },
  {
    code: "AIR",
    label: "Acompte sur Impôt assis sur les Revenus (AIR)",
    frequency: "monthly",
    dayOfMonth: 15,
    reminderDaysBefore: [7, 3, 1],
    link: "/comptabilite",
    description: "Reversement de l'AIR collecté lors des règlements du mois précédent.",
  },
  {
    code: "RAS",
    label: "Retenue À la Source (RAS prestataires)",
    frequency: "monthly",
    dayOfMonth: 15,
    reminderDaysBefore: [7, 3, 1],
    link: "/comptabilite",
    description: "Déclaration et reversement des retenues à la source sur prestataires non immatriculés.",
  },
  {
    code: "CNSS",
    label: "Déclaration trimestrielle des cotisations CNSS",
    frequency: "quarterly",
    monthsOfYear: [3, 6, 9, 12],
    dayOfMonth: 15,
    reminderDaysBefore: [14, 7, 3],
    link: "/paie",
    description: "Appel de cotisations sociales CNSS pour le trimestre échu.",
  },
  {
    code: "IS_ACOMPTE",
    label: "Acompte trimestriel Impôt sur les Sociétés (IS)",
    frequency: "quarterly",
    monthsOfYear: [3, 6, 9, 12],
    dayOfMonth: 15,
    reminderDaysBefore: [14, 7],
    link: "/comptabilite",
    description: "Paiement de l'acompte provisionnel d'IS à la recette des impôts.",
  },
  {
    code: "DSF",
    label: "Dépôt DSF (Déclaration Statistique et Fiscale)",
    frequency: "annual",
    month: 4,
    dayOfMonth: 30,
    reminderDaysBefore: [30, 14, 7, 3, 1],
    link: "/reporting?tab=dsf",
    description: "Dépôt annuel obligatoire des états financiers SYSCOHADA auprès de la DGI et de l'INSAE.",
  },
  {
    code: "PATENTE",
    label: "Paiement de la contribution des patentes et licences",
    frequency: "annual",
    month: 3,
    dayOfMonth: 31,
    reminderDaysBefore: [30, 14, 7],
    link: "/comptabilite",
    description: "Échéance annuelle de la patente professionnelle.",
  },
];

/**
 * Calcule la prochaine date d'échéance pour une règle du calendrier fiscal
 */
function getNextDeadlineDate(rule: FiscalDeadline, referenceDate: Date): Date | null {
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1; // 1-12

  if (rule.frequency === "monthly") {
    let targetMonth = currentMonth;
    let targetYear = currentYear;
    let deadline = new Date(targetYear, targetMonth - 1, rule.dayOfMonth, 23, 59, 59);

    if (referenceDate > deadline) {
      targetMonth += 1;
      if (targetMonth > 12) {
        targetMonth = 1;
        targetYear += 1;
      }
      deadline = new Date(targetYear, targetMonth - 1, rule.dayOfMonth, 23, 59, 59);
    }
    return deadline;
  }

  if (rule.frequency === "quarterly" && rule.monthsOfYear) {
    for (const m of rule.monthsOfYear) {
      const deadline = new Date(currentYear, m - 1, rule.dayOfMonth, 23, 59, 59);
      if (deadline >= referenceDate) {
        return deadline;
      }
    }
    // Premier trimestre année suivante
    return new Date(currentYear + 1, rule.monthsOfYear[0] - 1, rule.dayOfMonth, 23, 59, 59);
  }

  if (rule.frequency === "annual" && rule.month) {
    let deadline = new Date(currentYear, rule.month - 1, rule.dayOfMonth, 23, 59, 59);
    if (referenceDate > deadline) {
      deadline = new Date(currentYear + 1, rule.month - 1, rule.dayOfMonth, 23, 59, 59);
    }
    return deadline;
  }

  return null;
}

/**
 * Génère les alertes fiscales automatiques pour une entreprise
 */
export async function generateFiscalAlerts(
  prisma: any,
  companyId: string,
  today: Date = new Date()
): Promise<{ count: number; alerts: any[] }> {
  const createdAlerts = [];

  for (const rule of FISCAL_CALENDAR) {
    const nextDeadline = getNextDeadlineDate(rule, today);
    if (!nextDeadline) continue;

    const diffTime = nextDeadline.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Vérifie si aujourd'hui correspond à un des jours de rappel
    if (rule.reminderDaysBefore.includes(daysRemaining) || (daysRemaining >= 0 && daysRemaining <= 3)) {
      const deadlineStr = nextDeadline.toLocaleDateString("fr-FR");
      const title = `Échéance fiscale : ${rule.label}`;
      const message = daysRemaining === 0
        ? `Aujourd'hui est le dernier jour pour : ${rule.label} (${rule.description}).`
        : `Il vous reste ${daysRemaining} jour(s) (jusqu'au ${deadlineStr}) pour : ${rule.label}.`;

      const notificationType = daysRemaining <= 3 ? "warning" : "info";

      // Évite les doublons créés dans les dernières 24 heures pour la même échéance
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const existing = await prisma.notification.findFirst({
        where: {
          company_id: companyId,
          title: { contains: rule.code },
          created_at: { gte: yesterday },
        },
      });

      if (!existing) {
        const notif = await prisma.notification.create({
          data: {
            company_id: companyId,
            title: `[${rule.code}] ${title}`,
            message,
            type: notificationType,
            link: rule.link,
          },
        });
        createdAlerts.push(notif);
      }
    }
  }

  // Alerte d'expiration du jeton DGI e-MECeF (échéance 27/02/2027 ou date du JWT)
  try {
    const token = process.env.MECEF_TOKEN;
    if (token) {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          const diffMs = expDate.getTime() - today.getTime();
          const daysToExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

          if ([60, 30, 15, 7, 3, 1].includes(daysToExpiry) || (daysToExpiry <= 7 && daysToExpiry > 0)) {
            const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            const existing = await prisma.notification.findFirst({
              where: {
                company_id: companyId,
                title: { contains: "MECEF_TOKEN" },
                created_at: { gte: yesterday },
              },
            });

            if (!existing) {
              const notif = await prisma.notification.create({
                data: {
                  company_id: companyId,
                  title: `[MECEF_TOKEN] Expiration du jeton DGI e-MECeF dans ${daysToExpiry} jour(s)`,
                  message: `Votre jeton machine e-MECeF (NIM ${process.env.MECEF_NIM || "TS01019550"}) expire le ${expDate.toLocaleDateString("fr-FR")}. Pensez à renouveler le jeton sur le portail de la DGI pour éviter tout blocage de facturation.`,
                  type: daysToExpiry <= 15 ? "error" : "warning",
                  link: "/parametres?tab=mecef",
                },
              });
              createdAlerts.push(notif);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("[FiscalAlerts] Erreur vérification expiration jeton e-MECeF:", err);
  }

  return { count: createdAlerts.length, alerts: createdAlerts };
}

/**
 * Vérifie les factures échues non réglées et crée des notifications
 */
export async function checkOverdueInvoices(
  prisma: any,
  companyId: string,
  today: Date = new Date()
): Promise<{ updatedCount: number; notificationsCreated: number }> {
  // Trouver les factures dont la date d'échéance est passée et qui ne sont ni payées ni annulées
  const overdueInvoices = await prisma.invoice.findMany({
    where: {
      company_id: companyId,
      status: { in: ["sent", "viewed"] },
      due_date: { lt: today },
    },
    include: { client: true },
  });

  let notificationsCreated = 0;

  for (const inv of overdueInvoices) {
    await prisma.invoice.update({
      where: { id: inv.id },
      data: { status: "overdue" },
    });

    const clientName = inv.client?.name || "Client";
    const amount = Number(inv.total_ttc || 0);

    // Vérifier doublon de notification dans les 3 derniers jours
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
    const existing = await prisma.notification.findFirst({
      where: {
        company_id: companyId,
        title: { contains: inv.reference },
        created_at: { gte: threeDaysAgo },
      },
    });

    if (!existing) {
      await prisma.notification.create({
        data: {
          company_id: companyId,
          title: `Facture en retard : ${inv.reference}`,
          message: `La facture ${inv.reference} d'un montant de ${amount.toLocaleString("fr-FR")} FCFA adressée à ${clientName} est en retard de paiement.`,
          type: "warning",
          link: "/facturation",
        },
      });
      notificationsCreated += 1;
    }
  }

  return {
    updatedCount: overdueInvoices.length,
    notificationsCreated,
  };
}
