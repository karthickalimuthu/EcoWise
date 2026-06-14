/**
 * @module lib/security/audit-logger
 * @description Audit logging service for security and compliance.
 * Tracks authentication events, security failures, and admin activities.
 */

import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "REGISTER"
  | "PASSWORD_RESET"
  | "ACTIVITY_CREATE"
  | "ACTIVITY_UPDATE"
  | "ACTIVITY_DELETE"
  | "ADMIN_ACTION"
  | "SECURITY_FAILURE";

export interface AuditLogInput {
  readonly userId?: string;
  readonly action: AuditAction;
  readonly details?: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

/**
 * Create an audit log entry.
 * This is a fire-and-forget operation — errors are logged but don't propagate.
 */
export async function createAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        details: input.details ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  } catch (error) {
    // Audit logging should never break the main flow
    console.error("[Audit Logger] Failed to create audit log:", error);
  }
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Extract user agent from request headers.
 */
export function getUserAgent(headers: Headers): string {
  return headers.get("user-agent") ?? "unknown";
}
