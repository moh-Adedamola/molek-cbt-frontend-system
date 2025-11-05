import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../components/protected/ProtectedRoute';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';
import { useAuthStore } from '../store/authStore';

// Component to redirect based on user role
const RoleBasedRedirect = () => {
  const { user } = useAuthStore();

  const roleRoutes = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
  };

  return <Navigate to={roleRoutes[user?.role] || '/login'} replace />;
};

// Lazy load pages
const Login = lazy(() => import('../pages/auth/Login'));
const ChangePassword = lazy(() => import('../pages/auth/ChangePassword'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const StudentManagement = lazy(() => import('../pages/admin/StudentManagement'));
const SubjectManagement = lazy(() => import('../pages/admin/SubjectManagement'));
const QuestionBank = lazy(() => import('../pages/admin/QuestionBank'));
const ExamManagement = lazy(() => import('../pages/admin/ExamManagement'));
const CreateExam = lazy(() => import('../pages/admin/CreateExam'));
const EditExam = lazy(() => import('../pages/admin/EditExam'));
const ViewExam = lazy(() => import('../pages/admin/ViewExam'));
const ExamMonitoring = lazy(() => import('../pages/admin/ExamMonitoring'));
const ResultsManagement = lazy(() => import('../pages/admin/ResultsManagement'));
const Reports = lazy(() => import('../pages/admin/Reports'));
const SystemSettings = lazy(() => import('../pages/admin/SystemSettings'));
const AuditLogs = lazy(() => import('../pages/admin/AuditLogs'));

// Teacher pages
const TeacherDashboard = lazy(() => import('../pages/teacher/Dashboard'));
const MyQuestions = lazy(() => import('../pages/teacher/MyQuestions'));
const MyExams = lazy(() => import('../pages/teacher/MyExams'));
const TeacherResults = lazy(() => import('../pages/teacher/Results'));
const TeacherProfile = lazy(() => import('../pages/teacher/Profile'));
const TeacherHelp = lazy(() => import('../pages/teacher/Help'));

// Student pages
const StudentDashboard = lazy(() => import('../pages/student/Dashboard'));
const AvailableExams = lazy(() => import('../pages/student/AvailableExams'));
const TakeExam = lazy(() => import('../pages/student/TakeExam'));
const StudentResults = lazy(() => import('../pages/student/Results'));
const ExamReview = lazy(() => import('../pages/student/ExamReview'));

// Wrapper for lazy loaded components
const LazyLoad = ({ children }) => (
  <Suspense fallback={<Loader fullScreen />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: (
      <LazyLoad>
        <Login />
      </LazyLoad>
    ),
  },

  // Protected routes with layout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      // Redirect root to appropriate dashboard
      {
        index: true,
        element: <RoleBasedRedirect />,
      },

      // Common routes
      {
        path: 'change-password',
        element: (
          <LazyLoad>
            <ChangePassword />
          </LazyLoad>
        ),
      },

      // Admin routes
      {
        path: 'admin',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <AdminDashboard />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'users',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <UserManagement />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'students',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <StudentManagement />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'subjects',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <SubjectManagement />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'questions',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <QuestionBank />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'exams',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <ExamManagement />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'exams/create',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <CreateExam />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'exams/edit/:examId',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <EditExam />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'exams/:examId',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <ViewExam />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'monitoring',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <ExamMonitoring />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'results',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <ResultsManagement />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'reports',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <Reports />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'settings',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <SystemSettings />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'audit-logs',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoad>
                  <AuditLogs />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Teacher routes
      {
        path: 'teacher',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute allowedRoles={['teacher']}>
                <LazyLoad>
                  <TeacherDashboard />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'questions',
            element: (
              <ProtectedRoute allowedRoles={['teacher']}>
                <LazyLoad>
                  <MyQuestions />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'exams',
            element: (
              <ProtectedRoute allowedRoles={['teacher']}>
                <LazyLoad>
                  <MyExams />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'results',
            element: (
              <ProtectedRoute allowedRoles={['teacher']}>
                <LazyLoad>
                  <TeacherResults />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile',
            element: (
              <ProtectedRoute allowedRoles={['teacher']}>
                <LazyLoad>
                  <TeacherProfile />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'help',
            element: (
              <ProtectedRoute allowedRoles={['teacher']}>
                <LazyLoad>
                  <TeacherHelp />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Student routes
      {
        path: 'student',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute allowedRoles={['student']}>
                <LazyLoad>
                  <StudentDashboard />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'exams',
            element: (
              <ProtectedRoute allowedRoles={['student']}>
                <LazyLoad>
                  <AvailableExams />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'exam/:examId',
            element: (
              <ProtectedRoute allowedRoles={['student']}>
                <LazyLoad>
                  <TakeExam />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'results',
            element: (
              <ProtectedRoute allowedRoles={['student']}>
                <LazyLoad>
                  <StudentResults />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: 'review/:sessionId',
            element: (
              <ProtectedRoute allowedRoles={['student']}>
                <LazyLoad>
                  <ExamReview />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },

  // 404 catch-all
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);