import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function EvaluationsPage() {
  const metrics = [
    { label: "Faithfulness", value: "—", desc: "Does answer match source?", icon: "🎯", color: "#10b981" },
    { label: "Answer Relevance", value: "—", desc: "Is answer on-topic?", icon: "💡", color: "#6366f1" },
    { label: "Context Recall", value: "—", desc: "Retrieved all relevant chunks?", icon: "🔁", color: "#f59e0b" },
    { label: "Context Precision", value: "—", desc: "Retrieved only relevant chunks?", icon: "🎪", color: "#8b5cf6" },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header
          title="Evaluations"
          subtitle="AI quality & accuracy benchmarking"
          actions={
            <button className="btn btn-primary btn-sm">▶ Run Evaluation</button>
          }
        />
        <div className="page-body fade-in">
          {/* Metrics grid */}
          <div className="grid-4" style={{ marginBottom: 28 }}>
            {metrics.map(m => (
              <div className="stat-card" key={m.label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div className="stat-label">{m.label}</div>
                  <div className="stat-icon" style={{ background: `${m.color}18` }}>{m.icon}</div>
                </div>
                <div className="stat-value" style={{ color: m.color }}>{m.value}</div>
                <div className="stat-sub">{m.desc}</div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div style={{
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "var(--r-lg)",
            padding: "18px 22px",
            marginBottom: 24,
            display: "flex", gap: 14, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 24 }}>📊</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>RAGAS-style AI Evaluation</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                DocuMind AI evaluates your RAG pipeline using faithfulness, answer relevance, context recall and precision metrics — powered by Gemini as the judge model. Create datasets and run evaluations to benchmark quality over time.
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            {/* Datasets */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Evaluation Datasets</div>
              <div className="card">
                <div className="empty-state" style={{ padding: "40px 16px" }}>
                  <div className="empty-icon">📋</div>
                  <div className="empty-title">No datasets yet</div>
                  <div className="empty-sub">Create question-answer pairs to evaluate your RAG pipeline quality</div>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>+ Create Dataset</button>
                </div>
              </div>
            </div>

            {/* Runs history */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Evaluation Runs</div>
              <div className="card">
                <div className="empty-state" style={{ padding: "40px 16px" }}>
                  <div className="empty-icon">▶</div>
                  <div className="empty-title">No runs yet</div>
                  <div className="empty-sub">Run an evaluation to see faithfulness and relevance scores</div>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>▶ Run Evaluation</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}