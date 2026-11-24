import { describe, expect, it } from 'vitest';
import {
  parseQuestionData,
  validateQuestionData,
} from '../src/utils/questionValidation.js';

const validQuestion = {
  id: 1,
  question: 'Choose a correct value.',
  options: ['first', 'second'],
  answerIndex: 0,
};

const validData = {
  title: 'Test questions',
  questions: [validQuestion],
};

describe('parseQuestionData', () => {
  it('parses valid JSON and returns normalized question data', () => {
    expect(parseQuestionData(JSON.stringify(validData))).toEqual({
      title: 'Test questions',
      questions: [validQuestion],
      skippedCount: 0,
    });
  });

  it('rejects an empty file and invalid JSON', () => {
    expect(() => parseQuestionData('  ')).toThrow(/file is empty/i);
    expect(() => parseQuestionData('{not json')).toThrow(/invalid JSON/i);
  });
});

describe('validateQuestionData', () => {
  it('rejects a missing questions array and an empty questions array', () => {
    expect(() => validateQuestionData({ title: 'Missing list' })).toThrow(
      /questions array/i
    );
    expect(() =>
      validateQuestionData({ title: 'Empty list', questions: [] })
    ).toThrow(/array is empty/i);
  });

  it('skips malformed questions and duplicate ids while preserving valid ones', () => {
    const result = validateQuestionData({
      title: 'Mixed questions',
      questions: [
        validQuestion,
        { ...validQuestion, id: 2, options: undefined },
        { ...validQuestion, question: 'Duplicate id' },
      ],
    });

    expect(result.questions).toHaveLength(1);
    expect(result.skippedCount).toBe(2);
  });

  it('rejects invalid answer indexes and question sets with no valid questions', () => {
    expect(() =>
      validateQuestionData({
        title: 'Bad answer',
        questions: [{ ...validQuestion, answerIndex: 2 }],
      })
    ).toThrow(/no valid questions remain/i);
  });

  it('supports up to 50 valid questions and rejects more', () => {
    const questions = Array.from({ length: 50 }, (_, index) => ({
      ...validQuestion,
      id: index + 1,
    }));

    expect(
      validateQuestionData({ title: 'Fifty', questions }).questions
    ).toHaveLength(50);
    expect(() =>
      validateQuestionData({
        title: 'Fifty-one',
        questions: [...questions, { ...validQuestion, id: 51 }],
      })
    ).toThrow(/maximum supported is 50/i);
  });

  it('rejects option arrays outside the two-to-six item range', () => {
    expect(() =>
      validateQuestionData({
        title: 'Too few options',
        questions: [{ ...validQuestion, options: ['only one'] }],
      })
    ).toThrow(/no valid questions remain/i);
    expect(() =>
      validateQuestionData({
        title: 'Too many options',
        questions: [
          { ...validQuestion, options: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] },
        ],
      })
    ).toThrow(/no valid questions remain/i);
  });
});
