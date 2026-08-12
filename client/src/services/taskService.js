import apiClient from "../api/axios.js";

export const getTaskApi = async () => {
  const response = await apiClient.get("/tasks");

  return response.data;
};

export const createTaskApi = async(taskData) => {
  const response = await apiClient.post("/tasks", taskData)
  
  return response.data;
}
