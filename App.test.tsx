import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { COURSES } from './data/courseCatalog';
import { createDefaultMathCsState, MATH_CS_STORAGE_PREFIX } from './utils/mathCsStorage';
import { markTopicComplete } from './utils/progress';

describe('Math-CS app shell', () => {
  beforeEach(() => localStorage.clear());

  it('provides an accessible notebook shell', () => {
    render(<App />);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open Math I' })).toBeVisible();
    expect(document.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('derives and passes overall progress from stored course completion', () => {
    const seeded = COURSES[0].topics.slice(0, 4).reduce(
      (state, topic) => markTopicComplete(state, topic.id),
      createDefaultMathCsState(),
    );
    localStorage.setItem(`${MATH_CS_STORAGE_PREFIX}state`, JSON.stringify(seeded));
    render(<App />);
    expect(screen.getByRole('img', { name: 'Overall progress: 24%' })).toBeInTheDocument();
  });
});
