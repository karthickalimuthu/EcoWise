/**
 * @module features/ai/challenge-generator
 * @description Generates sustainability challenges based on user activity data.
 * Creates daily, weekly, and monthly challenges tailored to the user's
 * highest emission categories.
 */

import { ActivityCategory } from "@/domain/types/carbon.types";
import type { ChallengeType, ChallengeOutput } from "@/domain/types/challenge.types";

interface ChallengeTemplate {
  readonly type: ChallengeType;
  readonly category: ActivityCategory;
  readonly title: string;
  readonly description: string;
  readonly targetReduction: number; // kg CO₂e
  readonly durationDays: number;
}

const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  // ── Daily Challenges ──
  {
    type: "DAILY",
    category: ActivityCategory.TRANSPORT,
    title: "Car-Free Day",
    description: "Avoid using a car for the entire day. Walk, cycle, or use public transport instead.",
    targetReduction: 4.2,
    durationDays: 1,
  },
  {
    type: "DAILY",
    category: ActivityCategory.FOOD,
    title: "Meatless Monday",
    description: "Go vegetarian for today. Try a new plant-based recipe for lunch and dinner.",
    targetReduction: 1.6,
    durationDays: 1,
  },
  {
    type: "DAILY",
    category: ActivityCategory.ENERGY,
    title: "Unplug Challenge",
    description: "Unplug all non-essential electronics when not in use. No standby power today!",
    targetReduction: 0.5,
    durationDays: 1,
  },
  {
    type: "DAILY",
    category: ActivityCategory.SHOPPING,
    title: "No-Buy Day",
    description: "Don't purchase any non-essential items today. Reflect on what you truly need.",
    targetReduction: 2.0,
    durationDays: 1,
  },

  // ── Weekly Challenges ──
  {
    type: "WEEKLY",
    category: ActivityCategory.TRANSPORT,
    title: "Public Transport Week",
    description: "Use public transport for all commuting this week. Track the km you save from driving.",
    targetReduction: 21.0,
    durationDays: 7,
  },
  {
    type: "WEEKLY",
    category: ActivityCategory.FOOD,
    title: "Veggie Week Starter",
    description: "Have at least 3 fully vegetarian days this week. Explore new plant-based recipes.",
    targetReduction: 4.8,
    durationDays: 7,
  },
  {
    type: "WEEKLY",
    category: ActivityCategory.ENERGY,
    title: "Energy Audit Week",
    description: "Record your daily electricity usage. Identify and eliminate the top 3 energy wasters in your home.",
    targetReduction: 3.5,
    durationDays: 7,
  },
  {
    type: "WEEKLY",
    category: ActivityCategory.SHOPPING,
    title: "Second-Hand First",
    description: "For any purchase this week, check second-hand options first before buying new.",
    targetReduction: 7.5,
    durationDays: 7,
  },

  // ── Monthly Challenges ──
  {
    type: "MONTHLY",
    category: ActivityCategory.TRANSPORT,
    title: "Cycle Commuter",
    description: "Replace at least 10 car trips with cycling this month. Track your distance and savings.",
    targetReduction: 42.0,
    durationDays: 30,
  },
  {
    type: "MONTHLY",
    category: ActivityCategory.FOOD,
    title: "Plant-Based Pioneer",
    description: "Go fully vegetarian for the entire month. Discover how much your food footprint drops.",
    targetReduction: 48.0,
    durationDays: 30,
  },
  {
    type: "MONTHLY",
    category: ActivityCategory.ENERGY,
    title: "10% Energy Reduction",
    description: "Reduce your electricity consumption by 10% compared to last month through daily habits.",
    targetReduction: 14.0,
    durationDays: 30,
  },
  {
    type: "MONTHLY",
    category: ActivityCategory.SHOPPING,
    title: "Minimalist Month",
    description: "No new clothing or electronics purchases for the entire month. Repair and reuse instead.",
    targetReduction: 32.5,
    durationDays: 30,
  },
];

/**
 * Generate a challenge based on type and optional category preference.
 * If a category is specified, prioritizes challenges for that category.
 * Otherwise, picks a random challenge of the given type.
 */
export function generateChallenge(
  type: ChallengeType,
  preferredCategory?: ActivityCategory
): ChallengeOutput {
  let candidates = CHALLENGE_TEMPLATES.filter((t) => t.type === type);

  if (preferredCategory) {
    const categorySpecific = candidates.filter(
      (t) => t.category === preferredCategory
    );
    if (categorySpecific.length > 0) {
      candidates = categorySpecific;
    }
  }

  // Pick a random challenge from candidates
  const template = candidates[Math.floor(Math.random() * candidates.length)];

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + template.durationDays);

  return {
    type: template.type,
    title: template.title,
    description: template.description,
    category: template.category,
    targetReduction: template.targetReduction,
    startDate: now,
    endDate,
  };
}

/**
 * Generate a set of challenges (one of each type) for a user.
 * Prioritizes the user's highest emission category.
 */
export function generateChallengeSet(
  dominantCategory?: ActivityCategory
): ChallengeOutput[] {
  const types: ChallengeType[] = ["DAILY", "WEEKLY", "MONTHLY"];
  return types.map((type) => generateChallenge(type, dominantCategory));
}
