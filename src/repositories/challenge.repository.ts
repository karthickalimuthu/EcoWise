/**
 * @module repositories/challenge.repository
 * @description Data access layer for Challenge model.
 */

import { prisma } from "@/lib/prisma";
import type { ChallengeOutput, ChallengeWithId } from "@/domain/types/challenge.types";

export async function createChallenge(
  userId: string,
  challenge: ChallengeOutput
): Promise<ChallengeWithId> {
  const record = await prisma.challenge.create({
    data: {
      userId,
      type: challenge.type,
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      targetReduction: challenge.targetReduction,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
    },
  });

  return {
    id: record.id,
    type: record.type as ChallengeWithId["type"],
    title: record.title,
    description: record.description,
    category: record.category as ChallengeWithId["category"],
    targetReduction: record.targetReduction,
    status: record.status as ChallengeWithId["status"],
    startDate: record.startDate,
    endDate: record.endDate,
    completedAt: record.completedAt,
    createdAt: record.createdAt,
  };
}

export async function findActiveChallenges(userId: string): Promise<ChallengeWithId[]> {
  const records = await prisma.challenge.findMany({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  return records.map((r) => ({
    id: r.id,
    type: r.type as ChallengeWithId["type"],
    title: r.title,
    description: r.description,
    category: r.category as ChallengeWithId["category"],
    targetReduction: r.targetReduction,
    status: r.status as ChallengeWithId["status"],
    startDate: r.startDate,
    endDate: r.endDate,
    completedAt: r.completedAt,
    createdAt: r.createdAt,
  }));
}

export async function findAllChallenges(userId: string): Promise<ChallengeWithId[]> {
  const records = await prisma.challenge.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return records.map((r) => ({
    id: r.id,
    type: r.type as ChallengeWithId["type"],
    title: r.title,
    description: r.description,
    category: r.category as ChallengeWithId["category"],
    targetReduction: r.targetReduction,
    status: r.status as ChallengeWithId["status"],
    startDate: r.startDate,
    endDate: r.endDate,
    completedAt: r.completedAt,
    createdAt: r.createdAt,
  }));
}

export async function completeChallenge(
  id: string,
  userId: string
): Promise<void> {
  await prisma.challenge.updateMany({
    where: { id, userId, status: "ACTIVE" },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
}

export async function expireOldChallenges(): Promise<number> {
  const result = await prisma.challenge.updateMany({
    where: {
      status: "ACTIVE",
      endDate: { lt: new Date() },
    },
    data: { status: "EXPIRED" },
  });

  return result.count;
}
