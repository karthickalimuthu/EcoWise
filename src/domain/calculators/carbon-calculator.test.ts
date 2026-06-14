/**
 * @module tests/carbon-calculator
 * @description Unit tests for the carbon calculator — pure functions.
 */

import { describe, it, expect } from "vitest";
import {
  calculateActivityCo2,
  calculateTotalCo2,
  getUnit,
  getCategory,
} from "@/domain/calculators/carbon-calculator";
import { ActivityCategory } from "@/domain/types/carbon.types";

describe("Carbon Calculator", () => {
  describe("calculateActivityCo2", () => {
    it("should calculate car emissions correctly", () => {
      const result = calculateActivityCo2({
        category: ActivityCategory.TRANSPORT,
        subCategory: "car",
        value: 100,
        unit: "km",
        date: new Date(),
      });
      expect(result.co2Amount).toBe(21.0); // 100 * 0.21
      expect(result.category).toBe("TRANSPORT");
    });

    it("should calculate bike as zero emissions", () => {
      const result = calculateActivityCo2({
        category: ActivityCategory.TRANSPORT,
        subCategory: "bike",
        value: 50,
        unit: "km",
        date: new Date(),
      });
      expect(result.co2Amount).toBe(0);
    });

    it("should calculate electricity emissions", () => {
      const result = calculateActivityCo2({
        category: ActivityCategory.ENERGY,
        subCategory: "electricity",
        value: 200,
        unit: "kWh",
        date: new Date(),
      });
      expect(result.co2Amount).toBe(46.6); // 200 * 0.233
    });

    it("should calculate food emissions for vegetarian diet", () => {
      const result = calculateActivityCo2({
        category: ActivityCategory.FOOD,
        subCategory: "vegetarian",
        value: 7,
        unit: "days",
        date: new Date(),
      });
      expect(result.co2Amount).toBe(11.9); // 7 * 1.7
    });

    it("should calculate clothing emissions", () => {
      const result = calculateActivityCo2({
        category: ActivityCategory.SHOPPING,
        subCategory: "clothing",
        value: 3,
        unit: "items",
        date: new Date(),
      });
      expect(result.co2Amount).toBe(45.0); // 3 * 15.0
    });

    it("should throw for unknown sub-category", () => {
      expect(() =>
        calculateActivityCo2({
          category: ActivityCategory.TRANSPORT,
          subCategory: "spaceship",
          value: 100,
          unit: "km",
          date: new Date(),
        })
      ).toThrow('Unknown sub-category: "spaceship"');
    });
  });

  describe("calculateTotalCo2", () => {
    it("should sum multiple activities", () => {
      const total = calculateTotalCo2([
        { category: ActivityCategory.TRANSPORT, subCategory: "car", value: 100, unit: "km", date: new Date() },
        { category: ActivityCategory.FOOD, subCategory: "mixed", value: 7, unit: "days", date: new Date() },
      ]);
      expect(total).toBe(38.5); // 21.0 + 17.5
    });

    it("should return 0 for empty array", () => {
      expect(calculateTotalCo2([])).toBe(0);
    });
  });

  describe("getUnit", () => {
    it("should return km for car", () => {
      expect(getUnit("car")).toBe("km");
    });

    it("should return days for vegetarian", () => {
      expect(getUnit("vegetarian")).toBe("days");
    });

    it("should return kWh for electricity", () => {
      expect(getUnit("electricity")).toBe("kWh");
    });

    it("should return 'units' for unknown", () => {
      expect(getUnit("unknown")).toBe("units");
    });
  });

  describe("getCategory", () => {
    it("should return TRANSPORT for car", () => {
      expect(getCategory("car")).toBe("TRANSPORT");
    });

    it("should throw for unknown sub-category", () => {
      expect(() => getCategory("unknown")).toThrow();
    });
  });
});
