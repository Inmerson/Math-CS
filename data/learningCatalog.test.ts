import { describe, expect, it } from 'vitest';
import { ModuleType, ViewMode } from '../types';
import {
  getDefaultViewForModule,
  getLearningDestination,
  searchLearningDestinations,
} from './learningCatalog';

describe('learning catalog', () => {
  it('finds a destination by its exact mathematical topic', () => {
    const [result] = searchLearningDestinations('gaussian');

    expect(result).toMatchObject({
      module: ModuleType.MATRIX,
      view: ViewMode.GAUSSIAN,
      title: 'Gaussian Elimination',
    });
  });

  it('finds biotechnology applications through semantic keywords', () => {
    const [result] = searchLearningDestinations('population growth');

    expect(result).toMatchObject({
      module: ModuleType.DIFF_EQ,
      view: ViewMode.POPULATION_MODELS,
    });
  });

  it('normalizes case and surrounding whitespace', () => {
    const [result] = searchLearningDestinations('  TaYLoR  ');

    expect(result?.view).toBe(ViewMode.TAYLOR);
  });

  it('returns no results for an empty query', () => {
    expect(searchLearningDestinations('   ')).toEqual([]);
  });

  it('provides a stable default view for each learning module', () => {
    expect(getDefaultViewForModule(ModuleType.INTEGRALS)).toBe(ViewMode.INTEGRAL_BASICS);
    expect(getDefaultViewForModule(ModuleType.EXAMS)).toBe(ViewMode.FULL_EXAM);
  });

  it('resolves a persisted destination back to catalog metadata', () => {
    expect(
      getLearningDestination({
        module: ModuleType.DERIVATIVES,
        view: ViewMode.FUNCTION_ANALYSIS,
      }),
    ).toMatchObject({
      moduleTitle: 'Derivatives',
      title: 'Curve Analysis',
    });
  });
});
