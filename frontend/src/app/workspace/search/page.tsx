"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"hybrid" | "semantic" | "keyword">("hybrid");

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header title="Search" subtitle="Hybrid RAG search across all documents" />
        <div className="page-body fade-in">
          {/* Search hero */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: "var(--r-xl)",
            padding: "36px",
            marginBottom: 28,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
              🔍 Intelligent Document Search
            </div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
              Powered by pgvector semantic search + BM25 keyword matching
            </div>

            {/* Search input */}
            <div style={{
              display: "flex",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-bright)",
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
              maxWidth: 640,
              margin: "0 auto 16px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}>
              <span style={{ padding: "0 16px", display: "flex", alignItems: "center", color: "var(--text-muted)", fontSize: 18 }}>🔍</span>
              <input
                className="input"
                placeholder="Search across all your documents…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ border: "none", borderRadius: 0, background: "transparent", flex: 1, padding: "14px 0" }}
              />
              <button className="btn btn-primary" style={{ borderRadius: 0, padding: "14px 24px", margin: 0 }}>
                Search
              </button>
            </div>

            {/* Search mode selector */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {(["hybrid", "semantic", "keyword"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`btn btn-sm ${mode === m ? "btn-primary" : "btn-secondary"}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {m === "hybrid" ? "⚡ Hybrid" : m === "semantic" ? "🧠 Semantic" : "🔤 Keyword"}
                </button>
              ))}
            </div>
          </div>

          {/* Search tips */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
              Search Tips
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                '"exact phrase"',
                'date:2024-01',
                'type:pdf',
                'field:revenue',
                'author:John',
              ].map(tip => (
                <button
                  key={tip}
                  onClick={() => setQuery(tip)}
                  className="chip"
                  style={{ cursor: "pointer", border: "1px solid var(--border)" }}
                >
                  <code style={{ fontSize: 11 }}>{tip}</code>
                </button>
              ))}
            </div>
          </div>

          {/* Empty / placeholder results */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Results will appear here</span>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="badge badge-purple">pgvector</span>
                <span className="badge badge-blue">BM25</span>
              </div>
            </div>
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Enter a search query above</div>
              <div className="empty-sub">
                DocuMind AI uses hybrid search combining semantic vector similarity with keyword matching for best results.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}