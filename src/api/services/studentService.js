import apiClient from '../client';
import { STUDENT_ENDPOINTS } from '../endpoints';

export const studentService = {
  // Get all students with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get(STUDENT_ENDPOINTS.LIST, { params });
    return response;
  },

  // Get student by ID
  getById: async (id) => {
    const response = await apiClient.get(STUDENT_ENDPOINTS.GET(id));
    return response;
  },

  // Create new student
  create: async (studentData) => {
    const response = await apiClient.post(STUDENT_ENDPOINTS.CREATE, studentData);
    return response;
  },

  // Update student
  update: async (id, studentData) => {
    const response = await apiClient.put(STUDENT_ENDPOINTS.UPDATE(id), studentData);
    return response;
  },

  // Delete student
  delete: async (id) => {
    const response = await apiClient.delete(STUDENT_ENDPOINTS.DELETE(id));
    return response;
  },

  // Bulk upload students
  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(STUDENT_ENDPOINTS.BULK_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Download template
  downloadTemplate: async () => {
    const response = await apiClient.get(STUDENT_ENDPOINTS.DOWNLOAD_TEMPLATE, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_upload_template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response;
  },
};