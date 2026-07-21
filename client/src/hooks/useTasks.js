import { useState } from "react";
import apiClient from "../api/axios";

export const useTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const clearError = () => setError(null);

  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!taskData.title || taskData.title.trim() === "") {
      setError("please provide title for task");
      setLoading(false);
      return false;
    }

    try {
      const formattedData = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority.toLowerCase(),
        status: taskData.status.toLowerCase(),
        due_date: taskData.dueDate,
        is_important: taskData.important,
      };

      await apiClient.post("/tasks", formattedData);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 1500);

      return true
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during create task",
      );
      return false
    } finally {
      setLoading(false);
    }
  };

  return { createTask, loading, error, success, clearError };
};
