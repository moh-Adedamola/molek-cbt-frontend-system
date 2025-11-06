import { useState } from 'react';
import {
  Book,
  FileQuestion,
  Upload,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Download,
  FileText,
} from 'lucide-react';
import Button from '../../components/common/Button';
import { questionService } from '../../api/services';

const TeacherHelp = () => {
  const [alert, setAlert] = useState(null);

  const handleDownloadTemplate = async (type) => {
    try {
      await questionService.downloadTemplate();
      setAlert({ type: 'success', message: `${type} template downloaded successfully` });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to download template' });
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Help Center</h1>
        <p className="mt-1 text-sm text-gray-600">
          Guides and best practices for managing questions and exams
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <a
          href="#question-creation"
          className="card flex items-center gap-3 transition-colors hover:bg-gray-50"
        >
          <FileQuestion className="h-8 w-8 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Question Creation</h3>
            <p className="text-sm text-gray-600">How to create questions</p>
          </div>
        </a>
        <a
          href="#bulk-upload"
          className="card flex items-center gap-3 transition-colors hover:bg-gray-50"
        >
          <Upload className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Bulk Upload</h3>
            <p className="text-sm text-gray-600">Upload multiple questions</p>
          </div>
        </a>
        <a
          href="#best-practices"
          className="card flex items-center gap-3 transition-colors hover:bg-gray-50"
        >
          <CheckCircle className="h-8 w-8 text-purple-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Best Practices</h3>
            <p className="text-sm text-gray-600">Tips for quality questions</p>
          </div>
        </a>
      </div>

      {/* Question Creation Guide */}
      <div id="question-creation" className="card">
        <div className="mb-4 flex items-center gap-3">
          <FileQuestion className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Creating Questions</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">Step-by-Step Guide:</h3>
            <ol className="ml-6 list-decimal space-y-2 text-gray-700">
              <li>Navigate to "My Questions" from the sidebar</li>
              <li>Click the "Add Question" button</li>
              <li>Select the subject and class level</li>
              <li>Enter your question text clearly and concisely</li>
              <li>Provide 2-4 answer options (A, B, C, D)</li>
              <li>Select the correct answer</li>
              <li>Choose difficulty level (Easy, Medium, Hard)</li>
              <li>Optionally add a topic and explanation</li>
              <li>Click "Add Question" to save</li>
            </ol>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">Question Format Tips:</h4>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-800">
              <li>Keep questions clear and unambiguous</li>
              <li>Use proper grammar and punctuation</li>
              <li>Avoid double negatives</li>
              <li>Make sure only one answer is correct</li>
              <li>Ensure all options are plausible</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bulk Upload Guide */}
      <div id="bulk-upload" className="card">
        <div className="mb-4 flex items-center gap-3">
          <Upload className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Bulk Question Upload</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">Excel Upload Instructions:</h3>
            <ol className="ml-6 list-decimal space-y-2 text-gray-700">
              <li>Download the Excel template</li>
              <li>Fill in the required columns:
                <ul className="ml-6 mt-1 list-disc text-sm">
                  <li><strong>class_level:</strong> JSS1, JSS2, JSS3, SS1, SS2, or SS3</li>
                  <li><strong>question_text:</strong> The question</li>
                  <li><strong>option_a:</strong> First option</li>
                  <li><strong>option_b:</strong> Second option</li>
                  <li><strong>option_c:</strong> Third option (optional)</li>
                  <li><strong>option_d:</strong> Fourth option (optional)</li>
                  <li><strong>correct_answer:</strong> A, B, C, or D</li>
                  <li><strong>difficulty_level:</strong> easy, medium, or hard</li>
                  <li><strong>topic:</strong> Topic name (optional)</li>
                  <li><strong>explanation:</strong> Answer explanation (optional)</li>
                </ul>
              </li>
              <li>Save the file</li>
              <li>Go to "My Questions" and click "Import"</li>
              <li>Select subject and upload the Excel file</li>
              <li>Review the import results</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => handleDownloadTemplate('Excel')}>
              <Download className="mr-2 h-4 w-4" />
              Download Excel Template
            </Button>
            <Button variant="secondary" onClick={() => handleDownloadTemplate('Word')}>
              <Download className="mr-2 h-4 w-4" />
              Download Word Template
            </Button>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <h4 className="font-semibold text-green-900">Word Document Format:</h4>
            <div className="mt-2 space-y-2 text-sm text-green-800">
              <p>Format each question as follows:</p>
              <pre className="mt-2 rounded bg-white p-3 text-xs">
{`Q1. [Class Level - Topic] What is 2 + 2?
A. 3
B. 4 [CORRECT]
C. 5
D. 6
Difficulty: Easy
Explanation: 2 plus 2 equals 4.

Q2. [SS1 - Algebra] Solve for x: 2x + 3 = 7
A. x = 1
B. x = 2 [CORRECT]
C. x = 3
D. x = 4
Difficulty: Medium`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div id="best-practices" className="card">
        <div className="mb-4 flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Best Practices</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">
              Writing High-Quality Questions:
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border-l-4 border-l-green-500 bg-green-50 p-4">
                <h4 className="flex items-center gap-2 font-semibold text-green-900">
                  <CheckCircle className="h-5 w-5" />
                  Do:
                </h4>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-green-800">
                  <li>Use clear, simple language</li>
                  <li>Test a single concept per question</li>
                  <li>Make distractors plausible</li>
                  <li>Vary difficulty across your question bank</li>
                  <li>Include explanations for complex questions</li>
                  <li>Review and update questions regularly</li>
                </ul>
              </div>

              <div className="rounded-lg border-l-4 border-l-red-500 bg-red-50 p-4">
                <h4 className="flex items-center gap-2 font-semibold text-red-900">
                  <AlertCircle className="h-5 w-5" />
                  Don't:
                </h4>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-800">
                  <li>Use ambiguous wording</li>
                  <li>Include "all of the above" options</li>
                  <li>Make options too similar</li>
                  <li>Use trick questions</li>
                  <li>Copy questions verbatim from textbooks</li>
                  <li>Create questions with obvious answers</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-gray-900">Difficulty Levels Guide:</h3>
            <div className="space-y-2">
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <h4 className="font-semibold text-green-900">Easy:</h4>
                <p className="text-sm text-green-800">
                  Tests basic recall and understanding. Students should answer correctly 70-80% of
                  the time.
                </p>
              </div>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <h4 className="font-semibold text-yellow-900">Medium:</h4>
                <p className="text-sm text-yellow-800">
                  Requires application and analysis. Target success rate: 50-60%.
                </p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <h4 className="font-semibold text-red-900">Hard:</h4>
                <p className="text-sm text-red-800">
                  Challenges students with synthesis and evaluation. Expected success rate: 30-40%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Errors */}
      <div className="card">
        <div className="mb-4 flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-900">Common Errors & Solutions</h2>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900">Error: "Invalid correct answer"</h4>
            <p className="mt-1 text-sm text-gray-700">
              <strong>Solution:</strong> Ensure the correct_answer field contains only A, B, C, or
              D, and that the corresponding option exists.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900">Error: "Class level not recognized"</h4>
            <p className="mt-1 text-sm text-gray-700">
              <strong>Solution:</strong> Use only: JSS1, JSS2, JSS3, SS1, SS2, or SS3 (case-sensitive).
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900">Error: "Difficulty level invalid"</h4>
            <p className="mt-1 text-sm text-gray-700">
              <strong>Solution:</strong> Use only: easy, medium, or hard (lowercase).
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900">Error: "Missing required option"</h4>
            <p className="mt-1 text-sm text-gray-700">
              <strong>Solution:</strong> Both option_a and option_b are required. Options C and D
              are optional.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <div className="mb-4 flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900">Q: Can I edit questions after creating them?</h4>
            <p className="mt-1 text-sm text-gray-700">
              A: Yes, you can edit any question from the "My Questions" page. However, if a
              question is already being used in an active exam, changes will only apply to future
              exams.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">
              Q: How many questions should I create for each topic?
            </h4>
            <p className="mt-1 text-sm text-gray-700">
              A: Aim for at least 20-30 questions per topic to allow for variety in exams. Include
              a mix of difficulty levels.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">Q: Can I reuse questions across different classes?</h4>
            <p className="mt-1 text-sm text-gray-700">
              A: Yes, but make sure to create separate questions for each class level to ensure
              appropriate difficulty.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">Q: What happens if I upload invalid questions?</h4>
            <p className="mt-1 text-sm text-gray-700">
              A: The system will show you which questions failed validation and why. Valid
              questions will be imported successfully.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">Q: How do I know which questions perform well?</h4>
            <p className="mt-1 text-sm text-gray-700">
              A: Check the "Usage" column in "My Questions" to see how many times each question has
              been used and its success rate.
            </p>
          </div>
        </div>
      </div>

      {/* Need More Help */}
      <div className="card bg-blue-50">
        <div className="flex items-start gap-4">
          <Book className="h-6 w-6 flex-shrink-0 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Need More Help?</h3>
            <p className="mt-1 text-sm text-blue-800">
              If you can't find what you're looking for, contact the system administrator or check
              the main school portal for additional resources.
            </p>
            <Button variant="secondary" size="sm" className="mt-3">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHelp;