"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useState } from "react";

const DEMO_MESSAGES = [
  {
    role: "ai",
    text: "Hello! I'm DocuMind AI, your intelligent document assistant. Upload documents to your workspace and I'll help you extract insights, answer questions, and find specific information using hybrid RAG search.\n\nWhat would you like to explore today?",
    citations: [],
  },
];

export default function ChatPage() {
  const [messages] = useState(DEMO_MESSAGES);
  const [input, setInput] = useState("");

  const suggestions = [
    "Summarize all uploaded documents",
    "Find key financial figures",
    "List action items from meeting notes",
    "Compare information across documents",
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content" style={{ overflow: "hidden" }}>
        <Header title="AI Chat" subtitle="RAG-powered document Q&A" />
        <div className="chat-layout">
          {/* Conversation sidebar */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                + New Conversation
              </button>
            </div>
            <div className="chat-list">
              <div className="chat-item active">
                <div className="chat-item-title">Welcome Chat</div>
                <div className="chat-item-time">Just now</div>
              </div>
              <div style={{ padding: "32px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 28, opacity: 0.3, marginBottom: 8 }}>💬</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Start a conversation to see your chat history here</div>
              </div>
            </div>
          </div>

          {/* Main chat */}
          <div className="chat-main">
            {/* Model selector bar */}
            <div style={{
              padding: "10px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: 12,
              background: "var(--bg-surface)",
              fontSize: 12,
            }}>
              <span style={{ color: "var(--text-muted)" }}>Model:</span>
              <span className="badge badge-purple">Gemini 2.5 Flash</span>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <span style={{ color: "var(--text-muted)" }}>Search:</span>
              <span className="badge badge-blue">Hybrid RAG</span>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <span style={{ color: "var(--text-muted)" }}>Documents:</span>
              <span className="badge badge-yellow">0 indexed</span>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`message ${m.role === "ai" ? "ai" : "user"} fade-in`}>
                  <div className="message-avatar">
                    {m.role === "ai" ? "🧠" : "S"}
                  </div>
                  <div>
                    <div className="message-bubble" style={{ whiteSpace: "pre-wrap" }}>
                      {m.text}
                    </div>
                    {m.citations.length > 0 && (
                      <div className="message-citation">
                        📚 Sources: {m.citations.map((c, ci) => <span key={ci}>[{c}]</span>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Suggestions */}
              <div style={{ maxWidth: 620 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, fontWeight: 600 }}>
                  💡 Try asking:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--r-md)",
                        padding: "8px 14px",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.4)";
                        (e.currentTarget as HTMLElement).style.color = "var(--brand-accent)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="chat-input-area">
              <div className="chat-input-wrap">
                <textarea
                  placeholder="Ask anything about your documents…"
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); } }}
                />
                <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                  <button className="btn btn-ghost btn-icon btn-sm" title="Attach document">📎</button>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ padding: "8px 14px" }}
                    disabled={!input.trim()}
                  >
                    ↑ Send
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "var(--text-muted)", padding: "0 4px" }}>
                <span>⏎ to send · Shift+⏎ for new line</span>
                <span style={{ marginLeft: "auto" }}>DocuMind AI may make mistakes. Verify important information.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}