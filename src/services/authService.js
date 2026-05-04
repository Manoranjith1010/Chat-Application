import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/auth';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token to requests
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(credentials) {
    const response = await axiosInstance.post('/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await axiosInstance.post('/register', userData);
    return response.data;
  },

  async validateToken(token) {
    const response = await axiosInstance.get('/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
