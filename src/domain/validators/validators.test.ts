/**
 * @module tests/validators
 * @description Unit tests for Zod validation schemas.
 */

import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema, activityCreateSchema } from "@/domain/validators";

describe("Validators", () => {
  describe("registerSchema", () => {
    it("should accept valid input", () => {
      const result = registerSchema.safeParse({
        email: "test@example.com",
        name: "Test User",
        password: "Password1",
        profileType: "STUDENT",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = registerSchema.safeParse({
        email: "not-an-email",
        name: "Test",
        password: "Password1",
      });
      expect(result.success).toBe(false);
    });

    it("should reject weak password", () => {
      const result = registerSchema.safeParse({
        email: "test@example.com",
        name: "Test",
        password: "weak",
      });
      expect(result.success).toBe(false);
    });

    it("should normalize email to lowercase", () => {
      const result = registerSchema.parse({
        email: "TEST@Example.COM",
        name: "Test",
        password: "Password1",
      });
      expect(result.email).toBe("test@example.com");
    });
  });

  describe("loginSchema", () => {
    it("should accept valid credentials", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "password",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty password", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("activityCreateSchema", () => {
    it("should accept valid activity", () => {
      const result = activityCreateSchema.safeParse({
        category: "TRANSPORT",
        subCategory: "car",
        value: 50,
        date: new Date().toISOString(),
      });
      expect(result.success).toBe(true);
    });

    it("should reject negative value", () => {
      const result = activityCreateSchema.safeParse({
        category: "TRANSPORT",
        subCategory: "car",
        value: -10,
        date: new Date().toISOString(),
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid category", () => {
      const result = activityCreateSchema.safeParse({
        category: "INVALID",
        subCategory: "car",
        value: 50,
        date: new Date().toISOString(),
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid subCategory", () => {
      const result = activityCreateSchema.safeParse({
        category: "TRANSPORT",
        subCategory: "spaceship",
        value: 50,
        date: new Date().toISOString(),
      });
      expect(result.success).toBe(false);
    });
  });
});
