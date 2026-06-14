"use client";
import { useState, useEffect, useCallback } from "react";
import { Trophy, Plus, CheckCircle, Clock, X } from "lucide-react";

interface Challenge { id: string; type: string; title: string; description: string; category: string; targetReduction: number; status: string; startDate: string; endDate: string; }

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => { setLoading(true); try { const r = await fetch("/api/challenges"); if (r.ok) { const j = await r.json(); setChallenges(j.data ?? []); } } catch(e) { console.error(e); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  async function generate(type: string) {
    try { const r = await fetch("/api/challenges", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type }) }); if (r.ok) { load(); } } catch(e) { console.error(e); }
  }

  async function complete(id: string) {
    try { await fetch(`/api/challenges/${id}/complete`, { method: "POST" }); setChallenges(p => p.map(c => c.id === id ? { ...c, status: "COMPLETED" } : c)); } catch(e) { console.error(e); }
  }

  const active = challenges.filter(c => c.status === "ACTIVE");
  const completed = challenges.filter(c => c.status === "COMPLETED");

  const statusIcon = (s: string) => s === "COMPLETED" ? <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : s === "EXPIRED" ? <X className="w-4 h-4 text-rose-400" aria-hidden="true" /> : <Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />;
  const catColor = (c: string) => c === "TRANSPORT" ? "cat-transport" : c === "FOOD" ? "cat-food" : c === "ENERGY" ? "cat-energy" : "cat-shopping";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold">Sustainability <span className="gradient-text">Challenges</span></h1><p className="text-[var(--color-text-secondary)] mt-1">{active.length} active · {completed.length} completed</p></div>
      </div>

      {/* Generate Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(["DAILY", "WEEKLY", "MONTHLY"] as const).map(type => (
          <button key={type} onClick={() => generate(type)} className="glass-card p-4 text-center hover:border-emerald-400/30 transition-all">
            <Plus className="w-5 h-5 mx-auto mb-2 text-emerald-400" aria-hidden="true" />
            <span className="text-sm font-medium">New {type.charAt(0) + type.slice(1).toLowerCase()} Challenge</span>
          </button>
        ))}
      </div>

      {/* Active Challenges */}
      {active.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" aria-hidden="true" />Active Challenges</h2>
          <div className="space-y-3">
            {active.map(ch => (
              <article key={ch.id} className="glass-card p-5 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge badge-${ch.type === "DAILY" ? "easy" : ch.type === "WEEKLY" ? "medium" : "hard"}`}>{ch.type}</span>
                    <span className={`text-xs font-medium ${catColor(ch.category)}`}>{ch.category}</span>
                  </div>
                  <h3 className="font-semibold">{ch.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">{ch.description}</p>
                  <div className="text-xs text-[var(--color-text-muted)] mt-2">Target: {ch.targetReduction} kg CO₂e · Ends {new Date(ch.endDate).toLocaleDateString()}</div>
                </div>
                <button onClick={() => complete(ch.id)} className="btn-primary text-sm px-4 py-2 ml-4"><CheckCircle className="w-4 h-4" aria-hidden="true" />Complete</button>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {challenges.filter(c => c.status !== "ACTIVE").length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">History</h2>
          <div className="space-y-2">
            {challenges.filter(c => c.status !== "ACTIVE").map(ch => (
              <div key={ch.id} className="glass-card p-4 flex items-center gap-3 opacity-70">
                {statusIcon(ch.status)}
                <div className="flex-1"><span className="font-medium text-sm">{ch.title}</span><span className={`ml-2 text-xs ${catColor(ch.category)}`}>{ch.type}</span></div>
                <span className="text-xs text-[var(--color-text-muted)]">{ch.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && challenges.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Trophy className="w-12 h-12 text-amber-400/30 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold mb-2">No challenges yet</h2>
          <p className="text-[var(--color-text-muted)] mb-4">Generate your first sustainability challenge above!</p>
        </div>
      )}
    </div>
  );
}
