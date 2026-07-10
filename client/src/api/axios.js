import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Centralized backend base URL
  timeout: 10000, // Disconnect if the server takes longer than 10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient;