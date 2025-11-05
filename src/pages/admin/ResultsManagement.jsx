import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Download,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Users,
  FileText,
  Filter,
  Search,
} from 'lucide-react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { resultService, examService, studentService } from '../../api/services';

const ResultsManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examIdFromUrl = searchParams.get('exam');

  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    exam_id: examIdFromUrl || '',
    student_id: '',
    status: '',
    search: '',
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    averageScore: 0,
    passRate: 0,
  });

  useEffect(() => {
    loadExams();
    loadStudents();
  }, []);

  useEffect(() => {
    loadResults();
  }, [filters]);

  const loadExams = async () => {
    try {
      const response = await examService.getAll({ status: 'completed,active' });
      setExams(response.data?.exams || response.data || []);
    } catch (error) {
      console.error('Failed to load exams:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await studentService.getAll();
      setStudents(response.data?.students || response.data || []);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const loadResults = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      const response = await resultService.getAll(params);
      const resultsList = response.data?.results || response.data || [];
      setResults(resultsList);

      // Calculate stats
      const published = resultsList.filter((r) => r.is_published || r.isPublished).length;
      const pending = resultsList.filter((r) => !(r.is_published || r.isPublished)).length;

      const totalScore = resultsList.reduce(
        (sum, r) => sum + (r.percentage_score || r.percentageScore || 0),
        0
      );
      const avgScore = resultsList.length > 0 ? totalScore / resultsList.length : 0;

      const passedCount = resultsList.filter(
        (r) => (r.percentage_score || r.percentageScore || 0) >= (r.passing_score || r.passingScore || 50)
      ).length;
      const passRate = resultsList.length > 0 ? (passedCount / resultsList.length) * 100 : 0;

      setStats({
        total: resultsList.length,
        published,
        pending,
        averageScore: avgScore.toFixed(1),
        passRate: passRate.toFixed(1),
      });
    } catch (error) {
      showAlert('error', error.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = async (result) => {
    setSelectedResult(result);
    setIsDetailsModalOpen(true);
  };

  const handlePublishClick = (result) => {
    setSelectedResult(result);
    setIsPublishDialogOpen(true);
  };

  const handlePublishConfirm = async () => {
    try {
      setSubmitting(true);
      await resultService.publish(selectedResult.id);
      showAlert('success', 'Result published successfully');
      setIsPublishDialogOpen(false);
      setSelectedResult(null);
      loadResults();
    } catch (error) {
      showAlert('error', error.message || 'Failed to publish result');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async (result) => {
    try {
      await resultService.getPDF(result.id);
      showAlert('success', 'PDF downloaded successfully');
    } catch (error) {
      showAlert('error', error.message || 'Failed to download PDF');
    }
  };

  const handleExportResults = async () => {
    try {
      // This would trigger a CSV/Excel export
      showAlert('info', 'Export functionality coming soon');
    } catch (error) {
      showAlert('error', 'Failed to export results');
    }
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    if (percentage >= 50) return 'E';
    return 'F';
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 70) return 'success';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.student_name || row.studentName}
          </p>
          <p className="text-sm text-gray-500">
            {row.admission_number || row.admissionNumber}
          </p>
        </div>
      ),
    },
    {
      key: 'exam',
      label: 'Exam',
      render: (value, row) => (
        <div>
          <p className="text-sm text-gray-900">{row.exam_name || row.examName}</p>
          <p className="text-xs text-gray-500">
            {row.subject_name || row.subjectName} • {row.class_level || row.classLevel}
          </p>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (value, row) => {
        const score = row.score || 0;
        const total = row.total_questions || row.totalQuestions || 0;
        const percentage = row.percentage_score || row.percentageScore || 0;

        return (
          <div>
            <p className="font-semibold text-gray-900">
              {score}/{total}
            </p>
            <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
          </div>
        );
      },
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (value, row) => {
        const percentage = row.percentage_score || row.percentageScore || 0;
        const grade = getGrade(percentage);
        return (
          <Badge variant={getGradeColor(percentage)} size="lg">
            {grade}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => {
        const passed =
          (row.percentage_score || row.percentageScore || 0) >=
          (row.passing_score || row.passingScore || 50);
        return (
          <Badge variant={passed ? 'success' : 'error'}>
            {passed ? 'Passed' : 'Failed'}
          </Badge>
        );
      },
    },
    {
      key: 'published',
      label: 'Published',
      render: (value, row) => {
        const isPublished = row.is_published || row.isPublished;
        return isPublished ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-gray-400" />
        );
      },
    },
    {
      key: 'completedAt',
      label: 'Completed',
      render: (value, row) => {
        const date = new Date(row.completed_at || row.completedAt);
        return date.toLocaleDateString();
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
            onClick={() => handleDownloadPDF(row)}
            className="rounded p-1 text-green-600 hover:bg-green-50"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </button>
          {!(row.is_published || row.isPublished) && (
            <button
              onClick={() => handlePublishClick(row)}
              className="rounded p-1 text-purple-600 hover:bg-purple-50"
              title="Publish Result"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Results Management</h1>
          <p className="mt-1 text-sm text-gray-600">View and manage exam results</p>
        </div>
        <Button onClick={handleExportResults}>
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <Card title="Total Results" value={stats.total} icon={FileText} />
        <Card
          title="Published"
          value={stats.published}
          icon={CheckCircle}
          className="border-l-4 border-l-green-500"
        />
        <Card
          title="Pending"
          value={stats.pending}
          icon={XCircle}
          className="border-l-4 border-l-gray-500"
        />
        <Card
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={TrendingUp}
          className="border-l-4 border-l-blue-500"
        />
        <Card
          title="Pass Rate"
          value={`${stats.passRate}%`}
          icon={Award}
          className="border-l-4 border-l-purple-500"
        />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Select
            label="Exam"
            value={filters.exam_id}
            onChange={(e) => setFilters({ ...filters, exam_id: e.target.value })}
            options={[
              { value: '', label: 'All Exams' },
              ...exams.map((exam) => ({
                value: exam.id,
                label: `${exam.exam_name || exam.examName} - ${exam.class_level || exam.classLevel}`,
              })),
            ]}
          />

          <Select
            label="Student"
            value={filters.student_id}
            onChange={(e) => setFilters({ ...filters, student_id: e.target.value })}
            options={[
              { value: '', label: 'All Students' },
              ...students.map((student) => ({
                value: student.id || student.student_id,
                label: `${student.first_name || student.firstName} ${student.last_name || student.lastName}`,
              })),
            ]}
          />

          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: '', label: 'All Status' },
              { value: 'published', label: 'Published' },
              { value: 'pending', label: 'Pending' },
              { value: 'passed', label: 'Passed' },
              { value: 'failed', label: 'Failed' },
            ]}
          />

          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => setFilters({ exam_id: '', student_id: '', status: '', search: '' })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card">
        <Table
          columns={columns}
          data={results}
          loading={loading}
          emptyMessage="No results found"
        />
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
            {/* Student & Exam Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Student</p>
                <p className="mt-1 text-gray-900">
                  {selectedResult.student_name || selectedResult.studentName}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedResult.admission_number || selectedResult.admissionNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Exam</p>
                <p className="mt-1 text-gray-900">
                  {selectedResult.exam_name || selectedResult.examName}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedResult.subject_name || selectedResult.subjectName}
                </p>
              </div>
            </div>

            {/* Score Summary */}
            <div className="rounded-lg bg-gray-50 p-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {selectedResult.score || 0}/{selectedResult.total_questions || selectedResult.totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Percentage</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {(selectedResult.percentage_score || selectedResult.percentageScore || 0).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grade</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {getGrade(selectedResult.percentage_score || selectedResult.percentageScore || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge
                    variant={
                      (selectedResult.percentage_score || selectedResult.percentageScore || 0) >=
                      (selectedResult.passing_score || selectedResult.passingScore || 50)
                        ? 'success'
                        : 'error'
                    }
                    className="mt-2"
                  >
                    {(selectedResult.percentage_score || selectedResult.percentageScore || 0) >=
                    (selectedResult.passing_score || selectedResult.passingScore || 50)
                      ? 'PASSED'
                      : 'FAILED'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Correct Answers</p>
                <p className="mt-1 text-gray-900">
                  {selectedResult.correct_answers || selectedResult.correctAnswers || selectedResult.score || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Wrong Answers</p>
                <p className="mt-1 text-gray-900">
                  {(selectedResult.total_questions || selectedResult.totalQuestions || 0) -
                    (selectedResult.correct_answers || selectedResult.correctAnswers || selectedResult.score || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Time Taken</p>
                <p className="mt-1 text-gray-900">
                  {selectedResult.time_taken || selectedResult.timeTaken || '-'} minutes
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed At</p>
                <p className="mt-1 text-gray-900">
                  {new Date(
                    selectedResult.completed_at || selectedResult.completedAt
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => handleDownloadPDF(selectedResult)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              {!(selectedResult.is_published || selectedResult.isPublished) && (
                <Button onClick={() => handlePublishClick(selectedResult)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Publish Result
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Publish Confirmation */}
      <ConfirmDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onConfirm={handlePublishConfirm}
        title="Publish Result"
        message={`Are you sure you want to publish this result? The student will be able to view their result after publishing.`}
        confirmText="Publish"
        loading={submitting}
      />
    </div>
  );
};

export default ResultsManagement;