import { beforeEach, describe, expect, it } from 'vitest';
import {
  MATH_CS_STORAGE_PREFIX,
  clearMathCsState,
  createDefaultMathCsState,
  loadMathCsState,
  saveMathCsState,
} from './mathCsStorage';

describe('Math-CS storage', () => {
  beforeEach(() => localStorage.clear());

  it('recovers from malformed JSON and ignores legacy keys', () => {
    localStorage.setItem('math-cs:v1:state', '{broken');
    localStorage.setItem('app_module', 'DIFF_EQ');
    expect(loadMathCsState()).toEqual(createDefaultMathCsState());
  });

  it('writes only to the versioned Math-CS state key', () => {
    saveMathCsState(createDefaultMathCsState());
    expect(MATH_CS_STORAGE_PREFIX).toBe('math-cs:v1:');
    expect(localStorage.getItem('math-cs:v1:state')).not.toBeNull();
    expect(localStorage.getItem('app_module')).toBeNull();
    clearMathCsState();
    expect(localStorage.getItem('math-cs:v1:state')).toBeNull();
  });
});
