import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import { resultService, sessionService } from '../../api/services';

const ExamReview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [alert, setAlert] = useState(null);
  const [showExplanations, setShowExplanations] = useState(true);

  useEffect(() => {
    loadReviewData();
  }, [sessionId]);

  const loadReviewData = async () => {
    try {
      setLoading(true);

      // Mock data - Replace with actual API
      const mockResult = {
        id: parseInt(sessionId),
        exam_name: 'Mathematics CA Test 2',
        subject_name: 'Mathematics',
        score: 34,
        total_questions: 40,
        score_percentage: 85,
        grade: 'A',
        time_taken: 52,
        duration_minutes: 60,
        passing_score: 50,
        status: 'passed',
        submitted_at: new Date().toISOString(),
        allow_review: true,
        show_correct_answers: true,
      };

      const mockQuestions = Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        question_text: `Question ${i + 1}: If x² + 5x + 6 = 0, what are the values of x?`,
        option_a: 'x = 2 or x = 3',
        option_b: 'x = -2 or x = -3',
        option_c: 'x = 1 or x = 6',
        option_d: 'x = -1 or x = -6',
        correct_answer: 'B',
        explanation: 'Factoring the quadratic equation: x² + 5x + 6 = (x + 2)(x + 3) = 0. Therefore, x = -2 or x = -3.',
      }));

      const mockAnswers = {};
      mockQuestions.forEach((q, index) => {
        // Simulate some correct and incorrect answers
        if (index < 34) {
          mockAnswers[q.id] = q.correct_answer; // Correct
        } else {
          // Random incorrect answer
          const options = ['A', 'B', 'C', 'D'].filter((opt) => opt !== q.correct_answer);
          mockAnswers[q.id] = options[Math.floor(Math.random() * options.length)];
        }
      });

      setResult(mockResult);
      setQuestions(mockQuestions);
      setUserAnswers(mockAnswers);
      setExam(mockResult);

      // In production:
      // const response = await sessionService.getReview(sessionId);
      // setResult(response.data.result);
      // setQuestions(response.data.questions);
      // setUserAnswers(response.data.answers);
    } catch (error) {
      showAlert('error', 'Failed to load exam review');
      navigate('/student/results');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const isAnswerCorrect = (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    return userAnswers[questionId] === question?.correct_answer;
  };

  const getQuestionStatus = (index) => {
    const question = questions[index];
    if (!userAnswers[question.id]) return 'unanswered';
    return isAnswerCorrect(question.id) ? 'correct' : 'incorrect';
  };

  const getCorrectCount = () => {
    return questions.filter((q) => isAnswerCorrect(q.id)).length;
  };

  const getIncorrectCount = () => {
    return questions.filter((q) => userAnswers[q.id] && !isAnswerCorrect(q.id)).length;
  };

  const getUnansweredCount = () => {
    return questions.filter((q) => !userAnswers[q.id]).length;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-4 text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  if (!exam || !questions.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-600" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Review not available</h2>
          <Button className="mt-4" onClick={() => navigate('/student/results')}>
            Back to Results
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestion.id];
  const isCorrect = isAnswerCorrect(currentQuestion.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert */}
      {alert && (
        <div className="fixed left-1/2 top-4 z-50 w-full max-w-md -translate-x-1/2 transform">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/student/results')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Results
          </button>
          <Button
            variant="secondary"
            onClick={() => setShowExplanations(!showExplanations)}
          >
            {showExplanations ? 'Hide' : 'Show'} Explanations
          </Button>
        </div>

        {/* Result Summary */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.exam_name}</h1>
              <p className="mt-1 text-gray-600">{exam.subject_name}</p>
            </div>
            <Badge variant={result.status === 'passed' ? 'success' : 'error'} size="lg">
              {result.status === 'passed' ? 'PASSED' : 'FAILED'}
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <Award className="mx-auto h-6 w-6 text-gray-600" />
              <p className="mt-2 text-2xl font-bold text-gray-900">{result.score_percentage}%</p>
              <p className="text-sm text-gray-600">Score</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <CheckCircle className="mx-auto h-6 w-6 text-green-600" />
              <p className="mt-2 text-2xl font-bold text-green-600">{getCorrectCount()}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <XCircle className="mx-auto h-6 w-6 text-red-600" />
              <p className="mt-2 text-2xl font-bold text-red-600">{getIncorrectCount()}</p>
              <p className="text-sm text-gray-600">Incorrect</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <FileQuestion className="mx-auto h-6 w-6 text-gray-600" />
              <p className="mt-2 text-2xl font-bold text-gray-900">{getUnansweredCount()}</p>
              <p className="text-sm text-gray-600">Unanswered</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <Clock className="mx-auto h-6 w-6 text-gray-600" />
              <p className="mt-2 text-2xl font-bold text-gray-900">{result.time_taken} min</p>
              <p className="text-sm text-gray-600">Time Taken</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Question Review */}
          <div className="flex-1 space-y-6">
            {/* Question Header */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {isCorrect ? (
                      <Badge variant="success">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Correct
                      </Badge>
                    ) : userAnswer ? (
                      <Badge variant="error">
                        <XCircle className="mr-1 h-3 w-3" />
                        Incorrect
                      </Badge>
                    ) : (
                      <Badge variant="default">Not Answered</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="card">
              <div className="mb-6 rounded-lg bg-blue-50 p-6">
                <p className="text-xl leading-relaxed text-gray-900">
                  {currentQuestion.question_text}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionKey = `option_${option.toLowerCase()}`;
                  const optionText = currentQuestion[optionKey];
                  if (!optionText) return null;

                  const isUserAnswer = userAnswer === option;
                  const isCorrectAnswer = currentQuestion.correct_answer === option;

                  let borderColor = 'border-gray-200';
                  let bgColor = 'bg-white';
                  let iconColor = 'text-gray-600';

                  if (result.show_correct_answers) {
                    if (isCorrectAnswer) {
                      borderColor = 'border-green-500';
                      bgColor = 'bg-green-50';
                      iconColor = 'text-green-600';
                    } else if (isUserAnswer && !isCorrect) {
                      borderColor = 'border-red-500';
                      bgColor = 'bg-red-50';
                      iconColor = 'text-red-600';
                    }
                  } else if (isUserAnswer) {
                    borderColor = isCorrect ? 'border-green-500' : 'border-red-500';
                    bgColor = isCorrect ? 'bg-green-50' : 'bg-red-50';
                    iconColor = isCorrect ? 'text-green-600' : 'text-red-600';
                  }

                  return (
                    <div
                      key={option}
                      className={`rounded-lg border-2 p-6 ${borderColor} ${bgColor}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 font-bold ${
                            isCorrectAnswer && result.show_correct_answers
                              ? 'border-green-500 bg-green-500 text-white'
                              : isUserAnswer && !isCorrect
                              ? 'border-red-500 bg-red-500 text-white'
                              : 'border-gray-300 bg-white text-gray-600'
                          }`}
                        >
                          {option}
                        </div>
                        <div className="flex-1">
                          <p className="pt-1.5 text-lg text-gray-900">{optionText}</p>
                          {isUserAnswer && (
                            <p className="mt-2 text-sm font-medium text-gray-600">
                              Your Answer
                            </p>
                          )}
                          {isCorrectAnswer && result.show_correct_answers && (
                            <p className="mt-2 text-sm font-medium text-green-600">
                              Correct Answer
                            </p>
                          )}
                        </div>
                        {isCorrectAnswer && result.show_correct_answers && (
                          <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
                        )}
                        {isUserAnswer && !isCorrect && (
                          <XCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanations && currentQuestion.explanation && (
                <div className="mt-6 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 p-4">
                  <h4 className="font-semibold text-blue-900">Explanation:</h4>
                  <p className="mt-2 text-blue-800">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* Result Summary for Question */}
              {!isCorrect && userAnswer && (
                <div className="mt-4 rounded-lg bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Tip:</strong> Review the explanation above to understand why the
                    correct answer is {currentQuestion.correct_answer}.
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="card">
              <div className="flex items-center justify-between">
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <p className="text-sm text-gray-600">
                  {currentQuestionIndex + 1} of {questions.length}
                </p>
                <Button
                  variant="secondary"
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="w-full lg:w-80">
            <div className="card sticky top-6">
              <h3 className="mb-4 font-semibold text-gray-900">Question Navigator</h3>

              {/* Legend */}
              <div className="mb-4 space-y-2 rounded-lg bg-gray-50 p-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-green-500" />
                  <span className="text-gray-700">Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-red-500" />
                  <span className="text-gray-700">Incorrect</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-gray-300" />
                  <span className="text-gray-700">Unanswered</span>
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
                      className={`aspect-square rounded-lg border-2 text-sm font-semibold transition-all ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : status === 'correct'
                          ? 'border-green-500 bg-green-500 text-white hover:bg-green-600'
                          : status === 'incorrect'
                          ? 'border-red-500 bg-red-500 text-white hover:bg-red-600'
                          : 'border-gray-300 bg-gray-300 text-white hover:bg-gray-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamReview;