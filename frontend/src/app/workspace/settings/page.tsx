import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function SettingsPage() {
  const sections = [
    {
      title: "AI Configuration",
      icon: "🤖",
      items: [
        { label: "Gemini Model", value: "gemini-2.5-flash", type: "select", options: ["gemini-2.5-flash", "gemini-2.5-pro"] },
        { label: "Embedding Model", value: "gemini-embedding-001", type: "select", options: ["gemini-embedding-001"] },
        { label: "Gemini API Key", value: "••••••••••••", type: "password" },
        { label: "Temperature", value: "0.7", type: "number" },
      ],
    },
    {
      title: "RAG Settings",
      icon: "🔍",
      items: [
        { label: "Chunk Size (tokens)", value: "512", type: "number" },
        { label: "Chunk Overlap", value: "50", type: "number" },
        { label: "Top-K Results", value: "5", type: "number" },
        { label: "Search Mode", value: "hybrid", type: "select", options: ["hybrid", "semantic", "keyword"] },
      ],
    },
    {
      title: "Storage",
      icon: "🗄",
      items: [
        { label: "S3 Endpoint", value: "http://localhost:9000", type: "text" },
        { label: "S3 Bucket", value: "documind", type: "text" },
        { label: "Max File Size (MB)", value: "100", type: "number" },
      ],
    },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header title="Settings" subtitle="Workspace configuration" />
        <div className="page-body fade-in">
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>
            {sections.map(section => (
              <div className="card" key={section.title}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 20 }}>{section.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{section.title}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {section.items.map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                      <label style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500, minWidth: 180 }}>
                        {item.label}
                      </label>
                      {item.type === "select" ? (
                        <select
                          defaultValue={item.value}
                          style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-bright)",
                            borderRadius: "var(--r-md)",
                            color: "var(--text-primary)",
                            padding: "8px 12px",
                            fontSize: 13,
                            outline: "none",
                            width: 220,
                          }}
                        >
                          {item.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          className="input"
                          type={item.type}
                          defaultValue={item.value}
                          style={{ maxWidth: 220 }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary">Save Changes</button>
              <button className="btn btn-ghost">Reset to Defaults</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}