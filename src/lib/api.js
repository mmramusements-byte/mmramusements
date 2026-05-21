import axios from 'axios';
import { useAuthStore } from '../admin/store/useAuthStore';

// Create a centralized axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    // If we're sending FormData (like for image uploads), we must NOT set Content-Type
    // Axios handles this automatically if we delete it, allowing the browser to set the multipart boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response.data; // Unwrap axios response by default to return just the JSON data
  },
  (error) => {
    if (error.response) {
      // Auto logout on 401 Unauthorized
      if (error.response.status === 401) {
        useAuthStore.getState().logout();
      }
      
      // Pass the error message from the backend if available
      const message = error.response.data?.error || error.response.data?.message || 'API Request Failed';
      return Promise.reject(new Error(message));
    }
    
    return Promise.reject(new Error('Network error or API is down'));
  }
);

export default api;
