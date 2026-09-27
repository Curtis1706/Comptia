/**
 * GET fetcher for use with react-query's useQuery.
 * Returns response.data directly from the standard ApiResponse envelope.
 */
export const fetcher = async <T = any>(url: string): Promise<T> => {
  const res = await fetch(url, { credentials: "include" });
  const json = await res.json().catch(() => ({ success: false, error: "Réponse invalide" }));

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      const isSuspended = json.error && (json.error.includes("suspendu") || json.error.includes("Suspendu"));
      window.location.href = isSuspended ? "/login?error=account_suspended" : "/login";
    }
    throw new Error(json.error || "Non authentifié ou compte suspendu");
  }

  if (!res.ok || !json.success) {
    throw new Error(json.error || `Erreur HTTP ${res.status}`);
  }

  return json.data as T;
};

/**
 * Generic mutation helper — returns the full ApiResponse envelope
 * so callers can check success/error themselves.
 */
export const mutate = async <T = any>(
  url: string,
  options: RequestInit
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> => {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    },
    ...options,
  });

  return res.json().catch(() => ({ success: false, error: "Réponse invalide" }));
};
