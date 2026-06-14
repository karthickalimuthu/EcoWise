/**
 * @module lib/env
 * @description Environment variable validation using Zod.
 * Validates all required environment variables at startup.
 * Fails fast with clear error messages if misconfigured.
 */

import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required"),
  NEXTAUTH_URL: z
    .string()
    .url("NEXTAUTH_URL must be a valid URL")
    .optional()
    .default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const errorMessage = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
      .join("\n");

    throw new Error(
      `❌ Invalid environment variables:\n${errorMessage}\n\nPlease check your .env file.`
    );
  }

  return parsed.data;
}

export const env = validateEnv();
