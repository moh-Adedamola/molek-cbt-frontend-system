import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  TrendingUp,
  Award,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { examService, resultService } from '../../api/services';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with actual API calls
  const [stats, setStats] = useState({
    upcomingExams: 3,
    completedExams: 8,
    averageScore: 78.5,
    totalExams: 11,
  });

  const [upcomingExams, setUpcomingExams] = useState([
    {
      id: 1,
      exam_name: 'Mathematics CA Test 2',
      subject_name: 'Mathematics',
      start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      duration_minutes: 60,
      total_questions: 40,
      status: 'scheduled',
    },
    {
      id: 2,
      exam_name: 'English Language Midterm',
      subject_name: 'English',
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      duration_minutes: 90,
      total_questions: 50,
      status: 'scheduled',
    },
    {
      id: 3,
      exam_name: 'Physics Quiz 3',
      subject_name: 'Physics',
      start_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 2 days from now
      duration_minutes: 45,
      total_questions: 30,
      status: 'scheduled',
    },
  ]);

  const [recentResults, setRecentResults] = useState([
    {
      id: 1,
      exam_name: 'Chemistry CA Test 1',
      subject_name: 'Chemistry',
      score_percentage: 85,
      grade: 'A',
      submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      exam_name: 'Biology Midterm',
      subject_name: 'Biology',
      score_percentage: 72,
      grade: 'B',
      submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      exam_name: 'Mathematics CA Test 1',
      subject_name: 'Mathematics',
      score_percentage: 90,
      grade: 'A',
      submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  useEffect(() => {
    loadDashboardData();

    // Update countdown every second
    const interval = setInterval(() => {
      setUpcomingExams([...upcomingExams]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(false);
      // In production:
      // const examsRes = await examService.getStudentExams();
      // const resultsRes = await resultService.getMyResults();
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setLoading(false);
    }
  };

  const getCountdown = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) return 'Starting soon...';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds}s`;
  };

  const canStartExam = (exam) => {
    const now = new Date();
    const start = new Date(exam.start_time);
    const diff = start - now;
    return diff <= 0 && diff > -exam.duration_minutes * 60 * 1000;
  };

  const handleStartExam = (examId) => {
    navigate(`/student/exam/${examId}`);
  };

  const handleViewResult = (resultId) => {
    navigate(`/student/results?id=${resultId}`);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 70) return 'info';
    if (percentage >= 60) return 'warning';
    if (percentage >= 50) return 'default';
    return 'error';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.full_name || user?.fullName || 'Student'}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">Here's your exam overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card
          title="Upcoming Exams"
          value={stats.upcomingExams}
          icon={Calendar}
          className="border-l-4 border-l-blue-500"
        />
        <Card
          title="Completed Exams"
          value={stats.completedExams}
          icon={CheckCircle}
          className="border-l-4 border-l-green-500"
        />
        <Card
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={TrendingUp}
          trend={{ value: '5%', label: 'vs last month', positive: true }}
          className="border-l-4 border-l-purple-500"
        />
        <Card
          title="Total Exams"
          value={stats.totalExams}
          icon={Award}
          className="border-l-4 border-l-orange-500"
        />
      </div>

      {/* Upcoming Exams */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Exams</h2>
          <Button variant="secondary" size="sm" onClick={() => navigate('/student/exams')}>
            View All
          </Button>
        </div>

        {upcomingExams.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No upcoming exams</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingExams.map((exam) => {
              const isAvailable = canStartExam(exam);
              const countdown = getCountdown(exam.start_time);

              return (
                <div
                  key={exam.id}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    isAvailable
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {exam.exam_name}
                        </h3>
                        {isAvailable && (
                          <Badge variant="success">
                            <PlayCircle className="mr-1 h-3 w-3" />
                            Available Now
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {exam.subject_name} • {exam.total_questions} questions •{' '}
                        {exam.duration_minutes} minutes
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(exam.start_time).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {isAvailable ? 'Available now' : `Starts in ${countdown}`}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {isAvailable ? (
                        <Button onClick={() => handleStartExam(exam.id)} size="lg">
                          <PlayCircle className="mr-2 h-5 w-5" />
                          Start Exam
                        </Button>
                      ) : (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{countdown}</div>
                          <p className="text-xs text-gray-500">until start</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Results */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Results</h2>
          <Button variant="secondary" size="sm" onClick={() => navigate('/student/results')}>
            View All
          </Button>
        </div>

        {recentResults.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No results yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {recentResults.map((result) => (
              <div
                key={result.id}
                className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{result.exam_name}</h3>
                    <p className="text-sm text-gray-600">{result.subject_name}</p>
                  </div>
                  <Badge variant={getGradeColor(result.score_percentage)} size="lg">
                    {result.grade}
                  </Badge>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Score</span>
                    <span className="font-semibold text-gray-900">
                      {result.score_percentage}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${result.score_percentage}%` }}
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  {new Date(result.submitted_at).toLocaleDateString()}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleViewResult(result.id)}
                  className="mt-3 w-full"
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Performance Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Highest Score</span>
              <span className="font-semibold text-gray-900">90%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lowest Score</span>
              <span className="font-semibold text-gray-900">65%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pass Rate</span>
              <span className="font-semibold text-gray-900">100%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Study Time</span>
              <span className="font-semibold text-gray-900">24 hours</span>
            </div>
          </div>
        </div>

        <div className="card bg-blue-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 flex-shrink-0 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Exam Tips</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-800">
                <li>Review all questions before submitting</li>
                <li>Start with questions you're confident about</li>
                <li>Keep track of time remaining</li>
                <li>Use the "Mark for Review" feature wisely</li>
                <li>Ensure stable internet connection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;