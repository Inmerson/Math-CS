import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createDefaultMathCsState } from '../utils/mathCsStorage';
import { DashboardView } from './DashboardView';

describe('DashboardView', () => {
  it('composes the cinematic hero, search, courses, and learning tools', () => {
    const onNavigate = vi.fn();
    render(<DashboardView state={createDefaultMathCsState()} onNavigate={onNavigate} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Inmerson Math-CS' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search course topics' })).toBeInTheDocument();
    expect(screen.getAllByTestId('course-card')).toHaveLength(2);
    expect(screen.getByText('Analiza matematyczna')).toBeInTheDocument();
    expect(screen.getByText('Algebra liniowa i geometria')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Math Lab/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Formula Workspace/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Math Lab/i }));
    expect(onNavigate).toHaveBeenCalledWith({ section: 'math-lab' });
  });
});
