import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function VerificationPage() {
  const metrics = [
    { label: "Pending Review", value: "0", icon: "⏳", color: "#f59e0b" },
    { label: "Approved", value: "0", icon: "✅", color: "#10b981" },
    { label: "Rejected", value: "0", icon: "❌", color: "#ef4444" },
    { label: "Avg. Confidence", value: "—", icon: "📊", color: "#6366f1" },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header
          title="Verification"
          subtitle="Human-in-the-loop AI extraction review"
          actions={
            <button className="btn btn-primary btn-sm">Start Review Queue</button>
          }
        />
        <div className="page-body fade-in">
          {/* Stats */}
          <div className="grid-4" style={{ marginBottom: 28 }}>
            {metrics.map(m => (
              <div className="stat-card" key={m.label}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div className="stat-label">{m.label}</div>
                  <div className="stat-icon" style={{ background: `${m.color}18` }}>{m.icon}</div>
                </div>
                <div className="stat-value" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Info banner */}
          <div style={{
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "var(--r-lg)",
            padding: "16px 20px",
            display: "flex", alignItems: "flex-start", gap: 12,
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>Human-in-the-Loop Verification</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                AI extracts structured data from documents. You review each extraction — approve, reject, or edit — before it enters your knowledge base. This ensures accuracy and auditability.
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button className="tab active">Pending (0)</button>
            <button className="tab">Approved (0)</button>
            <button className="tab">Rejected (0)</button>
            <button className="tab">All</button>
          </div>

          {/* Empty state */}
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No extractions to review</div>
              <div className="empty-sub">
                Upload and process documents with AI extraction enabled. Extracted fields will appear here for human review.
              </div>
              <a href="/workspace/documents" className="btn btn-primary" style={{ marginTop: 8 }}>
                Upload Documents
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}