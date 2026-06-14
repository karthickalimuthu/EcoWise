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

import { RECOMMENDATION_TEMPLATES } from "@/domain/constants/recommendation-templates";

// ──────────────────────────────────────────────
// Engine
// ──────────────────────────────────────────────

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

/**
 * Generate personalized recommendations using an actual LLM.
 * Falls back to rule-based engine if OPENAI_API_KEY is missing.
 */
export async function generateRecommendations(
  summary: UserActivitySummary,
  profileType: ProfileType
): Promise<RecommendationOutput[]> {
  if (summary.totalCo2 === 0) {
    return getStarterRecommendations();
  }

  // Fallback to rule-based logic if no API key is present in environment
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is missing. Falling back to rule-based recommendations.");
    return generateRuleBasedRecommendations(summary, profileType);
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      system: `You are an expert environmental scientist and AI carbon reduction coach.
Your goal is to analyze the user's carbon footprint data and generate exactly 5 highly personalized, highly actionable recommendations to reduce their emissions.
The user's profile is: ${profileType}.
Tailor the difficulty, impact, and reasoning directly to their profile and their dominant emission category.
Be incredibly specific in your reasoning, citing actual kg CO2e savings based on their current data.`,
      prompt: `Here is the user's current carbon footprint summary:
Total CO2e: ${summary.totalCo2} kg
Dominant Category: ${summary.dominantCategory}
Category Breakdown: ${JSON.stringify(summary.byCategory, null, 2)}
Activities Count: ${summary.activityCount}

Generate 5 personalized recommendations.`,
      schema: z.object({
        recommendations: z.array(
          z.object({
            category: z.nativeEnum(ActivityCategory),
            title: z.string().max(100),
            description: z.string().max(300),
            reasoning: z.string().max(300),
            difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
            impact: z.enum(["LOW", "MEDIUM", "HIGH"]),
            estimatedReduction: z.number().positive(),
            confidenceScore: z.number().min(0).max(100),
          })
        ).length(5)
      }),
    });

    return object.recommendations;
  } catch (error) {
    console.error("AI Generation failed, falling back to rule-based:", error);
    return generateRuleBasedRecommendations(summary, profileType);
  }
}

/**
 * Rule-based fallback engine for when AI fails or keys are missing.
 */
function generateRuleBasedRecommendations(
  summary: UserActivitySummary,
  profileType: ProfileType
): RecommendationOutput[] {
  const candidates = RECOMMENDATION_TEMPLATES.filter((template) => {
    const categoryCo2 = summary.byCategory[template.category] ?? 0;
    return categoryCo2 > 0;
  });

  const scored = candidates.map((template) => {
    const categoryCo2 = summary.byCategory[template.category] ?? 0;
    const categoryPercentage = (categoryCo2 / summary.totalCo2) * 100;

    const impactMultiplier = { LOW: 1, MEDIUM: 2, HIGH: 3 }[template.impact];
    const difficultyMultiplier = { EASY: 3, MEDIUM: 2, HARD: 1 }[template.difficulty];

    let score = impactMultiplier * difficultyMultiplier * (categoryPercentage / 100);

    if (template.profileBoost.includes(profileType)) score *= 1.3;
    if (template.category === summary.dominantCategory) score *= 1.5;

    const estimatedReduction = roundTo2(categoryCo2 * (template.baseReduction / 100));

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
        confidenceScore: Math.round(Math.min(100, score * 10) + 70), // Fallback pseudo-confidence
      } satisfies RecommendationOutput,
    };
  });

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
      confidenceScore: 100,
    },
    {
      category: ActivityCategory.FOOD,
      title: "Log your diet type for a week",
      description: "Track whether your meals are vegetarian, mixed, or meat-heavy. This helps us calculate your food-related emissions.",
      reasoning: "Food production accounts for 26% of global greenhouse gas emissions. Understanding your diet pattern is key.",
      difficulty: "EASY",
      impact: "LOW",
      estimatedReduction: 0,
      confidenceScore: 100,
    },
    {
      category: ActivityCategory.ENERGY,
      title: "Check your electricity bill",
      description: "Log your monthly electricity consumption in kWh. This data helps estimate your home energy footprint.",
      reasoning: "Home energy use is a major contributor to personal carbon footprint that can be measured precisely.",
      difficulty: "EASY",
      impact: "LOW",
      estimatedReduction: 0,
      confidenceScore: 100,
    },
  ];
}

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}
