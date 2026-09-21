"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";


export default function DashboardPage() {
  const stats = [
    { icon: "📄", label: "Total Documents", value: "0", sub: "Upload your first doc", color: "#6366f1" },
    { icon: "💬", label: "AI Conversations", value: "0", sub: "Start chatting", color: "#8b5cf6" },
    { icon: "✅", label: "Verified Extractions", value: "0", sub: "Pending review", color: "#10b981" },
    { icon: "🔍", label: "Searches Today", value: "0", sub: "Hybrid RAG search", color: "#f59e0b" },
  ];

  const recentActivity = [
    { icon: "🚀", text: "Platform started successfully", time: "Just now", color: "#10b981" },
    { icon: "🗄️", text: "Database connected — pgvector ready", time: "Just now", color: "#6366f1" },
    { icon: "⚡", text: "Redis cache initialized", time: "Just now", color: "#f59e0b" },
  ];

  const quickActions = [
    { icon: "📤", label: "Upload Document", href: "/workspace/documents", desc: "PDF, DOCX, PPTX, XLSX…" },
    { icon: "💬", label: "Start AI Chat", href: "/workspace/chat", desc: "Ask questions about your docs" },
    { icon: "🔍", label: "Semantic Search", href: "/workspace/search", desc: "Hybrid vector + keyword search" },
    { icon: "✅", label: "Review Extractions", href: "/workspace/verification", desc: "Human-in-the-loop verification" },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header
          title="Dashboard"
          subtitle="Overview"
          actions={
            <button className="btn btn-primary btn-sm">
              + Upload Document
            </button>
          }
        />
        <div className="page-body fade-in">
          {/* Welcome banner */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "var(--r-xl)",
            padding: "28px 32px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
                Welcome to <span className="gradient-text">DocuMind AI</span> 👋
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 480 }}>
                Your AI-powered document intelligence platform is ready. Upload documents to get started with RAG search, extraction, and verification.
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <a href="/workspace/documents" className="btn btn-primary btn-sm">Upload First Document</a>
                <a href="/workspace/chat" className="btn btn-secondary btn-sm">Explore AI Chat</a>
              </div>
            </div>
            <div style={{ fontSize: 72, flexShrink: 0 }}>🧠</div>
          </div>

          {/* Stats grid */}
          <div className="grid-4" style={{ marginBottom: 28 }}>
            {stats.map((s) => (
              <div className="stat-card" key={s.label}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-icon" style={{ background: `${s.color}18` }}>
                    {s.icon}
                  </div>
                </div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            {/* Quick actions */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>Quick Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {quickActions.map((a) => (
                  <a key={a.href} href={a.href} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-lg)",
                    transition: "all 0.2s",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.4)";
                      (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{ width: 40, height: 40, background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      {a.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{a.label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.desc}</div>
                    </div>
                    <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: 16 }}>→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>System Activity</div>
              <div className="card" style={{ padding: 0 }}>
                {recentActivity.map((a, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 18px",
                    borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border)" : "none",
                  }}>
                    <div style={{ width: 34, height: 34, background: `${a.color}15`, borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      {a.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{a.text}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{a.time}</div>
                    </div>
                    <span className="dot dot-green" />
                  </div>
                ))}

                {/* System status */}
                <div style={{ padding: "14px 18px", background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderRadius: "0 0 var(--r-lg) var(--r-lg)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Services</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "FastAPI Backend",    status: "Online",  ok: true  },
                      { label: "PostgreSQL + pgvector", status: "Online", ok: true },
                      { label: "Redis Cache",        status: "Online",  ok: true  },
                      { label: "MinIO Storage",      status: "Offline", ok: false },
                      { label: "Celery Worker",      status: "Offline", ok: false },
                    ].map(s => (
                      <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</span>
                        <span className={`badge ${s.ok ? "badge-green" : "badge-yellow"}`}>
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}