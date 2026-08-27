import { requirePermission } from "@/lib/require-permission";
import { successJson, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { getMecefConfig } from "@/lib/mecef";

/**
 * GET /api/mecef/diagnostic
 * Renvoie l'état de connexion e-MECeF, les dates de validité du jeton et les 50 derniers logs. Requires 'read' on mecef_settings.
 */
export async function GET(req: Request) {
  const permCheck = await requirePermission(req, "mecef_settings", "read");
  if (!permCheck.ok) return permCheck.response;
  const { user } = permCheck;

  try {
    const config = getMecefConfig();

    let expDate: Date | null = null;
    let daysRemaining: number | null = null;
    let tokenValid = false;

    if (config.token) {
      try {
        const parts = config.token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
          if (payload.exp) {
            expDate = new Date(payload.exp * 1000);
            daysRemaining = Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            tokenValid = daysRemaining > 0;
          }
        }
      } catch (e) {
        console.error("JWT parse error:", e);
      }
    }

    const logs = await prisma.mecefLog.findMany({
      where: { company_id: user.company_id },
      orderBy: { created_at: "desc" },
      take: 50,
    });

    return successJson({
      mode: config.mode,
      nim: config.nim,
      ifu: config.ifu,
      baseUrl: config.baseUrl,
      verificationUrl: config.verificationUrl,
      token: {
        present: Boolean(config.token),
        expDate,
        daysRemaining,
        isValid: tokenValid,
      },
      logs,
    });
  } catch (err: any) {
    return errorResponse(err.message || "Erreur de chargement du diagnostic e-MECeF", 500);
  }
}
