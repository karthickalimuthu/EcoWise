"use client";

import { useState, useEffect, useCallback } from "react";
import { Lightbulb, Sparkles, Check, ChevronRight, RefreshCw, TrendingDown } from "lucide-react";

interface Rec { id: string; category: string; title: string; description: string; reasoning: string; difficulty: string; impact: string; estimatedReduction: number; accepted: boolean; }

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);
  const [gen, setGen] = useState(false);
  const [exp, setExp] = useState<string | null>(null);

  const load = useCallback(async () => { setLoading(true); try { const r = await fetch("/api/recommendations"); if (r.ok) { const j = await r.json(); setRecs(j.data ?? []); } } catch(e) { console.error(e); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  async function genNew() { setGen(true); try { const r = await fetch("/api/recommendations", { method: "POST" }); if (r.ok) { const j = await r.json(); setRecs(j.data ?? []); } } catch(e) { console.error(e); } finally { setGen(false); } }
  async function accept(id: string) { try { await fetch("/api/recommendations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "accept", recommendationId: id }) }); setRecs(p => p.map(r => r.id === id ? { ...r, accepted: true } : r)); } catch(e) { console.error(e); } }

  const catColor = (c: string) => c === "TRANSPORT" ? "cat-transport" : c === "FOOD" ? "cat-food" : c === "ENERGY" ? "cat-energy" : "cat-shopping";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold">AI Carbon <span className="gradient-text">Coach</span></h1><p className="text-[var(--color-text-secondary)] mt-1">Personalized recommendations to reduce your footprint</p></div>
        <button onClick={genNew} disabled={gen} className="btn-primary" aria-busy={gen}>{gen ? <><RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />Analyzing...</> : <><Sparkles className="w-4 h-4" aria-hidden="true" />Generate New</>}</button>
      </div>
      {loading ? <div className="space-y-4" role="status" aria-label="Loading">{Array.from({length:3}).map((_,i)=><div key={i} className="glass-card p-6 animate-pulse"><div className="h-5 w-64 bg-emerald-500/10 rounded mb-3"/><div className="h-4 w-full bg-emerald-500/5 rounded"/></div>)}</div>
      : recs.length === 0 ? <div className="glass-card p-12 text-center"><Lightbulb className="w-12 h-12 text-amber-400/30 mx-auto mb-4" aria-hidden="true"/><h2 className="text-lg font-semibold mb-2">No recommendations yet</h2><p className="text-[var(--color-text-muted)] mb-4">Log activities then generate recommendations.</p><button onClick={genNew} className="btn-primary"><Sparkles className="w-4 h-4" aria-hidden="true"/>Generate</button></div>
      : <div className="space-y-4">{recs.map(rec=><article key={rec.id} className="glass-card p-6"><div className="flex items-start justify-between"><div className="flex-1"><div className="flex items-center gap-2 mb-2"><span className={`badge badge-${rec.difficulty.toLowerCase()}`}>{rec.difficulty}</span><span className={`badge badge-${rec.impact==="HIGH"?"high":"low"}`}>{rec.impact} Impact</span><span className={`text-xs font-medium ${catColor(rec.category)}`}>{rec.category}</span></div><h3 className="text-lg font-semibold mb-1">{rec.title}</h3><p className="text-sm text-[var(--color-text-secondary)]">{rec.description}</p>{rec.estimatedReduction>0&&<div className="flex items-center gap-2 mt-3 text-emerald-400 text-sm font-medium"><TrendingDown className="w-4 h-4" aria-hidden="true"/>Est. reduction: {rec.estimatedReduction.toFixed(1)} kg CO₂e/mo</div>}<button onClick={()=>setExp(exp===rec.id?null:rec.id)} className="flex items-center gap-1 mt-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]" aria-expanded={exp===rec.id}><ChevronRight className={`w-3 h-3 transition-transform ${exp===rec.id?"rotate-90":""}`} aria-hidden="true"/>Why?</button>{exp===rec.id&&<div className="mt-2 p-3 rounded-lg bg-[var(--color-surface-tertiary)] text-sm text-[var(--color-text-secondary)]">{rec.reasoning}</div>}</div><div className="ml-4">{rec.accepted?<div className="flex items-center gap-1 text-emerald-400 text-sm font-medium"><Check className="w-4 h-4" aria-hidden="true"/>Accepted</div>:<button onClick={()=>accept(rec.id)} className="btn-primary text-sm px-4 py-2">Accept</button>}</div></div></article>)}</div>}
    </div>
  );
}
