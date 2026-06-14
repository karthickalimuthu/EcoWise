/**
 * @module services/auth.service
 * @description Authentication service orchestrating registration and user management.
 */

import { createUser } from "@/repositories/user.repository";
import { createAuditLog } from "@/lib/security/audit-logger";
import type { RegisterInput, UserProfile } from "@/domain/types/user.types";

/**
 * Register a new user.
 * Orchestrates user creation, audit logging.
 */
export async function registerUser(
  input: RegisterInput,
  ipAddress?: string
): Promise<UserProfile> {
  const user = await createUser(input);

  await createAuditLog({
    userId: user.id,
    action: "REGISTER",
    details: `New user registered: ${user.email}`,
    ipAddress,
  });

  return user;
}
