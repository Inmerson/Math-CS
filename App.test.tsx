import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
describe('Math-CS app shell', () => { beforeEach(() => localStorage.clear()); it('provides an accessible notebook shell', () => { render(<App />); expect(screen.getAllByRole('main')).toHaveLength(1); expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1); expect(screen.getByLabelText('Primary navigation')).toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Open Math I' })).toBeVisible(); expect(document.querySelector('[aria-hidden="true"]')).not.toBeNull(); }); });
