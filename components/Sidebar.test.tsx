import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('shows the approved navigation and excludes old domains', () => {
    render(<Sidebar destination={{ section: 'dashboard' }} onNavigate={vi.fn()} isOpen onClose={vi.fn()} />);
    for (const label of ['Dashboard', 'Math I', 'Math II', 'Math Lab', 'Practice', 'Exams', 'Progress']) expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    expect(screen.queryByText(/Differential Equations|Population Models|biotech/i)).not.toBeInTheDocument();
  });
});
