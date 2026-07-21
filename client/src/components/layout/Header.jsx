import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { C } from "../../utils/color.js";

export default function Header({ userName = "Alex", onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get("q") || "";

  const handleSearchChange = (e) => {
    const query = e.target.value;
    if (query) {
      setSearchParams({ q: query });
    } else {
      searchParams.delete("q");
      setSearchParams(searchParams);
    }
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header
      style={{
        backgroundColor: C.white,
        borderBottom: `1px solid ${C.border}`,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Mobile Hamburger Button */}
      <button
        className="mobile-menu-btn"
        onClick={onMenuClick}
        style={{
          display: "none",
          width: 36,
          height: 36,
          borderRadius: 8,
          border: `1.5px solid ${C.border}`,
          backgroundColor: C.white,
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.dark}
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Greeting Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.dark,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Hi, {userName} 👋
        </div>
        <div style={{ fontSize: 11, color: C.mid }}>{todayFormatted}</div>
      </div>

      {/* Search Input */}
      <div
        className="search-container"
        style={{ position: "relative", flex: 1, maxWidth: 280 }}
      >
        <input
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tasks…"
          style={{
            width: "100%",
            padding: "8px 12px 8px 32px",
            border: `1.5px solid ${C.border}`,
            borderRadius: 8,
            fontSize: 13,
            color: C.dark,
            backgroundColor: C.bg,
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
        <svg
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.light}
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Actions: Notifications & Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Notification Bell Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: `1.5px solid ${C.border}`,
              backgroundColor: C.white,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.mid}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* Unread Indicator Dot */}
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: C.danger,
              border: `2px solid ${C.white}`,
            }}
          />

          {/* Notification Menu Modal */}
          {notifOpen && (
            <>
              {/* Invisible Click-Outside Backdrop */}
              <div
                onClick={() => setNotifOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 90 }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 44,
                  right: 0,
                  width: 280,
                  backgroundColor: C.white,
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  border: `1px solid ${C.border}`,
                  zIndex: 100,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.dark,
                    marginBottom: 12,
                  }}
                >
                  Notifications
                </div>
                {[
                  {
                    text: "Login bug is due in 4 days",
                    time: "2h ago",
                    color: C.danger,
                  },
                  {
                    text: "API docs moved to Review",
                    time: "5h ago",
                    color: C.warning,
                  },
                  {
                    text: "Dashboard mockups marked done",
                    time: "1d ago",
                    color: C.success,
                  },
                ].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "8px 0",
                      borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: n.color,
                        marginTop: 5,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 12, color: C.dark }}>
                        {n.text}
                      </div>
                      <div
                        style={{ fontSize: 11, color: C.light, marginTop: 2 }}
                      >
                        {n.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar */}
        <button
          onClick={() => navigate("/profile")}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: `linear-gradient(135deg, ${C.primary} 0%, #7B7FF0 100%)`,
            color: "#fff",
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          AJ
        </button>
      </div>
    </header>
  );
}
