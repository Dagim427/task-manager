import apiClient from "../api/axios.js";

export const getTasks = async () => {
  const response = await apiClient.get("/tasks");

  return response.data;
};

export const createTask = async(taskData) => {
  const response = await apiClient.post("/tasks", taskData)
  
  return response.data;
}
