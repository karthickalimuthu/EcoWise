/**
 * @module services/recommendation.service
 * @description Recommendation service orchestrating AI engine + persistence.
 */

import { generateRecommendations } from "@/features/ai/recommendation-engine";
import {
  createRecommendations,
  findRecommendations,
  acceptRecommendation,
} from "@/repositories/recommendation.repository";
import { getCarbonSummary } from "./carbon.service";
import type { ActivityCategory } from "@/domain/types/carbon.types";
import type { ProfileType } from "@/domain/types/user.types";
import type { RecommendationWithId, UserActivitySummary } from "@/domain/types/recommendation.types";

/**
 * Generate and store new recommendations for a user.
 */
export async function generateAndStoreRecommendations(
  userId: string,
  profileType: ProfileType
): Promise<RecommendationWithId[]> {
  // Get user's carbon summary for the last month
  const summary = await getCarbonSummary(userId, "month");

  // Build activity summary for AI engine
  const byCategory: Record<ActivityCategory, number> = {
    TRANSPORT: 0,
    FOOD: 0,
    ENERGY: 0,
    SHOPPING: 0,
  };

  for (const cat of summary.byCategory) {
    byCategory[cat.category as ActivityCategory] = cat.totalCo2;
  }

  // Find dominant category
  let dominantCategory: ActivityCategory = "TRANSPORT";
  let maxCo2 = 0;
  for (const [cat, co2] of Object.entries(byCategory)) {
    if (co2 > maxCo2) {
      maxCo2 = co2;
      dominantCategory = cat as ActivityCategory;
    }
  }

  const activitySummary: UserActivitySummary = {
    userId,
    totalCo2: summary.totalCo2,
    byCategory,
    dominantCategory,
    activityCount: summary.activities.length,
  };

  // Generate recommendations via AI engine
  const recommendations = await generateRecommendations(activitySummary, profileType);

  // Persist to database
  return createRecommendations(userId, recommendations);
}

/**
 * Get existing recommendations for a user.
 */
export async function getRecommendations(
  userId: string
): Promise<RecommendationWithId[]> {
  return findRecommendations(userId);
}

/**
 * Accept a recommendation.
 */
export async function acceptUserRecommendation(
  recommendationId: string,
  userId: string
): Promise<void> {
  return acceptRecommendation(recommendationId, userId);
}
