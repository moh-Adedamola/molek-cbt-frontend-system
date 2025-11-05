import apiClient from '../client';
import { USER_ENDPOINTS } from '../endpoints';

export const userService = {
  // Get all users with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get(USER_ENDPOINTS.LIST, { params });
    return response;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await apiClient.get(USER_ENDPOINTS.GET(id));
    return response;
  },

  // Create new user
  create: async (userData) => {
    const response = await apiClient.post(USER_ENDPOINTS.CREATE, userData);
    return response;
  },

  // Update user
  update: async (id, userData) => {
    const response = await apiClient.put(USER_ENDPOINTS.UPDATE(id), userData);
    return response;
  },

  // Delete user
  delete: async (id) => {
    const response = await apiClient.delete(USER_ENDPOINTS.DELETE(id));
    return response;
  },

  // Activate user
  activate: async (id) => {
    const response = await apiClient.patch(USER_ENDPOINTS.ACTIVATE(id));
    return response;
  },

  // Deactivate user
  deactivate: async (id) => {
    const response = await apiClient.patch(USER_ENDPOINTS.DEACTIVATE(id));
    return response;
  },
};