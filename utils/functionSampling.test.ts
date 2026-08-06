import { describe, expect, it } from 'vitest';
import { getFunctionPreset, samplePreset } from './functionSampling';
describe('bounded function sampling', () => {
  it('samples curriculum presets and preserves gaps', () => {
    const quadratic = getFunctionPreset('functions-graphs')!;
    expect(samplePreset(quadratic, { a: 1, b: 0, c: 0 }, 3).map((p) => p.y)).toEqual([25, 0, 25]);
    const limit = samplePreset(getFunctionPreset('limits')!, {}, 161);
    expect(limit.some((point) => point.y === null)).toBe(true);
  });
  it('provides tangent and Taylor comparison data', () => {
    expect(samplePreset(getFunctionPreset('derivatives')!, { a: 1 }, 3).every((p) => p.approximation !== undefined)).toBe(true);
    expect(samplePreset(getFunctionPreset('taylor-series')!, {}, 5)[2].approximation).toBeCloseTo(1);
  });
});
