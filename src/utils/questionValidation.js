const MAX_QUESTIONS = 50;

const QUESTION_REQUIREMENTS =
  'Each question needs a unique positive integer id, non-empty question text, 2–6 non-empty options, and a valid zero-based answerIndex.';

export function parseQuestionData(content) {
  if (typeof content !== 'string' || content.trim() === '') {
    throw new Error(
      'The questions file is empty. Add valid JSON with a title and questions array.'
    );
  }

  let data;
  try {
    data = JSON.parse(content);
  } catch {
    throw new Error(
      'The questions file contains invalid JSON. Check its syntax.'
    );
  }

  return validateQuestionData(data);
}

export function validateQuestionData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The questions file must contain a JSON object.');
  }

  if (typeof data.title !== 'string' || data.title.trim() === '') {
    throw new Error('The questions file must include a non-empty title.');
  }

  if (!Array.isArray(data.questions)) {
    throw new Error('The questions file must include a questions array.');
  }

  if (data.questions.length === 0) {
    throw new Error('The questions array is empty. Add at least one question.');
  }

  const ids = new Set();
  const questions = [];
  let skippedCount = 0;

  for (const candidate of data.questions) {
    if (!isValidQuestion(candidate) || ids.has(candidate.id)) {
      skippedCount += 1;
      continue;
    }

    ids.add(candidate.id);
    questions.push({
      id: candidate.id,
      question: candidate.question.trim(),
      options: candidate.options.map((option) => option.trim()),
      answerIndex: candidate.answerIndex,
    });
  }

  if (questions.length === 0) {
    throw new Error(
      `No valid questions remain. ${QUESTION_REQUIREMENTS}`
    );
  }

  if (questions.length > MAX_QUESTIONS) {
    throw new Error(
      `The questions file contains ${questions.length} valid questions; the maximum supported is ${MAX_QUESTIONS}.`
    );
  }

  return {
    title: data.title.trim(),
    questions,
    skippedCount,
  };
}

function isValidQuestion(question) {
  return (
    question !== null &&
    typeof question === 'object' &&
    !Array.isArray(question) &&
    Number.isInteger(question.id) &&
    question.id > 0 &&
    typeof question.question === 'string' &&
    question.question.trim() !== '' &&
    Array.isArray(question.options) &&
    question.options.length >= 2 &&
    question.options.length <= 6 &&
    question.options.every(
      (option) => typeof option === 'string' && option.trim() !== ''
    ) &&
    Number.isInteger(question.answerIndex) &&
    question.answerIndex >= 0 &&
    question.answerIndex < question.options.length
  );
}
