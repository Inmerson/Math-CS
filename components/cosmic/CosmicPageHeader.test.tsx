import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CosmicPageHeader } from './CosmicPageHeader';

describe('CosmicPageHeader', () => {
  it('preserves heading hierarchy and exposes the visual accent', () => {
    render(<CosmicPageHeader title="Practice" eyebrow="Guided work" accent="violet" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument();
    expect(screen.getByText('Guided work')).toBeInTheDocument();
    expect(screen.getByTestId('cosmic-page-header')).toHaveAttribute('data-accent', 'violet');
  });
});
