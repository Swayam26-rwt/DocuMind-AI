import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DocumentsPage() {
  const docTypes = [
    { icon: "📄", label: "PDF", color: "#ef4444" },
    { icon: "📝", label: "DOCX", color: "#3b82f6" },
    { icon: "📊", label: "XLSX", color: "#10b981" },
    { icon: "📑", label: "PPTX", color: "#f59e0b" },
    { icon: "🖼", label: "Image+OCR", color: "#8b5cf6" },
    { icon: "📃", label: "TXT/MD", color: "#6366f1" },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header
          title="Documents"
          subtitle="Manage & process your files"
          actions={
            <button className="btn btn-primary btn-sm">
              📤 Upload Files
            </button>
          }
        />
        <div className="page-body fade-in">
          {/* Upload dropzone */}
          <div className="dropzone" style={{ marginBottom: 28 }}>
            <div className="dropzone-icon">📤</div>
            <div className="dropzone-text">Drop documents here to upload</div>
            <div className="dropzone-sub" style={{ marginBottom: 16 }}>
              Supports PDF, DOCX, XLSX, PPTX, images and more
            </div>
            <button className="btn btn-primary btn-sm">Browse Files</button>
          </div>

          {/* Supported formats */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
              Supported Formats
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {docTypes.map(t => (
                <div key={t.label} className="chip" style={{ gap: 6 }}>
                  <span>{t.icon}</span>
                  <span style={{ color: t.color, fontWeight: 600 }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div className="tabs">
              <button className="tab active">All Documents</button>
              <button className="tab">Processing</button>
              <button className="tab">Verified</button>
              <button className="tab">Failed</button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="input" placeholder="Search documents…" style={{ width: 220 }} />
              <button className="btn btn-ghost btn-sm">⚙ Filter</button>
            </div>
          </div>

          {/* Empty state */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, background: "var(--bg-surface)" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>0 documents</span>
            </div>
            <div className="empty-state" style={{ padding: "64px 24px" }}>
              <div className="empty-icon">📭</div>
              <div className="empty-title">No documents yet</div>
              <div className="empty-sub">
                Upload your first document to start extracting knowledge with AI. Supports PDF, DOCX, PPTX, XLSX, images and more.
              </div>
              <button className="btn btn-primary" style={{ marginTop: 8 }}>
                📤 Upload Your First Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}