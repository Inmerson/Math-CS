import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIChatView } from '../AIChatView';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AIChatView performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('does not reread localStorage when the user types a message', () => {
    render(<AIChatView />);

    const initialCalls = localStorageMock.getItem.mock.calls.length;
    expect(initialCalls).toBeGreaterThan(0);

    const input = screen.getByRole('textbox', {
      name: /ask a math question/i,
    });
    fireEvent.change(input, { target: { value: 'test' } });

    expect(localStorageMock.getItem.mock.calls.length).toBe(initialCalls);
  });
});
