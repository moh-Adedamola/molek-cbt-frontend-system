import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  BarChart3,
  FileText,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import { resultService, examService, subjectService } from '../../api/services';
import { useAuthStore } from '../../store/authStore';

const CLASS_LEVELS = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

const TeacherResults = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const examIdFromUrl = searchParams.get('exam');

  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    exam_id: examIdFromUrl || '',
    subject_id: '',
    class_level: '',
  });

  // Stats
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    passRate: 0,
    highestScore: 0,
  });

  // Performance data
  const [performanceData, setPerformanceData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [scoreDistribution, setScoreDistribution] = useState([]);

  useEffect(() => {
    loadSubjects();
    loadExams();
  }, []);

  useEffect(() => {
    if (filters.exam_id) {
      loadResults();
    }
  }, [filters]);

  const loadSubjects = async () => {
    try {
      const response = await subjectService.getAll();
      const allSubjects = response.data?.subjects || response.data || [];
      setSubjects(allSubjects);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadExams = async () => {
    try {
      const response = await examService.getAll({
        // In production, filter by teacher
        // created_by: user.userId
      });
      const examList = response.data?.exams || response.data || [];
      // Only show completed or active exams
      const availableExams = examList.filter(
        (e) => e.status === 'active' || e.status === 'completed'
      );
      setExams(availableExams);

      // Auto-select first exam if none selected
      if (!filters.exam_id && availableExams.length > 0) {
        setFilters({ ...filters, exam_id: availableExams[0].id });
      }
    } catch (error) {
      console.error('Failed to load exams:', error);
    }
  };

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await resultService.getByExam(filters.exam_id);
      const resultList = response.data?.results || response.data || [];
      setResults(resultList);

      // Calculate stats
      if (resultList.length > 0) {
        const scores = resultList.map((r) => r.score_percentage || r.scorePercentage || 0);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const passed = resultList.filter((r) => (r.score_percentage || r.scorePercentage) >= 50).length;
        const passRate = (passed / resultList.length) * 100;
        const highestScore = Math.max(...scores);

        setStats({
          totalAttempts: resultList.length,
          averageScore: avgScore.toFixed(1),
          passRate: passRate.toFixed(1),
          highestScore: highestScore.toFixed(1),
        });

        // Generate performance data
        generatePerformanceData(resultList);
        generateGradeDistribution(resultList);
        generateScoreDistribution(resultList);
      } else {
        setStats({
          totalAttempts: 0,
          averageScore: 0,
          passRate: 0,
          highestScore: 0,
        });
        setPerformanceData([]);
        setGradeDistribution([]);
        setScoreDistribution([]);
      }
    } catch (error) {
      showAlert('error', error.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const generatePerformanceData = (resultList) => {
    // Mock time-based performance data
    const data = [
      { time: 'Week 1', avgScore: 65 },
      { time: 'Week 2', avgScore: 70 },
      { time: 'Week 3', avgScore: 72 },
      { time: 'Week 4', avgScore: 75 },
    ];
    setPerformanceData(data);
  };

  const generateGradeDistribution = (resultList) => {
    const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };

    resultList.forEach((result) => {
      const score = result.score_percentage || result.scorePercentage || 0;
      if (score >= 80) grades.A++;
      else if (score >= 70) grades.B++;
      else if (score >= 60) grades.C++;
      else if (score >= 50) grades.D++;
      else grades.F++;
    });

    const data = Object.entries(grades).map(([grade, count]) => ({
      grade,
      count,
    }));

    setGradeDistribution(data);
  };

  const generateScoreDistribution = (resultList) => {
    const ranges = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0,
    };

    resultList.forEach((result) => {
      const score = result.score_percentage || result.scorePercentage || 0;
      if (score <= 20) ranges['0-20']++;
      else if (score <= 40) ranges['21-40']++;
      else if (score <= 60) ranges['41-60']++;
      else if (score <= 80) ranges['61-80']++;
      else ranges['81-100']++;
    });

    const data = Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }));

    setScoreDistribution(data);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setIsDetailsModalOpen(true);
  };

  const handleExportResults = async (format) => {
    if (!filters.exam_id) {
      showAlert('warning', 'Please select an exam first');
      return;
    }

    try {
      setExportLoading(true);
      
      if (format === 'pdf') {
        await resultService.downloadPDF(filters.exam_id);
      } else {
        await resultService.exportExcel(filters.exam_id);
      }
      
      showAlert('success', `Results exported as ${format.toUpperCase()} successfully`);
    } catch (error) {
      showAlert('error', error.message || 'Failed to export results');
    } finally {
      setExportLoading(false);
    }
  };

  const getGradeColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 70) return 'info';
    if (score >= 60) return 'warning';
    if (score >= 50) return 'default';
    return 'error';
  };

  const getGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.student_name || row.studentName || 'Unknown'}
          </p>
          <p className="text-sm text-gray-500">
            {row.admission_number || row.admissionNumber}
          </p>
        </div>
      ),
    },
    {
      key: 'class',
      label: 'Class',
      render: (value, row) => (
        <Badge variant="info" size="sm">
          {row.class_level || row.classLevel}
        </Badge>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (value, row) => {
        const score = row.score_percentage || row.scorePercentage || 0;
        return (
          <div>
            <p className="font-semibold text-gray-900">{score.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">
              {row.score || 0}/{row.total_questions || row.totalQuestions || 0}
            </p>
          </div>
        );
      },
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (value, row) => {
        const score = row.score_percentage || row.scorePercentage || 0;
        const grade = getGrade(score);
        return (
          <Badge variant={getGradeColor(score)} size="lg">
            {grade}
          </Badge>
        );
      },
    },
    {
      key: 'timeTaken',
      label: 'Time Taken',
      render: (value, row) => {
        const minutes = row.time_taken || row.timeTaken || 0;
        return <span className="text-sm text-gray-600">{minutes} min</span>;
      },
    },
    {
      key: 'submittedAt',
      label: 'Submitted',
      render: (value, row) => {
        const date = new Date(row.submitted_at || row.submittedAt);
        return (
          <div className="text-sm text-gray-600">
            <p>{date.toLocaleDateString()}</p>
            <p className="text-xs text-gray-500">{date.toLocaleTimeString()}</p>
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="rounded p-1 text-blue-600 hover:bg-blue-50"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleExportResults('pdf')}
            className="rounded p-1 text-green-600 hover:bg-green-50"
            title="Download Result"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const selectedExam = exams.find((e) => e.id === filters.exam_id);

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Results</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and analyze student performance across your exams
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => handleExportResults('excel')}
            disabled={!filters.exam_id || exportLoading}
            loading={exportLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button
            onClick={() => handleExportResults('pdf')}
            disabled={!filters.exam_id || exportLoading}
            loading={exportLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-700">Filter Results</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Select
            label="Exam"
            value={filters.exam_id}
            onChange={(e) => setFilters({ ...filters, exam_id: e.target.value })}
            options={exams.map((e) => ({
              value: e.id,
              label: `${e.exam_name || e.examName} - ${e.subject_name || e.subjectName}`,
            }))}
            placeholder="Select exam"
            required
          />

          <Select
            label="Subject"
            value={filters.subject_id}
            onChange={(e) => setFilters({ ...filters, subject_id: e.target.value })}
            options={[
              { value: '', label: 'All Subjects' },
              ...subjects.map((s) => ({
                value: s.id,
                label: s.subject_name || s.subjectName,
              })),
            ]}
          />

          <Select
            label="Class Level"
            value={filters.class_level}
            onChange={(e) => setFilters({ ...filters, class_level: e.target.value })}
            options={[
              { value: '', label: 'All Classes' },
              ...CLASS_LEVELS.map((level) => ({ value: level, label: level })),
            ]}
          />

          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() =>
                setFilters({
                  exam_id: filters.exam_id,
                  subject_id: '',
                  class_level: '',
                })
              }
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {!filters.exam_id ? (
        <div className="card">
          <div className="py-12 text-center">
            <BarChart3 className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Exam Selected</h3>
            <p className="mt-2 text-sm text-gray-600">
              Please select an exam to view results and analytics
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Selected Exam Info */}
          {selectedExam && (
            <div className="card bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {selectedExam.exam_name || selectedExam.examName}
                  </h3>
                  <p className="mt-1 text-sm text-blue-700">
                    {selectedExam.subject_name || selectedExam.subjectName} •{' '}
                    {selectedExam.class_level || selectedExam.classLevel} •{' '}
                    {selectedExam.total_questions || selectedExam.totalQuestions} questions •{' '}
                    {selectedExam.duration_minutes || selectedExam.durationMinutes} minutes
                  </p>
                </div>
                <Badge
                  variant={
                    selectedExam.status === 'active'
                      ? 'success'
                      : selectedExam.status === 'completed'
                      ? 'default'
                      : 'info'
                  }
                >
                  {selectedExam.status}
                </Badge>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card
              title="Total Attempts"
              value={stats.totalAttempts}
              icon={Users}
              className="border-l-4 border-l-blue-500"
            />
            <Card
              title="Average Score"
              value={`${stats.averageScore}%`}
              icon={TrendingUp}
              trend={{
                value: '5%',
                label: 'vs last exam',
                positive: true,
              }}
              className="border-l-4 border-l-green-500"
            />
            <Card
              title="Pass Rate"
              value={`${stats.passRate}%`}
              icon={Award}
              subtitle={`${Math.round((stats.totalAttempts * stats.passRate) / 100)} passed`}
              className="border-l-4 border-l-purple-500"
            />
            <Card
              title="Highest Score"
              value={`${stats.highestScore}%`}
              icon={TrendingUp}
              className="border-l-4 border-l-orange-500"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Score Distribution */}
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Grade Distribution */}
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Trend */}
          {performanceData.length > 0 && (
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Performance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
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
          )}

          {/* Results Table */}
          <div className="card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Student Results</h3>
              <p className="mt-1 text-sm text-gray-600">
                Detailed breakdown of individual student performance
              </p>
            </div>
            <Table
              columns={columns}
              data={results}
              loading={loading}
              emptyMessage="No results found for this exam"
            />
          </div>
        </>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Result Details"
        size="lg"
      >
        {selectedResult && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Student Name</p>
                  <p className="mt-1 text-gray-900">
                    {selectedResult.student_name || selectedResult.studentName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Admission Number</p>
                  <p className="mt-1 text-gray-900">
                    {selectedResult.admission_number || selectedResult.admissionNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Class</p>
                  <p className="mt-1 text-gray-900">
                    {selectedResult.class_level || selectedResult.classLevel}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Submitted</p>
                  <p className="mt-1 text-gray-900">
                    {new Date(
                      selectedResult.submitted_at || selectedResult.submittedAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">Score</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {selectedResult.score || 0}/{selectedResult.total_questions || selectedResult.totalQuestions || 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">Percentage</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {(selectedResult.score_percentage || selectedResult.scorePercentage || 0).toFixed(1)}%
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">Grade</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {getGrade(selectedResult.score_percentage || selectedResult.scorePercentage || 0)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">Time Taken</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {selectedResult.time_taken || selectedResult.timeTaken || 0} min
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-lg border-l-4 border-l-blue-500 bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">
                    {(selectedResult.score_percentage || selectedResult.scorePercentage || 0) >= 50
                      ? 'Passed'
                      : 'Failed'}
                  </p>
                  <p className="text-sm text-blue-700">
                    Passing score:{' '}
                    {selectedResult.passing_score || selectedResult.passingScore || 50}%
                  </p>
                </div>
                <Badge
                  variant={
                    (selectedResult.score_percentage || selectedResult.scorePercentage || 0) >= 50
                      ? 'success'
                      : 'error'
                  }
                  size="lg"
                >
                  {(selectedResult.score_percentage || selectedResult.scorePercentage || 0) >= 50
                    ? 'PASS'
                    : 'FAIL'}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => handleExportResults('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Download Result
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeacherResults;