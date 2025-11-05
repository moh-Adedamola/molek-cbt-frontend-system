// Authentication (2)
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
};

// Users (8)
export const USER_ENDPOINTS = {
  LIST: '/users',
  CREATE: '/users',
  GET: (id) => `/users/${id}`,
  UPDATE: (id) => `/users/${id}`,
  DELETE: (id) => `/users/${id}`,
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/password',
  ACTIVATE: (id) => `/users/${id}/activate`,
  DEACTIVATE: (id) => `/users/${id}/deactivate`,
};

// Students (7)
export const STUDENT_ENDPOINTS = {
  LIST: '/students',
  CREATE: '/students',
  GET: (id) => `/students/${id}`,
  UPDATE: (id) => `/students/${id}`,
  DELETE: (id) => `/students/${id}`,
  BY_ADMISSION: (admission) => `/students/by-admission/${admission}`,
  BY_CLASS: (classLevel) => `/students/by-class/${classLevel}`,
  BULK_UPLOAD: '/students/bulk-upload',
  DOWNLOAD_TEMPLATE: '/students/download-template',
};

// Subjects (7)
export const SUBJECT_ENDPOINTS = {
  LIST: '/subjects',
  CREATE: '/subjects',
  GET: (id) => `/subjects/${id}`,
  UPDATE: (id) => `/subjects/${id}`,
  DELETE: (id) => `/subjects/${id}`,
  SEARCH: '/subjects/search',
  STATS: '/subjects/stats',
  TOGGLE_ACTIVE: (id) => `/subjects/${id}/toggle-active`,
};

// Questions (8)
export const QUESTION_ENDPOINTS = {
  LIST: '/questions',
  CREATE: '/questions',
  GET: (id) => `/questions/${id}`,
  UPDATE: (id) => `/questions/${id}`,
  DELETE: (id) => `/questions/${id}`,
  BULK: '/questions/bulk',
  SEARCH: '/questions/search',
  BY_SUBJECT: (subjectId) => `/questions/by-subject/${subjectId}`,
  BULK_UPLOAD: '/questions/bulk-upload',
  IMPORT_WORD: '/questions/import-word',
  DOWNLOAD_TEMPLATE: '/questions/download-template',
};

// Import/Export (6)
export const IMPORT_ENDPOINTS = {
  QUESTIONS_EXCEL: '/import/questions/excel',
  QUESTIONS_WORD: '/import/questions/word',
  STUDENTS_EXCEL: '/import/students/excel',
  TEMPLATE_EXCEL: '/import/template/excel',
  TEMPLATE_WORD: '/import/template/word',
  QUESTIONS_EXPORT: '/import/questions/export',
};

// Exams (18)
export const EXAM_ENDPOINTS = {
  LIST: '/exams',
  CREATE: '/exams',
  GET: (id) => `/exams/${id}`,
  UPDATE: (id) => `/exams/${id}`,
  DELETE: (id) => `/exams/${id}`,
  PUBLISH: (id) => `/exams/${id}/publish`,
  UNPUBLISH: (id) => `/exams/${id}/unpublish`,
  GET_QUESTIONS: (id) => `/exams/${id}/questions`,
  ADD_QUESTIONS: (id) => `/exams/${id}/questions`,
  DELETE_QUESTION: (examId, questionId) => `/exams/${examId}/questions/${questionId}`,
  BY_CLASS: (classLevel) => `/exams/by-class/${classLevel}`,
  BY_SUBJECT: (subjectId) => `/exams/by-subject/${subjectId}`,
  AVAILABLE: '/exams/available',
  STATISTICS: (id) => `/exams/${id}/statistics`,
  DUPLICATE: (id) => `/exams/${id}/duplicate`,
  SESSIONS: (examId) => `/exams/${examId}/sessions`,
  BY_CODE: (examCode) => `/exams/code/${examCode}`,
  FROM_TEMPLATE: (templateId) => `/exams/from-template/${templateId}`,
  CLONE: (id) => `/exams/${id}/clone`,
  GENERATE_QUESTIONS: (id) => `/exams/${id}/generate-questions`,
  PREVIEW: (id) => `/exams/${id}/preview`,
  CALENDAR: '/exams/calendar',
  CHECK_CONFLICTS: '/exams/check-conflicts',
  VALIDATE: '/exams/validate',
  ACTIVE_SESSIONS: '/exams/active-sessions',
  SUBJECT_PERFORMANCE: (subjectId) => `/exams/subject/${subjectId}/performance`,
  DIFFICULT_TOPICS: (id) => `/exams/${id}/difficult-topics`,
  QUESTION_ANALYSIS: (id) => `/exams/${id}/question-analysis`,
  EXPORT_RESULTS: (id) => `/exams/${id}/export-results`,
  STUDENT_EXAMS: '/exams/student/available',
  START_EXAM: (id) => `/exams/${id}/start`,
  SUBMIT_EXAM: (id) => `/exams/${id}/submit`,
};

