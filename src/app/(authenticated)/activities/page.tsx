"use client";

/**
 * @module app/(authenticated)/activities
 * @description Activity tracking page — view and manage logged activities.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Car,
  Utensils,
  Zap,
  ShoppingBag,
  Trash2,
  Calendar,
  Filter,
} from "lucide-react";

interface ActivityItem {
  id: string;
  category: string;
  subCategory: string;
  value: number;
  unit: string;
  co2Amount: number;
  date: string;
  notes: string | null;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  TRANSPORT: <Car className="w-4 h-4 text-sky-400" aria-hidden="true" />,
  FOOD: <Utensils className="w-4 h-4 text-amber-400" aria-hidden="true" />,
  ENERGY: <Zap className="w-4 h-4 text-violet-400" aria-hidden="true" />,
  SHOPPING: <ShoppingBag className="w-4 h-4 text-rose-400" aria-hidden="true" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  TRANSPORT: "cat-transport",
  FOOD: "cat-food",
  ENERGY: "cat-energy",
  SHOPPING: "cat-shopping",
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set("category", filter);
      const res = await fetch(`/api/activities?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setActivities(json.data ?? []);
      }
    } catch (error) {
      console.error("Failed to load activities:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this activity?")) return;
    try {
      await fetch(`/api/activities/${id}`, { method: "DELETE" });
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete activity:", error);
    }
  }

  const totalCo2 = activities.reduce((sum, a) => sum + a.co2Amount, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Activity <span className="gradient-text">Tracker</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {activities.length} activities logged · {totalCo2.toFixed(1)} kg CO₂e total
          </p>
        </div>
        <Link href="/activities/new" className="btn-primary">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Log Activity
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />
        {["", "TRANSPORT", "FOOD", "ENERGY", "SHOPPING"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === cat
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
            aria-pressed={filter === cat}
          >
            {cat || "All"}
          </button>
        ))}
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading activities">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-5 w-48 bg-emerald-500/10 rounded" />
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-12 h-12 text-emerald-500/30 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold mb-2">No activities yet</h2>
          <p className="text-[var(--color-text-muted)] mb-4">
            Start logging your daily activities to track your carbon footprint.
          </p>
          <Link href="/activities/new" className="btn-primary">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Log Your First Activity
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <article
              key={activity.id}
              className="glass-card p-4 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-tertiary)] flex items-center justify-center">
                  {CATEGORY_ICONS[activity.category]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">
                      {activity.subCategory.replace(/_/g, " ")}
                    </span>
                    <span className={`text-xs font-medium ${CATEGORY_COLORS[activity.category]}`}>
                      {activity.category}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    {activity.value} {activity.unit} ·{" "}
                    {new Date(activity.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold text-emerald-400">
                    {activity.co2Amount.toFixed(2)} kg
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">CO₂e</div>
                </div>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-all"
                  aria-label={`Delete ${activity.subCategory} activity`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
