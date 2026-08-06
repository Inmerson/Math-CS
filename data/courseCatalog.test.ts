import { describe, expect, it } from 'vitest';
import { COURSES, getTopic, searchTopics } from './courseCatalog';

describe('Math-CS course catalog', () => {
  it('contains exactly the two approved courses and complete topic paths', () => {
    expect(COURSES.map((course) => course.id)).toEqual([
      'math-analysis',
      'linear-algebra-geometry',
    ]);
    expect(COURSES.every((course) => course.topics.length >= 8)).toBe(true);
    expect(getTopic('math-analysis', 'limits')?.title).toBe('Limits');
    expect(getTopic('linear-algebra-geometry', 'matrices')?.title).toBe('Matrices and Matrix Operations');
  });

  it('contains complete learning material and no excluded domains', () => {
    for (const course of COURSES) {
      for (const topic of course.topics) {
        expect(topic.learningObjectives.length).toBeGreaterThan(0);
        expect(topic.sections.length).toBeGreaterThan(0);
        expect(topic.workedExamples.length).toBeGreaterThan(0);
        expect(topic.csConnections.length).toBeGreaterThan(0);
        expect(topic.practiceQuestions.length).toBeGreaterThanOrEqual(2);
        expect(topic.quiz.questions.length).toBeGreaterThanOrEqual(3);
      }
    }
    expect(JSON.stringify(COURSES)).not.toMatch(/biotech|biology|DNA|population|radioactive|discrete mathematics/i);
  });

  it('searches topics without accents or mutation', () => {
    expect(searchTopics('eigen', 5)[0]?.topic.id).toBe('eigenvalues-eigenvectors');
    expect(searchTopics('analiza', 5).length).toBeGreaterThan(0);
    expect(COURSES[0].id).toBe('math-analysis');
  });
});
