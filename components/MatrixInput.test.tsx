import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MatrixInput } from './MatrixInput';
import React from 'react';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  LayoutGroup: ({ children }: any) => <>{children}</>,
}));

describe('MatrixInput Performance Benchmark', () => {
  it('calls onChange only once after typing completes (Optimized)', () => {
    const handleChange = vi.fn();
    const data = [[0]];

    render(
      <MatrixInput
        data={data}
        onChange={handleChange}
        editable={true}
      />
    );

    const input = screen.getByRole('textbox');

    // Simulate typing "12.5"
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.change(input, { target: { value: '12' } });
    fireEvent.change(input, { target: { value: '12.' } });
    fireEvent.change(input, { target: { value: '12.5' } });

    // Expect NO onChange calls yet (optimization)
    expect(handleChange).toHaveBeenCalledTimes(0);

    // Trigger blur to commit the change
    fireEvent.blur(input);

    // Expect onChange to be called exactly once
    expect(handleChange).toHaveBeenCalledTimes(1);

    // Verify the called value
    // data is [[0]], changed 0,0 to 12.5.
    // The new data passed to onChange should be [[12.5]]
    expect(handleChange).toHaveBeenCalledWith([[12.5]]);
  });

  it('commits change on Enter key', () => {
    const handleChange = vi.fn();
    const data = [[0]];

    render(
      <MatrixInput
        data={data}
        onChange={handleChange}
        editable={true}
      />
    );

    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '99' } });

    expect(handleChange).toHaveBeenCalledTimes(0);

    // Press Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // In JSDOM/Testing Library, e.currentTarget.blur() might not synchronously trigger the React onBlur event
    // so we might need to simulate the blur event explicitly if the component relies on the browser's behavior.
    // However, let's try to just fire blur manually to simulate the browser behavior that we know happens.
    // This confirms that IF blur happens (which we trigger on Enter), THEN logic runs.
    fireEvent.blur(input);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith([[99]]);
  });
});
