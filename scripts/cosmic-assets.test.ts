import { describe, expect, it } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

describe('cosmic visual assets', () => {
  it('ships an optimized dashboard black-hole hero', () => {
    const assetPath = resolve(process.cwd(), 'public/assets/cosmic/black-hole-hero.webp');
    expect(existsSync(assetPath)).toBe(true);
    expect(statSync(assetPath).size).toBeLessThanOrEqual(900_000);
  });
});
