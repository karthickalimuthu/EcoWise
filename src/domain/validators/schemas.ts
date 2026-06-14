/**
 * @module domain/validators
 * @description Zod validation schemas for all domain inputs.
 * Enforces strict input validation at API boundaries — no direct request processing.
 */

import { z } from "zod";

// ──────────────────────────────────────────────
// Auth Validators
// ──────────────────────────────────────────────

export const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be under 255 characters")
    .transform((v) => v.toLowerCase().trim()),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters")
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be under 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  profileType: z.enum(["STUDENT", "PROFESSIONAL", "FAMILY", "ENTHUSIAST", "GENERAL"]).default("GENERAL"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1, "Password is required"),
});

// ──────────────────────────────────────────────
// Activity Validators
// ──────────────────────────────────────────────

const validSubCategories = [
  "car", "bus", "train", "bike", "flight_domestic", "flight_international",
  "vegetarian", "mixed", "high_meat",
  "electricity", "water",
  "clothing", "electronics",
] as const;

const validCategories = ["TRANSPORT", "FOOD", "ENERGY", "SHOPPING"] as const;

export const activityCreateSchema = z.object({
  category: z.enum(validCategories, {
    message: `Category must be one of: ${validCategories.join(", ")}`,
  }),
  subCategory: z.enum(validSubCategories, {
    message: `Sub-category must be one of: ${validSubCategories.join(", ")}`,
  }),
  value: z
    .number()
    .positive("Value must be a positive number")
    .max(100000, "Value seems unreasonably large"),
  date: z
    .string()
    .datetime({ message: "Date must be a valid ISO 8601 datetime" })
    .transform((v) => new Date(v)),
  notes: z
    .string()
    .max(500, "Notes must be under 500 characters")
    .optional(),
});

export const activityUpdateSchema = activityCreateSchema.partial();

export const activityQuerySchema = z.object({
  startDate: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  endDate: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  category: z.enum(validCategories).optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// ──────────────────────────────────────────────
// Carbon Calculation Validators
// ──────────────────────────────────────────────

export const calculateSchema = z.object({
  subCategory: z.enum(validSubCategories),
  value: z.number().positive("Value must be positive"),
});

export const summaryQuerySchema = z.object({
  period: z.enum(["week", "month", "year"]).default("month"),
});

// ──────────────────────────────────────────────
// Simulation Validators
// ──────────────────────────────────────────────

export const simulationSchema = z.object({
  currentActivities: z.array(
    z.object({
      category: z.enum(validCategories),
      subCategory: z.enum(validSubCategories),
      value: z.number().positive(),
      unit: z.string(),
      date: z.string().datetime().transform((v) => new Date(v)),
    })
  ).min(1, "At least one current activity is required"),
  proposedChanges: z.array(
    z.object({
      subCategory: z.enum(validSubCategories),
      newValue: z.number().min(0, "New value cannot be negative"),
      description: z.string().max(500),
    })
  ).min(1, "At least one proposed change is required"),
});

// ──────────────────────────────────────────────
// Challenge Validators
// ──────────────────────────────────────────────

export const challengeCreateSchema = z.object({
  type: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  category: z.enum(validCategories).optional(),
});

export const challengeCompleteSchema = z.object({
  challengeId: z.string().cuid("Invalid challenge ID"),
});

// ──────────────────────────────────────────────
// Type Exports (inferred from schemas)
// ──────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ActivityCreateInput = z.infer<typeof activityCreateSchema>;
export type ActivityUpdateInput = z.infer<typeof activityUpdateSchema>;
export type ActivityQueryInput = z.infer<typeof activityQuerySchema>;
export type CalculateInput = z.infer<typeof calculateSchema>;
export type SummaryQueryInput = z.infer<typeof summaryQuerySchema>;
export type SimulationSchemaInput = z.infer<typeof simulationSchema>;
export type ChallengeCreateInput = z.infer<typeof challengeCreateSchema>;
