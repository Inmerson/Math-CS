import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CosmicHero } from './CosmicHero';

describe('CosmicHero', () => {
  it('renders a readable cinematic header with a decorative Pages-aware image', () => {
    render(
      <CosmicHero
        title="Inmerson Math-CS"
        tagline="Interactive Mathematics for Computer Science"
        description="Academic workspace"
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Inmerson Math-CS' })).toBeInTheDocument();
    expect(screen.getByText('Interactive Mathematics for Computer Science')).toBeInTheDocument();
    expect(screen.getByTestId('black-hole-hero')).toHaveClass('cosmic-hero-fallback');
    const image = screen.getByTestId('black-hole-image');
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('src', expect.stringContaining('assets/cosmic/black-hole-hero.webp'));
  });
});
