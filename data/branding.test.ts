import { describe, expect, it } from 'vitest';
import {
  BRAND_DESCRIPTION,
  BRAND_FULL_NAME,
  BRAND_NAME,
  BRAND_SHORT_NAME,
  BRAND_TAGLINE,
} from './branding';

describe('Math-CS branding', () => {
  it('uses the approved identity', () => {
    expect(BRAND_NAME).toBe('Inmerson Math-CS');
    expect(BRAND_TAGLINE).toBe('Interactive Mathematics for Computer Science');
    expect(BRAND_FULL_NAME).toBe('Inmerson Math-CS • Interactive Mathematics for Computer Science');
    expect(BRAND_SHORT_NAME).toBe('Math-CS');
    expect(BRAND_DESCRIPTION).toContain('Mathematical Analysis');
    expect(BRAND_DESCRIPTION).toContain('Linear Algebra');
    expect(BRAND_DESCRIPTION).not.toMatch(/biotech|biology|DNA/i);
  });
});
