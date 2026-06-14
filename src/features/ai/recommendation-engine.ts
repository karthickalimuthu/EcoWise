/**
 * @module features/ai/recommendation-engine
 * @description Rule-based AI recommendation engine.
 * Analyzes user activities, identifies emission hotspots,
 * and generates personalized reduction recommendations.
 *
 * Uses weighted scoring: impact × feasibility for ranking.
 */

import {
  ActivityCategory,
  EMISSION_FACTORS,
} from "@/domain/types/carbon.types";
import type { UserActivitySummary, RecommendationOutput } from "@/domain/types/recommendation.types";
import type { ProfileType } from "@/domain/types/user.types";

// ──────────────────────────────────────────────
// Recommendation Templates
// ──────────────────────────────────────────────

interface RecommendationTemplate {
  readonly category: ActivityCategory;
  readonly title: string;
  readonly description: string;
  readonly reasoningTemplate: string;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly impact: "LOW" | "MEDIUM" | "HIGH";
  readonly baseReduction: number; // % reduction estimate
  readonly applicableTo: string[]; // sub-categories this applies to
  readonly profileBoost: ProfileType[]; // profiles that get higher priority
}

const RECOMMENDATION_TEMPLATES: RecommendationTemplate[] = [
  // ── Transport ──
  {
    category: ActivityCategory.TRANSPORT,
    title: "Switch to public transport for daily commute",
    description: "Replace 3+ car trips per week with bus or train. This can significantly reduce your transport emissions while saving on fuel costs.",
    reasoningTemplate: "Your transportation accounts for {percentage}% of your total footprint. Switching from car to public transport reduces per-km emissions by up to 76%.",
    difficulty: "MEDIUM",
    impact: "HIGH",
    baseReduction: 25,
    applicableTo: ["car"],
    profileBoost: ["PROFESSIONAL", "STUDENT"],
  },
  {
    category: ActivityCategory.TRANSPORT,
    title: "Cycle or walk for short trips",
    description: "For distances under 5km, consider cycling or walking instead of driving. It's healthier and produces zero emissions.",
    reasoningTemplate: "Many of your car trips may be under 5km. Replacing these with cycling eliminates {amount} kg CO₂e from those trips entirely.",
    difficulty: "EASY",
    impact: "MEDIUM",
    baseReduction: 15,
    applicableTo: ["car"],
    profileBoost: ["STUDENT", "ENTHUSIAST"],
  },
  {
    category: ActivityCategory.TRANSPORT,
    title: "Choose trains over domestic flights",
    description: "For routes under 500km, train travel produces 84% less CO₂ than flying. Consider booking rail tickets for your next domestic trip.",
    reasoningTemplate: "Your domestic flights produce {amount} kg CO₂e. A train for the same distance would produce only {reduced} kg CO₂e.",
    difficulty: "MEDIUM",
    impact: "HIGH",
    baseReduction: 30,
    applicableTo: ["flight_domestic"],
    profileBoost: ["PROFESSIONAL"],
  },
  {
    category: ActivityCategory.TRANSPORT,
    title: "Reduce international flights by one per year",
    description: "A single transatlantic flight can produce over 1,600 kg CO₂e. Consider virtual meetings or combining trips to reduce frequency.",
    reasoningTemplate: "International flights are your highest single-event emission source at {amount} kg CO₂e per trip.",
    difficulty: "HARD",
    impact: "HIGH",
    baseReduction: 20,
    applicableTo: ["flight_international"],
    profileBoost: ["PROFESSIONAL", "ENTHUSIAST"],
  },

  // ── Food ──
  {
    category: ActivityCategory.FOOD,
    title: "Add 2 vegetarian days per week",
    description: "Meat production is carbon-intensive. Having 2 meat-free days per week can reduce your food-related emissions by up to 25%.",
    reasoningTemplate: "Your food emissions are {amount} kg CO₂e/month. Plant-based meals produce 47% less CO₂ than high-meat diets.",
    difficulty: "EASY",
    impact: "MEDIUM",
    baseReduction: 20,
    applicableTo: ["high_meat", "mixed"],
    profileBoost: ["FAMILY", "ENTHUSIAST"],
  },
  {
    category: ActivityCategory.FOOD,
    title: "Transition to a predominantly plant-based diet",
    description: "A fully vegetarian diet can cut food emissions by nearly 50% compared to a high-meat diet. Start with one meal at a time.",
    reasoningTemplate: "Switching from high-meat ({current} kg CO₂e/day) to vegetarian ({target} kg CO₂e/day) saves {savings} kg CO₂e daily.",
    difficulty: "HARD",
    impact: "HIGH",
    baseReduction: 40,
    applicableTo: ["high_meat"],
    profileBoost: ["ENTHUSIAST"],
  },
  {
    category: ActivityCategory.FOOD,
    title: "Reduce food waste",
    description: "Plan meals ahead, use leftovers creatively, and compost organic waste. Food waste accounts for 8-10% of global greenhouse gas emissions.",
    reasoningTemplate: "Reducing food waste by 30% could save approximately {amount} kg CO₂e per month from your food footprint.",
    difficulty: "EASY",
    impact: "LOW",
    baseReduction: 10,
    applicableTo: ["vegetarian", "mixed", "high_meat"],
    profileBoost: ["FAMILY", "STUDENT"],
  },

  // ── Energy ──
  {
    category: ActivityCategory.ENERGY,
    title: "Switch to LED lighting throughout your home",
    description: "LED bulbs use 75% less energy than incandescent bulbs and last 25 times longer. Replace all conventional bulbs with LED alternatives.",
    reasoningTemplate: "Lighting accounts for approximately 12% of home electricity. Switching to LEDs can save {amount} kg CO₂e monthly.",
    difficulty: "EASY",
    impact: "LOW",
    baseReduction: 10,
    applicableTo: ["electricity"],
    profileBoost: ["FAMILY", "STUDENT"],
  },
  {
    category: ActivityCategory.ENERGY,
    title: "Reduce standby power consumption",
    description: "Turn off devices completely instead of leaving them on standby. Use smart power strips to eliminate phantom loads.",
    reasoningTemplate: "Standby power can account for 5-10% of household electricity use, costing you approximately {amount} kg CO₂e monthly.",
    difficulty: "EASY",
    impact: "LOW",
    baseReduction: 8,
    applicableTo: ["electricity"],
    profileBoost: ["FAMILY"],
  },
  {
    category: ActivityCategory.ENERGY,
    title: "Reduce shower time by 2 minutes",
    description: "Shorter showers save both water and the energy needed to heat it. A 2-minute reduction per shower saves approximately 25 liters per shower.",
    reasoningTemplate: "Your water usage of {amount} m³ contributes {co2} kg CO₂e. Reducing by 15% through shorter showers saves {savings} kg CO₂e.",
    difficulty: "EASY",
    impact: "LOW",
    baseReduction: 12,
    applicableTo: ["water"],
    profileBoost: ["FAMILY", "STUDENT"],
  },

  // ── Shopping ──
  {
    category: ActivityCategory.SHOPPING,
    title: "Buy second-hand clothing",
    description: "Second-hand fashion has nearly zero additional carbon footprint. Try thrift stores, clothing swaps, or online resale platforms.",
    reasoningTemplate: "Each new clothing item produces about 15 kg CO₂e. You purchased {count} items, generating {amount} kg CO₂e. Second-hand alternatives save nearly 100%.",
    difficulty: "EASY",
    impact: "MEDIUM",
    baseReduction: 30,
    applicableTo: ["clothing"],
    profileBoost: ["STUDENT", "ENTHUSIAST"],
  },
  {
    category: ActivityCategory.SHOPPING,
    title: "Extend electronics lifespan by 1 year",
    description: "Keep your devices for at least one extra year before upgrading. Repair instead of replace. A single smartphone produces about 70 kg CO₂e to manufacture.",
    reasoningTemplate: "Your electronics purchases contribute {amount} kg CO₂e. Extending device lifespan by 1 year reduces annualized emissions by approximately 25%.",
    difficulty: "MEDIUM",
    impact: "HIGH",
    baseReduction: 25,
    applicableTo: ["electronics"],
    profileBoost: ["PROFESSIONAL", "STUDENT"],
  },
];

