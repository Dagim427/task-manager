import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import "./register.css";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { loading, error, success, registerUser } = useAuth();
  const { name, email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSaved = await registerUser(formData);
    if (isSaved) {
      setFormData({ name: "", email: "", password: "" });
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create an Account</h2>

      {/* Clean Feedback Messages using Extracted Classes */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="form-input"
          />
        </div>

        <div className="form-group last">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Create a password"
            className="form-input"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
