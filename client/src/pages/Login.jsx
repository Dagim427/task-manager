import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C } from "../utils/color";
import Label from "../components/common/Label";
import Input from "../components/common/Input";
import Logo from "../components/common/Logo";
import Btn from "../components/common/Btn";

const EyeIcon = ({ open }) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const { loading, error, success, loginUser,clearMessages } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    // If there's an error on screen, clear it as soon as the user starts typing
  if (error) clearMessages(); 
  
  setFormData((prev) => ({ ...prev, [field]: value }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await loginUser({ ...formData, remember });
    if (isSuccess) {
      setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1500);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Decorative Banner */}
      <div
        className="hidden-mobile"
        style={{
          flex: 1,
          background: `linear-gradient(145deg, #4F52C8 0%, ${C.primary} 45%, #7B7FF0 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 300,
            height: 300,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          fill="none"
          style={{ marginBottom: 36 }}
        >
          <rect
            x="40"
            y="60"
            width="200"
            height="56"
            rx="12"
            fill="rgba(255,255,255,0.15)"
          />
          <rect
            x="56"
            y="76"
            width="20"
            height="20"
            rx="5"
            fill="rgba(255,255,255,0.5)"
          />
          <rect
            x="86"
            y="78"
            width="100"
            height="8"
            rx="4"
            fill="rgba(255,255,255,0.6)"
          />
          <rect
            x="86"
            y="92"
            width="60"
            height="6"
            rx="3"
            fill="rgba(255,255,255,0.35)"
          />
          <circle cx="208" cy="86" r="10" fill="rgba(16,185,129,0.7)" />
          <path
            d="M203 86l3 3 6-6"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="40"
            y="128"
            width="200"
            height="56"
            rx="12"
            fill="rgba(255,255,255,0.2)"
          />
          <rect
            x="56"
            y="144"
            width="20"
            height="20"
            rx="5"
            fill="rgba(255,255,255,0.5)"
          />
          <rect
            x="86"
            y="146"
            width="120"
            height="8"
            rx="4"
            fill="rgba(255,255,255,0.7)"
          />
          <rect
            x="86"
            y="160"
            width="80"
            height="6"
            rx="3"
            fill="rgba(255,255,255,0.4)"
          />
          <circle cx="208" cy="154" r="10" fill="rgba(245,158,11,0.8)" />
          <rect
            x="40"
            y="196"
            width="200"
            height="56"
            rx="12"
            fill="rgba(255,255,255,0.1)"
          />
          <rect
            x="56"
            y="212"
            width="20"
            height="20"
            rx="5"
            fill="rgba(255,255,255,0.4)"
          />
          <rect
            x="86"
            y="214"
            width="90"
            height="8"
            rx="4"
            fill="rgba(255,255,255,0.5)"
          />
          <rect
            x="86"
            y="228"
            width="50"
            height="6"
            rx="3"
            fill="rgba(255,255,255,0.25)"
          />
          <circle cx="208" cy="222" r="10" fill="rgba(239,68,68,0.7)" />
        </svg>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Stay on top of your tasks
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            maxWidth: 300,
            lineHeight: 1.6,
          }}
        >
          Organize your work, prioritize what matters, and get things done — all
          in one place.
        </p>
      </div>

      {/* Right Form Container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 48px",
          boxSizing: "border-box",
          backgroundColor: C.white,
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ marginBottom: 32 }}>
            <Logo />
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: C.dark,
              marginBottom: 6,
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: C.mid, marginBottom: 28 }}>
            Sign in to your account to continue
          </p>

          {/* Feedback Banners */}
          {error && (
            <div className="alert alert-error">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{success}</span>
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <Label>Email address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(val) => handleChange("email", val)}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <label style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: 12,
                    color: C.primary,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(val) => handleChange("password", val)}
                suffix={
                  <span onClick={() => setShowPass(!showPass)}>
                    <EyeIcon open={showPass} />
                  </span>
                }
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                id="rem"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{
                  width: 15,
                  height: 15,
                  accentColor: C.primary,
                  cursor: "pointer",
                }}
              />
              <label
                htmlFor="rem"
                style={{ fontSize: 13, color: C.mid, cursor: "pointer" }}
              >
                Remember me for 30 days
              </label>
            </div>

            <Btn full type="submit" disable={loading}>
              {loading ? (
                <span className="spinner-container">
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle
                      className="path"
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      strokeWidth="3"
                    ></circle>
                  </svg>
                  creating account
                </span>
              ) : "Sign in"}
            </Btn>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
              <span style={{ fontSize: 12, color: C.light, fontWeight: 500 }}>
                OR
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "10px 20px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 8,
                backgroundColor: C.white,
                fontSize: 14,
                fontWeight: 500,
                color: C.dark,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </form>
          <p
            style={{
              marginTop: 24,
              fontSize: 13,
              color: C.mid,
              textAlign: "center",
            }}
          >
            {"Don't have an account? "}
            <Link
              to="/register"
              style={{
                color: C.primary,
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
