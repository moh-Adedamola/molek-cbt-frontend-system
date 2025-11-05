import apiClient from '../client';
import { ANALYTICS_ENDPOINTS } from '../endpoints';

export const analyticsService = {
  // Get overview analytics
  getOverview: async (params = {}) => {
    const response = await apiClient.get(ANALYTICS_ENDPOINTS.OVERVIEW, { params });
    return response;
  },

  // Get exam analytics
  getExamAnalytics: async (examId) => {
    const response = await apiClient.get(ANALYTICS_ENDPOINTS.BY_EXAM(examId));
    return response;
  },

  // Get student analytics
  getStudentAnalytics: async (studentId) => {
    const response = await apiClient.get(ANALYTICS_ENDPOINTS.BY_STUDENT(studentId));
    return response;
  },

  // Get subject analytics
  getSubjectAnalytics: async (subjectId) => {
    const response = await apiClient.get(ANALYTICS_ENDPOINTS.BY_SUBJECT(subjectId));
    return response;
  },

  // Get class analytics
  getClassAnalytics: async (classLevel) => {
    const response = await apiClient.get(ANALYTICS_ENDPOINTS.BY_CLASS(classLevel));
    return response;
  },
};