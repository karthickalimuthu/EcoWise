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
    it("should handle zero and negative values gracefully", () => {
      const resultZero = calculateActivityCo2({
        category: ActivityCategory.TRANSPORT,
        subCategory: "car",
        value: 0,
        unit: "km",
        date: new Date(),
      });
      expect(resultZero.co2Amount).toBe(0);

      // Even if negative value is passed (which should be blocked by validation), it should process mathematically.
      const resultNeg = calculateActivityCo2({
        category: ActivityCategory.TRANSPORT,
        subCategory: "car",
        value: -10,
        unit: "km",
        date: new Date(),
      });
      expect(resultNeg.co2Amount).toBe(-2.1);
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

  describe("generateCarbonSummary", () => {
    it("should correctly group and sum categories", () => {
      const now = new Date();
      const activities = [
        { category: ActivityCategory.TRANSPORT, subCategory: "car", value: 100, co2Amount: 21, date: now },
        { category: ActivityCategory.TRANSPORT, subCategory: "flight", value: 1, co2Amount: 50, date: now },
        { category: ActivityCategory.FOOD, subCategory: "mixed", value: 7, co2Amount: 17.5, date: now },
      ];

      const { generateCarbonSummary } = require("@/domain/calculators/carbon-calculator");
      const summary = generateCarbonSummary(activities, new Date(now.getTime() - 86400000), now);
      
      expect(summary.totalCo2).toBe(88.5);
      expect(summary.byCategory.length).toBe(2);
      
      const transport = summary.byCategory.find((c: any) => c.category === "TRANSPORT");
      expect(transport.totalCo2).toBe(71);
      expect(transport.activityCount).toBe(2);
      expect(transport.percentage).toBeCloseTo((71 / 88.5) * 100, 1);
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
