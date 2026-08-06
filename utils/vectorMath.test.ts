import { describe, expect, it } from 'vitest';
import { applyMatrix2, dot, lineFromPointDirection, magnitude, normalize, planeFromPointNormal } from './vectorMath';
describe('vector mathematics', () => {
  it('calculates vectors and transformations', () => { expect(dot([1,2],[3,4])).toEqual({ ok: true, value: 11 }); expect(magnitude([3,4])).toEqual({ ok: true, value: 5 }); expect(applyMatrix2([[0,-1],[1,0]],[2,1])).toEqual({ ok: true, value: [-1,2] }); });
  it('rejects undefined directions and builds equations', () => { expect(normalize([0,0])).toEqual({ ok: false, error: 'The zero vector has no direction' }); expect(lineFromPointDirection([1,2],[3,4])).toEqual({ ok: true, value: '(x,y)=(1,2)+t(3,4)' }); expect(planeFromPointNormal([1,2,3],[0,0,1])).toEqual({ ok: true, value: '0(x-1)+0(y-2)+1(z-3)=0' }); });
});
