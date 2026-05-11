export const formatCFA = (n: number, opts?: { compact?: boolean }) =>
  new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
    notation: opts?.compact ? "compact" : "standard",
  }).format(n);

export const formatNumber = (n: number) =>
  new Intl.NumberFormat("fr-BJ", { maximumFractionDigits: 0 }).format(n);

export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("fr-BJ", { day: "2-digit", month: "2-digit", year: "numeric" });

export const formatDateLong = (date: string | Date) =>
  new Date(date).toLocaleDateString("fr-BJ", { day: "numeric", month: "long", year: "numeric" });