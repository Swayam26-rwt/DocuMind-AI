import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-base)",
      backgroundImage: `
        radial-gradient(ellipse at 15% 25%, rgba(99,102,241,0.14) 0%, transparent 50%),
        radial-gradient(ellipse at 85% 75%, rgba(139,92,246,0.10) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 40%)
      `,
      padding: 24,
      flexDirection: "column",
    }}>
      {/* Floating grid pattern */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 99, padding: "6px 14px", marginBottom: 28, fontSize: 12, color: "var(--brand-accent)", fontWeight: 600 }}>
          <span className="dot dot-green" />
          Platform v1.0 — Now running locally
        </div>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}>
            🧠
          </div>
        </div>

        {/* Hero */}
        <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.02em" }}>
          <span className="gradient-text">DocuMind AI</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto 12px", lineHeight: 1.7 }}>
          Secure AI-Powered Document Intelligence, RAG & Verification Platform.
        </p>
        <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Transform unstructured documents into searchable, structured, explainable and verifiable knowledge.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Open Dashboard →
          </Link>
          <Link href="/auth/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 48 }}>
          {["🔐 Multi-Tenant Auth","📄 Multi-Format Parsing","🔎 Hybrid RAG Search","🤖 AI Extraction","📚 Evidence Citations","✅ Human Verification","📊 AI Evaluation"].map(f => (
            <span key={f} className="chip">{f}</span>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 32, justifyContent: "center", borderTop: "1px solid var(--border)", paddingTop: 32 }}>
          {[
            { label: "Formats Supported", value: "8+" },
            { label: "AI Models", value: "Gemini 2.5" },
            { label: "Vector Search", value: "pgvector" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
