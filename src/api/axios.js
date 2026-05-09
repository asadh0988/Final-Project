// Axios instance with interceptors for auth, error handling, and logging
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor for auth token and logging
instance.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('token')) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    }
    if (import.meta.env.DEV) {
      console.log('Request:', config);
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Request error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
instance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('Response:', response);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Response error:', error);
    }
    if (error.response && [401, 403, 500].includes(error.response.status)) {
      // Handle global errors (show toast, redirect, etc.)
    }
    return Promise.reject(error);
  }
);

export default instance;
