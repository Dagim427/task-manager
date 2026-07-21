import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../../utils/color.js";

export default function Header() {
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      style={{
        backgroundColor: C.white,
        borderBottom: `1px solid ${C.border}`,
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.dark }}>Good morning, Alex 👋</div>
        <div style={{ fontSize: 12, color: C.mid, marginTop: 1 }}>Monday, July 21, 2026</div>
      </div>
      <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
        <svg
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.light}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          placeholder="Search tasks…"
          style={{
            width: "100%",
            padding: "9px 12px 9px 36px",
            border: `1.5px solid ${C.border}`,
            borderRadius: 8,
            fontSize: 13,
            color: C.dark,
            backgroundColor: C.bg,
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = C.primary)}
          onBlur={(e) => (e.target.style.borderColor = C.border)}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              border: `1.5px solid ${C.border}`,
              backgroundColor: C.white,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: C.danger,
              border: `2px solid ${C.white}`,
            }}
          />
          {notifOpen && (
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
              <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 12 }}>Notifications</div>
              {[
                { text: "Login bug is due in 4 days", time: "2h ago", color: C.danger },
                { text: "API docs moved to Review", time: "5h ago", color: C.warning },
                { text: "Dashboard mockups marked done", time: "1d ago", color: C.success },
              ].map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: n.color, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, color: C.dark }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: C.light, marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => navigate("/profile")}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: `linear-gradient(135deg, ${C.primary} 0%, #7B7FF0 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          AJ
        </button>
      </div>
    </header>
  );
}