// ──────────────────────────────────────────────
// Engine
// ──────────────────────────────────────────────

/**
 * Generate personalized recommendations based on user activity data.
 * @param summary - Aggregated user activity summary
 * @param profileType - User's profile type for personalization
 * @returns Array of scored and ranked recommendations (top 5)
 */
export function generateRecommendations(
  summary: UserActivitySummary,
  profileType: ProfileType
): RecommendationOutput[] {
  if (summary.totalCo2 === 0) {
    return getStarterRecommendations();
  }

  // Get all applicable templates
  const candidates = RECOMMENDATION_TEMPLATES.filter((template) => {
    const categoryCo2 = summary.byCategory[template.category] ?? 0;
    return categoryCo2 > 0;
  });

  // Score each candidate
  const scored = candidates.map((template) => {
    const categoryCo2 = summary.byCategory[template.category] ?? 0;
    const categoryPercentage = (categoryCo2 / summary.totalCo2) * 100;

    // Base score: impact × category contribution
    const impactMultiplier = { LOW: 1, MEDIUM: 2, HIGH: 3 }[template.impact];
    const difficultyMultiplier = { EASY: 3, MEDIUM: 2, HARD: 1 }[template.difficulty];

    let score = impactMultiplier * difficultyMultiplier * (categoryPercentage / 100);

    // Profile boost
    if (template.profileBoost.includes(profileType)) {
      score *= 1.3;
    }

    // Dominant category boost
    if (template.category === summary.dominantCategory) {
      score *= 1.5;
    }

    const estimatedReduction = roundTo2(
      categoryCo2 * (template.baseReduction / 100)
    );

    const reasoning = template.reasoningTemplate
      .replace("{percentage}", roundTo2(categoryPercentage).toString())
      .replace("{amount}", roundTo2(categoryCo2).toString())
      .replace("{co2}", roundTo2(categoryCo2).toString())
      .replace("{current}", EMISSION_FACTORS["high_meat"]?.factor.toString() ?? "3.3")
      .replace("{target}", EMISSION_FACTORS["vegetarian"]?.factor.toString() ?? "1.7")
      .replace("{savings}", roundTo2(categoryCo2 * 0.2).toString())
      .replace("{reduced}", roundTo2(categoryCo2 * 0.16).toString())
      .replace("{count}", summary.activityCount.toString());

    return {
      template,
      score,
      output: {
        category: template.category,
        title: template.title,
        description: template.description,
        reasoning,
        difficulty: template.difficulty,
        impact: template.impact,
        estimatedReduction,
      } satisfies RecommendationOutput,
    };
  });

  // Sort by score (descending) and take top 5
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map((s) => s.output);
}

