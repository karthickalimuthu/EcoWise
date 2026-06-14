"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, Mail, Lock, User, ArrowRight, AlertCircle, GraduationCap, Briefcase, Users, Heart } from "lucide-react";

const PROFILES = [
  { value: "STUDENT", label: "Student", icon: GraduationCap, desc: "Budget-conscious" },
  { value: "PROFESSIONAL", label: "Professional", icon: Briefcase, desc: "Office & commute" },
  { value: "FAMILY", label: "Family", icon: Users, desc: "Home & meals" },
  { value: "ENTHUSIAST", label: "Enthusiast", icon: Heart, desc: "Deep analytics" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", profileType: "GENERAL" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error?.message ?? "Registration failed"); return; }
      const { signIn } = await import("next-auth/react");
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/dashboard"); router.refresh();
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <main id="main-content" className="gradient-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", fontSize: "1.5rem", fontWeight: 700 }} aria-label="EcoWise AI Home">
            <Leaf style={{ width: 32, height: 32, color: "#34d399" }} aria-hidden="true" />
            <span className="gradient-text">EcoWise AI</span>
          </Link>
          <p style={{ color: "#6b8f80", marginTop: "0.5rem", fontSize: "0.9375rem" }}>Start your sustainability journey today.</p>
        </div>

        <div className="glass-card" style={{ padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Create Account</h1>

          {error && (
            <div role="alert" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", marginBottom: "1rem", borderRadius: "0.75rem", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", color: "#fb7185", fontSize: "0.875rem" }}>
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="name" className="input-label">Full Name</label>
              <div style={{ position: "relative" }}>
                <User style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#6b8f80" }} aria-hidden="true" />
                <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" style={{ paddingLeft: "2.5rem" }} placeholder="John Doe" required aria-required="true" />
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="email" className="input-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#6b8f80" }} aria-hidden="true" />
                <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" style={{ paddingLeft: "2.5rem" }} placeholder="you@example.com" required autoComplete="email" aria-required="true" />
              </div>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="password" className="input-label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#6b8f80" }} aria-hidden="true" />
                <input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" style={{ paddingLeft: "2.5rem" }} placeholder="Min 8 chars, 1 upper, 1 number" required autoComplete="new-password" aria-required="true" />
              </div>
              <p style={{ fontSize: "0.75rem", color: "#6b8f80", marginTop: "0.25rem" }}>At least 8 characters with uppercase, lowercase, and a number.</p>
            </div>

            <fieldset style={{ border: "none", marginBottom: "1.5rem" }}>
              <legend className="input-label" style={{ marginBottom: "0.75rem" }}>I am a...</legend>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                {PROFILES.map((p) => (
                  <button key={p.value} type="button" onClick={() => setForm({ ...form, profileType: p.value })}
                    aria-pressed={form.profileType === p.value}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", padding: "0.75rem", borderRadius: "0.75rem", border: form.profileType === p.value ? "1px solid #34d399" : "1px solid rgba(16,185,129,0.15)", background: form.profileType === p.value ? "rgba(16,185,129,0.1)" : "transparent", color: form.profileType === p.value ? "#34d399" : "#a7c4b8", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
                    <p.icon style={{ width: 20, height: 20 }} aria-hidden="true" />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>{p.label}</span>
                    <span style={{ fontSize: "0.6875rem", opacity: 0.7 }}>{p.desc}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "0.75rem" }} disabled={loading} aria-busy={loading}>
              {loading ? (<span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />Creating...</span>) : (<>Create Account <ArrowRight style={{ width: 16, height: 16 }} aria-hidden="true" /></>)}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b8f80", marginTop: "1.5rem" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#34d399", fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
