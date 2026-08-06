import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mathAnalysisCourse } from '../../data/courses/mathAnalysis';
import { CourseCard } from './CourseCard';

describe('CourseCard', () => {
  it('uses a stable course accent and preserves progress/recommendation navigation', () => {
    const onNavigate = vi.fn();
    render(
      <CourseCard
        course={mathAnalysisCourse}
        progress={50}
        completedCount={4}
        recommendedTopic={mathAnalysisCourse.topics[4]}
        latestQuiz={{
          courseId: 'math-analysis',
          topicId: 'continuity',
          score: 4,
          total: 5,
          percentage: 80,
          completedAt: '2026-08-06T00:00:00.000Z',
        }}
        onNavigate={onNavigate}
      />,
    );
    expect(screen.getByTestId('course-card')).toHaveAttribute('data-accent', 'blue');
    expect(screen.getByTestId('course-visual')).toHaveAttribute('data-course', 'math-analysis');
    expect(screen.getByRole('img', { name: 'Math I progress: 50%' })).toBeInTheDocument();
    expect(screen.getByText(mathAnalysisCourse.topics[4].title)).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open Math I' }));
    expect(onNavigate).toHaveBeenCalledWith({ section: 'course', courseId: 'math-analysis' });
  });
});