/**
 * Get starter recommendations for users with no activity data.
 */
function getStarterRecommendations(): RecommendationOutput[] {
  return [
    {
      category: ActivityCategory.TRANSPORT,
      title: "Start tracking your daily commute",
      description: "Log your transportation activities to understand your transport footprint. Most people find this is their largest emission source.",
      reasoning: "Transportation typically accounts for 27% of individual carbon emissions. Tracking is the first step to reduction.",
      difficulty: "EASY",
      impact: "LOW",
      estimatedReduction: 0,
    },
    {
      category: ActivityCategory.FOOD,
      title: "Log your diet type for a week",
      description: "Track whether your meals are vegetarian, mixed, or meat-heavy. This helps us calculate your food-related emissions.",
      reasoning: "Food production accounts for 26% of global greenhouse gas emissions. Understanding your diet pattern is key.",
      difficulty: "EASY",
      impact: "LOW",
      estimatedReduction: 0,
    },
    {
      category: ActivityCategory.ENERGY,
      title: "Check your electricity bill",
      description: "Log your monthly electricity consumption in kWh. This data helps estimate your home energy footprint.",
      reasoning: "Home energy use is a major contributor to personal carbon footprint that can be measured precisely.",
      difficulty: "EASY",
      impact: "LOW",
      estimatedReduction: 0,
    },
  ];
}

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}
