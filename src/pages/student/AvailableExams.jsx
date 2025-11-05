import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  FileQuestion,
  PlayCircle,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import { examService } from '../../api/services';

const AvailableExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isLobbyModalOpen, setIsLobbyModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    subject: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    loadExams();
  }, [filters]);

  const loadExams = async () => {
    try {
      setLoading(true);
      // Mock data - Replace with actual API
      const mockExams = [
        {
          id: 1,
          exam_name: 'Mathematics CA Test 2',
          subject_name: 'Mathematics',
          description: 'Covers topics: Algebra, Geometry, and Trigonometry',
          start_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 150 * 60 * 1000).toISOString(),
          duration_minutes: 60,
          total_questions: 40,
          passing_score: 50,
          status: 'scheduled',
          attempt_status: null,
        },
        {
          id: 2,
          exam_name: 'English Language Midterm',
          subject_name: 'English',
          description: 'Comprehensive test on grammar, comprehension, and essay writing',
          start_time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 80 * 60 * 1000).toISOString(),
          duration_minutes: 90,
          total_questions: 50,
          passing_score: 50,
          status: 'active',
          attempt_status: null,
        },
        {
          id: 3,
          exam_name: 'Physics Quiz 3',
          subject_name: 'Physics',
          description: 'Topics: Motion, Forces, and Energy',
          start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          duration_minutes: 45,
          total_questions: 30,
          passing_score: 50,
          status: 'scheduled',
          attempt_status: null,
        },
        {
          id: 4,
          exam_name: 'Chemistry CA Test 1',
          subject_name: 'Chemistry',
          description: 'Periodic table, chemical reactions, and stoichiometry',
          start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 60,
          total_questions: 35,
          passing_score: 50,
          status: 'completed',
          attempt_status: 'completed',
        },
      ];

      setExams(mockExams);
    } catch (error) {
      showAlert('error', 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canStartExam = (exam) => {
    const now = new Date();
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);
    return now >= start && now <= end && exam.status === 'active' && !exam.attempt_status;
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);

    if (exam.attempt_status === 'completed') return 'completed';
    if (exam.attempt_status === 'in_progress') return 'in_progress';
    if (now < start) return 'upcoming';
    if (now > end) return 'expired';
    if (now >= start && now <= end) return 'available';
    return 'unknown';
  };

  const getStatusBadge = (exam) => {
    const status = getExamStatus(exam);
    const variants = {
      available: 'success',
      upcoming: 'info',
      in_progress: 'warning',
      completed: 'default',
      expired: 'error',
    };
    const labels = {
      available: 'Available Now',
      upcoming: 'Upcoming',
      in_progress: 'In Progress',
      completed: 'Completed',
      expired: 'Expired',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const handleOpenLobby = (exam) => {
    if (!canStartExam(exam)) {
      showAlert('warning', 'This exam is not available for taking at the moment');
      return;
    }
    setSelectedExam(exam);
    setIsLobbyModalOpen(true);
  };

  const handleStartExam = () => {
    setIsLobbyModalOpen(false);
    navigate(`/student/exam/${selectedExam.id}`);
  };

  const getCountdown = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `Starts in ${days}d ${hours}h`;
    if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
    if (minutes > 0) return `Starts in ${minutes} minutes`;
    return 'Starting soon...';
  };

  const filteredExams = exams.filter((exam) => {
    if (filters.subject && exam.subject_name !== filters.subject) return false;
    if (filters.status && getExamStatus(exam) !== filters.status) return false;
    if (
      filters.search &&
      !exam.exam_name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Exams</h1>
        <p className="mt-1 text-sm text-gray-600">Browse and start your exams</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-700">Filter Exams</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input
            placeholder="Search exams..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            icon={Search}
          />
          <Select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            options={[
              { value: '', label: 'All Subjects' },
              { value: 'Mathematics', label: 'Mathematics' },
              { value: 'English', label: 'English' },
              { value: 'Physics', label: 'Physics' },
              { value: 'Chemistry', label: 'Chemistry' },
            ]}
          />
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: '', label: 'All Status' },
              { value: 'available', label: 'Available Now' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
          <Button
            variant="secondary"
            onClick={() => setFilters({ subject: '', status: '', search: '' })}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="card">
          <div className="py-12 text-center">
            <FileQuestion className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No exams found</h3>
            <p className="mt-2 text-sm text-gray-600">
              Check back later or adjust your filters
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExams.map((exam) => {
            const status = getExamStatus(exam);
            const isAvailable = canStartExam(exam);
            const countdown = getCountdown(exam.start_time);

            return (
              <div
                key={exam.id}
                className={`card transition-all ${
                  isAvailable ? 'border-2 border-green-500 shadow-lg' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{exam.exam_name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{exam.subject_name}</p>
                  </div>
                  {getStatusBadge(exam)}
                </div>

                {exam.description && (
                  <p className="mt-3 text-sm text-gray-700">{exam.description}</p>
                )}

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(exam.start_time).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{exam.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileQuestion className="h-4 w-4" />
                    <span>{exam.total_questions} questions</span>
                  </div>
                </div>

                {countdown && (
                  <div className="mt-4 rounded-lg bg-blue-50 p-3 text-center">
                    <p className="text-sm font-medium text-blue-900">{countdown}</p>
                  </div>
                )}

                <div className="mt-4">
                  {isAvailable ? (
                    <Button
                      onClick={() => handleOpenLobby(exam)}
                      className="w-full"
                      size="lg"
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Start Exam
                    </Button>
                  ) : status === 'completed' ? (
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/student/results')}
                      className="w-full"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      View Result
                    </Button>
                  ) : status === 'expired' ? (
                    <Button variant="secondary" disabled className="w-full">
                      <XCircle className="mr-2 h-4 w-4" />
                      Exam Expired
                    </Button>
                  ) : (
                    <Button variant="secondary" disabled className="w-full">
                      Not Available
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exam Lobby Modal */}
      <Modal
        isOpen={isLobbyModalOpen}
        onClose={() => setIsLobbyModalOpen(false)}
        title="Exam Lobby"
        size="lg"
      >
        {selectedExam && (
          <div className="space-y-6">
            {/* Exam Details */}
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="text-xl font-bold text-blue-900">{selectedExam.exam_name}</h3>
              <p className="mt-1 text-blue-700">{selectedExam.subject_name}</p>
              {selectedExam.description && (
                <p className="mt-2 text-sm text-blue-800">{selectedExam.description}</p>
              )}
            </div>

            {/* Exam Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {selectedExam.duration_minutes} min
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileQuestion className="h-5 w-5" />
                  <span className="text-sm font-medium">Questions</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {selectedExam.total_questions}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Instructions:</h4>
              <div className="rounded-lg border-l-4 border-l-blue-500 bg-gray-50 p-4">
                <ul className="list-inside list-disc space-y-2 text-sm text-gray-700">
                  <li>You have {selectedExam.duration_minutes} minutes to complete this exam</li>
                  <li>
                    The exam contains {selectedExam.total_questions} multiple-choice questions
                  </li>
                  <li>Passing score is {selectedExam.passing_score}%</li>
                  <li>Your answers are automatically saved as you go</li>
                  <li>You can navigate between questions freely</li>
                  <li>Mark questions for review if you're unsure</li>
                  <li>Review all questions before submitting</li>
                  <li>Once submitted, you cannot change your answers</li>
                </ul>
              </div>
            </div>

            {/* Important Notices */}
            <div className="rounded-lg border-l-4 border-l-orange-500 bg-orange-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-600" />
                <div className="text-sm text-orange-800">
                  <p className="font-semibold">Important:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Ensure you have a stable internet connection</li>
                    <li>Do not refresh the page or close the browser</li>
                    <li>The timer will auto-submit when time expires</li>
                    <li>You can only attempt this exam once</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* System Check */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">System Check:</h4>
              <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Internet connection stable</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Browser compatible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Session authenticated</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsLobbyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleStartExam} size="lg">
                <PlayCircle className="mr-2 h-5 w-5" />
                I'm Ready - Start Exam
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AvailableExams;