import apiClient from '../client';
import { AUTH_ENDPOINTS } from '../endpoints';

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
    return response;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    return response;
  },

  // Get current user
  me: async () => {
    const response = await apiClient.get(AUTH_ENDPOINTS.ME);
    return response;
  },

  // Change password
  changePassword: async (data) => {
    const response = await apiClient.put(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
    return response;
  },
};