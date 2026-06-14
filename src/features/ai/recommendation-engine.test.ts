import { describe, it, expect } from "vitest";
import { RECOMMENDATION_TEMPLATES } from "../../domain/constants/recommendation-templates";
import { ActivityCategory } from "../../domain/types/carbon.types";

describe("Recommendation Engine Templates", () => {
  it("should contain transport templates", () => {
    const transportTemplates = RECOMMENDATION_TEMPLATES.filter(
      (t) => t.category === ActivityCategory.TRANSPORT
    );
    expect(transportTemplates.length).toBeGreaterThan(0);
    expect(transportTemplates[0].difficulty).toBeDefined();
    expect(transportTemplates[0].impact).toBeDefined();
  });

  it("should have correct base reduction percentages", () => {
    for (const template of RECOMMENDATION_TEMPLATES) {
      expect(template.baseReduction).toBeGreaterThan(0);
      expect(template.baseReduction).toBeLessThanOrEqual(100);
    }
  });

  it("should target specific subcategories", () => {
    const carTemplate = RECOMMENDATION_TEMPLATES.find((t) => t.applicableTo.includes("car"));
    expect(carTemplate).toBeDefined();
    expect(carTemplate?.category).toBe(ActivityCategory.TRANSPORT);
  });

  it("should have reasoning templates with placeholder variables", () => {
    const template = RECOMMENDATION_TEMPLATES.find((t) => t.reasoningTemplate.includes("{amount}"));
    expect(template).toBeDefined();
    expect(template?.reasoningTemplate).toContain("{amount}");
  });
});
