import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import { storage } from "../utils/storage";

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Starts true to check session on load
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // --- AUTO-CLEAR ALERTS AFTER 5 SECONDS ---
  // Whenever an error is set, it will automatically clear 5 seconds later
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer); // Cleanup old timer if a new error drops in
    }
  }, [error]);

  // Whenever a success state is set, it will automatically clear 5 seconds later
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // --- LOGOUT USER ---
  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // --- CHECK SESSION ON INITIAL MOUNT ---
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = storage.getToken();
      if (!token) {
        setLoading(false); // No token means no user, stop loading
        return;
      }

      try {
        // apiClient automatically attaches the token via the interceptor
        const response = await apiClient.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error("Session invalid:", err);
        // If the token is expired or invalid, log them out automatically
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [logout]);

  // --- REGISTER USER ---
  const registerUser = async (formData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return false; 
    }

    try {
      const response = await apiClient.post("/auth/register", formData);
      if (response.data.success) {
        setSuccess("Registration successfully! You can login.");
        return true;
      }
      return false;
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during registration");
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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return false; 
    }

    try {
      const response = await apiClient.post("/auth/login", formData);
      if (response.data.success) {
        // Use the centralized storage utility instead of direct localStorage
        storage.setToken(response.data.token);
        storage.setUser(response.data.user);
        
        setUser(response.data.user); // Update global state instantly
        setSuccess("Logged in successfully");
        return true;
      }
      return false;
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        success,
        registerUser,
        loginUser,
        logout,
        setError,
        setSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption across the app
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};