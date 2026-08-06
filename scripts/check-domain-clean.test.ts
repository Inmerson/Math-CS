import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
describe('domain cleanliness gate',()=>{it('constructs forbidden terms without embedding them literally in the scanner',()=>{const source=readFileSync('scripts/check-domain-clean.mjs','utf8');expect(source).toContain("['bio','tech'].join('')");expect(source).toContain("['d','n','a'].join('')");});});
