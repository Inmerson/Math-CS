import { describe, expect, it } from 'vitest';
import { mathAnalysisCourse } from '../data/courses/mathAnalysis';
import { createDefaultMathCsState } from './mathCsStorage';
import { getCourseProgress, getRecommendedTopic, markTopicComplete, recordQuizResult } from './progress';

describe('Math-CS progress', () => {
  it('calculates completion percentage', () => {
    const emptyState = createDefaultMathCsState();
    expect(getCourseProgress(emptyState, mathAnalysisCourse)).toBe(0);
    const stateWithFour = mathAnalysisCourse.topics.slice(0, 4)
      .reduce((state, topic) => markTopicComplete(state, topic.id), emptyState);
    expect(getCourseProgress(stateWithFour, mathAnalysisCourse)).toBe(50);
  });

  it('records deterministic quiz percentages and preserves the best result', () => {
    const emptyState = createDefaultMathCsState();
    const first = recordQuizResult(emptyState, 'math-analysis', 'limits', 4, 5, '2026-08-01T00:00:00.000Z');
    expect(first.quizResults[0].percentage).toBe(80);
    const lower = recordQuizResult(first, 'math-analysis', 'limits', 2, 5, '2026-08-02T00:00:00.000Z');
    expect(lower.quizResults[0].percentage).toBe(80);
    expect(lower.quizResults[0].completedAt).toBe('2026-08-02T00:00:00.000Z');
  });

  it('recommends the next prerequisite-ready topic', () => {
    const state = markTopicComplete(createDefaultMathCsState(), 'functions-graphs');
    expect(getRecommendedTopic(state, mathAnalysisCourse)?.id).toBe('sequences');
  });
});
