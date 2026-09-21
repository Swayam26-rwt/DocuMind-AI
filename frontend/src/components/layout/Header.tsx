"use client";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <div className="topbar">
      <div>
        <span className="topbar-title">{title}</span>
        {subtitle && (
          <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 10 }}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Global search */}
      <div className="topbar-search" style={{ marginLeft: 24 }}>
        <span>🔍</span>
        <span>Search documents, chats…</span>
        <span style={{ marginLeft: "auto", fontSize: 11, background: "var(--bg-hover)", padding: "2px 6px", borderRadius: 4 }}>⌘K</span>
      </div>

      <div className="topbar-actions">
        {actions}
        <button className="btn btn-ghost btn-icon" title="Notifications">
          🔔
        </button>
        <button className="btn btn-ghost btn-icon" title="Help">
          ❓
        </button>
      </div>
    </div>
  );
}
