import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CosmicProgressRing } from './CosmicProgressRing';

describe('CosmicProgressRing', () => {
  it('clamps the percentage and exposes an accessible label', () => {
    render(<CosmicProgressRing value={142} label="Overall progress" />);
    expect(screen.getByRole('img', { name: 'Overall progress: 100%' })).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
