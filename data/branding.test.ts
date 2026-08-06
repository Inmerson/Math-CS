import { describe, expect, it } from 'vitest';
import {
  BRAND_DESCRIPTION,
  BRAND_FULL_NAME,
  BRAND_NAME,
  BRAND_SHORT_NAME,
  BRAND_TAGLINE,
} from './branding';

describe('personal branding', () => {
  it('uses the approved Inmerson identity', () => {
    expect(BRAND_NAME).toBe('Inmerson');
    expect(BRAND_TAGLINE).toBe('Personal Math & Biotech Lab');
    expect(BRAND_FULL_NAME).toBe('Inmerson • Personal Math & Biotech Lab');
    expect(BRAND_SHORT_NAME).toBe('Inmerson Lab');
  });

  it('contains no university attribution', () => {
    const branding = [
      BRAND_NAME,
      BRAND_TAGLINE,
      BRAND_FULL_NAME,
      BRAND_SHORT_NAME,
      BRAND_DESCRIPTION,
    ].join(' ');

    expect(branding).not.toContain('Warsaw University of Life Sciences');
    expect(branding).not.toContain('SGGW');
  });
});
