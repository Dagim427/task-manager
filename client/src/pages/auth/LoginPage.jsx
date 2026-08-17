import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  if (isAuthLoading) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const validate = () => {
    const nextErrors = {};

    const email = form.email.trim();

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      const destination = location.state?.from?.pathname ?? "/dashboard";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.code === "VALIDATION_ERROR") {
        const validationErrors = {};

        for (const detail of responseData.details ?? []) {
          validationErrors[detail.field] = detail.message;
        }

        setErrors(validationErrors);
      } else {
        setServerError(
          responseData?.message ?? "Unable to sign in. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <header className="auth-header">
          <h1 id="login-title">Welcome back</h1>

          <p>Sign in to manage your tasks.</p>
        </header>

        {serverError && (
          <div className="form-error" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isSubmitting}
            />

            {errors.email && (
              <p id="email-error" className="field-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={isSubmitting}
            />

            {errors.password && (
              <p id="password-error" className="field-error">
                {errors.password}
              </p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
