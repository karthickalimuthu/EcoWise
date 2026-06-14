/**
 * @module services/carbon.service
 * @description Carbon tracking service orchestrating activity logging and calculations.
 */

import {
  calculateActivityCo2,
  getUnit,
  getCategory,
} from "@/domain/calculators/carbon-calculator";
import {
  createActivity,
  findActivities,
  findActivityById,
  updateActivity,
  deleteActivity,
  getActivitySummary,
} from "@/repositories/activity.repository";
import type { ActivityCreateInput, ActivityQueryInput } from "@/domain/validators";
import type { ActivityRecord } from "@/repositories/activity.repository";
import { createAuditLog } from "@/lib/security/audit-logger";

/**
 * Log a new carbon activity.
 * Calculates CO₂ amount from emission factors and persists the record.
 */
export async function logActivity(
  userId: string,
  input: ActivityCreateInput
): Promise<ActivityRecord> {
  const category = getCategory(input.subCategory);
  const unit = getUnit(input.subCategory);

  const calculation = calculateActivityCo2({
    category,
    subCategory: input.subCategory,
    value: input.value,
    unit,
    date: input.date,
  });

  const activity = await createActivity({
    userId,
    category: calculation.category,
    subCategory: calculation.subCategory,
    value: input.value,
    unit,
    co2Amount: calculation.co2Amount,
    date: input.date,
    notes: input.notes,
  });

  await createAuditLog({
    userId,
    action: "ACTIVITY_CREATE",
    details: `Logged ${input.subCategory}: ${input.value} ${unit} = ${calculation.co2Amount} kg CO₂e`,
  });

  return activity;
}

/**
 * Get activities for a user with optional filters.
 */
export async function getUserActivities(
  userId: string,
  query: ActivityQueryInput
): Promise<ActivityRecord[]> {
  return findActivities({
    userId,
    startDate: query.startDate,
    endDate: query.endDate,
    category: query.category,
    limit: query.limit,
    offset: query.offset,
  });
}

/**
 * Get a single activity by ID.
 */
export async function getActivity(
  activityId: string,
  userId: string
): Promise<ActivityRecord> {
  return findActivityById(activityId, userId);
}

/**
 * Update an existing activity.
 */
export async function editActivity(
  activityId: string,
  userId: string,
  input: Partial<ActivityCreateInput>
): Promise<ActivityRecord> {
  let co2Amount: number | undefined;

  if (input.subCategory && input.value !== undefined) {
    const calculation = calculateActivityCo2({
      category: getCategory(input.subCategory),
      subCategory: input.subCategory,
      value: input.value,
      unit: getUnit(input.subCategory),
      date: input.date ?? new Date(),
    });
    co2Amount = calculation.co2Amount;
  }

  const updated = await updateActivity(activityId, userId, {
    ...input,
    co2Amount,
    unit: input.subCategory ? getUnit(input.subCategory) : undefined,
    category: input.subCategory ? getCategory(input.subCategory) : undefined,
  });

  await createAuditLog({
    userId,
    action: "ACTIVITY_UPDATE",
    details: `Updated activity ${activityId}`,
  });

  return updated;
}

/**
 * Remove an activity.
 */
export async function removeActivity(
  activityId: string,
  userId: string
): Promise<void> {
  await deleteActivity(activityId, userId);

  await createAuditLog({
    userId,
    action: "ACTIVITY_DELETE",
    details: `Deleted activity ${activityId}`,
  });
}

/**
 * Get carbon summary for a given period.
 */
export async function getCarbonSummary(
  userId: string,
  period: "week" | "month" | "year"
): Promise<{
  totalCo2: number;
  byCategory: Array<{ category: string; totalCo2: number; percentage: number; count: number }>;
  activities: ActivityRecord[];
}> {
  const now = new Date();
  const startDate = new Date(now);

  switch (period) {
    case "week":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  const summaryData = await getActivitySummary(userId, startDate, now);
  const activities = await findActivities({
    userId,
    startDate,
    endDate: now,
    limit: 100,
  });

  const totalCo2 = summaryData.reduce(
    (sum, s) => sum + (s._sum.co2Amount ?? 0),
    0
  );

  const byCategory = summaryData.map((s) => ({
    category: s.category,
    totalCo2: Math.round((s._sum.co2Amount ?? 0) * 100) / 100,
    percentage:
      totalCo2 > 0
        ? Math.round(((s._sum.co2Amount ?? 0) / totalCo2) * 10000) / 100
        : 0,
    count: s._count,
  }));

  return {
    totalCo2: Math.round(totalCo2 * 100) / 100,
    byCategory,
    activities,
  };
}
