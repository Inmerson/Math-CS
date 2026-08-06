import { PracticeQuestion, QuizDefinition } from '../domain/curriculum';

export interface QuestionGrade {
  questionId: string;
  correct: boolean;
  earned: number;
  possible: number;
  feedback: string;
}

export interface QuizGrade {
  outcomes: QuestionGrade[];
  score: number;
  total: number;
  percentage: number;
}

const numeric = (value: unknown): number | null => {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : null;
};

const numericArray = (value: unknown): number[] | null => {
  if (Array.isArray(value)) {
    const result = value.map(numeric);
    return result.every((item): item is number => item !== null) ? result : null;
  }
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\[\]()]/g, ' ').trim();
  if (!cleaned) return null;
  const result = cleaned.split(/[ ,;]+/).filter(Boolean).map(numeric);
  return result.every((item): item is number => item !== null) ? result : null;
};

const numericMatrix = (value: unknown): number[][] | null => {
  if (Array.isArray(value) && value.every(Array.isArray)) {
    const rows = value.map(numericArray);
    return rows.every((row): row is number[] => row !== null) ? rows : null;
  }
  if (typeof value !== 'string') return null;
  const rows = value.trim().split(/\n|;/).filter(Boolean).map(numericArray);
  return rows.length && rows.every((row): row is number[] => row !== null) ? rows : null;
};

const close = (a: number, b: number, tolerance: number) => Math.abs(a - b) <= tolerance + Number.EPSILON * 10;
const compareVector = (actual: number[] | null, expected: number[], tolerance: number) =>
  actual !== null && actual.length === expected.length && actual.every((value, index) => close(value, expected[index], tolerance));
const compareMatrix = (actual: number[][] | null, expected: number[][], tolerance: number) =>
  actual !== null && actual.length === expected.length && actual.every((row, rowIndex) => compareVector(row, expected[rowIndex], tolerance));

export const gradeQuestion = (question: PracticeQuestion, response: unknown): QuestionGrade => {
  const tolerance = question.tolerance ?? 0.001;
  let correct = false;
  if (question.kind === 'multiple-choice') correct = typeof response === 'string' && response === question.answer;
  if (question.kind === 'numeric') {
    const actual = numeric(response);
    correct = actual !== null && typeof question.answer === 'number' && close(actual, question.answer, tolerance);
  }
  if (question.kind === 'ordered-steps') {
    const actual = Array.isArray(response) ? response.map(String) : typeof response === 'string' ? response.split(/\s*>\s*/).filter(Boolean) : [];
    const expected = Array.isArray(question.answer) ? question.answer.map(String) : [];
    correct = actual.length === expected.length && actual.every((step, index) => step === expected[index]);
  }
  if (question.kind === 'vector') correct = Array.isArray(question.answer) && !Array.isArray(question.answer[0]) && compareVector(numericArray(response), question.answer as number[], tolerance);
  if (question.kind === 'matrix') correct = Array.isArray(question.answer) && Array.isArray(question.answer[0]) && compareMatrix(numericMatrix(response), question.answer as number[][], tolerance);
  return { questionId: question.id, correct, earned: correct ? 1 : 0, possible: 1, feedback: correct ? 'Correct.' : question.explanation };
};

export const gradeQuiz = (quiz: QuizDefinition, responses: Record<string, unknown>): QuizGrade => {
  const outcomes = quiz.questions.map((question) => gradeQuestion(question, responses[question.id]));
  const score = outcomes.reduce((sum, outcome) => sum + outcome.earned, 0);
  const total = outcomes.reduce((sum, outcome) => sum + outcome.possible, 0);
  return { outcomes, score, total, percentage: total ? Math.round((score / total) * 100) : 0 };
};
