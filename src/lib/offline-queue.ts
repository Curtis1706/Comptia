/**
 * File d attente locale pour les factures creees en mode hors-ligne.
 * Utilise localStorage pour persister les factures non transmises.
 * Conforme aux regles Ceilow : TypeScript strict, zero mock, zero emoji.
 */

const QUEUE_KEY = "ceilow_offline_invoice_queue";

export interface QueuedInvoice {
  id: string; // ID local temporaire genere cote client
  payload: Record<string, unknown>; // Corps de la requete POST /api/invoices
  queuedAt: string; // ISO 8601
  attempts: number;
}

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/** Recupere toutes les factures en file d attente. */
export function getQueuedInvoices(): QueuedInvoice[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueuedInvoice[];
  } catch {
    return [];
  }
}

/** Ajoute une facture a la file d attente locale. */
export function enqueueInvoice(payload: Record<string, unknown>): QueuedInvoice {
  const entry: QueuedInvoice = {
    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    payload,
    queuedAt: new Date().toISOString(),
    attempts: 0,
  };
  if (!isClient()) return entry;
  try {
    const existing = getQueuedInvoices();
    localStorage.setItem(QUEUE_KEY, JSON.stringify([...existing, entry]));
  } catch {
    // localStorage plein ou desactive — on retourne quand meme l objet
  }
  return entry;
}

/** Retire une facture de la file d attente apres transmission reussie. */
export function dequeueInvoice(id: string): void {
  if (!isClient()) return;
  try {
    const existing = getQueuedInvoices().filter((q) => q.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

/** Incremente le compteur d essais d une facture. */
export function incrementAttempts(id: string): void {
  if (!isClient()) return;
  try {
    const updated = getQueuedInvoices().map((q) =>
      q.id === id ? { ...q, attempts: q.attempts + 1 } : q
    );
    localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/** Retourne le nombre de factures en attente. */
export function getQueueLength(): number {
  return getQueuedInvoices().length;
}