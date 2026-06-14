/**
 * @module domain/types/challenge
 * @description Challenge types for sustainability challenges feature.
 */

import type { ActivityCategory } from "./carbon.types";

export const ChallengeType = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
} as const;

export type ChallengeType = (typeof ChallengeType)[keyof typeof ChallengeType];

export const ChallengeStatus = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  EXPIRED: "EXPIRED",
} as const;

export type ChallengeStatus = (typeof ChallengeStatus)[keyof typeof ChallengeStatus];

export interface ChallengeOutput {
  readonly type: ChallengeType;
  readonly title: string;
  readonly description: string;
  readonly category: ActivityCategory;
  readonly targetReduction: number;
  readonly startDate: Date;
  readonly endDate: Date;
}

export interface ChallengeWithId extends ChallengeOutput {
  readonly id: string;
  readonly status: ChallengeStatus;
  readonly completedAt: Date | null;
  readonly createdAt: Date;
}
