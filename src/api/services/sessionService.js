import apiClient from '../client';
import { SESSION_ENDPOINTS } from '../endpoints';

export const sessionService = {
  // Send heartbeat
  heartbeat: async (sessionId) => {
    const response = await apiClient.post(SESSION_ENDPOINTS.HEARTBEAT(sessionId));
    return response;
  },

  // Save answer
  saveAnswer: async (sessionId, answerData) => {
    const response = await apiClient.post(SESSION_ENDPOINTS.SAVE_ANSWER(sessionId), answerData);
    return response;
  },

  // Get session details
  getSession: async (sessionId) => {
    const response = await apiClient.get(SESSION_ENDPOINTS.GET_SESSION(sessionId));
    return response;
  },
};