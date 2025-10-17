import React, { createContext, useContext, useReducer } from "react";

// Create the Quiz context
const QuizContext = createContext();

// Initial state for the quiz
const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  selectedOption: null,
  showResult: false,
  isLoading: true,
  error: null,
  selectedYear: null,
  selectedWeek: null,
  darkMode: false,
};

// Action types
const actionTypes = {
  SET_QUESTIONS: "SET_QUESTIONS",
  SET_CURRENT_QUESTION_INDEX: "SET_CURRENT_QUESTION_INDEX",
  SET_SCORE: "SET_SCORE",
  SET_SELECTED_OPTION: "SET_SELECTED_OPTION",
  SET_SHOW_RESULT: "SET_SHOW_RESULT",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_SELECTED_YEAR: "SET_SELECTED_YEAR",
  SET_SELECTED_WEEK: "SET_SELECTED_WEEK",
  SET_DARK_MODE: "SET_DARK_MODE",
  RESET_QUIZ: "RESET_QUIZ",
};

// Reducer function to handle state updates
const quizReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_QUESTIONS:
      return { ...state, questions: action.payload };
    case actionTypes.SET_CURRENT_QUESTION_INDEX:
      return { ...state, currentQuestionIndex: action.payload };
    case actionTypes.SET_SCORE:
      return { ...state, score: action.payload };
    case actionTypes.SET_SELECTED_OPTION:
      return { ...state, selectedOption: action.payload };
    case actionTypes.SET_SHOW_RESULT:
      return { ...state, showResult: action.payload };
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case actionTypes.SET_SELECTED_YEAR:
      return { ...state, selectedYear: action.payload };
    case actionTypes.SET_SELECTED_WEEK:
      return { ...state, selectedWeek: action.payload };
    case actionTypes.SET_DARK_MODE:
      return { ...state, darkMode: action.payload };
    case actionTypes.RESET_QUIZ:
      return {
        ...initialState,
        darkMode: state.darkMode, // Preserve dark mode preference
        isLoading: false,
      };
    default:
      return state;
  }
};

// QuizProvider component to wrap the application
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Actions to update state
  const setQuestions = questions => {
    dispatch({ type: actionTypes.SET_QUESTIONS, payload: questions });
  };

  const setCurrentQuestionIndex = index => {
    dispatch({ type: actionTypes.SET_CURRENT_QUESTION_INDEX, payload: index });
  };

  const setScore = score => {
    dispatch({ type: actionTypes.SET_SCORE, payload: score });
  };

  const setSelectedOption = option => {
    dispatch({ type: actionTypes.SET_SELECTED_OPTION, payload: option });
  };

  const setShowResult = showResult => {
    dispatch({ type: actionTypes.SET_SHOW_RESULT, payload: showResult });
  };

  const setLoading = isLoading => {
    dispatch({ type: actionTypes.SET_LOADING, payload: isLoading });
  };

  const setError = error => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  };

  const setSelectedYear = year => {
    dispatch({ type: actionTypes.SET_SELECTED_YEAR, payload: year });
  };

  const setSelectedWeek = week => {
    dispatch({ type: actionTypes.SET_SELECTED_WEEK, payload: week });
  };

  const setDarkMode = darkMode => {
    dispatch({ type: actionTypes.SET_DARK_MODE, payload: darkMode });
  };

  const resetQuiz = () => {
    dispatch({ type: actionTypes.RESET_QUIZ });
  };

  return (
    <QuizContext.Provider
      value={{
        ...state,
        setQuestions,
        setCurrentQuestionIndex,
        setScore,
        setSelectedOption,
        setShowResult,
        setLoading,
        setError,
        setSelectedYear,
        setSelectedWeek,
        setDarkMode,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook to use the quiz context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
