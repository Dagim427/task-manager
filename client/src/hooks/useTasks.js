// src/hooks/useTask.js
import { useState, useCallback } from "react";
import { getTaskApi, createTaskApi } from "../services/taskServices.js";

export const useTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const clearError = () => setError(null);

  // Fetch and format tasks for the Dashboard
  const getTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTaskApi();

      if (response.success && Array.isArray(response.data)) {
        // Map MySQL snake_case & lowercase fields to UI camelCase & Capitalized fields
        const formattedTasks = response.data.map((t) => ({
          ...t,
          dueDate: t.due_date ? t.due_date.split("T")[0] : "",
          important: Boolean(t.is_important),
          // Capitalize 'low' -> 'Low', 'to do' -> 'To Do' for badges & filters
          priority: t.priority
            ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1)
            : "Medium",
          status: t.status
            ? t.status
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")
            : "To Do",
        }));

        setTasks(formattedTasks);
      }
      return response;
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while fetching tasks"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Create task
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
        priority: taskData.priority ? taskData.priority.toLowerCase() : "medium",
        status: taskData.status ? taskData.status.toLowerCase() : "to do",
        due_date: taskData.dueDate,
        is_important: taskData.important || false,
      };

      await createTaskApi(formattedData);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 1500);

      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during create task"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    setTasks,
    getTasks,
    createTask,
    loading,
    error,
    success,
    clearError,
  };
};