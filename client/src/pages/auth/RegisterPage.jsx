import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function RegisterPage() {
  const {
    register,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    isAuthLoading,
    navigate,
  ]);

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

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      nextErrors.name = "Name is required.";
    } else if (name.length < 2) {
      nextErrors.name =
        "Name must be at least 2 characters.";
    } else if (name.length > 100) {
      nextErrors.name =
        "Name must not exceed 100 characters.";
    }

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password =
        "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      form.password !==
      form.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
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
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      const responseData =
        error.response?.data;

      if (
        responseData?.code ===
        "VALIDATION_ERROR"
      ) {
        const validationErrors = {};

        for (
          const detail of
          responseData.details ?? []
        ) {
          validationErrors[detail.field] =
            detail.message;
        }

        setErrors(validationErrors);
      } else {
        setServerError(
          responseData?.message ??
            "Unable to create your account. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section
        className="auth-card"
        aria-labelledby="register-title"
      >
        <header className="auth-header">
          <h1 id="register-title">
            Create your account
          </h1>

          <p>
            Start managing your tasks today.
          </p>
        </header>

        {serverError && (
          <div
            className="form-error"
            role="alert"
          >
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-field">
            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(
                errors.name,
              )}
              aria-describedby={
                errors.name
                  ? "name-error"
                  : undefined
              }
              disabled={isSubmitting}
            />

            {errors.name && (
              <p
                id="name-error"
                className="field-error"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(
                errors.email,
              )}
              aria-describedby={
                errors.email
                  ? "register-email-error"
                  : undefined
              }
              disabled={isSubmitting}
            />

            {errors.email && (
              <p
                id="register-email-error"
                className="field-error"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(
                errors.password,
              )}
              aria-describedby={
                errors.password
                  ? "register-password-error"
                  : undefined
              }
              disabled={isSubmitting}
            />

            {errors.password && (
              <p
                id="register-password-error"
                className="field-error"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="confirm-password">
              Confirm password
            </label>

            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(
                errors.confirmPassword,
              )}
              aria-describedby={
                errors.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
              disabled={isSubmitting}
            />

            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="field-error"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;