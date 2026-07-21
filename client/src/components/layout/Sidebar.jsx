import { useLocation, useNavigate, Link } from "react-router-dom";
import { C } from "../../utils/color.js";
import Logo from "../common/Logo.jsx";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "My Tasks",
    path: "/my-tasks",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    label: "Completed",
    path: "/completed",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    label: "Important",
    path: "/important",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" opacity="0.85" />
      </svg>
    ),
  },
];

const NAV_BOTTOM = [
  {
    label: "Profile",
    path: "/profile",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Settings",
    path: "/settings",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function Sidebar({ tasks = [], onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const counts = {
    "/my-tasks": tasks.filter((t) => t.status !== "Done").length,
    "/completed": tasks.filter((t) => t.status === "Done").length,
    "/important": tasks.filter((t) => t.important).length,
  };

  const NavBtn = ({ label, path, icon }) => {
    const active = location.pathname === path;
    const count = counts[path];

    return (
      <Link
        to={path}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "9px 12px",
          borderRadius: 8,
          border: "none",
          backgroundColor: active ? C.primaryLight : "transparent",
          color: active ? C.primary : C.mid,
          fontFamily: "inherit",
          fontSize: 13.5,
          fontWeight: active ? 600 : 400,
          textDecoration: "none",
          boxSizing: "border-box",
          marginBottom: 2,
          transition: "all 0.15s",
        }}
      >
        {icon}
        <span style={{ flex: 1 }}>{label}</span>
        {count !== undefined && count > 0 && (
          <span
            style={{
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              padding: "0 6px",
              backgroundColor: active ? C.primary : C.border,
              color: active ? "#fff" : C.mid,
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        backgroundColor: C.white,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "22px 20px 16px" }}>
        <Logo size="sm" />
      </div>
      <div style={{ padding: "4px 12px", marginBottom: 4 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.light,
            letterSpacing: "0.08em",
            padding: "4px 12px",
            textTransform: "uppercase",
          }}
        >
          Navigation
        </div>
      </div>
      <nav style={{ flex: 1, padding: "0 12px" }}>
        {NAV_ITEMS.map((item) => (
          <NavBtn key={item.path} {...item} />
        ))}
        <div style={{ height: 1, backgroundColor: C.border, margin: "12px 0" }} />
        {NAV_BOTTOM.map((item) => (
          <NavBtn key={item.path} {...item} />
        ))}
      </nav>
      <div style={{ padding: "16px 12px 24px" }}>
        <button
          onClick={onLogout || (() => navigate("/login"))}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "9px 12px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "transparent",
            color: C.danger,
            fontFamily: "inherit",
            fontSize: 13.5,
            fontWeight: 500,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}