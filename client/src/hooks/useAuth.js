import { useState } from "react";
import apiClient from "../api/axios";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- REGISTER USER ---
  const registerUser = async (formData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    // Frontend validation check
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return false; // Return false so the component knows it failed
    }

    try {
      const response = await apiClient.post("/auth/register", formData);
      if (response.data.success) {
        setSuccess("Registration successfully! you can login");
        return true;
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "An error occurred during registration",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN USER ---

  const loginUser = async (formData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    // Frontend validation check
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return false; // Return false so the component knows it failed
    }

    try {
      const response = await apiClient.post("/auth/login", formData);
      if (response.data.success) {
        // Save the JWT and User to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        
        setSuccess("Logged in successfully");
        return true;
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "An error occurred during login",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    registerUser,
    loginUser,
    setError,
    setSuccess,
  };
};
