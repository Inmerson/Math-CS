import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BottomNavigation } from './BottomNavigation';

describe('BottomNavigation', () => {
  it('exposes compact destinations and active state', () => {
    render(<BottomNavigation destination={{ section: 'course', courseId: 'math-analysis' }} onNavigate={vi.fn()} />);
    for (const label of ['Dashboard', 'Math I', 'Math II', 'Lab']) expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More navigation options' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Math I' })).toHaveAttribute('aria-current', 'page');
  });
});
