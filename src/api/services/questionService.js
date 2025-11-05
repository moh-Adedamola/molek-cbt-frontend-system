import apiClient from '../client';
import { QUESTION_ENDPOINTS } from '../endpoints';

export const questionService = {
  // Get all questions with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get(QUESTION_ENDPOINTS.LIST, { params });
    return response;
  },

  // Get question by ID
  getById: async (id) => {
    const response = await apiClient.get(QUESTION_ENDPOINTS.GET(id));
    return response;
  },

  // Create new question
  create: async (questionData) => {
    const response = await apiClient.post(QUESTION_ENDPOINTS.CREATE, questionData);
    return response;
  },

  // Update question
  update: async (id, questionData) => {
    const response = await apiClient.put(QUESTION_ENDPOINTS.UPDATE(id), questionData);
    return response;
  },

  // Delete question
  delete: async (id) => {
    const response = await apiClient.delete(QUESTION_ENDPOINTS.DELETE(id));
    return response;
  },

  // Bulk upload questions
  bulkUpload: async (file, subjectId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject_id', subjectId);
    
    const response = await apiClient.post(QUESTION_ENDPOINTS.BULK_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Import from Word
  importWord: async (file, subjectId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject_id', subjectId);
    
    const response = await apiClient.post(QUESTION_ENDPOINTS.IMPORT_WORD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Download template
  downloadTemplate: async () => {
    const response = await apiClient.get(QUESTION_ENDPOINTS.DOWNLOAD_TEMPLATE, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'question_upload_template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response;
  },
};