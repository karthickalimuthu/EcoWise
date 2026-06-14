"use client";

import { useState, useEffect, useCallback } from "react";
import { Leaf, TrendingDown, TrendingUp, Activity, Trophy, Lightbulb, Plus, RefreshCw } from "lucide-react";
import { CategoryPieChart, TrendAreaChart, CategoryBarChart } from "@/components/charts/chart-wrappers";
import Link from "next/link";

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

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/dashboard/stats"); if (res.ok) { const json = await res.json(); setData(json.data); } } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const isReduction = (data?.monthComparison.changePercentage ?? 0) <= 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700 }}>Carbon <span className="gradient-text">Dashboard</span></h1>
          <p style={{ color: "#a7c4b8", marginTop: "0.25rem", fontSize: "0.9375rem" }}>Your environmental impact at a glance</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button onClick={fetchDashboard} className="btn-secondary" aria-label="Refresh"><RefreshCw style={{ width: 16, height: 16, animation: loading ? "spin 1s linear infinite" : "none" }} aria-hidden="true" /> Refresh</button>
          <Link href="/activities/new" className="btn-primary"><Plus style={{ width: 16, height: 16 }} aria-hidden="true" /> Log Activity</Link>
        </div>
      </div>

      {loading && !data ? <DashboardSkeleton /> : (
        <>
          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <StatCard label="Monthly CO₂e" value={`${data?.totalCo2Month?.toFixed(1) ?? "0"} kg`} icon={<Leaf style={{ width: 20, height: 20, color: "#34d399" }} />} trend={data?.monthComparison.changePercentage !== undefined ? { value: Math.abs(data.monthComparison.changePercentage), positive: isReduction } : undefined} />
            <StatCard label="This Week" value={`${data?.totalCo2Week?.toFixed(1) ?? "0"} kg`} icon={<Activity style={{ width: 20, height: 20, color: "#38bdf8" }} />} />
            <StatCard label="Active Challenges" value={data?.activeChallenges?.toString() ?? "0"} icon={<Trophy style={{ width: 20, height: 20, color: "#fbbf24" }} />} />
            <StatCard label="Pending Tips" value={data?.pendingRecommendations?.toString() ?? "0"} icon={<Lightbulb style={{ width: 20, height: 20, color: "#a78bfa" }} />} />
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: "1rem" }}>Emission Trend</h2>
              {data?.weeklyTrend && data.weeklyTrend.length > 0
                ? <TrendAreaChart data={data.weeklyTrend} />
                : <EmptyState msg="No trend data yet. Log some activities!" href="/activities/new" label="Log Activity" />}
            </div>
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: "1rem" }}>Category Breakdown</h2>
              {data?.categoryBreakdown && data.categoryBreakdown.length > 0
                ? <CategoryPieChart data={data.categoryBreakdown.map(c => ({ name: c.category, value: c.totalCo2 }))} />
                : <EmptyState msg="Start tracking to see your carbon breakdown." href="/activities/new" label="Log Activity" />}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: "1rem" }}>Monthly Comparison by Category</h2>
            {data?.categoryBreakdown && data.categoryBreakdown.length > 0
              ? <CategoryBarChart data={data.categoryBreakdown.map(c => ({ name: c.category, value: c.totalCo2 }))} />
              : <EmptyState msg="Track activities for a few days to see comparisons." href="/activities/new" label="Get Started" />}
          </div>

          {/* Quick Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1rem" }}>
            <QuickAction title="Get AI Recommendations" desc="Let our AI analyze your data and suggest reductions" href="/recommendations" icon={<Lightbulb style={{ width: 24, height: 24, color: "#fbbf24" }} />} />
            <QuickAction title="Try Simulator" desc="See how small changes reduce your footprint" href="/simulator" icon={<TrendingDown style={{ width: 24, height: 24, color: "#38bdf8" }} />} />
            <QuickAction title="Take a Challenge" desc="Daily, weekly, and monthly sustainability challenges" href="/challenges" icon={<Trophy style={{ width: 24, height: 24, color: "#a78bfa" }} />} />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, trend }: { label: string; value: string; icon: React.ReactNode; trend?: { value: number; positive: boolean } }) {
  return (
    <div className="glass-card stat-card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "0.875rem", color: "#a7c4b8" }}>{label}</span>
        {icon}
      </div>
      <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{value}</div>
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.5rem", fontSize: "0.75rem", fontWeight: 500, color: trend.positive ? "#34d399" : "#fb7185" }}>
          {trend.positive ? <TrendingDown style={{ width: 12, height: 12 }} aria-hidden="true" /> : <TrendingUp style={{ width: 12, height: 12 }} aria-hidden="true" />}
          {trend.value.toFixed(1)}% vs last month
        </div>
      )}
    </div>
  );
}

function QuickAction({ title, desc, href, icon }: { title: string; desc: string; href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="glass-card" style={{ padding: "1.25rem", display: "block", textDecoration: "none", color: "inherit" }}>
      <div style={{ marginBottom: "0.75rem" }}>{icon}</div>
      <h3 style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "0.25rem" }}>{title}</h3>
      <p style={{ fontSize: "0.8125rem", color: "#a7c4b8" }}>{desc}</p>
    </Link>
  );
}

function EmptyState({ msg, href, label }: { msg: string; href: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, textAlign: "center" }}>
      <Leaf style={{ width: 40, height: 40, color: "rgba(16,185,129,0.2)", marginBottom: "0.75rem" }} aria-hidden="true" />
      <p style={{ fontSize: "0.875rem", color: "#6b8f80", marginBottom: "1rem", maxWidth: 250 }}>{msg}</p>
      <Link href={href} className="btn-primary" style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>{label}</Link>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card" style={{ padding: "1.25rem", opacity: 0.5 }}>
            <div style={{ height: 16, width: 96, background: "rgba(16,185,129,0.1)", borderRadius: 4, marginBottom: "0.75rem" }} />
            <div style={{ height: 32, width: 64, background: "rgba(16,185,129,0.1)", borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
