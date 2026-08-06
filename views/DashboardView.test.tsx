import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createDefaultMathCsState } from '../utils/mathCsStorage';
import { DashboardView } from './DashboardView';
describe('DashboardView', () => { it('shows exactly two approved courses and official titles', () => { render(<DashboardView state={createDefaultMathCsState()} onNavigate={vi.fn()} />); expect(screen.getAllByTestId('course-card')).toHaveLength(2); expect(screen.getByText('Analiza matematyczna')).toBeInTheDocument(); expect(screen.getByText('Algebra liniowa i geometria')).toBeInTheDocument(); expect(screen.getAllByText('0%').length).toBeGreaterThanOrEqual(2); }); });
