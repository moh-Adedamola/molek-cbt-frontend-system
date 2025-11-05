import apiClient from '../client';
import { RESULT_ENDPOINTS } from '../endpoints';

export const resultService = {
  // Get all results with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get(RESULT_ENDPOINTS.LIST, { params });
    return response;
  },

  // Get result by ID
  getById: async (id) => {
    const response = await apiClient.get(RESULT_ENDPOINTS.GET(id));
    return response;
  },

  // Get student's results
  getMyResults: async () => {
    const response = await apiClient.get(RESULT_ENDPOINTS.STUDENT_RESULTS);
    return response;
  },

  // Get results for specific exam
  getExamResults: async (examId, params = {}) => {
    const response = await apiClient.get(RESULT_ENDPOINTS.EXAM_RESULTS(examId), { params });
    return response;
  },

  // Publish result
  publish: async (id) => {
    const response = await apiClient.post(RESULT_ENDPOINTS.PUBLISH(id));
    return response;
  },

  // Get PDF
  getPDF: async (id) => {
    const response = await apiClient.get(RESULT_ENDPOINTS.PDF(id), {
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `result_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return response;
  },
};