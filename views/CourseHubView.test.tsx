import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { markTopicComplete } from '../utils/progress';
import { createDefaultMathCsState } from '../utils/mathCsStorage';
import { CourseHubView } from './CourseHubView';

describe('CourseHubView', () => {
  it('derives progress, recommendation, and course accent from state', () => {
    const state = markTopicComplete(createDefaultMathCsState(), 'functions-graphs');
    render(<CourseHubView courseId="math-analysis" state={state} onNavigate={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Mathematical Analysis' })).toBeInTheDocument();
    expect(screen.getByText('13% complete')).toBeInTheDocument();
    expect(screen.getByText('Next: Sequences')).toBeInTheDocument();
    expect(screen.getByTestId('course-hub-shell')).toHaveAttribute('data-accent', 'blue');
  });
});
