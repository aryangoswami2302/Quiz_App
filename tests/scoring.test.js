import { describe, expect, it } from 'vitest';
import {
  calculateQuizResults,
  calculateScore,
  getAnswerFeedback,
  isAnswerCorrect,
} from '../src/utils/scoring.js';

const question = {
  id: 1,
  question: 'Which option is correct?',
  options: ['First', 'Second', 'Third'],
  answerIndex: 1,
};

describe('answer scoring', () => {
  it('compares selected and correct option indexes', () => {
    expect(isAnswerCorrect(1, 1)).toBe(true);
    expect(isAnswerCorrect(0, 1)).toBe(false);
    expect(isAnswerCorrect(null, 1)).toBe(false);
  });

  it('returns correct and incorrect answer feedback', () => {
    expect(getAnswerFeedback(question, 1)).toEqual({
      isCorrect: true,
      message: 'Correct! You earned 1 point.',
    });
    expect(getAnswerFeedback(question, 0)).toEqual({
      isCorrect: false,
      message: 'Incorrect. The correct answer is "Second".',
    });
  });

  it('calculates one point per correct submitted answer and ignores unanswered questions', () => {
    const questions = [
      question,
      { ...question, id: 2, answerIndex: 0 },
      { ...question, id: 3, answerIndex: 2 },
    ];

    expect(calculateScore(questions, [1, 1, null])).toBe(1);
  });

  it('awards exactly one point for a correct answer and zero for an incorrect answer', () => {
    expect(calculateScore([question], [1])).toBe(1);
    expect(calculateScore([question], [0])).toBe(0);
  });

  it('rejects question and answer lists with different lengths', () => {
    expect(() => calculateScore([question], [])).toThrow(
      /matching lists/
    );
  });

  it.each([
    [6, 10, 60, true],
    [5, 10, 50, false],
    [8, 10, 80, true],
  ])(
    'calculates %i correct out of %i as %i%% with passed=%s',
    (correctCount, totalCount, expectedPercentage, expectedPassed) => {
      const questions = Array.from({ length: totalCount }, (_, index) => ({
        answerIndex: index % 2,
      }));
      const submittedAnswers = questions.map((item, index) =>
        index < correctCount ? item.answerIndex : 1 - item.answerIndex
      );

      expect(calculateQuizResults(questions, submittedAnswers)).toEqual({
        totalQuestions: totalCount,
        correctAnswers: correctCount,
        incorrectAnswers: totalCount - correctCount,
        percentage: expectedPercentage,
        passed: expectedPassed,
      });
    }
  );

  it('handles a one-question quiz and an empty quiz without dividing by zero', () => {
    expect(calculateQuizResults([{ answerIndex: 0 }], [0])).toEqual({
      totalQuestions: 1,
      correctAnswers: 1,
      incorrectAnswers: 0,
      percentage: 100,
      passed: true,
    });
    expect(calculateQuizResults([], [])).toEqual({
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      percentage: 0,
      passed: false,
    });
  });
});
