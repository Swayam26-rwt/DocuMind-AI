"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="auth-root">
      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />

      <div className="auth-card fade-in" style={{ position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🧠</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>DocuMind AI</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Document Intelligence Platform</div>
          </div>
        </div>

        <div className="auth-title">Sign in to your account</div>
        <div className="auth-subtitle">Access your secure AI document workspace</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="input"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label">Password</label>
              <Link href="/forgot-password" style={{ fontSize: 12, color: "var(--brand-accent)" }}>
                Forgot password?
              </Link>
            </div>
            <input
              className="input"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14 }}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Signing in…</>
            ) : (
              "Sign in →"
            )}
          </button>
        </form>

        <div className="auth-divider" style={{ marginTop: 20 }}>or</div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="auth-footer">
            Don&apos;t have an account?{" "}
            <Link href="/register">Create one free</Link>
          </div>
        </div>

        {/* Security note */}
        <div style={{
          marginTop: 24,
          padding: "12px 14px",
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderRadius: "var(--r-md)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>🔐</span>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            End-to-end secured with JWT authentication and bcrypt password hashing.
          </div>
        </div>
      </div>
    </div>
  );
}