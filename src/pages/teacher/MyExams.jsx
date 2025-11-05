import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Eye,
  Copy,
  PlayCircle,
  Calendar,
  Clock,
  Users,
  FileQuestion,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { examService, subjectService } from '../../api/services';
import { useAuthStore } from '../../store/authStore';

const MyExams = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    subject_id: '',
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    scheduled: 0,
    active: 0,
    completed: 0,
  });

  useEffect(() => {
    loadSubjects();
    loadExams();
  }, [filters]);

  const loadSubjects = async () => {
    try {
      const response = await subjectService.getAll();
      const allSubjects = response.data?.subjects || response.data || [];
      // In production, filter by teacher's assignments
      setSubjects(allSubjects);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadExams = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        // In production, add teacher_id filter
        // created_by: user.userId
      };
      const response = await examService.getAll(params);
      const examList = response.data?.exams || response.data || [];
      setExams(examList);

      // Calculate stats
      const draft = examList.filter((e) => e.status === 'draft').length;
      const scheduled = examList.filter((e) => e.status === 'scheduled').length;
      const active = examList.filter((e) => e.status === 'active').length;
      const completed = examList.filter((e) => e.status === 'completed').length;

      setStats({
        total: examList.length,
        draft,
        scheduled,
        active,
        completed,
      });
    } catch (error) {
      showAlert('error', error.message || 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateExam = () => {
    // Teachers use admin's create exam page
    navigate('/admin/exams/create');
  };

  const handleEditExam = (exam) => {
    navigate(`/admin/exams/edit/${exam.id}`);
  };

  const handleViewExam = (exam) => {
    navigate(`/admin/exams/${exam.id}`);
  };

  const handleCloneExam = async (exam) => {
    try {
      const response = await examService.clone(exam.id, {
        exam_name: `${exam.exam_name || exam.examName} (Copy)`,
      });
      showAlert('success', 'Exam cloned successfully');
      loadExams();
    } catch (error) {
      showAlert('error', error.message || 'Failed to clone exam');
    }
  };

  const handlePublishClick = (exam) => {
    setSelectedExam(exam);
    setIsPublishDialogOpen(true);
  };

  const handlePublishConfirm = async () => {
    try {
      setSubmitting(true);
      await examService.publish(selectedExam.id);
      showAlert('success', 'Exam published successfully');
      setIsPublishDialogOpen(false);
      setSelectedExam(null);
      loadExams();
    } catch (error) {
      showAlert('error', error.message || 'Failed to publish exam');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewResults = (exam) => {
    navigate(`/teacher/results?exam=${exam.id}`);
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: 'default',
      scheduled: 'info',
      active: 'success',
      completed: 'default',
    };
    return variants[status] || 'default';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      key: 'examName',
      label: 'Exam Name',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{row.exam_name || row.examName}</p>
          <p className="text-sm text-gray-500">
            {row.subject_name || row.subjectName} • {row.class_level || row.classLevel}
          </p>
        </div>
      ),
    },
    {
      key: 'startTime',
      label: 'Start Time',
      render: (value, row) => (
        <div className="text-sm">
          <p className="text-gray-900">{formatDateTime(row.start_time || row.startTime)}</p>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (value, row) => {
        const duration = row.duration_minutes || row.durationMinutes;
        return (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {duration} min
          </div>
        );
      },
    },
    {
      key: 'totalQuestions',
      label: 'Questions',
      render: (value, row) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <FileQuestion className="h-4 w-4" />
          {row.total_questions || row.totalQuestions || 0}
        </div>
      ),
    },
    {
      key: 'attempts',
      label: 'Attempts',
      render: (value, row) => (
        <div className="text-sm text-gray-600">
          {row.total_attempts || row.totalAttempts || 0}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => {
        const status = row.status || 'draft';
        return (
          <Badge variant={getStatusBadge(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewExam(row)}
            className="rounded p-1 text-blue-600 hover:bg-blue-50"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {(row.status === 'draft' || row.status === 'scheduled') && (
            <>
              <button
                onClick={() => handleEditExam(row)}
                className="rounded p-1 text-green-600 hover:bg-green-50"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleCloneExam(row)}
                className="rounded p-1 text-purple-600 hover:bg-purple-50"
                title="Clone"
              >
                <Copy className="h-4 w-4" />
              </button>
            </>
          )}
          {row.status === 'draft' && (
            <button
              onClick={() => handlePublishClick(row)}
              className="rounded p-1 text-green-600 hover:bg-green-50"
              title="Publish"
            >
              <PlayCircle className="h-4 w-4" />
            </button>
          )}
          {(row.status === 'active' || row.status === 'completed') && (
            <button
              onClick={() => handleViewResults(row)}
              className="rounded p-1 text-orange-600 hover:bg-orange-50"
              title="View Results"
            >
              <BarChart3 className="h-4 w-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">My Exams</h1>
          <p className="mt-1 text-sm text-gray-600">Create and manage exams for your classes</p>
        </div>
        <Button onClick={handleCreateExam}>
          <Plus className="mr-2 h-4 w-4" />
          Create Exam
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <Card title="Total Exams" value={stats.total} icon={FileQuestion} />
        <Card
          title="Draft"
          value={stats.draft}
          subtitle="Not published"
          className="border-l-4 border-l-gray-400"
        />
        <Card
          title="Scheduled"
          value={stats.scheduled}
          subtitle="Ready to start"
          className="border-l-4 border-l-blue-400"
        />
        <Card
          title="Active"
          value={stats.active}
          subtitle="In progress"
          className="border-l-4 border-l-green-400"
        />
        <Card
          title="Completed"
          value={stats.completed}
          subtitle="Finished"
          className="border-l-4 border-l-gray-400"
        />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: '', label: 'All Status' },
              { value: 'draft', label: 'Draft' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
            ]}
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

          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => setFilters({ status: '', subject_id: '' })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { value: '', label: 'All' },
            { value: 'draft', label: 'Draft' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilters({ ...filters, status: tab.value })}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                filters.status === tab.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <Table
          columns={columns}
          data={exams}
          loading={loading}
          emptyMessage="No exams found. Create your first exam to get started."
        />
      </div>

      {/* Publish Confirmation */}
      <ConfirmDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onConfirm={handlePublishConfirm}
        title="Publish Exam"
        message={`Are you sure you want to publish "${
          selectedExam?.exam_name || selectedExam?.examName
        }"? Students will be able to see and take this exam after publishing.`}
        confirmText="Publish"
        type="default"
        loading={submitting}
      />
    </div>
  );
};

export default MyExams;