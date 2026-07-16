import axios from 'axios';
import { storage } from '../utils/storage'; // Import the utility

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Clean, abstracted token retrieval
    const token = storage.getToken(); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;