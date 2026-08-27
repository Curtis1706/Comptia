import { prisma } from "./prisma";
import type { AuditAction } from "@prisma/client";

export interface AuditLogParams {
  company_id: string;
  user_id: string;
  action: AuditAction;
  resource?: string;
  resource_id?: string;
  entity?: string;
  entity_id?: string;
  details?: object | any;
  old_data?: object | any;
  new_data?: object | any;
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
    const resource = params.resource || params.entity || "General";
    const resource_id = String(params.resource_id || params.entity_id || "");
    const newData = params.new_data || params.details;

    await prisma.auditLog.create({
      data: {
        company_id: params.company_id,
        user_id: params.user_id,
        action: params.action,
        resource,
        resource_id,
        old_data: params.old_data ? (params.old_data as object) : undefined,
        new_data: newData ? (newData as object) : undefined,
        ip_address: params.ip_address,
        user_agent: params.user_agent,
      },
    });
  } catch (err) {
    // Non-blocking: log to console but don't surface to the caller
    console.error("[AuditLog] Failed to write audit entry:", err, params);
  }
}
