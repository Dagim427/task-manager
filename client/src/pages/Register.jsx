import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { C } from "../utils/color.js";
import Logo from "../components/common/Logo.jsx";
import Label from "../components/common/Label.jsx";
import Input from "../components/common/Input.jsx";
import Btn from "../components/common/Btn.jsx";

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

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");

  const { loading, error, success, registerUser, clearMessages } = useAuth();
  const navigate = useNavigate();
  const { name, email, password, confirm } = formData;

  const handleChange = (field, value) => {
    if (validationError) setValidationError("");
    if (error && clearMessages) clearMessages();

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setValidationError("Passwords do not match.");
      return;
    }

    const payload = { name, email, password };
    const isSaved = await registerUser(payload);
    if (isSaved) {
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully! Please sign in." },
      });
    }
  };

  const displayError = validationError || error;
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
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
            left: -60,
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
            right: -40,
            width: 300,
            height: 300,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          fill="none"
          style={{ marginBottom: 36 }}
        >
          <circle cx="120" cy="80" r="48" fill="rgba(255,255,255,0.15)" />
          <circle cx="120" cy="80" r="34" fill="rgba(255,255,255,0.2)" />
          <circle cx="120" cy="73" r="19" fill="rgba(255,255,255,0.5)" />
          <path
            d="M87 122c0-18.2 14.8-33 33-33s33 14.8 33 33"
            fill="rgba(255,255,255,0.28)"
          />
          <rect
            x="46"
            y="158"
            width="148"
            height="10"
            rx="5"
            fill="rgba(255,255,255,0.25)"
          />
          <rect
            x="66"
            y="176"
            width="108"
            height="8"
            rx="4"
            fill="rgba(255,255,255,0.18)"
          />
          <rect
            x="86"
            y="192"
            width="68"
            height="6"
            rx="3"
            fill="rgba(255,255,255,0.12)"
          />
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
          Join thousands of users
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
          Create your free account and start managing your tasks smarter today.
        </p>
      </div>
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
            Create an account
          </h1>
          <p style={{ fontSize: 14, color: C.mid, marginBottom: 28 }}>
            Start your journey with TaskFlow today
          </p>
          {displayError && (
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
              <span>{displayError}</span>
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
              <Label>Full Name</Label>
              <Input
                placeholder="Alex Johnson"
                value={formData.name}
                onChange={(val) => handleChange("name", val)}
              />
            </div>
            <div>
              <Label>Email address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(val) => {
                  handleChange("email", val);
                }}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type={showPass ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(val) => handleChange("password", val)}
                suffix={
                  <span onClick={() => setShowPass(!showPass)}>
                    <EyeIcon open={showPass} />
                  </span>
                }
              />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your password"
                value={formData.confirm}
                onChange={(val) => handleChange("confirm", val)}
                suffix={
                  <span onClick={() => setShowConfirm(!showConfirm)}>
                    <EyeIcon open={showConfirm} />
                  </span>
                }
              />
            </div>
            <Btn full type="submit" disabled={loading}>
              {loading ? (
                <span className="spinner-container">
                  <svg
                    className="spinner"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                  >
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
              ) : (
                "Create Account"
              )}
            </Btn>
          </form>
          <p
            style={{
              marginTop: 24,
              fontSize: 13,
              color: C.mid,
              textAlign: "center",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
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
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
