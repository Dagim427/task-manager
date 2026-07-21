import { useState } from "react";
import { C, SH_MD } from "../utils/color.js";
import Label from "../components/common/Label.jsx";
import Input from "../components/common/Input.jsx";
import Btn from "../components/common/Btn.jsx";

export function Profile({ onLogout }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@example.com");

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.dark,
              marginBottom: 4,
            }}
          >
            Your Profile
          </h1>
          <p style={{ fontSize: 14, color: C.mid }}>
            Manage your personal information and account settings.
          </p>
        </div>
        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 14,
            padding: 28,
            boxShadow: SH_MD,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.primary} 0%, #7B7FF0 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            AJ
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.dark }}>
              {name}
            </div>
            <div style={{ fontSize: 13, color: C.mid, marginTop: 2 }}>
              {email}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: C.success,
                }}
              />
              <span style={{ fontSize: 12, color: C.success, fontWeight: 500 }}>
                Active Account
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1.5px solid ${C.border}`,
              backgroundColor: "transparent",
              fontSize: 13,
              fontWeight: 500,
              color: C.dark,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>
        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 14,
            padding: 28,
            boxShadow: SH_MD,
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 20,
            }}
          >
            Account Information
          </h2>
          {editMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <Label>Full Name</Label>
                <Input value={name} onChange={setName} />
              </div>
              <div>
                <Label>Email address</Label>
                <Input type="email" value={email} onChange={setEmail} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={() => setEditMode(false)}>Update Profile</Btn>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Full Name", value: name },
                { label: "Email Address", value: email },
                { label: "Member Since", value: "January 14, 2025" },
                { label: "Account Status", value: "Active" },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: i === 0 ? 0 : 16,
                    paddingBottom: i === arr.length - 1 ? 0 : 16,
                    borderBottom:
                      i === arr.length - 1 ? "none" : `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontSize: 13, color: C.mid }}>{label}</span>
                  <span
                    style={{ fontSize: 13, fontWeight: 500, color: C.dark }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 14,
            padding: 28,
            boxShadow: SH_MD,
          }}
        >
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: C.dark,
              marginBottom: 20,
            }}
          >
            Account Actions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 8,
                border: `1.5px solid ${C.border}`,
                backgroundColor: "transparent",
                fontSize: 13,
                fontWeight: 500,
                color: C.dark,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Change Password
            </button>
            <button
              onClick={onLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 8,
                border: "1.5px solid #FECACA",
                backgroundColor: "#FEF2F2",
                fontSize: 13,
                fontWeight: 500,
                color: C.danger,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.danger}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
