/**
 * @module domain/calculators/reduction-simulator
 * @description Pure function reduction simulator.
 * Takes current activities + proposed behavioral changes and predicts
 * the new footprint, reduction percentage, and savings.
 */

import {
  EMISSION_FACTORS,
  type SimulationInput,
  type SimulationResult,
  type ChangeDetail,
} from "@/domain/types/carbon.types";
import { calculateActivityCo2 } from "./carbon-calculator";

/**
 * Simulate the impact of behavioral changes on carbon footprint.
 * @param input - Current activities and proposed changes
 * @returns Simulation result with before/after comparison
 */
export function simulateReduction(input: SimulationInput): SimulationResult {
  // Calculate current footprint
  const currentFootprint = roundTo2(
    input.currentActivities.reduce((total, activity) => {
      const result = calculateActivityCo2(activity);
      return total + result.co2Amount;
    }, 0)
  );

  // Build a map of current activities by subCategory
  const currentMap = new Map<string, number>();
  for (const activity of input.currentActivities) {
    const existing = currentMap.get(activity.subCategory) ?? 0;
    currentMap.set(activity.subCategory, existing + activity.value);
  }

  // Apply proposed changes
  const changeDetails: ChangeDetail[] = [];
  let totalProjectedReduction = 0;

  for (const change of input.proposedChanges) {
    const factor = EMISSION_FACTORS[change.subCategory];
    if (!factor) continue;

    const currentValue = currentMap.get(change.subCategory) ?? 0;
    const currentCo2 = roundTo2(currentValue * factor.factor);
    const projectedCo2 = roundTo2(change.newValue * factor.factor);
    const savings = roundTo2(currentCo2 - projectedCo2);

    totalProjectedReduction += savings;

    changeDetails.push({
      subCategory: change.subCategory,
      currentCo2,
      projectedCo2,
      savings,
      description: change.description,
    });
  }

  const projectedFootprint = roundTo2(
    Math.max(0, currentFootprint - totalProjectedReduction)
  );
  const reductionAmount = roundTo2(currentFootprint - projectedFootprint);
  const reductionPercentage =
    currentFootprint > 0
      ? roundTo2((reductionAmount / currentFootprint) * 100)
      : 0;

  return {
    currentFootprint,
    projectedFootprint,
    reductionAmount,
    reductionPercentage,
    changeDetails,
  };
}

/**
 * Generate quick-win suggestions based on the highest emission categories.
 * Returns top 3 actionable changes.
 */
export function suggestQuickWins(
  activities: Array<{ subCategory: string; value: number; co2Amount: number }>
): Array<{ subCategory: string; suggestion: string; potentialSavings: number }> {
  const grouped = new Map<string, { totalValue: number; totalCo2: number }>();

  for (const activity of activities) {
    const existing = grouped.get(activity.subCategory) ?? { totalValue: 0, totalCo2: 0 };
    grouped.set(activity.subCategory, {
      totalValue: existing.totalValue + activity.value,
      totalCo2: existing.totalCo2 + activity.co2Amount,
    });
  }

  const suggestions = Array.from(grouped.entries())
    .filter(([, data]) => data.totalCo2 > 0)
    .map(([subCategory, data]) => ({
      subCategory,
      suggestion: getQuickWinSuggestion(subCategory),
      potentialSavings: roundTo2(data.totalCo2 * 0.2), // 20% reduction target
    }))
    .sort((a, b) => b.potentialSavings - a.potentialSavings)
    .slice(0, 3);

  return suggestions;
}

function getQuickWinSuggestion(subCategory: string): string {
  const suggestions: Record<string, string> = {
    car: "Replace 2 car trips/week with public transport or cycling",
    bus: "Consider walking for short bus routes under 2km",
    flight_domestic: "Take a train instead for domestic routes under 500km",
    flight_international: "Reduce one international flight per year",
    high_meat: "Switch to 2 vegetarian days per week",
    mixed: "Add 1 more vegetarian day per week",
    electricity: "Switch to energy-efficient LED bulbs and turn off standby devices",
    water: "Reduce shower time by 2 minutes and fix leaking taps",
    clothing: "Buy second-hand or reduce purchases by 30%",
    electronics: "Extend device lifespan by 1 year before upgrading",
  };

  return suggestions[subCategory] ?? "Reduce usage by 20%";
}

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}
