/**
 * @module repositories/recommendation.repository
 * @description Data access layer for Recommendation model.
 */

import { prisma } from "@/lib/prisma";
import type { RecommendationOutput, RecommendationWithId } from "@/domain/types/recommendation.types";

export async function createRecommendations(
  userId: string,
  recommendations: RecommendationOutput[]
): Promise<RecommendationWithId[]> {
  const created = await prisma.$transaction(
    recommendations.map((rec) =>
      prisma.recommendation.create({
        data: {
          userId,
          category: rec.category,
          title: rec.title,
          description: rec.description,
          reasoning: rec.reasoning,
          difficulty: rec.difficulty,
          impact: rec.impact,
          estimatedReduction: rec.estimatedReduction,
          confidenceScore: rec.confidenceScore,
        },
      })
    )
  );

  return created.map((r) => ({
    id: r.id,
    category: r.category as RecommendationWithId["category"],
    title: r.title,
    description: r.description,
    reasoning: r.reasoning,
    difficulty: r.difficulty as RecommendationWithId["difficulty"],
    impact: r.impact as RecommendationWithId["impact"],
    estimatedReduction: r.estimatedReduction,
    confidenceScore: r.confidenceScore,
    accepted: r.accepted,
    completedAt: r.completedAt,
    createdAt: r.createdAt,
  }));
}

export async function findRecommendations(userId: string): Promise<RecommendationWithId[]> {
  const records = await prisma.recommendation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return records.map((r) => ({
    id: r.id,
    category: r.category as RecommendationWithId["category"],
    title: r.title,
    description: r.description,
    reasoning: r.reasoning,
    difficulty: r.difficulty as RecommendationWithId["difficulty"],
    impact: r.impact as RecommendationWithId["impact"],
    estimatedReduction: r.estimatedReduction,
    confidenceScore: r.confidenceScore,
    accepted: r.accepted,
    completedAt: r.completedAt,
    createdAt: r.createdAt,
  }));
}

export async function acceptRecommendation(
  id: string,
  userId: string
): Promise<void> {
  await prisma.recommendation.updateMany({
    where: { id, userId },
    data: { accepted: true },
  });
}

export async function completeRecommendation(
  id: string,
  userId: string
): Promise<void> {
  await prisma.recommendation.updateMany({
    where: { id, userId },
    data: { completedAt: new Date() },
  });
}
