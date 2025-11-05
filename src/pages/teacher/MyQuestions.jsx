import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Eye,
  Filter,
  Search,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { questionService, subjectService } from '../../api/services';
import { useAuthStore } from '../../store/authStore';

const CLASS_LEVELS = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

const MyQuestions = () => {
  const { user } = useAuthStore();
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [alert, setAlert] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    avgUsage: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    subject_id: '',
    class_level: '',
    difficulty_level: '',
    search: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    subjectId: '',
    classLevel: '',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    difficulty: 'medium',
    topic: '',
    explanation: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Bulk upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState('excel');
  const [uploadSubjectId, setUploadSubjectId] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadSubjects();
    loadQuestions();
  }, [filters]);

  const loadSubjects = async () => {
    try {
      const response = await subjectService.getAll();
      // Filter to only show teacher's assigned subjects
      const allSubjects = response.data?.subjects || response.data || [];
      // In production, filter by teacher's assignments
      setSubjects(allSubjects);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        // In production, add teacher_id filter
        // created_by: user.userId
      };
      const response = await questionService.getAll(params);
      const questionList = response.data?.questions || response.data || [];
      setQuestions(questionList);

      // Calculate stats
      const easy = questionList.filter((q) => q.difficulty_level === 'easy').length;
      const medium = questionList.filter((q) => q.difficulty_level === 'medium').length;
      const hard = questionList.filter((q) => q.difficulty_level === 'hard').length;

      setStats({
        total: questionList.length,
        easy,
        medium,
        hard,
        avgUsage: 2.4, // Mock data
      });
    } catch (error) {
      showAlert('error', error.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModal = (question = null) => {
    if (question) {
      setSelectedQuestion(question);
      setFormData({
        subjectId: question.subject_id || question.subjectId,
        classLevel: question.class_level || question.classLevel,
        questionText: question.question_text || question.questionText,
        optionA: question.option_a || question.optionA,
        optionB: question.option_b || question.optionB,
        optionC: question.option_c || question.optionC || '',
        optionD: question.option_d || question.optionD || '',
        correctAnswer: question.correct_answer || question.correctAnswer,
        difficulty: question.difficulty_level || question.difficulty || 'medium',
        topic: question.topic || '',
        explanation: question.explanation || '',
      });
    } else {
      setSelectedQuestion(null);
      setFormData({
        subjectId: filters.subject_id || '',
        classLevel: filters.class_level || '',
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        difficulty: 'medium',
        topic: '',
        explanation: '',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
    setFormErrors({});
  };

  const handlePreview = (question) => {
    setSelectedQuestion(question);
    setIsPreviewModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.subjectId) errors.subjectId = 'Subject is required';
    if (!formData.classLevel) errors.classLevel = 'Class level is required';
    if (!formData.questionText) errors.questionText = 'Question text is required';
    if (!formData.optionA) errors.optionA = 'Option A is required';
    if (!formData.optionB) errors.optionB = 'Option B is required';
    if (!formData.correctAnswer) errors.correctAnswer = 'Correct answer is required';

    const validAnswers = ['A', 'B'];
    if (formData.optionC) validAnswers.push('C');
    if (formData.optionD) validAnswers.push('D');

    if (!validAnswers.includes(formData.correctAnswer)) {
      errors.correctAnswer = 'Correct answer must match one of the provided options';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        subject_id: formData.subjectId,
        class_level: formData.classLevel,
        question_text: formData.questionText,
        option_a: formData.optionA,
        option_b: formData.optionB,
        option_c: formData.optionC || null,
        option_d: formData.optionD || null,
        correct_answer: formData.correctAnswer,
        difficulty_level: formData.difficulty,
        topic: formData.topic || null,
        explanation: formData.explanation || null,
      };

      if (selectedQuestion) {
        await questionService.update(selectedQuestion.id, payload);
        showAlert('success', 'Question updated successfully');
      } else {
        await questionService.create(payload);
        showAlert('success', 'Question created successfully');
      }

      handleCloseModal();
      loadQuestions();
    } catch (error) {
      showAlert('error', error.message || 'Failed to save question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (question) => {
    setSelectedQuestion(question);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      await questionService.delete(selectedQuestion.id);
      showAlert('success', 'Question deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedQuestion(null);
      loadQuestions();
    } catch (error) {
      showAlert('error', error.message || 'Failed to delete question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await questionService.downloadTemplate();
      showAlert('success', 'Template downloaded successfully');
    } catch (error) {
      showAlert('error', error.message || 'Failed to download template');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions =
        uploadType === 'excel' ? ['.xlsx', '.xls'] : ['.docx', '.doc'];
      const isValid = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

      if (!isValid) {
        showAlert('error', `Please upload a ${uploadType === 'excel' ? 'Excel' : 'Word'} file`);
        return;
      }
      setUploadFile(file);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      showAlert('error', 'Please select a file to upload');
      return;
    }

    if (!uploadSubjectId) {
      showAlert('error', 'Please select a subject');
      return;
    }

    try {
      setUploading(true);

      let response;
      if (uploadType === 'excel') {
        response = await questionService.bulkUpload(uploadFile, uploadSubjectId);
      } else {
        response = await questionService.importWord(uploadFile, uploadSubjectId);
      }

      const successCount = response.data?.success_count || response.data?.successCount || 0;
      const errorCount = response.data?.error_count || response.data?.errorCount || 0;

      if (errorCount > 0) {
        showAlert(
          'warning',
          `Imported ${successCount} questions. ${errorCount} failed. Check console for details.`
        );
      } else {
        showAlert('success', `Successfully imported ${successCount} questions`);
      }

      setIsBulkUploadModalOpen(false);
      setUploadFile(null);
      setUploadSubjectId('');
      loadQuestions();
    } catch (error) {
      showAlert('error', error.message || 'Failed to upload questions');
    } finally {
      setUploading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      key: 'questionText',
      label: 'Question',
      render: (value, row) => {
        const text = row.question_text || row.questionText;
        return (
          <div className="max-w-md">
            <p className="truncate">{text}</p>
          </div>
        );
      },
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (value, row) => {
        const subjectName = row.subject_name || row.subjectName;
        return <span className="text-sm">{subjectName}</span>;
      },
    },
    {
      key: 'classLevel',
      label: 'Class',
      render: (value, row) => {
        const classLevel = row.class_level || row.classLevel;
        return <Badge variant="info" size="sm">{classLevel}</Badge>;
      },
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (value, row) => {
        const difficulty = row.difficulty_level || row.difficulty || 'medium';
        return (
          <Badge variant={getDifficultyColor(difficulty)} size="sm">
            {difficulty}
          </Badge>
        );
      },
    },
    {
      key: 'usage',
      label: 'Usage',
      render: (value, row) => {
        // Mock data - replace with actual usage stats
        const usageCount = Math.floor(Math.random() * 10);
        return (
          <div className="text-sm text-gray-600">
            <span>{usageCount} times</span>
          </div>
        );
      },
    },
    {
      key: 'lastUsed',
      label: 'Last Used',
      render: (value, row) => {
        // Mock data
        const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        return <span className="text-sm text-gray-600">{date.toLocaleDateString()}</span>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handlePreview(row)}
            className="rounded p-1 text-green-600 hover:bg-green-50"
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleOpenModal(row)}
            className="rounded p-1 text-blue-600 hover:bg-blue-50"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="rounded p-1 text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
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
          <h1 className="text-2xl font-bold text-gray-900">My Questions</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage questions for your assigned subjects
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setIsBulkUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card
          title="Total Questions"
          value={stats.total}
          icon={FileText}
        />
        <Card
          title="Easy"
          value={stats.easy}
          subtitle={`${((stats.easy / stats.total) * 100 || 0).toFixed(0)}%`}
        />
        <Card
          title="Medium"
          value={stats.medium}
          subtitle={`${((stats.medium / stats.total) * 100 || 0).toFixed(0)}%`}
        />
        <Card
          title="Hard"
          value={stats.hard}
          subtitle={`${((stats.hard / stats.total) * 100 || 0).toFixed(0)}%`}
        />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
          <Select
            label="Difficulty"
            value={filters.difficulty_level}
            onChange={(e) => setFilters({ ...filters, difficulty_level: e.target.value })}
            options={[
              { value: '', label: 'All Levels' },
              ...DIFFICULTY_LEVELS.map((level) => ({
                value: level,
                label: level.charAt(0).toUpperCase() + level.slice(1),
              })),
            ]}
          />
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() =>
                setFilters({
                  subject_id: '',
                  class_level: '',
                  difficulty_level: '',
                  search: '',
                })
              }
              className="w-full"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <Table
          columns={columns}
          data={questions}
          loading={loading}
          emptyMessage="No questions found. Create your first question to get started."
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedQuestion ? 'Edit Question' : 'Add New Question'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Subject"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              error={formErrors.subjectId}
              options={subjects.map((s) => ({
                value: s.id,
                label: s.subject_name || s.subjectName,
              }))}
              placeholder="Select subject"
              required
            />
            <Select
              label="Class Level"
              value={formData.classLevel}
              onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
              error={formErrors.classLevel}
              options={CLASS_LEVELS.map((level) => ({ value: level, label: level }))}
              placeholder="Select class"
              required
            />
          </div>

          <TextArea
            label="Question Text"
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            error={formErrors.questionText}
            placeholder="Enter the question..."
            rows={3}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Option A"
              value={formData.optionA}
              onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
              error={formErrors.optionA}
              placeholder="First option"
              required
            />
            <Input
              label="Option B"
              value={formData.optionB}
              onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
              error={formErrors.optionB}
              placeholder="Second option"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Option C (Optional)"
              value={formData.optionC}
              onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
              placeholder="Third option"
            />
            <Input
              label="Option D (Optional)"
              value={formData.optionD}
              onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
              placeholder="Fourth option"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Correct Answer"
              value={formData.correctAnswer}
              onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
              error={formErrors.correctAnswer}
              options={[
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'C', label: 'C' },
                { value: 'D', label: 'D' },
              ]}
              placeholder="Answer"
              required
            />
            <Select
              label="Difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              options={DIFFICULTY_LEVELS.map((level) => ({
                value: level,
                label: level.charAt(0).toUpperCase() + level.slice(1),
              }))}
            />
            <Input
              label="Topic (Optional)"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g., Algebra"
            />
          </div>

          <TextArea
            label="Explanation (Optional)"
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            placeholder="Explain the correct answer..."
            rows={2}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {selectedQuestion ? 'Update Question' : 'Add Question'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Question Preview"
        size="md"
      >
        {selectedQuestion && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Question:</p>
              <p className="mt-1 text-gray-900">
                {selectedQuestion.question_text || selectedQuestion.questionText}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Options:</p>
              {['A', 'B', 'C', 'D'].map((option) => {
                const optionKey = `option_${option.toLowerCase()}`;
                const optionValue =
                  selectedQuestion[optionKey] || selectedQuestion[`option${option}`];
                if (!optionValue) return null;

                const isCorrect =
                  (selectedQuestion.correct_answer || selectedQuestion.correctAnswer) === option;

                return (
                  <div
                    key={option}
                    className={`rounded-lg border-2 p-3 ${
                      isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <span className="font-semibold">{option}. </span>
                    {optionValue}
                    {isCorrect && (
                      <Badge variant="success" size="sm" className="ml-2">
                        Correct
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedQuestion.explanation && (
              <div>
                <p className="text-sm font-medium text-gray-600">Explanation:</p>
                <p className="mt-1 text-gray-700">{selectedQuestion.explanation}</p>
              </div>
            )}

            <div className="flex gap-4 text-sm text-gray-600">
              <span>
                <strong>Difficulty:</strong>{' '}
                <Badge
                  variant={getDifficultyColor(
                    selectedQuestion.difficulty_level || selectedQuestion.difficulty
                  )}
                  size="sm"
                >
                  {selectedQuestion.difficulty_level || selectedQuestion.difficulty}
                </Badge>
              </span>
              {selectedQuestion.topic && (
                <span>
                  <strong>Topic:</strong> {selectedQuestion.topic}
                </span>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        isOpen={isBulkUploadModalOpen}
        onClose={() => {
          setIsBulkUploadModalOpen(false);
          setUploadFile(null);
          setUploadSubjectId('');
        }}
        title="Import Questions"
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="font-medium text-blue-900">Instructions:</h4>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-blue-800">
              <li>Select import type (Excel or Word)</li>
              <li>Download the template</li>
              <li>Fill in question information</li>
              <li>Select subject and upload file</li>
            </ol>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Import Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUploadType('excel')}
                className={`rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                  uploadType === 'excel'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Excel (.xlsx)
              </button>
              <button
                type="button"
                onClick={() => setUploadType('word')}
                className={`rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                  uploadType === 'word'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Word (.docx)
              </button>
            </div>
          </div>

          <Button variant="outline" onClick={handleDownloadTemplate} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download {uploadType === 'excel' ? 'Excel' : 'Word'} Template
          </Button>

          <Select
            label="Subject"
            value={uploadSubjectId}
            onChange={(e) => setUploadSubjectId(e.target.value)}
            options={subjects.map((s) => ({
              value: s.id,
              label: s.subject_name || s.subjectName,
            }))}
            placeholder="Select subject"
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Upload {uploadType === 'excel' ? 'Excel' : 'Word'} File
            </label>
            <input
              type="file"
              accept={uploadType === 'excel' ? '.xlsx,.xls' : '.docx,.doc'}
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploadFile && (
              <p className="mt-2 text-sm text-gray-600">Selected: {uploadFile.name}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsBulkUploadModalOpen(false);
                setUploadFile(null);
                setUploadSubjectId('');
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkUpload}
              loading={uploading}
              disabled={!uploadFile || !uploadSubjectId}
            >
              Import Questions
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        loading={submitting}
      />
    </div>
  );
};

export default MyQuestions;