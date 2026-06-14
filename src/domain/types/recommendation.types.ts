/**
 * @module domain/types/recommendation
 * @description AI recommendation types and interfaces.
 */

import type { ActivityCategory } from "./carbon.types";

export const Difficulty = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const Impact = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type Impact = (typeof Impact)[keyof typeof Impact];

export interface RecommendationOutput {
  readonly category: ActivityCategory;
  readonly title: string;
  readonly description: string;
  readonly reasoning: string;
  readonly difficulty: Difficulty;
  readonly impact: Impact;
  readonly estimatedReduction: number;
}

export interface RecommendationWithId extends RecommendationOutput {
  readonly id: string;
  readonly accepted: boolean;
  readonly completedAt: Date | null;
  readonly createdAt: Date;
}

export interface UserActivitySummary {
  readonly userId: string;
  readonly totalCo2: number;
  readonly byCategory: Record<ActivityCategory, number>;
  readonly dominantCategory: ActivityCategory;
  readonly activityCount: number;
}
