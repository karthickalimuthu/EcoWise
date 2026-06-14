/**
 * @module repositories/activity.repository
 * @description Data access layer for Activity model.
 * Handles CRUD operations and aggregation queries for carbon activities.
 */

import { prisma } from "@/lib/prisma";
import type { ActivityCategory } from "@/domain/types/carbon.types";
import { NotFoundError } from "@/lib/errors";

export interface ActivityRecord {
  readonly id: string;
  readonly userId: string;
  readonly category: string;
  readonly subCategory: string;
  readonly value: number;
  readonly unit: string;
  readonly co2Amount: number;
  readonly date: Date;
  readonly notes: string | null;
  readonly createdAt: Date;
}

export interface CreateActivityInput {
  readonly userId: string;
  readonly category: string;
  readonly subCategory: string;
  readonly value: number;
  readonly unit: string;
  readonly co2Amount: number;
  readonly date: Date;
  readonly notes?: string;
}

export interface ActivityQueryParams {
  readonly userId: string;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly category?: ActivityCategory;
  readonly limit?: number;
  readonly offset?: number;
}

/**
 * Create a new activity record.
 */
export async function createActivity(input: CreateActivityInput): Promise<ActivityRecord> {
  return prisma.activity.create({
    data: {
      userId: input.userId,
      category: input.category,
      subCategory: input.subCategory,
      value: input.value,
      unit: input.unit,
      co2Amount: input.co2Amount,
      date: input.date,
      notes: input.notes ?? null,
    },
  });
}

/**
 * Find activities with filters and pagination.
 */
export async function findActivities(params: ActivityQueryParams): Promise<ActivityRecord[]> {
  return prisma.activity.findMany({
    where: {
      userId: params.userId,
      ...(params.startDate || params.endDate
        ? {
            date: {
              ...(params.startDate ? { gte: params.startDate } : {}),
              ...(params.endDate ? { lte: params.endDate } : {}),
            },
          }
        : {}),
      ...(params.category ? { category: params.category } : {}),
    },
    orderBy: { date: "desc" },
    take: params.limit ?? 50,
    skip: params.offset ?? 0,
  });
}

/**
 * Find a single activity by ID, scoped to user.
 */
export async function findActivityById(
  id: string,
  userId: string
): Promise<ActivityRecord> {
  const activity = await prisma.activity.findFirst({
    where: { id, userId },
  });

  if (!activity) {
    throw new NotFoundError("Activity", id);
  }

  return activity;
}

/**
 * Update an activity.
 */
export async function updateActivity(
  id: string,
  userId: string,
  data: Partial<CreateActivityInput>
): Promise<ActivityRecord> {
  // Ensure activity belongs to user
  await findActivityById(id, userId);

  return prisma.activity.update({
    where: { id },
    data: {
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.subCategory !== undefined ? { subCategory: data.subCategory } : {}),
      ...(data.value !== undefined ? { value: data.value } : {}),
      ...(data.unit !== undefined ? { unit: data.unit } : {}),
      ...(data.co2Amount !== undefined ? { co2Amount: data.co2Amount } : {}),
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
    },
  });
}

/**
 * Delete an activity.
 */
export async function deleteActivity(id: string, userId: string): Promise<void> {
  await findActivityById(id, userId);
  await prisma.activity.delete({ where: { id } });
}

/**
 * Get aggregated carbon data by category for a user within a date range.
 */
export async function getActivitySummary(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{ category: string; _sum: { co2Amount: number | null }; _count: number }>> {
  const results = await prisma.activity.groupBy({
    by: ["category"],
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      co2Amount: true,
    },
    _count: true,
  });

  return results;
}

/**
 * Get total activity count for a user.
 */
export async function getActivityCount(userId: string): Promise<number> {
  return prisma.activity.count({ where: { userId } });
}
