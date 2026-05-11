import { prisma } from "./prisma";
import type { AuditAction } from "@prisma/client";

interface AuditLogParams {
  company_id: string;
  user_id: string;
  action: AuditAction;
  resource: string;
  resource_id: string;
  old_data?: object;
  new_data?: object;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Writes an immutable audit log entry.
 * This function NEVER throws — failures are silent to avoid blocking business logic.
 * The AuditLog table is INSERT-ONLY. Never call update or delete on it.
 */
export async function logAction(params: AuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        company_id: params.company_id,
        user_id: params.user_id,
        action: params.action,
        resource: params.resource,
        resource_id: params.resource_id,
        old_data: params.old_data
          ? (params.old_data as object)
          : undefined,
        new_data: params.new_data
          ? (params.new_data as object)
          : undefined,
        ip_address: params.ip_address,
        user_agent: params.user_agent,
      },
    });
  } catch (err) {
    // Non-blocking: log to console but don't surface to the caller
    console.error("[AuditLog] Failed to write audit entry:", err, params);
  }
}
