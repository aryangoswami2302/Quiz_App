export function createInitialQuizState(questionCount) {
  if (!Number.isInteger(questionCount) || questionCount < 1) {
    throw new Error('A quiz must contain at least one valid question.');
  }

  return {
    screen: 'welcome',
    currentQuestionIndex: 0,
    selectedOptionIndex: null,
    answers: Array(questionCount).fill(null),
    validationMessage: null,
  };
}

export function quizReducer(state, action) {
  switch (action.type) {
    case 'START':
      if (state.screen !== 'welcome') {
        return state;
      }

      return { ...state, screen: 'active' };

    case 'SELECT_OPTION':
      if (
        state.screen !== 'active' ||
        state.answers[state.currentQuestionIndex] !== null ||
        !Number.isInteger(action.optionIndex) ||
        action.optionIndex < 0
      ) {
        return state;
      }

      return {
        ...state,
        selectedOptionIndex: action.optionIndex,
        validationMessage: null,
      };

    case 'SUBMIT':
      if (
        state.screen !== 'active' ||
        state.answers[state.currentQuestionIndex] !== null
      ) {
        return state;
      }

      if (state.selectedOptionIndex === null) {
        return {
          ...state,
          validationMessage: 'Choose an answer before submitting.',
        };
      }

      return {
        ...state,
        answers: state.answers.map((answer, index) =>
          index === state.currentQuestionIndex
            ? state.selectedOptionIndex
            : answer
        ),
        validationMessage: null,
      };

    case 'NEXT':
      if (
        state.screen !== 'active' ||
        state.answers[state.currentQuestionIndex] === null ||
        state.currentQuestionIndex >= state.answers.length - 1
      ) {
        return state;
      }

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        selectedOptionIndex: null,
        validationMessage: null,
      };

    case 'VIEW_RESULTS':
      if (
        state.screen !== 'active' ||
        state.answers[state.currentQuestionIndex] === null ||
        state.currentQuestionIndex !== state.answers.length - 1
      ) {
        return state;
      }

      return { ...state, screen: 'results' };

    case 'RESTART':
      if (state.screen === 'welcome') {
        return state;
      }

      return createInitialQuizState(state.answers.length);

    default:
      return state;
  }
}
