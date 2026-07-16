import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Centralized backend base URL
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Read the JWT from storage
    const token = localStorage.getItem('token');
    
    // Send it in the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;