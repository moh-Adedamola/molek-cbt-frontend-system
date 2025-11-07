import axios from 'axios';
import { getToken, removeToken } from '../utils/storage';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug log
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token,
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', {
      status: response.status,
      url: response.config.url,
    });
    
    return response.data; // Return only data
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message,
    });
    
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Only redirect if it's not the /me endpoint
          if (!error.config.url.includes('/auth/me')) {
            removeToken();
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API Error:', data?.message || 'Something went wrong');
      }

      return Promise.reject(data);
    } else if (error.request) {
      console.error('Network error - No response from server');
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default apiClient;