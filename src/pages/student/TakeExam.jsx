import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  AlertCircle,
  Save,
  LogOut,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { examService, sessionService } from '../../api/services';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  // Exam data
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Current state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaving, setAutoSaving] = useState(false);

  // UI state
  const [alert, setAlert] = useState(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showNavigationPanel, setShowNavigationPanel] = useState(true);

  // Refs
  const timerRef = useRef(null);
  const autoSaveRef = useRef(null);
  const preventUnloadRef = useRef(true);

  useEffect(() => {
    loadExamSession();

    // Network status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      showAlert('warning', 'Internet connection lost. Please reconnect to continue.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Prevent accidental page close
    const handleBeforeUnload = (e) => {
      if (preventUnloadRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, []);

  useEffect(() => {
    if (session && exam) {
      startTimer();
      startAutoSave();
    }
  }, [session, exam]);

  const loadExamSession = async () => {
    try {
      setLoading(true);

      // Mock data - Replace with actual API
      const mockExam = {
        id: parseInt(examId),
        exam_name: 'Mathematics CA Test 2',
        subject_name: 'Mathematics',
        duration_minutes: 60,
        total_questions: 40,
        passing_score: 50,
      };

      const mockQuestions = Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        question_text: `Question ${i + 1}: What is the value of ${i + 1} + ${i + 1}?`,
        option_a: `${(i + 1) * 2 - 1}`,
        option_b: `${(i + 1) * 2}`,
        option_c: `${(i + 1) * 2 + 1}`,
        option_d: `${(i + 1) * 2 + 2}`,
        correct_answer: 'B', // For testing only - remove in production
      }));

      const mockSession = {
        id: Date.now(),
        exam_id: examId,
        started_at: new Date().toISOString(),
        duration_minutes: mockExam.duration_minutes,
      };

      setExam(mockExam);
      setQuestions(mockQuestions);
      setSession(mockSession);
      setTimeRemaining(mockExam.duration_minutes * 60); // Convert to seconds

      // In production:
      // const response = await sessionService.startSession(examId);
      // setExam(response.data.exam);
      // setQuestions(response.data.questions);
      // setSession(response.data.session);
    } catch (error) {
      showAlert('error', 'Failed to load exam. Please try again.');
      navigate('/student/exams');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startAutoSave = () => {
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);

    // Auto-save every 30 seconds
    autoSaveRef.current = setInterval(() => {
      saveProgress();
    }, 30000);
  };

  const saveProgress = async () => {
    if (!isOnline) return;

    try {
      setAutoSaving(true);

      const payload = {
        session_id: session.id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: parseInt(questionId),
          selected_answer: answer,
        })),
        marked_for_review: Object.keys(markedForReview).map((id) => parseInt(id)),
      };

      // In production:
      // await sessionService.saveAnswers(payload);

      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    // Trigger immediate save for important action
    setTimeout(() => saveProgress(), 500);
  };

  const handleMarkForReview = () => {
    const questionId = questions[currentQuestionIndex].id;
    setMarkedForReview((prev) => {
      const newMarked = { ...prev };
      if (newMarked[questionId]) {
        delete newMarked[questionId];
      } else {
        newMarked[questionId] = true;
      }
      return newMarked;
    });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const getQuestionStatus = (index) => {
    const questionId = questions[index].id;
    if (markedForReview[questionId]) return 'review';
    if (answers[questionId]) return 'answered';
    return 'unanswered';
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getUnansweredCount = () => {
    return questions.length - getAnsweredCount();
  };

  const getMarkedCount = () => {
    return Object.keys(markedForReview).length;
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const handleSubmitClick = () => {
    // Save before showing dialog
    saveProgress();
    setIsSubmitDialogOpen(true);
  };

  const handleAutoSubmit = async () => {
    showAlert('warning', 'Time expired! Auto-submitting your exam...');
    await handleSubmitExam(true);
  };

  const handleSubmitExam = async (autoSubmit = false) => {
    try {
      setSubmitting(true);
      preventUnloadRef.current = false;

      // Clear timers
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);

      const payload = {
        session_id: session.id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: parseInt(questionId),
          selected_answer: answer,
        })),
        time_taken: exam.duration_minutes * 60 - timeRemaining,
        auto_submitted: autoSubmit,
      };

      // In production:
      // const response = await sessionService.submitSession(payload);

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showAlert('success', 'Exam submitted successfully!');

      setTimeout(() => {
        navigate('/student/results');
      }, 2000);
    } catch (error) {
      showAlert('error', 'Failed to submit exam. Please try again.');
      preventUnloadRef.current = true;
      setSubmitting(false);
    }
  };

  const handleExitExam = () => {
    setIsExitDialogOpen(true);
  };

  const confirmExit = () => {
    preventUnloadRef.current = false;
    navigate('/student/exams');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentRemaining = (timeRemaining / (exam.duration_minutes * 60)) * 100;
    if (percentRemaining <= 10) return 'text-red-600 animate-pulse';
    if (percentRemaining <= 25) return 'text-orange-600';
    return 'text-gray-900';
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam || !questions.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-600" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Failed to load exam</h2>
          <Button className="mt-4" onClick={() => navigate('/student/exams')}>
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isMarked = markedForReview[currentQuestion.id];

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Alert */}
      {alert && (
        <div className="absolute left-1/2 top-4 z-50 w-full max-w-md -translate-x-1/2 transform">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{exam.exam_name}</h1>
              <p className="text-sm text-gray-600">{exam.subject_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Network Status */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {autoSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                  <span>Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Save className="h-4 w-4 text-green-600" />
                  <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
                </>
              ) : null}
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 ${timeRemaining <= exam.duration_minutes * 6
                  ? 'border-red-500 bg-red-50'
                  : timeRemaining <= exam.duration_minutes * 15
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 bg-white'
                }`}
            >
              <Clock className="h-5 w-5" />
              <span className={`text-xl font-bold ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>

            {/* Exit button */}
            <Button variant="secondary" onClick={handleExitExam} size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Question Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                  </span>
                </div>
              </div>
              <Button
                variant={isMarked ? 'warning' : 'secondary'}
                onClick={handleMarkForReview}
                size="sm"
              >
                <Flag className="mr-2 h-4 w-4" />
                {isMarked ? 'Marked' : 'Mark for Review'}
              </Button>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 overflow-y-auto bg-white p-6">
            <div className="mx-auto max-w-3xl">
              {/* Question Text */}
              <div className="mb-8 rounded-lg bg-blue-50 p-6">
                <p className="text-xl leading-relaxed text-gray-900">
                  {currentQuestion.question_text || currentQuestion.questionText || 'Question text not available'}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {['A', 'B', 'C', 'D'].map((option) => {
                  // Try both snake_case and camelCase
                  const optionKeySnake = `option_${option.toLowerCase()}`;
                  const optionKeyCamel = `option${option}`;
                  const optionText = currentQuestion[optionKeySnake] || currentQuestion[optionKeyCamel];

                  if (!optionText) return null;

                  const isSelected = currentAnswer === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      className={`group w-full rounded-lg border-2 p-6 text-left transition-all ${isSelected
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 font-bold transition-all ${isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-300 bg-white text-gray-600 group-hover:border-blue-600'
                            }`}
                        >
                          {option}
                        </div>
                        <p className="flex-1 pt-1.5 text-lg text-gray-900">{optionText}</p>
                        {isSelected && (
                          <CheckCircle className="h-6 w-6 flex-shrink-0 text-blue-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowNavigationPanel(!showNavigationPanel)}>
                  {showNavigationPanel ? 'Hide' : 'Show'} Questions
                </Button>
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button onClick={handleSubmitClick}>
                    Submit Exam
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Panel */}
        {showNavigationPanel && (
          <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-4">
              <h3 className="mb-4 font-semibold text-gray-900">Question Navigator</h3>

              {/* Status Summary */}
              <div className="mb-4 space-y-2 rounded-lg bg-gray-50 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-500" />
                    Answered
                  </span>
                  <span className="font-semibold">{getAnsweredCount()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-gray-300" />
                    Unanswered
                  </span>
                  <span className="font-semibold">{getUnansweredCount()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-orange-500" />
                    Marked for Review
                  </span>
                  <span className="font-semibold">{getMarkedCount()}</span>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(index)}
                      className={`aspect-square rounded-lg border-2 text-sm font-semibold transition-all ${isCurrent
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : status === 'answered'
                            ? 'border-green-500 bg-green-500 text-white hover:bg-green-600'
                            : status === 'review'
                              ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitClick}
                className="mt-6 w-full"
                size="lg"
              >
                Submit Exam
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <Modal
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        title="Submit Exam?"
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-yellow-900">Final Review</h4>
                <p className="mt-1 text-sm text-yellow-800">
                  Once you submit, you cannot change your answers. Please review carefully.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-3 font-semibold text-gray-900">Summary:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-semibold text-gray-900">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Answered:</span>
                <span className="font-semibold text-green-600">{getAnsweredCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unanswered:</span>
                <span className="font-semibold text-red-600">{getUnansweredCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Marked for Review:</span>
                <span className="font-semibold text-orange-600">{getMarkedCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Remaining:</span>
                <span className="font-semibold text-gray-900">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          {getUnansweredCount() > 0 && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> You have {getUnansweredCount()} unanswered question(s).
                Do you want to review them before submitting?
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsSubmitDialogOpen(false)}
              disabled={submitting}
            >
              Review Again
            </Button>
            <Button
              onClick={() => handleSubmitExam(false)}
              loading={submitting}
            >
              Yes, Submit Exam
            </Button>
          </div>
        </div>
      </Modal>

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isExitDialogOpen}
        onClose={() => setIsExitDialogOpen(false)}
        onConfirm={confirmExit}
        title="Exit Exam?"
        message="Are you sure you want to exit? Your progress has been saved, but you should complete the exam within the time limit."
        confirmText="Exit"
        type="warning"
      />
    </div>
  );
};

export default TakeExam;