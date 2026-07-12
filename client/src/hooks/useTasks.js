import { useState, useEffect } from "react";
import apiClient from "../api/axios.js";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch all tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/tasks");
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Add a new task
  const addTask = async (title) => {
    try {
      const response = await apiClient.post("/tasks", { title });
      if (response.data.success) {
        setTasks([response.data.data, ...tasks]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add task.");
    }
  };

  // 3. Toggle task completion
  const toggleTask = async (id, currentStatus) => {
    try {
      const response = await apiClient.put(`/tasks/${id}`, {
        completed: !currentStatus,
      });
      if (response.data.success) {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: !currentStatus } : task,
          ),
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update task.");
    }
  };

  // 4. Delete a task
  const deleteTask = async (id) => {
    try {
      const response = await apiClient.delete(`/tasks/${id}`);
      if (response.data.success) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete task.");
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
  };
};
