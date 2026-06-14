/**
 * @module services/dashboard.service
 * @description Dashboard data aggregation service.
 * Compiles stats, trends, and comparisons for the dashboard view.
 */

import { getCarbonSummary } from "./carbon.service";
import { findActiveChallenges } from "@/repositories/challenge.repository";
import { findRecommendations } from "@/repositories/recommendation.repository";
import { getActivityCount } from "@/repositories/activity.repository";

export interface DashboardStats {
  readonly totalCo2Month: number;
  readonly totalCo2Week: number;
  readonly totalActivities: number;
  readonly activeChallenges: number;
  readonly pendingRecommendations: number;
  readonly categoryBreakdown: Array<{
    category: string;
    totalCo2: number;
    percentage: number;
  }>;
  readonly weeklyTrend: Array<{
    date: string;
    co2Amount: number;
  }>;
  readonly monthComparison: {
    current: number;
    previous: number;
    changePercentage: number;
  };
}

/**
 * Compile all dashboard statistics for a user.
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [monthSummary, weekSummary, challenges, recommendations, activityCount] =
    await Promise.all([
      getCarbonSummary(userId, "month"),
      getCarbonSummary(userId, "week"),
      findActiveChallenges(userId),
      findRecommendations(userId),
      getActivityCount(userId),
    ]);

  // Calculate weekly trend from monthly activities
  const weeklyTrend = buildWeeklyTrend(monthSummary.activities);

  // Month-over-month comparison
  const now = new Date();
  const prevMonthStart = new Date(now);
  prevMonthStart.setMonth(prevMonthStart.getMonth() - 2);
  const prevMonthEnd = new Date(now);
  prevMonthEnd.setMonth(prevMonthEnd.getMonth() - 1);

  // Approximate previous month from the monthly activities
  const prevMonthCo2 = monthSummary.activities
    .filter((a) => a.date < prevMonthEnd && a.date >= prevMonthStart)
    .reduce((sum, a) => sum + a.co2Amount, 0);

  const currentMonthCo2 = monthSummary.totalCo2 - prevMonthCo2;
  const changePercentage =
    prevMonthCo2 > 0
      ? Math.round(((currentMonthCo2 - prevMonthCo2) / prevMonthCo2) * 10000) / 100
      : 0;

  return {
    totalCo2Month: monthSummary.totalCo2,
    totalCo2Week: weekSummary.totalCo2,
    totalActivities: activityCount,
    activeChallenges: challenges.length,
    pendingRecommendations: recommendations.filter((r) => !r.accepted).length,
    categoryBreakdown: monthSummary.byCategory.map((c) => ({
      category: c.category,
      totalCo2: c.totalCo2,
      percentage: c.percentage,
    })),
    weeklyTrend,
    monthComparison: {
      current: Math.round(currentMonthCo2 * 100) / 100,
      previous: Math.round(prevMonthCo2 * 100) / 100,
      changePercentage,
    },
  };
}

function buildWeeklyTrend(
  activities: Array<{ date: Date; co2Amount: number }>
): Array<{ date: string; co2Amount: number }> {
  const dailyMap = new Map<string, number>();

  for (const activity of activities) {
    const dateKey = activity.date.toISOString().split("T")[0];
    const existing = dailyMap.get(dateKey) ?? 0;
    dailyMap.set(dateKey, existing + activity.co2Amount);
  }

  return Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, co2Amount]) => ({
      date,
      co2Amount: Math.round(co2Amount * 100) / 100,
    }));
}
