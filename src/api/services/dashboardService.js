import apiClient from '../client';
import { DASHBOARD_ENDPOINTS } from '../endpoints';

export const dashboardService = {
  // Get dashboard overview
  getOverview: async () => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.OVERVIEW);
    return response;
  },

  // Get statistics
  getStats: async () => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.STATS);
    return response;
  },

  // Get quick stats
  getQuickStats: async () => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.QUICK_STATS);
    return response;
  },

  // Get recent activity
  getRecentActivity: async (params = {}) => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.ACTIVITY, { params });
    return response;
  },

  // Get activity logs
  getActivityLogs: async (params = {}) => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.ACTIVITY_LOGS, { params });
    return response;
  },

  // Get upcoming exams
  getUpcomingExams: async (params = {}) => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.UPCOMING_EXAMS, { params });
    return response;
  },

  // Get active exams
  getActiveExams: async () => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.ACTIVE_EXAMS);
    return response;
  },

  // Get live students
  getLiveStudents: async () => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.LIVE_STUDENTS);
    return response;
  },

  // Get alerts
  getAlerts: async (params = {}) => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.ALERTS, { params });
    return response;
  },

  // Mark alert as read
  markAlertAsRead: async (id) => {
    const response = await apiClient.patch(DASHBOARD_ENDPOINTS.READ_ALERT(id));
    return response;
  },

  // Resolve alert
  resolveAlert: async (id) => {
    const response = await apiClient.patch(DASHBOARD_ENDPOINTS.RESOLVE_ALERT(id));
    return response;
  },

  // Get notifications
  getNotifications: async (params = {}) => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.NOTIFICATIONS, { params });
    return response;
  },

  // Mark notification as read
  markNotificationAsRead: async (id) => {
    const response = await apiClient.patch(DASHBOARD_ENDPOINTS.READ_NOTIFICATION(id));
    return response;
  },

  // Get database health
  getDatabaseHealth: async () => {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.DATABASE_HEALTH);
    return response;
  },
};