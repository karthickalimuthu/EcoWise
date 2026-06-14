/**
 * @module tests/recommendation-engine
 * @description Unit tests for the AI recommendation engine.
 */

import { describe, it, expect } from "vitest";
import { generateRecommendations } from "@/features/ai/recommendation-engine";
import type { UserActivitySummary } from "@/domain/types/recommendation.types";

describe("Recommendation Engine", () => {
  it("should return starter recommendations when totalCo2 is 0", () => {
    const summary: UserActivitySummary = {
      userId: "test",
      totalCo2: 0,
      byCategory: { TRANSPORT: 0, FOOD: 0, ENERGY: 0, SHOPPING: 0 },
      dominantCategory: "TRANSPORT",
      activityCount: 0,
    };

    const recs = generateRecommendations(summary, "GENERAL");
    expect(recs).toHaveLength(3);
    expect(recs[0].title).toContain("tracking");
  });

  it("should generate transport-focused recommendations when transport is dominant", () => {
    const summary: UserActivitySummary = {
      userId: "test",
      totalCo2: 100,
      byCategory: { TRANSPORT: 70, FOOD: 20, ENERGY: 5, SHOPPING: 5 },
      dominantCategory: "TRANSPORT",
      activityCount: 10,
    };

    const recs = generateRecommendations(summary, "PROFESSIONAL");
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.length).toBeLessThanOrEqual(5);

    // Top recommendation should be transport-related
    const transportRecs = recs.filter(r => r.category === "TRANSPORT");
    expect(transportRecs.length).toBeGreaterThan(0);
  });

  it("should include estimated reduction amounts", () => {
    const summary: UserActivitySummary = {
      userId: "test",
      totalCo2: 200,
      byCategory: { TRANSPORT: 100, FOOD: 50, ENERGY: 30, SHOPPING: 20 },
      dominantCategory: "TRANSPORT",
      activityCount: 20,
    };

    const recs = generateRecommendations(summary, "STUDENT");
    for (const rec of recs) {
      expect(rec.estimatedReduction).toBeGreaterThanOrEqual(0);
      expect(rec.difficulty).toMatch(/EASY|MEDIUM|HARD/);
      expect(rec.impact).toMatch(/LOW|MEDIUM|HIGH/);
    }
  });

  it("should return max 5 recommendations", () => {
    const summary: UserActivitySummary = {
      userId: "test",
      totalCo2: 500,
      byCategory: { TRANSPORT: 200, FOOD: 150, ENERGY: 100, SHOPPING: 50 },
      dominantCategory: "TRANSPORT",
      activityCount: 50,
    };

    const recs = generateRecommendations(summary, "ENTHUSIAST");
    expect(recs.length).toBeLessThanOrEqual(5);
  });
});
