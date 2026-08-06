import { CourseId, TopicId } from '../domain/curriculum';

export const MATH_CS_STORAGE_PREFIX = 'math-cs:v1:';
const STATE_KEY = `${MATH_CS_STORAGE_PREFIX}state`;

export interface QuizResult {
  courseId: CourseId;
  topicId: TopicId;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

export interface SavedFormula {
  formulaId: string;
  courseId: CourseId;
  topicId: TopicId;
  note: string;
}

export interface MathCsState {
  version: 1;
  completedTopicIds: TopicId[];
  lastDestination: { section: string; courseId?: CourseId; topicId?: TopicId } | null;
  quizResults: QuizResult[];
  savedFormulas: SavedFormula[];
}

export const createDefaultMathCsState = (): MathCsState => ({
  version: 1,
  completedTopicIds: [],
  lastDestination: null,
  quizResults: [],
  savedFormulas: [],
});

const normalizeState = (value: unknown): MathCsState => {
  if (!value || typeof value !== 'object') return createDefaultMathCsState();
  const candidate = value as Partial<MathCsState>;
  if (candidate.version !== 1) return createDefaultMathCsState();
  return {
    version: 1,
    completedTopicIds: [...new Set(Array.isArray(candidate.completedTopicIds) ? candidate.completedTopicIds : [])],
    lastDestination: candidate.lastDestination && typeof candidate.lastDestination.section === 'string'
      ? candidate.lastDestination
      : null,
    quizResults: Array.isArray(candidate.quizResults) ? candidate.quizResults.filter((item): item is QuizResult => Boolean(item && item.courseId && item.topicId)) : [],
    savedFormulas: Array.isArray(candidate.savedFormulas)
      ? Array.from(new Map(candidate.savedFormulas.filter(Boolean).map((item) => [item.formulaId, item])).values())
      : [],
  };
};

export const loadMathCsState = (): MathCsState => {
  if (typeof localStorage === 'undefined') return createDefaultMathCsState();
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? normalizeState(JSON.parse(raw)) : createDefaultMathCsState();
  } catch {
    return createDefaultMathCsState();
  }
};

export const saveMathCsState = (state: MathCsState): void => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STATE_KEY, JSON.stringify(normalizeState(state)));
};

export const clearMathCsState = (): void => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(STATE_KEY);
};
