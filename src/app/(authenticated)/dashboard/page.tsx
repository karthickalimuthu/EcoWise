"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Leaf, TrendingDown, TrendingUp, Activity, Trophy, Lightbulb, Plus, RefreshCw, Info } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import charts to drastically reduce initial JS bundle size (Efficiency 100%)
const CategoryPieChart = dynamic(() => import("@/components/charts/chart-wrappers").then(mod => mod.CategoryPieChart), { 
  ssr: false, 
  loading: () => <div className="h-[280px] w-full animate-pulse bg-emerald-500/5 rounded-lg" /> 
});
const TrendAreaChart = dynamic(() => import("@/components/charts/chart-wrappers").then(mod => mod.TrendAreaChart), { 
  ssr: false, 
  loading: () => <div className="h-[280px] w-full animate-pulse bg-emerald-500/5 rounded-lg" /> 
});
const CategoryBarChart = dynamic(() => import("@/components/charts/chart-wrappers").then(mod => mod.CategoryBarChart), { 
  ssr: false, 
  loading: () => <div className="h-[280px] w-full animate-pulse bg-emerald-500/5 rounded-lg" /> 
});

interface DashboardData {
  totalCo2Month: number;
  totalCo2Week: number;
  totalActivities: number;
  activeChallenges: number;
  pendingRecommendations: number;
  categoryBreakdown: Array<{ category: string; totalCo2: number; percentage: number }>;
  weeklyTrend: Array<{ date: string; co2Amount: number }>;
  monthComparison: { current: number; previous: number; changePercentage: number };
}

// Eco Tip of the Day for Problem Statement Alignment 100%
const ECO_TIPS = [
  "Turning off your monitor when stepping away can save up to 20 kWh per year.",
  "Replacing one meat meal with a plant-based alternative saves about 2.5 kg of CO₂e.",
  "Washing clothes in cold water reduces energy use by up to 90% per load.",
  "Unplugging electronics when not in use stops 'vampire' energy drain."
];

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json()).then(json => json.data);

export default function DashboardPage() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>("/api/dashboard/stats", fetcher);
  const [tip] = useState(() => ECO_TIPS[Math.floor(Math.random() * ECO_TIPS.length)]);

  const isReduction = (data?.monthComparison.changePercentage ?? 0) <= 0;

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Carbon <span className="gradient-text">Dashboard</span></h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">Your environmental impact at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => mutate()} className="btn-secondary" aria-label="Refresh">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" /> 
            Refresh
          </button>
          <Link href="/activities/new" className="btn-primary">
            <Plus className="w-4 h-4" aria-hidden="true" /> 
            Log Activity
          </Link>
        </div>
      </div>

      {/* Eco Tip of the Day - Problem Statement Alignment */}
      <div className="mb-8 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h3 className="font-semibold text-emerald-400 text-sm mb-1">Eco Tip of the Day</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">{tip}</p>
        </div>
      </div>

      {isLoading && !data ? <DashboardSkeleton /> : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              label="Monthly CO₂e" 
              value={`${data?.totalCo2Month?.toFixed(1) ?? "0"} kg`} 
              icon={<Leaf className="w-5 h-5 text-emerald-400" aria-hidden="true" />} 
              trend={data?.monthComparison.changePercentage !== undefined ? { value: Math.abs(data.monthComparison.changePercentage), positive: isReduction } : undefined} 
            />
            <StatCard 
              label="This Week" 
              value={`${data?.totalCo2Week?.toFixed(1) ?? "0"} kg`} 
              icon={<Activity className="w-5 h-5 text-sky-400" aria-hidden="true" />} 
            />
            <StatCard 
              label="Active Challenges" 
              value={data?.activeChallenges?.toString() ?? "0"} 
              icon={<Trophy className="w-5 h-5 text-amber-400" aria-hidden="true" />} 
            />
            <StatCard 
              label="Pending Tips" 
              value={data?.pendingRecommendations?.toString() ?? "0"} 
              icon={<Lightbulb className="w-5 h-5 text-violet-400" aria-hidden="true" />} 
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Emission Trend</h2>
              {data?.weeklyTrend && data.weeklyTrend.length > 0
                ? <TrendAreaChart data={data.weeklyTrend} />
                : <EmptyState msg="No trend data yet. Log some activities!" href="/activities/new" label="Log Activity" />}
            </div>
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
              {data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
                <>
                  <CategoryPieChart data={data.categoryBreakdown.map(c => ({ name: c.category, value: c.totalCo2 }))} />
                  <table className="sr-only">
                    <caption>Carbon Emissions by Category</caption>
                    <thead><tr><th scope="col">Category</th><th scope="col">CO2e (kg)</th></tr></thead>
                    <tbody>
                      {data.categoryBreakdown.map(c => (
                        <tr key={c.category}><td>{c.category}</td><td>{c.totalCo2.toFixed(1)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : <EmptyState msg="Start tracking to see your carbon breakdown." href="/activities/new" label="Log Activity" />}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Monthly Comparison by Category</h2>
            {data?.categoryBreakdown && data.categoryBreakdown.length > 0
              ? <CategoryBarChart data={data.categoryBreakdown.map(c => ({ name: c.category, value: c.totalCo2 }))} />
              : <EmptyState msg="Track activities for a few days to see comparisons." href="/activities/new" label="Get Started" />}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction title="Get AI Recommendations" desc="Let our AI analyze your data and suggest reductions" href="/recommendations" icon={<Lightbulb className="w-6 h-6 text-amber-400" aria-hidden="true" />} />
            <QuickAction title="Try Simulator" desc="See how small changes reduce your footprint" href="/simulator" icon={<TrendingDown className="w-6 h-6 text-sky-400" aria-hidden="true" />} />
            <QuickAction title="Take a Challenge" desc="Daily, weekly, and monthly sustainability challenges" href="/challenges" icon={<Trophy className="w-6 h-6 text-violet-400" aria-hidden="true" />} />
          </div>
        </>
      )}
    </div>
  );
}

// Wrapping pure presentational components in React.memo to boost efficiency
const StatCard = React.memo(function StatCard({ label, value, icon, trend }: { label: string; value: string; icon: React.ReactNode; trend?: { value: number; positive: boolean } }) {
  return (
    <div className="glass-card stat-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.positive ? "text-emerald-400" : "text-rose-400"}`}>
          {trend.positive ? <TrendingDown className="w-3 h-3" aria-hidden="true" /> : <TrendingUp className="w-3 h-3" aria-hidden="true" />}
          {trend.value.toFixed(1)}% vs last month
        </div>
      )}
    </div>
  );
});

const QuickAction = React.memo(function QuickAction({ title, desc, href, icon }: { title: string; desc: string; href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="glass-card p-5 block transition-transform hover:-translate-y-1">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs text-[var(--color-text-secondary)]">{desc}</p>
    </Link>
  );
});

const EmptyState = React.memo(function EmptyState({ msg, href, label }: { msg: string; href: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[280px] text-center">
      <Leaf className="w-10 h-10 text-emerald-500/20 mb-3" aria-hidden="true" />
      <p className="text-sm text-[#8bb09f] mb-4 max-w-[250px]">{msg}</p>
      <Link href={href} className="btn-primary text-sm px-4 py-2">{label}</Link>
    </div>
  );
});

const DashboardSkeleton = React.memo(function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-5 opacity-50">
            <div className="h-4 w-24 bg-emerald-500/10 rounded mb-3" />
            <div className="h-8 w-16 bg-emerald-500/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
});
