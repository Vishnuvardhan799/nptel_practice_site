// src/App.jsx
import React, { useEffect } from "react";
import { useQuiz } from "./context/QuizContext";
import QuizComponent from "./components/QuizComponent";
import { useParams } from "react-router-dom";

const App = () => {
  const {
    isLoading,
    error,
    darkMode,
    setDarkMode,
    setLoading,
    setError,
    setSelectedYear,
    setSelectedWeek,
    selectedYear,
  } = useQuiz();

  const { year, week } = useParams();

  /**
   * Initialize dark mode preference from localStorage or system preference
   * Runs only once on mount and does not override user toggles.
   */
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialMode = saved === "true" || (saved === null && prefersDark);
    setDarkMode(initialMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once

  /**
   * Apply dark mode class to document element and save preference to localStorage
   */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  /**
   * Load questions data from JSON file on component mount
   */
  useEffect(() => {
    let isCancelled = false;

    const loadQuestions = async () => {
      if (isCancelled) return;

      try {
        setLoading(true);
        const response = await fetch("/questions.json");

        if (!response.ok) {
          throw new Error(
            `Failed to load questions: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        window.nptelData = data.years;
        setError(null);

        if (year && year !== selectedYear) {
          setSelectedYear(year);
          if (week) setSelectedWeek(week);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to load questions:", err);
          setError(`Failed to load questions: ${err.message}`);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    if (!window.nptelData) {
      loadQuestions();
    } else {
      if (year && year !== selectedYear) {
        setSelectedYear(year);
        if (week) setSelectedWeek(week);
      }
      setLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [
    setLoading,
    setError,
    year,
    week,
    setSelectedYear,
    setSelectedWeek,
    selectedYear,
  ]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Error Loading Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors w-full sm:w-auto"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading questions...
          </p>
        </div>
      </div>
    );
  }

  return <QuizComponent />;
};

export default App;