// Templates (6)
export const TEMPLATE_ENDPOINTS = {
  LIST: '/templates',
  CREATE: '/templates',
  GET: (id) => `/templates/${id}`,
  UPDATE: (id) => `/templates/${id}`,
  DELETE: (id) => `/templates/${id}`,
  GET_QUESTIONS: (id) => `/templates/${id}/questions`,
};

// Exam Sessions (12)
export const SESSION_ENDPOINTS = {
  START: (examId) => `/sessions/start/${examId}`,
  GET: (token) => `/sessions/${token}`,
  GET_QUESTIONS: (token) => `/sessions/${token}/questions`,
  SAVE_ANSWER: (token) => `/sessions/${token}/answer`,
  SUBMIT: (token) => `/sessions/${token}/submit`,
  UPDATE_TIME: (token) => `/sessions/${token}/time`,
  RESUME: (token) => `/sessions/${token}/resume`,
  MY_SESSIONS: '/sessions/my-sessions',
  REVIEW: (sessionId) => `/sessions/${sessionId}/review`,
  GET_ANSWERS: (sessionId) => `/sessions/${sessionId}/answers`,
  FLAG_QUESTION: (token, questionId) => `/sessions/${token}/flag/${questionId}`,
  ACTIVE: '/sessions/active',
  AVAILABLE_EXAMS: '/sessions/available-exams',
  MY_RESULTS: '/sessions/my-results',
  DETAILS: (token) => `/sessions/${token}`,
  NAVIGATION: (token) => `/sessions/${token}/navigation`,
  MARK_REVIEW: (token, questionId) => `/sessions/${token}/mark/${questionId}`,
  AUDIT_LOG: (token) => `/sessions/${token}/audit-log`,
  RECOVER: (token) => `/sessions/recover/${token}`,
  HEARTBEAT: (sessionId) => `/exam-sessions/${sessionId}/heartbeat`,
  GET_SESSION: (sessionId) => `/exam-sessions/${sessionId}`,
};

// Results (8)
export const RESULT_ENDPOINTS = {
  LIST: '/results',
  GET: (id) => `/results/${id}`,
  GENERATE: (sessionId) => `/results/generate/${sessionId}`,
  BY_SESSION: (sessionId) => `/results/session/${sessionId}`,
  BY_EXAM: (examId) => `/results/exam/${examId}`,
  BY_STUDENT: (studentId) => `/results/student/${studentId}`,
  PUBLISH: (id) => `/results/${id}/publish`,
  PDF: (id) => `/results/${id}/pdf`,
  STUDENT_RESULTS: '/results/student/my-results',
  EXAM_RESULTS: (examId) => `/results/exam/${examId}`,
};

// Analytics (5)
export const ANALYTICS_ENDPOINTS = {
  OVERVIEW: '/analytics/overview',
  BY_EXAM: (examId) => `/analytics/exam/${examId}`,
  BY_STUDENT: (studentId) => `/analytics/student/${studentId}`,
  BY_SUBJECT: (subjectId) => `/analytics/subject/${subjectId}`,
  BY_CLASS: (classLevel) => `/analytics/class/${classLevel}`,
};

// Dashboard (12)
export const DASHBOARD_ENDPOINTS = {
  OVERVIEW: '/dashboard/overview',
  ACTIVE_EXAMS: '/dashboard/active-exams',
  LIVE_STUDENTS: '/dashboard/live-students',
  ACTIVITY_LOGS: '/dashboard/activity-logs',
  ALERTS: '/dashboard/alerts',
  READ_ALERT: (id) => `/dashboard/alerts/${id}/read`,
  RESOLVE_ALERT: (id) => `/dashboard/alerts/${id}/resolve`,
  DATABASE_HEALTH: '/dashboard/database-health',
  UPCOMING_EXAMS: '/dashboard/upcoming-exams',
  NOTIFICATIONS: '/dashboard/notifications',
  READ_NOTIFICATION: (id) => `/dashboard/notifications/${id}/read`,
  QUICK_STATS: '/dashboard/quick-stats',
  STATS: '/dashboard/stats',
  ACTIVITY: '/dashboard/activity',
};

// Configuration (5)
export const CONFIG_ENDPOINTS = {
  LIST: '/config',
  GET: (key) => `/config/${key}`,
  UPDATE: (key) => `/config/${key}`,
  BATCH_UPDATE: '/config/batch/update',
  RESET: (key) => `/config/${key}/reset`,
};