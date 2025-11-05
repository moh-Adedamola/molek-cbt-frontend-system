import apiClient from '../client';
import { EXAM_ENDPOINTS } from '../endpoints';

export const examService = {
  // Get all exams with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get(EXAM_ENDPOINTS.LIST, { params });
    return response;
  },

  // Get exam by ID
  getById: async (id) => {
    const response = await apiClient.get(EXAM_ENDPOINTS.GET(id));
    return response;
  },

  // Create new exam
  create: async (examData) => {
    const response = await apiClient.post(EXAM_ENDPOINTS.CREATE, examData);
    return response;
  },

  // Update exam
  update: async (id, examData) => {
    const response = await apiClient.put(EXAM_ENDPOINTS.UPDATE(id), examData);
    return response;
  },

  // Delete exam
  delete: async (id) => {
    const response = await apiClient.delete(EXAM_ENDPOINTS.DELETE(id));
    return response;
  },

  // Publish exam
  publish: async (id) => {
    const response = await apiClient.post(EXAM_ENDPOINTS.PUBLISH(id));
    return response;
  },

  // Clone exam
  clone: async (id, data) => {
    const response = await apiClient.post(EXAM_ENDPOINTS.CLONE(id), data);
    return response;
  },

  // Generate questions automatically
  generateQuestions: async (id, config) => {
    const response = await apiClient.post(EXAM_ENDPOINTS.GENERATE_QUESTIONS(id), config);
    return response;
  },

  // Get available exams for students
  getStudentExams: async () => {
    const response = await apiClient.get(EXAM_ENDPOINTS.STUDENT_EXAMS);
    return response;
  },

  // Get exam questions
  getExamQuestions: async (examId) => {
    const response = await apiClient.get(EXAM_ENDPOINTS.GET_QUESTIONS(examId));
    return response;
  },

  // Get exam sessions
  getSessions: async (examId) => {
    const response = await apiClient.get(EXAM_ENDPOINTS.SESSIONS(examId));
    return response;
  },

  // Start exam
  startExam: async (id) => {
    const response = await apiClient.post(EXAM_ENDPOINTS.START_EXAM(id));
    return response;
  },

  // Submit exam
  submitExam: async (id, answers) => {
    const response = await apiClient.post(EXAM_ENDPOINTS.SUBMIT_EXAM(id), { answers });
    return response;
  },
};