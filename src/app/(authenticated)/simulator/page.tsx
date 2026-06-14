"use client";
import { useState } from "react";
import { FlaskConical, TrendingDown, ArrowRight } from "lucide-react";
import { EMISSION_FACTORS } from "@/domain/types/carbon.types";

const SUBS = [
  { value: "car", label: "Car (km)", cat: "TRANSPORT" },
  { value: "bus", label: "Bus (km)", cat: "TRANSPORT" },
  { value: "train", label: "Train (km)", cat: "TRANSPORT" },
  { value: "flight_domestic", label: "Dom. Flight (km)", cat: "TRANSPORT" },
  { value: "high_meat", label: "High Meat (days)", cat: "FOOD" },
  { value: "mixed", label: "Mixed Diet (days)", cat: "FOOD" },
  { value: "electricity", label: "Electricity (kWh)", cat: "ENERGY" },
  { value: "water", label: "Water (m³)", cat: "ENERGY" },
  { value: "clothing", label: "Clothing (items)", cat: "SHOPPING" },
  { value: "electronics", label: "Electronics (items)", cat: "SHOPPING" },
];

interface Row { sub: string; current: string; proposed: string; }

export default function SimulatorPage() {
  const [rows, setRows] = useState<Row[]>([
    { sub: "car", current: "100", proposed: "60" },
    { sub: "high_meat", current: "20", proposed: "12" },
    { sub: "electricity", current: "300", proposed: "250" },
  ]);
  const [result, setResult] = useState<{ currentFP: number; projectedFP: number; reduction: number; pct: number } | null>(null);

  function updateRow(i: number, field: keyof Row, val: string) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }
  function addRow() { setRows(prev => [...prev, { sub: "bus", current: "0", proposed: "0" }]); }
  function removeRow(i: number) { setRows(prev => prev.filter((_, idx) => idx !== i)); }

  function simulate() {
    let currentFP = 0;
    let projectedFP = 0;
    for (const row of rows) {
      const ef = EMISSION_FACTORS[row.sub];
      if (!ef) continue;
      const cur = parseFloat(row.current) || 0;
      const prop = parseFloat(row.proposed) || 0;
      currentFP += cur * ef.factor;
      projectedFP += prop * ef.factor;
    }
    const reduction = Math.max(0, currentFP - projectedFP);
    const pct = currentFP > 0 ? (reduction / currentFP) * 100 : 0;
    setResult({ currentFP: Math.round(currentFP * 100) / 100, projectedFP: Math.round(projectedFP * 100) / 100, reduction: Math.round(reduction * 100) / 100, pct: Math.round(pct * 10) / 10 });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reduction <span className="gradient-text">Simulator</span></h1>
        <p className="text-[var(--color-text-secondary)] mt-1">What if you changed your habits? See the projected impact.</p>
      </div>

      <div className="glass-card p-6 mb-6">
        <h2 className="font-semibold mb-4">Your Activities</h2>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
              <div>
                {i === 0 && <label className="input-label">Activity</label>}
                <select value={row.sub} onChange={e => updateRow(i, "sub", e.target.value)} className="input-field" aria-label="Activity type">
                  {SUBS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                {i === 0 && <label className="input-label">Current</label>}
                <input type="number" value={row.current} onChange={e => updateRow(i, "current", e.target.value)} className="input-field" aria-label="Current value" min="0" />
              </div>
              <div>
                {i === 0 && <label className="input-label">Proposed</label>}
                <input type="number" value={row.proposed} onChange={e => updateRow(i, "proposed", e.target.value)} className="input-field" aria-label="Proposed value" min="0" />
              </div>
              <button onClick={() => removeRow(i)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg" aria-label="Remove row">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={addRow} className="btn-secondary text-sm">+ Add Row</button>
          <button onClick={simulate} className="btn-primary text-sm"><FlaskConical className="w-4 h-4" aria-hidden="true" />Simulate<ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
        </div>
      </div>

      {result && (
        <div className="glass-card p-6 fade-in-up">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-emerald-400" aria-hidden="true" />Simulation Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-[var(--color-surface-tertiary)]">
              <div className="text-2xl font-bold text-rose-400">{result.currentFP}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Current kg CO₂e</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--color-surface-tertiary)]">
              <div className="text-2xl font-bold text-emerald-400">{result.projectedFP}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Projected kg CO₂e</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--color-surface-tertiary)]">
              <div className="text-2xl font-bold gradient-text">{result.reduction}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">kg CO₂e Saved</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-2xl font-bold text-emerald-400">{result.pct}%</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Reduction</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
