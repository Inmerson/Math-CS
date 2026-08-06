import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('shows the approved navigation, active state, and real overall progress', () => {
    render(
      <Sidebar
        destination={{ section: 'dashboard' }}
        onNavigate={vi.fn()}
        isOpen
        onClose={vi.fn()}
        overallProgress={42}
      />,
    );
    expect(screen.getByText('Inmerson')).toBeInTheDocument();
    expect(screen.getByText('Math-CS')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Overall progress: 42%' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    for (const label of ['Dashboard', 'Math I', 'Math II', 'Math Lab', 'Practice', 'Exams', 'Progress']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    }
    expect(screen.queryByText(/Differential Equations|Population Models|biotech/i)).not.toBeInTheDocument();
  });
});
