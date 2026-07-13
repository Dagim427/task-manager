import { useState } from "react";
import apiClient from "../api/axios";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  return {
    loading,
    error,
    success,
    registerUser,
    setError,
    setSuccess,
  };
};
