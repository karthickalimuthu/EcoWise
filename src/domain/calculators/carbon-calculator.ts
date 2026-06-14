/**
 * @module domain/calculators/carbon-calculator
 * @description Pure function carbon footprint calculator.
 * Uses EPA/DEFRA emission factors to convert activity data into CO₂e estimates.
 * All functions are pure — no side effects, fully testable.
 */

import {
  EMISSION_FACTORS,
  UNIT_MAP,
  CATEGORY_MAP,
  type ActivityInput,
  type CalculationResult,
  type CarbonSummary,
  type CategoryBreakdown,
  type TrendPoint,
  type ActivityCategory,
} from "@/domain/types/carbon.types";

/**
 * Calculate CO₂e for a single activity.
 * @param input - Activity data (subCategory + value)
 * @returns Calculation result with CO₂ amount and metadata
 * @throws Error if subCategory has no matching emission factor
 */
export function calculateActivityCo2(input: ActivityInput): CalculationResult {
  const factor = EMISSION_FACTORS[input.subCategory];

  if (!factor) {
    throw new Error(
      `Unknown sub-category: "${input.subCategory}". Valid options: ${Object.keys(EMISSION_FACTORS).join(", ")}`
    );
  }

  const co2Amount = roundTo2(input.value * factor.factor);

  return {
    co2Amount,
    category: input.category,
    subCategory: input.subCategory,
    emissionFactor: factor,
    inputValue: input.value,
  };
}

/**
 * Calculate total CO₂e for multiple activities.
 * @param activities - Array of activity inputs
 * @returns Total CO₂e in kg
 */
export function calculateTotalCo2(activities: ActivityInput[]): number {
  return roundTo2(
    activities.reduce((total, activity) => {
      const result = calculateActivityCo2(activity);
      return total + result.co2Amount;
    }, 0)
  );
}

/**
 * Generate a carbon summary with category breakdown and trends.
 * @param activities - Array of activities with dates
 * @param periodStart - Start of reporting period
 * @param periodEnd - End of reporting period
 * @returns Complete carbon summary
 */
export function generateCarbonSummary(
  activities: Array<{ category: string; subCategory: string; value: number; co2Amount: number; date: Date }>,
  periodStart: Date,
  periodEnd: Date
): CarbonSummary {
  const totalCo2 = roundTo2(
    activities.reduce((sum, a) => sum + a.co2Amount, 0)
  );

  const categoryMap = new Map<ActivityCategory, { total: number; count: number }>();

  for (const activity of activities) {
    const cat = activity.category as ActivityCategory;
    const existing = categoryMap.get(cat) ?? { total: 0, count: 0 };
    categoryMap.set(cat, {
      total: existing.total + activity.co2Amount,
      count: existing.count + 1,
    });
  }

  const byCategory: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category,
      totalCo2: roundTo2(data.total),
      percentage: totalCo2 > 0 ? roundTo2((data.total / totalCo2) * 100) : 0,
      activityCount: data.count,
    })
  );

  // Sort by highest CO₂ first
  byCategory.sort((a, b) => b.totalCo2 - a.totalCo2);

  const trend = generateTrend(activities);

  return {
    totalCo2,
    byCategory,
    trend,
    periodStart,
    periodEnd,
  };
}

/**
 * Generate daily/weekly trend points from activities.
 */
function generateTrend(
  activities: Array<{ co2Amount: number; date: Date }>
): TrendPoint[] {
  const dailyMap = new Map<string, number>();

  for (const activity of activities) {
    const dateKey = formatDateKey(activity.date);
    const existing = dailyMap.get(dateKey) ?? 0;
    dailyMap.set(dateKey, existing + activity.co2Amount);
  }

  return Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, co2Amount]) => ({
      date,
      co2Amount: roundTo2(co2Amount),
      label: formatDateLabel(date),
    }));
}

/**
 * Get the unit string for a given sub-category.
 */
export function getUnit(subCategory: string): string {
  return UNIT_MAP[subCategory] ?? "units";
}

/**
 * Get the category for a given sub-category.
 */
export function getCategory(subCategory: string): ActivityCategory {
  const category = CATEGORY_MAP[subCategory];
  if (!category) {
    throw new Error(`Unknown sub-category: "${subCategory}"`);
  }
  return category;
}

// ──────────────────────────────────────────────
// Internal Helpers
// ──────────────────────────────────────────────

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDateLabel(dateKey: string): string {
  const date = new Date(dateKey);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
