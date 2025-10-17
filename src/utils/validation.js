/**
 * Utility functions for data validation and sanitization
 */

/**
 * Validates a question object
 * @param {Object} question - The question object to validate
 * @returns {boolean} - Whether the question is valid
 */
export const validateQuestion = question => {
  // Check if question has required properties
  if (!question || typeof question !== "object") {
    console.error("Question is not a valid object");
    return false;
  }

  // Validate question text
  if (
    !question.question ||
    typeof question.question !== "string" ||
    !question.question.trim()
  ) {
    console.error("Question text is required and must be a non-empty string");
    return false;
  }

  // Validate options array
  if (!Array.isArray(question.options) || question.options.length === 0) {
    console.error("Options must be a non-empty array");
    return false;
  }

  // Validate each option
  for (let i = 0; i < question.options.length; i++) {
    if (
      typeof question.options[i] !== "string" ||
      !question.options[i].trim()
    ) {
      console.error(`Option ${i} must be a non-empty string`);
      return false;
    }
  }

  // Validate correct answer index
  if (
    typeof question.correctAnswerIndex !== "number" ||
    question.correctAnswerIndex < 0 ||
    question.correctAnswerIndex >= question.options.length ||
    !Number.isInteger(question.correctAnswerIndex)
  ) {
    console.error(
      "Correct answer index must be a valid integer within options range"
    );
    return false;
  }

  return true;
};

/**
 * Sanitizes a question object
 * @param {Object} question - The question object to sanitize
 * @returns {Object} - The sanitized question
 */
export const sanitizeQuestion = question => {
  if (!question) return null;

  // Sanitize question text
  const sanitizedQuestion = {
    ...question,
    question: question.question ? question.question.trim() : "",
    options: Array.isArray(question.options)
      ? question.options.map(opt => (typeof opt === "string" ? opt.trim() : ""))
      : [],
  };

  // Ensure correctAnswerIndex is a valid integer
  if (typeof question.correctAnswerIndex === "number") {
    sanitizedQuestion.correctAnswerIndex = Math.floor(
      question.correctAnswerIndex
    );
  } else {
    sanitizedQuestion.correctAnswerIndex = 0;
  }

  return sanitizedQuestion;
};

/**
 * Validates all questions in a quiz
 * @param {Array} questions - Array of question objects
 * @returns {boolean} - Whether all questions are valid
 */
export const validateQuestions = questions => {
  if (!Array.isArray(questions)) {
    console.error("Questions must be an array");
    return false;
  }

  for (let i = 0; i < questions.length; i++) {
    if (!validateQuestion(questions[i])) {
      console.error(`Invalid question at index ${i}:`, questions[i]);
      return false;
    }
  }

  return true;
};

/**
 * Sanitizes all questions in a quiz
 * @param {Array} questions - Array of question objects
 * @returns {Array} - The sanitized questions array
 */
export const sanitizeQuestions = questions => {
  if (!Array.isArray(questions)) {
    return [];
  }

  return questions
    .filter(question => question !== null && question !== undefined) // Remove null/undefined
    .map(sanitizeQuestion) // Sanitize each question
    .filter(question => question !== null && validateQuestion(question)); // Remove invalid ones
};
