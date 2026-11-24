import { describe, expect, it } from 'vitest';
import {
  createInitialQuizState,
  quizReducer,
} from '../src/utils/quizReducer.js';
import { calculateScore } from '../src/utils/scoring.js';

describe('quizReducer question navigation', () => {
  it.each([1, 8, 10, 50])(
    'completes navigation with %i question(s)',
    (questionCount) => {
      let state = createInitialQuizState(questionCount);
      state = quizReducer(state, { type: 'START' });

      for (let index = 0; index < questionCount; index += 1) {
        expect(state.currentQuestionIndex).toBe(index);
        state = quizReducer(state, {
          type: 'SELECT_OPTION',
          optionIndex: 0,
        });
        state = quizReducer(state, { type: 'SUBMIT' });

        if (index < questionCount - 1) {
          state = quizReducer(state, { type: 'NEXT' });
        } else {
          state = quizReducer(state, { type: 'VIEW_RESULTS' });
        }
      }

      expect(state.screen).toBe('results');
      expect(state.answers).toHaveLength(questionCount);
      expect(state.answers.every((answer) => answer === 0)).toBe(true);
    }
  );

  it('does not navigate until the current answer is submitted', () => {
    let state = createInitialQuizState(2);
    state = quizReducer(state, { type: 'START' });

    expect(quizReducer(state, { type: 'NEXT' })).toBe(state);
    expect(quizReducer(state, { type: 'VIEW_RESULTS' })).toBe(state);
  });

  it('blocks submission without a selected answer and blocks next past the final question', () => {
    let state = createInitialQuizState(1);
    state = quizReducer(state, { type: 'START' });
    state = quizReducer(state, { type: 'SUBMIT' });

    expect(state.answers).toEqual([null]);
    expect(state.validationMessage).toBe(
      'Choose an answer before submitting.'
    );

    state = quizReducer(state, { type: 'SELECT_OPTION', optionIndex: 0 });
    state = quizReducer(state, { type: 'SUBMIT' });

    expect(quizReducer(state, { type: 'NEXT' })).toBe(state);
  });

  it('ignores duplicate submissions so one question can score only once', () => {
    let state = createInitialQuizState(1);
    state = quizReducer(state, { type: 'START' });
    state = quizReducer(state, { type: 'SELECT_OPTION', optionIndex: 1 });
    state = quizReducer(state, { type: 'SUBMIT' });

    const submittedState = state;
    state = quizReducer(state, { type: 'SUBMIT' });

    expect(state).toBe(submittedState);
    expect(
      calculateScore(
        [{ answerIndex: 1 }],
        state.answers
      )
    ).toBe(1);
  });

  it('resets all attempt state when restarting', () => {
    let state = createInitialQuizState(2);
    state = quizReducer(state, { type: 'START' });
    state = quizReducer(state, { type: 'SELECT_OPTION', optionIndex: 1 });
    state = quizReducer(state, { type: 'SUBMIT' });
    state = quizReducer(state, { type: 'NEXT' });
    state = quizReducer(state, { type: 'SELECT_OPTION', optionIndex: 0 });

    const restarted = quizReducer(state, { type: 'RESTART' });

    expect(restarted).toEqual(createInitialQuizState(2));
    expect(restarted.answers).not.toBe(state.answers);
  });
});
