import { api } from "./api";

export const getTasks = async () => {
  const response = await api.get("/tasks");

  return response.data;
};

export const getTask = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);

  return response.data;
};

export const createTask = async (data) => {
  const response = await api.post("/tasks", data);

  return response.data;
};

export async function updateTask(taskId, data) {
  const response = await api.put(`/tasks/${taskId}`, data);

  return response.data;
}

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);

  return response.data;
};
