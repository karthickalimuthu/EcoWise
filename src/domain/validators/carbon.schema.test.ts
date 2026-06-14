import { describe, it, expect } from "vitest";
import { activitySchema } from "./carbon.schema";
import { ActivityCategory } from "../types/carbon.types";

describe("carbon.schema", () => {
  describe("activitySchema", () => {
    it("should validate a correct transport activity", () => {
      const validActivity = {
        category: ActivityCategory.TRANSPORT,
        subCategory: "car",
        value: 100,
        unit: "km",
        date: new Date().toISOString(),
      };

      const result = activitySchema.safeParse(validActivity);
      expect(result.success).toBe(true);
    });

    it("should reject negative values for carbon inputs", () => {
      const invalidActivity = {
        category: ActivityCategory.ENERGY,
        subCategory: "electricity",
        value: -50,
        unit: "kWh",
        date: new Date().toISOString(),
      };

      const result = activitySchema.safeParse(invalidActivity);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("Value must be a positive number");
      }
    });

    it("should reject invalid categories", () => {
      const invalidActivity = {
        category: "INVALID_CATEGORY",
        subCategory: "car",
        value: 100,
        unit: "km",
        date: new Date().toISOString(),
      };

      const result = activitySchema.safeParse(invalidActivity);
      expect(result.success).toBe(false);
    });

    it("should accept valid food activities with correct subcategories", () => {
      const validFood = {
        category: ActivityCategory.FOOD,
        subCategory: "vegetarian",
        value: 7,
        unit: "days",
        date: new Date().toISOString(),
      };

      const result = activitySchema.safeParse(validFood);
      expect(result.success).toBe(true);
    });
  });
});
