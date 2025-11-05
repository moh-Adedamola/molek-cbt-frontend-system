import apiClient from '../client';
import { SUBJECT_ENDPOINTS } from '../endpoints';

export const subjectService = {
  // Get all subjects
  getAll: async (params = {}) => {
    const response = await apiClient.get(SUBJECT_ENDPOINTS.LIST, { params });
    return response;
  },

  // Get subject by ID
  getById: async (id) => {
    const response = await apiClient.get(SUBJECT_ENDPOINTS.GET(id));
    return response;
  },

  // Create new subject
  create: async (subjectData) => {
    const response = await apiClient.post(SUBJECT_ENDPOINTS.CREATE, subjectData);
    return response;
  },

  // Update subject
  update: async (id, subjectData) => {
    const response = await apiClient.put(SUBJECT_ENDPOINTS.UPDATE(id), subjectData);
    return response;
  },

  // Delete subject
  delete: async (id) => {
    const response = await apiClient.delete(SUBJECT_ENDPOINTS.DELETE(id));
    return response;
  },

  // Toggle active status
  toggleActive: async (id) => {
    const response = await apiClient.patch(SUBJECT_ENDPOINTS.TOGGLE_ACTIVE(id));
    return response;
  },
};