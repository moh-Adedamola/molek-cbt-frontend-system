import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Calendar,
  Activity,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import { dashboardService, examService } from '../../api/services';
import { useAuthStore } from '../../store/authStore'; // ADD THIS LINE

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalSubjects: 0,
    totalExams: 0,
    activeExams: 0,
    completedExams: 0,
  });
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // In production, these would be real API calls
      // For now, we'll use mock data since backend endpoints might not be ready

      // Mock statistics
      setStats({
        totalUsers: 45,
        totalStudents: 1000,
        totalSubjects: 20,
        totalExams: 48,
        activeExams: 3,
        completedExams: 45,
      });

      // Mock upcoming exams
      setUpcomingExams([
        {
          id: 1,
          exam_name: 'Mathematics CA Test 1',
          class_level: 'SS1',
          start_time: '2025-11-10T09:00:00',
          duration_minutes: 60,
        },
        {
          id: 2,
          exam_name: 'English Language CA Test 1',
          class_level: 'SS2',
          start_time: '2025-11-12T10:00:00',
          duration_minutes: 90,
        },
        {
          id: 3,
          exam_name: 'Biology Midterm Exam',
          class_level: 'SS3',
          start_time: '2025-11-15T09:00:00',
          duration_minutes: 120,
        },
      ]);

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          action: 'New exam created',
          description: 'Physics CA Test 1 for SS2',
          user: 'Mr. Johnson',
          timestamp: '2 hours ago',
        },
        {
          id: 2,
          action: 'Student registered',
          description: '5 new students added to SS1A',
          user: 'Admin',
          timestamp: '3 hours ago',
        },
        {
          id: 3,
          action: 'Exam completed',
          description: 'Chemistry CA Test 1 - SS3',
          user: 'System',
          timestamp: '5 hours ago',
        },
        {
          id: 4,
          action: 'Questions uploaded',
          description: '50 questions added to Mathematics',
          user: 'Mrs. Adeyemi',
          timestamp: '1 day ago',
        },
      ]);

      // Mock performance data
      setPerformanceData([
        { month: 'Sep', avgScore: 65, passRate: 75 },
        { month: 'Oct', avgScore: 68, passRate: 78 },
        { month: 'Nov', avgScore: 72, passRate: 82 },
      ]);

      // Uncomment these when backend is ready:
      // const [statsRes, examsRes, activityRes] = await Promise.all([
      //   dashboardService.getStats(),
      //   dashboardService.getUpcomingExams(5),
      //   dashboardService.getRecentActivity(10),
      // ]);
      // setStats(statsRes.data);
      // setUpcomingExams(examsRes.data);
      // setRecentActivity(activityRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening with your school today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: '12%', label: 'vs last month', positive: true }}
        />
        <Card
          title="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          trend={{ value: '8%', label: 'vs last term', positive: true }}
        />
        <Card
          title="Active Subjects"
          value={stats.totalSubjects}
          icon={BookOpen}
          subtitle="Across all classes"
        />
        <Card
          title="Total Exams"
          value={stats.totalExams}
          icon={ClipboardList}
          subtitle={`${stats.activeExams} active, ${stats.completedExams} completed`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Performance Trend */}
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Avg Score"
              />
              <Line
                type="monotone"
                dataKey="passRate"
                stroke="#10b981"
                strokeWidth={2}
                name="Pass Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Exam Statistics */}
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Exam Statistics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Scheduled', value: stats.activeExams },
                { name: 'Completed', value: stats.completedExams },
                { name: 'Draft', value: stats.totalExams - stats.activeExams - stats.completedExams },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Exams */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Exams
            </h3>
            <button
              onClick={() => navigate('/admin/exams')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          {upcomingExams.length === 0 ? (
            <p className="text-center text-gray-500">No upcoming exams</p>
          ) : (
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="rounded-full bg-blue-100 p-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {exam.exam_name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {exam.class_level} • {exam.duration_minutes} minutes
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(exam.start_time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>

          {recentActivity.length === 0 ? (
            <p className="text-center text-gray-500">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {activity.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {activity.user} • {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <Users className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              Manage Users
            </span>
          </button>
          <button
            onClick={() => navigate('/admin/students')}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              Manage Students
            </span>
          </button>
          <button
            onClick={() => navigate('/admin/questions')}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              Question Bank
            </span>
          </button>
          <button
            onClick={() => navigate('/admin/exams')}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <ClipboardList className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              Create Exam
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;