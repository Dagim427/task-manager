import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "task_management_access_token";

if (!API_URL) {
  throw new Error(
    "VITE_API_URL is not configured.",
  );
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);

      window.dispatchEvent(
        new Event("auth:unauthorized"),
      );
    }

    return Promise.reject(error);
  },
);