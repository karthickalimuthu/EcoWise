import Link from "next/link";
import {
  Leaf, BarChart3, Lightbulb, Target, TrendingDown, Award,
  ArrowRight, Zap, Shield, Globe,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main id="main-content" className="gradient-bg" style={{ minHeight: "100vh" }}>
      {/* ── Navigation ── */}
      <nav aria-label="Main navigation" className="container-main" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", fontSize: "1.25rem", fontWeight: 700 }} aria-label="EcoWise AI Home">
          <Leaf style={{ width: 28, height: 28, color: "#34d399" }} aria-hidden="true" />
          <span className="gradient-text">EcoWise AI</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/auth/login" className="btn-secondary">Sign In</Link>
          <Link href="/auth/register" className="btn-primary">
            Get Started <ArrowRight style={{ width: 16, height: 16 }} aria-hidden="true" />
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="container-main fade-in-up" aria-labelledby="hero-heading" style={{ textAlign: "center", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)", color: "#34d399", fontSize: "0.875rem", fontWeight: 500, marginBottom: "2rem" }}>
          <Globe style={{ width: 16, height: 16 }} aria-hidden="true" />
          AI-Powered Sustainability Platform
        </div>

        <h1 id="hero-heading" className="fade-in-up fade-in-up-delay-1" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem" }}>
          Understand Your<br />
          <span className="gradient-text">Carbon Footprint</span>
        </h1>

        <p className="fade-in-up fade-in-up-delay-2" style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#a7c4b8", maxWidth: "640px", margin: "0 auto 2.5rem" }}>
          Track emissions, get AI-powered recommendations, and take measurable steps toward a sustainable future. Every action counts.
        </p>

        <div className="fade-in-up fade-in-up-delay-3" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/auth/register" className="btn-primary" style={{ fontSize: "1.0625rem", padding: "0.875rem 2rem" }}>
            Start Tracking Free <ArrowRight style={{ width: 18, height: 18 }} aria-hidden="true" />
          </Link>
          <Link href="#features" className="btn-secondary" style={{ fontSize: "1.0625rem", padding: "0.875rem 2rem" }}>
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="fade-in-up fade-in-up-delay-4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", maxWidth: "560px", margin: "4rem auto 0" }}>
          {[
            { value: "4.7t", label: "Avg Individual CO₂/yr" },
            { value: "30%", label: "Potential Reduction" },
            { value: "12+", label: "Trackable Categories" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div className="gradient-text" style={{ fontSize: "1.875rem", fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: "0.8125rem", color: "#6b8f80", marginTop: "0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="container-main" aria-labelledby="features-heading" style={{ paddingBottom: "5rem" }}>
        <h2 id="features-heading" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, textAlign: "center", marginBottom: "0.75rem" }}>
          Everything You Need to Go <span className="gradient-text">Green</span>
        </h2>
        <p style={{ textAlign: "center", color: "#a7c4b8", marginBottom: "3rem", maxWidth: "520px", marginLeft: "auto", marginRight: "auto", fontSize: "0.9375rem" }}>
          From tracking to action — a complete sustainability toolkit powered by intelligent insights.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "1.25rem" }}>
          {[
            { icon: BarChart3, title: "Carbon Dashboard", desc: "Visualize your footprint with interactive charts. See trends, breakdowns by category, and monthly comparisons.", color: "#34d399" },
            { icon: Lightbulb, title: "AI Carbon Coach", desc: "Get personalized recommendations ranked by impact and feasibility. Our AI identifies your biggest emission sources.", color: "#fbbf24" },
            { icon: TrendingDown, title: "Reduction Simulator", desc: "What if you cycled twice a week? Simulate behavioral changes and see the projected impact on your footprint.", color: "#38bdf8" },
            { icon: Target, title: "Sustainability Challenges", desc: "Daily, weekly, and monthly challenges tailored to your habits. Gamify your journey to sustainability.", color: "#a78bfa" },
            { icon: Zap, title: "Activity Tracking", desc: "Log transport, food, energy, and shopping activities. Automatic CO₂ calculations using EPA emission factors.", color: "#fb7185" },
            { icon: Shield, title: "Enterprise Security", desc: "OWASP-compliant security controls, encrypted data, and RBAC. Your data is protected by industry best practices.", color: "#34d399" },
          ].map((f) => (
            <article key={f.title} className="glass-card" style={{ padding: "1.5rem" }}>
              <f.icon style={{ width: 36, height: 36, color: f.color, marginBottom: "1rem" }} aria-hidden="true" />
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: "0.5rem" }}>{f.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "#a7c4b8", lineHeight: 1.6 }}>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="container-main" aria-labelledby="how-heading" style={{ paddingBottom: "5rem" }}>
        <h2 id="how-heading" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, textAlign: "center", marginBottom: "3rem" }}>
          How It <span className="gradient-text">Works</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "2rem" }}>
          {[
            { step: "01", title: "Track Your Activities", desc: "Log your daily transport, food, energy use, and shopping. Takes less than 2 minutes a day." },
            { step: "02", title: "Get AI Insights", desc: "Our engine analyzes your data to identify emission hotspots and generate personalized action plans." },
            { step: "03", title: "Reduce & Celebrate", desc: "Follow recommendations, complete challenges, and watch your carbon footprint shrink over time." },
          ].map((item) => (
            <div key={item.step} style={{ textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "4rem", height: "4rem", borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: "1.5rem" }}>
                <span className="gradient-text" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{item.step}</span>
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem" }}>{item.title}</h3>
              <p style={{ color: "#a7c4b8", fontSize: "0.875rem" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="container-main" style={{ paddingBottom: "4rem", textAlign: "center" }}>
        <div className="glass-card pulse-glow" style={{ padding: "3rem 2rem", maxWidth: "720px", margin: "0 auto" }}>
          <Leaf style={{ width: 48, height: 48, color: "#34d399", margin: "0 auto 1.5rem" }} aria-hidden="true" />
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>
            Ready to Make a <span className="gradient-text">Difference</span>?
          </h2>
          <p style={{ color: "#a7c4b8", marginBottom: "2rem", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            Join EcoWise AI and start your sustainability journey today. Track, understand, and reduce your environmental impact.
          </p>
          <Link href="/auth/register" className="btn-primary" style={{ fontSize: "1.0625rem", padding: "0.875rem 2rem" }}>
            Create Free Account <ArrowRight style={{ width: 18, height: 18 }} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(16,185,129,0.15)", padding: "1.5rem 0" }}>
        <div className="container-main" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8125rem", color: "#6b8f80", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Leaf style={{ width: 16, height: 16, color: "#34d399" }} aria-hidden="true" />
            <span>© 2026 EcoWise AI. All rights reserved.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            Built with <span style={{ color: "#34d399" }}>♥</span> for the planet
          </div>
        </div>
      </footer>
    </main>
  );
}
