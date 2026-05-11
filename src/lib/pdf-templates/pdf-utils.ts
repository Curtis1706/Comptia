export function formatCFA_simple(val: any): string {
  const num = Number(val || 0);
  const formatted = new Intl.NumberFormat("fr-FR").format(num);
  // Remplace l'espace insécable (qui cause un bug d'affichage dans le PDF) par un point
  return formatted.replace(/[\u202F\u00A0\s]/g, ".") + " F";
}
