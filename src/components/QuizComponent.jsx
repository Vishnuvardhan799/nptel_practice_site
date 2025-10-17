import React, { memo } from "react";
import { useQuiz } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

// Helper function to shuffle arrays
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Component for the quiz functionality
const QuizComponent = memo(() => {
  const navigate = useNavigate();

  // Function to render content with math support
  const renderMathContent = (text) => {
    if (!text) return null;
    
    // If there's no math delimiters in the text, return it as is to improve performance
    if (!text.includes('$')) {
      return text;
    }
    
    // Split text by math delimiters ($...$ or $$...$$)
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        // Block math
        const mathContent = part.slice(2, -2);
        return <BlockMath key={index} math={mathContent} />;
      } else if (part.startsWith("$") && part.endsWith("$")) {
        // Inline math (not starting with $$)
        const mathContent = part.slice(1, -1);
        return <InlineMath key={index} math={mathContent} />;
      } else {
        // Regular text
        return <span key={index}>{part}</span>;
      }
    });
  };

  const {
    questions,
    currentQuestionIndex,
    score,
    selectedOption,
    showResult,
    selectedYear,
    selectedWeek,
    darkMode,
    setQuestions,
    setCurrentQuestionIndex,
    setScore,
    setSelectedOption,
    setShowResult,
    setSelectedYear,
    setSelectedWeek,
    setDarkMode,
  } = useQuiz();

  // Add keyboard navigation for option selection
  const handleOptionKeyDown = (index, event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedOption(index);
    }
  };

  // Function to start the quiz with selected year and week
  const startQuiz = (year, week) => {
    // Validate inputs
    if (!year || !String(year).match(/^\d{4}$/)) {
      console.error("Invalid year selected:", year);
      alert("Please select a valid year.");
      return;
    }

    if (week !== "all" && (!week || !String(week).match(/^\d+$/))) {
      console.error("Invalid week selected:", week);
      alert("Please select a valid week.");
      return;
    }

    setSelectedYear(year);
    setSelectedWeek(week);

    let selectedQuestions = [];
    if (week === "all") {
      selectedQuestions = Object.values(window.nptelData[year]).flat();
    } else {
      selectedQuestions = window.nptelData[year]?.[week] || [];
    }

    if (selectedQuestions.length === 0) {
      alert("No questions available for this selection.");
      return;
    }

    // Randomize questions and their options
    const randomized = shuffleArray(selectedQuestions).map((q) => {
      const indices = [...q.options.keys()]; // Get option indices
      const shuffledIndices = shuffleArray(indices); // Randomize the indices
      const shuffledOptions = shuffledIndices.map((i) => q.options[i]); // Get options in new order
      const newCorrectIndex = shuffledIndices.indexOf(q.correctAnswerIndex); // Find new position of correct answer
      return {
        ...q,
        shuffledOptions, // Store the randomized options
        correctAnswerIndex: newCorrectIndex, // Store the new index of correct answer
      };
    });

    setQuestions(randomized);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
  };

  // Handle option selection
  const handleOptionSelect = (index) => setSelectedOption(index);

  // Move to next question or show results
  const handleNext = () => {
    if (selectedOption === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Year Selection Screen
  if (!selectedYear) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {renderMathContent("Mathematics for Economics - I")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {renderMathContent("NPTEL Practice Questions")}
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6" tabIndex="0">
              {renderMathContent("Select Year")}
            </h2>
            <div className="flex gap-4 flex-wrap" role="radiogroup" aria-label="Select a year">
              {[2025, 2024, 2023].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className="px-6 py-3 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 font-medium rounded-lg transition-colors"
                  role="radio"
                  aria-checked={false}
                  tabIndex={0}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Week Selection Screen
  if (!showResult && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button
                onClick={() => {
                  setSelectedYear(null);
                  navigate("/");
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                aria-label="Go back to home"
              >
                ← Home
              </button>
              <h2
                className="text-2xl font-bold text-gray-800 dark:text-white ml-4"
                tabIndex="0"
              >
                {renderMathContent(`Year: ${selectedYear}`)}
              </h2>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3
              className="text-xl font-semibold text-gray-800 dark:text-white mb-6"
              tabIndex="0"
            >
              {renderMathContent("Select Week")}
            </h3>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6"
              role="radiogroup"
              aria-label="Select a week"
            >
              {[...Array(12)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => startQuiz(selectedYear, String(i + 1))}
                  className="py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                  role="radio"
                  aria-checked={false}
                  tabIndex={0}
                >
                  {renderMathContent(`Week ${i + 1}`)}
                </button>
              ))}
            </div>
            <button
              onClick={() => startQuiz(selectedYear, "all")}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              tabIndex={0}
            >
              {renderMathContent("Practice All Weeks")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (showResult) {
    return (
      <div className="min-h-screen bg-green-50 dark:bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center"
            role="main"
            aria-labelledby="quiz-completed"
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => {
                  setSelectedYear(null);
                  setSelectedWeek(null);
                  setQuestions([]);
                  setShowResult(false);
                  navigate('/');
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                aria-label="Go back to home"
              >
                ← Home
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <h2
              id="quiz-completed"
              className="text-2xl font-bold text-gray-800 dark:text-white mb-2"
              tabIndex="0"
            >
              {renderMathContent("Quiz Completed!")}
            </h2>
            <div
              className="text-5xl font-bold text-green-600 dark:text-green-400 my-6"
              role="status"
              aria-live="polite"
            >
              {score} / {questions.length}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {score === questions.length
                ? "Perfect! You aced it!"
                : score >= questions.length * 0.7
                ? "Great job! Keep practicing!"
                : "Good effort! Review and try again."}
            </p>

            <div className="space-y-3" role="group" aria-label="Post-quiz actions">
              <button
                onClick={() => startQuiz(selectedYear, selectedWeek)}
                className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                tabIndex={0}
              >
                {renderMathContent(`Retry (${selectedWeek === "all" ? "All Weeks" : `Week ${selectedWeek}`})`)}
              </button>

              <button
                onClick={() => {
                  setQuestions([]);
                  setShowResult(false);
                  // Keep selectedYear to show week selection for the same year
                }}
                className="block w-full py-3 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg"
                tabIndex={0}
              >
                {renderMathContent("Choose Different Week")}
              </button>

              <button
                onClick={() => {
                  setSelectedYear(null);
                  setQuestions([]);
                  setShowResult(false);
                  navigate('/');
                }}
                className="block w-full py-3 px-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg"
                tabIndex={0}
              >
                {renderMathContent("Change Year")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  const currentQ = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={() => {
                setSelectedYear(null);
                setSelectedWeek(null);
                setQuestions([]);
                navigate('/');
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
              aria-label="Go back to home"
            >
              ← Home
            </button>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {renderMathContent(`Q${currentQuestionIndex + 1} of ${questions.length}`)}
            </span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div
            className="h-2 bg-gray-200 dark:bg-gray-700"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`Quiz progress: ${Math.round(progress)}%`}
          >
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4" tabIndex="0">
              {renderMathContent(`${selectedYear} • Week ${selectedWeek === "all" ? "All" : selectedWeek}`)}
            </div>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 leading-relaxed">
              {renderMathContent(currentQ.question)}
            </h2>

            <div className="space-y-3 mb-8">
              {currentQ.shuffledOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  onKeyDown={(e) => handleOptionKeyDown(idx, e)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedOption === idx
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  role="radio"
                  aria-checked={selectedOption === idx}
                  tabIndex={0}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        selectedOption === idx
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      }`}
                      aria-hidden="true"
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-gray-800 dark:text-gray-200">
                      {renderMathContent(opt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`py-3 px-8 font-medium rounded-lg transition-colors ${
                  selectedOption === null
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                tabIndex={0}
                aria-disabled={selectedOption === null}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default QuizComponent;