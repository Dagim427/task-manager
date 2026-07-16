import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate, Link } from "react-router-dom";
import "../register/register.css";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error, success, loginUser } = useAuth();
  const { email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await loginUser(formData);
    if (isSuccess) {
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login Account</h2>
    
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="form-input"
            required
          />
        </div>

        <div className="form-group last">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="form-input"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p
        className="auth-footer"
        style={{ marginTop: "1rem", textAlign: "center", color: "#9ca3af" }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{ color: "#3b82f6", textDecoration: "none" }}
        >
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
