import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimatedBackground } from './AnimatedBackground';

describe('AnimatedBackground', () => {
  it('renders decorative restrained cosmic layers', () => {
    render(<AnimatedBackground />);
    const background = screen.getByTestId('cosmic-background');
    expect(background).toHaveAttribute('aria-hidden', 'true');
    expect(background).toHaveClass('cosmic-shell');
    expect(background.querySelectorAll('[data-cosmic-layer]')).toHaveLength(3);
  });
});
