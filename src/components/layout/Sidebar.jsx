import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileQuestion,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Shield,
  FileText,
  Activity,
  TrendingUp,
  HelpCircle,
  User,
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin/dashboard',
          },
          {
            id: 'users',
            label: 'User Management',
            icon: Users,
            path: '/admin/users',
          },
          {
            id: 'students',
            label: 'Student Management',
            icon: GraduationCap,
            path: '/admin/students',
          },
          {
            id: 'subjects',
            label: 'Subject Management',
            icon: BookOpen,
            path: '/admin/subjects',
          },
          {
            id: 'questions',
            label: 'Question Bank',
            icon: FileQuestion,
            path: '/admin/questions',
          },
          {
            id: 'exams',
            label: 'Exam Management',
            icon: ClipboardList,
            path: '/admin/exams',
          },
          {
            id: 'monitoring',
            label: 'Live Monitoring',
            icon: Activity,
            path: '/admin/monitoring',
          },
          {
            id: 'results',
            label: 'Results Management',
            icon: FileText,
            path: '/admin/results',
          },
          {
            id: 'reports',
            label: 'Reports & Analytics',
            icon: TrendingUp,
            path: '/admin/reports',
          },
          {
            id: 'settings',
            label: 'System Settings',
            icon: Settings,
            path: '/admin/settings',
          },
          {
            id: 'audit',
            label: 'Audit Logs',
            icon: Shield,
            path: '/admin/audit-logs',
          },
        ];

      case 'teacher':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/teacher/dashboard',
          },
          {
            id: 'questions',
            label: 'My Questions',
            icon: FileQuestion,
            path: '/teacher/questions',
          },
          {
            id: 'exams',
            label: 'My Exams',
            icon: ClipboardList,
            path: '/teacher/exams',
          },
          {
            id: 'results',
            label: 'Class Results',
            icon: BarChart3,
            path: '/teacher/results',
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: User,  // Add this import: import { ..., User } from 'lucide-react';
            path: '/teacher/profile',
          },
          {
            id: 'help',
            label: 'Help Center',
            icon: HelpCircle,  // Add this import: import { ..., HelpCircle } from 'lucide-react';
            path: '/teacher/help',
          },
        ];
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/teacher/dashboard',
          },
          {
            id: 'questions',
            label: 'My Questions',
            icon: FileQuestion,
            path: '/teacher/questions',
          },
          {
            id: 'exams',
            label: 'My Exams',
            icon: ClipboardList,
            path: '/teacher/exams',
          },
          {
            id: 'results',
            label: 'Class Results',
            icon: BarChart3,
            path: '/teacher/results',
          },
        ];

      case 'student':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/student/dashboard',
          },
          {
            id: 'exams',
            label: 'Available Exams',
            icon: ClipboardList,
            path: '/student/exams',
          },
          {
            id: 'results',
            label: 'My Results',
            icon: BarChart3,
            path: '/student/results',
          },
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <span className="text-lg font-bold">M</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Molek CBT</span>
            </div>
            <button onClick={onClose} className="lg:hidden">
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span className="text-sm font-semibold">
                  {user?.full_name?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.full_name || user?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                if (item.submenu) {
                  const isExpanded = expandedMenus[item.id];
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <NavLink
                                key={subItem.id}
                                to={subItem.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                  clsx(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  )
                                }
                              >
                                <SubIcon className="h-4 w-4" />
                                <span>{subItem.label}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;