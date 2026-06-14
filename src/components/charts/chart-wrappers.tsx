"use client";

/**
 * @module components/charts/chart-wrappers
 * @description Client-side Recharts wrapper components.
 * Handles hydration issues with isMounted pattern.
 */

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  TRANSPORT: "#38bdf8",
  FOOD: "#fbbf24",
  ENERGY: "#a78bfa",
  SHOPPING: "#fb7185",
};

interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface TrendDataPoint {
  date: string;
  co2Amount: number;
}

// ── Pie Chart ──
export function CategoryPieChart({ data }: { data: ChartDataPoint[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ChartSkeleton />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
          dataKey="value"
          nameKey="name"
          aria-label="Carbon footprint by category"
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.color ?? CATEGORY_COLORS[entry.name] ?? "#10b981"}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a2420",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "8px",
            color: "#f0fdf4",
            fontSize: "13px",
          }}
          formatter={(value) => [`${Number(value).toFixed(1)} kg CO₂e`, ""]}
        />
        <Legend
          wrapperStyle={{ color: "#a7c4b8", fontSize: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Area Chart ──
export function TrendAreaChart({ data }: { data: TrendDataPoint[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ChartSkeleton />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.1)" />
        <XAxis
          dataKey="date"
          stroke="#8bb09f"
          fontSize={12}
          tickFormatter={(val) => {
            const d = new Date(val);
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }}
        />
        <YAxis stroke="#8bb09f" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a2420",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "8px",
            color: "#f0fdf4",
            fontSize: "13px",
          }}
          formatter={(value) => [`${Number(value).toFixed(2)} kg CO₂e`, "Emissions"]}
        />
        <Area
          type="monotone"
          dataKey="co2Amount"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#co2Gradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Bar Chart ──
export function CategoryBarChart({ data }: { data: ChartDataPoint[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ChartSkeleton />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.1)" />
        <XAxis dataKey="name" stroke="#8bb09f" fontSize={12} />
        <YAxis stroke="#8bb09f" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a2420",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "8px",
            color: "#f0fdf4",
            fontSize: "13px",
          }}
          formatter={(value) => [`${Number(value).toFixed(1)} kg CO₂e`, ""]}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.color ?? CATEGORY_COLORS[entry.name] ?? "#10b981"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Skeleton ──
function ChartSkeleton() {
  return (
    <div
      className="flex items-center justify-center h-[280px] text-[var(--color-text-muted)] text-sm"
      role="status"
      aria-label="Loading chart"
    >
      <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mr-2" />
      Loading chart...
    </div>
  );
}
