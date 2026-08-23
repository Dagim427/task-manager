import { api } from "./api";

export const getTasks = async ({
  page = 1,
  limit = 20,
  search = "",
  status = "",
  priority = "",
} = {}) => {
  const response = await api.get("/tasks", {
    params: {
      page,
      limit,
      ...(search && { search }),
      ...(status && { status }),
      ...(priority && { priority }),
    },
  });

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

export const updateTask = async (taskId, data) => {
  const response = await api.patch(`/tasks/${taskId}`, data);

  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);

  return response.data;
};

export const getTaskStats = async () => {
  const response = await api.get("/tasks/stats");

  return response.data.data.stats;
};
