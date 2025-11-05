import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Award,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import { resultService } from '../../api/services';

const StudentResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resultIdFromUrl = searchParams.get('id');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    subject: '',
    term: '',
  });

  // Stats
  const [stats, setStats] = useState({
    totalExams: 0,
    averageScore: 0,
    highestScore: 0,
    passRate: 0,
  });

  const [performanceData, setPerformanceData] = useState([]);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);

  useEffect(() => {
    loadResults();
  }, [filters]);

  const loadResults = async () => {
    try {
      setLoading(true);

      // Mock data - Replace with actual API
      const mockResults = [
        {
          id: 1,
          exam_name: 'Chemistry CA Test 1',
          subject_name: 'Chemistry',
          class_level: 'SS2',
          score: 34,
          total_questions: 40,
          score_percentage: 85,
          grade: 'A',
          time_taken: 52,
          duration_minutes: 60,
          passing_score: 50,
          status: 'passed',
          submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          allow_review: true,
          show_correct_answers: true,
        },
        {
          id: 2,
          exam_name: 'Biology Midterm',
          subject_name: 'Biology',
          class_level: 'SS2',
          score: 36,
          total_questions: 50,
          score_percentage: 72,
          grade: 'B',
          time_taken: 85,
          duration_minutes: 90,
          passing_score: 50,
          status: 'passed',
          submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          allow_review: true,
          show_correct_answers: false,
        },
        {
          id: 3,
          exam_name: 'Mathematics CA Test 1',
          subject_name: 'Mathematics',
          class_level: 'SS2',
          score: 36,
          total_questions: 40,
          score_percentage: 90,
          grade: 'A',
          time_taken: 55,
          duration_minutes: 60,
          passing_score: 50,
          status: 'passed',
          submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          allow_review: true,
          show_correct_answers: true,
        },
        {
          id: 4,
          exam_name: 'Physics Quiz 2',
          subject_name: 'Physics',
          class_level: 'SS2',
          score: 14,
          total_questions: 30,
          score_percentage: 47,
          grade: 'F',
          time_taken: 43,
          duration_minutes: 45,
          passing_score: 50,
          status: 'failed',
          submitted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          allow_review: true,
          show_correct_answers: true,
        },
      ];

      setResults(mockResults);

      // Calculate stats
      const scores = mockResults.map((r) => r.score_percentage);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const highestScore = Math.max(...scores);
      const passed = mockResults.filter((r) => r.status === 'passed').length;
      const passRate = (passed / mockResults.length) * 100;

      setStats({
        totalExams: mockResults.length,
        averageScore: avgScore.toFixed(1),
        highestScore: highestScore.toFixed(1),
        passRate: passRate.toFixed(1),
      });

      // Generate charts data
      generatePerformanceData(mockResults);
      generateSubjectPerformance(mockResults);
      generateGradeDistribution(mockResults);

      // In production:
      // const response = await resultService.getMyResults(filters);
    } catch (error) {
      showAlert('error', 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const generatePerformanceData = (results) => {
    const data = results
      .slice()
      .reverse()
      .map((r) => ({
        exam: r.exam_name.substring(0, 15) + '...',
        score: r.score_percentage,
        passing: r.passing_score,
      }));
    setPerformanceData(data);
  };

  const generateSubjectPerformance = (results) => {
    const subjects = {};
    results.forEach((r) => {
      if (!subjects[r.subject_name]) {
        subjects[r.subject_name] = { total: 0, count: 0 };
      }
      subjects[r.subject_name].total += r.score_percentage;
      subjects[r.subject_name].count += 1;
    });

    const data = Object.entries(subjects).map(([subject, stats]) => ({
      subject,
      average: (stats.total / stats.count).toFixed(1),
    }));

    setSubjectPerformance(data);
  };

  const generateGradeDistribution = (results) => {
    const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    results.forEach((r) => {
      grades[r.grade]++;
    });

    const data = Object.entries(grades)
      .filter(([_, count]) => count > 0)
      .map(([grade, count]) => ({ grade, count }));

    setGradeDistribution(data);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setIsDetailsModalOpen(true);
  };

  const handleReviewExam = (result) => {
    if (!result.allow_review) {
      showAlert('warning', 'Exam review is not available for this exam');
      return;
    }
    navigate(`/student/review/${result.id}`);
  };

  const handleDownloadResult = async (result) => {
    try {
      showAlert('info', 'Downloading result...');
      // In production:
      // await resultService.downloadPDF(result.id);
    } catch (error) {
      showAlert('error', 'Failed to download result');
    }
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 70) return 'info';
    if (percentage >= 60) return 'warning';
    if (percentage >= 50) return 'default';
    return 'error';
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
        <p className="mt-1 text-sm text-gray-600">View your exam performance and history</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card
          title="Total Exams"
          value={stats.totalExams}
          icon={FileText}
          className="border-l-4 border-l-blue-500"
        />
        <Card
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={TrendingUp}
          trend={{ value: '5%', label: 'vs last month', positive: true }}
          className="border-l-4 border-l-green-500"
        />
        <Card
          title="Highest Score"
          value={`${stats.highestScore}%`}
          icon={Award}
          className="border-l-4 border-l-purple-500"
        />
        <Card
          title="Pass Rate"
          value={`${stats.passRate}%`}
          icon={CheckCircle}
          className="border-l-4 border-l-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Performance Trend */}
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="exam" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Your Score"
              />
              <Line
                type="monotone"
                dataKey="passing"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Passing Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Performance */}
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Average by Subject</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#3b82f6" name="Average Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grade Distribution */}
      {gradeDistribution.length > 0 && (
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ grade, count }) => `${grade}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-700">Filter Results</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            options={[
              { value: '', label: 'All Subjects' },
              { value: 'Mathematics', label: 'Mathematics' },
              { value: 'English', label: 'English' },
              { value: 'Physics', label: 'Physics' },
              { value: 'Chemistry', label: 'Chemistry' },
              { value: 'Biology', label: 'Biology' },
            ]}
          />
          <Select
            value={filters.term}
            onChange={(e) => setFilters({ ...filters, term: e.target.value })}
            options={[
              { value: '', label: 'All Terms' },
              { value: 'first', label: 'First Term' },
              { value: 'second', label: 'Second Term' },
              { value: 'third', label: 'Third Term' },
            ]}
          />
          <Button
            variant="secondary"
            onClick={() => setFilters({ subject: '', term: '' })}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results List */}
      <div className="card">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Exam History</h3>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          </div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-gray-600">No results found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {result.exam_name}
                      </h4>
                      <Badge variant={result.status === 'passed' ? 'success' : 'error'}>
                        {result.status === 'passed' ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Passed
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 h-3 w-3" />
                            Failed
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {result.subject_name} • {result.class_level}
                    </p>

                    <div className="mt-3 grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Score</p>
                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {result.score}/{result.total_questions}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Percentage</p>
                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {result.score_percentage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Grade</p>
                        <Badge variant={getGradeColor(result.score_percentage)} size="lg">
                          {result.grade}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Time Taken</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {result.time_taken}/{result.duration_minutes} min
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full transition-all ${
                            result.status === 'passed' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${result.score_percentage}%` }}
                        />
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                      <Calendar className="mr-1 inline h-3 w-3" />
                      {new Date(result.submitted_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewDetails(result)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                    {result.allow_review && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReviewExam(result)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownloadResult(result)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Result Details"
        size="lg"
      >
        {selectedResult && (
          <div className="space-y-6">
            {/* Exam Info */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedResult.exam_name}</h3>
              <p className="mt-1 text-gray-600">
                {selectedResult.subject_name} • {selectedResult.class_level}
              </p>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">Score</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {selectedResult.score}/{selectedResult.total_questions}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">Percentage</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {selectedResult.score_percentage}%
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">Grade</p>
                <Badge variant={getGradeColor(selectedResult.score_percentage)} size="lg">
                  {selectedResult.grade}
                </Badge>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">Time Taken</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {selectedResult.time_taken} min
                </p>
              </div>
            </div>

            {/* Status */}
            <div
              className={`rounded-lg border-l-4 p-4 ${
                selectedResult.status === 'passed'
                  ? 'border-l-green-500 bg-green-50'
                  : 'border-l-red-500 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`font-semibold ${
                      selectedResult.status === 'passed' ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {selectedResult.status === 'passed' ? 'Passed' : 'Failed'}
                  </p>
                  <p
                    className={`text-sm ${
                      selectedResult.status === 'passed' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    Passing score: {selectedResult.passing_score}%
                  </p>
                </div>
                <Badge
                  variant={selectedResult.status === 'passed' ? 'success' : 'error'}
                  size="lg"
                >
                  {selectedResult.status === 'passed' ? 'PASS' : 'FAIL'}
                </Badge>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Submitted:</span>
                <span className="font-medium text-gray-900">
                  {new Date(selectedResult.submitted_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">
                  {selectedResult.duration_minutes} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Review Available:</span>
                <span className="font-medium text-gray-900">
                  {selectedResult.allow_review ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Show Correct Answers:</span>
                <span className="font-medium text-gray-900">
                  {selectedResult.show_correct_answers ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </Button>
              {selectedResult.allow_review && (
                <Button onClick={() => handleReviewExam(selectedResult)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Review Exam
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentResults;