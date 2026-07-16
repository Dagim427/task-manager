import { useState, useEffect, useCallback } from "react";
import apiClient from "../api/axios.js";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await apiClient.get("/tasks");
      
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setError("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title) => {
    try {
      setError(null);
      const response = await apiClient.post("/tasks", { title });
      
      if (response.data.success) {
        // Professional update: Use previous state to prevent stale closures
        setTasks((prevTasks) => [response.data.data, ...prevTasks]);
      }
    } catch (err) {
      console.error("Add task error:", err);
      setError("Failed to add task.");
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      setError(null);
      const response = await apiClient.put(`/tasks/${id}`, {
        completed: !currentStatus,
      });
      
      if (response.data.success) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, completed: !currentStatus } : task
          )
        );
      }
    } catch (err) {
      console.error("Toggle task error:", err);
      setError("Failed to update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      setError(null);
      const response = await apiClient.delete(`/tasks/${id}`);
      
      if (response.data.success) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      }
    } catch (err) {
      console.error("Delete task error:", err);
      setError("Failed to delete task.");
    }
  };

  return { tasks, loading, error, addTask, toggleTask, deleteTask };
};