export function isAnswerCorrect(selectedOptionIndex, answerIndex) {
  return (
    Number.isInteger(selectedOptionIndex) &&
    Number.isInteger(answerIndex) &&
    selectedOptionIndex === answerIndex
  );
}

export function getAnswerFeedback(question, selectedOptionIndex) {
  if (
    !question ||
    !Array.isArray(question.options) ||
    !Number.isInteger(question.answerIndex) ||
    question.answerIndex < 0 ||
    question.answerIndex >= question.options.length
  ) {
    throw new Error('Cannot create feedback for an invalid question.');
  }

  if (isAnswerCorrect(selectedOptionIndex, question.answerIndex)) {
    return {
      isCorrect: true,
      message: 'Correct! You earned 1 point.',
    };
  }

  return {
    isCorrect: false,
    message: `Incorrect. The correct answer is "${question.options[question.answerIndex]}".`,
  };
}

export function calculateScore(questions, submittedAnswers) {
  if (
    !Array.isArray(questions) ||
    !Array.isArray(submittedAnswers) ||
    questions.length !== submittedAnswers.length
  ) {
    throw new Error('Questions and submitted answers must have matching lists.');
  }

  return questions.reduce(
    (score, question, index) =>
      isAnswerCorrect(
        submittedAnswers[index],
        question.answerIndex
      )
        ? score + 1
        : score,
    0
  );
}

export function calculateQuizResults(questions, submittedAnswers) {
  const correctAnswers = calculateScore(questions, submittedAnswers);
  const totalQuestions = questions.length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const percentage =
    totalQuestions === 0 ? 0 : (correctAnswers / totalQuestions) * 100;

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    percentage,
    passed: totalQuestions > 0 && percentage >= 60,
  };
}
