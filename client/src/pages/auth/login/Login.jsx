import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/Authcontext.jsx";

import "./login.css";
import LeftPanel from "./LeftPanel.jsx";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error, success, loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await loginUser(formData);

    // Professionals navigate immediately upon success
    if (isSuccess) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="split-layout">
      {/* <!-- LEFT PANEL --> */}
      <LeftPanel />

      {/* <!-- RIGHT PANEL --> */}
      <div class="right-panel">
        <div class="login-wrapper">
          <h2>Welcome back</h2>
          <p>Sign in to your account to continue</p>

          {/* Feedback banners based on Auth state */}
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
              <span>Redirecting...</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* <!-- Email --> */}
            <div class="form-group">
              <div className="form-header">
                <label for="email">Email address</label>
              </div>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autocomplete="email"
                  className="form-control"
                />
              </div>
            </div>

            {/* <!-- Password --> */}
            <div class="form-group">
              <div className="form-header">
                <label for="password">Password</label>
                {/* Inline Forgot Password Link */}
                <Link
                  to="/forgot-password"
                  className={`forgot-link ${loading ? "disabled-link" : ""}`}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  className="form-control"
                />
                <svg
                  class="eye-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="remember" />
              <label for="remember">Remember me for 30 days</label>
            </div>

            {/* Dynamic Button UI */}
            <button type="submit" className="btn-primary" disabled={loading}>
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
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div class="signup-text">
              Don't have an account? <Link to="/register">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
