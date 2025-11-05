import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuthStore();
  const location = useLocation();

  // Show loader while checking authentication
  if (loading) {
    return <Loader fullScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user) {
    const hasAccess = allowedRoles.includes(user.role);
    
    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      const roleRoutes = {
        admin: '/admin/dashboard',
        teacher: '/teacher/dashboard',
        student: '/student/dashboard',
      };
      
      return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;