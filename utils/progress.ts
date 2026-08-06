import { CourseDefinition, CourseId, TopicId } from '../domain/curriculum';
import { MathCsState, SavedFormula } from './mathCsStorage';

export const markTopicComplete = (state: MathCsState, topicId: TopicId): MathCsState => ({
  ...state,
  completedTopicIds: [...new Set([...state.completedTopicIds, topicId])],
});

export const recordQuizResult = (
  state: MathCsState,
  courseId: CourseId,
  topicId: TopicId,
  score: number,
  total: number,
  completedAt = new Date().toISOString(),
): MathCsState => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const existing = state.quizResults.find((result) => result.courseId === courseId && result.topicId === topicId);
  const best = existing && existing.percentage > percentage
    ? { ...existing, completedAt }
    : { courseId, topicId, score, total, percentage, completedAt };
  return {
    ...state,
    quizResults: [
      ...state.quizResults.filter((result) => result.courseId !== courseId || result.topicId !== topicId),
      best,
    ],
  };
};

export const saveFormula = (state: MathCsState, formula: SavedFormula): MathCsState => ({
  ...state,
  savedFormulas: [
    ...state.savedFormulas.filter((item) => item.formulaId !== formula.formulaId),
    formula,
  ],
});

export const removeFormula = (state: MathCsState, formulaId: string): MathCsState => ({
  ...state,
  savedFormulas: state.savedFormulas.filter((formula) => formula.formulaId !== formulaId),
});

export const saveFormulaNote = (state: MathCsState, formulaId: string, note: string): MathCsState => ({
  ...state,
  savedFormulas: state.savedFormulas.map((formula) => formula.formulaId === formulaId ? { ...formula, note } : formula),
});

export const getCourseProgress = (state: MathCsState, course: CourseDefinition): number => {
  if (course.topics.length === 0) return 0;
  const completed = course.topics.filter((topic) => state.completedTopicIds.includes(topic.id)).length;
  return Math.round((completed / course.topics.length) * 100);
};

export const getRecommendedTopic = (state: MathCsState, course: CourseDefinition) =>
  course.topics.find((topic) => !state.completedTopicIds.includes(topic.id)
    && topic.prerequisites.every((prerequisite) => state.completedTopicIds.includes(prerequisite)))
  ?? course.topics.find((topic) => !state.completedTopicIds.includes(topic.id));
