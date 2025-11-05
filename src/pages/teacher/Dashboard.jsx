import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileQuestion,
  ClipboardList,
  TrendingUp,
  Plus,
  Eye,
  Calendar,
  Activity,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Mock data - Replace with actual API calls
  const [stats, setStats] = useState({
    totalQuestions: 156,
    totalExams: 12,
    activeExams: 2,
    assignedSubjects: 3,
  });

  const [assignedSubjects, setAssignedSubjects] = useState([
    { id: 1, name: 'Mathematics', class_levels: ['SS1', 'SS2'], questions: 45, exams: 4 },
    { id: 2, name: 'Further Mathematics', class_levels: ['SS2', 'SS3'], questions: 38, exams: 3 },
    { id: 3, name: 'Physics', class_levels: ['SS1', 'SS2', 'SS3'], questions: 73, exams: 5 },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      action: 'Created exam',
      description: 'Mathematics CA Test 1 - SS2',
      timestamp: '2 hours ago',
      icon: ClipboardList,
    },
    {
      id: 2,
      action: 'Added questions',
      description: '10 new questions to Physics',
      timestamp: '5 hours ago',
      icon: FileQuestion,
    },
    {
      id: 3,
      action: 'Published results',
      description: 'Further Math CA Test - SS3',
      timestamp: '1 day ago',
      icon: CheckCircle,
    },
    {
      id: 4,
      action: 'Updated exam',
      description: 'Mathematics Midterm - SS1',
      timestamp: '2 days ago',
      icon: ClipboardList,
    },
  ]);

  const [questionStats, setQuestionStats] = useState([
    { subject: 'Math', easy: 15, medium: 20, hard: 10 },
    { subject: 'F.Math', easy: 12, medium: 18, hard: 8 },
    { subject: 'Physics', easy: 25, medium: 30, hard: 18 },
  ]);

  const [performanceData, setPerformanceData] = useState([
    { month: 'Sep', avgScore: 68 },
    { month: 'Oct', avgScore: 72 },
    { month: 'Nov', avgScore: 75 },
  ]);

  const [upcomingExams, setUpcomingExams] = useState([
    {
      id: 1,
      name: 'Mathematics CA Test 2',
      subject: 'Mathematics',
      class: 'SS2',
      date: '2025-11-15T10:00:00',
      students: 45,
    },
    {
      id: 2,
      name: 'Physics Midterm',
      subject: 'Physics',
      class: 'SS1',
      date: '2025-11-18T09:00:00',
      students: 52,
    },
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.full_name || user?.fullName}! Here's your overview.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card
          title="My Questions"
          value={stats.totalQuestions}
          icon={FileQuestion}
          trend={{ value: '12', label: 'added this week', positive: true }}
        />
        <Card
          title="My Exams"
          value={stats.totalExams}
          icon={ClipboardList}
          subtitle={`${stats.activeExams} active`}
        />
        <Card
          title="Assigned Subjects"
          value={stats.assignedSubjects}
          icon={BookOpen}
        />
        <Card
          title="Avg. Performance"
          value="75%"
          icon={TrendingUp}
          trend={{ value: '3%', label: 'vs last month', positive: true }}
        />
      </div>

      {/* Assigned Subjects */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">My Subjects</h3>
          <Button variant="secondary" size="sm" onClick={() => navigate('/teacher/questions')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Questions
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {assignedSubjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-blue-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {subject.class_levels.map((level) => (
                      <Badge key={level} variant="info" size="sm">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>{subject.questions} questions</span>
                <span>{subject.exams} exams</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Question Distribution */}
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Question Distribution by Difficulty
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={questionStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="easy" fill="#10b981" name="Easy" />
              <Bar dataKey="medium" fill="#f59e0b" name="Medium" />
              <Bar dataKey="hard" fill="#ef4444" name="Hard" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend */}
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Student Performance Trend
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
                name="Average Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Exams */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Exams</h3>
            <button
              onClick={() => navigate('/teacher/exams')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          {upcomingExams.length === 0 ? (
            <p className="text-center text-gray-500">No upcoming exams</p>
          ) : (
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="rounded-full bg-blue-100 p-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{exam.name}</h4>
                    <p className="text-sm text-gray-600">
                      {exam.subject} • {exam.class} • {exam.students} students
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(exam.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <button
            onClick={() => navigate('/teacher/questions')}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <FileQuestion className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Add Questions</span>
          </button>
          <button
            onClick={() => navigate('/teacher/exams')}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <ClipboardList className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Create Exam</span>
          </button>
          <button
            onClick={() => navigate('/teacher/results')}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">View Results</span>
          </button>
          <button
            onClick={() => navigate('/teacher/questions')}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <Eye className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">My Questions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;