"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    label: "Main",
    items: [
      { href: "/dashboard",             icon: "⬡", label: "Dashboard" },
      { href: "/workspace/documents",   icon: "📄", label: "Documents" },
      { href: "/workspace/chat",        icon: "💬", label: "AI Chat",    badge: "RAG" },
      { href: "/workspace/search",      icon: "🔍", label: "Search" },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/workspace/verification", icon: "✅", label: "Verification" },
      { href: "/workspace/evaluations",  icon: "📊", label: "Evaluations" },
      { href: "/workspace/settings",     icon: "⚙️",  label: "Settings" },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/admin/users",  icon: "👥", label: "Users" },
      { href: "/admin/audit",  icon: "🔐", label: "Audit Log" },
      { href: "/admin/system", icon: "🖥", label: "System" },
    ],
  },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🧠</div>
        <div>
          <div className="sidebar-logo-text">DocuMind</div>
          <div className="sidebar-logo-sub">AI Platform</div>
        </div>
      </div>

      {/* Nav sections */}
      {NAV.map((section) => (
        <div className="sidebar-section" key={section.label}>
          <div className="sidebar-section-label">{section.label}</div>
          {section.items.map((item) => {
            const active = path === item.href || path.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item${active ? " active" : ""}`}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="sidebar-item-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">S</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Swayam</div>
            <div className="sidebar-user-role">Admin</div>
          </div>
          <span style={{ color: "var(--text-muted)", fontSize: 16 }}>↗</span>
        </div>
      </div>
    </aside>
  );
}
