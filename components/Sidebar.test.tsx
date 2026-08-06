import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar } from './Sidebar';
import { ModuleType, ViewMode } from '../types';

describe('Sidebar desktop visibility', () => {
  it('applies the desktop visibility override to the animated sidebar', () => {
    const { container } = render(
      <Sidebar
        currentView={ViewMode.BASICS}
        currentModule={ModuleType.MATRIX}
        setView={() => undefined}
        goHome={() => undefined}
        isOpen={false}
        toggleSidebar={() => undefined}
      />,
    );

    expect(container.querySelector('.framer-motion-sidebar')).toBeInTheDocument();
  });
});
