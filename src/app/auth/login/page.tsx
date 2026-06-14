"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) { setError("Invalid email or password."); }
      else { router.push("/dashboard"); router.refresh(); }
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <main id="main-content" className="gradient-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", fontSize: "1.5rem", fontWeight: 700 }} aria-label="EcoWise AI Home">
            <Leaf style={{ width: 32, height: 32, color: "#34d399" }} aria-hidden="true" />
            <span className="gradient-text">EcoWise AI</span>
          </Link>
          <p style={{ color: "#6b8f80", marginTop: "0.5rem", fontSize: "0.9375rem" }}>Welcome back! Sign in to continue.</p>
        </div>

        {/* Form */}
        <div className="glass-card" style={{ padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Sign In</h1>

          {error && (
            <div role="alert" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", marginBottom: "1rem", borderRadius: "0.75rem", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", color: "#fb7185", fontSize: "0.875rem" }}>
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="email" className="input-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#6b8f80" }} aria-hidden="true" />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: "2.5rem" }} placeholder="you@example.com" required autoComplete="email" aria-required="true" />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="password" className="input-label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#6b8f80" }} aria-hidden="true" />
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" style={{ paddingLeft: "2.5rem" }} placeholder="Enter your password" required autoComplete="current-password" aria-required="true" />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "0.75rem" }} disabled={loading} aria-busy={loading}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                  Signing in...
                </span>
              ) : (<>Sign In <ArrowRight style={{ width: 16, height: 16 }} aria-hidden="true" /></>)}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b8f80", marginTop: "1.5rem" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" style={{ color: "#34d399", fontWeight: 500, textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
