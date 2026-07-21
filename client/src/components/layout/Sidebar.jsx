import { useLocation, useNavigate, Link } from "react-router-dom";
import { C } from "../../utils/color.js";
import Logo from "../common/Logo.jsx";

export default function Sidebar({ tasks = [], onLogout, isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic task counts calculation
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "Done").length;
  const importantCount = tasks.filter((t) => t.important).length;

  const NAV_ITEMS = [
    {
      label: "Dashboard",
      path: "/dashboard",
      count: null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      label: "My Tasks",
      path: "/my-tasks",
      count: totalCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      label: "Completed",
      path: "/completed",
      count: completedCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Important",
      path: "/important",
      count: importantCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  const ACCOUNT_ITEMS = [
    {
      label: "Profile",
      path: "/profile",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: "Settings",
      path: "/settings",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside
        className={`sidebar-drawer ${isOpen ? "open" : ""}`}
        style={{
          width: 240,
          height: "100vh",
          position: "sticky",
          top: 0,
          backgroundColor: C.white,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          zIndex: 1000,
        }}
      >
        {/* Header: Logo & Mobile Close Button */}
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Logo size="sm" />

          <button
            className="mobile-close-btn"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: C.mid,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Main Navigation */}
        <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`sidebar-nav-link ${active ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 8,
                  backgroundColor: active ? C.primaryLight || "#EEF2FF" : "transparent",
                  color: active ? C.primary : C.mid,
                  fontWeight: active ? 600 : 500,
                  textDecoration: "none",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>

                {item.count !== null && item.count !== undefined && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 12,
                      backgroundColor: active ? C.primary : C.bg,
                      color: active ? C.white : C.mid,
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}

          <div
            style={{
              height: 1,
              backgroundColor: C.border,
              margin: "16px 14px 12px",
            }}
          />

          <div style={{ fontSize: 11, fontWeight: 700, color: C.light, padding: "0 14px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Account
          </div>

          {/* Account Navigation */}
          {ACCOUNT_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`sidebar-nav-link ${active ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 8,
                  backgroundColor: active ? C.primaryLight || "#EEF2FF" : "transparent",
                  color: active ? C.primary : C.mid,
                  fontWeight: active ? 600 : 500,
                  textDecoration: "none",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button Section */}
        <div style={{ padding: "16px 12px 24px", borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={() => {
              onClose?.();
              onLogout ? onLogout() : navigate("/login");
            }}
            className="sidebar-logout-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "transparent",
              color: C.danger,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}